# Sistema de Preview de Enlaces - Uso y Ejemplos

## Descripción General

El sistema de preview de enlaces permite detectar automáticamente URLs en mensajes del chat y generar previews con metadatos como título, descripción e imagen. El sistema funciona tanto de manera automática al enviar mensajes como a través de endpoints específicos.

## Endpoints Disponibles

### 1. Obtener Preview de una URL

```http
GET /api/messaging/link-preview?url=https://example.com
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "domain": "example.com",
    "title": "Título de la página",
    "description": "Descripción de la página",
    "image": "https://example.com/image.jpg",
    "siteName": "Example Site"
  }
}
```

### 2. Obtener Previews de Múltiples URLs

```http
POST /api/messaging/link-previews
Content-Type: application/json

{
  "urls": [
    "https://example.com",
    "https://another-site.com"
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://example.com",
      "domain": "example.com",
      "title": "Título de la página",
      "description": "Descripción de la página",
      "image": "https://example.com/image.jpg",
      "siteName": "Example Site"
    },
    {
      "url": "https://another-site.com",
      "domain": "another-site.com",
      "title": "Otro sitio",
      "description": "Descripción del otro sitio"
    }
  ]
}
```

### 3. Detectar URLs en Texto

```http
POST /api/messaging/detect-urls
Content-Type: application/json

{
  "text": "Mira este enlace https://example.com y también https://google.com"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "urls": [
      "https://example.com",
      "https://google.com"
    ],
    "count": 2
  }
}
```

## Envío de Mensajes con Link Previews

Cuando envías un mensaje que contiene URLs, el sistema automáticamente:

1. Detecta las URLs en el contenido
2. Genera previews para las URLs detectadas
3. Almacena los previews en el campo `linkPreviews` del mensaje

```http
POST /api/messaging/messages
Content-Type: application/json

{
  "recipientId": "user123",
  "content": "Te recomiendo este artículo: https://example.com/article",
  "subject": "Artículo interesante"
}
```

**Respuesta incluirá los link previews:**
```json
{
  "success": true,
  "data": {
    "id": "msg123",
    "senderId": "sender123",
    "recipientId": "user123",
    "subject": "Artículo interesante",
    "content": "Te recomiendo este artículo: https://example.com/article",
    "linkPreviews": "[{\"url\":\"https://example.com/article\",\"title\":\"Título del Artículo\",\"description\":\"Descripción del artículo\",\"image\":\"https://example.com/image.jpg\",\"domain\":\"example.com\"}]",
    "status": "SENT",
    "createdAt": "2025-08-05T12:00:00.000Z",
    // ... otros campos
  }
}
```

## Características del Sistema

### Seguridad
- ✅ Valida URLs para prevenir ataques SSRF
- ✅ Bloquea acceso a localhost e IPs privadas
- ✅ Timeout de 10 segundos para requests
- ✅ Límite de tamaño de contenido (2MB)
- ✅ User-Agent personalizado

### Rendimiento
- ✅ Procesa máximo 3 URLs por mensaje
- ✅ Procesamiento en paralelo de múltiples URLs
- ✅ Manejo robusto de errores (no falla el mensaje si falla el preview)
- ✅ Límites de longitud para metadatos

### Compatibilidad
- ✅ Soporte para Open Graph
- ✅ Soporte para Twitter Cards
- ✅ Fallback a meta tags estándar
- ✅ Conversión de URLs relativas a absolutas

## Ejemplos de Uso en Frontend

### JavaScript/TypeScript

```javascript
// Obtener preview de una URL
async function getLinkPreview(url) {
  try {
    const response = await fetch(`/api/messaging/link-preview?url=${encodeURIComponent(url)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error obteniendo preview:', error);
    return null;
  }
}

// Detectar URLs en texto
async function detectUrls(text) {
  try {
    const response = await fetch('/api/messaging/detect-urls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    return data.success ? data.data.urls : [];
  } catch (error) {
    console.error('Error detectando URLs:', error);
    return [];
  }
}
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const LinkPreview = ({ url }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/messaging/link-preview?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (data.success) {
          setPreview(data.data);
        }
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) return <div>Cargando preview...</div>;
  if (!preview) return null;

  return (
    <div className="link-preview">
      {preview.image && (
        <img src={preview.image} alt={preview.title} className="preview-image" />
      )}
      <div className="preview-content">
        <h3 className="preview-title">{preview.title}</h3>
        {preview.description && (
          <p className="preview-description">{preview.description}</p>
        )}
        <span className="preview-domain">{preview.domain}</span>
      </div>
    </div>
  );
};
```

## Estructura de Base de Datos

El campo `linkPreviews` en el modelo `Message` almacena un JSON string con array de previews:

```json
[
  {
    "url": "https://example.com",
    "domain": "example.com",
    "title": "Título",
    "description": "Descripción",
    "image": "https://example.com/image.jpg",
    "siteName": "Example Site"
  }
]
```

## Limitaciones y Consideraciones

1. **Máximo 3 URLs por mensaje** para evitar sobrecarga
2. **Máximo 5 URLs por request** en el endpoint de múltiples previews
3. **Timeout de 10 segundos** para cada URL
4. **Tamaño máximo de 2MB** para el contenido descargado
5. **URLs bloqueadas**: localhost, IPs privadas, protocolos no HTTP/HTTPS
6. **Fallback**: Si no se pueden extraer metadatos, se crea un preview básico con el dominio