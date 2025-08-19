import { ConfiguracionComunidad } from '../configuracion/comunidades';

// Tipos base para el sistema multi-comunidad RED SOCIAL
export interface ContextoComunidad {
  configuracion: ConfiguracionComunidad;
  idioma: string;
  cambiarIdioma: (idioma: string) => void;
  estaActiva: boolean;
}

// Tipos para usuarios de la red social
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

export type TipoUsuario =
  | 'admin-web'
  | 'gestor-empresas'
  | 'gestor-administraciones'
  | 'editor'
  | 'administrador-grupo'
  | 'empresa'
  | 'administracion'
  | 'sindicato'
  | 'miembro';

// Perfil de usuario para red social
export interface PerfilUsuario {
  biografia?: string;
  ubicacion?: string;
  organizacion?: string;
  cargo?: string;
  tipologiaProfesion?: TipologiaProfesion;
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

// Tipos para grupos de la red social
export type TipoGrupo = 'publico' | 'privado' | 'secreto';
export type CategoriaGrupo = 'afinidad' | 'profesional' | 'geografico';
export type TipologiaProfesion = 
  | 'policia'
  | 'bomberos' 
  | 'sanitario'
  | 'docente'
  | 'tecnico-informatica'
  | 'administrativo'
  | 'justicia'
  | 'hacienda'
  | 'medio-ambiente'
  | 'obras-publicas'
  | 'cultura'
  | 'servicios-sociales'
  | 'otro';

export interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  avatar?: string;
  portada?: string;
  tipo: TipoGrupo;
  categoria: CategoriaGrupo;
  subcategoria?: string;
  tipologiaProfesion?: TipologiaProfesion;
  comunidadId: string;
  creadorId: string;
  administradores: string[];
  moderadores: string[];
  miembros: MiembroGrupo[];
  solicitudesPendientes: SolicitudGrupo[];
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

export interface SolicitudGrupo {
  id: string;
  usuarioId: string;
  mensaje?: string;
  fechaSolicitud: Date;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaRespuesta?: Date;
  administradorId?: string;
  motivoRechazo?: string;
}

export interface InvitacionGrupo {
  id: string;
  grupoId: string;
  invitadoPorId: string;
  usuarioInvitadoId: string;
  mensaje?: string;
  fechaInvitacion: Date;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  fechaRespuesta?: Date;
}

export interface ConfiguracionGrupo {
  requiereAprobacion: boolean;
  permitirInvitaciones: boolean;
  soloInvitacion: boolean; // Para grupos secretos
  moderacionPosts: boolean;
  limiteMiembros?: number;
  maxGruposPorUsuario?: number; // Para grupos privados profesionales
  restringidoPorUbicacion?: string;
  restringidoPorOrganizacion?: string[];
  restringidoPorProfesion?: TipologiaProfesion;
}

export interface EstadisticasGrupo {
  totalMiembros: number;
  miembrosActivos: number;
  postsEstesMes: number;
  crecimientoMensual: number;
}

// Tipos para posts en la red social
export type TipoPost =
  | 'texto'
  | 'imagen'
  | 'video'
  | 'enlace'
  | 'documento'
  | 'evento'
  | 'oferta'
  | 'demanda';

export interface Post {
  id: string;
  autorId: string;
  grupoId?: string;
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

// Tipos para empresas y organizaciones
export interface PerfilEmpresa {
  id: string;
  nombre: string;
  razonSocial: string;
  cif: string;
  tipo: 'empresa' | 'administracion' | 'sindicato';
  descripcion: string;
  logo?: string;
  portada?: string;
  ubicacion: UbicacionEmpresa;
  contacto: ContactoEmpresa;
  comunidadId: string;
  gestorId: string;
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

// Tipos para estadísticas de comunidad
export interface EstadisticasComunidad {
  comunidadId: string;
  totalUsuarios: number;
  totalGrupos: number;
  totalEmpresas: number;
  usuariosActivos: number;
  gruposActivos: number;
  postsEstesMes: number;
  estadisticasMes: {
    nuevosUsuarios: number;
    nuevosGrupos: number;
    nuevaEmpresas: number;
    porcentajeCambio: number;
  };
}

// Tipos para notificaciones
export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fechaCreacion: Date;
  datos?: Record<string, any>;
}

export type TipoNotificacion =
  | 'mensaje-nuevo'
  | 'invitacion-grupo'
  | 'solicitud-grupo'
  | 'solicitud-aprobada'
  | 'solicitud-rechazada'
  | 'post-grupo'
  | 'comentario-post'
  | 'reaccion-post'
  | 'mencion'
  | 'evento-recordatorio'
  | 'empresa-mensaje'
  | 'admin-comunicado'
  | 'sistema';

// Tipos para respuestas de API
export interface RespuestaAPI<T> {
  datos: T;
  exito: boolean;
  mensaje?: string;
  errores?: string[];
  meta?: {
    total: number;
    pagina: number;
    limite: number;
  };
}

// Tipos para filtros y búsquedas
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

export interface ParametrosPaginacion {
  pagina: number;
  limite: number;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

// Tipos para tablón de anuncios
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
