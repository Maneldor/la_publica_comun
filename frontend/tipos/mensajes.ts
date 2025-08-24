// 🎯 TIPOS CENTRALIZADOS DE MENSAJERÍA
// Sistema completo de mensajería en tiempo real

export type EstadoUsuario = 'online' | 'offline' | 'ausent' | 'ocupado'
export type TipoMensaje = 'text' | 'imatge' | 'document' | 'audio' | 'video' | 'emoji' | 'ubicacion'
export type EstadoMensaje = 'enviando' | 'enviado' | 'entregado' | 'llegit' | 'error'
export type TipoTrucada = 'audio' | 'video'
export type EstadoTrucada = 'llamando' | 'activa' | 'finalizada' | 'perdida' | 'rechazada'

// ✅ USUARIOS Y PERFILES
export interface PerfilUsuario {
  id: string
  nom: string
  avatar?: string
  inicials: string
  estat: EstadoUsuario
  ultimaActivitat?: Date
  esBloquejat?: boolean
}

// ✅ ARCHIVOS Y MEDIA
export interface ArchivoMensaje {
  id: string
  nom: string
  url: string
  urlThumbnail?: string
  mida: number
  tipus: string // MIME type
  durada?: number // Para audio/video en segundos
  dimensiones?: {
    width: number
    height: number
  }
}

// ✅ MENSAJES
export interface Mensaje {
  id: string
  conversacioId: string
  autorId: string
  text?: string
  tipus: TipoMensaje
  estat: EstadoMensaje
  dataCreacio: Date
  dataLectura?: Date
  editatA?: Date
  eliminatA?: Date
  
  // Contenido específico por tipo
  arxiu?: ArchivoMensaje
  ubicacio?: {
    latitud: number
    longitud: number
    nom?: string
  }
  
  // Metadata
  responentA?: string // ID del mensaje al que responde
  reaccions?: { [emoji: string]: string[] } // emoji -> userIds
  mencions?: string[] // userIds mencionados
  
  // Flags
  esImportant?: boolean
  esEliminat?: boolean
  esEditat?: boolean
}

// ✅ CONVERSACIONES
export interface Conversacion {
  id: string
  tipus: 'individual' | 'grupo'
  nom?: string // Solo para grupos
  descripcio?: string
  avatar?: string
  
  // Participantes
  participants: string[] // userIds
  administradors?: string[] // Solo para grupos
  creadorId?: string
  
  // Estado
  ultimMissatge?: {
    id: string
    text: string
    autorNom: string
    data: Date
    tipus: TipoMensaje
  }
  missatgesNoLlegits: number
  dataUltimaActivitat: Date
  dataCreacio: Date
  
  // Configuración
  silenciat: boolean
  arxivat: boolean
  fixat: boolean
  
  // Configuración de grupo
  configuracio?: {
    nomesPotAfegirAdmins: boolean
    nomesPotEscriureAdmins: boolean
    historialVisible: boolean
  }
}

// ✅ TRUCADAS / LLAMADAS
export interface Trucada {
  id: string
  conversacioId: string
  iniciadorId: string
  participants: string[]
  tipus: TipoTrucada
  estat: EstadoTrucada
  dataInici: Date
  dataFi?: Date
  durada?: number // en segundos
  urlSala?: string // URL de Jitsi/WebRTC
  
  // Configuración
  camaraActivada?: boolean
  microfonActivat?: boolean
  pantallCompartida?: boolean
}

// ✅ NOTIFICACIONES
export interface NotificacioMensatge {
  id: string
  tipus: 'missatge_nou' | 'trucada_entrant' | 'trucada_perduda' | 'usuari_escrivint'
  conversacioId: string
  usuariId?: string
  data: Date
  llegida: boolean
  
  // Contenido específico
  missatgeId?: string
  trucadaId?: string
  textPreview?: string
}

// ✅ ESTADO DE ESCRITURA
export interface EstatEscriptura {
  conversacioId: string
  usuariId: string
  dataInicio: Date
  actiu: boolean
}

// ✅ CONFIGURACIÓN DE MENSAJERÍA
export interface ConfiguracioMensajeria {
  // Notificaciones
  notificacionsSo: boolean
  notificacionsVisuals: boolean
  notificacionsDesktop: boolean
  
  // Privacidad
  mostrarEstatLectura: boolean
  mostrarUltimaConexio: boolean
  bloquejarDesconeguts: boolean
  
  // Interfaz
  temaFosc: boolean
  midaFont: 'petita' | 'normal' | 'gran'
  mostrarEmojis: boolean
  autodescarregarMedia: boolean
  
  // Calls
  qualityVideo: 'baixa' | 'mitja' | 'alta'
  micPerDefecte: boolean
  camaraPerDefecte: boolean
}

// ✅ FILTROS Y BÚSQUEDA
export interface FiltresMensajeria {
  cerca: string
  mostrarNomesNoLlegits: boolean
  mostrarNomesOnline: boolean
  tipus: 'tots' | 'individuals' | 'grups'
  estat: 'tots' | 'actius' | 'arxivats'
  periode: 'avui' | 'setmana' | 'mes' | 'tots'
}

// ✅ ESTADÍSTICAS
export interface EstadistiquesMensajeria {
  totalConversacions: number
  conversacionsActives: number
  missatgesAvui: number
  missatgesSetmana: number
  trucadesAvui: number
  duradadeTrucadesAvui: number // en minutos
  usuarisOnline: number
  
  conversacioMesActiva?: {
    id: string
    nom: string
    missatgesCount: number
  }
}

// ✅ PROPS DE COMPONENTES
export interface PropietatsListaConversacions {
  conversacions: Conversacion[]
  conversacioActiva?: string
  filtres: FiltresMensajeria
  onSeleccionarConversacio: (conversacio: Conversacion) => void
  onCanviarFiltres: (filtres: Partial<FiltresMensajeria>) => void
  cargando?: boolean
}

export interface PropietatsChatWindow {
  conversacio: Conversacion
  missatges: Mensaje[]
  usuarisEscrivint: EstatEscriptura[]
  onEnviarMissatge: (text: string, tipus?: TipoMensaje, arxiu?: File) => Promise<void>
  onMarcarComLlegit: (missatgeId: string) => void
  onIniciarTrucada: (tipus: TipoTrucada) => void
  cargando?: boolean
}

export interface PropietatsMessageInput {
  onEnviarMissatge: (text: string, tipus?: TipoMensaje, arxiu?: File) => Promise<void>
  onEscribint: (actiu: boolean) => void
  desactivat?: boolean
  placeholder?: string
}

export interface PropietatsCallInterface {
  trucada: Trucada
  onFinalitzar: () => void
  onToggleMicrofo: () => void
  onToggleCamera: () => void
  onTogglePantalla: () => void
}

// ✅ EVENTOS WEBSOCKET
export interface EventoWebSocket {
  tipus: 'missatge_nou' | 'missatge_llegit' | 'usuari_escrivint' | 'usuari_online' | 'usuari_offline' | 'trucada_entrant'
  data: any
  timestamp: Date
}

// ✅ API INTERFACES
export interface CrearConversacioRequest {
  participants: string[]
  tipus: 'individual' | 'grupo'
  nom?: string
  descripcio?: string
}

export interface EnviarMensajeRequest {
  conversacioId: string
  text?: string
  tipus: TipoMensaje
  arxiu?: File
  responentA?: string
}

// ✅ CONSTANTES Y UTILIDADES
export const TIPO_ARCHIVO_ICONS: Record<string, string> = {
  'image/*': '🖼️',
  'video/*': '🎥',
  'audio/*': '🎵',
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'text/*': '📄',
  'default': '📎'
}

export const ESTADO_COLORS: Record<EstadoUsuario, string> = {
  online: '#10B981',
  offline: '#6B7280',
  ausent: '#F59E0B',
  ocupado: '#EF4444'
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_MESSAGE_LENGTH = 2000
export const TYPING_TIMEOUT = 3000 // 3 seconds
export const MESSAGE_BATCH_SIZE = 50