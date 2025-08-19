import { Usuario, TipoGrupo, CategoriaGrupo } from './redSocial'

// ===== TIPOS DE GRUPOS AVANZADOS =====
export type RolGrupo = 'embaixador' | 'administrador' | 'moderador' | 'miembro' | 'pendiente'
export type EstadoMiembro = 'activo' | 'suspendido' | 'baneado' | 'pendiente_aprobacion'
export type TipoActividad = 'post' | 'comentario' | 'unirse' | 'invitacion' | 'multimedia' | 'documento' | 'oferta'

export interface GrupoAvanzado {
  id: string
  nombre: string
  slug: string // URL amigable
  descripcion: string
  descripcionLarga?: string
  avatar?: string
  portada?: string
  tipo: TipoGrupo
  categoria: CategoriaGrupo
  subcategoria?: string
  
  // Jerarquía de subgrupos
  grupoPadreId?: string
  subgrupos: string[] // IDs de subgrupos
  nivel: number // 0 = grupo principal, 1-4 = subgrupos
  rutaCompleta: string // "grupo-principal/subgrupo-1/subgrupo-2"
  
  // Información básica
  comunidadId: string
  fechaCreacion: Date
  fechaActualizacion: Date
  activo: boolean
  
  // Gestión y configuración
  propietarioId: string
  configuracion: ConfiguracionGrupoAvanzada
  estadisticas: EstadisticasGrupoAvanzadas
  
  // Miembros y roles
  miembros: MiembroGrupoAvanzado[]
  totalMiembros: number
  limiteMiembros?: number
  
  // Contenido
  etiquetas: string[]
  reglas: ReglaGrupo[]
  
  // Social features
  esDestacado: boolean
  permiteInvitaciones: boolean
  requiereAprobacion: boolean
}

export interface MiembroGrupoAvanzado {
  usuarioId: string
  usuario?: Usuario
  rol: RolGrupo
  estado: EstadoMiembro
  fechaUnion: Date
  fechaUltimaActividad?: Date
  
  // Permisos específicos
  permisos: PermisosMinembro
  
  // Estadísticas del miembro en el grupo
  postsCreados: number
  comentarios: number
  archivosSubidos: number
  
  // Moderación
  advertencias: number
  fechaSuspension?: Date
  motivoSuspension?: string
  
  // Invitación
  invitadoPor?: string
  fechaInvitacion?: Date
}

export interface PermisosMinembro {
  puedePublicar: boolean
  puedeComentar: boolean
  puedeSubirArchivos: boolean
  puedeInvitar: boolean
  puedeCrearSubgrupos: boolean
  puedeModerar: boolean
  puedeVerMiembros: boolean
  puedeEnviarMensajes: boolean
}

export interface ConfiguracionGrupoAvanzada {
  // Privacidad y acceso
  requiereAprobacion: boolean
  permitirInvitaciones: boolean
  soloInvitacion: boolean
  
  // Contenido
  moderacionPosts: boolean
  permitirMultimedia: boolean
  permitirDocumentos: boolean
  limiteTamañoArchivo: number // MB
  formatosPermitidos: string[]
  
  // Comunicación
  chatHabilitado: boolean
  mensajeriaPrivada: boolean
  notificacionesGrupo: boolean
  
  // Subgrupos
  permitirSubgrupos: boolean
  nivelMaximoSubgrupos: number
  
  // Features especiales
  ofertasExclusivas: boolean
  sistemaReputacion: boolean
  gamificacion: boolean
  
  // Personalización
  temaPersonalizado?: string
  coloresPersonalizados?: {
    primario: string
    secundario: string
    fondo: string
  }
}

export interface EstadisticasGrupoAvanzadas {
  // Miembros
  totalMiembros: number
  miembrosActivos: number
  miembrosNuevos7dias: number
  miembrosNuevos30dias: number
  
  // Contenido
  totalPosts: number
  postsEstesMes: number
  totalComentarios: number
  totalReacciones: number
  
  // Archivos
  totalArchivos: number
  totalMultimedia: number
  totalDocumentos: number
  espacioUsado: number // MB
  
  // Actividad
  actividadDiaria: { fecha: Date, posts: number, comentarios: number, nuevosMinembros: number }[]
  horasMasActivas: number[]
  
  // Subgrupos
  totalSubgrupos: number
  subgruposActivos: number
}

export interface ReglaGrupo {
  id: string
  titulo: string
  descripcion: string
  orden: number
  activa: boolean
  fechaCreacion: Date
}

// ===== FEED DEL GRUPO =====
export interface PostGrupo {
  id: string
  autorId: string
  autor?: Usuario
  grupoId: string
  grupo?: GrupoAvanzado
  
  // Contenido
  tipo: 'texto' | 'imagen' | 'video' | 'documento' | 'enlace' | 'oferta' | 'evento' | 'encuesta'
  contenido: string
  titulo?: string
  
  // Multimedia y archivos
  multimedia: ArchivoMultimedia[]
  documentos: ArchivoDocumento[]
  
  // Metadatos
  fechaCreacion: Date
  fechaActualizacion?: Date
  fechaPublicacion?: Date
  
  // Moderación
  estado: 'borrador' | 'pendiente' | 'publicado' | 'rechazado' | 'suspendido'
  moderadoPor?: string
  motivoRechazo?: string
  
  // Interacciones
  comentarios: ComentarioPost[]
  reacciones: ReaccionPost[]
  compartidos: number
  
  // Configuración
  esPinneado: boolean
  esDestacado: boolean
  permiteComentarios: boolean
  visibilidad: 'miembros' | 'subgrupos' | 'publico'
  
  // Tags y categorización
  etiquetas: string[]
  mencionados: string[]
}

export interface ArchivoMultimedia {
  id: string
  tipo: 'imagen' | 'video' | 'audio'
  url: string
  urlThumbnail?: string
  nombre: string
  tamaño: number
  mimeType: string
  metadata?: {
    width?: number
    height?: number
    duracion?: number
    resolucion?: string
  }
  fechaSubida: Date
  subidoPor: string
}

export interface ArchivoDocumento {
  id: string
  tipo: 'pdf' | 'doc' | 'excel' | 'ppt' | 'txt' | 'otros'
  url: string
  urlPreview?: string
  nombre: string
  descripcion?: string
  tamaño: number
  mimeType: string
  fechaSubida: Date
  subidoPor: string
  descargas: number
  esExclusivo: boolean // Solo para miembros de cierto rol
}

export interface ComentarioPost {
  id: string
  postId: string
  autorId: string
  autor?: Usuario
  contenido: string
  fechaCreacion: Date
  fechaActualizacion?: Date
  
  // Jerarquía de respuestas
  comentarioPadreId?: string
  respuestas: ComentarioPost[]
  
  // Moderación
  estado: 'publicado' | 'pendiente' | 'rechazado' | 'suspendido'
  moderadoPor?: string
  
  // Interacciones
  reacciones: ReaccionPost[]
  mencionados: string[]
}

export interface ReaccionPost {
  id: string
  usuarioId: string
  usuario?: Usuario
  tipo: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry'
  fechaCreacion: Date
}

// ===== OFERTAS EXCLUSIVAS =====
export interface OfertaGrupo {
  id: string
  grupoId: string
  autorId: string
  
  // Información básica
  titulo: string
  descripcion: string
  descripcionLarga?: string
  categoria: string
  
  // Detalles de la oferta
  tipo: 'descuento' | 'producto' | 'servicio' | 'evento' | 'colaboracion'
  valor?: number
  moneda?: string
  porcentajeDescuento?: number
  
  // Validez
  fechaInicio: Date
  fechaFin?: Date
  esIlimitada: boolean
  
  // Restricciones
  limiteCantidad?: number
  cantidadUsada: number
  rolesPermitidos: RolGrupo[]
  nivelesMinimoRequerido?: number // Para gamificación
  
  // Contacto y aplicación
  enlaceExterno?: string
  instrucciones?: string
  codigoDescuento?: string
  
  // Estado
  activa: boolean
  destacada: boolean
  fechaCreacion: Date
  
  // Interacciones
  visualizaciones: number
  interesados: string[] // IDs de usuarios
  reclamados: OfertaReclamada[]
}

export interface OfertaReclamada {
  id: string
  ofertaId: string
  usuarioId: string
  fechaReclamo: Date
  estado: 'pendiente' | 'confirmada' | 'utilizada' | 'expirada'
  codigoUnico?: string
  notasUsuario?: string
}

// ===== CONEXIONES ENTRE MIEMBROS =====
export interface ConexionMiembro {
  id: string
  usuarioOrigenId: string
  usuarioDestinoId: string
  grupoId: string
  
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'bloqueada'
  fechaSolicitud: Date
  fechaRespuesta?: Date
  mensaje?: string
  
  // Metadatos de la conexión
  origen: 'grupo' | 'perfil' | 'actividad' | 'sugerencia'
  nivelConfianza: number // 1-5
  
  // Interacciones
  mensajesIntercambiados: number
  colaboracionesRealizadas: number
}

// ===== MENSAJERÍA DEL GRUPO =====
export interface MensajeGrupo {
  id: string
  grupoId: string
  emisorId: string
  emisor?: Usuario
  
  // Destinatarios
  tipo: 'todos' | 'roles' | 'usuarios_especificos'
  destinatarios?: string[] // IDs de usuarios específicos
  rolesDestino?: RolGrupo[] // Para mensajes a roles específicos
  
  // Contenido
  contenido: string
  multimedia?: ArchivoMultimedia[]
  documentos?: ArchivoDocumento[]
  
  // Metadatos
  fechaEnvio: Date
  fechaExpiracion?: Date
  
  // Estado
  esImportante: boolean
  requiereConfirmacion: boolean
  
  // Seguimiento
  lecturas: LecturaMensaje[]
  confirmaciones: ConfirmacionMensaje[]
}

export interface LecturaMensaje {
  usuarioId: string
  fechaLectura: Date
  dispositivo?: string
}

export interface ConfirmacionMensaje {
  usuarioId: string
  fechaConfirmacion: Date
  respuesta?: string
}

// ===== ACTIVIDADES DEL GRUPO =====
export interface ActividadGrupo {
  id: string
  grupoId: string
  usuarioId: string
  usuario?: Usuario
  
  tipo: TipoActividad
  accion: string
  descripcion: string
  
  // Metadatos
  fechaActividad: Date
  esPublica: boolean
  
  // Referencias
  objetoId?: string // ID del post, comentario, etc.
  objetoTipo?: string
  
  // Datos adicionales
  datosExtra?: Record<string, any>
}

// ===== INTERFACES PARA COMPONENTES =====
export interface FiltrosGrupoAvanzado {
  busqueda?: string
  categoria?: CategoriaGrupo
  tipo?: TipoGrupo
  nivel?: number
  tieneSubgrupos?: boolean
  ordenarPor?: 'recientes' | 'populares' | 'alfabetico' | 'actividad' | 'miembros'
  activos?: boolean
}

export interface ConfiguracionFeedGrupo {
  mostrarActividad: boolean
  mostrarNuevosMiembros: boolean
  mostrarOfertas: boolean
  filtroTipoPost: ('texto' | 'imagen' | 'video' | 'documento' | 'oferta' | 'evento')[]
  ordenamiento: 'recientes' | 'populares' | 'cronologico'
}

// ===== RESPUESTAS API =====
export interface RespuestaGrupoAPI<T> {
  datos: T
  exito: boolean
  mensaje?: string
  errores?: string[]
  meta?: {
    total: number
    pagina: number
    limite: number
    totalPaginas: number
  }
}

export interface EstadisticasGrupoDashboard {
  resumen: {
    totalGrupos: number
    gruposActivos: number
    totalMiembros: number
    miembrosActivos: number
  }
  crecimiento: {
    gruposNuevos: number
    miembrosNuevos: number
    postsNuevos: number
    actividad: number
  }
  topGrupos: {
    porMiembros: GrupoAvanzado[]
    porActividad: GrupoAvanzado[]
    porCrecimiento: GrupoAvanzado[]
  }
}