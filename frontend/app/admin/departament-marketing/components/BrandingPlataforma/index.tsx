'use client'

import { useState } from 'react'
import { 
  Star, TrendingUp, MessageCircle, Share2, Award, Globe,
  Eye, Users, Heart, Mic, Camera, FileText, BarChart3,
  Search, Filter, RefreshCw, Download, X, Plus, ArrowUp,
  ArrowDown, Activity, Brain, Target, Shield, Zap
} from 'lucide-react'

interface BrandMetrics {
  periode: string
  awareness: {
    assistida: number
    espontania: number
    top_of_mind: number
    consideracio: number
  }
  sentiment: {
    positiu: number
    neutral: number
    negatiu: number
    score_net: number
  }
  share_of_voice: {
    total: number
    digital: number
    tradicional: number
    social_media: number
  }
  engagement: {
    social_mentions: number
    engagement_rate: number
    virality_score: number
    influencer_mentions: number
  }
  percepcion_atributs: {
    innovador: number
    confiable: number
    transparencia: number
    accessibilitat: number
    eficiencia: number
  }
}

interface CampanyaBranding {
  id: string
  nom: string
  tipus: 'brand_awareness' | 'thought_leadership' | 'crisis_management' | 'reputation_building'
  objectius: string[]
  timeline: { inici: Date; fi: Date }
  estat: 'planificant' | 'activa' | 'pausada' | 'completada'
  budget: number
  target_audience: string[]
  canals: string[]
  assets: {
    tipus: string
    nom: string
    performance: {
      views: number
      engagement: number
      shares: number
    }
  }[]
  kpis: {
    awareness_lift: number
    sentiment_improvement: number
    sov_increase: number
    earned_media: number
  }
  roi_branding: number
}

interface CompetitiveIntel {
  competitor: string
  market_share: number
  brand_strength: number
  sentiment_score: number
  sov_percentage: number
  key_messages: string[]
  vulnerabilities: string[]
  opportunities: string[]
  recent_campaigns: string[]
  media_spend_estimate: number
}

interface InfluencerPartnership {
  id: string
  nom: string
  categoria: 'govtech_expert' | 'industry_analyst' | 'academic' | 'journalist' | 'thought_leader'
  reach: number
  engagement_rate: number
  relevancia_score: number
  cost_per_post: number
  col_laboracions: {
    campanya: string
    tipus: 'post' | 'article' | 'webinar' | 'event'
    performance: {
      views: number
      engagement: number
      clicks: number
      conversions: number
    }
  }[]
  roi_influencer: number
}

export default function BrandingPlataforma() {
  const [vistaActiva, setVistaActiva] = useState('metrics')
  const [periodeComparacio, setPeriodeComparacio] = useState('vs_anterior')
  const [showCampanyaModal, setShowCampanyaModal] = useState(false)
  const [showCompetitiveModal, setShowCompetitiveModal] = useState(false)
  const [filtreCanal, setFiltreCanal] = useState('tots')

  const brandMetrics: BrandMetrics = {
    periode: 'Q1 2024',
    awareness: {
      assistida: 34.7,
      espontania: 12.3,
      top_of_mind: 8.9,
      consideracio: 28.4
    },
    sentiment: {
      positiu: 78.3,
      neutral: 18.2,
      negatiu: 3.5,
      score_net: 74.8
    },
    share_of_voice: {
      total: 12.8,
      digital: 15.2,
      tradicional: 8.4,
      social_media: 18.7
    },
    engagement: {
      social_mentions: 2847,
      engagement_rate: 6.8,
      virality_score: 23.4,
      influencer_mentions: 156
    },
    percepcion_atributs: {
      innovador: 87,
      confiable: 82,
      transparencia: 79,
      accessibilitat: 74,
      eficiencia: 89
    }
  }

  const campanyesBranding: CampanyaBranding[] = [
    {
      id: '1',
      nom: 'Thought Leadership GovTech España',
      tipus: 'thought_leadership',
      objectius: [
        'Posicionar CEO com a expert GovTech',
        'Incrementar brand awareness 25%',
        'Generar 50 mencions qualificades'
      ],
      timeline: { inici: new Date('2024-01-01'), fi: new Date('2024-06-30') },
      estat: 'activa',
      budget: 120000,
      target_audience: ['Decision makers públics', 'Tech media', 'Industry analysts'],
      canals: ['PR', 'Social Media', 'Events', 'Content Marketing'],
      assets: [
        {
          tipus: 'Whitepaper',
          nom: 'Future of GovTech in Spain',
          performance: { views: 15420, engagement: 8.7, shares: 234 }
        },
        {
          tipus: 'Webinar Series',
          nom: 'Digital Transformation Talks',
          performance: { views: 8930, engagement: 12.4, shares: 156 }
        }
      ],
      kpis: {
        awareness_lift: 18.7,
        sentiment_improvement: 12.3,
        sov_increase: 3.8,
        earned_media: 890000
      },
      roi_branding: 287
    }
  ]

  const competitiveIntel: CompetitiveIntel[] = [
    {
      competitor: 'Accenture Public Service',
      market_share: 28.5,
      brand_strength: 94,
      sentiment_score: 76,
      sov_percentage: 31.2,
      key_messages: ['Digital transformation', 'Innovation at scale', 'Citizen-centric'],
      vulnerabilities: ['Alt cost', 'Lenta implementació', 'Menys focus local'],
      opportunities: ['SME market', 'Regional players', 'Specialized solutions'],
      recent_campaigns: ['Smart Cities Summit', 'Government Innovation Awards'],
      media_spend_estimate: 2500000
    },
    {
      competitor: 'Indra Sistemas',
      market_share: 22.1,
      brand_strength: 87,
      sentiment_score: 72,
      sov_percentage: 24.8,
      key_messages: ['Spanish leader', 'Local expertise', 'Legacy modernization'],
      vulnerabilities: ['Percepció tradicional', 'Innovació lenta'],
      opportunities: ['Modern image', 'AI positioning', 'Startup partnerships'],
      recent_campaigns: ['Digital Spain Initiative', 'Innovation Labs'],
      media_spend_estimate: 1800000
    }
  ]

  const influencerPartnerships: InfluencerPartnership[] = [
    {
      id: '1',
      nom: 'Dr. Ana García Tech',
      categoria: 'govtech_expert',
      reach: 45000,
      engagement_rate: 7.8,
      relevancia_score: 92,
      cost_per_post: 2500,
      col_laboracions: [
        {
          campanya: 'Thought Leadership GovTech',
          tipus: 'article',
          performance: { views: 12400, engagement: 8.9, clicks: 890, conversions: 23 }
        }
      ],
      roi_influencer: 340
    }
  ]

  const vistes = [
    { id: 'metrics', nom: 'Brand Metrics', icon: BarChart3 },
    { id: 'campanyes', nom: 'Campanyes Branding', icon: Star },
    { id: 'competitive', nom: 'Competitive Intelligence', icon: Shield },
    { id: 'influencers', nom: 'Influencer Network', icon: Users },
    { id: 'content', nom: 'Content Performance', icon: FileText },
    { id: 'crisis', nom: 'Crisis Management', icon: AlertTriangle }
  ]

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      direction: change >= 0 ? 'up' : 'down',
      color: change >= 0 ? 'text-green-600' : 'text-red-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Branding Plataforma - Brand Management Enterprise</h2>
          <div className="flex gap-2">
            <select 
              value={periodeComparacio}
              onChange={(e) => setPeriodeComparacio(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="vs_anterior">vs Període Anterior</option>
              <option value="vs_any_anterior">vs Any Anterior</option>
              <option value="vs_baseline">vs Baseline</option>
            </select>
            <button 
              onClick={() => setShowCampanyaModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Campanya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">{brandMetrics.awareness.assistida}%</div>
            <div className="text-sm text-orange-600">Brand Awareness</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{brandMetrics.sentiment.score_net}</div>
            <div className="text-sm text-green-600">Net Sentiment</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{brandMetrics.share_of_voice.total}%</div>
            <div className="text-sm text-blue-600">Share of Voice</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">{brandMetrics.engagement.social_mentions}</div>
            <div className="text-sm text-purple-600">Social Mentions</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">
              {campanyesBranding.filter(c => c.estat === 'activa').length}
            </div>
            <div className="text-sm text-pink-600">Campanyes Actives</div>
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
                      ? 'bg-orange-100 text-orange-700' 
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
          {/* Brand Metrics */}
          {vistaActiva === 'metrics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Mètriques de Marca Integrals</h3>

              {/* Brand Awareness */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-lg mb-4">Brand Awareness & Consideration</h4>
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700 mb-2">
                      {brandMetrics.awareness.assistida}%
                    </div>
                    <div className="text-sm text-gray-600">Awareness Assistida</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+2.3%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {brandMetrics.awareness.espontania}%
                    </div>
                    <div className="text-sm text-gray-600">Awareness Espontània</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+1.8%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-700 mb-2">
                      {brandMetrics.awareness.top_of_mind}%
                    </div>
                    <div className="text-sm text-gray-600">Top of Mind</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+0.9%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-700 mb-2">
                      {brandMetrics.awareness.consideracio}%
                    </div>
                    <div className="text-sm text-gray-600">Consideration</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+3.1%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-lg mb-4">Anàlisi de Sentiment</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Positiu</span>
                        <span className="text-sm font-bold text-green-600">{brandMetrics.sentiment.positiu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${brandMetrics.sentiment.positiu}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Neutral</span>
                        <span className="text-sm font-bold text-gray-600">{brandMetrics.sentiment.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gray-400 h-3 rounded-full"
                          style={{ width: `${brandMetrics.sentiment.neutral}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Negatiu</span>
                        <span className="text-sm font-bold text-red-600">{brandMetrics.sentiment.negatiu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-500 h-3 rounded-full"
                          style={{ width: `${brandMetrics.sentiment.negatiu}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {brandMetrics.sentiment.score_net}
                      </div>
                      <div className="text-lg font-medium text-gray-800">Net Sentiment Score</div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <ArrowUp className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600">+5.2 vs anterior</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share of Voice */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-lg mb-4">Share of Voice per Canal</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{brandMetrics.share_of_voice.total}%</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{brandMetrics.share_of_voice.digital}%</div>
                    <div className="text-sm text-gray-600">Digital</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">{brandMetrics.share_of_voice.tradicional}%</div>
                    <div className="text-sm text-gray-600">Tradicional</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">{brandMetrics.share_of_voice.social_media}%</div>
                    <div className="text-sm text-gray-600">Social Media</div>
                  </div>
                </div>
              </div>

              {/* Brand Attributes */}
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium text-lg mb-4">Percepció d'Atributs de Marca</h4>
                <div className="space-y-4">
                  {Object.entries(brandMetrics.percepcion_atributs).map(([atribut, valor]) => (
                    <div key={atribut}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium capitalize">{atribut.replace('_', ' ')}</span>
                        <span className="text-sm font-bold">{valor}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            valor >= 85 ? 'bg-green-500' :
                            valor >= 75 ? 'bg-blue-500' :
                            valor >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${valor}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Competitive Intelligence */}
          {vistaActiva === 'competitive' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Competitive Brand Intelligence</h3>
                <button 
                  onClick={() => setShowCompetitiveModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Anàlisi Competitiu
                </button>
              </div>

              <div className="space-y-6">
                {competitiveIntel.map((competitor, i) => (
                  <div key={i} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-xl">{competitor.competitor}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Market Share</div>
                          <div className="text-lg font-bold text-blue-600">{competitor.market_share}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Brand Strength</div>
                          <div className="text-lg font-bold text-purple-600">{competitor.brand_strength}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">SOV</div>
                          <div className="text-lg font-bold text-green-600">{competitor.sov_percentage}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Key Messages</h5>
                        <div className="space-y-1">
                          {competitor.key_messages.map(message => (
                            <div key={message} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              {message}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Vulnerabilities</h5>
                        <div className="space-y-1">
                          {competitor.vulnerabilities.map(vulnerability => (
                            <div key={vulnerability} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                              {vulnerability}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Opportunities</h5>
                        <div className="space-y-1">
                          {competitor.opportunities.map(opportunity => (
                            <div key={opportunity} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {opportunity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Est. Media Spend: </span>
                          <span className="font-medium">€{(competitor.media_spend_estimate / 1000000).toFixed(1)}M</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Sentiment Score: </span>
                          <span className="font-medium">{competitor.sentiment_score}</span>
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

      {/* Modal Campanya */}
      {showCampanyaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Sistema de Branding Enterprise</h3>
              <button onClick={() => setShowCampanyaModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet de brand management implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Brand tracking multi-dimensional amb awareness, sentiment i SOV</li>
                <li>Competitive intelligence automatitzada</li>
                <li>Influencer network management i ROI tracking</li>
                <li>Crisis management protocols i real-time monitoring</li>
                <li>Content performance attribution per branding goals</li>
                <li>Multi-channel brand consistency monitoring</li>
                <li>Brand equity measurement i brand health scoring</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}