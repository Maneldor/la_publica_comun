'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, TrendingUp, Eye, MousePointer, MapPin, FileCheck,
  Plus, Bell, MessageCircle, Settings, Search, Filter, Calendar,
  Users, BarChart3, PieChart, Activity, Star, ChevronRight,
  Target, Clock, CheckCircle, AlertTriangle, Zap, Globe,
  X, Send, Bot, Crown, Award, Diamond, Sparkles, ArrowUp,
  ArrowDown, Info, ExternalLink, RefreshCw, TrendingDown,
  Lightbulb, Timer, CalendarDays, ArrowRight, ChevronUp
} from 'lucide-react'
import { useIdioma, useTema } from '../../hooks/useComunidad'
import { fetchEmpresaData, fetchRealTimeStats, subscribeToRealTimeUpdates, type EmpresaData } from './services/empresaService'
import PerfilEmpresa from './components/PerfilEmpresa'
import GrupsOcults from './components/GrupsOcults'
import GestioOfertes from './components/GestioOfertes'
import Analytics from './components/Analytics'
import CentreComunicacio from './components/CentreComunicacio'
import ConfiguracioIA from './components/ConfiguracioIA'

export default function EmpresaColaboradoraPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showAIChat, setShowAIChat] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [notifications, setNotifications] = useState(3)
  const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null)
  const [realTimeStats, setRealTimeStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTooltip, setShowTooltip] = useState('')
  const [chartPeriod, setChartPeriod] = useState('30D')
  const [hoveredMetric, setHoveredMetric] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { idioma } = useIdioma()
  const { colores } = useTema()
  
  // Cargar datos dinámicos al montar el componente
  useEffect(() => {
    loadEmpresaData()
    loadRealTimeStats()
    
    // Suscribirse a actualizaciones en tiempo real
    const unsubscribe = subscribeToRealTimeUpdates('empresa-001', (update) => {
      console.log('Real-time update:', update)
      // Actualizar métricas según el tipo de actualización
      if (update.type === 'view' || update.type === 'click') {
        loadRealTimeStats()
      }
    })
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(() => {
      loadRealTimeStats()
    }, 30000)
    
    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])
  
  const loadEmpresaData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchEmpresaData('empresa-001')
      setEmpresaData(data)
      setNotifications(data.alerts.filter(a => !a.read).length)
    } catch (error) {
      console.error('Error loading empresa data:', error)
      setError('Error carregant les dades de l\'empresa')
    } finally {
      setLoading(false)
    }
  }
  
  const loadRealTimeStats = async () => {
    try {
      const stats = await fetchRealTimeStats('empresa-001')
      setRealTimeStats(stats)
    } catch (error) {
      console.error('Error loading real-time stats:', error)
    }
  }
  
  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([loadEmpresaData(), loadRealTimeStats()])
    setRefreshing(false)
  }

  // Sistema de traduccions
  const traduccions = {
    ca: {
      // Header
      planPremium: "Premium Enterprise",
      gestorComercial: "Gestor Comercial",
      
      // Sidebar
      dashboard: "Dashboard Principal",
      perfilEmpresa: "Perfil de Empresa",
      mevasOfertes: "Gestió d'Ofertes",
      analytics: "Analytics i Informes",
      grupsOcults: "Grups Ocults",
      comunicacio: "Centre de Comunicació",
      configIA: "Configuració IA",
      recursos: "Recursos i Suport",
      
      // Quick Actions
      novaOferta: "Nova Oferta",
      creaOfertaIA: "Crea una oferta amb IA",
      veureRendiment: "Veure rendiment",
      chatIA: "Chat IA",
      assessorComercial: "Assessor comercial",
      accionsRapides: "Accions Ràpides",
      
      // Metrics
      ofertesActives: "Ofertes Actives",
      usPla: "Ús del pla",
      visualitzacions: "Visualitzacions",
      visualitzacionsAquestMes: "Visualitzacions aquest mes",
      clicks: "Clicks",
      conversio: "conversió",
      comunitatsActives: "Comunitats Actives",
      
      // Pipeline
      pipelineAprovacio: "Pipeline d'Aprovació",
      pendents: "Pendents",
      enRevisio: "En Revisió",
      aprovades: "Aprovades",
      rebutjades: "Rebutjades",
      
      // Notificacions
      notificacions: "Notificacions",
      ofertaAprovada: "Oferta Aprovada",
      limitProper: "Límit Proper",
      novaFuncionalitat: "Nova Funcionalitat",
      
      // Performance
      rendimentUltims30Dies: "Rendiment dels Últims 30 Dies",
      graficRendiment: "Gràfic de rendiment es carregarà aquí",
      
      // AI Chat
      assessorComercialIA: "Assessor Comercial IA",
      especialistaEmpreses: "Especialista en empreses col·laboradores",
      hola: "Hola! Soc el vostre assessor comercial IA.",
      pucAjudar: "Puc ajudar-vos amb optimització d'ofertes, anàlisi de rendiment i estratègies per millorar la vostra presència a La Pública.",
      recomanacio: "Recomanació",
      oportunitat: "Oportunitat",
      pregunteuMetriques: "Pregunteu sobre les vostres mètriques...",
      
      // Alerts
      fa2minuts: "fa 2 minuts",
      fa1hora: "fa 1 hora",
      fa3hores: "fa 3 hores"
    },
    es: {
      // Header
      planPremium: "Premium Enterprise",
      gestorComercial: "Gestor Comercial",
      
      // Sidebar
      dashboard: "Dashboard Principal",
      perfilEmpresa: "Perfil de Empresa",
      mevasOfertes: "Gestión de Ofertas",
      analytics: "Analytics e Informes",
      grupsOcults: "Grupos Ocultos",
      comunicacio: "Centro de Comunicación",
      configIA: "Configuración IA",
      recursos: "Recursos y Soporte",
      
      // Quick Actions
      novaOferta: "Nueva Oferta",
      creaOfertaIA: "Crea una oferta con IA",
      veureRendiment: "Ver rendimiento",
      chatIA: "Chat IA",
      assessorComercial: "Asesor comercial",
      accionsRapides: "Acciones Rápidas",
      
      // Metrics
      ofertesActives: "Ofertas Activas",
      usPla: "Uso del plan",
      visualitzacions: "Visualizaciones",
      visualitzacionsAquestMes: "Visualizaciones este mes",
      clicks: "Clics",
      conversio: "conversión",
      comunitatsActives: "Comunidades Activas",
      
      // Pipeline
      pipelineAprovacio: "Pipeline de Aprobación",
      pendents: "Pendientes",
      enRevisio: "En Revisión",
      aprovades: "Aprobadas",
      rebutjades: "Rechazadas",
      
      // Notificacions
      notificacions: "Notificaciones",
      ofertaAprovada: "Oferta Aprobada",
      limitProper: "Límite Próximo",
      novaFuncionalitat: "Nueva Funcionalidad",
      
      // Performance
      rendimentUltims30Dies: "Rendimiento de los Últimos 30 Días",
      graficRendiment: "Gráfico de rendimiento se cargará aquí",
      
      // AI Chat
      assessorComercialIA: "Asesor Comercial IA",
      especialistaEmpreses: "Especialista en empresas colaboradoras",
      hola: "¡Hola! Soy vuestro asesor comercial IA.",
      pucAjudar: "Puedo ayudaros con optimización de ofertas, análisis de rendimiento y estrategias para mejorar vuestra presencia en La Pública.",
      recomanacio: "Recomendación",
      oportunitat: "Oportunidad",
      pregunteuMetriques: "Pregunta sobre tus métricas...",
      
      // Alerts
      fa2minuts: "hace 2 minutos",
      fa1hora: "hace 1 hora",
      fa3hores: "hace 3 horas"
    }
  }

  const t = (key: keyof typeof traduccions.ca): string => {
    const lang = idioma === 'ca' ? 'ca' : 'es'
    return traduccions[lang][key] || traduccions.ca[key]
  }

  // Función para formatear tiempo relativo
  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (idioma === 'ca') {
      if (minutes < 60) return `fa ${minutes} ${minutes === 1 ? 'minut' : 'minuts'}`
      if (hours < 24) return `fa ${hours} ${hours === 1 ? 'hora' : 'hores'}`
      return `fa ${days} ${days === 1 ? 'dia' : 'dies'}`
    } else {
      if (minutes < 60) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
      if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`
    }
  }
  
  // Obtener color del plan dinámicamente
  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Premium Enterprise': return 'from-amber-500 to-orange-600'
      case 'Professional': return 'from-purple-500 to-indigo-600'
      case 'Basic': return 'from-gray-500 to-gray-700'
      default: return 'from-blue-500 to-blue-700'
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{idioma === 'ca' ? 'Carregant dades...' : 'Cargando datos...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadEmpresaData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {idioma === 'ca' ? 'Tornar a intentar' : 'Reintentar'}
          </button>
        </div>
      </div>
    )
  }
  
  if (!empresaData) return null

  const sidebarItems = [
    { id: 'dashboard', name: t('dashboard'), icon: BarChart3, active: activeSection === 'dashboard' },
    { id: 'perfil', name: t('perfilEmpresa'), icon: Building2, active: activeSection === 'perfil' },
    { id: 'ofertes', name: t('mevasOfertes'), icon: FileCheck, badge: empresaData?.metrics.ofertes.actives || 0, active: activeSection === 'ofertes' },
    { id: 'analytics', name: t('analytics'), icon: TrendingUp, active: activeSection === 'analytics' },
    { id: 'grups', name: t('grupsOcults'), icon: Eye, proBadge: true, active: activeSection === 'grups' },
    { id: 'comunicacio', name: t('comunicacio'), icon: MessageCircle, active: activeSection === 'comunicacio' },
    { id: 'ia', name: t('configIA'), icon: Bot, active: activeSection === 'ia' },
    { id: 'recursos', name: t('recursos'), icon: Search, active: activeSection === 'recursos' }
  ]

  const quickActions = [
    { 
      title: t('novaOferta'), 
      desc: t('creaOfertaIA'),
      icon: Plus, 
      color: "bg-gradient-to-r from-blue-600 to-indigo-600",
      action: "create_offer"
    },
    { 
      title: t('analytics'), 
      desc: t('veureRendiment'),
      icon: BarChart3, 
      color: "bg-gradient-to-r from-emerald-600 to-teal-600",
      action: "view_analytics"
    },
    { 
      title: t('chatIA'), 
      desc: t('assessorComercial'),
      icon: Bot, 
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      action: "open_ai"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Premium */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{empresaData.empresa.nombre}</h1>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getPlanColor(empresaData.empresa.plan)} text-white text-xs font-semibold rounded-full flex items-center gap-1`}>
                      <Crown className="w-3 h-3" />
                      {empresaData.empresa.plan}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">MG</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-700">Gestor Comercial</div>
                  <div className="text-slate-500">{empresaData.empresa.gestorComercial.nombre}</div>
                </div>
              </div>

              <button 
                className="relative p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                onClick={() => setNotifications(0)}
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Premium */}
        <aside className="w-72 bg-white/60 backdrop-blur-md border-r border-slate-200/60 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.active 
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.active ? 'bg-white/20' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.proBadge && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold">
                        PRO
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 mb-4">Accions Ràpides</h3>
              <div className="space-y-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => action.action === 'open_ai' && setShowAIChat(true)}
                      className={`w-full p-4 ${action.color} text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">{action.title}</div>
                          <div className="text-xs opacity-90">{action.desc}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Principal */}
          {activeSection === 'dashboard' && (
            <>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 mb-6 text-sm text-slate-600">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Empresa</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-slate-800">Dashboard Principal</span>
              </div>

              {/* Metrics Overview Mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Ofertes Actives - Mejorada */}
            <div 
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              onMouseEnter={() => setHoveredMetric('ofertes')}
              onMouseLeave={() => setHoveredMetric('')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <ArrowUp className="w-3 h-3" />
                    <span className="text-xs font-semibold">+12%</span>
                  </div>
                  <button 
                    className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'ofertes' ? 'bg-indigo-100 text-indigo-600' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setShowTooltip(showTooltip === 'ofertes' ? '' : 'ofertes')}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.ofertes.actives}</h3>
                <p className="text-sm text-slate-500">Ofertes Actives</p>
                <p className="text-xs text-slate-400 mt-1">vs mes anterior</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Ús del pla</span>
                  <span>{empresaData.metrics.ofertes.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${empresaData.metrics.ofertes.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Botón Ver detalles en hover */}
              <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-indigo-700 flex items-center gap-1`}>
                Ver detalles
                <ExternalLink className="w-3 h-3" />
              </button>
              
              {/* Tooltip */}
              {showTooltip === 'ofertes' && (
                <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
                  <div className="font-medium mb-1">Ofertes Actives</div>
                  <div>Número d'ofertes de feina actualment publicades i actives a la plataforma. Límit segons el vostre pla Premium Enterprise.</div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>

            {/* Visualitzacions - Mejorada */}
            <div 
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              onMouseEnter={() => setHoveredMetric('views')}
              onMouseLeave={() => setHoveredMetric('')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-semibold">+{empresaData.metrics.visualitzacions.growth}%</span>
                  </div>
                  <button 
                    className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'views' ? 'bg-emerald-100 text-emerald-600' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setShowTooltip(showTooltip === 'views' ? '' : 'views')}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.visualitzacions.thisMonth.toLocaleString()}</h3>
                <p className="text-sm text-slate-500">Visualitzacions aquest mes</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">vs mes anterior</p>
              </div>
              
              {/* Botón Ver detalles en hover */}
              <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-emerald-700 flex items-center gap-1`}>
                Ver detalles
                <ExternalLink className="w-3 h-3" />
              </button>
              
              {/* Tooltip */}
              {showTooltip === 'views' && (
                <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
                  <div className="font-medium mb-1">Visualitzacions</div>
                  <div>Nombre total de visualitzacions de les vostres ofertes de feina durant aquest mes. Inclou visualitzacions úniques i repetides.</div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>

            {/* Clicks i Conversió - Mejorada */}
            <div 
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              onMouseEnter={() => setHoveredMetric('clicks')}
              onMouseLeave={() => setHoveredMetric('')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MousePointer className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-semibold">+{empresaData.metrics.clicks.growth}%</span>
                  </div>
                  <button 
                    className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'clicks' ? 'bg-purple-100 text-purple-600' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setShowTooltip(showTooltip === 'clicks' ? '' : 'clicks')}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.clicks.total.toLocaleString()}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-500">Clicks</p>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
                    <Target className="w-3 h-3 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-600">{empresaData.metrics.clicks.conversion}% conversió</span>
                  </div>
                </div>
                <p className="text-xs text-purple-600 font-medium mt-1">vs mes anterior</p>
              </div>
              
              {/* Botón Ver detalles en hover */}
              <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-700 flex items-center gap-1`}>
                Ver detalles
                <ExternalLink className="w-3 h-3" />
              </button>
              
              {/* Tooltip */}
              {showTooltip === 'clicks' && (
                <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
                  <div className="font-medium mb-1">Clicks i Conversió</div>
                  <div>Nombre de clicks rebuts a les vostres ofertes i percentatge de conversió (candidatures completades).</div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>

            {/* Comunitats - Mejorada */}
            <div 
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              onMouseEnter={() => setHoveredMetric('comunitats')}
              onMouseLeave={() => setHoveredMetric('')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{empresaData.metrics.comunitats.actives}/{empresaData.metrics.comunitats.total}</span>
                  <button 
                    className={`p-1.5 rounded-lg transition-all ${hoveredMetric === 'comunitats' ? 'bg-orange-100 text-orange-600' : 'bg-transparent text-slate-400'}`}
                    onClick={() => setShowTooltip(showTooltip === 'comunitats' ? '' : 'comunitats')}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{empresaData.metrics.comunitats.actives}</h3>
                <p className="text-sm text-slate-500">Comunitats Actives</p>
                <p className="text-xs text-slate-400 mt-1">de {empresaData.metrics.comunitats.total} disponibles</p>
              </div>
              
              {/* Botón Ver detalles en hover */}
              <button className={`absolute bottom-4 right-4 px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-orange-700 flex items-center gap-1`}>
                Ver detalles
                <ExternalLink className="w-3 h-3" />
              </button>
              
              {/* Tooltip */}
              {showTooltip === 'comunitats' && (
                <div className="absolute top-16 left-4 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-10 max-w-64">
                  <div className="font-medium mb-1">Comunitats Actives</div>
                  <div>Nombre de comunitats autònomes on teniu ofertes actives. Cada comunitat té la seva pròpia audiència i regulacions.</div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Status Mejorado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Pipeline d'Aprovació</h3>
                <button 
                  onClick={refreshData}
                  className={`p-2 rounded-lg transition-all ${refreshing ? 'animate-spin' : 'hover:bg-slate-100'}`}
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              {/* Línea de progreso horizontal */}
              <div className="relative mb-8">
                <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
                <div className="absolute top-8 left-0 h-1 bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500 rounded-full" style={{width: '75%'}}></div>
                <div className="relative grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-yellow-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{empresaData.metrics.pipeline.pending}</div>
                    <div className="text-sm text-slate-500">Pendents</div>
                    <div className="text-xs text-yellow-600 font-medium mt-1">~2 dies</div>
                    <button className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full hover:bg-yellow-200 transition-colors">
                      Ver Pendents
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{empresaData.metrics.pipeline.inReview}</div>
                    <div className="text-sm text-slate-500">En Revisió</div>
                    <div className="text-xs text-blue-600 font-medium mt-1">~1 dia</div>
                    <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
                      Revisar
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{empresaData.metrics.pipeline.approved}</div>
                    <div className="text-sm text-slate-500">Aprovades</div>
                    <div className="text-xs text-green-600 font-medium mt-1">Aquest mes</div>
                    <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors">
                      Ver Aprovades
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-300 rounded-xl flex items-center justify-center mx-auto mb-3 relative z-10">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{empresaData.metrics.pipeline.rejected}</div>
                    <div className="text-sm text-slate-500">Rebutjades</div>
                    <div className="text-xs text-red-600 font-medium mt-1">Per revisar</div>
                    <button className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 transition-colors">
                      Ver Motius
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notificaciones Mejoradas */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Notificacions</h3>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {notifications}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {empresaData.alerts.map((alert, idx) => (
                  <div key={idx} className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    alert.type === 'success' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                    alert.type === 'warning' ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' :
                    'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}>
                    <div className="flex items-start gap-3">
                      {/* Iconos de categoría */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.type === 'success' ? 'bg-green-500' :
                        alert.type === 'warning' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {alert.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : alert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-white" />
                        ) : (
                          <Bell className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 text-sm mb-1">{alert.title}</div>
                        <div className="text-slate-600 text-xs leading-relaxed">{alert.message}</div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(alert.timestamp)}</span>
                          </div>
                          
                          {/* Botones de acción directa */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {alert.type === 'success' && (
                              <button className="px-2 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors">
                                Veure Oferta
                              </button>
                            )}
                            {alert.type === 'warning' && (
                              <button className="px-2 py-1 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition-colors">
                                Revisar Límit
                              </button>
                            )}
                            {alert.type === 'info' && (
                              <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                                Descobrir
                              </button>
                            )}
                            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer de notificaciones */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <button className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
                  Veure totes les notificacions
                  <ArrowRight className="w-4 h-4 inline-block ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Gráfico de Rendimiento Avanzado */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Rendiment dels Últims 30 Dies</h3>
                <p className="text-sm text-slate-500 mt-1">Comparativa de visualitzacions i clicks</p>
              </div>
              
              {/* Selector de período elegante */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {['7D', '30D', '90D', '1Y'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        chartPeriod === period
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                
                {/* Controles del gráfico */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-600">Visualitzacions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-600">Clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Área del gráfico mejorada */}
            <div className="relative">
              <div className="h-80 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200/50 overflow-hidden">
                
                {/* Grid de fondo */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: `
                      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 32px'
                  }}></div>
                </div>
                
                {/* Simulación de líneas de datos */}
                <div className="relative h-full p-4">
                  {/* Línea de visualizaciones (verde) */}
                  <svg className="absolute inset-4 w-full h-full" style={{width: 'calc(100% - 32px)', height: 'calc(100% - 32px)'}}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
                      </linearGradient>
                      <linearGradient id="clicksGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Área sombreada para visualizaciones */}
                    <path
                      d="M 0 180 Q 60 140 120 160 T 240 120 T 360 140 L 360 250 L 0 250 Z"
                      fill="url(#viewsGradient)"
                    />
                    
                    {/* Área sombreada para clicks */}
                    <path
                      d="M 0 200 Q 60 180 120 190 T 240 160 T 360 180 L 360 250 L 0 250 Z"
                      fill="url(#clicksGradient)"
                    />
                    
                    {/* Línea de visualizaciones */}
                    <path
                      d="M 0 180 Q 60 140 120 160 T 240 120 T 360 140"
                      stroke="#10b981"
                      strokeWidth="3"
                      fill="none"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Línea de clicks */}
                    <path
                      d="M 0 200 Q 60 180 120 190 T 240 160 T 360 180"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      fill="none"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Línea de tendencia predictiva punteada */}
                    <path
                      d="M 320 130 L 380 110"
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                  
                  {/* Tooltip interactivo (ejemplo) */}
                  <div className="absolute top-16 left-32 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 p-3 text-sm opacity-0 hover:opacity-100 transition-opacity">
                    <div className="font-medium text-slate-800 mb-1">15 Nov 2024</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-slate-600">Visualitzacions: 1,247</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-600">Clicks: 89</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Indicadores de hover points */}
                <div className="absolute top-20 left-8 w-3 h-3 bg-emerald-500 rounded-full shadow-lg animate-pulse"></div>
                <div className="absolute top-24 left-8 w-3 h-3 bg-purple-500 rounded-full shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Trend</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-700">+23%</div>
                  <div className="text-xs text-emerald-600">vs período anterior</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-medium">CTR Promedio</span>
                  </div>
                  <div className="text-lg font-bold text-purple-700">7.2%</div>
                  <div className="text-xs text-purple-600">aquest període</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-medium">Peak</span>
                  </div>
                  <div className="text-lg font-bold text-blue-700">1,847</div>
                  <div className="text-xs text-blue-600">millor dia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nuevos Widgets Premium */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Widget Próxima Renovación */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 border border-amber-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400/20 rounded-full translate-y-6 -translate-x-6"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Pròxima Renovació</h3>
                    <p className="text-xs text-amber-700">{empresaData.empresa.plan}</p>
                  </div>
                </div>
                
                {/* Countdown elegante */}
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-slate-800 mb-1">23 dies</div>
                  <div className="text-xs text-slate-600">fins a la renovació automàtica</div>
                </div>
                
                {/* Barra de progreso circular simulada */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent" style={{transform: 'rotate(270deg)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-700">76%</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all">
                  Gestionar Pla
                </button>
              </div>
            </div>

            {/* Panel Sugerencias IA */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-6 border border-violet-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-400/20 rounded-full translate-y-8 -translate-x-8"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Suggeriments IA</h3>
                    <p className="text-xs text-violet-700">Optimització proactiva</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-white/70 rounded-lg border border-violet-200/50">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="text-xs font-medium text-slate-800">Millor rendiment</div>
                        <div className="text-xs text-slate-600 mt-1">Publiqueu entre 10-12h per +34% visibilitat</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/70 rounded-lg border border-violet-200/50">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="text-xs font-medium text-slate-800">Nou segment</div>
                        <div className="text-xs text-slate-600 mt-1">Exploreu perfils júnior a Euskadi</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all">
                  Veure Tots els Tips
                </button>
              </div>
            </div>

            {/* Acceso Gestor Prominente */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl p-6 border border-emerald-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-22 h-22 bg-emerald-400/20 rounded-full -translate-y-9 translate-x-9"></div>
              <div className="absolute bottom-0 left-0 w-18 h-18 bg-teal-400/20 rounded-full translate-y-7 -translate-x-7"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Gestor Comercial</h3>
                    <p className="text-xs text-emerald-700">Suport personalitzat</p>
                  </div>
                </div>
                
                {/* Info del gestor */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">MG</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{empresaData.empresa.gestorComercial.nombre}</div>
                    <div className="text-xs text-slate-600">{empresaData.empresa.gestorComercial.email}</div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>Disponible ara</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    Chat
                  </button>
                  <button className="bg-white text-emerald-700 text-xs font-semibold py-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Cita
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
          
          {/* Perfil Empresa */}
          {activeSection === 'perfil' && <PerfilEmpresa />}
          
          {/* Grups Ocults */}
          {activeSection === 'grups' && <GrupsOcults />}
          
          {/* Gestió d'Ofertes */}
          {activeSection === 'ofertes' && <GestioOfertes />}
          
          {/* Analytics i Informes */}
          {activeSection === 'analytics' && <Analytics />}
          
          {/* Centre de Comunicació */}
          {activeSection === 'comunicacio' && <CentreComunicacio />}
          
          {/* Configuració IA */}
          {activeSection === 'ia' && <ConfiguracioIA />}
          
          {activeSection === 'recursos' && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Recursos i Suport</h2>
              <p className="text-slate-600">Documentació, tutorials i suport tècnic especialitzat</p>
              <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Component en desenvolupament</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* AI Chat Floating */}
      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <Bot className="w-8 h-8" />
        </button>
      )}

      {/* AI Chat Panel */}
      {showAIChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 z-50">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Assessor Comercial IA</div>
                    <div className="text-xs opacity-90">Especialista en empreses col·laboradores</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                  <p className="text-sm font-medium text-slate-800">👋 Hola! Soc el vostre assessor comercial IA.</p>
                  <p className="text-xs text-slate-600 mt-2">
                    Puc ajudar-vos amb optimització d'ofertes, anàlisi de rendiment i estratègies per millorar la vostra presència a La Pública.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/50">
                  <div className="text-xs font-medium text-blue-700 mb-1">💡 Recomanació</div>
                  <div className="text-sm text-blue-800">
                    Les vostres ofertes tenen un 23% més de clicks aquest mes. Considereu incrementar el pressupost en les comunitats amb millor rendiment.
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-xl border border-green-200/50">
                  <div className="text-xs font-medium text-green-700 mb-1">✨ Oportunitat</div>
                  <div className="text-sm text-green-800">
                    Catalunya i Madrid mostren alta demanda per perfils tech. Ideal per promocionar ofertes senior.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200/60">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Pregunteu sobre les vostres mètriques..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}