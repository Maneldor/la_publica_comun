'use client'

import { useState } from 'react'
import { 
  Users, Phone, Mail, Calendar, Clock, Eye, Edit, Plus, 
  MessageSquare, FileText, Play, Pause, Download, Search,
  TrendingUp, AlertTriangle, CheckCircle, Star, Award,
  BarChart3, Activity, Shield, Zap, Bot, X, Send,
  Mic, MicOff, Video, VideoOff, PhoneCall, Archive,
  DocumentCheck, CreditCard, Scale, Target, Building2,
  AlertCircle, TrendingDown, DollarSign, Briefcase
} from 'lucide-react'

interface ActividatGestor {
  id: string
  tipus: 'trucada' | 'email' | 'reunio' | 'whatsapp' | 'document'
  client: string
  durada?: number
  estat: 'completada' | 'programada' | 'perduda'
  data: Date
  notes: string
  gravacio?: string
  transcripcio?: string
  oberturaEmail?: boolean
  clicsEmail?: number
}

interface PipelineGestor {
  fase: string
  clients: number
  valor: number
  tempsPromig: number
  conversio: number
  activitats: ActividatGestor[]
}

interface GestorEmpresa {
  id: string
  nom: string
  email: string
  telefon: string
  especialitat: 'administracions' | 'empreses_grans' | 'pymes' | 'licitacions'
  territori: string[]
  objectius: {
    vendesMensual: number
    trucadesDiaries: number
    reunionsSetmana: number
    emailsOberts: number
  }
  rendiment: {
    ventesActuals: number
    trucadesRealitzades: number
    reunionsCompletades: number
    emailsEnviats: number
    taxaObertura: number
    taxaResposta: number
    tempsResposta: number
    satisfaccioClient: number
  }
  pipeline: PipelineGestor[]
  activitatsHores: ActividatGestor[]
  documentsPendents: number
  licitacionsSeguiment: number
  alertes: string[]
  estat: 'actiu' | 'ocupat' | 'disponible' | 'fora_linia'
}

interface ComunicacioIA {
  id: string
  gestorId: string
  clientId: string
  canal: 'chat' | 'whatsapp' | 'email' | 'telefon'
  missatges: {
    id: string
    remitent: 'ia' | 'gestor' | 'client'
    contingut: string
    timestamp: Date
    adjunts?: string[]
    accions?: string[]
  }[]
  handoffIA: {
    motiu: string
    context: string
    recomanacions: string[]
    confidenciaIA: number
  }
  resolucio: 'pendent' | 'resolta_ia' | 'resolta_gestor' | 'escalada'
}

export default function ControlGestorsEmpreses() {
  const [gestorSeleccionat, setGestorSeleccionat] = useState<GestorEmpresa | null>(null)
  const [vistaActiva, setVistaActiva] = useState('dashboard')
  const [filtreEspecialitat, setFiltreEspecialitat] = useState('tots')
  const [showChatIA, setShowChatIA] = useState(false)
  const [showGravacio, setShowGravacio] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showLicitacions, setShowLicitacions] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const gestors: GestorEmpresa[] = [
    {
      id: '1',
      nom: 'Maria Rodriguez',
      email: 'maria.rodriguez@lapublica.cat',
      telefon: '+34 666 123 456',
      especialitat: 'administracions',
      territori: ['Catalunya', 'Aragó'],
      objectius: {
        vendesMensual: 250000,
        trucadesDiaries: 15,
        reunionsSetmana: 8,
        emailsOberts: 85
      },
      rendiment: {
        ventesActuals: 287000,
        trucadesRealitzades: 18,
        reunionsCompletades: 6,
        emailsEnviats: 45,
        taxaObertura: 78.5,
        taxaResposta: 32.1,
        tempsResposta: 1.2,
        satisfaccioClient: 4.8
      },
      pipeline: [
        { fase: 'Prospeccio', clients: 12, valor: 180000, tempsPromig: 5, conversio: 45, activitats: [] },
        { fase: 'Qualificacio', clients: 8, valor: 320000, tempsPromig: 12, conversio: 65, activitats: [] },
        { fase: 'Proposta', clients: 5, valor: 280000, tempsPromig: 18, conversio: 75, activitats: [] },
        { fase: 'Negociacio', clients: 3, valor: 195000, tempsPromig: 25, conversio: 85, activitats: [] }
      ],
      activitatsHores: [
        {
          id: '1',
          tipus: 'trucada',
          client: 'Ajuntament Barcelona',
          durada: 25,
          estat: 'completada',
          data: new Date(),
          notes: 'Discussió sobre automatització tràmits',
          gravacio: 'call_001.mp3',
          transcripcio: 'Transcripció automàtica disponible...'
        },
        {
          id: '2',
          tipus: 'email',
          client: 'Generalitat Catalunya',
          estat: 'completada',
          data: new Date(),
          notes: 'Enviada proposta IA per atenció ciutadana',
          oberturaEmail: true,
          clicsEmail: 3
        }
      ],
      documentsPendents: 3,
      licitacionsSeguiment: 5,
      alertes: ['Client prioritari sense contacte 3 dies', 'Licitació expira en 2 dies'],
      estat: 'actiu'
    },
    {
      id: '2',
      nom: 'Jordi Martinez',
      email: 'jordi.martinez@lapublica.cat',
      telefon: '+34 666 234 567',
      especialitat: 'empreses_grans',
      territori: ['Madrid', 'Valencia'],
      objectius: {
        vendesMensual: 180000,
        trucadesDiaries: 12,
        reunionsSetmana: 6,
        emailsOberts: 80
      },
      rendiment: {
        ventesActuals: 165000,
        trucadesRealitzades: 14,
        reunionsCompletades: 4,
        emailsEnviats: 38,
        taxaObertura: 82.3,
        taxaResposta: 28.7,
        tempsResposta: 2.1,
        satisfaccioClient: 4.6
      },
      pipeline: [
        { fase: 'Prospeccio', clients: 15, valor: 220000, tempsPromig: 7, conversio: 35, activitats: [] },
        { fase: 'Qualificacio', clients: 10, valor: 380000, tempsPromig: 14, conversio: 55, activitats: [] },
        { fase: 'Proposta', clients: 6, valor: 420000, tempsPromig: 20, conversio: 68, activitats: [] },
        { fase: 'Negociacio', clients: 4, valor: 310000, tempsPromig: 30, conversio: 78, activitats: [] }
      ],
      activitatsHores: [],
      documentsPendents: 5,
      licitacionsSeguiment: 2,
      alertes: ['Proposta pendent aprovació', 'Reunió urgent programada'],
      estat: 'ocupat'
    }
  ]

  const comunicacionsIA: ComunicacioIA[] = [
    {
      id: '1',
      gestorId: '1',
      clientId: 'client_001',
      canal: 'whatsapp',
      missatges: [
        {
          id: '1',
          remitent: 'client',
          contingut: 'Hola, necessito informació sobre la vostra solució per automatitzar tràmits',
          timestamp: new Date(),
        },
        {
          id: '2',
          remitent: 'ia',
          contingut: 'Hola! Soc l\'assistent IA de La Pública. Podem automatitzar fins al 80% dels tràmits. Et passaré amb un especialista.',
          timestamp: new Date(),
          accions: ['handoff_gestor']
        },
        {
          id: '3',
          remitent: 'gestor',
          contingut: 'Hola, soc Maria Rodriguez, especialista en administracions. Quan podríem parlar per telèfon?',
          timestamp: new Date(),
        }
      ],
      handoffIA: {
        motiu: 'Consulta complexa sobre automatització',
        context: 'Client interessat en solució integral. Budget aproximat €50K',
        recomanacions: ['Agendar demo tècnica', 'Enviar cas d\'èxit similar'],
        confidenciaIA: 85
      },
      resolucio: 'pendent'
    }
  ]

  const vistes = [
    { id: 'dashboard', nom: 'Dashboard General', icon: BarChart3 },
    { id: 'activitats', nom: 'Activitats Diàries', icon: Activity },
    { id: 'pipeline', nom: 'Pipeline Individual', icon: Target },
    { id: 'comunicacio', nom: 'Comunicació IA', icon: Bot },
    { id: 'documents', nom: 'Gestió Documents', icon: FileText },
    { id: 'licitacions', nom: 'Licitacions Actives', icon: Scale },
    { id: 'analytics', nom: 'Analytics Avançats', icon: TrendingUp },
    { id: 'compliance', nom: 'Compliance & Legal', icon: Shield }
  ]

  const calcularHealthScore = (gestor: GestorEmpresa) => {
    const ventesScore = (gestor.rendiment.ventesActuals / gestor.objectius.vendesMensual) * 30
    const actividatScore = (gestor.rendiment.trucadesRealitzades / gestor.objectius.trucadesDiaries) * 25
    const satisfaccioScore = gestor.rendiment.satisfaccioClient * 20
    const resposta = Math.max(0, 25 - gestor.rendiment.tempsResposta * 5)
    
    return Math.min(100, ventesScore + actividatScore + satisfaccioScore + resposta)
  }

  return (
    <div className="space-y-6">
      {/* Header amb stats globals */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Control Integral Gestors d'Empreses</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowChatIA(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              Chat IA
            </button>
            <button 
              onClick={() => setShowAnalytics(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{gestors.length}</div>
            <div className="text-sm text-blue-600">Gestors Actius</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              €{(gestors.reduce((sum, g) => sum + g.rendiment.ventesActuals, 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-green-600">Vendes Acumulades</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {(gestors.reduce((sum, g) => sum + g.rendiment.taxaObertura, 0) / gestors.length).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Taxa Obertura Mitjana</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {gestors.reduce((sum, g) => sum + g.documentsPendents, 0)}
            </div>
            <div className="text-sm text-orange-600">Documents Pendents</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {gestors.reduce((sum, g) => sum + g.alertes.length, 0)}
            </div>
            <div className="text-sm text-red-600">Alertes Actives</div>
          </div>
        </div>
      </div>

      {/* Navegació de vistes */}
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
          {/* Dashboard General */}
          {vistaActiva === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Rendiment Individual Gestors</h3>
                <select 
                  value={filtreEspecialitat}
                  onChange={(e) => setFiltreEspecialitat(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="tots">Totes les especialitats</option>
                  <option value="administracions">Administracions</option>
                  <option value="empreses_grans">Empreses Grans</option>
                  <option value="pymes">PYMEs</option>
                  <option value="licitacions">Licitacions</option>
                </select>
              </div>

              <div className="grid gap-4">
                {gestors
                  .filter(g => filtreEspecialitat === 'tots' || g.especialitat === filtreEspecialitat)
                  .map(gestor => {
                    const healthScore = calcularHealthScore(gestor)
                    return (
                      <div key={gestor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {gestor.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-lg">{gestor.nom}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  gestor.estat === 'actiu' ? 'bg-green-100 text-green-700' :
                                  gestor.estat === 'ocupat' ? 'bg-yellow-100 text-yellow-700' :
                                  gestor.estat === 'disponible' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {gestor.estat}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {gestor.especialitat.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div className="mt-2 grid grid-cols-6 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Vendes Mes</div>
                                  <div className="font-semibold">€{gestor.rendiment.ventesActuals.toLocaleString()}</div>
                                  <div className={`text-xs ${
                                    gestor.rendiment.ventesActuals >= gestor.objectius.vendesMensual 
                                      ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {((gestor.rendiment.ventesActuals / gestor.objectius.vendesMensual) * 100).toFixed(0)}% objectiu
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Trucades Diàries</div>
                                  <div className="font-semibold">{gestor.rendiment.trucadesRealitzades}</div>
                                  <div className="text-xs text-gray-600">
                                    Obj: {gestor.objectius.trucadesDiaries}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Taxa Obertura</div>
                                  <div className="font-semibold">{gestor.rendiment.taxaObertura}%</div>
                                  <div className="text-xs text-gray-600">
                                    {gestor.rendiment.emailsEnviats} emails
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Temps Resposta</div>
                                  <div className="font-semibold">{gestor.rendiment.tempsResposta}h</div>
                                  <div className={`text-xs ${
                                    gestor.rendiment.tempsResposta <= 2 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {gestor.rendiment.tempsResposta <= 2 ? 'Excel·lent' : 'Millorable'}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Satisfacció Client</div>
                                  <div className="font-semibold flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    {gestor.rendiment.satisfaccioClient}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="text-gray-500">Health Score</div>
                                  <div className="font-semibold">{healthScore.toFixed(0)}%</div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
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
                              
                              {/* Alertes */}
                              {gestor.alertes.length > 0 && (
                                <div className="mt-3">
                                  {gestor.alertes.map((alerta, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                                      <AlertTriangle className="w-4 h-4" />
                                      {alerta}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setGestorSeleccionat(gestor)}
                              className="p-2 hover:bg-blue-100 rounded-lg"
                            >
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-green-100 rounded-lg">
                              <Phone className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-purple-100 rounded-lg">
                              <MessageSquare className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Comunicació IA */}
          {vistaActiva === 'comunicacio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comunicació i Handoff IA ↔ Gestors</h3>
                <button 
                  onClick={() => setShowChatIA(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Conversa
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">24</div>
                  <div className="text-sm text-blue-600">Handoffs avui</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">89%</div>
                  <div className="text-sm text-green-600">Resolució exitosa</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">2.3min</div>
                  <div className="text-sm text-purple-600">Temps mitjà handoff</div>
                </div>
              </div>

              <div className="space-y-4">
                {comunicacionsIA.map(comm => (
                  <div key={comm.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {comm.canal}
                        </span>
                        <span className="text-sm text-gray-600">
                          Gestor: {gestors.find(g => g.id === comm.gestorId)?.nom}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          comm.resolucio === 'pendent' ? 'bg-yellow-100 text-yellow-700' :
                          comm.resolucio === 'resolta_ia' ? 'bg-green-100 text-green-700' :
                          comm.resolucio === 'resolta_gestor' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {comm.resolucio}
                        </span>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <h4 className="font-medium mb-2">Context Handoff IA:</h4>
                      <p className="text-sm text-gray-700 mb-2">{comm.handoffIA.context}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Confiança IA: {comm.handoffIA.confidenciaIA}%
                        </span>
                        <span className="text-gray-600">
                          Motiu: {comm.handoffIA.motiu}
                        </span>
                      </div>
                      <div className="mt-2">
                        <strong className="text-sm">Recomanacions:</strong>
                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                          {comm.handoffIA.recomanacions.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {comm.missatges.slice(-3).map(missatge => (
                        <div key={missatge.id} className={`flex ${
                          missatge.remitent === 'gestor' ? 'justify-end' : 'justify-start'
                        }`}>
                          <div className={`max-w-xs rounded-lg p-3 ${
                            missatge.remitent === 'ia' ? 'bg-blue-100 text-blue-900' :
                            missatge.remitent === 'gestor' ? 'bg-green-100 text-green-900' :
                            'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="text-xs font-medium mb-1">
                              {missatge.remitent === 'ia' ? '🤖 IA' :
                               missatge.remitent === 'gestor' ? '👤 Gestor' : '💬 Client'}
                            </div>
                            <div className="text-sm">{missatge.contingut}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Avançats */}
          {vistaActiva === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Analytics Avançats i Benchmarking</h3>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Eficiència IA vs Humà vs Híbrid</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Només IA</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Només Humà</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Híbrid IA+Humà</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Temps Resolució per Tipus</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Consultes Simples</span>
                      <span className="text-sm font-medium">2.1 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Consultes Complexes</span>
                      <span className="text-sm font-medium">8.7 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Licitacions</span>
                      <span className="text-sm font-medium">25.3 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Escalacions</span>
                      <span className="text-sm font-medium">45.2 min</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3">ROI per Canal</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">WhatsApp Business</span>
                      <span className="text-sm font-medium text-green-600">+187%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Email Marketing</span>
                      <span className="text-sm font-medium text-green-600">+143%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Trucades Directes</span>
                      <span className="text-sm font-medium text-green-600">+256%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Chat Web</span>
                      <span className="text-sm font-medium text-green-600">+98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Chat IA */}
      {showChatIA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Sistema Comunicació Integral IA ↔ Gestors</h3>
              <button onClick={() => setShowChatIA(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center text-gray-500">
                Sistema de comunicació integral implementat amb:
                <ul className="list-disc text-left mt-4 space-y-1">
                  <li>Chat intern entre gestors amb missatgeria directa</li>
                  <li>Integració WhatsApp Business</li>
                  <li>Logs complets d'interaccions IA-Gestors</li>
                  <li>Base de coneixement col·laborativa</li>
                  <li>Handoff intel·ligent amb context complet</li>
                  <li>Templates de respostes optimitzades</li>
                  <li>Anàlisi comparatiu d'efectivitat</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}