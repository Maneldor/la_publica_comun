const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>Servidor de prueba funcionando</h1>
        <p>Puerto: 3002</p>
        <p>Hora: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

server.listen(3002, '127.0.0.1', () => {
  console.log('Servidor de prueba corriendo en http://127.0.0.1:3002');
});

server.on('error', (err) => {
  console.error('Error del servidor:', err);
});