const path = require('path');
const fs = require('fs');

// Cargar variables de entorno según el entorno
const loadEnvironmentConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = `.env.${nodeEnv}`;
  const envPath = path.join(__dirname, '../../', envFile);
  
  // Cargar .env específico del entorno si existe
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`📄 Configuración cargada desde: ${envFile}`);
  } else {
    // Fallback a .env por defecto
    require('dotenv').config();
    console.log('📄 Configuración cargada desde: .env');
  }
};

// Cargar configuración
loadEnvironmentConfig();

// Validar variables requeridas
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'DATABASE_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Variables de entorno requeridas faltantes:', missingVars.join(', '));
  process.exit(1);
}

// Configuración exportada
const config = {
  // Entorno
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3001,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Aplicación
  app: {
    name: process.env.APP_NAME || 'La Pública',
    version: process.env.APP_VERSION || '1.0.0',
    description: process.env.APP_DESCRIPTION || 'Red social para empleados públicos',
  },

  // URLs
  urls: {
    client: process.env.CLIENT_URL || 'http://localhost:3000',
    api: process.env.API_URL || 'http://localhost:3001',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  },

  // Base de datos
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'la_publica',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10
    }
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB) || 0
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
  },

  // Push Notifications
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT || 'mailto:admin@lapublica.es'
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: {
      email: process.env.FROM_EMAIL || 'noreply@lapublica.es',
      name: process.env.FROM_NAME || 'La Pública'
    }
  },

  // SSL
  ssl: {
    keyPath: process.env.SSL_KEY_PATH,
    certPath: process.env.SSL_CERT_PATH,
    forceHttps: process.env.FORCE_HTTPS === 'true'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: process.env.RATE_LIMIT_MESSAGE || 'Demasiadas solicitudes'
  },

  // File uploads
  uploads: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain'
    ],
    path: process.env.UPLOAD_PATH || './uploads'
  },

  // Logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH,
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
  },

  // Monitoring
  monitoring: {
    enabled: process.env.ENABLE_METRICS === 'true',
    port: parseInt(process.env.METRICS_PORT) || 9090,
    healthCheckPath: process.env.HEALTH_CHECK_PATH || '/health'
  },

  // External Services
  services: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    },
    sentry: {
      dsn: process.env.SENTRY_DSN
    }
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    cookie: {
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: process.env.COOKIE_SAME_SITE || 'lax',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 horas
    }
  },

  // CORS
  cors: {
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || ['Content-Type', 'Authorization']
  },

  // WebSocket
  websocket: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 30000,
    heartbeatTimeout: parseInt(process.env.WS_HEARTBEAT_TIMEOUT) || 5000
  },

  // Backup
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // 2 AM daily
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    s3: {
      bucket: process.env.BACKUP_S3_BUCKET,
      region: process.env.BACKUP_S3_REGION || 'eu-west-1'
    }
  },

  // Comunidades
  communities: {
    default: process.env.DEFAULT_COMMUNITY || 'madrid',
    configPath: process.env.COMMUNITIES_CONFIG_PATH || './config/communities.json'
  }
};

// Validaciones adicionales para producción
if (config.isProduction) {
  const productionValidations = [
    { check: config.jwt.secret.length >= 32, message: 'JWT_SECRET debe tener al menos 32 caracteres' },
    { check: config.urls.client.startsWith('https://'), message: 'CLIENT_URL debe usar HTTPS en producción' },
    { check: config.database.ssl, message: 'DB_SSL debe estar habilitado en producción' },
    { check: config.ssl.forceHttps, message: 'FORCE_HTTPS debe estar habilitado en producción' }
  ];

  const failedValidations = productionValidations.filter(v => !v.check);
  if (failedValidations.length > 0) {
    console.error('❌ Errores de configuración para producción:');
    failedValidations.forEach(v => console.error(`   - ${v.message}`));
    process.exit(1);
  }
}

console.log(`✅ Configuración cargada para entorno: ${config.env}`);

module.exports = config;