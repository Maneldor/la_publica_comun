'use client'

import { useState } from 'react'
import { 
  Users, Building2, Crown, Star, Brain, BarChart3, TrendingUp, 
  Target, Activity, Globe, Zap, Shield, Eye, RefreshCw, Download,
  ArrowUp, ArrowDown, Calendar, Mail, Phone, MessageSquare,
  DollarSign, Percent, Clock, Award, AlertTriangle, CheckCircle
} from 'lucide-react'

interface SegmentPerformance {
  segment: string
  icon: any
  color: string
  metriques: {
    principals: { nom: string; valor: string; tendencia: number }[]
    secundaries: { nom: string; valor: string }[]
  }
  objectius: {
    actual: number
    objectiu: number
    periode: string
  }
  alertes: string[]
}

interface CrossChannelAttribution {
  canal: string
  touchpoints: number
  influencia: number
  roi: number
  revenue: number
  cost: number
}

export default function DashboardExecutiu() {
  const [periodeSeleccionat, setPeriodeSeleccionat] = useState('mes_actual')
  const [segmentSeleccionat, setSegmentSeleccionat] = useState('tots')
  const [showAttributionDetall, setShowAttributionDetall] = useState(false)
  const [vistaDetall, setVistaDetall] = useState<string | null>(null)

  const segmentPerformance: SegmentPerformance[] = [
    {
      segment: 'Empleats Públics',
      icon: Users,
      color: 'blue',
      metriques: {
        principals: [
          { nom: 'Usuaris Actius', valor: '24,580', tendencia: 8.7 },
          { nom: 'Engagement Rate', valor: '67.3%', tendencia: 4.2 },
          { nom: 'Retencio 30d', valor: '84.2%', tendencia: -2.1 },
          { nom: 'NPS Score', valor: '72', tendencia: 5.8 }
        ],
        secundaries: [
          { nom: 'Sessions/User', valor: '8.4' },
          { nom: 'Temps Sessió', valor: '12:34' },
          { nom: 'Features Adoptades', valor: '73%' }
        ]
      },
      objectius: {
        actual: 67.3,
        objectiu: 75.0,
        periode: 'Q1 2024'
      },
      alertes: [
        'Retencio baixant en grup 45-55 anys',
        'Oportunitat cross-sell a Valencia'
      ]
    },
    {
      segment: 'Empreses Col·laboradores',
      icon: Building2,
      color: 'green',
      metriques: {
        principals: [
          { nom: 'Leads Generats', valor: '1,247', tendencia: 23.4 },
          { nom: 'Conversion Rate', valor: '28.4%', tendencia: 7.1 },
          { nom: 'Pipeline Value', valor: '€3.2M', tendencia: 15.8 },
          { nom: 'Deal Velocity', valor: '45d', tendencia: -8.3 }
        ],
        secundaries: [
          { nom: 'MQL→SQL', valor: '42%' },
          { nom: 'Customer LTV', valor: '€125K' },
          { nom: 'Churn Rate', valor: '8.7%' }
        ]
      },
      objectius: {
        actual: 28.4,
        objectiu: 32.0,
        periode: 'Q1 2024'
      },
      alertes: [
        'Leads fintech amb alta conversió',
        'Competència augmentant en segment mid-market'
      ]
    },
    {
      segment: 'Administracions Públiques',
      icon: Crown,
      color: 'purple',
      metriques: {
        principals: [
          { nom: 'Institucions Actives', valor: '187', tendencia: 12.3 },
          { nom: 'Relacions Establertes', valor: '892', tendencia: 18.7 },
          { nom: 'Reunions Programades', valor: '156', tendencia: 25.1 },
          { nom: 'Propostes Enviades', valor: '34', tendencia: 41.2 }
        ],
        secundaries: [
          { nom: 'Response Rate', valor: '67%' },
          { nom: 'Meeting Show Rate', valor: '89%' },
          { nom: 'Proposal Win Rate', valor: '76%' }
        ]
      },
      objectius: {
        actual: 187,
        objectiu: 200,
        periode: 'Q1 2024'
      },
      alertes: [
        'Oportunitat digitalització Andalucía',
        '3 licitacions >€500K en preparació'
      ]
    },
    {
      segment: 'Branding Plataforma',
      icon: Star,
      color: 'orange',
      metriques: {
        principals: [
          { nom: 'Brand Awareness', valor: '34.7%', tendencia: 9.8 },
          { nom: 'Share of Voice', valor: '12.8%', tendencia: 3.4 },
          { nom: 'Sentiment Score', valor: '78.3%', tendencia: 6.2 },
          { nom: 'Mencions Mensuals', valor: '2,847', tendencia: 28.9 }
        ],
        secundaries: [
          { nom: 'Organic Reach', valor: '890K' },
          { nom: 'PR Coverage', valor: '€2.3M' },
          { nom: 'Influencer Score', valor: '87' }
        ]
      },
      objectius: {
        actual: 34.7,
        objectiu: 40.0,
        periode: 'Q1 2024'
      },
      alertes: [
        'Cobertura mediàtica positiva',
        'Oportunitat partnerships institucionals'
      ]
    }
  ]

  const crossChannelAttribution: CrossChannelAttribution[] = [
    { canal: 'LinkedIn Ads', touchpoints: 15420, influencia: 34.2, roi: 287, revenue: 1650000, cost: 57500 },
    { canal: 'Institutional Events', touchpoints: 8930, influencia: 28.7, roi: 412, revenue: 1890000, cost: 45800 },
    { canal: 'Content Marketing', touchpoints: 23450, influencia: 22.1, roi: 198, revenue: 980000, cost: 49500 },
    { canal: 'Email Marketing', touchpoints: 45680, influencia: 18.9, roi: 345, revenue: 765000, cost: 22200 },
    { canal: 'Government Affairs', touchpoints: 2340, influencia: 42.8, roi: 890, revenue: 2450000, cost: 27500 },
    { canal: 'Partner Network', touchpoints: 6780, influencia: 31.5, roi: 234, revenue: 690000, cost: 29500 },
    { canal: 'Public Relations', touchpoints: 12890, influencia: 15.4, roi: 167, revenue: 430000, cost: 25800 },
    { canal: 'Direct Sales', touchpoints: 3450, influencia: 67.8, roi: 523, revenue: 1890000, cost: 36100 }
  ]

  const kpisGlobals = {
    attributionRevenue: crossChannelAttribution.reduce((sum, c) => sum + c.revenue, 0),
    totalROI: ((crossChannelAttribution.reduce((sum, c) => sum + c.revenue, 0) - 
                crossChannelAttribution.reduce((sum, c) => sum + c.cost, 0)) / 
               crossChannelAttribution.reduce((sum, c) => sum + c.cost, 0) * 100),
    totalTouchpoints: crossChannelAttribution.reduce((sum, c) => sum + c.touchpoints, 0),
    avgInfluencia: crossChannelAttribution.reduce((sum, c) => sum + c.influencia, 0) / crossChannelAttribution.length
  }

  const getColorBySegment = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'text-blue-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'text-green-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: 'text-orange-600' }
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="space-y-6">
      {/* Header executiu */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Marketing Enterprise</h2>
            <p className="text-purple-100 mt-1">Estratègia quàdruple amb attribution cross-audience</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={periodeSeleccionat}
              onChange={(e) => setPeriodeSeleccionat(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white border-0"
            >
              <option value="mes_actual" className="text-gray-900">Mes Actual</option>
              <option value="trimestre" className="text-gray-900">Trimestre</option>
              <option value="any" className="text-gray-900">Any Complet</option>
              <option value="ytd" className="text-gray-900">Year to Date</option>
            </select>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Attribution Globals */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">+{kpisGlobals.totalROI.toFixed(0)}%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">€{(kpisGlobals.attributionRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-gray-600 text-sm">Attribution Revenue</div>
          <div className="text-xs text-gray-500 mt-1">Cross-channel measurement</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Target className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-sm text-pink-600 font-medium">{(kpisGlobals.totalTouchpoints / 1000).toFixed(0)}K</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{kpisGlobals.avgInfluencia.toFixed(1)}%</div>
          <div className="text-gray-600 text-sm">Influència Mitjana</div>
          <div className="text-xs text-gray-500 mt-1">Tots els touchpoints</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">8 canals</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">94.7%</div>
          <div className="text-gray-600 text-sm">Model Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">Machine Learning + MMM</div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">4 segments</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">87.3%</div>
          <div className="text-gray-600 text-sm">Unified Performance</div>
          <div className="text-xs text-gray-500 mt-1">CDP integration score</div>
        </div>
      </div>

      {/* Performance per segment */}
      <div className="grid grid-cols-2 gap-6">
        {segmentPerformance.map(segment => {
          const colors = getColorBySegment(segment.color)
          const Icon = segment.icon
          
          return (
            <div key={segment.segment} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.accent}`} />
                  </div>
                  <h3 className="font-semibold text-lg">{segment.segment}</h3>
                </div>
                <button 
                  onClick={() => setVistaDetall(segment.segment)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Veure detall
                </button>
              </div>

              {/* Mètriques principals */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {segment.metriques.principals.map(metrica => (
                  <div key={metrica.nom} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{metrica.nom}</span>
                      {metrica.tendencia !== 0 && (
                        <span className={`flex items-center text-xs ${
                          metrica.tendencia > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metrica.tendencia > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {Math.abs(metrica.tendencia)}%
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-gray-900">{metrica.valor}</div>
                  </div>
                ))}
              </div>

              {/* Objectiu i progrés */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Objectiu {segment.objectius.periode}</span>
                  <span className="font-medium">
                    {segment.objectius.actual}{typeof segment.objectius.actual === 'number' && segment.objectius.actual < 100 ? '%' : ''}
                    {' / '}
                    {segment.objectius.objectiu}{typeof segment.objectius.objectiu === 'number' && segment.objectius.objectiu < 100 ? '%' : ''}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      segment.objectius.actual >= segment.objectius.objectiu ? 'bg-green-500' : 
                      segment.objectius.actual >= segment.objectius.objectiu * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (segment.objectius.actual / segment.objectius.objectiu) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Alertes */}
              {segment.alertes.length > 0 && (
                <div className="space-y-2">
                  {segment.alertes.map((alerta, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded">
                      <AlertTriangle className="w-4 h-4" />
                      {alerta}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Cross-Channel Attribution */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Cross-Channel Attribution Analysis</h3>
          <button 
            onClick={() => setShowAttributionDetall(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Model Detallat
          </button>
        </div>

        <div className="grid gap-4">
          {crossChannelAttribution
            .sort((a, b) => b.influencia - a.influencia)
            .map(canal => (
              <div key={canal.canal} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{canal.canal}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {canal.touchpoints.toLocaleString()} touchpoints
                        </span>
                        <span className={`font-medium ${
                          canal.roi >= 300 ? 'text-green-600' :
                          canal.roi >= 200 ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          ROI: {canal.roi}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Influència</div>
                        <div className="font-semibold">{canal.influencia}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${canal.influencia}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Revenue</div>
                        <div className="font-semibold">€{(canal.revenue / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Cost</div>
                        <div className="font-semibold">€{(canal.cost / 1000).toFixed(0)}K</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Efficiency</div>
                        <div className="font-semibold">{(canal.revenue / canal.touchpoints).toFixed(0)}€/TP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal Attribution Detall */}
      {showAttributionDetall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Model d'Attribution Detallat</h3>
              <button onClick={() => setShowAttributionDetall(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center text-gray-500 py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-semibold mb-2">Attribution Model Enterprise</h4>
                <p className="mb-4">Model complet d'attribution cross-audience implementat</p>
                <div className="max-w-2xl mx-auto text-left">
                  <ul className="space-y-2">
                    <li>• Machine Learning multi-touch attribution</li>
                    <li>• Cross-device i cross-platform tracking</li>
                    <li>• Shapley value calculation per touchpoint</li>
                    <li>• Institutional journey mapping diferencial</li>
                    <li>• Real-time budget reallocation</li>
                    <li>• Government affairs influence weighting</li>
                    <li>• Partner network attribution modeling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}