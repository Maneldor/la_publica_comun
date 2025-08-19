const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const webpush = require('web-push');
const cheerio = require('cheerio');
const axios = require('axios');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Load environment variables
require('dotenv').config();

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@lapublica.es',
  process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI3j1YjDxTX9e5_bDJ3BdF5b5qYKb0WCflp6rX_xSSC-tFk8RIq1cSz8K0',
  process.env.VAPID_PRIVATE_KEY || 'your-vapid-private-key'
);

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp_random_originalname
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  },
  fileFilter: (req, file, cb) => {
    // Permitir imágenes, documentos y algunos otros tipos
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static(uploadsDir));

// Auth middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employee: true,
        company: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Helper function to generate tokens
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  return { accessToken, refreshToken };
};

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

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, community, companyName, cif, sector } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'EMPLEADO_PUBLICO',
        isEmailVerified: true
      }
    });

    // Create profile based on role
    if (role === 'EMPRESA' && companyName) {
      await prisma.company.create({
        data: {
          userId: user.id,
          name: companyName,
          email: email,
          cif: cif || `CIF-${Date.now()}`,
          sector: sector || 'Tecnología'
        }
      });
    } else {
      await prisma.employee.create({
        data: {
          userId: user.id,
          firstName: firstName || 'Usuario',
          lastName: lastName || 'Test',
          community: community || 'MADRID'
        }
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        tokens
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: true,
        company: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Update refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLogin: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          employee: user.employee,
          company: user.company
        },
        tokens
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get profile endpoint
app.get('/api/auth/profile', authenticateUser, async (req, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', authenticateUser, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null }
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Messaging endpoints
app.get('/api/messaging/conversations', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get distinct conversations
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group by conversation
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      const otherUser = message.senderId === userId ? message.recipient : message.sender;
      const conversationId = `conv_${otherUser.id}`;
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
});

app.post('/api/messaging/messages', authenticateUser, async (req, res) => {
  try {
    const { recipientId, content, subject, attachments = [] } = req.body;
    const userId = req.user.id;

    if (!recipientId || (!content && attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and content/attachments are required'
      });
    }

    // Procesar link previews si hay contenido de texto
    let linkPreviews = [];
    if (content && content.trim()) {
      try {
        linkPreviews = await procesarURLsEnTexto(content);
        if (linkPreviews.length > 0) {
          console.log(`🔗 Generados ${linkPreviews.length} link previews para el mensaje`);
        }
      } catch (error) {
        console.error('Error procesando link previews:', error);
        // No fallar el envío del mensaje por error en link previews
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        recipientId,
        subject: subject || '',
        content: content || '',
        status: 'SENT',
        // Almacenar attachments como JSON si los hay
        ...(attachments.length > 0 && { 
          attachments: JSON.stringify(attachments) 
        }),
        // Almacenar link previews como JSON si los hay
        ...(linkPreviews.length > 0 && {
          linkPreviews: JSON.stringify(linkPreviews)
        })
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

    // Parsear attachments y link previews para la respuesta
    const messageWithExtras = {
      ...message,
      attachments: message.attachments ? JSON.parse(message.attachments) : [],
      linkPreviews: message.linkPreviews ? JSON.parse(message.linkPreviews) : []
    };

    console.log(`💬 Mensaje enviado de ${userId} a ${recipientId}${attachments.length > 0 ? ` con ${attachments.length} archivos` : ''}`);

    // Enviar notificación push al destinatario
    try {
      await sendMessageNotification(recipientId, {
        senderId: userId,
        senderName: message.sender.employee?.firstName || message.sender.company?.name || message.sender.email,
        messageContent: content,
        conversationId: `conv_${recipientId}`,
        messageId: message.id
      });
    } catch (notifError) {
      console.error('Error enviando notificación push:', notifError);
      // No fallar el envío del mensaje por error en notificación
    }

    res.status(201).json({
      success: true,
      data: messageWithExtras
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

app.get('/api/messaging/users/search', authenticateUser, async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              { email: { contains: q } },
              {
                employee: {
                  OR: [
                    { firstName: { contains: q } },
                    { lastName: { contains: q } }
                  ]
                }
              },
              {
                company: {
                  name: { contains: q }
                }
              }
            ]
          }
        ]
      },
      include: {
        employee: true,
        company: true
      },
      take: 10
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
});

// Get messages from a conversation
app.get('/api/messaging/conversations/:otherUserId/messages', authenticateUser, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    console.log(`📨 Obteniendo mensajes entre ${userId} y ${otherUserId}`);

    // Verify other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      include: {
        employee: true,
        company: true
      }
    });

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId }
        ]
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
        },
        reactions: {
          include: {
            user: {
              include: {
                employee: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Mark messages as read (from other user to current user)
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        recipientId: userId,
        status: 'SENT'
      },
      data: {
        status: 'READ'
      }
    });

    // Parsear attachments y link previews en los mensajes
    const messagesWithExtras = messages.map(message => ({
      ...message,
      attachments: message.attachments ? JSON.parse(message.attachments) : [],
      linkPreviews: message.linkPreviews ? JSON.parse(message.linkPreviews) : []
    }));

    console.log(`✅ Encontrados ${messages.length} mensajes`);

    res.json({
      success: true,
      data: {
        messages: messagesWithExtras,
        otherUser,
        hasMore: messages.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
});

// Upload files endpoint
app.post('/api/messaging/upload', authenticateUser, upload.array('files', 5), async (req, res) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Procesar archivos subidos
    const uploadedFiles = files.map(file => {
      const isImage = file.mimetype.startsWith('image/');
      
      return {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        isImage,
        uploadedBy: userId,
        uploadedAt: new Date()
      };
    });

    console.log(`📎 ${uploadedFiles.length} archivos subidos por usuario ${userId}`);

    res.json({
      success: true,
      data: {
        files: uploadedFiles
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

// Endpoints para reacciones de mensajes
app.post('/api/messaging/messages/:messageId/reactions', authenticateUser, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required'
      });
    }

    // Verificar que el mensaje existe
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: true,
        recipient: true
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Verificar que el usuario tiene acceso al mensaje
    if (message.senderId !== userId && message.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Crear o actualizar reacción
    const reaction = await prisma.messageReaction.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId
        }
      },
      update: {
        emoji
      },
      create: {
        messageId,
        userId,
        emoji
      },
      include: {
        user: {
          include: {
            employee: true,
            company: true
          }
        }
      }
    });

    console.log(`😊 Reacción ${emoji} ${reaction.id.includes('create') ? 'agregada' : 'actualizada'} al mensaje ${messageId} por ${userId}`);

    res.json({
      success: true,
      data: reaction
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction'
    });
  }
});

app.delete('/api/messaging/messages/:messageId/reactions', authenticateUser, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Verificar que el mensaje existe
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Verificar que el usuario tiene acceso al mensaje
    if (message.senderId !== userId && message.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Eliminar reacción
    const deleted = await prisma.messageReaction.deleteMany({
      where: {
        messageId,
        userId
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reaction not found'
      });
    }

    console.log(`🚫 Reacción eliminada del mensaje ${messageId} por ${userId}`);

    res.json({
      success: true,
      message: 'Reaction removed'
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove reaction'
    });
  }
});

app.get('/api/messaging/messages/:messageId/reactions', authenticateUser, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    // Verificar que el mensaje existe
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Verificar que el usuario tiene acceso al mensaje
    if (message.senderId !== userId && message.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Obtener reacciones
    const reactions = await prisma.messageReaction.findMany({
      where: { messageId },
      include: {
        user: {
          include: {
            employee: true,
            company: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: reactions
    });
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reactions'
    });
  }
});

// Endpoint para búsqueda en historial de mensajes
app.get('/api/messaging/search', authenticateUser, async (req, res) => {
  try {
    const { query, conversationId, startDate, endDate, senderId, limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 2 characters long'
      });
    }

    console.log(`🔍 Búsqueda de mensajes: "${query}" por usuario ${userId}`);

    // Construir filtros de búsqueda
    const whereConditions = {
      OR: [
        { senderId: userId },
        { recipientId: userId }
      ],
      AND: []
    };

    // Filtro por texto en contenido (SQLite compatible)
    whereConditions.AND.push({
      content: {
        contains: query.trim()
      }
    });

    // Filtro por conversación específica
    if (conversationId) {
      whereConditions.AND.push({
        OR: [
          { 
            AND: [
              { senderId: userId },
              { recipientId: conversationId }
            ]
          },
          { 
            AND: [
              { senderId: conversationId },
              { recipientId: userId }
            ]
          }
        ]
      });
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }
      whereConditions.AND.push({
        createdAt: dateFilter
      });
    }

    // Filtro por remitente específico
    if (senderId) {
      whereConditions.AND.push({
        senderId: senderId
      });
    }

    // Realizar búsqueda
    const messages = await prisma.message.findMany({
      where: whereConditions,
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
        },
        reactions: {
          include: {
            user: {
              include: {
                employee: true,
                company: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Contar total de resultados para paginación
    const totalResults = await prisma.message.count({
      where: whereConditions
    });

    // Procesar mensajes para incluir metadatos
    const processedMessages = messages.map(message => ({
      ...message,
      attachments: message.attachments ? JSON.parse(message.attachments) : [],
      linkPreviews: message.linkPreviews ? JSON.parse(message.linkPreviews) : [],
      // Añadir contexto de búsqueda
      searchContext: {
        matchedIn: 'content', // donde se encontró la coincidencia
        snippet: getMessageSnippet(message.content, query.trim()),
        conversationWith: message.senderId === userId ? message.recipient : message.sender
      }
    }));

    console.log(`✅ Búsqueda completada: ${messages.length} resultados de ${totalResults} total`);

    res.json({
      success: true,
      data: {
        messages: processedMessages,
        pagination: {
          total: totalResults,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + messages.length < totalResults
        },
        searchQuery: query.trim()
      }
    });

  } catch (error) {
    console.error('Message search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search messages',
      error: error.message
    });
  }
});

// Función auxiliar para crear snippet de texto con resaltado
function getMessageSnippet(content, query, maxLength = 150) {
  if (!content || !query) return '';
  
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerContent.indexOf(lowerQuery);
  
  if (queryIndex === -1) return content.substring(0, maxLength) + '...';
  
  // Calcular ventana de contexto
  const contextStart = Math.max(0, queryIndex - 50);
  const contextEnd = Math.min(content.length, queryIndex + query.length + 50);
  
  let snippet = content.substring(contextStart, contextEnd);
  
  // Añadir ellipsis si necesario
  if (contextStart > 0) snippet = '...' + snippet;
  if (contextEnd < content.length) snippet = snippet + '...';
  
  return snippet;
}

// Endpoint para obtener link preview de una URL específica
app.get('/api/messaging/link-preview', authenticateUser, async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    // Validar que sea una URL válida
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    console.log(`🔗 Solicitud de link preview para: ${url}`);

    // Extraer metadatos
    const metadata = await extraerMetadatos(url);

    res.json({
      success: true,
      data: metadata
    });

  } catch (error) {
    console.error('Link preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get link preview',
      error: error.message
    });
  }
});

// Endpoints para Push Notifications
app.post('/api/push/subscribe', authenticateUser, async (req, res) => {
  try {
    const { subscription, userId } = req.body;
    const authenticatedUserId = req.user.id;

    // Verificar que el usuario coincida
    if (userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Subscription data is required'
      });
    }

    // Verificar si ya existe una suscripción con este endpoint
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint }
    });

    if (existingSubscription) {
      // Actualizar suscripción existente
      const updatedSubscription = await prisma.pushSubscription.update({
        where: { endpoint: subscription.endpoint },
        data: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          lastUsed: new Date(),
          isActive: true
        }
      });

      console.log(`🔔 Suscripción push actualizada para usuario ${userId}`);
      
      return res.json({
        success: true,
        data: updatedSubscription
      });
    }

    // Crear nueva suscripción
    const newSubscription = await prisma.pushSubscription.create({
      data: {
        userId: authenticatedUserId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: req.headers['user-agent'] || null,
        deviceType: detectDeviceType(req.headers['user-agent']),
        browser: detectBrowser(req.headers['user-agent']),
        isActive: true,
        lastUsed: new Date()
      }
    });

    console.log(`🔔 Nueva suscripción push creada para usuario ${userId}`);

    res.status(201).json({
      success: true,
      data: newSubscription
    });
  } catch (error) {
    console.error('Push subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to push notifications'
    });
  }
});

app.post('/api/push/unsubscribe', authenticateUser, async (req, res) => {
  try {
    const { endpoint, userId } = req.body;
    const authenticatedUserId = req.user.id;

    // Verificar que el usuario coincida
    if (userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint is required'
      });
    }

    // Desactivar suscripción
    const updatedSubscription = await prisma.pushSubscription.updateMany({
      where: {
        endpoint,
        userId: authenticatedUserId
      },
      data: {
        isActive: false
      }
    });

    console.log(`🔕 Suscripción push desactivada para usuario ${userId}`);

    res.json({
      success: true,
      message: 'Unsubscribed successfully',
      updated: updatedSubscription.count
    });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from push notifications'
    });
  }
});

app.post('/api/push/test', authenticateUser, async (req, res) => {
  try {
    const { userId, title, body, type } = req.body;
    const authenticatedUserId = req.user.id;

    // Verificar que el usuario coincida
    if (userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Obtener suscripciones activas del usuario
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: authenticatedUserId,
        isActive: true
      }
    });

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active push subscriptions found'
      });
    }

    const notificationPayload = {
      title: title || '🧪 Notificación de prueba',
      body: body || 'Las notificaciones push funcionan correctamente!',
      type: type || 'test',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: 'test-notification',
      data: {
        type: 'test',
        userId: authenticatedUserId,
        timestamp: Date.now()
      }
    };

    // Enviar a todas las suscripciones del usuario
    const results = await Promise.allSettled(
      subscriptions.map(subscription => 
        sendPushNotification(subscription, notificationPayload)
      )
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`🧪 Notificación de prueba enviada: ${successful} éxitos, ${failed} fallos`);

    res.json({
      success: true,
      message: 'Test notification sent',
      stats: {
        sent: successful,
        failed: failed,
        total: subscriptions.length
      }
    });
  } catch (error) {
    console.error('Push test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
});

// Funciones auxiliares para push notifications
function detectDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    return 'mobile';
  } else if (/Tablet/.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

function detectBrowser(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  
  return 'unknown';
}

// Enviar notificación push de nuevo mensaje
async function sendMessageNotification(recipientId, messageData) {
  try {
    // Obtener suscripciones activas del destinatario
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: recipientId,
        isActive: true
      }
    });

    if (subscriptions.length === 0) {
      console.log(`📱 No hay suscripciones push activas para usuario ${recipientId}`);
      return;
    }

    const { senderName, messageContent, conversationId, messageId } = messageData;

    const notificationPayload = {
      type: 'new_message',
      title: `💬 ${senderName}`,
      body: messageContent.length > 100 
        ? messageContent.substring(0, 100) + '...'
        : messageContent,
      senderName,
      messageContent,
      conversationId,
      messageId,
      userId: recipientId,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: `message_${messageId}`,
      data: {
        type: 'new_message',
        conversationId,
        messageId,
        senderId: messageData.senderId,
        senderName,
        url: `/?conversation=${conversationId}`
      }
    };

    // Enviar a todas las suscripciones del usuario
    const results = await Promise.allSettled(
      subscriptions.map(subscription => 
        sendPushNotification(subscription, notificationPayload)
      )
    );

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`📱 Notificación de mensaje enviada a ${recipientId}: ${successful} éxitos, ${failed} fallos`);

  } catch (error) {
    console.error('Error en sendMessageNotification:', error);
    throw error;
  }
}

// Esta función se implementará cuando instalemos web-push
async function sendPushNotification(subscription, payload) {
  try {
    console.log(`📤 Enviando push notification a ${subscription.endpoint.substring(0, 50)}...`);
    
    // Preparar el payload para web-push
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    };

    // Opciones para el envío
    const options = {
      TTL: 60 * 60 * 24, // 24 horas
      vapidDetails: {
        subject: process.env.VAPID_SUBJECT || 'mailto:admin@lapublica.es',
        publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI3j1YjDxTX9e5_bDJ3BdF5b5qYKb0WCflp6rX_xSSC-tFk8RIq1cSz8K0',
        privateKey: process.env.VAPID_PRIVATE_KEY || 'your-vapid-private-key'
      }
    };

    // Enviar la notificación
    const result = await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload),
      options
    );

    console.log('✅ Push notification enviada exitosamente');
    console.log(`   - Status: ${result.statusCode}`);
    console.log(`   - Headers: ${JSON.stringify(result.headers)}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error enviando push notification:', error);
    
    // Si la suscripción es inválida (410), podríamos eliminarla de la base de datos
    if (error.statusCode === 410) {
      console.log('⚠️  Suscripción expirada o inválida, debería eliminarse de la base de datos');
      // TODO: Implementar eliminación automática de suscripciones inválidas
    }
    
    return false;
  }
}

// ====================================
// FUNCIONES DE LINK PREVIEW
// ====================================

// Función para detectar URLs en texto
function detectarURLs(texto) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return texto.match(urlRegex) || [];
}

// Función para extraer metadatos de una URL
async function extraerMetadatos(url) {
  try {
    console.log(`🔗 Extrayendo metadatos de: ${url}`);
    
    // Configurar axios con timeout y headers apropiados
    const response = await axios.get(url, {
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; La Publica Bot/1.0; +https://lapublica.es/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      maxRedirects: 5
    });

    // Verificar que sea HTML
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      throw new Error('El contenido no es HTML');
    }

    const $ = cheerio.load(response.data);
    
    // Extraer metadatos
    const metadata = {
      url: url,
      title: '',
      description: '',
      image: '',
      siteName: '',
      favicon: ''
    };

    // Título - prioridad: og:title > twitter:title > title tag
    metadata.title = $('meta[property="og:title"]').attr('content') || 
                    $('meta[name="twitter:title"]').attr('content') || 
                    $('title').text().trim() || 
                    'Sin título';

    // Descripción - prioridad: og:description > twitter:description > meta description
    metadata.description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="twitter:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') || 
                          '';

    // Imagen - prioridad: og:image > twitter:image
    let imageUrl = $('meta[property="og:image"]').attr('content') || 
                   $('meta[name="twitter:image"]').attr('content') || 
                   $('meta[name="twitter:image:src"]').attr('content');

    // Hacer la imagen absoluta si es relativa
    if (imageUrl) {
      if (imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      } else if (imageUrl.startsWith('/')) {
        const urlObj = new URL(url);
        imageUrl = urlObj.origin + imageUrl;
      } else if (!imageUrl.startsWith('http')) {
        const urlObj = new URL(url);
        imageUrl = urlObj.origin + '/' + imageUrl;
      }
      metadata.image = imageUrl;
    }

    // Nombre del sitio
    metadata.siteName = $('meta[property="og:site_name"]').attr('content') || 
                       $('meta[name="application-name"]').attr('content') || 
                       '';

    // Favicon
    let faviconUrl = $('link[rel="icon"]').attr('href') || 
                     $('link[rel="shortcut icon"]').attr('href') || 
                     '/favicon.ico';
    
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      if (faviconUrl.startsWith('//')) {
        faviconUrl = 'https:' + faviconUrl;
      } else if (faviconUrl.startsWith('/')) {
        const urlObj = new URL(url);
        faviconUrl = urlObj.origin + faviconUrl;
      }
    }
    metadata.favicon = faviconUrl;

    // Limpiar y truncar campos
    metadata.title = metadata.title.substring(0, 200);
    metadata.description = metadata.description.substring(0, 500);
    metadata.siteName = metadata.siteName.substring(0, 100);

    console.log(`✅ Metadatos extraídos exitosamente para ${url}`);
    console.log(`   - Título: ${metadata.title}`);
    console.log(`   - Descripción: ${metadata.description.substring(0, 100)}...`);
    
    return metadata;
    
  } catch (error) {
    console.error(`❌ Error extrayendo metadatos de ${url}:`, error.message);
    
    // Devolver metadatos básicos en caso de error
    return {
      url: url,
      title: url,
      description: 'No se pudieron cargar los metadatos de este enlace',
      image: '',
      siteName: '',
      favicon: '',
      error: error.message
    };
  }
}

// Función para procesar múltiples URLs
async function procesarURLsEnTexto(texto) {
  const urls = detectarURLs(texto);
  if (urls.length === 0) return [];

  console.log(`🔍 Procesando ${urls.length} URLs encontradas`);
  
  // Procesar URLs en paralelo (máximo 3 a la vez para no sobrecargar)
  const previews = [];
  for (let i = 0; i < urls.length; i += 3) {
    const batch = urls.slice(i, i + 3);
    const batchPromises = batch.map(url => extraerMetadatos(url));
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        previews.push(result.value);
      } else {
        console.error(`Error procesando URL ${batch[index]}:`, result.reason);
        previews.push({
          url: batch[index],
          title: batch[index],
          description: 'Error al cargar el enlace',
          image: '',
          siteName: '',
          favicon: '',
          error: result.reason.message
        });
      }
    });
  }

  return previews;
}

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
  }
});

let connectedUsers = new Map();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

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

  socket.on('message:send', (data) => {
    console.log('💬 Mensaje recibido via Socket:', data);
    
    // Broadcast to recipient if online
    if (data.recipientId && connectedUsers.has(data.recipientId)) {
      io.to(`user:${data.recipientId}`).emit('message:new', {
        message: data.message,
        conversationId: data.conversationId
      });
    }
  });

  socket.on('message:typing', (data) => {
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('user:typing', {
        userId,
        conversationId: data.conversationId,
        typing: true
      });
    }
  });

  socket.on('message:stopTyping', (data) => {
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('user:typing', {
        userId,
        conversationId: data.conversationId,
        typing: false
      });
    }
  });

  // Eventos de reacciones a mensajes
  socket.on('message:addReaction', (data) => {
    console.log('😊 Reacción agregada via Socket:', { messageId: data.messageId, emoji: data.emoji, userId });
    
    // Broadcast to recipient if online
    if (data.recipientId && connectedUsers.has(data.recipientId)) {
      io.to(`user:${data.recipientId}`).emit('message:reactionAdded', {
        messageId: data.messageId,
        reaction: data.reaction,
        userId,
        conversationId: data.conversationId
      });
    }
  });

  socket.on('message:removeReaction', (data) => {
    console.log('🚫 Reacción eliminada via Socket:', { messageId: data.messageId, userId });
    
    // Broadcast to recipient if online
    if (data.recipientId && connectedUsers.has(data.recipientId)) {
      io.to(`user:${data.recipientId}`).emit('message:reactionRemoved', {
        messageId: data.messageId,
        userId,
        conversationId: data.conversationId
      });
    }
  });

  // WebRTC Signaling Events
  socket.on('call:initiate', (data) => {
    console.log('📞 Iniciando llamada:', { from: userId, to: data.recipientId, type: data.callType });
    
    // Verificar si el destinatario está conectado
    const recipientSocket = connectedUsers.get(data.recipientId);
    if (recipientSocket) {
      io.to(`user:${data.recipientId}`).emit('call:incoming', {
        callerId: userId,
        callerName: socket.user.employee?.firstName || socket.user.company?.name || socket.user.email,
        callType: data.callType, // 'audio' o 'video'
        roomId: data.roomId
      });
    } else {
      socket.emit('call:recipientOffline', { recipientId: data.recipientId });
    }
  });

  socket.on('call:accept', (data) => {
    console.log('✅ Llamada aceptada:', { userId, roomId: data.roomId });
    io.to(`user:${data.callerId}`).emit('call:accepted', {
      acceptedBy: userId,
      roomId: data.roomId
    });
  });

  socket.on('call:reject', (data) => {
    console.log('❌ Llamada rechazada:', { userId, roomId: data.roomId });
    io.to(`user:${data.callerId}`).emit('call:rejected', {
      rejectedBy: userId,
      roomId: data.roomId,
      reason: data.reason || 'Llamada rechazada'
    });
  });

  socket.on('call:end', (data) => {
    console.log('📞 Llamada finalizada:', { userId, roomId: data.roomId });
    
    // Notificar a todos los participantes
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('call:ended', {
        endedBy: userId,
        roomId: data.roomId
      });
    }
  });

  // WebRTC Offer/Answer/ICE candidates
  socket.on('webrtc:offer', (data) => {
    console.log('🎥 WebRTC offer:', { from: userId, to: data.recipientId });
    io.to(`user:${data.recipientId}`).emit('webrtc:offer', {
      senderId: userId,
      offer: data.offer,
      roomId: data.roomId
    });
  });

  socket.on('webrtc:answer', (data) => {
    console.log('🎥 WebRTC answer:', { from: userId, to: data.recipientId });
    io.to(`user:${data.recipientId}`).emit('webrtc:answer', {
      senderId: userId,
      answer: data.answer,
      roomId: data.roomId
    });
  });

  socket.on('webrtc:iceCandidate', (data) => {
    console.log('🧊 ICE candidate:', { from: userId, to: data.recipientId });
    io.to(`user:${data.recipientId}`).emit('webrtc:iceCandidate', {
      senderId: userId,
      candidate: data.candidate,
      roomId: data.roomId
    });
  });

  // Estado de la llamada
  socket.on('call:updateStatus', (data) => {
    if (data.recipientId) {
      io.to(`user:${data.recipientId}`).emit('call:statusUpdate', {
        userId,
        status: data.status, // 'muted', 'unmuted', 'videoOn', 'videoOff', etc.
        roomId: data.roomId
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado:', userId);
    connectedUsers.delete(userId);
    
    // Notificar a otros usuarios si estaba en una llamada
    socket.broadcast.emit('user:disconnected', { userId });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🚀 Servidor con autenticación real ejecutándose en puerto', PORT);
  console.log('📚 Endpoints disponibles:');
  console.log('  POST /api/auth/register - Registro de usuarios');
  console.log('  POST /api/auth/login - Login de usuarios');
  console.log('  GET  /api/auth/profile - Perfil del usuario');
  console.log('  POST /api/auth/logout - Logout');
  console.log('  GET  /api/messaging/conversations - Conversaciones');
  console.log('  POST /api/messaging/messages - Enviar mensaje');
  console.log('  GET  /api/messaging/users/search - Buscar usuarios');
  console.log('🗄️  Base de datos: SQLite (dev.db)');
  console.log('🔐 Autenticación: JWT real');
  console.log('🔌 Socket.io: Autenticación requerida');
  console.log('');
  console.log('Para probar:');
  console.log('1. Registra usuarios en: http://localhost:3000/auth/register');
  console.log('2. Inicia sesión en: http://localhost:3000/auth/login');
  console.log('3. Usa mensajería en: http://localhost:3000/test-messaging');
});