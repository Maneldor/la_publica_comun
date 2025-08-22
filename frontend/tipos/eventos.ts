// 🎯 TIPOS CENTRALIZADOS DE EVENTOS
// Extraídos de SistemaEventos.tsx para reutilización

export type CategoriaEvento = 'formacion' | 'networking' | 'conferencia' | 'taller' | 'reunion' | 'otros'
export type TipoEvento = 'presencial' | 'online' | 'hibrido'
export type ModalidadEvento = 'publico' | 'privado'
export type EstadoEvento = 'programado' | 'en-progreso' | 'finalizado' | 'cancelado'
export type AccionAsistencia = 'asistir' | 'no-asistir' | 'quizas'
export type VistaCalendario = 'mes' | 'semana' | 'dia'

// ✅ OPTIMIZACIÓN: Interface más limpia y tipada
export interface Evento {
  id: string
  titulo: string
  descripcion: string
  categoria: CategoriaEvento
  tipo: TipoEvento
  modalidad: ModalidadEvento
  fechaInicio: Date
  fechaFin?: Date
  ubicacion?: string
  capacidadMaxima?: number
  asistentes: number
  fechaCreacion: Date
  creadorId: string
  comunidadId: string
  estado: EstadoEvento
  esGratuito: boolean
  requiereAprobacion: boolean
  organizador: string
  activo: boolean
  etiquetas: string[]
  
  // ✅ CAMPOS ADICIONALES para funcionalidad completa
  urlReunion?: string // Para eventos online
  imagenPortada?: string
  precio?: number // Si no es gratuito
  certificadoId?: string // Para cursos/talleres
  materialAdjunto?: string[]
}

export interface ComentarioEvento {
  id: string
  autorId: string
  eventoId: string
  contenido: string
  fechaCreacion: Date
  autor?: {
    nombre: string
    avatar?: string
  }
}

export interface AsistenciaEvento {
  id: string
  usuarioId: string
  eventoId: string
  estado: AccionAsistencia
  fechaRespuesta: Date
  notas?: string
}

// ✅ FILTROS TIPADOS
export interface FiltrosEvento {
  busqueda: string
  categoria: CategoriaEvento | 'todas'
  tipo: TipoEvento | 'todos'
  modalidad: ModalidadEvento | 'todas'
  fecha: 'hoy' | 'semana' | 'mes' | 'todos'
  soloAsistiendo: boolean
  soloOrganizados: boolean
  estado: EstadoEvento[]
}

// ✅ CONFIGURACIÓN DE CALENDARIO
export interface ConfiguracionCalendario {
  vista: VistaCalendario
  fechaInicial: Date
  mostrarFinDeSemana: boolean
  horaInicio: number // 8 = 8:00 AM
  horaFin: number // 22 = 10:00 PM
  intervaloHoras: number // 1 = cada hora
}

// ✅ ESTADÍSTICAS DE EVENTOS
export interface EstadisticasEventos {
  totalEventos: number
  eventosEsteMes: number
  asistenciasEsteMes: number
  eventosMasPopulares: Array<{
    evento: Evento
    asistentes: number
  }>
  categoriasMasActivas: Array<{
    categoria: CategoriaEvento
    cantidad: number
  }>
}

// ✅ FORMULARIO DE EVENTO
export interface FormularioEventoData {
  titulo: string
  descripcion: string
  categoria: CategoriaEvento
  tipo: TipoEvento
  modalidad: ModalidadEvento
  fechaInicio: string // ISO string
  horaInicio: string
  fechaFin?: string
  horaFin?: string
  ubicacion?: string
  capacidadMaxima?: number
  esGratuito: boolean
  precio?: number
  requiereAprobacion: boolean
  etiquetas: string[]
  urlReunion?: string
  imagenPortada?: string
}

// ✅ PROPS DE COMPONENTES (Para separar componentes)
export interface PropiedadesFormularioEvento {
  abierto: boolean
  onCerrar: () => void
  onGuardar: (evento: FormularioEventoData) => Promise<void>
  evento?: Evento
  esEdicion?: boolean
  cargando?: boolean
}

export interface PropiedadesDetalleEvento {
  evento: Evento
  abierto: boolean
  onCerrar: () => void
  estaAsistiendo: boolean
  onGestionarAsistencia: (accion: AccionAsistencia) => Promise<void>
  onComentarEvento: (comentario: string) => Promise<void>
  comentarios: ComentarioEvento[]
  cargando?: boolean
}

export interface PropiedadesCalendarioEventos {
  eventos: Evento[]
  configuracion: ConfiguracionCalendario
  onCambiarConfiguracion: (config: Partial<ConfiguracionCalendario>) => void
  onSeleccionarEvento: (evento: Evento) => void
  cargando?: boolean
}

export interface PropiedadesListaEventos {
  eventos: Evento[]
  eventosAsistiendo: string[]
  onSeleccionarEvento: (evento: Evento) => void
  onGestionarAsistencia: (eventoId: string, accion: AccionAsistencia) => Promise<void>
  cargando?: boolean
}

// ✅ UTILIDADES DE VALIDACIÓN
export interface ValidacionEvento {
  valido: boolean
  errores: {
    titulo?: string
    fechaInicio?: string
    ubicacion?: string
    capacidad?: string
    precio?: string
  }
}

// ✅ CONSTANTES
export const CATEGORIAS_EVENTO: Array<{ value: CategoriaEvento; label: string; icono: string }> = [
  { value: 'formacion', label: 'Formación', icono: '🎓' },
  { value: 'networking', label: 'Networking', icono: '🤝' },
  { value: 'conferencia', label: 'Conferencia', icono: '🎤' },
  { value: 'taller', label: 'Taller', icono: '🔧' },
  { value: 'reunion', label: 'Reunión', icono: '👥' },
  { value: 'otros', label: 'Otros', icono: '📋' }
]

export const TIPOS_EVENTO: Array<{ value: TipoEvento; label: string; icono: string }> = [
  { value: 'presencial', label: 'Presencial', icono: '📍' },
  { value: 'online', label: 'Online', icono: '💻' },
  { value: 'hibrido', label: 'Híbrido', icono: '🔄' }
]

export const ESTADOS_EVENTO: Array<{ value: EstadoEvento; label: string; color: string }> = [
  { value: 'programado', label: 'Programado', color: '#3B82F6' },
  { value: 'en-progreso', label: 'En Progreso', color: '#10B981' },
  { value: 'finalizado', label: 'Finalizado', color: '#6B7280' },
  { value: 'cancelado', label: 'Cancelado', color: '#EF4444' }
]