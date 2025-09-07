// ============================================================================
// TIPOS PARA SISTEMA DE ANALYTICS EMPRESARIAL
// Arquitectura completa para analytics avanzados con diferenciación por planes
// ============================================================================

export type PlanEmpresa = 'basic' | 'premium' | 'enterprise'

export type PeriodoAnalytics = '7D' | '30D' | '90D' | '1Y' | 'custom'

export type FormatoMetrica = 'number' | 'percentage' | 'currency' | 'decimal' | 'time'

export type TipoGrafico = 'line' | 'bar' | 'area' | 'pie' | 'heatmap' | 'funnel' | 'cohort'

export type AudienciaSegmento = 
  | 'empleados-publicos'
  | 'administraciones'
  | 'empresas-colaboradoras'
  | 'sindicatos'
  | 'todos'

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'png' | 'svg'

// ============================================================================
// INTERFACES BASE
// ============================================================================

export interface MetricaKPI {
  id: string
  nombre: string
  valor: number
  valorAnterior: number
  cambio: number
  tendencia: 'up' | 'down' | 'stable'
  formato: FormatoMetrica
  periodo: string
  icon: string
  color: string
  disponibleEnPlan: PlanEmpresa[]
  tooltip?: string
}

export interface DatoGrafico {
  label: string
  value: number
  fecha: string
  metadata?: Record<string, any>
}

export interface ConfiguracionGrafico {
  tipo: TipoGrafico
  titulo: string
  datos: DatoGrafico[]
  ejes?: {
    x: { label: string; formato?: string }
    y: { label: string; formato?: string }
  }
  colores?: string[]
  disponibleEnPlan: PlanEmpresa[]
}

// ============================================================================
// ANALYTICS ESPECÍFICOS
// ============================================================================

export interface AnalyticsGlobal {
  visualizacionesTotales: number
  clicksTotales: number
  conversionesTotales: number
  ctr: number // Click Through Rate
  tasaConversion: number
  scoreEngagement: number // Solo premium
  reachAudiencia: Record<AudienciaSegmento, number>
  tendenciasSemanal: DatoGrafico[]
  tendenciasMensual: DatoGrafico[]
}

export interface AnalyticsOferta {
  id: string
  titulo: string
  tipo: string
  estado: string
  fechaCreacion: string
  fechaPublicacion?: string
  
  // Métricas de rendimiento
  visualizaciones: number
  clicks: number
  conversiones: number
  ctr: number
  tasaConversion: number
  qualityScore: number // 0-100
  
  // Distribución
  audienciaDistribucion: Record<AudienciaSegmento, number>
  comunidadesTop: Array<{ nombre: string; porcentaje: number }>
  
  // Engagement
  tiempoVisualizacion: number // segundos promedio
  bounceRate: number
  socialShares: number
}

export interface AnalyticsAudiencia {
  segmento: AudienciaSegmento
  usuarios: number
  sesiones: number
  duracionPromedio: number
  paginasVista: number
  tasaRebote: number
  
  // Demographics
  edadDistribucion: Record<string, number>
  generoDistribucion: Record<string, number>
  ubicacionTop: Array<{ ciudad: string; porcentaje: number }>
  
  // Comportamiento
  horasActividad: Record<string, number> // 0-23
  diasSemanaActividad: Record<string, number>
  dispositivosUsados: Record<string, number>
}

export interface AnalyticsGeografico {
  comunidad: string
  usuarios: number
  sesiones: number
  visualizaciones: number
  conversiones: number
  tasaConversion: number
  revenueGenerado: number // Para premium
  coordenadas: [number, number] // lat, lng
  tendencia: 'up' | 'down' | 'stable'
}

// ============================================================================
// FEATURES PREMIUM
// ============================================================================

export interface BenchmarkingData {
  categoria: string
  metricaPropia: number
  promedioSector: number
  percentilRanking: number // 0-100
  competidores: Array<{
    nombre: string // anonimizado
    valor: number
    posicion: number
  }>
}

export interface PrediccionIA {
  metrica: string
  valorActual: number
  prediccionSemana: number
  prediccionMes: number
  confianza: number // 0-1
  factoresInfluencia: Array<{
    factor: string
    impacto: number // -1 a 1
    explicacion: string
  }>
  recomendaciones: Array<{
    accion: string
    impactoEsperado: number
    dificultad: 'baja' | 'media' | 'alta'
    prioridad: number
  }>
}

export interface AlertaAutomatizada {
  id: string
  tipo: 'anomalia' | 'objetivo' | 'oportunidad' | 'riesgo'
  metrica: string
  valor: number
  umbral: number
  severidad: 'info' | 'warning' | 'critical'
  mensaje: string
  fechaDeteccion: string
  accionesRecomendadas: string[]
  activa: boolean
}

// ============================================================================
// CONFIGURACIÓN Y FILTROS
// ============================================================================

export interface FiltrosAnalytics {
  periodo: {
    tipo: PeriodoAnalytics
    fechaInicio?: string
    fechaFin?: string
  }
  audiencia: AudienciaSegmento[]
  comunidades: string[]
  tiposOferta: string[]
  estados: string[]
}

export interface ConfiguracionExportacion {
  formato: ExportFormat
  incluirGraficos: boolean
  incluirTablas: boolean
  incluirComparativas: boolean // Premium
  incluirPredicciones: boolean // Premium
  personalizacion?: {
    logo: string
    colores: string[]
    encabezado: string
  }
}

export interface PlanLimites {
  plan: PlanEmpresa
  features: {
    metricsBasicas: boolean
    metricsAvanzadas: boolean
    exportacionPDF: boolean
    exportacionExcel: boolean
    graficosAvanzados: boolean
    benchmarking: boolean
    prediccionesIA: boolean
    alertasPersonalizadas: boolean
    apiAccess: boolean
  }
  limites: {
    historicoMeses: number
    exportacionesMes: number
    alertasActivas: number
    consultasAPI?: number
  }
}

// ============================================================================
// RESPUESTAS API
// ============================================================================

export interface DashboardAnalytics {
  empresa: {
    id: string
    nombre: string
    plan: PlanEmpresa
    limites: PlanLimites
  }
  resumen: {
    metricas: MetricaKPI[]
    alertas: AlertaAutomatizada[]
    ultimaActualizacion: string
  }
  secciones: {
    global: AnalyticsGlobal
    ofertas: AnalyticsOferta[]
    audiencia: AnalyticsAudiencia[]
    geografico: AnalyticsGeografico[]
    benchmarking?: BenchmarkingData[] // Premium
    predicciones?: PrediccionIA[] // Premium
  }
  configuracion: {
    graficos: ConfiguracionGrafico[]
    filtros: FiltrosAnalytics
  }
}

export interface ExportacionResult {
  success: boolean
  url?: string
  formato: ExportFormat
  tamaño: number
  fechaGeneracion: string
  expiracion: string
  error?: string
}

// ============================================================================
// HOOKS Y UTILIDADES
// ============================================================================

export interface UseAnalyticsConfig {
  empresaId: string
  filtros: FiltrosAnalytics
  autoRefresh?: boolean
  refreshInterval?: number
}

export interface AnalyticsContextType {
  data: DashboardAnalytics | null
  loading: boolean
  error: string | null
  filtros: FiltrosAnalytics
  actualizarFiltros: (filtros: Partial<FiltrosAnalytics>) => void
  refrescar: () => void
  exportar: (config: ConfiguracionExportacion) => Promise<ExportacionResult>
}