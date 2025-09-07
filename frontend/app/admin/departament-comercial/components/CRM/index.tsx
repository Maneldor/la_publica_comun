'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Filter, Plus, Eye, Phone, Mail, MessageSquare, Calendar,
  Building2, Users, Target, Brain, ChevronRight, Clock, FileText,
  AlertCircle, CheckCircle, Star, Edit, Trash2, Send, Archive,
  Paperclip, Activity, History, Settings, X, BarChart3, 
  Download, Upload, Bell, Hash, Tag, User, MapPin, DollarSign,
  TrendingUp, ArrowRight, MoreHorizontal, Copy, ExternalLink
} from 'lucide-react'

interface Lead {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
  tipo: 'empresa_privada' | 'administracion_publica'
  sector: string
  tamanoEmpresa: 'pequena' | 'mediana' | 'grande'
  presupuesto: number
  necesidades: string[]
  estado: 'nuevo' | 'contactado' | 'cualificado' | 'propuesta' | 'negociacion' | 'cerrado_ganado' | 'cerrado_perdido'
  puntuacion: number
  probabilidadCierre: number
  fechaCreacion: Date
  ultimaActividad: Date
  gestorAsignado?: string
  observaciones: string
  fuenteOrigen: 'web' | 'referido' | 'evento' | 'cold_calling' | 'linkedin' | 'email_marketing'
  cargo?: string
  ubicacion?: string
  interacciones?: Interaccion[]
  documentos?: Documento[]
  actividades?: Actividad[]
  emailTracking?: EmailTracking[]
}

interface Comercial {
  id: string
  nombre: string
  tipo: 'gestor_empresa' | 'gestor_ia'
}

interface Interaccion {
  id: string
  tipo: 'llamada' | 'email' | 'reunion' | 'demo' | 'nota'
  fecha: Date
  duracion?: number
  descripcion: string
  resultado: 'positivo' | 'neutro' | 'negativo'
  proximoPaso: string
  autor: string
}

interface Documento {
  id: string
  nombre: string
  tipo: 'contrato' | 'propuesta' | 'presentacion' | 'otro'
  url: string
  fechaSubida: Date
  tamano: string
}

interface Actividad {
  id: string
  tipo: 'llamada' | 'email' | 'reunion' | 'demo' | 'seguimiento'
  titulo: string
  descripcion: string
  fecha: Date
  completada: boolean
  recordatorio?: Date
  leadId: string
}

interface EmailTracking {
  id: string
  asunto: string
  fechaEnvio: Date
  abierto: boolean
  fechaApertura?: Date
  clicEnlaces: number
  respondido: boolean
  template: string
}

interface EmailTemplate {
  id: string
  nombre: string
  asunto: string
  contenido: string
  fase: string
  tipoCliente: 'ambos' | 'empresa_privada' | 'administracion_publica'
  variables: string[]
}

interface CRMProps {
  leads: Lead[]
  comerciales: Comercial[]
  selectedLead: Lead | null
  setSelectedLead: (lead: Lead | null) => void
  leadFilter: string
  setLeadFilter: (filter: string) => void
  tipoClienteFilter: string
  setTipoClienteFilter: (filter: string) => void
  comercialFilter: string
  setComercialFilter: (filter: string) => void
  searchFilter: string
  setSearchFilter: (search: string) => void
  setShowNewLeadModal: (show: boolean) => void
}

export default function CRM({
  leads: initialLeads,
  comerciales,
  selectedLead,
  setSelectedLead,
  leadFilter,
  setLeadFilter,
  tipoClienteFilter,
  setTipoClienteFilter,
  comercialFilter,
  setComercialFilter,
  searchFilter,
  setSearchFilter,
  setShowNewLeadModal
}: CRMProps) {
  
  const [leads, setLeads] = useState<Lead[]>([])
  const [view, setView] = useState<'kanban' | 'table' | 'dashboard'>('kanban')
  const [showLeadDetail, setShowLeadDetail] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showPipelineConfig, setShowPipelineConfig] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Actividad | null>(null)
  const [draggingLead, setDraggingLead] = useState<string | null>(null)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [activeTab, setActiveTab] = useState<'timeline' | 'emails' | 'documents' | 'activities'>('timeline')
  const [documents, setDocuments] = useState<Documento[]>([])
  const [uploadingDocument, setUploadingDocument] = useState(false)
  
  // Configuració inicial del pipeline - es pot modificar
  const initialPipelineStates = [
    { id: 'nuevo', label: 'Nou', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' },
    { id: 'contactado', label: 'Contactat', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    { id: 'cualificado', label: 'Qualificat', color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    { id: 'propuesta', label: 'Proposta', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    { id: 'negociacion', label: 'Negociació', color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' },
    { id: 'cerrado_ganado', label: 'Tancat Guanyat', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    { id: 'cerrado_perdido', label: 'Tancat Perdut', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' }
  ]
  
  const [customPipeline, setCustomPipeline] = useState(initialPipelineStates)
  
  // Inicializar leads con datos mock expandidos
  useEffect(() => {
    const expandedLeads = initialLeads.map(lead => ({
      ...lead,
      cargo: lead.id === '1' ? 'Directora de Transformació Digital' : 'Director de Tecnologia',
      ubicacion: lead.tipo === 'administracion_publica' ? 'Barcelona' : 'Madrid',
      interacciones: [
        {
          id: `int-${lead.id}-1`,
          tipo: 'email' as const,
          fecha: new Date(Date.now() - 86400000 * 2),
          descripcion: 'Enviat email de presentació amb cas d\'èxit similar',
          resultado: 'positivo' as const,
          proximoPaso: 'Trucar per concertar reunió',
          autor: lead.gestorAsignado || 'Sistema'
        },
        {
          id: `int-${lead.id}-2`,
          tipo: 'llamada' as const,
          fecha: new Date(Date.now() - 86400000),
          duracion: 25,
          descripcion: 'Reunió telefònica per entendre necessitats específiques',
          resultado: 'positivo' as const,
          proximoPaso: 'Enviar proposta tècnica detallada',
          autor: lead.gestorAsignado || 'Sistema'
        }
      ],
      documentos: [
        {
          id: `doc-${lead.id}-1`,
          nombre: 'Proposta_Tecnica_v1.pdf',
          tipo: 'propuesta' as const,
          url: '/documents/proposta-1.pdf',
          fechaSubida: new Date(Date.now() - 86400000 * 3),
          tamano: '2.1 MB'
        }
      ],
      actividades: [
        {
          id: `act-${lead.id}-1`,
          tipo: 'reunion' as const,
          titulo: 'Reunió tècnica amb equip IT',
          descripcion: 'Presentar arquitectura de la solució IA',
          fecha: new Date(Date.now() + 86400000 * 2),
          completada: false,
          recordatorio: new Date(Date.now() + 86400000 * 2 - 3600000),
          leadId: lead.id
        }
      ],
      emailTracking: [
        {
          id: `email-${lead.id}-1`,
          asunto: 'Solució IA personalitzada per al vostre sector',
          fechaEnvio: new Date(Date.now() - 86400000 * 2),
          abierto: true,
          fechaApertura: new Date(Date.now() - 86400000 * 2 + 3600000),
          clicEnlaces: 3,
          respondido: true,
          template: 'seguiment-inicial'
        }
      ]
    }))
    setLeads(expandedLeads)
  }, [initialLeads])

  // Templates d'email mock
  useEffect(() => {
    setEmailTemplates([
      {
        id: '1',
        nombre: 'Primera Contacte',
        asunto: 'Solucions IA innovadores per {empresa}',
        contenido: 'Hola {nom},\n\nHe vist que {empresa} està interessada en solucions d\'IA. Tenim experiència específica en el sector {sector}...',
        fase: 'nuevo',
        tipoCliente: 'ambos',
        variables: ['nom', 'empresa', 'sector']
      },
      {
        id: '2',
        nombre: 'Seguiment Post-Demo',
        asunto: 'Gràcies per la demo - Següents passos',
        contenido: 'Hola {nom},\n\nGràcies per dedicar temps a la demo d\'avui. Com hem comentat, la solució pot generar un ROI del {roi}%...',
        fase: 'demo',
        tipoCliente: 'ambos',
        variables: ['nom', 'roi', 'ahorros']
      },
      {
        id: '3',
        nombre: 'Proposta Administració',
        asunto: 'Proposta tècnica - Compliment normativa',
        contenido: 'Estimat/da {nom},\n\nAdjunto trobareu la proposta tècnica que compleix amb tots els requisits de la normativa ENS...',
        fase: 'propuesta',
        tipoCliente: 'administracion_publica',
        variables: ['nom', 'organismo', 'normativa']
      }
    ])
  }, [])

  const estadosPipeline = customPipeline

  // Funcions per gestionar la configuració del pipeline
  const addPipelineStage = (stage: typeof initialPipelineStates[0]) => {
    setCustomPipeline([...customPipeline, stage])
  }

  const updatePipelineStage = (stageId: string, updates: Partial<typeof initialPipelineStates[0]>) => {
    setCustomPipeline(customPipeline.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ))
  }

  const deletePipelineStage = (stageId: string) => {
    // No permetre eliminar les fases crítiques
    const criticalStages = ['cerrado_ganado', 'cerrado_perdido']
    if (!criticalStages.includes(stageId)) {
      setCustomPipeline(customPipeline.filter(stage => stage.id !== stageId))
    }
  }

  const resetPipelineToDefault = () => {
    setCustomPipeline(initialPipelineStates)
  }

  const getFuenteColor = (fuente: string) => {
    const colors: { [key: string]: string } = {
      web: 'bg-blue-100 text-blue-800',
      referido: 'bg-green-100 text-green-800',
      evento: 'bg-purple-100 text-purple-800',
      cold_calling: 'bg-orange-100 text-orange-800',
      linkedin: 'bg-indigo-100 text-indigo-800',
      email_marketing: 'bg-pink-100 text-pink-800'
    }
    return colors[fuente] || 'bg-gray-100 text-gray-800'
  }

  const getUrgencyColor = (lead: Lead) => {
    if (lead.puntuacion >= 90) return 'border-l-red-500'
    if (lead.puntuacion >= 80) return 'border-l-orange-500'
    if (lead.puntuacion >= 70) return 'border-l-yellow-500'
    return 'border-l-gray-300'
  }

  const handleDragStart = (leadId: string) => {
    setDraggingLead(leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newState: string) => {
    e.preventDefault()
    if (draggingLead) {
      const updatedLeads = leads.map(lead => 
        lead.id === draggingLead 
          ? { ...lead, estado: newState as Lead['estado'], ultimaActividad: new Date() }
          : lead
      )
      setLeads(updatedLeads)
      setDraggingLead(null)
      
      // Auto-actualització de probabilitat segons nova fase
      const probabilityByStage: { [key: string]: number } = {
        'nuevo': 10,
        'contactado': 25,
        'cualificado': 50,
        'propuesta': 70,
        'negociacion': 85,
        'cerrado_ganado': 100,
        'cerrado_perdido': 0
      }
      
      const updatedLeadsWithProbability = updatedLeads.map(lead => 
        lead.id === draggingLead 
          ? { ...lead, probabilidadCierre: probabilityByStage[newState] || lead.probabilidadCierre }
          : lead
      )
      setLeads(updatedLeadsWithProbability)
    }
  }

  const assignLeadToManager = (leadId: string, managerId: string) => {
    const managerName = comerciales.find(c => c.id === managerId)?.nombre || 'Sistema'
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            gestorAsignado: managerName,
            ultimaActividad: new Date(),
            interacciones: [
              ...(lead.interacciones || []),
              {
                id: `int-${leadId}-${Date.now()}`,
                tipo: 'nota' as const,
                fecha: new Date(),
                descripcion: `Lead assignat a ${managerName}`,
                resultado: 'neutro' as const,
                proximoPaso: 'Contactar en 24h',
                autor: 'Sistema'
              }
            ]
          }
        : lead
    )
    setLeads(updatedLeads)
  }

  const addActivity = (activity: Omit<Actividad, 'id'>) => {
    const newActivity = {
      ...activity,
      id: `act-${Date.now()}`
    }
    
    const updatedLeads = leads.map(lead => 
      lead.id === activity.leadId
        ? {
            ...lead,
            actividades: [...(lead.actividades || []), newActivity],
            ultimaActividad: new Date()
          }
        : lead
    )
    setLeads(updatedLeads)
  }

  const uploadDocument = (leadId: string, file: File, tipo: Documento['tipo']) => {
    setUploadingDocument(true)
    
    // Simular upload
    setTimeout(() => {
      const newDocument: Documento = {
        id: `doc-${leadId}-${Date.now()}`,
        nombre: file.name,
        tipo,
        url: URL.createObjectURL(file),
        fechaSubida: new Date(),
        tamano: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }

      const updatedLeads = leads.map(lead => 
        lead.id === leadId
          ? {
              ...lead,
              documentos: [...(lead.documentos || []), newDocument],
              ultimaActividad: new Date(),
              interacciones: [
                ...(lead.interacciones || []),
                {
                  id: `int-${leadId}-${Date.now()}`,
                  tipo: 'nota' as const,
                  fecha: new Date(),
                  descripcion: `Document pujat: ${file.name}`,
                  resultado: 'neutro' as const,
                  proximoPaso: 'Revisar document amb client',
                  autor: lead.gestorAsignado || 'Sistema'
                }
              ]
            }
          : lead
      )
      
      setLeads(updatedLeads)
      setUploadingDocument(false)
      setShowDocumentModal(false)
    }, 2000)
  }

  const assignLeadAutomatically = (leadId: string) => {
    // Calcular càrrega de treball per gestor
    const workloadByManager = comerciales.map(comercial => {
      const assignedLeads = leads.filter(l => l.gestorAsignado === comercial.nombre)
      const activeLeads = assignedLeads.filter(l => !['cerrado_ganado', 'cerrado_perdido'].includes(l.estado))
      const avgScore = activeLeads.length > 0 
        ? activeLeads.reduce((sum, l) => sum + l.puntuacion, 0) / activeLeads.length
        : 0

      return {
        comercial,
        activeLeads: activeLeads.length,
        avgScore,
        workloadScore: activeLeads.length + (avgScore / 20) // Ponderar per complexitat
      }
    })

    // Assignar al gestor amb menys càrrega i tipus adequat
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    const suitableManagers = workloadByManager.filter(wm => 
      (lead.tipo === 'administracion_publica' && wm.comercial.tipo === 'gestor_ia') ||
      (lead.tipo === 'empresa_privada' && wm.comercial.tipo === 'gestor_empresa')
    )

    const bestManager = suitableManagers.sort((a, b) => a.workloadScore - b.workloadScore)[0]

    if (bestManager) {
      assignLeadToManager(leadId, bestManager.comercial.id)
    }
  }

  const markActivityAsCompleted = (leadId: string, activityId: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId
        ? {
            ...lead,
            actividades: lead.actividades?.map(act => 
              act.id === activityId ? { ...act, completada: true } : act
            ),
            ultimaActividad: new Date(),
            interacciones: [
              ...(lead.interacciones || []),
              {
                id: `int-${leadId}-${Date.now()}`,
                tipo: 'nota' as const,
                fecha: new Date(),
                descripcion: `Activitat completada: ${lead.actividades?.find(a => a.id === activityId)?.titulo}`,
                resultado: 'positivo' as const,
                proximoPaso: 'Planificar seguiment',
                autor: lead.gestorAsignado || 'Sistema'
              }
            ]
          }
        : lead
    )
    setLeads(updatedLeads)
  }

  const sendEmail = (leadId: string, template: EmailTemplate, variables: { [key: string]: string }) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    let content = template.contenido
    let subject = template.asunto
    
    // Substituir variables
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value)
      subject = subject.replace(new RegExp(`{${key}}`, 'g'), value)
    })

    const newEmailTracking: EmailTracking = {
      id: `email-${leadId}-${Date.now()}`,
      asunto: subject,
      fechaEnvio: new Date(),
      abierto: false,
      clicEnlaces: 0,
      respondido: false,
      template: template.id
    }

    const newInteraction: Interaccion = {
      id: `int-${leadId}-${Date.now()}`,
      tipo: 'email',
      fecha: new Date(),
      descripcion: `Enviat email: ${subject}`,
      resultado: 'neutro',
      proximoPaso: 'Esperar resposta (24-48h)',
      autor: lead.gestorAsignado || 'Sistema'
    }

    const updatedLeads = leads.map(l => 
      l.id === leadId
        ? {
            ...l,
            emailTracking: [...(l.emailTracking || []), newEmailTracking],
            interacciones: [...(l.interacciones || []), newInteraction],
            ultimaActividad: new Date()
          }
        : l
    )
    
    setLeads(updatedLeads)
    
    // Simular tracking d'apertura després de temps aleatori
    setTimeout(() => {
      const shouldOpen = Math.random() > 0.3 // 70% probabilitat d'obertura
      if (shouldOpen) {
        const finalUpdatedLeads = updatedLeads.map(l => 
          l.id === leadId
            ? {
                ...l,
                emailTracking: l.emailTracking?.map(et => 
                  et.id === newEmailTracking.id
                    ? { ...et, abierto: true, fechaApertura: new Date() }
                    : et
                ) || []
              }
            : l
        )
        setLeads(finalUpdatedLeads)
      }
    }, Math.random() * 30000 + 5000) // Entre 5-35 segons
  }

  const calculateLeadScore = (lead: Lead): number => {
    let score = 0
    
    // Scoring per tipus de client
    score += lead.tipo === 'administracion_publica' ? 15 : 10
    
    // Scoring per tamany empresa
    const sizeScores = { grande: 20, mediana: 15, pequena: 10 }
    score += sizeScores[lead.tamanoEmpresa]
    
    // Scoring per pressupost
    if (lead.presupuesto > 100000) score += 25
    else if (lead.presupuesto > 50000) score += 20
    else if (lead.presupuesto > 25000) score += 15
    else score += 10
    
    // Scoring per font d'origen
    const sourceScores = {
      referido: 20,
      evento: 15,
      web: 10,
      linkedin: 12,
      email_marketing: 8,
      cold_calling: 5
    }
    score += sourceScores[lead.fuenteOrigen]
    
    // Scoring per activitat recent
    if (lead.ultimaActividad) {
      const daysSinceLastActivity = (Date.now() - lead.ultimaActividad.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastActivity <= 1) score += 10
      else if (daysSinceLastActivity <= 3) score += 8
      else if (daysSinceLastActivity <= 7) score += 5
    }
    
    // Scoring per interaccions
    const interactionCount = lead.interacciones?.length || 0
    score += Math.min(interactionCount * 3, 15)
    
    return Math.min(score, 100)
  }

  // Actualitzar scores automàticament
  useEffect(() => {
    const updatedLeads = leads.map(lead => ({
      ...lead,
      puntuacion: calculateLeadScore(lead)
    }))
    if (JSON.stringify(updatedLeads) !== JSON.stringify(leads)) {
      setLeads(updatedLeads)
    }
  }, [leads])

  const filteredLeads = leads.filter(lead => {
    if (leadFilter !== 'all' && lead.estado !== leadFilter) return false
    if (tipoClienteFilter !== 'all' && lead.tipo !== tipoClienteFilter) return false
    if (comercialFilter !== 'all' && lead.gestorAsignado !== comercialFilter) return false
    if (searchFilter && !lead.nombre.toLowerCase().includes(searchFilter.toLowerCase()) && 
        !lead.empresa.toLowerCase().includes(searchFilter.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header amb mètriques del pipeline */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline Administració Pública */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Administració Pública</h3>
              <p className="text-blue-100">Pipeline especialitzat sector públic</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredLeads.filter(l => l.tipo === 'administracion_publica').length}
              </div>
              <div className="text-sm text-blue-100">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                €{filteredLeads
                  .filter(l => l.tipo === 'administracion_publica' && l.estado !== 'cerrado_perdido')
                  .reduce((sum, l) => sum + l.presupuesto, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-blue-100">Pipeline Valor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredLeads
                    .filter(l => l.tipo === 'administracion_publica')
                    .reduce((sum, l) => sum + l.probabilidadCierre, 0) /
                  filteredLeads.filter(l => l.tipo === 'administracion_publica').length || 0
                )}%
              </div>
              <div className="text-sm text-blue-100">Prob. Mitjana</div>
            </div>
          </div>
        </div>

        {/* Pipeline Empresa Privada */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Empresa Privada</h3>
              <p className="text-green-100">Pipeline comercial empreses</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filteredLeads.filter(l => l.tipo === 'empresa_privada').length}
              </div>
              <div className="text-sm text-green-100">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                €{filteredLeads
                  .filter(l => l.tipo === 'empresa_privada' && l.estado !== 'cerrado_perdido')
                  .reduce((sum, l) => sum + l.presupuesto, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-green-100">Pipeline Valor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(
                  filteredLeads
                    .filter(l => l.tipo === 'empresa_privada')
                    .reduce((sum, l) => sum + l.probabilidadCierre, 0) /
                  filteredLeads.filter(l => l.tipo === 'empresa_privada').length || 0
                )}%
              </div>
              <div className="text-sm text-green-100">Prob. Mitjana</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls de navegació i filtres */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('kanban')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'kanban' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Pipeline Kanban
            </button>
            <button 
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'table' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Vista Taula
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                view === 'dashboard' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button 
              onClick={() => setShowPipelineConfig(true)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurar Pipeline
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {filteredLeads.length} leads | Pipeline: €{filteredLeads.reduce((sum, l) => sum + l.presupuesto, 0).toLocaleString()}
            </span>
            <button 
              onClick={() => setShowNewLeadModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nou Lead
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input 
              type="search"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar leads, empreses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            />
          </div>
          <select 
            value={leadFilter}
            onChange={(e) => setLeadFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tots els estats</option>
            {estadosPipeline.map(estado => (
              <option key={estado.id} value={estado.id}>{estado.label}</option>
            ))}
          </select>
          <select 
            value={tipoClienteFilter}
            onChange={(e) => setTipoClienteFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tots els tipus</option>
            <option value="administracion_publica">Administració Pública</option>
            <option value="empresa_privada">Empresa Privada</option>
          </select>
          <select 
            value={comercialFilter}
            onChange={(e) => setComercialFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Tots els gestors</option>
            {comerciales.map(comercial => (
              <option key={comercial.id} value={comercial.nombre}>{comercial.nombre}</option>
            ))}
            <option value="Sense assignar">Sense assignar</option>
          </select>
          <button
            onClick={() => {
              const unassignedLeads = filteredLeads.filter(l => !l.gestorAsignado)
              unassignedLeads.forEach(lead => assignLeadAutomatically(lead.id))
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
            disabled={filteredLeads.filter(l => !l.gestorAsignado).length === 0}
          >
            <Brain className="w-4 h-4" />
            Assignació Automàtica ({filteredLeads.filter(l => !l.gestorAsignado).length})
          </button>
        </div>
      </div>

      {/* Vista Kanban */}
      {view === 'kanban' && (
        <div className="grid grid-cols-7 gap-4 min-h-[600px]">
          {estadosPipeline.map(estado => {
            const leadsEstado = filteredLeads.filter(lead => lead.estado === estado.id)
            const valorTotal = leadsEstado.reduce((sum, lead) => sum + lead.presupuesto, 0)
            
            return (
              <div 
                key={estado.id} 
                className={`${estado.bgColor} rounded-lg p-4 min-h-[500px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, estado.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">{estado.label}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{leadsEstado.length}</span>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-4 font-medium">
                  €{valorTotal.toLocaleString()}
                </div>
                <div className="space-y-3">
                  {leadsEstado.map(lead => (
                    <div 
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onClick={() => {
                        setSelectedLead(lead)
                        setShowLeadDetail(true)
                      }}
                      className={`bg-white rounded-lg p-4 border-l-4 cursor-pointer hover:shadow-md transition-all ${getUrgencyColor(lead)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-sm">{lead.nombre}</h5>
                            {lead.puntuacion >= 90 && <Star className="w-3 h-3 text-red-500 fill-current" />}
                            {lead.puntuacion >= 80 && lead.puntuacion < 90 && <Star className="w-3 h-3 text-orange-500 fill-current" />}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{lead.empresa}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <span className={`w-2 h-2 rounded-full ${
                              lead.tipo === 'administracion_publica' ? 'bg-blue-500' : 'bg-green-500'
                            }`} />
                            <span className="text-xs text-gray-500">{lead.cargo || 'Director'}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Score IA:</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            lead.puntuacion >= 90 ? 'bg-red-100 text-red-800' :
                            lead.puntuacion >= 80 ? 'bg-orange-100 text-orange-800' :
                            lead.puntuacion >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>{lead.puntuacion}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Prob:</span>
                          <span className="text-xs font-medium">{lead.probabilidadCierre}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Valor:</span>
                          <span className="text-xs font-medium">€{lead.presupuesto.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFuenteColor(lead.fuenteOrigen)}`}>
                            {lead.fuenteOrigen.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-20">
                            {lead.gestorAsignado || 'Sense assignar'}
                          </span>
                        </div>
                        
                        {lead.actividades?.filter(a => !a.completada && a.fecha > new Date()).length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Bell className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600">
                              {lead.actividades?.filter(a => !a.completada && a.fecha > new Date()).length} pendent
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {(lead.emailTracking?.length || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-blue-500" />
                                <span className="text-xs text-blue-600">{lead.emailTracking?.length}</span>
                              </div>
                            )}
                            {(lead.interacciones?.length || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">{lead.interacciones?.length}</span>
                              </div>
                            )}
                            {(lead.documentos?.length || 0) > 0 && (
                              <div className="flex items-center gap-1">
                                <Paperclip className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-purple-600">{lead.documentos?.length}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {lead.ultimaActividad ? Math.floor((Date.now() - lead.ultimaActividad.getTime()) / (1000 * 60 * 60 * 24)) : 0}d
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Vista Taula */}
      {view === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipus
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estat
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activitat
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{lead.nombre}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.empresa}</div>
                      <div className="text-sm text-gray-500">{lead.sector}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.tipo === 'administracion_publica' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {lead.tipo === 'administracion_publica' ? 'Administració' : 'Empresa'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        estadosPipeline.find(e => e.id === lead.estado)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {estadosPipeline.find(e => e.id === lead.estado)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          lead.puntuacion >= 90 ? 'bg-red-100 text-red-800' :
                          lead.puntuacion >= 80 ? 'bg-orange-100 text-orange-800' :
                          lead.puntuacion >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.puntuacion}
                        </span>
                        {lead.puntuacion >= 80 && <Star className="w-4 h-4 text-yellow-500 ml-1" />}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">€{lead.presupuesto.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{lead.probabilidadCierre}% prob.</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.gestorAsignado || 'Sense assignar'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {lead.ultimaActividad ? Math.floor((Date.now() - lead.ultimaActividad.getTime()) / (1000 * 60 * 60 * 24)) : 0} dies
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowLeadDetail(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowEmailModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowActivityModal(true)
                          }}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mètriques principals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Leads</p>
                    <p className="text-2xl font-semibold text-gray-900">{filteredLeads.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Pipeline Valor</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      €{filteredLeads.reduce((sum, l) => sum + l.presupuesto, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Prob. Mitjana</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(filteredLeads.reduce((sum, l) => sum + l.probabilidadCierre, 0) / filteredLeads.length || 0)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Hot Leads</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {filteredLeads.filter(l => l.puntuacion >= 80).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gràfic de conversió per fase */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Distribució per Fase</h3>
              <div className="space-y-3">
                {estadosPipeline.map(estado => {
                  const count = filteredLeads.filter(l => l.estado === estado.id).length
                  const percentage = filteredLeads.length > 0 ? (count / filteredLeads.length) * 100 : 0
                  return (
                    <div key={estado.id} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">{estado.label}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-gray-900">{count}</div>
                      <div className="w-12 text-sm text-gray-500">{percentage.toFixed(0)}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Activitats recents i recordatoris */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Recordatoris Urgents</h3>
              <div className="space-y-3">
                {filteredLeads
                  .filter(l => l.actividades?.some(a => !a.completada && a.recordatorio && a.recordatorio <= new Date()))
                  .slice(0, 5)
                  .map(lead => (
                    <div key={lead.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <Bell className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{lead.nombre}</div>
                        <div className="text-xs text-gray-600">{lead.actividades?.find(a => !a.completada)?.titulo}</div>
                      </div>
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Veure
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Dashboard Productivitat Individual</h3>
              <div className="space-y-4">
                {comerciales.map(comercial => {
                  const comercialLeads = filteredLeads.filter(l => l.gestorAsignado === comercial.nombre)
                  const activeLeads = comercialLeads.filter(l => !['cerrado_ganado', 'cerrado_perdido'].includes(l.estado))
                  const wonLeads = comercialLeads.filter(l => l.estado === 'cerrado_ganado')
                  const lostLeads = comercialLeads.filter(l => l.estado === 'cerrado_perdido')
                  
                  const avgScore = comercialLeads.length > 0 
                    ? comercialLeads.reduce((sum, l) => sum + l.puntuacion, 0) / comercialLeads.length 
                    : 0
                  
                  const conversionRate = (comercialLeads.length > 0) 
                    ? (wonLeads.length / comercialLeads.length * 100) 
                    : 0
                  
                  const avgClosingTime = wonLeads.length > 0 
                    ? wonLeads.reduce((sum, l) => {
                        if (l.ultimaActividad && l.fechaCreacion) {
                          return sum + (l.ultimaActividad.getTime() - l.fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
                        }
                        return sum + 30 // Default 30 days if no dates available
                      }, 0) / wonLeads.length
                    : 0
                  
                  const totalValue = comercialLeads.reduce((sum, l) => sum + l.presupuesto, 0)
                  const wonValue = wonLeads.reduce((sum, l) => sum + l.presupuesto, 0)
                  
                  const todayActivities = comercialLeads.reduce((sum, l) => {
                    const todayActivitiesCount = l.actividades?.filter(a => 
                      !a.completada && 
                      a.fecha.toDateString() === new Date().toDateString()
                    ).length || 0
                    return sum + todayActivitiesCount
                  }, 0)

                  return (
                    <div key={comercial.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{comercial.nombre}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {comercial.tipo === 'gestor_ia' ? 'Gestor IA Especialitzat' : 'Gestor Comercial Empresa'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">€{wonValue.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Facturat</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">{comercialLeads.length}</div>
                          <div className="text-xs text-gray-600">Total Leads</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">{activeLeads.length}</div>
                          <div className="text-xs text-gray-600">Actius</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{conversionRate.toFixed(1)}%</div>
                          <div className="text-xs text-gray-600">Conversió</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{avgScore.toFixed(0)}</div>
                          <div className="text-xs text-gray-600">Score Mig</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-gray-600">
                              Avui: {todayActivities} activitats
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-gray-600">
                              {avgClosingTime > 0 ? `${Math.round(avgClosingTime)}d mig` : 'No data'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-600">
                              €{totalValue.toLocaleString()} pipeline
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Barra de conversió visual */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Taxa Conversió</span>
                          <span>{conversionRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(conversionRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Resum general */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Resum General de l'Equip</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600 text-lg">{filteredLeads.length}</div>
                      <div className="text-gray-600">Total Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600 text-lg">
                        {((filteredLeads.filter(l => l.estado === 'cerrado_ganado').length / filteredLeads.length) * 100 || 0).toFixed(1)}%
                      </div>
                      <div className="text-gray-600">Taxa Conversió Equip</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600 text-lg">
                        €{filteredLeads.reduce((sum, l) => sum + (l.estado === 'cerrado_ganado' ? l.presupuesto : 0), 0).toLocaleString()}
                      </div>
                      <div className="text-gray-600">Total Facturat</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600 text-lg">
                        {filteredLeads.filter(l => !l.gestorAsignado).length}
                      </div>
                      <div className="text-gray-600">Leads Sense Assignar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalls del lead */}
      {showLeadDetail && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden">
            <div className="flex h-full">
              {/* Sidebar amb informació bàsica */}
              <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Detalls del Lead</h2>
                  <button 
                    onClick={() => setShowLeadDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Informació bàsica */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedLead.nombre}</h3>
                      <p className="text-sm text-gray-600">{selectedLead.cargo || 'Director'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Informació de Contacte</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedLead.telefono}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedLead.empresa}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedLead.ubicacion || 'Barcelona'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Scoring IA</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Score General:</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          selectedLead.puntuacion >= 90 ? 'bg-red-100 text-red-800' :
                          selectedLead.puntuacion >= 80 ? 'bg-orange-100 text-orange-800' :
                          selectedLead.puntuacion >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>{selectedLead.puntuacion}/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Prob. Tancament:</span>
                        <span className="font-medium">{selectedLead.probabilidadCierre}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor Potencial:</span>
                        <span className="font-medium">€{selectedLead.presupuesto.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gestor Assignat:</span>
                        <span className="font-medium">{selectedLead.gestorAsignado || 'Sense assignar'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Necessitats</h4>
                    <div className="space-y-1">
                      {selectedLead.necesidades.map((necesidad, index) => (
                        <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          • {necesidad}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accions ràpides */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Accions Ràpides</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => {
                          setShowLeadDetail(false)
                          setShowEmailModal(true)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Enviar Email
                      </button>
                      <button 
                        onClick={() => {
                          setShowLeadDetail(false)
                          setShowActivityModal(true)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        Programar Activitat
                      </button>
                      <button 
                        onClick={() => setShowAssignModal(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <User className="w-4 h-4" />
                        Assignar Gestor
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contingut principal amb pestanyes */}
              <div className="flex-1 flex flex-col">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setActiveTab('timeline')}
                      className={`pb-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'timeline' 
                          ? 'border-green-500 text-green-600' 
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Timeline
                    </button>
                    <button 
                      onClick={() => setActiveTab('emails')}
                      className={`pb-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'emails' 
                          ? 'border-green-500 text-green-600' 
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Emails
                    </button>
                    <button 
                      onClick={() => setActiveTab('documents')}
                      className={`pb-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'documents' 
                          ? 'border-green-500 text-green-600' 
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Documents
                    </button>
                    <button 
                      onClick={() => setActiveTab('activities')}
                      className={`pb-2 border-b-2 font-medium transition-colors ${
                        activeTab === 'activities' 
                          ? 'border-green-500 text-green-600' 
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Activitats
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Timeline Tab */}
                  {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Timeline d'Activitats</h3>
                      <button 
                        onClick={() => setShowActivityModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Nova Activitat
                      </button>
                    </div>

                    <div className="relative">
                      {/* Línea temporal */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      <div className="space-y-6">
                        {/* Activitats futures */}
                        {selectedLead.actividades?.filter(a => !a.completada && a.fecha > new Date()).map(activitat => (
                          <div key={activitat.id} className="relative flex items-start gap-4">
                            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md"></div>
                            <div className="flex-1 bg-orange-50 border border-orange-200 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-orange-600" />
                                  <span className="font-medium">{activitat.titulo}</span>
                                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Pendent</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {activitat.fecha.toLocaleDateString()} {activitat.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">{activitat.descripcion}</p>
                              {activitat.recordatorio && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Bell className="w-3 h-3 text-orange-500" />
                                  <span className="text-xs text-orange-600">
                                    Recordatori: {activitat.recordatorio.toLocaleDateString()} {activitat.recordatorio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-3">
                                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                  Marcar Completada
                                </button>
                                <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">
                                  Editar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Interaccions passades */}
                        {selectedLead.interacciones?.map(interaccio => (
                          <div key={interaccio.id} className="relative flex items-start gap-4">
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                              interaccio.resultado === 'positivo' ? 'bg-green-500' :
                              interaccio.resultado === 'negativo' ? 'bg-red-500' :
                              'bg-gray-400'
                            }`}></div>
                            <div className="flex-1 bg-white border border-gray-200 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {interaccio.tipo === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                                  {interaccio.tipo === 'llamada' && <Phone className="w-4 h-4 text-green-600" />}
                                  {interaccio.tipo === 'reunion' && <Users className="w-4 h-4 text-purple-600" />}
                                  {interaccio.tipo === 'demo' && <Eye className="w-4 h-4 text-orange-600" />}
                                  {interaccio.tipo === 'nota' && <MessageSquare className="w-4 h-4 text-gray-600" />}
                                  <span className="font-medium capitalize">{interaccio.tipo}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    interaccio.resultado === 'positivo' ? 'bg-green-100 text-green-800' :
                                    interaccio.resultado === 'negativo' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {interaccio.resultado}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {interaccio.fecha.toLocaleDateString()} 
                                  {interaccio.duracion && ` • ${interaccio.duracion}min`}
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{interaccio.descripcion}</p>
                              {interaccio.proximoPaso && (
                                <div className="bg-blue-50 border border-blue-200 p-2 rounded text-sm">
                                  <strong>Proper pas:</strong> {interaccio.proximoPaso}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-2">
                                per {interaccio.autor}
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Email tracking */}
                        {selectedLead.emailTracking?.map(email => (
                          <div key={email.id} className="relative flex items-start gap-4">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                            <div className="flex-1 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Send className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">Email enviat</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {email.fechaEnvio.toLocaleDateString()} {email.fechaEnvio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </div>
                              <p className="text-sm font-medium mb-2">{email.asunto}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${email.abierto ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                  <span>{email.abierto ? 'Obert' : 'No obert'}</span>
                                  {email.fechaApertura && (
                                    <span className="text-gray-500">({email.fechaApertura.toLocaleDateString()})</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{email.clicEnlaces} clics</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${email.respondido ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                                  <span>{email.respondido ? 'Respós' : 'Sense resposta'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Emails Tab */}
                  {activeTab === 'emails' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Historial d'Emails</h3>
                        <button 
                          onClick={() => {
                            setShowLeadDetail(false)
                            setShowEmailModal(true)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Nou Email
                        </button>
                      </div>

                      <div className="space-y-4">
                        {selectedLead.emailTracking?.map(email => (
                          <div key={email.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold">{email.asunto}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  email.abierto ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {email.abierto ? 'Obert' : 'No obert'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {email.fechaEnvio.toLocaleDateString()} {email.fechaEnvio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${email.abierto ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span>Apertura: {email.abierto ? 'Sí' : 'No'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                                <span>Clics: {email.clicEnlaces}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${email.respondido ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                                <span>Resposta: {email.respondido ? 'Sí' : 'No'}</span>
                              </div>
                            </div>

                            {email.fechaApertura && (
                              <div className="mt-2 text-xs text-gray-600">
                                Primera apertura: {email.fechaApertura.toLocaleDateString()} {email.fechaApertura.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            )}
                          </div>
                        ))}

                        {(!selectedLead.emailTracking || selectedLead.emailTracking.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No hi ha emails enviats encara</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === 'documents' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Documents Adjunts</h3>
                        <button 
                          onClick={() => setShowDocumentModal(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Pujar Document
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {selectedLead.documentos?.map(doc => (
                          <div key={doc.id} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  doc.tipo === 'contrato' ? 'bg-green-100 text-green-600' :
                                  doc.tipo === 'propuesta' ? 'bg-blue-100 text-blue-600' :
                                  doc.tipo === 'presentacion' ? 'bg-purple-100 text-purple-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{doc.nombre}</h4>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="capitalize">{doc.tipo.replace('_', ' ')}</span>
                                    <span>•</span>
                                    <span>{doc.tamano}</span>
                                    <span>•</span>
                                    <span>{doc.fechaSubida.toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {(!selectedLead.documentos || selectedLead.documentos.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <Paperclip className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No hi ha documents adjunts encara</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Activities Tab */}
                  {activeTab === 'activities' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Activitats Programades</h3>
                        <button 
                          onClick={() => setShowActivityModal(true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Nova Activitat
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Activitats pendents */}
                        <div>
                          <h4 className="font-semibold text-orange-600 mb-3">Pendents</h4>
                          <div className="space-y-3">
                            {selectedLead.actividades?.filter(a => !a.completada && a.fecha > new Date()).map(activitat => (
                              <div key={activitat.id} className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    <span className="font-medium">{activitat.titulo}</span>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full capitalize">
                                      {activitat.tipo}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activitat.fecha.toLocaleDateString()} {activitat.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{activitat.descripcion}</p>
                                {activitat.recordatorio && (
                                  <div className="flex items-center gap-1 mb-3 text-xs text-orange-600">
                                    <Bell className="w-3 h-3" />
                                    <span>Recordatori: {activitat.recordatorio.toLocaleDateString()} {activitat.recordatorio.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => markActivityAsCompleted(selectedLead.id, activitat.id)}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                  >
                                    Marcar Completada
                                  </button>
                                  <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">
                                    Editar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Activitats completades */}
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3">Completades</h4>
                          <div className="space-y-3">
                            {selectedLead.actividades?.filter(a => a.completada).map(activitat => (
                              <div key={activitat.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">{activitat.titulo}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                                      {activitat.tipo}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {activitat.fecha.toLocaleDateString()} {activitat.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700">{activitat.descripcion}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {(!selectedLead.actividades || selectedLead.actividades.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No hi ha activitats programades encara</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'Email */}
      {showEmailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Enviar Email a {selectedLead.nombre}</h2>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Templates Disponibles</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {emailTemplates
                      .filter(t => t.tipoCliente === 'ambos' || t.tipoCliente === selectedLead.tipo)
                      .map(template => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`w-full p-3 text-left rounded-lg border transition-colors ${
                            selectedTemplate?.id === template.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium text-sm">{template.nombre}</div>
                          <div className="text-xs text-gray-600">{template.asunto}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Fase: {estadosPipeline.find(e => e.id === template.fase)?.label || template.fase}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  {selectedTemplate ? (
                    <div>
                      <h3 className="font-semibold mb-3">Previsualització</h3>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="mb-3">
                          <label className="text-sm font-medium text-gray-700">Assumpte:</label>
                          <div className="text-sm mt-1 p-2 bg-white border rounded">
                            {selectedTemplate.asunto
                              .replace('{nom}', selectedLead.nombre)
                              .replace('{empresa}', selectedLead.empresa)
                              .replace('{sector}', selectedLead.sector)
                            }
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Contingut:</label>
                          <div className="text-sm mt-1 p-2 bg-white border rounded h-32 overflow-y-auto whitespace-pre-wrap">
                            {selectedTemplate.contenido
                              .replace('{nom}', selectedLead.nombre)
                              .replace('{empresa}', selectedLead.empresa)
                              .replace('{sector}', selectedLead.sector)
                              .replace('{roi}', '187')
                              .replace('{ahorros}', '€45.000')
                            }
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button 
                          onClick={() => {
                            sendEmail(selectedLead.id, selectedTemplate, {
                              nom: selectedLead.nombre,
                              empresa: selectedLead.empresa,
                              sector: selectedLead.sector,
                              roi: '187',
                              ahorros: '€45.000'
                            })
                            setShowEmailModal(false)
                            setSelectedTemplate(null)
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Enviar Email
                        </button>
                        <button 
                          onClick={() => setSelectedTemplate(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel·lar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      <Mail className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Selecciona un template per veure la previsualització</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'Activitat */}
      {showActivityModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Nova Activitat per {selectedLead.nombre}</h2>
              <button 
                onClick={() => setShowActivityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const activity: Omit<Actividad, 'id'> = {
                  tipo: formData.get('tipus') as Actividad['tipo'],
                  titulo: formData.get('titol') as string,
                  descripcion: formData.get('descripcio') as string,
                  fecha: new Date(formData.get('data') as string),
                  completada: false,
                  recordatorio: formData.get('recordatori') ? new Date(formData.get('recordatori') as string) : undefined,
                  leadId: selectedLead.id
                }
                addActivity(activity)
                setShowActivityModal(false)
              }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipus d'Activitat</label>
                  <select 
                    name="tipus" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onChange={(e) => {
                      const form = e.target.closest('form')
                      const titleInput = form?.querySelector('[name="titol"]') as HTMLInputElement
                      const descriptionInput = form?.querySelector('[name="descripcio"]') as HTMLTextAreaElement
                      
                      const suggestions: { [key: string]: { title: string, description: string } } = {
                        'llamada': {
                          title: `Trucada de seguiment amb ${selectedLead.nombre}`,
                          description: 'Revisar estat del projecte i identificar pròxims passos'
                        },
                        'reunion': {
                          title: `Reunió tècnica amb ${selectedLead.empresa}`,
                          description: 'Presentar solució detallada i resoldre dubtes tècnics'
                        },
                        'demo': {
                          title: `Demo personalitzada per ${selectedLead.empresa}`,
                          description: 'Mostrar funcionalitats clau adaptades al seu sector'
                        },
                        'email': {
                          title: `Follow-up email per ${selectedLead.nombre}`,
                          description: 'Enviar documentació addicional i proposta comercial'
                        },
                        'seguimiento': {
                          title: `Seguiment comercial ${selectedLead.empresa}`,
                          description: 'Avaluar progressió i actualitzar pipeline'
                        }
                      }
                      
                      const suggestion = suggestions[e.target.value]
                      if (suggestion && titleInput && descriptionInput) {
                        titleInput.value = suggestion.title
                        descriptionInput.value = suggestion.description
                      }
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="llamada">🤙 Trucada Comercial</option>
                    <option value="email">📧 Follow-up Email</option>
                    <option value="reunion">🤝 Reunió Presencial/Online</option>
                    <option value="demo">🎯 Demo Personalitzada</option>
                    <option value="seguimiento">📊 Seguiment Pipeline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data i Hora</label>
                  <input 
                    type="datetime-local" 
                    name="data"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durada (minuts)</label>
                  <select name="duracion" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="15">15 minuts</option>
                    <option value="30" selected>30 minuts</option>
                    <option value="45">45 minuts</option>
                    <option value="60">1 hora</option>
                    <option value="90">1.5 hores</option>
                    <option value="120">2 hores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioritat</label>
                  <select name="prioritat" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="baixa">🟢 Baixa</option>
                    <option value="mitjana" selected>🟡 Mitjana</option>
                    <option value="alta">🟠 Alta</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Títol</label>
                <input 
                  type="text" 
                  name="titol"
                  required
                  placeholder="Ex: Reunió tècnica amb equip IT"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripció</label>
                <textarea 
                  name="descripcio"
                  rows={3}
                  placeholder="Detalls de l'activitat..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recordatori</label>
                <div className="grid grid-cols-2 gap-3">
                  <select name="recordatoriTipus" className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Sense recordatori</option>
                    <option value="15">15 minuts abans</option>
                    <option value="30">30 minuts abans</option>
                    <option value="60" selected>1 hora abans</option>
                    <option value="1440">1 dia abans</option>
                    <option value="custom">Personalitzat</option>
                  </select>
                  <input 
                    type="datetime-local" 
                    name="recordatori"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Participants Adicionals (Opcional)</label>
                <input 
                  type="text" 
                  name="participantes"
                  placeholder="Emails separats per comes (ex: anna@empresa.cat, marc@client.com)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="mt-6 flex items-center gap-3">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Crear Activitat
                </button>
                <button 
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'Assignació */}
      {showAssignModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Assignar Gestor</h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Lead: <strong>{selectedLead.nombre}</strong></p>
                <p className="text-sm text-gray-600 mb-4">Actual: <strong>{selectedLead.gestorAsignado || 'Sense assignar'}</strong></p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nou Gestor:</label>
                {comerciales.map(comercial => (
                  <button
                    key={comercial.id}
                    onClick={() => {
                      assignLeadToManager(selectedLead.id, comercial.id)
                      setShowAssignModal(false)
                    }}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">{comercial.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {comercial.tipo === 'gestor_ia' ? 'Gestor IA especialitzat' : 'Gestor comercial empresa'}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documents */}
      {showDocumentModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Pujar Document per {selectedLead.nombre}</h2>
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const file = formData.get('document') as File
                const tipo = formData.get('tipo') as Documento['tipo']
                if (file && tipo) {
                  uploadDocument(selectedLead.id, file, tipo)
                }
              }}
              className="p-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipus de Document</label>
                  <select name="tipo" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="">Seleccionar tipus...</option>
                    <option value="contrato">Contracte</option>
                    <option value="propuesta">Proposta</option>
                    <option value="presentacion">Presentació</option>
                    <option value="otro">Altres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arxiu</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="document-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                        >
                          <span>Pujar un arxiu</span>
                          <input
                            id="document-upload"
                            name="document"
                            type="file"
                            className="sr-only"
                            required
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">o arrossega aquí</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, PPT, XLS, IMG fins a 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Opcional)</label>
                  <textarea 
                    name="notes"
                    rows={3}
                    placeholder="Descripció o notes sobre el document..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {uploadingDocument ? (
                  <button 
                    type="button"
                    disabled
                    className="px-4 py-2 bg-purple-400 text-white rounded-lg cursor-not-allowed flex items-center gap-2"
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Pujant...
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Pujar Document
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploadingDocument}
                >
                  Cancel·lar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configuració del Pipeline */}
      {showPipelineConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Configuració del Pipeline</h2>
              <button 
                onClick={() => setShowPipelineConfig(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full">
              <div className="space-y-6">
                {/* Configuració actual del pipeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fases del Pipeline Actual</h3>
                  <div className="space-y-3">
                    {customPipeline.map((stage, index) => (
                      <div key={stage.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-gray-500 font-mono text-sm">
                            {index + 1}.
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${stage.color}`}>
                              {stage.label}
                            </div>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{stage.id}</code>
                          </div>
                          <div className="text-sm text-gray-600">
                            {filteredLeads.filter(l => l.estado === stage.id).length} leads
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              const newLabel = prompt('Nou nom per la fase:', stage.label)
                              if (newLabel && newLabel.trim()) {
                                updatePipelineStage(stage.id, { label: newLabel.trim() })
                              }
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Editar nom"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {!['cerrado_ganado', 'cerrado_perdido'].includes(stage.id) && (
                            <button 
                              onClick={() => {
                                if (confirm(`Segur que vols eliminar la fase "${stage.label}"?`)) {
                                  deletePipelineStage(stage.id)
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Eliminar fase"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Afegir nova fase */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Afegir Nova Fase</h3>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const label = formData.get('label') as string
                      const id = formData.get('id') as string
                      const colorClass = formData.get('color') as string
                      
                      if (label && id && colorClass) {
                        const newStage = {
                          id,
                          label,
                          color: `${colorClass}-100 text-${colorClass}-800`,
                          bgColor: `bg-${colorClass}-50`
                        }
                        addPipelineStage(newStage)
                        // Reset form
                        ;(e.target as HTMLFormElement).reset()
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Fase</label>
                        <input 
                          type="text" 
                          name="label"
                          required
                          placeholder="Ex: En Revisió"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Intern (únic)</label>
                        <input 
                          type="text" 
                          name="id"
                          required
                          placeholder="Ex: en_revision"
                          pattern="[a-z_]+"
                          title="Només lletres minúscules i guions baixos"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <select name="color" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="">Seleccionar color...</option>
                          <option value="bg-gray">🔘 Gris</option>
                          <option value="bg-blue">🔵 Blau</option>
                          <option value="bg-green">🟢 Verd</option>
                          <option value="bg-yellow">🟡 Groc</option>
                          <option value="bg-orange">🟠 Taronja</option>
                          <option value="bg-red">🔴 Vermell</option>
                          <option value="bg-purple">🟣 Morat</option>
                          <option value="bg-pink">🟢 Rosa</option>
                          <option value="bg-indigo">🟦 Indi</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Afegir Fase
                    </button>
                  </form>
                </div>

                {/* Templates de pipeline predefinits */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Templates Predefinits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Pipeline B2B Estàndard</h4>
                      <div className="text-sm text-gray-600 mb-3">
                        Ideal per empreses privades amb cicle de venda mitjà
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {['Nou', 'Qualificat', 'Presentació', 'Proposta', 'Negociació', 'Tancat'].map(stage => (
                          <span key={stage} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {stage}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const b2bPipeline = [
                            { id: 'nuevo', label: 'Nou', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' },
                            { id: 'cualificado', label: 'Qualificat', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
                            { id: 'presentacion', label: 'Presentació', color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
                            { id: 'propuesta', label: 'Proposta', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
                            { id: 'negociacion', label: 'Negociació', color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' },
                            { id: 'cerrado_ganado', label: 'Tancat Guanyat', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
                            { id: 'cerrado_perdido', label: 'Tancat Perdut', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' }
                          ]
                          setCustomPipeline(b2bPipeline)
                        }}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Aplicar Template
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-2">Pipeline Administració Pública</h4>
                      <div className="text-sm text-gray-600 mb-3">
                        Especialitzat per licitacions i contractació pública
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {['Nou', 'Qualificat', 'Licitació', 'Avaluació', 'Adjudicació', 'Contractat'].map(stage => (
                          <span key={stage} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {stage}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          const publicPipeline = [
                            { id: 'nuevo', label: 'Nou', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' },
                            { id: 'cualificado', label: 'Qualificat', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
                            { id: 'licitacion', label: 'Licitació', color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
                            { id: 'evaluacion', label: 'Avaluació', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
                            { id: 'adjudicacion', label: 'Adjudicació', color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' },
                            { id: 'cerrado_ganado', label: 'Contractat', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
                            { id: 'cerrado_perdido', label: 'Descartat', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' }
                          ]
                          setCustomPipeline(publicPipeline)
                        }}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Aplicar Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estadístiques del pipeline */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Estadístiques del Pipeline</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{customPipeline.length}</div>
                      <div className="text-sm text-blue-700">Total Fases</div>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {customPipeline.filter(s => !['cerrado_ganado', 'cerrado_perdido'].includes(s.id)).length}
                      </div>
                      <div className="text-sm text-green-700">Fases Actives</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(filteredLeads.reduce((sum, l) => sum + l.probabilidadCierre, 0) / filteredLeads.length || 0)}%
                      </div>
                      <div className="text-sm text-purple-700">Prob. Mitjana</div>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {filteredLeads.filter(l => ['nuevo', 'contactado'].includes(l.estado)).length}
                      </div>
                      <div className="text-sm text-orange-700">Leads Inicials</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botons d'acció */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button 
                  onClick={() => {
                    if (confirm('Segur que vols restaurar el pipeline per defecte? Es perdran els canvis personalitzats.')) {
                      resetPipelineToDefault()
                    }
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Restaurar Per Defecte
                </button>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowPipelineConfig(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar Configuració
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}