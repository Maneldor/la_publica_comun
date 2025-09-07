'use client'

import { 
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Target, 
  DollarSign, Users, Calendar, Filter, Download, Share2, RefreshCw,
  Eye, ArrowUp, ArrowDown, Clock, CheckCircle, AlertTriangle,
  Building2, Bot, Award, Zap, Brain
} from 'lucide-react'
import { useState } from 'react'

interface MetricaComercial {
  periodo: string
  ventasTotales: number
  ventasMes: number
  leadsGenerados: number
  leadsConvertidos: number
  tasaConversion: number
  valorPipeline: number
  ticketPromedio: number
  cicloVentaPromedio: number // días
  satisfaccionCliente: number
  churnRate: number
  ingresosPorComercial: number
  interaccionesIA: number
  eficienciaIA: number
}

interface RendimientoComercial {
  id: string
  nombre: string
  tipo: 'gestor_empresa' | 'gestor_ia'
  ventasRealizadas: number
  metaMensual: number
  leadsAsignados: number
  tasaConversion: number
  ingresosMes: number
  actividadMes: {
    llamadas: number
    reuniones: number
    propuestas: number
    emails: number
  }
  satisfaccionClientes: number
  crecimientoMensual: number // %
}

interface AnalisisPipeline {
  etapa: string
  numeroLeads: number
  valorTotal: number
  valorPromedio: number
  tiempoMedioEtapa: number // días
  tasaConversionSiguienteEtapa: number
  tendenciaMensual: number // % cambio
}

interface SegmentacionClientes {
  segmento: string
  numeroClientes: number
  valorTotal: number
  ticketPromedio: number
  satisfaccionPromedio: number
  churnRate: number
  potencialCrecimiento: number
  rentabilidadSegmento: number
}

interface AnalyticsProps {
  metricas: MetricaComercial[]
  rendimientoComerciales: RendimientoComercial[]
  analisisPipeline: AnalisisPipeline[]
  segmentacionClientes: SegmentacionClientes[]
  periodoSeleccionado: string
  setPeriodoSeleccionado: (periodo: string) => void
}

export default function Analytics({ 
  metricas, 
  rendimientoComerciales,
  analisisPipeline,
  segmentacionClientes,
  periodoSeleccionado,
  setPeriodoSeleccionado
}: AnalyticsProps) {
  const [vistaActiva, setVistaActiva] = useState<'overview' | 'pipeline' | 'comerciales' | 'segmentacion' | 'predicciones'>('overview')
  const [filtroComercial, setFiltroComercial] = useState<string>('todos')
  const [filtroTipoCliente, setFiltroTipoCliente] = useState<string>('todos')
  
  // Obtener datos actuales
  const metricaActual = metricas[metricas.length - 1] || {
    periodo: 'Actual',
    ventasTotales: 0,
    ventasMes: 0,
    leadsGenerados: 0,
    leadsConvertidos: 0,
    tasaConversion: 0,
    valorPipeline: 0,
    ticketPromedio: 0,
    cicloVentaPromedio: 0,
    satisfaccionCliente: 0,
    churnRate: 0,
    ingresosPorComercial: 0,
    interaccionesIA: 0,
    eficienciaIA: 0
  }

  const metricaAnterior = metricas[metricas.length - 2]
  
  // Calcular variaciones
  const calcularVariacion = (actual: number, anterior: number) => {
    if (!anterior) return 0
    return ((actual - anterior) / anterior) * 100
  }

  const variaciones = metricaAnterior ? {
    ventas: calcularVariacion(metricaActual.ventasMes, metricaAnterior.ventasMes),
    conversion: calcularVariacion(metricaActual.tasaConversion, metricaAnterior.tasaConversion),
    pipeline: calcularVariacion(metricaActual.valorPipeline, metricaAnterior.valorPipeline),
    ticket: calcularVariacion(metricaActual.ticketPromedio, metricaAnterior.ticketPromedio),
    satisfaccion: calcularVariacion(metricaActual.satisfaccionCliente, metricaAnterior.satisfaccionCliente),
    eficienciaIA: calcularVariacion(metricaActual.eficienciaIA, metricaAnterior.eficienciaIA)
  } : {
    ventas: 0, conversion: 0, pipeline: 0, ticket: 0, satisfaccion: 0, eficienciaIA: 0
  }

  const comercialesFiltrados = rendimientoComerciales.filter(c => {
    if (filtroComercial !== 'todos' && c.tipo !== filtroComercial) return false
    return true
  })

  const getVariacionColor = (variacion: number) => {
    if (variacion > 0) return 'text-green-600'
    if (variacion < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getVariacionIcon = (variacion: number) => {
    if (variacion > 0) return <ArrowUp className="w-3 h-3" />
    if (variacion < 0) return <ArrowDown className="w-3 h-3" />
    return null
  }

  const topComerciales = [...rendimientoComerciales]
    .sort((a, b) => (b.ventasRealizadas / Math.max(b.metaMensual, 1)) - (a.ventasRealizadas / Math.max(a.metaMensual, 1)))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'pipeline', 'comerciales', 'segmentacion', 'predicciones'].map((vista) => (
              <button
                key={vista}
                onClick={() => setVistaActiva(vista as any)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors capitalize ${
                  vistaActiva === vista 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {vista === 'overview' && <BarChart3 className="w-4 h-4 inline mr-2" />}
                {vista === 'pipeline' && <Target className="w-4 h-4 inline mr-2" />}
                {vista === 'comerciales' && <Users className="w-4 h-4 inline mr-2" />}
                {vista === 'segmentacion' && <PieChart className="w-4 h-4 inline mr-2" />}
                {vista === 'predicciones' && <Brain className="w-4 h-4 inline mr-2" />}
                {vista === 'overview' ? 'Resum' : 
                 vista === 'segmentacion' ? 'Segmentació' :
                 vista === 'predicciones' ? 'IA Predictiva' : vista}
              </button>
            ))}
          </div>

          <select 
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="mes_actual">Mes Actual</option>
            <option value="trimestre">Trimestre</option>
            <option value="semestre">Semestre</option>
            <option value="anyo">Any</option>
          </select>

          {(vistaActiva === 'comerciales' || vistaActiva === 'segmentacion') && (
            <select 
              value={vistaActiva === 'comerciales' ? filtroComercial : filtroTipoCliente}
              onChange={(e) => vistaActiva === 'comerciales' ? setFiltroComercial(e.target.value) : setFiltroTipoCliente(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Tots</option>
              {vistaActiva === 'comerciales' ? (
                <>
                  <option value="gestor_empresa">Gestors Empresa</option>
                  <option value="gestor_ia">Gestors IA</option>
                </>
              ) : (
                <>
                  <option value="empresa_privada">Empresa Privada</option>
                  <option value="administracion_publica">Admin. Pública</option>
                </>
              )}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="text-gray-600 hover:text-gray-800 p-2">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-800 p-2">
            <Download className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-800 p-2">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vista Overview */}
      {vistaActiva === 'overview' && (
        <div className="space-y-6">
          {/* KPIs principales */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Vendes Mes</p>
                  <p className="text-2xl font-bold">{metricaActual.ventasMes}</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.ventas)}`}>
                    {getVariacionIcon(variaciones.ventas)}
                    <span className="text-xs">{Math.abs(variaciones.ventas).toFixed(1)}%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Taxa Conversió</p>
                  <p className="text-2xl font-bold">{metricaActual.tasaConversion.toFixed(1)}%</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.conversion)}`}>
                    {getVariacionIcon(variaciones.conversion)}
                    <span className="text-xs">{Math.abs(variaciones.conversion).toFixed(1)}%</span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Pipeline</p>
                  <p className="text-2xl font-bold">€{Math.round(metricaActual.valorPipeline / 1000)}K</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.pipeline)}`}>
                    {getVariacionIcon(variaciones.pipeline)}
                    <span className="text-xs">{Math.abs(variaciones.pipeline).toFixed(1)}%</span>
                  </div>
                </div>
                <LineChart className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Ticket Mitjà</p>
                  <p className="text-2xl font-bold">€{Math.round(metricaActual.ticketPromedio / 1000)}K</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.ticket)}`}>
                    {getVariacionIcon(variaciones.ticket)}
                    <span className="text-xs">{Math.abs(variaciones.ticket).toFixed(1)}%</span>
                  </div>
                </div>
                <Award className="w-8 h-8 text-orange-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Satisfacció</p>
                  <p className="text-2xl font-bold">{metricaActual.satisfaccionCliente.toFixed(1)}</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.satisfaccion)}`}>
                    {getVariacionIcon(variaciones.satisfaccion)}
                    <span className="text-xs">{Math.abs(variaciones.satisfaccion).toFixed(1)}%</span>
                  </div>
                </div>
                <CheckCircle className="w-8 h-8 text-indigo-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Eficiència IA</p>
                  <p className="text-2xl font-bold">{metricaActual.eficienciaIA.toFixed(0)}%</p>
                  <div className={`flex items-center gap-1 mt-1 ${getVariacionColor(variaciones.eficienciaIA)}`}>
                    {getVariacionIcon(variaciones.eficienciaIA)}
                    <span className="text-xs">{Math.abs(variaciones.eficienciaIA).toFixed(1)}%</span>
                  </div>
                </div>
                <Bot className="w-8 h-8 text-teal-200" />
              </div>
            </div>
          </div>

          {/* Gráficos y análisis */}
          <div className="grid grid-cols-2 gap-6">
            {/* Evolución temporal */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Evolució Temporal</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center text-gray-500">
                  <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Gràfic d'evolució temporal</p>
                  <p className="text-xs mt-1">Vendes, Conversions i Pipeline</p>
                </div>
              </div>
            </div>

            {/* Top Comerciales */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Top Comercials</h3>
              <div className="space-y-3">
                {topComerciales.map((comercial, index) => (
                  <div key={comercial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{comercial.nombre}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {comercial.tipo.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {Math.round((comercial.ventasRealizadas / Math.max(comercial.metaMensual, 1)) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {comercial.ventasRealizadas}/{comercial.metaMensual}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicadores adicionales */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Cicle Venda Mitjà</span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metricaActual.cicloVentaPromedio}</div>
              <div className="text-xs text-gray-500">dies</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Churn Rate</span>
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metricaActual.churnRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">monthly</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ingressos/Comercial</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">€{Math.round(metricaActual.ingresosPorComercial / 1000)}K</div>
              <div className="text-xs text-gray-500">mensual</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Interaccions IA</span>
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metricaActual.interaccionesIA.toLocaleString()}</div>
              <div className="text-xs text-gray-500">aquest mes</div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Pipeline */}
      {vistaActiva === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Anàlisi Pipeline per Etapes</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {analisisPipeline.map((etapa, index) => (
                <div key={etapa.etapa} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">{etapa.etapa}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      etapa.tendenciaMensual > 0 ? 'bg-green-100 text-green-800' : 
                      etapa.tendenciaMensual < 0 ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {etapa.tendenciaMensual > 0 ? '+' : ''}{etapa.tendenciaMensual.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Leads:</span>
                      <span className="font-medium">{etapa.numeroLeads}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor total:</span>
                      <span className="font-medium">€{etapa.valorTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor mitjà:</span>
                      <span className="font-medium">€{etapa.valorPromedio.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Temps mitjà:</span>
                      <span className="font-medium">{etapa.tiempoMedioEtapa} dies</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa conversió:</span>
                      <span className="font-medium text-green-600">{etapa.tasaConversionSiguienteEtapa}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embudo de conversión visual */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Embut de Conversió</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Visualització d'embut de conversió</p>
                <p className="text-xs mt-1">Pipeline per etapes amb percentatges</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Comerciales */}
      {vistaActiva === 'comerciales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Rendiment Comercials</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Comercial</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Tipus</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Vendes/Meta</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Conversió</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Ingressos</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Activitat</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Creixement</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-900">Satisfacció</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comercialesFiltrados.map((comercial) => (
                  <tr key={comercial.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-sm text-gray-900">{comercial.nombre}</div>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        comercial.tipo === 'gestor_empresa' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {comercial.tipo === 'gestor_empresa' ? 'Empresa' : 'IA'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comercial.ventasRealizadas}/{comercial.metaMensual}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min((comercial.ventasRealizadas / comercial.metaMensual) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium">{comercial.tasaConversion.toFixed(1)}%</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium">€{comercial.ingresosMes.toLocaleString()}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-xs space-y-1">
                        <div>Trucades: {comercial.actividadMes.llamadas}</div>
                        <div>Reunions: {comercial.actividadMes.reuniones}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center gap-1 ${getVariacionColor(comercial.crecimientoMensual)}`}>
                        {getVariacionIcon(comercial.crecimientoMensual)}
                        <span className="text-sm font-medium">{comercial.crecimientoMensual.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{comercial.satisfaccionClientes.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 ${i < Math.floor(comercial.satisfaccionClientes) ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Segmentación */}
      {vistaActiva === 'segmentacion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {segmentacionClientes.map((segmento) => (
              <div key={segmento.segmento} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{segmento.segmento}</h3>
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clients:</span>
                    <span className="font-medium">{segmento.numeroClientes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor total:</span>
                    <span className="font-medium">€{segmento.valorTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ticket mitjà:</span>
                    <span className="font-medium">€{segmento.ticketPromedio.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Satisfacció:</span>
                    <span className="font-medium">{segmento.satisfaccionPromedio.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Churn:</span>
                    <span className={`font-medium ${segmento.churnRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {segmento.churnRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rentabilitat:</span>
                    <span className="font-medium text-green-600">{segmento.rentabilidadSegmento.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potencial creixement:</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${segmento.potencialCrecimiento}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{segmento.potencialCrecimiento}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista Predicciones IA */}
      {vistaActiva === 'predicciones' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Anàlisi Predictiu IA</h2>
            </div>
            <p className="text-purple-100">
              Prediccions basades en Intel·ligència Artificial utilitzant dades històriques i patrons de comportament
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Predicciones de ventas */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Prediccions de Vendes
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Pròxim mes</span>
                    <span className="text-2xl font-bold text-green-600">+23%</span>
                  </div>
                  <p className="text-sm text-green-700">Increment esperat en vendes basant-se en tendències actuals</p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Trimestre</span>
                    <span className="text-2xl font-bold text-blue-600">€580K</span>
                  </div>
                  <p className="text-sm text-blue-700">Ingressos estimats per als pròxims 3 mesos</p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Confiança model</span>
                    <span className="text-2xl font-bold text-purple-600">87%</span>
                  </div>
                  <p className="text-sm text-purple-700">Precisió de les prediccions IA</p>
                </div>
              </div>
            </div>

            {/* Alertas y recomendaciones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Alertes i Recomanacions
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-900">Risc de pèrdua de client</div>
                    <div className="text-xs text-red-700">Cliente "Ajuntament Barcelona" mostra baixa activitat</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-900">Oportunitat de venda</div>
                    <div className="text-xs text-yellow-700">Lead "Diputació Girona" amb alta probabilitat de conversió</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-green-900">Moment òptim</div>
                    <div className="text-xs text-green-700">Enviar proposta a "Conselleria Educació" aquesta setmana</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <Bot className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Millora IA</div>
                    <div className="text-xs text-blue-700">Implementar nou model de lead scoring amb 12% més precisió</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}