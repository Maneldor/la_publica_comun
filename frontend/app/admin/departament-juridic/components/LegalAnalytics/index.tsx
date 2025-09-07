'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Target, DollarSign, Clock,
  Calendar, Users, FileText, AlertTriangle, CheckCircle, Activity,
  PieChart, LineChart, Filter, Download, RefreshCw, Eye
} from 'lucide-react'

export default function LegalAnalytics() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'costs' | 'performance' | 'risks'>('dashboard')

  const kpiMetrics = [
    {
      title: 'Disputes Resolts',
      value: '89%',
      change: +5,
      period: 'vs mes anterior',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Temps Mitjà Resolució',
      value: '145 dies',
      change: -8,
      period: 'vs trimestre anterior',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Costos Legals',
      value: '€340K',
      change: +12,
      period: 'vs any anterior',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Compliance Score',
      value: '94%',
      change: +3,
      period: 'vs trimestre anterior',
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  const costAnalysis = [
    { category: 'Litigació', amount: 185000, percentage: 54, trend: +8 },
    { category: 'Compliance', amount: 95000, percentage: 28, trend: +3 },
    { category: 'Contractes', amount: 42000, percentage: 12, trend: -2 },
    { category: 'IP Management', amount: 18000, percentage: 6, trend: +15 }
  ]

  const performanceData = [
    { entity: 'Empleats Públics', disputes: 28, resolved: 25, avgTime: 120, satisfaction: 92 },
    { entity: 'Empreses Col·laboradores', disputes: 15, resolved: 14, avgTime: 89, satisfaction: 88 },
    { entity: 'Sindicats', disputes: 8, resolved: 7, avgTime: 203, satisfaction: 78 },
    { entity: 'Administracions', disputes: 12, resolved: 11, avgTime: 156, satisfaction: 85 }
  ]

  const riskMetrics = [
    {
      category: 'Contractual',
      level: 'Medium',
      cases: 12,
      exposure: 450000,
      trend: 'stable'
    },
    {
      category: 'Laboral',
      level: 'Low',
      cases: 8,
      exposure: 180000,
      trend: 'decreasing'
    },
    {
      category: 'GDPR',
      level: 'Low',
      cases: 3,
      exposure: 50000,
      trend: 'decreasing'
    },
    {
      category: 'IP',
      level: 'High',
      cases: 2,
      exposure: 125000,
      trend: 'increasing'
    }
  ]

  const getRiskColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-600" />
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Legals</h2>
            <p className="text-gray-600">Anàlisi de rendiment, costos i riscos legals</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Exportar Dashboard
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <RefreshCw className="w-4 h-4" />
              Actualitzar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'costs', label: 'Anàlisi Costos', icon: DollarSign },
            { id: 'performance', label: 'Rendiment', icon: TrendingUp },
            { id: 'risks', label: 'Gestió Riscos', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpiMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className={`text-xs ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.title}</div>
                <div className="text-xs text-gray-500">{metric.period}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Disputes per Entitat</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Empleats Públics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">28</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Empreses</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Administracions</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '19%' }}></div>
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sindicats</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '13%' }}></div>
                    </div>
                    <span className="text-sm font-medium">8</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Evolució Mensual 2024</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gener</span>
                  <span className="text-sm font-medium">18 casos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Febrer</span>
                  <span className="text-sm font-medium">22 casos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Març</span>
                  <span className="text-sm font-medium">15 casos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Abril</span>
                  <span className="text-sm font-medium">19 casos</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mitjana mensual</span>
                    <span className="text-sm font-bold text-indigo-600">18.5 casos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Costs Analysis */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4 col-span-4">
              <h3 className="font-semibold mb-4">Distribució de Costos Legals</h3>
              <div className="space-y-4">
                {costAnalysis.map((cost, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{cost.category}</span>
                        <span className="text-lg font-bold">€{cost.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${cost.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{cost.percentage}%</span>
                        <span className={`text-sm ${cost.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {cost.trend > 0 ? '+' : ''}{cost.trend}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Entitat</th>
                  <th className="text-center py-3 px-4">Total Disputes</th>
                  <th className="text-center py-3 px-4">Resolts</th>
                  <th className="text-center py-3 px-4">Taxa Èxit</th>
                  <th className="text-center py-3 px-4">Temps Mitjà</th>
                  <th className="text-center py-3 px-4">Satisfacció</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((perf, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{perf.entity}</td>
                    <td className="py-3 px-4 text-center">{perf.disputes}</td>
                    <td className="py-3 px-4 text-center">{perf.resolved}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-green-600">
                        {Math.round((perf.resolved / perf.disputes) * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{perf.avgTime} dies</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        perf.satisfaction >= 90 ? 'text-green-600' :
                        perf.satisfaction >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {perf.satisfaction}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Risk Management */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskMetrics.map((risk, idx) => (
              <div key={idx} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{risk.category}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(risk.level)}`}>
                      {risk.level}
                    </span>
                    {getTrendIcon(risk.trend)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cases actius:</span>
                    <span className="ml-2 font-medium">{risk.cases}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Exposició:</span>
                    <span className="ml-2 font-medium">€{risk.exposure.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}