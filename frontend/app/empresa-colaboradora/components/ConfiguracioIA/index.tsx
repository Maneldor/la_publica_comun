'use client'

import { useState, useEffect } from 'react'
import { useTema, useIdioma } from '../../../../hooks/useComunidad'
import {
  Sparkles,
  Cpu,
  MessageCircle,
  Zap,
  Sliders,
  BarChart3,
  Users,
  FileText,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  HelpCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface ConfiguracioIA {
  matching: {
    actiu: boolean
    nivellPrecisio: number
    criteris: string[]
    filtreBias: boolean
  }
  optimitzacio: {
    actiu: boolean
    reescriutaAuto: boolean
    suggerenciesSEO: boolean
    analisiCompetencia: boolean
  }
  chatbot: {
    actiu: boolean
    idiomes: string[]
    personalitat: 'professional' | 'friendly' | 'formal'
    responseTime: number
  }
  analytics: {
    prediccions: boolean
    alertesPersonalitzades: boolean
    informesAuto: boolean
    comparatiuMercad: boolean
  }
}

interface AssistentIA {
  nom: string
  especialitat: string
  status: 'actiu' | 'inactiu' | 'entrenant'
  accuracy: number
  requests: number
  ultimUpdate: string
}

export default function ConfiguracioIA() {
  const tema = useTema()
  const idioma = useIdioma()
  const [configuracio, setConfiguracio] = useState<ConfiguracioIA>({
    matching: {
      actiu: true,
      nivellPrecisio: 85,
      criteris: ['experiencia', 'skills', 'ubicacio', 'salari'],
      filtreBias: true
    },
    optimitzacio: {
      actiu: true,
      reescriutaAuto: false,
      suggerenciesSEO: true,
      analisiCompetencia: true
    },
    chatbot: {
      actiu: false,
      idiomes: ['ca', 'es', 'en'],
      personalitat: 'professional',
      responseTime: 2
    },
    analytics: {
      prediccions: true,
      alertesPersonalitzades: true,
      informesAuto: false,
      comparatiuMercad: true
    }
  })
  
  const [assistents, setAssistents] = useState<AssistentIA[]>([])
  const [selectedAssistent, setSelectedAssistent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [testingMatching, setTestingMatching] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    // Simular càrrega de dades
    setTimeout(() => {
      setAssistents(generateMockAssistents())
      setLoading(false)
    }, 800)
  }, [])

  const generateMockAssistents = (): AssistentIA[] => {
    return [
      {
        nom: 'Matcher Pro',
        especialitat: 'Matching de Candidats',
        status: 'actiu',
        accuracy: 92.5,
        requests: 8426,
        ultimUpdate: '2 hores'
      },
      {
        nom: 'Content Optimizer',
        especialitat: 'Optimització d\'Ofertes',
        status: 'actiu',
        accuracy: 88.1,
        requests: 3241,
        ultimUpdate: '1 dia'
      },
      {
        nom: 'Analytics Assistant',
        especialitat: 'Anàlisi Predictiu',
        status: 'entrenant',
        accuracy: 76.8,
        requests: 1205,
        ultimUpdate: '3 dies'
      },
      {
        nom: 'Chat Support',
        especialitat: 'Atenció al Client',
        status: 'inactiu',
        accuracy: 94.2,
        requests: 0,
        ultimUpdate: '1 setmana'
      }
    ]
  }

  const handleConfigChange = (section: keyof ConfiguracioIA, key: string, value: any) => {
    setConfiguracio(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const testMatching = async () => {
    setTestingMatching(true)
    // Simular test
    await new Promise(resolve => setTimeout(resolve, 3000))
    setTestingMatching(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actiu': return 'bg-green-100 text-green-800'
      case 'inactiu': return 'bg-gray-100 text-gray-800'
      case 'entrenant': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const traduccions = {
    ca: {
      configuracioIA: "Configuració IA",
      assistentsIA: "Assistents d'IA",
      matching: "Matching Intel·ligent",
      optimitzacio: "Optimització de Contingut",
      chatbot: "Chatbot i Suport",
      analytics: "Analytics Predictius",
      configuracioAvançada: "Configuració Avançada",
      testar: "Testar Sistema",
      guardar: "Guardar Canvis",
      actiu: "Actiu",
      inactiu: "Inactiu",
      entrenant: "Entrenant",
      precisio: "Precisió",
      requests: "Sol·licituds",
      ultimUpdate: "Última Actualització",
      nivellPrecisio: "Nivell de Precisió",
      criterisMatching: "Criteris de Matching",
      filtreBias: "Filtre Anti-Bias",
      reescriutaAuto: "Reescriptura Automàtica",
      suggerenciesSEO: "Suggerències SEO",
      analisiCompetencia: "Anàlisi de Competència",
      idiomes: "Idiomes Suportats",
      personalitat: "Personalitat del Bot",
      tempsResposta: "Temps de Resposta",
      prediccions: "Prediccions de Rendiment",
      alertes: "Alertes Personalitzades",
      informesAuto: "Informes Automàtics",
      comparatiuMercad: "Comparativa de Mercat",
      professional: "Professional",
      friendly: "Amigable",
      formal: "Formal",
      hores: "hores",
      dies: "dies",
      setmana: "setmana",
      carregant: "Carregant configuració IA..."
    },
    es: {
      configuracioIA: "Configuración IA",
      assistentsIA: "Asistentes IA",
      matching: "Matching Inteligente",
      optimitzacio: "Optimización de Contenido",
      chatbot: "Chatbot y Soporte",
      analytics: "Analytics Predictivos",
      configuracioAvançada: "Configuración Avanzada",
      testar: "Probar Sistema",
      guardar: "Guardar Cambios",
      actiu: "Activo",
      inactiu: "Inactivo",
      entrenant: "Entrenando",
      precisio: "Precisión",
      requests: "Solicitudes",
      ultimUpdate: "Última Actualización",
      nivellPrecisio: "Nivel de Precisión",
      criterisMatching: "Criterios de Matching",
      filtreBias: "Filtro Anti-Bias",
      reescriutaAuto: "Reescritura Automática",
      suggerenciesSEO: "Sugerencias SEO",
      analisiCompetencia: "Análisis de Competencia",
      idiomes: "Idiomas Soportados",
      personalitat: "Personalidad del Bot",
      tempsResposta: "Tiempo de Respuesta",
      prediccions: "Predicciones de Rendimiento",
      alertes: "Alertas Personalizadas",
      informesAuto: "Informes Automáticos",
      comparatiuMercad: "Comparativa de Mercado",
      professional: "Profesional",
      friendly: "Amigable",
      formal: "Formal",
      hores: "horas",
      dies: "días",
      setmana: "semana",
      carregant: "Cargando configuración IA..."
    }
  }

  const t = traduccions[idioma as keyof typeof traduccions] || traduccions.ca

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.carregant}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                {t.configuracioIA}
              </h1>
              <p className="text-gray-600">Gestiona els teus assistents intel·ligents i funcionalitats d'IA</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={testMatching}
                disabled={testingMatching}
                className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {testingMatching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Testant...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    {t.testar}
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <CheckCircle className="w-5 h-5" />
                {t.guardar}
              </button>
            </div>
          </div>
        </div>

        {/* Assistents IA */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.assistentsIA}</h2>
          <div className="grid grid-cols-2 gap-6">
            {assistents.map((assistent, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
                      <Cpu className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assistent.nom}</h3>
                      <p className="text-sm text-gray-600">{assistent.especialitat}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assistent.status)}`}>
                    {t[assistent.status as keyof typeof t]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{assistent.accuracy}%</div>
                    <div className="text-xs text-gray-500">{t.precisio}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{assistent.requests.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{t.requests}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{assistent.ultimUpdate}</div>
                    <div className="text-xs text-gray-500">{t.ultimUpdate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm transition-colors">
                    <Settings className="w-4 h-4 inline mr-1" />
                    Configurar
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuracions */}
        <div className="grid grid-cols-2 gap-6">
          {/* Matching Intel·ligent */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t.matching}</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracio.matching.actiu}
                  onChange={(e) => handleConfigChange('matching', 'actiu', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.nivellPrecisio}</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={configuracio.matching.nivellPrecisio}
                  onChange={(e) => handleConfigChange('matching', 'nivellPrecisio', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span className="font-medium text-blue-600">{configuracio.matching.nivellPrecisio}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{t.filtreBias}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracio.matching.filtreBias}
                      onChange={(e) => handleConfigChange('matching', 'filtreBias', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">Evita discriminació per gènere, edat o altres factors</p>
              </div>
            </div>
          </div>

          {/* Optimització de Contingut */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t.optimitzacio}</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracio.optimitzacio.actiu}
                  onChange={(e) => handleConfigChange('optimitzacio', 'actiu', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-3">
              {[
                { key: 'reescriutaAuto', label: t.reescriutaAuto, desc: 'Millora automàticament el text de les ofertes' },
                { key: 'suggerenciesSEO', label: t.suggerenciesSEO, desc: 'Optimitza per a motors de cerca' },
                { key: 'analisiCompetencia', label: t.analisiCompetencia, desc: 'Compara amb ofertes similars' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-700 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracio.optimitzacio[item.key as keyof typeof configuracio.optimitzacio] as boolean}
                      onChange={(e) => handleConfigChange('optimitzacio', item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t.chatbot}</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={configuracio.chatbot.actiu}
                  onChange={(e) => handleConfigChange('chatbot', 'actiu', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.personalitat}</label>
                <select
                  value={configuracio.chatbot.personalitat}
                  onChange={(e) => handleConfigChange('chatbot', 'personalitat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">{t.professional}</option>
                  <option value="friendly">{t.friendly}</option>
                  <option value="formal">{t.formal}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.tempsResposta}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={configuracio.chatbot.responseTime}
                  onChange={(e) => handleConfigChange('chatbot', 'responseTime', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {configuracio.chatbot.responseTime} segons
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t.analytics}</h3>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'prediccions', label: t.prediccions, desc: 'Predicció del rendiment de les ofertes' },
                { key: 'alertesPersonalitzades', label: t.alertes, desc: 'Notificacions intel·ligents' },
                { key: 'informesAuto', label: t.informesAuto, desc: 'Genera informes setmanals' },
                { key: 'comparatiuMercad', label: t.comparatiuMercad, desc: 'Compara amb la competència' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-700 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configuracio.analytics[item.key as keyof typeof configuracio.analytics] as boolean}
                      onChange={(e) => handleConfigChange('analytics', item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuració Avançada */}
        <div className="mt-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Sliders className="w-5 h-5" />
            {t.configuracioAvançada}
            <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Paràmetres del Model</h4>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Temperature</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Max Tokens</label>
                    <input type="number" defaultValue="150" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Seguretat</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Filtre de contingut</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Detecció d'anomalies</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Mode debug</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Integració</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      API Externa
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Webhooks
                    </button>
                    <button className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      Logs i Monitoring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}