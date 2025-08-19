const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import auth controllers
const authControllers = require('./dist/modules/auth/controllers/auth.controller.simple');
const authMiddleware = require('./dist/middleware/auth.simple');
const messageControllers = require('./dist/modules/messaging/controllers/message.controller');
const conversationControllers = require('./dist/modules/messaging/controllers/conversation.controller');
const pushControllers = require('./dist/modules/messaging/controllers/push.controller');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth server running with real database',
    timestamp: new Date().toISOString(),
    features: {
      authentication: 'real',
      database: 'sqlite',
      messaging: 'real',
      websockets: 'available',
      pushNotifications: 'available'
    }
  });
});

// Auth routes
app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.post('/api/auth/refresh', authControllers.refreshToken);
app.post('/api/auth/forgot-password', authControllers.forgotPassword);
app.post('/api/auth/reset-password', authControllers.resetPassword);
app.get('/api/auth/profile', authMiddleware.authenticateUser, authControllers.getProfile);
app.post('/api/auth/logout', authMiddleware.authenticateUser, authControllers.logout);

// Messaging routes (protected)
app.get('/api/messaging/conversations', authMiddleware.authenticateUser, conversationControllers.getConversations);
app.get('/api/messaging/conversations/:otherUserId/messages', authMiddleware.authenticateUser, conversationControllers.getConversationMessages);
app.get('/api/messaging/users/search', authMiddleware.authenticateUser, conversationControllers.searchUsers);
app.post('/api/messaging/messages', authMiddleware.authenticateUser, messageControllers.sendMessage);
app.patch('/api/messaging/messages/:messageId/read', authMiddleware.authenticateUser, messageControllers.markAsRead);
app.post('/api/messaging/messages/mark-all-read', authMiddleware.authenticateUser, messageControllers.markAllAsRead);
app.delete('/api/messaging/messages/:messageId', authMiddleware.authenticateUser, messageControllers.deleteMessage);
app.get('/api/messaging/messages/unread-count', authMiddleware.authenticateUser, messageControllers.getUnreadCount);

// Push notification routes (protected)
app.post('/api/messaging/push/subscribe', authMiddleware.authenticateUser, pushControllers.subscribeToPush);
app.post('/api/messaging/push/unsubscribe', authMiddleware.authenticateUser, pushControllers.unsubscribeFromPush);
app.post('/api/messaging/push/test', authMiddleware.authenticateUser, pushControllers.testPushNotification);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

let connectedUsers = new Map();

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.userId;
    console.log('🔌 Usuario autenticado via Socket:', decoded.userId);
    next();
  } catch (err) {
    console.error('Socket auth error:', err);
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  connectedUsers.set(userId, socket.id);
  
  console.log('✅ Socket conectado:', userId);

  socket.join(`user:${userId}`);

  socket.on('message:send', async (data) => {
    console.log('💬 Mensaje enviado via Socket:', data);
    
    // The message is already saved by the REST endpoint
    // Just broadcast to recipient if online
    const recipientSocket = connectedUsers.get(data.recipientId);
    if (recipientSocket) {
      io.to(`user:${data.recipientId}`).emit('message:new', {
        message: data.message,
        conversationId: data.conversationId
      });
    }
  });

  socket.on('message:typing', (data) => {
    io.to(`user:${data.recipientId}`).emit('user:typing', {
      userId,
      conversationId: data.conversationId,
      typing: true
    });
  });

  socket.on('message:stopTyping', (data) => {
    io.to(`user:${data.recipientId}`).emit('user:typing', {
      userId,
      conversationId: data.conversationId,
      typing: false
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado:', userId);
    connectedUsers.delete(userId);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🚀 Servidor de autenticación ejecutándose en puerto', PORT);
  console.log('📚 Endpoints disponibles:');
  console.log('  POST /api/auth/register - Registro de usuarios');
  console.log('  POST /api/auth/login - Login de usuarios');
  console.log('  GET  /api/auth/profile - Perfil del usuario');
  console.log('  POST /api/auth/logout - Logout');
  console.log('  GET  /api/messaging/conversations - Conversaciones');
  console.log('  POST /api/messaging/messages - Enviar mensaje');
  console.log('  POST /api/messaging/push/subscribe - Suscribirse a push');
  console.log('🗄️  Base de datos: SQLite (dev.db)');
  console.log('🔐 Autenticación: JWT real');
  console.log('🔌 Socket.io: Autenticación requerida');
  console.log('');
  console.log('Puedes probar registrando un usuario en: http://localhost:3000/auth/register');
});