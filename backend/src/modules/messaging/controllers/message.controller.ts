import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../../../utils/asyncHandler';
import { ApiError } from '../../../utils/ApiError';
import socketService from '../../../services/socket.service';
import pushService from '../../../services/push.service';
import linkPreviewService from '../services/linkPreview.service';

const prisma = new PrismaClient();

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { recipientId, content, subject } = req.body;

  if (!recipientId || !content) {
    throw new ApiError(400, 'Destinatario y contenido son requeridos');
  }

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId }
  });

  if (!recipient) {
    throw new ApiError(404, 'Destinatario no encontrado');
  }

  // Detectar URLs en el contenido y generar previews
  let linkPreviews = null;
  try {
    const urls = linkPreviewService.detectUrls(content);
    if (urls.length > 0) {
      const previews = await linkPreviewService.processUrls(urls);
      if (previews.length > 0) {
        linkPreviews = JSON.stringify(previews);
      }
    }
  } catch (error) {
    console.error('Error generando link previews:', error);
    // No fallar el envío del mensaje si falla la generación de previews
  }

  const message = await prisma.message.create({
    data: {
      senderId: userId!,
      recipientId,
      subject: subject || '',
      content,
      linkPreviews,
      status: 'SENT'
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          company: {
            select: {
              name: true,
              logo: true
            }
          }
        }
      },
      recipient: {
        select: {
          id: true,
          email: true,
          employee: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          company: {
            select: {
              name: true,
              logo: true
            }
          }
        }
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: 'message_received',
      title: 'Nuevo mensaje',
      message: `Has recibido un mensaje de ${
        message.sender.employee?.firstName || message.sender.company?.name || message.sender.email
      }`,
      data: {
        messageId: message.id,
        senderId: userId
      }
    }
  });

  // Emitir mensaje vía Socket.io si el usuario está conectado
  if (socketService.isUserConnected(recipientId)) {
    socketService.sendMessageToUser(recipientId, 'message:new', {
      message,
      conversationId: `conv_${userId}`
    });
  } else {
    // Si el usuario no está conectado, enviar push notification
    const senderName = message.sender.employee?.firstName || 
                      message.sender.company?.name || 
                      message.sender.email;
    
    try {
      await pushService.sendNewMessageNotification(recipientId, senderName, content);
    } catch (error) {
      console.error('Error enviando push notification:', error);
      // No fallar el envío del mensaje si falla la push notification
    }
  }

  res.status(201).json({
    success: true,
    data: message
  });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { messageId } = req.params;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      recipientId: userId
    }
  });

  if (!message) {
    throw new ApiError(404, 'Mensaje no encontrado');
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });

  res.json({
    success: true,
    data: updatedMessage
  });
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { otherUserId } = req.body;

  if (!otherUserId) {
    throw new ApiError(400, 'ID del otro usuario es requerido');
  }

  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      recipientId: userId,
      status: 'SENT'
    },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });

  res.json({
    success: true,
    message: 'Todos los mensajes marcados como leídos'
  });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { messageId } = req.params;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ]
    }
  });

  if (!message) {
    throw new ApiError(404, 'Mensaje no encontrado');
  }

  await prisma.message.delete({
    where: { id: messageId }
  });

  res.json({
    success: true,
    message: 'Mensaje eliminado exitosamente'
  });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const unreadCount = await prisma.message.count({
    where: {
      recipientId: userId,
      status: 'SENT'
    }
  });

  res.json({
    success: true,
    data: { unreadCount }
  });
});