import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SocketUser {
  userId: string;
  socketId: string;
}

class SocketService {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, SocketUser> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
      }
    });

    // Middleware de autenticación
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        socket.data.userId = decoded.userId;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.data.userId}`);
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: Socket) {
    const userId = socket.data.userId;

    // Registrar usuario conectado
    this.connectedUsers.set(userId, {
      userId,
      socketId: socket.id
    });

    // Unirse a sala personal del usuario
    socket.join(`user:${userId}`);

    // Eventos de mensajería
    socket.on('message:send', async (data) => {
      await this.handleSendMessage(socket, data);
    });

    socket.on('message:typing', (data) => {
      this.handleTyping(socket, data);
    });

    socket.on('message:stopTyping', (data) => {
      this.handleStopTyping(socket, data);
    });

    socket.on('conversation:markAsRead', async (data) => {
      await this.handleMarkAsRead(socket, data);
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${userId}`);
      this.connectedUsers.delete(userId);
      
      // Emitir estado offline a otros usuarios
      this.io?.emit('user:status', {
        userId,
        online: false,
        lastSeen: new Date()
      });
    });

    // Emitir estado online a otros usuarios
    this.io?.emit('user:status', {
      userId,
      online: true
    });
  }

  private async handleSendMessage(socket: Socket, data: any) {
    const { recipientId, content, conversationId } = data;
    const senderId = socket.data.userId;

    try {
      // Crear mensaje en la base de datos
      const message = await prisma.message.create({
        data: {
          senderId,
          recipientId,
          content,
          subject: '',
          status: 'SENT'
        },
        include: {
          sender: {
            include: {
              employee: true,
              company: true
            }
          },
          recipient: {
            include: {
              employee: true,
              company: true
            }
          }
        }
      });

      // Emitir mensaje al destinatario si está conectado
      const recipientSocket = this.connectedUsers.get(recipientId);
      if (recipientSocket) {
        this.io?.to(`user:${recipientId}`).emit('message:new', {
          message,
          conversationId
        });
      }

      // Crear notificación
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'message_received',
          title: 'Nuevo mensaje',
          message: `Has recibido un mensaje de ${
            message.sender.employee?.firstName || 
            message.sender.company?.name || 
            message.sender.email
          }`,
          data: {
            messageId: message.id,
            senderId
          }
        }
      });

      // Confirmar al emisor
      socket.emit('message:sent', {
        message,
        conversationId
      });

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('message:error', {
        error: 'Error al enviar el mensaje'
      });
    }
  }

  private handleTyping(socket: Socket, data: any) {
    const { recipientId, conversationId } = data;
    const senderId = socket.data.userId;

    // Emitir evento de escritura al destinatario
    this.io?.to(`user:${recipientId}`).emit('user:typing', {
      userId: senderId,
      conversationId,
      typing: true
    });
  }

  private handleStopTyping(socket: Socket, data: any) {
    const { recipientId, conversationId } = data;
    const senderId = socket.data.userId;

    // Emitir evento de parar escritura al destinatario
    this.io?.to(`user:${recipientId}`).emit('user:typing', {
      userId: senderId,
      conversationId,
      typing: false
    });
  }

  private async handleMarkAsRead(socket: Socket, data: any) {
    const { conversationId, otherUserId } = data;
    const userId = socket.data.userId;

    try {
      // Marcar todos los mensajes como leídos
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

      // Notificar al emisor que sus mensajes fueron leídos
      this.io?.to(`user:${otherUserId}`).emit('messages:read', {
        conversationId,
        readBy: userId
      });

    } catch (error) {
      console.error('Error al marcar mensajes como leídos:', error);
    }
  }

  // Método para enviar mensajes desde otros servicios
  public sendMessageToUser(userId: string, event: string, data: any) {
    this.io?.to(`user:${userId}`).emit(event, data);
  }

  // Obtener usuarios conectados
  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Verificar si un usuario está conectado
  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}

export default new SocketService();