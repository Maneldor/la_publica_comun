const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const testMessage = {
  recipientId: 'test-recipient-id',
  content: 'Hola, este es un mensaje de prueba',
  subject: 'Mensaje de prueba'
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint}:`, response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.response?.status || 'ERROR', error.response?.statusText || error.message);
    if (error.response?.data) {
      console.log('   Error details:', error.response.data);
    }
    return null;
  }
}

async function testEndpoints() {
  console.log('🧪 Probando endpoints de La Pública...\n');

  // Test 1: Health check
  console.log('1. Probando health check:');
  await makeRequest('GET', '/health');
  console.log('');

  // Test 2: Auth endpoints (will fail without DB but should return proper errors)
  console.log('2. Probando endpoints de autenticación:');
  await makeRequest('POST', '/auth/register', testUser);
  await makeRequest('POST', '/auth/login', testUser);
  console.log('');

  // Test 3: Messaging endpoints (should require auth)
  console.log('3. Probando endpoints de mensajería (sin autenticación):');
  await makeRequest('GET', '/messaging/conversations');
  await makeRequest('GET', '/messaging/users/search', null, null);
  await makeRequest('POST', '/messaging/messages', testMessage);
  console.log('');

  // Test 4: Push notification endpoints (should require auth)
  console.log('4. Probando endpoints de push notifications:');
  await makeRequest('POST', '/messaging/push/subscribe', { subscription: { endpoint: 'test' } });
  await makeRequest('POST', '/messaging/push/test');
  console.log('');

  // Test 5: Admin endpoints (should require auth)
  console.log('5. Probando endpoints de admin:');
  await makeRequest('GET', '/admin/dashboard');
  await makeRequest('GET', '/admin/users');
  console.log('');

  // Test 6: AI Chat endpoints (should require auth)
  console.log('6. Probando endpoints de AI Chat:');
  await makeRequest('POST', '/ai-chat/send', { message: 'Hola' });
  console.log('');

  console.log('🏁 Pruebas completadas. Los errores 401/403 son esperados sin autenticación.');
  console.log('Los errores 500 pueden indicar problemas de configuración o base de datos.');
}

// Run tests
testEndpoints().catch(console.error);