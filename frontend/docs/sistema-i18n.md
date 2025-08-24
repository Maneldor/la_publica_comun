# Sistema de Traducción Automática (i18n) - La Pública

## Descripción General

El sistema i18n de La Pública gestiona automáticamente la traducción de contenido entre las 4 lenguas oficiales de España: **Español**, **Catalán**, **Euskera** y **Gallego**.

### Características Principales

- ✅ **Traducción automática** de contenido de usuario entre las 4 lenguas
- ✅ **Traducción de interfaz** con claves estáticas
- ✅ **Sistema de caché** para optimizar rendimiento
- ✅ **Fallbacks inteligentes** cuando falla la traducción automática
- ✅ **Configuración por usuario** para personalizar experiencia
- ✅ **Detección automática** del idioma de la comunidad
- ✅ **Soporte offline** con diccionarios internos

## Arquitectura del Sistema

### 1. Tipos de Traducción

#### **Traducción de Interfaz (UI)**
```typescript
// Claves estáticas predefinidas
t('nav.inicio') // → 'Inicio' / 'Inici' / 'Hasiera' / 'Inicio'
t('accion.crear') // → 'Crear' / 'Crear' / 'Sortu' / 'Crear'
```

#### **Traducción de Contenido Dinámico**
```typescript
// Contenido generado por usuarios
tDynamic({
  texto: 'Este es un anuncio importante',
  idiomaOriginal: 'es',
  tipo: 'anuncio'
}) // → Se traduce automáticamente según idioma del usuario
```

#### **Contenido Multiidioma Completo**
```typescript
// Estructura completa con metadatos
interface ContenidoMultiidioma {
  id: string
  autorId: string
  idiomaOriginal: IdiomaOficial
  textoOriginal: string
  traducciones: Partial<Record<IdiomaOficial, TraduccionContenido>>
  tipoContenido: 'post' | 'comentario' | 'evento' | 'anuncio' | 'grupo'
  // ... más metadatos
}
```

### 2. Flujo de Traducción

```
Usuario crea contenido en ES
        ↓
Sistema detecta idioma
        ↓
Almacena como texto original
        ↓
Usuario de CA visita contenido
        ↓
Sistema verifica caché
        ↓
Si no existe: Google Translate API
        ↓
Si falla API: Diccionario interno
        ↓
Si falla todo: Texto original + aviso
        ↓
Muestra contenido traducido
```

## Uso del Sistema

### 1. Configuración Básica

```typescript
// app/layout.tsx - Envolver app con providers
import { TraduccioProvider } from '../src/contextos/TraduccioContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ComunidadProvider>
      <TraduccioProvider habilitatDebugInicial={process.env.NODE_ENV === 'development'}>
        {children}
      </TraduccioProvider>
    </ComunidadProvider>
  )
}
```

### 2. Hooks Disponibles

#### **Hook Principal**
```typescript
import { useTraduccio } from '../contextos/TraduccioContext'

function MiComponente() {
  const { t, tDynamic, idioma, cambiarIdioma } = useTraduccio()
  
  return (
    <div>
      <h1>{t('titulo.principal')}</h1>
      <button onClick={() => cambiarIdioma('ca')}>
        Català
      </button>
    </div>
  )
}
```

#### **Hook Simplificado**
```typescript
import { useT } from '../contextos/TraduccioContext'

function ComponenteSimple() {
  const t = useT()
  
  return <h1>{t('titulo.seccion')}</h1>
}
```

#### **Hook para Contenido Multiidioma**
```typescript
import { useMultilingualContent } from '../contextos/TraduccioContext'

function GestorPosts() {
  const { 
    createMultilingualContent,
    translateContent 
  } = useMultilingualContent()
  
  const crearPost = async (texto: string, autorId: string) => {
    const contenido = await createMultilingualContent(
      texto,
      autorId,
      'post',
      'es'
    )
    
    // Guardar en base de datos...
  }
}
```

#### **Hook para Configuración**
```typescript
import { useTranslationSettings } from '../contextos/TraduccioContext'

function ConfiguracionIdioma() {
  const {
    configuracionUsuario,
    actualizarConfiguracionUsuario,
    idioma,
    cambiarIdioma
  } = useTranslationSettings()
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={configuracionUsuario.traducirAutomaticamente}
          onChange={(e) => actualizarConfiguracionUsuario({
            traducirAutomaticamente: e.target.checked
          })}
        />
        Traducir automáticamente
      </label>
    </div>
  )
}
```

### 3. Componentes Especializados

#### **Componente para Contenido Multiidioma**
```typescript
import { MultilingualContent } from '../contextos/TraduccioContext'

function PostComponent({ post }: { post: ContenidoMultiidioma }) {
  return (
    <div className="post">
      <MultilingualContent
        contenido={post}
        mostrarIdiomOriginal={true}
        className="post-content"
        onTranslationError={(error) => {
          console.error('Error traduciendo post:', error)
        }}
      />
    </div>
  )
}
```

#### **Wrapper Inline para Traducciones**
```typescript
import { T } from '../contextos/TraduccioContext'

function BotonesAccion() {
  return (
    <div>
      <button>
        <T variables={{ nombre: 'Usuario' }}>
          saludo.personalizado
        </T>
      </button>
    </div>
  )
}
```

## Configuración Avanzada

### 1. Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_TRANSLATION_CACHE_TTL=86400000  # 24 horas
NEXT_PUBLIC_ENABLE_TRANSLATION_DEBUG=true
```

### 2. Configuración de Usuario

```typescript
interface ConfiguracionI18nUsuario {
  // Traducir contenido automáticamente
  traducirAutomaticamente: boolean
  
  // Mostrar texto original además del traducido
  mostrarIdiomaOriginal: boolean
  
  // Priorizar contenido creado en el idioma del usuario
  priorizarContenidoEnMiIdioma: boolean
}
```

### 3. Personalización por Comunidad

```typescript
// El sistema detecta automáticamente la comunidad y configura:
const IDIOMAS_POR_COMUNIDAD = {
  'catalunya': 'ca',
  'euskadi': 'eu', 
  'galicia': 'gl',
  'madrid': 'es'
  // ... resto de comunidades
}
```

## Casos de Uso Comunes

### 1. Post de Usuario

```typescript
// Usuario en Catalunya crea post en catalán
const post = await createMultilingualContent(
  'Aquest és un missatge important per a la comunitat',
  'usuari-123',
  'post',
  'ca'
)

// Usuario en Madrid ve el post automáticamente en español
<MultilingualContent contenido={post} />
// → "Este es un mensaje importante para la comunidad"
```

### 2. Evento de Administración

```typescript
// Administración de Galicia crea evento
const evento = {
  titulo: 'Xornada de formación en dixitalización',
  descripcion: 'Evento formativo para funcionarios...',
  idiomaOriginal: 'gl'
}

// Se ve automáticamente traducido en otras comunidades
```

### 3. Oferta Comercial

```typescript
// Empresa en Euskadi publica oferta
const oferta = {
  titulo: 'Ingeniero de software - Bilbo',
  descripcion: 'Beharrezkoak: Java, Spring Boot...',
  idiomaOriginal: 'eu'
}

// Visible traducida en toda España
```

## Fallbacks y Manejo de Errores

### 1. Jerarquía de Fallbacks

1. **Traducción en caché** (instantáneo)
2. **Google Translate API** (~200ms)
3. **Diccionario interno** (~50ms)
4. **Texto original + aviso** (siempre funciona)

### 2. Manejo de Errores

```typescript
// Los errores se manejan automáticamente
// El usuario nunca ve contenido vacío
try {
  const traducido = await tDynamic({ texto, idiomaOriginal: 'es' })
  return traducido
} catch (error) {
  console.error('Error traducción:', error)
  return textoOriginal // Fallback seguro
}
```

## Rendimiento y Optimización

### 1. Caché Inteligente

- ✅ **Caché en memoria** para traducciones recientes
- ✅ **Caché en localStorage** para persistencia
- ✅ **Caché en servidor** (Redis en producción)
- ✅ **TTL configurable** por tipo de contenido

### 2. Optimizaciones

- ✅ **Lazy loading** de traducciones
- ✅ **Batching** de múltiples traducciones
- ✅ **Debounce** en inputs de usuario
- ✅ **Prefetch** de contenido probable

### 3. Métricas

```typescript
const stats = obtenirEstadistiques()
// {
//   idiomesSuportats: 4,
//   totalClaus: 1247,
//   traduccionsPerIdioma: { ca: 312, eu: 298, gl: 301, es: 336 },
//   contenidoTraducido: {
//     totalContenidos: 5420,
//     traduccionesEnCache: 4891,
//     traduccionesExitosas: 5398,
//     traduccionesFallidas: 22
//   }
// }
```

## Integración con APIs Externas

### Google Translate API

```typescript
// src/pages/api/translate.ts
export default async function handler(req, res) {
  const { text, from, to } = req.body
  
  try {
    const result = await translate(text, {
      from,
      to,
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    })
    
    res.json({ translation: result.text })
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' })
  }
}
```

## Testing

```typescript
// __tests__/i18n.test.ts
import { render, screen } from '@testing-library/react'
import { TraduccioProvider } from '../src/contextos/TraduccioContext'

describe('Sistema i18n', () => {
  test('traduce contenido correctamente', async () => {
    render(
      <TraduccioProvider>
        <MultilingualContent contenido={mockContent} />
      </TraduccioProvider>
    )
    
    expect(screen.getByText(/contenido traducido/i)).toBeInTheDocument()
  })
})
```

## Roadmap

### Próximas Funcionalidades

- [ ] **Traducción de imágenes** (OCR + traducción)
- [ ] **Traducción de audio** (Speech-to-text + traducción)
- [ ] **Corrección automática** de traducciones por usuarios
- [ ] **Métricas avanzadas** y dashboard de analytics
- [ ] **A/B testing** de diferentes providers de traducción
- [ ] **Integración con DeepL** como alternativa a Google
- [ ] **Traducción en tiempo real** para chat

### Optimizaciones Futuras

- [ ] **Service Workers** para traducción offline
- [ ] **WebAssembly** para diccionarios locales más rápidos  
- [ ] **GraphQL** para batching optimizado de traducciones
- [ ] **CDN** especializado para contenido traducido