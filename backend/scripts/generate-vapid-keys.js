const webpush = require('web-push');

// Generar VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('=== VAPID Keys Generadas ===');
console.log('\nAgregar al archivo .env del backend:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@lapublica.es`);
console.log('\nAgregar al archivo .env del frontend:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log('\n===========================');