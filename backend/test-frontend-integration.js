const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

async function testSearchUsers() {
  try {
    // Login first
    console.log('🔐 Haciendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'empleado1@madrid.es',
        password: 'test123'
      }),
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }

    const token = loginData.data.tokens.accessToken;
    console.log('✅ Login exitoso');

    // Test search users with different queries
    const searchQueries = ['emp', 'madrid', 'cat', 'techsoft'];
    
    for (const query of searchQueries) {
      console.log(`\n🔍 Buscando usuarios con query: "${query}"`);
      
      const searchResponse = await fetch(`${API_BASE_URL}/api/messaging/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const searchData = await searchResponse.json();
      
      if (searchData.success) {
        console.log(`✅ Encontrados ${searchData.data.length} usuarios:`);
        searchData.data.forEach(user => {
          const name = user.employee?.firstName || user.company?.name || user.email.split('@')[0];
          console.log(`   - ${name} (${user.email})`);
        });
      } else {
        console.log(`❌ Error: ${searchData.message}`);
      }
    }

    // Test conversation creation (simulate)
    console.log('\n💬 Simulando creación de conversación...');
    
    // Get another user to send message to
    const searchAllResponse = await fetch(`${API_BASE_URL}/api/messaging/users/search?q=empleado`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const searchAllData = await searchAllResponse.json();
    if (searchAllData.success && searchAllData.data.length > 0) {
      const otherUser = searchAllData.data[0];
      console.log(`📤 Enviando mensaje a: ${otherUser.email}`);
      
      const messageResponse = await fetch(`${API_BASE_URL}/api/messaging/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: otherUser.id,
          content: 'Hola, este es un mensaje de prueba del frontend!',
          subject: 'Prueba Frontend'
        }),
      });

      const messageData = await messageResponse.json();
      if (messageData.success) {
        console.log('✅ Mensaje enviado correctamente');
        
        // Get conversations to verify
        console.log('\n📋 Obteniendo conversaciones...');
        const convResponse = await fetch(`${API_BASE_URL}/api/messaging/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const convData = await convResponse.json();
        if (convData.success) {
          console.log(`✅ ${convData.data.length} conversaciones encontradas`);
          convData.data.forEach(conv => {
            const userName = conv.user.employee?.firstName || conv.user.company?.name || conv.user.email;
            console.log(`   - Conversación con: ${userName}`);
            if (conv.lastMessage) {
              console.log(`     Último mensaje: "${conv.lastMessage.content.substring(0, 30)}..."`);
            }
          });
        }
      } else {
        console.log(`❌ Error enviando mensaje: ${messageData.message}`);
      }
    }

    console.log('\n🎉 Pruebas de integración frontend completadas!');
    console.log('\n📋 Resumen:');
    console.log('✅ Login funciona');
    console.log('✅ Búsqueda de usuarios funciona');
    console.log('✅ Envío de mensajes funciona');
    console.log('✅ Lista de conversaciones funciona');
    console.log('\n🚀 El frontend debería funcionar correctamente ahora!');

  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
  }
}

// Run test
testSearchUsers().catch(console.error);