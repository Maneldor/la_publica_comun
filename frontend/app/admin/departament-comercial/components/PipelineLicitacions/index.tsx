'use client'

import { useState } from 'react'
import { 
  Scale, FileText, AlertTriangle, CheckCircle, Clock, Calendar,
  Building2, MapPin, Euro, TrendingUp, Download, Upload,
  Search, Filter, Eye, Edit, Plus, Bell, Shield, RefreshCw,
  Target, BarChart3, Users, Bot, X, ArrowRight, Star
} from 'lucide-react'

interface Licitacio {
  id: string
  nom: string
  referencia: string
  organisme: string
  comunitat: string
  tipus: 'obres' | 'serveis' | 'subministraments' | 'concessio'
  valor: number
  valorEstimat: number
  dataPublicacio: Date
  dataLimit: Date
  dataApertura?: Date
  estat: 'detectada' | 'analisi' | 'preparacio' | 'enviada' | 'avaluacio' | 'adjudicada' | 'perduda' | 'desqualificada'
  probabilitat: number
  documentsPendents: string[]
  requisits: {
    solvenciaEconomica: number
    solvenciaTecnica: string[]
    certificacions: string[]
    experienciaMinima: number
    facturacioMinima: number
  }
  competidors: string[]
  nostraproposta: {
    valor: number
    termini: number
    equip: string[]
    diferenciadors: string[]
  }
  alertes: string[]
  responsable: string
}

interface MonitorAutonomic {
  comunitat: string
  plataforma: string
  licitacionsDetectades: number
  valorTotal: number
  filtresActius: string[]
  ultimaActualitzacio: Date
  estat: 'actiu' | 'error' | 'manteniment'
}

interface TemplatePublic {
  id: string
  nom: string
  tipus: 'administracio_local' | 'autonomica' | 'estatal' | 'europea'
  seccions: {
    nom: string
    obligatori: boolean
    plantilla: string
    variables: string[]
  }[]
  documentsTecnics: string[]
  criterisAvaluacio: {
    tecnic: number
    economic: number
    social: number
    ambiental: number
  }
  usosExitos: number
}

export default function PipelineLicitacions() {
  const [vistaActiva, setVistaActiva] = useState('pipeline')
  const [filtreEstat, setFiltreEstat] = useState('totes')
  const [filtreComunitat, setFiltreComunitat] = useState('totes')
  const [licitacioSeleccionada, setLicitacioSeleccionada] = useState<Licitacio | null>(null)
  const [showModalDetall, setShowModalDetall] = useState(false)
  const [showMonitorConfig, setShowMonitorConfig] = useState(false)

  const licitacions: Licitacio[] = [
    {
      id: '1',
      nom: 'Modernització de la Administració Digital',
      referencia: 'GC-2024-00123',
      organisme: 'Generalitat de Catalunya',
      comunitat: 'Catalunya',
      tipus: 'serveis',
      valor: 850000,
      valorEstimat: 920000,
      dataPublicacio: new Date('2024-01-15'),
      dataLimit: new Date('2024-02-15'),
      dataApertura: new Date('2024-02-20'),
      estat: 'preparacio',
      probabilitat: 75,
      documentsPendents: [
        'Memòria tècnica detallada',
        'Certificació ISO 27001',
        'Equip projecte'
      ],
      requisits: {
        solvenciaEconomica: 500000,
        solvenciaTecnica: ['IA', 'Cloud Computing', 'Ciberseguretat'],
        certificacions: ['ISO 27001', 'ENS Alta'],
        experienciaMinima: 3,
        facturacioMinima: 2000000
      },
      competidors: ['IBM', 'Accenture', 'Everis', 'Indra'],
      nostraproposta: {
        valor: 849000,
        termini: 18,
        equip: ['Maria García', 'Jordi Puig', 'Anna Serra'],
        diferenciadors: [
          'Experiència sector públic',
          'IA especialitzada',
          'Suport multiidioma'
        ]
      },
      alertes: [
        'Documentació tècnica pendent',
        'Competència molt alta'
      ],
      responsable: 'Maria García'
    },
    {
      id: '2',
      nom: 'Sistema Intel·ligent Gestió Tràmits',
      referencia: 'AM-2024-0067',
      organisme: 'Ajuntament de Madrid',
      comunitat: 'Madrid',
      tipus: 'serveis',
      valor: 420000,
      valorEstimat: 450000,
      dataPublicacio: new Date('2024-01-10'),
      dataLimit: new Date('2024-02-08'),
      dataApertura: new Date('2024-02-12'),
      estat: 'enviada',
      probabilitat: 65,
      documentsPendents: [],
      requisits: {
        solvenciaEconomica: 250000,
        solvenciaTecnica: ['IA', 'RPA', 'Integració sistemes'],
        certificacions: ['ISO 9001'],
        experienciaMinima: 2,
        facturacioMinima: 1000000
      },
      competidors: ['Microsoft', 'Google', 'Deloitte'],
      nostraproposta: {
        valor: 418000,
        termini: 12,
        equip: ['Jordi Martínez', 'Laura Vidal'],
        diferenciadors: [
          'Solució propietària IA',
          'ROI demostrable',
          'Temps implementació reduït'
        ]
      },
      alertes: [],
      responsable: 'Jordi Martínez'
    },
    {
      id: '3',
      nom: 'Plataforma Atenció Ciutadana 24/7',
      referencia: 'DB-2024-0089',
      organisme: 'Diputació de Barcelona',
      comunitat: 'Catalunya',
      tipus: 'serveis',
      valor: 320000,
      valorEstimat: 340000,
      dataPublicacio: new Date('2024-01-18'),
      dataLimit: new Date('2024-02-20'),
      estat: 'avaluacio',
      probabilitat: 45,
      documentsPendents: [
        'Aclariments tècnics'
      ],
      requisits: {
        solvenciaEconomica: 200000,
        solvenciaTecnica: ['Chatbots', 'NLP', 'Multicanal'],
        certificacions: ['LOPD', 'Accessibilitat'],
        experienciaMinima: 2,
        facturacioMinima: 800000
      },
      competidors: ['Telefónica', 'Orange', 'Local startup'],
      nostraproposta: {
        valor: 315000,
        termini: 10,
        equip: ['Anna Serra', 'Pere Font'],
        diferenciadors: [
          'Especialització sector públic',
          'Tecnologia pròpia',
          'Suport local'
        ]
      },
      alertes: [
        'Resposta tècnica pendent',
        'Competidor local amb avantatge'
      ],
      responsable: 'Anna Serra'
    }
  ]

  const monitorsAutonomics: MonitorAutonomic[] = [
    {
      comunitat: 'Catalunya',
      plataforma: 'PLACE',
      licitacionsDetectades: 45,
      valorTotal: 12500000,
      filtresActius: ['IA', 'Digitalització', 'Serveis TIC'],
      ultimaActualitzacio: new Date(),
      estat: 'actiu'
    },
    {
      comunitat: 'Madrid',
      plataforma: 'Plataforma Compra Pública',
      licitacionsDetectades: 38,
      valorTotal: 8900000,
      filtresActius: ['Automatització', 'Administració Digital'],
      ultimaActualitzacio: new Date(),
      estat: 'actiu'
    },
    {
      comunitat: 'Valencia',
      plataforma: 'Portal Contractació',
      licitacionsDetectades: 23,
      valorTotal: 5200000,
      filtresActius: ['Smart Cities', 'IA'],
      ultimaActualitzacio: new Date(),
      estat: 'actiu'
    },
    {
      comunitat: 'Andalucía',
      plataforma: 'Plataforma Contractació Junta',
      licitacionsDetectades: 19,
      valorTotal: 4100000,
      filtresActius: ['Transformació Digital'],
      ultimaActualitzacio: new Date(),
      estat: 'error'
    }
  ]

  const templatesPublics: TemplatePublic[] = [
    {
      id: '1',
      nom: 'Proposta Administració Local - IA',
      tipus: 'administracio_local',
      seccions: [
        {
          nom: 'Resum Executiu',
          obligatori: true,
          plantilla: 'Proposta per implementar solucions d\'IA...',
          variables: ['nom_organisme', 'valor_proposta']
        },
        {
          nom: 'Solvència Tècnica',
          obligatori: true,
          plantilla: 'La nostra empresa disposa de...',
          variables: ['anys_experiencia', 'projectes_similars']
        }
      ],
      documentsTecnics: [
        'Memòria tècnica',
        'Pla de treball',
        'Equip tècnic',
        'Referències'
      ],
      criterisAvaluacio: {
        tecnic: 60,
        economic: 30,
        social: 5,
        ambiental: 5
      },
      usosExitos: 12
    }
  ]

  const vistes = [
    { id: 'pipeline', nom: 'Pipeline Licitacions', icon: Target },
    { id: 'monitor', nom: 'Monitor Automàtic', icon: Bot },
    { id: 'templates', nom: 'Templates Públics', icon: FileText },
    { id: 'competencia', nom: 'Anàlisi Competència', icon: BarChart3 },
    { id: 'requisits', nom: 'Tracking Requisits', icon: Shield },
    { id: 'calendar', nom: 'Calendari Terminis', icon: Calendar }
  ]

  const calcularDiesRestants = (dataLimit: Date) => {
    return Math.ceil((dataLimit.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const getColorEstat = (estat: string) => {
    switch (estat) {
      case 'detectada': return 'bg-gray-100 text-gray-700'
      case 'analisi': return 'bg-blue-100 text-blue-700'
      case 'preparacio': return 'bg-yellow-100 text-yellow-700'
      case 'enviada': return 'bg-purple-100 text-purple-700'
      case 'avaluacio': return 'bg-indigo-100 text-indigo-700'
      case 'adjudicada': return 'bg-green-100 text-green-700'
      case 'perduda': return 'bg-red-100 text-red-700'
      case 'desqualificada': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPrioritat = (licitacio: Licitacio) => {
    const diesRestants = calcularDiesRestants(licitacio.dataLimit)
    if (diesRestants <= 3) return 'crítica'
    if (diesRestants <= 7) return 'alta'
    if (licitacio.probabilitat >= 70) return 'alta'
    if (licitacio.valor >= 500000) return 'alta'
    return 'mitjana'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Pipeline Licitacions Públiques</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowMonitorConfig(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              Config Monitor
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nova Licitació
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{licitacions.length}</div>
            <div className="text-sm text-blue-600">Licitacions Actives</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              €{(licitacions.reduce((sum, l) => sum + l.valor, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-green-600">Valor Total Pipeline</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {Math.round(licitacions.reduce((sum, l) => sum + l.probabilitat, 0) / licitacions.length)}%
            </div>
            <div className="text-sm text-purple-600">Probabilitat Mitjana</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {monitorsAutonomics.reduce((sum, m) => sum + m.licitacionsDetectades, 0)}
            </div>
            <div className="text-sm text-orange-600">Detectades Aquest Mes</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {licitacions.filter(l => calcularDiesRestants(l.dataLimit) <= 7).length}
            </div>
            <div className="text-sm text-red-600">Terminis Crítics</div>
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
          {/* Pipeline Licitacions */}
          {vistaActiva === 'pipeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Licitacions Actives</h3>
                <div className="flex gap-3">
                  <select 
                    value={filtreEstat}
                    onChange={(e) => setFiltreEstat(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="totes">Tots els estats</option>
                    <option value="preparacio">Preparació</option>
                    <option value="enviada">Enviada</option>
                    <option value="avaluacio">Avaluació</option>
                  </select>
                  <select 
                    value={filtreComunitat}
                    onChange={(e) => setFiltreComunitat(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="totes">Totes les comunitats</option>
                    <option value="Catalunya">Catalunya</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Valencia">Valencia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {licitacions
                  .filter(l => filtreEstat === 'totes' || l.estat === filtreEstat)
                  .filter(l => filtreComunitat === 'totes' || l.comunitat === filtreComunitat)
                  .map(licitacio => {
                    const diesRestants = calcularDiesRestants(licitacio.dataLimit)
                    const prioritat = getPrioritat(licitacio)
                    
                    return (
                      <div key={licitacio.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{licitacio.nom}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getColorEstat(licitacio.estat)}`}>
                                {licitacio.estat}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                prioritat === 'crítica' ? 'bg-red-100 text-red-700' :
                                prioritat === 'alta' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {prioritat}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-6 gap-4 text-sm mb-3">
                              <div>
                                <div className="text-gray-500">Organisme</div>
                                <div className="font-medium">{licitacio.organisme}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Valor</div>
                                <div className="font-medium">€{licitacio.valor.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Probabilitat</div>
                                <div className="font-medium">{licitacio.probabilitat}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-blue-500 h-1.5 rounded-full"
                                    style={{ width: `${licitacio.probabilitat}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Dies restants</div>
                                <div className={`font-medium ${
                                  diesRestants <= 3 ? 'text-red-600' :
                                  diesRestants <= 7 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {diesRestants}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Documents</div>
                                <div className={`font-medium ${
                                  licitacio.documentsPendents.length > 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {licitacio.documentsPendents.length === 0 ? 'Complet' : `${licitacio.documentsPendents.length} pendents`}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-500">Responsable</div>
                                <div className="font-medium">{licitacio.responsable}</div>
                              </div>
                            </div>

                            {/* Alertes */}
                            {licitacio.alertes.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {licitacio.alertes.map((alerta, i) => (
                                  <div key={i} className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                    <AlertTriangle className="w-3 h-3" />
                                    {alerta}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Competidors */}
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500">Competidors:</span>
                              <div className="flex flex-wrap gap-1">
                                {licitacio.competidors.map(comp => (
                                  <span key={comp} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button 
                              onClick={() => {
                                setLicitacioSeleccionada(licitacio)
                                setShowModalDetall(true)
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg"
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-green-100 rounded-lg">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-purple-100 rounded-lg">
                              <Edit className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Monitor Automàtic */}
          {vistaActiva === 'monitor' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Monitor Automàtic per Comunitat Autònoma</h3>
              
              <div className="grid gap-4">
                {monitorsAutonomics.map(monitor => (
                  <div key={monitor.comunitat} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{monitor.comunitat}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          monitor.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                          monitor.estat === 'error' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {monitor.estat}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Última actualització: fa {Math.round((new Date().getTime() - monitor.ultimaActualitzacio.getTime()) / 60000)} min
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Plataforma</div>
                        <div className="font-medium">{monitor.plataforma}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Detectades</div>
                        <div className="font-medium">{monitor.licitacionsDetectades}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Valor Total</div>
                        <div className="font-medium">€{(monitor.valorTotal / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Filtres Actius</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {monitor.filtresActius.map(filtre => (
                            <span key={filtre} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {filtre}
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

          {/* Templates Públics */}
          {vistaActiva === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Templates per Concursos Públics</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nou Template
                </button>
              </div>

              <div className="space-y-4">
                {templatesPublics.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{template.nom}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {template.tipus.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">{template.usosExitos} usos exitosos</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Seccions del Template:</h5>
                        <div className="space-y-1">
                          {template.seccions.map((seccio, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              {seccio.obligatori ? 
                                <CheckCircle className="w-4 h-4 text-red-500" /> :
                                <Clock className="w-4 h-4 text-gray-400" />
                              }
                              <span className={seccio.obligatori ? 'font-medium' : 'text-gray-600'}>
                                {seccio.nom}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Criteris d'Avaluació:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tècnic:</span>
                            <span className="font-medium">{template.criterisAvaluacio.tecnic}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Econòmic:</span>
                            <span className="font-medium">{template.criterisAvaluacio.economic}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Social:</span>
                            <span className="font-medium">{template.criterisAvaluacio.social}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ambiental:</span>
                            <span className="font-medium">{template.criterisAvaluacio.ambiental}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Usar Template
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                        Personalitzar
                      </button>
                      <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">
                        Veure Exemple
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal detall licitació */}
      {showModalDetall && licitacioSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">{licitacioSeleccionada.nom}</h3>
              <button onClick={() => setShowModalDetall(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Informació General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Referència:</span>
                      <span className="font-medium">{licitacioSeleccionada.referencia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Organisme:</span>
                      <span className="font-medium">{licitacioSeleccionada.organisme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-medium">€{licitacioSeleccionada.valor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data límit:</span>
                      <span className="font-medium">{licitacioSeleccionada.dataLimit.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Nostra Proposta</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor proposat:</span>
                      <span className="font-medium">€{licitacioSeleccionada.nostraproposta.valor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Termini:</span>
                      <span className="font-medium">{licitacioSeleccionada.nostraproposta.termini} mesos</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Equip:</span>
                      <div className="mt-1">
                        {licitacioSeleccionada.nostraproposta.equip.map(membre => (
                          <span key={membre} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs mr-1 mb-1">
                            {membre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Documents Pendents</h4>
                {licitacioSeleccionada.documentsPendents.length > 0 ? (
                  <div className="space-y-2">
                    {licitacioSeleccionada.documentsPendents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc}</span>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                          Pujar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Tots els documents completats</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}