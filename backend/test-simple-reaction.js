const fetch = require('node-fetch');

async function testSimpleReaction() {
  console.log('🧪 Prueba simple de reacción...\n');

  try {
    // 1. Login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'empleado2@cat.gencat.cat',
        password: 'test123'
      }),
    });

    const loginData = await loginResponse.json();
    const token = loginData.data.tokens.accessToken;
    console.log('✅ Login exitoso');

    // 2. Probar agregar reacción
    const messageId = 'cmdyhg0xt0005zp2epn72ufeu';
    console.log(`🎯 Probando reacción en mensaje: ${messageId}`);
    
    const reactionResponse = await fetch(`http://localhost:3001/api/messaging/messages/${messageId}/reactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emoji: '👍' }),
    });

    console.log(`📊 Status: ${reactionResponse.status}`);
    console.log(`📊 Status Text: ${reactionResponse.statusText}`);
    
    const responseText = await reactionResponse.text();
    console.log(`📄 Response: ${responseText}`);

    if (reactionResponse.ok) {
      const reactionData = JSON.parse(responseText);
      console.log('✅ Reacción agregada:', reactionData);
    } else {
      console.log('❌ Error al agregar reacción');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSimpleReaction();