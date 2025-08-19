import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '@prisma/client';
import prisma from '../../../config/database';
import { ApiError } from '../../../utils/ApiError';
import config from '../../../config';
import { JwtPayload, RefreshTokenPayload } from '../../../types';
import logger from '../../../utils/logger';

export class AuthService {
  private generateTokens(user: { id: string; email: string; role: UserRole }) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshPayload: RefreshTokenPayload = {
      ...payload,
      tokenFamily: crypto.randomUUID(),
    };

    const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async register(userData: {
    email: string;
    password: string;
    role: UserRole;
    companyName?: string;
    cif?: string;
    sector?: string;
    firstName?: string;
    lastName?: string;
    community?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw ApiError.conflict('User already exists with this email');
    }

    // Check CIF uniqueness for companies
    if (userData.role === 'COMPANY' && userData.cif) {
      const existingCompany = await prisma.company.findUnique({
        where: { cif: userData.cif },
      });

      if (existingCompany) {
        throw ApiError.conflict('Company already registered with this CIF');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user and related profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          emailVerificationToken,
        },
      });

      // Create company profile if role is COMPANY
      if (userData.role === 'COMPANY') {
        await tx.company.create({
          data: {
            userId: newUser.id,
            name: userData.companyName!,
            cif: userData.cif!,
            sector: userData.sector!,
            email: userData.email,
          },
        });
      }

      // Create employee profile if role is EMPLOYEE
      if (userData.role === 'EMPLOYEE') {
        await tx.employee.create({
          data: {
            userId: newUser.id,
            firstName: userData.firstName!,
            lastName: userData.lastName!,
            community: userData.community as any,
          },
        });
      }

      return newUser;
    });

    // TODO: Send verification email
    logger.info(`User registered: ${user.email}`, { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      verificationToken: emailVerificationToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        employee: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw ApiError.unauthorized('Please verify your email first');
    }

    const tokens = this.generateTokens(user);

    // Update refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLogin: new Date(),
      },
    });

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profile: user.company || user.employee,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as RefreshTokenPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const newTokens = this.generateTokens(user);

      // Update refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newTokens.refreshToken },
      });

      return newTokens;
    } catch (error) {
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send password reset email
    logger.info(`Password reset requested: ${email}`, { userId: user.id });

    return {
      message: 'Password reset link sent to your email',
      resetToken, // Remove in production
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null, // Invalidate all sessions
      },
    });

    logger.info(`Password reset completed: ${user.email}`, { userId: user.id });

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    logger.info(`Email verified: ${user.email}`, { userId: user.id });

    return { message: 'Email verified successfully' };
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    logger.info('User logged out', { userId });

    return { message: 'Logged out successfully' };
  }
}