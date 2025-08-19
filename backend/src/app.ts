import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import { API_PREFIX } from './config/constants';
import { errorHandler, notFound } from './middleware/errorHandler';
import { basicRateLimiter } from './middleware/rateLimiter';
import routes from './routes';
import logger from './utils/logger';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(basicRateLimiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'La Pública API',
      version: '1.0.0',
      description: 'API para La Pública - Plataforma SaaS para conectar empresas con empleados públicos',
    },
    servers: [
      {
        url: `http://localhost:${config.port}${API_PREFIX}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/modules/*/controllers/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use(API_PREFIX, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'La Pública API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use('*', notFound);

// Error handler
app.use(errorHandler);

export default app;