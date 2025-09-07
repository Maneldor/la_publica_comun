'use client'

import { useState } from 'react'
import { 
  Bot, Zap, TrendingUp, AlertTriangle, CheckCircle, Eye, Settings,
  MessageSquare, BarChart3, Clock, Users, Target, Brain, Activity,
  Play, Pause, RefreshCw, Download, Upload, Edit, X, Plus,
  ThumbsUp, ThumbsDown, ArrowRight, ArrowUp, ArrowDown, Star
} from 'lucide-react'

interface AgentIA {
  id: string
  nom: string
  tipus: 'lead_qualification' | 'customer_support' | 'sales_assistant' | 'licitacions'
  estat: 'actiu' | 'entrenament' | 'manteniment' | 'inactiu'
  versio: string
  especialitat: string[]
  rendiment: {
    consultesTotal: number
    consultesAvui: number
    taxaConversio: number
    satisfaccioMitjana: number
    tempsRespostaPromig: number
    handoffsNecessaris: number
    resolucioPrimeraConsulta: number
  }
  capacitat: {
    maxConsultesHora: number
    cargaActual: number
    horasActivitat: number
  }
  entrenament: {
    dadesEntrenament: number
    ultimActualitzacio: Date
    precisioActual: number
    areasMillorables: string[]
  }
  integracions: string[]
  config: {
    promptsPersonalitzats: number
    reglesnegoci: number
    escalacioAutomatica: boolean
    aprenentgeContinu: boolean
  }
}

interface ConversaIA {
  id: string
  agentId: string
  clientId: string
  canal: 'web' | 'whatsapp' | 'email' | 'api'
  estat: 'activa' | 'resolta' | 'escalada' | 'abandonada'
  durada: number
  satisfaccio?: number
  oportunitat: 'alta' | 'mitjana' | 'baixa' | 'cap'
  handoffGestor: boolean
  missatges: number
  resolucio: string
  valorGenerat?: number
  timestamp: Date
}

interface TestingAB {
  id: string
  nom: string
  agentId: string
  tipus: 'prompt' | 'approach' | 'escalacio' | 'resposta'
  estat: 'actiu' | 'completat' | 'pausat'
  mostraA: {
    nom: string
    configuracio: any
    resultats: {
      conversions: number
      satisfaccio: number
      handoffs: number
    }
  }
  mostraB: {
    nom: string
    configuracio: any
    resultats: {
      conversions: number
      satisfaccio: number
      handoffs: number
    }
  }
  significanciaEstadistica: number
  recomanacio: 'A' | 'B' | 'indeterminat'
}

export default function ControlAgentsIA() {
  const [agentSeleccionat, setAgentSeleccionat] = useState<AgentIA | null>(null)
  const [vistaActiva, setVistaActiva] = useState('dashboard')
  const [showConversaCritica, setShowConversaCritica] = useState(false)
  const [showTestingAB, setShowTestingAB] = useState(false)
  const [showOptimitzacio, setShowOptimitzacio] = useState(false)
  const [filtreAgent, setFiltreAgent] = useState('tots')

  const agentsIA: AgentIA[] = [
    {
      id: '1',
      nom: 'AssistentIA Qualificació',
      tipus: 'lead_qualification',
      estat: 'actiu',
      versio: 'v2.3.1',
      especialitat: ['Lead Qualification', 'Sector Públic', 'Scoring Automàtic'],
      rendiment: {
        consultesTotal: 15420,
        consultesAvui: 287,
        taxaConversio: 24.7,
        satisfaccioMitjana: 4.2,
        tempsRespostaPromig: 1.8,
        handoffsNecessaris: 12.5,
        resolucioPrimeraConsulta: 78.3
      },
      capacitat: {
        maxConsultesHora: 150,
        cargaActual: 87,
        horasActivitat: 24
      },
      entrenament: {
        dadesEntrenament: 45000,
        ultimActualitzacio: new Date('2024-01-20'),
        precisioActual: 87.2,
        areasMillorables: ['Licitacions complexes', 'Pressupostos variables']
      },
      integracions: ['CRM', 'WhatsApp', 'Email', 'Web Chat'],
      config: {
        promptsPersonalitzats: 12,
        reglesnegoci: 8,
        escalacioAutomatica: true,
        aprenentgeContinu: true
      }
    },
    {
      id: '2',
      nom: 'SupportIA Customer Success',
      tipus: 'customer_support',
      estat: 'actiu',
      versio: 'v1.8.2',
      especialitat: ['Suport Tècnic', 'Onboarding', 'Troubleshooting'],
      rendiment: {
        consultesTotal: 8950,
        consultesAvui: 156,
        taxaConversio: 31.2,
        satisfaccioMitjana: 4.5,
        tempsRespostaPromig: 2.1,
        handoffsNecessaris: 8.7,
        resolucioPrimeraConsulta: 84.1
      },
      capacitat: {
        maxConsultesHora: 100,
        cargaActual: 62,
        horasActivitat: 16
      },
      entrenament: {
        dadesEntrenament: 32000,
        ultimActualitzacio: new Date('2024-01-15'),
        precisioActual: 91.4,
        areasMillorables: ['Configuracions avançades', 'Integracions API']
      },
      integracions: ['Zendesk', 'Slack', 'Teams', 'Email'],
      config: {
        promptsPersonalitzats: 18,
        reglesnegoci: 15,
        escalacioAutomatica: true,
        aprenentgeContinu: true
      }
    },
    {
      id: '3',
      nom: 'VentesIA Licitacions',
      tipus: 'licitacions',
      estat: 'entrenament',
      versio: 'v0.9.1-beta',
      especialitat: ['Licitacions Públiques', 'Plecs Tècnics', 'Documentació Legal'],
      rendiment: {
        consultesTotal: 1250,
        consultesAvui: 45,
        taxaConversio: 18.9,
        satisfaccioMitjana: 3.8,
        tempsRespostaPromig: 4.2,
        handoffsNecessaris: 35.6,
        resolucioPrimeraConsulta: 52.1
      },
      capacitat: {
        maxConsultesHora: 50,
        cargaActual: 23,
        horasActivitat: 8
      },
      entrenament: {
        dadesEntrenament: 12000,
        ultimActualitzacio: new Date('2024-01-25'),
        precisioActual: 68.9,
        areasMillorables: ['Normativa actualitzada', 'Criteris avaluació', 'Terminis legals']
      },
      integracions: ['PLACE', 'BOE', 'DOGC', 'Internal CRM'],
      config: {
        promptsPersonalitzats: 25,
        reglesnegoci: 34,
        escalacioAutomatica: true,
        aprenentgeContinu: true
      }
    }
  ]

  const conversesAvui: ConversaIA[] = [
    {
      id: '1',
      agentId: '1',
      clientId: 'client_001',
      canal: 'web',
      estat: 'escalada',
      durada: 12.5,
      satisfaccio: 3,
      oportunitat: 'alta',
      handoffGestor: true,
      missatges: 18,
      resolucio: 'Escalat per complexitat tècnica',
      valorGenerat: 45000,
      timestamp: new Date()
    },
    {
      id: '2',
      agentId: '1',
      clientId: 'client_002',
      canal: 'whatsapp',
      estat: 'resolta',
      durada: 6.2,
      satisfaccio: 5,
      oportunitat: 'mitjana',
      handoffGestor: false,
      missatges: 12,
      resolucio: 'Lead qualificat i programada demo',
      valorGenerat: 25000,
      timestamp: new Date()
    },
    {
      id: '3',
      agentId: '2',
      clientId: 'client_003',
      canal: 'email',
      estat: 'resolta',
      durada: 3.8,
      satisfaccio: 4,
      oportunitat: 'baixa',
      handoffGestor: false,
      missatges: 8,
      resolucio: 'Problema tècnic resolt',
      timestamp: new Date()
    }
  ]

  const testingAB: TestingAB[] = [
    {
      id: '1',
      nom: 'Prompt Qualificació V2 vs V3',
      agentId: '1',
      tipus: 'prompt',
      estat: 'actiu',
      mostraA: {
        nom: 'Prompt Directe V2',
        configuracio: { approach: 'direct', questions: 5 },
        resultats: { conversions: 23.4, satisfaccio: 4.1, handoffs: 15.2 }
      },
      mostraB: {
        nom: 'Prompt Conversacional V3',
        configuracio: { approach: 'conversational', questions: 7 },
        resultats: { conversions: 28.7, satisfaccio: 4.4, handoffs: 11.8 }
      },
      significanciaEstadistica: 94.2,
      recomanacio: 'B'
    },
    {
      id: '2',
      nom: 'Escalació Automàtica vs Manual',
      agentId: '2',
      tipus: 'escalacio',
      estat: 'completat',
      mostraA: {
        nom: 'Escalació Manual',
        configuracio: { threshold: 'high', auto: false },
        resultats: { conversions: 31.2, satisfaccio: 4.3, handoffs: 8.9 }
      },
      mostraB: {
        nom: 'Escalació Automàtica',
        configuracio: { threshold: 'medium', auto: true },
        resultats: { conversions: 29.8, satisfaccio: 4.6, handoffs: 12.3 }
      },
      significanciaEstadistica: 87.6,
      recomanacio: 'A'
    }
  ]

  const vistes = [
    { id: 'dashboard', nom: 'Dashboard Agents', icon: BarChart3 },
    { id: 'rendiment', nom: 'Rendiment Detallat', icon: TrendingUp },
    { id: 'converses', nom: 'Converses Crítiques', icon: MessageSquare },
    { id: 'testing', nom: 'A/B Testing', icon: Brain },
    { id: 'coordinacio', nom: 'Coordinació IA-Gestors', icon: Users },
    { id: 'optimitzacio', nom: 'Optimització ROI', icon: Target },
    { id: 'entrenament', nom: 'Entrenament Continu', icon: RefreshCw }
  ]

  const calcularROIAgent = (agent: AgentIA) => {
    const costOperacio = 2000 // Cost mensual estimat
    const valorGenerat = agent.rendiment.consultesTotal * 15 // €15 per consulta mitjana
    const estalviGestors = agent.rendiment.consultesTotal * 0.5 * 45 // €45/hora gestor
    
    return ((valorGenerat + estalviGestors - costOperacio) / costOperacio * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header amb stats globals IA */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Control Integral Agents IA Comercials</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTestingAB(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Brain className="w-5 h-5" />
              A/B Testing
            </button>
            <button 
              onClick={() => setShowOptimitzacio(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Target className="w-5 h-5" />
              Optimitzar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{agentsIA.length}</div>
            <div className="text-sm text-blue-600">Agents IA Actius</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {agentsIA.reduce((sum, a) => sum + a.rendiment.consultesAvui, 0)}
            </div>
            <div className="text-sm text-green-600">Consultes Avui</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {(agentsIA.reduce((sum, a) => sum + a.rendiment.taxaConversio, 0) / agentsIA.length).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Conversió Mitjana</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {(agentsIA.reduce((sum, a) => sum + a.rendiment.satisfaccioMitjana, 0) / agentsIA.length).toFixed(1)}
            </div>
            <div className="text-sm text-orange-600">Satisfacció Mitjana</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {(agentsIA.reduce((sum, a) => sum + a.rendiment.handoffsNecessaris, 0) / agentsIA.length).toFixed(1)}%
            </div>
            <div className="text-sm text-red-600">Handoffs Mitjans</div>
          </div>
        </div>
      </div>

      {/* Navegació de vistes */}
      <div className="bg-white rounded-lg border">
        <div className="border-b px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {vistes.map(vista => {
              const Icon = vista.icon
              return (
                <button
                  key={vista.id}
                  onClick={() => setVistaActiva(vista.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    vistaActiva === vista.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {vista.nom}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard Agents */}
          {vistaActiva === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Rendiment Individual Agents IA</h3>
                <select 
                  value={filtreAgent}
                  onChange={(e) => setFiltreAgent(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="tots">Tots els agents</option>
                  <option value="lead_qualification">Qualificació Leads</option>
                  <option value="customer_support">Suport Client</option>
                  <option value="sales_assistant">Assistant Vendes</option>
                  <option value="licitacions">Licitacions</option>
                </select>
              </div>

              <div className="grid gap-4">
                {agentsIA
                  .filter(a => filtreAgent === 'tots' || a.tipus === filtreAgent)
                  .map(agent => {
                    const roi = calcularROIAgent(agent)
                    return (
                      <div key={agent.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                              <Bot className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg">{agent.nom}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  agent.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                                  agent.estat === 'entrenament' ? 'bg-yellow-100 text-yellow-700' :
                                  agent.estat === 'manteniment' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {agent.estat}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {agent.versio}
                                </span>
                              </div>
                              
                              <div className="mt-2 grid grid-cols-6 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Consultes Avui</div>
                                  <div className="font-semibold">{agent.rendiment.consultesAvui}</div>
                                  <div className="text-xs text-gray-600">
                                    {agent.rendiment.consultesTotal} total
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Conversió</div>
                                  <div className="font-semibold">{agent.rendiment.taxaConversio}%</div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className="bg-green-500 h-1.5 rounded-full"
                                      style={{ width: `${agent.rendiment.taxaConversio}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Satisfacció</div>
                                  <div className="font-semibold flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    {agent.rendiment.satisfaccioMitjana}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Handoffs</div>
                                  <div className="font-semibold">{agent.rendiment.handoffsNecessaris}%</div>
                                  <div className={`text-xs ${
                                    agent.rendiment.handoffsNecessaris <= 15 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {agent.rendiment.handoffsNecessaris <= 15 ? 'Òptim' : 'Alt'}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Càrrega</div>
                                  <div className="font-semibold">{agent.capacitat.cargaActual}%</div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        agent.capacitat.cargaActual >= 90 ? 'bg-red-500' :
                                        agent.capacitat.cargaActual >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${agent.capacitat.cargaActual}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">ROI Estimat</div>
                                  <div className="font-semibold text-green-600">+{roi.toFixed(0)}%</div>
                                  <div className="text-xs text-gray-600">
                                    vs cost operació
                                  </div>
                                </div>
                              </div>
                              
                              {/* Especialitats */}
                              <div className="mt-3 flex flex-wrap gap-1">
                                {agent.especialitat.map(esp => (
                                  <span key={esp} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                    {esp}
                                  </span>
                                ))}
                              </div>
                              
                              {/* Àrees millorables */}
                              {agent.entrenament.areasMillorables.length > 0 && (
                                <div className="mt-3">
                                  <div className="text-sm font-medium text-orange-700 mb-1">
                                    Àrees de millora:
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {agent.entrenament.areasMillorables.map((area, i) => (
                                      <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                        {area}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setAgentSeleccionat(agent)}
                              className="p-2 hover:bg-blue-100 rounded-lg"
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-green-100 rounded-lg">
                              <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                            <button 
                              onClick={() => setShowConversaCritica(true)}
                              className="p-2 hover:bg-purple-100 rounded-lg"
                            >
                              <MessageSquare className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Converses Crítiques */}
          {vistaActiva === 'converses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Revisar Converses Crítiques</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Oportunitats perdudes</option>
                    <option>Satisfacció baixa</option>
                    <option>Handoffs complexos</option>
                    <option>Errors de comprensió</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-700">12</div>
                  <div className="text-sm text-red-600">Oportunitats perdudes</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">8</div>
                  <div className="text-sm text-orange-600">Satisfacció &lt;3</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">24</div>
                  <div className="text-sm text-purple-600">Handoffs complexos</div>
                </div>
              </div>

              <div className="space-y-4">
                {conversesAvui.map(conversa => (
                  <div key={conversa.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          conversa.estat === 'escalada' ? 'bg-red-100 text-red-700' :
                          conversa.estat === 'resolta' ? 'bg-green-100 text-green-700' :
                          conversa.estat === 'activa' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {conversa.estat}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {conversa.canal}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          conversa.oportunitat === 'alta' ? 'bg-green-100 text-green-700' :
                          conversa.oportunitat === 'mitjana' ? 'bg-yellow-100 text-yellow-700' :
                          conversa.oportunitat === 'baixa' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          Oportunitat: {conversa.oportunitat}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {conversa.durada} min • {conversa.missatges} missatges
                        </span>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Agent:</span>
                        <div className="font-medium">
                          {agentsIA.find(a => a.id === conversa.agentId)?.nom}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Satisfacció:</span>
                        <div className="font-medium flex items-center gap-1">
                          {conversa.satisfaccio ? (
                            <>
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              {conversa.satisfaccio}/5
                            </>
                          ) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Handoff:</span>
                        <div className={`font-medium ${
                          conversa.handoffGestor ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {conversa.handoffGestor ? 'Sí' : 'No'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Valor:</span>
                        <div className="font-medium">
                          {conversa.valorGenerat ? `€${conversa.valorGenerat.toLocaleString()}` : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="text-sm font-medium mb-1">Resolució:</div>
                      <div className="text-sm text-gray-700">{conversa.resolucio}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* A/B Testing */}
          {vistaActiva === 'testing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">A/B Testing d'Approaches Comercials</h3>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nou Test
                </button>
              </div>

              <div className="space-y-4">
                {testingAB.map(test => (
                  <div key={test.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{test.nom}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-1 rounded text-sm ${
                            test.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                            test.estat === 'completat' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {test.estat}
                          </span>
                          <span className="text-sm text-gray-600">
                            Agent: {agentsIA.find(a => a.id === test.agentId)?.nom}
                          </span>
                          <span className="text-sm text-gray-600">
                            Significancia: {test.significanciaEstadistica}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.recomanacio !== 'indeterminat' && (
                          <span className={`px-3 py-1 rounded font-medium ${
                            test.recomanacio === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            Recomanat: Variant {test.recomanacio}
                          </span>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 text-blue-700">Variant A: {test.mostraA.nom}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span className="font-medium">{test.mostraA.resultats.conversions}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Satisfacció:</span>
                            <span className="font-medium">{test.mostraA.resultats.satisfaccio}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Handoffs:</span>
                            <span className="font-medium">{test.mostraA.resultats.handoffs}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h5 className="font-medium mb-3 text-green-700">Variant B: {test.mostraB.nom}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Conversions:</span>
                            <span className="font-medium">{test.mostraB.resultats.conversions}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Satisfacció:</span>
                            <span className="font-medium">{test.mostraB.resultats.satisfaccio}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Handoffs:</span>
                            <span className="font-medium">{test.mostraB.resultats.handoffs}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {test.estat === 'completat' && (
                      <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Aplicar Variant {test.recomanacio}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Descartar Test
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coordinació IA-Gestors */}
          {vistaActiva === 'coordinacio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Coordinació entre IA i Gestors Humans</h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Distribució de Casos Avui</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Només IA</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-medium">187</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">IA + Handoff</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-sm font-medium">73</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Només Gestor</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">28</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Temps Resolució Mitjà</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Només IA:</span>
                      <span className="text-sm font-medium">3.2 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">IA + Handoff:</span>
                      <span className="text-sm font-medium">12.8 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Només Gestor:</span>
                      <span className="text-sm font-medium">18.5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Col·laboració:</span>
                      <span className="text-sm font-medium">8.3 min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Evitar Duplicació</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Casos detectats:</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Previnguts:</span>
                      <span className="text-sm font-medium text-green-600">98.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Context compartit:</span>
                      <span className="text-sm font-medium text-blue-600">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Conversa Crítica */}
      {showConversaCritica && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Detecció d'Oportunitats Perdudes</h3>
              <button onClick={() => setShowConversaCritica(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center text-gray-500">
                Sistema de revisió de converses crítiques implementat amb:
                <ul className="list-disc text-left mt-4 space-y-1">
                  <li>Dashboard de rendiment amb taxa de conversió</li>
                  <li>Detecció automàtica d'oportunitats perdudes</li>
                  <li>A/B testing d'approaches comercials</li>
                  <li>Tracking de satisfacció d'usuaris</li>
                  <li>Handoff intel·ligent amb context</li>
                  <li>Anàlisi de ROI per consulta</li>
                  <li>Coordinació evitant duplicacions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}