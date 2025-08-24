// 🎯 TIPOS CENTRALIZADOS PARA SISTEMA DEMO
// Tipos especializados para experiencia de demostración comercial

import { Usuario, Grupo, Post, EventoPost } from './redSocial'

// ✅ TIPOS DE AUDIENCIA
export type AudienciaDemo = 
  | 'administracion'    // Funcionarios y administraciones
  | 'empresa'          // Empresas privadas que quieren conectar
  | 'sindicato'        // Organizaciones sindicales
  | 'ciudadano'        // Ciudadanos interesados
  | 'stakeholder'      // Directivos y decisores
  | 'desarrollador'    // Equipo técnico

// ✅ TIPOS DE EXPERIENCIA DEMO
export type ModoExperiencia = 
  | 'guiada'           // Con tour paso a paso
  | 'libre'            // Exploración libre
  | 'presentacion'     // Para showcase en vivo
  | 'evaluacion'       // Para período de prueba

// ✅ CONFIGURACIÓN DE DEMO
export interface ConfiguracionDemo {
  audiencia: AudienciaDemo
  modo: ModoExperiencia
  comunidadId: string
  idioma: 'es' | 'ca' | 'eu' | 'gl'
  duracionMaxima?: number // minutos
  funcionalidadesDestacadas: string[]
  usuarioInicialId?: string
  tracking: boolean
  personalizacion: PersonalizacionDemo
}

export interface PersonalizacionDemo {
  mostrarOnboarding: boolean
  destacarFuncionalidades: string[]
  ocultarFuncionalidades: string[]
  datosPersonalizados?: {
    nombreOrganizacion?: string
    logoOrganizacion?: string
    coloresPersonalizados?: {
      primario: string
      secundario: string
    }
  }
}

// ✅ DATOS MOCK ESTRUCTURADOS
export interface DatosDemo {
  usuarios: Usuario[]
  grupos: Grupo[] 
  posts: Post[]
  eventos: EventoPost[]
  ofertas: any[]
  estadisticasGlobales: EstadisticasDemo
}

export interface EstadisticasDemo {
  totalUsuarios: number
  usuariosActivos: number
  gruposActivos: number
  postsEsteMes: number
  eventosProximos: number
  engagement: {
    likesPromedio: number
    comentariosPromedio: number
    compartidosPromedio: number
  }
  crecimiento: {
    usuariosNuevos: number
    gruposNuevos: number
    tendencia: 'subiendo' | 'estable' | 'bajando'
  }
}

// ✅ TRACKING Y ANALYTICS
export interface EventoTracking {
  tipo: TipoEventoDemo
  timestamp: Date
  usuarioDemo: string
  seccion: string
  accion: string
  tiempo?: number
  metadata?: Record<string, any>
}

export type TipoEventoDemo =
  | 'inicio_sesion'
  | 'cambio_vista' 
  | 'interaccion_post'
  | 'interaccion'
  | 'exploracion_grupo'
  | 'click_funcionalidad'
  | 'tiempo_en_seccion'
  | 'abandono'
  | 'conversion'

export interface AnalyticsDemo {
  sesionId: string
  duracionTotal: number
  eventos: EventoTracking[]
  puntuacionInteres: number // 1-100
  funcionesUsadas: string[]
  seccionesMasVisitadas: string[]
  probabilidadConversion: number
}

// ✅ GUIDED TOUR
export interface PasoTour {
  id: string
  titulo: string
  descripcion: string
  selector?: string // CSS selector del elemento
  posicion: 'top' | 'bottom' | 'left' | 'right'
  accionRequerida?: AccionTour
  duracionMaxima?: number
  siguientePaso?: string
}

export type AccionTour = 
  | 'click'
  | 'hover'
  | 'input'
  | 'scroll'
  | 'wait'

export interface ConfiguracionTour {
  pasos: PasoTour[]
  esOpcional: boolean
  puedeOmitirse: boolean
  mostrarProgreso: boolean
  autoavance: boolean
}

// ✅ VISTAS Y NAVEGACIÓN
export type VistaDemo = 
  | 'onboarding'
  | 'dashboard'
  | 'feed'
  | 'grupos'
  | 'eventos' 
  | 'directorio'
  | 'mensajeria'
  | 'empresas'
  | 'analytics'
  | 'configuracion'
  | 'missatges'
  | 'esdeveniments'
  | 'afiliats'
  | 'licitacions'
  | 'consultes'
  | 'notificacions'
  | 'contactes'
  | 'usuarios'
  | 'engagement'
  | 'apis'
  | 'transparencia'
  | 'propostes'
  | 'negociacio'
  | 'mobilitzacions'
  | 'comunicats'

export interface NavegacionDemo {
  vistaActual: VistaDemo
  historial: VistaDemo[]
  breadcrumbs: string[]
  puedeRetroceder: boolean
  siguienteVistaSugerida?: VistaDemo
}

// ✅ CALL TO ACTION
export interface CTA {
  id: string
  texto: string
  tipo: 'primario' | 'secundario' | 'outline'
  icono?: string
  accion: AccionCTA
  visible: boolean
  destacado: boolean
  condiciones?: CondicionCTA[]
}

export type AccionCTA =
  | 'solicitar_demo_personal'
  | 'descargar_propuesta'
  | 'contactar_ventas'
  | 'ver_precios'
  | 'programar_reunion'
  | 'suscribirse_newsletter'

export interface CondicionCTA {
  tipo: 'tiempo_minimo' | 'secciones_visitadas' | 'interacciones_minimas'
  valor: number | string[]
}

// ✅ PERSONALIZACIÓN POR COMUNIDAD
export interface DatosComunidadDemo {
  [comunidadId: string]: {
    usuarios: Usuario[]
    grupos: Grupo[]
    eventos: EventoPost[]
    terminologiaEspecifica: Record<string, string>
    casosUsoDestacados: string[]
    testimonios?: TestimonioDemo[]
  }
}

export interface TestimonioDemo {
  id: string
  autor: string
  cargo: string
  organizacion: string
  texto: string
  foto?: string
  puntuacion: 1 | 2 | 3 | 4 | 5
  destacado: boolean
}

// ✅ CONFIGURACIÓN DE SHOWCASE
export interface ConfiguracionShowcase {
  modoKiosko: boolean // Para eventos/ferias
  rotacionAutomatica: boolean
  tiempoRotacion?: number
  reinicioAutomatico: boolean
  tiempoInactividad?: number
  pantallaBienvenida: boolean
  analytics: boolean
  capturaPantalla: boolean // Para generar material marketing
}

// ✅ INTEGRACIÓN CON SISTEMAS REALES
export interface IntegracionDemo {
  conectarConDatosReales: boolean
  tipoIntegracion: 'lectura' | 'sandbox' | 'demo_puro'
  limitesIntegracion?: {
    maxUsuarios: number
    maxGrupos: number  
    maxInteracciones: number
  }
  sincronizacionDatos?: {
    frecuencia: 'tiempo_real' | 'horaria' | 'diaria'
    ultimaActualizacion: Date
  }
}

// ✅ EXPORT DE RESULTADOS
export interface ResultadosDemo {
  sessionId: string
  configuracion: ConfiguracionDemo
  analytics: AnalyticsDemo
  feedback?: FeedbackDemo
  leadInfo?: LeadInfo
}

export interface FeedbackDemo {
  puntuacion: 1 | 2 | 3 | 4 | 5
  comentarios?: string
  funcionalidadesFavoritas: string[]
  sugerencias?: string[]
  probabilidadRecomendacion: number // 1-10 NPS
}

export interface LeadInfo {
  nombre?: string
  email?: string
  organizacion?: string
  cargo?: string
  telefono?: string
  interesado: boolean
  proximoPaso?: string
  fechaContacto?: Date
}

// ✅ CONSTANTES ÚTILES
export const AUDIENCIAS_DEMO = [
  { id: 'administracion', nombre: 'Administración Pública', icono: '🏛️' },
  { id: 'empresa', nombre: 'Empresa Privada', icono: '🏢' },
  { id: 'sindicato', nombre: 'Organización Sindical', icono: '👥' },
  { id: 'ciudadano', nombre: 'Ciudadano', icono: '👤' },
  { id: 'stakeholder', nombre: 'Directivo/Decisor', icono: '👔' },
  { id: 'desarrollador', nombre: 'Equipo Técnico', icono: '💻' }
] as const

export const VISTAS_DEMO = [
  { id: 'dashboard', nombre: 'Panel Principal', icono: '📊' },
  { id: 'feed', nombre: 'Feed Social', icono: '📱' },
  { id: 'grupos', nombre: 'Grupos', icono: '👥' },
  { id: 'eventos', nombre: 'Eventos', icono: '📅' },
  { id: 'directorio', nombre: 'Directorio', icono: '📇' },
  { id: 'mensajeria', nombre: 'Mensajería', icono: '💬' },
  { id: 'empresas', nombre: 'Empresas', icono: '🏢' },
  { id: 'analytics', nombre: 'Analytics', icono: '📈' }
] as const

export const FUNCIONALIDADES_DESTACABLES = [
  'networking_profesional',
  'grupos_tematicos', 
  'eventos_formativos',
  'mensajeria_institucional',
  'directorio_funcionarios',
  'ofertas_exclusivas',
  'dashboard_analytics',
  'integracion_sistemas',
  'movil_responsive',
  'multiidioma'
] as const