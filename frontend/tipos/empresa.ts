// ============================================================================
// TIPOS PARA GESTIÓN EMPRESARIAL
// Sistema completo de tipos para empresas colaboradoras
// ============================================================================

export type EstadoOferta = 
  | 'borrador' 
  | 'pendiente' 
  | 'revision' 
  | 'publicada' 
  | 'rechazada' 
  | 'pausada' 
  | 'finalizada'

export type TipoOferta = 
  | 'producto' 
  | 'servicio' 
  | 'formacion' 
  | 'evento'

export type PrioridadOferta = 
  | 'alta' 
  | 'media' 
  | 'baja'

export type AudienciaObjetivo = 
  | 'empleados-publicos'
  | 'administraciones'
  | 'empresas-colaboradoras'
  | 'sindicatos'
  | 'todos'

export type Moneda = 'EUR' | 'USD' | 'GBP'
export type TipoDescuento = 'porcentaje' | 'cantidad'

export interface Oferta {
  id: string
  titulo: string
  tipo: TipoOferta
  estado: EstadoOferta
  audiencia: AudienciaObjetivo[]
  comunidades: string[]
  fechaCreacion: Date
  fechaPublicacion?: Date
  fechaExpiracion?: Date
  
  // Métricas
  visualizaciones: number
  clicks: number
  conversiones: number
  
  // Contenido
  descripcionBreve: string
  descripcionDetallada?: string
  imagen: string
  galeria?: string[]
  etiquetas: string[]
  
  // Comercial
  precio?: number
  moneda?: Moneda
  descuento?: number
  tipoDescuento?: TipoDescuento
  validezDesde?: string
  validezHasta?: string
  
  // Configuración
  prioridad: PrioridadOferta
  destacada: boolean
  permitirComentarios: boolean
  notificarCambios: boolean
  
  // Gestión
  gestorAsignado?: string
  comentariosGestor?: string
  
  // Términos
  terminos?: string
  requisitos?: string
  beneficios: string[]
}

export interface EmpresaInfo {
  id: string
  nombre: string
  nif: string
  logo: string
  sector: string
  tamano: string
  fundacion: string
  descripcion: string
  
  contacto: {
    email: string
    telefono: string
    web: string
    linkedin: string
    twitter?: string
  }
  
  ubicacion: {
    direccion: string
    ciudad: string
    codigoPostal: string
    provincia: string
    comunidad: string
    pais: string
  }
  
  certificaciones: Array<{
    nombre: string
    fecha: string
    vigente: boolean
  }>
  
  responsableDatos: {
    nombre: string
    cargo: string
    email: string
    telefono: string
  }
  
  facturacion: {
    metodo: string
    periodo: string
    iban: string
    titular: string
  }
  
  estadisticas: {
    empleadosActuales: number
    crecimientoAnual: number
    presenciaInternacional: number
    proyectosActivos: number
    clientesSatisfechos: number
  }
}

export interface PlanEmpresa {
  actual: number
  limite: number
  porcentaje: number
  nombre: string
  renovacion?: Date
}

export interface MetricasEmpresa {
  ofertes: {
    actives: number
    limit: number
    progress: number
    trend: number
  }
  visualitzacions: {
    total: number
    thisMonth: number
    growth: number
    dailyAverage: number
    sources: Record<string, number>
  }
  clicks: {
    total: number
    conversion: number
    growth: number
    bounceRate: number
  }
  comunitats: {
    actives: number
    total: number
    top: string[]
    performance: Record<string, number>
  }
  pipeline: {
    pending: number
    inReview: number
    approved: number
    rejected: number
  }
}

export interface FiltrosOferta {
  searchTerm: string
  estado: EstadoOferta | 'todas'
  audiencia: string
  tipo?: TipoOferta
  comunidad?: string
  prioridad?: PrioridadOferta
}

export interface EstadisticasOferta {
  total: number
  publicadas: number
  pendientes: number
  borradores: number
  visualizacionesTotales: number
  conversionMedia: string
}

// Tipos para el editor de ofertas
export interface FormDataOferta {
  titulo: string
  tipo: TipoOferta
  descripcionBreve: string
  descripcionDetallada: string
  imagenPrincipal: string
  galeria: string[]
  
  precio: string
  moneda: Moneda
  descuento: string
  tipoDescuento: TipoDescuento
  validezDesde: string
  validezHasta: string
  
  audiencia: string[]
  comunidades: string[]
  provincias: string[]
  sectores: string[]
  
  terminos: string
  requisitos: string
  beneficios: string[]
  
  destacada: boolean
  permitirComentarios: boolean
  notificarCambios: boolean
  etiquetas: string[]
}

export interface ValidacionFormulario {
  [campo: string]: string
}

// Tipos para gestión de empresas
export interface GestorComercial {
  id: string
  nombre: string
  email: string
  availability: string
}

export interface EmpresaData {
  empresa: EmpresaInfo & {
    plan: string
    planExpiry: Date
    billingCycle: string
    gestorComercial: GestorComercial
  }
  metrics: MetricasEmpresa
  alerts: any[]
  performance: {
    weeklyTrend: number[]
    monthlyTrend: number[]
    bestPerformingOffer: {
      title: string
      views: number
      clicks: number
      applications: number
    }
  }
}