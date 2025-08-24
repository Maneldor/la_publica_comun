// 🌐 SISTEMA I18N PARA LA PÚBLICA
// Sistema especializado para 4 idiomas oficiales + traducción automática

// ✅ IDIOMAS OFICIALES (solo estos 4 para edición de contenido)
export type IdiomaOficial = 'es' | 'ca' | 'eu' | 'gl'

// ✅ MAPEO DE COMUNIDADES → IDIOMAS
export const IDIOMAS_POR_COMUNIDAD: Record<string, IdiomaOficial> = {
  // Español
  'madrid': 'es',
  'andalucia': 'es',
  'castilla-leon': 'es',
  'castilla-mancha': 'es',
  'extremadura': 'es',
  'murcia': 'es',
  'aragon': 'es',
  'rioja': 'es',
  'cantabria': 'es',
  'asturias': 'es',
  
  // Catalán
  'catalunya': 'ca',
  'valencia': 'ca',  // Valenciano = Catalán según normativa
  'baleares': 'ca',
  
  // Euskera
  'euskadi': 'eu',
  'navarra': 'eu',   // Navarra es bilingüe, pero priorizamos euskera
  
  // Gallego
  'galicia': 'gl'
}

// ✅ METADATOS DE IDIOMAS
export interface InfoIdioma {
  codigo: IdiomaOficial
  nombre: string
  nombreNativo: string
  pais: string
  comunidades: string[]
  esCooficial: boolean
}

export const METADATOS_IDIOMAS: Record<IdiomaOficial, InfoIdioma> = {
  es: {
    codigo: 'es',
    nombre: 'Español',
    nombreNativo: 'Español',
    pais: 'España',
    comunidades: ['madrid', 'andalucia', 'castilla-leon', 'castilla-mancha', 'extremadura', 'murcia', 'aragon', 'rioja', 'cantabria', 'asturias'],
    esCooficial: false
  },
  ca: {
    codigo: 'ca', 
    nombre: 'Catalán',
    nombreNativo: 'Català',
    pais: 'España',
    comunidades: ['catalunya', 'valencia', 'baleares'],
    esCooficial: true
  },
  eu: {
    codigo: 'eu',
    nombre: 'Euskera', 
    nombreNativo: 'Euskera',
    pais: 'España',
    comunidades: ['euskadi', 'navarra'],
    esCooficial: true
  },
  gl: {
    codigo: 'gl',
    nombre: 'Gallego',
    nombreNativo: 'Galego', 
    pais: 'España',
    comunidades: ['galicia'],
    esCooficial: true
  }
}

// ✅ CONTENIDO MULTIIDIOMA (lo que crean los usuarios)
export interface ContenidoMultiidioma {
  id: string
  autorId: string
  fechaCreacion: Date
  
  // Contenido original (en el idioma que el autor escribió)
  idiomaOriginal: IdiomaOficial
  textoOriginal: string
  
  // Traducciones automáticas a los otros 3 idiomas
  traducciones: Partial<Record<IdiomaOficial, TraduccionContenido>>
  
  // Metadatos
  tipoContenido: 'post' | 'comentario' | 'evento' | 'anuncio' | 'grupo'
  requiereTraduccion: boolean
  esOficial: boolean // Contenido oficial de administraciones
}

export interface TraduccionContenido {
  texto: string
  fechaTraduccion: Date
  metodoTraduccion: 'automatica' | 'manual' | 'profesional'
  calidad: number // 0-100, confianza en la traducción
  revisadaPor?: string // userId si fue revisada manualmente
}

// ✅ CONFIGURACIÓN USUARIO
export interface ConfiguracionI18nUsuario {
  // Idioma de interfaz (menús, botones, etc.)
  idiomaInterfaz: IdiomaOficial
  
  // Preferencias de visualización de contenido
  traducirContenidoAutomaticamente: boolean
  mostrarIdiomaOriginal: boolean
  priorizarContenidoEnMiIdioma: boolean
  
  // Configuración avanzada
  aceptarTraducciones: {
    automaticas: boolean
    manuales: boolean
    profesionales: boolean
  }
  
  // Para moderadores/administradores
  puedeTraducir: IdiomaOficial[]
  puedeRevisarTraducciones: boolean
}

// ✅ KEYS DE TRADUCCIÓN INTERFAZ (menús, botones, etc.)
export interface KeysTraduccionInterfaz {
  // Navegación
  'nav.inicio': string
  'nav.grupos': string
  'nav.eventos': string
  'nav.mensajes': string
  'nav.perfil': string
  'nav.configuracion': string
  
  // Acciones comunes
  'accion.crear': string
  'accion.editar': string
  'accion.eliminar': string
  'accion.compartir': string
  'accion.guardar': string
  'accion.cancelar': string
  'accion.buscar': string
  
  // Posts y contenido
  'post.crear': string
  'post.publicar': string
  'post.comentar': string
  'post.megusta': string
  'post.compartir': string
  'post.denunciar': string
  
  // Grupos
  'grupo.unirse': string
  'grupo.salir': string
  'grupo.crear': string
  'grupo.administrar': string
  'grupo.miembros': string
  
  // Eventos
  'evento.asistir': string
  'evento.noAsistir': string
  'evento.crear': string
  'evento.detalles': string
  
  // Mensajería
  'mensaje.enviar': string
  'mensaje.nuevo': string
  'mensaje.conversacion': string
  
  // Estados
  'estado.cargando': string
  'estado.error': string
  'estado.vacio': string
  'estado.conectado': string
  'estado.desconectado': string
  
  // Configuración
  'config.idioma': string
  'config.notificaciones': string
  'config.privacidad': string
  'config.cuenta': string
  
  // Temporal y fechas
  'tiempo.ahora': string
  'tiempo.hace_minutos': string
  'tiempo.hace_horas': string
  'tiempo.hace_dias': string
  'tiempo.hace_semanas': string
  'tiempo.hace_meses': string
  
  // Demo específico
  'demo.bienvenida': string
  'demo.tour_guiado': string
  'demo.explorar_libre': string
  'demo.no_interesa': string
  'demo.solicitar_demo': string
  'demo.contactar': string
}

// ✅ CONTEXTO DE TRADUCCIÓN
export interface ContextoI18n {
  // Estado actual
  idiomaActivo: IdiomaOficial
  comunidadActiva: string
  configuracionUsuario: ConfiguracionI18nUsuario
  
  // Funciones principales
  t: (key: keyof KeysTraduccionInterfaz, params?: Record<string, string>) => string
  translateContent: (contenido: ContenidoMultiidioma) => Promise<string>
  cambiarIdioma: (nuevoIdioma: IdiomaOficial) => void
  
  // Utilities
  obtenerIdiomaParaComunidad: (comunidadId: string) => IdiomaOficial
  formatearFecha: (fecha: Date, formato?: 'corto' | 'largo' | 'relativo') => string
  formatearNumero: (numero: number) => string
  
  // Estado de traducciones
  traduciendo: boolean
  errorTraduccion?: string
}

// ✅ TIPOS PARA SERVICIOS DE TRADUCCIÓN
export interface ServicioTraduccionConfig {
  provider: 'google' | 'deepl' | 'microsoft' | 'interno'
  apiKey?: string
  region?: string
  cache: boolean
  timeout: number
}

export interface ResultadoTraduccion {
  textoTraducido: string
  idiomaDetectado?: IdiomaOficial
  confianza: number
  tiempoMs: number
  provider: string
  error?: string
}

// ✅ CONFIGURACIÓN DE FALLBACKS
export const FALLBACK_IDIOMAS: Record<IdiomaOficial, IdiomaOficial[]> = {
  ca: ['es', 'eu', 'gl'], // Si no hay traducción al catalán, intentar español
  eu: ['es', 'ca', 'gl'], // Si no hay traducción al euskera, intentar español  
  gl: ['es', 'ca', 'eu'], // Si no hay traducción al gallego, intentar español
  es: ['ca', 'gl', 'eu']  // Si no hay traducción al español, intentar catalán
}

// ✅ PATRONES COMUNES DE TEXTO
export interface PatronesTexto {
  // Para detectar y no traducir
  urls: RegExp
  emails: RegExp
  hashtags: RegExp
  menciones: RegExp
  codigo: RegExp
  numeros: RegExp
  
  // Para mantener formato
  markdown: RegExp
  html: RegExp
  emojis: RegExp
}