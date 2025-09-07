'use client'

import { useState } from 'react'
import { 
  Scale, FileText, Shield, Users, Building2, Crown, Briefcase,
  Handshake, GraduationCap, UserCheck, ShoppingBag, AlertTriangle,
  CheckCircle, Clock, Bot, Bell, Calendar, Target, BarChart3,
  ChevronRight, X, Send, Eye, Edit, Plus, RefreshCw, Download,
  ArrowUp, ArrowDown, Activity, TrendingUp, Award, Zap, Search
} from 'lucide-react'

// Imports dels components principals
import DashboardJuridic from './components/DashboardJuridic'
import ContractCentral from './components/ContractCentral'
import ComplianceMatrix from './components/ComplianceMatrix'
import LaborRelations from './components/LaborRelations'
import CommercialAgreements from './components/CommercialAgreements'
import UserLegalManagement from './components/UserLegalManagement'
import DisputeResolution from './components/DisputeResolution'
import IntellectualProperty from './components/IntellectualProperty'
import RegulatoryCompliance from './components/RegulatoryCompliance'
import LegalAnalytics from './components/LegalAnalytics'
import DocumentAutomation from './components/DocumentAutomation'
import AILegalAdvisor from './components/AILegalAdvisor'

export default function DepartamentJuridicPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  // Dades mock per la vista general
  const statsGenerals = {
    contracts: {
      total: 3456,
      active: 2891,
      pending: 234,
      expiring30Days: 89,
      byEntity: {
        empleats: 892,
        empreses: 1247,
        administracions: 456,
        sindicats: 78,
        associacions: 234,
        usuaris: 15420,
        proveidors: 345
      }
    },
    compliance: {
      overallScore: 96.7,
      gdprCompliance: 98.2,
      regulatoryCompliance: 94.3,
      contractualCompliance: 97.1,
      openIssues: 23,
      resolvedThisMonth: 156
    },
    disputes: {
      active: 34,
      resolved: 278,
      pending: 12,
      successRate: 87.3,
      avgResolutionDays: 45
    },
    risks: {
      high: 8,
      medium: 23,
      low: 45,
      mitigated: 67
    }
  }

  const seccions = [
    { id: 'dashboard', nom: 'Dashboard Jurídic', icon: BarChart3 },
    { id: 'contracts', nom: 'Contract Central', icon: FileText },
    { id: 'compliance', nom: 'Compliance Matrix', icon: Shield },
    { id: 'labor', nom: 'Relacions Laborals', icon: Users },
    { id: 'commercial', nom: 'Acords Comercials', icon: Building2 },
    { id: 'users', nom: 'Gestió Legal Usuaris', icon: UserCheck },
    { id: 'disputes', nom: 'Resolució Disputes', icon: AlertTriangle },
    { id: 'intellectual', nom: 'Propietat Intel·lectual', icon: Award },
    { id: 'regulatory', nom: 'Compliance Regulatori', icon: Scale },
    { id: 'analytics', nom: 'Legal Analytics', icon: Activity },
    { id: 'automation', nom: 'Automatització', icon: Zap },
    { id: 'advisor', nom: 'AI Legal Advisor', icon: Bot }
  ]

  const toggleAIAssistant = () => setShowAIAssistant(!showAIAssistant)

  const sendAIMessage = () => {
    if (aiMessage.trim()) {
      console.log('Mensaje enviado a IA:', aiMessage)
      setAiMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-lg px-3 py-2 hover:bg-white/30 transition-colors text-sm font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Dashboard General
              </button>
              <div className="w-px h-6 bg-white/30"></div>
              <h1 className="text-3xl font-bold">
                Departament Jurídic Enterprise
              </h1>
            </div>
            <p className="text-indigo-100">
              Gestió legal integral multi-entitat amb IA i automatització avançada
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm opacity-90">Contractes Actius</div>
                <div className="text-xl font-bold">{statsGenerals.contracts.active.toLocaleString()}</div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-right">
                <div className="text-sm opacity-90">Compliance</div>
                <div className="text-xl font-bold">{statsGenerals.compliance.overallScore}%</div>
              </div>
            </div>
            <button
              onClick={toggleAIAssistant}
              className={`p-3 rounded-full transition-all duration-300 ${
                showAIAssistant 
                  ? 'bg-white/25 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              <Bot className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Resum */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Contractes</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.contracts.total.toLocaleString()}</div>
            <div className="text-sm text-orange-600 mt-1">
              {statsGenerals.contracts.expiring30Days} expiren en 30 dies
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Compliance Score</span>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{statsGenerals.compliance.overallScore}%</div>
            <div className="text-sm text-gray-600 mt-1">
              {statsGenerals.compliance.openIssues} issues oberts
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Disputes Actius</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{statsGenerals.disputes.active}</div>
            <div className="text-sm text-green-600 mt-1">
              {statsGenerals.disputes.successRate}% èxit
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Riscos Alts</span>
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{statsGenerals.risks.high}</div>
            <div className="text-sm text-blue-600 mt-1">
              {statsGenerals.risks.mitigated} mitigats
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Entitats Gestionades</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className="text-sm text-gray-600 mt-1">
              Tipus d'stakeholders
            </div>
          </div>
        </div>

        {/* Mini breakdown per tipus d'entitat */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(statsGenerals.contracts.byEntity).map(([entity, count]) => {
            const icons = {
              empleats: Users,
              empreses: Building2,
              administracions: Crown,
              sindicats: Handshake,
              associacions: GraduationCap,
              usuaris: UserCheck,
              proveidors: ShoppingBag
            }
            const Icon = icons[entity as keyof typeof icons] || Users
            const colors = {
              empleats: 'blue',
              empreses: 'green',
              administracions: 'purple',
              sindicats: 'red',
              associacions: 'yellow',
              usuaris: 'indigo',
              proveidors: 'orange'
            }
            const color = colors[entity as keyof typeof colors] || 'gray'
            
            return (
              <div key={entity} className="bg-white rounded-lg border p-2 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 text-${color}-600`} />
                <div className="text-xs text-gray-600 capitalize">{entity}</div>
                <div className="text-sm font-bold">{count.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`flex ${showAIAssistant ? 'mr-96' : ''} transition-all duration-300`}>
        {/* Sidebar Navegació */}
        <div className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {seccions.map(seccio => {
                const Icon = seccio.icon
                return (
                  <button
                    key={seccio.id}
                    onClick={() => setActiveSection(seccio.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === seccio.id 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{seccio.nom}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Contingut Principal */}
        <div className="flex-1 p-6">
          {activeSection === 'dashboard' && <DashboardJuridic />}
          {activeSection === 'contracts' && <ContractCentral />}
          {activeSection === 'compliance' && <ComplianceMatrix />}
          {activeSection === 'labor' && <LaborRelations />}
          {activeSection === 'commercial' && <CommercialAgreements />}
          {activeSection === 'users' && <UserLegalManagement />}
          {activeSection === 'disputes' && <DisputeResolution />}
          {activeSection === 'intellectual' && <IntellectualProperty />}
          {activeSection === 'regulatory' && <RegulatoryCompliance />}
          {activeSection === 'analytics' && <LegalAnalytics />}
          {activeSection === 'automation' && <DocumentAutomation />}
          {activeSection === 'advisor' && <AILegalAdvisor />}
        </div>
      </div>

      {/* Panel Assistant IA */}
      {showAIAssistant && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Legal AI Assistant</h3>
                    <p className="text-xs text-gray-600">Expert en dret multi-entitat</p>
                  </div>
                </div>
                <button
                  onClick={toggleAIAssistant}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Hola! Soc el teu assessor legal IA.</p>
                  <p className="text-xs text-gray-700 mt-2">Puc ajudar-te amb:</p>
                  <ul className="text-xs mt-2 space-y-1 text-gray-700">
                    <li>• Revisió automàtica de contractes</li>
                    <li>• Anàlisi de riscos legals</li>
                    <li>• Compliance GDPR i regulatori</li>
                    <li>• Gestió de disputes i litigis</li>
                    <li>• Propietat intel·lectual</li>
                    <li>• Assessorament multi-entitat</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-xs font-medium text-red-700 mb-1">⚠️ Alerta Urgent</div>
                    <div className="text-sm text-red-800">
                      5 contractes amb empreses col·laboradores expiren en els propers 7 dies. Revisió immediata recomanada.
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs font-medium text-yellow-700 mb-1">📋 Compliance Update</div>
                    <div className="text-sm text-yellow-800">
                      Nova regulació ENS aplicable a administracions. 34 contractes requereixen actualització.
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs font-medium text-green-700 mb-1">✅ Èxit en Resolució</div>
                    <div className="text-sm text-green-800">
                      Dispute amb proveïdor TECH-234 resolt favorablement. Recuperats €45,000 en penalitzacions.
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-1">🤝 Nou Acord</div>
                    <div className="text-sm text-blue-800">
                      Conveni col·lectiu amb Sindicat UGT preparat per signatura. Afecta 892 empleats.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Consulta sobre temes legals..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                />
                <button
                  onClick={sendAIMessage}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

