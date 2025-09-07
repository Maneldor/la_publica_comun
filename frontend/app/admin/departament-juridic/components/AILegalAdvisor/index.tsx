'use client'

import { useState } from 'react'
import { 
  Bot, MessageSquare, Brain, Lightbulb, FileText, Search,
  TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, Target,
  Send, Plus, Eye, Download, Settings, RefreshCw, Star
} from 'lucide-react'

export default function AILegalAdvisor() {
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'recommendations' | 'knowledge'>('chat')
  const [message, setMessage] = useState('')

  const aiInsights = [
    {
      id: 'INS-001',
      type: 'Risk Alert',
      title: 'Increment de disputes contractuals',
      description: 'Detectat un increment del 25% en disputes contractuals amb empreses col·laboradores en els últims 30 dies',
      confidence: 87,
      category: 'Contractual',
      impact: 'High',
      recommendation: 'Revisar clàusules estàndard de penalitzacions',
      generatedDate: '2024-01-30',
      status: 'new'
    },
    {
      id: 'INS-002',
      type: 'Compliance Trend',
      title: 'Millora en compliance GDPR',
      description: 'Els indicadors de compliance GDPR mostren una tendència positiva del 15% aquest trimestre',
      confidence: 92,
      category: 'GDPR',
      impact: 'Medium',
      recommendation: 'Mantenir protocols actuals i documentar millors pràctiques',
      generatedDate: '2024-01-29',
      status: 'reviewed'
    },
    {
      id: 'INS-003',
      type: 'Pattern Analysis',
      title: 'Patró en resolució de disputes laborals',
      description: 'La mediació mostra una taxa d\'èxit del 89% vs 67% en litigació per disputes laborals',
      confidence: 95,
      category: 'Laboral',
      impact: 'High',
      recommendation: 'Prioritzar mediació en futures disputes laborals',
      generatedDate: '2024-01-28',
      status: 'implemented'
    }
  ]

  const aiRecommendations = [
    {
      id: 'REC-001',
      priority: 'High',
      type: 'Process Optimization',
      title: 'Automatitzar generació de contractes estàndard',
      description: 'Implementar plantilles intel·ligents per contractes amb empreses col·laboradores pot reduir temps de preparació en un 60%',
      estimatedSavings: '45 hores/mes',
      implementation: 'Medium',
      aiConfidence: 88,
      tags: ['Automatització', 'Eficiència'],
      status: 'pending'
    },
    {
      id: 'REC-002',
      priority: 'Medium',
      type: 'Risk Mitigation',
      title: 'Revisar política de renovació automàtica',
      description: 'Els contractes amb renovació automàtica mostren major risc de disputes post-renovació',
      estimatedSavings: '€25,000 anuals',
      implementation: 'Easy',
      aiConfidence: 91,
      tags: ['Risc', 'Contractes'],
      status: 'in_progress'
    }
  ]

  const chatHistory = [
    {
      id: 1,
      type: 'user',
      message: 'Quina és la millor estratègia per reduir el temps de resolució de disputes amb sindicats?',
      timestamp: '14:30'
    },
    {
      id: 2,
      type: 'ai',
      message: 'Basant-me en l\'anàlisi de les vostres disputes anteriors amb sindicats, recomano:\n\n1. **Mediació primerenca**: Els casos resolts via mediació es resolen 45% més ràpid\n2. **Punts de contacte designats**: Establir responsables específics redueix malentesos\n3. **Reunions trimestrals preventives**: Detectar conflictes abans que escalen\n\nVoleu que detalli alguna d\'aquestes estratègies?',
      timestamp: '14:31',
      confidence: 89,
      sources: ['Anàlisi històrica disputes', 'Millors pràctiques sector públic']
    },
    {
      id: 3,
      type: 'user',
      message: 'Sí, detalla la mediació primerenca',
      timestamp: '14:32'
    },
    {
      id: 4,
      type: 'ai',
      message: 'La **mediació primerenca** implica:\n\n**Quan aplicar:**\n- Primers 7 dies després de presentar la disputa\n- Abans que les posicions es consolidin\n\n**Process recomanat:**\n1. Identificació automàtica de casos aptes per mediació\n2. Contacte immediat amb mediador extern especialitzat\n3. Sessió inicial dins 15 dies\n\n**Resultats esperats** (basats en els vostres datos):\n- Reducció temps: 120 → 75 dies mitjana\n- Taxa èxit: 87%\n- Estalvi costos: €15,000 per cas mitjà',
      timestamp: '14:33',
      confidence: 92,
      sources: ['Casos resolts 2023-2024', 'Benchmarking mediació']
    }
  ]

  const knowledgeBase = [
    {
      category: 'Contractes',
      topics: ['Clàusules tipus', 'Negociació termes', 'Resolució conflictes'],
      documents: 156,
      lastUpdated: '2024-01-28'
    },
    {
      category: 'GDPR',
      topics: ['Consentiments', 'Drets usuaris', 'Brecha de seguretat'],
      documents: 89,
      lastUpdated: '2024-01-30'
    },
    {
      category: 'Laboral',
      topics: ['Estatut treballadors', 'Convenis col·lectius', 'Acomiadaments'],
      documents: 124,
      lastUpdated: '2024-01-25'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'text-blue-600 bg-blue-100',
      reviewed: 'text-yellow-600 bg-yellow-100',
      implemented: 'text-green-600 bg-green-100',
      pending: 'text-orange-600 bg-orange-100',
      in_progress: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getImpactColor = (impact: string) => {
    switch(impact.toLowerCase()) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assessor Legal IA</h2>
            <p className="text-gray-600">Intel·ligència artificial per anàlisi i recomanacions legals</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Brain className="w-4 h-4" />
              Nova Consulta
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Settings className="w-4 h-4" />
              Configuració IA
            </button>
          </div>
        </div>

        {/* AI Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">1,247</div>
                <div className="text-sm text-gray-600">Consultes Processades</div>
              </div>
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-sm text-gray-600">Precisió IA</div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">34</div>
                <div className="text-sm text-gray-600">Insights Generats</div>
              </div>
              <Lightbulb className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">€180K</div>
                <div className="text-sm text-gray-600">Estalvis Identificats</div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'chat', label: 'Chat IA', icon: MessageSquare },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
            { id: 'recommendations', label: 'Recomanacions', icon: Target },
            { id: 'knowledge', label: 'Base Coneixement', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-lg border h-[600px] flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-indigo-600" />
              <h3 className="font-semibold">Assessor Legal IA</h3>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">En línia</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map(chat => (
              <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl p-3 rounded-lg ${
                  chat.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap">{chat.message}</div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={chat.type === 'user' ? 'text-indigo-200' : 'text-gray-500'}>
                      {chat.timestamp}
                    </span>
                    {chat.type === 'ai' && chat.confidence && (
                      <span className="text-gray-500">
                        Confiança: {chat.confidence}%
                      </span>
                    )}
                  </div>
                  {chat.type === 'ai' && chat.sources && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="text-xs text-gray-500">
                        <strong>Fonts:</strong> {chat.sources.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Pregunta a l'Assessor Legal IA..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Insights Generats per IA</h3>
            <div className="space-y-4">
              {aiInsights.map(insight => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(insight.status)}`}>
                          {insight.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded">
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="text-sm">
                        <span className="font-medium text-indigo-600">Recomanació:</span>
                        <span className="ml-2">{insight.recommendation}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Categoria:</span>
                      <span className="ml-2 font-medium">{insight.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Impacte:</span>
                      <span className={`ml-2 font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Confiança:</span>
                      <span className="ml-2 font-medium text-green-600">{insight.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Generat:</span>
                      <span className="ml-2 font-medium">{insight.generatedDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {aiRecommendations.map(rec => (
            <div key={rec.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Implementar
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Estalvi estimat:</span>
                  <span className="ml-2 font-medium text-green-600">{rec.estimatedSavings}</span>
                </div>
                <div>
                  <span className="text-gray-600">Implementació:</span>
                  <span className={`ml-2 font-medium ${
                    rec.implementation === 'Easy' ? 'text-green-600' :
                    rec.implementation === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {rec.implementation}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Confiança IA:</span>
                  <span className="ml-2 font-medium">{rec.aiConfidence}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Tipus:</span>
                  <span className="ml-2 font-medium">{rec.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Knowledge Base */}
      {activeTab === 'knowledge' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {knowledgeBase.map((kb, idx) => (
            <div key={idx} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{kb.category}</h3>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Temes principals:</div>
                  <div className="space-y-1">
                    {kb.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} className="text-sm flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents:</span>
                    <span className="font-medium">{kb.documents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Actualitzat:</span>
                    <span className="font-medium">{kb.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}