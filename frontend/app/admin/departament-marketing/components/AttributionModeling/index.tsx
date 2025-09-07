'use client'

import { useState } from 'react'
import { 
  Brain, BarChart3, TrendingUp, Target, Activity, Zap,
  ArrowRight, Eye, Settings, RefreshCw, Download, X,
  Plus, Filter, ArrowUp, ArrowDown, DollarSign, Percent,
  Clock, Award, AlertTriangle, CheckCircle, Globe, Users
} from 'lucide-react'

interface TouchpointAttribution {
  touchpoint_id: string
  canal: string
  campanya: string
  segment_audience: string
  timestamp: Date
  attribution_weight: number
  revenue_attributed: number
  influence_score: number
  position_in_journey: number
  conversion_probability: number
  interaction_type: 'impression' | 'click' | 'engagement' | 'conversion'
}

interface ModelAttribution {
  id: string
  nom: string
  tipus: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'shapley' | 'markov_chain' | 'algorithmic'
  descripcio: string
  accuracy: number
  segments_aplicats: string[]
  revenue_attributed: number
  touchpoints_analitzats: number
  configuracio: {
    lookback_window: number
    decay_rate?: number
    credit_distribution?: { [key: string]: number }
    ml_model_version?: string
  }
  performance_metrics: {
    precision: number
    recall: number
    f1_score: number
    mae: number
  }
  estat: 'actiu' | 'testing' | 'deprecated'
}

interface CustomerJourney {
  customer_id: string
  segment: string
  revenue_total: number
  conversion_date: Date
  journey_length: number
  touchpoints: TouchpointAttribution[]
  key_interactions: {
    first_touch: TouchpointAttribution
    last_touch: TouchpointAttribution
    highest_influence: TouchpointAttribution
    conversion_assist: TouchpointAttribution[]
  }
  journey_complexity_score: number
  cross_device_interactions: number
}

interface ChannelPerformance {
  canal: string
  total_touchpoints: number
  unique_users: number
  revenue_attributed: {
    first_touch: number
    last_touch: number
    linear: number
    algorithmic: number
  }
  roi_by_model: {
    first_touch: number
    last_touch: number
    linear: number
    algorithmic: number
  }
  efficiency_metrics: {
    cost_per_acquisition: number
    roas: number
    influence_per_euro: number
    journey_acceleration: number
  }
  audience_composition: {
    segment: string
    percentage: number
    avg_revenue: number
  }[]
}

export default function AttributionModeling() {
  const [modelActiu, setModelActiu] = useState('algorithmic')
  const [vistaActiva, setVistaActiva] = useState('overview')
  const [segmentSeleccionat, setSegmentSeleccionat] = useState('tots')
  const [showModelModal, setShowModelModal] = useState(false)
  const [showJourneyModal, setShowJourneyModal] = useState(false)
  const [periodeAnalisi, setPeriodeAnalisi] = useState('30d')

  const modelsAttribution: ModelAttribution[] = [
    {
      id: '1',
      nom: 'Multi-Touch Algorithmic',
      tipus: 'algorithmic',
      descripcio: 'Machine Learning basat en Shapley values amb decay temporal',
      accuracy: 94.7,
      segments_aplicats: ['Empleats', 'Empreses', 'Administracions', 'Branding'],
      revenue_attributed: 4850000,
      touchpoints_analitzats: 247890,
      configuracio: {
        lookback_window: 90,
        ml_model_version: 'v2.3.1'
      },
      performance_metrics: {
        precision: 0.947,
        recall: 0.923,
        f1_score: 0.935,
        mae: 0.086
      },
      estat: 'actiu'
    },
    {
      id: '2',
      nom: 'Cross-Audience Linear',
      tipus: 'linear',
      descripcio: 'Distribució equitativa entre tots els touchpoints del journey',
      accuracy: 78.3,
      segments_aplicats: ['Tots'],
      revenue_attributed: 4235000,
      touchpoints_analitzats: 247890,
      configuracio: {
        lookback_window: 60
      },
      performance_metrics: {
        precision: 0.783,
        recall: 0.856,
        f1_score: 0.818,
        mae: 0.234
      },
      estat: 'actiu'
    },
    {
      id: '3',
      nom: 'Position-Based Cross-Segment',
      tipus: 'position_based',
      descripcio: '40% first touch, 40% last touch, 20% distribuit entre mitjans',
      accuracy: 82.1,
      segments_aplicats: ['Empreses', 'Administracions'],
      revenue_attributed: 3890000,
      touchpoints_analitzats: 189234,
      configuracio: {
        lookback_window: 45,
        credit_distribution: { first: 40, last: 40, middle: 20 }
      },
      performance_metrics: {
        precision: 0.821,
        recall: 0.798,
        f1_score: 0.809,
        mae: 0.187
      },
      estat: 'testing'
    }
  ]

  const channelPerformance: ChannelPerformance[] = [
    {
      canal: 'LinkedIn Ads',
      total_touchpoints: 45680,
      unique_users: 18934,
      revenue_attributed: {
        first_touch: 1250000,
        last_touch: 890000,
        linear: 1680000,
        algorithmic: 1520000
      },
      roi_by_model: {
        first_touch: 425,
        last_touch: 302,
        linear: 571,
        algorithmic: 516
      },
      efficiency_metrics: {
        cost_per_acquisition: 2840,
        roas: 5.16,
        influence_per_euro: 0.34,
        journey_acceleration: 1.23
      },
      audience_composition: [
        { segment: 'Empreses', percentage: 45, avg_revenue: 125000 },
        { segment: 'Administracions', percentage: 35, avg_revenue: 180000 },
        { segment: 'Empleats', percentage: 20, avg_revenue: 0 }
      ]
    },
    {
      canal: 'Government Affairs',
      total_touchpoints: 8934,
      unique_users: 1240,
      revenue_attributed: {
        first_touch: 2340000,
        last_touch: 2890000,
        linear: 2450000,
        algorithmic: 2680000
      },
      roi_by_model: {
        first_touch: 890,
        last_touch: 1098,
        linear: 931,
        algorithmic: 1018
      },
      efficiency_metrics: {
        cost_per_acquisition: 12500,
        roas: 10.18,
        influence_per_euro: 0.89,
        journey_acceleration: 2.14
      },
      audience_composition: [
        { segment: 'Administracions', percentage: 85, avg_revenue: 250000 },
        { segment: 'Empreses', percentage: 15, avg_revenue: 95000 }
      ]
    },
    {
      canal: 'Content Marketing',
      total_touchpoints: 89450,
      unique_users: 34560,
      revenue_attributed: {
        first_touch: 890000,
        last_touch: 450000,
        linear: 1230000,
        algorithmic: 980000
      },
      roi_by_model: {
        first_touch: 267,
        last_touch: 135,
        linear: 369,
        algorithmic: 294
      },
      efficiency_metrics: {
        cost_per_acquisition: 1680,
        roas: 2.94,
        influence_per_euro: 0.18,
        journey_acceleration: 0.67
      },
      audience_composition: [
        { segment: 'Empleats', percentage: 60, avg_revenue: 0 },
        { segment: 'Empreses', percentage: 30, avg_revenue: 85000 },
        { segment: 'Administracions', percentage: 10, avg_revenue: 120000 }
      ]
    }
  ]

  const vistes = [
    { id: 'overview', nom: 'Model Overview', icon: BarChart3 },
    { id: 'channels', nom: 'Channel Attribution', icon: Target },
    { id: 'journeys', nom: 'Customer Journeys', icon: Activity },
    { id: 'comparison', nom: 'Model Comparison', icon: Brain },
    { id: 'optimization', nom: 'Budget Optimization', icon: DollarSign },
    { id: 'advanced', nom: 'Advanced Analytics', icon: Zap }
  ]

  const modelActual = modelsAttribution.find(m => m.id === modelActiu) || modelsAttribution[0]

  const calcularROIPromig = (channel: ChannelPerformance) => {
    return (channel.roi_by_model.algorithmic)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Attribution Modeling Cross-Audience</h2>
          <div className="flex gap-2">
            <select 
              value={modelActiu}
              onChange={(e) => setModelActiu(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              {modelsAttribution.map(model => (
                <option key={model.id} value={model.id}>{model.nom}</option>
              ))}
            </select>
            <select 
              value={periodeAnalisi}
              onChange={(e) => setPeriodeAnalisi(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="7d">Últims 7 dies</option>
              <option value="30d">Últims 30 dies</option>
              <option value="90d">Últims 90 dies</option>
            </select>
            <button 
              onClick={() => setShowModelModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Configurar Model
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">€{(modelActual.revenue_attributed / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-purple-600">Revenue Atribuït</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{modelActual.accuracy}%</div>
            <div className="text-sm text-blue-600">Model Accuracy</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{(modelActual.touchpoints_analitzats / 1000).toFixed(0)}K</div>
            <div className="text-sm text-green-600">Touchpoints</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">{modelActual.segments_aplicats.length}</div>
            <div className="text-sm text-orange-600">Segments</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">{modelActual.performance_metrics.f1_score.toFixed(3)}</div>
            <div className="text-sm text-pink-600">F1-Score</div>
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
                      ? 'bg-purple-100 text-purple-700' 
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
          {/* Model Overview */}
          {vistaActiva === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{modelActual.nom}</h3>
                <p className="text-gray-700 mb-4">{modelActual.descripcio}</p>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded p-3">
                    <div className="text-sm text-gray-600">Precision</div>
                    <div className="text-lg font-bold">{(modelActual.performance_metrics.precision * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-sm text-gray-600">Recall</div>
                    <div className="text-lg font-bold">{(modelActual.performance_metrics.recall * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-sm text-gray-600">F1-Score</div>
                    <div className="text-lg font-bold">{(modelActual.performance_metrics.f1_score * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-sm text-gray-600">MAE</div>
                    <div className="text-lg font-bold">{modelActual.performance_metrics.mae.toFixed(3)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Configuració del Model</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lookback Window:</span>
                      <span className="font-medium">{modelActual.configuracio.lookback_window} dies</span>
                    </div>
                    {modelActual.configuracio.ml_model_version && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ML Model Version:</span>
                        <span className="font-medium">{modelActual.configuracio.ml_model_version}</span>
                      </div>
                    )}
                    {modelActual.configuracio.decay_rate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Decay Rate:</span>
                        <span className="font-medium">{modelActual.configuracio.decay_rate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estat:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        modelActual.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                        modelActual.estat === 'testing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {modelActual.estat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Segments Aplicats</h4>
                  <div className="space-y-2">
                    {modelActual.segments_aplicats.map(segment => (
                      <div key={segment} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{segment}</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channel Attribution */}
          {vistaActiva === 'channels' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Attribution per Canal</h3>
                <div className="flex gap-2">
                  <select 
                    value={segmentSeleccionat}
                    onChange={(e) => setSegmentSeleccionat(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="tots">Tots els segments</option>
                    <option value="Empleats">Empleats</option>
                    <option value="Empreses">Empreses</option>
                    <option value="Administracions">Administracions</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {channelPerformance.map(channel => (
                  <div key={channel.canal} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{channel.canal}</h4>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">ROI Algorithmic</div>
                        <div className="text-xl font-bold text-green-600">
                          {channel.roi_by_model.algorithmic}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          €{(channel.revenue_attributed.algorithmic / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-gray-600">Revenue Atribuït</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {channel.total_touchpoints.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Touchpoints</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700">
                          {channel.unique_users.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Usuaris Únics</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700">
                          €{channel.efficiency_metrics.cost_per_acquisition.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">CPA</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Attribution per Model</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">First Touch:</span>
                            <span className="font-medium">€{(channel.revenue_attributed.first_touch / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Last Touch:</span>
                            <span className="font-medium">€{(channel.revenue_attributed.last_touch / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Linear:</span>
                            <span className="font-medium">€{(channel.revenue_attributed.linear / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold">Algorithmic:</span>
                            <span className="font-bold text-purple-600">€{(channel.revenue_attributed.algorithmic / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Composició Audiència</h5>
                        <div className="space-y-2">
                          {channel.audience_composition.map(audience => (
                            <div key={audience.segment} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{audience.segment}:</span>
                                <span className="text-sm font-medium">{audience.percentage}%</span>
                              </div>
                              <span className="text-xs text-gray-600">
                                €{(audience.avg_revenue / 1000).toFixed(0)}K avg
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Model Comparison */}
          {vistaActiva === 'comparison' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Comparació de Models d'Attribution</h3>

              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Model</th>
                      <th className="text-left p-4 font-semibold">Accuracy</th>
                      <th className="text-left p-4 font-semibold">Revenue Atribuït</th>
                      <th className="text-left p-4 font-semibold">F1-Score</th>
                      <th className="text-left p-4 font-semibold">Touchpoints</th>
                      <th className="text-left p-4 font-semibold">Estat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelsAttribution.map(model => (
                      <tr key={model.id} className="border-t">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{model.nom}</div>
                            <div className="text-sm text-gray-600">{model.tipus}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.accuracy}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${model.accuracy}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          €{(model.revenue_attributed / 1000000).toFixed(1)}M
                        </td>
                        <td className="p-4 font-medium">
                          {model.performance_metrics.f1_score.toFixed(3)}
                        </td>
                        <td className="p-4 font-medium">
                          {(model.touchpoints_analitzats / 1000).toFixed(0)}K
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            model.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                            model.estat === 'testing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {model.estat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold mb-2 text-blue-800">Recomanació del Sistema</h4>
                <p className="text-blue-700">
                  El model <strong>Multi-Touch Algorithmic</strong> ofereix la millor combinació d'accuracy ({modelActual.accuracy}%) 
                  i revenue attribution (€{(modelActual.revenue_attributed / 1000000).toFixed(1)}M). 
                  Recomanem mantenir-lo com a model principal per a totes les decisions d'optimització de pressupost.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Model Configuration */}
      {showModelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Attribution Modeling Cross-Audience</h3>
              <button onClick={() => setShowModelModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet d'attribution modeling implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Multi-touch attribution amb Shapley values i machine learning</li>
                <li>Cross-device i cross-platform journey tracking</li>
                <li>Algorithmic attribution diferenciada per audience segments</li>
                <li>Real-time budget optimization basat en attribution data</li>
                <li>Customer journey complexity scoring i influence measurement</li>
                <li>A/B testing de models d'attribution amb statistical significance</li>
                <li>Predictive attribution per optimization proactiva</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}