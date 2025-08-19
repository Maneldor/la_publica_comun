const http = require('http');
const path = require('path');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>La Pública - Test</title>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; padding: 50px; text-align: center;">
        <h1>🎉 ¡Servidor funcionando!</h1>
        <p>Si puedes ver este mensaje, el servidor está corriendo correctamente en el puerto 3000.</p>
        <p>Directorio: ${__dirname}</p>
        <p>URL solicitada: ${req.url}</p>
        <p>Hora: ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor HTTP simple corriendo en http://localhost:${PORT}`);
  console.log(`📁 Directorio: ${__dirname}`);
  console.log(`🌐 También accesible en http://127.0.0.1:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Error del servidor:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`Puerto ${PORT} está en uso. Intentando con puerto 3001...`);
    server.listen(3001, '0.0.0.0');
  }
});