import webpush from 'web-push';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

class PushNotificationService {
  constructor() {
    // Configurar VAPID keys
    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
      subject: process.env.VAPID_SUBJECT || 'mailto:admin@lapublica.es'
    };

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      logger.warn('VAPID keys no configuradas. Las notificaciones push no funcionarán.');
      return;
    }

    webpush.setVapidDetails(
      vapidKeys.subject,
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
  }

  // Suscribir un usuario a las notificaciones push
  async subscribe(userId: string, subscription: any, userAgent?: string) {
    try {
      // Parsear información del navegador
      const browserInfo = this.parseBrowserInfo(userAgent);

      // Guardar o actualizar la suscripción
      const pushSubscription = await prisma.pushSubscription.upsert({
        where: { endpoint: subscription.endpoint },
        update: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          lastUsed: new Date(),
          isActive: true,
          ...browserInfo
        },
        create: {
          userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          ...browserInfo
        }
      });

      logger.info(`Usuario ${userId} suscrito a notificaciones push`);
      return pushSubscription;
    } catch (error) {
      logger.error('Error al suscribir usuario a push:', error);
      throw error;
    }
  }

  // Desuscribir un usuario
  async unsubscribe(userId: string, endpoint: string) {
    try {
      await prisma.pushSubscription.update({
        where: { endpoint },
        data: { isActive: false }
      });

      logger.info(`Usuario ${userId} desuscrito de notificaciones push`);
    } catch (error) {
      logger.error('Error al desuscribir usuario:', error);
      throw error;
    }
  }

  // Enviar notificación a un usuario
  async sendToUser(userId: string, notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    image?: string;
    tag?: string;
    data?: any;
    actions?: Array<{ action: string; title: string; icon?: string }>;
  }) {
    try {
      // Obtener todas las suscripciones activas del usuario
      const subscriptions = await prisma.pushSubscription.findMany({
        where: {
          userId,
          isActive: true
        }
      });

      if (subscriptions.length === 0) {
        logger.info(`No hay suscripciones activas para el usuario ${userId}`);
        return;
      }

      // Preparar el payload de la notificación
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
        badge: notification.badge || '/badge-72x72.png',
        image: notification.image,
        tag: notification.tag,
        data: notification.data || {},
        actions: notification.actions || [],
        timestamp: Date.now()
      });

      // Enviar a todas las suscripciones
      const sendPromises = subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            },
            payload
          );

          // Actualizar última vez usada
          await prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { lastUsed: new Date() }
          });

          return { success: true, subscriptionId: sub.id };
        } catch (error: any) {
          logger.error(`Error enviando push a suscripción ${sub.id}:`, error);

          // Si la suscripción ya no es válida, desactivarla
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.update({
              where: { id: sub.id },
              data: { isActive: false }
            });
          }

          return { success: false, subscriptionId: sub.id, error: error.message };
        }
      });

      const results = await Promise.all(sendPromises);
      const successCount = results.filter(r => r.success).length;

      logger.info(`Notificaciones push enviadas: ${successCount}/${subscriptions.length} exitosas`);
      return results;
    } catch (error) {
      logger.error('Error al enviar notificación push:', error);
      throw error;
    }
  }

  // Enviar notificación de nuevo mensaje
  async sendNewMessageNotification(recipientId: string, senderName: string, messagePreview: string) {
    await this.sendToUser(recipientId, {
      title: `Nuevo mensaje de ${senderName}`,
      body: messagePreview.substring(0, 100) + (messagePreview.length > 100 ? '...' : ''),
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: 'new-message',
      data: {
        type: 'new-message',
        url: '/mensajes'
      },
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'dismiss', title: 'Descartar' }
      ]
    });
  }

  // Enviar notificación genérica
  async sendGeneralNotification(userId: string, title: string, body: string, url?: string) {
    await this.sendToUser(userId, {
      title,
      body,
      data: {
        type: 'general',
        url: url || '/'
      }
    });
  }

  // Parsear información del navegador desde el user agent
  private parseBrowserInfo(userAgent?: string) {
    if (!userAgent) return {};

    const info: any = {};

    // Detectar tipo de dispositivo
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
      info.deviceType = 'mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      info.deviceType = 'tablet';
    } else {
      info.deviceType = 'desktop';
    }

    // Detectar navegador
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) {
      info.browser = 'chrome';
    } else if (/Firefox/i.test(userAgent)) {
      info.browser = 'firefox';
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      info.browser = 'safari';
    } else if (/Edge/i.test(userAgent)) {
      info.browser = 'edge';
    }

    info.userAgent = userAgent.substring(0, 255);

    return info;
  }

  // Limpiar suscripciones inactivas (más de 90 días sin usar)
  async cleanupInactiveSubscriptions() {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.pushSubscription.deleteMany({
      where: {
        OR: [
          { isActive: false },
          { lastUsed: { lt: ninetyDaysAgo } }
        ]
      }
    });

    logger.info(`Eliminadas ${result.count} suscripciones push inactivas`);
    return result.count;
  }
}

export default new PushNotificationService();