const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

// Test users to register
const testUsers = [
  {
    email: 'empleado1@madrid.es',
    password: 'test123',
    role: 'EMPLEADO_PUBLICO',
    firstName: 'Ana',
    lastName: 'García',
    community: 'MADRID'
  },
  {
    email: 'empleado2@cat.gencat.cat',
    password: 'test123', 
    role: 'EMPLEADO_PUBLICO',
    firstName: 'Joan',
    lastName: 'Martí',
    community: 'CATALUNYA'
  },
  {
    email: 'empresa@techsoft.es',
    password: 'test123',
    role: 'EMPRESA',
    companyName: 'TechSoft Solutions',
    cif: 'B12345678',
    sector: 'Tecnología'
  }
];

async function testHealthCheck() {
  try {
    console.log('🔍 Verificando estado del servidor...');
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Servidor online:', data.message);
    console.log('📊 Características:', data.features);
    return true;
  } catch (error) {
    console.error('❌ Error en health check:', error.message);
    return false;
  }
}

async function testRegisterUser(userData) {
  try {
    console.log(`\n👤 Registrando usuario: ${userData.email}`);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 400 && data.message.includes('already exists')) {
        console.log('ℹ️  Usuario ya existe, continuando...');
        return { success: true, user: { email: userData.email }, existed: true };
      }
      throw new Error(data.message || 'Registration failed');
    }

    console.log('✅ Usuario registrado exitosamente');
    console.log(`   - ID: ${data.data.user.id}`);
    console.log(`   - Email: ${data.data.user.email}`);
    console.log(`   - Role: ${data.data.user.role}`);
    
    return { success: true, user: data.data.user, tokens: data.data.tokens };
  } catch (error) {
    console.error('❌ Error en registro:', error.message);
    return { success: false, error: error.message };
  }
}

async function testLoginUser(email, password) {
  try {
    console.log(`\n🔐 Iniciando sesión: ${email}`);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log('✅ Login exitoso');
    console.log(`   - Usuario: ${data.data.user.email}`);
    console.log(`   - Token: ${data.data.tokens.accessToken.substring(0, 20)}...`);
    
    return { success: true, user: data.data.user, tokens: data.data.tokens };
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    return { success: false, error: error.message };
  }
}

async function testGetProfile(token) {
  try {
    console.log('\n👤 Obteniendo perfil de usuario...');
    
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Get profile failed');
    }

    console.log('✅ Perfil obtenido exitosamente');
    console.log(`   - Email: ${data.data.user.email}`);
    console.log(`   - Role: ${data.data.user.role}`);
    
    return { success: true, user: data.data.user };
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error.message);
    return { success: false, error: error.message };
  }
}

async function testMessaging(token, userId) {
  try {
    console.log('\n💬 Probando sistema de mensajería...');
    
    // Test get conversations
    const conversationsResponse = await fetch(`${API_BASE_URL}/api/messaging/conversations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (conversationsResponse.ok) {
      const conversationsData = await conversationsResponse.json();
      console.log(`✅ Conversaciones obtenidas: ${conversationsData.data.length} encontradas`);
    }
    
    // Test search users
    const searchResponse = await fetch(`${API_BASE_URL}/api/messaging/users/search?q=test`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log(`✅ Búsqueda de usuarios: ${searchData.data.length} usuarios encontrados`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error en mensajería:', error.message);
    return { success: false, error: error.message };
  }
}

async function runCompleteTest() {
  console.log('🚀 Iniciando prueba completa del sistema de autenticación\n');
  
  // 1. Health check
  const isServerOnline = await testHealthCheck();
  if (!isServerOnline) {
    console.log('\n❌ El servidor no está disponible. Por favor inicia el servidor con:');
    console.log('   node auth-server-simple.js');
    return;
  }

  let successCount = 0;
  let totalTests = 0;

  // 2. Register users
  console.log('\n📝 === FASE 1: REGISTRO DE USUARIOS ===');
  
  for (const userData of testUsers) {
    totalTests++;
    const result = await testRegisterUser(userData);
    if (result.success) successCount++;
  }

  // 3. Login users and test functionality
  console.log('\n🔐 === FASE 2: LOGIN Y PRUEBAS DE FUNCIONALIDAD ===');
  
  for (const userData of testUsers) {
    totalTests += 3; // login + profile + messaging
    
    // Login
    const loginResult = await testLoginUser(userData.email, userData.password);
    if (loginResult.success) {
      successCount++;
      
      // Get profile
      const profileResult = await testGetProfile(loginResult.tokens.accessToken);
      if (profileResult.success) successCount++;
      
      // Test messaging
      const messagingResult = await testMessaging(loginResult.tokens.accessToken, loginResult.user.id);
      if (messagingResult.success) successCount++;
    }
  }

  // 4. Results
  console.log('\n📊 === RESULTADOS FINALES ===');
  console.log(`✅ Pruebas exitosas: ${successCount}/${totalTests}`);
  console.log(`📈 Tasa de éxito: ${((successCount/totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
    console.log('\n🌟 El sistema de autenticación está funcionando correctamente.');
    console.log('Ahora puedes probar en el frontend:');
    console.log('1. Ir a http://localhost:3000/auth/register');
    console.log('2. Ir a http://localhost:3000/auth/login');  
    console.log('3. Ir a http://localhost:3000/dashboard después del login');
  } else {
    console.log('\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
  }
}

// Run the test
runCompleteTest().catch(console.error);