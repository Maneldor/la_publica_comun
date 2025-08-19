const fetch = require('node-fetch');
const io = require('socket.io-client');

const API_BASE_URL = 'http://localhost:3001';

// Usuarios de prueba
const testUsers = [
  { email: 'empleado1@madrid.es', password: 'test123' },
  { email: 'empleado2@cat.gencat.cat', password: 'test123' }
];

let user1Token = null;
let user2Token = null;
let user1Id = null;
let user2Id = null;

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      return { token: data.data.tokens.accessToken, user: data.data.user };
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
}

async function sendMessage(token, recipientId, content) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messaging/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientId,
        content,
        subject: ''
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log(`✅ Mensaje enviado: "${content.substring(0, 30)}..."`);
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Send message error:', error.message);
    return null;
  }
}

async function getConversations(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messaging/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Get conversations error:', error.message);
    return [];
  }
}

async function getMessages(token, otherUserId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messaging/conversations/${otherUserId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.data.messages;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Get messages error:', error.message);
    return [];
  }
}

function connectSocket(token, userId) {
  return new Promise((resolve) => {
    const socket = io(API_BASE_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log(`🔌 Socket conectado para usuario ${userId}`);
      resolve(socket);
    });

    socket.on('connect_error', (error) => {
      console.error(`❌ Error conectando socket para ${userId}:`, error.message);
      resolve(null);
    });
  });
}

async function testCompleteMessagingFlow() {
  console.log('🧪 === PRUEBA COMPLETA DEL SISTEMA DE MENSAJERÍA ===\n');

  // 1. Login de usuarios
  console.log('📝 FASE 1: LOGIN DE USUARIOS');
  const login1 = await loginUser(testUsers[0].email, testUsers[0].password);
  const login2 = await loginUser(testUsers[1].email, testUsers[1].password);

  if (!login1 || !login2) {
    console.error('❌ Error en login de usuarios');
    return;
  }

  user1Token = login1.token;
  user2Token = login2.token;
  user1Id = login1.user.id;
  user2Id = login2.user.id;

  console.log(`✅ Usuario 1: ${login1.user.email} (${user1Id})`);
  console.log(`✅ Usuario 2: ${login2.user.email} (${user2Id})\n`);

  // 2. Conectar sockets
  console.log('🔌 FASE 2: CONECTAR WEBSOCKETS');
  const socket1 = await connectSocket(user1Token, user1Id);
  const socket2 = await connectSocket(user2Token, user2Id);

  if (!socket1 || !socket2) {
    console.error('❌ Error conectando sockets');
    return;
  }

  console.log('✅ Ambos sockets conectados\n');

  // 3. Configurar listeners
  socket1.on('message:new', (data) => {
    console.log(`📨 Usuario 1 recibió mensaje: "${data.message?.content || 'Sin contenido'}"`);
  });

  socket2.on('message:new', (data) => {
    console.log(`📨 Usuario 2 recibió mensaje: "${data.message?.content || 'Sin contenido'}"`);
  });

  // 4. Enviar mensajes
  console.log('💬 FASE 3: ENVÍO DE MENSAJES');
  
  // Usuario 1 envía a Usuario 2
  await sendMessage(user1Token, user2Id, '¡Hola! ¿Cómo estás?');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  
  // Usuario 2 responde a Usuario 1
  await sendMessage(user2Token, user1Id, '¡Hola! Muy bien, gracias. ¿Y tú?');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Usuario 1 responde
  await sendMessage(user1Token, user2Id, 'Todo genial. ¿Cómo va el trabajo?');
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\n📋 FASE 4: VERIFICAR CONVERSACIONES Y MENSAJES');

  // 5. Obtener conversaciones
  console.log('\n--- Conversaciones de Usuario 1 ---');
  const conversations1 = await getConversations(user1Token);
  console.log(`✅ ${conversations1.length} conversaciones encontradas`);
  
  console.log('\n--- Conversaciones de Usuario 2 ---');
  const conversations2 = await getConversations(user2Token);
  console.log(`✅ ${conversations2.length} conversaciones encontradas`);

  // 6. Obtener mensajes
  console.log('\n--- Mensajes entre usuarios ---');
  const messages1 = await getMessages(user1Token, user2Id);
  const messages2 = await getMessages(user2Token, user1Id);
  
  console.log(`✅ Usuario 1 ve ${messages1.length} mensajes en la conversación`);
  console.log(`✅ Usuario 2 ve ${messages2.length} mensajes en la conversación`);

  // Mostrar mensajes
  if (messages1.length > 0) {
    console.log('\n📝 Historial de mensajes:');
    messages1.forEach((msg, i) => {
      const sender = msg.senderId === user1Id ? 'Usuario 1' : 'Usuario 2';
      const time = new Date(msg.createdAt).toLocaleTimeString();
      console.log(`  ${i + 1}. [${time}] ${sender}: ${msg.content}`);
    });
  }

  // 7. Resultados finales
  console.log('\n📊 === RESULTADOS FINALES ===');
  const totalTests = 8; // login(2) + sockets(2) + mensajes(3) + verificación(1)
  let passedTests = 0;

  if (login1 && login2) passedTests += 2;
  if (socket1 && socket2) passedTests += 2;
  if (messages1.length >= 3) passedTests += 3; // 3 mensajes enviados
  if (conversations1.length > 0 && conversations2.length > 0) passedTests += 1;

  console.log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`);
  console.log(`📈 Tasa de éxito: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ¡SISTEMA DE MENSAJERÍA COMPLETAMENTE FUNCIONAL!');
    console.log('\n🌟 Funcionalidades verificadas:');
    console.log('   ✅ Autenticación JWT');
    console.log('   ✅ Conexión WebSocket en tiempo real');
    console.log('   ✅ Envío de mensajes');
    console.log('   ✅ Almacenamiento en base de datos');
    console.log('   ✅ Recuperación de historial');
    console.log('   ✅ Lista de conversaciones');
    console.log('\n🚀 Ahora puedes usar el frontend en http://localhost:3000');
  } else {
    console.log('\n⚠️  Algunos componentes necesitan revisión.');
  }

  // Cleanup
  socket1.disconnect();
  socket2.disconnect();
}

// Ejecutar prueba
testCompleteMessagingFlow().catch(console.error);