'use client'

import { useState } from 'react'
import { 
  FileText, Calendar, AlertTriangle, CheckCircle, Clock, XCircle,
  Bell, Mail, Phone, RefreshCw, Eye, Edit, Plus, Settings,
  Filter, Download, Search, Users, Building2, Crown, Bot,
  DollarSign, TrendingUp, BarChart3, Activity, Award, Target,
  ArrowUp, ArrowDown, ChevronDown, ChevronRight, Zap
} from 'lucide-react'

export default function ContractLifecycle() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'expiring' | 'renewed' | 'at_risk'>('all')
  const [selectedEntity, setSelectedEntity] = useState<'all' | 'empleats' | 'empreses' | 'administracions'>('all')
  const [alertPeriod, setAlertPeriod] = useState<'30' | '60' | '90'>('90')
  const [showAutomationStatus, setShowAutomationStatus] = useState(true)

  const contractsOverview = {
    total: 2891,
    expiring30: 89,
    expiring60: 156,
    expiring90: 234,
    atRisk: 67,
    renewalRate: 87.3,
    averageValue: 3567,
    totalValue: 10312450,
    automationRate: 94.2
  }

  const contracts = [
    {
      id: 'CTR-2024-001234',
      customer: 'Ajuntament de Barcelona',
      entity: 'administracions',
      plan: 'Enterprise',
      value: 2988,
      startDate: '2023-02-15',
      endDate: '2024-02-15',
      daysToExpiry: 25,
      status: 'expiring',
      renewalProbability: 92,
      contactPerson: 'Maria García',
      lastContact: '2024-01-10',
      automatedAlerts: 3,
      notes: 'High satisfaction, likely renewal'
    },
    {
      id: 'CTR-2024-001235',
      customer: 'Hospital Universitari Vall d\'Hebron',
      entity: 'empleats',
      plan: 'Professional',
      value: 1788,
      startDate: '2023-03-01',
      endDate: '2024-03-01',
      daysToExpiry: 35,
      status: 'expiring',
      renewalProbability: 78,
      contactPerson: 'Dr. Josep Martínez',
      lastContact: '2024-01-08',
      automatedAlerts: 2,
      notes: 'Budget concerns mentioned'
    },
    {
      id: 'CTR-2024-001236',
      customer: 'Indra Sistemas SA',
      entity: 'empreses',
      plan: 'Enterprise',
      value: 4980,
      startDate: '2023-01-10',
      endDate: '2024-01-10',
      daysToExpiry: 5,
      status: 'at_risk',
      renewalProbability: 45,
      contactPerson: 'Ana Rodríguez',
      lastContact: '2023-12-20',
      automatedAlerts: 5,
      notes: 'No response to renewal calls'
    },
    {
      id: 'CTR-2024-001237',
      customer: 'Generalitat de Catalunya',
      entity: 'administracions',
      plan: 'Enterprise Premium',
      value: 7440,
      startDate: '2023-04-01',
      endDate: '2024-04-01',
      daysToExpiry: 70,
      status: 'expiring',
      renewalProbability: 95,
      contactPerson: 'Jordi Puigdemont',
      lastContact: '2024-01-12',
      automatedAlerts: 1,
      notes: 'Early renewal discussion scheduled'
    },
    {
      id: 'CTR-2024-001238',
      customer: 'Universidad Complutense Madrid',
      entity: 'empleats',
      plan: 'Professional',
      value: 2184,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      daysToExpiry: 350,
      status: 'active',
      renewalProbability: 88,
      contactPerson: 'Prof. Carmen López',
      lastContact: '2024-01-05',
      automatedAlerts: 0,
      notes: 'New contract, high engagement'
    }
  ]

  const renewalWorkflow = [
    {
      stage: '90 Days Alert',
      description: 'Initial renewal notification sent',
      automated: true,
      completed: 234,
      pending: 12,
      actions: ['Email sent', 'CRM updated', 'Task assigned']
    },
    {
      stage: '60 Days Alert',
      description: 'Follow-up with renewal proposal',
      automated: true,
      completed: 156,
      pending: 8,
      actions: ['Proposal generated', 'Call scheduled', 'Stakeholders notified']
    },
    {
      stage: '30 Days Alert',
      description: 'Final renewal push',
      automated: false,
      completed: 89,
      pending: 15,
      actions: ['Executive involvement', 'Custom proposal', 'Escalation triggered']
    },
    {
      stage: 'Renewal Execution',
      description: 'Contract renewal processing',
      automated: true,
      completed: 67,
      pending: 3,
      actions: ['Contract generated', 'E-signature sent', 'Billing updated']
    }
  ]

  const automationMetrics = {
    alertsGenerated: 1247,
    emailsSent: 3456,
    proposalsCreated: 234,
    callsScheduled: 156,
    escalationsTriggered: 23,
    renewalsProcessed: 89,
    successRate: 87.3,
    averageRenewalTime: '12.5 days'
  }

  const getEntityIcon = (entity: string) => {
    switch(entity) {
      case 'empleats': return Users
      case 'empreses': return Building2
      case 'administracions': return Crown
      default: return FileText
    }
  }

  const getEntityColor = (entity: string) => {
    switch(entity) {
      case 'empleats': return 'blue'
      case 'empreses': return 'green'
      case 'administracions': return 'purple'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'expiring': return 'text-orange-600 bg-orange-100'
      case 'at_risk': return 'text-red-600 bg-red-100'
      case 'renewed': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRenewalProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-100'
    if (probability >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600'
    if (days <= 60) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contract Lifecycle Management</h2>
            <p className="text-gray-600">Gestió completa amb alertes automàtiques 90/60/30 dies</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAutomationStatus(!showAutomationStatus)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showAutomationStatus ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              Automation Status
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Contracts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar</label>
            <select 
              value={selectedFilter} 
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els contractes</option>
              <option value="expiring">Properament vencen</option>
              <option value="at_risk">En risc</option>
              <option value="renewed">Renovats</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entitat</label>
            <select 
              value={selectedEntity} 
              onChange={(e) => setSelectedEntity(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les entitats</option>
              <option value="empleats">Empleats Públics</option>
              <option value="empreses">Empreses</option>
              <option value="administracions">Administracions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alerta Periode</label>
            <select 
              value={alertPeriod} 
              onChange={(e) => setAlertPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="30">30 dies</option>
              <option value="60">60 dies</option>
              <option value="90">90 dies</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Contractes</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{contractsOverview.total.toLocaleString()}</div>
          <div className="text-sm text-gray-600">€{(contractsOverview.totalValue / 1000000).toFixed(1)}M valor</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Expiren 90 dies</span>
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{contractsOverview.expiring90}</div>
          <div className="text-sm text-gray-600">Alertes enviades</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">En Risc</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{contractsOverview.atRisk}</div>
          <div className="text-sm text-red-600">Necessiten atenció</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Renewal Rate</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{contractsOverview.renewalRate}%</div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            +2.1% vs mes anterior
          </div>
        </div>
      </div>

      {/* Automation Status */}
      {showAutomationStatus && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Renewal Automation Engine</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {automationMetrics.successRate}% Success Rate
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{automationMetrics.alertsGenerated}</div>
              <div className="text-sm text-gray-600">Alertes generades</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{automationMetrics.emailsSent}</div>
              <div className="text-sm text-gray-600">Emails enviats</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{automationMetrics.renewalsProcessed}</div>
              <div className="text-sm text-gray-600">Renovacions processades</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{automationMetrics.averageRenewalTime}</div>
              <div className="text-sm text-gray-600">Temps mitjà renovació</div>
            </div>
          </div>

          {/* Renewal Workflow */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-4">Automated Renewal Workflow</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {renewalWorkflow.map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.automated ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {stage.automated ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    </div>
                    <h5 className="font-medium text-sm">{stage.stage}</h5>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{stage.description}</p>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Completed:</span>
                      <span className="font-medium text-green-600">{stage.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending:</span>
                      <span className="font-medium text-orange-600">{stage.pending}</span>
                    </div>
                  </div>
                  {idx < renewalWorkflow.length - 1 && (
                    <ChevronRight className="absolute -right-2 top-4 w-4 h-4 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Contract Dashboard</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {contracts.filter(c => selectedFilter === 'all' || c.status === selectedFilter || 
                (selectedFilter === 'expiring' && ['expiring', 'at_risk'].includes(c.status))).length} contractes
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-center py-3 px-4">Entity</th>
                <th className="text-right py-3 px-4">Value</th>
                <th className="text-center py-3 px-4">Expires In</th>
                <th className="text-center py-3 px-4">Renewal Prob.</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Alerts Sent</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts
                .filter(contract => {
                  if (selectedFilter === 'all') return true
                  if (selectedFilter === 'expiring') return ['expiring', 'at_risk'].includes(contract.status)
                  return contract.status === selectedFilter
                })
                .filter(contract => {
                  if (selectedEntity === 'all') return true
                  return contract.entity === selectedEntity
                })
                .map((contract) => {
                  const Icon = getEntityIcon(contract.entity)
                  const color = getEntityColor(contract.entity)
                  
                  return (
                    <tr key={contract.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{contract.customer}</div>
                          <div className="text-sm text-gray-600">{contract.plan}</div>
                          <div className="text-xs text-gray-500">ID: {contract.id}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
                          <Icon className="w-3 h-3" />
                          <span className="text-xs capitalize">{contract.entity}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">€{contract.value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <div className={`font-semibold ${getUrgencyColor(contract.daysToExpiry)}`}>
                          {contract.daysToExpiry} dies
                        </div>
                        <div className="text-xs text-gray-500">{contract.endDate}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRenewalProbabilityColor(contract.renewalProbability)}`}>
                          {contract.renewalProbability}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Bell className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{contract.automatedAlerts}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded" title="View Contract">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" title="Send Email">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" title="Schedule Call">
                            <Phone className="w-4 h-4 text-green-600" />
                          </button>
                          {contract.status === 'at_risk' && (
                            <button className="p-1 hover:bg-gray-200 rounded" title="Escalate">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Details Panel (placeholder for expandable details) */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Recent Contract Activity</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <div className="font-medium text-green-900">Contract Renewed Successfully</div>
              <div className="text-sm text-green-700">Generalitat de Catalunya - Enterprise Premium (€7,440)</div>
            </div>
            <div className="text-xs text-green-600">2 hours ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">Automated Renewal Proposal Sent</div>
              <div className="text-sm text-blue-700">Hospital Vall d'Hebron - 60-day renewal notice</div>
            </div>
            <div className="text-xs text-blue-600">4 hours ago</div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <div className="font-medium text-red-900">Contract at Risk - No Response</div>
              <div className="text-sm text-red-700">Indra Sistemas SA - 5 days to expiry, escalation triggered</div>
            </div>
            <div className="text-xs text-red-600">6 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  )
}