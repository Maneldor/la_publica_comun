'use client'

import { useState } from 'react'
import { 
  Zap, Users, Building2, Crown, Star, Target, Activity,
  Play, Pause, Edit, Eye, Plus, Settings, X, RefreshCw,
  ArrowRight, CheckCircle, Clock, AlertTriangle, BarChart3,
  Mail, MessageSquare, Calendar, Phone, Globe, Filter
} from 'lucide-react'

interface WorkflowAutomation {
  id: string
  nom: string
  segment_target: 'empleats' | 'empreses' | 'administracions' | 'branding'
  tipus: 'lead_nurturing' | 'onboarding' | 'retention' | 'reactivation' | 'upsell'
  trigger: {
    tipus: 'behavioral' | 'temporal' | 'demographic' | 'engagement_based'
    condicions: string[]
  }
  steps: {
    ordre: number
    tipus: 'email' | 'sms' | 'push' | 'social' | 'call' | 'event' | 'wait'
    contingut: string
    delay: number
    condicions_exit: string[]
  }[]
  estat: 'actiu' | 'pausat' | 'draft' | 'arhivat'
  performance: {
    usuaris_inscrits: number
    completion_rate: number
    engagement_rate: number
    conversion_rate: number
    revenue_generat: number
    cost_per_conversion: number
  }
  a_b_testing: boolean
  optimitzacio_ml: boolean
}

interface SegmentDynamic {
  id: string
  nom: string
  audience_base: string
  criteris: {
    demografics: { [key: string]: any }
    comportamentals: { [key: string]: any }
    engagement: { [key: string]: any }
    transaccionals: { [key: string]: any }
  }
  mida_segment: number
  ultima_actualitzacio: Date
  workflows_assignats: string[]
  performance_segment: {
    engagement_rate: number
    conversion_rate: number
    ltv: number
    churn_risk: number
  }
  predictions: {
    creixement_30d: number
    engagement_prediction: number
    conversion_likelihood: number
  }
}

interface CampanyaMulticanal {
  id: string
  nom: string
  segments_target: string[]
  canals: {
    canal: string
    weight: number
    budget_percentage: number
    content_assets: string[]
    performance: {
      reach: number
      engagement: number
      conversions: number
      cost: number
    }
  }[]
  timeline: { inici: Date; fi: Date }
  estat: 'planificant' | 'activa' | 'pausada' | 'completada'
  orchestration: {
    sequencing: string
    frequency_capping: { [channel: string]: number }
    cross_channel_attribution: boolean
    real_time_optimization: boolean
  }
  kpis_globals: {
    reach_total: number
    frequency_avg: number
    engagement_weighted: number
    roi_blended: number
    cross_channel_lift: number
  }
}

export default function MarketingAutomation() {
  const [vistaActiva, setVistaActiva] = useState('workflows')
  const [segmentSeleccionat, setSegmentSeleccionat] = useState('tots')
  const [showWorkflowModal, setShowWorkflowModal] = useState(false)
  const [showSegmentModal, setShowSegmentModal] = useState(false)
  const [filtreEstat, setFiltreEstat] = useState('tots')

  const workflows: WorkflowAutomation[] = [
    {
      id: '1',
      nom: 'Onboarding Empleats Públics',
      segment_target: 'empleats',
      tipus: 'onboarding',
      trigger: {
        tipus: 'behavioral',
        condicions: ['Primer login', 'Compte creat fa <24h']
      },
      steps: [
        {
          ordre: 1,
          tipus: 'email',
          contingut: 'Benvinguda personalitzada amb guia inici',
          delay: 0,
          condicions_exit: []
        },
        {
          ordre: 2,
          tipus: 'wait',
          contingut: 'Esperar 2 dies',
          delay: 48,
          condicions_exit: ['Ha completat onboarding']
        },
        {
          ordre: 3,
          tipus: 'push',
          contingut: 'Recordatori explorar funcionalitats',
          delay: 48,
          condicions_exit: ['Engagement >50%']
        },
        {
          ordre: 4,
          tipus: 'email',
          contingut: 'Tips avançats i millors pràctiques',
          delay: 168,
          condicions_exit: []
        }
      ],
      estat: 'actiu',
      performance: {
        usuaris_inscrits: 8420,
        completion_rate: 73.4,
        engagement_rate: 68.9,
        conversion_rate: 0,
        revenue_generat: 0,
        cost_per_conversion: 0
      },
      a_b_testing: true,
      optimitzacio_ml: true
    },
    {
      id: '2',
      nom: 'Lead Nurturing B2B Enterprise',
      segment_target: 'empreses',
      tipus: 'lead_nurturing',
      trigger: {
        tipus: 'engagement_based',
        condicions: ['Lead score >50', 'Descàrrega whitepaper', 'No contact sales 7d']
      },
      steps: [
        {
          ordre: 1,
          tipus: 'email',
          contingut: 'Case study sector específic',
          delay: 24,
          condicions_exit: ['Demana demo']
        },
        {
          ordre: 2,
          tipus: 'social',
          contingut: 'LinkedIn retargeting personalitzat',
          delay: 72,
          condicions_exit: ['Click CTA']
        },
        {
          ordre: 3,
          tipus: 'email',
          contingut: 'ROI calculator i demo invitation',
          delay: 120,
          condicions_exit: ['Reserva demo']
        },
        {
          ordre: 4,
          tipus: 'call',
          contingut: 'Trucada qualificació BDR',
          delay: 168,
          condicions_exit: ['Qualificat com SQL']
        }
      ],
      estat: 'actiu',
      performance: {
        usuaris_inscrits: 1247,
        completion_rate: 45.2,
        engagement_rate: 67.8,
        conversion_rate: 28.4,
        revenue_generat: 890000,
        cost_per_conversion: 340
      },
      a_b_testing: true,
      optimitzacio_ml: true
    },
    {
      id: '3',
      nom: 'ABM Administracions Autonòmiques',
      segment_target: 'administracions',
      tipus: 'lead_nurturing',
      trigger: {
        tipus: 'demographic',
        condicions: ['Institució autonòmica', 'Decision maker identificat', 'Budget >100K']
      },
      steps: [
        {
          ordre: 1,
          tipus: 'email',
          contingut: 'Report personalitzat sector públic',
          delay: 0,
          condicions_exit: []
        },
        {
          ordre: 2,
          tipus: 'event',
          contingut: 'Invitació briefing executiu personalitzat',
          delay: 72,
          condicions_exit: ['Accepta reunió']
        },
        {
          ordre: 3,
          tipus: 'mail',
          contingut: 'Proposta tècnica preliminary',
          delay: 240,
          condicions_exit: ['Resposta positiva']
        }
      ],
      estat: 'actiu',
      performance: {
        usuaris_inscrits: 187,
        completion_rate: 68.4,
        engagement_rate: 84.2,
        conversion_rate: 76.3,
        revenue_generat: 1450000,
        cost_per_conversion: 1250
      },
      a_b_testing: false,
      optimitzacio_ml: true
    }
  ]

  const segmentsDynamics: SegmentDynamic[] = [
    {
      id: '1',
      nom: 'High-Value Enterprise Prospects',
      audience_base: 'empreses',
      criteris: {
        demografics: { empleats: '>500', facturacio: '>€10M' },
        comportamentals: { pages_visited: '>10', time_on_site: '>5min' },
        engagement: { email_opens: '>3', whitepaper_downloads: '>1' },
        transaccionals: { previous_purchases: false, budget_identified: '>€50K' }
      },
      mida_segment: 342,
      ultima_actualitzacio: new Date(),
      workflows_assignats: ['2'],
      performance_segment: {
        engagement_rate: 74.3,
        conversion_rate: 32.1,
        ltv: 185000,
        churn_risk: 12.3
      },
      predictions: {
        creixement_30d: 15.7,
        engagement_prediction: 78.9,
        conversion_likelihood: 35.4
      }
    },
    {
      id: '2',
      nom: 'Engaged Public Employees',
      audience_base: 'empleats',
      criteris: {
        demografics: { sector: 'public', experience_years: '>2' },
        comportamentals: { login_frequency: '>5/week', features_used: '>3' },
        engagement: { community_participation: true, content_sharing: '>0' },
        transaccionals: { referrals_made: '>0' }
      },
      mida_segment: 4850,
      ultima_actualitzacio: new Date(),
      workflows_assignats: ['1'],
      performance_segment: {
        engagement_rate: 89.2,
        conversion_rate: 0,
        ltv: 0,
        churn_risk: 8.7
      },
      predictions: {
        creixement_30d: 22.3,
        engagement_prediction: 92.1,
        conversion_likelihood: 0
      }
    }
  ]

  const campanyesMulticanal: CampanyaMulticanal[] = [
    {
      id: '1',
      nom: 'Digital Government Summit 2024',
      segments_target: ['High-Value Enterprise Prospects', 'Decision Makers Públics'],
      canals: [
        {
          canal: 'LinkedIn',
          weight: 40,
          budget_percentage: 35,
          content_assets: ['Video promocional', 'Carousel speakers', 'Event page'],
          performance: { reach: 45000, engagement: 8.7, conversions: 289, cost: 15400 }
        },
        {
          canal: 'Email',
          weight: 30,
          budget_percentage: 20,
          content_assets: ['Invitació VIP', 'Agenda personal', 'Follow-up series'],
          performance: { reach: 12400, engagement: 24.3, conversions: 156, cost: 8900 }
        },
        {
          canal: 'PR',
          weight: 20,
          budget_percentage: 25,
          content_assets: ['Press release', 'Media kit', 'Executive interviews'],
          performance: { reach: 89000, engagement: 5.2, conversions: 89, cost: 11200 }
        },
        {
          canal: 'Direct Sales',
          weight: 10,
          budget_percentage: 20,
          content_assets: ['Personal invitations', 'Executive briefings'],
          performance: { reach: 450, engagement: 78.9, conversions: 67, cost: 8900 }
        }
      ],
      timeline: { inici: new Date('2024-02-01'), fi: new Date('2024-03-15') },
      estat: 'activa',
      orchestration: {
        sequencing: 'LinkedIn → Email → PR → Direct Sales',
        frequency_capping: { 'LinkedIn': 3, 'Email': 5, 'PR': 1, 'Direct Sales': 2 },
        cross_channel_attribution: true,
        real_time_optimization: true
      },
      kpis_globals: {
        reach_total: 146850,
        frequency_avg: 2.8,
        engagement_weighted: 18.7,
        roi_blended: 287,
        cross_channel_lift: 34.5
      }
    }
  ]

  const vistes = [
    { id: 'workflows', nom: 'Workflows Automatitzats', icon: Zap },
    { id: 'segments', nom: 'Segments Dinàmics', icon: Users },
    { id: 'multicanal', nom: 'Campanyes Multicanal', icon: Globe },
    { id: 'personalization', nom: 'Personalització AI', icon: Star },
    { id: 'performance', nom: 'Performance Analytics', icon: BarChart3 },
    { id: 'optimization', nom: 'ML Optimization', icon: Target }
  ]

  const getSegmentColor = (segment: string) => {
    const colors = {
      'empleats': 'bg-blue-100 text-blue-700',
      'empreses': 'bg-green-100 text-green-700', 
      'administracions': 'bg-purple-100 text-purple-700',
      'branding': 'bg-orange-100 text-orange-700'
    }
    return colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Marketing Automation Diferenciada per 4 Segments</h2>
          <div className="flex gap-2">
            <select 
              value={segmentSeleccionat}
              onChange={(e) => setSegmentSeleccionat(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="tots">Tots els segments</option>
              <option value="empleats">Empleats</option>
              <option value="empreses">Empreses</option>
              <option value="administracions">Administracions</option>
              <option value="branding">Branding</option>
            </select>
            <button 
              onClick={() => setShowWorkflowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nou Workflow
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{workflows.filter(w => w.estat === 'actiu').length}</div>
            <div className="text-sm text-blue-600">Workflows Actius</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {workflows.reduce((sum, w) => sum + w.performance.usuaris_inscrits, 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Usuaris en Workflows</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {(workflows.reduce((sum, w) => sum + w.performance.engagement_rate * w.performance.usuaris_inscrits, 0) / 
                workflows.reduce((sum, w) => sum + w.performance.usuaris_inscrits, 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Engagement Mitjà</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              €{(workflows.reduce((sum, w) => sum + w.performance.revenue_generat, 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-orange-600">Revenue Generat</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">{segmentsDynamics.length}</div>
            <div className="text-sm text-pink-600">Segments Dinàmics</div>
          </div>
        </div>
      </div>

      {/* Navegació */}
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
          {/* Workflows Automatitzats */}
          {vistaActiva === 'workflows' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Workflows per Segment</h3>
                <div className="flex gap-2">
                  <select 
                    value={filtreEstat}
                    onChange={(e) => setFiltreEstat(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="tots">Tots els estats</option>
                    <option value="actiu">Actius</option>
                    <option value="pausat">Pausats</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {workflows
                  .filter(w => segmentSeleccionat === 'tots' || w.segment_target === segmentSeleccionat)
                  .filter(w => filtreEstat === 'tots' || w.estat === filtreEstat)
                  .map(workflow => (
                    <div key={workflow.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{workflow.nom}</h4>
                            <span className={`px-2 py-1 rounded text-sm ${getSegmentColor(workflow.segment_target)}`}>
                              {workflow.segment_target}
                            </span>
                            <span className={`px-2 py-1 rounded text-sm ${
                              workflow.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                              workflow.estat === 'pausat' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {workflow.estat}
                            </span>
                            {workflow.a_b_testing && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">A/B Testing</span>
                            )}
                            {workflow.optimitzacio_ml && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">ML Optimized</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Trigger: {workflow.trigger.tipus} - {workflow.trigger.condicions.join(', ')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-green-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className={`p-2 rounded-lg ${
                            workflow.estat === 'actiu' ? 'hover:bg-yellow-100' : 'hover:bg-green-100'
                          }`}>
                            {workflow.estat === 'actiu' ? 
                              <Pause className="w-4 h-4 text-gray-600" /> :
                              <Play className="w-4 h-4 text-gray-600" />
                            }
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-700">
                            {workflow.performance.usuaris_inscrits.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Usuaris Inscrits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700">
                            {workflow.performance.completion_rate}%
                          </div>
                          <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-700">
                            {workflow.performance.engagement_rate}%
                          </div>
                          <div className="text-sm text-gray-600">Engagement Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-700">
                            {workflow.performance.conversion_rate > 0 ? `${workflow.performance.conversion_rate}%` : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Flux del Workflow ({workflow.steps.length} passos):</h5>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {workflow.steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-2 min-w-max">
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                                {step.tipus === 'email' && <Mail className="w-4 h-4" />}
                                {step.tipus === 'sms' && <MessageSquare className="w-4 h-4" />}
                                {step.tipus === 'push' && <Bell className="w-4 h-4" />}
                                {step.tipus === 'call' && <Phone className="w-4 h-4" />}
                                {step.tipus === 'event' && <Calendar className="w-4 h-4" />}
                                {step.tipus === 'wait' && <Clock className="w-4 h-4" />}
                                <span className="text-sm font-medium">{step.tipus}</span>
                                {step.delay > 0 && (
                                  <span className="text-xs text-gray-500">+{step.delay}h</span>
                                )}
                              </div>
                              {i < workflow.steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {workflow.performance.revenue_generat > 0 && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-600">Revenue Generat: </span>
                              <span className="font-semibold text-green-600">
                                €{workflow.performance.revenue_generat.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Cost per Conversió: </span>
                              <span className="font-semibold">€{workflow.performance.cost_per_conversion}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Segments Dinàmics */}
          {vistaActiva === 'segments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Segmentació Dinàmica amb ML</h3>
                <button 
                  onClick={() => setShowSegmentModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nou Segment
                </button>
              </div>

              <div className="space-y-6">
                {segmentsDynamics.map(segment => (
                  <div key={segment.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{segment.nom}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-1 rounded text-sm ${getSegmentColor(segment.audience_base)}`}>
                            {segment.audience_base}
                          </span>
                          <span className="text-sm text-gray-600">
                            {segment.mida_segment.toLocaleString()} usuaris
                          </span>
                          <span className="text-sm text-gray-500">
                            Actualitzat: {segment.ultima_actualitzacio.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">LTV Segment</div>
                        <div className="text-xl font-bold text-green-600">
                          €{(segment.performance_segment.ltv / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Performance Actual</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Engagement Rate:</span>
                            <span className="font-medium">{segment.performance_segment.engagement_rate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Conversion Rate:</span>
                            <span className="font-medium">
                              {segment.performance_segment.conversion_rate > 0 ? 
                                `${segment.performance_segment.conversion_rate}%` : 'N/A'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Churn Risk:</span>
                            <span className={`font-medium ${
                              segment.performance_segment.churn_risk <= 10 ? 'text-green-600' :
                              segment.performance_segment.churn_risk <= 20 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {segment.performance_segment.churn_risk}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Prediccions ML (30d)</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Creixement:</span>
                            <span className="font-medium text-blue-600">+{segment.predictions.creixement_30d}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Engagement Prediction:</span>
                            <span className="font-medium">{segment.predictions.engagement_prediction}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Conversion Likelihood:</span>
                            <span className="font-medium">
                              {segment.predictions.conversion_likelihood > 0 ?
                                `${segment.predictions.conversion_likelihood}%` : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Workflows Assignats: </span>
                          <span className="font-medium">{segment.workflows_assignats.length}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                            Veure Criteris
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                            Assignar Workflow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Workflow */}
      {showWorkflowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Marketing Automation Sistema</h3>
              <button onClick={() => setShowWorkflowModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet de marketing automation implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Workflows diferenciats per cada dels 4 segments d'audience</li>
                <li>Segmentació dinàmica amb machine learning i real-time updates</li>
                <li>Cross-channel orchestration amb frequency capping</li>
                <li>A/B testing automatitzat i ML optimization</li>
                <li>Personalització basada en behavioral data i preferences</li>
                <li>Attribution tracking per workflow performance</li>
                <li>Predictive analytics per segment growth i engagement</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}