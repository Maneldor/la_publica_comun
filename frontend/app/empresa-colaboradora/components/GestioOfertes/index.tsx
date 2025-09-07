'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { 
  FileCheck, Plus, Search, Filter, Eye, Edit3, Copy, Trash2,
  Clock, CheckCircle, AlertTriangle, XCircle, Send, Calendar,
  TrendingUp, Users, MapPin, MoreVertical, Download, Upload,
  ChevronDown, ChevronRight, Star, Target, BarChart3, Info,
  RefreshCw, Settings, Package, Sparkles, DollarSign, Timer, 
  Zap, MessageSquare, Share2
} from 'lucide-react'
import type { 
  Oferta, EstadoOferta, TipoOferta, FiltrosOferta, 
  EstadisticasOferta, PrioridadOferta 
} from '../../../../tipos/empresa'
import EditorOferta from '../EditorOferta'
import AdvancedOfferManager from './AdvancedOfferManager'

// ============================================================================
// COMPONENTE PRINCIPAL: GESTIÓN DE OFERTAS
// ============================================================================

const OFERTAS_MOCK: Oferta[] = [
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
    gestorAsignado: 'Maria González',
    destacada: true,
    permitirComentarios: true,
    notificarCambios: true,
    etiquetas: ['React', 'TypeScript', 'Senior'],
    beneficios: ['Salari competitiu', 'Teletreball', 'Formació contínua']
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
    descuento: 20,
    tipoDescuento: 'porcentaje',
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Curs complet de ciberseguretat per a administracions públiques',
    prioridad: 'media',
    comentariosGestor: 'Revisar certificacions i afegir més detalls del temari',
    destacada: false,
    permitirComentarios: true,
    notificarCambios: true,
    etiquetas: ['Ciberseguretat', 'Formació', 'Administració'],
    beneficios: ['Certificat oficial', 'Materials inclosos']
  },
  {
    id: '3',
    titulo: 'Software de Gestió Documental',
    tipo: 'producto',
    estado: 'pendiente',
    audiencia: ['administraciones', 'empresas-colaboradoras'],
    comunidades: ['Madrid', 'Valencia', 'Galicia'],
    fechaCreacion: new Date('2024-11-15'),
    visualizaciones: 850,
    clicks: 67,
    conversiones: 8,
    precio: 149,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Solució completa per a la gestió documental digital',
    prioridad: 'media',
    destacada: false,
    permitirComentarios: true,
    notificarCambios: true,
    etiquetas: ['Software', 'Documental', 'Digital'],
    beneficios: ['Fàcil implementació', 'Suport 24/7']
  },
  {
    id: '4',
    titulo: 'Consultoria Transformació Digital',
    tipo: 'servicio',
    estado: 'borrador',
    audiencia: ['administraciones'],
    comunidades: ['Catalunya'],
    fechaCreacion: new Date('2024-11-18'),
    visualizaciones: 0,
    clicks: 0,
    conversiones: 0,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Acompanyament integral en processos de transformació digital',
    prioridad: 'baja',
    destacada: false,
    permitirComentarios: true,
    notificarCambios: true,
    etiquetas: ['Consultoria', 'Digital', 'Transformació'],
    beneficios: ['Metodologia provada', 'Equip expert']
  },
  {
    id: '5',
    titulo: 'Smart Cities Summit 2024',
    tipo: 'evento',
    estado: 'rechazada',
    audiencia: ['empleados-publicos', 'administraciones'],
    comunidades: ['Catalunya', 'Madrid'],
    fechaCreacion: new Date('2024-11-05'),
    visualizaciones: 450,
    clicks: 30,
    conversiones: 3,
    precio: 99,
    imagen: '/api/placeholder/100/100',
    descripcionBreve: 'Congrés internacional sobre ciutats intel·ligents',
    prioridad: 'alta',
    comentariosGestor: 'Falta informació sobre ponents i agenda detallada',
    destacada: false,
    permitirComentarios: true,
    notificarCambios: true,
    etiquetas: ['Esdeveniments', 'Smart Cities', 'Congrés'],
    beneficios: ['Networking', 'Certificat assistència']
  }
]

const PLAN_LIMITS = {
  actual: 47,
  limite: 100,
  porcentaje: 47
}

interface GestioOfertesProps {
  empresaId?: string
  planEmpresa?: 'basic' | 'premium'
}

export default function GestioOfertes({ 
  empresaId = 'empresa-001', 
  planEmpresa = 'premium' 
}: GestioOfertesProps = {}): JSX.Element {
  // ========================================================================
  // ESTADO Y CONFIGURACIÓN
  // ========================================================================
  
  const [activeView, setActiveView] = useState<'lista' | 'editor'>('lista')
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null)
  const [ofertas, setOfertas] = useState<Oferta[]>(OFERTAS_MOCK)
  const [selectedOfertas, setSelectedOfertas] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  
  const [filtros, setFiltros] = useState<FiltrosOferta>({
    searchTerm: '',
    estado: 'todas',
    audiencia: 'todas',
    tipo: undefined,
    comunidad: undefined,
    prioridad: undefined
  })
  
  const [sortBy, setSortBy] = useState<'fecha' | 'visualizaciones' | 'estado'>('fecha')

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================
  
  const filteredOfertas = useMemo(() => {
    return ofertas.filter(oferta => {
      const matchSearch = oferta.titulo.toLowerCase().includes(filtros.searchTerm.toLowerCase()) ||
                         oferta.descripcionBreve.toLowerCase().includes(filtros.searchTerm.toLowerCase())
      const matchEstado = filtros.estado === 'todas' || oferta.estado === filtros.estado
      const matchAudiencia = filtros.audiencia === 'todas' || 
                            oferta.audiencia.some(aud => aud.includes(filtros.audiencia))
      const matchTipo = !filtros.tipo || oferta.tipo === filtros.tipo
      const matchComunidad = !filtros.comunidad || oferta.comunidades.includes(filtros.comunidad)
      const matchPrioridad = !filtros.prioridad || oferta.prioridad === filtros.prioridad
      
      return matchSearch && matchEstado && matchAudiencia && matchTipo && matchComunidad && matchPrioridad
    }).sort((a, b) => {
      switch(sortBy) {
        case 'fecha':
          return b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
        case 'visualizaciones':
          return b.visualizaciones - a.visualizaciones
        case 'estado':
          return a.estado.localeCompare(b.estado)
        default:
          return 0
      }
    })
  }, [ofertas, filtros, sortBy])

  const estadisticas = useMemo((): EstadisticasOferta => {
    const total = ofertas.length
    const publicadas = ofertas.filter(o => o.estado === 'publicada').length
    const pendientes = ofertas.filter(o => o.estado === 'pendiente' || o.estado === 'revision').length
    const borradores = ofertas.filter(o => o.estado === 'borrador').length
    const visualizacionesTotales = ofertas.reduce((acc, o) => acc + o.visualizaciones, 0)
    
    const ofertasConClicks = ofertas.filter(o => o.clicks > 0)
    const conversionMedia = ofertasConClicks.length > 0 
      ? (ofertasConClicks.reduce((acc, o) => acc + (o.conversiones / o.clicks) * 100, 0) / ofertasConClicks.length).toFixed(1)
      : '0'

    return {
      total,
      publicadas,
      pendientes,
      borradores,
      visualizacionesTotales,
      conversionMedia
    }
  }, [ofertas])

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  const handleNuevaOferta = useCallback(() => {
    setSelectedOferta(null)
    setActiveView('editor')
  }, [])
  
  const handleEditarOferta = useCallback((oferta: Oferta) => {
    setSelectedOferta(oferta)
    setActiveView('editor')
  }, [])
  
  const handleDuplicarOferta = useCallback((oferta: Oferta) => {
    const nuevaOferta: Oferta = {
      ...oferta,
      id: Date.now().toString(),
      titulo: `${oferta.titulo} (còpia)`,
      estado: 'borrador',
      fechaCreacion: new Date(),
      fechaPublicacion: undefined,
      visualizaciones: 0,
      clicks: 0,
      conversiones: 0
    }
    setOfertas(prev => [...prev, nuevaOferta])
  }, [])
  
  const handleEliminarOferta = useCallback((id: string) => {
    if (confirm('Estàs segur que vols eliminar aquesta oferta?')) {
      setOfertas(prev => prev.filter(o => o.id !== id))
    }
  }, [])
  
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedOfertas(prev => 
      prev.includes(id) 
        ? prev.filter(oid => oid !== id) 
        : [...prev, id]
    )
  }, [])
  
  const handleSelectAll = useCallback(() => {
    if (selectedOfertas.length === filteredOfertas.length) {
      setSelectedOfertas([])
    } else {
      setSelectedOfertas(filteredOfertas.map(o => o.id))
    }
  }, [selectedOfertas.length, filteredOfertas])

  const handleRefreshData = useCallback(async () => {
    setRefreshing(true)
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }, [])

  const updateFiltro = useCallback(<K extends keyof FiltrosOferta>(
    key: K, 
    value: FiltrosOferta[K]
  ) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }, [])

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================
  
  const getEstadoConfig = useCallback((estado: EstadoOferta) => {
    const configs = {
      borrador: { 
        color: 'bg-slate-100 text-slate-700 border-slate-300',
        icon: <Edit3 className="w-3 h-3" />
      },
      pendiente: { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: <Clock className="w-3 h-3" />
      },
      revision: { 
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        icon: <Eye className="w-3 h-3" />
      },
      publicada: { 
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: <CheckCircle className="w-3 h-3" />
      },
      rechazada: { 
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: <XCircle className="w-3 h-3" />
      },
      pausada: { 
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: <AlertTriangle className="w-3 h-3" />
      },
      finalizada: { 
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        icon: <CheckCircle className="w-3 h-3" />
      }
    }
    return configs[estado] || configs.borrador
  }, [])
  
  const getTipoIcon = useCallback((tipo: TipoOferta) => {
    const icons = {
      producto: <Package className="w-4 h-4 text-purple-600" />,
      servicio: <Settings className="w-4 h-4 text-blue-600" />,
      formacion: <Calendar className="w-4 h-4 text-green-600" />,
      evento: <Calendar className="w-4 h-4 text-orange-600" />
    }
    return icons[tipo]
  }, [])

  // ========================================================================
  // RENDER LOGIC
  // ========================================================================
  
  if (activeView === 'editor') {
    return (
      <EditorOferta 
        oferta={selectedOferta} 
        onBack={() => setActiveView('lista')}
        onSave={(oferta: Oferta) => {
          if (selectedOferta) {
            setOfertas(prev => prev.map(o => o.id === oferta.id ? oferta : o))
          } else {
            setOfertas(prev => [...prev, { ...oferta, id: Date.now().toString() }])
          }
          setActiveView('lista')
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <FileCheck className="w-4 h-4" />
              <ChevronRight className="w-3 h-3" />
              <span>Gestió d'Ofertes</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Les Meves Ofertes</h1>
            <p className="text-slate-600 mt-1">Gestiona i optimitza les teves ofertes</p>
          </div>
          
          <button
            onClick={handleNuevaOferta}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nova Oferta</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        
        {/* Plan indicator */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-slate-800">Ús del Pla Premium Enterprise</span>
            </div>
            <span className="text-sm text-slate-600">
              <span className="font-bold text-indigo-600">{PLAN_LIMITS.actual}</span> / {PLAN_LIMITS.limite} ofertes
            </span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${PLAN_LIMITS.porcentaje}%` }}
            />
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-800">{estadisticas.total}</div>
            <div className="text-xs text-slate-600">Total</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{estadisticas.publicadas}</div>
            <div className="text-xs text-green-600">Publicades</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</div>
            <div className="text-xs text-yellow-600">Pendents</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">{estadisticas.borradores}</div>
            <div className="text-xs text-slate-600">Esborranys</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {estadisticas.visualizacionesTotales.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">Visualitzacions</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{estadisticas.conversionMedia}%</div>
            <div className="text-xs text-purple-600">Conversió</div>
          </div>
        </div>
      </div>
      
      {/* ================================================================ */}
      {/* FILTERS AND SEARCH */}
      {/* ================================================================ */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={filtros.searchTerm}
                onChange={(e) => updateFiltro('searchTerm', e.target.value)}
                placeholder="Cercar per títol, descripció..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filtros.estado}
              onChange={(e) => updateFiltro('estado', e.target.value as EstadoOferta | 'todas')}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="todas">Tots els estats</option>
              <option value="borrador">Esborrany</option>
              <option value="pendiente">Pendent</option>
              <option value="revision">En Revisió</option>
              <option value="publicada">Publicada</option>
              <option value="rechazada">Rebutjada</option>
              <option value="pausada">Pausada</option>
              <option value="finalizada">Finalitzada</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'fecha' | 'visualizaciones' | 'estado')}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="fecha">Més recent</option>
              <option value="visualizaciones">Més vistes</option>
              <option value="estado">Per estat</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={handleRefreshData}
              disabled={refreshing}
              className="p-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-2">Tipus</label>
                <select 
                  value={filtros.tipo || ''}
                  onChange={(e) => updateFiltro('tipo', e.target.value as TipoOferta || undefined)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="">Tots</option>
                  <option value="producto">Producte</option>
                  <option value="servicio">Servei</option>
                  <option value="formacion">Formació</option>
                  <option value="evento">Esdeveniment</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-2">Prioritat</label>
                <select 
                  value={filtros.prioridad || ''}
                  onChange={(e) => updateFiltro('prioridad', e.target.value as PrioridadOferta || undefined)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="">Totes</option>
                  <option value="alta">Alta</option>
                  <option value="media">Mitjana</option>
                  <option value="baja">Baixa</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-600 block mb-2">Comunitat</label>
                <select 
                  value={filtros.comunidad || ''}
                  onChange={(e) => updateFiltro('comunidad', e.target.value || undefined)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="">Totes</option>
                  <option value="Catalunya">Catalunya</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Andalusia">Andalusia</option>
                  <option value="Valencia">València</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bulk actions */}
        {selectedOfertas.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-indigo-700">
                {selectedOfertas.length} seleccionada{selectedOfertas.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white text-slate-700 text-sm rounded-lg hover:bg-slate-50">
                <Edit3 className="w-4 h-4 inline mr-1" />
                Editar
              </button>
              <button className="px-3 py-1.5 bg-white text-slate-700 text-sm rounded-lg hover:bg-slate-50">
                <Copy className="w-4 h-4 inline mr-1" />
                Duplicar
              </button>
              <button className="px-3 py-1.5 bg-white text-red-600 text-sm rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4 inline mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* ================================================================ */}
      {/* ENTERPRISE FEATURES */}
      {/* ================================================================ */}
      {planEmpresa === 'premium' && (
        <AdvancedOfferManager 
          empresaId={empresaId}
          planEmpresa={planEmpresa}
        />
      )}

      {/* ================================================================ */}
      {/* TABLE */}
      {/* ================================================================ */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedOfertas.length === filteredOfertas.length && filteredOfertas.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Oferta
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Estat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Comunitats
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Mètriques
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                  Accions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredOfertas.map((oferta) => {
                const estadoConfig = getEstadoConfig(oferta.estado)
                
                return (
                  <tr key={oferta.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOfertas.includes(oferta.id)}
                        onChange={() => handleToggleSelect(oferta.id)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={oferta.imagen} 
                            alt={oferta.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getTipoIcon(oferta.tipo)}
                            <h3 className="font-semibold text-slate-800">{oferta.titulo}</h3>
                            {oferta.prioridad === 'alta' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Alta
                              </span>
                            )}
                            {oferta.destacada && (
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{oferta.descripcionBreve}</p>
                          {oferta.precio && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-slate-800">
                                {oferta.precio}€
                              </span>
                              {oferta.descuento && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  -{oferta.descuento}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${estadoConfig.color}`}>
                          {estadoConfig.icon}
                          {oferta.estado.charAt(0).toUpperCase() + oferta.estado.slice(1)}
                        </span>
                        {oferta.comentariosGestor && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <MessageSquare className="w-3 h-3" />
                            <span>Comentaris</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {oferta.comunidades.length}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700 font-medium">
                            {oferta.visualizaciones.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700 font-medium">{oferta.clicks}</span>
                          <span className="text-xs text-slate-500">
                            ({oferta.clicks > 0 ? ((oferta.conversiones / oferta.clicks) * 100).toFixed(1) : 0}%)
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {oferta.fechaCreacion.toLocaleDateString('ca-ES', { 
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      {oferta.fechaExpiracion && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Timer className="w-3 h-3" />
                          Exp: {oferta.fechaExpiracion.toLocaleDateString('ca-ES', { 
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditarOferta(oferta)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicarOferta(oferta)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarOferta(oferta.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="relative group">
                          <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Estadístiques
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Share2 className="w-4 h-4" />
                              Compartir
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Exportar
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Mostrant {filteredOfertas.length} de {ofertas.length} ofertes
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Següent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}