import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import pushService from '../../../services/push.service';
import { loggers } from '../../../utils/logger';

export const subscribeToPush = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { subscription, deviceInfo } = req.body;
  const userAgent = req.headers['user-agent'];
  const clientIP = req.ip || req.connection.remoteAddress;

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    throw new ApiError(400, 'Suscripción inválida');
  }

  // Validar estructura de suscripción
  if (!subscription.keys.p256dh || !subscription.keys.auth) {
    throw new ApiError(400, 'Claves de suscripción incompletas');
  }

  loggers.messaging.info('Nueva suscripción push', {
    userId,
    endpoint: subscription.endpoint.substring(0, 50) + '...',
    userAgent: userAgent?.substring(0, 100),
    deviceInfo,
    clientIP
  });

  const pushSubscription = await pushService.subscribe(
    userId!, 
    subscription, 
    userAgent,
    deviceInfo
  );

  res.status(201).json({
    success: true,
    message: 'Suscrito a notificaciones push exitosamente',
    data: {
      id: pushSubscription.id,
      endpoint: pushSubscription.endpoint.substring(0, 50) + '...',
      createdAt: pushSubscription.createdAt
    }
  });
});

export const unsubscribeFromPush = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { endpoint, reason } = req.body;

  if (!endpoint) {
    throw new ApiError(400, 'Endpoint requerido');
  }

  loggers.messaging.info('Desuscripción push', {
    userId,
    endpoint: endpoint.substring(0, 50) + '...',
    reason
  });

  await pushService.unsubscribe(userId!, endpoint);

  res.json({
    success: true,
    message: 'Desuscrito de notificaciones push exitosamente'
  });
});

// Obtener suscripciones del usuario
export const getUserSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const subscriptions = await pushService.getUserSubscriptions(userId!);

  res.json({
    success: true,
    data: subscriptions.map(sub => ({
      id: sub.id,
      endpoint: sub.endpoint.substring(0, 50) + '...',
      userAgent: sub.userAgent,
      createdAt: sub.createdAt,
      isActive: sub.isActive
    }))
  });
});

// Actualizar configuración de notificaciones
export const updateNotificationSettings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { settings } = req.body;

  if (!settings || typeof settings !== 'object') {
    throw new ApiError(400, 'Configuración de notificaciones inválida');
  }

  loggers.messaging.info('Actualizando configuración de notificaciones', {
    userId,
    settings
  });

  await pushService.updateNotificationSettings(userId!, settings);

  res.json({
    success: true,
    message: 'Configuración de notificaciones actualizada'
  });
});

// Obtener configuración de notificaciones
export const getNotificationSettings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const settings = await pushService.getNotificationSettings(userId!);

  res.json({
    success: true,
    data: settings
  });
});

// Enviar notificación personalizada (solo admin)
export const sendCustomNotification = asyncHandler(async (req: Request, res: Response) => {
  const { targetUsers, title, body, url, data, schedule } = req.body;
  const senderId = req.user?.id;

  if (!targetUsers || !Array.isArray(targetUsers) || targetUsers.length === 0) {
    throw new ApiError(400, 'Lista de usuarios objetivo requerida');
  }

  if (!title || !body) {
    throw new ApiError(400, 'Título y cuerpo requeridos');
  }

  loggers.messaging.info('Enviando notificación personalizada', {
    senderId,
    targetUsers: targetUsers.length,
    title,
    schedule
  });

  const results = await pushService.sendBulkNotification(
    targetUsers,
    {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...data
    },
    url,
    schedule
  );

  res.json({
    success: true,
    message: 'Notificación personalizada enviada',
    data: {
      sent: results.successful,
      failed: results.failed,
      total: targetUsers.length
    }
  });
});

// Obtener estadísticas de notificaciones
export const getNotificationStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { period = '7d' } = req.query;

  const stats = await pushService.getNotificationStats(userId!, period as string);

  res.json({
    success: true,
    data: stats
  });
});

export const testPushNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { type = 'general', customData } = req.body;

  loggers.messaging.info('Enviando notificación de prueba', {
    userId,
    type,
    customData
  });

  let title = 'Notificación de Prueba';
  let body = 'Esta es una notificación de prueba de La Pública';
  let url = '/dashboard';
  let notificationData = {};

  // Personalizar según el tipo de prueba
  switch (type) {
    case 'message':
      title = '💬 Nuevo mensaje';
      body = 'Juan Pérez te ha enviado un mensaje';
      url = '/mensajes';
      notificationData = {
        type: 'new_message',
        senderName: 'Juan Pérez',
        messageContent: 'Hola, ¿cómo estás?',
        conversationId: 'test-conversation',
        messageId: 'test-message'
      };
      break;
      
    case 'reaction':
      title = '😊 Nueva reacción';
      body = 'María García reaccionó a tu mensaje';
      url = '/mensajes';
      notificationData = {
        type: 'message_reaction',
        senderName: 'María García',
        reaction: '👍',
        messageId: 'test-message'
      };
      break;
      
    case 'call':
      title = '📞 Llamada entrante';
      body = 'Carlos López te está llamando';
      url = '/llamadas';
      notificationData = {
        type: 'call_incoming',
        senderName: 'Carlos López',
        callId: 'test-call'
      };
      break;
      
    case 'group':
      title = '👥 Actividad en grupo';
      body = 'Nuevo mensaje en "Equipo Desarrollo"';
      url = '/grupos/test-group';
      notificationData = {
        type: 'group_message',
        groupName: 'Equipo Desarrollo',
        senderName: 'Ana Martín',
        groupId: 'test-group'
      };
      break;
      
    default:
      if (customData) {
        title = customData.title || title;
        body = customData.body || body;
        url = customData.url || url;
        notificationData = customData.data || {};
      }
  }

  const result = await pushService.sendNotification(
    userId!,
    {
      title,
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...notificationData
    },
    url
  );

  res.json({
    success: true,
    message: `Notificación de prueba (${type}) enviada`,
    data: {
      type,
      title,
      body,
      url,
      delivered: result?.successful || 0,
      failed: result?.failed || 0
    }
  });
});