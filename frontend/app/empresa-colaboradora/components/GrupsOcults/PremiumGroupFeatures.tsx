'use client'

import { useState, useEffect } from 'react'
import {
  Crown, Shield, Zap, Users, Brain, Lock, Eye,
  Settings, Target, BarChart3, Clock, MessageSquare,
  Calendar, Award, Star, TrendingUp, Activity,
  Plus, Edit3, Save, X, Info, CheckCircle,
  AlertTriangle, Bell, Filter, Search, Download,
  Upload, Share2, Link2, Mail, Phone, Globe,
  Package, CreditCard, Sparkles, Database, Cloud
} from 'lucide-react'

interface PremiumGroupFeaturesProps {
  empresaId: string
  planEmpresa: 'basic' | 'premium'
  groupId?: string
}

interface AIModeration {
  enabled: boolean
  sensitivity: 'low' | 'medium' | 'high'
  autoActions: boolean
  contentFilters: string[]
  languageAnalysis: boolean
  sentimentAnalysis: boolean
}

interface AdvancedAnalytics {
  memberEngagement: number
  contentQuality: number
  networkGrowth: number
  conversationHealth: number
  influenceScore: number
}

interface GroupAutomation {
  id: string
  name: string
  trigger: string
  action: string
  status: 'active' | 'paused'
  executions: number
}

interface ExclusiveContent {
  id: string
  title: string
  type: 'webinar' | 'document' | 'video' | 'masterclass'
  views: number
  rating: number
  exclusive: boolean
}

export default function PremiumGroupFeatures({ empresaId, planEmpresa, groupId }: PremiumGroupFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState('ai-moderation')
  const [isConfiguring, setIsConfiguring] = useState(false)
  
  // Mock data - En producción vendría de APIs
  const [aiModerationSettings, setAiModerationSettings] = useState<AIModeration>({
    enabled: true,
    sensitivity: 'medium',
    autoActions: true,
    contentFilters: ['spam', 'inappropriate', 'off-topic', 'duplicate'],
    languageAnalysis: true,
    sentimentAnalysis: true
  })
  
  const [analytics, setAnalytics] = useState<AdvancedAnalytics>({
    memberEngagement: 87,
    contentQuality: 92,
    networkGrowth: 23,
    conversationHealth: 89,
    influenceScore: 76
  })
  
  const [automations, setAutomations] = useState<GroupAutomation[]>([
    {
      id: '1',
      name: 'Benvinguda Automàtica',
      trigger: 'Nou membre s\'uneix',
      action: 'Enviar missatge de benvinguda personalitzat',
      status: 'active',
      executions: 45
    },
    {
      id: '2',
      name: 'Notificació Inactivitat',
      trigger: 'Membre inactiu >30 dies',
      action: 'Enviar recordatori de participació',
      status: 'active',
      executions: 12
    },
    {
      id: '3',
      name: 'Promoció Expert',
      trigger: 'Alt engagement + qualitat',
      action: 'Suggerir rol de moderador',
      status: 'paused',
      executions: 3
    }
  ])
  
  const [exclusiveContent, setExclusiveContent] = useState<ExclusiveContent[]>([
    {
      id: '1',
      title: 'Masterclass: Lideratge Tecnològic 2025',
      type: 'masterclass',
      views: 234,
      rating: 4.8,
      exclusive: true
    },
    {
      id: '2',
      title: 'Informe: Tendències Ciberseguretat',
      type: 'document',
      views: 456,
      rating: 4.6,
      exclusive: true
    },
    {
      id: '3',
      title: 'Webinar: IA en la Gestió de Talent',
      type: 'webinar',
      views: 178,
      rating: 4.9,
      exclusive: true
    }
  ])

  const features = [
    { 
      id: 'ai-moderation', 
      name: 'Moderació IA', 
      icon: Brain,
      description: 'Moderació intel·ligent automàtica'
    },
    { 
      id: 'advanced-analytics', 
      name: 'Analytics Avançats', 
      icon: BarChart3,
      description: 'Mètriques de grup en temps real'
    },
    { 
      id: 'automation', 
      name: 'Automatització', 
      icon: Zap,
      description: 'Fluxos de treball automàtics'
    },
    { 
      id: 'exclusive-content', 
      name: 'Contingut Exclusiu', 
      icon: Crown,
      description: 'Recursos premium per al grup'
    },
    { 
      id: 'white-label', 
      name: 'Marca Personalitzada', 
      icon: Package,
      description: 'Branding personalitzat del grup'
    },
    { 
      id: 'premium-support', 
      name: 'Suport Premium', 
      icon: MessageSquare,
      description: 'Atenció prioritària 24/7'
    }
  ]

  const getContentTypeIcon = (type: string) => {
    switch(type) {
      case 'webinar': return <Globe className="w-4 h-4" />
      case 'document': return <Database className="w-4 h-4" />
      case 'video': return <Eye className="w-4 h-4" />
      case 'masterclass': return <Award className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getAutomationStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-700 bg-green-100 border-green-200' : 'text-gray-700 bg-gray-100 border-gray-200'
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl border border-amber-200/60 p-6">
      {/* Header Premium */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Funcions Premium per a Grups
              <span className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs rounded-full">
                PREMIUM
              </span>
            </h2>
            <p className="text-slate-600">Eines avançades per a la gestió de grups ocults</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          {isConfiguring ? 'Finalitzar' : 'Configurar'}
        </button>
      </div>

      {/* Feature Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {features.map(feature => {
          const Icon = feature.icon
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeFeature === feature.id
                  ? 'bg-white text-orange-700 shadow-md border border-orange-200'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.name}</span>
            </button>
          )
        })}
      </div>

      {/* Feature Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
        
        {/* AI Moderation */}
        {activeFeature === 'ai-moderation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-600" />
                Moderació Intel·ligent amb IA
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Activat:</span>
                <button
                  onClick={() => setAiModerationSettings({...aiModerationSettings, enabled: !aiModerationSettings.enabled})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    aiModerationSettings.enabled ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    aiModerationSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {aiModerationSettings.enabled && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Moderation Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Configuració de Moderació</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 block mb-2">Sensibilitat</label>
                      <select 
                        value={aiModerationSettings.sensitivity}
                        onChange={(e) => setAiModerationSettings({
                          ...aiModerationSettings, 
                          sensitivity: e.target.value as 'low' | 'medium' | 'high'
                        })}
                        disabled={!isConfiguring}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="low">Baixa - Només contingut clarament inadequat</option>
                        <option value="medium">Mitjana - Equilibri entre precisió i cobertura</option>
                        <option value="high">Alta - Màxima protecció del grup</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600 block mb-2">Filtres de Contingut</label>
                      <div className="space-y-2">
                        {['spam', 'inappropriate', 'off-topic', 'duplicate', 'promotional'].map(filter => (
                          <label key={filter} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={aiModerationSettings.contentFilters.includes(filter)}
                              onChange={(e) => {
                                const filters = e.target.checked 
                                  ? [...aiModerationSettings.contentFilters, filter]
                                  : aiModerationSettings.contentFilters.filter(f => f !== filter)
                                setAiModerationSettings({...aiModerationSettings, contentFilters: filters})
                              }}
                              disabled={!isConfiguring}
                              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm text-slate-700 capitalize">{filter}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analytics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Anàlisi Intel·ligent</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Contingut processat avui</span>
                        <span className="text-lg font-bold text-slate-800">247</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Accions automàtiques</span>
                        <span className="text-lg font-bold text-green-700">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Falsos positius</span>
                        <span className="text-lg font-bold text-orange-700">2</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={aiModerationSettings.languageAnalysis}
                          onChange={(e) => setAiModerationSettings({
                            ...aiModerationSettings, 
                            languageAnalysis: e.target.checked
                          })}
                          disabled={!isConfiguring}
                          className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-700">Anàlisi de llengua</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={aiModerationSettings.sentimentAnalysis}
                          onChange={(e) => setAiModerationSettings({
                            ...aiModerationSettings, 
                            sentimentAnalysis: e.target.checked
                          })}
                          disabled={!isConfiguring}
                          className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-700">Anàlisi de sentiment</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Analytics */}
        {activeFeature === 'advanced-analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Analytics Avançats del Grup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="col-span-full">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-700">{analytics.memberEngagement}%</div>
                    <div className="text-xs text-blue-600">Engagement</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-700">{analytics.contentQuality}%</div>
                    <div className="text-xs text-green-600">Qualitat</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-700">+{analytics.networkGrowth}%</div>
                    <div className="text-xs text-purple-600">Creixement</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-orange-700">{analytics.conversationHealth}%</div>
                    <div className="text-xs text-orange-600">Salut Converses</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <div className="text-2xl font-bold text-red-700">{analytics.influenceScore}</div>
                    <div className="text-xs text-red-600">Influència</div>
                  </div>
                </div>
              </div>

              {/* Activity Heatmap */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-3">Activitat Setmanal</h4>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({length: 7}).map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-slate-500 mb-1">
                        {['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'][i]}
                      </div>
                      <div className={`h-8 rounded ${
                        Math.random() > 0.3 ? 'bg-orange-200' : 'bg-orange-100'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-3">Top Contributors</h4>
                <div className="space-y-2">
                  {['Joan M.', 'Maria P.', 'Pere R.'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{name}</span>
                      <span className="text-sm font-bold text-slate-800">{95-i*10}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Trends */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-3">Tendències</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Missatges</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">+23%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Nous membres</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Reaccions</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">+34%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Automation */}
        {activeFeature === 'automation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Automatització de Grups
              </h3>
              {isConfiguring && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Automatització
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {automations.map(automation => (
                <div key={automation.id} className="p-4 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">{automation.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        <strong>Trigger:</strong> {automation.trigger}
                      </p>
                      <p className="text-sm text-slate-600">
                        <strong>Acció:</strong> {automation.action}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getAutomationStatusColor(automation.status)}`}>
                      {automation.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {automation.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <span>Execucions: <strong>{automation.executions}</strong></span>
                  </div>

                  {isConfiguring && (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                      <button className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors">
                        <Edit3 className="w-4 h-4 inline mr-1" />
                        Editar
                      </button>
                      <button 
                        className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          automation.status === 'active' 
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {automation.status === 'active' ? 'Pausar' : 'Activar'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exclusive Content */}
        {activeFeature === 'exclusive-content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-600" />
                Contingut Exclusiu Premium
              </h3>
              {isConfiguring && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Afegir Contingut
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exclusiveContent.map(content => (
                <div key={content.id} className="p-4 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(content.type)}
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{content.type}</span>
                    </div>
                    {content.exclusive && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Exclusiu
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold text-slate-800 mb-2">{content.title}</h4>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{content.views} visualitzacions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>{content.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Veure
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other features placeholders */}
        {activeFeature === 'white-label' && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Marca Personalitzada</h3>
            <p className="text-slate-600">Personalitza l'aparença i la marca del grup</p>
          </div>
        )}

        {activeFeature === 'premium-support' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Suport Premium</h3>
            <p className="text-slate-600">Atenció prioritària per a gestors de grups premium</p>
          </div>
        )}
      </div>
    </div>
  )
}