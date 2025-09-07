'use client'

import { useState, useEffect } from 'react'
import {
  Database, Shield, Zap, Globe, Users, Target,
  TrendingUp, Calendar, Clock, AlertTriangle,
  CheckCircle, Settings, Download, Upload,
  Link, Code, Eye, Lock, Unlock, Crown, Star,
  BarChart3, PieChart, Activity, Brain, Award,
  RefreshCw, Filter, Search, Send, Bell
} from 'lucide-react'

interface EnterpriseAnalyticsProps {
  empresaId: string
  planEmpresa: 'basic' | 'premium'
}

export default function EnterpriseFeatures({ empresaId, planEmpresa }: EnterpriseAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('api')
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'Dashboard Principal',
      key: 'ak_live_...',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      permissions: ['read', 'analytics'],
      status: 'active'
    }
  ])
  const [webhooks, setWebhooks] = useState([
    {
      id: '1',
      url: 'https://dashboard.empresa.com/webhook',
      events: ['offer_view', 'conversion'],
      status: 'active',
      lastTriggered: '2024-01-20T10:30:00Z'
    }
  ])
  const [automationRules, setAutomationRules] = useState([
    {
      id: '1',
      name: 'Optimitzador de Horaris',
      trigger: 'low_ctr_detected',
      action: 'adjust_posting_schedule',
      status: 'active',
      success_rate: 94.2,
      last_run: '2024-01-20T09:15:00Z'
    },
    {
      id: '2',
      name: 'Alert CTR Baix',
      trigger: 'ctr_below_threshold',
      action: 'send_notification',
      status: 'active',
      success_rate: 100,
      last_run: '2024-01-20T11:45:00Z'
    }
  ])
  const [customDashboards, setCustomDashboards] = useState([
    {
      id: '1',
      name: 'KPIs Executius',
      widgets: 12,
      shared_with: ['CEO', 'Head of Marketing'],
      last_modified: '2024-01-19',
      views_this_month: 247
    },
    {
      id: '2',
      name: 'Anàlisi Sectorial',
      widgets: 8,
      shared_with: ['Strategy Team'],
      last_modified: '2024-01-18',
      views_this_month: 156
    }
  ])

  const enterpriseFeatures = [
    {
      id: 'api',
      name: 'API i Integracions',
      icon: Database,
      description: 'Connecta les teves eines amb la nostra API REST',
      isPremium: true
    },
    {
      id: 'automation',
      name: 'Automatització IA',
      icon: Zap,
      description: 'Regles intel·ligents que optimitzen automàticament',
      isPremium: true
    },
    {
      id: 'custom-dashboards',
      name: 'Dashboards Personalitzats',
      icon: BarChart3,
      description: 'Crea vistes personalitzades per a cada equip',
      isPremium: true
    },
    {
      id: 'advanced-security',
      name: 'Seguretat Avançada',
      icon: Shield,
      description: 'SSO, auditoria i control d\'accés granular',
      isPremium: true
    },
    {
      id: 'white-label',
      name: 'White Label',
      icon: Eye,
      description: 'Personalitza la interfície amb la teva marca',
      isPremium: true
    },
    {
      id: 'dedicated-support',
      name: 'Suport Dedicat',
      icon: Users,
      description: 'Account Manager i suport tècnic 24/7',
      isPremium: true
    }
  ]

  const generateNewApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `ak_live_${Math.random().toString(36).substring(2, 15)}...`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: ['read'],
      status: 'active' as const
    }
    setApiKeys([...apiKeys, newKey])
  }

  const createAutomationRule = () => {
    const newRule = {
      id: Date.now().toString(),
      name: 'Nova Regla',
      trigger: 'custom',
      action: 'notify',
      status: 'draft' as const,
      success_rate: 0,
      last_run: null
    }
    setAutomationRules([...automationRules, newRule])
  }

  if (planEmpresa !== 'premium') {
    return (
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Funcionalitats Enterprise</h2>
          <p className="text-purple-100 mb-6">Accedeix a eines avançades d'integració i automatització</p>
          <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all">
            Actualitzar a Premium Enterprise
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
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Funcionalitats Enterprise</h2>
            <p className="text-sm text-slate-600">Eines avançades per integrar i automatitzar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-full">
            <Star className="w-4 h-4 inline mr-1" />
            Premium Enterprise
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {enterpriseFeatures.map(feature => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === feature.id
                    ? 'border-purple-600 text-purple-600'
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
          {/* API & Integrations Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">API Keys i Integracions</h3>
                <button
                  onClick={generateNewApiKey}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Nova API Key
                </button>
              </div>

              {/* API Keys Table */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-medium text-slate-800 mb-4">Claus API Actives</h4>
                <div className="space-y-3">
                  {apiKeys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">{key.name}</div>
                        <div className="text-sm text-slate-500 font-mono">{key.key}</div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span>Created: {key.created}</span>
                          {key.lastUsed && <span>Last used: {key.lastUsed}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          key.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {key.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhooks */}
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-800">Webhooks</h4>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg">
                    Afegir Webhook
                  </button>
                </div>
                <div className="space-y-3">
                  {webhooks.map(webhook => (
                    <div key={webhook.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800 font-mono text-sm">{webhook.url}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>Events: {webhook.events.join(', ')}</span>
                          <span>•</span>
                          <span>Last: {new Date(webhook.lastTriggered).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          {webhook.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Documentation Quick Access */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Code className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-slate-800 mb-1">Documentació API</h4>
                  <p className="text-sm text-slate-600 mb-3">Endpoints, exemples i referència completa</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Veure Docs →
                  </button>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <Link className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold text-slate-800 mb-1">SDKs Oficials</h4>
                  <p className="text-sm text-slate-600 mb-3">Python, Node.js, PHP i més</p>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Descarregar →
                  </button>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Activity className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-semibold text-slate-800 mb-1">Monitor d'API</h4>
                  <p className="text-sm text-slate-600 mb-3">Logs, mètriques i alertes en temps real</p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Monitor →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Automatització Intel·ligent</h3>
                <button
                  onClick={createAutomationRule}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Nova Regla
                </button>
              </div>

              {/* Active Rules */}
              <div className="grid gap-4">
                {automationRules.map(rule => (
                  <div key={rule.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          rule.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
                        }`}></div>
                        <h4 className="font-semibold text-slate-800">{rule.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rule.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">
                          Èxit: {rule.success_rate}%
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 mb-1">Trigger</div>
                        <div className="font-medium text-slate-800 capitalize">
                          {rule.trigger.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1">Acció</div>
                        <div className="font-medium text-slate-800 capitalize">
                          {rule.action.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    {rule.last_run && (
                      <div className="mt-3 text-xs text-slate-500">
                        Últim execució: {new Date(rule.last_run).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Automation Templates */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4">Plantilles d'Automatització Populars</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Optimització CTR Automàtica', description: 'Ajusta horaris quan CTR baixa del 8%' },
                    { name: 'Alerta Competència', description: 'Notifica quan competidors publiquen ofertes similars' },
                    { name: 'Pausar Ofertes Pobres', description: 'Pausa ofertes amb Quality Score < 60' },
                    { name: 'Incrementar Pressupost', description: 'Augmenta pressupost quan CTR > 15%' }
                  ].map((template, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <div className="font-medium text-slate-800 text-sm">{template.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{template.description}</div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium mt-2">
                        Usar plantilla →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Dashboards Tab */}
          {activeTab === 'custom-dashboards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Dashboards Personalitzats</h3>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Crear Dashboard
                </button>
              </div>

              <div className="grid gap-4">
                {customDashboards.map(dashboard => (
                  <div key={dashboard.id} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{dashboard.name}</h4>
                          <div className="text-sm text-slate-600">{dashboard.widgets} widgets actius</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">
                          {dashboard.views_this_month} views aquest mes
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-slate-500">Compartit amb: </span>
                        <span className="font-medium text-slate-800">
                          {dashboard.shared_with.join(', ')}
                        </span>
                      </div>
                      <div className="text-slate-500">
                        Modificat: {dashboard.last_modified}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <button className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
                        Obrir
                      </button>
                      <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300">
                        Editar
                      </button>
                      <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300">
                        Compartir
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dashboard Templates */}
              <div className="bg-emerald-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-800 mb-4">Plantilles de Dashboard</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { name: 'Executive Summary', widgets: ['KPIs', 'Trends', 'Alerts'], icon: Award },
                    { name: 'Marketing Performance', widgets: ['CTR', 'Conversions', 'ROI'], icon: Target },
                    { name: 'Operational Metrics', widgets: ['Activity', 'Usage', 'Health'], icon: Activity }
                  ].map((template, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer">
                      <template.icon className="w-6 h-6 text-emerald-600 mb-2" />
                      <div className="font-medium text-slate-800 text-sm mb-1">{template.name}</div>
                      <div className="text-xs text-slate-600 mb-2">
                        Inclou: {template.widgets.join(', ')}
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                        Usar plantilla →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab === 'advanced-security' && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Seguretat Avançada</h3>
              <p className="text-slate-600">Funcionalitat en desenvolupament</p>
            </div>
          )}

          {activeTab === 'white-label' && (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">White Label</h3>
              <p className="text-slate-600">Personalització de marca disponible aviat</p>
            </div>
          )}

          {activeTab === 'dedicated-support' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Suport Dedicat</h3>
              <p className="text-slate-600">Account Manager assignat per a plans Enterprise</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}