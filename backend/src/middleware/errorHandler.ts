import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';
import config from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false);
  }

  const apiError = error as ApiError;

  if (!apiError.isOperational) {
    logger.error('Unexpected error:', {
      error: apiError,
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        user: (req as any).user?.id,
      },
    });
  }

  const response = {
    success: false,
    message: apiError.message,
    ...(apiError.errors && { errors: apiError.errors }),
    ...(config.isDevelopment && { stack: apiError.stack }),
  };

  res.status(apiError.statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.url}`));
};