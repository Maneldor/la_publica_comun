'use client'

import { useState } from 'react'
import { 
  Euro, TrendingUp, BarChart3, DollarSign, PieChart, Target,
  Calendar, AlertTriangle, CheckCircle, Clock, FileText, Shield,
  Users, Building2, Crown, Bot, CreditCard, Scale, Activity,
  ChevronRight, X, Send, Eye, Edit, Plus, RefreshCw, Download,
  ArrowUp, ArrowDown, Zap, Award, Bell, Search, Filter, Settings
} from 'lucide-react'

// Imports dels components principals
import DashboardExecutiu from './components/DashboardExecutiu'
import FPAForecasting from './components/FPAForecasting'
import RevenueManagement from './components/RevenueManagement'
import SubscriptionBilling from './components/SubscriptionBilling'
import MultiEntityAccounting from './components/MultiEntityAccounting'
import ContractLifecycle from './components/ContractLifecycle'
import CustomerFinancial from './components/CustomerFinancial'
import FacturacioElectronica from './components/FacturacioElectronica'
import RevenueAlerts from './components/RevenueAlerts'
import FinancialForecasting from './components/FinancialForecasting'
import BusinessIntelligence from './components/BusinessIntelligence'
import RiskManagement from './components/RiskManagement'

export default function DepartamentFinancerPage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  // Dades mock per la vista general
  const statsGenerals = {
    revenue: {
      arr: 4850000,
      mrr: 404166,
      growth_rate: 18.3,
      churn_rate: 3.2
    },
    subscription_plans: {
      essential: { price: 79, subscribers: 1247, revenue: 98513 },
      professional: { price: 149, subscribers: 892, revenue: 132908 },
      enterprise: { price: 249, subscribers: 234, revenue: 58266 }
    },
    segments: {
      empleats: { revenue: 120000, margin: 92.1, contracts: 1580 },
      empreses: { revenue: 3200000, margin: 76.8, contracts: 1247 },
      administracions: { revenue: 1530000, margin: 84.3, contracts: 187 }
    },
    financial_health: {
      cash_flow: 950000,
      runway_months: 28,
      burn_rate: 165000,
      ltv_cac: 4.8
    }
  }

  const seccions = [
    { id: 'dashboard', nom: 'Dashboard Executiu', icon: BarChart3 },
    { id: 'fpa', nom: 'FP&A Forecasting', icon: TrendingUp },
    { id: 'revenue', nom: 'Revenue Management', icon: DollarSign },
    { id: 'billing', nom: 'Subscription Billing', icon: CreditCard },
    { id: 'accounting', nom: 'Multi-Entity Accounting', icon: PieChart },
    { id: 'contracts', nom: 'Contract Lifecycle', icon: FileText },
    { id: 'customer', nom: 'Customer Financial', icon: Users },
    { id: 'electronica', nom: 'Facturació Electrònica', icon: Zap },
    { id: 'alerts', nom: 'Revenue Alerts', icon: Bell },
    { id: 'forecasting', nom: 'Financial Forecasting', icon: Target },
    { id: 'business', nom: 'Business Intelligence', icon: Award },
    { id: 'risk', nom: 'Risk Management', icon: Shield }
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
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4">
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
                Departament Financer Enterprise
              </h1>
            </div>
            <p className="text-yellow-100">
              FP&A avançat, revenue management i compliance IFRS 15 amb IA predictiva
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm opacity-90">ARR</div>
                <div className="text-xl font-bold">€{(statsGenerals.revenue.arr / 1000000).toFixed(1)}M</div>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-right">
                <div className="text-sm opacity-90">Growth Rate</div>
                <div className="text-xl font-bold">{statsGenerals.revenue.growth_rate}%</div>
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
              <span className="text-sm text-gray-600">MRR</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">€{statsGenerals.revenue.mrr.toLocaleString()}</div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              +{statsGenerals.revenue.growth_rate}% growth
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Subscribers Totals</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">
              {(statsGenerals.subscription_plans.essential.subscribers + 
                statsGenerals.subscription_plans.professional.subscribers + 
                statsGenerals.subscription_plans.enterprise.subscribers).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Churn: {statsGenerals.revenue.churn_rate}%
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Cash Flow</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">€{(statsGenerals.financial_health.cash_flow / 1000).toFixed(0)}K</div>
            <div className="text-sm text-purple-600 mt-1">
              {statsGenerals.financial_health.runway_months} mesos runway
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">LTV/CAC</span>
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">{statsGenerals.financial_health.ltv_cac}x</div>
            <div className="text-sm text-orange-600 mt-1">
              Objectiu: {'>'}3x
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
                        ? 'bg-yellow-100 text-yellow-700' 
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
          {activeSection === 'fpa' && <FPAForecasting />}
          {activeSection === 'revenue' && <RevenueManagement />}
          {activeSection === 'billing' && <SubscriptionBilling />}
          {activeSection === 'accounting' && <MultiEntityAccounting />}
          {activeSection === 'contracts' && <ContractLifecycle />}
          {activeSection === 'customer' && <CustomerFinancial />}
          {activeSection === 'electronica' && <FacturacioElectronica />}
          {activeSection === 'alerts' && <RevenueAlerts />}
          {activeSection === 'forecasting' && <FinancialForecasting />}
          {activeSection === 'business' && <BusinessIntelligence />}
          {activeSection === 'risk' && <RiskManagement />}
        </div>
      </div>

      {/* Panel Assistant IA */}
      {showAIAssistant && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CFO Assistant IA</h3>
                    <p className="text-xs text-gray-600">Especialitzat en FP&A i revenue analytics</p>
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
                <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Hola! Soc el teu CFO assistant especialitzat.</p>
                  <p className="text-xs text-gray-700 mt-2">Puc ajudar-te amb:</p>
                  <ul className="text-xs mt-2 space-y-1 text-gray-700">
                    <li>• FP&A forecasting per línies de negoci</li>
                    <li>• Revenue recognition IFRS 15</li>
                    <li>• ARR/MRR predictions i cohort analysis</li>
                    <li>• Churn analysis i upselling opportunities</li>
                    <li>• Multi-entity consolidació</li>
                    <li>• Risk management i compliance</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs font-medium text-green-700 mb-1">💰 Revenue Insight</div>
                    <div className="text-sm text-green-800">
                      El segment Empreses mostra un LTV/CAC de 6.2x, suggereix oportunitat d'augmentar inversió en lead generation B2B.
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-xs font-medium text-yellow-700 mb-1">⚠️ Contract Alert</div>
                    <div className="text-sm text-yellow-800">
                      34 contractes Enterprise expiren els propers 30 dies. Renewal pipeline estimat: €847K.
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-medium text-blue-700 mb-1">📊 Forecast Update</div>
                    <div className="text-sm text-blue-800">
                      Q2 ARR forecast actualitzat: €5.2M (+7.2% vs prediction anterior) basat en pipeline actual.
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
                  placeholder="Pregunta sobre finances i revenue..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                />
                <button
                  onClick={sendAIMessage}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors"
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