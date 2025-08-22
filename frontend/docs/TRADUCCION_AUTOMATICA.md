# Sistema de Traducción Automática

## Visión General

El sistema de traducción automática de La Pública permite la localización completa de toda la interfaz de usuario de forma automática, adaptándose a cada comunidad autónoma y sus idiomas específicos.

## Características Principales

### 🌐 Traducción Universal
- **Cobertura completa**: Todo el texto de la interfaz se traduce automáticamente
- **Múltiples idiomas**: Soporte nativo para Catalán, Español, Euskera y Gallego
- **Específico por comunidad**: Traducciones adaptadas a cada comunidad autónoma
- **Fallback inteligente**: Sistema de respaldo cuando no existe traducción

### 🚀 Rendimiento Optimizado  
- **Cache en memoria**: Traducciones cargadas una sola vez y almacenadas en memoria
- **Sistema singleton**: Una instancia única del servicio de traducción
- **Carga diferida**: Traducciones específicas se cargan según necesidad
- **Zero config**: Funciona automáticamente sin configuración adicional

### 🔧 Desarrollo Amigable
- **Debug mode**: Panel de desarrollo para monitorizar traducciones
- **Hot updates**: Agregar traducciones dinámicamente sin recargar
- **TypeScript**: Totalmente tipado para mejor DX
- **Multiple hooks**: Varios patrones de uso según necesidades

## Arquitectura

### Componentes Principales

```
src/servicios/traduccioAutomatica.ts    # Servicio principal (singleton)
src/contextos/TraduccioContext.tsx      # Contexto React con hooks
src/componentes/.../DebugTraduccions.tsx # Panel de debug (desarrollo)
```

### Flujo de Datos

```
Configuración Comunidad → Sistema Traducción → Cache Memoria → Componentes UI
```

## Implementación

### 1. Configuración Inicial

El sistema se inicializa automáticamente en `app/layout.tsx`:

```tsx
<ComunidadProvider>
  <TraduccioProvider>
    <App />
  </TraduccioProvider>
</ComunidadProvider>
```

### 2. Uso en Componentes

#### Método Básico
```tsx
import { useT } from '../../../contextos/TraduccioContext'

function MiComponente() {
  const t = useT()
  return <h1>{t('nav.inici')}</h1>
}
```

#### Método con Variables
```tsx
import { useTraduccio } from '../../../contextos/TraduccioContext'

function MiComponente() {
  const { t } = useTraduccio()
  return (
    <p>{t('welcome.user', { 
      variables: { name: 'Maria' },
      fallback: 'Benvinguda {{name}}!'
    })}</p>
  )
}
```

#### Método Inline
```tsx
import { T } from '../../../contextos/TraduccioContext'

function MiComponente() {
  return <T fallback="Configuració">nav.configuracio</T>
}
```

### 3. Estructura de Claves

Las claves de traducción siguen un patrón jerárquico:

```
nav.inici                    # Navegación -> Inicio
nav.configuracio            # Navegación -> Configuración
section.comunitat           # Secciones -> Comunidad
action.guardar              # Acciones -> Guardar
form.nom                    # Formularios -> Nombre
legal.privacitat_titol      # Avisos legales -> Título privacidad
config.perfil               # Configuración -> Perfil
notif.missatge_nou         # Notificaciones -> Mensaje nuevo
status.online              # Estados -> En línea
```

## Traducciones por Comunidad

### Catalunya (ca, es)
```typescript
ca: {
  'nav.inici': 'Inici',
  'nav.configuracio': 'Configuració',
  'action.guardar': 'Guardar'
}
```

### Euskadi (eu, es)
```typescript
eu: {
  'nav.inici': 'Hasiera',
  'nav.configuracio': 'Konfigurazioa',
  'action.guardar': 'Gorde'
}
```

### Galicia (gl, es)
```typescript
gl: {
  'nav.inici': 'Inicio',
  'nav.configuracio': 'Configuración',
  'action.guardar': 'Gardar'
}
```

## Panel de Debug

En modo desarrollo, aparece un panel flotante con:

- **Estado del sistema**: Idioma actual, idiomas disponibles, estadísticas
- **Test de traducciones**: Probar claves específicas en tiempo real
- **Agregar traducciones**: Añadir traducciones manualmente para pruebas
- **Claves faltantes**: Lista de claves sin traducir

### Activar Debug Mode

```tsx
// En cualquier componente
const { toggleDebug } = useTraduccio()
toggleDebug() // Activa/desactiva el debug
```

## Hooks Disponibles

### `useTraduccio()` - Hook Completo
```tsx
const { 
  t,                    // Función de traducción
  idioma,               // Idioma actual
  idiomesDisponibles,   // Lista de idiomas
  cambiarIdioma,        // Cambiar idioma
  afegirTraduccions,    // Añadir traducciones
  estatCarrega,         // Estado de carga
  habilitatDebug,       // Estado debug
  toggleDebug           // Toggle debug mode
} = useTraduccio()
```

### `useT()` - Hook Simplificado
```tsx
const t = useT()
// Solo retorna la función de traducción
```

### `useTWithVars()` - Hook para Variables
```tsx
const tWithVars = useTWithVars()
const text = tWithVars('welcome.user', { name: 'Maria' }, 'Fallback')
```

## Agregar Nuevas Traducciones

### Estáticas (en el servicio)
```typescript
// En traduccioAutomatica.ts
const traduccionsBase = {
  ca: {
    'nueva.clave': 'Nova traducció',
    // ...
  },
  es: {
    'nueva.clave': 'Nueva traducción',
    // ...
  }
}
```

### Dinámicas (en runtime)
```tsx
const { afegirTraduccions } = useTraduccio()

// Agregar para el idioma actual
afegirTraduccions({
  'dynamic.key': 'Traducció dinàmica'
})

// Agregar para idioma específico
afegirTraduccions({
  'dynamic.key': 'Traducción dinámica'
}, 'es')
```

## Patrones Recomendados

### ✅ Buenas Prácticas
```tsx
// Usar claves descriptivas
t('user.profile.edit.button')

// Proporcionar fallbacks
t('nueva.funcionalidad', { fallback: 'Nueva Funcionalidad' })

// Variables en lugar de concatenación
t('welcome.message', { variables: { name, date } })

// Usar el hook más simple necesario
const t = useT() // Si solo necesitas la función t
```

### ❌ Evitar
```tsx
// Claves genéricas
t('text1')

// Concatenación de strings
t('hello') + ' ' + userName

// Hook completo si no se necesita
const { t } = useTraduccio() // Si solo usas t
```

## Integración con Comunidades

El sistema se integra automáticamente con el `ComunidadContext`:

```tsx
// Automáticamente detecta el idioma de la comunidad
Catalunya: idioma predeterminado 'ca'
Euskadi: idioma predeterminado 'eu'  
Galicia: idioma predeterminado 'gl'
Madrid: idioma predeterminado 'es'
```

## Estadísticas y Monitorización

```tsx
const { obtenirEstadistiques } = useTraduccio()
const stats = obtenirEstadistiques()

console.log({
  idiomesSuportats: stats.idiomesSuportats,      // 4
  totalClaus: stats.totalClaus,                  // 150+
  traduccionsPerIdioma: stats.traduccionsPerIdioma, // { ca: 150, es: 150, ... }
  clausSenseTraduccion: stats.clausSenseTraduccion  // ['key.missing', ...]
})
```

## Roadmap Futuro

### Fase 1 ✅ (Implementado)
- [x] Servicio base de traducción
- [x] Contexto React con hooks
- [x] Integración con comunidades
- [x] Panel de debug
- [x] Traducciones básicas de interfaz

### Fase 2 🚧 (En desarrollo)
- [ ] Integración completa en LayoutGeneral
- [ ] Traducciones de todos los modales
- [ ] Traducción de mensajes de error
- [ ] Traducción de contenido dinámico

### Fase 3 🔮 (Futuro)
- [ ] Carga de traducciones desde API
- [ ] Sistema de contribución de traducciones
- [ ] Detección automática de idioma del navegador
- [ ] Traducciones con contexto (formal/informal)
- [ ] Pluralización inteligente
- [ ] RTL support

## Troubleshooting

### Problema: Las traducciones no aparecen
**Solución**: Verificar que el componente esté dentro del `TraduccioProvider`

### Problema: Aparece la clave en lugar de la traducción
**Solución**: Añadir la traducción o proporcionar un fallback

### Problema: Panel de debug no aparece
**Solución**: Solo visible en `NODE_ENV === 'development'`

### Problema: Performance lenta
**Solución**: El sistema usa cache en memoria, debería ser muy rápido

## Contribuir

Para añadir soporte a nuevos idiomas:

1. Añadir el código de idioma a `idiomesSuportats` en el servicio
2. Añadir todas las traducciones para ese idioma
3. Actualizar las comunidades que usan ese idioma
4. Probar con el panel de debug

---

**Nota**: Este sistema está diseñado para ser simple, eficiente y fácil de usar. Si tienes dudas o sugerencias, consulta los ejemplos en `ExempleUsTraduccions.tsx` o usa el panel de debug para experimentar.