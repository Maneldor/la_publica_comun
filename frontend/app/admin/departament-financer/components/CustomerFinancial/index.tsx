'use client'

import { useState } from 'react'
import { 
  Users, Building2, Crown, CreditCard, DollarSign, AlertTriangle,
  CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, BarChart3,
  Shield, Award, Target, Eye, Edit, Plus, Settings, Filter,
  Download, Search, RefreshCw, Mail, Phone, Bot, Calendar,
  ArrowUp, ArrowDown, Activity, FileText, Bell, Zap
} from 'lucide-react'

export default function CustomerFinancial() {
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'empleats' | 'empreses' | 'administracions'>('all')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [showCreditDetails, setShowCreditDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const financialOverview = {
    totalCustomers: 2891,
    totalARR: 5980000,
    averageARPU: 207.45,
    creditExposure: 456000,
    pastDueAmount: 67800,
    collectionsInProcess: 23400,
    averagePaymentDays: 32,
    collectionRate: 96.7
  }

  const customers = [
    {
      id: 'CUST-001234',
      name: 'Ajuntament de Barcelona',
      segment: 'administracions',
      plan: 'Enterprise',
      arr: 35760,
      creditScore: 850,
      creditLimit: 50000,
      currentBalance: 2988,
      pastDue: 0,
      paymentHistory: 98.5,
      averagePaymentDays: 15,
      riskLevel: 'low',
      lastPayment: '2024-01-15',
      paymentMethod: 'Bank Transfer',
      collectionStatus: 'current',
      notes: 'Excellent payment history, government backed'
    },
    {
      id: 'CUST-001235',
      name: 'Indra Sistemas SA',
      segment: 'empreses',
      plan: 'Enterprise',
      arr: 59760,
      creditScore: 720,
      creditLimit: 75000,
      currentBalance: 4980,
      pastDue: 4980,
      paymentHistory: 85.2,
      averagePaymentDays: 45,
      riskLevel: 'medium',
      lastPayment: '2023-11-20',
      paymentMethod: 'Credit Card',
      collectionStatus: 'dunning',
      notes: 'Recent payment delays, monitoring required'
    },
    {
      id: 'CUST-001236',
      name: 'Hospital Vall d\'Hebron',
      segment: 'empleats',
      plan: 'Professional',
      arr: 21456,
      creditScore: 680,
      creditLimit: 30000,
      currentBalance: 1788,
      pastDue: 1788,
      paymentHistory: 79.3,
      averagePaymentDays: 65,
      riskLevel: 'high',
      lastPayment: '2023-10-15',
      paymentMethod: 'Invoice',
      collectionStatus: 'collections',
      notes: 'Financial difficulties, payment plan needed'
    },
    {
      id: 'CUST-001237',
      name: 'Generalitat de Catalunya',
      segment: 'administracions',
      plan: 'Enterprise Premium',
      arr: 89280,
      creditScore: 900,
      creditLimit: 100000,
      currentBalance: 7440,
      pastDue: 0,
      paymentHistory: 99.8,
      averagePaymentDays: 12,
      riskLevel: 'low',
      lastPayment: '2024-01-14',
      paymentMethod: 'Bank Transfer',
      collectionStatus: 'current',
      notes: 'Premium customer, automatic payments'
    },
    {
      id: 'CUST-001238',
      name: 'Telefónica España SA',
      segment: 'empreses',
      plan: 'Enterprise',
      arr: 47880,
      creditScore: 750,
      creditLimit: 60000,
      currentBalance: 3990,
      pastDue: 0,
      paymentHistory: 92.7,
      averagePaymentDays: 28,
      riskLevel: 'low',
      lastPayment: '2024-01-12',
      paymentMethod: 'ACH',
      collectionStatus: 'current',
      notes: 'Large corporation, standard payment terms'
    }
  ]

  const collectionsWorkflow = [
    {
      stage: 'Pre-Dunning',
      description: 'Friendly payment reminder',
      daysOverdue: '1-7',
      automated: true,
      customers: 12,
      amount: 15600,
      successRate: 78
    },
    {
      stage: 'Soft Dunning',
      description: 'Formal payment request',
      daysOverdue: '8-30',
      automated: true,
      customers: 8,
      amount: 23400,
      successRate: 65
    },
    {
      stage: 'Hard Dunning',
      description: 'Service suspension warning',
      daysOverdue: '31-60',
      automated: false,
      customers: 5,
      amount: 18900,
      successRate: 45
    },
    {
      stage: 'Collections',
      description: 'External collections agency',
      daysOverdue: '60+',
      automated: false,
      customers: 3,
      amount: 9900,
      successRate: 25
    }
  ]

  const creditScoringModel = {
    factors: [
      { factor: 'Payment History', weight: 35, score: 92 },
      { factor: 'Outstanding Balance', weight: 20, score: 88 },
      { factor: 'Company Size/Revenue', weight: 15, score: 85 },
      { factor: 'Industry Risk', weight: 10, score: 90 },
      { factor: 'Geographic Risk', weight: 10, score: 95 },
      { factor: 'Relationship Length', weight: 10, score: 87 }
    ],
    overallScore: 89,
    recommendedAction: 'Maintain current credit limits'
  }

  const paymentMethods = {
    bankTransfer: { count: 1247, percentage: 43.1, averageDays: 18 },
    creditCard: { count: 892, percentage: 30.8, averageDays: 2 },
    ach: { count: 456, percentage: 15.8, averageDays: 5 },
    invoice: { count: 296, percentage: 10.3, averageDays: 45 }
  }

  const getSegmentIcon = (segment: string) => {
    switch(segment) {
      case 'empleats': return Users
      case 'empreses': return Building2
      case 'administracions': return Crown
      default: return Users
    }
  }

  const getSegmentColor = (segment: string) => {
    switch(segment) {
      case 'empleats': return 'blue'
      case 'empreses': return 'green'
      case 'administracions': return 'purple'
      default: return 'gray'
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCollectionStatusColor = (status: string) => {
    switch(status) {
      case 'current': return 'text-green-600 bg-green-100'
      case 'dunning': return 'text-orange-600 bg-orange-100'
      case 'collections': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600'
    if (score >= 700) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Financial Management</h2>
            <p className="text-gray-600">Credit scoring i collections workflow automàtic</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCreditDetails(!showCreditDetails)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showCreditDetails ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Credit Model
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Segment</label>
            <select 
              value={selectedSegment} 
              onChange={(e) => setSelectedSegment(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els segments</option>
              <option value="empleats">Empleats Públics</option>
              <option value="empreses">Empreses</option>
              <option value="administracions">Administracions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select 
              value={selectedRiskLevel} 
              onChange={(e) => setSelectedRiskLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els riscos</option>
              <option value="low">Risc baix</option>
              <option value="medium">Risc mitjà</option>
              <option value="high">Risc alt</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update Scores
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total ARR</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">€{(financialOverview.totalARR / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600">{financialOverview.totalCustomers} customers</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Past Due</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">€{(financialOverview.pastDueAmount / 1000).toFixed(0)}K</div>
          <div className="text-sm text-red-600">{((financialOverview.pastDueAmount / financialOverview.totalARR) * 100).toFixed(1)}% of ARR</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Collection Rate</span>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{financialOverview.collectionRate}%</div>
          <div className="text-sm text-blue-600 flex items-center gap-1">
            <ArrowUp className="w-4 h-4" />
            +0.3% vs mes anterior
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Payment Days</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{financialOverview.averagePaymentDays}</div>
          <div className="text-sm text-purple-600">dies</div>
        </div>
      </div>

      {/* Credit Scoring Model */}
      {showCreditDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">AI Credit Scoring Model</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Score: {creditScoringModel.overallScore}/100
            </span>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h4 className="font-medium mb-4">Scoring Factors & Weights</h4>
            <div className="space-y-3">
              {creditScoringModel.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <span className="text-sm text-gray-600">{factor.weight}% weight</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-blue-600">
                    {factor.score}/100
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>AI Recommendation:</strong> {creditScoringModel.recommendedAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collections Workflow */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold">Collections Workflow</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
            Automated Process
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {collectionsWorkflow.map((stage, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stage.automated ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stage.automated ? <Bot className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                </div>
                <h4 className="font-medium text-sm">{stage.stage}</h4>
              </div>
              
              <p className="text-xs text-gray-600 mb-3">{stage.description}</p>
              <div className="text-xs text-gray-500 mb-3">{stage.daysOverdue} dies</div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customers:</span>
                  <span className="font-medium">{stage.customers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">€{(stage.amount / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className={`font-medium ${
                    stage.successRate >= 70 ? 'text-green-600' :
                    stage.successRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stage.successRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Financial Table */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Customer Financial Status</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {customers.filter(c => 
                (selectedSegment === 'all' || c.segment === selectedSegment) &&
                (selectedRiskLevel === 'all' || c.riskLevel === selectedRiskLevel)
              ).length} customers
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-center py-3 px-4">Credit Score</th>
                <th className="text-right py-3 px-4">ARR</th>
                <th className="text-right py-3 px-4">Balance</th>
                <th className="text-right py-3 px-4">Past Due</th>
                <th className="text-center py-3 px-4">Risk Level</th>
                <th className="text-center py-3 px-4">Collection Status</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .filter(customer => {
                  if (selectedSegment !== 'all' && customer.segment !== selectedSegment) return false
                  if (selectedRiskLevel !== 'all' && customer.riskLevel !== selectedRiskLevel) return false
                  return true
                })
                .map((customer) => {
                  const Icon = getSegmentIcon(customer.segment)
                  const color = getSegmentColor(customer.segment)
                  
                  return (
                    <tr 
                      key={customer.id} 
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        selectedCustomer === customer.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 text-${color}-600`} />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.plan}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-lg font-bold ${getCreditScoreColor(customer.creditScore)}`}>
                          {customer.creditScore}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">€{customer.arr.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">€{customer.currentBalance.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={customer.pastDue > 0 ? 'font-semibold text-red-600' : 'text-gray-600'}>
                          €{customer.pastDue.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getRiskColor(customer.riskLevel)}`}>
                          {customer.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getCollectionStatusColor(customer.collectionStatus)}`}>
                          {customer.collectionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded" title="View Details">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded" title="Send Email">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </button>
                          {customer.collectionStatus !== 'current' && (
                            <button className="p-1 hover:bg-gray-200 rounded" title="Collection Action">
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

        {/* Customer Details Panel */}
        {selectedCustomer && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {(() => {
              const customer = customers.find(c => c.id === selectedCustomer)
              if (!customer) return null
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Customer Details: {customer.name}</h4>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Payment History</div>
                      <div className="font-semibold">{customer.paymentHistory}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Credit Limit</div>
                      <div className="font-semibold">€{customer.creditLimit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Avg Payment Days</div>
                      <div className="font-semibold">{customer.averagePaymentDays} dies</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Payment</div>
                      <div className="font-semibold">{customer.lastPayment}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Notes:</div>
                    <div className="text-sm">{customer.notes}</div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Payment Methods Analysis */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Payment Methods Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(paymentMethods).map(([method, data]) => (
            <div key={method} className="p-4 border rounded-lg">
              <div className="text-center mb-3">
                <div className="text-lg font-bold">{data.count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {method.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Percentage:</span>
                  <span className="font-medium">{data.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Days:</span>
                  <span className={`font-medium ${
                    data.averageDays <= 7 ? 'text-green-600' :
                    data.averageDays <= 30 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.averageDays}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}