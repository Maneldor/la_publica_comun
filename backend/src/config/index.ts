import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple config without zod for now
const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (name: string, defaultValue?: number): number => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

const config = {
  env: getEnvVar('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 5000),
  apiVersion: getEnvVar('API_VERSION', 'v1'),
  
  database: {
    url: getEnvVar('DATABASE_URL'),
  },
  
  redis: {
    url: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
  },
  
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  
  email: {
    smtp: {
      host: getEnvVar('SMTP_HOST'),
      port: getEnvNumber('SMTP_PORT'),
      auth: {
        user: getEnvVar('SMTP_USER'),
        pass: getEnvVar('SMTP_PASS'),
      },
    },
    from: getEnvVar('EMAIL_FROM'),
  },
  
  uploads: {
    dir: getEnvVar('UPLOAD_DIR', 'uploads'),
    maxFileSize: getEnvNumber('MAX_FILE_SIZE', 5242880),
  },
  
  rateLimit: {
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
    max: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  },
  
  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
  },
  
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
  },
  
  ai: {
    openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
  },
  
  analytics: {
    retentionDays: getEnvNumber('ANALYTICS_RETENTION_DAYS', 90),
  },
  
  isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
  isTest: getEnvVar('NODE_ENV', 'development') === 'test',
};

export type Config = typeof config;

export default config;