'use client'

import { useState } from 'react'
import { 
  CreditCard, Bot, Users, Building2, Crown, DollarSign,
  CheckCircle, AlertTriangle, Clock, XCircle, RefreshCw,
  ArrowUp, ArrowDown, TrendingUp, BarChart3, PieChart,
  Eye, Edit, Plus, Settings, Filter, Download, Search,
  Calendar, Mail, Phone, Zap, Award, Activity, Target
} from 'lucide-react'

export default function SubscriptionBilling() {
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'essential' | 'professional' | 'enterprise'>('all')
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [showFailedPayments, setShowFailedPayments] = useState(false)
  const [automationStatus, setAutomationStatus] = useState(true)

  const subscriptionPlans = {
    essential: {
      name: 'Agents IA Esencial',
      price: 79,
      subscribers: 1247,
      revenue: 98513,
      churn: 4.2,
      growth: 12.8,
      features: ['5 Agents IA', 'Support bàsic', '10GB storage'],
      targetAudience: 'Empleats públics individuals'
    },
    professional: {
      name: 'Agents IA Profesional', 
      price: 149,
      subscribers: 892,
      revenue: 132908,
      churn: 2.8,
      growth: 18.4,
      features: ['25 Agents IA', 'Support prioritari', '100GB storage', 'Analytics'],
      targetAudience: 'Equips petits i mitjans'
    },
    enterprise: {
      name: 'Agents IA Enterprise',
      price: 249,
      subscribers: 234,
      revenue: 58266,
      churn: 1.9,
      growth: 22.1,
      features: ['Agents IA il·limitats', '24/7 Support', '1TB storage', 'Custom integrations'],
      targetAudience: 'Grans administracions'
    }
  }

  const billingMetrics = {
    totalMRR: 289687,
    totalSubscribers: 2373,
    averageARPU: 122.14,
    collectionRate: 98.7,
    failedPayments: 31,
    dunningSuccess: 89.7,
    automation: {
      enabled: 96.8,
      invoiceGeneration: 99.2,
      paymentProcessing: 97.8,
      dunningManagement: 94.5,
      taxCalculation: 98.9
    }
  }

  const paymentFailures = [
    {
      id: 'INV-2024-001234',
      customer: 'Ajuntament Barcelona',
      plan: 'Enterprise',
      amount: 249,
      failureReason: 'Insufficient funds',
      attempts: 3,
      nextAttempt: '2024-01-25',
      status: 'dunning',
      daysOverdue: 5
    },
    {
      id: 'INV-2024-001235', 
      customer: 'Generalitat Catalunya',
      plan: 'Professional',
      amount: 149,
      failureReason: 'Card expired',
      attempts: 2,
      nextAttempt: '2024-01-24',
      status: 'dunning',
      daysOverdue: 3
    },
    {
      id: 'INV-2024-001236',
      customer: 'Diputació València',
      plan: 'Essential',
      amount: 79,
      failureReason: 'Payment declined',
      attempts: 1,
      nextAttempt: '2024-01-26',
      status: 'retry',
      daysOverdue: 1
    }
  ]

  const upgradeOpportunities = [
    {
      customer: 'Conselleria Salut',
      currentPlan: 'Professional',
      suggestedPlan: 'Enterprise',
      usage: 87,
      predictedUpgrade: 'High',
      potentialARR: 1200,
      triggers: ['Usage > 80%', 'Support tickets > 5/month', 'Custom requests']
    },
    {
      customer: 'Hospital Vall d\'Hebron',
      currentPlan: 'Essential',
      suggestedPlan: 'Professional',
      usage: 92,
      predictedUpgrade: 'High',
      potentialARR: 840,
      triggers: ['Usage > 90%', 'Feature requests', 'Team growth']
    }
  ]

  const taxCompliance = {
    spain: {
      iva: 21,
      processed: 2156,
      collected: 45267,
      status: 'compliant'
    },
    eu: {
      vatMoss: true,
      countries: 12,
      processed: 89,
      collected: 3421,
      status: 'compliant'
    },
    international: {
      processed: 23,
      collected: 892,
      status: 'manual_review'
    }
  }

  const getPlanColor = (plan: string) => {
    switch(plan.toLowerCase()) {
      case 'essential': return 'blue'
      case 'professional': return 'green' 
      case 'enterprise': return 'purple'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'dunning': return 'text-orange-600 bg-orange-100'
      case 'retry': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'paid': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Subscription Billing Automàtic</h2>
            <p className="text-gray-600">Gestió completa dels plans d'Agents IA amb automatització avançada</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutomationStatus(!automationStatus)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                automationStatus 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              Automation {automationStatus ? 'ON' : 'OFF'}
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Billing
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pla</label>
            <select 
              value={selectedPlan} 
              onChange={(e) => setSelectedPlan(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els plans</option>
              <option value="essential">Essential (€79)</option>
              <option value="professional">Professional (€149)</option>
              <option value="enterprise">Enterprise (€249)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Periode Facturació</label>
            <select 
              value={billingPeriod} 
              onChange={(e) => setBillingPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="monthly">Mensual</option>
              <option value="annual">Anual (10% descompte)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowFailedPayments(!showFailedPayments)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showFailedPayments ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Failed Payments ({billingMetrics.failedPayments})
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(subscriptionPlans).map(([key, plan]) => {
          const color = getPlanColor(key)
          return (
            <div key={key} className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                  <Bot className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.targetAudience}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">€{plan.price}</span>
                  <span className="text-sm text-gray-600">/mes</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold">{plan.subscribers}</div>
                    <div className="text-xs text-gray-600">Subscribers</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-semibold">€{(plan.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-600">MRR</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Churn:</span>
                    <span className={`font-medium ${plan.churn > 3 ? 'text-red-600' : 'text-green-600'}`}>
                      {plan.churn}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      {plan.growth}%
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-xs text-gray-600 mb-2">Característiques clau:</div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Billing Automation Status */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Automation Engine Status</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            billingMetrics.automation.enabled > 95 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {billingMetrics.automation.enabled}% Operational
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(billingMetrics.automation).slice(1).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{value}%</div>
              <div className="text-sm text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className={`mt-2 w-full bg-gray-200 rounded-full h-2 ${
                value >= 98 ? 'bg-green-200' : value >= 95 ? 'bg-yellow-200' : 'bg-red-200'
              }`}>
                <div 
                  className={`h-2 rounded-full ${
                    value >= 98 ? 'bg-green-500' : value >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failed Payments Management */}
      {showFailedPayments && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Failed Payments & Dunning</h3>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              {paymentFailures.length} casos actius
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Failure Reason</th>
                  <th className="text-center py-3 px-4">Attempts</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Days Overdue</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentFailures.map((failure) => (
                  <tr key={failure.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{failure.customer}</div>
                      <div className="text-sm text-gray-600">{failure.plan}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{failure.id}</td>
                    <td className="py-3 px-4 text-right font-semibold">€{failure.amount}</td>
                    <td className="py-3 px-4 text-sm">{failure.failureReason}</td>
                    <td className="py-3 px-4 text-center">{failure.attempts}/3</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(failure.status)}`}>
                        {failure.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        failure.daysOverdue > 3 ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {failure.daysOverdue} dies
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <RefreshCw className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Mail className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm text-orange-800">
              <strong>Dunning Success Rate: {billingMetrics.dunningSuccess}%</strong>
              - El sistema ha recuperat automàticament el 89.7% dels pagaments fallits mitjançant el procés de cobrament escalat.
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Opportunities */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Upgrade Opportunities</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            AI Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upgradeOpportunities.map((opportunity, idx) => (
            <div key={idx} className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{opportunity.customer}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  opportunity.predictedUpgrade === 'High' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {opportunity.predictedUpgrade} Probability
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Current Plan</div>
                  <div className="font-medium">{opportunity.currentPlan}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Suggested Plan</div>
                  <div className="font-medium text-green-700">{opportunity.suggestedPlan}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Usage</span>
                  <span className="font-medium">{opportunity.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      opportunity.usage > 85 ? 'bg-red-500' : opportunity.usage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${opportunity.usage}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm mb-3">
                <div className="font-medium text-green-700">Potential ARR: €{opportunity.potentialARR}/year</div>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                <div className="font-medium mb-1">Triggers:</div>
                {opportunity.triggers.map((trigger, triggerIdx) => (
                  <div key={triggerIdx}>• {trigger}</div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                  Send Upgrade Offer
                </button>
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                  Schedule Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Compliance */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Tax Compliance & Collection</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <h4 className="font-medium">Spain (IVA)</h4>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rate:</span>
                <span className="font-medium">{taxCompliance.spain.iva}%</span>
              </div>
              <div className="flex justify-between">
                <span>Invoices:</span>
                <span className="font-medium">{taxCompliance.spain.processed}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Collected:</span>
                <span className="font-medium">€{taxCompliance.spain.collected.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">EU</span>
              </div>
              <h4 className="font-medium">EU VAT MOSS</h4>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Countries:</span>
                <span className="font-medium">{taxCompliance.eu.countries}</span>
              </div>
              <div className="flex justify-between">
                <span>Invoices:</span>
                <span className="font-medium">{taxCompliance.eu.processed}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT Collected:</span>
                <span className="font-medium">€{taxCompliance.eu.collected.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">INT</span>
              </div>
              <h4 className="font-medium">International</h4>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Invoices:</span>
                <span className="font-medium">{taxCompliance.international.processed}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">€{taxCompliance.international.collected.toLocaleString()}</span>
              </div>
              <div className="text-yellow-700 text-xs mt-2">
                Manual review required
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}