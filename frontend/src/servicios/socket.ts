import { io, Socket } from 'socket.io-client';
import { Mensaje } from '../../tipos/redSocial';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    this.socket = io(API_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventHandlers();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Conectado a Socket.io');
      this.emit('socket:connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado de Socket.io');
      this.emit('socket:disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
      this.emit('socket:error', error);
    });

    // Eventos de mensajería
    this.socket.on('message:new', (data) => {
      this.emit('message:new', data);
    });

    this.socket.on('message:sent', (data) => {
      this.emit('message:sent', data);
    });

    this.socket.on('messages:read', (data) => {
      this.emit('messages:read', data);
    });

    this.socket.on('user:typing', (data) => {
      this.emit('user:typing', data);
    });

    this.socket.on('user:status', (data) => {
      this.emit('user:status', data);
    });

    // Eventos de WebRTC
    this.socket.on('call:incoming', (data) => {
      this.emit('call:incoming', data);
    });

    this.socket.on('call:accepted', (data) => {
      this.emit('call:accepted', data);
    });

    this.socket.on('call:rejected', (data) => {
      this.emit('call:rejected', data);
    });

    this.socket.on('call:ended', (data) => {
      this.emit('call:ended', data);
    });

    this.socket.on('webrtc:offer', (data) => {
      this.emit('webrtc:offer', data);
    });

    this.socket.on('webrtc:answer', (data) => {
      this.emit('webrtc:answer', data);
    });

    this.socket.on('webrtc:iceCandidate', (data) => {
      this.emit('webrtc:iceCandidate', data);
    });

    this.socket.on('call:statusUpdate', (data) => {
      this.emit('call:statusUpdate', data);
    });

    this.socket.on('user:disconnected', (data) => {
      this.emit('user:disconnected', data);
    });
  }

  // Emitir eventos al servidor
  sendMessage(recipientId: string, content: string, conversationId: string) {
    if (!this.socket?.connected) {
      console.error('Socket no conectado');
      return;
    }

    this.socket.emit('message:send', {
      recipientId,
      content,
      conversationId
    });
  }

  startTyping(recipientId: string, conversationId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit('message:typing', {
      recipientId,
      conversationId
    });
  }

  stopTyping(recipientId: string, conversationId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit('message:stopTyping', {
      recipientId,
      conversationId
    });
  }

  markConversationAsRead(conversationId: string, otherUserId: string) {
    if (!this.socket?.connected) return;

    this.socket.emit('conversation:markAsRead', {
      conversationId,
      otherUserId
    });
  }

  // Sistema de eventos interno
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: string, data?: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        callback(data);
      });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  emitToServer(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();