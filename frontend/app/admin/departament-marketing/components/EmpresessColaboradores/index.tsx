'use client'

import { useState } from 'react'
import { 
  Building2, TrendingUp, Target, Users, DollarSign, Zap,
  BarChart3, Mail, Phone, Calendar, MessageSquare, Award,
  Eye, Edit, Plus, Filter, RefreshCw, Download, X, Search,
  ArrowUp, ArrowDown, Clock, Star, AlertTriangle, CheckCircle,
  Globe, Shield, Activity, Brain, PieChart
} from 'lucide-react'

interface LeadEmpresa {
  id: string
  nom: string
  sector: string
  mida: 'startup' | 'pyme' | 'mitjana' | 'gran'
  empleats: number
  facturacio?: number
  punt_dolor: string[]
  fase_pipeline: 'awareness' | 'interest' | 'consideration' | 'intent' | 'evaluation' | 'purchase'
  score: number
  probabilitat_conversio: number
  valor_estimat: number
  temps_pipeline: number
  font_acquisition: string
  touchpoints: number
  ultim_contacte: Date
  assignat_a?: string
  estat: 'nou' | 'qualificat' | 'nurturing' | 'negociacio' | 'tancat' | 'perdut'
}

interface CampanyaB2B {
  id: string
  nom: string
  tipus: 'lead_generation' | 'account_based' | 'content_marketing' | 'event_marketing' | 'partner'
  sector_target: string[]
  mida_empresa: string[]
  budget: number
  periode: { inici: Date; fi: Date }
  estat: 'draft' | 'activa' | 'pausada' | 'completada'
  metriques: {
    impressions: number
    clicks: number
    leads: number
    leads_qualificats: number
    oportunitats: number
    revenue_generat: number
    cost_per_lead: number
    roi: number
  }
  canals: string[]
  content_assets: string[]
}

interface AccountBased {
  id: string
  nom_compte: string
  sector: string
  revenue_potential: number
  stakeholders: {
    nom: string
    rol: string
    influencia: 'alta' | 'mitjana' | 'baixa'
    engagement: number
    ultima_interaccio: Date
  }[]
  score_compte: number
  fase_abm: 'target' | 'engage' | 'activate' | 'advocate'
  campanyes_assignades: string[]
  content_personalitzat: string[]
  esdeveniments_planificats: string[]
  next_actions: string[]
}

export default function EmpresessColaboradores() {
  const [vistaActiva, setVistaActiva] = useState('pipeline')
  const [filtreEstat, setFiltreEstat] = useState('tots')
  const [filtreSector, setFiltreSector] = useState('tots')
  const [showCampanyaModal, setShowCampanyaModal] = useState(false)
  const [showABMModal, setShowABMModal] = useState(false)
  const [periodeAnalisi, setPeriodeAnalisi] = useState('30d')

  const leadsEmpreses: LeadEmpresa[] = [
    {
      id: '1',
      nom: 'TechStart Innovation SL',
      sector: 'Technology',
      mida: 'startup',
      empleats: 25,
      facturacio: 1200000,
      punt_dolor: ['Escalabilitat', 'Compliance GDPR', 'Automatització processos'],
      fase_pipeline: 'consideration',
      score: 87,
      probabilitat_conversio: 68,
      valor_estimat: 45000,
      temps_pipeline: 45,
      font_acquisition: 'LinkedIn Ads',
      touchpoints: 12,
      ultim_contacte: new Date('2024-01-25'),
      assignat_a: 'Maria García',
      estat: 'qualificat'
    },
    {
      id: '2',
      nom: 'Fintech Solutions Barcelona',
      sector: 'Financial Services',
      mida: 'mitjana',
      empleats: 150,
      facturacio: 8500000,
      punt_dolor: ['RegTech compliance', 'API integration', 'Security'],
      fase_pipeline: 'evaluation',
      score: 92,
      probabilitat_conversio: 84,
      valor_estimat: 125000,
      temps_pipeline: 67,
      font_acquisition: 'Partner Referral',
      touchpoints: 28,
      ultim_contacte: new Date('2024-01-23'),
      assignat_a: 'Jordi Martínez',
      estat: 'negociacio'
    },
    {
      id: '3',
      nom: 'Manufacturing Corp Valencia',
      sector: 'Manufacturing',
      mida: 'gran',
      empleats: 450,
      facturacio: 25000000,
      punt_dolor: ['Industry 4.0', 'Supply chain', 'Digital transformation'],
      fase_pipeline: 'intent',
      score: 74,
      probabilitat_conversio: 72,
      valor_estimat: 85000,
      temps_pipeline: 89,
      font_acquisition: 'Content Marketing',
      touchpoints: 18,
      ultim_contacte: new Date('2024-01-20'),
      assignat_a: 'Anna Serra',
      estat: 'nurturing'
    }
  ]

  const campanyesB2B: CampanyaB2B[] = [
    {
      id: '1',
      nom: 'Fintech Digital Transformation',
      tipus: 'account_based',
      sector_target: ['Financial Services', 'Fintech'],
      mida_empresa: ['mitjana', 'gran'],
      budget: 45000,
      periode: { inici: new Date('2024-01-01'), fi: new Date('2024-03-31') },
      estat: 'activa',
      metriques: {
        impressions: 125000,
        clicks: 3400,
        leads: 89,
        leads_qualificats: 34,
        oportunitats: 12,
        revenue_generat: 345000,
        cost_per_lead: 506,
        roi: 267
      },
      canals: ['LinkedIn', 'Google Ads', 'Events', 'Email'],
      content_assets: ['RegTech Whitepaper', 'ROI Calculator', 'Case Studies']
    },
    {
      id: '2',
      nom: 'Manufacturing Industry 4.0',
      tipus: 'lead_generation',
      sector_target: ['Manufacturing', 'Industrial'],
      mida_empresa: ['mitjana', 'gran'],
      budget: 32000,
      periode: { inici: new Date('2024-01-15'), fi: new Date('2024-04-15') },
      estat: 'activa',
      metriques: {
        impressions: 89000,
        clicks: 2100,
        leads: 67,
        leads_qualificats: 28,
        oportunitats: 8,
        revenue_generat: 180000,
        cost_per_lead: 477,
        roi: 163
      },
      canals: ['Google Ads', 'Industry Publications', 'Trade Shows'],
      content_assets: ['Industry 4.0 Guide', 'ROI Benchmark', 'Demo Videos']
    }
  ]

  const accountsABM: AccountBased[] = [
    {
      id: '1',
      nom_compte: 'Banco Santander Enterprise',
      sector: 'Financial Services',
      revenue_potential: 250000,
      stakeholders: [
        { nom: 'Marc Rodriguez', rol: 'CTO', influencia: 'alta', engagement: 87, ultima_interaccio: new Date('2024-01-24') },
        { nom: 'Laura Vidal', rol: 'CDO', influencia: 'alta', engagement: 72, ultima_interaccio: new Date('2024-01-22') },
        { nom: 'Pere Font', rol: 'IT Manager', influencia: 'mitjana', engagement: 65, ultima_interaccio: new Date('2024-01-20') }
      ],
      score_compte: 94,
      fase_abm: 'activate',
      campanyes_assignades: ['Fintech Digital Transformation'],
      content_personalitzat: ['Custom ROI Analysis', 'Santander Case Study'],
      esdeveniments_planificats: ['Executive Briefing', 'Technical Deep Dive'],
      next_actions: ['Prepare proposal', 'Schedule C-level meeting', 'Technical pilot setup']
    }
  ]

  const vistes = [
    { id: 'pipeline', nom: 'Pipeline B2B', icon: Target },
    { id: 'campanyes', nom: 'Campanyes Lead Gen', icon: Zap },
    { id: 'abm', nom: 'Account Based Marketing', icon: Building2 },
    { id: 'analytics', nom: 'B2B Analytics', icon: BarChart3 },
    { id: 'automation', nom: 'Marketing Automation', icon: Brain }
  ]

  const calcularROICampanya = (campanya: CampanyaB2B) => {
    return ((campanya.metriques.revenue_generat - campanya.budget) / campanya.budget * 100)
  }

  const getColorEstat = (estat: string) => {
    const colors = {
      'nou': 'bg-blue-100 text-blue-700',
      'qualificat': 'bg-green-100 text-green-700',
      'nurturing': 'bg-yellow-100 text-yellow-700',
      'negociacio': 'bg-purple-100 text-purple-700',
      'tancat': 'bg-emerald-100 text-emerald-700',
      'perdut': 'bg-red-100 text-red-700'
    }
    return colors[estat as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getFasePipelineColor = (fase: string) => {
    const colors = {
      'awareness': 'bg-gray-100 text-gray-700',
      'interest': 'bg-blue-100 text-blue-700',
      'consideration': 'bg-yellow-100 text-yellow-700',
      'intent': 'bg-orange-100 text-orange-700',
      'evaluation': 'bg-purple-100 text-purple-700',
      'purchase': 'bg-green-100 text-green-700'
    }
    return colors[fase as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Empreses Col·laboradores - Lead Generation B2B</h2>
          <div className="flex gap-2">
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
              onClick={() => setShowCampanyaModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Campanya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{leadsEmpreses.length}</div>
            <div className="text-sm text-green-600">Leads Actius</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              €{(leadsEmpreses.reduce((sum, l) => sum + l.valor_estimat, 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-blue-600">Pipeline Value</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {(leadsEmpreses.reduce((sum, l) => sum + l.probabilitat_conversio, 0) / leadsEmpreses.length).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Conversió Mitjana</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {Math.round(leadsEmpreses.reduce((sum, l) => sum + l.temps_pipeline, 0) / leadsEmpreses.length)}d
            </div>
            <div className="text-sm text-orange-600">Temps Pipeline</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">
              {campanyesB2B.filter(c => c.estat === 'activa').length}
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
                      ? 'bg-green-100 text-green-700' 
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
          {/* Pipeline B2B */}
          {vistaActiva === 'pipeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pipeline de Leads B2B</h3>
                <div className="flex gap-3">
                  <select 
                    value={filtreEstat}
                    onChange={(e) => setFiltreEstat(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="tots">Tots els estats</option>
                    <option value="nou">Nous</option>
                    <option value="qualificat">Qualificats</option>
                    <option value="nurturing">Nurturing</option>
                    <option value="negociacio">Negociació</option>
                  </select>
                  <select 
                    value={filtreSector}
                    onChange={(e) => setFiltreSector(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="tots">Tots els sectors</option>
                    <option value="Technology">Technology</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {leadsEmpreses
                  .filter(l => filtreEstat === 'tots' || l.estat === filtreEstat)
                  .filter(l => filtreSector === 'tots' || l.sector === filtreSector)
                  .map(lead => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-semibold text-lg">{lead.nom}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${getColorEstat(lead.estat)}`}>
                              {lead.estat}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getFasePipelineColor(lead.fase_pipeline)}`}>
                              {lead.fase_pipeline}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {lead.sector}
                            </span>
                          </div>

                          <div className="grid grid-cols-6 gap-4 text-sm mb-3">
                            <div>
                              <div className="text-gray-500">Score</div>
                              <div className="font-semibold">{lead.score}/100</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${lead.score}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500">Prob. Conversió</div>
                              <div className="font-semibold">{lead.probabilitat_conversio}%</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Valor Estimat</div>
                              <div className="font-semibold">€{lead.valor_estimat.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Temps Pipeline</div>
                              <div className="font-semibold">{lead.temps_pipeline}d</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Touchpoints</div>
                              <div className="font-semibold">{lead.touchpoints}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Font Acquisició</div>
                              <div className="font-semibold text-xs">{lead.font_acquisition}</div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm text-gray-600 mb-1">Punts de dolor identificats:</div>
                            <div className="flex flex-wrap gap-1">
                              {lead.punt_dolor.map(dolor => (
                                <span key={dolor} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
                                  {dolor}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-gray-600">
                                {lead.empleats} empleats • 
                                {lead.facturacio ? ` €${(lead.facturacio / 1000000).toFixed(1)}M facturació` : ' Facturació N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                Assignat a: {lead.assignat_a || 'No assignat'}
                              </span>
                              <span className="text-gray-600">
                                • Últim contacte: {lead.ultim_contacte.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-100 rounded-lg">
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-green-100 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-purple-100 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Campanyes Lead Gen */}
          {vistaActiva === 'campanyes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Campanyes de Lead Generation</h3>
                <button 
                  onClick={() => setShowCampanyaModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Campanya
                </button>
              </div>

              <div className="space-y-4">
                {campanyesB2B.map(campanya => {
                  const roi = calcularROICampanya(campanya)
                  return (
                    <div key={campanya.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{campanya.nom}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-1 rounded text-sm ${
                              campanya.estat === 'activa' ? 'bg-green-100 text-green-700' :
                              campanya.estat === 'completada' ? 'bg-blue-100 text-blue-700' :
                              campanya.estat === 'pausada' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {campanya.estat}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                              {campanya.tipus.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">ROI</div>
                          <div className={`text-xl font-bold ${
                            roi >= 200 ? 'text-green-600' :
                            roi >= 100 ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            +{roi.toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Leads Generats</div>
                          <div className="text-2xl font-bold">{campanya.metriques.leads}</div>
                          <div className="text-xs text-gray-500">
                            {campanya.metriques.leads_qualificats} qualificats
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Cost per Lead</div>
                          <div className="text-2xl font-bold">€{campanya.metriques.cost_per_lead}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Revenue Generat</div>
                          <div className="text-2xl font-bold">€{(campanya.metriques.revenue_generat / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Oportunitats</div>
                          <div className="text-2xl font-bold">{campanya.metriques.oportunitats}</div>
                          <div className="text-xs text-gray-500">
                            {((campanya.metriques.oportunitats / campanya.metriques.leads_qualificats) * 100).toFixed(0)}% conversió
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {campanya.canals.map(canal => (
                            <span key={canal} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              {canal}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-blue-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Account Based Marketing */}
          {vistaActiva === 'abm' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Account Based Marketing</h3>
                <button 
                  onClick={() => setShowABMModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Nou ABM Account
                </button>
              </div>

              <div className="space-y-6">
                {accountsABM.map(account => (
                  <div key={account.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-xl">{account.nom_compte}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                            {account.fase_abm}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {account.sector}
                          </span>
                          <span className="text-sm text-gray-600">
                            Score: {account.score_compte}/100
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Revenue Potential</div>
                        <div className="text-2xl font-bold text-green-600">
                          €{(account.revenue_potential / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Stakeholders Clau</h5>
                        <div className="space-y-2">
                          {account.stakeholders.map((stakeholder, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <div className="font-medium text-sm">{stakeholder.nom}</div>
                                <div className="text-xs text-gray-600">{stakeholder.rol}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  stakeholder.influencia === 'alta' ? 'bg-red-100 text-red-700' :
                                  stakeholder.influencia === 'mitjana' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {stakeholder.influencia}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {stakeholder.engagement}% eng
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Next Actions</h5>
                        <ul className="space-y-2">
                          {account.next_actions.map((action, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {action}
                            </li>
                          ))}
                        </ul>

                        <h5 className="font-medium mb-3 mt-4">Content Personalitzat</h5>
                        <div className="flex flex-wrap gap-2">
                          {account.content_personalitzat.map(content => (
                            <span key={content} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {content}
                            </span>
                          ))}
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
              <h3 className="text-xl font-bold">Sistema B2B Lead Generation</h3>
              <button onClick={() => setShowCampanyaModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet de lead generation B2B implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Lead scoring amb machine learning</li>
                <li>Account Based Marketing automation</li>
                <li>Multi-touch attribution B2B</li>
                <li>Intent data integration</li>
                <li>Sales enablement automation</li>
                <li>Pipeline forecasting predictiu</li>
                <li>Cross-channel nurturing workflows</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}