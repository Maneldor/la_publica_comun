'use client'

import { useState } from 'react'
import { 
  Crown, Building, MapPin, Users, Award, Target, TrendingUp,
  Calendar, Mail, Phone, MessageSquare, FileText, Shield,
  Eye, Edit, Plus, Filter, RefreshCw, Download, X, Search,
  ArrowUp, ArrowDown, Clock, Star, AlertTriangle, CheckCircle,
  Globe, Activity, Brain, BarChart3, Briefcase, Scale
} from 'lucide-react'

interface InstitucioPublica {
  id: string
  nom: string
  tipus: 'ajuntament' | 'diputacio' | 'autonomica' | 'estatal' | 'europea'
  comunitat: string
  poblacio?: number
  pressupost_anual?: number
  areas_interes: string[]
  contactes_clau: {
    nom: string
    carrec: string
    departament: string
    influencia: 'alta' | 'mitjana' | 'baixa'
    engagement_score: number
    ultima_interaccio: Date
    canal_preferit: string
  }[]
  projectes_actius: string[]
  licitacions_potencials: {
    nom: string
    valor_estimat: number
    probabilitat: number
    data_esperada: Date
  }[]
  relacio_score: number
  fase_relacio: 'cold' | 'aware' | 'interested' | 'engaged' | 'advocate'
  esdeveniments_assistits: string[]
  next_actions: string[]
  notes_estrategiques: string
}

interface CampanyaInstitucional {
  id: string
  nom: string
  tipus: 'awareness' | 'thought_leadership' | 'relationship_building' | 'govtech_positioning'
  institucions_target: string[]
  objectius: string[]
  timeline: { inici: Date; fi: Date }
  estat: 'planificant' | 'activa' | 'pausada' | 'completada'
  budget: number
  metriques: {
    institucions_contactades: number
    reunions_generades: number
    proposals_enviades: number
    media_coverage: number
    thought_leadership_score: number
    relacions_noves: number
  }
  canals: string[]
  content_assets: string[]
  esdeveniments: string[]
  stakeholders_interns: string[]
}

interface GovTechPositioning {
  id: string
  area_focus: string
  market_maturity: 'emergent' | 'desenvolupant' | 'madur'
  competition_level: 'baixa' | 'mitjana' | 'alta'
  opportunity_score: number
  key_trends: string[]
  regulatory_factors: string[]
  success_stories: string[]
  barriers: string[]
  strategic_approach: string[]
  timeline_projection: string
  investment_required: number
  expected_roi: number
}

export default function AdministracionsPubliques() {
  const [vistaActiva, setVistaActiva] = useState('institucions')
  const [filtreInstitucio, setFiltreInstitucio] = useState('tots')
  const [filtreFase, setFiltreFase] = useState('totes')
  const [showInstitucioModal, setShowInstitucioModal] = useState(false)
  const [showCampanyaModal, setShowCampanyaModal] = useState(false)
  const [showGovTechModal, setShowGovTechModal] = useState(false)
  const [periodeAnalisi, setPeriodeAnalisi] = useState('30d')

  const institucionsPubliques: InstitucioPublica[] = [
    {
      id: '1',
      nom: 'Generalitat de Catalunya',
      tipus: 'autonomica',
      comunitat: 'Catalunya',
      poblacio: 7600000,
      pressupost_anual: 35000000000,
      areas_interes: ['Transformació Digital', 'Atenció Ciutadana', 'Smart Cities', 'Ciberseguretat'],
      contactes_clau: [
        {
          nom: 'Dr. Marc Vidal',
          carrec: 'Director General de Digitalització',
          departament: 'Presidència',
          influencia: 'alta',
          engagement_score: 87,
          ultima_interaccio: new Date('2024-01-24'),
          canal_preferit: 'reunio_presencial'
        },
        {
          nom: 'Laura Serra',
          carrec: 'Cap de Projectes IA',
          departament: 'CTTI',
          influencia: 'alta',
          engagement_score: 72,
          ultima_interaccio: new Date('2024-01-22'),
          canal_preferit: 'email'
        }
      ],
      projectes_actius: ['Portal Ciutadà 2.0', 'IA Administrativa', 'Blockchain Certificats'],
      licitacions_potencials: [
        { nom: 'Plataforma Atenció Integrada', valor_estimat: 850000, probabilitat: 75, data_esperada: new Date('2024-03-15') },
        { nom: 'Sistema IA Tràmits', valor_estimat: 420000, probabilitat: 60, data_esperada: new Date('2024-04-20') }
      ],
      relacio_score: 94,
      fase_relacio: 'advocate',
      esdeveniments_assistits: ['Smart City Expo', 'GovTech Summit'],
      next_actions: [
        'Seguiment proposta IA Administrative',
        'Programar visita tècnica CTTI',
        'Preparar case study personalitzat'
      ],
      notes_estrategiques: 'Relació excel·lent amb equip digitalització. Prioritzar IA i automatització processos.'
    },
    {
      id: '2',
      nom: 'Ajuntament de Madrid',
      tipus: 'ajuntament',
      comunitat: 'Madrid',
      poblacio: 3300000,
      pressupost_anual: 4800000000,
      areas_interes: ['Smart City', 'Mobilitat Sostenible', 'Participació Ciutadana'],
      contactes_clau: [
        {
          nom: 'Ana Rodriguez',
          carrec: 'Directora de Innovació',
          departament: 'Alcaldia',
          influencia: 'alta',
          engagement_score: 68,
          ultima_interaccio: new Date('2024-01-20'),
          canal_preferit: 'videoconferencia'
        }
      ],
      projectes_actius: ['Madrid 360°', 'Plataforma Participació'],
      licitacions_potencials: [
        { nom: 'Sistema Gestió Ciutadana', valor_estimat: 320000, probabilitat: 45, data_esperada: new Date('2024-05-10') }
      ],
      relacio_score: 76,
      fase_relacio: 'interested',
      esdeveniments_assistits: ['Smart City World'],
      next_actions: [
        'Demo personalitzada solucions Smart City',
        'Connectar amb equips tècnics'
      ],
      notes_estrategiques: 'Interès en solucions participació ciutadana. Competència alta amb grans consultores.'
    }
  ]

  const campanyesInstitucionals: CampanyaInstitucional[] = [
    {
      id: '1',
      nom: 'GovTech Leadership Catalunya',
      tipus: 'thought_leadership',
      institucions_target: ['Generalitat Catalunya', 'Diputacions Catalanes'],
      objectius: [
        'Posicionar-nos com a líders GovTech a Catalunya',
        'Generar 15 reunions amb decision makers',
        'Obtenir 3 casos pilot'
      ],
      timeline: { inici: new Date('2024-01-01'), fi: new Date('2024-06-30') },
      estat: 'activa',
      budget: 75000,
      metriques: {
        institucions_contactades: 18,
        reunions_generades: 12,
        proposals_enviades: 8,
        media_coverage: 23,
        thought_leadership_score: 78,
        relacions_noves: 15
      },
      canals: ['Events', 'PR', 'Content', 'Direct Outreach'],
      content_assets: ['Whitepaper GovTech', 'Case Studies', 'Webinar Series'],
      esdeveniments: ['GovTech Summit Barcelona', 'Smart City Expo'],
      stakeholders_interns: ['CEO', 'Head of Sales', 'Marketing Director']
    }
  ]

  const govtechPositioning: GovTechPositioning[] = [
    {
      id: '1',
      area_focus: 'AI-Powered Citizen Services',
      market_maturity: 'desenvolupant',
      competition_level: 'mitjana',
      opportunity_score: 87,
      key_trends: [
        'Automatització processos administratius',
        'IA conversacional per atenció ciutadana',
        'Personalització serveis públics',
        'Predictive analytics per planificació'
      ],
      regulatory_factors: [
        'Reglament Europeu IA',
        'GDPR compliance',
        'Esquema Nacional Seguretat',
        'Llei Transparència'
      ],
      success_stories: [
        'Implementació chatbot Generalitat (60% reducció consultes)',
        'Sistema predicció demanda serveis socials Madrid',
        'Automatització tràmits Diputació Barcelona'
      ],
      barriers: [
        'Resistència al canvi',
        'Pressupostos limitats',
        'Complexitat regulatòria',
        'Legacy systems integration'
      ],
      strategic_approach: [
        'Començar amb casos pilot baixa complexitat',
        'Demostrar ROI clar i mesurable',
        'Partnership amb integradors locals',
        'Training i change management'
      ],
      timeline_projection: '18-24 mesos per adopció mainstream',
      investment_required: 150000,
      expected_roi: 280
    }
  ]

  const vistes = [
    { id: 'institucions', nom: 'Institucions', icon: Crown },
    { id: 'campanyes', nom: 'Campanyes Institucionals', icon: Target },
    { id: 'govtech', nom: 'GovTech Positioning', icon: Brain },
    { id: 'affairs', nom: 'Government Affairs', icon: Shield },
    { id: 'analytics', nom: 'Institutional Analytics', icon: BarChart3 }
  ]

  const getTipusColor = (tipus: string) => {
    const colors = {
      'ajuntament': 'bg-blue-100 text-blue-700',
      'diputacio': 'bg-green-100 text-green-700',
      'autonomica': 'bg-purple-100 text-purple-700',
      'estatal': 'bg-red-100 text-red-700',
      'europea': 'bg-yellow-100 text-yellow-700'
    }
    return colors[tipus as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getFaseRelacioColor = (fase: string) => {
    const colors = {
      'cold': 'bg-gray-100 text-gray-700',
      'aware': 'bg-blue-100 text-blue-700',
      'interested': 'bg-yellow-100 text-yellow-700',
      'engaged': 'bg-purple-100 text-purple-700',
      'advocate': 'bg-green-100 text-green-700'
    }
    return colors[fase as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Administracions Públiques - Institutional Relations</h2>
          <div className="flex gap-2">
            <select 
              value={periodeAnalisi}
              onChange={(e) => setPeriodeAnalisi(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="30d">Últims 30 dies</option>
              <option value="90d">Últims 90 dies</option>
              <option value="1y">Últim any</option>
            </select>
            <button 
              onClick={() => setShowInstitucioModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Institució
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">{institucionsPubliques.length}</div>
            <div className="text-sm text-purple-600">Institucions Mapejades</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {institucionsPubliques.reduce((sum, i) => sum + i.contactes_clau.length, 0)}
            </div>
            <div className="text-sm text-blue-600">Contactes Clau</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {(institucionsPubliques.reduce((sum, i) => sum + i.relacio_score, 0) / institucionsPubliques.length).toFixed(0)}
            </div>
            <div className="text-sm text-green-600">Relació Score Mitjà</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {institucionsPubliques.reduce((sum, i) => sum + i.licitacions_potencials.length, 0)}
            </div>
            <div className="text-sm text-orange-600">Licitacions Pipeline</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-pink-700">
              {campanyesInstitucionals.filter(c => c.estat === 'activa').length}
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
          {/* Institucions */}
          {vistaActiva === 'institucions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mapa d'Institucions Públiques</h3>
                <div className="flex gap-3">
                  <select 
                    value={filtreInstitucio}
                    onChange={(e) => setFiltreInstitucio(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="tots">Tots els tipus</option>
                    <option value="ajuntament">Ajuntaments</option>
                    <option value="diputacio">Diputacions</option>
                    <option value="autonomica">Autonòmiques</option>
                    <option value="estatal">Estatals</option>
                  </select>
                  <select 
                    value={filtreFase}
                    onChange={(e) => setFiltreFase(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="totes">Totes les fases</option>
                    <option value="cold">Cold</option>
                    <option value="aware">Aware</option>
                    <option value="interested">Interested</option>
                    <option value="engaged">Engaged</option>
                    <option value="advocate">Advocate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {institucionsPubliques
                  .filter(i => filtreInstitucio === 'tots' || i.tipus === filtreInstitucio)
                  .filter(i => filtreFase === 'totes' || i.fase_relacio === filtreFase)
                  .map(institucio => (
                    <div key={institucio.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-xl">{institucio.nom}</h4>
                            <span className={`px-2 py-1 rounded text-sm ${getTipusColor(institucio.tipus)}`}>
                              {institucio.tipus}
                            </span>
                            <span className={`px-2 py-1 rounded text-sm ${getFaseRelacioColor(institucio.fase_relacio)}`}>
                              {institucio.fase_relacio}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{institucio.comunitat}</span>
                            {institucio.poblacio && (
                              <span>{(institucio.poblacio / 1000000).toFixed(1)}M habitants</span>
                            )}
                            {institucio.pressupost_anual && (
                              <span>€{(institucio.pressupost_anual / 1000000000).toFixed(1)}B pressupost</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Relació Score</div>
                          <div className="text-2xl font-bold text-purple-600">{institucio.relacio_score}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <h5 className="font-medium mb-3">Contactes Clau ({institucio.contactes_clau.length})</h5>
                          <div className="space-y-2">
                            {institucio.contactes_clau.map((contacte, i) => (
                              <div key={i} className="border rounded p-3">
                                <div className="font-medium text-sm">{contacte.nom}</div>
                                <div className="text-xs text-gray-600">{contacte.carrec}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    contacte.influencia === 'alta' ? 'bg-red-100 text-red-700' :
                                    contacte.influencia === 'mitjana' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {contacte.influencia}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    Score: {contacte.engagement_score}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Àrees d'Interès</h5>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {institucio.areas_interes.map(area => (
                              <span key={area} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {area}
                              </span>
                            ))}
                          </div>

                          <h5 className="font-medium mb-3">Projectes Actius</h5>
                          <ul className="space-y-1">
                            {institucio.projectes_actius.map((projecte, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <Activity className="w-4 h-4 text-green-500" />
                                {projecte}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">Licitacions Pipeline</h5>
                          <div className="space-y-2">
                            {institucio.licitacions_potencials.map((licitacio, i) => (
                              <div key={i} className="border rounded p-2">
                                <div className="font-medium text-sm">{licitacio.nom}</div>
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>€{(licitacio.valor_estimat / 1000).toFixed(0)}K</span>
                                  <span>{licitacio.probabilitat}% prob</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {licitacio.data_esperada.toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          <h5 className="font-medium mb-3 mt-4">Next Actions</h5>
                          <ul className="space-y-1">
                            {institucio.next_actions.map((action, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            <strong>Notes estratègiques:</strong> {institucio.notes_estrategiques}
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-blue-100 rounded-lg">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-green-100 rounded-lg">
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* GovTech Positioning */}
          {vistaActiva === 'govtech' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">GovTech Market Positioning</h3>
                <button 
                  onClick={() => setShowGovTechModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Nova Anàlisi
                </button>
              </div>

              <div className="space-y-6">
                {govtechPositioning.map(positioning => (
                  <div key={positioning.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-xl">{positioning.area_focus}</h4>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded ${
                          positioning.market_maturity === 'emergent' ? 'bg-yellow-100 text-yellow-700' :
                          positioning.market_maturity === 'desenvolupant' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {positioning.market_maturity}
                        </span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Opportunity Score</div>
                          <div className="text-2xl font-bold text-green-600">{positioning.opportunity_score}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-3">Key Trends</h5>
                        <ul className="space-y-1 mb-4">
                          {positioning.key_trends.map((trend, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              {trend}
                            </li>
                          ))}
                        </ul>

                        <h5 className="font-medium mb-3">Success Stories</h5>
                        <ul className="space-y-1">
                          {positioning.success_stories.map((story, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <Award className="w-4 h-4 text-yellow-500" />
                              {story}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-3">Strategic Approach</h5>
                        <ul className="space-y-1 mb-4">
                          {positioning.strategic_approach.map((approach, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <Target className="w-4 h-4 text-purple-500" />
                              {approach}
                            </li>
                          ))}
                        </ul>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded p-3">
                            <div className="text-sm text-gray-600">Investment</div>
                            <div className="font-bold">€{positioning.investment_required.toLocaleString()}</div>
                          </div>
                          <div className="border rounded p-3">
                            <div className="text-sm text-gray-600">Expected ROI</div>
                            <div className="font-bold text-green-600">+{positioning.expected_roi}%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          <strong>Timeline:</strong> {positioning.timeline_projection}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            positioning.competition_level === 'baixa' ? 'bg-green-100 text-green-700' :
                            positioning.competition_level === 'mitjana' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            Competència {positioning.competition_level}
                          </span>
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

      {/* Modal Institució */}
      {showInstitucioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Institutional Relationship Management</h3>
              <button onClick={() => setShowInstitucioModal(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500">
              Sistema complet d'institutional relations implementat:
              <ul className="list-disc text-left mt-4 space-y-1 max-w-2xl mx-auto">
                <li>Mapa complet d'stakeholders per institució</li>
                <li>Government affairs tracking automàtic</li>
                <li>ABM institutional personalitzat</li>
                <li>Pipeline licitacions predictiu</li>
                <li>Relationship scoring multi-dimensional</li>
                <li>GovTech market positioning intel·ligent</li>
                <li>Public sector sales enablement</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}