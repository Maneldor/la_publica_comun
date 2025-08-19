// Service Worker para Push Notifications

const CACHE_NAME = 'la-publica-v2';
const STATIC_CACHE = 'la-publica-static-v2';
const DYNAMIC_CACHE = 'la-publica-dynamic-v2';
const IMAGE_CACHE = 'la-publica-images-v2';

// URLs críticas para cachear inmediatamente
const CRITICAL_URLS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline',
  '/_next/static/css/',
  '/_next/static/chunks/'
];

// URLs que deben cachearse dinámicamente
const CACHE_STRATEGIES = {
  '/api/': 'networkFirst',
  '/dashboard': 'staleWhileRevalidate',
  '/mensajes': 'staleWhileRevalidate',
  '/grupos': 'staleWhileRevalidate',
  '/perfil': 'staleWhileRevalidate',
  '/_next/': 'cacheFirst',
  '/uploads/': 'cacheFirst'
};

// Configuración de TTL para diferentes tipos de contenido
const CACHE_TTL = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 días
  api: 5 * 60 * 1000, // 5 minutos
  images: 30 * 24 * 60 * 60 * 1000, // 30 días
  dynamic: 24 * 60 * 60 * 1000 // 1 día
};

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cachear recursos críticos
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('📦 Cacheando recursos críticos');
          return cache.addAll(CRITICAL_URLS.filter(url => !url.endsWith('/')));
        }),
      
      // Precachear la página principal
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          console.log('🏠 Cacheando página principal');
          return cache.add('/');
        })
    ])
    .then(() => {
      console.log('✅ Service Worker instalado correctamente');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('❌ Error instalando Service Worker:', error);
    })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        console.log('🧹 Limpiando caches antiguos');
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('🗑️ Eliminando cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control de todas las pestañas
      self.clients.claim()
    ])
    .then(() => {
      console.log('✅ Service Worker activado y en control');
      
      // Notificar a los clientes que el SW está listo
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: 'v2'
          });
        });
      });
    })
  );
});

// Interceptar peticiones de red con estrategias avanzadas
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar peticiones no HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorar peticiones del propio SW
  if (url.pathname.startsWith('/sw.js') || url.pathname.startsWith('/_next/static/chunks/webpack')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Función principal para manejar peticiones
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Determinar estrategia de cache
    let strategy = 'networkFirst'; // Por defecto
    
    for (const [pattern, cacheStrategy] of Object.entries(CACHE_STRATEGIES)) {
      if (pathname.startsWith(pattern)) {
        strategy = cacheStrategy;
        break;
      }
    }
    
    // Aplicar estrategia correspondiente
    switch (strategy) {
      case 'cacheFirst':
        return await cacheFirst(request);
      case 'networkFirst':
        return await networkFirst(request);
      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request);
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error('❌ Error en handleRequest:', error);
    return await handleOffline(request);
  }
}

// Estrategia Cache First (para recursos estáticos)
async function cacheFirst(request) {
  const url = new URL(request.url);
  const cacheName = url.pathname.includes('uploads/') ? IMAGE_CACHE : STATIC_CACHE;
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached && !isExpired(cached, CACHE_TTL.static)) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clonar para poder almacenar y devolver
      const responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    return response;
  } catch (error) {
    // Si hay error de red y tenemos cache (aunque esté expirado), devolverlo
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Estrategia Network First (para APIs y contenido dinámico)
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Solo cachear GET requests exitosos
      if (request.method === 'GET') {
        const responseClone = response.clone();
        await cache.put(request, responseClone);
      }
    }
    return response;
  } catch (error) {
    // Intentar desde cache si la red falla
    const cached = await cache.match(request);
    if (cached) {
      console.log('📡 Red falló, sirviendo desde cache:', request.url);
      return cached;
    }
    throw error;
  }
}

// Estrategia Stale While Revalidate (para páginas principales)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  // Actualizar en segundo plano
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok && request.method === 'GET') {
        const responseClone = response.clone();
        cache.put(request, responseClone);
      }
      return response;
    })
    .catch(error => {
      console.error('🔄 Error actualizando cache:', error);
    });
  
  // Devolver cache inmediatamente si existe
  if (cached && !isExpired(cached, CACHE_TTL.dynamic)) {
    return cached;
  }
  
  // Si no hay cache o está muy expirado, esperar a la red
  try {
    return await networkPromise;
  } catch (error) {
    // Si la red falla y tenemos cache (aunque esté expirado), devolverlo
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Verificar si una respuesta en cache ha expirado
function isExpired(response, ttl) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseTime = new Date(dateHeader).getTime();
  const now = Date.now();
  
  return (now - responseTime) > ttl;
}

// Manejar cuando estamos offline
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Intentar desde cualquier cache disponible
  const caches_list = [DYNAMIC_CACHE, STATIC_CACHE, IMAGE_CACHE];
  
  for (const cacheName of caches_list) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      console.log('📱 Sirviendo offline desde cache:', request.url);
      return cached;
    }
  }
  
  // Para navegación, devolver página offline
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Para APIs, devolver respuesta JSON de error
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        error: 'Sin conexión',
        message: 'Esta funcionalidad requiere conexión a internet',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
  
  // Para otros recursos, devolver respuesta de error
  return new Response('Sin conexión', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Manejar push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Push notification recibida:', event);

  if (!event.data) {
    console.log('❌ Push sin datos');
    return;
  }

  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (e) {
    console.error('❌ Error parseando datos push:', e);
    notificationData = {
      title: 'Nueva notificación',
      body: event.data.text() || 'Tienes una nueva notificación'
    };
  }

  // Configurar opciones específicas según el tipo de notificación
  const {
    type = 'message',
    title = 'La Pública',
    body = 'Nueva notificación',
    senderName,
    messageContent,
    conversationId,
    messageId,
    userId
  } = notificationData;

  let finalTitle = title;
  let finalBody = body;
  let actions = [];

  // Personalizar según el tipo de notificación
  switch (type) {
    case 'new_message':
      finalTitle = `💬 ${senderName}`;
      finalBody = messageContent || 'Te ha enviado un mensaje';
      actions = [
        {
          action: 'reply',
          title: '✍️ Responder',
          icon: '/icon-reply.png'
        },
        {
          action: 'mark_read',
          title: '✅ Marcar leído',
          icon: '/icon-check.png'
        }
      ];
      break;
    case 'message_reaction':
      finalTitle = `😊 ${senderName}`;
      finalBody = `Reaccionó a tu mensaje`;
      actions = [
        {
          action: 'view',
          title: '👀 Ver mensaje',
          icon: '/icon-view.png'
        }
      ];
      break;
    case 'call_incoming':
      finalTitle = `📞 Llamada entrante`;
      finalBody = `${senderName} te está llamando`;
      actions = [
        {
          action: 'answer',
          title: '📞 Contestar',
          icon: '/icon-phone.png'
        },
        {
          action: 'decline',
          title: '❌ Rechazar',
          icon: '/icon-decline.png'
        }
      ];
      break;
  }

  const options = {
    body: finalBody,
    icon: notificationData.icon || '/icon-192x192.png',
    badge: notificationData.badge || '/badge-72x72.png',
    image: notificationData.image,
    tag: `${type}_${conversationId || 'default'}`,
    data: {
      type,
      conversationId,
      messageId,
      userId,
      senderName,
      url: conversationId ? `/?conversation=${conversationId}` : '/',
      ...notificationData.data
    },
    actions,
    requireInteraction: type === 'call_incoming', // Llamadas requieren interacción
    silent: notificationData.silent || false,
    vibrate: type === 'call_incoming' ? [300, 100, 300, 100, 300] : [200, 100, 200],
    timestamp: notificationData.timestamp || Date.now(),
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(finalTitle, options)
  );
});

// Manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Click en notificación:', event);

  const notification = event.notification;
  const data = notification.data || {};
  const action = event.action;

  notification.close();

  // Manejar acciones específicas
  switch (action) {
    case 'reply':
      console.log('✍️ Acción: Responder');
      event.waitUntil(openAppAndNavigate(data.url, 'reply'));
      break;
      
    case 'mark_read':
      console.log('✅ Acción: Marcar como leído');
      event.waitUntil(markMessageAsRead(data));
      break;
      
    case 'view':
      console.log('👀 Acción: Ver mensaje');
      event.waitUntil(openAppAndNavigate(data.url));
      break;
      
    case 'answer':
      console.log('📞 Acción: Contestar llamada');
      event.waitUntil(openAppAndNavigate(data.url, 'answer_call'));
      break;
      
    case 'decline':
      console.log('❌ Acción: Rechazar llamada');
      event.waitUntil(declineCall(data));
      break;
      
    case 'dismiss':
      console.log('🚫 Acción: Descartar');
      return;
      
    default:
      console.log('🏠 Acción por defecto: Abrir app');
      event.waitUntil(openAppAndNavigate(data.url || '/'));
  }
});

// Función para abrir la app y navegar
async function openAppAndNavigate(url = '/', action = null) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });

  // Buscar ventana existente
  for (const client of clients) {
    if (client.url.includes(self.location.origin)) {
      // Enviar mensaje para realizar acción específica
      if (action) {
        client.postMessage({
          type: 'NOTIFICATION_ACTION',
          action,
          url
        });
      }
      
      // Navegar si es necesario
      if (url !== '/') {
        client.postMessage({
          type: 'NAVIGATE',
          url
        });
      }
      
      return client.focus();
    }
  }

  // No hay ventana abierta, abrir nueva
  const fullUrl = action ? `${url}?action=${action}` : url;
  return self.clients.openWindow(fullUrl);
}

// Función para marcar mensaje como leído
async function markMessageAsRead(data) {
  const { messageId, conversationId, userId } = data;
  
  if (!messageId && !conversationId) {
    console.log('❌ No hay ID de mensaje o conversación para marcar como leído');
    return;
  }

  try {
    // Primero intentar obtener el token desde IndexedDB o localStorage
    // En un SW real, necesitarías almacenar el token de forma segura
    const response = await fetch('http://localhost:3001/api/messaging/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // TODO: Obtener token de forma segura
      },
      body: JSON.stringify({
        messageId,
        conversationId,
        userId
      })
    });

    if (response.ok) {
      console.log('✅ Mensaje marcado como leído');
      
      // Mostrar notificación de confirmación
      self.registration.showNotification('✅ Mensaje marcado como leído', {
        tag: 'mark_read_success',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        silent: true,
        timestamp: Date.now()
      });
    } else {
      console.error('❌ Error marcando mensaje como leído:', response.status);
    }
  } catch (error) {
    console.error('❌ Error en markMessageAsRead:', error);
  }
}

// Función para rechazar llamada
async function declineCall(data) {
  const { conversationId, userId, callId } = data;
  
  try {
    const response = await fetch('http://localhost:3001/api/calls/decline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // TODO: Obtener token de forma segura
      },
      body: JSON.stringify({
        callId,
        conversationId,
        userId,
        reason: 'declined_from_notification'
      })
    });

    if (response.ok) {
      console.log('✅ Llamada rechazada');
    } else {
      console.error('❌ Error rechazando llamada:', response.status);
    }
  } catch (error) {
    console.error('❌ Error en declineCall:', error);
  }
}

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event);
  
  // Aquí podrías enviar analytics sobre notificaciones cerradas
  const data = event.notification.data || {};
  if (data.trackClose) {
    // Enviar evento de tracking
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Realizar tareas de sincronización
      console.log('Sincronización en segundo plano')
    );
  }
});

// Manejar mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});