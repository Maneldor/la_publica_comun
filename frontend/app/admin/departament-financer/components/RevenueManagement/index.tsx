'use client'

import { useState } from 'react'
import { 
  DollarSign, TrendingUp, BarChart3, PieChart, Target, Calendar, 
  CreditCard, CheckCircle, AlertTriangle, Clock, RefreshCw,
  ArrowUp, ArrowDown, Users, Building2, Crown, Bot, Zap,
  Eye, Edit, Plus, Settings, Filter, Download, Activity,
  Award, ChevronDown, ChevronRight, PlayCircle, PauseCircle
} from 'lucide-react'

export default function RevenueManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'empleats' | 'empreses' | 'administracions'>('all')
  const [showIFRSDetails, setShowIFRSDetails] = useState(false)
  const [activeRecognitionRule, setActiveRecognitionRule] = useState<string | null>(null)

  const revenueStreams = {
    subscription: {
      mrr: 404166,
      arr: 4850000,
      growth: 18.3,
      churn: 3.2,
      expansion: 127,
      contraction: -23
    },
    professional_services: {
      monthly: 145000,
      growth: 22.1,
      margin: 78.5,
      utilization: 92.3
    },
    platform_fees: {
      monthly: 87500,
      transactions: 15420,
      avgFee: 5.67,
      growth: 15.8
    }
  }

  const ifrsRules = [
    {
      id: 'subscription-monthly',
      name: 'Subscripcions Mensuals',
      type: 'over_time',
      status: 'active',
      contracts: 2143,
      revenue: 295000,
      deferred: 45000,
      description: 'Reconeixement lineal durant el període de servei'
    },
    {
      id: 'subscription-annual',
      name: 'Subscripcions Anuals',
      type: 'over_time',
      status: 'active',
      contracts: 234,
      revenue: 89000,
      deferred: 267000,
      description: 'Reconeixement mensual del total prepagat'
    },
    {
      id: 'setup-fees',
      name: 'Setup & Implementation',
      type: 'point_in_time',
      status: 'active',
      contracts: 89,
      revenue: 134000,
      deferred: 23000,
      description: 'Reconeixement al completar implementació'
    },
    {
      id: 'professional-services',
      name: 'Serveis Professionals',
      type: 'over_time',
      status: 'active',
      contracts: 156,
      revenue: 145000,
      deferred: 78000,
      description: 'Reconeixement per milestones o hours worked'
    }
  ]

  const upgradeDowngradeData = {
    upgrades: {
      count: 89,
      revenue: 67800,
      avgIncrease: 78,
      topReasons: ['Més usuaris', 'Funcionalitats avançades', 'Support premium']
    },
    downgrades: {
      count: 23,
      revenue: -12400,
      avgDecrease: -54,
      topReasons: ['Pressupost reduït', 'Menys usuaris', 'Funcionalitats excessives']
    },
    proration: {
      automated: 98.2,
      manual: 1.8,
      avgProcessingTime: '2.3 hours',
      disputes: 3
    }
  }

  const recognitionSchedule = [
    { period: '2024-01', recognized: 425000, deferred: 389000, contracted: 814000 },
    { period: '2024-02', recognized: 467000, deferred: 423000, contracted: 890000 },
    { period: '2024-03', recognized: 489000, deferred: 445000, contracted: 934000 },
    { period: '2024-04', recognized: 512000, deferred: 467000, contracted: 979000 },
    { period: '2024-05', recognized: 534000, deferred: 489000, contracted: 1023000 },
    { period: '2024-06', recognized: 556000, deferred: 512000, contracted: 1068000 }
  ]

  const getSegmentColor = (segment: string) => {
    switch(segment) {
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
            <h2 className="text-2xl font-bold text-gray-900">Revenue Management</h2>
            <p className="text-gray-600">IFRS 15 compliance i gestió sofisticada de revenue streams</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowIFRSDetails(!showIFRSDetails)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showIFRSDetails ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Award className="w-4 h-4" />
              IFRS 15 Details
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Revenue Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Període</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Segment</label>
            <select 
              value={selectedSegment} 
              onChange={(e) => setSelectedSegment(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els segments</option>
              <option value="empleats">Empleats Públics</option>
              <option value="empreses">Empreses Col·laboradores</option>
              <option value="administracions">Administracions</option>
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

      {/* Revenue Streams Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Subscription Revenue</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">MRR</span>
                <span className="text-2xl font-bold">€{revenueStreams.subscription.mrr.toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                +{revenueStreams.subscription.growth}% growth
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">{revenueStreams.subscription.churn}%</div>
                <div className="text-blue-600">Churn</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-900">{revenueStreams.subscription.expansion}%</div>
                <div className="text-green-600">Expansion</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Professional Services</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-2xl font-bold">€{revenueStreams.professional_services.monthly.toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                +{revenueStreams.professional_services.growth}% growth
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-900">{revenueStreams.professional_services.margin}%</div>
                <div className="text-green-600">Margin</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-900">{revenueStreams.professional_services.utilization}%</div>
                <div className="text-blue-600">Utilization</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Platform Fees</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-2xl font-bold">€{revenueStreams.platform_fees.monthly.toLocaleString()}</span>
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                +{revenueStreams.platform_fees.growth}% growth
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-semibold text-purple-900">{revenueStreams.platform_fees.transactions}</div>
                <div className="text-purple-600">Transactions</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <div className="font-semibold text-orange-900">€{revenueStreams.platform_fees.avgFee}</div>
                <div className="text-orange-600">Avg Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IFRS 15 Revenue Recognition */}
      {showIFRSDetails && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold">IFRS 15 Revenue Recognition Rules</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {ifrsRules.map((rule) => (
              <div 
                key={rule.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  activeRecognitionRule === rule.id
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveRecognitionRule(
                  activeRecognitionRule === rule.id ? null : rule.id
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rule.type === 'over_time' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {rule.type === 'over_time' ? 'Over Time' : 'Point in Time'}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="font-medium">{rule.contracts}</div>
                    <div className="text-gray-600">Contractes</div>
                  </div>
                  <div>
                    <div className="font-medium">€{(rule.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-gray-600">Recognized</div>
                  </div>
                  <div>
                    <div className="font-medium">€{(rule.deferred / 1000).toFixed(0)}K</div>
                    <div className="text-gray-600">Deferred</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Recognition Schedule */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Període</th>
                  <th className="text-right py-3 px-4">Contracted</th>
                  <th className="text-right py-3 px-4">Recognized</th>
                  <th className="text-right py-3 px-4">Deferred</th>
                  <th className="text-right py-3 px-4">Recognition %</th>
                </tr>
              </thead>
              <tbody>
                {recognitionSchedule.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.period}</td>
                    <td className="py-3 px-4 text-right">€{(item.contracted / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-right text-green-600">€{(item.recognized / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-right text-orange-600">€{(item.deferred / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-right">
                      {((item.recognized / item.contracted) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upgrade/Downgrade Management */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Upgrade/Downgrade Management</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {upgradeDowngradeData.proration.automated}% Automated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Upgrades</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-green-900">{upgradeDowngradeData.upgrades.count}</div>
                <div className="text-sm text-green-600">Aquest mes</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-700">€{upgradeDowngradeData.upgrades.revenue.toLocaleString()}</div>
                <div className="text-sm text-green-600">Revenue adicional</div>
              </div>
              <div className="pt-2 border-t border-green-200">
                <div className="text-xs text-green-700 font-medium mb-1">Top Motius:</div>
                {upgradeDowngradeData.upgrades.topReasons.map((reason, idx) => (
                  <div key={idx} className="text-xs text-green-600">• {reason}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <ArrowDown className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-900">Downgrades</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-red-900">{upgradeDowngradeData.downgrades.count}</div>
                <div className="text-sm text-red-600">Aquest mes</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-700">€{Math.abs(upgradeDowngradeData.downgrades.revenue).toLocaleString()}</div>
                <div className="text-sm text-red-600">Revenue perdut</div>
              </div>
              <div className="pt-2 border-t border-red-200">
                <div className="text-xs text-red-700 font-medium mb-1">Top Motius:</div>
                {upgradeDowngradeData.downgrades.topReasons.map((reason, idx) => (
                  <div key={idx} className="text-xs text-red-600">• {reason}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Proration Engine</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-blue-900">{upgradeDowngradeData.proration.automated}%</div>
                <div className="text-sm text-blue-600">Automatització</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-700">{upgradeDowngradeData.proration.avgProcessingTime}</div>
                <div className="text-sm text-blue-600">Temps mitjà</div>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-700">Disputes actuals:</span>
                  <span className="text-xs font-medium text-blue-900">{upgradeDowngradeData.proration.disputes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}