# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## Descripción del Proyecto

**La Pública** es una red social multicomunitaria diseñada para empleados del sector público español. Construida con Next.js 14, React 18 y TypeScript, se adapta automáticamente a diferentes comunidades autónomas españolas (Catalunya, Euskadi, Galicia, Madrid, Andalucía y 12 más).

## Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linting
npm run lint

# Verificación de tipos
npm run type-check
```

## Descripción de la Arquitectura

### Sistema Multicomunitario
Toda la aplicación está construida alrededor de un patrón de multi-tenencia basado en configuración:

- **Configuración de Comunidades**: Cada comunidad tiene configuración completa en `configuracion/comunidades.ts`
- **Proveedor de Contexto**: `ProveedorComunidad` envuelve la app y gestiona el estado de comunidad, temas y localización
- **Acceso basado en Hooks**: Múltiples hooks especializados en `hooks/useComunidad.ts` para diferentes aspectos (tema, idioma, características, geografía)
- **Detección Automática**: Comunidad detectada por hostname (ej: lapublica.cat para Catalunya)

### Patrones Arquitectónicos Clave

1. **Basado en Configuración**: Comunidades definidas por objetos de configuración completos incluyendo colores, idiomas, organizaciones, tipos de usuario y flags de características
2. **Context + Hooks**: React Context provee estado de comunidad, hooks personalizados proveen acceso tipado
3. **Temas Dinámicos**: Propiedades CSS personalizadas aplicadas automáticamente según comunidad
4. **API Type-Safe**: Capa de API mock con cobertura completa de TypeScript
5. **Organización de Componentes**: Exportaciones barrel en archivos `index.ts` para imports limpios

### Estructura de Archivos

```
app/                    # Directorio app de Next.js
├── layout.tsx         # Layout raíz con proveedores
└── page.tsx           # Página principal

configuracion/         # Configuraciones de comunidades
└── comunidades.ts     # Configuración de las 17 comunidades

hooks/                 # Hooks conscientes de comunidad
└── useComunidad.ts    # Hooks de tema, idioma, características

src/
├── componentes/
│   ├── comunes/       # Componentes UI compartidos
│   ├── especificos-comunidad/  # Componentes de características principales
│   └── proveedores/   # Proveedores de contexto
├── servicios/         # Capa API (actualmente mock)
└── documentacion/     # Documentación de arquitectura

tipos/                 # Definiciones TypeScript
├── comunidad.ts       # Tipos de comunidad y usuario
└── redSocial.ts       # Tipos de red social
```

### Soporte de Comunidades

El sistema soporta 17 comunidades autónomas españolas con detección automática vía hostname. Comunidades principales incluyen:
- **Catalunya** (lapublica.cat) - Catalán/Español
- **Euskadi** (lapublica.eus) - Euskera/Español  
- **Galicia** (lapublica.gal) - Gallego/Español
- **Madrid** (madrid.lapublica.es) - Español
- **Andalucía** (andalucia.lapublica.es) - Español

Cada comunidad tiene:
- Esquema de colores y marca personalizados
- Terminología y traducciones regionales
- Organizaciones y provincias locales
- Tipos de usuario y categorías de grupos
- Flags de características

### Componentes Clave

- **ProveedorComunidad**: Proveedor de contexto principal para estado de comunidad
- **DashboardPrincipal**: Dashboard principal con diseño de tres columnas
- **BusquedaGlobal**: Funcionalidad de búsqueda global
- **GestionGrupos**: Sistema de gestión de grupos
- **SistemaEventos**: Gestión de eventos
- **DashboardEmpresa**: Dashboard de empresa
- **SistemaNotificaciones**: Sistema de notificaciones
- **SistemaMensajeria**: Sistema de mensajería

### Tipos de Usuario

El sistema soporta múltiples roles de usuario:
- `admin-web` - Administrador global
- `gestor-empresas` - Gestor de empresas
- `gestor-administraciones` - Gestor de administraciones públicas
- `administrador-grupo` - Administrador de grupo
- `empresa` - Usuario empresa
- `administracion` - Usuario administración pública
- `sindicato` - Usuario sindicato
- `miembro` - Miembro regular

### Guías de Desarrollo

- **TypeScript primero**: Tipado estricto en todo, verificar con `npm run type-check`
- **Consciente de comunidad**: Los componentes deben usar hooks de comunidad para temas/localización
- **Patrón de contexto**: Usar hooks proporcionados en lugar de acceder al contexto directamente
- **Multi-idioma**: Soportar idiomas regionales a través de configuración de comunidad
- **Responsive**: Usar Tailwind CSS con temas específicos de comunidad
- **Linting**: Ejecutar `npm run lint` antes de hacer commit

### Trabajando con Comunidades

Al añadir nuevas características:
1. Verificar configuración de comunidad en `configuracion/comunidades.ts` para flags de características
2. Usar `useTema()` para colores y temas
3. Usar `useIdioma()` para localización
4. Usar `useCaracteristicas()` para verificar si las características están habilitadas
5. Usar `useGeografia()` para funcionalidad basada en ubicación

### Integración de API

La capa API actual (`src/servicios/api.ts`) está basada en mocks para desarrollo. Al implementar APIs reales:
- Mantener las interfaces TypeScript existentes
- Mantener los mismos patrones async/await
- Preservar el filtrado y respuestas conscientes de comunidad
- Manejar errores apropiadamente con bloques try-catch

### Añadiendo Nuevos Componentes

1. Crear componente en directorio apropiado bajo `src/componentes/`
2. Usar interfaces TypeScript para props
3. Hacerlo consciente de comunidad usando hooks
4. Exportar desde index.ts para imports limpios
5. Seguir patrones de componentes existentes para consistencia