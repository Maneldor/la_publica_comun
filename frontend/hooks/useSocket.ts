import { useEffect, useCallback, useState } from 'react';
import socketService from '../src/servicios/socket';

export const useSocket = (token?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (token) {
      // Conectar al socket
      socketService.connect(token);

      // Listeners para estado de conexión
      const handleConnected = () => setIsConnected(true);
      const handleDisconnected = () => setIsConnected(false);
      
      socketService.on('socket:connected', handleConnected);
      socketService.on('socket:disconnected', handleDisconnected);

      // Listener para indicadores de escritura
      const handleTyping = (data: { userId: string; conversationId: string; typing: boolean }) => {
        setIsTyping(prev => ({
          ...prev,
          [data.conversationId]: data.typing
        }));

        // Limpiar indicador después de 3 segundos
        if (data.typing) {
          setTimeout(() => {
            setIsTyping(prev => ({
              ...prev,
              [data.conversationId]: false
            }));
          }, 3000);
        }
      };

      socketService.on('user:typing', handleTyping);

      // Cleanup
      return () => {
        socketService.off('socket:connected', handleConnected);
        socketService.off('socket:disconnected', handleDisconnected);
        socketService.off('user:typing', handleTyping);
        socketService.disconnect();
      };
    }
  }, [token]);

  const sendMessage = useCallback((recipientId: string, content: string, conversationId: string) => {
    socketService.sendMessage(recipientId, content, conversationId);
  }, []);

  const startTyping = useCallback((recipientId: string, conversationId: string) => {
    socketService.startTyping(recipientId, conversationId);
  }, []);

  const stopTyping = useCallback((recipientId: string, conversationId: string) => {
    socketService.stopTyping(recipientId, conversationId);
  }, []);

  const markAsRead = useCallback((conversationId: string, otherUserId: string) => {
    socketService.markConversationAsRead(conversationId, otherUserId);
  }, []);

  return {
    isConnected,
    isTyping,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    socketService,
    socket: socketService.getSocket()
  };
};