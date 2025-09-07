'use client'

import { useState } from 'react'
import { 
  Target, Users, Building2, Crown, TrendingUp, BarChart3, 
  MessageSquare, Mail, Calendar, Phone, Globe, Settings, 
  ChevronRight, X, Send, Bot, Brain, Zap, Star, Award,
  Activity, Shield, Search, Filter, RefreshCw, Download,
  ArrowUp, ArrowDown, Eye, Edit, Plus, AlertTriangle
} from 'lucide-react'

// Imports dels components principals
import DashboardExecutiu from './components/DashboardExecutiu'
import EmpleatsPublics from './components/EmpleatsPublics'
import EmpresessColaboradores from './components/EmpresessColaboradores'
import AdministracionsPubliques from './components/AdministracionsPubliques'
import BrandingPlataforma from './components/BrandingPlataforma'
import AttributionModeling from './components/AttributionModeling'
import MarketingAutomation from './components/MarketingAutomation'
import InstitutionalCRM from './components/InstitutionalCRM'
import GovernmentAffairs from './components/GovernmentAffairs'
import SalesEnablement from './components/SalesEnablement'
import CDPUnificat from './components/CDPUnificat'

export default function DepartamentMarketingPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  // Dades mock per la vista general
  const statsGenerals = {
    segments: {
      empleats: {
        usuaris: 24580,
        engagement: 67.3,
        retencio: 84.2,
        nps: 72
      },
      empreses: {
        leads: 1247,
        conversion: 28.4,
        pipeline: 3200000,
        deals: 89
      },
      administracions: {
        institucions: 187,
        contactes: 892,
        reunions: 156,
        propostes: 34
      },
      branding: {
        awareness: 34.7,
        share: 12.8,
        sentiment: 78.3,
        mencions: 2847
      }
    },
    attribution: {
      revenue: 4850000,
      roi: 187,
      channels: 12,
      touchpoints: 15420
    }
  }

  const seccions = [
    { id: 'dashboard', nom: 'Dashboard Executiu', icon: BarChart3 },
    { id: 'empleats', nom: 'Empleats Públics', icon: Users },
    { id: 'empreses', nom: 'Empreses Col·laboradores', icon: Building2 },
    { id: 'administracions', nom: 'Administracions Públiques', icon: Crown },
    { id: 'branding', nom: 'Branding Plataforma', icon: Star },
    { id: 'attribution', nom: 'Attribution Modeling', icon: Brain },
    { id: 'automation', nom: 'Marketing Automation', icon: Zap },
    { id: 'institutional', nom: 'Institutional CRM', icon: Shield },
    { id: 'affairs', nom: 'Government Affairs', icon: Activity },
    { id: 'enablement', nom: 'Sales Enablement', icon: Target },
    { id: 'cdp', nom: 'CDP Unificat', icon: Globe }
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
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
                Departament Marketing Enterprise
              </h1>
            </div>
            <p className="text-purple-100">
              Estratègia quàdruple amb attribution modeling i CDP unificat
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm opacity-90">Attribution Revenue</div>
                <div className="text-xl font-bold">€{(statsGenerals.attribution.revenue / 1000000).toFixed(1)}M</div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-right">
                <div className="text-sm opacity-90">ROI Global</div>
                <div className="text-xl font-bold">{statsGenerals.attribution.roi}%</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Empleats Actius</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.segments.empleats.usuaris.toLocaleString()}</div>
            <div className="text-sm text-blue-600 mt-1">
              {statsGenerals.segments.empleats.engagement}% engagement
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Leads B2B</span>
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.segments.empreses.leads.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              {statsGenerals.segments.empreses.conversion}% conversió
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Institucions</span>
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.segments.administracions.institucions}</div>
            <div className="text-sm text-purple-600 mt-1">
              {statsGenerals.segments.administracions.contactes} contactes
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Brand Awareness</span>
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.segments.branding.awareness}%</div>
            <div className="text-sm text-orange-600 mt-1">
              {statsGenerals.segments.branding.sentiment}% sentiment positiu
            </div>
          </div>
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
                        ? 'bg-purple-100 text-purple-700' 
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
          {activeSection === 'dashboard' && <DashboardExecutiu />}
          {activeSection === 'empleats' && <EmpleatsPublics />}
          {activeSection === 'empreses' && <EmpresessColaboradores />}
          {activeSection === 'administracions' && <AdministracionsPubliques />}
          {activeSection === 'branding' && <BrandingPlataforma />}
          {activeSection === 'attribution' && <AttributionModeling />}
          {activeSection === 'automation' && <MarketingAutomation />}
          {activeSection === 'institutional' && <InstitutionalCRM />}
          {activeSection === 'affairs' && <GovernmentAffairs />}
          {activeSection === 'enablement' && <SalesEnablement />}
          {activeSection === 'cdp' && <CDPUnificat />}
        </div>
      </div>

      {/* Panel Assistant IA */}
      {showAIAssistant && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Assistant Marketing Enterprise</h3>
                    <p className="text-xs text-gray-600">Especialitzat en estratègia multi-audience</p>
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
                <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Hola! Soc el teu assistant de marketing enterprise.</p>
                  <p className="text-xs text-gray-700 mt-2">Puc ajudar-te amb:</p>
                  <ul className="text-xs mt-2 space-y-1 text-gray-700">
                    <li>• Attribution modeling cross-audience</li>
                    <li>• Estratègies diferenciades per 4 segments</li>
                    <li>• Government affairs i institutional relations</li>
                    <li>• CDP unificat i data activation</li>
                    <li>• Public sector sales enablement</li>
                    <li>• ROI measurement i budget allocation</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">💡 Insight</div>
                    <div className="text-sm text-gray-800">
                      El segment Empleats Públics mostra un engagement del 67% però amb oportunitat de millora en retencio long-term.
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-1">🎯 Oportunitat</div>
                    <div className="text-sm text-blue-800">
                      3 administracions autonòmiques mostren alta intenció de compra segons government affairs tracking.
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs font-medium text-green-700 mb-1">📊 Performance</div>
                    <div className="text-sm text-green-800">
                      Attribution model detecta que el canal LinkedIn + eventos físics genera el ROI més alt per institutional sales.
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
                  placeholder="Pregunta sobre estratègia marketing..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                />
                <button
                  onClick={sendAIMessage}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
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