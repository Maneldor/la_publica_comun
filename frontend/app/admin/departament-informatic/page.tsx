'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, Code, Monitor, Shield, Zap, Users, Building2, CreditCard,
  MessageSquare, AlertCircle, CheckCircle, Clock, TrendingUp,
  GitBranch, Database, Server, Cpu, HardDrive, Wifi, Globe,
  FileCode, Terminal, Bug, Wrench, Settings, Package, Sparkles,
  Brain, HeadphonesIcon, Calendar, Euro, Star, Activity,
  ChevronRight, Plus, X, Send, Upload, Download, RefreshCw,
  Video, Mic, Share2, Eye, Edit, Trash2, Copy, Save, AlertTriangle,
  Search, ChevronUp, ChevronDown
} from 'lucide-react'

type ServiceRequest = {
  id: string
  empresa: string
  tipo: 'mantenimiento' | 'desarrollo' | 'diseño' | 'ia' | 'emergencia'
  descripcion: string
  estado: 'pendiente' | 'analizando' | 'en_proceso' | 'completado' | 'facturado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  asignadoA: 'IA' | 'Equipo' | 'Mixto'
  fecha: Date
  tiempoEstimado: string
  coste: number
  iaAnalisis?: {
    complejidad: number
    solucionAutomatica: boolean
    accionesRequeridas: string[]
    confianza: number
  }
}

type IAAgent = {
  id: string
  nombre: string
  tipo: 'mantenimiento' | 'desarrollo' | 'soporte' | 'analisis'
  estado: 'activo' | 'ocupado' | 'inactivo'
  tareasCompletadas: number
  tasaExito: number
  especialidades: string[]
  empresasActuales: string[]
}

type ProyectoInterno = {
  id: string
  nombre: string
  tipo: 'feature' | 'bug' | 'mejora' | 'seguridad'
  columna: 'backlog' | 'analisis' | 'desarrollo' | 'testing' | 'produccion'
  asignados: string[]
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  tiempoEstimado: string
  progreso: number
  iaAsistencia: boolean
}

type Ticket = {
  id: string
  codigo: string
  titulo: string
  descripcion: string
  tipo: 'incidencia' | 'peticion' | 'consulta' | 'error'
  origen: 'interno' | 'externo'
  empresa?: string
  usuario: string
  estado: 'nuevo' | 'asignado' | 'en_proceso' | 'esperando' | 'resuelto' | 'cerrado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  departamento: string
  asignadoA?: string
  fechaCreacion: Date
  fechaActualizacion: Date
  sla: {
    tiempo: string
    vencimiento: Date
    cumplido: boolean
  }
  respuestas: number
  adjuntos: number
  iaAnalisis?: {
    solucionSugerida: string
    confianza: number
    tiempoEstimado: string
  }
}

// Funciones auxiliares
const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'critica': return 'bg-red-100 text-red-800 border-red-200'
    case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'baja': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'completado': return 'bg-green-100 text-green-800'
    case 'en_proceso': return 'bg-blue-100 text-blue-800'
    case 'analizando': return 'bg-purple-100 text-purple-800'
    case 'pendiente': return 'bg-gray-100 text-gray-800'
    case 'facturado': return 'bg-emerald-100 text-emerald-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function DepartamentInformaticPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(true)
  const [aiMessage, setAiMessage] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Estados para filtros de incidencias
  const [ticketTypeFilter, setTicketTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchFilter, setSearchFilter] = useState('')

  // Estados para nuevo ticket
  const [newTicket, setNewTicket] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'incidencia',
    origen: 'interno',
    empresa: '',
    usuario: '',
    prioridad: 'media',
    departamento: 'Frontend',
    asignadoA: 'no_asignado'
  })

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedCards(newExpanded)
  }

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleCreateTicket = () => {
    // Generar nuevo código de ticket
    const ticketCount = tickets.length + 1
    const newTicketCode = `TK-${ticketCount.toString().padStart(3, '0')}`
    
    // Crear nuevo ticket (en una aplicación real, esto sería una llamada a API)
    console.log('Crear nuevo ticket:', {
      ...newTicket,
      codigo: newTicketCode,
      id: newTicketCode,
      estado: 'nuevo',
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      respuestas: 0,
      adjuntos: 0
    })
    
    // Resetear formulario y cerrar modal
    setNewTicket({
      titulo: '',
      descripcion: '',
      tipo: 'incidencia',
      origen: 'interno',
      empresa: '',
      usuario: '',
      prioridad: 'media',
      departamento: 'Frontend',
      asignadoA: 'no_asignado'
    })
    setShowNewTicketModal(false)
  }


  const [draggedProject, setDraggedProject] = useState<ProyectoInterno | null>(null)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  // Datos simulados de tickets
  const [tickets] = useState<Ticket[]>([
    {
      id: 'TK-001',
      codigo: 'TK-001',
      titulo: 'Error 404 en página de productos',
      descripcion: 'Los usuarios reportan error 404 al acceder a ciertos productos',
      tipo: 'error',
      origen: 'externo',
      empresa: 'Botiga Online BCN',
      usuario: 'Joan Martínez',
      estado: 'en_proceso',
      prioridad: 'critica',
      departamento: 'Frontend',
      asignadoA: 'CodeBot Pro',
      fechaCreacion: new Date('2024-01-15T10:00:00'),
      fechaActualizacion: new Date('2024-01-15T14:30:00'),
      sla: {
        tiempo: '4h',
        vencimiento: new Date('2024-01-15T14:00:00'),
        cumplido: false
      },
      respuestas: 3,
      adjuntos: 2,
      iaAnalisis: {
        solucionSugerida: 'Revisar configuración de rutas en Next.js y regenerar páginas estáticas',
        confianza: 92,
        tiempoEstimado: '30min'
      }
    },
    {
      id: 'TK-002',
      codigo: 'TK-002',
      titulo: 'Optimización de consultas SQL lentas',
      descripcion: 'Dashboard tarda más de 5 segundos en cargar',
      tipo: 'incidencia',
      origen: 'interno',
      usuario: 'Anna Puig',
      estado: 'asignado',
      prioridad: 'alta',
      departamento: 'Backend',
      asignadoA: 'Marc',
      fechaCreacion: new Date('2024-01-15T11:00:00'),
      fechaActualizacion: new Date('2024-01-15T11:30:00'),
      sla: {
        tiempo: '8h',
        vencimiento: new Date('2024-01-15T19:00:00'),
        cumplido: true
      },
      respuestas: 1,
      adjuntos: 0
    },
    {
      id: 'TK-003',
      codigo: 'TK-003',
      titulo: 'Solicitud integración con Stripe',
      descripcion: 'Necesitamos integrar pagos con Stripe para nueva funcionalidad',
      tipo: 'peticion',
      origen: 'externo',
      empresa: 'TechCorp Solutions',
      usuario: 'Maria López',
      estado: 'nuevo',
      prioridad: 'media',
      departamento: 'Desarrollo',
      fechaCreacion: new Date('2024-01-15T15:00:00'),
      fechaActualizacion: new Date('2024-01-15T15:00:00'),
      sla: {
        tiempo: '24h',
        vencimiento: new Date('2024-01-16T15:00:00'),
        cumplido: true
      },
      respuestas: 0,
      adjuntos: 1
    }
  ])

  // Función para filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    // Filtro por tipo (origen)
    if (ticketTypeFilter !== 'all') {
      if (ticketTypeFilter === 'intern' && ticket.origen !== 'interno') return false
      if (ticketTypeFilter === 'extern' && ticket.origen !== 'externo') return false
    }

    // Filtro por prioridad
    if (priorityFilter !== 'all' && ticket.prioridad !== priorityFilter) return false

    // Filtro por estado
    if (statusFilter !== 'all' && ticket.estado !== statusFilter) return false

    // Filtro por búsqueda
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase()
      return (
        ticket.codigo.toLowerCase().includes(searchLower) ||
        ticket.titulo.toLowerCase().includes(searchLower) ||
        ticket.descripcion.toLowerCase().includes(searchLower) ||
        ticket.usuario.toLowerCase().includes(searchLower) ||
        (ticket.empresa && ticket.empresa.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  // Datos simulados de servicios externos
  const [serviceRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      empresa: 'TechCorp Solutions',
      tipo: 'mantenimiento',
      descripcion: 'Actualización de certificados SSL y optimización de base de datos',
      estado: 'analizando',
      prioridad: 'alta',
      asignadoA: 'IA',
      fecha: new Date(),
      tiempoEstimado: '2h',
      coste: 150,
      iaAnalisis: {
        complejidad: 3,
        solucionAutomatica: true,
        accionesRequeridas: ['Renovar SSL', 'Optimizar queries', 'Limpiar caché'],
        confianza: 95
      }
    },
    {
      id: '2',
      empresa: 'Botiga Online BCN',
      tipo: 'emergencia',
      descripcion: 'Web caída - Error 500 en checkout',
      estado: 'en_proceso',
      prioridad: 'critica',
      asignadoA: 'Mixto',
      fecha: new Date(),
      tiempoEstimado: '30min',
      coste: 300,
      iaAnalisis: {
        complejidad: 7,
        solucionAutomatica: false,
        accionesRequeridas: ['Revisar logs', 'Identificar conflicto', 'Hotfix', 'Deploy'],
        confianza: 78
      }
    },
    {
      id: '3',
      empresa: 'Innovació Digital SL',
      tipo: 'ia',
      descripcion: 'Implementar chatbot con IA para atención al cliente',
      estado: 'pendiente',
      prioridad: 'media',
      asignadoA: 'IA',
      fecha: new Date(),
      tiempoEstimado: '2 semanas',
      coste: 2500
    }
  ])

  // Agentes IA disponibles
  const [iaAgents] = useState<IAAgent[]>([
    {
      id: 'agent-1',
      nombre: 'CodeBot Pro',
      tipo: 'desarrollo',
      estado: 'activo',
      tareasCompletadas: 147,
      tasaExito: 96.5,
      especialidades: ['React', 'Node.js', 'TypeScript', 'APIs'],
      empresasActuales: ['TechCorp Solutions']
    },
    {
      id: 'agent-2',
      nombre: 'MaintainAI',
      tipo: 'mantenimiento',
      estado: 'ocupado',
      tareasCompletadas: 523,
      tasaExito: 98.2,
      especialidades: ['SSL', 'Backups', 'Optimización', 'Monitoring'],
      empresasActuales: ['Botiga Online BCN', 'DataFlow Inc']
    },
    {
      id: 'agent-3',
      nombre: 'SupportBot',
      tipo: 'soporte',
      estado: 'activo',
      tareasCompletadas: 891,
      tasaExito: 94.7,
      especialidades: ['Diagnóstico', 'Logs', 'Debug', 'Documentación'],
      empresasActuales: []
    },
    {
      id: 'agent-4',
      nombre: 'AnalyzerAI',
      tipo: 'analisis',
      estado: 'activo',
      tareasCompletadas: 412,
      tasaExito: 97.8,
      especialidades: ['Seguridad', 'Performance', 'SEO', 'Accesibilidad'],
      empresasActuales: ['Innovació Digital SL']
    }
  ])

  // Proyectos internos (Kanban)
  const [internalProjects] = useState<ProyectoInterno[]>([
    {
      id: 'proj-1',
      nombre: 'Sistema de notificaciones push',
      tipo: 'feature',
      columna: 'desarrollo',
      asignados: ['Marc', 'Anna'],
      prioridad: 'alta',
      tiempoEstimado: '3d',
      progreso: 65,
      iaAsistencia: true
    },
    {
      id: 'proj-2',
      nombre: 'Fix: Memory leak en dashboard',
      tipo: 'bug',
      columna: 'testing',
      asignados: ['CodeBot Pro'],
      prioridad: 'critica',
      tiempoEstimado: '4h',
      progreso: 90,
      iaAsistencia: true
    },
    {
      id: 'proj-3',
      nombre: 'Migración a Next.js 14',
      tipo: 'mejora',
      columna: 'analisis',
      asignados: ['Equipo Frontend'],
      prioridad: 'media',
      tiempoEstimado: '2 semanas',
      progreso: 15,
      iaAsistencia: false
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Panel Principal */}
      <div className={`flex-1 ${showAIAssistant ? 'mr-96' : ''} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Cpu className="w-8 h-8" />
                Departament Informàtic - Centre de Serveis
              </h1>
              <p className="text-indigo-100 mt-1">
                Gestió interna i serveis tecnològics per empreses col·laboradores
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="font-semibold">4 Agents IA Actius</span>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="bg-white/20 backdrop-blur rounded-lg p-2 hover:bg-white/30 transition-colors"
              >
                <Bot className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navegación por pestañas - Dos filas */}
        <div className="bg-white border-b px-6">
          {/* Primera fila */}
          <div className="flex gap-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Monitor },
              { id: 'incidencias', label: 'Incidències', icon: AlertCircle },
              { id: 'monitorizacion', label: 'Monitorització', icon: Activity },
              { id: 'seguridad', label: 'Seguretat', icon: Shield },
              { id: 'backups', label: 'Backups', icon: HardDrive },
              { id: 'infraestructura', label: 'Infraestructura', icon: Server }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 border-b-2 transition-colors w-48 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Segunda fila */}
          <div className="flex gap-3 border-t border-gray-100">
            {[
              { id: 'repositori', label: 'Repositori', icon: Package },
              { id: 'servicios', label: 'Serveis Externs', icon: Building2 },
              { id: 'kanban', label: 'Projectes Interns', icon: GitBranch },
              { id: 'ia-agents', label: 'Agents IA', icon: Bot },
              { id: 'facturacion', label: 'Facturació', icon: Euro },
              { id: 'documentacion', label: 'Documentació', icon: FileCode }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 border-b-2 transition-colors w-48 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Métricas principales */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="w-8 h-8 text-indigo-600" />
                    <span className="text-2xl font-bold">47</span>
                  </div>
                  <p className="text-sm text-gray-600">Empreses amb servei actiu</p>
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% aquest mes
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Wrench className="w-8 h-8 text-blue-600" />
                    <span className="text-2xl font-bold">156</span>
                  </div>
                  <p className="text-sm text-gray-600">Tasques completades</p>
                  <div className="mt-2 text-xs text-gray-500">
                    89% resoltes per IA
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-green-600" />
                    <span className="text-2xl font-bold">1.2h</span>
                  </div>
                  <p className="text-sm text-gray-600">Temps mitjà resolució</p>
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    -35% millora
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Euro className="w-8 h-8 text-emerald-600" />
                    <span className="text-2xl font-bold">€12.4k</span>
                  </div>
                  <p className="text-sm text-gray-600">Ingressos aquest mes</p>
                  <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +28% vs mes anterior
                  </div>
                </div>
              </div>

              {/* Resumen de todas las funcionalidades */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'repositori', icon: Package, title: 'Repositori', color: 'indigo', data: [
                    { label: 'Components', value: '47' },
                    { label: 'Plugins actius', value: '15' },
                    { label: 'Templates', value: '12' }
                  ], extra: '98.5% deployments exitosos', extraColor: 'green' },
                  
                  { id: 'incidencias', icon: AlertCircle, title: 'Incidències', color: 'orange', data: [
                    { label: 'Nous tickets', value: '8' },
                    { label: 'En procés', value: '12' },
                    { label: 'Resolts avui', value: '23' }
                  ], extra: '1.2h temps mitjà', extraColor: 'blue' },

                  { id: 'monitorizacion', icon: Activity, title: 'Monitorització', color: 'green', data: [
                    { label: 'Servidors actius', value: '12/12' },
                    { label: 'Uptime', value: '99.9%' },
                    { label: 'Alertes', value: '2' }
                  ], extra: 'CPU mitjà: 32%', extraColor: 'orange' },

                  { id: 'seguridad', icon: Shield, title: 'Seguretat', color: 'blue', data: [
                    { label: 'SSL vàlids', value: '47/47' },
                    { label: 'Vulnerabilitats', value: '0' },
                    { label: 'Scans avui', value: '156' }
                  ], extra: 'Últim scan: fa 15min', extraColor: 'green' },

                  { id: 'backups', icon: HardDrive, title: 'Backups', color: 'purple', data: [
                    { label: 'Backups avui', value: '47' },
                    { label: 'Taxa d\'èxit', value: '100%' },
                    { label: 'Espai utilitzat', value: '2.3TB' }
                  ], extra: 'Pròxim: 02:00h', extraColor: 'blue' },

                  { id: 'infraestructura', icon: Server, title: 'Infraestructura', color: 'gray', data: [
                    { label: 'Servidors', value: '12' },
                    { label: 'Dominis', value: '47' },
                    { label: 'Databases', value: '23' }
                  ], extra: 'Càrrega mitjana: 0.8', extraColor: 'gray' },

                  { id: 'servicios', icon: Building2, title: 'Serveis Externs', color: 'cyan', data: [
                    { label: 'Sol·licituds actives', value: '3' },
                    { label: 'Empreses clients', value: '47' },
                    { label: 'Ingressos mes', value: '€12.4k' }
                  ], extra: '89% resoltes per IA', extraColor: 'purple' },

                  { id: 'kanban', icon: GitBranch, title: 'Projectes', color: 'orange', data: [
                    { label: 'En desenvolupament', value: '5' },
                    { label: 'En testing', value: '3' },
                    { label: 'Completats', value: '28' }
                  ], extra: '65% amb assistència IA', extraColor: 'blue' },

                  { id: 'ia-agents', icon: Bot, title: 'Agents IA', color: 'purple', data: [
                    { label: 'Agents actius', value: '4' },
                    { label: 'Tasques completades', value: '156' },
                    { label: 'Taxa d\'èxit mitjana', value: '96.8%' }
                  ], extra: '2 agents ocupats', extraColor: 'yellow' },

                  { id: 'facturacion', icon: Euro, title: 'Facturació', color: 'emerald', data: [
                    { label: 'Factures generades', value: '23' },
                    { label: 'Ingressos mensuals', value: '€12.4k' },
                    { label: 'Pagaments pendents', value: '3' }
                  ], extra: '+28% vs mes anterior', extraColor: 'emerald' },

                  { id: 'documentacion', icon: FileCode, title: 'Documentació', color: 'slate', data: [
                    { label: 'Documents actius', value: '156' },
                    { label: 'APIs documentades', value: '12' },
                    { label: 'Guies d\'integració', value: '8' }
                  ], extra: 'SDK per 12 llenguatges', extraColor: 'indigo' }
                ].map((card) => (
                  <div key={card.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <card.icon className={`w-4 h-4 text-${card.color}-600`} />
                        <h4 className="font-semibold text-gray-900 text-sm">{card.title}</h4>
                      </div>
                      <button
                        onClick={() => toggleCardExpansion(card.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedCards.has(card.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Contenido siempre visible - datos principales */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{card.data[0].label}</span>
                        <span className="font-semibold">{card.data[0].value}</span>
                      </div>
                    </div>

                    {/* Contenido expandible */}
                    {expandedCards.has(card.id) && (
                      <div className="mt-3 space-y-1">
                        {card.data.slice(1).map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-semibold">{item.value}</span>
                          </div>
                        ))}
                        <div className={`mt-2 text-xs text-${card.extraColor}-600`}>
                          {card.extra}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Estado en tiempo real - Tarjetas expandibles */}
              <div className="grid grid-cols-4 gap-4">
                {/* Solicitudes activas */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">Sol·licituds Actives</h4>
                    </div>
                    <button
                      onClick={() => toggleCardExpansion('solicitudes')}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedCards.has('solicitudes') ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Contenido siempre visible */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Sol·licituds actives</span>
                      <span className="font-semibold">{serviceRequests.filter(s => s.estado !== 'completado').length}</span>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {expandedCards.has('solicitudes') && (
                    <div className="mt-3 space-y-2">
                      {serviceRequests.filter(s => s.estado !== 'completado').slice(0, 3).map((request) => (
                        <div key={request.id} className={`p-2 rounded border text-xs ${getPriorityColor(request.prioridad)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{request.empresa}</div>
                              <div className="text-xs opacity-75 truncate">{request.descripcion.substring(0, 40)}...</div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className={`text-xs px-1 py-0.5 rounded ${getStatusColor(request.estado)}`}>
                                  {request.estado}
                                </span>
                                {request.asignadoA === 'IA' && (
                                  <Bot className="w-3 h-3 text-purple-600" />
                                )}
                              </div>
                            </div>
                            {request.iaAnalisis && (
                              <div className="text-right ml-2">
                                <div className="text-xs font-bold text-purple-600">{request.iaAnalisis.confianza}%</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {serviceRequests.filter(s => s.estado !== 'completado').length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{serviceRequests.filter(s => s.estado !== 'completado').length - 3} més
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Estado de Agentes IA */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">Agents IA</h4>
                    </div>
                    <button
                      onClick={() => toggleCardExpansion('agents')}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedCards.has('agents') ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Contenido siempre visible */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Agents actius</span>
                      <span className="font-semibold">{iaAgents.filter(a => a.estado === 'activo' || a.estado === 'ocupado').length}</span>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {expandedCards.has('agents') && (
                    <div className="mt-3 space-y-2">
                      {iaAgents.map((agent) => (
                        <div key={agent.id} className="flex items-center justify-between p-2 rounded bg-gray-50 text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              agent.estado === 'activo' ? 'bg-green-500' :
                              agent.estado === 'ocupado' ? 'bg-yellow-500' :
                              'bg-gray-400'
                            }`} />
                            <div>
                              <div className="font-medium">{agent.nombre}</div>
                              <div className="text-xs text-gray-500">{agent.tipo}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{agent.tasaExito}%</div>
                            <div className="text-xs text-gray-500">{agent.tareasCompletadas}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'incidencias' && (
            <div className="space-y-6">
              {/* Estadísticas de tickets */}
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Nous</span>
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => t.estado === 'nuevo').length}</div>
                  <div className="text-xs text-red-600">+3 últimes 24h</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">En procés</span>
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => ['asignado', 'en_proceso'].includes(t.estado)).length}</div>
                  <div className="text-xs text-gray-600">4 vencent avui</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Resolts</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{tickets.filter(t => ['resuelto', 'cerrado'].includes(t.estado)).length}</div>
                  <div className="text-xs text-green-600">Aquesta setmana</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-red-200 bg-red-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-red-700">Crítics</span>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-700">{tickets.filter(t => t.prioridad === 'critica').length}</div>
                  <div className="text-xs text-red-600">Atenció immediata</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">SLA en risc</span>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{tickets.filter(t => t.sla && !t.sla.cumplido).length}</div>
                  <div className="text-xs text-orange-600">&lt; 2h restants</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-200 bg-purple-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-purple-700">Resolts per IA</span>
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {tickets.length > 0 ? Math.round((tickets.filter(t => t.asignadoA === 'IA' || t.asignadoA === 'CodeBot Pro').length / tickets.length) * 100) : 0}%
                  </div>
                  <div className="text-xs text-purple-600">Taxa automatització</div>
                </div>
              </div>

              {/* Filtros y acciones */}
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <select 
                    value={ticketTypeFilter}
                    onChange={(e) => setTicketTypeFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">Tots els tickets</option>
                    <option value="intern">Només interns</option>
                    <option value="extern">Només externs</option>
                  </select>
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">Totes les prioritats</option>
                    <option value="critica">Crítica</option>
                    <option value="alta">Alta</option>
                    <option value="media">Mitjana</option>
                    <option value="baixa">Baixa</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option value="all">Tots els estats</option>
                    <option value="nuevo">Nou</option>
                    <option value="asignado">Assignat</option>
                    <option value="en_proceso">En procés</option>
                    <option value="esperando">Esperant</option>
                    <option value="resuelto">Resolt</option>
                    <option value="cerrado">Tancat</option>
                  </select>
                  <div className="relative">
                    <input 
                      type="search" 
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Buscar ticket..." 
                      className="pl-8 pr-4 py-1.5 border border-gray-300 rounded text-sm w-64"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {(ticketTypeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' || searchFilter) && (
                    <button
                      onClick={() => {
                        setTicketTypeFilter('all')
                        setPriorityFilter('all')
                        setStatusFilter('all')
                        setSearchFilter('')
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Netejar filtres
                    </button>
                  )}
                  <span className="text-sm text-gray-600">
                    {filteredTickets.length} de {tickets.length} tickets
                  </span>
                  <button 
                    onClick={() => setShowNewTicketModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Nou Ticket
                  </button>
                </div>
              </div>

              {/* Tabla de tickets */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Codi</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Títol</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Origen</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Prioritat</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Estat</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Assignat</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">SLA</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">IA</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-900">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-mono text-sm font-medium text-indigo-600">{ticket.codigo}</span>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm text-gray-900 max-w-xs truncate">
                              {ticket.titulo}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <span>{ticket.usuario}</span>
                              {ticket.empresa && (
                                <>
                                  <span>•</span>
                                  <span>{ticket.empresa}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            ticket.origen === 'interno' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {ticket.origen}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(ticket.prioridad)}`}>
                            {ticket.prioridad}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            ticket.estado === 'nuevo' ? 'bg-blue-100 text-blue-800' :
                            ticket.estado === 'asignado' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.estado === 'en_proceso' ? 'bg-purple-100 text-purple-800' :
                            ticket.estado === 'esperando' ? 'bg-orange-100 text-orange-800' :
                            ticket.estado === 'resuelto' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.estado}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {ticket.asignadoA?.includes('Bot') && <Bot className="w-3 h-3 text-purple-600" />}
                            <span className="text-sm">{ticket.asignadoA || '-'}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-xs">
                            <div className={`font-medium ${!ticket.sla.cumplido ? 'text-red-600' : 'text-gray-600'}`}>
                              {ticket.sla.tiempo}
                            </div>
                            {!ticket.sla.cumplido && (
                              <div className="text-red-500 flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                Vençut
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          {ticket.iaAnalisis ? (
                            <div className="text-center">
                              <div className="text-xs font-bold text-purple-600">{ticket.iaAnalisis.confianza}%</div>
                              <div className="text-xs text-gray-500">{ticket.iaAnalisis.tiempoEstimado}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedTicket(ticket)}
                              className="text-gray-600 hover:text-indigo-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista rápida de ticket seleccionado */}
              {selectedTicket && (
                <div className="bg-white rounded-lg border border-indigo-200 p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{selectedTicket.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">{selectedTicket.descripcion}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {selectedTicket.iaAnalisis && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-sm text-purple-900">Anàlisi IA</span>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">
                          {selectedTicket.iaAnalisis.confianza}% confiança
                        </span>
                      </div>
                      <p className="text-sm text-purple-800">{selectedTicket.iaAnalisis.solucionSugerida}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                          Aplicar solució IA
                        </button>
                        <span className="text-xs text-purple-600">
                          Temps estimat: {selectedTicket.iaAnalisis.tiempoEstimado}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Departament:</span>
                      <span className="ml-2 font-medium">{selectedTicket.departamento}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Respostes:</span>
                      <span className="ml-2 font-medium">{selectedTicket.respuestas}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Adjunts:</span>
                      <span className="ml-2 font-medium">{selectedTicket.adjuntos}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'monitorizacion' && (
            <div className="space-y-6">
              {/* Gràfics d'evolució temporal */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">CPU Evolution</h3>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option>Última hora</option>
                        <option>Últimes 24h</option>
                        <option>Última setmana</option>
                        <option>Últim mes</option>
                      </select>
                      <button
                        onClick={() => toggleSectionExpansion('cpu-evolution')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedSections.has('cpu-evolution') ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
                    <div className="text-xs text-gray-500">📈 Gràfic CPU: 32% actual vs 28% mes anterior (+14%)</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promig mensual</span>
                    <span className="font-medium text-blue-600">28.4%</span>
                  </div>
                  {expandedSections.has('cpu-evolution') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">Pic màxim</h5>
                          <div className="text-2xl font-bold text-blue-700">87%</div>
                          <div className="text-sm text-blue-600">Avui 14:23</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-green-900 mb-2">Mínim del dia</h5>
                          <div className="text-2xl font-bold text-green-700">18%</div>
                          <div className="text-sm text-green-600">Avui 06:15</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Processos amb més consum</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">node server.js</span>
                            <span className="font-semibold text-red-600">23.4%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">nginx</span>
                            <span className="font-semibold text-orange-600">8.7%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">postgres</span>
                            <span className="font-semibold text-yellow-600">6.2%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">RAM Usage</h3>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option>Última hora</option>
                        <option>Últimes 24h</option>
                        <option>Última setmana</option>
                        <option>Últim mes</option>
                      </select>
                      <button
                        onClick={() => toggleSectionExpansion('ram-usage')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedSections.has('ram-usage') ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
                    <div className="text-xs text-gray-500">📊 Gràfic RAM: 67% actual vs 62% mes anterior (+8%)</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promig mensual</span>
                    <span className="font-medium text-orange-600">62.1%</span>
                  </div>
                  {expandedSections.has('ram-usage') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2">Memòria total</h5>
                          <div className="text-2xl font-bold text-orange-700">32 GB</div>
                          <div className="text-sm text-orange-600">Disponible en sistema</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2">En ús actualment</h5>
                          <div className="text-2xl font-bold text-red-700">21.4 GB</div>
                          <div className="text-sm text-red-600">67% del total</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Aplicacions amb més consum</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">node server.js</span>
                            <span className="font-semibold text-red-600">8.2 GB</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">postgres</span>
                            <span className="font-semibold text-orange-600">4.1 GB</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">redis</span>
                            <span className="font-semibold text-yellow-600">1.8 GB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Network Traffic</h3>
                    <div className="flex items-center gap-2">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option>Última hora</option>
                        <option>Últimes 24h</option>
                        <option>Última setmana</option>
                        <option>Últim mes</option>
                      </select>
                      <button
                        onClick={() => toggleSectionExpansion('network-traffic')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedSections.has('network-traffic') ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center mb-4">
                    <div className="text-xs text-gray-500">🌐 Gràfic Tràfic: 2.4GB/s vs 2.1GB/s mes anterior (+14%)</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Promig mensual</span>
                    <span className="font-medium text-green-600">2.1 GB/s</span>
                  </div>
                  {expandedSections.has('network-traffic') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-green-900 mb-2">Download</h5>
                          <div className="text-2xl font-bold text-green-700">1.8 GB/s</div>
                          <div className="text-sm text-green-600">Entrada actual</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">Upload</h5>
                          <div className="text-2xl font-bold text-blue-700">0.6 GB/s</div>
                          <div className="text-sm text-blue-600">Sortida actual</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Top endpoints per tràfic</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">/api/uploads</span>
                            <span className="font-semibold text-red-600">45%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">/static/assets</span>
                            <span className="font-semibold text-orange-600">23%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">/api/downloads</span>
                            <span className="font-semibold text-yellow-600">18%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Configuració d'Alertes */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuració d'Alertes</h3>
                  <div className="flex items-center gap-2">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors text-sm">
                      Nou Umbell
                    </button>
                    <button
                      onClick={() => toggleSectionExpansion('alerts-config')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSections.has('alerts-config') ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Umbrals Crítics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">CPU &gt; 80%</div>
                          <div className="text-sm text-gray-600">Notificació immediata</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">Actiu</span>
                          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">RAM &gt; 90%</div>
                          <div className="text-sm text-gray-600">Email + Slack</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">Actiu</span>
                          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Disk Space &gt; 85%</div>
                          <div className="text-sm text-gray-600">Telegram + SMS</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-yellow-600">Pausat</span>
                          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Canals de Notificació</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-900">Email</span>
                        </div>
                        <span className="text-sm text-green-700">admin@lapublica.cat</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-blue-200 rounded bg-blue-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-blue-900">Slack</span>
                        </div>
                        <span className="text-sm text-blue-700">#alerts-production</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-purple-200 rounded bg-purple-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="font-medium text-purple-900">Telegram</span>
                        </div>
                        <span className="text-sm text-purple-700">@sysadmin_alerts</span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedSections.has('alerts-config') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h5 className="font-semibold text-yellow-900 mb-2">Alertes actives</h5>
                        <div className="text-2xl font-bold text-yellow-700">12</div>
                        <div className="text-sm text-yellow-600">Darrera setmana</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-2">Falsos positius</h5>
                        <div className="text-2xl font-bold text-red-700">3</div>
                        <div className="text-sm text-red-600">3% de les alertes</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Temps resposta mig</h5>
                        <div className="text-2xl font-bold text-green-700">8 min</div>
                        <div className="text-sm text-green-600">Objectiu: &lt;15 min</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900">Història recent d'alertes</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                          <div>
                            <div className="font-medium text-red-900">CPU spike detected</div>
                            <div className="text-sm text-red-700">Server-01 va al 91% CPU</div>
                          </div>
                          <div className="text-sm text-red-600">Fa 2h</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded">
                          <div>
                            <div className="font-medium text-orange-900">RAM threshold exceeded</div>
                            <div className="text-sm text-orange-700">Database server arribant a 92%</div>
                          </div>
                          <div className="text-sm text-orange-600">Fa 6h</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                          <div>
                            <div className="font-medium text-green-900">System recovery</div>
                            <div className="text-sm text-green-700">Todos los servicios operativos</div>
                          </div>
                          <div className="text-sm text-green-600">Ahir</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Monitorització d'Endpoints */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Monitorització d'Endpoints</h3>
                  <button
                    onClick={() => toggleSectionExpansion('endpoints-monitoring')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('endpoints-monitoring') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">/dashboard</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-green-700">142ms avg</div>
                    <div className="text-xs text-green-600">99.9% uptime</div>
                  </div>
                  <div className="p-4 border border-yellow-200 rounded bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-900">/api/users</span>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-yellow-700">287ms avg</div>
                    <div className="text-xs text-yellow-600">98.2% uptime</div>
                  </div>
                  <div className="p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">/admin</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-green-700">98ms avg</div>
                    <div className="text-xs text-green-600">100% uptime</div>
                  </div>
                  <div className="p-4 border border-red-200 rounded bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-900">/reports</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-red-700">1.2s avg</div>
                    <div className="text-xs text-red-600">94.1% uptime</div>
                  </div>
                </div>
                {expandedSections.has('endpoints-monitoring') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Total petitions</h5>
                        <div className="text-2xl font-bold text-blue-700">1,247,832</div>
                        <div className="text-sm text-blue-600">Darrera setmana</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">Temps resposta mig</h5>
                        <div className="text-2xl font-bold text-purple-700">210ms</div>
                        <div className="text-sm text-purple-600">Tots els endpoints</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900">Endpoints amb més tràfic</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">/api/auth/login</span>
                          <span className="font-semibold text-blue-600">23,451 req/h</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">/dashboard</span>
                          <span className="font-semibold text-green-600">18,234 req/h</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">/api/status</span>
                          <span className="font-semibold text-orange-600">12,987 req/h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Estats de Serveis Externs */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Serveis Externs</h3>
                    <button
                      onClick={() => toggleSectionExpansion('external-services')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSections.has('external-services') ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-900">PostgreSQL</div>
                          <div className="text-xs text-green-700">v14.2 - 47/100 connexions</div>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-900">Cloudflare CDN</div>
                          <div className="text-xs text-green-700">Cache hit: 94.2%</div>
                        </div>
                      </div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-yellow-200 rounded bg-yellow-50">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-yellow-600" />
                        <div>
                          <div className="font-medium text-yellow-900">SendGrid API</div>
                          <div className="text-xs text-yellow-700">Latència: 342ms</div>
                        </div>
                      </div>
                      <span className="text-sm text-yellow-600">Lent</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-red-200 rounded bg-red-50">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="font-medium text-red-900">Stripe API</div>
                          <div className="text-xs text-red-700">Timeout errors (3)</div>
                        </div>
                      </div>
                      <span className="text-sm text-red-600">Error</span>
                    </div>
                  </div>
                  {expandedSections.has('external-services') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h5 className="font-semibold text-green-900 mb-2">Serveis operatius</h5>
                          <div className="text-2xl font-bold text-green-700">8</div>
                          <div className="text-sm text-green-600">de 10 serveis</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2">Latència mitjana</h5>
                          <div className="text-2xl font-bold text-orange-700">245ms</div>
                          <div className="text-sm text-orange-600">APIs externes</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2">Incidents avui</h5>
                          <div className="text-2xl font-bold text-red-700">2</div>
                          <div className="text-sm text-red-600">Stripe i SendGrid</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Història de disponibilitat (7 dies)</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">PostgreSQL</span>
                            <span className="font-semibold text-green-600">100% uptime</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Cloudflare CDN</span>
                            <span className="font-semibold text-green-600">99.98% uptime</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">SendGrid API</span>
                            <span className="font-semibold text-yellow-600">97.2% uptime</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Stripe API</span>
                            <span className="font-semibold text-red-600">94.8% uptime</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Usuaris actius en temps real */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Usuaris Actius</h3>
                    <button
                      onClick={() => toggleSectionExpansion('active-users')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSections.has('active-users') ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-indigo-600">2,847</div>
                    <div className="text-sm text-gray-600">usuaris online ara mateix</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Catalunya</span>
                      <span className="font-medium">1,234 (43.3%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '43.3%'}}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Madrid</span>
                      <span className="font-medium">687 (24.1%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '24.1%'}}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Andalusia</span>
                      <span className="font-medium">542 (19.0%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '19.0%'}}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Altres</span>
                      <span className="font-medium">384 (13.6%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '13.6%'}}></div>
                    </div>
                  </div>
                  {expandedSections.has('active-users') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-indigo-50 rounded-lg">
                          <h5 className="font-semibold text-indigo-900 mb-2">Sessions actives</h5>
                          <div className="text-2xl font-bold text-indigo-700">3,124</div>
                          <div className="text-sm text-indigo-600">Incl. mòbil i desktop</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">Temps sessió mig</h5>
                          <div className="text-2xl font-bold text-blue-700">24 min</div>
                          <div className="text-sm text-blue-600">+8% vs setmana anterior</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Activitat per dispositiu</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Desktop</span>
                            <span className="font-semibold text-blue-600">1,642 (57.6%)</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Mòbil</span>
                            <span className="font-semibold text-green-600">1,089 (38.3%)</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Tablet</span>
                            <span className="font-semibold text-orange-600">116 (4.1%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detecció d'Anomalies */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Detecció d'Anomalies de Tràfic</h3>
                  <button
                    onClick={() => toggleSectionExpansion('anomaly-detection')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('anomaly-detection') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 border border-yellow-200 rounded bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Pic inusual</span>
                    </div>
                    <div className="text-sm text-yellow-700 mb-2">Tràfic 340% superior a la mitjana</div>
                    <div className="text-xs text-yellow-600">Detectat fa 23 min - /dashboard</div>
                  </div>
                  <div className="p-4 border border-red-200 rounded bg-red-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-900">Patró sospitós</span>
                    </div>
                    <div className="text-sm text-red-700 mb-2">Múltiples IPs amb requests similars</div>
                    <div className="text-xs text-red-600">Possible bot/scraper - 47.21.x.x</div>
                  </div>
                  <div className="p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Tràfic normal</span>
                    </div>
                    <div className="text-sm text-green-700 mb-2">Patrons dins dels paràmetres esperats</div>
                    <div className="text-xs text-green-600">Última anomalia fa 4h</div>
                  </div>
                </div>
                {expandedSections.has('anomaly-detection') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-1 text-sm">Anomalies detectades</h5>
                        <div className="text-xl font-bold text-blue-700">47</div>
                        <div className="text-xs text-blue-600">Darrera setmana</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-1 text-sm">Verdaders positius</h5>
                        <div className="text-xl font-bold text-green-700">39</div>
                        <div className="text-xs text-green-600">82.9% precisió</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-1 text-sm">Falsos positius</h5>
                        <div className="text-xl font-bold text-red-700">8</div>
                        <div className="text-xs text-red-600">17.1% error</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-1 text-sm">Temps resposta</h5>
                        <div className="text-xl font-bold text-purple-700">3.2s</div>
                        <div className="text-xs text-purple-600">Detecció automàtica</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900">Història d'anomalies (24h)</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                          <div>
                            <div className="font-medium text-red-900">Bot traffic surge</div>
                            <div className="text-sm text-red-700">47.21.x.x range - 2,341 requests/min</div>
                          </div>
                          <div className="text-sm text-red-600">Fa 23 min</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div>
                            <div className="font-medium text-yellow-900">Unusual endpoint activity</div>
                            <div className="text-sm text-yellow-700">/dashboard - 340% above baseline</div>
                          </div>
                          <div className="text-sm text-yellow-600">Fa 45 min</div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded">
                          <div>
                            <div className="font-medium text-orange-900">Response time spike</div>
                            <div className="text-sm text-orange-700">/api/reports - avg 3.2s vs 0.8s normal</div>
                          </div>
                          <div className="text-sm text-orange-600">Fa 1h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dashboard d'Errors 404/500 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Errors 404 - Pàgines No Trobades</h3>
                    <button
                      onClick={() => toggleSectionExpansion('errors-404')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSections.has('errors-404') ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/old-admin/login</span>
                      <span className="text-sm text-red-600">127 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/api/v1/users</span>
                      <span className="text-sm text-red-600">89 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/favicon.ico</span>
                      <span className="text-sm text-red-600">76 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/wp-admin</span>
                      <span className="text-sm text-red-600">45 errors</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Total 404s avui: <span className="font-semibold">423</span> (+12% vs ahir)
                  </div>
                  {expandedSections.has('errors-404') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2">Total setmana</h5>
                          <div className="text-2xl font-bold text-red-700">2,841</div>
                          <div className="text-sm text-red-600">+15% vs anterior</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2">IPs úniques</h5>
                          <div className="text-2xl font-bold text-orange-700">1,247</div>
                          <div className="text-sm text-orange-600">Possibles bots</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">URLs més freqüents</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">/robots.txt</span>
                            <span className="font-semibold text-red-600">341 errors</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-mono text-sm">/sitemap.xml</span>
                            <span className="font-semibold text-orange-600">287 errors</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Errors 500 - Errors del Servidor</h3>
                    <button
                      onClick={() => toggleSectionExpansion('errors-500')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {expandedSections.has('errors-500') ? (
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-red-200 rounded bg-red-50">
                      <span className="font-mono text-sm">/api/reports/generate</span>
                      <span className="text-sm text-red-600">23 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/admin/export</span>
                      <span className="text-sm text-red-600">12 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/api/upload</span>
                      <span className="text-sm text-red-600">8 errors</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <span className="font-mono text-sm">/dashboard/stats</span>
                      <span className="text-sm text-red-600">5 errors</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Total 500s avui: <span className="font-semibold text-red-600">48</span> (+180% vs ahir)
                  </div>
                  {expandedSections.has('errors-500') && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h5 className="font-semibold text-red-900 mb-2">Total setmana</h5>
                          <div className="text-2xl font-bold text-red-700">312</div>
                          <div className="text-sm text-red-600">+85% crític</div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h5 className="font-semibold text-orange-900 mb-2">MTTR promig</h5>
                          <div className="text-2xl font-bold text-orange-700">18 min</div>
                          <div className="text-sm text-orange-600">Mean time to repair</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900">Errors per component</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Report Generator</span>
                            <span className="font-semibold text-red-600">23 (47.9%)</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">File Upload Service</span>
                            <span className="font-semibold text-orange-600">12 (25.0%)</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">Database Connection</span>
                            <span className="font-semibold text-yellow-600">8 (16.7%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Monitorització de Processos Crítics */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Processos Crítics del Sistema</h3>
                  <button
                    onClick={() => toggleSectionExpansion('critical-processes')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('critical-processes') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">nginx</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-green-700">PID: 1234</div>
                    <div className="text-xs text-green-600">CPU: 2.1% | RAM: 45MB</div>
                  </div>
                  <div className="p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">postgres</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-green-700">PID: 5678</div>
                    <div className="text-xs text-green-600">CPU: 12.3% | RAM: 256MB</div>
                  </div>
                  <div className="p-4 border border-yellow-200 rounded bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-yellow-900">redis</span>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-yellow-700">PID: 9101</div>
                    <div className="text-xs text-yellow-600">CPU: 8.7% | RAM: 89MB</div>
                  </div>
                  <div className="p-4 border border-red-200 rounded bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-red-900">backup-service</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-red-700">No response</div>
                    <div className="text-xs text-red-600">Last seen: 2h ago</div>
                  </div>
                </div>
                {expandedSections.has('critical-processes') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Processos actius</h5>
                        <div className="text-2xl font-bold text-green-700">127</div>
                        <div className="text-sm text-green-600">de 135 configurats</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <h5 className="font-semibold text-red-900 mb-2">Processos fallits</h5>
                        <div className="text-2xl font-bold text-red-700">3</div>
                        <div className="text-sm text-red-600">Necessiten atenció</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">CPU total</h5>
                        <div className="text-2xl font-bold text-blue-700">34.2%</div>
                        <div className="text-sm text-blue-600">Tots els processos</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-semibold text-gray-900">Processos amb més recursos</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">node server.js</span>
                          <span className="font-semibold text-red-600">CPU: 23.4% | RAM: 2.1GB</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">postgres</span>
                          <span className="font-semibold text-orange-600">CPU: 12.3% | RAM: 256MB</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-mono text-sm">redis-server</span>
                          <span className="font-semibold text-yellow-600">CPU: 8.7% | RAM: 89MB</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h5 className="font-semibold text-yellow-900 mb-2">Acció recomanada</h5>
                      <p className="text-sm text-yellow-800">El servei backup-service no respon. És recomanable reiniciar-lo o verificar la configuració.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="space-y-6">
              {/* Certificados SSL */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificats SSL</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div>
                        <div className="font-medium text-green-900">lapublica.cat</div>
                        <div className="text-sm text-green-700">Vàlid fins 15/03/2025</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div>
                        <div className="font-medium text-green-900">api.lapublica.cat</div>
                        <div className="text-sm text-green-700">Vàlid fins 22/04/2025</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-yellow-200 rounded bg-yellow-50">
                      <div>
                        <div className="font-medium text-yellow-900">admin.lapublica.cat</div>
                        <div className="text-sm text-yellow-700">Vàlid fins 05/01/2025</div>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerabilitats</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">0</div>
                      <div className="text-sm text-green-700">Crítiques</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-yellow-600">3</div>
                        <div className="text-xs text-yellow-700">Mitjanes</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-blue-700">Baixes</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-600">47</div>
                        <div className="text-xs text-gray-700">Info</div>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-600 mb-2">Última escaneig:</div>
                      <div className="text-sm font-medium">Avui 03:00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intentos de intrusión */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intents d'Intrusió</h3>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">23</div>
                    <div className="text-sm text-gray-600">Últimes 24h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-gray-600">Aquesta setmana</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Bloquejats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">8</div>
                    <div className="text-sm text-gray-600">IPs bannades</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Intents recents:</div>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-red-900">Força bruta SSH</div>
                        <div className="text-sm text-red-700">IP: 192.168.1.45 - 47 intents</div>
                      </div>
                      <div className="text-xs text-red-600">Fa 3 min</div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-yellow-900">SQL Injection</div>
                        <div className="text-sm text-yellow-700">Endpoint: /api/users - Bloquejat</div>
                      </div>
                      <div className="text-xs text-yellow-600">Fa 15 min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestió d'Accessos */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Gestió d'Accessos</h3>
                  <button
                    onClick={() => toggleSectionExpansion('access-management')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('access-management') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Sessions Actives</h4>
                    <div className="text-2xl font-bold text-blue-700">47</div>
                    <div className="text-sm text-blue-600">Usuaris connectats</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">2FA Activat</h4>
                    <div className="text-2xl font-bold text-green-700">89%</div>
                    <div className="text-sm text-green-600">Dels administradors</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Polítiques Actives</h4>
                    <div className="text-2xl font-bold text-purple-700">12</div>
                    <div className="text-sm text-purple-600">Regles de contrasenyes</div>
                  </div>
                </div>
                {expandedSections.has('access-management') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Sessions per Ubicació</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium">Barcelona, ES</span>
                            </div>
                            <span className="text-sm text-gray-600">23 sessions</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium">Madrid, ES</span>
                            </div>
                            <span className="text-sm text-gray-600">12 sessions</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm font-medium">Valencia, ES</span>
                            </div>
                            <span className="text-sm text-gray-600">8 sessions</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-900">London, UK</span>
                            </div>
                            <span className="text-sm text-red-600">1 session (sospitosa)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Configuració de Polítiques</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Longitud mínima</span>
                              <span className="text-sm text-green-600">8 caràcters</span>
                            </div>
                            <div className="text-xs text-gray-600">Inclou majúscules, minúscules i números</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Expiració</span>
                              <span className="text-sm text-orange-600">90 dies</span>
                            </div>
                            <div className="text-xs text-gray-600">Notificació 7 dies abans</div>
                          </div>
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-green-900">2FA Obligatori</span>
                              <span className="text-sm text-green-600">Actiu</span>
                            </div>
                            <div className="text-xs text-green-700">Per a rols administratius</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Auditoria i Compliance */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Auditoria i Compliance</h3>
                  <button
                    onClick={() => toggleSectionExpansion('audit-compliance')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('audit-compliance') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2,847</div>
                    <div className="text-sm text-gray-600">Logs registrats avui</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Compliance GDPR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-600">Reportes LOPD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-gray-600">Accions crítiques</div>
                  </div>
                </div>
                {expandedSections.has('audit-compliance') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Accions Administratives Recents</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-red-900">Eliminació usuari</span>
                              <span className="text-xs text-red-600">Fa 2h</span>
                            </div>
                            <div className="text-sm text-red-700">Admin: marc.soler | Usuari: test.user@company.com</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">Canvi de permisos</span>
                              <span className="text-xs text-yellow-600">Fa 4h</span>
                            </div>
                            <div className="text-sm text-yellow-700">Admin: anna.vidal | Grup: Desenvolupadors</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-blue-900">Accés base de dades</span>
                              <span className="text-xs text-blue-600">Fa 6h</span>
                            </div>
                            <div className="text-sm text-blue-700">Admin: system.backup | Taula: user_sessions</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Compliance Status</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-900">GDPR</span>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-sm text-green-700">Reglament General de Protecció de Dades</div>
                            <div className="text-xs text-green-600">Darrera auditoria: 15/11/2024</div>
                          </div>
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-900">LOPD</span>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-sm text-green-700">Llei Orgànica de Protecció de Dades</div>
                            <div className="text-xs text-green-600">Informe generat: 20/11/2024</div>
                          </div>
                          <div className="p-3 border border-yellow-200 rounded bg-yellow-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-yellow-900">ISO 27001</span>
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="text-sm text-yellow-700">Certificació en procés</div>
                            <div className="text-xs text-yellow-600">Venciment previst: Q2 2025</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Anàlisi d'Amenaces */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Anàlisi d'Amenaces</h3>
                  <button
                    onClick={() => toggleSectionExpansion('threat-analysis')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('threat-analysis') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-red-700">Amenaces crítiques</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-yellow-700">Comportaments anòmals</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">847</div>
                    <div className="text-sm text-orange-700">Tràfic sospitós</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-purple-700">IPs bloquejades</div>
                  </div>
                </div>
                {expandedSections.has('threat-analysis') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Detecció de Comportaments Anòmals</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="font-medium text-red-900">Escalada de privilegis</span>
                            </div>
                            <div className="text-sm text-red-700">Usuari: dev.junior@company.com</div>
                            <div className="text-xs text-red-600">Intent d'accés a carpetes d'admin - Detectat fa 5 min</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-orange-900">Activitat inhabitua</span>
                            </div>
                            <div className="text-sm text-orange-700">Usuari: marketing.manager@company.com</div>
                            <div className="text-xs text-orange-600">289 peticions API en 10 min - Possible bot</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-900">Descà rrega massiva</span>
                            </div>
                            <div className="text-sm text-yellow-700">IP: 94.134.x.x - Barcelona, ES</div>
                            <div className="text-xs text-yellow-600">2.3 GB descarregats en 30 min</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Tràfic Sospitós per Origen Geogràfic</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-red-900">Rússia (RU)</span>
                              <span className="text-sm text-red-600">234 intents</span>
                            </div>
                            <div className="text-xs text-red-600">Blocat automàticament - Força bruta SSH</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-orange-900">Xina (CN)</span>
                              <span className="text-sm text-orange-600">156 intents</span>
                            </div>
                            <div className="text-xs text-orange-600">Port scanning - Monitoritzat</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">Brasil (BR)</span>
                              <span className="text-sm text-yellow-600">89 intents</span>
                            </div>
                            <div className="text-xs text-yellow-600">Requests malformats - Rate limited</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-blue-900">Regne Unit (UK)</span>
                              <span className="text-sm text-blue-600">23 intents</span>
                            </div>
                            <div className="text-xs text-blue-600">Sessions inusuals - Investigant</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gestió d'Incidents */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Gestió d'Incidents</h3>
                  <button
                    onClick={() => toggleSectionExpansion('incident-management')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('incident-management') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-600">Incidents oberts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-gray-600">En investigació</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-gray-600">Resolts setmana</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.4h</div>
                    <div className="text-sm text-gray-600">MTTR promig</div>
                  </div>
                </div>
                {expandedSections.has('incident-management') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Incidents Actius</h5>
                        <div className="space-y-3">
                          <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-red-900">INC-001</span>
                              <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs">CRÍTIC</span>
                            </div>
                            <div className="text-sm text-red-700 mb-2">Possible intrusió via SSH</div>
                            <div className="flex justify-between text-xs">
                              <span className="text-red-600">Assignat: Equip SOC</span>
                              <span className="text-red-600">Obert fa 15 min</span>
                            </div>
                          </div>
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-yellow-900">INC-002</span>
                              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">ALT</span>
                            </div>
                            <div className="text-sm text-yellow-700 mb-2">Anomalia en tràfic de red</div>
                            <div className="flex justify-between text-xs">
                              <span className="text-yellow-600">Assignat: marc.soler</span>
                              <span className="text-yellow-600">Obert fa 2h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Workflow de Resposta</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Detecció</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-5">Alertes automàtiques i monitorització</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Classificació</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-5">Anàlisi inicial i assignació de gravetat</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Resposta</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-5">Containment i mitigació</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-gray-900">Resolució</span>
                            </div>
                            <div className="text-sm text-gray-600 ml-5">Correcció i documentació</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuració de Firewall */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuració de Firewall</h3>
                  <button
                    onClick={() => toggleSectionExpansion('firewall-config')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('firewall-config') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">247</div>
                    <div className="text-sm text-gray-600">Regles actives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89</div>
                    <div className="text-sm text-gray-600">IPs autoritzades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">156</div>
                    <div className="text-sm text-gray-600">IPs bloquejades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1000</div>
                    <div className="text-sm text-gray-600">Rate limit/min</div>
                  </div>
                </div>
                {expandedSections.has('firewall-config') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Regles Principals</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">ALLOW HTTP/HTTPS</span>
                              <span className="text-xs text-green-600">Activa</span>
                            </div>
                            <div className="text-xs text-green-700">Ports 80, 443 - Tràfic web</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-blue-900">ALLOW SSH</span>
                              <span className="text-xs text-blue-600">Restringida</span>
                            </div>
                            <div className="text-xs text-blue-700">Port 22 - Només IPs autoritzades</div>
                          </div>
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-red-900">BLOCK ALL</span>
                              <span className="text-xs text-red-600">Default</span>
                            </div>
                            <div className="text-xs text-red-700">Bloqueig per defecte</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Llistes Blanques</h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-mono text-sm">10.0.0.0/8</div>
                            <div className="text-xs text-gray-600">Xarxa interna</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-mono text-sm">192.168.1.0/24</div>
                            <div className="text-xs text-gray-600">Oficina principal</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-mono text-sm">85.62.x.x</div>
                            <div className="text-xs text-gray-600">CDN Cloudflare</div>
                          </div>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-3 mt-4">Llistes Negres</h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <div className="font-mono text-sm">47.21.x.x</div>
                            <div className="text-xs text-red-600">Bot maliciós</div>
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <div className="font-mono text-sm">94.142.x.x</div>
                            <div className="text-xs text-red-600">Força bruta</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Rate Limiting</h5>
                        <div className="space-y-2">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">/api/*</span>
                              <span className="text-sm text-blue-600">100/min</span>
                            </div>
                            <div className="text-xs text-gray-600">Endpoints API generals</div>
                          </div>
                          <div className="p-3 border border-yellow-200 rounded bg-yellow-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">/api/auth</span>
                              <span className="text-sm text-yellow-600">10/min</span>
                            </div>
                            <div className="text-xs text-yellow-700">Autenticació estricta</div>
                          </div>
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">/static/*</span>
                              <span className="text-sm text-green-600">1000/min</span>
                            </div>
                            <div className="text-xs text-green-700">Recursos stàtics</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alertes Automà tiques */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Alertes Automàtiques</h3>
                  <button
                    onClick={() => toggleSectionExpansion('automated-alerts')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('automated-alerts') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-900">Escalada de Privilegis</h4>
                    </div>
                    <div className="text-2xl font-bold text-red-700 mb-2">3</div>
                    <div className="text-sm text-red-600">Intents detectats avui</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">APIs Sensibles</h4>
                    </div>
                    <div className="text-2xl font-bold text-purple-700 mb-2">47</div>
                    <div className="text-sm text-purple-600">Accessos monitoritzats</div>
                  </div>
                </div>
                {expandedSections.has('automated-alerts') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Escalada de Privilegis</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-red-900">ALERTA CRÍTICA</span>
                              <span className="text-xs text-red-600">Fa 5 min</span>
                            </div>
                            <div className="text-sm text-red-700 mb-1">Usuari 'dev.junior' intent accés admin</div>
                            <div className="text-xs text-red-600">Acció: Session suspesa, admin notificat</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-orange-900">SOSPITÓS</span>
                              <span className="text-xs text-orange-600">Fa 1h</span>
                            </div>
                            <div className="text-sm text-orange-700 mb-1">Múltiples canvis de permisos</div>
                            <div className="text-xs text-orange-600">Usuari: system.admin - Investigant</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Monitorització d'APIs Sensibles</h5>
                        <div className="space-y-2">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">/api/admin/users</span>
                              <span className="text-sm text-green-600">Normal</span>
                            </div>
                            <div className="text-xs text-gray-600">12 accessos avui - Dins dels límits</div>
                          </div>
                          <div className="p-3 border border-yellow-200 rounded bg-yellow-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">/api/payments</span>
                              <span className="text-sm text-yellow-600">Monitoritzat</span>
                            </div>
                            <div className="text-xs text-yellow-700">23 accessos - Pic inusual detectat</div>
                          </div>
                          <div className="p-3 border border-purple-200 rounded bg-purple-50">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-purple-900">/api/database/backup</span>
                              <span className="text-sm text-purple-600">Crític</span>
                            </div>
                            <div className="text-xs text-purple-700">3 accessos - Tots justificats</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-6">
              {/* Estado general de backups */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
                    <div className="text-sm font-semibold text-gray-900">Base de Dades</div>
                    <div className="text-xs text-gray-600 mt-1">Fa 2h</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
                    <div className="text-sm font-semibold text-gray-900">Fitxers</div>
                    <div className="text-xs text-gray-600 mt-1">Fa 4h</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-200 bg-yellow-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">⚠</div>
                    <div className="text-sm font-semibold text-yellow-900">Configuracions</div>
                    <div className="text-xs text-yellow-700 mt-1">Pendent</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
                    <div className="text-sm font-semibold text-gray-900">Logs</div>
                    <div className="text-xs text-gray-600 mt-1">Fa 1h</div>
                  </div>
                </div>
              </div>

              {/* Detalles de backup */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estat Còpies de Seguretat</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Base de Dades PostgreSQL</div>
                        <div className="text-sm text-green-700">Còpia incremental diària</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-900">2.4 GB</div>
                      <div className="text-xs text-green-700">Avui 02:00</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-green-200 rounded bg-green-50">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Fitxers d'Usuari</div>
                        <div className="text-sm text-green-700">Sincronització en temps real</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-900">847 GB</div>
                      <div className="text-xs text-green-700">Avui 06:30</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-yellow-200 rounded bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-900">Configuracions Sistema</div>
                        <div className="text-sm text-yellow-700">Còpia setmanal</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-900">45 MB</div>
                      <div className="text-xs text-yellow-700">Fa 3 dies</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan de recuperación */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pla de Recuperació</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">RTO (Recovery Time Objective)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base de dades</span>
                        <span className="text-sm font-medium">15 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Aplicació web</span>
                        <span className="text-sm font-medium">30 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fitxers usuari</span>
                        <span className="text-sm font-medium">2 h</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">RPO (Recovery Point Objective)</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base de dades</span>
                        <span className="text-sm font-medium">5 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Aplicació web</span>
                        <span className="text-sm font-medium">1 h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fitxers usuari</span>
                        <span className="text-sm font-medium">24 h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testing i Verificació */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Testing i Verificació</h3>
                  <button
                    onClick={() => toggleSectionExpansion('backup-testing')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('backup-testing') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Integritat Verificada</h4>
                    <div className="text-2xl font-bold text-green-700">98.7%</div>
                    <div className="text-sm text-green-600">Últimes 30 còpies</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Tests Restauració</h4>
                    <div className="text-2xl font-bold text-blue-700">15</div>
                    <div className="text-sm text-blue-600">Programats mensuals</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Únim Test</h4>
                    <div className="text-2xl font-bold text-purple-700">100%</div>
                    <div className="text-sm text-purple-600">Ahir 03:00 - Èxit</div>
                  </div>
                </div>
                {expandedSections.has('backup-testing') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Verificació Automàtica d'Integritat</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">Base de Dades</span>
                              <span className="text-sm text-green-600">Verificat</span>
                            </div>
                            <div className="text-xs text-green-700">MD5: a1b2c3... | Avui 02:15</div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">Fitxers Sistema</span>
                              <span className="text-sm text-green-600">Verificat</span>
                            </div>
                            <div className="text-xs text-green-700">SHA256: d4e5f6... | Avui 02:30</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">Configuracions</span>
                              <span className="text-sm text-yellow-600">Pendent</span>
                            </div>
                            <div className="text-xs text-yellow-700">Programat per avui 18:00</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Tests de Restauració Programats</h5>
                        <div className="space-y-2">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">DB Full Restore</span>
                              <span className="text-sm text-blue-600">Mensual</span>
                            </div>
                            <div className="text-xs text-gray-600">Pròxim: 1 Dec 2024 - Entorn test</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">Files Restore</span>
                              <span className="text-sm text-green-600">Setmanal</span>
                            </div>
                            <div className="text-xs text-gray-600">Pròxim: Diumenge 03:00</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">Config Restore</span>
                              <span className="text-sm text-orange-600">Trimestral</span>
                            </div>
                            <div className="text-xs text-gray-600">Pròxim: 15 Jan 2025</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gestió Avançada */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Gestió Avançada</h3>
                  <button
                    onClick={() => toggleSectionExpansion('advanced-management')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('advanced-management') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-gray-600">Còpies retingudes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">73%</div>
                    <div className="text-sm text-gray-600">Taxa compressió</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-sm text-gray-600">Destins configurats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">AES-256</div>
                    <div className="text-sm text-gray-600">Xifrat actiu</div>
                  </div>
                </div>
                {expandedSections.has('advanced-management') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Polítiques de Retenció</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-green-900">Diaris</span>
                              <span className="text-sm text-green-600">30 dies</span>
                            </div>
                            <div className="text-xs text-green-700">Còpies incrementals - Expiren automàticament</div>
                          </div>
                          <div className="p-3 border border-blue-200 rounded bg-blue-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-blue-900">Setmanals</span>
                              <span className="text-sm text-blue-600">12 setmanes</span>
                            </div>
                            <div className="text-xs text-blue-700">Còpies completes - Diumenges</div>
                          </div>
                          <div className="p-3 border border-purple-200 rounded bg-purple-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-purple-900">Mensuals</span>
                              <span className="text-sm text-purple-600">24 mesos</span>
                            </div>
                            <div className="text-xs text-purple-700">Còpies d'arxiu - Primer de mes</div>
                          </div>
                          <div className="p-3 border border-orange-200 rounded bg-orange-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-orange-900">Anuals</span>
                              <span className="text-sm text-orange-600">7 anys</span>
                            </div>
                            <div className="text-xs text-orange-700">Còpies compliance - 1 Gener</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Tipus de Còpies</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Incrementals</span>
                              <span className="text-sm text-blue-600">Diàries</span>
                            </div>
                            <div className="text-xs text-gray-600">Només canvis des de l'última còpia</div>
                            <div className="mt-1">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div className="bg-blue-500 h-1 rounded-full" style={{width: '85%'}}></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">85% de les còpies</div>
                            </div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Completes</span>
                              <span className="text-sm text-green-600">Setmanals</span>
                            </div>
                            <div className="text-xs text-gray-600">Còpia completa del sistema</div>
                            <div className="mt-1">
                              <div className="w-full bg-gray-200 rounded-full h-1">
                                <div className="bg-green-500 h-1 rounded-full" style={{width: '15%'}}></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">15% de les còpies</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Múltiples Destins</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-900">Local NAS</span>
                            </div>
                            <div className="text-xs text-green-700">RAID-6 - 12TB disponibles</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Globe className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">AWS S3</span>
                            </div>
                            <div className="text-xs text-blue-700">eu-west-1 - Glacier Deep Archive</div>
                          </div>
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Server className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-purple-900">Offsite</span>
                            </div>
                            <div className="text-xs text-purple-700">Datacenter BCN-2</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-orange-900">Azure Vault</span>
                            </div>
                            <div className="text-xs text-orange-700">West Europe - Encrypted</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Alertes i Monitorització */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Alertes i Monitorització</h3>
                  <button
                    onClick={() => toggleSectionExpansion('backup-alerts')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('backup-alerts') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-700">Fallades actives</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-blue-700">Espai disponible</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">2.4TB</div>
                    <div className="text-sm text-purple-700">Transferit avui</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">99.8%</div>
                    <div className="text-sm text-orange-700">Disponibilitat</div>
                  </div>
                </div>
                {expandedSections.has('backup-alerts') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Notificacions Configurades</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="font-medium text-red-900">Fallada de Còpia</span>
                            </div>
                            <div className="text-xs text-red-700">Email immediat + SMS + Slack</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-900">Espai Insuficient</span>
                            </div>
                            <div className="text-xs text-yellow-700">Alerta quan &lt; 15% lliure</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <span className="font-medium text-orange-900">Integritat Fallida</span>
                            </div>
                            <div className="text-xs text-orange-700">Verificació MD5/SHA256 incorrecta</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Còpia Exitosa</span>
                            </div>
                            <div className="text-xs text-blue-700">Informe diari a les 06:00</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Monitorització d'Espai</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Local NAS</span>
                              <span className="text-sm text-green-600">12.8TB / 15TB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">85% utilitzat</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">AWS S3</span>
                              <span className="text-sm text-blue-600">47.2TB utilitzats</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '23%'}}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Il·limitat - Facturació per ús</div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Azure Vault</span>
                              <span className="text-sm text-purple-600">23.1TB / 50TB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{width: '46%'}}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">46% utilitzat</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recuperació Avançada */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recuperació Avançada</h3>
                  <button
                    onClick={() => toggleSectionExpansion('advanced-recovery')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('advanced-recovery') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">15min</div>
                    <div className="text-sm text-gray-600">RTO promig</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">5min</div>
                    <div className="text-sm text-gray-600">RPO promig</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">247</div>
                    <div className="text-sm text-gray-600">Punts de restauració</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-gray-600">Simulacions actives</div>
                  </div>
                </div>
                {expandedSections.has('advanced-recovery') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Point-in-Time Recovery</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Base de Dades</span>
                              <span className="text-sm text-green-600">Disponible</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">Restauració a qualsevol moment</div>
                            <div className="flex justify-between text-xs">
                              <span>Rang:</span>
                              <span className="font-mono">30 dies</span>
                            </div>
                          </div>
                          <div className="p-3 border border-gray-200 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">Fitxers Sistema</span>
                              <span className="text-sm text-blue-600">Snapshots</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">Restauració per snapshots</div>
                            <div className="flex justify-between text-xs">
                              <span>Freqüència:</span>
                              <span className="font-mono">Cada 4h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Restauració Selectiva</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Database className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Per taula/esquema</span>
                            </div>
                            <div className="text-xs text-blue-700">Restaurar taules específiques sense afectar altres</div>
                          </div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <HardDrive className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-900">Per directori/fitxer</span>
                            </div>
                            <div className="text-xs text-green-700">Recuperar fitxers individuals o carpetes</div>
                          </div>
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Settings className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-purple-900">Per configuració</span>
                            </div>
                            <div className="text-xs text-purple-700">Restaurar configs específiques del sistema</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Simulació sense Impacte</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">Entorn Sandbox</span>
                              <span className="text-sm text-green-600">Actiu</span>
                            </div>
                            <div className="text-xs text-green-700">VM aïllada per proves de restauració</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-blue-900">Test Automatitzat</span>
                              <span className="text-sm text-blue-600">Setmanal</span>
                            </div>
                            <div className="text-xs text-blue-700">Verificació automàtica d'integritat</div>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-orange-900">Informe Detallat</span>
                              <span className="text-sm text-orange-600">Generat</span>
                            </div>
                            <div className="text-xs text-orange-700">Resultats i mètriques per cada test</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Compliance i Auditoria */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Compliance i Auditoria</h3>
                  <button
                    onClick={() => toggleSectionExpansion('backup-compliance')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections.has('backup-compliance') ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Logs registrats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-gray-600">Restauracions exitoses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-sm text-gray-600">Reportes d'auditoria</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Compliance GDPR</div>
                  </div>
                </div>
                {expandedSections.has('backup-compliance') && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Logs d'Accés Recent</h5>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-green-900">Restauració exitosa</span>
                              <span className="text-xs text-green-600">Fa 2h</span>
                            </div>
                            <div className="text-sm text-green-700 mb-1">Admin: marc.soler</div>
                            <div className="text-xs text-green-600">Taula 'users' - Punt: 28/11/2024 14:30</div>
                          </div>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-blue-900">Test de restauració</span>
                              <span className="text-xs text-blue-600">Ahir</span>
                            </div>
                            <div className="text-sm text-blue-700 mb-1">Automàtic: system.test</div>
                            <div className="text-xs text-blue-600">Entorn sandbox - Verificació setmanal</div>
                          </div>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-yellow-900">Accés còpies</span>
                              <span className="text-xs text-yellow-600">Fa 3 dies</span>
                            </div>
                            <div className="text-sm text-yellow-700 mb-1">Admin: anna.vidal</div>
                            <div className="text-xs text-yellow-600">Visualització catàleg - Sols lectura</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Reportes d'Auditoria</h5>
                        <div className="space-y-3">
                          <div className="p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-green-900">Informe Mensual</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-sm text-green-700 mb-1">Novembre 2024</div>
                            <div className="text-xs text-green-600">247 còpies · 23 restauracions · 0 fallades</div>
                          </div>
                          <div className="p-3 border border-blue-200 rounded bg-blue-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-blue-900">Compliance GDPR</span>
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-sm text-blue-700 mb-1">Trimestre Q4 2024</div>
                            <div className="text-xs text-blue-600">Dades personals xifrades i retenció complerta</div>
                          </div>
                          <div className="p-3 border border-purple-200 rounded bg-purple-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-purple-900">Auditoria Externa</span>
                              <CheckCircle className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="text-sm text-purple-700 mb-1">Certificació ISO 27001</div>
                            <div className="text-xs text-purple-600">Aprovada: 15/10/2024</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h6 className="font-semibold text-gray-900 mb-2">Historial de Restauracions</h6>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 font-medium">Data</th>
                              <th className="text-left p-2 font-medium">Tipus</th>
                              <th className="text-left p-2 font-medium">Objectiu</th>
                              <th className="text-left p-2 font-medium">Admin</th>
                              <th className="text-left p-2 font-medium">Estat</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            <tr className="border-b">
                              <td className="p-2">28/11/2024 16:30</td>
                              <td className="p-2">Selectiva</td>
                              <td className="p-2">Taula users</td>
                              <td className="p-2">marc.soler</td>
                              <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded">Exitosa</span></td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">27/11/2024 03:00</td>
                              <td className="p-2">Test</td>
                              <td className="p-2">Full DB</td>
                              <td className="p-2">system.test</td>
                              <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded">Exitosa</span></td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">23/11/2024 11:45</td>
                              <td className="p-2">Completa</td>
                              <td className="p-2">Sistema</td>
                              <td className="p-2">anna.vidal</td>
                              <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded">Exitosa</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'infraestructura' && (
            <div className="space-y-6">
              {/* Gestión de servidores */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestió de Servidors</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Servidor</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Tipus</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Estat</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">CPU</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">RAM</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Disc</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-900">Accions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">web-01.lapublica.cat</td>
                        <td className="p-3 text-sm text-gray-600">Web Server</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Online</span>
                        </td>
                        <td className="p-3 text-sm">23%</td>
                        <td className="p-3 text-sm">67%</td>
                        <td className="p-3 text-sm">45%</td>
                        <td className="p-3">
                          <button className="text-indigo-600 hover:text-indigo-800 mr-3">Gestionar</button>
                          <button className="text-red-600 hover:text-red-800">Reiniciar</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">db-01.lapublica.cat</td>
                        <td className="p-3 text-sm text-gray-600">Database</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Online</span>
                        </td>
                        <td className="p-3 text-sm">12%</td>
                        <td className="p-3 text-sm">78%</td>
                        <td className="p-3 text-sm">62%</td>
                        <td className="p-3">
                          <button className="text-indigo-600 hover:text-indigo-800 mr-3">Gestionar</button>
                          <button className="text-red-600 hover:text-red-800">Reiniciar</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">api-01.lapublica.cat</td>
                        <td className="p-3 text-sm text-gray-600">API Gateway</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Degradat</span>
                        </td>
                        <td className="p-3 text-sm">87%</td>
                        <td className="p-3 text-sm">91%</td>
                        <td className="p-3 text-sm">34%</td>
                        <td className="p-3">
                          <button className="text-indigo-600 hover:text-indigo-800 mr-3">Gestionar</button>
                          <button className="text-red-600 hover:text-red-800">Reiniciar</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APIs y servicios */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">APIs Externes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div>
                        <div className="font-medium text-green-900">Payment API</div>
                        <div className="text-sm text-green-700">Stripe Connect</div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                      <div>
                        <div className="font-medium text-green-900">Email Service</div>
                        <div className="text-sm text-green-700">SendGrid</div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-yellow-200 rounded bg-yellow-50">
                      <div>
                        <div className="font-medium text-yellow-900">SMS Service</div>
                        <div className="text-sm text-yellow-700">Twilio - Rate limited</div>
                      </div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos Tècnics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Marc Amador</div>
                        <div className="text-sm text-gray-600">Admin de sistema</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Root</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Anna Puig</div>
                        <div className="text-sm text-gray-600">DevOps</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Sudo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Joan Martínez</div>
                        <div className="text-sm text-gray-600">Developer</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Deploy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Maria López</div>
                        <div className="text-sm text-gray-600">QA</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Herramientas de infraestructura */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Eines d'Infraestructura</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                    <Terminal className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">SSH Manager</div>
                    <div className="text-sm text-gray-600">Connexions segures</div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                    <Monitor className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Monitoring</div>
                    <div className="text-sm text-gray-600">Grafana + Prometheus</div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                    <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <div className="font-medium text-gray-900">Docker</div>
                    <div className="text-sm text-gray-600">Gestió contenidors</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'repositori' && (
            <div className="space-y-6">
              {/* Biblioteca de Components */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biblioteca de Components</h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Autenticació</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">OAuth2 Provider</span>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">v2.1</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">JWT Middleware</span>
                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">v1.5</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">2FA Component</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">v3.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Comentaris</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Thread System</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">v2.3</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Moderation Kit</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">v1.8</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700">Rich Editor</span>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">v4.1</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Facturació</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-700">Stripe Gateway</span>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">v2.5</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-700">Invoice Gen</span>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">v1.9</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-700">Tax Calculator</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">v3.2</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-900">Dashboards</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-700">Analytics Charts</span>
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">v2.8</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-700">Data Tables</span>
                        <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">v1.7</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-700">KPI Widgets</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">v4.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-600">Total: 47 components disponibles</span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                    Explorar Tot
                  </button>
                </div>
              </div>

              {/* Marketplace Intern */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Intern</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">E-commerce Suite</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Estable</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Suite completa per comerç electrònic amb carret, pagaments i inventari</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Versió 3.2.1</span>
                      <span className="text-gray-500">47 instal·lacions</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(4.8)</span>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                      Instal·lar
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">CRM Lite</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Nou</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Gestió de clients simplificada amb seguiment de leads i vendes</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Versió 1.0.5</span>
                      <span className="text-gray-500">12 instal·lacions</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                      </div>
                      <span className="text-xs text-gray-500">(4.2)</span>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                      Instal·lar
                    </button>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Blog Engine</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Beta</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Sistema de blog amb editor avançat i gestió de continguts</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Versió 2.0.0-beta</span>
                      <span className="text-gray-500">3 instal·lacions</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-gray-300" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(3.8)</span>
                    </div>
                    <button className="w-full mt-3 bg-yellow-600 text-white py-2 px-4 rounded text-sm hover:bg-yellow-700 transition-colors">
                      Provar Beta
                    </button>
                  </div>
                </div>
              </div>

              {/* Templates d'Aplicacions */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates d'Aplicacions</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Templates per Empreses</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Corporate Website</div>
                          <div className="text-sm text-gray-600">Pàgina corporativa amb CMS</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">E-commerce Store</div>
                          <div className="text-sm text-gray-600">Botiga online completa</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">SaaS Platform</div>
                          <div className="text-sm text-gray-600">Plataforma de servei</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Templates Especialitzats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Restaurant Menu</div>
                          <div className="text-sm text-gray-600">Carta digital interactiva</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Portfolio Creative</div>
                          <div className="text-sm text-gray-600">Portfolio per creatius</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Booking System</div>
                          <div className="text-sm text-gray-600">Sistema de reserves</div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">Usar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Automàtic */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Automàtic</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded">
                    <div className="text-2xl font-bold text-green-600 mb-1">23</div>
                    <div className="text-sm text-green-700">Deployments avui</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded">
                    <div className="text-2xl font-bold text-blue-600 mb-1">98.5%</div>
                    <div className="text-sm text-blue-700">Taxa d'èxit</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded">
                    <div className="text-2xl font-bold text-orange-600 mb-1">4.2min</div>
                    <div className="text-sm text-orange-700">Temps mitjà</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Scripts d'Instal·lació</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Disponibles</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">WordPress + WooCommerce</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Next.js + Stripe</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Laravel + Vue.js</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Django + React</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Configuració Automàtica</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">SSL Certificates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Database Setup</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Security Headers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">Monitoring</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentació Tècnica */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentació Tècnica</h3>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">APIs</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">REST API v2</div>
                        <div className="text-sm text-gray-600">Documentació completa</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">GraphQL API</div>
                        <div className="text-sm text-gray-600">Schema i queries</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">Webhooks</div>
                        <div className="text-sm text-gray-600">Events i payloads</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Guies d'Integració</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">Quick Start</div>
                        <div className="text-sm text-gray-600">Començar en 5 minuts</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">Authentication</div>
                        <div className="text-sm text-gray-600">OAuth2 i JWT</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">Best Practices</div>
                        <div className="text-sm text-gray-600">Optimització i seguretat</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Exemples de Codi</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">JavaScript</div>
                        <div className="text-sm text-gray-600">React i Node.js</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">Python</div>
                        <div className="text-sm text-gray-600">Django i Flask</div>
                      </div>
                      <div className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <div className="font-medium text-gray-900">PHP</div>
                        <div className="text-sm text-gray-600">Laravel i WordPress</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-indigo-900">SDK Oficial</div>
                      <div className="text-sm text-indigo-700">Biblioteques per 12 llenguatges de programació</div>
                    </div>
                    <button className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition-colors">
                      Descarregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'servicios' && (
            <div className="space-y-6">
              {/* Filtros y acciones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Tots els tipus</option>
                    <option>Manteniment</option>
                    <option>Desenvolupament</option>
                    <option>Disseny</option>
                    <option>IA</option>
                    <option>Emergència</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Totes les prioritats</option>
                    <option>Crítica</option>
                    <option>Alta</option>
                    <option>Mitjana</option>
                    <option>Baixa</option>
                  </select>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Sol·licitud
                </button>
              </div>

              {/* Lista de servicios */}
              <div className="bg-white rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Empresa</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Tipus</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Descripció</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Estat</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Assignat</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Cost</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-900">Accions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {serviceRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium text-sm">{request.empresa}</div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            request.tipo === 'emergencia' ? 'bg-red-100 text-red-800' :
                            request.tipo === 'mantenimiento' ? 'bg-blue-100 text-blue-800' :
                            request.tipo === 'desarrollo' ? 'bg-purple-100 text-purple-800' :
                            request.tipo === 'diseño' ? 'bg-pink-100 text-pink-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {request.tipo}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {request.descripcion}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.estado)}`}>
                            {request.estado}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {request.asignadoA === 'IA' && <Bot className="w-4 h-4 text-purple-600" />}
                            {request.asignadoA === 'Equipo' && <Users className="w-4 h-4 text-blue-600" />}
                            {request.asignadoA === 'Mixto' && (
                              <>
                                <Bot className="w-4 h-4 text-purple-600" />
                                <Users className="w-4 h-4 text-blue-600" />
                              </>
                            )}
                            <span className="text-sm">{request.asignadoA}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-sm">€{request.coste}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-600 hover:text-indigo-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
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

          {activeTab === 'kanban' && (
            <div className="space-y-6">
              {/* Tablero Kanban - Diseño compacto */}
              <div className="grid grid-cols-5 gap-3">
                {['backlog', 'analisis', 'desarrollo', 'testing', 'produccion'].map((columna) => (
                  <div key={columna} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-2 border-b border-gray-200">
                      <h3 className="font-semibold text-sm text-gray-900 capitalize">{columna}</h3>
                      <span className="text-xs text-gray-500">
                        {internalProjects.filter(p => p.columna === columna).length} tasques
                      </span>
                    </div>
                    <div 
                      className="p-2 space-y-2 min-h-[500px] max-h-[600px] overflow-y-auto"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        // Aquí iría la lógica de drag & drop
                      }}
                    >
                      {internalProjects
                        .filter(p => p.columna === columna)
                        .map((project) => (
                          <div
                            key={project.id}
                            draggable
                            className="bg-white rounded p-2 border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                project.tipo === 'bug' ? 'bg-red-100 text-red-800' :
                                project.tipo === 'feature' ? 'bg-blue-100 text-blue-800' :
                                project.tipo === 'mejora' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.tipo}
                              </span>
                              {project.iaAsistencia && (
                                <Sparkles className="w-3 h-3 text-purple-500" />
                              )}
                            </div>
                            <h4 className="font-medium text-xs mb-1 line-clamp-2">{project.nombre}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                              <Clock className="w-3 h-3" />
                              {project.tiempoEstimado}
                            </div>
                            {project.progreso > 0 && (
                              <div className="mb-1">
                                <div className="flex items-center justify-between text-xs mb-0.5">
                                  <span className="text-gray-600">Progrés</span>
                                  <span className="font-medium">{project.progreso}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progreso}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {project.asignados.map((asignado, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[100px]"
                                  title={asignado}
                                >
                                  {asignado}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      
                      {/* Botón para añadir nueva tarea */}
                      <button className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-indigo-400 hover:bg-indigo-50 transition-colors group">
                        <Plus className="w-4 h-4 mx-auto text-gray-400 group-hover:text-indigo-600" />
                        <span className="text-xs text-gray-400 group-hover:text-indigo-600">Nova tasca</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Leyenda y acciones */}
              <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tipus:</span>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">feature</span>
                      <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">bug</span>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">mejora</span>
                      <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">seguridad</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-500">Assistència IA activa</span>
                  </div>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Nou Projecte
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ia-agents' && (
            <div className="space-y-6">
              {/* Grid de agentes */}
              <div className="grid grid-cols-2 gap-6">
                {iaAgents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Bot className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.nombre}</h3>
                          <p className="text-sm text-gray-500 capitalize">{agent.tipo}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        agent.estado === 'ocupado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.estado}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-900">{agent.tareasCompletadas}</div>
                        <div className="text-xs text-gray-500">Tasques completades</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">{agent.tasaExito}%</div>
                        <div className="text-xs text-gray-500">Taxa d'èxit</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Especialitats</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.especialidades.map((esp, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {esp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {agent.empresasActuales.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">Empreses actuals</div>
                        <div className="space-y-1">
                          {agent.empresasActuales.map((empresa, idx) => (
                            <div key={idx} className="text-sm text-gray-600">{empresa}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        Veure historial
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-700">
                        Configurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón para añadir nuevo agente */}
              <div className="flex justify-center">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Entrenar Nou Agent IA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel de Asistente IA */}
      {showAIAssistant && (
        <div className="fixed right-0 top-0 w-96 h-full bg-white border-l border-gray-200 shadow-xl z-40">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Assistent IA</h3>
                  <p className="text-xs text-purple-100">Sempre disponible per ajudar</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-180px)]">
            {/* Mensajes del chat */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 bg-purple-100 rounded-lg h-fit">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">
                      Hola! Sóc el teu assistent IA. Puc ajudar-te amb:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Analitzar i resoldre incidències
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Generar codi i documentació
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Optimitzar el rendiment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Gestionar tasques de manteniment
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sugerencias rápidas */}
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-2">Accions suggerides:</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm bg-white rounded p-2 hover:bg-gray-50 transition-colors">
                    🔍 Analitzar l'error 500 de Botiga Online BCN
                  </button>
                  <button className="w-full text-left text-sm bg-white rounded p-2 hover:bg-gray-50 transition-colors">
                    🚀 Optimitzar queries de TechCorp Solutions
                  </button>
                  <button className="w-full text-left text-sm bg-white rounded p-2 hover:bg-gray-50 transition-colors">
                    📊 Generar informe setmanal de rendiment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input de mensaje */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Pregunta'm el que necessitis..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nou Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Crear Nou Ticket</h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateTicket(); }} className="space-y-4">
              {/* Títol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Títol del Ticket *
                </label>
                <input
                  type="text"
                  value={newTicket.titulo}
                  onChange={(e) => setNewTicket({...newTicket, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Descripció */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripció *
                </label>
                <textarea
                  value={newTicket.descripcion}
                  onChange={(e) => setNewTicket({...newTicket, descripcion: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tipus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipus</label>
                  <select
                    value={newTicket.tipo}
                    onChange={(e) => setNewTicket({...newTicket, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="incidencia">Incidència</option>
                    <option value="error">Error</option>
                    <option value="peticion">Petició</option>
                    <option value="mejora">Millora</option>
                  </select>
                </div>

                {/* Origen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
                  <select
                    value={newTicket.origen}
                    onChange={(e) => setNewTicket({...newTicket, origen: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="interno">Intern</option>
                    <option value="externo">Extern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioritat</label>
                  <select
                    value={newTicket.prioridad}
                    onChange={(e) => setNewTicket({...newTicket, prioridad: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Mitjana</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departament</label>
                  <select
                    value={newTicket.departamento}
                    onChange={(e) => setNewTicket({...newTicket, departamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Desenvolupament">Desenvolupament</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="UX/UI">UX/UI</option>
                  </select>
                </div>
              </div>

              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuari *
                </label>
                <input
                  type="text"
                  value={newTicket.usuario}
                  onChange={(e) => setNewTicket({...newTicket, usuario: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Assignado a */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignat a</label>
                <select
                  value={newTicket.asignadoA}
                  onChange={(e) => setNewTicket({...newTicket, asignadoA: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="no_asignado">No assignat</option>
                  <optgroup label="Gestors Humans">
                    <option value="Marc">Marc - Senior Developer</option>
                    <option value="Anna">Anna Puig - Frontend Lead</option>
                    <option value="Joan">Joan - Backend Developer</option>
                    <option value="Maria">Maria - UX/UI Designer</option>
                    <option value="Carlos">Carlos - DevOps Engineer</option>
                  </optgroup>
                  <optgroup label="Agents IA">
                    <option value="CodeBot Pro">CodeBot Pro - Desenvolupament</option>
                    <option value="MaintainAI">MaintainAI - Manteniment</option>
                    <option value="SupportBot">SupportBot - Suport</option>
                    <option value="AnalyzerAI">AnalyzerAI - Anàlisi</option>
                  </optgroup>
                  <optgroup label="Assignació Automàtica">
                    <option value="IA">Assignació per IA (Automàtica)</option>
                  </optgroup>
                </select>
              </div>

              {/* Empresa (solo si es externo) */}
              {newTicket.origen === 'externo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={newTicket.empresa}
                    onChange={(e) => setNewTicket({...newTicket, empresa: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  disabled={!newTicket.titulo || !newTicket.descripcion || !newTicket.usuario}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}