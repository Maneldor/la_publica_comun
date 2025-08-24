'use client'

import { useState, useEffect } from 'react'
import { 
  Server, 
  Users, 
  MessageCircle, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Wifi,
  Database,
  Bell,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Globe,
  HardDrive,
  Shield,
  AlertCircle,
  Clock,
  Archive,
  Info,
  ExternalLink,
  TrendingUp,
  Lock,
  Cpu,
  HelpCircle,
  Play,
  Settings,
  Building2,
  Building
} from 'lucide-react'
import { useIdioma } from '../../../hooks/useComunidad'

interface SystemStatusGridProps {
  className?: string
}

export default function SystemStatusGrid({ className = '' }: SystemStatusGridProps) {
  const { idioma } = useIdioma()
  const [currentTime, setCurrentTime] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    server: false,
    users: false,
    communications: false,
    alerts: false,
    backups: false,
    performance: false,
    security: false,
    moderation: false,
    generalManagement: false,
    activeCommunities: false,
    companies: false,
    publicAdministrations: false
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showActionSteps, setShowActionSteps] = useState<Record<string, boolean>>({})
  const [showActionPlan, setShowActionPlan] = useState<Record<string, boolean>>({})
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Marcar como cliente y actualizar tiempo
  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        timeZone: 'Europe/Madrid',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime() // Actualizar inmediatamente
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simular detección de nuevas alertas críticas
  useEffect(() => {
    if (!isClient) return
    
    const criticalAlerts = systemData.alerts.critical
    if (criticalAlerts > 0) {
      const timer = setTimeout(() => {
        setToastMessage(`${criticalAlerts} nuevas alertas críticas detectadas`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isClient])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleActionPlan = (key: string) => {
    setShowActionPlan(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const openModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  // Componente Modal
  const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full min-h-[400px] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // Función para obtener información detallada de cada alerta
  const getDetailedInfo = (alertId: string) => {
    const info: Record<string, { title: string; explanation: string; impact: string; recommendations: string[] }> = {
      backupFailed: {
        title: 'Còpia de Seguretat Fallida',
        explanation: 'El sistema automàtic que guarda còpies dels fitxers importants ha fallat. Això vol dir que si passes alguna cosa al servidor principal, podries perdre dades importants.',
        impact: 'Si no es resol aviat, qualsevol problema tècnic podria causar la pèrdua permanent de fitxers, configuracions i dades d\'usuaris.',
        recommendations: [
          'Revisar immediatament l\'espai disponible al servidor de còpies',
          'Verificar la connexió amb el sistema d\'emmagatzematge extern',
          'Executar una còpia manual com a mesura d\'emergència',
          'Configurar alertes per evitar futures fallades'
        ]
      },
      pageSpeed: {
        title: 'Pàgines Lentes',
        explanation: 'Les pàgines web triguen més de 4 segons a carregar completament. Això fa que l\'experiència dels usuaris sigui dolenta i molts poden abandonar la pàgina abans que carregui.',
        impact: 'Els usuaris poden marxar si han d\'esperar massa temps. Això redueix la satisfacció i pot fer que menys gent utilitzi la plataforma.',
        recommendations: [
          'Optimitzar les imatges i recursos gràfics',
          'Millorar les consultes a la base de dades',
          'Implementar sistema de cache per pàgines',
          'Utilitzar una xarxa de distribució de continguts (CDN)'
        ]
      },
      bruteForce: {
        title: 'Intents d\'Accés Sospitosos',
        explanation: 'Algú des de Rússia està provant diferents contrasenyes per intentar accedir al sistema. Fan molts intents seguits per trobar una contrasenya que funcioni.',
        impact: 'De moment no és greu perquè els intents han fallat, però si continuen podrien acabar trobant alguna contrasenya dèbil i accedir sense permís.',
        recommendations: [
          'Bloquejar l\'adreça IP que fa els intents',
          'Revisar els registres de seguretat amb detall',
          'Reforçar les contrasenyes dels usuaris',
          'Activar l\'autenticació de dos factors'
        ]
      },
      sqlInjection: {
        title: 'Intents de Hackejat de Base de Dades',
        explanation: 'Algú ha intentat hackear la base de dades injectant codi maliciós per accedir a informació confidencial. El sistema de seguretat ha detectat i bloquejat aquests intents automàticament.',
        impact: 'No hi ha cap problema actual perquè els atacs han estat bloquejats amb èxit. El sistema de protecció està funcionant correctament.',
        recommendations: [
          'Continuar monitoritzant aquests tipus d\'atacs',
          'Mantenir actualitzades les proteccions de seguretat',
          'Revisar periòdicament els registres de seguretat',
          'Verificar que totes les consultes a la base de dades estan protegides'
        ]
      },
      spamDetection: {
        title: 'Detecció de Spam',
        explanation: 'El sistema automàtic ha identificat 23 publicacions que semblen spam o contingut no desitjat. Aquest és un procés normal que ajuda a mantenir la qualitat del contingut.',
        impact: 'No hi ha cap problema. El sistema està treballant correctament per mantenir la plataforma neta de contingut no desitjat.',
        recommendations: [
          'Continuar amb la moderació automàtica',
          'Revisar ocasionalment els filtres de spam',
          'Millorar els algoritmes de detecció si cal',
          'Informar els usuaris sobre les normes de publicació'
        ]
      },
      reportedContent: {
        title: 'Contingut Reportat per Usuaris',
        explanation: '12 usuaris han denunciat contingut que consideren inapropiat o que incompleix les normes de la comunitat. Aquest contingut necessita revisió manual per decidir si s\'ha d\'eliminar.',
        impact: 'Cal revisar aquest contingut aviat per mantenir un ambient respectuós a la plataforma. Si no es revisa, els usuaris poden perdre confiança en la moderació.',
        recommendations: [
          'Revisar manualment cada denúncia el més aviat possible',
          'Aplicar les mesures corresponents segons les normes',
          'Comunicar les decisions als usuaris afectats',
          'Millorar les normes de la comunitat si cal'
        ]
      }
    }
    
    return info[alertId] || {
      title: 'Informació Detallada',
      explanation: 'No hi ha informació detallada disponible per aquest element.',
      impact: 'Impacte desconegut.',
      recommendations: ['Consultar amb l\'equip tècnic']
    }
  }


  // Función para obtener nivel de prioridad crítica con contexto comprensible
  const getCriticalLevel = (metric: string, value: number | string) => {
    switch (metric) {
      case 'backupFailed':
        return { 
          isUrgent: true, 
          reason: 'Les còpies de seguretat fallides poden causar pèrdua de dades',
          severity: 'crítica',
          context: 'Situació que requereix acció immediata'
        }
      case 'loginAttempts':
        const attempts = value as number
        if (attempts > 20) {
          return { 
            isUrgent: true, 
            reason: 'Possible atac de força bruta en curs',
            severity: 'crítica',
            context: 'Atac actiu detectat'
          }
        } else if (attempts > 10) {
          return { 
            isUrgent: false, 
            severity: 'preocupant',
            context: 'Activitat sospitosa detectada'
          }
        } else {
          return { 
            isUrgent: false,
            severity: 'normal',
            context: 'Nivell d\'intents dins del rang acceptable'
          }
        }
      case 'serverLoad':
        const load = value as number
        if (load > 80) {
          return { 
            isUrgent: true, 
            reason: 'Càrrega crítica pot causar caiguda del servei',
            severity: 'crítica',
            context: 'Rendiment del servidor compromès'
          }
        } else if (load > 60) {
          return { 
            isUrgent: false,
            severity: 'preocupant', 
            context: 'Càrrega elevada però dins dels límits'
          }
        } else {
          return { 
            isUrgent: false,
            severity: 'normal',
            context: 'Funcionament òptim del servidor'
          }
        }
      case 'pageLoadTime':
        const loadTime = value as number
        if (loadTime > 4) {
          return { 
            isUrgent: true, 
            reason: 'Temps de càrrega crític afecta experiència usuari',
            severity: 'crítica',
            context: 'Experiència d\'usuari greument afectada'
          }
        } else if (loadTime > 3) {
          return { 
            isUrgent: false,
            severity: 'preocupant',
            context: 'Temps de càrrega subòptim'
          }
        } else {
          return { 
            isUrgent: false,
            severity: 'normal',
            context: 'Temps de resposta acceptable'
          }
        }
      default:
        return { isUrgent: false, severity: 'normal', context: 'Estat normal' }
    }
  }

  // Función para obtener contexto de gravedad con colores
  const getSeverityIndicator = (severity: string) => {
    switch (severity) {
      case 'crítica':
        return {
          badge: 'bg-red-100 text-red-800',
          icon: '🔴',
          text: 'CRÍTIC'
        }
      case 'preocupant':
        return {
          badge: 'bg-orange-100 text-orange-800',
          icon: '🟠', 
          text: 'PREOCUPANT'
        }
      case 'normal':
        return {
          badge: 'bg-green-100 text-green-800',
          icon: '🟢',
          text: 'NORMAL'
        }
      default:
        return {
          badge: 'bg-gray-100 text-gray-800',
          icon: '⚪',
          text: 'DESCONEGUT'
        }
    }
  }

  // Función para obtener planes de acción específicos
  const getActionPlan = (issue: string) => {
    const plans: Record<string, { title: string; steps: string[]; priority: 'urgent' | 'high' | 'medium' }> = {
      backupFailed: {
        title: 'Resolució de backup fallat',
        priority: 'urgent',
        steps: [
          '1. Verificar espai disponible al servidor de backup',
          '2. Comprovar connexió amb el bucket S3',
          '3. Revisar logs del servei de backup: tail -f /var/log/backup.log',
          '4. Executar backup manual: sudo /scripts/manual-backup.sh',
          '5. Configurar alertes per evitar futures fallades'
        ]
      },
      highCPU: {
        title: 'Resolució de càrrega alta de CPU',
        priority: 'urgent',
        steps: [
          '1. Identificar processos que consumeixen CPU: top -c',
          '2. Matar processos innecessaris: kill -9 PID',
          '3. Reiniciar serveis crítics: sudo systemctl restart nginx',
          '4. Revisar logs d\'aplicació per errors',
          '5. Considerar escalat horitzontal'
        ]
      },
      bruteForce: {
        title: 'Resposta a atac de força bruta',
        priority: 'urgent',
        steps: [
          '1. Bloquejar IP atacant: sudo iptables -A INPUT -s IP -j DROP',
          '2. Revisar logs d\'accés: sudo tail -f /var/log/auth.log',
          '3. Actualitzar regles de fail2ban',
          '4. Notificar a l\'equip de seguretat',
          '5. Implementar autenticació de dos factors'
        ]
      },
      slowPages: {
        title: 'Optimització de pàgines lentes',
        priority: 'high',
        steps: [
          '1. Analitzar performance amb DevTools',
          '2. Optimitzar consultes a base de dades',
          '3. Implementar cache de pàgina',
          '4. Comprimir imatges i recursos',
          '5. Usar CDN per recursos estàtics'
        ]
      },
      moderationQueue: {
        title: 'Gestió de cua de moderació',
        priority: 'medium',
        steps: [
          '1. Revisar contingut pendent manualment',
          '2. Millorar regles de moderació automàtica',
          '3. Assignar més moderadors si cal',
          '4. Implementar prioritització de contingut',
          '5. Crear plantilles de resposta'
        ]
      }
    }
    
    return plans[issue] || {
      title: 'Pla d\'acció general',
      priority: 'medium',
      steps: [
        '1. Analitzar la situació detallada',
        '2. Consultar documentació tècnica',
        '3. Implementar solució temporal',
        '4. Monitoritzar resultats',
        '5. Documenter la resolució'
      ]
    }
  }

  const toggleActionSteps = (metricId: string) => {
    setShowActionSteps(prev => ({
      ...prev,
      [metricId]: !prev[metricId]
    }))
  }

  const getTotalAlerts = () => {
    return systemData.alerts.critical + systemData.alerts.warning
  }

  // Función para formatear números de forma consistente
  const formatNumber = (num: number) => {
    if (!isClient) return num.toString()
    return num.toLocaleString('es-ES')
  }

  // Función para obtener el icono de tipo de alerta
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      // Alertas técnicas
      case 'backupFailed':
        return <Archive className="w-3 h-3 text-red-500" />
      case 'serviceDown':
        return <XCircle className="w-3 h-3 text-red-500" />
      case 'capacityLimit':
        return <AlertTriangle className="w-3 h-3 text-orange-500" />
      case 'appError':
        return <AlertCircle className="w-3 h-3 text-purple-500" />
      case 'databaseError':
        return <Database className="w-3 h-3 text-red-500" />
      case 'sslCertificate':
        return <Lock className="w-3 h-3 text-yellow-500" />
      case 'memoryLimit':
        return <Cpu className="w-3 h-3 text-orange-500" />
      case 'monitoringDown':
        return <Activity className="w-3 h-3 text-gray-500" />
      // Alertas generales
      case 'support':
        return <MessageCircle className="w-3 h-3 text-blue-500" />
      case 'userReport':
        return <Users className="w-3 h-3 text-green-500" />
      default:
        return <Bell className="w-3 h-3 text-gray-500" />
    }
  }

  // Función para obtener el color de prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // Función para formatear tiempo transcurrido
  const formatTimeAgo = (timeAgo: number, timeUnit: string) => {
    const unitMap: Record<string, string> = {
      minutes: translations.minutes,
      hours: translations.hours,
      days: translations.days
    }
    return `${timeAgo} ${unitMap[timeUnit]} ${translations.timeAgo}`
  }

  // Función para obtener estado e interpretación de métricas
  const getMetricInterpretation = (type: string, value: number) => {
    switch (type) {
      case 'cpu':
        if (value > 80) {
          return {
            status: 'critical',
            icon: <XCircle className="w-3 h-3 text-red-500" />,
            message: translations.highLoad,
            recommendation: 'Identificar procesos con alta CPU y optimizar o escalar recursos',
            steps: [
              'Ejecutar "top" para ver procesos activos',
              'Identificar procesos con >20% CPU',
              'Considerar optimización de código',
              'Evaluar escalado horizontal'
            ]
          }
        } else if (value > 60) {
          return {
            status: 'warning',
            icon: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
            message: 'Carga moderada - Monitorear',
            recommendation: 'Monitorear tendencia y preparar optimizaciones',
            steps: [
              'Configurar alertas de CPU >75%',
              'Revisar logs de rendimiento',
              'Planificar optimizaciones preventivas'
            ]
          }
        } else {
          return {
            status: 'normal',
            icon: <CheckCircle className="w-3 h-3 text-green-500" />,
            message: translations.normal,
            recommendation: 'Rendimiento óptimo',
            steps: ['Continuar monitoreo regular']
          }
        }
      case 'memory':
        if (value > 75) {
          return {
            status: 'critical',
            icon: <XCircle className="w-3 h-3 text-red-500" />,
            message: translations.criticalMemory,
            recommendation: 'Ampliar RAM o optimizar uso de memoria',
            steps: [
              'Analizar procesos con "htop"',
              'Revisar memory leaks',
              'Considerar upgrade de RAM',
              'Optimizar consultas DB'
            ]
          }
        } else if (value > 60) {
          return {
            status: 'warning',
            icon: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
            message: 'Memoria alta - Monitorear',
            recommendation: 'Revisar uso de memoria y planificar expansión',
            steps: [
              'Configurar alertas >80%',
              'Analizar tendencia de crecimiento',
              'Revisar cache policies'
            ]
          }
        } else {
          return {
            status: 'normal',
            icon: <CheckCircle className="w-3 h-3 text-green-500" />,
            message: translations.normal,
            recommendation: 'Uso de memoria óptimo',
            steps: ['Continuar monitoreo regular']
          }
        }
      case 'storage':
        if (value > 90) {
          return {
            status: 'critical',
            icon: <XCircle className="w-3 h-3 text-red-500" />,
            message: translations.lowDisk,
            recommendation: 'Limpiar archivos inmediatamente',
            steps: [
              'rm -rf /var/log/*.log.old',
              'Comprimir logs antiguos',
              'Limpiar cache temporal',
              'Considerar upgrade de disco'
            ]
          }
        } else if (value > 75) {
          return {
            status: 'warning',
            icon: <AlertTriangle className="w-3 h-3 text-yellow-500" />,
            message: 'Espacio limitado - Revisar',
            recommendation: 'Planificar limpieza de archivos',
            steps: [
              'Identificar archivos grandes',
              'Configurar rotación de logs',
              'Archivar datos antiguos'
            ]
          }
        } else {
          return {
            status: 'normal',
            icon: <CheckCircle className="w-3 h-3 text-green-500" />,
            message: translations.normal,
            recommendation: 'Espacio suficiente',
            steps: ['Continuar monitoreo regular']
          }
        }
      default:
        return {
          status: 'normal',
          icon: <CheckCircle className="w-3 h-3 text-green-500" />,
          message: translations.normal,
          recommendation: '',
          steps: []
        }
    }
  }

  // Función para obtener interpretación de errores HTTP
  const getHttpErrorInterpretation = (errorType: string, count: number) => {
    if (errorType === '5xx') {
      return {
        message: translations.serverErrors,
        recommendation: 'Revisar logs del servidor y corregir errores',
        steps: [
          'tail -f /var/log/nginx/error.log',
          'Revisar stack traces en aplicación',
          'Verificar conexiones a DB',
          'Comprobar recursos del servidor'
        ],
        severity: count > 20 ? 'critical' : count > 10 ? 'warning' : 'normal'
      }
    } else {
      return {
        message: translations.clientErrors,
        recommendation: 'Analizar patrones de requests incorrectos',
        steps: [
          'Revisar logs de acceso',
          'Validar rutas de API',
          'Comprobar autenticación',
          'Verificar formato de requests'
        ],
        severity: count > 100 ? 'warning' : 'normal'
      }
    }
  }

  const t = {
    ca: {
      serverStatus: 'Estat del Servidor',
      members: 'Membres',
      communications: 'Comunicacions',
      systemAlerts: 'Alertes del Sistema',
      online: 'En línia',
      offline: 'Fora de línia',
      operational: 'Operacional',
      maintenance: 'Manteniment',
      critical: 'Crític',
      normal: 'Normal',
      high: 'Alt',
      warning: 'Advertència',
      newMembers: 'nous membres',
      totalMembers: 'membres totals',
      newMessages: 'missatges nous',
      totalMessages: 'missatges totals',
      criticalAlerts: 'alertes crítiques',
      totalAlerts: 'alertes totals',
      lastUpdate: 'Última actualització',
      serverLoad: 'Càrrega del servidor',
      memory: 'Memòria',
      storage: 'Emmagatzematge',
      uptime: 'Temps actiu',
      newMembersToday: 'Nous Membres Avui',
      newMembersWeek: 'Nous Membres Setmana',
      publicEmployees: 'Empleats Públics',
      companies: 'Empreses',
      publicAdministrations: 'Administracions Públiques',
      unions: 'Sindicats',
      growthRate: 'Creixement',
      today: 'avui',
      thisWeek: 'aquesta setmana',
      apiResponse: 'Resposta API',
      httpErrors: 'Errors HTTP',
      dbStatus: 'Estat BBDD',
      cacheStatus: 'Estat Cache',
      webrtc: 'WebRTC',
      pushNotifications: 'Notificacions Push',
      connected: 'Connectat',
      disconnected: 'Desconnectat',
      postgres: 'PostgreSQL',
      redis: 'Redis',
      backupFailed: 'Backup Fallit',
      serviceDown: 'Servei Caigut',
      capacityLimit: 'Límit Capacitat',
      appError: 'Error Aplicació',
      priority: 'Prioritat',
      timeAgo: 'fa',
      minutes: 'minuts',
      hours: 'hores',
      days: 'dies',
      highPriority: 'Alta',
      medium: 'Mitjana',
      low: 'Baixa',
      highLoad: 'Càrrega alta - Revisar processos',
      criticalMemory: 'Memòria crítica - Considerar ampliar RAM',
      lowDisk: 'Espai baix - Netejar arxius',
      serverErrors: 'Errors de servidor - Revisar logs',
      clientErrors: 'Errors de client - Validar requests',
      recommendedAction: 'Acció recomanada',
      viewSteps: 'Veure passos',
      support: 'Suport',
      userReport: 'Informe Usuari',
      generalAlerts: 'Alertes Generals',
      technicalAlerts: 'Alertes Tècniques'
    },
    es: {
      serverStatus: 'Estado del Servidor',
      members: 'Miembros', 
      communications: 'Comunicaciones',
      systemAlerts: 'Alertas del Sistema',
      online: 'En línea',
      offline: 'Fuera de línea',
      operational: 'Operacional',
      maintenance: 'Mantenimiento',
      critical: 'Crítico',
      normal: 'Normal',
      high: 'Alto',
      warning: 'Advertencia',
      newMembers: 'nuevos miembros',
      totalMembers: 'miembros totales',
      newMessages: 'mensajes nuevos',
      totalMessages: 'mensajes totales',
      criticalAlerts: 'alertas críticas',
      totalAlerts: 'alertas totales',
      lastUpdate: 'Última actualización',
      serverLoad: 'Carga del servidor',
      memory: 'Memoria',
      storage: 'Almacenamiento',
      uptime: 'Tiempo activo',
      newMembersToday: 'Nuevos Miembros Hoy',
      newMembersWeek: 'Nuevos Miembros Semana',
      publicEmployees: 'Empleados Públicos',
      companies: 'Empresas',
      publicAdministrations: 'Administraciones Públicas',
      unions: 'Sindicatos',
      growthRate: 'Crecimiento',
      today: 'hoy',
      thisWeek: 'esta semana',
      apiResponse: 'Respuesta API',
      httpErrors: 'Errores HTTP',
      dbStatus: 'Estado BBDD',
      cacheStatus: 'Estado Cache',
      webrtc: 'WebRTC',
      pushNotifications: 'Notificaciones Push',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      postgres: 'PostgreSQL',
      redis: 'Redis',
      backupFailed: 'Backup Fallido',
      serviceDown: 'Servicio Caído',
      capacityLimit: 'Límite Capacidad',
      appError: 'Error Aplicación',
      priority: 'Prioridad',
      timeAgo: 'hace',
      minutes: 'minutos',
      hours: 'horas',
      days: 'días',
      highPriority: 'Alta',
      medium: 'Media',
      low: 'Baja',
      highLoad: 'Carga alta - Revisar procesos',
      criticalMemory: 'Memoria crítica - Considerar ampliar RAM',
      lowDisk: 'Espacio bajo - Limpiar archivos',
      serverErrors: 'Errores de servidor - Revisar logs',
      clientErrors: 'Errores de cliente - Validar requests',
      recommendedAction: 'Acción recomendada',
      viewSteps: 'Ver pasos',
      support: 'Soporte',
      userReport: 'Reporte Usuario',
      generalAlerts: 'Alertas Generales',
      technicalAlerts: 'Alertas Técnicas'
    }
  }

  const translations = t[idioma as keyof typeof t] || t.es

  // Datos simulados del sistema
  const systemData = {
    server: {
      status: 'operational',
      load: 68,
      memory: 74,
      storage: 52,
      uptime: '15d 4h 32m',
      health: {
        apiResponseTime: 145, // ms
        httpErrors: {
          http500: 12,
          http404: 89,
          lastDay: true
        },
        databases: {
          postgresql: { status: 'connected', responseTime: 23 },
          redis: { status: 'connected', responseTime: 8 }
        },
        services: {
          webrtc: { status: 'operational', responseTime: 67 },
          pushNotifications: { status: 'operational', responseTime: 234 }
        }
      }
    },
    members: {
      total: 5834,
      newToday: 47,
      newThisWeek: 312,
      newMembersByType: {
        publicEmployees: { today: 28, week: 187, growth: 12.3 },
        companies: { today: 8, week: 52, growth: 8.7 },
        publicAdministrations: { today: 6, week: 41, growth: 15.2 },
        unions: { today: 5, week: 32, growth: 6.8 }
      },
      totalByType: {
        publicEmployees: 3240,
        companies: 1456,
        publicAdministrations: 789,
        unions: 349
      }
    },
    communications: {
      newMessages: 45,
      totalMessages: 12847,
      activeChats: 89
    },
    alerts: {
      critical: 2,
      warning: 7,
      total: 23,
      general: [
        {
          id: 1,
          type: 'support',
          priority: 'high',
          message: 'Ticket #1245 - Usuario reporta pérdida de datos',
          timeAgo: 1,
          timeUnit: 'hours',
          details: 'Usuario ID: 7832 - Pérdida de archivos en perfil'
        },
        {
          id: 2,
          type: 'userReport',
          priority: 'high',
          message: '5 reportes de login fallido en Catalunya',
          timeAgo: 30,
          timeUnit: 'minutes',
          details: 'Posible problema con SSO regional'
        },
        {
          id: 3,
          type: 'support',
          priority: 'medium',
          message: 'Ticket #1240 - Solicitud de nueva funcionalidad',
          timeAgo: 4,
          timeUnit: 'hours',
          details: 'Integración con sistema de nóminas'
        },
        {
          id: 4,
          type: 'userReport',
          priority: 'medium',
          message: '12 reportes de carga lenta en móviles',
          timeAgo: 8,
          timeUnit: 'hours',
          details: 'Principalmente dispositivos Android'
        },
        {
          id: 5,
          type: 'support',
          priority: 'low',
          message: 'Ticket #1238 - Consulta sobre exportación',
          timeAgo: 1,
          timeUnit: 'days',
          details: 'Usuario pregunta sobre formato CSV'
        }
      ],
      technical: [
        {
          id: 1,
          type: 'backupFailed',
          priority: 'high',
          message: 'Backup automàtic fallat - Base de dades principal',
          timeAgo: 25,
          timeUnit: 'minutes',
          details: 'Error de connexió amb bucket S3, còpia de seguretat diària no completada'
        },
        {
          id: 2,
          type: 'serviceDown',
          priority: 'high',
          message: 'Servei Redis cache desconnectat',
          timeAgo: 2,
          timeUnit: 'hours',
          details: 'Port 6379 no respon, sistema funcionant amb degradació de rendiment'
        },
        {
          id: 3,
          type: 'capacityLimit',
          priority: 'medium',
          message: 'VPS capacitat de disc 90%',
          timeAgo: 3,
          timeUnit: 'hours',
          details: '/var/log està consumint 85GB, necessita neteja immediata'
        },
        {
          id: 4,
          type: 'appError',
          priority: 'medium',
          message: 'Error crític en mòdul d\'autenticació',
          timeAgo: 6,
          timeUnit: 'hours',
          details: 'JWT validation fallant per al 12% de requests, afecta login usuaris'
        },
        {
          id: 5,
          type: 'capacityLimit',
          priority: 'low',
          message: 'Ús de CPU sostingut >80% durant 1h',
          timeAgo: 1,
          timeUnit: 'days',
          details: 'Procés d\'indexació de cerca consumint recursos'
        },
        {
          id: 6,
          type: 'appError',
          priority: 'low',
          message: 'Timeout en API externa de geolocalització',
          timeAgo: 2,
          timeUnit: 'days',
          details: 'Google Maps API intermitent'
        },
        {
          id: 7,
          type: 'databaseError',
          priority: 'high',
          message: 'PostgreSQL connexions màximes assolides',
          timeAgo: 15,
          timeUnit: 'minutes',
          details: 'Pool de connexions saturat (95/100), consultes lentes detectades'
        },
        {
          id: 8,
          type: 'sslCertificate',
          priority: 'medium',
          message: 'Certificat SSL expira en 7 dies',
          timeAgo: 1,
          timeUnit: 'days',
          details: 'Let\'s Encrypt cert per lapublica.cat necessita renovació automàtica'
        },
        {
          id: 9,
          type: 'memoryLimit',
          priority: 'medium',
          message: 'Memòria RAM utilitzada 85%',
          timeAgo: 45,
          timeUnit: 'minutes',
          details: 'Node.js processes consumint més RAM del previst, considerar optimització'
        },
        {
          id: 10,
          type: 'monitoringDown',
          priority: 'low',
          message: 'Servei de monitoritzat inactiu',
          timeAgo: 20,
          timeUnit: 'minutes',
          details: 'Agent Prometheus ha deixat d\'enviar mètriques durant els últims 20 minuts'
        }
      ]
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100'
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100'
      case 'critical':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5" />
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5" />
      case 'critical':
        return <XCircle className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-4 items-start ${className}`}>
        
        {/* Estado del Servidor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('server')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                  <Server className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{translations.serverStatus}</h3>
                  {!expandedSections.server && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(systemData.server.status)}`}>
                        {getStatusIcon(systemData.server.status)}
                        <span className="text-xs">{translations.operational}</span>
                      </div>
                      {systemData.server.load > 80 && (
                        <div className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium">
                          ⚠
                        </div>
                      )}
                    </div>
                  )}
                  {!expandedSections.server && (
                    <div className="text-xs text-gray-600 mt-0.5">{systemData.server.uptime}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.server && systemData.server.load > 80 && (
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.server ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.server ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Métricas básicas del servidor con interpretación */}
                <div className="space-y-4">
                  {/* Carga del servidor */}
                  {(() => {
                    const cpuInterpretation = getMetricInterpretation('cpu', systemData.server.load)
                    return (
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{translations.serverLoad}</span>
                            {cpuInterpretation.icon}
                          </div>
                          <span className="text-xs font-medium">{systemData.server.load}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              cpuInterpretation.status === 'critical' ? 'bg-red-500' :
                              cpuInterpretation.status === 'warning' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${systemData.server.load}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">{cpuInterpretation.message}</div>
                        {cpuInterpretation.recommendation && (
                          <div>
                            <button
                              onClick={() => toggleActionSteps('cpu')}
                              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              {translations.recommendedAction}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            {showActionSteps.cpu && (
                              <div className="mt-2 bg-white border rounded p-2">
                                <div className="text-xs font-medium text-gray-700 mb-1">{cpuInterpretation.recommendation}</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {cpuInterpretation.steps.map((step, index) => (
                                    <li key={index}>• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Memoria */}
                  {(() => {
                    const memoryInterpretation = getMetricInterpretation('memory', systemData.server.memory)
                    return (
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{translations.memory}</span>
                            {memoryInterpretation.icon}
                          </div>
                          <span className="text-xs font-medium">{systemData.server.memory}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              memoryInterpretation.status === 'critical' ? 'bg-red-500' :
                              memoryInterpretation.status === 'warning' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${systemData.server.memory}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">{memoryInterpretation.message}</div>
                        {memoryInterpretation.recommendation && (
                          <div>
                            <button
                              onClick={() => toggleActionSteps('memory')}
                              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              {translations.recommendedAction}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            {showActionSteps.memory && (
                              <div className="mt-2 bg-white border rounded p-2">
                                <div className="text-xs font-medium text-gray-700 mb-1">{memoryInterpretation.recommendation}</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {memoryInterpretation.steps.map((step, index) => (
                                    <li key={index}>• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Almacenamiento */}
                  {(() => {
                    const storageInterpretation = getMetricInterpretation('storage', systemData.server.storage)
                    return (
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{translations.storage}</span>
                            {storageInterpretation.icon}
                          </div>
                          <span className="text-xs font-medium">{systemData.server.storage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              storageInterpretation.status === 'critical' ? 'bg-red-500' :
                              storageInterpretation.status === 'warning' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${systemData.server.storage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-700 mb-2">{storageInterpretation.message}</div>
                        {storageInterpretation.recommendation && (
                          <div>
                            <button
                              onClick={() => toggleActionSteps('storage')}
                              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              {translations.recommendedAction}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            {showActionSteps.storage && (
                              <div className="mt-2 bg-white border rounded p-2">
                                <div className="text-xs font-medium text-gray-700 mb-1">{storageInterpretation.recommendation}</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {storageInterpretation.steps.map((step, index) => (
                                    <li key={index}>• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Métricas de salud técnica */}
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="text-xs font-semibold text-gray-700 mb-3">Salud Técnica</h5>
                  
                  {/* API Response Time */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{translations.apiResponse}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      systemData.server.health.apiResponseTime < 100 ? 'bg-green-100 text-green-800' :
                      systemData.server.health.apiResponseTime < 200 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {systemData.server.health.apiResponseTime}ms
                    </div>
                  </div>

                  {/* HTTP Errors con interpretación */}
                  <div className="border rounded-lg p-3 bg-gray-50 mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-gray-600">{translations.httpErrors} (24h)</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-medium">
                          5xx: {systemData.server.health.httpErrors.http500}
                        </div>
                        <div className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-medium">
                          4xx: {systemData.server.health.httpErrors.http404}
                        </div>
                      </div>
                    </div>
                    
                    {/* Interpretaciones de errores */}
                    <div className="space-y-2">
                      {(() => {
                        const serverErrorInterpretation = getHttpErrorInterpretation('5xx', systemData.server.health.httpErrors.http500)
                        return (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {serverErrorInterpretation.severity === 'critical' ? 
                                <XCircle className="w-3 h-3 text-red-500" /> :
                                serverErrorInterpretation.severity === 'warning' ?
                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> :
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              }
                              <span className="text-xs text-gray-700">{serverErrorInterpretation.message}</span>
                            </div>
                            <button
                              onClick={() => toggleActionSteps('http5xx')}
                              className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              {translations.recommendedAction}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            {showActionSteps.http5xx && (
                              <div className="mt-2 bg-white border rounded p-2">
                                <div className="text-xs font-medium text-gray-700 mb-1">{serverErrorInterpretation.recommendation}</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {serverErrorInterpretation.steps.map((step, index) => (
                                    <li key={index}>• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {(() => {
                        const clientErrorInterpretation = getHttpErrorInterpretation('4xx', systemData.server.health.httpErrors.http404)
                        return (
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {clientErrorInterpretation.severity === 'warning' ?
                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> :
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              }
                              <span className="text-xs text-gray-700">{clientErrorInterpretation.message}</span>
                            </div>
                            <button
                              onClick={() => toggleActionSteps('http4xx')}
                              className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                              {translations.recommendedAction}
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            {showActionSteps.http4xx && (
                              <div className="mt-2 bg-white border rounded p-2">
                                <div className="text-xs font-medium text-gray-700 mb-1">{clientErrorInterpretation.recommendation}</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {clientErrorInterpretation.steps.map((step, index) => (
                                    <li key={index}>• {step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Database Status */}
                  <div className="space-y-2 mb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600">{translations.postgres}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          systemData.server.health.databases.postgresql.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">{systemData.server.health.databases.postgresql.responseTime}ms</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-gray-600">{translations.redis}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          systemData.server.health.databases.redis.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">{systemData.server.health.databases.redis.responseTime}ms</span>
                      </div>
                    </div>
                  </div>

                  {/* Critical Services */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-gray-600">{translations.webrtc}</span>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        systemData.server.health.services.webrtc.responseTime < 100 ? 'bg-green-100 text-green-800' :
                        systemData.server.health.services.webrtc.responseTime < 200 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {systemData.server.health.services.webrtc.responseTime}ms
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-gray-600">{translations.pushNotifications}</span>
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        systemData.server.health.services.pushNotifications.responseTime < 100 ? 'bg-green-100 text-green-800' :
                        systemData.server.health.services.pushNotifications.responseTime < 200 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {systemData.server.health.services.pushNotifications.responseTime}ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tiempo activo */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">{translations.uptime}</span>
                  <span className="text-xs font-medium text-green-600">{systemData.server.uptime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas del Sistema */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('alerts')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                  <Bell className="w-4 h-4 text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{translations.systemAlerts}</h3>
                  {!expandedSections.alerts && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-red-600">
                        {systemData.alerts.critical}
                      </span>
                      <span className="text-xs text-gray-600">{translations.criticalAlerts}</span>
                    </div>
                  )}
                  {!expandedSections.alerts && systemData.alerts.warning > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 w-fit">
                      {systemData.alerts.warning} advertencias
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.alerts && (
                  <>
                    {systemData.alerts.critical > 0 && (
                      <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {systemData.alerts.critical}
                      </div>
                    )}
                    {systemData.alerts.warning > 0 && (
                      <div className="bg-yellow-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {systemData.alerts.warning}
                      </div>
                    )}
                  </>
                )}
                {expandedSections.alerts ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.alerts ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Resumen de alertas */}
                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{systemData.alerts.critical}</div>
                    <div className="text-xs text-gray-600">Críticas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{systemData.alerts.warning}</div>
                    <div className="text-xs text-gray-600">Advertencias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-700">{systemData.alerts.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-4">
                  {/* Alertas Generales del Sistema */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" />
                      {translations.generalAlerts}
                    </h5>
                    <div className="space-y-2">
                      {systemData.alerts.general
                        .sort((a, b) => {
                          const priorityOrder = { high: 3, medium: 2, low: 1 }
                          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
                        })
                        .map((alert) => (
                          <div key={`general-${alert.id}`} className={`border rounded-lg p-3 ${getPriorityColor(alert.priority)}`}>
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getAlertTypeIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                      alert.priority === 'high' ? 'bg-red-200 text-red-900' :
                                      alert.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                                      'bg-gray-200 text-gray-800'
                                    }`}>
                                      {alert.priority === 'high' ? translations.high :
                                       alert.priority === 'medium' ? translations.medium :
                                       translations.low}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      {formatTimeAgo(alert.timeAgo, alert.timeUnit)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs font-medium text-gray-900 mb-1">
                                  {alert.message}
                                </div>
                                <div className="text-xs text-gray-600 truncate">
                                  {alert.details}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Alertas Técnicas */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Server className="w-3 h-3" />
                      {translations.technicalAlerts}
                    </h5>
                    <div className="space-y-2">
                      {systemData.alerts.technical
                        .sort((a, b) => {
                          const priorityOrder = { high: 3, medium: 2, low: 1 }
                          return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
                        })
                        .map((alert) => (
                          <div key={`technical-${alert.id}`} className={`border rounded-lg p-3 ${getPriorityColor(alert.priority)}`}>
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getAlertTypeIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                      alert.priority === 'high' ? 'bg-red-200 text-red-900' :
                                      alert.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                                      'bg-gray-200 text-gray-800'
                                    }`}>
                                      {alert.priority === 'high' ? translations.high :
                                       alert.priority === 'medium' ? translations.medium :
                                       translations.low}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      {formatTimeAgo(alert.timeAgo, alert.timeUnit)}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs font-medium text-gray-900 mb-1">
                                  {alert.message}
                                </div>
                                <div className="text-xs text-gray-600 truncate">
                                  {alert.details}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Última actualización */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 text-center">
                    {translations.lastUpdate}: {isClient ? currentTime : '--:--:--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Membres - Reorganizado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('users')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{translations.members}</h3>
                  {!expandedSections.users && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">
                        {systemData.members.newToday}
                      </span>
                      <span className="text-xs text-gray-600">{translations.newMembers} {translations.today}</span>
                    </div>
                  )}
                  {!expandedSections.users && (
                    <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium animate-pulse mt-0.5 w-fit">
                      +{systemData.members.newToday} nous
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.users && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.users ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.users ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Resumen de nuevos miembros */}
                <div className="text-center pb-3 border-b border-gray-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {systemData.members.newToday}
                  </div>
                  <div className="text-xs text-gray-600">{translations.newMembersToday}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {systemData.members.newThisWeek} {translations.thisWeek}
                  </div>
                </div>

                {/* Desglose por tipo de miembro */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Desglose por Tipo</h4>
                  <div className="space-y-2">
                    {Object.entries(systemData.members.newMembersByType).map(([type, data]) => {
                      const typeLabels: Record<string, string> = {
                        'publicEmployees': translations.publicEmployees,
                        'companies': translations.companies,
                        'publicAdministrations': translations.publicAdministrations,
                        'unions': translations.unions
                      };
                      
                      const colors: Record<string, string> = {
                        'publicEmployees': 'bg-blue-500',
                        'companies': 'bg-orange-500',
                        'publicAdministrations': 'bg-indigo-500',
                        'unions': 'bg-yellow-500'
                      };

                      const percentage = ((data.today / systemData.members.newToday) * 100).toFixed(1);

                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`w-3 h-3 rounded ${colors[type]} flex-shrink-0`}></div>
                            <span className="text-xs text-gray-600 truncate">{typeLabels[type]}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-900">{data.today}</span>
                              <span className="text-xs text-gray-500">({percentage}%)</span>
                            </div>
                            <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              data.growth > 10 ? 'bg-green-100 text-green-800' :
                              data.growth > 5 ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              +{data.growth}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estadísticas semanales */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">{translations.newMembersWeek}</h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {Object.entries(systemData.members.newMembersByType).map(([type, data]) => {
                      const typeLabels: Record<string, string> = {
                        'publicEmployees': translations.publicEmployees,
                        'companies': translations.companies,
                        'publicAdministrations': translations.publicAdministrations,
                        'unions': translations.unions
                      };

                      return (
                        <div key={type} className="bg-gray-50 rounded p-2">
                          <div className="text-sm font-semibold text-gray-900">{data.week}</div>
                          <div className="text-xs text-gray-600 truncate">{typeLabels[type]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total de miembros */}
                <div className="pt-3 border-t border-gray-100 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(systemData.members.total)}
                  </div>
                  <div className="text-xs text-gray-500">{translations.totalMembers}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comunicaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('communications')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-orange-100 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{translations.communications}</h3>
                    {!expandedSections.communications && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-lg font-bold text-orange-600">
                          {systemData.communications.newMessages}
                        </span>
                        <span className="text-xs text-gray-600">{translations.newMessages}</span>
                      </div>
                    )}
                    {!expandedSections.communications && (
                      <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium animate-pulse mt-0.5 w-fit">
                        ✓ Nuevo
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!expandedSections.communications && systemData.communications.newMessages > 0 && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  {expandedSections.communications ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out ${expandedSections.communications ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-6 pb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{translations.newMessages}</span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">
                      +{systemData.communications.newMessages}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{translations.totalMessages}</span>
                    <span className="text-sm font-medium">{formatNumber(systemData.communications.totalMessages)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chats activos</span>
                    <span className="text-sm font-medium">{systemData.communications.activeChats}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>

      {/* Segunda fila - Nuevas tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6 items-start">
        
        {/* Còpies de Seguretat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('backups')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                  <Archive className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Còpies de Seguretat</h3>
                  {!expandedSections.backups && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-purple-600">
                        6h
                      </span>
                      <span className="text-xs text-gray-600">última exitosa</span>
                    </div>
                  )}
                  {!expandedSections.backups && (
                    <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 w-fit">
                      ✓ Operatiu
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.backups && (
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.backups ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.backups ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-sm font-bold text-green-700">6h</div>
                    <div className="text-xs text-gray-600">Última exitosa</div>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-sm font-bold text-blue-700">2h</div>
                    <div className="text-xs text-gray-600">Pròxima programada</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">
                          Espai utilitzat
                        </span>
                      {(() => {
                        const severityInfo = getSeverityIndicator('normal')
                        return (
                          <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge} ml-2`}>
                            {severityInfo.icon}
                          </div>
                        )
                      })()}
                    </div>
                    <span className="text-sm font-medium">247GB / 500GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '49%'}}></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    49% utilitzat - Capacitat adequada per 3 mesos més
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Verificació d'integritat</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Verificat</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Última verificació: Avui 14:30</div>
                  
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-xs font-medium text-red-700">1 Error recent</span>
                      {getCriticalLevel('backupFailed', 1).isUrgent && (
                        <div className="bg-red-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                          URGENT
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-red-600 mb-2 font-medium">
                      Backup fallat ahir 03:00 - Espai insuficient
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => openModal('backupFailed')}
                        className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        Més info
                      </button>
                    </div>
                    
                    <button
                      onClick={() => toggleActionPlan('backupFailed')}
                      className="flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Què fer?
                    </button>
                    
                    {showActionPlan.backupFailed && (
                      <div className="mt-2 bg-white border border-red-300 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-semibold text-red-700">
                            {getActionPlan('backupFailed').title}
                          </span>
                          <div className="bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                            {getActionPlan('backupFailed').priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          {getActionPlan('backupFailed').steps.map((step, index) => (
                            <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="flex-1">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rendiment Web */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('performance')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Rendiment Web</h3>
                  {!expandedSections.performance && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">
                        2.3s
                      </span>
                      <span className="text-xs text-gray-600">temps mitjà</span>
                    </div>
                  )}
                  {!expandedSections.performance && (
                    <div className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 w-fit">
                      ⚡ Acceptable
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.performance && (
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.performance ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.performance ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-sm font-bold text-green-700">2.3s</div>
                    <div className="text-xs text-gray-600">Temps mitjà</div>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-sm font-bold text-blue-700">1,247</div>
                    <div className="text-xs text-gray-600">Visitants únics</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Pàgines més lentes</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">/dashboard</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-red-600 font-medium">4.8s</span>
                        {(() => {
                          const severityInfo = getSeverityIndicator('crítica')
                          return (
                            <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge}`}>
                              {severityInfo.icon}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">/grupos</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-600 font-medium">3.2s</span>
                        {(() => {
                          const severityInfo = getSeverityIndicator('preocupant')
                          return (
                            <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge}`}>
                              {severityInfo.icon}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">/empresas</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">1.9s</span>
                        {(() => {
                          const severityInfo = getSeverityIndicator('normal')
                          return (
                            <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge}`}>
                              {severityInfo.icon}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-700">2 Alertes de velocitat</span>
                    {getCriticalLevel('pageLoadTime', 4.8).isUrgent && (
                      <div className="bg-orange-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold animate-pulse">
                        URGENT
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-yellow-600 mb-2 font-medium">
                    Pàgina carrega lenta (4s) - Experiència d'usuari afectada
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => openModal('pageSpeed')}
                      className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      <Info className="w-3 h-3" />
                      Més info
                    </button>
                  </div>
                  
                  <button
                    onClick={() => toggleActionPlan('slowPages')}
                    className="flex items-center gap-1 text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Què fer?
                  </button>
                  
                  {showActionPlan.slowPages && (
                    <div className="mt-2 bg-white border border-orange-300 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-semibold text-orange-700">
                          {getActionPlan('slowPages').title}
                        </span>
                        <div className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                          {getActionPlan('slowPages').priority.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {getActionPlan('slowPages').steps.map((step, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="flex-1">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seguretat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('security')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Seguretat</h3>
                  {!expandedSections.security && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-red-600">
                        23
                      </span>
                      <span className="text-xs text-gray-600">intents fallits</span>
                    </div>
                  )}
                  {!expandedSections.security && (
                    <div className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-medium animate-pulse mt-0.5 w-fit">
                      ⚠️ Mitja
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.security && (
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.security ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.security ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-red-50 rounded p-2">
                    <div className="text-sm font-bold text-red-700">23</div>
                    <div className="text-xs text-gray-600">Intents fallits</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2">
                    <div className="text-sm font-bold text-orange-700">7</div>
                    <div className="text-xs text-gray-600">IPs bloquejades</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Comptes sospitosos</span>
                    <span className="text-sm font-medium text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Atacs detectats (24h)</span>
                    <span className="text-sm font-medium text-red-600">12</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Nivell d'amenaça</span>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600 font-medium">MITJÀ</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="bg-red-50 border border-red-200 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-red-600 font-medium">
                          Intents d'accés sospitosos: 15 persones de Rússia han provat entrar - Risc baix
                        </div>
                        {(() => {
                          const criticalInfo = getCriticalLevel('loginAttempts', 15)
                          const severityInfo = getSeverityIndicator(criticalInfo.severity)
                          return (
                            <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${severityInfo.badge}`}>
                              {severityInfo.icon} {severityInfo.text}
                            </div>
                          )
                        })()}
                      </div>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => openModal('bruteForce')}
                          className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          Més info
                        </button>
                      </div>
                      <button
                        onClick={() => toggleActionPlan('bruteForce')}
                        className="flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors mt-1"
                      >
                        <Play className="w-3 h-3" />
                        Què fer?
                      </button>
                      
                      {showActionPlan.bruteForce && (
                        <div className="mt-2 bg-white border border-red-300 rounded p-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">
                              {getActionPlan('bruteForce').title}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {getActionPlan('bruteForce').steps.slice(0, 3).map((step, index) => (
                              <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="flex-1">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-orange-600 font-medium">
                          Atacs de base de dades: 3 intents bloquejats automàticament - Sistema protegit
                        </div>
                        {(() => {
                          const severityInfo = getSeverityIndicator('normal')
                          return (
                            <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${severityInfo.badge}`}>
                              {severityInfo.icon} {severityInfo.text}
                            </div>
                          )
                        })()}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('sqlInjection')}
                          className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          Més info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contingut i Moderació */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('moderation')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Contingut i Moderació</h3>
                  {!expandedSections.moderation && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-indigo-600">
                        47
                      </span>
                      <span className="text-xs text-gray-600">pendents</span>
                    </div>
                  )}
                  {!expandedSections.moderation && (
                    <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium animate-pulse mt-0.5 w-fit">
                      📝 Actiu
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!expandedSections.moderation && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                {expandedSections.moderation ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.moderation ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-sm font-bold text-green-700">156</div>
                    <div className="text-xs text-gray-600">Auto-moderats</div>
                  </div>
                  <div className="bg-red-50 rounded p-2">
                    <div className="text-sm font-bold text-red-700">47</div>
                    <div className="text-xs text-gray-600">Pendents revisió</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">
                          Spam detectat
                        </span>
                      {(() => {
                        const severityInfo = getSeverityIndicator('normal')
                        return (
                          <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge}`}>
                            {severityInfo.icon}
                          </div>
                        )
                      })()}
                    </div>
                    <span className="text-sm font-medium text-orange-600">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">
                          Contingut reportat
                        </span>
                      {(() => {
                        const severityInfo = getSeverityIndicator('preocupant')
                        return (
                          <div className={`px-1 py-0.5 rounded text-xs ${severityInfo.badge}`}>
                            {severityInfo.icon}
                          </div>
                        )
                      })()}
                    </div>
                    <span className="text-sm font-medium text-red-600">12</span>
                  </div>
                </div>

                <div className="border-t pt-3 pb-3">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('spamDetection')}
                        className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        Info Spam
                      </button>
                      <button
                        onClick={() => openModal('reportedContent')}
                        className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        Info Reportat
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Activitat per comunitat</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Catalunya</span>
                      <span className="text-xs font-medium">234 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Madrid</span>
                      <span className="text-xs font-medium">189 posts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Andalucía</span>
                      <span className="text-xs font-medium">156 posts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-blue-700">Estadístiques destacades</span>
                  </div>
                  <div className="text-xs text-blue-600 mb-2 font-medium">
                    95% contingut aprovat automàticament
                  </div>
                  
                  {47 > 40 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-yellow-600 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        REVISIÓ NECESSÀRIA
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => toggleActionPlan('moderationQueue')}
                    className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Què fer?
                  </button>
                  
                  {showActionPlan.moderationQueue && (
                    <div className="mt-2 bg-white border border-indigo-300 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-700">
                          {getActionPlan('moderationQueue').title}
                        </span>
                        <div className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                          {getActionPlan('moderationQueue').priority.toUpperCase()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {getActionPlan('moderationQueue').steps.map((step, index) => (
                          <div key={index} className="text-xs text-gray-700 flex items-start gap-2">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="flex-1">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera fila - Gestió Plataforma */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Gestió Plataforma</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Gestió General */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('generalManagement')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Settings className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Gestió General</h3>
                  {!expandedSections.generalManagement && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-indigo-600">
                        15,423
                      </span>
                      <span className="text-xs text-gray-500">usuaris globals</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  8 rols
                </div>
                {expandedSections.generalManagement ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.generalManagement ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-600">15,423</div>
                    <div className="text-xs text-indigo-700">Usuaris globals</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-blue-700">Rols del sistema</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Configuració del sistema</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Màxim usuaris per comunitat</span>
                      <span className="text-xs font-medium">5,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Temps de sessió</span>
                      <span className="text-xs font-medium">8h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Backup automàtic</span>
                      <span className="text-xs font-medium text-green-600">Actiu</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Rols més comuns</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Miembro</span>
                      <span className="text-xs font-medium">12,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Empresa</span>
                      <span className="text-xs font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Administració</span>
                      <span className="text-xs font-medium">189</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <button
                    onClick={() => window.location.href = '/admin/configuracion'}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configuració General
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comunitats Actives */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('activeCommunities')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-yellow-100 rounded-lg flex-shrink-0">
                  <Globe className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Comunitats Actives</h3>
                  {!expandedSections.activeCommunities && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-yellow-600">
                        4
                      </span>
                      <span className="text-xs text-gray-500">de 17 actives</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  13 pendents
                </div>
                {expandedSections.activeCommunities ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.activeCommunities ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Comunitats actives</h5>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">Catalunya</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">3,245 empleats</span>
                      </div>
                      <div className="flex gap-1 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Feed</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Grups</span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Fòrums</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Tauler</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">Madrid</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2,891 empleats</span>
                      </div>
                      <div className="flex gap-1 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Feed</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Grups</span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Fòrums</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">Andalucía</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2,156 empleats</span>
                      </div>
                      <div className="flex gap-1 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Feed</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Grups</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">Valencia</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">1,934 empleats</span>
                      </div>
                      <div className="flex gap-1 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Feed</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <button
                    onClick={() => window.location.href = '/admin/comunidades'}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <Globe className="w-4 h-4" />
                    Gestionar Comunitats
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/activar-comunidades'}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    + Afegir Comunitat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empreses Col·laboradores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('companies')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                  <Building2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Empreses Col·laboradores</h3>
                  {!expandedSections.companies && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">
                        1,247
                      </span>
                      <span className="text-xs text-gray-500">empreses</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  €84.5k/mes
                </div>
                {expandedSections.companies ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.companies ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">1,247</div>
                    <div className="text-xs text-green-700">Empreses actives</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">3,847</div>
                    <div className="text-xs text-blue-700">Ofertes transversals</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Gestió d'ofertes</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Ofertes actives</span>
                      <span className="text-xs font-medium">234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Pendents d'aprovació</span>
                      <span className="text-xs font-medium text-orange-600">67</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Per expirar (7 dies)</span>
                      <span className="text-xs font-medium text-red-600">12</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Revenue per comunitat</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Catalunya</span>
                      <span className="text-xs font-medium">€32.1k</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Madrid</span>
                      <span className="text-xs font-medium">€28.4k</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Altres</span>
                      <span className="text-xs font-medium">€24.0k</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <button
                    onClick={() => window.location.href = '/admin/empresas'}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Gestionar Empreses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Administracions Públiques */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('publicAdministrations')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                  <Building className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Administracions Públiques</h3>
                  {!expandedSections.publicAdministrations && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-purple-600">
                        89
                      </span>
                      <span className="text-xs text-gray-500">suscrits</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  156 contractes
                </div>
                {expandedSections.publicAdministrations ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.publicAdministrations ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-purple-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-xs text-purple-700">Administracions</div>
                  </div>
                  <div className="bg-green-50 rounded p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-xs text-green-700">Contractes actius</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Gestió de contractes</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Contractes vigents</span>
                      <span className="text-xs font-medium">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Per renovar (30 dies)</span>
                      <span className="text-xs font-medium text-orange-600">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Pendents d'aprovació</span>
                      <span className="text-xs font-medium text-blue-600">8</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Serveis més utilitzats</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Plataforma social</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">78/89</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Gestió recursos</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">45/89</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '51%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <button
                    onClick={() => window.location.href = '/admin/administraciones'}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Building className="w-4 h-4" />
                    Gestionar Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      </div>

      {/* Modales informativos */}
      <Modal
        isOpen={activeModal === 'backupFailed'}
        onClose={closeModal}
        title="Còpia de Seguretat Fallida"
      >
        {(() => {
          const info = getDetailedInfo('backupFailed')
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Què està passant?
                </h4>
                <p className="text-base text-gray-700 leading-relaxed">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Quin impacte té?
                </h4>
                <p className="text-base text-gray-700 leading-relaxed">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Què cal fer?
                </h4>
                <ul className="text-base text-gray-700 space-y-3">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal
        isOpen={activeModal === 'pageSpeed'}
        onClose={closeModal}
        title="Pàgines Lentes"
      >
        {(() => {
          const info = getDetailedInfo('pageSpeed')
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què està passant?</h4>
                <p className="text-sm text-gray-700">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quin impacte té?</h4>
                <p className="text-sm text-gray-700">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què cal fer?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal
        isOpen={activeModal === 'bruteForce'}
        onClose={closeModal}
        title="Intents d'Accés Sospitosos"
      >
        {(() => {
          const info = getDetailedInfo('bruteForce')
          return (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Què està passant?
                </h4>
                <p className="text-base text-gray-700 leading-relaxed">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Quin impacte té?
                </h4>
                <p className="text-base text-gray-700 leading-relaxed">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Què cal fer?
                </h4>
                <ul className="text-base text-gray-700 space-y-3">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal
        isOpen={activeModal === 'sqlInjection'}
        onClose={closeModal}
        title="Intents de Hackejat de Base de Dades"
      >
        {(() => {
          const info = getDetailedInfo('sqlInjection')
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què està passant?</h4>
                <p className="text-sm text-gray-700">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quin impacte té?</h4>
                <p className="text-sm text-gray-700">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què cal fer?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal
        isOpen={activeModal === 'spamDetection'}
        onClose={closeModal}
        title="Detecció de Spam"
      >
        {(() => {
          const info = getDetailedInfo('spamDetection')
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què està passant?</h4>
                <p className="text-sm text-gray-700">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quin impacte té?</h4>
                <p className="text-sm text-gray-700">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què cal fer?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal
        isOpen={activeModal === 'reportedContent'}
        onClose={closeModal}
        title="Contingut Reportat per Usuaris"
      >
        {(() => {
          const info = getDetailedInfo('reportedContent')
          return (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què està passant?</h4>
                <p className="text-sm text-gray-700">{info.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Quin impacte té?</h4>
                <p className="text-sm text-gray-700">{info.impact}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Què cal fer?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {info.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* Toast de notificación */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 hover:bg-red-700 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}