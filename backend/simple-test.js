// Simple test script without database dependencies
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Simple test routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    features: {
      messaging: 'available',
      websockets: 'available',
      pushNotifications: 'available'
    }
  });
});

// Mock auth middleware
const mockAuth = (req, res, next) => {
  // Mock user data
  req.user = {
    id: 'mock-user-123',
    email: 'test@example.com',
    role: 'EMPLEADO_PUBLICO'
  };
  next();
};

// Messaging routes (mocked)
app.get('/api/messaging/conversations', mockAuth, (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'conv_1',
        user: {
          id: 'user_2',
          email: 'otro@example.com',
          employee: {
            firstName: 'Juan',
            lastName: 'Pérez',
            avatar: null
          }
        },
        lastMessage: {
          id: 'msg_1',
          content: 'Hola, ¿cómo estás?',
          createdAt: new Date().toISOString()
        },
        unreadCount: 2
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      pages: 1
    }
  });
});

app.post('/api/messaging/messages', mockAuth, (req, res) => {
  const { recipientId, content, subject } = req.body;
  
  if (!recipientId || !content) {
    return res.status(400).json({
      success: false,
      error: 'Destinatario y contenido son requeridos'
    });
  }

  res.status(201).json({
    success: true,
    data: {
      id: 'msg_' + Date.now(),
      senderId: req.user.id,
      recipientId,
      subject: subject || '',
      content,
      status: 'SENT',
      createdAt: new Date().toISOString(),
      sender: {
        id: req.user.id,
        email: req.user.email,
        employee: {
          firstName: 'Usuario',
          lastName: 'Test'
        }
      }
    }
  });
});

// Push notification routes (mocked)
app.post('/api/messaging/push/subscribe', mockAuth, (req, res) => {
  const { subscription } = req.body;
  
  if (!subscription) {
    return res.status(400).json({
      success: false,
      error: 'Suscripción requerida'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Suscrito a notificaciones push exitosamente',
    data: {
      id: 'sub_' + Date.now(),
      endpoint: subscription.endpoint
    }
  });
});

app.post('/api/messaging/push/test', mockAuth, (req, res) => {
  console.log('📱 Push notification test enviada para usuario:', req.user.id);
  
  res.json({
    success: true,
    message: 'Notificación de prueba enviada'
  });
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

let connectedUsers = new Map();

io.use((socket, next) => {
  // Mock authentication
  socket.data.userId = 'mock-user-' + Math.random().toString(36).substr(2, 9);
  console.log('🔌 Usuario conectado via Socket:', socket.data.userId);
  next();
});

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  connectedUsers.set(userId, socket.id);
  
  console.log('✅ Socket conectado:', userId);

  socket.on('message:send', (data) => {
    console.log('💬 Mensaje enviado via Socket:', data);
    
    // Simular envío a destinatario
    const mockMessage = {
      id: 'msg_' + Date.now(),
      senderId: userId,
      content: data.content,
      createdAt: new Date().toISOString(),
      conversationId: data.conversationId
    };
    
    // Emitir de vuelta confirmación
    socket.emit('message:sent', { message: mockMessage });
    
    // Simular envío al destinatario (si estuviera conectado)
    socket.broadcast.emit('message:new', { message: mockMessage });
  });

  socket.on('message:typing', (data) => {
    console.log('⌨️ Usuario escribiendo:', data);
    socket.broadcast.emit('user:typing', {
      userId,
      conversationId: data.conversationId,
      typing: true
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado:', userId);
    connectedUsers.delete(userId);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🚀 Servidor de prueba ejecutándose en puerto', PORT);
  console.log('📚 Endpoints disponibles:');
  console.log('  GET  /api/health');
  console.log('  GET  /api/messaging/conversations');
  console.log('  POST /api/messaging/messages');
  console.log('  POST /api/messaging/push/subscribe');
  console.log('  POST /api/messaging/push/test');
  console.log('🔌 Socket.io configurado para CORS en http://localhost:3000');
  console.log('');
  console.log('Puedes probar con:');
  console.log('  node test-endpoints.js');
});