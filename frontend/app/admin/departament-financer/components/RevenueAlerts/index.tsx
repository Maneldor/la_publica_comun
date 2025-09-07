'use client'

import { useState } from 'react'
import { 
  Bell, AlertTriangle, TrendingUp, TrendingDown, Users, Building2, Crown,
  CheckCircle, Clock, XCircle, Bot, Zap, DollarSign, Target, Award,
  RefreshCw, Eye, Edit, Plus, Settings, Filter, Download,
  ArrowUp, ArrowDown, Activity, BarChart3, PieChart, Calendar,
  Mail, Phone, MessageSquare, FileText
} from 'lucide-react'

export default function RevenueAlerts() {
  const [selectedAlertType, setSelectedAlertType] = useState<'all' | 'churn' | 'upsell' | 'renewal' | 'payment'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [showAutomation, setShowAutomation] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  const alertsOverview = {
    totalAlerts: 156,
    criticalAlerts: 23,
    churnRiskAlerts: 67,
    upsellOpportunities: 89,
    automatedActions: 142,
    manualActions: 14,
    alertsResolved: 1247,
    averageResolutionTime: '4.2 hours'
  }

  const alerts = [
    {
      id: 'ALERT-001234',
      type: 'churn',
      priority: 'critical',
      customer: 'Hospital Vall d\'Hebron',
      entity: 'empleats',
      description: 'Usage declined 67% in last 30 days',
      severity: 'High churn risk detected',
      arrAtRisk: 21456,
      triggered: '2024-01-15 14:23:45',
      status: 'open',
      assignedTo: 'Customer Success Team',
      automatedActions: [
        'Email alert sent to CSM',
        'Health score updated',
        'Task created in CRM'
      ],
      suggestedActions: [
        'Schedule executive call',
        'Provide additional training',
        'Offer service discount'
      ],
      aiConfidence: 94,
      escalated: false
    },
    {
      id: 'ALERT-001235',
      type: 'upsell',
      priority: 'high',
      customer: 'Ajuntament de Barcelona',
      entity: 'administracions',
      description: 'Feature usage at 95% of plan limits',
      severity: 'Strong upsell opportunity',
      arrPotential: 12000,
      triggered: '2024-01-15 09:15:32',
      status: 'in_progress',
      assignedTo: 'Sales Team',
      automatedActions: [
        'Upsell proposal generated',
        'Meeting scheduled',
        'Usage report created'
      ],
      suggestedActions: [
        'Present Enterprise plan',
        'Demo advanced features',
        'Offer pilot period'
      ],
      aiConfidence: 87,
      escalated: false
    },
    {
      id: 'ALERT-001236',
      type: 'payment',
      priority: 'critical',
      customer: 'Indra Sistemas SA',
      entity: 'empreses',
      description: 'Payment failure for 3rd consecutive month',
      severity: 'Immediate collection required',
      arrAtRisk: 59760,
      triggered: '2024-01-14 16:45:21',
      status: 'escalated',
      assignedTo: 'Collections Team',
      automatedActions: [
        'Dunning sequence activated',
        'Service suspension scheduled',
        'Legal notification prepared'
      ],
      suggestedActions: [
        'Contact finance director',
        'Negotiate payment plan',
        'Review credit terms'
      ],
      aiConfidence: 98,
      escalated: true
    },
    {
      id: 'ALERT-001237',
      type: 'renewal',
      priority: 'medium',
      customer: 'Generalitat de Catalunya',
      entity: 'administracions',
      description: 'Contract renewal due in 45 days',
      severity: 'Standard renewal process',
      arrAtRisk: 89280,
      triggered: '2024-01-13 10:30:15',
      status: 'automated',
      assignedTo: 'Renewal Bot',
      automatedActions: [
        'Renewal proposal sent',
        'Meeting scheduled',
        'Contract documents prepared'
      ],
      suggestedActions: [
        'Confirm renewal terms',
        'Schedule stakeholder meeting',
        'Prepare contract amendments'
      ],
      aiConfidence: 91,
      escalated: false
    },
    {
      id: 'ALERT-001238',
      type: 'churn',
      priority: 'high',
      customer: 'Universidad Complutense Madrid',
      entity: 'empleats',
      description: 'Support tickets increased 340% this month',
      severity: 'Customer satisfaction at risk',
      arrAtRisk: 32760,
      triggered: '2024-01-12 13:22:10',
      status: 'in_progress',
      assignedTo: 'Support Team',
      automatedActions: [
        'Support escalation triggered',
        'Technical review scheduled',
        'Customer satisfaction survey sent'
      ],
      suggestedActions: [
        'Assign dedicated support',
        'Conduct technical audit',
        'Provide additional training'
      ],
      aiConfidence: 82,
      escalated: false
    }
  ]

  const automationEngine = {
    churnPrevention: {
      triggers: ['Usage decline > 50%', 'Login frequency < 2/week', 'Support tickets > 5/month'],
      actions: ['CSM notification', 'Health score update', 'Outreach sequence'],
      successRate: 73,
      avgResponseTime: '15 minutes'
    },
    upsellDetection: {
      triggers: ['Usage > 80% limit', 'Feature requests', 'Team growth'],
      actions: ['Proposal generation', 'Sales notification', 'Demo scheduling'],
      successRate: 45,
      avgResponseTime: '30 minutes'
    },
    renewalManagement: {
      triggers: ['90 days to expiry', '60 days to expiry', '30 days to expiry'],
      actions: ['Renewal proposal', 'Meeting scheduling', 'Contract preparation'],
      successRate: 87,
      avgResponseTime: '5 minutes'
    },
    paymentRecovery: {
      triggers: ['Payment failure', 'Card expiry', 'Insufficient funds'],
      actions: ['Dunning sequence', 'Payment retry', 'Alternative payment'],
      successRate: 68,
      avgResponseTime: '2 minutes'
    }
  }

  const workflowSteps = [
    {
      step: 'Detection',
      description: 'AI monitors customer behavior patterns',
      automated: true,
      avgTime: '< 1 minute',
      accuracy: 94
    },
    {
      step: 'Classification',
      description: 'Alert type and priority assignment',
      automated: true,
      avgTime: '< 30 seconds',
      accuracy: 91
    },
    {
      step: 'Action Planning',
      description: 'Generate recommended action plan',
      automated: true,
      avgTime: '2 minutes',
      accuracy: 87
    },
    {
      step: 'Assignment',
      description: 'Route to appropriate team/person',
      automated: true,
      avgTime: '< 10 seconds',
      accuracy: 98
    },
    {
      step: 'Execution',
      description: 'Automated or manual action execution',
      automated: false,
      avgTime: '4.2 hours',
      accuracy: 85
    },
    {
      step: 'Follow-up',
      description: 'Monitor progress and escalate if needed',
      automated: true,
      avgTime: '24 hours',
      accuracy: 89
    }
  ]

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'churn': return 'text-red-600 bg-red-100'
      case 'upsell': return 'text-green-600 bg-green-100'
      case 'renewal': return 'text-blue-600 bg-blue-100'
      case 'payment': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'text-red-600 bg-red-100'
      case 'in_progress': return 'text-orange-600 bg-orange-100'
      case 'automated': return 'text-blue-600 bg-blue-100'
      case 'escalated': return 'text-purple-600 bg-purple-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Revenue Alerts & Early Warnings</h2>
            <p className="text-gray-600">Automated churn detection i upselling opportunities amb IA</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAutomation(!showAutomation)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showAutomation ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              Automation Status
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Alerts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipus d'Alerta</label>
            <select 
              value={selectedAlertType} 
              onChange={(e) => setSelectedAlertType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les alertes</option>
              <option value="churn">Risc de Churn</option>
              <option value="upsell">Oportunitats Upsell</option>
              <option value="renewal">Renovacions</option>
              <option value="payment">Pagaments</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritat</label>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les prioritats</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Mitjana</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Alertes Actives</span>
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{alertsOverview.totalAlerts}</div>
          <div className="text-sm text-red-600">{alertsOverview.criticalAlerts} crítiques</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Risc de Churn</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{alertsOverview.churnRiskAlerts}</div>
          <div className="text-sm text-gray-600">clients en risc</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Oportunitats Upsell</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{alertsOverview.upsellOpportunities}</div>
          <div className="text-sm text-green-600">oportunitats detectades</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Automatització</span>
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {((alertsOverview.automatedActions / alertsOverview.totalAlerts) * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-purple-600">processat automàtic</div>
        </div>
      </div>

      {/* Automation Status */}
      {showAutomation && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">AI-Powered Alert Engine</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Real-time Monitoring
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(automationEngine).map(([key, engine]) => (
              <div key={key} className="bg-white rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    key === 'churnPrevention' ? 'bg-red-100 text-red-600' :
                    key === 'upsellDetection' ? 'bg-green-100 text-green-600' :
                    key === 'renewalManagement' ? 'bg-blue-100 text-blue-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {key === 'churnPrevention' ? <TrendingDown className="w-6 h-6" /> :
                     key === 'upsellDetection' ? <TrendingUp className="w-6 h-6" /> :
                     key === 'renewalManagement' ? <RefreshCw className="w-6 h-6" /> :
                     <DollarSign className="w-6 h-6" />}
                  </div>
                  <h4 className="font-medium text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className={`font-medium ${
                      engine.successRate >= 80 ? 'text-green-600' :
                      engine.successRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {engine.successRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-medium text-blue-600">{engine.avgResponseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Steps */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-4">Automated Workflow Process</h4>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    step.automated ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <h5 className="font-medium text-xs mb-1">{step.step}</h5>
                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                  <div className="text-xs text-blue-600">{step.avgTime}</div>
                  <div className="text-xs text-green-600">{step.accuracy}% precisió</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold">Active Revenue Alerts</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              {alerts.filter(alert => 
                (selectedAlertType === 'all' || alert.type === selectedAlertType) &&
                (selectedPriority === 'all' || alert.priority === selectedPriority)
              ).length} alertes
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-center py-3 px-4">Type</th>
                <th className="text-center py-3 px-4">Priority</th>
                <th className="text-right py-3 px-4">ARR Impact</th>
                <th className="text-center py-3 px-4">AI Confidence</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">Assigned</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts
                .filter(alert => {
                  if (selectedAlertType !== 'all' && alert.type !== selectedAlertType) return false
                  if (selectedPriority !== 'all' && alert.priority !== selectedPriority) return false
                  return true
                })
                .map((alert) => {
                  const entityColor = getEntityColor(alert.entity)
                  const EntityIcon = alert.entity === 'empleats' ? Users : alert.entity === 'empreses' ? Building2 : Crown
                  
                  return (
                    <tr 
                      key={alert.id} 
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        selectedAlert === alert.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-${entityColor}-100 rounded-lg flex items-center justify-center`}>
                            <EntityIcon className={`w-4 h-4 text-${entityColor}-600`} />
                          </div>
                          <div>
                            <div className="font-medium">{alert.customer}</div>
                            <div className="text-sm text-gray-600">{alert.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getTypeColor(alert.type)}`}>
                          {alert.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                          {alert.escalated && <ArrowUp className="w-3 h-3 inline ml-1" />}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className={`font-semibold ${
                          alert.type === 'churn' || alert.type === 'payment' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {alert.type === 'upsell' ? '+' : ''}€{(alert.arrAtRisk || alert.arrPotential || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {alert.type === 'upsell' ? 'potential' : 'at risk'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={`font-semibold ${
                          alert.aiConfidence >= 90 ? 'text-green-600' :
                          alert.aiConfidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {alert.aiConfidence}%
                        </div>
                        <div className="text-xs text-gray-600">confiança</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {alert.assignedTo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded" title="View Details">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" title="Send Email">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </button>
                          {alert.priority === 'critical' && (
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

        {/* Alert Details Panel */}
        {selectedAlert && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {(() => {
              const alert = alerts.find(a => a.id === selectedAlert)
              if (!alert) return null
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Alert Details: {alert.id}</h4>
                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Automated Actions Taken:</h5>
                      <ul className="space-y-1">
                        {alert.automatedActions.map((action, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Suggested Next Actions:</h5>
                      <ul className="space-y-1">
                        {alert.suggestedActions.map((action, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Triggered: {alert.triggered}</span>
                      <span>Severity: {alert.severity}</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}