import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenFamily?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface FilterQuery {
  search?: string;
  status?: string;
  category?: string;
  community?: string;
  province?: string;
  dateFrom?: Date;
  dateTo?: Date;
}