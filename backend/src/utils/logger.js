const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/environment');

// Crear directorio de logs si no existe
const logDir = path.dirname(config.logging.filePath || './logs/app.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para logs
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, userId, ip, userAgent, method, url, statusCode, responseTime, stack, ...meta }) => {
    let logEntry = {
      timestamp,
      level: level.toUpperCase(),
      service: service || 'API',
      message
    };

    // Añadir contexto de usuario si está disponible
    if (userId) logEntry.userId = userId;
    if (ip) logEntry.ip = ip;
    if (userAgent) logEntry.userAgent = userAgent;

    // Añadir contexto HTTP si está disponible
    if (method) logEntry.method = method;
    if (url) logEntry.url = url;
    if (statusCode) logEntry.statusCode = statusCode;
    if (responseTime) logEntry.responseTime = `${responseTime}ms`;

    // Añadir stack trace si es un error
    if (stack) logEntry.stack = stack;

    // Añadir metadatos adicionales
    if (Object.keys(meta).length > 0) {
      logEntry.meta = meta;
    }

    return JSON.stringify(logEntry);
  })
);

// Configuración de transports
const transports = [
  // Console transport (siempre activo en desarrollo)
  new winston.transports.Console({
    level: config.isDevelopment ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, service, userId, method, url, statusCode, responseTime }) => {
        let logLine = `${timestamp} [${level}]`;
        
        if (service && service !== 'API') logLine += ` [${service}]`;
        if (userId) logLine += ` [User: ${userId}]`;
        if (method && url) logLine += ` [${method} ${url}]`;
        if (statusCode) logLine += ` [${statusCode}]`;
        if (responseTime) logLine += ` [${responseTime}ms]`;
        
        logLine += `: ${message}`;
        
        return logLine;
      })
    )
  })
];

// File transport (solo en producción o si se especifica ruta)
if (config.logging.filePath) {
  transports.push(
    new winston.transports.File({
      filename: config.logging.filePath,
      level: config.logging.level,
      format: customFormat,
      maxsize: parseSize(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
      tailable: true
    })
  );
}

// Error file transport separado
if (config.logging.filePath) {
  const errorLogPath = config.logging.filePath.replace('.log', '.error.log');
  transports.push(
    new winston.transports.File({
      filename: errorLogPath,
      level: 'error',
      format: customFormat,
      maxsize: parseSize(config.logging.maxSize),
      maxFiles: config.logging.maxFiles,
      tailable: true
    })
  );
}

// Crear logger principal
const logger = winston.createLogger({
  level: config.logging.level,
  format: customFormat,
  transports,
  // No salir en errores no manejados
  exitOnError: false
});

// Función helper para parsear tamaños
function parseSize(size) {
  const units = { k: 1024, m: 1024 * 1024, g: 1024 * 1024 * 1024 };
  const match = size.toLowerCase().match(/^(\d+)([kmg]?)$/);
  if (!match) return 10 * 1024 * 1024; // 10MB por defecto
  
  const [, num, unit] = match;
  return parseInt(num) * (units[unit] || 1);
}

// Middleware para logging de requests HTTP
const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capturar información de la request
  const requestInfo = {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  };

  // Log de request entrante
  logger.info('HTTP Request', requestInfo);

  // Interceptar el final de la response
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - start;
    
    // Log de response
    logger.info('HTTP Response', {
      ...requestInfo,
      statusCode: res.statusCode,
      responseTime,
      responseSize: Buffer.byteLength(body)
    });

    // Log específico para errores HTTP
    if (res.statusCode >= 400) {
      logger.warn('HTTP Error Response', {
        ...requestInfo,
        statusCode: res.statusCode,
        responseTime,
        errorBody: typeof body === 'string' ? body.substring(0, 500) : 'Binary data'
      });
    }

    originalSend.call(this, body);
  };

  next();
};

// Logger específico para diferentes servicios
const createServiceLogger = (serviceName) => {
  return logger.child({ service: serviceName });
};

// Loggers especializados
const loggers = {
  api: createServiceLogger('API'),
  auth: createServiceLogger('AUTH'),
  messaging: createServiceLogger('MESSAGING'),
  upload: createServiceLogger('UPLOAD'),
  push: createServiceLogger('PUSH'),
  socket: createServiceLogger('SOCKET'),
  database: createServiceLogger('DATABASE'),
  email: createServiceLogger('EMAIL'),
  scheduler: createServiceLogger('SCHEDULER'),
  security: createServiceLogger('SECURITY')
};

// Función para log de eventos de seguridad
const logSecurityEvent = (event, details = {}) => {
  loggers.security.warn(`Security Event: ${event}`, {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Función para log de eventos de autenticación
const logAuthEvent = (event, userId, details = {}) => {
  loggers.auth.info(`Auth Event: ${event}`, {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Función para log de eventos de base de datos
const logDatabaseEvent = (operation, details = {}) => {
  loggers.database.debug(`Database ${operation}`, {
    operation,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Función para log de rendimiento
const logPerformance = (operation, duration, details = {}) => {
  const level = duration > 1000 ? 'warn' : duration > 500 ? 'info' : 'debug';
  logger.log(level, `Performance: ${operation} took ${duration}ms`, {
    operation,
    duration,
    ...details
  });
};

// Manejador de errores no capturadas
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  
  // En producción, enviar alerta pero no salir inmediatamente
  if (config.isProduction) {
    setTimeout(() => process.exit(1), 1000);
  } else {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    promise: promise.toString()
  });
});

// Log de inicio de aplicación
const logAppStart = () => {
  logger.info('Application Starting', {
    env: config.env,
    port: config.port,
    nodeVersion: process.version,
    pid: process.pid,
    timestamp: new Date().toISOString()
  });
};

// Función para generar reporte de logs
const generateLogReport = async (hours = 24) => {
  if (!config.logging.filePath) {
    throw new Error('Log file path not configured');
  }

  const logFile = config.logging.filePath;
  if (!fs.existsSync(logFile)) {
    throw new Error('Log file not found');
  }

  // Leer y analizar logs de las últimas X horas
  const logs = fs.readFileSync(logFile, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(log => log && new Date(log.timestamp) > new Date(Date.now() - hours * 60 * 60 * 1000));

  // Generar estadísticas
  const stats = {
    totalLogs: logs.length,
    errorCount: logs.filter(log => log.level === 'ERROR').length,
    warnCount: logs.filter(log => log.level === 'WARN').length,
    infoCount: logs.filter(log => log.level === 'INFO').length,
    services: {},
    topErrors: {},
    performanceIssues: logs.filter(log => 
      log.message.includes('Performance') && 
      parseInt(log.message.match(/(\d+)ms/)?.[1]) > 1000
    ).length
  };

  // Contar logs por servicio
  logs.forEach(log => {
    if (log.service) {
      stats.services[log.service] = (stats.services[log.service] || 0) + 1;
    }
    
    if (log.level === 'ERROR' && log.message) {
      stats.topErrors[log.message] = (stats.topErrors[log.message] || 0) + 1;
    }
  });

  return stats;
};

module.exports = {
  logger,
  loggers,
  httpLogger,
  createServiceLogger,
  logSecurityEvent,
  logAuthEvent,
  logDatabaseEvent,
  logPerformance,
  logAppStart,
  generateLogReport
};