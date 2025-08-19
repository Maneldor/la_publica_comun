# La Pública - Red Social del Sector Público
## Documentación Técnica Completa

### 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Componentes Principales](#componentes-principales)
5. [Sistema Multi-Comunidad](#sistema-multi-comunidad)
6. [Tipos y Interfaces](#tipos-y-interfaces)
7. [Hooks Personalizados](#hooks-personalizados)
8. [Guía de Implementación](#guía-de-implementación)
9. [API y Backend](#api-y-backend)
10. [Despliegue y Configuración](#despliegue-y-configuración)

---

## 📈 Resumen Ejecutivo

**La Pública** es una red social profesional especializada para el sector público español, diseñada con una arquitectura multi-comunidad que permite adaptarse automáticamente a cada Comunidad Autónoma.

### 🎯 Objetivos del Proyecto
- **Networking Profesional**: Conectar empleados públicos, organismos y empresas colaboradoras
- **Gestión de Talento**: Facilitar procesos de selección y desarrollo profesional
- **Formación Continua**: Sistema de eventos y certificaciones
- **Transparencia**: Analytics y métricas para mejorar la gestión pública
- **Descentralización**: Respeto a las particularidades de cada comunidad autónoma

### 📊 Métricas del Sistema
- **10 Componentes Principales** integrados
- **17 Comunidades Autónomas** soportadas
- **6 Tipos de Usuario** diferenciados
- **8 Categorías de Eventos** disponibles
- **4 Niveles de Privacidad** en grupos
- **7 Tipos de Contenido** en posts

---

## 🏗️ Arquitectura General

### 🎨 Stack Tecnológico

```typescript
// Frontend
- React 18+ con TypeScript
- Next.js 14 (App Router)
- Tailwind CSS para estilos
- Lucide React para iconos
- React Hook Form para formularios

// Estado y Contexto
- React Context API
- Custom Hooks especializados
- LocalStorage para persistencia

// Herramientas de Desarrollo
- ESLint + Prettier
- TypeScript strict mode
- Husky para pre-commit hooks
```

### 🧩 Patrón de Arquitectura

La aplicación sigue un patrón **Component-Based Architecture** con:

1. **Separation of Concerns**: Cada componente tiene una responsabilidad específica
2. **Composición**: Componentes reutilizables que se combinan para crear funcionalidades complejas
3. **Context Pattern**: Gestión de estado global con contextos especializados
4. **Custom Hooks**: Lógica de negocio encapsulada y reutilizable
5. **TypeScript First**: Tipado fuerte en toda la aplicación

### 🔄 Flujo de Datos

```mermaid
graph TD
    A[ProveedorComunidad] --> B[useComunidad Hook]
    B --> C[Componentes UI]
    C --> D[API Calls]
    D --> E[Estado Local]
    E --> F[Persistencia]
    F --> G[LocalStorage]
```

---

## 📁 Estructura de Carpetas

```
src/
├── componentes/
│   ├── comunes/                    # Componentes base (Header, Footer, Layout)
│   ├── especificos-comunidad/      # Componentes principales de funcionalidad
│   ├── proveedores/               # Context Providers
│   └── ui/                        # Componentes UI reutilizables
├── configuracion/
│   └── comunidades.ts             # Configuración de todas las CCAA
├── hooks/
│   └── useComunidad.ts            # Hooks personalizados
├── servicios/
│   └── api.ts                     # Servicios de API
├── tipos/
│   ├── comunidad.ts               # Tipos base del sistema
│   └── redSocial.ts               # Tipos específicos de la red social
├── utilidades/
│   └── helpers.ts                 # Funciones utility
└── documentacion/
    └── ArchitecturaCompleta.md    # Esta documentación
```

### 🎯 Convenciones de Naming

- **Componentes**: PascalCase (`TarjetaPost`, `SistemaEventos`)
- **Hooks**: camelCase con prefijo `use` (`useComunidad`, `useNotificaciones`)
- **Tipos**: PascalCase (`Usuario`, `ConfiguracionComunidad`)
- **Archivos**: kebab-case (`busqueda-global.tsx`, `sistema-eventos.tsx`)
- **Variables**: camelCase (`usuarioActual`, `fechaCreacion`)

---

## 🎛️ Componentes Principales

### 1. 🏗️ ProveedorComunidad

**Archivo**: `src/componentes/proveedores/ProveedorComunidad.tsx`

```typescript
interface PropiedadesProveedorComunidad {
  children: ReactNode;
  comunidadForzada?: string;
  idiomaInicial?: string;
}
```

**Responsabilidades**:
- Detectar comunidad autónoma por dominio
- Configurar tema visual dinámico
- Gestionar idiomas múltiples
- Proporcionar contexto global de comunidad

**Implementación**:
```typescript
<ProveedorComunidad>
  <App />
</ProveedorComunidad>
```

### 2. 📱 DashboardPrincipal

**Archivo**: `src/componentes/especificos-comunidad/DashboardPrincipal.tsx`

**Características**:
- Feed social en tiempo real
- Layout de 3 columnas responsive
- Widgets laterales inteligentes
- Sistema de filtros avanzado

### 3. 🔍 BusquedaGlobal

**Archivo**: `src/componentes/especificos-comunidad/BusquedaGlobal.tsx`

**Funcionalidades**:
- Búsqueda multi-tipo (usuarios, grupos, posts, eventos, ofertas)
- Algoritmo de relevancia
- Filtros avanzados temporales y geográficos
- Historial y sugerencias

### 4. 👥 GestionGrupos

**Archivo**: `src/componentes/especificos-comunidad/GestionGrupos.tsx`

**Capacidades**:
- Creación y edición de grupos
- Sistema de roles jerárquico
- Moderación de contenido
- Analytics por grupo

### 5. 📅 SistemaEventos

**Archivo**: `src/componentes/especificos-comunidad/SistemaEventos.tsx`

**Características**:
- Vista calendario y lista
- Gestión de asistencia
- Sistema de comentarios
- Certificaciones integradas

### 6. 🏢 DashboardEmpresa

**Archivo**: `src/componentes/especificos-comunidad/DashboardEmpresa.tsx`

**Funcionalidades empresariales**:
- Gestión de ofertas de empleo
- Sistema de candidatos
- Analytics específicos
- Centro de mensajería

### 7. 🔔 SistemaNotificaciones

**Archivo**: `src/componentes/especificos-comunidad/SistemaNotificaciones.tsx`

**Características**:
- 7 tipos de notificación
- Sistema de filtros
- Configuración granular
- Toasts en tiempo real

### 8. 💬 SistemaMensajeria

**Archivo**: `src/componentes/especificos-comunidad/SistemaMensajeria.tsx`

**Capacidades de chat**:
- Mensajería en tiempo real
- Estados de mensaje (enviado, leído, etc.)
- Adjuntos y multimedia
- Conversaciones grupales

### 9. 📊 AnalyticsGlobales

**Archivo**: `src/componentes/especificos-comunidad/AnalyticsGlobales.tsx`

**Dashboard administrativo**:
- Métricas de toda la plataforma
- Análisis por comunidad
- Alertas de seguridad
- Exportación de reportes

### 10. ➕ CrearPost

**Archivo**: `src/componentes/especificos-comunidad/CrearPost.tsx`

**Editor de contenido**:
- 5 tipos de post diferentes
- Subida de archivos
- Configuración de privacidad
- Validaciones avanzadas

---

## 🌍 Sistema Multi-Comunidad

### 🎯 Configuración de Comunidades

```typescript
// src/configuracion/comunidades.ts
export interface ConfiguracionComunidad {
  codigo: string;
  nombre: string;
  dominio: string;
  idiomas: string[];
  idiomaDefecto: string;
  tema: {
    colorPrimario: string;
    colorSecundario: string;
    colorAccento: string;
    logo: string;
  };
  caracteristicas: string[];
  organizaciones: string[];
  provincias?: string[];
  terminologia: {
    oposiciones: string;
    bolsasTrabajo: string;
    interinidades: string;
    formacion: string;
  };
}
```

### 🎨 Sistema de Temas Dinámico

```typescript
// Variables CSS automáticas
:root {
  --color-primario: #fcdd09;  /* Catalunya */
  --color-secundario: #da020e;
  --color-acento: #003d82;
}

// Euskadi
:root {
  --color-primario: #009639;
  --color-secundario: #ed1c24;
  --color-acento: #ffffff;
}
```

### 🗣️ Multiidioma Integrado

```typescript
const { terminologia } = useCaracteristicas();

// Catalunya: "Oposicions"
// Euskadi: "Oposaketak"  
// Galicia: "Oposicións"
// Resto: "Oposiciones"
```

### 🌐 Detección Automática

```typescript
const detectarComunidad = () => {
  const domain = window.location.hostname;
  
  // catalunya.lapublica.cat → Catalunya
  // euskadi.lapublica.eus → Euskadi
  // galicia.lapublica.gal → Galicia
  // madrid.lapublica.es → Madrid
  
  return configuracionesComunidades[codigo] || catalunya;
};
```

---

## 🔧 Tipos y Interfaces

### 👤 Usuario

```typescript
interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  tipo: TipoUsuario;
  titulo?: string;
  ubicacion?: string;
  verificado?: boolean;
  online?: boolean;
  biografia?: string;
  experiencia?: string[];
  formacion?: string[];
  especializaciones?: string[];
  avatar?: string;
  fechaRegistro: Date;
  configuracionPrivacidad: ConfiguracionPrivacidad;
}

type TipoUsuario = 
  | 'admin-web'
  | 'gestor-empresas' 
  | 'gestor-administraciones'
  | 'administrador-grupo'
  | 'empresa'
  | 'administracion'
  | 'sindicato'
  | 'empleado-publico';
```

### 👥 Grupo

```typescript
interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaGrupo;
  privacidad: TipoPrivacidadGrupo;
  miembros: number;
  fechaCreacion: Date;
  comunidadId: string;
  creadorId: string;
  activo: boolean;
  configuracion: ConfiguracionGrupo;
}

type TipoPrivacidadGrupo = 'publico' | 'privado' | 'oculto';
type CategoriaGrupo = 'afinidad' | 'profesional' | 'geografico';
```

### 📝 Post

```typescript
interface Post {
  id: string;
  tipo: TipoPost;
  contenido: string;
  autorId: string;
  fechaCreacion: Date;
  likes: number;
  comentarios: number;
  compartidos: number;
  guardados: number;
  activo: boolean;
  grupoId?: string;
  imagenes?: string[];
  datosOferta?: DatosOferta;
  datosEvento?: DatosEvento;
  datosDemanda?: DatosDemanda;
}

type TipoPost = 'texto' | 'imagen' | 'video' | 'evento' | 'oferta' | 'demanda';
```

### 📅 Evento

```typescript
interface Evento {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: CategoriaEvento;
  tipo: TipoEvento;
  modalidad: ModalidadEvento;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
  ubicacionVirtual?: string;
  capacidadMaxima?: number;
  asistentes: number;
  fechaCreacion: Date;
  creadorId: string;
  comunidadId: string;
  estado: EstadoEvento;
  esGratuito?: boolean;
  precio?: number;
  activo: boolean;
}

type CategoriaEvento = 'formacion' | 'networking' | 'conferencia' | 'taller' | 'seminario' | 'reunion' | 'social' | 'otros';
type TipoEvento = 'presencial' | 'virtual' | 'hibrido';
```

---

## 🎣 Hooks Personalizados

### 🏛️ useComunidad

```typescript
export const useComunidad = (): ContextoComunidad => {
  const contexto = useContext(ComunidadContext);
  
  if (!contexto) {
    throw new Error('useComunidad debe usarse dentro de un ProveedorComunidad');
  }
  
  return contexto;
};

// Hooks especializados
export const useConfiguracionComunidad = () => {
  const { configuracion } = useComunidad();
  return configuracion;
};

export const useIdioma = () => {
  const { idioma, cambiarIdioma, configuracion } = useComunidad();
  return { idioma, cambiarIdioma, idiomasDisponibles: configuracion.idiomas };
};

export const useTema = () => {
  const { configuracion } = useComunidad();
  return { tema: configuracion.tema };
};
```

### 🔔 useNotificaciones

```typescript
export const useNotificaciones = (usuario: Usuario) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificaciones>({});
  
  const marcarLeida = async (notificacionId: string) => {
    // Lógica de marcado
  };
  
  return {
    notificaciones,
    configuracion,
    noLeidasCount: notificaciones.filter(n => !n.leida).length,
    marcarLeida,
    marcarTodasLeidas,
    eliminarNotificacion
  };
};
```

### 🔍 useBusqueda

```typescript
export const useBusquedaDebounce = (termino: string, delay: number = 300) => {
  const [terminoDebounce, setTermino] = useState(termino);

  useEffect(() => {
    const handler = setTimeout(() => {
      setTermino(termino);
    }, delay);

    return () => clearTimeout(handler);
  }, [termino, delay]);

  return terminoDebounce;
};
```

---

## 🚀 Guía de Implementación

### 📋 Paso 1: Configuración Inicial

```bash
# Crear proyecto
npx create-next-app@latest lapublica-app --typescript --tailwind --eslint

# Instalar dependencias
npm install @prisma/client prisma uuid lucide-react
npm install -D @types/uuid
```

### 📋 Paso 2: Estructura Base

```typescript
// src/app/layout.tsx
import { ProveedorComunidad } from '@/componentes/proveedores/ProveedorComunidad';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ProveedorComunidad>
          {children}
        </ProveedorComunidad>
      </body>
    </html>
  );
}
```

### 📋 Paso 3: Página Principal

```typescript
// src/app/page.tsx
import { DemoCompleta } from '@/componentes/especificos-comunidad/DemoCompleta';

export default function HomePage() {
  return <DemoCompleta modoDemo={false} />;
}
```

### 📋 Paso 4: Configuración de Comunidades

```typescript
// src/configuracion/comunidades.ts
export const configuracionesComunidades = {
  catalunya: {
    codigo: 'catalunya',
    nombre: 'Catalunya', 
    dominio: 'lapublica.cat',
    // ... resto de configuración
  },
  // Añadir más comunidades...
};
```

### 📋 Paso 5: Variables CSS

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primario: #fcdd09;
  --color-secundario: #da020e;
  --color-acento: #003d82;
}

.comunidad-catalunya {
  --color-primario: #fcdd09;
  --color-secundario: #da020e;
}

.comunidad-euskadi {
  --color-primario: #009639;
  --color-secundario: #ed1c24;
}
```

---

## 🔌 API y Backend

### 🎯 Estructura de API Recomendada

```typescript
// Endpoints principales
interface APIEndpoints {
  // Autenticación
  'POST /api/auth/login': { email: string; password: string };
  'POST /api/auth/register': Partial<Usuario>;
  'POST /api/auth/logout': void;
  
  // Usuarios
  'GET /api/usuarios': Usuario[];
  'GET /api/usuarios/:id': Usuario;
  'PUT /api/usuarios/:id': Partial<Usuario>;
  
  // Posts
  'GET /api/posts': Post[];
  'POST /api/posts': Partial<Post>;
  'PUT /api/posts/:id': Partial<Post>;
  'DELETE /api/posts/:id': void;
  
  // Grupos
  'GET /api/grupos': Grupo[];
  'POST /api/grupos': Partial<Grupo>;
  'PUT /api/grupos/:id': Partial<Grupo>;
  'POST /api/grupos/:id/join': void;
  
  // Eventos
  'GET /api/eventos': Evento[];
  'POST /api/eventos': Partial<Evento>;
  'POST /api/eventos/:id/asistir': void;
  
  // Notificaciones
  'GET /api/notificaciones': Notificacion[];
  'PUT /api/notificaciones/:id/leida': void;
  
  // Mensajería
  'GET /api/conversaciones': Conversacion[];
  'POST /api/mensajes': Partial<Mensaje>;
  
  // Búsqueda
  'GET /api/buscar': { q: string; tipo?: TipoResultado };
  
  // Analytics (solo admin)
  'GET /api/analytics/general': EstadisticasGenerales;
  'GET /api/analytics/comunidades': EstadisticasComunidad[];
}
```

### 🗄️ Esquema de Base de Datos

```sql
-- Comunidades
CREATE TABLE comunidades (
  id UUID PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE,
  nombre VARCHAR(100),
  dominio VARCHAR(100),
  configuracion JSONB,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  tipo VARCHAR(50),
  comunidad_id UUID REFERENCES comunidades(id),
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grupos
CREATE TABLE grupos (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255),
  descripcion TEXT,
  categoria VARCHAR(50),
  privacidad VARCHAR(20),
  comunidad_id UUID REFERENCES comunidades(id),
  creador_id UUID REFERENCES usuarios(id),
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  tipo VARCHAR(20),
  contenido TEXT,
  autor_id UUID REFERENCES usuarios(id),
  grupo_id UUID REFERENCES grupos(id),
  datos_especificos JSONB,
  metricas JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  categoria VARCHAR(50),
  tipo VARCHAR(20),
  fecha_inicio TIMESTAMP,
  fecha_fin TIMESTAMP,
  creador_id UUID REFERENCES usuarios(id),
  comunidad_id UUID REFERENCES comunidades(id),
  configuracion JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🔐 Autenticación y Autorización

```typescript
// Middleware de autenticación
interface JWTPayload {
  userId: string;
  comunidadId: string;
  tipo: TipoUsuario;
  permisos: string[];
}

// Sistema de permisos
const PERMISOS = {
  'admin-web': ['*'], // Todos los permisos
  'gestor-empresas': ['empresas.*', 'ofertas.*', 'candidatos.*'],
  'administrador-grupo': ['grupos.moderar', 'posts.moderar'],
  'empleado-publico': ['posts.crear', 'eventos.asistir', 'grupos.unirse']
};
```

---

## 🚀 Despliegue y Configuración

### 🐳 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 🌐 Configuración de Dominios

```bash
# Configuración DNS
catalunya.lapublica.cat    A    IP_SERVIDOR
euskadi.lapublica.eus      A    IP_SERVIDOR  
galicia.lapublica.gal      A    IP_SERVIDOR
madrid.lapublica.es        A    IP_SERVIDOR
andalucia.lapublica.es     A    IP_SERVIDOR
```

### ⚙️ Variables de Entorno

```bash
# .env.production
NEXTAUTH_URL=https://lapublica.cat
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/lapublica
REDIS_URL=redis://localhost:6379

# Configuración por comunidad
CATALUNYA_PRIMARY_COLOR=#fcdd09
EUSKADI_PRIMARY_COLOR=#009639
GALICIA_PRIMARY_COLOR=#0066cc

# APIs externas
SENDGRID_API_KEY=your-sendgrid-key
CLOUDINARY_URL=cloudinary://your-config
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 📊 Monitoreo y Analytics

```typescript
// Google Analytics por comunidad
const trackingIds = {
  catalunya: 'GA-CAT-XXXXX',
  euskadi: 'GA-EUS-XXXXX', 
  galicia: 'GA-GAL-XXXXX'
};

// Métricas personalizadas
gtag('event', 'page_view', {
  custom_parameter_1: configuracion.codigo,
  custom_parameter_2: usuario.tipo
});
```

### 🔒 Seguridad

```typescript
// Content Security Policy
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: *.cloudinary.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

// Rate limiting por comunidad
const rateLimits = {
  general: '100 requests per 15 minutes',
  auth: '5 requests per 15 minutes',
  uploads: '10 requests per hour'
};
```

---

## 📈 Métricas y KPIs

### 🎯 KPIs Principales

```typescript
interface KPIsPrincipales {
  // Crecimiento
  usuariosNuevosMes: number;
  tasaCrecimientoMensual: number;
  retencionUsuarios30d: number;
  
  // Engagement  
  tiempoPromedioSesion: number;
  paginasVistaSesion: number;
  tasaRebote: number;
  
  // Contenido
  postsPublicadosDia: number;
  interaccionesPorPost: number;
  gruposActivosMes: number;
  
  // Conversión
  tasaConversionEventos: number;
  tasaRespuestaOfertas: number;
  satisfaccionUsuarios: number;
}
```

### 📊 Dashboard de Métricas

```typescript
// Métricas en tiempo real
const metricsConfig = {
  updateInterval: 30000, // 30 segundos
  alerts: {
    errorRate: { threshold: 0.05, type: 'critical' },
    responseTime: { threshold: 2000, type: 'warning' },
    userDropoff: { threshold: 0.1, type: 'info' }
  }
};
```

---

## 🧪 Testing

### 🔬 Estrategia de Testing

```typescript
// Unit Tests - Jest + React Testing Library
describe('useComunidad Hook', () => {
  it('debe detectar comunidad por dominio', () => {
    // Test implementation
  });
});

// Integration Tests - Cypress
describe('Sistema de Eventos', () => {
  it('debe permitir crear y gestionar eventos', () => {
    // E2E test implementation
  });
});

// Performance Tests - Lighthouse
const performanceMetrics = {
  'First Contentful Paint': '< 1.5s',
  'Largest Contentful Paint': '< 2.5s',
  'Cumulative Layout Shift': '< 0.1',
  'Time to Interactive': '< 3.5s'
};
```

---

## 🤝 Contribución

### 🎯 Guías de Contribución

```markdown
## Proceso de Contribución

1. **Fork** del repositorio
2. **Crear** rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** Pull Request

## Estándares de Código

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Test coverage > 80%
- Documentación actualizada
```

### 📝 Conventional Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización documentación
style: cambios de formato
refactor: refactorización de código
test: agregar tests
chore: tareas de mantenimiento
```

---

## 📞 Soporte y Contacto

### 🔧 Canales de Soporte

- **Documentación**: [docs.lapublica.cat](https://docs.lapublica.cat)
- **Issues**: [github.com/lapublica/issues](https://github.com/lapublica/issues)
- **Discusiones**: [github.com/lapublica/discussions](https://github.com/lapublica/discussions)
- **Email**: soporte@lapublica.cat

### 📋 Roadmap

```markdown
## Q1 2024
- [ ] Sistema de verificación automática
- [ ] API GraphQL
- [ ] App móvil nativa
- [ ] Integración con sistemas RRHH

## Q2 2024  
- [ ] IA para recomendaciones
- [ ] Video llamadas integradas
- [ ] Blockchain para certificaciones
- [ ] Expansión internacional
```

---

## 📄 Licencia

```
MIT License

Copyright (c) 2024 La Pública

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

**🎉 ¡Gracias por usar La Pública!**

Esta documentación está en constante evolución. Para sugerencias o mejoras, por favor abre un issue en el repositorio oficial.

*Última actualización: Diciembre 2024*