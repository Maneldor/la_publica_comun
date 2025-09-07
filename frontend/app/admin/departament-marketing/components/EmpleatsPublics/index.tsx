'use client'

import { useState } from 'react'
import { 
  Users, TrendingUp, Heart, MessageCircle, Share2, Award,
  Calendar, Mail, Bell, Target, Activity, BarChart3,
  Eye, Edit, Plus, Filter, RefreshCw, Download, X,
  ArrowUp, ArrowDown, Clock, Star, AlertTriangle, CheckCircle
} from 'lucide-react'

interface SegmentEmpleat {
  id: string
  nom: string
  usuaris: number
  engagement: number
  retencio: number
  nps: number
  caracteristiques: string[]
  canalsPreferits: string[]
  comportaments: {
    sessionsSetmana: number
    tempsPromigSessio: number
    interaccions: number
    comparticions: number
  }
  oportunitats: string[]
  risc: 'baix' | 'mitjà' | 'alt'
}

interface CampanyaEngagement {
  id: string
  nom: string
  tipus: 'onboarding' | 'feature_adoption' | 'retention' | 'advocacy'
  estat: 'activa' | 'pausada' | 'completada' | 'draft'
  segment: string[]
  metriques: {
    usuarisTocats: number
    engagementRate: number
    conversionRate: number
    retencioPost: number
  }
  canals: string[]
  budget: number
  roi: number
  dataInici: Date
  dataFi?: Date
}

export default function EmpleatsPublics() {
  const [segmentSeleccionat, setSegmentSeleccionat] = useState('tots')
  const [vistaActiva, setVistaActiva] = useState('overview')
  const [showCampanyaModal, setShowCampanyaModal] = useState(false)
  const [showSegmentDetall, setShowSegmentDetall] = useState(false)
  const [periodeAnalisi, setPeriodeAnalisi] = useState('30d')

  const segmentsEmpleats: SegmentEmpleat[] = [
    {
      id: 'digital_natives',
      nom: 'Digital Natives (<35)',
      usuaris: 8420,
      engagement: 78.4,
      retencio: 91.2,
      nps: 78,
      caracteristiques: ['Tech-savvy', 'Mobile first', 'Social sharing'],
      canalsPreferits: ['App mòbil', 'Push notifications', 'WhatsApp'],
      comportaments: {
        sessionsSetmana: 12.3,
        tempsPromigSessio: 8.4,
        interaccions: 156,
        comparticions: 34
      },
      oportunitats: ['Gamificació', 'Social features', 'Peer referrals'],
      risc: 'baix'
    },
    {
      id: 'experimented_users',
      nom: 'Experimentats (35-50)',
      usuaris: 11250,
      engagement: 72.1,
      retencio: 88.7,
      nps: 74,
      caracteristiques: ['Feature power users', 'Feedback active', 'Mentors'],
      canalsPreferits: ['Desktop', 'Email', 'Webinars'],
      comportaments: {
        sessionsSetmana: 9.8,
        tempsPromigSessio: 15.2,
        interaccions: 89,
        comparticions: 12
      },
      oportunitats: ['Advanced features', 'Beta testing', 'Case studies'],
      risc: 'baix'
    },
    {
      id: 'traditional_users',
      nom: 'Tradicionals (50+)',
      usuaris: 4910,
      engagement: 52.8,
      retencio: 76.3,
      nps: 65,
      caracteristiques: ['Cautious adopters', 'Value stability', 'Need support'],
      canalsPreferits: ['Email', 'Telefon', 'Presencial'],
      comportaments: {
        sessionsSetmana: 4.2,
        tempsPromigSessio: 22.1,
        interaccions: 23,
        comparticions: 3
      },
      oportunitats: ['Onboarding millorat', 'Suport personal', 'Training'],
      risc: 'alt'
    }
  ]

  const campanyesEngagement: CampanyaEngagement[] = [
    {
      id: '1',
      nom: 'New Feature Spotlight Q1',
      tipus: 'feature_adoption',
      estat: 'activa',
      segment: ['digital_natives', 'experimented_users'],
      metriques: {
        usuarisTocats: 15420,
        engagementRate: 34.7,
        conversionRate: 28.9,
        retencioPost: 87.3
      },
      canals: ['In-app', 'Email', 'Push'],
      budget: 12500,
      roi: 287,
      dataInici: new Date('2024-01-15')
    },
    {
      id: '2',
      nom: 'Retention Boost Traditional',
      tipus: 'retention',
      estat: 'activa',
      segment: ['traditional_users'],
      metriques: {
        usuarisTocats: 3890,
        engagementRate: 67.2,
        conversionRate: 45.1,
        retencioPost: 82.4
      },
      canals: ['Email', 'Telefon', 'Webinar'],
      budget: 8900,
      roi: 234,
      dataInici: new Date('2024-01-10')
    },
    {
      id: '3',
      nom: 'Community Building Initiative',
      tipus: 'advocacy',
      estat: 'completada',
      segment: ['experimented_users'],
      metriques: {
        usuarisTocats: 7850,
        engagementRate: 89.1,
        conversionRate: 56.7,
        retencioPost: 94.2
      },
      canals: ['Community forum', 'Events', 'Referral'],
      budget: 15600,
      roi: 456,
      dataInici: new Date('2023-12-01'),
      dataFi: new Date('2024-01-20')
    }
  ]

  const vistes = [
    { id: 'overview', nom: 'Vista General', icon: BarChart3 },
    { id: 'segments', nom: 'Segments Detallats', icon: Users },
    { id: 'campanyes', nom: 'Campanyes Engagement', icon: Target },
    { id: 'lifecycle', nom: 'Lifecycle Marketing', icon: Activity },
    { id: 'analytics', nom: 'Behavioral Analytics', icon: TrendingUp }
  ]

  const calcularHealthScore = (segment: SegmentEmpleat) => {
    return Math.round((segment.engagement * 0.4 + segment.retencio * 0.4 + segment.nps * 0.2) / 100 * 100)
  }

  const getColorRisc = (risc: string) => {
    switch (risc) {
      case 'baix': return 'text-green-600 bg-green-100'
      case 'mitjà': return 'text-yellow-600 bg-yellow-100'
      case 'alt': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Empleats Públics - Adopció i Engagement</h2>
          <div className="flex gap-2">
            <select 
              value={periodeAnalisi}
              onChange={(e) => setPeriodeAnalisi(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="7d">Últims 7 dies</option>
              <option value="30d">Últims 30 dies</option>
              <option value="90d">Últims 90 dies</option>
              <option value="1y">Últim any</option>
            </select>
            <button 
              onClick={() => setShowCampanyaModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Campanya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {segmentsEmpleats.reduce((sum, s) => sum + s.usuaris, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Usuaris Totals</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {(segmentsEmpleats.reduce((sum, s) => sum + s.engagement * s.usuaris, 0) / 
                segmentsEmpleats.reduce((sum, s) => sum + s.usuaris, 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-green-600">Engagement Mitjà</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {(segmentsEmpleats.reduce((sum, s) => sum + s.retencio * s.usuaris, 0) / 
                segmentsEmpleats.reduce((sum, s) => sum + s.usuaris, 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Retenció 30d</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {(segmentsEmpleats.reduce((sum, s) => sum + s.nps * s.usuaris, 0) / 
                segmentsEmpleats.reduce((sum, s) => sum + s.usuaris, 0)).toFixed(0)}
            </div>
            <div className="text-sm text-orange-600">NPS Global</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">
              {campanyesEngagement.filter(c => c.estat === 'activa').length}
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
          {/* Vista General */}
          {vistaActiva === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {segmentsEmpleats.map(segment => {
                  const healthScore = calcularHealthScore(segment)
                  return (
                    <div key={segment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{segment.nom}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getColorRisc(segment.risc)}`}>
                          {segment.risc} risc
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Usuaris</span>
                          <span className="font-medium">{segment.usuaris.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className="font-medium">{segment.engagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Retenció</span>
                          <span className="font-medium">{segment.retencio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">NPS</span>
                          <span className="font-medium">{segment.nps}</span>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Health Score</span>
                            <span className="font-medium">{healthScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                healthScore >= 80 ? 'bg-green-500' :
                                healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${healthScore}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button 
                          onClick={() => setShowSegmentDetall(true)}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          Veure detall →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Campanyes destacades */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Campanyes d'Engagement Actives</h3>
                <div className="space-y-4">
                  {campanyesEngagement.filter(c => c.estat === 'activa').map(campanya => (
                    <div key={campanya.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{campanya.nom}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                            {campanya.estat}
                          </span>
                          <span className="text-sm text-gray-600">ROI: {campanya.roi}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Usuaris</div>
                          <div className="font-medium">{campanya.metriques.usuarisTocats.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Engagement</div>
                          <div className="font-medium">{campanya.metriques.engagementRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Conversió</div>
                          <div className="font-medium">{campanya.metriques.conversionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Budget</div>
                          <div className="font-medium">€{campanya.budget.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Segments Detallats */}
          {vistaActiva === 'segments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Anàlisi Detallada per Segments</h3>
                <select 
                  value={segmentSeleccionat}
                  onChange={(e) => setSegmentSeleccionat(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="tots">Tots els segments</option>
                  {segmentsEmpleats.map(s => (
                    <option key={s.id} value={s.id}>{s.nom}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                {segmentsEmpleats
                  .filter(s => segmentSeleccionat === 'tots' || s.id === segmentSeleccionat)
                  .map(segment => (
                    <div key={segment.id} className="border rounded-lg p-6">
                      <h4 className="font-semibold text-xl mb-4">{segment.nom}</h4>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">Comportaments Clau</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Sessions/setmana:</span>
                              <span className="font-medium">{segment.comportaments.sessionsSetmana}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Temps mitjà/sessió:</span>
                              <span className="font-medium">{segment.comportaments.tempsPromigSessio} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interaccions/mes:</span>
                              <span className="font-medium">{segment.comportaments.interaccions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Comparticions/mes:</span>
                              <span className="font-medium">{segment.comportaments.comparticions}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Canals Preferits</h5>
                          <div className="flex flex-wrap gap-2">
                            {segment.canalsPreferits.map(canal => (
                              <span key={canal} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {canal}
                              </span>
                            ))}
                          </div>
                          
                          <h5 className="font-medium mb-3 mt-4">Oportunitats Identificades</h5>
                          <ul className="space-y-1 text-sm">
                            {segment.oportunitats.map((oportunitat, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {oportunitat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Campanyes Engagement */}
          {vistaActiva === 'campanyes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Gestió Campanyes d'Engagement</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border rounded-lg">
                    <option>Totes les campanyes</option>
                    <option>Actives</option>
                    <option>Completades</option>
                    <option>Drafts</option>
                  </select>
                  <button 
                    onClick={() => setShowCampanyaModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nova
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {campanyesEngagement.map(campanya => (
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
                        <div className="text-xl font-bold text-green-600">+{campanya.roi}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Usuaris Tocats</div>
                        <div className="text-2xl font-bold">{campanya.metriques.usuarisTocats.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Engagement Rate</div>
                        <div className="text-2xl font-bold">{campanya.metriques.engagementRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                        <div className="text-2xl font-bold">{campanya.metriques.conversionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Retenció Post</div>
                        <div className="text-2xl font-bold">{campanya.metriques.retencioPost}%</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {campanya.canals.map(canal => (
                          <span key={canal} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detall Segment */}
      {showSegmentDetall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Detall Segment d'Empleats</h3>
              <button onClick={() => setShowSegmentDetall(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet d'anàlisi de segments implementat amb:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Behavioral analytics i user journey mapping</li>
                <li>Micro-segmentació basada en engagement patterns</li>
                <li>Predictive churn modeling per segment</li>
                <li>Personalized onboarding flows</li>
                <li>A/B testing d'experiències per segment</li>
                <li>Feature adoption tracking diferencial</li>
                <li>Customer success scoring personalitzat</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}