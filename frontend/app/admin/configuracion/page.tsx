'use client'

import { useState } from 'react'
import { 
  Users, 
  Settings, 
  Shield, 
  Globe, 
  Link, 
  Search,
  Plus,
  Edit,
  Trash2,
  Ban,
  ChevronRight,
  Home,
  CheckCircle,
  XCircle,
  X,
  Bot
} from 'lucide-react'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: string // Cambiar a string para soportar roles dinámicos
  comunidad: string
  estado: 'Activo' | 'Suspendido' | 'Inactivo'
  fechaRegistro: string
  ultimoAcceso: string
}

const usuariosData: Usuario[] = [
  {
    id: '1',
    nombre: 'Marc Administrador',
    email: 'marc@lapublica.cat',
    rol: 'Admin',
    comunidad: 'Catalunya',
    estado: 'Activo',
    fechaRegistro: '2024-01-15',
    ultimoAcceso: '2024-08-23'
  },
  {
    id: '2',
    nombre: 'Ana Gestora',
    email: 'ana@madrid.lapublica.es',
    rol: 'Gestor',
    comunidad: 'Madrid',
    estado: 'Activo',
    fechaRegistro: '2024-02-20',
    ultimoAcceso: '2024-08-22'
  },
  {
    id: '3',
    nombre: 'TechCorp SA',
    email: 'contact@techcorp.com',
    rol: 'Empresa',
    comunidad: 'Catalunya',
    estado: 'Activo',
    fechaRegistro: '2024-03-10',
    ultimoAcceso: '2024-08-23'
  },
  {
    id: '4',
    nombre: 'Ajuntament Barcelona',
    email: 'admin@ajbcn.cat',
    rol: 'Administració',
    comunidad: 'Catalunya',
    estado: 'Activo',
    fechaRegistro: '2024-01-30',
    ultimoAcceso: '2024-08-20'
  },
  {
    id: '5',
    nombre: 'CCOO Catalunya',
    email: 'info@ccoo.cat',
    rol: 'Sindicat',
    comunidad: 'Catalunya',
    estado: 'Activo',
    fechaRegistro: '2024-04-05',
    ultimoAcceso: '2024-08-21'
  },
  {
    id: '6',
    nombre: 'Josep Empleat',
    email: 'josep@generalitat.cat',
    rol: 'Empleat',
    comunidad: 'Catalunya',
    estado: 'Suspendido',
    fechaRegistro: '2024-05-12',
    ultimoAcceso: '2024-08-15'
  }
]

export default function AdminConfiguracion() {
  const [activeSection, setActiveSection] = useState('usuarios')
  const [activeTab, setActiveTab] = useState('empleats')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterComunidad, setFilterComunidad] = useState<string>('all')
  const [filterEstado, setFilterEstado] = useState<string>('all')
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosData)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRoleConfigModal, setShowRoleConfigModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([])
  const [newRoleFields, setNewRoleFields] = useState<string[]>([])
  const [createUserRole, setCreateUserRole] = useState('')
  
  // Estados para configuración de agentes
  const [showAgentConfigModal, setShowAgentConfigModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const [activeAgentTab, setActiveAgentTab] = useState('overview')
  const [selectedLogAgent, setSelectedLogAgent] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('today')
  const [showConversationModal, setShowConversationModal] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  
  // Estados para configuración de alertas
  const [alertsConfig, setAlertsConfig] = useState({
    responseTime: {
      enabled: true,
      threshold: 3, // minutos
      urgency: 'medium'
    },
    errorsPerHour: {
      enabled: true,
      threshold: 5,
      urgency: 'high'
    },
    abnormalUsage: {
      enabled: true,
      threshold: 100, // porcentaje sobre la media
      urgency: 'medium'
    },
    downtime: {
      enabled: true,
      threshold: 2, // minutos
      urgency: 'critical'
    }
  })
  
  const [notificationConfig, setNotificationConfig] = useState({
    email: {
      enabled: true,
      addresses: ['admin@lapublica.cat', 'tech@lapublica.cat']
    },
    dashboard: {
      enabled: true,
      showPopups: true
    },
    webhook: {
      enabled: false,
      url: '',
      secret: ''
    }
  })
  
  const [alertsHistory, setAlertsHistory] = useState([
    {
      id: 'alert-001',
      type: 'responseTime',
      agent: 'Agent Administració Pública',
      message: 'Temps de resposta elevat: 4.2 minuts (llindar: 3min)',
      timestamp: '2024-08-24T14:45:22Z',
      urgency: 'medium',
      status: 'resolved',
      actionTaken: 'Reinici automàtic del servei',
      resolvedBy: 'Sistema automàtic',
      resolvedAt: '2024-08-24T14:47:15Z'
    },
    {
      id: 'alert-002',
      type: 'errorsPerHour',
      agent: 'Agent Contingut Web',
      message: '7 errors detectats en lúltima hora (llindar: 5)',
      timestamp: '2024-08-24T13:30:18Z',
      urgency: 'high',
      status: 'resolved',
      actionTaken: 'Revisió manual del model i actualització de prompts',
      resolvedBy: 'Marc Administrador',
      resolvedAt: '2024-08-24T14:15:33Z'
    },
    {
      id: 'alert-003',
      type: 'abnormalUsage',
      agent: 'Agent Empresarial',
      message: 'Ús anòmal detectat: +150% respecte la mitjana diària',
      timestamp: '2024-08-24T12:15:45Z',
      urgency: 'medium',
      status: 'acknowledged',
      actionTaken: 'Escalat a equip de monitorització',
      resolvedBy: null,
      resolvedAt: null
    },
    {
      id: 'alert-004',
      type: 'downtime',
      agent: 'Assistent General',
      message: 'Servei inactiu durant 3.5 minuts',
      timestamp: '2024-08-24T11:22:12Z',
      urgency: 'critical',
      status: 'resolved',
      actionTaken: 'Activació del servidor de backup i investigació de la causa',
      resolvedBy: 'Ana Gestora',
      resolvedAt: '2024-08-24T11:28:45Z'
    },
    {
      id: 'alert-005',
      type: 'responseTime',
      agent: 'Agent Contingut Web',
      message: 'Temps de resposta elevat: 3.8 minuts (llindar: 3min)',
      timestamp: '2024-08-24T10:05:33Z',
      urgency: 'medium',
      status: 'resolved',
      actionTaken: 'Optimització de consultes a la base de dades',
      resolvedBy: 'Sistema automàtic',
      resolvedAt: '2024-08-24T10:12:18Z'
    }
  ])

  // Configuración de campos por rol
  const [roleFieldsConfig, setRoleFieldsConfig] = useState<{[key: string]: string[]}>({
    'Empleat': ['Nick', 'Comunitat', 'Correu', 'Estat'],
    'Gestor': ['Nom', 'Comunitat', 'Correu', 'Estat'],
    'Empresa': ['Nom Empresa', 'Visibilitat', 'Pla col·laboració', 'Correu contacte', 'Telèfon'],
    'Administració': ['Nom', 'Tipus', 'Correu contacte', 'Telèfon'],
    'Sindicat': ['Nom Sindicat', 'Comunitat', 'Afiliats', 'Correu contacte', 'Telèfon']
  })
  
  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    comunidad: '',
    password: '',
    telefono: '',
    tipo: '',
    plan: '',
    afiliados: '',
    visibilidad: [] as string[]
  })

  // Estado del formulario de edición
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    email: '',
    rol: '',
    estado: '',
    comunidad: ''
  })
  
  // Lista de roles disponibles
  const [availableRoles, setAvailableRoles] = useState([
    'Admin', 'Gestor', 'Empresa', 'Administració', 'Sindicat', 'Empleat'
  ])

  // Configuración de agentes IA
  const [agentsConfig, setAgentsConfig] = useState({
    'empresarial': {
      name: 'Agent Empresarial',
      model: 'GPT-4 Turbo',
      systemPrompt: 'Ets un assistent especialitzat en consultes comercials i màrqueting per a empreses col·laboradores. Proporciona assessorament estratègic en vendes, processos de negoci i desenvolupament comercial.',
      usageLimit: 100,
      activeCommunities: ['Catalunya', 'Madrid', 'Euskadi'],
      usageLimitsByPlan: {
        'Bàsic': 50,
        'Pro': 100,
        'Premium': 200,
        'Enterprise': 500
      },
      allowedRoles: ['Empresa', 'Gestor', 'Admin'],
      humanEscalation: {
        enabled: true,
        threshold: 3,
        departments: ['Comercial', 'Màrqueting']
      },
      status: 'Actiu',
      requestsToday: 342
    },
    'administracio': {
      name: 'Agent Administració Pública',
      model: 'Claude 3 Opus',
      systemPrompt: 'Ets un expert en gestió administrativa del sector públic. Ajuda amb processos burocràtics, transparència, eficiència i normativa de les administracions públiques.',
      usageLimit: 200,
      activeCommunities: ['Catalunya', 'Madrid', 'Euskadi', 'Galicia'],
      usageLimitsByPlan: {
        'Bàsic': 100,
        'Pro': 200,
        'Premium': 400,
        'Enterprise': 1000
      },
      allowedRoles: ['Administració', 'Empleat', 'Gestor', 'Admin'],
      humanEscalation: {
        enabled: true,
        threshold: 2,
        departments: ['Assessoria Legal', 'Recursos Humans']
      },
      status: 'Actiu',
      requestsToday: 567
    },
    'contingut': {
      name: 'Agent Contingut Web',
      model: 'GPT-4',
      systemPrompt: 'Especialista en creació de contingut web, blogs i materials formatius. Genera contingut educatiu de qualitat, articles especialitzats i materials per a cursos del sector públic.',
      usageLimit: 75,
      activeCommunities: ['Catalunya', 'Madrid'],
      usageLimitsByPlan: {
        'Bàsic': 25,
        'Pro': 75,
        'Premium': 150,
        'Enterprise': 300
      },
      allowedRoles: ['Gestor', 'Editor', 'Admin'],
      humanEscalation: {
        enabled: true,
        threshold: 5,
        departments: ['Comunicació', 'Formació']
      },
      status: 'Actiu',
      requestsToday: 189
    },
    'general': {
      name: 'Assistent General',
      model: 'GPT-3.5 Turbo',
      systemPrompt: 'Ets un assistent general per a usuaris de La Pública. Respon preguntes freqüents, proporciona orientació bàsica i ofereix suport inicial sobre els serveis de la plataforma.',
      usageLimit: 50,
      activeCommunities: ['Catalunya', 'Madrid', 'Euskadi', 'Galicia', 'Andalucía'],
      usageLimitsByPlan: {
        'Bàsic': 25,
        'Pro': 50,
        'Premium': 100,
        'Enterprise': 200
      },
      allowedRoles: ['Empleat', 'Empresa', 'Administració', 'Sindicat', 'Gestor', 'Admin'],
      humanEscalation: {
        enabled: false,
        threshold: 10,
        departments: ['Suport Tècnic']
      },
      status: 'Actiu',
      requestsToday: 150
    }
  })

  // Datos mock para métricas y logs
  const conversationsData = [
    {
      id: 'conv-001',
      agent: 'Agent Empresarial',
      user: 'empresa@techcorp.com',
      startTime: '2024-08-24 14:30:15',
      duration: 2.3,
      messages: 8,
      status: 'completed',
      topic: 'estratègia màrqueting',
      satisfaction: 4.5,
      escalated: false
    },
    {
      id: 'conv-002', 
      agent: 'Agent Administració Pública',
      user: 'admin@ajbcn.cat',
      startTime: '2024-08-24 14:25:22',
      duration: 4.1,
      messages: 12,
      status: 'completed',
      topic: 'normativa transparència',
      satisfaction: 5.0,
      escalated: false
    },
    {
      id: 'conv-003',
      agent: 'Agent Contingut Web',
      user: 'gestor@lapublica.cat',
      startTime: '2024-08-24 14:20:08',
      duration: 6.7,
      messages: 15,
      status: 'escalated',
      topic: 'creació contingut blog',
      satisfaction: 3.2,
      escalated: true
    },
    {
      id: 'conv-004',
      agent: 'Assistent General',
      user: 'empleat@generalitat.cat',
      startTime: '2024-08-24 14:15:45',
      duration: 1.8,
      messages: 5,
      status: 'completed',
      topic: 'consulta general',
      satisfaction: 4.8,
      escalated: false
    }
  ]

  const metricsData = {
    hourlyUsage: {
      'Agent Empresarial': [12, 15, 18, 22, 28, 24, 19, 16, 21, 25, 30, 27],
      'Agent Administració Pública': [20, 25, 30, 35, 42, 38, 33, 28, 31, 36, 45, 41],
      'Agent Contingut Web': [8, 10, 12, 15, 18, 16, 13, 11, 14, 17, 20, 18],
      'Assistent General': [6, 8, 10, 12, 15, 13, 10, 8, 11, 13, 16, 14]
    },
    topTopics: [
      { topic: 'normativa transparència', count: 45, agent: 'Agent Administració Pública' },
      { topic: 'estratègia màrqueting', count: 32, agent: 'Agent Empresarial' },
      { topic: 'creació contingut', count: 28, agent: 'Agent Contingut Web' },
      { topic: 'consultes generals', count: 67, agent: 'Assistent General' },
      { topic: 'processos administratius', count: 38, agent: 'Agent Administració Pública' }
    ],
    alerts: [
      { type: 'error', message: 'Agent Contingut Web: 3 errors en les últimes 2 hores', timestamp: '14:45', severity: 'high' },
      { type: 'usage', message: 'Ús anòmal detectat: Agent Empresarial +150% respecte ahir', timestamp: '14:30', severity: 'medium' },
      { type: 'response', message: 'Temps de resposta elevat: Agent Administració Pública >5s', timestamp: '14:15', severity: 'low' }
    ]
  }

  const allPermissions = [
    'Gestió d\'usuaris',
    'Moderació de contingut', 
    'Accés a estadístiques',
    'Publicar ofertes',
    'Accés a candidats',
    'Gestió de grups',
    'Configuració del sistema',
    'Accés a fòrums',
    'Publicar comunicats',
    'Organitzar esdeveniments'
  ]

  const availableFields = [
    'Nom',
    'Nick', 
    'Email',
    'Correu contacte',
    'Telèfon',
    'Comunitat',
    'Estat',
    'Tipus',
    'Organització',
    'Departament',
    'Càrrec',
    'Especialitat',
    'Experiència',
    'Certificacions',
    'Localització',
    'Horari',
    'Salari',
    'Contracte',
    'Data inici',
    'Observacions'
  ]

  const handleCreateRole = () => {
    if (newRoleName.trim() && newRoleFields.length > 0) {
      // Añadir el nuevo rol
      setAvailableRoles([...availableRoles, newRoleName])
      
      // Guardar la configuración de campos para este rol
      setRoleFieldsConfig({
        ...roleFieldsConfig,
        [newRoleName]: newRoleFields
      })
      
      // Limpiar formulario
      setNewRoleName('')
      setNewRoleDescription('')
      setNewRolePermissions([])
      setNewRoleFields([])
      setShowCreateRoleModal(false)
      
      alert(`Rol "${newRoleName}" creat correctament amb ${newRoleFields.length} camps`)
    } else {
      alert('Si us plau, omple el nom del rol i selecciona almenys un camp')
    }
  }

  const handleEditAgent = (agentKey: string) => {
    setEditingAgent({
      key: agentKey,
      ...agentsConfig[agentKey as keyof typeof agentsConfig]
    })
    setShowAgentConfigModal(true)
  }

  const handleSaveAgentConfig = (updatedConfig: any) => {
    if (editingAgent) {
      const { key, ...config } = updatedConfig
      setAgentsConfig({
        ...agentsConfig,
        [key]: config
      })
      setShowAgentConfigModal(false)
      setEditingAgent(null)
      alert(`Configuració de "${config.name}" actualitzada correctament`)
    }
  }

  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario)
    // Cargar datos del usuario en el formulario de edición
    setEditFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
      comunidad: usuario.comunidad
    })
    setShowEditModal(true)
  }

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return
    
    // Validación básica
    if (!editFormData.nombre.trim() || !editFormData.email.trim()) {
      alert('Si us plau, omple els camps obligatoris')
      return
    }

    // Actualizar el usuario en la lista
    setUsuarios(usuarios.map(user => 
      user.id === editingUser.id 
        ? {
            ...user,
            nombre: editFormData.nombre.trim(),
            email: editFormData.email.trim(),
            rol: editFormData.rol as Usuario['rol'],
            estado: editFormData.estado as Usuario['estado'],
            comunidad: editFormData.comunidad
          }
        : user
    ))
    
    // Cerrar modal y limpiar estado
    setShowEditModal(false)
    setEditingUser(null)
    setEditFormData({
      nombre: '',
      email: '',
      rol: '',
      estado: '',
      comunidad: ''
    })
    
    // Mostrar confirmación
    alert(`Usuari "${editFormData.nombre}" actualitzat correctament`)
  }

  const handleSuspendUser = (id: string) => {
    setUsuarios(usuarios.map(user => 
      user.id === id 
        ? { ...user, estado: user.estado === 'Activo' ? 'Suspendido' : 'Activo' }
        : user
    ))
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsuarios(usuarios.filter(user => user.id !== id))
    }
  }

  const handleCreateUser = () => {
    // Encontrar el rol basado en la pestaña activa
    const currentTab = generateTabs().find(tab => tab.id === activeTab)
    if (currentTab) {
      setCreateUserRole(currentTab.role)
    } else {
      setCreateUserRole('')
    }
    setShowCreateModal(true)
  }

  const resetFormData = () => {
    setFormData({
      nombre: '',
      email: '',
      comunidad: '',
      password: '',
      telefono: '',
      tipo: '',
      plan: '',
      afiliados: '',
      visibilidad: []
    })
  }

  const handleSubmitCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación básica
    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert('Si us plau, omple els camps obligatoris')
      return
    }

    // Crear nuevo usuario
    const newUser: Usuario = {
      id: String(Date.now()), // ID temporal basado en timestamp
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      rol: createUserRole, // Ahora soporta cualquier string de rol
      comunidad: formData.comunidad || 'Catalunya',
      estado: 'Activo',
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimoAcceso: new Date().toISOString().split('T')[0]
    }

    // Añadir el nuevo usuario al listado
    setUsuarios([...usuarios, newUser])
    
    // Cerrar modal y resetear formulario
    setShowCreateModal(false)
    resetFormData()
    setCreateUserRole('')
    
    // Mostrar confirmación
    alert(`${createUserRole} "${formData.nombre}" creat correctament`)
  }

  const getFilteredUsersByRole = (roleType: string) => {
    return usuarios.filter(usuario => {
      const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Encontrar el rol correspondiente a la pestaña activa
      const currentTab = generateTabs().find(tab => tab.id === roleType)
      const matchesRoleType = currentTab ? usuario.rol === currentTab.role : false
      
      const matchesComunidad = filterComunidad === 'all' || usuario.comunidad === filterComunidad
      const matchesEstado = filterEstado === 'all' || usuario.estado === filterEstado
      
      return matchesSearch && matchesRoleType && matchesComunidad && matchesEstado
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Activo': return 'text-green-600 bg-green-100'
      case 'Suspendido': return 'text-red-600 bg-red-100'
      case 'Inactivo': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Función para generar pestañas dinámicamente
  const generateTabs = () => {
    const standardTabs = [
      { id: 'empleats', name: 'Empleats Públics', role: 'Empleat' },
      { id: 'gestors', name: 'Gestors', role: 'Gestor' },
      { id: 'empreses', name: 'Empreses', role: 'Empresa' },
      { id: 'administracions', name: 'Administracions', role: 'Administració' },
      { id: 'sindicats', name: 'Sindicats', role: 'Sindicat' }
    ]

    // Añadir pestañas para roles personalizados
    const customTabs = availableRoles
      .filter(role => !['Admin', 'Gestor', 'Empresa', 'Administració', 'Sindicat', 'Empleat'].includes(role))
      .map(role => ({
        id: role.toLowerCase().replace(/\s+/g, '-'),
        name: role + 's',
        role: role
      }))

    return [...standardTabs, ...customTabs]
  }

  // Función para generar formulario dinámico de creación por rol
  const generateCreateUserForm = (role: string) => {
    const fields = roleFieldsConfig[role] || ['Nom', 'Email', 'Estat']
    
    return (
      <div className="space-y-4">
        {fields.map((field, index) => {
          if (field === 'Nom' || field === 'Nick' || field === 'Nom Empresa' || field === 'Nom Sindicat') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field} *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`Introdueix el ${field.toLowerCase()}`}
                  required
                />
              </div>
            )
          }
          
          if (field === 'Email' || field === 'Correu' || field === 'Correu contacte') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="exemple@domini.com"
                  required
                />
              </div>
            )
          }
          
          if (field === 'Comunitat') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comunitat *</label>
                <select 
                  value={formData.comunidad}
                  onChange={(e) => setFormData({...formData, comunidad: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Selecciona comunitat</option>
                  <option value="Catalunya">Catalunya</option>
                  <option value="Madrid">Madrid</option>
                  <option value="Euskadi">Euskadi</option>
                  <option value="Galicia">Galicia</option>
                </select>
              </div>
            )
          }
          
          if (field === 'Telèfon') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telèfon</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+34 XXX XXX XXX"
                />
              </div>
            )
          }
          
          if (field === 'Tipus') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipus *</label>
                <select 
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecciona tipus</option>
                  <option value="Local">Local</option>
                  <option value="Autonòmica">Autonòmica</option>
                  <option value="Central">Central</option>
                  <option value="Estatal">Estatal</option>
                </select>
              </div>
            )
          }
          
          if (field === 'Pla col·laboració') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pla de col·laboració *</label>
                <select 
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Selecciona pla</option>
                  <option value="Bàsic">Bàsic</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            )
          }
          
          if (field === 'Afiliats') {
            return (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número d'afiliats</label>
                <input
                  type="number"
                  value={formData.afiliados}
                  onChange={(e) => setFormData({...formData, afiliados: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
            )
          }
          
          // Para campos que no tienen implementación específica, mostrar campo de texto genérico
          return (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={`Introdueix ${field.toLowerCase()}`}
              />
            </div>
          )
        })}
        
        {/* Campo de contraseña siempre presente para usuarios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contrasenya *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Contrasenya temporal"
            required
          />
        </div>
      </div>
    )
  }

  // Función para generar tabla dinámica por rol
  const generateRoleTable = (role: string, tabId: string) => {
    const fields = roleFieldsConfig[role] || ['Nom', 'Email', 'Estat']
    const filteredUsers = getFilteredUsersByRole(tabId)

    return (
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {fields.map(field => (
              <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {field}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredUsers.map(usuario => (
            <tr key={usuario.id} className="hover:bg-gray-50">
              {fields.map(field => (
                <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field === 'Estat' ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(usuario.estado)}`}>
                      {usuario.estado === 'Activo' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {usuario.estado === 'Suspendido' && <XCircle className="w-3 h-3 mr-1" />}
                      {usuario.estado}
                    </span>
                  ) : field === 'Nom' || field === 'Nick' || field === 'Nom Empresa' || field === 'Nom Sindicat' ? (
                    usuario.nombre
                  ) : field === 'Email' || field === 'Correu' || field === 'Correu contacte' ? (
                    usuario.email
                  ) : field === 'Comunitat' ? (
                    usuario.comunidad
                  ) : field === 'Visibilitat' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Totes</span>
                  ) : field === 'Pla col·laboració' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Pro</span>
                  ) : field === 'Telèfon' ? (
                    '+34 93 123 45 67'
                  ) : field === 'Tipus' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Local</span>
                  ) : field === 'Afiliats' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">2,456</span>
                  ) : (
                    '-'
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditUser(usuario)}
                    className="text-indigo-600 hover:text-indigo-900" 
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSuspendUser(usuario.id)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Suspender/Activar"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(usuario.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const sidebarSections = [
    { id: 'usuarios', name: 'Usuaris i Rols', icon: Users },
    { id: 'sistema', name: 'Configuració del Sistema', icon: Settings },
    { id: 'parametros', name: 'Paràmetres Generals', icon: Globe },
    { id: 'agents-ia', name: "Gestió d'Agents IA", icon: Bot },
    { id: 'seguridad', name: 'Seguretat', icon: Shield },
    { id: 'integraciones', name: 'Integracions', icon: Link }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Home className="w-4 h-4" />
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Configuració General</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configuració General</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {sidebarSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === 'usuarios' && (
            <div className="space-y-6">
              {/* Users Management Section with Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
                    {generateTabs().map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setSearchTerm('')
                          setFilterComunidad('all')
                          setFilterEstado('all')
                        }}
                        className={`${
                          activeTab === tab.id
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                      >
                        {tab.name}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                          activeTab === tab.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {usuarios.filter(u => u.rol === tab.role).length}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {generateTabs().find(tab => tab.id === activeTab)?.name || 'Usuaris'}
                    </h2>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowRoleConfigModal(true)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configuració de Rols
                      </button>
                      <button onClick={handleCreateUser} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {(() => {
                          const currentTab = generateTabs().find(tab => tab.id === activeTab)
                          if (!currentTab) return 'Nou Usuari'
                          
                          const role = currentTab.role
                          if (role === 'Empleat') return 'Nou Empleat'
                          if (role === 'Gestor') return 'Nou Gestor'  
                          if (role === 'Empresa') return 'Nova Empresa'
                          if (role === 'Administració') return 'Nova Administració'
                          if (role === 'Sindicat') return 'Nou Sindicat'
                          return `Nou ${role}`
                        })()}
                      </button>
                    </div>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder={`Cercar ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <select
                      value={filterComunidad}
                      onChange={(e) => setFilterComunidad(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">Totes les comunitats</option>
                      <option value="Catalunya">Catalunya</option>
                      <option value="Madrid">Madrid</option>
                    </select>
                    
                    <select
                      value={filterEstado}
                      onChange={(e) => setFilterEstado(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="all">Tots els estats</option>
                      <option value="Activo">Actiu</option>
                      <option value="Suspendido">Suspès</option>
                      <option value="Inactivo">Inactiu</option>
                    </select>
                  </div>

                  {/* Dynamic Role Tables */}
                  <div className="overflow-x-auto">
                    {(() => {
                      const currentTab = generateTabs().find(tab => tab.id === activeTab)
                      if (!currentTab) return <div>Pestaña no encontrada</div>
                      
                      return generateRoleTable(currentTab.role, activeTab)
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sección de Gestió d'Agents IA */}
          {activeSection === 'agents-ia' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bot className="w-7 h-7 text-blue-600" />
                        Gestió d'Agents IA
                      </h2>
                      <p className="text-gray-600 mt-1">Configura i gestiona els agents d'intel·ligència artificial del sistema</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Nou Agent
                    </button>
                  </div>
                </div>

                {/* Pestañas */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
                    <button
                      onClick={() => setActiveAgentTab('overview')}
                      className={`${
                        activeAgentTab === 'overview'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Visió General
                    </button>
                    <button
                      onClick={() => setActiveAgentTab('metrics')}
                      className={`${
                        activeAgentTab === 'metrics'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Mètriques i Logs
                    </button>
                    <button
                      onClick={() => setActiveAgentTab('alerts')}
                      className={`${
                        activeAgentTab === 'alerts'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Alertes Automàtiques
                    </button>
                  </nav>
                </div>

                {/* Contenido de las pestañas */}
                {activeAgentTab === 'overview' && (
                  <div className="p-6">
                    {/* Estadísticas de Agents */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Agents Actius</p>
                          <p className="text-2xl font-bold text-blue-900">4</p>
                        </div>
                        <Bot className="w-8 h-8 text-blue-500 opacity-50" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Peticions Avui</p>
                          <p className="text-2xl font-bold text-green-900">1,248</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
                          <span className="text-green-700 text-xs font-bold">↑</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-600 text-sm font-medium">Temps Resposta</p>
                          <p className="text-2xl font-bold text-yellow-900">0.8s</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
                          <span className="text-yellow-700 text-xs">⚡</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Taxa d'Èxit</p>
                          <p className="text-2xl font-bold text-purple-900">96.5%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-purple-500 opacity-50" />
                      </div>
                    </div>
                  </div>

                  {/* Lista de Agents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Agents Configurats</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Agent Empresarial */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Bot className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Agent Empresarial</h4>
                              <p className="text-xs text-gray-500">GPT-4 Turbo</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Actiu</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Consultes comercials, vendes i màrqueting per a empreses col·laboradores. Optimització de processos de negoci i estratègies de mercat</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>342 peticions avui</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleEditAgent('empresarial')}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Configurar agent"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Agent Administració Pública */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Bot className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Agent Administració Pública</h4>
                              <p className="text-xs text-gray-500">Claude 3 Opus</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Actiu</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Gestió administrativa, transparència i eficiència per a administracions. Suport en processos burocràtics i normativa pública</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>567 peticions avui</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleEditAgent('administracio')}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Configurar agent"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Agent Contingut Web */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Bot className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Agent Contingut Web</h4>
                              <p className="text-xs text-gray-500">GPT-4</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Actiu</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Suport per a blogs, cursos i creació de contingut. Generació d'articles, materials formatius i contingut educatiu especialitzat</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>189 peticions avui</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleEditAgent('contingut')}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Configurar agent"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Assistent General */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bot className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Assistent General</h4>
                              <p className="text-xs text-gray-500">GPT-3.5 Turbo</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Actiu</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Preguntes freqüents i consultes generals per a tots els usuaris. Informació bàsica, orientació i suport inicial</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>150 peticions avui</span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleEditAgent('general')}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Configurar agent"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuración Global */}
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuració Global</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Proveïdor IA per defecte</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>OpenAI GPT-4</option>
                          <option>Anthropic Claude 3</option>
                          <option>OpenAI GPT-3.5</option>
                          <option>Google Gemini</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Límit de peticions per usuari/dia</label>
                        <input 
                          type="number" 
                          defaultValue="50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Temps màxim de resposta (segons)</label>
                        <input 
                          type="number" 
                          defaultValue="30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode de moderació</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Estricte</option>
                          <option>Moderat</option>
                          <option>Permissiu</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Guardar Configuració
                      </button>
                    </div>
                  </div>
                  </div>
                )}

                {/* Pestaña de Mètriques i Logs */}
                {activeAgentTab === 'metrics' && (
                  <div className="p-6 space-y-6">
                    {/* Filtros */}
                    <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                        <select 
                          value={selectedLogAgent}
                          onChange={(e) => setSelectedLogAgent(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">Tots els agents</option>
                          <option value="empresarial">Agent Empresarial</option>
                          <option value="administracio">Agent Administració Pública</option>
                          <option value="contingut">Agent Contingut Web</option>
                          <option value="general">Assistent General</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Període</label>
                        <select 
                          value={selectedDateRange}
                          onChange={(e) => setSelectedDateRange(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="today">Avui</option>
                          <option value="yesterday">Ahir</option>
                          <option value="week">Última setmana</option>
                          <option value="month">Últim mes</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                          Actualitzar
                        </button>
                      </div>
                    </div>

                    {/* Alertes */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {metricsData.alerts.map((alert, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                          alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                              alert.severity === 'high' ? 'bg-red-500' :
                              alert.severity === 'medium' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                alert.severity === 'high' ? 'text-red-800' :
                                alert.severity === 'medium' ? 'text-yellow-800' :
                                'text-blue-800'
                              }`}>
                                {alert.type === 'error' ? '⚠️' : alert.type === 'usage' ? '📊' : '⏱️'} {alert.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gráficos de uso por hora */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ús per Hora (Avui)</h3>
                        <div className="space-y-4">
                          {Object.entries(metricsData.hourlyUsage).map(([agent, data]) => (
                            <div key={agent}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">{agent}</span>
                                <span className="text-sm text-gray-500">
                                  {data.reduce((a, b) => a + b, 0)} consultes
                                </span>
                              </div>
                              <div className="flex space-x-1 h-8">
                                {data.map((value, index) => (
                                  <div
                                    key={index}
                                    className="flex-1 bg-blue-200 rounded-sm relative"
                                    style={{ height: `${(value / Math.max(...data)) * 100}%` }}
                                    title={`${index + 12}:00 - ${value} consultes`}
                                  >
                                    <div 
                                      className="absolute bottom-0 w-full bg-blue-500 rounded-sm"
                                      style={{ height: `${(value / Math.max(...data)) * 100}%` }}
                                    ></div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>12:00</span>
                                <span>18:00</span>
                                <span>23:00</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temes Més Consultats</h3>
                        <div className="space-y-3">
                          {metricsData.topTopics.map((topic, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                                  <span className="text-sm text-gray-500">{topic.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(topic.count / Math.max(...metricsData.topTopics.map(t => t.count))) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{topic.agent}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tabla de conversaciones recientes */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Converses Recents</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Temps mitjà de resposta: <span className="font-medium">0.8s</span>
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversa</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuari</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durada</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missatges</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estat</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satisfacció</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {conversationsData.map((conv) => (
                              <tr key={conv.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm text-gray-900 font-mono">{conv.id}</td>
                                <td className="px-4 py-4 text-sm text-gray-900">{conv.agent}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{conv.user}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{conv.topic}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{conv.duration}min</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{conv.messages}</td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    conv.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    conv.status === 'escalated' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {conv.status}
                                    {conv.escalated && ' 🆘'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <div className="flex items-center">
                                    <span className="text-gray-900">{conv.satisfaction}</span>
                                    <span className="text-yellow-400 ml-1">⭐</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                  <button 
                                    onClick={() => {
                                      setSelectedConversation(conv)
                                      setShowConversationModal(true)
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Veure detalls
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholder content for other sections */}
          {activeSection !== 'usuarios' && activeSection !== 'agents-ia' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Settings className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {sidebarSections.find(s => s.id === activeSection)?.name}
              </h2>
              <p className="text-gray-600">
                Aquesta secció està en desenvolupament
              </p>
            </div>
          )}

          {/* Modal de Configuració de Rols */}
          {showRoleConfigModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-2/3 max-w-5xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900">Gestió de Rols del Sistema</h3>
                    <button
                      onClick={() => setShowRoleConfigModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Rols Existents</h4>
                    <button
                      onClick={() => setShowCreateRoleModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Crear Nou Rol
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableRoles.map((role, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-800 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-blue-600" />
                            {role}
                          </h5>
                          <div className="flex gap-1">
                            <button 
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Editar rol"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Eliminar rol"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {usuarios.filter(u => u.rol === role).length} usuaris assignats
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Permisos per Rol</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Permís</th>
                            {availableRoles.map(role => (
                              <th key={role} className="px-2 py-2 text-center font-medium text-gray-600 min-w-20">{role}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {allPermissions.map((permission, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-gray-700">{permission}</td>
                              {availableRoles.map(role => (
                                <td key={`${role}-${idx}`} className="px-2 py-2 text-center">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    defaultChecked={Math.random() > 0.5} // Simulant permisos aleatoris
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Guardar Canvis
                    </button>
                    <button
                      onClick={() => setShowRoleConfigModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Tancar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Crear Nou Rol */}
          {showCreateRoleModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Crear Nou Rol</h3>
                    <button
                      onClick={() => setShowCreateRoleModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleCreateRole(); }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom del Rol *</label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Ex: Moderador, Supervisor..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripció</label>
                      <textarea
                        value={newRoleDescription}
                        onChange={(e) => setNewRoleDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Descripció del rol i les seves responsabilitats..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Permisos</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {allPermissions.map((permission, idx) => (
                          <label key={idx} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRolePermissions.includes(permission)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRolePermissions([...newRolePermissions, permission])
                                } else {
                                  setNewRolePermissions(newRolePermissions.filter(p => p !== permission))
                                }
                              }}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Camps del Perfil *</label>
                      <p className="text-xs text-gray-500 mb-2">Selecciona els camps que apareixeran a la taula d'aquest rol:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {availableFields.map((field, idx) => (
                          <label key={idx} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newRoleFields.includes(field)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRoleFields([...newRoleFields, field])
                                } else {
                                  setNewRoleFields(newRoleFields.filter(f => f !== field))
                                }
                              }}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">{field}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{newRoleFields.length} camps seleccionats</p>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateRoleModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel·lar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        Crear Rol
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Creación de Usuario */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {createUserRole ? `Crear Nou ${createUserRole}` : 'Crear Nou Usuari'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setCreateUserRole('')
                        resetFormData()
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitCreateUser} className="space-y-4">
                    {/* Formulario dinámico basado en la configuración del rol */}
                    {createUserRole && generateCreateUserForm(createUserRole)}
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false)
                          setCreateUserRole('')
                          resetFormData()
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel·lar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                      >
                        {createUserRole ? `Crear ${createUserRole}` : 'Crear Usuari'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Edición de Usuario */}
          {showEditModal && editingUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Editar Usuari</h3>
                    <button
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingUser(null)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveEditUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        value={editFormData.nombre}
                        onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                      <select 
                        value={editFormData.rol}
                        onChange={(e) => setEditFormData({...editFormData, rol: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        {availableRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estat *</label>
                      <select 
                        value={editFormData.estado}
                        onChange={(e) => setEditFormData({...editFormData, estado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      >
                        <option value="Activo">Actiu</option>
                        <option value="Suspendido">Suspès</option>
                        <option value="Inactivo">Inactiu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comunitat</label>
                      <select 
                        value={editFormData.comunidad}
                        onChange={(e) => setEditFormData({...editFormData, comunidad: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Catalunya">Catalunya</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Euskadi">Euskadi</option>
                        <option value="Galicia">Galicia</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false)
                          setEditingUser(null)
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel·lar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      >
                        Guardar Canvis
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Detalls de Conversa */}
          {showConversationModal && selectedConversation && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-5 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                      <Bot className="w-6 h-6 text-blue-600" />
                      Detalls de Conversa - {selectedConversation.id}
                    </h3>
                    <button
                      onClick={() => {
                        setShowConversationModal(false)
                        setSelectedConversation(null)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Agent</label>
                        <p className="text-sm text-gray-900">{selectedConversation.agent}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Usuari</label>
                        <p className="text-sm text-gray-900">{selectedConversation.user}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tema Principal</label>
                        <p className="text-sm text-gray-900">{selectedConversation.topic}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Durada</label>
                        <p className="text-sm text-gray-900">{selectedConversation.duration} minuts</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Missatges Totals</label>
                        <p className="text-sm text-gray-900">{selectedConversation.messages}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Satisfacció</label>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{selectedConversation.satisfaction}/5</span>
                          <span className="text-yellow-400 ml-1">⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Transcripció de la Conversa</h4>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                      {/* Mock conversation messages */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex">
                          <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                            <div className="text-xs text-gray-500 mb-1">Usuari - 14:30:15</div>
                            <p className="text-sm">
                              Hola, necessito ajuda amb l'estratègia de màrqueting per a la nostra empresa.
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
                            <div className="text-xs text-gray-500 mb-1">Agent Empresarial - 14:30:18</div>
                            <p className="text-sm">
                              Hola! Estaré encantat d'ajudar-te amb l'estratègia de màrqueting. Pots explicar-me quin és el teu sector i objectius principals?
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                            <div className="text-xs text-gray-500 mb-1">Usuari - 14:30:45</div>
                            <p className="text-sm">
                              Som una empresa tecnològica que desenvolupa aplicacions per al sector públic. Volem millorar la nostra presència digital.
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-green-100 rounded-lg p-3 max-w-xs">
                            <div className="text-xs text-gray-500 mb-1">Agent Empresarial - 14:31:02</div>
                            <p className="text-sm">
                              Excel·lent! Per al sector públic, és clau establir credibilitat i transparència. Et recomano començar amb...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Mètriques Tècniques</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">0.8s</div>
                        <div className="text-xs text-gray-500">Temps mitjà resposta</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-xs text-gray-500">Precisió de resposta</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">3</div>
                        <div className="text-xs text-gray-500">Topics identificats</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedConversation.escalated ? 'Sí' : 'No'}
                        </div>
                        <div className="text-xs text-gray-500">Escalat a humà</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                    <button
                      onClick={() => {
                        setShowConversationModal(false)
                        setSelectedConversation(null)
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Tancar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

                {/* Pestaña de Alertes Automàtiques */}
                {activeAgentTab === 'alerts' && (
                  <div className="p-6 space-y-6">
                    {/* Configuración de alertas */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                          Configuració d'Alertes Automàtiques
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Defineix umbrals personalitzables i opcions de notificació per monitoritzar el rendiment dels agents IA
                        </p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Configuración de umbrales */}
                          <div className="space-y-6">
                            <h4 className="text-md font-medium text-gray-900">Umbrals d'Alerta</h4>
                            
                            {/* Temps de resposta */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Temps de Resposta</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={alertsConfig.responseTime.enabled}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      responseTime: { ...alertsConfig.responseTime, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Llindar (minuts)</label>
                                  <input
                                    type="number"
                                    value={alertsConfig.responseTime.threshold}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      responseTime: { ...alertsConfig.responseTime, threshold: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="60"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Urgència</label>
                                  <select
                                    value={alertsConfig.responseTime.urgency}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      responseTime: { ...alertsConfig.responseTime, urgency: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Mitjana</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Crítica</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Errors per hora */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Errors per Hora</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={alertsConfig.errorsPerHour.enabled}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      errorsPerHour: { ...alertsConfig.errorsPerHour, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Llindar (errors/h)</label>
                                  <input
                                    type="number"
                                    value={alertsConfig.errorsPerHour.threshold}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      errorsPerHour: { ...alertsConfig.errorsPerHour, threshold: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Urgència</label>
                                  <select
                                    value={alertsConfig.errorsPerHour.urgency}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      errorsPerHour: { ...alertsConfig.errorsPerHour, urgency: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Mitjana</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Crítica</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Ús anòmal */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Ús Anòmal</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={alertsConfig.abnormalUsage.enabled}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      abnormalUsage: { ...alertsConfig.abnormalUsage, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Llindar (% sobre mitjana)</label>
                                  <input
                                    type="number"
                                    value={alertsConfig.abnormalUsage.threshold}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      abnormalUsage: { ...alertsConfig.abnormalUsage, threshold: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    min="50"
                                    max="500"
                                    step="10"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Urgència</label>
                                  <select
                                    value={alertsConfig.abnormalUsage.urgency}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      abnormalUsage: { ...alertsConfig.abnormalUsage, urgency: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Mitjana</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Crítica</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Temps d'inactivitat */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Temps d'Inactivitat</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={alertsConfig.downtime.enabled}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      downtime: { ...alertsConfig.downtime, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Llindar (minuts)</label>
                                  <input
                                    type="number"
                                    value={alertsConfig.downtime.threshold}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      downtime: { ...alertsConfig.downtime, threshold: Number(e.target.value) }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="30"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Urgència</label>
                                  <select
                                    value={alertsConfig.downtime.urgency}
                                    onChange={(e) => setAlertsConfig({
                                      ...alertsConfig,
                                      downtime: { ...alertsConfig.downtime, urgency: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="low">Baixa</option>
                                    <option value="medium">Mitjana</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Crítica</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Configuración de notificaciones */}
                          <div className="space-y-6">
                            <h4 className="text-md font-medium text-gray-900">Opcions de Notificació</h4>
                            
                            {/* Email */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Notificacions per Email</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={notificationConfig.email.enabled}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      email: { ...notificationConfig.email, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Adreces de destinació</label>
                                <div className="space-y-2">
                                  {notificationConfig.email.addresses.map((email, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                          const newAddresses = [...notificationConfig.email.addresses]
                                          newAddresses[index] = e.target.value
                                          setNotificationConfig({
                                            ...notificationConfig,
                                            email: { ...notificationConfig.email, addresses: newAddresses }
                                          })
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                        placeholder="email@example.com"
                                      />
                                      <button
                                        onClick={() => {
                                          const newAddresses = notificationConfig.email.addresses.filter((_, i) => i !== index)
                                          setNotificationConfig({
                                            ...notificationConfig,
                                            email: { ...notificationConfig.email, addresses: newAddresses }
                                          })
                                        }}
                                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => {
                                      setNotificationConfig({
                                        ...notificationConfig,
                                        email: {
                                          ...notificationConfig.email,
                                          addresses: [...notificationConfig.email.addresses, '']
                                        }
                                      })
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Afegir adreça
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Dashboard */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Notificacions al Dashboard</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={notificationConfig.dashboard.enabled}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      dashboard: { ...notificationConfig.dashboard, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={notificationConfig.dashboard.showPopups}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      dashboard: { ...notificationConfig.dashboard, showPopups: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-700">Mostrar pop-ups emergents</span>
                                </label>
                              </div>
                            </div>

                            {/* Webhook */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-700">Webhook</label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={notificationConfig.webhook.enabled}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      webhook: { ...notificationConfig.webhook, enabled: e.target.checked }
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                  />
                                  <span className="text-sm text-gray-600">Activat</span>
                                </label>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">URL del webhook</label>
                                  <input
                                    type="url"
                                    value={notificationConfig.webhook.url}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      webhook: { ...notificationConfig.webhook, url: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/webhook"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Secret (opcional)</label>
                                  <input
                                    type="password"
                                    value={notificationConfig.webhook.secret}
                                    onChange={(e) => setNotificationConfig({
                                      ...notificationConfig,
                                      webhook: { ...notificationConfig.webhook, secret: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••••••"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botón de guardar configuración */}
                        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                          <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                            Guardar Configuració d'Alertes
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Historial de alertas */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          Historial d'Alertes
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Registre complet de totes les alertes enviades amb timestamps i accions preses
                        </p>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipus</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missatge</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgència</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estat</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acció Presa</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolt per</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {alertsHistory.map((alert) => (
                              <tr key={alert.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(alert.timestamp).toLocaleString('ca-ES')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {alert.agent}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    alert.type === 'responseTime' ? 'bg-blue-100 text-blue-800' :
                                    alert.type === 'errorsPerHour' ? 'bg-red-100 text-red-800' :
                                    alert.type === 'abnormalUsage' ? 'bg-yellow-100 text-yellow-800' :
                                    alert.type === 'downtime' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {alert.type === 'responseTime' ? 'Temps Resposta' :
                                     alert.type === 'errorsPerHour' ? 'Errors/Hora' :
                                     alert.type === 'abnormalUsage' ? 'Ús Anòmal' :
                                     alert.type === 'downtime' ? 'Inactivitat' : alert.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                  {alert.message}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    alert.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                                    alert.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                                    alert.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {alert.urgency === 'critical' ? 'Crítica' :
                                     alert.urgency === 'high' ? 'Alta' :
                                     alert.urgency === 'medium' ? 'Mitjana' : 'Baixa'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                    alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {alert.status === 'resolved' ? 'Resolta' :
                                     alert.status === 'acknowledged' ? 'Confirmada' : 'Pendent'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                  {alert.actionTaken}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {alert.resolvedBy || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

          {/* Modal de Configuració d'Agents IA */}
          {showAgentConfigModal && editingAgent && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-5 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                      <Bot className="w-6 h-6 text-blue-600" />
                      Configuració - {editingAgent.name}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAgentConfigModal(false)
                        setEditingAgent(null)
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={(e) => { 
                    e.preventDefault()
                    handleSaveAgentConfig(editingAgent)
                  }} className="space-y-6">
                    
                    {/* Informació bàsica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'Agent</label>
                        <input
                          type="text"
                          value={editingAgent.name}
                          onChange={(e) => setEditingAgent({...editingAgent, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model IA</label>
                        <select 
                          value={editingAgent.model}
                          onChange={(e) => setEditingAgent({...editingAgent, model: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>GPT-4 Turbo</option>
                          <option>GPT-4</option>
                          <option>GPT-3.5 Turbo</option>
                          <option>Claude 3 Opus</option>
                          <option>Claude 3 Sonnet</option>
                          <option>Gemini Pro</option>
                        </select>
                      </div>
                    </div>

                    {/* Prompt del Sistema */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prompt del Sistema</label>
                      <textarea
                        value={editingAgent.systemPrompt}
                        onChange={(e) => setEditingAgent({...editingAgent, systemPrompt: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Defineix el comportament i especialització de l'agent..."
                      />
                      <p className="text-xs text-gray-500 mt-1">Aquest prompt defineix la personalitat i especialització de l'agent</p>
                    </div>

                    {/* Límits d'ús per plans de suscripció */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Límits per pla de suscripció</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(editingAgent.usageLimitsByPlan || {}).map(([plan, limit]) => (
                          <div key={plan}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{plan}</label>
                            <input
                              type="number"
                              value={limit}
                              onChange={(e) => setEditingAgent({
                                ...editingAgent,
                                usageLimitsByPlan: {
                                  ...editingAgent.usageLimitsByPlan,
                                  [plan]: parseInt(e.target.value)
                                }
                              })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="1"
                              max="2000"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Peticions per usuari/dia segons el pla de subscripció de l'empresa</p>
                    </div>

                    {/* Comunitats actives */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comunitats on està actiu</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {['Catalunya', 'Madrid', 'Euskadi', 'Galicia', 'Andalucía', 'València', 'Baleares'].map((comunitat) => (
                          <label key={comunitat} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editingAgent.activeCommunities.includes(comunitat)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingAgent({
                                      ...editingAgent,
                                      activeCommunities: [...editingAgent.activeCommunities, comunitat]
                                    })
                                  } else {
                                    setEditingAgent({
                                      ...editingAgent,
                                      activeCommunities: editingAgent.activeCommunities.filter((c: string) => c !== comunitat)
                                    })
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                              />
                              <span className="text-sm text-gray-700">{comunitat}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {comunitat === 'Catalunya' && 'català/español'}
                              {comunitat === 'Madrid' && 'español'}
                              {comunitat === 'Euskadi' && 'euskera/español'}
                              {comunitat === 'Galicia' && 'galego/español'}
                              {comunitat === 'Andalucía' && 'español'}
                              {comunitat === 'València' && 'català/español'}
                              {comunitat === 'Baleares' && 'català/español'}
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        ℹ️ L'agent utilitzarà automàticament l'idioma per defecte de cada comunitat. 
                        El sistema de traducció automàtica ja configurat s'encarrega de la localització.
                      </p>
                    </div>

                    {/* Rols que poden accedir */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rols d'usuari que poden accedir</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {availableRoles.map((rol) => (
                          <label key={rol} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editingAgent.allowedRoles.includes(rol)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditingAgent({
                                    ...editingAgent,
                                    allowedRoles: [...editingAgent.allowedRoles, rol]
                                  })
                                } else {
                                  setEditingAgent({
                                    ...editingAgent,
                                    allowedRoles: editingAgent.allowedRoles.filter((r: string) => r !== rol)
                                  })
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">{rol}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Configuració d'escalat a suport humà */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Escalat a Suport Humà</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editingAgent.humanEscalation.enabled}
                            onChange={(e) => setEditingAgent({
                              ...editingAgent,
                              humanEscalation: {
                                ...editingAgent.humanEscalation,
                                enabled: e.target.checked
                              }
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">Activar escalat automàtic</label>
                        </div>

                        {editingAgent.humanEscalation.enabled && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de preguntes abans d'escalar
                              </label>
                              <input
                                type="number"
                                value={editingAgent.humanEscalation.threshold}
                                onChange={(e) => setEditingAgent({
                                  ...editingAgent,
                                  humanEscalation: {
                                    ...editingAgent.humanEscalation,
                                    threshold: parseInt(e.target.value)
                                  }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="10"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Departaments de suport</label>
                              <div className="space-y-2 max-h-24 overflow-y-auto border border-gray-200 rounded-md p-3">
                                {['Suport Tècnic', 'Comercial', 'Màrqueting', 'Assessoria Legal', 'Recursos Humans', 'Comunicació', 'Formació'].map((dept) => (
                                  <label key={dept} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={editingAgent.humanEscalation.departments.includes(dept)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setEditingAgent({
                                            ...editingAgent,
                                            humanEscalation: {
                                              ...editingAgent.humanEscalation,
                                              departments: [...editingAgent.humanEscalation.departments, dept]
                                            }
                                          })
                                        } else {
                                          setEditingAgent({
                                            ...editingAgent,
                                            humanEscalation: {
                                              ...editingAgent.humanEscalation,
                                              departments: editingAgent.humanEscalation.departments.filter((d: string) => d !== dept)
                                            }
                                          })
                                        }
                                      }}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{dept}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Botons d'acció */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAgentConfigModal(false)
                          setEditingAgent(null)
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel·lar
                      </button>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Desactivar Agent
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Guardar Configuració
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}