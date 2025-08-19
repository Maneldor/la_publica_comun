const { PrismaClient } = require('@prisma/client');
const config = require('../config/environment');
const { loggers } = require('../utils/logger');

const prisma = new PrismaClient();

// Health check básico
const basicHealthCheck = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.env,
      version: config.app.version,
      uptime: Math.floor(process.uptime()),
      pid: process.pid,
      checks: {}
    };

    // Check 1: Database connectivity
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthData.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      healthData.checks.database = {
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime
      };
      healthData.status = 'degraded';
    }

    // Check 2: Memory usage
    const memUsage = process.memoryUsage();
    const memoryHealthy = memUsage.heapUsed / memUsage.heapTotal < 0.9; // < 90%
    
    healthData.checks.memory = {
      status: memoryHealthy ? 'healthy' : 'warning',
      usage: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        external: Math.round(memUsage.external / 1024 / 1024) + 'MB',
        rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB'
      },
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + '%'
    };

    if (!memoryHealthy && healthData.status === 'healthy') {
      healthData.status = 'warning';
    }

    // Check 3: Disk space (si está configurado el path de uploads)
    if (config.uploads.path) {
      try {
        const fs = require('fs');
        const stats = fs.statSync(config.uploads.path);
        healthData.checks.disk = {
          status: 'healthy',
          uploadPath: config.uploads.path,
          accessible: true
        };
      } catch (error) {
        healthData.checks.disk = {
          status: 'unhealthy',
          uploadPath: config.uploads.path,
          accessible: false,
          error: error.message
        };
        healthData.status = 'degraded';
      }
    }

    // Check 4: Recent errors (últimos 5 minutos)
    try {
      const recentErrors = await prisma.systemMetrics.findFirst({
        orderBy: { recordedAt: 'desc' }
      });
      
      healthData.checks.errors = {
        status: 'healthy',
        hasRecentMetrics: !!recentErrors
      };
    } catch (error) {
      healthData.checks.errors = {
        status: 'warning',
        message: 'No se pudieron obtener métricas recientes'
      };
    }

    // Determinar código de respuesta HTTP
    let statusCode = 200;
    if (healthData.status === 'degraded') statusCode = 503;
    else if (healthData.status === 'warning') statusCode = 200;

    healthData.responseTime = Date.now() - startTime;

    // Log del health check
    loggers.api.debug('Health check completed', {
      status: healthData.status,
      responseTime: healthData.responseTime,
      checks: Object.keys(healthData.checks).length
    });

    res.status(statusCode).json(healthData);

  } catch (error) {
    loggers.api.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
};

// Health check detallado (solo para administradores)
const detailedHealthCheck = async (req, res) => {
  const startTime = Date.now();

  try {
    const healthData = await basicHealthCheck(req, { json: () => {} });
    
    // Estadísticas detalladas de la base de datos
    const dbStats = await Promise.all([
      prisma.user.count(),
      prisma.message.count(),
      prisma.notification.count(),
      prisma.pushSubscription.count()
    ]);

    healthData.database = {
      tables: {
        users: dbStats[0],
        messages: dbStats[1],
        notifications: dbStats[2],
        pushSubscriptions: dbStats[3]
      },
      totalRecords: dbStats.reduce((sum, count) => sum + count, 0)
    };

    // Estadísticas del sistema
    const cpuUsage = process.cpuUsage();
    healthData.system = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      cpuUsage: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      loadAverage: require('os').loadavg()
    };

    // Conexiones activas (si Socket.io está disponible)
    if (global.io) {
      healthData.websocket = {
        connectedClients: global.io.engine.clientsCount || 0,
        rooms: Object.keys(global.io.sockets.adapter.rooms).length
      };
    }

    // Métricas de rendimiento de las últimas 24 horas
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMetrics = await prisma.systemMetrics.findMany({
      where: {
        recordedAt: {
          gte: yesterday
        }
      },
      orderBy: {
        recordedAt: 'desc'
      },
      take: 24
    });

    if (recentMetrics.length > 0) {
      healthData.metrics = {
        totalDataPoints: recentMetrics.length,
        averageUsers: Math.round(recentMetrics.reduce((sum, m) => sum + m.activeUsers, 0) / recentMetrics.length),
        averageMessages: Math.round(recentMetrics.reduce((sum, m) => sum + m.messagesToday, 0) / recentMetrics.length),
        lastRecorded: recentMetrics[0].recordedAt
      };
    }

    healthData.responseTime = Date.now() - startTime;

    res.json(healthData);

  } catch (error) {
    loggers.api.error('Detailed health check failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      status: 'error',
      message: 'Detailed health check failed',
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
};

// Middleware para verificar el estado antes de procesar requests
const healthCheckMiddleware = async (req, res, next) => {
  try {
    // Check rápido de base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    // Check de memoria
    const memUsage = process.memoryUsage();
    const memoryOk = memUsage.heapUsed / memUsage.heapTotal < 0.95; // < 95%
    
    if (!memoryOk) {
      loggers.api.warn('High memory usage detected', {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      });
      
      return res.status(503).json({
        error: 'Server under high load',
        status: 'temporarily_unavailable'
      });
    }

    next();
  } catch (error) {
    loggers.api.error('Health check middleware failed', {
      error: error.message,
      url: req.url,
      method: req.method
    });

    res.status(503).json({
      error: 'Service temporarily unavailable',
      status: 'database_error'
    });
  }
};

// Endpoint de readiness (para Kubernetes)
const readinessCheck = async (req, res) => {
  try {
    // Verificar que todos los servicios críticos estén listos
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Endpoint de liveness (para Kubernetes)
const livenessCheck = (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

// Función para registrar métricas del sistema periódicamente
const recordSystemMetrics = async () => {
  try {
    const memUsage = process.memoryUsage();
    const [userCount, messageCount] = await Promise.all([
      prisma.user.count(),
      prisma.message.count()
    ]);

    // Contar usuarios activos (que se han conectado en las últimas 24 horas)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await prisma.user.count({
      where: {
        lastLogin: {
          gte: yesterday
        }
      }
    });

    // Contar mensajes de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const messagesToday = await prisma.message.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    await prisma.systemMetrics.create({
      data: {
        totalUsers: userCount,
        activeUsers,
        newUsersToday: 0, // TODO: calcular usuarios nuevos de hoy
        totalMessages: messageCount,
        messagesToday,
        avgMessagesPerUser: userCount > 0 ? messageCount / userCount : 0,
        cpuUsage: process.cpuUsage().user / 1000000, // convertir a segundos
        memoryUsage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
        diskUsage: null // TODO: implementar check de disco
      }
    });

    loggers.api.debug('System metrics recorded', {
      totalUsers: userCount,
      activeUsers,
      messagesToday,
      memoryUsage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + '%'
    });

  } catch (error) {
    loggers.api.error('Failed to record system metrics', {
      error: error.message
    });
  }
};

module.exports = {
  basicHealthCheck,
  detailedHealthCheck,
  healthCheckMiddleware,
  readinessCheck,
  livenessCheck,
  recordSystemMetrics
};