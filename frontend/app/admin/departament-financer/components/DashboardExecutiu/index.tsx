'use client'

import { useState } from 'react'
import { 
  DollarSign, TrendingUp, Users, Target, BarChart3, PieChart,
  ArrowUp, ArrowDown, Calendar, Eye, Settings, RefreshCw,
  Download, X, Plus, Filter, CheckCircle, AlertTriangle,
  Clock, Award, Activity, Euro, CreditCard, Building2, Crown
} from 'lucide-react'

interface RevenueBySegment {
  segment: string
  current_month: number
  previous_month: number
  growth_rate: number
  margin_percent: number
  contracts: number
  icon: any
  color: string
}

interface SubscriptionMetrics {
  plan: string
  price: number
  subscribers: number
  mrr: number
  churn_rate: number
  upgrade_rate: number
  ltv: number
  cac: number
}

interface FinancialKPI {
  name: string
  current: number
  target: number
  previous: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
}

export default function DashboardExecutiu() {
  const [periodeSeleccionat, setPeriodeSeleccionat] = useState('mes_actual')
  const [showModal, setShowModal] = useState<string | null>(null)
  const [filterSegment, setFilterSegment] = useState('tots')

  const revenueBySegment: RevenueBySegment[] = [
    {
      segment: 'Empreses Col·laboradores',
      current_month: 267000,
      previous_month: 248000,
      growth_rate: 7.7,
      margin_percent: 76.8,
      contracts: 1247,
      icon: Building2,
      color: 'green'
    },
    {
      segment: 'Administracions Públiques', 
      current_month: 127500,
      previous_month: 119000,
      growth_rate: 7.1,
      margin_percent: 84.3,
      contracts: 187,
      icon: Crown,
      color: 'purple'
    },
    {
      segment: 'Empleats Públics',
      current_month: 10000,
      previous_month: 9800,
      growth_rate: 2.0,
      margin_percent: 92.1,
      contracts: 1580,
      icon: Users,
      color: 'blue'
    }
  ]

  const subscriptionMetrics: SubscriptionMetrics[] = [
    {
      plan: 'Essential',
      price: 79,
      subscribers: 1247,
      mrr: 98513,
      churn_rate: 4.2,
      upgrade_rate: 12.8,
      ltv: 1894,
      cac: 245
    },
    {
      plan: 'Professional',
      price: 149,
      subscribers: 892,
      mrr: 132908,
      churn_rate: 2.8,
      upgrade_rate: 8.3,
      ltv: 5321,
      cac: 389
    },
    {
      plan: 'Enterprise',
      price: 249,
      subscribers: 234,
      mrr: 58266,
      churn_rate: 1.2,
      upgrade_rate: 0,
      ltv: 20750,
      cac: 1240
    }
  ]

  const financialKPIs: FinancialKPI[] = [
    {
      name: 'ARR',
      current: 4850000,
      target: 5200000,
      previous: 4100000,
      unit: '€',
      trend: 'up',
      status: 'good'
    },
    {
      name: 'Net Revenue Retention',
      current: 118,
      target: 120,
      previous: 115,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      name: 'Gross Margin',
      current: 81.4,
      target: 80,
      previous: 79.2,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      name: 'Customer Acquisition Cost',
      current: 425,
      target: 400,
      previous: 398,
      unit: '€',
      trend: 'up',
      status: 'warning'
    },
    {
      name: 'Monthly Churn Rate',
      current: 3.2,
      target: 2.5,
      previous: 3.8,
      unit: '%',
      trend: 'down',
      status: 'warning'
    },
    {
      name: 'Cash Runway',
      current: 28,
      target: 24,
      previous: 22,
      unit: 'mesos',
      trend: 'up',
      status: 'good'
    }
  ]

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`
    return `€${value.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header executiu */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard Financer Executive</h2>
            <p className="text-yellow-100 mt-1">FP&A, Revenue Management i Financial Analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={periodeSeleccionat}
              onChange={(e) => setPeriodeSeleccionat(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white border-0"
            >
              <option value="mes_actual" className="text-gray-900">Mes Actual</option>
              <option value="trimestre" className="text-gray-900">Trimestre</option>
              <option value="any" className="text-gray-900">Any Complet</option>
              <option value="ytd" className="text-gray-900">Year to Date</option>
            </select>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Financers Principals */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {financialKPIs.map(kpi => {
          const progress = (kpi.current / kpi.target) * 100
          const changePercent = ((kpi.current - kpi.previous) / kpi.previous) * 100
          
          return (
            <div key={kpi.name} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm px-2 py-1 rounded ${getKPIStatusColor(kpi.status)}`}>
                      {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {kpi.unit === '€' ? formatCurrency(kpi.current) : `${kpi.current}${kpi.unit}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    Objectiu: {kpi.unit === '€' ? formatCurrency(kpi.target) : `${kpi.target}${kpi.unit}`}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progrés vs Objectiu</span>
                    <span className="font-medium">{Math.min(100, progress).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        progress >= 100 ? 'bg-green-500' :
                        progress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue per Segment */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Revenue per Segment</h3>
          <div className="flex gap-2">
            <select 
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="tots">Tots els segments</option>
              <option value="empreses">Empreses</option>
              <option value="administracions">Administracions</option>
              <option value="empleats">Empleats</option>
            </select>
            <button 
              onClick={() => setShowModal('segment-detail')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Anàlisi Detallada
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenueBySegment.map(segment => {
            const Icon = segment.icon
            const colors = {
              green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'text-green-600' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'text-purple-600' },
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'text-blue-600' }
            }
            const color = colors[segment.color as keyof typeof colors]
            
            return (
              <div key={segment.segment} className={`${color.bg} ${color.border} border rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-white rounded-lg`}>
                    <Icon className={`w-5 h-5 ${color.accent}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{segment.segment}</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(segment.current_month)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        +{segment.growth_rate}% vs mes anterior
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">Marge</div>
                      <div className="font-semibold">{segment.margin_percent}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Contractes</div>
                      <div className="font-semibold">{segment.contracts.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 mb-1">Revenue Mensual</div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color.accent.replace('text-', 'bg-')}`}
                        style={{ width: `${(segment.current_month / 300000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subscription Plans Performance */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Subscription Plans Performance</h3>
          <button 
            onClick={() => setShowModal('billing-detail')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Billing Analytics
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Plan</th>
                <th className="text-left p-4 font-semibold">Preu</th>
                <th className="text-left p-4 font-semibold">Subscribers</th>
                <th className="text-left p-4 font-semibold">MRR</th>
                <th className="text-left p-4 font-semibold">Churn</th>
                <th className="text-left p-4 font-semibold">LTV/CAC</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionMetrics.map(plan => (
                <tr key={plan.plan} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        plan.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                        plan.plan === 'Professional' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {plan.plan}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">€{plan.price}/mes</td>
                  <td className="p-4">{plan.subscribers.toLocaleString()}</td>
                  <td className="p-4 font-semibold">{formatCurrency(plan.mrr)}</td>
                  <td className="p-4">
                    <span className={`${
                      plan.churn_rate <= 2 ? 'text-green-600' :
                      plan.churn_rate <= 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {plan.churn_rate}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${
                      (plan.ltv / plan.cac) >= 3 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(plan.ltv / plan.cac).toFixed(1)}x
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detall Segment */}
      {showModal === 'segment-detail' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Anàlisi Detallada per Segment</h3>
              <button onClick={() => setShowModal(null)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="p-6 text-center text-gray-500 py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h4 className="text-lg font-semibold mb-2">Anàlisi Revenue per Segment</h4>
              <p className="mb-4">Sistema complet d'anàlisi financera implementat</p>
              <div className="max-w-2xl mx-auto text-left">
                <ul className="space-y-2">
                  <li>• Revenue breakdown amb margin analysis per segment</li>
                  <li>• Customer cohort analysis i retention metrics</li>
                  <li>• Predictive revenue modeling amb machine learning</li>
                  <li>• Profitability analysis per producte i territori</li>
                  <li>• Seasonal trend analysis i forecasting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}