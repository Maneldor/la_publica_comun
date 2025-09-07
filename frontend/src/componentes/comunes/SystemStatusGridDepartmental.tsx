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
  Settings,
  Building2,
  CreditCard,
  Euro,
  Bot,
  Brain,
  BarChart3,
  Megaphone,
  Search,
  Scale,
  FileText,
  Eye,
  UserCheck,
  Zap,
  Globe,
  Target,
  DollarSign,
  PieChart,
  Briefcase,
  Mail,
  Gauge,
  Lightbulb,
  Rocket,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  MonitorSpeaker,
  HardDrive,
  Plus
} from 'lucide-react'
import { useIdioma } from '../../../hooks/useComunidad'

interface SystemStatusGridDepartmentalProps {
  className?: string
}

export default function SystemStatusGridDepartmental({ className = '' }: SystemStatusGridDepartmentalProps) {
  const { idioma } = useIdioma()
  const [currentTime, setCurrentTime] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    informaticDept: false,
    aiDept: false,
    commercialDept: false,
    marketingDept: false,
    financialDept: false,
    legalDept: false
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Marcar como cliente y actualizar tiempo
  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        timeZone: 'Europe/Madrid',
        hour12: false
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const openModal = (modalType: string) => {
    setActiveModal(modalType)
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getSeverityIndicator = (severity: 'crítica' | 'alta' | 'preocupant' | 'baixa' | 'normal') => {
    const indicators = {
      crítica: { color: 'text-red-600', bg: 'bg-red-100', badge: 'bg-red-600 text-white', icon: '🔴' },
      alta: { color: 'text-orange-600', bg: 'bg-orange-100', badge: 'bg-orange-600 text-white', icon: '🟠' },
      preocupant: { color: 'text-yellow-600', bg: 'bg-yellow-100', badge: 'bg-yellow-600 text-white', icon: '🟡' },
      baixa: { color: 'text-blue-600', bg: 'bg-blue-100', badge: 'bg-blue-600 text-white', icon: '🔵' },
      normal: { color: 'text-green-600', bg: 'bg-green-100', badge: 'bg-green-600 text-white', icon: '🟢' }
    }
    return indicators[severity]
  }

  if (!isClient) {
    return <div className={`space-y-6 ${className}`}>Loading...</div>
  }

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Grid de departamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Departament Informàtic */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('informaticDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                  <Server className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament Informàtic</h3>
                  {!expandedSections.informaticDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">99.2%</span>
                      <span className="text-xs text-gray-500">uptime</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  Operacional
                </div>
                {expandedSections.informaticDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.informaticDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Mètriques servidors */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-xl font-bold text-green-700">99.2%</div>
                    <div className="text-xs text-green-600">Uptime</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <div className="text-xl font-bold text-blue-700">2.1s</div>
                    <div className="text-xs text-blue-600">Resposta mitjana</div>
                  </div>
                </div>
                
                {/* Estats crítics */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Sistemes crítics</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Base de dades</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">Operacional</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Aplicació web</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-600 font-medium">Operacional</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Sistema backups</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-600 font-medium">Manteniment</span>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alertes seguretat */}
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Alertes seguretat
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-orange-600">• 3 intents login fallits</p>
                    <p className="text-xs text-gray-600">• SSL certificat vàlid 89 dies</p>
                    <p className="text-xs text-green-600">• Firewall actiu</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => window.location.href = '/admin/departament-informatic'}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Server className="w-4 h-4" />
                  Gestionar Departament
                </button>
                <button
                  onClick={() => openModal('systemLogs')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Logs Sistema
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departament IA */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('aiDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-purple-100 rounded-lg flex-shrink-0">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament IA</h3>
                  {!expandedSections.aiDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-purple-600">15</span>
                      <span className="text-xs text-gray-500">agents actius</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  2 alertes
                </div>
                {expandedSections.aiDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.aiDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Agents IA */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-purple-50 rounded p-3">
                    <div className="text-xl font-bold text-purple-700">15</div>
                    <div className="text-xs text-purple-600">Agents actius</div>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-xl font-bold text-green-700">94%</div>
                    <div className="text-xs text-green-600">Eficiència</div>
                  </div>
                </div>
                
                {/* Estats agents */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Agents per tipus</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Moderació</span>
                      <span className="text-xs font-medium text-gray-900">8 actius</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Assistència</span>
                      <span className="text-xs font-medium text-gray-900">4 actius</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Anàlisi</span>
                      <span className="text-xs font-medium text-gray-900">3 actius</span>
                    </div>
                  </div>
                </div>

                {/* Alertes IA */}
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-yellow-700 mb-2 flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    Alertes IA
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-yellow-600">• Agent moderació sobrecarregat</p>
                    <p className="text-xs text-orange-600">• Consum API prop del límit</p>
                    <p className="text-xs text-green-600">• Precisió moderació: 96.2%</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = '/admin/departament-ia'
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Brain className="w-4 h-4" />
                  Gestionar IA
                </button>
                <button
                  onClick={() => openModal('aiMetrics')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  Mètriques IA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departament Comercial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('commercialDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                  <Building2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament Comercial</h3>
                  {!expandedSections.commercialDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">1,247</span>
                      <span className="text-xs text-gray-500">empreses</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  +12% mes
                </div>
                {expandedSections.commercialDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.commercialDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Mètriques comercials */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-xl font-bold text-green-700">1,247</div>
                    <div className="text-xs text-green-600">Empreses actives</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <div className="text-xl font-bold text-blue-700">€84.5K</div>
                    <div className="text-xs text-blue-600">Ingressos mes</div>
                  </div>
                </div>
                
                {/* Pipeline vendes */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Pipeline de vendes</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Leads qualificats</span>
                      <span className="text-xs font-medium text-gray-900">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Demostracions</span>
                      <span className="text-xs font-medium text-gray-900">43</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Contractes pendents</span>
                      <span className="text-xs font-medium text-orange-600">12</span>
                    </div>
                  </div>
                </div>

                {/* Conversions */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Conversions
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-blue-600">• Taxa conversió: 12.4%</p>
                    <p className="text-xs text-green-600">• Temps mitjà tancament: 18 dies</p>
                    <p className="text-xs text-gray-600">• Valor mitjà contracte: €678</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => window.location.href = '/admin/departament-comercial'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  Dashboard Comercial
                </button>
                <button
                  onClick={() => window.location.href = '/admin/departament-marketing'}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Target className="w-4 h-4" />
                  Marketing Enterprise
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departament Marketing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('marketingDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-pink-100 rounded-lg flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-pink-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament Marketing</h3>
                  {!expandedSections.marketingDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-pink-600">47.2K</span>
                      <span className="text-xs text-gray-500">impressions</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  +24% CTR
                </div>
                {expandedSections.marketingDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.marketingDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Mètriques marketing */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-pink-50 rounded p-3">
                    <div className="text-xl font-bold text-pink-700">47.2K</div>
                    <div className="text-xs text-pink-600">Impressions</div>
                  </div>
                  <div className="bg-orange-50 rounded p-3">
                    <div className="text-xl font-bold text-orange-700">3.8%</div>
                    <div className="text-xs text-orange-600">CTR mitjà</div>
                  </div>
                </div>
                
                {/* Campanyes actives */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Campanyes actives</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Google Ads</span>
                      <span className="text-xs font-medium text-green-600">Activa</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">LinkedIn</span>
                      <span className="text-xs font-medium text-green-600">Activa</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Email marketing</span>
                      <span className="text-xs font-medium text-yellow-600">Planificant</span>
                    </div>
                  </div>
                </div>

                {/* SEO Status */}
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    SEO Status
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-green-600">• Posició mitjana: #3.2</p>
                    <p className="text-xs text-blue-600">• Tràfic orgànic: +18%</p>
                    <p className="text-xs text-gray-600">• Keywords posicionades: 1,247</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => window.location.href = '/admin/departament-marketing'}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Target className="w-4 h-4" />
                  Marketing Enterprise
                </button>
                <button
                  onClick={() => openModal('seoAnalytics')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  Analítiques SEO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departament Financer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('financialDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-yellow-100 rounded-lg flex-shrink-0">
                  <Euro className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament Financer</h3>
                  {!expandedSections.financialDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">€70.4K</span>
                      <span className="text-xs text-gray-500">benefici net</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  3 vencides
                </div>
                {expandedSections.financialDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.financialDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Mètriques financeres */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-xl font-bold text-green-700">€70.4K</div>
                    <div className="text-xs text-green-600">Benefici net</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <div className="text-xl font-bold text-blue-700">92.1%</div>
                    <div className="text-xs text-blue-600">Marge brut</div>
                  </div>
                </div>
                
                {/* ROI i mètriques */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">ROI per canal</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Plans Premium</span>
                      <span className="text-xs font-medium text-green-600">384%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Plans Professional</span>
                      <span className="text-xs font-medium text-blue-600">276%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Marketing digital</span>
                      <span className="text-xs font-medium text-orange-600">147%</span>
                    </div>
                  </div>
                </div>

                {/* Alertes financeres */}
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Alertes financeres
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-red-600">• 3 factures vencides (€1.247)</p>
                    <p className="text-xs text-orange-600">• 5 factures vencen aquesta setmana</p>
                    <p className="text-xs text-green-600">• Cash flow positiu: €45.2K</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => window.location.href = '/admin/departament-financer'}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Euro className="w-4 h-4" />
                  Dashboard Financer
                </button>
                <button
                  onClick={() => openModal('financialReports')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <PieChart className="w-4 h-4" />
                  Informes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Departament Jurídic */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto min-h-fit">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('legalDept')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 bg-indigo-100 rounded-lg flex-shrink-0">
                  <Scale className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">Departament Jurídic</h3>
                  {!expandedSections.legalDept && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-lg font-bold text-green-600">98.7%</span>
                      <span className="text-xs text-gray-500">compliance</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-xs font-medium">
                  2 revisions
                </div>
                {expandedSections.legalDept ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${expandedSections.legalDept ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Mètriques compliance */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-green-50 rounded p-3">
                    <div className="text-xl font-bold text-green-700">98.7%</div>
                    <div className="text-xs text-green-600">Compliance</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <div className="text-xl font-bold text-blue-700">247</div>
                    <div className="text-xs text-blue-600">Reportes processats</div>
                  </div>
                </div>
                
                {/* GDPR i moderació */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Estats legals</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">GDPR compliance</span>
                      <span className="text-xs font-medium text-green-600">✓ Actiu</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Política privacitat</span>
                      <span className="text-xs font-medium text-green-600">✓ Actualitzada</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Termes i condicions</span>
                      <span className="text-xs font-medium text-orange-600">Revisió pendent</span>
                    </div>
                  </div>
                </div>

                {/* Moderació */}
                <div className="bg-indigo-50 border border-indigo-200 rounded p-3">
                  <h5 className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Moderació i reports
                  </h5>
                  <div className="space-y-1">
                    <p className="text-xs text-indigo-600">• 12 reports pendents revisió</p>
                    <p className="text-xs text-green-600">• 247 casos resolts aquest mes</p>
                    <p className="text-xs text-gray-600">• Temps mitjà resolució: 2.4h</p>
                  </div>
                </div>
              </div>
              
              {/* Accions */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <button
                  onClick={() => window.location.href = '/admin/departament-juridic'}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Scale className="w-4 h-4" />
                  Dashboard Jurídic
                </button>
                <button
                  onClick={() => openModal('moderationQueue')}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Moderació
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  )
}