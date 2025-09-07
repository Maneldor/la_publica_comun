'use client'

import { useState } from 'react'
import { 
  Building2, Bot, Users, TrendingUp, Target, BarChart3, 
  MapPin, Phone, Calendar, Mail, FileText, AlertTriangle,
  CheckCircle, Clock, Award, Settings, Eye, Edit,
  ArrowUp, ArrowDown, Activity, Shield, Zap, Star,
  ChevronRight, X, Send
} from 'lucide-react'

// Imports dels components principals
import DashboardExecutiu from './components/DashboardExecutiu'
import GestioTerritorial from './components/GestioTerritorial'
import EquipsDiferenciats from './components/EquipsDiferenciats'
import ProspeccioActiva from './components/ProspeccioActiva'
import GransComptes from './components/GransComptes'
import PipelineLicitacions from './components/PipelineLicitacions'
import IntegracioMarketing from './components/IntegracioMarketing'
import AutomatitzacioComercial from './components/AutomatitzacioComercial'
import ControlGestorsEmpreses from './components/ControlGestorsEmpreses'
import ControlAgentsIA from './components/ControlAgentsIA'

export default function DepartamentComercialPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  // Dades mock per la vista general
  const statsGenerals = {
    territories: {
      total: 17,
      actius: 15,
      gestors: 34,
      coverage: 98.5
    },
    equips: {
      public: {
        membres: 18,
        pipeline: 2450000,
        conversion: 15.2
      },
      privat: {
        membres: 23,
        pipeline: 5680000,
        conversion: 22.8
      },
      ia: {
        agents: 12,
        consultes: 15420,
        conversion: 8.9
      }
    },
    performance: {
      ventesTotals: 8130000,
      objectiu: 7500000,
      cresciment: 18.3,
      forecast: 9200000
    }
  }

  const seccions = [
    { id: 'dashboard', nom: 'Dashboard Executiu', icon: BarChart3 },
    { id: 'territorial', nom: 'Gestió Territorial', icon: MapPin },
    { id: 'equips', nom: 'Equips Diferenciats', icon: Users },
    { id: 'prospeccio', nom: 'Prospecció Activa', icon: Target },
    { id: 'grans-comptes', nom: 'Grans Comptes', icon: Building2 },
    { id: 'licitacions', nom: 'Pipeline Licitacions', icon: FileText },
    { id: 'marketing', nom: 'Integració Marketing', icon: TrendingUp },
    { id: 'automatitzacio', nom: 'Automatització', icon: Bot },
    { id: 'control-gestors', nom: 'Control Gestors', icon: Shield },
    { id: 'control-ia', nom: 'Control Agents IA', icon: Zap }
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
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
                Departament Comercial Enterprise
              </h1>
            </div>
            <p className="text-blue-100">
              Gestió integral per territoris, equips especialitzats i agents IA
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm opacity-90">Vendes YTD</div>
                <div className="text-xl font-bold">€{(statsGenerals.performance.ventesTotals / 1000000).toFixed(1)}M</div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-right">
                <div className="text-sm opacity-90">Creixement</div>
                <div className="text-xl font-bold">{statsGenerals.performance.cresciment}%</div>
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
              <span className="text-sm text-gray-600">Territoris Actius</span>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.territories.actius}</div>
            <div className="text-sm text-gray-600 mt-1">
              {statsGenerals.territories.gestors} gestors assignats
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pipeline Total</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">
              €{((statsGenerals.equips.public.pipeline + statsGenerals.equips.privat.pipeline) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              +12% vs mes anterior
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Conversió Mitjana</span>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">
              {((statsGenerals.equips.public.conversion + statsGenerals.equips.privat.conversion) / 2).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600 mt-1">
              Equips humans + IA
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Agents IA Actius</span>
              <Bot className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.equips.ia.agents}</div>
            <div className="text-sm text-orange-600 mt-1">
              {statsGenerals.equips.ia.consultes} consultes/mes
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
                        ? 'bg-blue-100 text-blue-700' 
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
          {activeSection === 'territorial' && <GestioTerritorial />}
          {activeSection === 'equips' && <EquipsDiferenciats />}
          {activeSection === 'prospeccio' && <ProspeccioActiva />}
          {activeSection === 'grans-comptes' && <GransComptes />}
          {activeSection === 'licitacions' && <PipelineLicitacions />}
          {activeSection === 'marketing' && <IntegracioMarketing />}
          {activeSection === 'automatitzacio' && <AutomatitzacioComercial />}
          {activeSection === 'control-gestors' && <ControlGestorsEmpreses />}
          {activeSection === 'control-ia' && <ControlAgentsIA />}
        </div>
      </div>

      {/* Panel Assistant IA */}
      {showAIAssistant && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Assistant Comercial IA</h3>
                    <p className="text-xs text-gray-600">Especialitzat en estratègia comercial enterprise</p>
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
                <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Hola! Soc el teu assistant comercial enterprise.</p>
                  <p className="text-xs text-gray-700 mt-2">Puc ajudar-te amb:</p>
                  <ul className="text-xs mt-2 space-y-1 text-gray-700">
                    <li>• Anàlisi de forecasting per regions</li>
                    <li>• Optimització pipeline de licitacions</li>
                    <li>• Estratègies per grans comptes</li>
                    <li>• Coordinació equips IA i gestors</li>
                    <li>• Intel·ligència competitiva</li>
                    <li>• ROI de campanyes de marketing</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-1">💡 Suggeriment</div>
                    <div className="text-sm text-gray-800">
                      Revisa el Health Score dels grans comptes. Hi ha 3 comptes amb risc de churn que necessiten atenció immediata.
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs font-medium text-yellow-700 mb-1">⚠️ Alerta</div>
                    <div className="text-sm text-yellow-800">
                      El forecast d'Andalucía mostra 65% confiança. Recomano revisar factors de risc i ajustar estratègia.
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs font-medium text-green-700 mb-1">🎯 Oportunitat</div>
                    <div className="text-sm text-green-800">
                      3 licitacions &gt;€300K amb alta probabilitat d'èxit. Prioritzar preparació documents aquesta setmana.
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
                  placeholder="Pregunta sobre estratègia comercial..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                />
                <button
                  onClick={sendAIMessage}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
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