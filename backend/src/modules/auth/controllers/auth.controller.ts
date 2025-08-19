import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../../../types';
import { asyncHandler } from '../../../utils/asyncHandler';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for verification.',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshToken(refreshToken);
  
  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { tokens },
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  
  res.json({
    success: true,
    data: result,
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  
  res.json({
    success: true,
    data: result,
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await authService.verifyEmail(token);
  
  res.json({
    success: true,
    data: result,
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.logout(req.user!.id);
  
  res.json({
    success: true,
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});