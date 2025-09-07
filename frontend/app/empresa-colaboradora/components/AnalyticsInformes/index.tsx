'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Eye, Users, MousePointer, 
  MapPin, FileBarChart, Download, 
  ChevronRight, AlertCircle, Star, Target, Zap, Brain, 
  Globe, Activity, Award, ArrowUp, ArrowDown,
  ExternalLink, RefreshCw, Maximize2, Share2, Crown, X, FileText
} from 'lucide-react'
import { 
  DashboardAnalytics, MetricaKPI, PeriodoAnalytics, 
  FiltrosAnalytics, ExportFormat, PlanEmpresa, AnalyticsOferta,
  ConfiguracionExportacion
} from '../../../../tipos/analytics'
import { ChartContainer, MaximizedChartModal } from './ChartComponents'
import ExportModal from './ExportModal'
import ReportGenerator from './ReportGenerator'
import EnterpriseFeatures from './EnterpriseFeatures'

interface AnalyticsInformesProps {
  empresaId: string
  planEmpresa: PlanEmpresa
  onNavigate?: (seccion: string) => void
}

export default function AnalyticsInformes({ 
  empresaId, 
  planEmpresa = 'basic',
  onNavigate 
}: AnalyticsInformesProps) {
  // Función de formateo consistente (formato español con punto para miles)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES')
  }

  // Estados principales
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardAnalytics | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [maximizedChart, setMaximizedChart] = useState<any>(null)
  const [showBenchmarkingModal, setShowBenchmarkingModal] = useState(false)
  const [showPredictionsModal, setShowPredictionsModal] = useState(false)
  const [showHeatmapModal, setShowHeatmapModal] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('global')
  const [tooltipData, setTooltipData] = useState<{show: boolean, content: string, x: number, y: number}>({
    show: false, content: '', x: 0, y: 0
  })
  const [drillDownMetric, setDrillDownMetric] = useState<string | null>(null)
  
  // Filtros y configuración
  const [filtros, setFiltros] = useState<FiltrosAnalytics>({
    periodo: { tipo: '30D' },
    audiencia: [],
    comunidades: [],
    tiposOferta: [],
    estados: []
  })
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<PeriodoAnalytics>('30D')
  const [audienciaSeleccionada, setAudienciaSeleccionada] = useState<string>('todos')
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState<string>('')
  const [tipoOfertaSeleccionado, setTipoOfertaSeleccionado] = useState<string>('')

  // Mock data para desarrollo
  const mockData: DashboardAnalytics = {
    empresa: {
      id: empresaId,
      nombre: 'TechSolutions BCN',
      plan: planEmpresa,
      limites: {
        plan: planEmpresa,
        features: {
          metricsBasicas: true,
          metricsAvanzadas: planEmpresa !== 'basic',
          exportacionPDF: true,
          exportacionExcel: planEmpresa !== 'basic',
          graficosAvanzados: planEmpresa === 'premium',
          benchmarking: planEmpresa === 'premium',
          prediccionesIA: planEmpresa === 'premium',
          alertasPersonalizadas: planEmpresa !== 'basic',
          apiAccess: planEmpresa === 'premium'
        },
        limites: {
          historicoMeses: planEmpresa === 'basic' ? 3 : 12,
          exportacionesMes: planEmpresa === 'basic' ? 5 : 25,
          alertasActivas: planEmpresa === 'basic' ? 3 : 15
        }
      }
    },
    resumen: {
      metricas: [
        {
          id: 'visualizaciones',
          nombre: 'Visualitzacions',
          valor: 12847,
          valorAnterior: 11205,
          cambio: 14.65,
          tendencia: 'up',
          formato: 'number',
          periodo: 'Últims 30 dies',
          icon: 'Eye',
          color: 'blue',
          disponibleEnPlan: ['basic', 'premium'],
          tooltip: 'Total de visualitzacions de totes les ofertes publicades'
        },
        {
          id: 'clics',
          nombre: 'Clics',
          valor: 1563,
          valorAnterior: 1389,
          cambio: 12.53,
          tendencia: 'up',
          formato: 'number',
          periodo: 'Últims 30 dies',
          icon: 'MousePointer',
          color: 'green',
          disponibleEnPlan: ['basic', 'premium'],
          tooltip: 'Clics en les ofertes que generen engagement'
        },
        {
          id: 'conversions',
          nombre: 'Conversions',
          valor: 234,
          valorAnterior: 198,
          cambio: 18.18,
          tendencia: 'up',
          formato: 'number',
          periodo: 'Últims 30 dies',
          icon: 'Target',
          color: 'purple',
          disponibleEnPlan: ['basic', 'premium'],
          tooltip: 'Usuaris que han completat accions desitjades'
        },
        {
          id: 'ctr',
          nombre: 'CTR',
          valor: 12.17,
          valorAnterior: 12.40,
          cambio: -1.85,
          tendencia: 'down',
          formato: 'percentage',
          periodo: 'Últims 30 dies',
          icon: 'Activity',
          color: 'orange',
          disponibleEnPlan: ['basic', 'premium'],
          tooltip: 'Click Through Rate - Eficàcia de les ofertes'
        },
        {
          id: 'engagement',
          nombre: 'Score Engagement',
          valor: 78.5,
          valorAnterior: 74.2,
          cambio: 5.79,
          tendencia: 'up',
          formato: 'decimal',
          periodo: 'vs sector',
          icon: 'Zap',
          color: 'indigo',
          disponibleEnPlan: ['premium'],
          tooltip: 'Puntuació d\'engagement vs competència del sector'
        }
      ],
      alertas: [
        {
          id: '1',
          tipo: 'oportunidad',
          metrica: 'CTR Empleats Públics',
          valor: 15.2,
          umbral: 12.0,
          severidad: 'info',
          mensaje: 'El CTR amb empleats públics ha augmentat un 27% aquesta setmana',
          fechaDeteccion: '2024-01-15T10:30:00Z',
          accionesRecomendadas: ['Augmentar pressupost en aquest segment', 'Crear més ofertes dirigides'],
          activa: true
        }
      ],
      ultimaActualizacion: new Date().toISOString()
    },
    secciones: {
      global: {
        visualizacionesTotales: 12847,
        clicksTotales: 1563,
        conversionesTotales: 234,
        ctr: 12.17,
        tasaConversion: 14.97,
        scoreEngagement: 78.5,
        reachAudiencia: {
          'empleados-publicos': 6423,
          'administraciones': 3211,
          'empresas-colaboradoras': 2105,
          'sindicatos': 876,
          'todos': 232
        },
        tendenciasSemanal: Array.from({ length: 7 }, (_, i) => ({
          label: `Día ${i + 1}`,
          value: Math.floor(Math.random() * 1000) + 500,
          fecha: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString()
        })),
        tendenciasMensual: Array.from({ length: 30 }, (_, i) => ({
          label: `${i + 1}`,
          value: Math.floor(Math.random() * 600) + 300,
          fecha: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString()
        }))
      },
      ofertas: [
        {
          id: '1',
          titulo: 'Desenvolupador Senior React + Node.js',
          tipo: 'formacion',
          estado: 'publicada',
          fechaCreacion: '2024-01-10',
          fechaPublicacion: '2024-01-12',
          visualizaciones: 3245,
          clicks: 387,
          conversiones: 58,
          ctr: 11.92,
          tasaConversion: 14.99,
          qualityScore: 85,
          audienciaDistribucion: {
            'empleados-publicos': 1623,
            'administraciones': 812,
            'empresas-colaboradoras': 543,
            'sindicatos': 189,
            'todos': 78
          },
          comunidadesTop: [
            { nombre: 'Catalunya', porcentaje: 45.2 },
            { nombre: 'Madrid', porcentaje: 28.7 },
            { nombre: 'Valencia', porcentaje: 12.3 }
          ],
          tiempoVisualizacion: 145,
          bounceRate: 34.2,
          socialShares: 23
        },
        {
          id: '2',
          titulo: 'Consultoria Transformació Digital',
          tipo: 'servicio',
          estado: 'publicada',
          fechaCreacion: '2024-01-08',
          fechaPublicacion: '2024-01-10',
          visualizaciones: 2876,
          clicks: 312,
          conversiones: 45,
          ctr: 10.85,
          tasaConversion: 14.42,
          qualityScore: 78,
          audienciaDistribucion: {
            'empleados-publicos': 1150,
            'administraciones': 1438,
            'empresas-colaboradoras': 212,
            'sindicatos': 54,
            'todos': 22
          },
          comunidadesTop: [
            { nombre: 'Madrid', porcentaje: 38.9 },
            { nombre: 'Catalunya', porcentaje: 32.1 },
            { nombre: 'Andalusia', porcentaje: 15.7 }
          ],
          tiempoVisualizacion: 198,
          bounceRate: 28.7,
          socialShares: 41
        }
      ],
      audiencia: [],
      geografico: []
    },
    configuracion: {
      graficos: [],
      filtros: filtros
    }
  }

  // Simulación de carga de datos
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [filtros])

  // Lógica de filtros
  const actualizarPeriodo = useCallback((periodo: PeriodoAnalytics) => {
    setPeriodoSeleccionado(periodo)
    setFiltros(prev => ({
      ...prev,
      periodo: { tipo: periodo }
    }))
  }, [])

  const actualizarFiltros = useCallback((nuevosFiltros: Partial<{
    audiencia: string,
    comunidad: string,
    tipoOferta: string,
    estado: string
  }>) => {
    if (nuevosFiltros.audiencia !== undefined) {
      setAudienciaSeleccionada(nuevosFiltros.audiencia)
    }
    if (nuevosFiltros.comunidad !== undefined) {
      setComunidadSeleccionada(nuevosFiltros.comunidad)
    }
    if (nuevosFiltros.tipoOferta !== undefined) {
      setTipoOfertaSeleccionado(nuevosFiltros.tipoOferta)
    }
    
    // Simular cambio de datos basado en filtros
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  // Métricas filtradas por plan
  const metricsDisponibles = useMemo(() => {
    if (!data) return []
    return data.resumen.metricas.filter(metrica => 
      metrica.disponibleEnPlan.includes(planEmpresa)
    )
  }, [data, planEmpresa])

  // Funciones para tooltips y drill-down
  const handleTooltip = useCallback((show: boolean, content: string = '', event?: React.MouseEvent) => {
    if (show && event) {
      setTooltipData({
        show: true,
        content,
        x: event.clientX,
        y: event.clientY - 10
      })
    } else {
      setTooltipData(prev => ({ ...prev, show: false }))
    }
  }, [])

  const handleDrillDown = useCallback((metricId: string) => {
    setDrillDownMetric(prev => prev === metricId ? null : metricId)
  }, [])

  // Render de KPI Card mejorado con tooltips y drill-down
  const renderKPICard = (metrica: MetricaKPI) => {
    const IconComponent = {
      'Eye': Eye,
      'MousePointer': MousePointer,
      'Target': Target,
      'Activity': Activity,
      'Zap': Zap
    }[metrica.icon] || Activity

    const isPremium = !metrica.disponibleEnPlan.includes('basic')
    const isDrillDown = drillDownMetric === metrica.id

    const getDetailedTooltip = (metric: MetricaKPI) => {
      switch(metric.id) {
        case 'visualizaciones':
          return `Visualitzacions totals: ${formatNumber(metric.valor)}\nCanvi vs període anterior: ${metric.cambio > 0 ? '+' : ''}${metric.cambio.toFixed(1)}%\nPromig diari: ${(metric.valor / 30).toFixed(0)}\nPic màxim: 2.4K (15 Gen)`
        case 'clics':
          return `Clics totals: ${formatNumber(metric.valor)}\nCanvi vs període anterior: ${metric.cambio > 0 ? '+' : ''}${metric.cambio.toFixed(1)}%\nCTR promig: 12.17%\nMillor oferta: Desenvolupament Web (387 clics)`
        case 'conversions':
          return `Conversions totals: ${metric.valor}\nTaxa de conversió: 14.97%\nCanvi vs període anterior: ${metric.cambio > 0 ? '+' : ''}${metric.cambio.toFixed(1)}%\nValor promig per conversió: €145`
        default:
          return metric.tooltip || `Mètrica: ${metric.nombre}\nValor: ${metric.valor}\nTendència: ${metric.tendencia}`
      }
    }

    return (
      <div 
        key={metrica.id} 
        className={`relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group ${
          isPremium ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' : ''
        } ${isDrillDown ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
        onClick={() => handleDrillDown(metrica.id)}
        onMouseEnter={(e) => handleTooltip(true, getDetailedTooltip(metrica), e)}
        onMouseLeave={() => handleTooltip(false)}
        onMouseMove={(e) => {
          if (tooltipData.show) {
            setTooltipData(prev => ({ ...prev, x: e.clientX, y: e.clientY - 10 }))
          }
        }}
      >
        {isPremium && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Premium
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${metrica.color}-100 to-${metrica.color}-200 group-hover:shadow-md transition-shadow`}>
            <IconComponent className={`w-6 h-6 text-${metrica.color}-600`} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {metrica.formato === 'number' ? formatNumber(metrica.valor) :
               metrica.formato === 'percentage' ? `${metrica.valor}%` :
               metrica.formato === 'currency' ? `€${formatNumber(metrica.valor)}` :
               metrica.valor.toFixed(1)}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              metrica.tendencia === 'up' ? 'text-green-600' :
              metrica.tendencia === 'down' ? 'text-red-600' :
              'text-slate-500'
            }`}>
              {metrica.tendencia === 'up' ? <ArrowUp className="w-4 h-4" /> :
               metrica.tendencia === 'down' ? <ArrowDown className="w-4 h-4" /> :
               null}
              {Math.abs(metrica.cambio)}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700 mb-1 group-hover:text-slate-900 transition-colors">{metrica.nombre}</h3>
            <p className="text-sm text-slate-500">{metrica.periodo}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
              <span className="text-xs text-slate-600">?</span>
            </div>
          </div>
        </div>
        
        {/* Drill-down details */}
        {isDrillDown && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 animate-in fade-in duration-200">
            <div className="text-xs font-medium text-slate-700 mb-2">Detalls de {metrica.nombre}</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="font-medium text-slate-600">Promig Diari</div>
                <div className="text-slate-800 font-semibold">{(metrica.valor / 30).toFixed(0)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2">
                <div className="font-medium text-slate-600">Pic Màxim</div>
                <div className="text-slate-800 font-semibold">{(metrica.valor * 1.2).toFixed(0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Veure detalls →
              </button>
            </div>
          </div>
        )}
        
        {/* Tooltip indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-4 h-4 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs">
            i
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <FileBarChart className="w-4 h-4" />
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium">Analytics i Informes</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Dashboard d'Analytics
              </h1>
              <div className="flex items-center gap-4">
                {/* Indicador de plan */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  planEmpresa === 'premium' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {planEmpresa === 'premium' ? <Star className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  Plan {planEmpresa.charAt(0).toUpperCase() + planEmpresa.slice(1)}
                </div>
                
                {/* Última actualización */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <RefreshCw className="w-4 h-4" />
                  <span>Última actualització: fa 5 min</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Selector de período */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                {(['7D', '30D', '90D', '1Y'] as PeriodoAnalytics[]).map((periodo) => (
                  <button
                    key={periodo}
                    onClick={() => actualizarPeriodo(periodo)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      filtros.periodo.tipo === periodo
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {periodo}
                  </button>
                ))}
              </div>
              
              {/* Filtros adicionales */}
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={audienciaSeleccionada}
                  onChange={(e) => actualizarFiltros({ audiencia: e.target.value })}
                >
                  <option value="todos">Totes les audiències</option>
                  <option value="empleados-publicos">Empleats Públics</option>
                  <option value="administraciones">Administracions</option>
                  <option value="empresas-colaboradoras">Empreses Col·laboradores</option>
                  <option value="sindicatos">Sindicats</option>
                </select>
                
                <select 
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={comunidadSeleccionada}
                  onChange={(e) => actualizarFiltros({ comunidad: e.target.value })}
                >
                  <option value="">Totes les comunitats</option>
                  <option value="catalunya">Catalunya</option>
                  <option value="madrid">Madrid</option>
                  <option value="valencia">València</option>
                  <option value="andalusia">Andalusia</option>
                  <option value="euskadi">Euskadi</option>
                </select>
                
                <select 
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={tipoOfertaSeleccionado}
                  onChange={(e) => actualizarFiltros({ tipoOferta: e.target.value })}
                >
                  <option value="">Tots els tipus</option>
                  <option value="formacion">Formació</option>
                  <option value="servicio">Servei</option>
                  <option value="consultoria">Consultoria</option>
                  <option value="tecnologia">Tecnologia</option>
                </select>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4" />
                  Exportar Ràpid
                </button>
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setShowReportGenerator(true)}
                >
                  <FileText className="w-4 h-4" />
                  Informe Complet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
        {/* Alertas */}
        {data && data.resumen.alertas.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Alertes d'oportunitat</h3>
                <p className="text-blue-700 text-sm mb-2">
                  {data.resumen.alertas[0].mensaje}
                </p>
                <div className="flex gap-2">
                  {data.resumen.alertas[0].accionesRecomendadas.map((accion, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {accion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPIs principales */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Mètriques Principals</h2>
            {planEmpresa === 'basic' && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Mètriques premium disponibles</span>
                <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-full hover:shadow-md transition-all flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Actualitzar
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {metricsDisponibles.map(renderKPICard)}
            {planEmpresa === 'basic' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Score d'Engagement</h3>
                <p className="text-xs text-slate-600 mb-3">Compara el teu rendiment amb la competència</p>
                <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-colors">
                  Premium
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico principal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Visualitzacions vs Clics</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Gráfico interactivo */}
          <ChartContainer
            configuracion={{
              tipo: 'line',
              titulo: 'Visualitzacions vs Clics',
              datos: data?.secciones.global.tendenciasMensual || [],
              disponibleEnPlan: ['basic', 'premium'],
              ejes: {
                x: { label: 'Dia' },
                y: { label: 'Visualitzacions' }
              },
              colores: ['#4f46e5', '#06b6d4']
            }}
            planEmpresa={planEmpresa}
            className="h-64"
            onMaximize={() => setMaximizedChart({
              tipo: 'line',
              titulo: 'Visualitzacions vs Clics',
              datos: data?.secciones.global.tendenciasMensual || [],
              disponibleEnPlan: ['basic', 'premium'],
              colores: ['#4f46e5', '#06b6d4']
            })}
            onExport={(formato) => console.log('Exportar gráfico:', formato)}
          />
        </div>

        {/* Secciones específicas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Análisis por oferta */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Rendiment per Oferta</h3>
            <div className="space-y-4">
              {data?.secciones.ofertas.slice(0, 3).map((oferta) => (
                <div key={oferta.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">{oferta.titulo}</h4>
                    <p className="text-sm text-slate-500">{formatNumber(oferta.visualizaciones)} visualitzacions</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{oferta.ctr}%</div>
                    <div className="text-sm text-slate-500">CTR</div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-3 text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center gap-2">
                Veure totes les ofertes
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Distribución de audiencia */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribució d'Audiència</h3>
            <div className="space-y-3">
              {data && Object.entries(data.secciones.global.reachAudiencia).map(([audiencia, valor]) => {
                const porcentaje = (valor / data.secciones.global.visualizacionesTotales) * 100
                return (
                  <div key={audiencia} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {audiencia.replace('-', ' ')}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 w-12 text-right">
                        {porcentaje.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabbed Analysis Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            {/* Tab Headers */}
            <div className="border-b border-slate-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'global', label: 'Anàlisi Global', icon: Globe, disponible: true },
                  { id: 'ofertas', label: 'Ofertes', icon: Target, disponible: true },
                  { id: 'audiencia', label: 'Audiència', icon: Users, disponible: true },
                  { id: 'geografico', label: 'Geogràfic', icon: MapPin, disponible: planEmpresa === 'premium' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => tab.disponible && setActiveSection(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeSection === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : tab.disponible 
                        ? 'border-transparent text-slate-600 hover:text-slate-900' 
                        : 'border-transparent text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {!tab.disponible && (
                      <Crown className="w-3 h-3 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6 min-h-[450px]">
              {activeSection === 'global' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartContainer
                    configuracion={{
                      tipo: 'bar',
                      titulo: 'Tendències Setmanals',
                      datos: data?.secciones.global.tendenciasSemanal || [],
                      disponibleEnPlan: ['basic', 'premium'],
                      colores: ['#4f46e5', '#06b6d4', '#10b981']
                    }}
                    planEmpresa={planEmpresa}
                    onMaximize={() => setMaximizedChart({
                      tipo: 'bar',
                      titulo: 'Tendències Setmanals',
                      datos: data?.secciones.global.tendenciasSemanal || [],
                      disponibleEnPlan: ['basic', 'premium'],
                      colores: ['#4f46e5', '#06b6d4', '#10b981']
                    })}
                  />
                  
                  <ChartContainer
                    configuracion={{
                      tipo: 'pie',
                      titulo: 'Distribució per Audiència',
                      datos: data ? Object.entries(data.secciones.global.reachAudiencia).map(([key, value]) => ({
                        label: key.replace('-', ' '),
                        value,
                        fecha: new Date().toISOString()
                      })) : [],
                      disponibleEnPlan: ['basic', 'premium'],
                      colores: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
                    }}
                    planEmpresa={planEmpresa}
                    onMaximize={() => setMaximizedChart({
                      tipo: 'pie',
                      titulo: 'Distribució per Audiència',
                      datos: data ? Object.entries(data.secciones.global.reachAudiencia).map(([key, value]) => ({
                        label: key.replace('-', ' '),
                        value,
                        fecha: new Date().toISOString()
                      })) : [],
                      disponibleEnPlan: ['basic', 'premium'],
                      colores: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
                    })}
                  />
                </div>
              )}
              
              {activeSection === 'ofertas' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">Rendiment Detallat per Oferta</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-slate-200">
                          <th className="pb-3 text-sm font-medium text-slate-600">Oferta</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Visualitzacions</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Clics</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">CTR</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Quality Score</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Conversions</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Accions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data?.secciones.ofertas.map((oferta) => (
                          <tr key={oferta.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="py-4">
                              <div>
                                <div className="font-medium text-slate-800 hover:text-indigo-600 transition-colors">{oferta.titulo}</div>
                                <div className="text-sm text-slate-500 capitalize">{oferta.tipo}</div>
                              </div>
                            </td>
                            <td className="py-4 text-slate-700 font-medium">{formatNumber(oferta.visualizaciones)}</td>
                            <td className="py-4 text-slate-700 font-medium">{formatNumber(oferta.clicks)}</td>
                            <td className="py-4">
                              <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                                oferta.ctr > 12 ? 'bg-green-100 text-green-700' :
                                oferta.ctr > 8 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {oferta.ctr}%
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                                    style={{ width: `${oferta.qualityScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{oferta.qualityScore}</span>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="font-semibold text-slate-700">{oferta.conversiones}</span>
                              <div className="text-xs text-slate-500">{((oferta.conversiones/oferta.clicks)*100).toFixed(1)}% conv.</div>
                            </td>
                            <td className="py-4">
                              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                Veure detalls →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeSection === 'audiencia' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">Anàlisi d'Audiència Detallat</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-4">Distribució per Segment</h4>
                      <div className="space-y-3">
                        {data && Object.entries(data.secciones.global.reachAudiencia).map(([audiencia, valor]) => {
                          const porcentaje = (valor / data.secciones.global.visualizacionesTotales) * 100
                          return (
                            <div key={audiencia} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700 capitalize">
                                  {audiencia.replace('-', ' ')}
                                </span>
                                <span className="text-sm font-bold text-slate-800">
                                  {porcentaje.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                  style={{ width: `${porcentaje}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>{formatNumber(valor)} usuaris</span>
                                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                                  Analitzar →
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <ChartContainer
                      configuracion={{
                        tipo: 'pie',
                        titulo: 'Visualització Gràfica',
                        datos: data ? Object.entries(data.secciones.global.reachAudiencia).map(([key, value]) => ({
                          label: key.replace('-', ' '),
                          value,
                          fecha: new Date().toISOString()
                        })) : [],
                        disponibleEnPlan: ['basic', 'premium'],
                        colores: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
                      }}
                      planEmpresa={planEmpresa}
                    />
                  </div>
                </div>
              )}
              
              {activeSection === 'geografico' && (
                planEmpresa === 'premium' ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800">Anàlisi Geogràfic Avançat</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {[
                        { nom: 'Catalunya', percentatge: 45.2, visualitzacions: '5.8K', trend: 'up', creixement: '+12.3%' },
                        { nom: 'Madrid', percentatge: 28.7, visualitzacions: '3.7K', trend: 'up', creixement: '+8.7%' },
                        { nom: 'València', percentatge: 12.3, visualitzacions: '1.6K', trend: 'stable', creixement: '0.0%' },
                        { nom: 'Andalusia', percentatge: 8.9, visualitzacions: '1.1K', trend: 'down', creixement: '-2.1%' },
                        { nom: 'Euskadi', percentatge: 4.9, visualitzacions: '630', trend: 'up', creixement: '+5.2%' }
                      ].map((comunitat, index) => (
                        <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-slate-800">{comunitat.nom}</h5>
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                              comunitat.trend === 'up' ? 'bg-green-100 text-green-700' :
                              comunitat.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {comunitat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> :
                               comunitat.trend === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
                              {comunitat.creixement}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-slate-800 mb-1">{comunitat.percentatge}%</div>
                          <div className="text-sm text-slate-600 mb-3">{comunitat.visualitzacions} visualitzacions</div>
                          <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                            Veure mapa detallat →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Anàlisi Geogràfic Premium</h3>
                    <p className="text-slate-600 mb-4">Actualitza el teu pla per accedir a l'anàlisi detallat per comunitats autònomes</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
                      Actualitzar a Premium
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Enterprise Features */}
        {planEmpresa === 'premium' && (
          <div className="mb-8">
            <EnterpriseFeatures 
              empresaId={empresaId}
              planEmpresa={planEmpresa}
            />
          </div>
        )}

        {/* Features premium & upgrade prompts */}
        {planEmpresa === 'premium' ? (
          <div className="mt-16 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Funcionalitats Premium
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Benchmarking */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
                   onClick={() => setShowBenchmarkingModal(true)}>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Benchmarking Sectorial</h3>
                  <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Premium</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-slate-700">CTR vs Sector Tecnologia</span>
                      <div className="text-xs text-slate-500">Promig del sector: 8.9%</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600 text-lg">+23%</span>
                      <div className="text-xs text-slate-500">millor que la mitjana</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Engagement Score</span>
                      <div className="text-xs text-slate-500">Ranking de {formatNumber(data?.secciones.global.visualizacionesTotales || 0)} empreses</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-purple-600 text-lg">Top 15%</span>
                      <div className="text-xs text-slate-500">posició #{Math.floor((data?.resumen.metricas.find(m => m.id === 'engagement')?.valor || 78.5) * 10)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Quality Score Promig</span>
                      <div className="text-xs text-slate-500">Basat en {data?.secciones.ofertas.length || 0} ofertes</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600 text-lg">P82</span>
                      <div className="text-xs text-slate-500">percentil 82</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-purple-600 hover:text-purple-700 font-medium text-sm border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  Veure informe complet de benchmarking →
                </button>
              </div>

              {/* Predicciones IA */}
              <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
                   onClick={() => setShowPredictionsModal(true)}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Prediccions Intel·ligents</h3>
                  <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">IA Premium</div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Projecció Setmana Vinent</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">94% confiança</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-indigo-700 text-lg">+18%</span>
                      <span className="text-sm text-slate-600">visualitzacions</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Estimat: {formatNumber(Math.floor((data?.secciones.global.visualizacionesTotales || 12847) * 1.18))} views
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="text-sm font-medium text-slate-700 mb-2">Recomanació Principal</div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium">Optimitza horaris de publicació</p>
                        <p className="text-xs text-slate-500">Les ofertes matinals (9-11h) tenen +34% més engagement</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="text-sm font-medium text-slate-700 mb-2">Oportunitat Detectada</div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium">Segment "Administracions" creixent</p>
                        <p className="text-xs text-slate-500">Potencial d'increment del 28% en aquest segment</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  Veure anàlisi predictiu complet →
                </button>
              </div>
              
              {/* Heatmap de actividad */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
                   onClick={() => setShowHeatmapModal(true)}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Activitat per Hores</h3>
                  <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">Premium</div>
                </div>
                
                {/* Heatmap simplificado */}
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded text-xs flex items-center justify-center font-medium"
                      style={{
                        backgroundColor: `rgba(79, 70, 229, ${Math.random() * 0.8 + 0.2})`,
                        color: Math.random() > 0.5 ? 'white' : '#1e293b'
                      }}
                      title={`${i}:00 - ${Math.floor(Math.random() * 100)} activitat`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Menys activitat</span>
                  <div className="flex gap-1">
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                      <div
                        key={intensity}
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: `rgba(79, 70, 229, ${intensity})` }}
                      />
                    ))}
                  </div>
                  <span>Més activitat</span>
                </div>
                
                <button className="w-full mt-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  Veure anàlisi horari detallat →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Premium Upgrade Prompt for Basic Users */
          <div className="relative mt-16 mb-8">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Descobreix el poder del Premium</h2>
                    <p className="text-purple-100">Accedeix a analytics avançats i insights potents amb IA</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Award className="w-8 h-8 text-yellow-300 mb-2" />
                    <h3 className="font-semibold mb-1">Benchmarking Sectorial</h3>
                    <p className="text-sm text-purple-100">Compara't amb la competència del teu sector</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <Brain className="w-8 h-8 text-cyan-300 mb-2" />
                    <h3 className="font-semibold mb-1">Prediccions amb IA</h3>
                    <p className="text-sm text-purple-100">Preveu tendències i optimitza estratègies</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <Activity className="w-8 h-8 text-green-300 mb-2" />
                    <h3 className="font-semibold mb-1">Analytics Detallats</h3>
                    <p className="text-sm text-purple-100">Heatmaps, funnels i anàlisis geogràfics</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg">
                    <Star className="w-5 h-5" />
                    Actualitzar a Premium
                  </button>
                  
                  <div className="flex items-center gap-4 text-purple-100">
                    <span className="text-sm">A partir de <span className="font-semibold text-white">29€/mes</span></span>
                    <span className="text-xs bg-green-500 px-2 py-1 rounded-full text-white">14 dies gratis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Global Tooltip */}
      {tooltipData.show && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: `${Math.min(tooltipData.x, window.innerWidth - 250)}px`,
            top: `${Math.max(tooltipData.y - 10, 10)}px`
          }}
        >
          <div className="bg-slate-800 text-white text-sm rounded-lg p-3 shadow-xl max-w-xs">
            <div className="whitespace-pre-line">{tooltipData.content}</div>
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* Modales */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={(config) => {
          console.log('Exportando con configuración:', config)
          // Aquí iría la lógica de exportación
        }}
        planEmpresa={planEmpresa}
      />
      
      {showReportGenerator && (
        <ReportGenerator
          data={data!}
          planEmpresa={planEmpresa}
          empresaInfo={{
            nombre: data?.empresa.nombre || 'TechSolutions BCN',
            logo: undefined,
            color: '#4f46e5'
          }}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
      
      {maximizedChart && (
        <MaximizedChartModal
          configuracion={maximizedChart}
          planEmpresa={planEmpresa}
          onClose={() => setMaximizedChart(null)}
        />
      )}
      
      {/* Modal Benchmarking */}
      {showBenchmarkingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">Benchmarking Sectorial Detallat</h2>
              <button onClick={() => setShowBenchmarkingModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Rendiment vs Competència</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">CTR Promig Sector</span>
                      <span className="font-bold text-slate-800">8.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">El teu CTR</span>
                      <span className="font-bold text-green-600">12.17% (+36%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Posició Ranking</span>
                      <span className="font-bold text-purple-600">Top 15%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Oportunitats d'Millora</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <ArrowUp className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Optimitza horaris de publicació</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUp className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Millora targeting per administracions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUp className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span>Incrementa freqüència de contingut</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Predictions */}
      {showPredictionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">Prediccions Intel·ligents amb IA</h2>
              <button onClick={() => setShowPredictionsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Setmana Vinent</h3>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">+18%</div>
                  <p className="text-sm text-slate-600">Increment previst en visualitzacions</p>
                  <div className="text-xs text-slate-500 mt-2">Confiança: 94%</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Millor Dia</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">Dimarts</div>
                  <p className="text-sm text-slate-600">9-11h per màxim engagement</p>
                  <div className="text-xs text-slate-500 mt-2">Històric: +34% CTR</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Segment Creixent</h3>
                  <div className="text-2xl font-bold text-purple-600 mb-1">+28%</div>
                  <p className="text-sm text-slate-600">Creixement en Administracions</p>
                  <div className="text-xs text-slate-500 mt-2">Oportunitat detectada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Heatmap */}
      {showHeatmapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-slate-800">Activitat per Hores - Anàlisi Detallat</h2>
              <button onClick={() => setShowHeatmapModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-4">Mapa de Calor Setmanal</h3>
                <div className="grid grid-cols-24 gap-1 mb-4">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-500 mb-1">{i}h</div>
                      <div 
                        className="aspect-square rounded text-xs flex items-center justify-center font-medium cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: `rgba(79, 70, 229, ${Math.random() * 0.8 + 0.2})`,
                          color: Math.random() > 0.5 ? 'white' : '#1e293b'
                        }}
                        title={`${i}:00 - ${Math.floor(Math.random() * 100)} activitat`}
                      >
                        {Math.floor(Math.random() * 100)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Menys activitat</span>
                  <div className="flex gap-1">
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                      <div key={intensity} className="w-3 h-3 rounded" style={{ backgroundColor: `rgba(79, 70, 229, ${intensity})` }} />
                    ))}
                  </div>
                  <span>Més activitat</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-semibold text-slate-800">Pic Màxim</div>
                  <div className="text-lg font-bold text-indigo-600">10:00-11:00</div>
                  <div className="text-xs text-slate-500">847 visualitzacions/hora</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-semibold text-slate-800">Millor CTR</div>
                  <div className="text-lg font-bold text-green-600">9:00-10:00</div>
                  <div className="text-xs text-slate-500">15.3% CTR promig</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="font-semibold text-slate-800">Menys Activitat</div>
                  <div className="text-lg font-bold text-slate-600">2:00-6:00</div>
                  <div className="text-xs text-slate-500">43 visualitzacions/hora</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}