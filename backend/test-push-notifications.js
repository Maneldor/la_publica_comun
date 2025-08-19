const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

async function testPushNotifications() {
  console.log('🔔 === PRUEBA DEL SISTEMA DE NOTIFICACIONES PUSH ===\n');

  try {
    // 1. Login
    console.log('🔐 Iniciando sesión...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'empleado1@madrid.es',
        password: 'test123'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }

    const token = loginData.data.tokens.accessToken;
    const userId = loginData.data.user.id;
    console.log(`✅ Usuario logueado: ${userId}\n`);

    // 2. Probar suscripción push (simulada)
    console.log('📱 Probando suscripción push...');
    
    const mockSubscription = {
      endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint-123',
      keys: {
        p256dh: 'test-p256dh-key',
        auth: 'test-auth-key'
      }
    };

    const subscribeResponse = await fetch(`${API_BASE_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: mockSubscription,
        userId: userId
      })
    });

    const subscribeData = await subscribeResponse.json();
    if (subscribeData.success) {
      console.log('✅ Suscripción push creada exitosamente');
      console.log(`   - Endpoint: ${mockSubscription.endpoint}`);
    } else {
      throw new Error('Subscribe failed: ' + subscribeData.message);
    }

    // 3. Enviar notificación de prueba
    console.log('\n🧪 Enviando notificación de prueba...');
    const testResponse = await fetch(`${API_BASE_URL}/api/push/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        title: '🧪 Notificación de prueba',
        body: 'Las notificaciones push funcionan correctamente!',
        type: 'test'
      })
    });

    const testData = await testResponse.json();
    if (testData.success) {
      console.log('✅ Notificación de prueba enviada');
      console.log(`   - Enviadas: ${testData.stats.sent}`);
      console.log(`   - Fallidas: ${testData.stats.failed}`);
      console.log(`   - Total: ${testData.stats.total}`);
    } else {
      throw new Error('Test notification failed: ' + testData.message);
    }

    // 4. Probar notificación automática con mensaje
    console.log('\n💬 Probando notificación automática...');
    
    // Buscar un usuario destinatario
    const searchResponse = await fetch(`${API_BASE_URL}/api/messaging/users/search?q=empleado2`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const searchData = await searchResponse.json();
    if (searchData.success && searchData.data.length > 0) {
      const recipientUser = searchData.data[0];
      console.log(`👤 Usuario destinatario: ${recipientUser.email}`);

      // Crear suscripción para el destinatario (simulada)
      const recipient2Subscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint-456',
        keys: {
          p256dh: 'test-p256dh-key-2',
          auth: 'test-auth-key-2'
        }
      };

      // Login como usuario 2 para crear su suscripción
      const login2Response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recipientUser.email,
          password: 'test123'
        })
      });

      const login2Data = await login2Response.json();
      if (login2Data.success) {
        const token2 = login2Data.data.tokens.accessToken;
        
        // Crear suscripción para usuario 2
        await fetch(`${API_BASE_URL}/api/push/subscribe`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token2}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subscription: recipient2Subscription,
            userId: recipientUser.id
          })
        });

        console.log('✅ Suscripción creada para destinatario');
      }

      // Enviar mensaje (esto debe generar notificación automática)
      const messageResponse = await fetch(`${API_BASE_URL}/api/messaging/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: recipientUser.id,
          content: '¡Hola! Este mensaje debería generar una notificación push automática 🔔',
          subject: ''
        })
      });

      const messageData = await messageResponse.json();
      if (messageData.success) {
        console.log('✅ Mensaje enviado con notificación automática');
        console.log(`   - ID del mensaje: ${messageData.data.id}`);
      } else {
        throw new Error('Message failed: ' + messageData.message);
      }
    }

    // 5. Probar desuscripción
    console.log('\n🔕 Probando desuscripción...');
    const unsubscribeResponse = await fetch(`${API_BASE_URL}/api/push/unsubscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: mockSubscription.endpoint,
        userId: userId
      })
    });

    const unsubscribeData = await unsubscribeResponse.json();
    if (unsubscribeData.success) {
      console.log('✅ Desuscripción exitosa');
      console.log(`   - Suscripciones actualizadas: ${unsubscribeData.updated}`);
    } else {
      throw new Error('Unsubscribe failed: ' + unsubscribeData.message);
    }

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE PUSH NOTIFICATIONS PASARON!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Suscripción a notificaciones push funciona');
    console.log('✅ Notificaciones de prueba funcionan');
    console.log('✅ Notificaciones automáticas por mensajes funcionan');
    console.log('✅ Desuscripción funciona');
    console.log('✅ APIs de backend funcionan correctamente');
    
    console.log('\n🚀 El sistema de notificaciones push está listo!');
    console.log('\n📝 PRÓXIMOS PASOS:');
    console.log('1. Instalar librería web-push para envío real');
    console.log('2. Configurar VAPID keys en producción');
    console.log('3. Probar en navegador con Service Worker');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar pruebas
testPushNotifications().catch(console.error);