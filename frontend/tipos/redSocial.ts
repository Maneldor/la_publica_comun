import { ConfiguracionComunidad } from '../configuracion/comunidades';

// ===== TIPOS DE USUARIOS =====
export type TipoUsuario = 
  | 'admin-web'
  | 'gestor-empresas'
  | 'gestor-administraciones'
  | 'administrador-grupo'
  | 'empresa'
  | 'administracion'
  | 'sindicato'
  | 'miembro'; // Miembro regular

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  avatar?: string;
  tipo: TipoUsuario;
  comunidadId: string;
  verificado: boolean;
  activo: boolean;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
  perfil: PerfilUsuario;
  configuracion: ConfiguracionUsuario;
  estadisticas: EstadisticasUsuario;
}

export interface PerfilUsuario {
  biografia?: string;
  ubicacion?: string;
  organizacion?: string;
  cargo?: string;
  experiencia?: ExperienciaLaboral[];
  formacion?: FormacionAcademica[];
  especialidades?: string[];
  redesSociales?: RedesSociales;
  configuracionPrivacidad: ConfiguracionPrivacidad;
  porcentajeCompletado: number;
}

export interface ExperienciaLaboral {
  organizacion: string;
  cargo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  descripcion?: string;
  esActual: boolean;
}

export interface FormacionAcademica {
  institucion: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin?: Date;
  descripcion?: string;
}

export interface RedesSociales {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface ConfiguracionPrivacidad {
  perfilPublico: boolean;
  mostrarEmail: boolean;
  mostrarUbicacion: boolean;
  mostrarOrganizacion: boolean;
  permitirMensajes: boolean;
  permitirInvitacionesGrupos: boolean;
}

export interface ConfiguracionUsuario {
  idioma: string;
  notificaciones: ConfiguracionNotificaciones;
  tema: 'claro' | 'oscuro' | 'auto';
}

export interface ConfiguracionNotificaciones {
  email: {
    mensajes: boolean;
    grupoNuevoPost: boolean;
    invitacionGrupo: boolean;
    tablonAnuncios: boolean;
    eventos: boolean;
  };
  push: {
    mensajes: boolean;
    grupoNuevoPost: boolean;
    invitacionGrupo: boolean;
    menciones: boolean;
  };
}

export interface EstadisticasUsuario {
  gruposCreados: number;
  gruposUnido: number;
  postsCreados: number;
  comentarios: number;
  conexiones: number;
  puntuacionReputacion: number;
}

// ===== GRUPOS =====
export type TipoGrupo = 'publico' | 'privado' | 'oculto';
export type CategoriaGrupo = 'afinidad' | 'profesional' | 'geografico';

export interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  avatar?: string;
  portada?: string;
  tipo: TipoGrupo;
  categoria: CategoriaGrupo;
  subcategoria: string;
  comunidadId: string;
  creadorId: string;
  administradores: string[];
  moderadores: string[];
  miembros: MiembroGrupo[];
  reglas?: string[];
  fechaCreacion: Date;
  configuracion: ConfiguracionGrupo;
  estadisticas: EstadisticasGrupo;
  etiquetas: string[];
}

export interface MiembroGrupo {
  usuarioId: string;
  rol: 'administrador' | 'moderador' | 'miembro';
  fechaUnion: Date;
  activo: boolean;
}

export interface ConfiguracionGrupo {
  requiereAprobacion: boolean;
  permitirInvitaciones: boolean;
  moderacionPosts: boolean;
  limiteMiembros?: number;
  restringidoPorUbicacion?: string;
  restringidoPorOrganizacion?: string[];
}

export interface EstadisticasGrupo {
  totalMiembros: number;
  miembrosActivos: number;
  postsEstesMes: number;
  crecimientoMensual: number;
}

// ===== POSTS Y CONTENIDO =====
export type TipoPost = 'texto' | 'imagen' | 'video' | 'enlace' | 'documento' | 'evento' | 'oferta' | 'demanda';

export interface Post {
  id: string;
  autorId: string;
  grupoId?: string; // null si es post personal
  tipo: TipoPost;
  contenido: string;
  multimedia?: MultimediaPost[];
  enlace?: EnlacePost;
  evento?: EventoPost;
  oferta?: OfertaPost;
  demanda?: DemandaPost;
  etiquetas: string[];
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  visibilidad: 'publico' | 'miembros' | 'conexiones';
  moderado: boolean;
  fijado: boolean;
  comentarios: Comentario[];
  reacciones: Reaccion[];
  estadisticas: EstadisticasPost;
}

export interface MultimediaPost {
  tipo: 'imagen' | 'video' | 'documento';
  url: string;
  nombre?: string;
  descripcion?: string;
}

export interface EnlacePost {
  url: string;
  titulo?: string;
  descripcion?: string;
  imagen?: string;
}

export interface EventoPost {
  titulo: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  ubicacion?: string;
  modalidad: 'presencial' | 'online' | 'hibrido';
  maxParticipantes?: number;
  precio?: number;
  enlaceRegistro?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  modalidad: 'presencial' | 'online' | 'hibrido';
  fechaInicio: Date;
  fechaFin?: Date;
  ubicacion?: string;
  capacidadMaxima?: number;
  asistentes?: number;
  fechaCreacion: Date;
  creadorId: string;
  comunidadId: string;
  estado: 'programado' | 'en-curso' | 'finalizado' | 'cancelado';
  esGratuito: boolean;
  precio?: number;
  requiereAprobacion: boolean;
  organizador: string;
  activo: boolean;
  etiquetas: string[];
}

export interface OfertaPost {
  titulo: string;
  organizacion: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  salario?: {
    minimo?: number;
    maximo?: number;
    complementos?: string;
  };
  fechaLimite?: Date;
  requisitos: string[];
  enlaceAplicacion?: string;
}

export interface DemandaPost {
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion?: string;
  presupuesto?: {
    minimo?: number;
    maximo?: number;
  };
  fechaLimite?: Date;
  requisitos?: string[];
  contacto: string;
}

export interface Comentario {
  id: string;
  autorId: string;
  postId: string;
  contenido: string;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  respuestas: Comentario[];
  reacciones: Reaccion[];
  moderado: boolean;
}

export interface Reaccion {
  usuarioId: string;
  tipo: 'like' | 'love' | 'wow' | 'angry' | 'sad';
  fechaCreacion: Date;
}

export interface EstadisticasPost {
  visualizaciones: number;
  comentarios: number;
  reacciones: { [key: string]: number };
  compartidos: number;
}

// ===== MENSAJERÍA =====
export interface Conversacion {
  id: string;
  participantes: string[];
  tipo: 'individual' | 'grupal' | 'empresa-admin';
  nombre?: string;
  ultimoMensaje?: Mensaje;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  archivada: boolean;
  silenciada: boolean;
  mensajesNoLeidos?: number;
}

export interface Mensaje {
  id: string;
  conversacionId: string;
  emisorId: string;
  contenido: string;
  tipo: 'texto' | 'imagen' | 'archivo' | 'enlace';
  multimedia?: MultimediaPost;
  fechaEnvio: Date;
  fechaLectura?: Date;
  editado: boolean;
  respondiendo?: string; // ID del mensaje al que responde
  adjuntos?: ArchivoAdjunto[];
  reacciones?: ReaccionMensaje[];
  linkPreviews?: LinkPreviewData[]; // Previews de enlaces encontrados en el mensaje
}

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  favicon: string;
  error?: string;
}

export interface ArchivoAdjunto {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  isImage: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ReaccionMensaje {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  user?: Usuario; // Usuario que reaccionó (opcional para display)
  createdAt: Date;
  updatedAt: Date;
}

// ===== EMPRESAS Y ORGANIZACIONES =====
export interface PerfilEmpresa {
  id: string;
  nombre: string;
  razonSocial: string;
  cif: string;
  tipo: 'empresa-privada' | 'organismo-publico' | 'sindicato';
  descripcion: string;
  logo?: string;
  portada?: string;
  ubicacion: UbicacionEmpresa;
  contacto: ContactoEmpresa;
  datosLegales: DatosLegalesEmpresa;
  comunidadId: string;
  gestorId: string; // Usuario responsable
  verificado: boolean;
  activo: boolean;
  fechaRegistro: Date;
  configuracion: ConfiguracionEmpresa;
  estadisticas: EstadisticasEmpresa;
}

export interface UbicacionEmpresa {
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
}

export interface ContactoEmpresa {
  telefono?: string;
  email: string;
  website?: string;
  redesSociales?: RedesSociales;
}

export interface DatosLegalesEmpresa {
  numeroRegistroMercantil?: string;
  fechaConstitucion?: Date;
  capitalSocial?: number;
  numeroEmpleados?: string;
  sectorActividad: string;
}

export interface ConfiguracionEmpresa {
  perfilPublico: boolean;
  permitirContactoDirecto: boolean;
  mostrarDatosContacto: boolean;
  notificacionesAnalytics: boolean;
}

export interface EstadisticasEmpresa {
  ofertasPublicadas: number;
  candidatosContactados: number;
  visualizacionesPerfil: number;
  interaccionesPosts: number;
}

// ===== DASHBOARD EMPRESAS =====
export interface DashboardEmpresa {
  empresaId: string;
  ofertas: OfertaEmpresa[];
  candidatos: CandidatoEmpresa[];
  analytics: AnalyticsEmpresa;
  mensajes: ConversacionEmpresa[];
  informes: InformeAdmin[];
}

export interface OfertaEmpresa {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'borrador' | 'activa' | 'pausada' | 'cerrada';
  fechaCreacion: Date;
  fechaPublicacion?: Date;
  fechaCierre?: Date;
  candidatos: CandidatoOferta[];
  estadisticas: EstadisticasOferta;
}

export interface CandidatoEmpresa {
  usuarioId: string;
  ofertaId: string;
  fechaAplicacion: Date;
  estado: 'pendiente' | 'revisado' | 'entrevista' | 'rechazado' | 'aceptado';
  notas?: string;
  puntuacion?: number;
}

export interface CandidatoOferta {
  usuarioId: string;
  fechaAplicacion: Date;
  estado: 'nuevo' | 'revisado' | 'entrevista' | 'rechazado' | 'aceptado';
  notas?: string;
}

export interface EstadisticasOferta {
  visualizaciones: number;
  aplicaciones: number;
  tasaConversion: number;
  origenCandidatos: { [fuente: string]: number };
}

export interface AnalyticsEmpresa {
  periodo: 'semana' | 'mes' | 'trimestre' | 'año';
  metricas: {
    alcancePosts: number;
    interacciones: number;
    nuevosSeguidores: number;
    visitasPerfil: number;
    aplicacionesOfertas: number;
  };
  tendencias: {
    alcance: TendenciaMetrica;
    interacciones: TendenciaMetrica;
    aplicaciones: TendenciaMetrica;
  };
}

export interface TendenciaMetrica {
  valor: number;
  cambio: number;
  tipo: 'positivo' | 'negativo' | 'neutral';
}

export interface ConversacionEmpresa extends Conversacion {
  asunto?: string;
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente';
  categoria: 'consulta' | 'incidencia' | 'colaboracion' | 'otros';
}

export interface InformeAdmin {
  id: string;
  titulo: string;
  tipo: 'mensual' | 'trimestral' | 'personalizado';
  fechaGeneracion: Date;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  contenido: ContenidoInforme;
  archivosAdjuntos?: string[];
}

export interface ContenidoInforme {
  resumenEjecutivo: string;
  metricas: any;
  recomendaciones: string[];
  proximosHitos: string[];
}

// ===== TABLÓN DE ANUNCIOS =====
export interface AnuncioTablon {
  id: string;
  autorId: string;
  tipo: 'anuncio' | 'demanda';
  categoria: string;
  titulo: string;
  descripcion: string;
  ubicacion?: string;
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  destacado: boolean;
  moderado: boolean;
  contacto: ContactoAnuncio;
  etiquetas: string[];
  adjuntos?: MultimediaPost[];
  estadisticas: EstadisticasAnuncio;
}

export interface ContactoAnuncio {
  nombre: string;
  email?: string;
  telefono?: string;
  preferencia: 'email' | 'telefono' | 'mensaje-plataforma';
}

export interface EstadisticasAnuncio {
  visualizaciones: number;
  contactos: number;
  favoritos: number;
}

// ===== NOTIFICACIONES =====
export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  datos: any; // Datos específicos según el tipo
  leida: boolean;
  fechaCreacion: Date;
  fechaLectura?: Date;
  accion?: AccionNotificacion;
}

export type TipoNotificacion = 
  | 'mensaje-nuevo'
  | 'invitacion-grupo'
  | 'post-grupo'
  | 'comentario-post'
  | 'reaccion-post'
  | 'mencion'
  | 'evento-recordatorio'
  | 'oferta-nueva'
  | 'empresa-mensaje'
  | 'admin-comunicado'
  | 'sistema';

export interface AccionNotificacion {
  tipo: 'enlace' | 'modal' | 'accion';
  valor: string;
  texto: string;
}

// ===== RESPUESTAS API =====
export interface RespuestaAPI<T> {
  datos: T;
  exito: boolean;
  mensaje?: string;
  errores?: string[];
  meta?: MetadatosPaginacion;
}

export interface MetadatosPaginacion {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// ===== FILTROS Y BÚSQUEDAS =====
export interface FiltrosGrupos {
  comunidad?: string;
  categoria?: CategoriaGrupo;
  subcategoria?: string;
  tipo?: TipoGrupo;
  busqueda?: string;
  ubicacion?: string;
  ordenarPor?: 'recientes' | 'populares' | 'alfabetico' | 'actividad';
}

export interface FiltrosPosts {
  autor?: string;
  grupo?: string;
  tipo?: TipoPost;
  fechaDesde?: Date;
  fechaHasta?: Date;
  etiquetas?: string[];
  busqueda?: string;
  ordenarPor?: 'recientes' | 'populares' | 'comentarios' | 'reacciones';
}

export interface FiltrosUsuarios {
  comunidad?: string;
  tipo?: TipoUsuario;
  ubicacion?: string;
  organizacion?: string;
  especialidades?: string[];
  busqueda?: string;
  verificados?: boolean;
  ordenarPor?: 'recientes' | 'alfabetico' | 'reputacion' | 'actividad';
}