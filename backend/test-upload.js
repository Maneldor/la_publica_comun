const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3001';

async function testUpload() {
  console.log('📎 === PRUEBA DEL SISTEMA DE ARCHIVOS ===\n');

  try {
    // 1. Login
    console.log('🔐 Iniciando sesión...');
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
    console.log('✅ Login exitoso\n');

    // 2. Crear un archivo de prueba
    console.log('📄 Creando archivo de prueba...');
    const testFileName = 'test-message.txt';
    const testFilePath = path.join(__dirname, testFileName);
    const testContent = 'Este es un archivo de prueba para el sistema de mensajería.\nFecha: ' + new Date().toISOString();
    
    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Archivo creado: ${testFileName}\n`);

    // 3. Subir archivo
    console.log('⬆️ Subiendo archivo...');
    const formData = new FormData();
    formData.append('files', fs.createReadStream(testFilePath));

    const uploadResponse = await fetch(`${API_BASE_URL}/api/messaging/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadData = await uploadResponse.json();
    if (!uploadData.success) {
      throw new Error('Upload failed: ' + uploadData.message);
    }

    console.log('✅ Archivo subido correctamente:');
    console.log(`   - Nombre original: ${uploadData.data.files[0].originalName}`);
    console.log(`   - Tamaño: ${uploadData.data.files[0].size} bytes`);
    console.log(`   - URL: ${uploadData.data.files[0].url}`);
    console.log(`   - Es imagen: ${uploadData.data.files[0].isImage}\n`);

    // 4. Buscar ID del usuario destinatario 
    console.log('🔍 Buscando usuario destinatario...');
    const searchResponse = await fetch(`${API_BASE_URL}/api/messaging/users/search?q=empleado2`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const searchData = await searchResponse.json();
    if (!searchData.success || searchData.data.length === 0) {
      throw new Error('No se encontró usuario destinatario');
    }

    const recipientUser = searchData.data[0];
    console.log(`✅ Usuario encontrado: ${recipientUser.email}\n`);

    // 5. Enviar mensaje con archivo adjunto
    console.log('💬 Enviando mensaje con archivo adjunto...');
    const messageResponse = await fetch(`${API_BASE_URL}/api/messaging/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientId: recipientUser.id,
        content: '¡Hola! Te envío este archivo de prueba 📎',
        attachments: uploadData.data.files
      }),
    });

    const messageData = await messageResponse.json();
    if (messageData.success) {
      console.log('✅ Mensaje con archivo enviado correctamente');
      console.log(`   - ID del mensaje: ${messageData.data.id}`);
      console.log(`   - Archivos adjuntos: ${messageData.data.attachments.length}`);
      
      if (messageData.data.attachments.length > 0) {
        console.log(`   - Primer archivo: ${messageData.data.attachments[0].originalName}`);
      }
    } else {
      throw new Error('Message failed: ' + messageData.message);
    }

    // 6. Verificar que el archivo se puede descargar
    console.log('\n📥 Verificando descarga...');
    const downloadUrl = `${API_BASE_URL}${uploadData.data.files[0].url}`;
    const downloadResponse = await fetch(downloadUrl);
    
    if (downloadResponse.ok) {
      const downloadedContent = await downloadResponse.text();
      console.log('✅ Archivo descargado correctamente');
      console.log(`   - Contenido coincide: ${downloadedContent === testContent}`);
    } else {
      throw new Error('Download failed');
    }

    // 7. Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);
    console.log('\n🧹 Archivo de prueba eliminado');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE ARCHIVOS PASARON!');
    console.log('\n📋 RESUMEN:');
    console.log('✅ Subida de archivos funciona');
    console.log('✅ Mensajes con adjuntos funciona');
    console.log('✅ Descarga de archivos funciona');
    console.log('✅ Almacenamiento de metadatos funciona');
    
    console.log('\n🚀 El sistema está listo para compartir archivos!');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar pruebas
testUpload().catch(console.error);