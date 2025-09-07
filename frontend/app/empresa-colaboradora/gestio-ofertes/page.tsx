'use client'

import { useState, useMemo, useCallback } from 'react'
import { 
  FileCheck, Plus, Search, Filter, Eye, Edit3, Copy, Trash2,
  Clock, CheckCircle, AlertTriangle, XCircle, Send, Calendar,
  TrendingUp, Users, MapPin, MoreVertical, Download, Upload,
  ChevronDown, ChevronRight, Star, Target, BarChart3, Info,
  RefreshCw, Settings, Package, Sparkles, DollarSign, Timer, 
  Zap, MessageSquare, Share2, Crown, Brain, Activity
} from 'lucide-react'

// Datos mock con estructura premium
const OFERTAS_MOCK = [
  {
    id: '1',
    titulo: 'Desenvolupador Senior React',
    tipo: 'servicio',
    estado: 'publicada',
    audiencia: ['empleados-publicos', 'administraciones'],
    comunidades: ['Catalunya', 'Madrid', 'Andalusia'],
    fechaCreacion: new Date('2024-11-01'),
    fechaPublicacion: new Date('2024-11-02'),
    fechaExpiracion: new Date('2024-12-31'),
    visualizaciones: 3500,
    clicks: 280,
    conversiones: 45,
    precio: 65000,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Busquem desenvolupador senior amb experiència en React i TypeScript',
    prioridad: 'alta',
    destacada: true,
    etiquetas: ['React', 'TypeScript', 'Senior']
  },
  {
    id: '2',
    titulo: 'Formació en Ciberseguretat',
    tipo: 'formacion',
    estado: 'revision',
    audiencia: ['empleados-publicos'],
    comunidades: ['Catalunya', 'Euskadi'],
    fechaCreacion: new Date('2024-11-10'),
    visualizaciones: 1200,
    clicks: 95,
    conversiones: 12,
    precio: 299,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Curs complet de ciberseguretat per a administracions públiques',
    prioridad: 'media',
    destacada: false,
    etiquetas: ['Ciberseguretat', 'Formació']
  },
  {
    id: '3',
    titulo: 'Software de Gestió Documental',
    tipo: 'producto',
    estado: 'pendiente',
    audiencia: ['administraciones'],
    comunidades: ['Madrid', 'Valencia'],
    fechaCreacion: new Date('2024-11-15'),
    visualizaciones: 850,
    clicks: 67,
    conversiones: 8,
    precio: 149,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Solució completa per a la gestió documental digital',
    prioridad: 'media',
    destacada: false,
    etiquetas: ['Software', 'Digital']
  }
]

const PLAN_STATS = {
  actual: 47,
  limite: 100,
  porcentaje: 47
}

export default function GestioOfertesPagePremium() {
  const [selectedOfertas, setSelectedOfertas] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'optimizacion' | 'analytics' | 'automatizacion'>('optimizacion')
  
  const [filtros, setFiltros] = useState({
    searchTerm: '',
    estado: 'todas',
    tipo: undefined
  })

  // Estadísticas calculadas
  const estadisticas = useMemo(() => {
    const total = OFERTAS_MOCK.length
    const publicadas = OFERTAS_MOCK.filter(o => o.estado === 'publicada').length
    const pendientes = OFERTAS_MOCK.filter(o => o.estado === 'pendiente' || o.estado === 'revision').length
    const borradores = OFERTAS_MOCK.filter(o => o.estado === 'borrador').length
    const visualizacionesTotales = OFERTAS_MOCK.reduce((acc, o) => acc + o.visualizaciones, 0)
    
    return {
      total,
      publicadas,
      pendientes,
      borradores,
      visualizacionesTotales,
      conversionMedia: '8.2'
    }
  }, [])

  const getEstadoConfig = (estado: string) => {
    const configs = {
      'borrador': { color: 'bg-slate-100 text-slate-700', icon: <Edit3 className="w-3 h-3" /> },
      'pendiente': { color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
      'revision': { color: 'bg-blue-100 text-blue-700', icon: <Eye className="w-3 h-3" /> },
      'publicada': { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="w-3 h-3" /> },
      'rechazada': { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> }
    }
    return configs[estado] || configs.borrador
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <FileCheck className="w-4 h-4" />
              <ChevronRight className="w-3 h-3" />
              <span>Gestió d'Ofertes</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Les Meves Ofertes</h1>
            <p className="text-slate-600">Gestiona i optimitza les teves ofertes amb intel·ligència artificial</p>
          </div>
          
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-blue-500/25">
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nova Oferta</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de Plan Premium */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Premium Enterprise</h3>
                <p className="text-sm text-amber-700">Funcionalitats completes actives</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-1">Ús del pla</div>
              <div className="font-bold text-slate-800">
                <span className="text-2xl text-amber-600">{PLAN_STATS.actual}</span>
                <span className="text-slate-500">/{PLAN_STATS.limite}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-amber-100 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${PLAN_STATS.porcentaje}%` }}
            />
          </div>
          <div className="text-xs text-amber-600 text-center">{PLAN_STATS.porcentaje}% utilitzat</div>
        </div>
      </div>

      {/* Métriques Premium en Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{estadisticas.total}</div>
              <div className="text-sm text-slate-600">Total Ofertes</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{estadisticas.publicadas}</div>
              <div className="text-sm text-slate-600">Publicades</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-700">{estadisticas.pendientes}</div>
              <div className="text-sm text-slate-600">En Procés</div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-slate-200/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{estadisticas.visualizacionesTotales.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Visualitzacions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestió Intel·ligent IA - Card Premium */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200/60 p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                Gestió Intel·ligent d'Ofertes
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm rounded-full font-bold shadow-md">
                  Premium IA
                </span>
              </h2>
              <p className="text-slate-600 mt-1">Optimització automàtica amb intel·ligència artificial avançada</p>
            </div>
          </div>
        </div>

        {/* Tabs Premium IA */}
        <div className="flex gap-1 mb-6 bg-white/60 p-1 rounded-xl border border-white/40">
          {[
            { id: 'optimizacion', name: 'Optimització IA', icon: Zap },
            { id: 'analytics', name: 'Analytics Avançats', icon: BarChart3 },
            { id: 'automatizacion', name: 'Automatització', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-md text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Contingut dels Tabs */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/60">
          {activeTab === 'optimizacion' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Suggeriments Intel·ligents
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">Millor Timing</h4>
                      <p className="text-sm text-green-700">Publica entre 10:00-12:00h per obtenir +34% més visibilitat</p>
                      <button className="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                        Aplicar Suggeriment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Audiència Optimitzada</h4>
                      <p className="text-sm text-blue-700">Expaneix a professionals júnior d'Euskadi (+22% engagement)</p>
                      <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                        Aplicar Suggeriment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">Analytics Avançats</h3>
              <p className="text-slate-600">Mètriques detallades i insights predictius</p>
            </div>
          )}

          {activeTab === 'automatizacion' && (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">Automatització Intel·ligent</h3>
              <p className="text-slate-600">Fluxos de treball automàtics per a màxima eficiència</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid d'Ofertes Premium */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Ofertes Actives</h3>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cercar ofertes..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {OFERTAS_MOCK.map((oferta) => {
              const estadoConfig = getEstadoConfig(oferta.estado)
              
              return (
                <div key={oferta.id} className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={oferta.imagen} 
                        alt={oferta.titulo}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {oferta.titulo}
                        </h4>
                        {oferta.destacada && (
                          <Star className="w-4 h-4 text-amber-500 fill-current mt-1" />
                        )}
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.color}`}>
                      {estadoConfig.icon}
                      {oferta.estado}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{oferta.descripcionBreve}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{oferta.visualizaciones}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{oferta.clicks}</span>
                      </div>
                    </div>
                    
                    {oferta.precio && (
                      <div className="font-semibold text-slate-800">
                        {oferta.precio.toLocaleString()}€
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Editar
                    </button>
                    <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}