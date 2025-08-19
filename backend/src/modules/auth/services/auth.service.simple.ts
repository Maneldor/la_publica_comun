import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../../utils/ApiError';

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(user: { id: string; email: string; role: string }) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const refreshToken = jwt.sign(
      { ...payload, tokenFamily: crypto.randomUUID() }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
  }

  async register(userData: {
    email: string;
    password: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    community?: string;
    companyName?: string;
    cif?: string;
    sector?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'EMPLEADO_PUBLICO',
        isEmailVerified: true, // Simplified for development
      },
    });

    // Create profile based on role
    if (userData.role === 'EMPRESA' && userData.companyName) {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: userData.companyName,
          email: userData.email,
          cif: userData.cif || `CIF-${Date.now()}`,
          sector: userData.sector || 'Tecnología',
        },
      });
    } else {
      // Create employee profile
      await prisma.employee.create({
        data: {
          userId: user.id,
          firstName: userData.firstName || 'Usuario',
          lastName: userData.lastName || 'Test',
          community: userData.community || 'MADRID',
        },
      });
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: true,
        company: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Update refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        refreshToken: tokens.refreshToken,
        lastLogin: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee: user.employee,
        company: user.company,
      },
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      const tokens = this.generateTokens(user);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        company: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        lastLogin: true,
        createdAt: true,
        employee: true,
        company: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return { message: 'If user exists, password reset email has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // In a real app, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'Password reset email sent' };
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
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null, // Logout all devices
      },
    });

    return { message: 'Password reset successful' };
  }
}