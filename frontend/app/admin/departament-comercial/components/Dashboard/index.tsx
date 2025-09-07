'use client'

import { 
  TrendingUp, Users, Target, DollarSign, Building2, Brain,
  Award, CheckCircle, Clock, ArrowUp, ArrowDown, Package
} from 'lucide-react'

interface MetricasComerciales {
  ventasTotales: number
  ventasMes: number
  conversionRate: number
  ticketPromedio: number
  leadsNuevos: number
  pipelineValor: number
  renovaciones: number
  churnRate: number
}

interface Lead {
  id: string
  nombre: string
  empresa: string
  tipo: 'empresa_privada' | 'administracion_publica'
  estado: string
  puntuacion: number
  probabilidadCierre: number
  gestorAsignado?: string
}

interface Comercial {
  id: string
  nombre: string
  tipo: 'gestor_empresa' | 'gestor_ia'
  ventasActuales: number
  metaMensual: number
  tasaConversion: number
  ingresosMes: number
  estado: string
}

interface Paquete {
  id: string
  nombre: string
  tipo: string
  tipoCliente: 'empresa_privada' | 'administracion_publica' | 'ambos'
  precio: number
  roiEstimado: number
}

interface DashboardProps {
  metricas: MetricasComerciales
  leads: Lead[]
  comerciales: Comercial[]
  paquetes: Paquete[]
}

export default function Dashboard({ metricas, leads, comerciales, paquetes }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Vendes Totals</p>
              <p className="text-3xl font-bold">€{metricas.ventasTotales.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">+23% vs mes anterior</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Taxa Conversió</p>
              <p className="text-3xl font-bold">{metricas.conversionRate}%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">+5.2% millora</span>
              </div>
            </div>
            <Target className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Pipeline Valor</p>
              <p className="text-3xl font-bold">€{metricas.pipelineValor.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">{leads.length} leads actius</span>
              </div>
            </div>
            <Brain className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Ticket Promig</p>
              <p className="text-3xl font-bold">€{metricas.ticketPromedio.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm">Churn: {metricas.churnRate}%</span>
              </div>
            </div>
            <Award className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Pipeline por tipo de cliente */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Pipeline Administració Pública
          </h3>
          <div className="space-y-4">
            {['cualificado', 'propuesta', 'negociacion'].map(estado => {
              const leadsEstado = leads.filter(l => l.tipo === 'administracion_publica' && l.estado === estado)
              return (
                <div key={estado} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{estado}</p>
                    <p className="text-sm text-gray-600">{leadsEstado.length} leads</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      €{leadsEstado.reduce((sum, lead) => sum + (lead.puntuacion * 1000), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">valor estimat</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Pipeline Empresa Privada
          </h3>
          <div className="space-y-4">
            {['cualificado', 'propuesta', 'negociacion'].map(estado => {
              const leadsEstado = leads.filter(l => l.tipo === 'empresa_privada' && l.estado === estado)
              return (
                <div key={estado} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{estado}</p>
                    <p className="text-sm text-gray-600">{leadsEstado.length} leads</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      €{leadsEstado.reduce((sum, lead) => sum + (lead.puntuacion * 1000), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">valor estimat</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance comerciales */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Performance Comercials</h3>
        <div className="grid grid-cols-2 gap-6">
          {comerciales.map(comercial => (
            <div key={comercial.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">{comercial.nombre}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {comercial.tipo.replace('_', ' ')}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  comercial.estado === 'activo' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendes / Meta:</span>
                  <span className="font-medium">
                    {comercial.ventasActuales}/{comercial.metaMensual}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa conversió:</span>
                  <span className="font-medium text-green-600">
                    {comercial.tasaConversion}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ingressos mes:</span>
                  <span className="font-medium">
                    €{comercial.ingresosMes.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(comercial.ventasActuales / comercial.metaMensual) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paquetes más vendidos */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          Paquetes Més Venuts
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {paquetes.slice(0, 3).map(paquete => (
            <div key={paquete.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">{paquete.nombre}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {paquete.tipoCliente.replace('_', ' ')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  paquete.tipo === 'basico' ? 'bg-blue-100 text-blue-800' :
                  paquete.tipo === 'profesional' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {paquete.tipo}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preu:</span>
                  <span className="font-medium">€{paquete.precio.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI estimat:</span>
                  <span className="font-medium text-green-600">{paquete.roiEstimado}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads recientes con alta puntuación */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Leads Prioritaris (IA Score +80)</h3>
        <div className="space-y-3">
          {leads
            .filter(lead => lead.puntuacion >= 80)
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, 5)
            .map(lead => (
            <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  lead.tipo === 'administracion_publica' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="font-medium">{lead.nombre}</p>
                  <p className="text-sm text-gray-600">{lead.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">Score: {lead.puntuacion}</p>
                  <p className="text-xs text-gray-600">
                    Prob: {lead.probabilidadCierre}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium capitalize">{lead.estado}</p>
                  <p className="text-xs text-gray-600">{lead.gestorAsignado || 'Sense assignar'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}