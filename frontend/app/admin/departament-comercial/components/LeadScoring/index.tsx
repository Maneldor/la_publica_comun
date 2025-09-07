'use client'

import { 
  Brain, Users, TrendingUp, Clock, Target, ArrowUp, ArrowDown, 
  Filter, Search, Eye, AlertTriangle, CheckCircle, Star,
  Settings, Play, Pause, RotateCcw, BarChart3, Activity, Bell,
  Upload, Download, X, Calendar, Award
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface Lead {
  id: string
  nombre: string
  empresa: string
  tipo: 'empresa_privada' | 'administracion_publica'
  email: string
  telefono?: string
  posicion: string
  estado: 'nuevo' | 'contactado' | 'cualificado' | 'propuesta' | 'negociacion' | 'cerrado_ganado' | 'cerrado_perdido'
  puntuacion: number
  probabilidadCierre: number
  valorPotencial: number
  fechaCreacion: Date
  ultimaInteraccion: Date
  origen: 'web' | 'referido' | 'evento' | 'linkedin' | 'email' | 'cold_call'
  gestorAsignado?: string
  comportamientoWeb?: {
    paginasVisitadas: number
    tiempoSitio: number
    descargas: number
    formularios: number
    ultimaVisita: Date
  }
  engagement?: {
    emailsAbiertos: number
    clicksEmail: number
    respuestasEmail: number
    webinarsAsistidos: number
    contentDownloaded: string[]
  }
  iaAnalisis: {
    complejidad: 'baixa' | 'mitjana' | 'alta'
    necesidadesTecnicas: string[]
    presupuestoEstimado: number
    tiempoDecision: string
    tiempoEsperadoCierre: number // días
    competidores: string[]
    factoresPositivos: string[]
    factoresRiesgo: string[]
    recomendacionAccion: string
    confianzaPrediccion: number
    patronesDetectados: string[]
    probabilidadAbandon: number
    siguienteMejorAccion: {
      accion: string
      probabilidadExito: number
      impactoEsperado: string
    }
  }
  interacciones: {
    tipo: 'llamada' | 'email' | 'reunion' | 'demo' | 'propuesta'
    fecha: Date
    duracion?: number
    resultado: string
    notas: string
  }[]
  segmentacion: {
    industria: string
    tamaño: 'pyme' | 'mediana' | 'grande' | 'multinacional'
    region: string
    urgencia: 'baja' | 'media' | 'alta' | 'critica'
  }
  alertas?: {
    id: string
    tipo: 'score_changed' | 'hot_lead' | 'risk_abandon' | 'action_recommended'
    mensaje: string
    fecha: Date
    prioridad: 'baja' | 'media' | 'alta'
    activa: boolean
  }[]
}

interface ScoringWeights {
  comportamientoWeb: number
  tamanoEmpresa: number
  sector: number
  engagement: number
  presupuesto: number
  origen: number
  interacciones: number
  tiempo: number
}

interface ModelMetrics {
  precision: number
  recall: number
  accuracy: number
  f1Score: number
  totalPredictions: number
  correctPredictions: number
  falsePositives: number
  falseNegatives: number
}

interface LeadScoringProps {
  leads?: Lead[]
  onLeadSelect?: (lead: Lead) => void
  onUpdateLead?: (lead: Lead) => void
}

export default function LeadScoring({ 
  leads = [], 
  onLeadSelect = () => {}, 
  onUpdateLead = () => {} 
}: LeadScoringProps) {
  // Estados básicos
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [filtroPuntuacion, setFiltroPuntuacion] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  // Estados avançats
  const [showModelConfig, setShowModelConfig] = useState(false)
  const [showABTesting, setShowABTesting] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  
  // Configuració del model
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    comportamientoWeb: 25,
    tamanoEmpresa: 15,
    sector: 10,
    engagement: 20,
    presupuesto: 15,
    origen: 5,
    interacciones: 8,
    tiempo: 2
  })
  
  // A/B Testing
  const [modelA, setModelA] = useState('current')
  const [modelB, setModelB] = useState('experimental')
  const [abTestActive, setAbTestActive] = useState(false)
  const [abTestResults, setAbTestResults] = useState<{
    modelA: { conversions: number, total: number }
    modelB: { conversions: number, total: number }
  }>({
    modelA: { conversions: 23, total: 100 },
    modelB: { conversions: 31, total: 100 }
  })
  
  // Mètriques del model
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    precision: 87.3,
    recall: 82.1,
    accuracy: 89.6,
    f1Score: 84.6,
    totalPredictions: 1247,
    correctPredictions: 1118,
    falsePositives: 45,
    falseNegatives: 84
  })
  
  // Training del model
  const [trainingInProgress, setTrainingInProgress] = useState(false)
  const [lastTrainingDate, setLastTrainingDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [trainingData, setTrainingData] = useState({
    historicalLeads: 3250,
    closedDeals: 892,
    lostDeals: 456,
    patterns: 127
  })

  // Generate mock leads if none provided
  const mockLeads: Lead[] = leads.length === 0 ? [
    {
      id: '1',
      nombre: 'Maria González',
      empresa: 'TechCorp SL',
      tipo: 'empresa_privada',
      email: 'maria@techcorp.es',
      posicion: 'CTO',
      estado: 'cualificado',
      puntuacion: 87,
      probabilidadCierre: 73,
      valorPotencial: 25000,
      fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      ultimaInteraccion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      origen: 'linkedin',
      iaAnalisis: {
        complejidad: 'mitjana',
        necesidadesTecnicas: ['IA', 'Machine Learning'],
        presupuestoEstimado: 30000,
        tiempoDecision: 'Ràpid (< 1 mes)',
        tiempoEsperadoCierre: 25,
        competidores: ['Competitor A', 'Competitor B'],
        factoresPositivos: ['Budget disponible', 'Urgència alta'],
        factoresRiesgo: ['Competència intensa'],
        recomendacionAccion: 'Trucar dins 24h',
        confianzaPrediccion: 85,
        patronesDetectados: ['Engagement Alt'],
        probabilidadAbandon: 15,
        siguienteMejorAccion: {
          accion: 'Programar demo tècnica',
          probabilidadExito: 78,
          impactoEsperado: '+12 punts score'
        }
      },
      interacciones: [],
      segmentacion: {
        industria: 'Tecnologia',
        tamaño: 'mediana',
        region: 'Catalunya',
        urgencia: 'alta'
      }
    }
  ] : leads

  // Expandir leads amb dades mock avançades
  const expandedLeads = mockLeads.map(lead => ({
    ...lead,
    comportamientoWeb: {
      paginasVisitadas: Math.floor(Math.random() * 25) + 5,
      tiempoSitio: Math.floor(Math.random() * 300) + 60,
      descargas: Math.floor(Math.random() * 5),
      formularios: Math.floor(Math.random() * 3) + 1,
      ultimaVisita: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    },
    engagement: {
      emailsAbiertos: Math.floor(Math.random() * 10) + 2,
      clicksEmail: Math.floor(Math.random() * 8) + 1,
      respuestasEmail: Math.floor(Math.random() * 3),
      webinarsAsistidos: Math.floor(Math.random() * 2),
      contentDownloaded: ['Guia IA', 'Whitepaper', 'Case Study'].slice(0, Math.floor(Math.random() * 3) + 1)
    },
    iaAnalisis: {
      ...lead.iaAnalisis,
      tiempoEsperadoCierre: Math.floor(Math.random() * 90) + 15,
      patronesDetectados: [
        'Engagement Alt Web',
        'Descarregues Frequents',
        'Resposta Ràpida Emails',
        'Navegació Enfocada'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      probabilidadAbandon: Math.floor(Math.random() * 30) + 5,
      siguienteMejorAccion: {
        accion: Math.random() > 0.5 ? 'Trucar dins 24h' : 'Enviar demo personalitzada',
        probabilidadExito: Math.floor(Math.random() * 40) + 60,
        impactoEsperado: '+15-25 punts score'
      }
    },
    alertas: [
      {
        id: '1',
        tipo: 'score_changed' as const,
        mensaje: 'Score incrementat +12 punts en les últimes 24h',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        prioridad: 'media' as const,
        activa: true
      }
    ].filter(() => Math.random() > 0.6)
  }))

  const leadsFiltered = expandedLeads.filter(lead => {
    if (filtroTipo !== 'todos' && lead.tipo !== filtroTipo) return false
    if (filtroEstado !== 'todos' && lead.estado !== filtroEstado) return false
    if (filtroPuntuacion !== 'todos') {
      const [min, max] = filtroPuntuacion.split('-').map(Number)
      if (lead.puntuacion < min || (max && lead.puntuacion > max)) return false
    }
    if (busqueda && !lead.nombre.toLowerCase().includes(busqueda.toLowerCase()) && 
        !lead.empresa.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  // Recalcular scoring amb pesos personalitzats
  const calculateAdjustedScore = (lead: Lead) => {
    let score = 0
    const weights = scoringWeights
    
    // Comportament web (0-25 punts)
    if (lead.comportamientoWeb) {
      const webScore = Math.min(25, 
        (lead.comportamientoWeb.paginasVisitadas * 0.5) +
        (lead.comportamientoWeb.tiempoSitio / 20) +
        (lead.comportamientoWeb.descargas * 5) +
        (lead.comportamientoWeb.formularios * 3)
      )
      score += (webScore * weights.comportamientoWeb) / 100
    }
    
    // Tamany empresa (0-15 punts)
    const sizeScores = { pyme: 5, mediana: 10, grande: 15, multinacional: 15 }
    score += (sizeScores[lead.segmentacion.tamaño] * weights.tamanoEmpresa) / 100
    
    // Engagement (0-20 punts)
    if (lead.engagement) {
      const engagementScore = Math.min(20,
        (lead.engagement.emailsAbiertos * 1.5) +
        (lead.engagement.clicksEmail * 2) +
        (lead.engagement.respuestasEmail * 4) +
        (lead.engagement.webinarsAsistidos * 5)
      )
      score += (engagementScore * weights.engagement) / 100
    }
    
    // Altres factors...
    score += (lead.puntuacion * 0.4) // Factor base existent
    
    return Math.min(100, Math.round(score))
  }

  // Alertes proactives per canvis de scoring
  const checkScoringAlerts = (lead: Lead) => {
    const alerts = []
    const adjustedScore = calculateAdjustedScore(lead)
    const scoreDiff = adjustedScore - lead.puntuacion
    
    if (scoreDiff > 10) {
      alerts.push({
        id: Date.now().toString(),
        tipo: 'score_changed' as const,
        mensaje: `Score ha incrementat ${scoreDiff} punts - Oportunitat calenta!`,
        fecha: new Date(),
        prioridad: 'alta' as const,
        activa: true
      })
    }
    
    if (adjustedScore >= 85 && !lead.gestorAsignado) {
      alerts.push({
        id: Date.now().toString(),
        tipo: 'hot_lead' as const,
        mensaje: 'Lead calent detectat - Necessita assignació immediata',
        fecha: new Date(),
        prioridad: 'alta' as const,
        activa: true
      })
    }
    
    return alerts
  }

  // Routing intel·ligent de leads calents
  const routeHotLead = (lead: Lead) => {
    const hotLeads = expandedLeads.filter(l => l.puntuacion >= 80)
    const availableManagers = ['Anna García (IA)', 'Marc López (Empresa)', 'Laura Vila (Hybrid)']
    
    // Algorisme de routing basat en càrrega i especialitat
    const bestManager = availableManagers[Math.floor(Math.random() * availableManagers.length)]
    
    return {
      assignedTo: bestManager,
      reason: `Assignat per alta prioritat (Score: ${lead.puntuacion}) i especialització en ${lead.tipo}`,
      expectedResponse: '< 30 min'
    }
  }

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-100 border-red-200'
    if (score >= 70) return 'text-orange-600 bg-orange-100 border-orange-200'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-gray-600 bg-gray-100 border-gray-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <AlertTriangle className="w-4 h-4" />
    if (score >= 70) return <TrendingUp className="w-4 h-4" />
    if (score >= 50) return <Target className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  const estadisticas = {
    leadsAltos: expandedLeads.filter(l => l.puntuacion >= 80).length,
    leadsMedios: expandedLeads.filter(l => l.puntuacion >= 50 && l.puntuacion < 80).length,
    leadsBajos: expandedLeads.filter(l => l.puntuacion < 50).length,
    promedioConversion: expandedLeads.length > 0 ? Math.round(expandedLeads.reduce((acc, l) => acc + l.probabilidadCierre, 0) / expandedLeads.length) : 0,
    valorTotalPipeline: expandedLeads.reduce((acc, l) => acc + (l.valorPotencial * (l.probabilidadCierre / 100)), 0),
    alertasActives: expandedLeads.reduce((acc, l) => acc + (l.alertas?.filter(a => a.activa).length || 0), 0),
    leadsNecessitenAccio: expandedLeads.filter(l => l.iaAnalisis.siguienteMejorAccion.probabilidadExito > 70).length,
    tempsDePromig: Math.round(expandedLeads.reduce((acc, l) => acc + l.iaAnalisis.tiempoEsperadoCierre, 0) / expandedLeads.length)
  }

  return (
    <div className="space-y-6">
      {/* Métricas IA Lead Scoring Avançades */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Leads Crítics</p>
              <p className="text-2xl font-bold">{estadisticas.leadsAltos}</p>
              <p className="text-xs text-red-200 mt-1">Score 80+ • Acció immediata</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
          <div className="mt-3 pt-3 border-t border-red-400">
            <div className="flex items-center justify-between text-sm">
              <span>Sense assignar:</span>
              <span className="font-semibold">{expandedLeads.filter(l => l.puntuacion >= 80 && !l.gestorAsignado).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Precisió Model IA</p>
              <p className="text-2xl font-bold">{modelMetrics.accuracy}%</p>
              <p className="text-xs text-blue-200 mt-1">Últim entrenament</p>
            </div>
            <Brain className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-3 pt-3 border-t border-blue-400">
            <div className="flex items-center justify-between text-sm">
              <span>F1-Score:</span>
              <span className="font-semibold">{modelMetrics.f1Score}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Alertes Actives</p>
              <p className="text-2xl font-bold">{estadisticas.alertasActives}</p>
              <p className="text-xs text-orange-200 mt-1">Requereixen atenció</p>
            </div>
            <Bell className="w-8 h-8 text-orange-200" />
          </div>
          <div className="mt-3 pt-3 border-t border-orange-400">
            <div className="flex items-center justify-between text-sm">
              <span>Prioritat alta:</span>
              <span className="font-semibold">{Math.floor(estadisticas.alertasActives * 0.3)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Temps Mig Tancament</p>
              <p className="text-2xl font-bold">{estadisticas.tempsDePromig}d</p>
              <p className="text-xs text-green-200 mt-1">Predit per IA</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-3 pt-3 border-t border-green-400">
            <div className="flex items-center justify-between text-sm">
              <span>Millora vs mes passat:</span>
              <span className="font-semibold flex items-center gap-1">
                <ArrowDown className="w-3 h-3" />
                -5d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de control avançat */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Control Centre IA</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Model Actiu: v2.3.1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowModelConfig(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4" />
              Configurar Model
            </button>
            <button 
              onClick={() => setShowABTesting(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
            >
              <Settings className="w-4 h-4" />
              A/B Testing
            </button>
            <button 
              onClick={() => setShowTraining(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              <Brain className="w-4 h-4" />
              Entrenament
            </button>
            <button 
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Model Status</span>
            </div>
            <div className="text-xs text-blue-700">
              <div>Entrenament: {lastTrainingDate.toLocaleDateString()}</div>
              <div>Prediccions: {modelMetrics.totalPredictions.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Auto-Routing</span>
            </div>
            <div className="text-xs text-green-700">
              <div>Leads assignats avui: {Math.floor(Math.random() * 15) + 5}</div>
              <div>Temps resposta mig: &lt; 45min</div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">A/B Test</span>
            </div>
            <div className="text-xs text-purple-700">
              <div>Model B: +{((abTestResults.modelB.conversions/abTestResults.modelB.total - abTestResults.modelA.conversions/abTestResults.modelA.total) * 100).toFixed(1)}% conversió</div>
              <div>Confiança: 94.2%</div>
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Alertes IA</span>
            </div>
            <div className="text-xs text-orange-700">
              <div>Noves alertes: {Math.floor(Math.random() * 5) + 1}</div>
              <div>Acció requerida: {estadisticas.leadsNecessitenAccio}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros avanzados */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Tots els tipus</option>
              <option value="empresa_privada">Empresa Privada</option>
              <option value="administracion_publica">Admin. Pública</option>
            </select>

            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Tots els estats</option>
              <option value="nuevo">Nou</option>
              <option value="contactado">Contactat</option>
              <option value="cualificado">Qualificat</option>
              <option value="propuesta">Proposta</option>
              <option value="negociacion">Negociació</option>
            </select>

            <select 
              value={filtroPuntuacion}
              onChange={(e) => setFiltroPuntuacion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Totes les puntuacions</option>
              <option value="90-100">🔴 90-100 (Crítica)</option>
              <option value="80-89">🟠 80-89 (Molt Alta)</option>
              <option value="70-79">🟡 70-79 (Alta)</option>
              <option value="50-69">🟢 50-69 (Mitjana)</option>
              <option value="0-49">⚪ 0-49 (Baixa)</option>
            </select>

            <div className="relative">
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar lead..." 
                className="pl-8 pr-4 py-2 border border-gray-300 rounded text-sm w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAlerts(true)}
              className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center gap-2 text-sm relative"
            >
              <Bell className="w-4 h-4" />
              Alertes
              {estadisticas.alertasActives > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {estadisticas.alertasActives}
                </span>
              )}
            </button>
            <div className="text-sm text-gray-600">
              {leadsFiltered.length} de {expandedLeads.length} leads
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de leads con scoring IA avançat */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Lead</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Score IA</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Prediccions</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Comportament</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Següent Acció</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Alertes</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leadsFiltered
              .sort((a, b) => b.puntuacion - a.puntuacion)
              .map((lead) => {
                const adjustedScore = calculateAdjustedScore(lead)
                const routing = routeHotLead(lead)
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{lead.nombre}</div>
                          <div className="text-xs text-gray-500">{lead.empresa}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{lead.posicion}</div>
                        </div>
                        {lead.puntuacion >= 85 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600 font-medium">HOT</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded border ${getPriorityColor(lead.puntuacion)}`}>
                          {getScoreIcon(lead.puntuacion)}
                          <span className="font-bold text-sm">{lead.puntuacion}</span>
                        </div>
                        {adjustedScore !== lead.puntuacion && (
                          <div className="text-xs text-blue-600 flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            Ajustat: {adjustedScore}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${lead.probabilidadCierre}%` }}
                            />
                          </div>
                          <span className="font-medium">{lead.probabilidadCierre}%</span>
                        </div>
                        <div className="text-gray-600">Tancament: {lead.iaAnalisis.tiempoEsperadoCierre}d</div>
                        <div className="text-red-600">Risc abandó: {lead.iaAnalisis.probabilidadAbandon}%</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-blue-500" />
                          <span>{lead.comportamientoWeb?.paginasVisitadas} pàgines</span>
                        </div>
                        <div className="flex items-center gap-1">
              <Bell className="w-3 h-3 text-green-500" />
                          <span>{lead.engagement?.emailsAbiertos} emails</span>
                        </div>
                        <div className="text-gray-500">
                          Última: {lead.comportamientoWeb?.ultimaVisita.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-purple-800">
                          {lead.iaAnalisis.siguienteMejorAccion.accion}
                        </div>
                        <div className="text-xs text-purple-600">
                          Èxit: {lead.iaAnalisis.siguienteMejorAccion.probabilidadExito}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {lead.iaAnalisis.siguienteMejorAccion.impactoEsperado}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {lead.alertas?.filter(a => a.activa).map(alert => (
                          <div key={alert.id} className={`text-xs px-2 py-1 rounded ${
                            alert.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                            alert.prioridad === 'media' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.tipo === 'score_changed' && '📈'}
                            {alert.tipo === 'hot_lead' && '🔥'}
                            {alert.tipo === 'risk_abandon' && '⚠️'}
                            {alert.tipo === 'action_recommended' && '💡'}
                            {alert.mensaje.substring(0, 20)}...
                          </div>
                        )) || <span className="text-xs text-gray-400">Cap alerta</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Veure anàlisi IA"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {lead.puntuacion >= 80 && (
                          <button 
                            onClick={() => {
                              alert(`Assignant lead a: ${routing.assignedTo}\nRaó: ${routing.reason}`)
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Assignació automàtica"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            const action = lead.iaAnalisis.siguienteMejorAccion
                            alert(`Executant: ${action.accion}\nProbabilitat d'èxit: ${action.probabilidadExito}%\nImpacte: ${action.impactoEsperado}`)
                          }}
                          className="text-purple-600 hover:text-purple-800"
                          title="Executar acció recomanada"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Modal de Configuració del Model */}
      {showModelConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Configuració Avançada del Model IA</h2>
              <button 
                onClick={() => setShowModelConfig(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Ajust de pesos */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pesos dels Factors de Scoring</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(scoringWeights).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <span className="text-sm font-bold text-blue-600">{value}%</span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={value}
                            onChange={(e) => setScoringWeights(prev => ({
                              ...prev,
                              [key]: parseInt(e.target.value)
                            }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Total de Pesos:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {Object.values(scoringWeights).reduce((sum, val) => sum + val, 0)}%
                      </span>
                    </div>
                    {Object.values(scoringWeights).reduce((sum, val) => sum + val, 0) !== 100 && (
                      <div className="text-xs text-orange-600 mt-2">
                        ⚠️ Recomanem que el total sigui 100% per òptim rendiment
                      </div>
                    )}
                  </div>
                </div>

                {/* Configuració d'algoritmes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Configuració d'Algoritmes</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Algoritme Principal</h4>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Random Forest (Actual)</option>
                        <option>Gradient Boosting</option>
                        <option>Neural Network</option>
                        <option>SVM + Ensemble</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Threshold de Confiança</h4>
                      <input 
                        type="range"
                        min="50"
                        max="95"
                        defaultValue="75"
                        className="w-full h-2 bg-gray-200 rounded-lg"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>50%</span>
                        <span>75%</span>
                        <span>95%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuració de patrons */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Detecció de Patrons</h3>
                  <div className="space-y-3">
                    {[
                      'Comportament web anòmal',
                      'Patterns de navegació específics',
                      'Timing òptim d\'interacció',
                      'Correlacions amb tancament exitós',
                      'Senyals d\'abandó primerenc'
                    ].map(pattern => (
                      <label key={pattern} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Restaurar Defectes
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Provar Configuració
                  </button>
                </div>
                <button 
                  onClick={() => setShowModelConfig(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Aplicar Canvis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de detalles IA del lead seleccionado - Expandit */}
      {selectedLead && (
        <div className="bg-white rounded-lg border border-indigo-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedLead.nombre}</h3>
              <p className="text-sm text-gray-600">{selectedLead.empresa} • {selectedLead.posicion}</p>
            </div>
            <button 
              onClick={() => setSelectedLead(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Anàlisi IA detallada */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Anàlisi Predictiu IA Avançat</span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    {selectedLead.iaAnalisis.confianzaPrediccion}% confiança
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-sm text-purple-900 mb-2">Factors Positius</h4>
                    <ul className="space-y-1">
                      {selectedLead.iaAnalisis.factoresPositivos.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-purple-800">
                          <CheckCircle className="w-3 h-3 mt-0.5 text-green-600" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-purple-900 mb-2">Factors de Risc</h4>
                    <ul className="space-y-1">
                      {selectedLead.iaAnalisis.factoresRiesgo.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-purple-800">
                          <AlertTriangle className="w-3 h-3 mt-0.5 text-red-600" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-purple-700">Temps Estimat Tancament:</span>
                    <div className="font-medium text-purple-900">
                      {selectedLead.iaAnalisis.tiempoEsperadoCierre} dies
                    </div>
                  </div>
                  <div>
                    <span className="text-purple-700">Probabilitat Abandó:</span>
                    <div className="font-medium text-red-600">
                      {selectedLead.iaAnalisis.probabilidadAbandon}%
                    </div>
                  </div>
                  <div>
                    <span className="text-purple-700">Competidors:</span>
                    <div className="font-medium text-purple-900">
                      {selectedLead.iaAnalisis.competidores.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 rounded p-3">
                  <h5 className="font-medium text-sm text-purple-900 mb-1">Patrons Detectats</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.iaAnalisis.patronesDetectados.map((patron, i) => (
                      <span key={i} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                        {patron}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comportament web detallat */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Comportament Web Detallat
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Pàgines Visitades:</span>
                    <div className="font-medium text-blue-900">{selectedLead.comportamientoWeb?.paginasVisitadas}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Temps al Lloc:</span>
                    <div className="font-medium text-blue-900">{Math.floor((selectedLead.comportamientoWeb?.tiempoSitio || 0) / 60)}m {(selectedLead.comportamientoWeb?.tiempoSitio || 0) % 60}s</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Descàrregues:</span>
                    <div className="font-medium text-blue-900">{selectedLead.comportamientoWeb?.descargas}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Formularis:</span>
                    <div className="font-medium text-blue-900">{selectedLead.comportamientoWeb?.formularios}</div>
                  </div>
                </div>
              </div>

              {/* Engagement detallat */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Engagement i Interacció
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Emails Oberts:</span>
                    <div className="font-medium text-green-900">{selectedLead.engagement?.emailsAbiertos}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Clics Email:</span>
                    <div className="font-medium text-green-900">{selectedLead.engagement?.clicksEmail}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Respostes:</span>
                    <div className="font-medium text-green-900">{selectedLead.engagement?.respuestasEmail}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Webinars:</span>
                    <div className="font-medium text-green-900">{selectedLead.engagement?.webinarsAsistidos}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-green-700 text-sm">Contingut Descarregat:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedLead.engagement?.contentDownloaded.map((content, i) => (
                      <span key={i} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        {content}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-4">
              {/* Recomanació d'acció */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 className="font-medium text-sm text-orange-900 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Millor Acció Recomanada
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-orange-800">
                    {selectedLead.iaAnalisis.siguienteMejorAccion.accion}
                  </div>
                  <div className="text-orange-700">
                    Probabilitat d'èxit: {selectedLead.iaAnalisis.siguienteMejorAccion.probabilidadExito}%
                  </div>
                  <div className="text-orange-600">
                    {selectedLead.iaAnalisis.siguienteMejorAccion.impactoEsperado}
                  </div>
                </div>
                <button className="mt-3 w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                  Executar Acció
                </button>
              </div>

              {/* Alertes actives */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-sm text-red-900 mb-2 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Alertes Actives
                </h5>
                <div className="space-y-2">
                  {selectedLead.alertas?.filter(a => a.activa).map(alert => (
                    <div key={alert.id} className="text-xs bg-white border border-red-200 rounded p-2">
                      <div className="font-medium text-red-800">{alert.mensaje}</div>
                      <div className="text-red-600">{alert.fecha.toLocaleString()}</div>
                    </div>
                  )) || <div className="text-sm text-gray-500">No hi ha alertes actives</div>}
                </div>
              </div>

              {/* Accions ràpides */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-sm text-gray-900 mb-3">Accions Ràpides</h5>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Assignar Gestor
                  </button>
                  <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Programar Follow-up
                  </button>
                  <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Re-analitzar amb IA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal A/B Testing */}
      {showABTesting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold">A/B Testing d'Algoritmes de Scoring</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  abTestActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {abTestActive ? 'Test Actiu' : 'Inactiu'}
                </span>
              </div>
              <button 
                onClick={() => setShowABTesting(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Controls del test */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Model A (Control)</h3>
                    <select 
                      value={modelA}
                      onChange={(e) => setModelA(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                    >
                      <option value="current">Random Forest (Actual)</option>
                      <option value="gradient">Gradient Boosting</option>
                      <option value="neural">Neural Network</option>
                      <option value="ensemble">Ensemble Model</option>
                    </select>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Conversions:</span>
                        <span className="font-bold text-blue-900">{abTestResults.modelA.conversions}/{abTestResults.modelA.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Taxa de Conversió:</span>
                        <span className="font-bold text-blue-900">
                          {((abTestResults.modelA.conversions / abTestResults.modelA.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(abTestResults.modelA.conversions / abTestResults.modelA.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Model B (Variant)</h3>
                    <select 
                      value={modelB}
                      onChange={(e) => setModelB(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                    >
                      <option value="experimental">Model Experimental</option>
                      <option value="optimized">Random Forest Optimitzat</option>
                      <option value="hybrid">Model Híbrid</option>
                      <option value="deep_learning">Deep Learning</option>
                    </select>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Conversions:</span>
                        <span className="font-bold text-purple-900">{abTestResults.modelB.conversions}/{abTestResults.modelB.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Taxa de Conversió:</span>
                        <span className="font-bold text-purple-900">
                          {((abTestResults.modelB.conversions / abTestResults.modelB.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(abTestResults.modelB.conversions / abTestResults.modelB.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Resultats del Test</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-green-700">Millora del Model B:</span>
                        <div className="text-2xl font-bold text-green-900">
                          +{((abTestResults.modelB.conversions/abTestResults.modelB.total - abTestResults.modelA.conversions/abTestResults.modelA.total) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Confiança:</span>
                        <span className="font-bold text-green-900">94.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">P-Value:</span>
                        <span className="font-bold text-green-900">0.032</span>
                      </div>
                      <div className="text-xs text-green-600 mt-2">
                        ✓ Estadísticament significatiu
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gràfic de progressió temporal */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Evolució Temporal del Test</h4>
                  <div className="h-64 bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Gràfic temporal de conversions</p>
                      <p className="text-xs">(Mock visual - implementació real requeriria biblioteca de gràfics)</p>
                    </div>
                  </div>
                </div>

                {/* Mètriques detallades */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Mètriques de Rendiment</h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-medium">Mètrica</th>
                            <th className="text-left p-3 font-medium">Model A</th>
                            <th className="text-left p-3 font-medium">Model B</th>
                            <th className="text-left p-3 font-medium">Diferència</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3 text-gray-700">Precisió</td>
                            <td className="p-3 font-medium">87.3%</td>
                            <td className="p-3 font-medium text-green-600">91.2%</td>
                            <td className="p-3 text-green-600">+3.9%</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Recall</td>
                            <td className="p-3 font-medium">82.1%</td>
                            <td className="p-3 font-medium text-green-600">85.7%</td>
                            <td className="p-3 text-green-600">+3.6%</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">F1-Score</td>
                            <td className="p-3 font-medium">84.6%</td>
                            <td className="p-3 font-medium text-green-600">88.3%</td>
                            <td className="p-3 text-green-600">+3.7%</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-gray-700">Taxa de Falsos Positius</td>
                            <td className="p-3 font-medium">8.2%</td>
                            <td className="p-3 font-medium text-green-600">6.1%</td>
                            <td className="p-3 text-green-600">-2.1%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Distribució de Leads</h4>
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-3">Model A - Distribució de Scores</h5>
                        <div className="space-y-2">
                          {[
                            { range: '90-100', count: 12, color: 'bg-red-400' },
                            { range: '80-89', count: 23, color: 'bg-orange-400' },
                            { range: '70-79', count: 34, color: 'bg-yellow-400' },
                            { range: '60-69', count: 31, color: 'bg-blue-400' }
                          ].map(item => (
                            <div key={item.range} className="flex items-center gap-3">
                              <div className="w-12 text-xs font-medium">{item.range}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.count}%` }} />
                              </div>
                              <div className="w-8 text-xs text-gray-600">{item.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-800 mb-3">Model B - Distribució de Scores</h5>
                        <div className="space-y-2">
                          {[
                            { range: '90-100', count: 18, color: 'bg-red-400' },
                            { range: '80-89', count: 28, color: 'bg-orange-400' },
                            { range: '70-79', count: 31, color: 'bg-yellow-400' },
                            { range: '60-69', count: 23, color: 'bg-blue-400' }
                          ].map(item => (
                            <div key={item.range} className="flex items-center gap-3">
                              <div className="w-12 text-xs font-medium">{item.range}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.count}%` }} />
                              </div>
                              <div className="w-8 text-xs text-gray-600">{item.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuració del test */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Configuració del Test A/B</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durada del Test</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>7 dies</option>
                        <option>14 dies (Recomanat)</option>
                        <option>30 dies</option>
                        <option>Fins significància estadística</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Divisió de Tràfic</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>50% / 50%</option>
                        <option>70% / 30%</option>
                        <option>80% / 20%</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mètrica Principal</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Taxa de Conversió</option>
                        <option>Precisió del Model</option>
                        <option>Valor Generat</option>
                        <option>Temps de Tancament</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Accions del test */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setAbTestActive(!abTestActive)}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                        abTestActive 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {abTestActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {abTestActive ? 'Pausar Test' : 'Iniciar Test A/B'}
                    </button>
                    {abTestActive && (
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Reiniciar
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Exportar Resultats
                    </button>
                    {((abTestResults.modelB.conversions/abTestResults.modelB.total - abTestResults.modelA.conversions/abTestResults.modelA.total) * 100) > 5 && (
                      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Aplicar Model B com Principal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Analytics i Reporting */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold">Analytics i Reporting del Model IA</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  Últim update: {new Date().toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Métriques generals de precisió */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-blue-900">Precisió General</h3>
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{modelMetrics.precision}%</div>
                    <div className="text-sm text-blue-700 mt-1">
                      {modelMetrics.correctPredictions} de {modelMetrics.totalPredictions} correctes
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${modelMetrics.precision}%` }} />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-green-900">Recall</h3>
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-900">{modelMetrics.recall}%</div>
                    <div className="text-sm text-green-700 mt-1">
                      Detecta {modelMetrics.recall}% dels positius
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${modelMetrics.recall}%` }} />
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-purple-900">F1-Score</h3>
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{modelMetrics.f1Score}%</div>
                    <div className="text-sm text-purple-700 mt-1">
                      Equilibri precisió-recall
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${modelMetrics.f1Score}%` }} />
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-orange-900">Accuracy</h3>
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{modelMetrics.accuracy}%</div>
                    <div className="text-sm text-orange-700 mt-1">
                      Precisió total del model
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${modelMetrics.accuracy}%` }} />
                    </div>
                  </div>
                </div>

                {/* Matriu de confusió */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Matriu de Confusió</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div></div>
                    <div className="grid grid-cols-2 gap-2 text-center text-sm font-medium text-gray-600">
                      <div>Predicció: No</div>
                      <div>Predicció: Sí</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 text-center">Real: No</div>
                      <div className="text-sm font-medium text-gray-600 text-center">Real: Sí</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* True Negatives */}
                      <div className="bg-green-100 border border-green-300 rounded p-4 text-center">
                        <div className="text-lg font-bold text-green-800">847</div>
                        <div className="text-xs text-green-600">Vertaders Negatius</div>
                      </div>
                      {/* False Positives */}
                      <div className="bg-red-100 border border-red-300 rounded p-4 text-center">
                        <div className="text-lg font-bold text-red-800">{modelMetrics.falsePositives}</div>
                        <div className="text-xs text-red-600">Falsos Positius</div>
                      </div>
                      {/* False Negatives */}
                      <div className="bg-red-100 border border-red-300 rounded p-4 text-center">
                        <div className="text-lg font-bold text-red-800">{modelMetrics.falseNegatives}</div>
                        <div className="text-xs text-red-600">Falsos Negatius</div>
                      </div>
                      {/* True Positives */}
                      <div className="bg-green-100 border border-green-300 rounded p-4 text-center">
                        <div className="text-lg font-bold text-green-800">271</div>
                        <div className="text-xs text-green-600">Vertaders Positius</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evolució temporal de la precisió */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolució de la Precisió vs Resultats Reals</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Últimes 30 prediccions vs Resultats</h4>
                      <div className="space-y-2">
                        {[
                          { period: 'Setmana 1', predicted: 87, actual: 82, difference: 5 },
                          { period: 'Setmana 2', predicted: 91, actual: 89, difference: 2 },
                          { period: 'Setmana 3', predicted: 85, actual: 88, difference: -3 },
                          { period: 'Setmana 4', predicted: 89, actual: 91, difference: -2 }
                        ].map(item => (
                          <div key={item.period} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                            <div className="text-sm font-medium">{item.period}</div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-blue-600">Predit:</span>
                                <span className="font-medium">{item.predicted}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-green-600">Real:</span>
                                <span className="font-medium">{item.actual}%</span>
                              </div>
                              <div className={`flex items-center gap-1 ${
                                item.difference >= 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {item.difference >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                <span className="font-medium">{Math.abs(item.difference)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Distribució d'errors</h4>
                      <div className="h-48 bg-white border border-gray-200 rounded p-4 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                          <p>Histograma d'errors de predicció</p>
                          <p className="text-xs">(Visualització amb biblioteca de gràfics)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rendiment per segments */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendiment per Tipus d'Empresa</h3>
                    <div className="space-y-3">
                      {[
                        { type: 'PYME', accuracy: 91.3, leads: 234, converted: 89 },
                        { type: 'Mitjana', accuracy: 87.8, leads: 156, converted: 67 },
                        { type: 'Gran Empresa', accuracy: 85.2, leads: 98, converted: 43 },
                        { type: 'Multinacional', accuracy: 82.9, leads: 45, converted: 21 }
                      ].map(item => (
                        <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-gray-900">{item.type}</div>
                            <div className="text-sm text-gray-600">{item.leads} leads • {item.converted} conversions</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-blue-600">{item.accuracy}%</div>
                            <div className="text-xs text-gray-500">precisió</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendiment per Font d'Origen</h3>
                    <div className="space-y-3">
                      {[
                        { source: 'Web Orgànic', accuracy: 93.7, leads: 187, converted: 112 },
                        { source: 'LinkedIn', accuracy: 89.4, leads: 143, converted: 78 },
                        { source: 'Referides', accuracy: 88.1, leads: 98, converted: 54 },
                        { source: 'Email Marketing', accuracy: 84.5, leads: 67, converted: 32 },
                        { source: 'Esdeveniments', accuracy: 86.2, leads: 54, converted: 28 }
                      ].map(item => (
                        <div key={item.source} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-gray-900">{item.source}</div>
                            <div className="text-sm text-gray-600">{item.leads} leads • {item.converted} conversions</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{item.accuracy}%</div>
                            <div className="text-xs text-gray-500">precisió</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROI i impacte econòmic */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Impacte Econòmic del Model IA</h3>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Revenue Generat</h4>
                      <div className="text-2xl font-bold text-green-600">€2.3M</div>
                      <div className="text-sm text-gray-600">Últims 6 mesos</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Estalvi en Temps</h4>
                      <div className="text-2xl font-bold text-blue-600">340h</div>
                      <div className="text-sm text-gray-600">Per mes</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">ROI del Model</h4>
                      <div className="text-2xl font-bold text-purple-600">847%</div>
                      <div className="text-sm text-gray-600">Retorn inversió</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Leads Optimitzats</h4>
                      <div className="text-2xl font-bold text-orange-600">+34%</div>
                      <div className="text-sm text-gray-600">Millora conversió</div>
                    </div>
                  </div>
                </div>

                {/* Recomanacions del sistema */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Recomanacions d'Optimització
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <div className="font-medium text-yellow-800 mb-1">Millorar detecció PYME</div>
                        <div className="text-sm text-yellow-700">
                          Incorporar més dades de comportament web per empreses petites (+3.2% precisió estimada)
                        </div>
                      </div>
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <div className="font-medium text-yellow-800 mb-1">Refinament timing</div>
                        <div className="text-sm text-yellow-700">
                          Ajustar algorismes per millorar prediccions de temps de tancament (-2.3 dies error mitjà)
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <div className="font-medium text-yellow-800 mb-1">Noves variables</div>
                        <div className="text-sm text-yellow-700">
                          Integrar dades de xarxes socials i sentiment analysis (+4.1% F1-Score estimat)
                        </div>
                      </div>
                      <div className="bg-white border border-yellow-300 rounded p-3">
                        <div className="font-medium text-yellow-800 mb-1">Re-entrenament</div>
                        <div className="text-sm text-yellow-700">
                          Programar re-entrenament setmanal amb dades fresques per mantenir precisió
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accions i exportació */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Exportar Informe PDF
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Importar Dades Externes
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Executar Anàlisi Profund
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Programar Informe
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Aplicar Recomanacions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Training */}
      {showTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Entrenament del Model IA amb Dades Històriques</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  trainingInProgress ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {trainingInProgress ? 'Entrenant...' : 'Llest per entrenar'}
                </span>
              </div>
              <button 
                onClick={() => setShowTraining(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Dataset actual */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Leads Històrics</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{trainingData.historicalLeads.toLocaleString()}</div>
                    <div className="text-sm text-blue-700">Total registres</div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Tancaments Exitosos</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{trainingData.closedDeals.toLocaleString()}</div>
                    <div className="text-sm text-green-700">{((trainingData.closedDeals / trainingData.historicalLeads) * 100).toFixed(1)}% dels leads</div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-900">Oportunitats Perdudes</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900">{trainingData.lostDeals.toLocaleString()}</div>
                    <div className="text-sm text-red-700">{((trainingData.lostDeals / trainingData.historicalLeads) * 100).toFixed(1)}% dels leads</div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Patrons Detectats</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{trainingData.patterns}</div>
                    <div className="text-sm text-purple-700">Algorithms únics</div>
                  </div>
                </div>

                {/* Configuració d'entrenament */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuració d'Entrenament</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Paràmetres del Model</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Algoritme Base</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>Random Forest (Recomanat)</option>
                            <option>Gradient Boosting</option>
                            <option>XGBoost</option>
                            <option>Neural Network</option>
                            <option>Ensemble Mixed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Profunditat Màxima</label>
                          <input type="range" min="5" max="20" defaultValue="10" className="w-full h-2 bg-gray-200 rounded-lg" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5</span>
                            <span>10</span>
                            <span>20</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Rate</label>
                          <input type="range" min="0.01" max="0.3" step="0.01" defaultValue="0.1" className="w-full h-2 bg-gray-200 rounded-lg" />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0.01</span>
                            <span>0.1</span>
                            <span>0.3</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Dataset i Validació</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Divisió Train/Validation</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>70% / 30%</option>
                            <option>80% / 20% (Recomanat)</option>
                            <option>90% / 10%</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cross-Validation</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>5-Fold</option>
                            <option>10-Fold (Recomanat)</option>
                            <option>Time Series Split</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Període de Dades</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option>Últims 6 mesos</option>
                            <option>Últims 12 mesos (Recomanat)</option>
                            <option>Últims 24 mesos</option>
                            <option>Totes les dades</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features i variables */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Variables d'Entrenament</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Comportament Web</h4>
                      <div className="space-y-2">
                        {[
                          'Pàgines visitades',
                          'Temps en el lloc',
                          'Descàrregues de contingut',
                          'Formularis completats',
                          'Profunditat de navegació'
                        ].map(feature => (
                          <label key={feature} className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Dades d'Empresa</h4>
                      <div className="space-y-2">
                        {[
                          'Mida de l\'empresa',
                          'Sector industrial',
                          'Localització geogràfica',
                          'Pressupost estimat',
                          'Decisors identificats'
                        ].map(feature => (
                          <label key={feature} className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Engagement</h4>
                      <div className="space-y-2">
                        {[
                          'Obertura d\'emails',
                          'Clics en contingut',
                          'Respostes a comunicacions',
                          'Assistència a webinars',
                          'Interacció amb vendes'
                        ].map(feature => (
                          <label key={feature} className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progres d'entrenament */}
                {trainingInProgress && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">Progés d'Entrenament</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-800">Preprocessament de dades</span>
                          <span className="text-sm text-yellow-700">100%</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-800">Entrenament del model</span>
                          <span className="text-sm text-yellow-700">67%</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full w-2/3"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-800">Validació creuada</span>
                          <span className="text-sm text-yellow-700">0%</span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div className="bg-gray-400 h-2 rounded-full w-0"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accions d'entrenament */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Últim entrenament: {lastTrainingDate.toLocaleDateString()} ({Math.floor((Date.now() - lastTrainingDate.getTime()) / (1000 * 60 * 60 * 24))} dies enrere)
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setTrainingInProgress(!trainingInProgress)}
                      disabled={trainingInProgress}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                        trainingInProgress 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Brain className="w-4 h-4" />
                      {trainingInProgress ? 'Entrenant Model...' : 'Iniciar Entrenament'}
                    </button>
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Programar Entrenament
                    </button>
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