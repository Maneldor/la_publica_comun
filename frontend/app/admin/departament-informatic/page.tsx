'use client'

import { useState, useMemo } from 'react'
import { 
  Bot, Code, Monitor, Shield, Zap, Building2, CreditCard,
  MessageSquare, AlertCircle, CheckCircle, Clock, TrendingUp,
  GitBranch, Database, Server, Cpu, HardDrive, Wifi, Globe,
  FileCode, Terminal, Bug, Wrench, Settings, Package, Sparkles,
  Brain, HeadphonesIcon, Calendar, Euro, Star, Activity,
  ChevronRight, Plus, X, Send, Upload, RefreshCw,
  Eye, Copy, AlertTriangle,
  Search, ChevronUp, ChevronDown, FileText, Key, Lock, Info, Bell,
  Play, Square
} from 'lucide-react'

// Import modular components
import Dashboard from './components/Dashboard'
import Incidencias from './components/Incidencias'
import Monitorizacion from './components/Monitorizacion'
import Seguridad from './components/Seguridad'
import Backups from './components/Backups'

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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    config: false,
    automation: false,
    scalability: false,
    networking: false,
    logs: false,
    docker: false,
    credentials: false,
    serviceConfig: false,
    costs: false,
    monitoring: false,
    testing: false,
    infrastructure: false,
    externalServices: false,
    projectCosts: false,
    optimization: false,
    alerts: false,
    projections: false,
    architecture: false,
    apiDocs: false,
    runbooks: false,
    templates: false,
    validation: false,
    'cpu-evolution': false,
    'ram-usage': false,
    'network-traffic': false,
    'alerts-config': false,
    'endpoints-monitoring': false,
    'external-services': false,
    'active-users': false,
    'anomaly-detection': false,
    'errors-404': false,
    'errors-500': false,
    'critical-processes': false,
    'access-management': false,
    'audit-compliance': false,
    'threat-analysis': false,
    'incident-management': false,
    'firewall-config': false,
    'automated-alerts': false,
    'backup-testing': false,
    'advanced-management': false,
    'backup-alerts': false,
    'advanced-recovery': false,
    'backup-compliance': false
  })

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
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
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

  // Función para filtrar tickets con memoization
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
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
  }, [tickets, ticketTypeFilter, priorityFilter, statusFilter, searchFilter])

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
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg px-3 py-2 hover:bg-white/30 transition-colors text-sm font-medium"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Dashboard Admin
                </button>
              </div>
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
            <Dashboard 
              serviceRequests={serviceRequests}
              iaAgents={iaAgents}
              expandedCards={expandedCards}
              toggleCardExpansion={toggleCardExpansion}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          )}

          {activeTab === 'incidencias' && (
            <Incidencias
              tickets={tickets}
              filteredTickets={filteredTickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              ticketTypeFilter={ticketTypeFilter}
              setTicketTypeFilter={setTicketTypeFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              setShowNewTicketModal={setShowNewTicketModal}
              getPriorityColor={getPriorityColor}
            />
          )}

          {activeTab === 'monitorizacion' && (
            <Monitorizacion
              expandedSections={expandedSections}
              toggleSectionExpansion={toggleSectionExpansion}
            />
          )}

          {activeTab === 'seguridad' && (
            <Seguridad />
          )}

          {activeTab === 'backups' && (
            <Backups />
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

              {/* Sección de Configuración Avanzada */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, config: !prev.config }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Configuració Avançada</h3>
                      <p className="text-sm text-gray-600 mt-1">Variables d'entorn, credencials segures i versionat amb rollback</p>
                    </div>
                  </div>
                  {expandedSections.config ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.config && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Variables de Entorno */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Variables d'Entorn per Servidor
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {['Production', 'Staging', 'Development', 'Testing'].map(env => (
                          <div key={env} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-gray-900">{env}</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                env === 'Production' ? 'bg-green-100 text-green-800' :
                                env === 'Staging' ? 'bg-yellow-100 text-yellow-800' :
                                env === 'Development' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {env === 'Production' ? '42 vars' : env === 'Staging' ? '38 vars' : env === 'Development' ? '35 vars' : '28 vars'}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">DATABASE_URL</span>
                                <Lock className="w-3 h-3 text-green-600" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">API_KEY</span>
                                <Lock className="w-3 h-3 text-green-600" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">NODE_ENV</span>
                                <span className="text-xs text-gray-500">{env.toLowerCase()}</span>
                              </div>
                            </div>
                            <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700">
                              Editar variables →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gestión de Credenciales */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Gestió Segura de Credencials
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">AWS Secrets</span>
                              <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">127</div>
                            <div className="text-xs text-gray-600">Últim accés: fa 2h</div>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Vault Keys</span>
                              <Shield className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">89</div>
                            <div className="text-xs text-gray-600">Rotació: en 5 dies</div>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">API Tokens</span>
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">34</div>
                            <div className="text-xs text-orange-600">3 expiren aviat</div>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                          Gestionar Credencials
                        </button>
                      </div>
                    </div>

                    {/* Versionado con Rollback */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Versionat i Rollback
                      </h4>
                      <div className="space-y-3">
                        {[
                          { version: 'v2.4.1', date: 'Avui 14:23', status: 'active', changes: '12 arxius, +340/-120 línies' },
                          { version: 'v2.4.0', date: 'Ahir 09:15', status: 'stable', changes: '45 arxius, +1.2k/-890 línies' },
                          { version: 'v2.3.9', date: 'Fa 3 dies', status: 'stable', changes: '8 arxius, +90/-45 línies' }
                        ].map((ver, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${ver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <div>
                                <span className="font-medium text-gray-900">{ver.version}</span>
                                <span className="ml-2 text-sm text-gray-600">{ver.date}</span>
                                <div className="text-xs text-gray-500 mt-1">{ver.changes}</div>
                              </div>
                            </div>
                            {ver.status !== 'active' && (
                              <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors">
                                Rollback
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Automatización */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, automation: !prev.automation }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Automatització</h3>
                      <p className="text-sm text-gray-600 mt-1">CI/CD pipelines, gestió de releases i scheduling</p>
                    </div>
                  </div>
                  {expandedSections.automation ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.automation && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* CI/CD Pipelines */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        CI/CD Pipelines
                      </h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Main Pipeline', branch: 'main', status: 'running', duration: '3m 42s', steps: '7/12' },
                          { name: 'Deploy Production', branch: 'release/v2.4', status: 'success', duration: '8m 15s', steps: '12/12' },
                          { name: 'Test Suite', branch: 'develop', status: 'failed', duration: '5m 33s', steps: '9/15' }
                        ].map((pipeline, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                  pipeline.status === 'running' ? 'bg-blue-500' :
                                  pipeline.status === 'success' ? 'bg-green-500' :
                                  'bg-red-500'
                                }`} />
                                <span className="font-medium text-gray-900">{pipeline.name}</span>
                                <span className="text-sm text-gray-600">({pipeline.branch})</span>
                              </div>
                              <span className="text-sm text-gray-600">{pipeline.duration}</span>
                            </div>
                            <div className="bg-gray-100 rounded-full h-2 mb-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  pipeline.status === 'success' ? 'bg-green-500' :
                                  pipeline.status === 'failed' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${(parseInt(pipeline.steps.split('/')[0]) / parseInt(pipeline.steps.split('/')[1])) * 100}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Passos: {pipeline.steps}</span>
                              <button className="text-indigo-600 hover:text-indigo-700">Veure detalls →</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gestión de Releases */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Gestió de Releases
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-green-900">Última Release</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-900 mb-1">v2.4.0</div>
                          <div className="text-sm text-green-700">Desplegada fa 2 dies</div>
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <div className="text-xs text-green-700 space-y-1">
                              <div>✓ 15 noves funcionalitats</div>
                              <div>✓ 23 bugs resolts</div>
                              <div>✓ Millores de rendiment</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-blue-900">Pròxima Release</span>
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-2xl font-bold text-blue-900 mb-1">v2.5.0</div>
                          <div className="text-sm text-blue-700">Planificada en 5 dies</div>
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="text-xs text-blue-700 space-y-1">
                              <div>• 8 funcionalitats en desenvolupament</div>
                              <div>• 12 PRs pendents</div>
                              <div>• 95% tests passant</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scheduling de Mantenimiento */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Scheduling de Manteniment
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {[
                            { task: 'Backup Database', schedule: 'Cada dia 02:00', lastRun: 'Fa 22h', nextRun: 'En 2h', status: 'scheduled' },
                            { task: 'Neteja Logs', schedule: 'Setmanal (Diumenge)', lastRun: 'Fa 3 dies', nextRun: 'En 4 dies', status: 'scheduled' },
                            { task: 'Actualització SSL', schedule: 'Mensual', lastRun: 'Fa 15 dies', nextRun: 'En 15 dies', status: 'scheduled' },
                            { task: 'Optimització DB', schedule: 'Ara', lastRun: 'Fa 7 dies', nextRun: 'Executant...', status: 'running' }
                          ].map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                                }`} />
                                <div>
                                  <div className="font-medium text-gray-900">{task.task}</div>
                                  <div className="text-sm text-gray-600">{task.schedule}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-900">{task.nextRun}</div>
                                <div className="text-xs text-gray-500">Últim: {task.lastRun}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                          Programar Nova Tasca
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Escalabilidad */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, scalability: !prev.scalability }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Escalabilitat</h3>
                      <p className="text-sm text-gray-600 mt-1">Auto-scaling, load balancing i optimització de recursos</p>
                    </div>
                  </div>
                  {expandedSections.scalability ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.scalability && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Auto-scaling */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Auto-scaling Basat en Mètriques
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { metric: 'CPU', current: '67%', threshold: '80%', instances: 4, trend: 'up' },
                          { metric: 'Memòria', current: '45%', threshold: '75%', instances: 4, trend: 'stable' },
                          { metric: 'Requests/s', current: '1.2k', threshold: '2k', instances: 4, trend: 'down' }
                        ].map((metric, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-gray-900">{metric.metric}</span>
                              <span className={`text-sm ${
                                metric.trend === 'up' ? 'text-red-600' :
                                metric.trend === 'down' ? 'text-green-600' :
                                'text-gray-600'
                              }`}>
                                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.current}</div>
                            <div className="text-sm text-gray-600 mb-3">Llindar: {metric.threshold}</div>
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  parseInt(metric.current) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${parseInt(metric.current)}%` }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                              {metric.instances} instàncies actives
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-900">Regles d'escalat automàtic actives</span>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-700">Configurar →</button>
                        </div>
                      </div>
                    </div>

                    {/* Load Balancing */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Load Balancing
                      </h4>
                      <div className="space-y-3">
                        {[
                          { name: 'eu-west-1a', status: 'healthy', load: 45, connections: 234, responseTime: '125ms' },
                          { name: 'eu-west-1b', status: 'healthy', load: 52, connections: 267, responseTime: '132ms' },
                          { name: 'eu-west-1c', status: 'degraded', load: 78, connections: 412, responseTime: '245ms' },
                          { name: 'eu-west-2a', status: 'healthy', load: 38, connections: 198, responseTime: '118ms' }
                        ].map((server, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                server.status === 'healthy' ? 'bg-green-500' :
                                server.status === 'degraded' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                              <div>
                                <span className="font-medium text-gray-900">{server.name}</span>
                                <div className="text-sm text-gray-600">{server.connections} connexions</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{server.load}%</div>
                                <div className="text-xs text-gray-600">{server.responseTime}</div>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    server.load > 70 ? 'bg-red-500' :
                                    server.load > 50 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${server.load}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Networking y DNS */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, networking: !prev.networking }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Networking i DNS</h3>
                      <p className="text-sm text-gray-600 mt-1">Gestió de dominis, SSL/TLS automàtic i CDN</p>
                    </div>
                  </div>
                  {expandedSections.networking ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.networking && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Gestión de Dominios */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Gestió de Dominis
                      </h4>
                      <div className="space-y-3">
                        {[
                          { domain: 'lapublica.cat', status: 'active', ssl: 'valid', cdn: true, expires: '234 dies' },
                          { domain: 'api.lapublica.cat', status: 'active', ssl: 'valid', cdn: false, expires: '234 dies' },
                          { domain: 'admin.lapublica.cat', status: 'active', ssl: 'renewing', cdn: false, expires: '234 dies' },
                          { domain: 'cdn.lapublica.cat', status: 'active', ssl: 'valid', cdn: true, expires: '234 dies' }
                        ].map((domain, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Lock className={`w-4 h-4 ${
                                domain.ssl === 'valid' ? 'text-green-600' :
                                domain.ssl === 'renewing' ? 'text-yellow-600' :
                                'text-red-600'
                              }`} />
                              <div>
                                <span className="font-medium text-gray-900">{domain.domain}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    domain.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {domain.status}
                                  </span>
                                  {domain.cdn && (
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">CDN</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-900">SSL: {domain.ssl}</div>
                              <div className="text-xs text-gray-600">Expira: {domain.expires}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SSL/TLS */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        SSL/TLS Automàtic
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-green-900">Certificats Actius</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-3xl font-bold text-green-900">47</div>
                          <div className="text-sm text-green-700 mt-1">Tots vàlids</div>
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <div className="text-xs text-green-700">
                              Let's Encrypt: 42 | DigiCert: 5
                            </div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-yellow-900">Pròximes Renovacions</span>
                            <Clock className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div className="text-3xl font-bold text-yellow-900">3</div>
                          <div className="text-sm text-yellow-700 mt-1">En els pròxims 30 dies</div>
                          <div className="mt-3 pt-3 border-t border-yellow-200">
                            <button className="text-xs text-yellow-700 hover:text-yellow-800">
                              Renovar ara →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CDN Configuration */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Configuració CDN
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-4 gap-3 mb-4">
                          {[
                            { region: 'Europa', status: 'active', nodes: 12, latency: '12ms' },
                            { region: 'Amèrica', status: 'active', nodes: 8, latency: '45ms' },
                            { region: 'Àsia', status: 'partial', nodes: 6, latency: '78ms' },
                            { region: 'Oceania', status: 'inactive', nodes: 0, latency: '-' }
                          ].map((region, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{region.region}</span>
                                <div className={`w-2 h-2 rounded-full ${
                                  region.status === 'active' ? 'bg-green-500' :
                                  region.status === 'partial' ? 'bg-yellow-500' :
                                  'bg-gray-400'
                                }`} />
                              </div>
                              <div className="text-xs text-gray-600">
                                <div>{region.nodes} nodes</div>
                                <div>Latència: {region.latency}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            Cache Hit Ratio: <span className="font-medium text-gray-900">94.7%</span>
                          </div>
                          <button className="text-sm text-indigo-600 hover:text-indigo-700">
                            Purgar Cache →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Logs Centralizados */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, logs: !prev.logs }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Logs Centralitzats</h3>
                      <p className="text-sm text-gray-600 mt-1">Agregació, cerca avançada i alertes basades en patrons</p>
                    </div>
                  </div>
                  {expandedSections.logs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.logs && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Estadísticas de Logs */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Total Logs (24h)</div>
                        <div className="text-2xl font-bold text-gray-900">2.4M</div>
                        <div className="text-xs text-green-600">↑ 12% vs ahir</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Errors</div>
                        <div className="text-2xl font-bold text-red-900">127</div>
                        <div className="text-xs text-red-600">↑ 3 nous</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Warnings</div>
                        <div className="text-2xl font-bold text-yellow-900">892</div>
                        <div className="text-xs text-yellow-600">Estable</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Alertes Actives</div>
                        <div className="text-2xl font-bold text-blue-900">5</div>
                        <div className="text-xs text-blue-600">2 crítiques</div>
                      </div>
                    </div>

                    {/* Búsqueda Avanzada */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Cerca Avançada
                      </h4>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="Cercar en logs... (ex: error, user:123, service:api)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                          <option>Últimes 24h</option>
                          <option>Última setmana</option>
                          <option>Últim mes</option>
                        </select>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                          Cercar
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200">
                          level:error
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200">
                          service:auth
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200">
                          status:500
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200">
                          user:admin
                        </span>
                      </div>
                    </div>

                    {/* Logs Recientes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Logs Recents</h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                        <div className="text-red-400">[ERROR] 2024-01-15 14:23:45 - Auth service: Failed login attempt for user admin@lapublica.cat</div>
                        <div className="text-yellow-400">[WARN] 2024-01-15 14:23:44 - Database: Slow query detected (2.3s) in getUserPosts()</div>
                        <div className="text-green-400">[INFO] 2024-01-15 14:23:43 - API: POST /api/v1/posts - 201 Created (125ms)</div>
                        <div className="text-blue-400">[DEBUG] 2024-01-15 14:23:42 - Cache: Hit for key: user_profile_123</div>
                        <div className="text-green-400">[INFO] 2024-01-15 14:23:41 - Worker: Background job completed: sendEmailNotifications</div>
                        <div className="text-yellow-400">[WARN] 2024-01-15 14:23:40 - Memory: Usage at 78% threshold</div>
                        <div className="text-green-400">[INFO] 2024-01-15 14:23:39 - Deployment: Successfully deployed version 2.4.1</div>
                      </div>
                    </div>

                    {/* Alertas Basadas en Patrones */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Alertes Basades en Patrons
                      </h4>
                      <div className="space-y-2">
                        {[
                          { pattern: 'Error rate > 1%', status: 'triggered', count: 3, action: 'Email + Slack' },
                          { pattern: '5xx responses > 10/min', status: 'monitoring', count: 7, action: 'Slack' },
                          { pattern: 'Database timeout', status: 'triggered', count: 1, action: 'PagerDuty' },
                          { pattern: 'Memory > 90%', status: 'monitoring', count: 0, action: 'Email' }
                        ].map((alert, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                alert.status === 'triggered' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                              }`} />
                              <div>
                                <span className="font-medium text-gray-900">{alert.pattern}</span>
                                <div className="text-sm text-gray-600">{alert.count} coincidències (última hora)</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{alert.action}</span>
                              <button className="text-sm text-indigo-600 hover:text-indigo-700">
                                Configurar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Docker y Provisioning */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, docker: !prev.docker }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-cyan-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Contenidors i Provisioning</h3>
                      <p className="text-sm text-gray-600 mt-1">Docker, Kubernetes i provisioning automàtic de recursos</p>
                    </div>
                  </div>
                  {expandedSections.docker ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.docker && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Docker Containers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Contenidors Docker
                      </h4>
                      <div className="space-y-3">
                        {[
                          { name: 'api-gateway', image: 'lapublica/api:2.4.1', status: 'running', cpu: '23%', memory: '512MB', uptime: '5d 3h' },
                          { name: 'auth-service', image: 'lapublica/auth:1.8.3', status: 'running', cpu: '12%', memory: '256MB', uptime: '5d 3h' },
                          { name: 'db-postgres', image: 'postgres:14', status: 'running', cpu: '45%', memory: '2GB', uptime: '12d 7h' },
                          { name: 'redis-cache', image: 'redis:7-alpine', status: 'running', cpu: '8%', memory: '128MB', uptime: '5d 3h' },
                          { name: 'worker-queue', image: 'lapublica/worker:2.4.1', status: 'stopped', cpu: '-', memory: '-', uptime: '-' }
                        ].map((container, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                container.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <span className="font-medium text-gray-900">{container.name}</span>
                                <div className="text-xs text-gray-600">{container.image}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">CPU:</span> {container.cpu}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Mem:</span> {container.memory}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Uptime:</span> {container.uptime}
                              </div>
                              <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Play className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Square className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <RefreshCw className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kubernetes Clusters */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Kubernetes Clusters
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-blue-900">Production Cluster</span>
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Nodes</span>
                              <span className="font-medium text-blue-900">8/8 healthy</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Pods</span>
                              <span className="font-medium text-blue-900">47 running</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Services</span>
                              <span className="font-medium text-blue-900">12 active</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Version</span>
                              <span className="font-medium text-blue-900">v1.28.2</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-green-900">Staging Cluster</span>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-700">Nodes</span>
                              <span className="font-medium text-green-900">4/4 healthy</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Pods</span>
                              <span className="font-medium text-green-900">23 running</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Services</span>
                              <span className="font-medium text-green-900">8 active</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Version</span>
                              <span className="font-medium text-green-900">v1.28.2</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Provisioning Automático */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Provisioning Automàtic
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Recursos Disponibles</div>
                            <div className="text-xl font-bold text-gray-900">128 vCPU</div>
                            <div className="text-xs text-gray-600">512 GB RAM</div>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">En Ús</div>
                            <div className="text-xl font-bold text-gray-900">89 vCPU</div>
                            <div className="text-xs text-gray-600">342 GB RAM</div>
                          </div>
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="text-sm text-gray-600 mb-1">Reservat</div>
                            <div className="text-xl font-bold text-gray-900">12 vCPU</div>
                            <div className="text-xs text-gray-600">48 GB RAM</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-700">Auto-provisioning actiu</span>
                            <div className="w-10 h-6 bg-green-500 rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-700">Límit de cost mensual</span>
                            <span className="text-sm font-medium text-gray-900">€5,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
              {/* Dashboard de Serveis Externs */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { 
                    name: 'Stripe', 
                    status: 'operational', 
                    uptime: '99.99%', 
                    latency: '142ms', 
                    errors: 0,
                    icon: CreditCard,
                    color: 'purple'
                  },
                  { 
                    name: 'AWS S3', 
                    status: 'operational', 
                    uptime: '99.95%', 
                    latency: '89ms', 
                    errors: 2,
                    icon: Database,
                    color: 'orange'
                  },
                  { 
                    name: 'SendGrid', 
                    status: 'degraded', 
                    uptime: '98.2%', 
                    latency: '523ms', 
                    errors: 47,
                    icon: MessageSquare,
                    color: 'blue'
                  },
                  { 
                    name: 'OpenAI API', 
                    status: 'operational', 
                    uptime: '99.7%', 
                    latency: '1.2s', 
                    errors: 5,
                    icon: Brain,
                    color: 'green'
                  },
                  { 
                    name: 'Cloudflare', 
                    status: 'operational', 
                    uptime: '100%', 
                    latency: '12ms', 
                    errors: 0,
                    icon: Globe,
                    color: 'orange'
                  },
                  { 
                    name: 'Twilio', 
                    status: 'operational', 
                    uptime: '99.8%', 
                    latency: '234ms', 
                    errors: 1,
                    icon: HeadphonesIcon,
                    color: 'red'
                  },
                  { 
                    name: 'GitHub API', 
                    status: 'maintenance', 
                    uptime: '99.3%', 
                    latency: '456ms', 
                    errors: 0,
                    icon: GitBranch,
                    color: 'gray'
                  },
                  { 
                    name: 'Datadog', 
                    status: 'operational', 
                    uptime: '99.9%', 
                    latency: '67ms', 
                    errors: 3,
                    icon: Activity,
                    color: 'purple'
                  }
                ].map((service, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <service.icon className={`w-5 h-5 text-${service.color}-600`} />
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-green-500' :
                        service.status === 'degraded' ? 'bg-yellow-500' :
                        service.status === 'maintenance' ? 'bg-blue-500' :
                        'bg-red-500'
                      } animate-pulse`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Uptime</span>
                        <span className={`font-medium ${
                          parseFloat(service.uptime) > 99.5 ? 'text-green-600' :
                          parseFloat(service.uptime) > 98 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{service.uptime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Latència</span>
                        <span className="font-medium text-gray-900">{service.latency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Errors (24h)</span>
                        <span className={`font-medium ${
                          service.errors === 0 ? 'text-green-600' :
                          service.errors < 10 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>{service.errors}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Estat: <span className={`font-medium ${
                          service.status === 'operational' ? 'text-green-600' :
                          service.status === 'degraded' ? 'text-yellow-600' :
                          service.status === 'maintenance' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>{service.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gestió de Credencials */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, credentials: !prev.credentials }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-amber-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Gestió de Credencials</h3>
                      <p className="text-sm text-gray-600 mt-1">API keys, webhooks i rotació automàtica de secrets</p>
                    </div>
                  </div>
                  {expandedSections.credentials ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.credentials && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* API Keys */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        API Keys Actives
                      </h4>
                      <div className="space-y-3">
                        {[
                          { service: 'Stripe', key: 'sk_live_****...3f4d', created: 'Fa 45 dies', lastUsed: 'Fa 2 minuts', rotateIn: '15 dies' },
                          { service: 'SendGrid', key: 'SG.****...8k2m', created: 'Fa 120 dies', lastUsed: 'Fa 1 hora', rotateIn: 'Expirat' },
                          { service: 'OpenAI', key: 'sk-****...9p3q', created: 'Fa 30 dies', lastUsed: 'Ara mateix', rotateIn: '30 dies' },
                          { service: 'AWS', key: 'AKIA****...7N2P', created: 'Fa 89 dies', lastUsed: 'Fa 5 minuts', rotateIn: '1 dia' }
                        ].map((credential, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-4">
                              <Lock className={`w-4 h-4 ${
                                credential.rotateIn === 'Expirat' ? 'text-red-600' :
                                credential.rotateIn === '1 dia' ? 'text-yellow-600' :
                                'text-green-600'
                              }`} />
                              <div>
                                <div className="font-medium text-gray-900">{credential.service}</div>
                                <div className="text-sm text-gray-600 font-mono">{credential.key}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Creat: {credential.created} | Últim ús: {credential.lastUsed}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${
                                credential.rotateIn === 'Expirat' ? 'text-red-600' :
                                credential.rotateIn === '1 dia' ? 'text-yellow-600' :
                                'text-gray-900'
                              }`}>
                                Rotació: {credential.rotateIn}
                              </div>
                              <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-700">
                                Rotar ara →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Webhooks */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Webhooks Configurats
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          {[
                            { url: 'https://api.lapublica.cat/webhooks/stripe', service: 'Stripe', events: 42, status: 'active' },
                            { url: 'https://api.lapublica.cat/webhooks/github', service: 'GitHub', events: 156, status: 'active' },
                            { url: 'https://api.lapublica.cat/webhooks/twilio', service: 'Twilio', events: 0, status: 'paused' }
                          ].map((webhook, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                              <div>
                                <div className="text-sm font-mono text-gray-900">{webhook.url}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {webhook.service} - {webhook.events} events processats
                                </div>
                              </div>
                              <div className={`px-2 py-1 text-xs rounded ${
                                webhook.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {webhook.status}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                          Afegir Webhook
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuració Avançada */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, serviceConfig: !prev.serviceConfig }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Configuració Avançada</h3>
                      <p className="text-sm text-gray-600 mt-1">Timeouts, reintentos, failover i circuit breakers</p>
                    </div>
                  </div>
                  {expandedSections.serviceConfig ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.serviceConfig && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { 
                          service: 'Stripe',
                          timeout: '30s',
                          retries: 3,
                          failover: 'PayPal',
                          circuitBreaker: true,
                          rateLimit: '1000/min'
                        },
                        { 
                          service: 'SendGrid',
                          timeout: '15s',
                          retries: 5,
                          failover: 'AWS SES',
                          circuitBreaker: true,
                          rateLimit: '500/min'
                        },
                        { 
                          service: 'OpenAI',
                          timeout: '60s',
                          retries: 2,
                          failover: 'Claude API',
                          circuitBreaker: false,
                          rateLimit: '100/min'
                        },
                        { 
                          service: 'AWS S3',
                          timeout: '45s',
                          retries: 3,
                          failover: 'Cloudflare R2',
                          circuitBreaker: true,
                          rateLimit: '5000/min'
                        }
                      ].map((config, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-3">{config.service}</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Timeout</span>
                              <input 
                                type="text" 
                                value={config.timeout} 
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                readOnly
                              />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reintentos</span>
                              <input 
                                type="number" 
                                value={config.retries} 
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                                readOnly
                              />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Failover</span>
                              <span className="font-medium text-gray-900">{config.failover}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Circuit Breaker</span>
                              <div className={`w-10 h-6 rounded-full relative ${
                                config.circuitBreaker ? 'bg-green-500' : 'bg-gray-300'
                              }`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  config.circuitBreaker ? 'right-1' : 'left-1'
                                }`} />
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rate Limit</span>
                              <span className="font-mono text-xs">{config.rateLimit}</span>
                            </div>
                          </div>
                          <button className="mt-3 w-full text-sm text-indigo-600 hover:text-indigo-700">
                            Editar configuració →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Anàlisi de Costos */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, costs: !prev.costs }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Euro className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Anàlisi de Costos</h3>
                      <p className="text-sm text-gray-600 mt-1">Facturació, límits d'ús i projeccions de despesa</p>
                    </div>
                  </div>
                  {expandedSections.costs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.costs && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Resumen de Costos */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">Aquest mes</div>
                        <div className="text-2xl font-bold text-green-900">€3,247</div>
                        <div className="text-xs text-green-700 mt-1">↓ 12% vs mes passat</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-600 mb-1">Projecció mensual</div>
                        <div className="text-2xl font-bold text-yellow-900">€4,892</div>
                        <div className="text-xs text-yellow-700 mt-1">Basat en ús actual</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-sm text-red-600 mb-1">Límit mensual</div>
                        <div className="text-2xl font-bold text-red-900">€5,000</div>
                        <div className="text-xs text-red-700 mt-1">97% utilitzat</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">Cost per usuari</div>
                        <div className="text-2xl font-bold text-blue-900">€0.42</div>
                        <div className="text-xs text-blue-700 mt-1">7,732 usuaris actius</div>
                      </div>
                    </div>

                    {/* Desglose por Servicio */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Desglossament per Servei</h4>
                      <div className="space-y-3">
                        {[
                          { service: 'AWS (S3, EC2, RDS)', cost: 1234, usage: 78, trend: 'up' },
                          { service: 'OpenAI API', cost: 892, usage: 92, trend: 'up' },
                          { service: 'Stripe', cost: 456, usage: 45, trend: 'stable' },
                          { service: 'SendGrid', cost: 234, usage: 67, trend: 'down' },
                          { service: 'Cloudflare', cost: 189, usage: 34, trend: 'stable' },
                          { service: 'Datadog', cost: 156, usage: 89, trend: 'up' },
                          { service: 'Twilio', cost: 86, usage: 23, trend: 'down' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{item.service}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">€{item.cost}</span>
                                  <span className={`text-sm ${
                                    item.trend === 'up' ? 'text-red-600' :
                                    item.trend === 'down' ? 'text-green-600' :
                                    'text-gray-600'
                                  }`}>
                                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      item.usage > 80 ? 'bg-red-500' :
                                      item.usage > 60 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${item.usage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{item.usage}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alertas de Límites */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-yellow-900">Alertes de Límits</h5>
                          <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                            <li>• OpenAI API: 92% del límit mensual utilitzat</li>
                            <li>• Datadog: Pròxim a superar el pla actual (89%)</li>
                            <li>• AWS: Projecció supera pressupost en €342</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Monitorització */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, monitoring: !prev.monitoring }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-purple-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Monitorització</h3>
                      <p className="text-sm text-gray-600 mt-1">Historial de caigudes, alertes i mètriques de rendiment</p>
                    </div>
                  </div>
                  {expandedSections.monitoring ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.monitoring && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Incidents Recents */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Incidents Recents
                      </h4>
                      <div className="space-y-3">
                        {[
                          { 
                            service: 'SendGrid',
                            type: 'Degradació',
                            start: '14:23',
                            duration: '45 min',
                            impact: 'Alt',
                            status: 'resolt'
                          },
                          { 
                            service: 'GitHub API',
                            type: 'Manteniment',
                            start: '02:00',
                            duration: '2h 30min',
                            impact: 'Baix',
                            status: 'programat'
                          },
                          { 
                            service: 'OpenAI',
                            type: 'Caiguda',
                            start: 'Ahir 18:45',
                            duration: '12 min',
                            impact: 'Crític',
                            status: 'resolt'
                          }
                        ].map((incident, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                incident.status === 'resolt' ? 'bg-green-500' :
                                incident.status === 'programat' ? 'bg-blue-500' :
                                'bg-red-500'
                              }`} />
                              <div>
                                <div className="font-medium text-gray-900">{incident.service}</div>
                                <div className="text-sm text-gray-600">
                                  {incident.type} - {incident.start} ({incident.duration})
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded ${
                                incident.impact === 'Crític' ? 'bg-red-100 text-red-800' :
                                incident.impact === 'Alt' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                Impacte: {incident.impact}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gràfic de Disponibilitat */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Disponibilitat (Últims 30 dies)</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-30 gap-0.5">
                          {Array.from({ length: 30 }, (_, i) => {
                            const uptime = Math.random() > 0.1 ? 100 : Math.floor(Math.random() * 30) + 70
                            return (
                              <div
                                key={i}
                                className={`h-20 rounded ${
                                  uptime === 100 ? 'bg-green-500' :
                                  uptime > 95 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                title={`Dia ${i + 1}: ${uptime}%`}
                              />
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded" />
                            <span>100% uptime</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded" />
                            <span>95-99% uptime</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded" />
                            <span>&lt;95% uptime</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Testing i Integració */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, testing: !prev.testing }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bug className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Testing i Integració</h3>
                      <p className="text-sm text-gray-600 mt-1">Proves automatitzades, sandbox i debugging</p>
                    </div>
                  </div>
                  {expandedSections.testing ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.testing && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Tests Automatitzats */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Proves de Connectivitat
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { service: 'Stripe', lastTest: 'Fa 5 min', result: 'success', responseTime: '142ms' },
                          { service: 'SendGrid', lastTest: 'Fa 10 min', result: 'warning', responseTime: '523ms' },
                          { service: 'OpenAI', lastTest: 'Fa 3 min', result: 'success', responseTime: '1.2s' },
                          { service: 'AWS S3', lastTest: 'Fa 8 min', result: 'success', responseTime: '89ms' }
                        ].map((test, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{test.service}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                test.result === 'success' ? 'bg-green-500' :
                                test.result === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Última prova</span>
                                <span className="text-gray-900">{test.lastTest}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Temps resposta</span>
                                <span className={`font-medium ${
                                  test.result === 'warning' ? 'text-yellow-600' : 'text-gray-900'
                                }`}>{test.responseTime}</span>
                              </div>
                            </div>
                            <button className="mt-3 w-full text-sm text-indigo-600 hover:text-indigo-700">
                              Executar test →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sandbox */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Entorn Sandbox
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-medium text-gray-900">Mode Sandbox Actiu</div>
                            <div className="text-sm text-gray-600">Totes les crides es fan a entorns de prova</div>
                          </div>
                          <div className="w-12 h-6 bg-green-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-700">Stripe Test Mode</span>
                            <span className="text-xs text-green-600">Actiu</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-700">SendGrid Sandbox</span>
                            <span className="text-xs text-green-600">Actiu</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-700">OpenAI Test Tokens</span>
                            <span className="text-xs text-green-600">Actiu</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logs de Requests */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Logs de Requests/Responses
                      </h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
                        <div className="text-green-400">
                          [200 OK] POST /v1/charges → Stripe API (142ms)
                        </div>
                        <div className="text-blue-400">
                          Request: {`{ "amount": 2000, "currency": "eur", "source": "tok_***" }`}
                        </div>
                        <div className="text-gray-400">
                          Response: {`{ "id": "ch_3O4***", "status": "succeeded", "amount": 2000 }`}
                        </div>
                        <div className="text-yellow-400">
                          [429 Rate Limited] POST /v3/mail/send → SendGrid API (523ms)
                        </div>
                        <div className="text-red-400">
                          Error: Rate limit exceeded. Retry after 60 seconds.
                        </div>
                        <div className="text-green-400">
                          [200 OK] POST /v1/chat/completions → OpenAI API (1243ms)
                        </div>
                        <div className="text-blue-400">
                          Request: {`{ "model": "gpt-4", "messages": [...], "temperature": 0.7 }`}
                        </div>
                        <div className="text-gray-400">
                          Response: {`{ "choices": [{ "message": { "content": "..." } }] }`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

          {activeTab === 'facturacion' && (
            <div className="space-y-6">
              {/* Dashboard de Despeses d'Infraestructura */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Resum de Costos Tècnics</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">€8,947</div>
                    <div className="text-sm opacity-90">Total aquest mes</div>
                    <div className="text-xs opacity-75 mt-1">↓ 5% vs mes anterior</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">€12,340</div>
                    <div className="text-sm opacity-90">Projecció mensual</div>
                    <div className="text-xs opacity-75 mt-1">Basat en tendència actual</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">€15,000</div>
                    <div className="text-sm opacity-90">Pressupost mensual</div>
                    <div className="text-xs opacity-75 mt-1">73% utilitzat</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">€142</div>
                    <div className="text-sm opacity-90">Estalvis potencials</div>
                    <div className="text-xs opacity-75 mt-1">Recursos infrautilitzats</div>
                  </div>
                </div>
              </div>

              {/* Despeses d'Infraestructura */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, infrastructure: !prev.infrastructure }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Despeses d'Infraestructura</h3>
                      <p className="text-sm text-gray-600 mt-1">Servidors, bases de dades, CDN i emmagatzematge</p>
                    </div>
                  </div>
                  {expandedSections.infrastructure ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.infrastructure && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Breakdown por Categoría */}
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        {
                          category: 'Servidors',
                          icon: Server,
                          cost: 3247,
                          usage: 85,
                          trend: 'up',
                          details: [
                            { name: 'EC2 Instances (Prod)', cost: 1847, type: 't3.xlarge x4' },
                            { name: 'EC2 Instances (Staging)', cost: 623, type: 't3.large x2' },
                            { name: 'Load Balancers', cost: 456, type: 'ALB x3' },
                            { name: 'Auto Scaling', cost: 321, type: 'ASG x2' }
                          ]
                        },
                        {
                          category: 'Bases de Dades',
                          icon: Database,
                          cost: 2156,
                          usage: 67,
                          trend: 'stable',
                          details: [
                            { name: 'RDS PostgreSQL (Prod)', cost: 1234, type: 'db.r5.xlarge' },
                            { name: 'RDS PostgreSQL (Staging)', cost: 456, type: 'db.t3.medium' },
                            { name: 'ElastiCache Redis', cost: 298, type: 'cache.r6g.large' },
                            { name: 'DynamoDB', cost: 168, type: 'On-demand' }
                          ]
                        },
                        {
                          category: 'CDN i Emmagatzematge',
                          icon: Globe,
                          cost: 1544,
                          usage: 45,
                          trend: 'down',
                          details: [
                            { name: 'CloudFront', cost: 678, type: 'Edge locations' },
                            { name: 'S3 Storage', cost: 432, type: '2.4TB' },
                            { name: 'S3 Requests', cost: 234, type: '1.2M requests' },
                            { name: 'Data Transfer', cost: 200, type: 'Outbound 450GB' }
                          ]
                        }
                      ].map((cat, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <cat.icon className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-gray-900">{cat.category}</span>
                            </div>
                            <span className={`text-sm ${
                              cat.trend === 'up' ? 'text-red-600' :
                              cat.trend === 'down' ? 'text-green-600' :
                              'text-gray-600'
                            }`}>
                              {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-2">€{cat.cost}</div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Utilitzat</span>
                              <span className="font-medium">{cat.usage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  cat.usage > 80 ? 'bg-red-500' :
                                  cat.usage > 60 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${cat.usage}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            {cat.details.map((detail, detailIdx) => (
                              <div key={detailIdx} className="flex justify-between text-xs">
                                <div>
                                  <div className="font-medium text-gray-900">{detail.name}</div>
                                  <div className="text-gray-500">{detail.type}</div>
                                </div>
                                <div className="font-medium text-gray-900">€{detail.cost}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Facturació de Serveis Externs */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, externalServices: !prev.externalServices }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-purple-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Serveis Externs amb Límits</h3>
                      <p className="text-sm text-gray-600 mt-1">API calls, transaccions i límits d'ús</p>
                    </div>
                  </div>
                  {expandedSections.externalServices ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.externalServices && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        {
                          service: 'OpenAI API',
                          cost: 1247,
                          limit: 2000,
                          used: 1534,
                          unit: 'tokens (M)',
                          pricing: '€0.03/1K tokens',
                          trend: 'up',
                          nextBill: '€1,680'
                        },
                        {
                          service: 'Stripe',
                          cost: 456,
                          limit: 10000,
                          used: 3247,
                          unit: 'transaccions',
                          pricing: '2.9% + €0.30',
                          trend: 'stable',
                          nextBill: '€523'
                        },
                        {
                          service: 'SendGrid',
                          cost: 234,
                          limit: 100000,
                          used: 67234,
                          unit: 'emails',
                          pricing: '€0.0025/email',
                          trend: 'down',
                          nextBill: '€189'
                        },
                        {
                          service: 'Twilio',
                          cost: 189,
                          limit: 5000,
                          used: 2156,
                          unit: 'SMS',
                          pricing: '€0.09/SMS',
                          trend: 'stable',
                          nextBill: '€234'
                        },
                        {
                          service: 'AWS S3',
                          cost: 145,
                          limit: 10000,
                          used: 4567,
                          unit: 'GB emmagatzematge',
                          pricing: '€0.023/GB',
                          trend: 'up',
                          nextBill: '€167'
                        },
                        {
                          service: 'Datadog',
                          cost: 678,
                          limit: 50,
                          used: 42,
                          unit: 'hosts monitorizats',
                          pricing: '€15/host',
                          trend: 'stable',
                          nextBill: '€630'
                        }
                      ].map((service, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900">{service.service}</span>
                            <span className={`text-sm ${
                              service.trend === 'up' ? 'text-red-600' :
                              service.trend === 'down' ? 'text-green-600' :
                              'text-gray-600'
                            }`}>
                              {service.trend === 'up' ? '↗️' : service.trend === 'down' ? '↘️' : '→'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <div className="text-lg font-bold text-gray-900">€{service.cost}</div>
                              <div className="text-xs text-gray-600">Aquest mes</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-600">{service.nextBill}</div>
                              <div className="text-xs text-gray-600">Pròxima factura</div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Ús: {service.used.toLocaleString()}/{service.limit.toLocaleString()} {service.unit}</span>
                              <span className={`font-medium ${
                                (service.used / service.limit) > 0.9 ? 'text-red-600' :
                                (service.used / service.limit) > 0.7 ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {Math.round((service.used / service.limit) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (service.used / service.limit) > 0.9 ? 'bg-red-500' :
                                  (service.used / service.limit) > 0.7 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${(service.used / service.limit) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Preu: {service.pricing}</div>
                            {(service.used / service.limit) > 0.9 && (
                              <div className="text-red-600 font-medium">⚠️ Prop del límit</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Anàlisi de Costos per Projecte */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, projectCosts: !prev.projectCosts }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-6 h-6 text-orange-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Costos per Projecte i Empresa</h3>
                      <p className="text-sm text-gray-600 mt-1">Distribució de despeses per col·laboració</p>
                    </div>
                  </div>
                  {expandedSections.projectCosts ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.projectCosts && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Costos per Empresa */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Despeses per Empresa Col·laboradora</h4>
                      <div className="space-y-3">
                        {[
                          { company: 'Empresa Alpha SL', projects: 3, totalCost: 2847, avgCost: 949, trend: 'up' },
                          { company: 'Beta Corp', projects: 2, totalCost: 1965, avgCost: 983, trend: 'down' },
                          { company: 'Gamma Industries', projects: 4, totalCost: 3421, avgCost: 855, trend: 'up' },
                          { company: 'Delta Solutions', projects: 1, totalCost: 714, avgCost: 714, trend: 'stable' }
                        ].map((comp, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-medium text-gray-900">{comp.company}</span>
                                  <span className="ml-2 text-sm text-gray-500">({comp.projects} projectes)</span>
                                </div>
                                <span className={`text-sm ${
                                  comp.trend === 'up' ? 'text-red-600' :
                                  comp.trend === 'down' ? 'text-green-600' :
                                  'text-gray-600'
                                }`}>
                                  {comp.trend === 'up' ? '↗️ +12%' : comp.trend === 'down' ? '↘️ -8%' : '→ Estable'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold text-gray-900">€{comp.totalCost.toLocaleString()}</div>
                                <div className="text-sm text-gray-600">Mitjana: €{comp.avgCost}/projecte</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projectes Més Costosos */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Projectes amb Més Despesa</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { name: 'E-commerce Platform', company: 'Empresa Alpha SL', cost: 1534, resources: ['3x EC2', '1x RDS', 'OpenAI API'] },
                          { name: 'CRM Integration', company: 'Gamma Industries', cost: 1247, resources: ['2x EC2', '1x ElastiCache', 'Stripe API'] },
                          { name: 'Mobile App Backend', company: 'Beta Corp', cost: 965, resources: ['4x Lambda', 'DynamoDB', 'SendGrid'] },
                          { name: 'Data Analytics', company: 'Gamma Industries', cost: 891, resources: ['1x EC2 (large)', 'S3 Storage', 'Datadog'] }
                        ].map((project, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3">
                            <div className="font-medium text-gray-900 mb-1">{project.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{project.company}</div>
                            <div className="text-lg font-bold text-orange-600 mb-2">€{project.cost}</div>
                            <div className="space-y-1">
                              {project.resources.map((resource, resIdx) => (
                                <div key={resIdx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {resource}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Optimització Automàtica */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, optimization: !prev.optimization }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Optimització Automàtica</h3>
                      <p className="text-sm text-gray-600 mt-1">Detecció de recursos infrautilitzats i recomanacions</p>
                    </div>
                  </div>
                  {expandedSections.optimization ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.optimization && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Recursos Infrautilitzats */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Recursos Infrautilitzats Detectats
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            resource: 'EC2 i-0123456789abcdef0',
                            type: 't3.large',
                            usage: 15,
                            cost: 89,
                            recommendation: 'Reduir a t3.medium',
                            savings: 32,
                            priority: 'high'
                          },
                          {
                            resource: 'RDS staging-database',
                            type: 'db.r5.large',
                            usage: 23,
                            cost: 145,
                            recommendation: 'Canviar a db.t3.medium',
                            savings: 67,
                            priority: 'high'
                          },
                          {
                            resource: 'ElastiCache dev-cache',
                            type: 'cache.r6g.large',
                            usage: 8,
                            cost: 98,
                            recommendation: 'Eliminar o reduir mida',
                            savings: 98,
                            priority: 'medium'
                          },
                          {
                            resource: 'S3 Bucket old-backups',
                            type: 'Standard Storage',
                            usage: 45,
                            cost: 234,
                            recommendation: 'Moure a Glacier',
                            savings: 187,
                            priority: 'low'
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                item.priority === 'high' ? 'bg-red-500' :
                                item.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`} />
                              <div>
                                <div className="font-medium text-gray-900">{item.resource}</div>
                                <div className="text-sm text-gray-600">{item.type} - {item.usage}% utilitzat</div>
                                <div className="text-sm text-blue-600">{item.recommendation}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">€{item.cost}</div>
                              <div className="text-sm text-green-600 font-medium">Estalvi: €{item.savings}</div>
                              <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-700">
                                Aplicar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resum d'Estalvis */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h5 className="font-medium text-green-900">Estalvi Potencial Total</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-green-900">€384</div>
                          <div className="text-sm text-green-700">Per mes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-900">€4,608</div>
                          <div className="text-sm text-green-700">Per any</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-900">43%</div>
                          <div className="text-sm text-green-700">Reducció possible</div>
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                        Aplicar Totes les Optimitzacions
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Alertes de Despeses */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, alerts: !prev.alerts }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Alertes de Despeses</h3>
                      <p className="text-sm text-gray-600 mt-1">Avisos automàtics i límits personalitzats</p>
                    </div>
                  </div>
                  {expandedSections.alerts ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.alerts && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Alertes Actives */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Alertes Actives
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            type: 'Límit superat',
                            service: 'OpenAI API',
                            threshold: 90,
                            current: 94,
                            severity: 'critical',
                            action: 'Bloquejar noves peticions'
                          },
                          {
                            type: 'Increment inesperat',
                            service: 'AWS EC2',
                            threshold: '+20%',
                            current: '+34%',
                            severity: 'warning',
                            action: 'Revisar configuració'
                          },
                          {
                            type: 'Pressupost mensual',
                            service: 'Total infraestructura',
                            threshold: '80%',
                            current: '87%',
                            severity: 'warning',
                            action: 'Optimitzar recursos'
                          }
                        ].map((alert, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg ${
                            alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                            alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                            'border-gray-200 bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                alert.severity === 'critical' ? 'bg-red-500' :
                                alert.severity === 'warning' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`} />
                              <div>
                                <div className={`font-medium ${
                                  alert.severity === 'critical' ? 'text-red-900' :
                                  alert.severity === 'warning' ? 'text-yellow-900' :
                                  'text-gray-900'
                                }`}>
                                  {alert.type} - {alert.service}
                                </div>
                                <div className={`text-sm ${
                                  alert.severity === 'critical' ? 'text-red-700' :
                                  alert.severity === 'warning' ? 'text-yellow-700' :
                                  'text-gray-600'
                                }`}>
                                  Llindar: {alert.threshold} | Actual: {alert.current}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-medium ${
                                alert.severity === 'critical' ? 'text-red-900' :
                                alert.severity === 'warning' ? 'text-yellow-900' :
                                'text-gray-900'
                              }`}>
                                {alert.action}
                              </div>
                              <button className="mt-1 text-xs text-indigo-600 hover:text-indigo-700">
                                Configurar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Configuració d'Alertes */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Configurar Noves Alertes</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Servei</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option>Seleccionar servei...</option>
                            <option>AWS Total</option>
                            <option>OpenAI API</option>
                            <option>Stripe</option>
                            <option>SendGrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tipus d'Alerta</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option>Límit de cost</option>
                            <option>Increment percentual</option>
                            <option>Ús de quota</option>
                            <option>Anomalia detectada</option>
                          </select>
                        </div>
                      </div>
                      <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                        Crear Alerta
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Projeccions i Recomanacions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, projections: !prev.projections }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Projeccions de Creixement</h3>
                      <p className="text-sm text-gray-600 mt-1">Prediccions i recomanacions d'estalvi</p>
                    </div>
                  </div>
                  {expandedSections.projections ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.projections && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Gràfic de Projecció */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Projecció de Costos (6 mesos)</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-6 gap-2 h-40">
                          {[
                            { month: 'Gen', actual: 8947, projected: 9200 },
                            { month: 'Feb', actual: null, projected: 9850 },
                            { month: 'Mar', actual: null, projected: 10400 },
                            { month: 'Abr', actual: null, projected: 10950 },
                            { month: 'Mai', actual: null, projected: 11200 },
                            { month: 'Jun', actual: null, projected: 11650 }
                          ].map((data, idx) => (
                            <div key={idx} className="flex flex-col justify-end items-center">
                              <div className="w-full bg-gray-200 rounded mb-2" style={{ height: `${(data.projected / 12000) * 100}%` }}>
                                {data.actual && (
                                  <div className="w-full bg-blue-500 rounded" style={{ height: `${(data.actual / data.projected) * 100}%` }} />
                                )}
                              </div>
                              <div className="text-xs text-gray-600">{data.month}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-blue-500 rounded" />
                            <span>Cost actual</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-300 rounded" />
                            <span>Projecció</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recomanacions d'Estalvi */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Recomanacions d'Estalvi Prioritzades
                      </h4>
                      <div className="space-y-3">
                        {[
                          {
                            title: 'Implementar Reserved Instances',
                            description: 'Canviar 4 instàncies EC2 a Reserved Instances (1 any)',
                            savings: 247,
                            effort: 'Baix',
                            timeframe: '1 setmana',
                            impact: 'Alt'
                          },
                          {
                            title: 'Optimitzar S3 Storage Classes',
                            description: 'Moure arxius antics a S3 Glacier i eliminar duplicats',
                            savings: 156,
                            effort: 'Mitjà',
                            timeframe: '2 setmanes',
                            impact: 'Mitjà'
                          },
                          {
                            title: 'Configurar Auto-Scaling intel·ligent',
                            description: 'Ajustar horaris d\'escalat basat en patrons d\'ús reals',
                            savings: 89,
                            effort: 'Alt',
                            timeframe: '1 mes',
                            impact: 'Continu'
                          },
                          {
                            title: 'Negociar Descuentos por Volum',
                            description: 'Contactar amb AWS per descuentes Enterprise',
                            savings: 312,
                            effort: 'Mitjà',
                            timeframe: '3 mesos',
                            impact: 'Alt'
                          }
                        ].map((rec, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{rec.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">€{rec.savings}/mes</div>
                                <div className="text-xs text-gray-500">{rec.timeframe}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <span className={`px-2 py-1 text-xs rounded ${
                                rec.effort === 'Baix' ? 'bg-green-100 text-green-800' :
                                rec.effort === 'Mitjà' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                Esforç: {rec.effort}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                rec.impact === 'Alt' ? 'bg-purple-100 text-purple-800' :
                                rec.impact === 'Mitjà' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                Impacte: {rec.impact}
                              </span>
                              <button className="ml-auto text-sm text-indigo-600 hover:text-indigo-700">
                                Implementar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resum Final */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h5 className="font-medium text-indigo-900 mb-3">Resum d'Optimització</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-900">€804</div>
                          <div className="text-sm text-indigo-700">Estalvi mensual potencial</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-900">47%</div>
                          <div className="text-sm text-indigo-700">Reducció de costos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-900">3</div>
                          <div className="text-sm text-indigo-700">Mesos de ROI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documentacion' && (
            <div className="space-y-6">
              {/* Dashboard de Documentació */}
              <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Wiki Tècnica i Documentació</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">847</div>
                    <div className="text-sm opacity-90">Documents totals</div>
                    <div className="text-xs opacity-75 mt-1">↑ 23 aquesta setmana</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm opacity-90">APIs documentades</div>
                    <div className="text-xs opacity-75 mt-1">12 actualitzades avui</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">98.7%</div>
                    <div className="text-sm opacity-90">Enllaços vàlids</div>
                    <div className="text-xs opacity-75 mt-1">Última validació: fa 2h</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-2xl font-bold">34</div>
                    <div className="text-sm opacity-90">Runbooks actius</div>
                    <div className="text-xs opacity-75 mt-1">3 actualitzats recentment</div>
                  </div>
                </div>
              </div>

              {/* Cerca Avançada */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cercar en documentació... (APIs, runbooks, arquitectura, procediments)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select className="px-4 py-3 border border-gray-300 rounded-lg">
                    <option>Tots els tipus</option>
                    <option>Arquitectura</option>
                    <option>APIs</option>
                    <option>Runbooks</option>
                    <option>Deployment</option>
                    <option>Recuperació</option>
                  </select>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Cercar
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200">
                    tag:microservices
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200">
                    author:tech-team
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200">
                    updated:last-week
                  </span>
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200">
                    type:api
                  </span>
                </div>
              </div>

              {/* Arxius d'Arquitectura */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, architecture: !prev.architecture }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Arxius d'Arquitectura del Sistema</h3>
                      <p className="text-sm text-gray-600 mt-1">Diagrames, especificacions i documentació tècnica</p>
                    </div>
                  </div>
                  {expandedSections.architecture ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.architecture && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Categories d'Arquitectura */}
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        {
                          category: 'Diagrames de Sistema',
                          icon: Monitor,
                          documents: [
                            { name: 'Arquitectura General v3.2', type: 'C4 Diagram', updated: 'Fa 2 dies', status: 'current' },
                            { name: 'Microserveis Overview', type: 'Service Map', updated: 'Fa 1 setmana', status: 'current' },
                            { name: 'Flux de Dades', type: 'Data Flow', updated: 'Fa 3 dies', status: 'current' },
                            { name: 'Infraestructura AWS', type: 'Infrastructure', updated: 'Avui', status: 'draft' }
                          ]
                        },
                        {
                          category: 'Especificacions Tècniques',
                          icon: FileCode,
                          documents: [
                            { name: 'Database Schema v2.1', type: 'ERD', updated: 'Fa 4 dies', status: 'current' },
                            { name: 'Security Architecture', type: 'Spec', updated: 'Fa 1 setmana', status: 'current' },
                            { name: 'API Gateway Config', type: 'Config', updated: 'Fa 2 dies', status: 'current' },
                            { name: 'Monitoring Stack', type: 'Spec', updated: 'Fa 5 dies', status: 'current' }
                          ]
                        },
                        {
                          category: 'Decisions Arquitectòniques',
                          icon: GitBranch,
                          documents: [
                            { name: 'ADR-001: Microservices', type: 'ADR', updated: 'Fa 2 mesos', status: 'accepted' },
                            { name: 'ADR-002: Database Strategy', type: 'ADR', updated: 'Fa 1 mes', status: 'accepted' },
                            { name: 'ADR-003: Caching Layer', type: 'ADR', updated: 'Fa 3 setmanes', status: 'accepted' },
                            { name: 'ADR-004: Event Sourcing', type: 'ADR', updated: 'Fa 1 setmana', status: 'proposed' }
                          ]
                        }
                      ].map((cat, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <cat.icon className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">{cat.category}</span>
                          </div>
                          <div className="space-y-3">
                            {cat.documents.map((doc, docIdx) => (
                              <div key={docIdx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                                  <div className="text-xs text-gray-600 flex items-center gap-2">
                                    <span>{doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.updated}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    doc.status === 'current' ? 'bg-green-100 text-green-800' :
                                    doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                    doc.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {doc.status}
                                  </span>
                                  <button className="text-indigo-600 hover:text-indigo-700">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button className="mt-3 w-full text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded py-2">
                            + Afegir Document
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Generador Automàtic */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-3">Generació Automàtica de Diagrames</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="p-3 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Generar ERD</span>
                          </div>
                          <div className="text-sm text-blue-700">Des de l'esquema actual de BD</div>
                        </button>
                        <button className="p-3 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Mapa de Serveis</span>
                          </div>
                          <div className="text-sm text-blue-700">Des del codi i configuració</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Documentació d'APIs */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, apiDocs: !prev.apiDocs }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Documentació d'APIs</h3>
                      <p className="text-sm text-gray-600 mt-1">Especificacions OpenAPI, exemples i testing interactiu</p>
                    </div>
                  </div>
                  {expandedSections.apiDocs ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.apiDocs && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* APIs Actives */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">APIs Documentades Automàticament</h4>
                      <div className="space-y-3">
                        {[
                          { 
                            name: 'User Management API v2.1', 
                            status: 'active', 
                            endpoints: 47, 
                            coverage: 98, 
                            lastSync: 'Fa 15 min',
                            swagger: true,
                            tests: 156
                          },
                          { 
                            name: 'Payment Processing API v1.8', 
                            status: 'active', 
                            endpoints: 23, 
                            coverage: 95, 
                            lastSync: 'Fa 1h',
                            swagger: true,
                            tests: 89
                          },
                          { 
                            name: 'Notification Service API v1.2', 
                            status: 'warning', 
                            endpoints: 12, 
                            coverage: 67, 
                            lastSync: 'Fa 2 dies',
                            swagger: false,
                            tests: 23
                          },
                          { 
                            name: 'Analytics API v3.0', 
                            status: 'draft', 
                            endpoints: 34, 
                            coverage: 23, 
                            lastSync: 'Mai',
                            swagger: false,
                            tests: 0
                          }
                        ].map((api, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${
                                api.status === 'active' ? 'bg-green-500' :
                                api.status === 'warning' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`} />
                              <div>
                                <div className="font-medium text-gray-900">{api.name}</div>
                                <div className="text-sm text-gray-600">
                                  {api.endpoints} endpoints • {api.coverage}% cobertura • Sync: {api.lastSync}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                {api.swagger && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">OpenAPI</span>
                                )}
                                {api.tests > 0 && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{api.tests} tests</span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <button className="p-1 text-indigo-600 hover:text-indigo-700">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-green-600 hover:text-green-700">
                                  <Play className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-gray-700">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generació Automàtica */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-900 mb-3">Generació Automàtica</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-green-300">
                          <div>
                            <div className="font-medium text-green-900">OpenAPI Spec Generation</div>
                            <div className="text-sm text-green-700">Des d'anotacions en codi</div>
                          </div>
                          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Executar
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-green-300">
                          <div>
                            <div className="font-medium text-green-900">Postman Collections</div>
                            <div className="text-sm text-green-700">Generar col·leccions per testing</div>
                          </div>
                          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Generar
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-green-300">
                          <div>
                            <div className="font-medium text-green-900">SDK Documentation</div>
                            <div className="text-sm text-green-700">Documentació per múltiples llenguatges</div>
                          </div>
                          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Generar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Runbooks Operatius */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, runbooks: !prev.runbooks }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-orange-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Runbooks Operatius</h3>
                      <p className="text-sm text-gray-600 mt-1">Procediments d'operacions, deployment i recuperació</p>
                    </div>
                  </div>
                  {expandedSections.runbooks ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.runbooks && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Categories de Runbooks */}
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        {
                          category: 'Deployment & Releases',
                          icon: Upload,
                          color: 'blue',
                          procedures: [
                            { name: 'Production Deployment', steps: 12, avgTime: '45 min', lastUsed: 'Avui', difficulty: 'Medium' },
                            { name: 'Hotfix Deployment', steps: 8, avgTime: '15 min', lastUsed: 'Fa 3 dies', difficulty: 'Low' },
                            { name: 'Database Migration', steps: 15, avgTime: '2h', lastUsed: 'Fa 1 setmana', difficulty: 'High' },
                            { name: 'Feature Flag Rollout', steps: 6, avgTime: '10 min', lastUsed: 'Ahir', difficulty: 'Low' }
                          ]
                        },
                        {
                          category: 'Incident Response',
                          icon: AlertCircle,
                          color: 'red',
                          procedures: [
                            { name: 'Service Down Recovery', steps: 18, avgTime: '30 min', lastUsed: 'Fa 2 setmanes', difficulty: 'High' },
                            { name: 'Database Corruption', steps: 24, avgTime: '3h', lastUsed: 'Fa 3 mesos', difficulty: 'Critical' },
                            { name: 'Memory Leak Investigation', steps: 10, avgTime: '1h', lastUsed: 'Fa 1 mes', difficulty: 'Medium' },
                            { name: 'Security Incident Response', steps: 16, avgTime: '1.5h', lastUsed: 'Fa 6 mesos', difficulty: 'High' }
                          ]
                        },
                        {
                          category: 'Maintenance & Monitoring',
                          icon: Settings,
                          color: 'green',
                          procedures: [
                            { name: 'Weekly Health Check', steps: 8, avgTime: '30 min', lastUsed: 'Fa 2 dies', difficulty: 'Low' },
                            { name: 'Log Rotation & Cleanup', steps: 5, avgTime: '15 min', lastUsed: 'Ahir', difficulty: 'Low' },
                            { name: 'Certificate Renewal', steps: 12, avgTime: '1h', lastUsed: 'Fa 1 mes', difficulty: 'Medium' },
                            { name: 'Backup Verification', steps: 9, avgTime: '45 min', lastUsed: 'Fa 1 setmana', difficulty: 'Medium' }
                          ]
                        },
                        {
                          category: 'Scaling & Performance',
                          icon: TrendingUp,
                          color: 'purple',
                          procedures: [
                            { name: 'Auto-Scaling Configuration', steps: 14, avgTime: '2h', lastUsed: 'Fa 2 setmanes', difficulty: 'High' },
                            { name: 'Load Balancer Update', steps: 10, avgTime: '45 min', lastUsed: 'Fa 1 setmana', difficulty: 'Medium' },
                            { name: 'Cache Optimization', steps: 7, avgTime: '30 min', lastUsed: 'Fa 3 dies', difficulty: 'Low' },
                            { name: 'Database Performance Tuning', steps: 20, avgTime: '4h', lastUsed: 'Fa 1 mes', difficulty: 'Critical' }
                          ]
                        }
                      ].map((cat, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <cat.icon className={`w-5 h-5 text-${cat.color}-600`} />
                            <span className="font-medium text-gray-900">{cat.category}</span>
                          </div>
                          <div className="space-y-3">
                            {cat.procedures.map((proc, procIdx) => (
                              <div key={procIdx} className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium text-sm text-gray-900">{proc.name}</div>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    proc.difficulty === 'Low' ? 'bg-green-100 text-green-800' :
                                    proc.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    proc.difficulty === 'High' ? 'bg-red-100 text-red-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {proc.difficulty}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 flex justify-between">
                                  <span>{proc.steps} passos • {proc.avgTime}</span>
                                  <span>Últim ús: {proc.lastUsed}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Executor de Runbooks */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-900 mb-3">Executor Interactiu</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-orange-300">
                          <div>
                            <div className="font-medium text-orange-900">Guided Step Execution</div>
                            <div className="text-sm text-orange-700">Executar runbooks pas a pas amb validació</div>
                          </div>
                          <button className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                            Iniciar
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded border border-orange-300">
                          <div>
                            <div className="font-medium text-orange-900">Automation Templates</div>
                            <div className="text-sm text-orange-700">Generar scripts automàtics des de runbooks</div>
                          </div>
                          <button className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                            Generar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Templates i Control de Versions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, templates: !prev.templates }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Copy className="w-6 h-6 text-purple-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Templates i Control de Versions</h3>
                      <p className="text-sm text-gray-600 mt-1">Plantilles estandarditzades i historial de canvis</p>
                    </div>
                  </div>
                  {expandedSections.templates ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.templates && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Templates Estandarditzats */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Templates Estandarditzats</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { name: 'API Documentation', type: 'OpenAPI 3.0', usage: 89, icon: Code },
                          { name: 'Runbook Template', type: 'Markdown', usage: 67, icon: Terminal },
                          { name: 'Architecture Decision', type: 'ADR', usage: 34, icon: GitBranch },
                          { name: 'Incident Report', type: 'Post-mortem', usage: 23, icon: AlertCircle },
                          { name: 'Deployment Guide', type: 'Step-by-step', usage: 45, icon: Upload },
                          { name: 'Security Review', type: 'Checklist', usage: 12, icon: Shield }
                        ].map((template, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center gap-2 mb-3">
                              <template.icon className="w-5 h-5 text-purple-600" />
                              <span className="font-medium text-gray-900">{template.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{template.type}</div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">{template.usage} usos</div>
                              <button className="text-xs text-purple-600 hover:text-purple-700">
                                Usar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Control de Versions */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Historial de Canvis Recents</h4>
                      <div className="space-y-3">
                        {[
                          { 
                            document: 'User Management API v2.1', 
                            action: 'Updated', 
                            user: 'Anna García', 
                            time: 'Fa 15 min',
                            changes: '+3 endpoints, security improvements',
                            version: 'v2.1.0'
                          },
                          { 
                            document: 'Database Recovery Runbook', 
                            action: 'Created', 
                            user: 'Marc López', 
                            time: 'Fa 2h',
                            changes: 'New procedure for PostgreSQL recovery',
                            version: 'v1.0.0'
                          },
                          { 
                            document: 'Microservices Architecture', 
                            action: 'Updated', 
                            user: 'Sara Martín', 
                            time: 'Fa 4h',
                            changes: 'Added event sourcing patterns',
                            version: 'v3.2.1'
                          },
                          { 
                            document: 'Security Incident Response', 
                            action: 'Reviewed', 
                            user: 'David Ruiz', 
                            time: 'Ahir',
                            changes: 'Approved security updates',
                            version: 'v1.5.2'
                          }
                        ].map((change, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                change.action === 'Created' ? 'bg-green-500' :
                                change.action === 'Updated' ? 'bg-blue-500' :
                                'bg-purple-500'
                              }`} />
                              <div>
                                <div className="font-medium text-gray-900">{change.document}</div>
                                <div className="text-sm text-gray-600">
                                  {change.action} per {change.user} • {change.time}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{change.changes}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">{change.version}</div>
                              <div className="flex gap-1 mt-1">
                                <button className="text-xs text-indigo-600 hover:text-indigo-700">Veure</button>
                                <span className="text-xs text-gray-400">•</span>
                                <button className="text-xs text-indigo-600 hover:text-indigo-700">Diff</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Git Integration */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-900 mb-3">Integració amb Repositoris</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-purple-300">
                          <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-900">GitHub Sync</span>
                          </div>
                          <div className="text-sm text-purple-700 mb-2">Sincronització automàtica amb repositoris</div>
                          <div className="text-xs text-purple-600">Última sync: fa 5 min</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-purple-300">
                          <div className="flex items-center gap-2 mb-2">
                            <FileCode className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-900">Docs as Code</span>
                          </div>
                          <div className="text-sm text-purple-700 mb-2">Documentació versionada amb el codi</div>
                          <div className="text-xs text-purple-600">156 commits aquest mes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Validació Automàtica */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, validation: !prev.validation }))}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Validació Automàtica</h3>
                      <p className="text-sm text-gray-600 mt-1">Verificació d'enllaços, referències i qualitat del contingut</p>
                    </div>
                  </div>
                  {expandedSections.validation ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedSections.validation && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    {/* Estadístiques de Validació */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">Enllaços Vàlids</div>
                        <div className="text-2xl font-bold text-green-900">98.7%</div>
                        <div className="text-xs text-green-700 mt-1">2,847 de 2,884 enllaços</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-600 mb-1">Referències Obsoletes</div>
                        <div className="text-2xl font-bold text-yellow-900">23</div>
                        <div className="text-xs text-yellow-700 mt-1">Requereixen actualització</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">Documents Orfes</div>
                        <div className="text-2xl font-bold text-blue-900">8</div>
                        <div className="text-xs text-blue-700 mt-1">Sense referències entrants</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 mb-1">Qualitat Mitjana</div>
                        <div className="text-2xl font-bold text-purple-900">8.3/10</div>
                        <div className="text-xs text-purple-700 mt-1">Basat en mètriques automàtiques</div>
                      </div>
                    </div>

                    {/* Problemes Detectats */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Problemes Detectats</h4>
                      <div className="space-y-3">
                        {[
                          {
                            type: 'Enllaç trencat',
                            document: 'API Authentication Guide',
                            issue: 'https://old-auth.lapublica.cat/docs → 404',
                            severity: 'high',
                            suggestion: 'Actualitzar a https://auth.lapublica.cat/v2/docs'
                          },
                          {
                            type: 'Referència obsoleta',
                            document: 'Database Schema v2.1',
                            issue: 'Referència a taula "users_old" eliminada',
                            severity: 'medium',
                            suggestion: 'Actualitzar a nova taula "user_profiles"'
                          },
                          {
                            type: 'Document orfe',
                            document: 'Legacy API Migration',
                            issue: 'No té enllaços entrants',
                            severity: 'low',
                            suggestion: 'Afegir referències o archivar'
                          },
                          {
                            type: 'Contingut duplicat',
                            document: 'Deployment Guide v1 & v2',
                            issue: '67% contingut idèntic',
                            severity: 'medium',
                            suggestion: 'Consolidar en una sola versió'
                          }
                        ].map((issue, idx) => (
                          <div key={idx} className={`flex items-start justify-between p-3 border rounded-lg ${
                            issue.severity === 'high' ? 'border-red-200 bg-red-50' :
                            issue.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                            'border-gray-200 bg-gray-50'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                issue.severity === 'high' ? 'bg-red-500' :
                                issue.severity === 'medium' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`} />
                              <div>
                                <div className={`font-medium ${
                                  issue.severity === 'high' ? 'text-red-900' :
                                  issue.severity === 'medium' ? 'text-yellow-900' :
                                  'text-gray-900'
                                }`}>
                                  {issue.type} - {issue.document}
                                </div>
                                <div className={`text-sm mt-1 ${
                                  issue.severity === 'high' ? 'text-red-700' :
                                  issue.severity === 'medium' ? 'text-yellow-700' :
                                  'text-gray-600'
                                }`}>
                                  {issue.issue}
                                </div>
                                <div className="text-xs text-indigo-600 mt-1">
                                  💡 {issue.suggestion}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="text-xs text-indigo-600 hover:text-indigo-700">
                                Corregir
                              </button>
                              <button className="text-xs text-gray-600 hover:text-gray-700">
                                Ignorar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Configuració de Validació */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 className="font-medium text-green-900 mb-3">Configuració de Validacions</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-white rounded border border-green-300">
                          <span className="text-sm text-green-700">Validació d'enllaços (cada 6h)</span>
                          <div className="w-10 h-6 bg-green-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border border-green-300">
                          <span className="text-sm text-green-700">Detecció de duplicats</span>
                          <div className="w-10 h-6 bg-green-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border border-green-300">
                          <span className="text-sm text-green-700">Anàlisi de qualitat (ortografia, format)</span>
                          <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                        <button className="mt-3 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Executar Validació Completa
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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