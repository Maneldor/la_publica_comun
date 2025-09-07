'use client'

import { useState, useEffect } from 'react'
import {
  Brain, Zap, Target, BarChart3, Users, Globe,
  TrendingUp, Clock, CheckCircle, AlertTriangle,
  Play, Pause, Settings, Copy, Edit3, Eye,
  Calendar, Filter, Search, Download, Upload,
  Star, Crown, Award, Sparkles, RefreshCw,
  MessageSquare, Send, Bell, Share2, Link,
  Lightbulb, Activity, ArrowUp, ArrowDown,
  X, Plus, Info, ExternalLink, MoreVertical
} from 'lucide-react'

interface AdvancedOfferManagerProps {
  empresaId: string
  planEmpresa: 'basic' | 'premium'
}

interface AIOptimizationSuggestion {
  id: string
  field: string
  current: string
  suggested: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  reason: string
}

interface ABTest {
  id: string
  name: string
  status: 'running' | 'completed' | 'paused'
  variants: {
    id: string
    name: string
    traffic: number
    conversions: number
    ctr: number
  }[]
  startDate: string
  endDate?: string
  winner?: string
  significance: number
}

export default function AdvancedOfferManager({ empresaId, planEmpresa }: AdvancedOfferManagerProps) {
  const [activeTab, setActiveTab] = useState('ai-optimization')
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  
  // Mock data for AI optimization
  const [aiSuggestions] = useState<AIOptimizationSuggestion[]>([
    {
      id: '1',
      field: 'titulo',
      current: 'Desenvolupador Senior React',
      suggested: 'Desenvolupador Senior React - Teletreball 100% + Formació',
      impact: 'high',
      confidence: 89,
      reason: 'Les ofertes amb "teletreball" i "formació" generen +34% més clicks'
    },
    {
      id: '2',
      field: 'descripcion',
      current: 'Experiència mínima 5 anys...',
      suggested: 'Uniu-vos al nostre equip! Experiència 3-5 anys...',
      impact: 'medium',
      confidence: 76,
      reason: 'Tons més positius increment conversions un 12%'
    },
    {
      id: '3',
      field: 'horario_publicacion',
      current: '14:00 - Dimarts',
      suggested: '10:30 - Dimecres',
      impact: 'medium',
      confidence: 82,
      reason: 'Horari òptim per a empleats públics basat en data històrica'
    }
  ])

  // Mock data for A/B tests
  const [abTests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'Títol: "Senior" vs "Especialista"',
      status: 'running',
      variants: [
        { id: 'a', name: 'Control (Senior)', traffic: 50, conversions: 23, ctr: 12.4 },
        { id: 'b', name: 'Variant (Especialista)', traffic: 50, conversions: 31, ctr: 16.7 }
      ],
      startDate: '2024-01-15',
      significance: 87
    },
    {
      id: '2',
      name: 'CTA: "Aplicar" vs "Més Info"',
      status: 'completed',
      variants: [
        { id: 'a', name: 'Control (Aplicar)', traffic: 50, conversions: 45, ctr: 11.2 },
        { id: 'b', name: 'Variant (Més Info)', traffic: 50, conversions: 52, ctr: 13.8 }
      ],
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      winner: 'b',
      significance: 95
    }
  ])

  const features = [
    {
      id: 'ai-optimization',
      name: 'Optimització IA',
      icon: Brain,
      description: 'IA analitza i suggereix millores automàtiques'
    },
    {
      id: 'ab-testing',
      name: 'A/B Testing',
      icon: Target,
      description: 'Prova diferents versions i optimitza rendiment'
    },
    {
      id: 'automation',
      name: 'Automatització',
      icon: Zap,
      description: 'Regles intel·ligents per gestionar ofertes'
    },
    {
      id: 'performance',
      name: 'Anàlisi Rendiment',
      icon: BarChart3,
      description: 'Mètriques avançades i insights profunds'
    },
    {
      id: 'templates',
      name: 'Plantilles IA',
      icon: Sparkles,
      description: 'Genera ofertes optimitzades automàticament'
    },
    {
      id: 'competitor',
      name: 'Anàlisi Competència',
      icon: Users,
      description: 'Compara amb ofertes similars del sector'
    }
  ]

  if (planEmpresa !== 'premium') {
    return (
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Gestió Intel·ligent d'Ofertes</h2>
          <p className="text-blue-100 mb-6">Optimitza automàticament amb IA i A/B testing avançat</p>
          <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all">
            Actualitzar a Premium
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Gestió Intel·ligent d'Ofertes</h2>
            <p className="text-sm text-slate-600">IA, A/B testing i automatització avançada</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-full">
            <Brain className="w-4 h-4 inline mr-1" />
            Premium IA
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === feature.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <feature.icon className="w-4 h-4" />
                {feature.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* AI Optimization Tab */}
          {activeTab === 'ai-optimization' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Suggeriments d'Optimització IA</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Analitzar Ofertes
                </button>
              </div>

              {/* AI Suggestions */}
              <div className="space-y-4">
                {aiSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          suggestion.impact === 'high' ? 'bg-green-500' :
                          suggestion.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 capitalize">
                            Optimització de {suggestion.field.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-slate-600">
                            Impacte {suggestion.impact} • {suggestion.confidence}% confiança
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.impact === 'high' ? 'bg-green-100 text-green-700' :
                          suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.impact} impact
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">Actual:</div>
                        <div className="text-sm text-slate-600 bg-white/60 p-3 rounded-lg border">
                          {suggestion.current}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">Suggeriment IA:</div>
                        <div className="text-sm text-slate-800 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                          {suggestion.suggested}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-lg">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <span className="font-medium">Per què:</span> {suggestion.reason}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-200">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Aplicar Suggeriment
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Provar A/B
                      </button>
                      <button className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm">
                        Descartar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Performance Summary */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-800 mb-4">Rendiment de la IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-slate-600">CTR promig</div>
                    <div className="text-xs text-slate-500">amb suggeriments aplicats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-slate-600">Precisió IA</div>
                    <div className="text-xs text-slate-500">prediccions encertades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">156h</div>
                    <div className="text-sm text-slate-600">Temps estalviat</div>
                    <div className="text-xs text-slate-500">en optimització manual</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* A/B Testing Tab */}
          {activeTab === 'ab-testing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Tests A/B Actius</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Crear Test A/B
                </button>
              </div>

              <div className="space-y-4">
                {abTests.map(test => (
                  <div key={test.id} className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          test.status === 'running' ? 'bg-green-500' :
                          test.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{test.name}</h4>
                          <div className="text-sm text-slate-600">
                            {test.startDate} {test.endDate && `- ${test.endDate}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          test.status === 'running' ? 'bg-green-100 text-green-700' :
                          test.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {test.status}
                        </span>
                        {test.significance && (
                          <span className="text-sm text-slate-600">
                            {test.significance}% significança
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {test.variants.map(variant => (
                        <div key={variant.id} className={`p-4 rounded-lg border-2 ${
                          test.winner === variant.id ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-slate-800">{variant.name}</div>
                            {test.winner === variant.id && (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="text-slate-500">Tràfic</div>
                              <div className="font-semibold">{variant.traffic}%</div>
                            </div>
                            <div>
                              <div className="text-slate-500">CTR</div>
                              <div className="font-semibold">{variant.ctr}%</div>
                            </div>
                            <div>
                              <div className="text-slate-500">Conv.</div>
                              <div className="font-semibold">{variant.conversions}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {test.status === 'running' && (
                        <>
                          <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700">
                            Pausar Test
                          </button>
                          <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                            Finalitzar
                          </button>
                        </>
                      )}
                      {test.status === 'completed' && test.winner && (
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          Aplicar Guanyador
                        </button>
                      )}
                      <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300">
                        Veure Detalls
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* A/B Testing Templates */}
              <div className="bg-indigo-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-800 mb-4">Plantilles de Test Populars</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    'Títol: Llenguatge tècnic vs Natural',
                    'CTA: "Aplicar ara" vs "Més informació"',
                    'Preu: Mostrar vs Ocultar inicialment',
                    'Imatges: Professional vs Informal',
                    'Horari: Matí vs Tarda',
                    'Descripció: Llarga vs Breu'
                  ].map((template, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="font-medium text-slate-800 text-sm mb-1">{template}</div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                        Crear test →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab === 'automation' && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Automatització d'Ofertes</h3>
              <p className="text-slate-600">Regles intel·ligents per optimitzar automàticament</p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibent text-slate-800 mb-2">Anàlisi de Rendiment</h3>
              <p className="text-slate-600">Mètriques avançades i insights profunds</p>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Plantilles IA</h3>
              <p className="text-slate-600">Generació automàtica d'ofertes optimitzades</p>
            </div>
          )}

          {activeTab === 'competitor' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Anàlisi de Competència</h3>
              <p className="text-slate-600">Compara amb ofertes similars del sector</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}