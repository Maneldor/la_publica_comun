'use client'

import { useState } from 'react'
import { 
  Award, BarChart3, PieChart, TrendingUp, DollarSign, Users, Building2,
  Crown, Target, Calendar, MapPin, Globe, Activity, Bot, Zap,
  CheckCircle, AlertTriangle, ArrowUp, ArrowDown, RefreshCw,
  Download, Eye, Settings, Filter, Search, LineChart
} from 'lucide-react'

export default function BusinessIntelligence() {
  const [selectedDashboard, setSelectedDashboard] = useState<'executive' | 'profitability' | 'geography' | 'performance'>('executive')
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly')
  const [selectedView, setSelectedView] = useState<'summary' | 'detailed'>('summary')

  const executiveDashboard = {
    revenue: {
      total: 5980000,
      growth: 23.7,
      segments: {
        empleats: { revenue: 1250000, growth: 12.8, margin: 78.3 },
        empreses: { revenue: 3200000, growth: 18.4, margin: 67.9 },
        administracions: { revenue: 1530000, growth: 35.2, margin: 84.1 }
      }
    },
    profitability: {
      grossMargin: 76.4,
      operatingMargin: 24.8,
      netMargin: 18.6,
      ebitda: 1483000,
      grossProfit: 4569000,
      operatingProfit: 1483000
    },
    customerMetrics: {
      totalCustomers: 2891,
      newCustomers: 247,
      churnedCustomers: 89,
      netGrowth: 158,
      averageLTV: 45600,
      averageCAC: 2340
    },
    keyRatios: {
      ltvCac: 19.5,
      paybackMonths: 8.7,
      magicNumber: 1.34,
      burnMultiple: 0.67
    }
  }

  const profitabilityAnalysis = {
    bySegment: [
      {
        segment: 'empleats',
        revenue: 1250000,
        cogs: 271000,
        grossMargin: 78.3,
        salesMarketing: 187500,
        rd: 125000,
        generalAdmin: 93750,
        operatingMargin: 45.2,
        netMargin: 34.1
      },
      {
        segment: 'empreses', 
        revenue: 3200000,
        cogs: 1027200,
        grossMargin: 67.9,
        salesMarketing: 640000,
        rd: 320000,
        generalAdmin: 240000,
        operatingMargin: 29.1,
        netMargin: 21.8
      },
      {
        segment: 'administracions',
        revenue: 1530000,
        cogs: 243270,
        grossMargin: 84.1,
        salesMarketing: 229500,
        rd: 153000,
        generalAdmin: 114750,
        operatingMargin: 52.3,
        netMargin: 39.7
      }
    ],
    byProduct: [
      { product: 'Essential Plan', revenue: 948000, margin: 82.1, customers: 1247 },
      { product: 'Professional Plan', revenue: 1992000, margin: 74.3, customers: 892 },
      { product: 'Enterprise Plan', revenue: 1836000, margin: 71.8, customers: 234 },
      { product: 'Professional Services', revenue: 1740000, margin: 45.6, projects: 156 },
      { product: 'Platform Fees', revenue: 464000, margin: 94.2, transactions: 15420 }
    ]
  }

  const geographicAnalysis = {
    byRegion: [
      { region: 'Catalunya', revenue: 2156000, customers: 892, growth: 28.4, penetration: 34.7 },
      { region: 'Madrid', revenue: 1478000, customers: 634, growth: 19.2, penetration: 24.2 },
      { region: 'Andalucía', revenue: 987000, customers: 423, growth: 31.7, penetration: 16.1 },
      { region: 'Valencia', revenue: 743000, customers: 318, growth: 22.9, penetration: 12.9 },
      { region: 'Euskadi', revenue: 616000, customers: 267, growth: 41.3, penetration: 11.8 }
    ],
    cityTierAnalysis: {
      tier1: { revenue: 3456000, customers: 1245, arpu: 2776 },
      tier2: { revenue: 1876000, customers: 891, arpu: 2105 },
      tier3: { revenue: 648000, customers: 755, arpu: 858 }
    }
  }

  const performanceIndicators = {
    financial: [
      { metric: 'ARR Growth Rate', value: 41.3, target: 35.0, status: 'exceeding' },
      { metric: 'Gross Margin', value: 76.4, target: 75.0, status: 'exceeding' },
      { metric: 'Net Revenue Retention', value: 127.3, target: 120.0, status: 'exceeding' },
      { metric: 'Customer Acquisition Cost', value: 2340, target: 2500, status: 'meeting' },
      { metric: 'Monthly Churn Rate', value: 3.2, target: 5.0, status: 'exceeding' },
      { metric: 'Sales Efficiency', value: 1.34, target: 1.0, status: 'exceeding' }
    ],
    operational: [
      { metric: 'Customer Satisfaction', value: 4.7, target: 4.5, status: 'exceeding' },
      { metric: 'Support Response Time', value: 2.3, target: 4.0, status: 'exceeding' },
      { metric: 'Feature Adoption Rate', value: 73.8, target: 70.0, status: 'exceeding' },
      { metric: 'Implementation Time', value: 12.5, target: 15.0, status: 'exceeding' },
      { metric: 'API Uptime', value: 99.97, target: 99.9, status: 'exceeding' },
      { metric: 'Data Processing Speed', value: 1.2, target: 2.0, status: 'exceeding' }
    ]
  }

  const competitiveAnalysis = {
    marketShare: 23.7,
    position: 2,
    keyCompetitors: [
      { competitor: 'GovTech Solutions', share: 31.2, growth: 15.3, strengths: ['Market leader', 'Large sales team'] },
      { competitor: 'PublicSoft', share: 18.4, growth: 8.7, strengths: ['Low cost', 'Simple solution'] },
      { competitor: 'AdminCloud', share: 12.8, growth: 22.1, strengths: ['Cloud-first', 'Modern UI'] },
      { competitor: 'CivicTech', share: 13.9, growth: -2.4, strengths: ['Legacy systems', 'Compliance'] }
    ],
    winLossAnalysis: {
      winRate: 34.7,
      mainWinReasons: ['Better AI features', 'Superior support', 'Competitive pricing'],
      mainLossReasons: ['Budget constraints', 'Vendor lock-in', 'Feature gaps']
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'exceeding': return 'text-green-600 bg-green-100'
      case 'meeting': return 'text-blue-600 bg-blue-100'
      case 'below': return 'text-orange-600 bg-orange-100'
      case 'missing': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 25) return 'text-green-600'
    if (growth > 15) return 'text-blue-600'
    if (growth > 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Intelligence</h2>
            <p className="text-gray-600">Dashboards C-suite i profitability analysis per producte/territori</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Auto Refresh: ON
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard</label>
            <select 
              value={selectedDashboard} 
              onChange={(e) => setSelectedDashboard(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="executive">Executive Summary</option>
              <option value="profitability">Profitability Analysis</option>
              <option value="geography">Geographic Performance</option>
              <option value="performance">KPI Performance</option>
            </select>
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
            <select 
              value={selectedView} 
              onChange={(e) => setSelectedView(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="summary">Resum</option>
              <option value="detailed">Detallat</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update Data
            </button>
          </div>
        </div>
      </div>

      {/* Executive Dashboard */}
      {selectedDashboard === 'executive' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">€{(executiveDashboard.revenue.total / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                +{executiveDashboard.revenue.growth}% YoY
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Gross Margin</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{executiveDashboard.profitability.grossMargin}%</div>
              <div className="text-sm text-gray-600">€{(executiveDashboard.profitability.grossProfit / 1000000).toFixed(1)}M profit</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Customers</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{executiveDashboard.customerMetrics.totalCustomers.toLocaleString()}</div>
              <div className="text-sm text-green-600">+{executiveDashboard.customerMetrics.netGrowth} net growth</div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">LTV/CAC</span>
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{executiveDashboard.keyRatios.ltvCac}x</div>
              <div className="text-sm text-gray-600">{executiveDashboard.keyRatios.paybackMonths} mesos payback</div>
            </div>
          </div>

          {/* Revenue by Segment */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Revenue by Segment</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(executiveDashboard.revenue.segments).map(([segment, data]) => {
                const color = getSegmentColor(segment)
                const Icon = segment === 'empleats' ? Users : segment === 'empreses' ? Building2 : Crown
                
                return (
                  <div key={segment} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 text-${color}-600`} />
                      </div>
                      <h4 className="font-medium capitalize">{segment}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold">€{(data.revenue / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-gray-600">{((data.revenue / executiveDashboard.revenue.total) * 100).toFixed(1)}% of total</div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Growth:</span>
                        <span className={`font-medium ${getGrowthColor(data.growth)}`}>+{data.growth}%</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Margin:</span>
                        <span className="font-medium text-green-600">{data.margin}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Profitability Analysis */}
      {selectedDashboard === 'profitability' && (
        <>
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">Profitability by Segment</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Segment</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">COGS</th>
                    <th className="text-center py-3 px-4">Gross Margin</th>
                    <th className="text-right py-3 px-4">S&M</th>
                    <th className="text-right py-3 px-4">R&D</th>
                    <th className="text-center py-3 px-4">Operating Margin</th>
                    <th className="text-center py-3 px-4">Net Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {profitabilityAnalysis.bySegment.map((segment, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium capitalize">{segment.segment}</td>
                      <td className="py-3 px-4 text-right">€{(segment.revenue / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4 text-right">€{(segment.cogs / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${segment.grossMargin >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {segment.grossMargin}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">€{(segment.salesMarketing / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4 text-right">€{(segment.rd / 1000).toFixed(0)}K</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${segment.operatingMargin >= 30 ? 'text-green-600' : 'text-orange-600'}`}>
                          {segment.operatingMargin}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${segment.netMargin >= 25 ? 'text-green-600' : 'text-blue-600'}`}>
                          {segment.netMargin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Product Profitability</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {profitabilityAnalysis.byProduct.map((product, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">{product.product}</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-lg font-bold">€{(product.revenue / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Margin:</span>
                      <span className={`font-medium ${product.margin >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {product.margin}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.customers ? `${product.customers} customers` : 
                       product.projects ? `${product.projects} projects` :
                       `${product.transactions} transactions`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Geographic Analysis */}
      {selectedDashboard === 'geography' && (
        <>
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Revenue by Region</h3>
            </div>

            <div className="space-y-4">
              {geographicAnalysis.byRegion.map((region, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-lg">{region.region}</h4>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getGrowthColor(region.growth)} bg-opacity-20`}>
                        +{region.growth}% growth
                      </span>
                      <span className="text-lg font-bold">€{(region.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{region.customers}</div>
                      <div className="text-gray-600">Customers</div>
                    </div>
                    <div>
                      <div className="font-medium">€{(region.revenue / region.customers).toFixed(0)}</div>
                      <div className="text-gray-600">ARPU</div>
                    </div>
                    <div>
                      <div className="font-medium">{region.penetration}%</div>
                      <div className="text-gray-600">Market Penetration</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(region.revenue / geographicAnalysis.byRegion[0].revenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">City Tier Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(geographicAnalysis.cityTierAnalysis).map(([tier, data]) => (
                <div key={tier} className="p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-3 capitalize">
                    {tier.replace(/([0-9])/g, ' $1').trim()} Cities
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-2xl font-bold">€{(data.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="font-medium">{data.customers}</div>
                        <div className="text-gray-600">Customers</div>
                      </div>
                      <div>
                        <div className="font-medium">€{data.arpu}</div>
                        <div className="text-gray-600">ARPU</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Performance KPIs */}
      {selectedDashboard === 'performance' && (
        <>
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Financial KPIs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceIndicators.financial.map((kpi, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{kpi.metric}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(kpi.status)}`}>
                      {kpi.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-2xl font-bold">
                        {kpi.metric.includes('Rate') || kpi.metric.includes('Margin') ? `${kpi.value}%` :
                         kpi.metric.includes('Cost') ? `€${kpi.value.toLocaleString()}` :
                         kpi.metric.includes('Time') ? `${kpi.value}h` :
                         typeof kpi.value === 'number' ? kpi.value.toFixed(2) : kpi.value}
                      </div>
                      <div className="text-sm text-gray-600">Actual</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-700">
                        {kpi.metric.includes('Rate') || kpi.metric.includes('Margin') ? `${kpi.target}%` :
                         kpi.metric.includes('Cost') ? `€${kpi.target.toLocaleString()}` :
                         kpi.metric.includes('Time') ? `${kpi.target}h` :
                         typeof kpi.target === 'number' ? kpi.target.toFixed(2) : kpi.target}
                      </div>
                      <div className="text-sm text-gray-600">Target</div>
                    </div>
                  </div>

                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.status === 'exceeding' ? 'bg-green-500' :
                        kpi.status === 'meeting' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}
                      style={{ 
                        width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">Operational KPIs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceIndicators.operational.map((kpi, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{kpi.metric}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(kpi.status)}`}>
                      {kpi.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-2xl font-bold">
                        {kpi.metric.includes('Rate') || kpi.metric.includes('Uptime') ? `${kpi.value}%` :
                         kpi.metric.includes('Time') ? `${kpi.value}${kpi.metric.includes('Days') ? ' days' : 'h'}` :
                         kpi.metric.includes('Satisfaction') ? kpi.value.toFixed(1) :
                         kpi.metric.includes('Speed') ? `${kpi.value}s` :
                         typeof kpi.value === 'number' ? kpi.value.toFixed(1) : kpi.value}
                      </div>
                      <div className="text-sm text-gray-600">Actual</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-700">
                        {kpi.metric.includes('Rate') || kpi.metric.includes('Uptime') ? `${kpi.target}%` :
                         kpi.metric.includes('Time') ? `${kpi.target}${kpi.metric.includes('Days') ? ' days' : 'h'}` :
                         kpi.metric.includes('Satisfaction') ? kpi.target.toFixed(1) :
                         kpi.metric.includes('Speed') ? `${kpi.target}s` :
                         typeof kpi.target === 'number' ? kpi.target.toFixed(1) : kpi.target}
                      </div>
                      <div className="text-sm text-gray-600">Target</div>
                    </div>
                  </div>

                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.status === 'exceeding' ? 'bg-green-500' :
                        kpi.status === 'meeting' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}
                      style={{ 
                        width: `${kpi.metric.includes('Time') ? Math.max(100 - (kpi.value / kpi.target) * 100, 0) : Math.min((kpi.value / kpi.target) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Competitive Analysis - Always shown */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Competitive Analysis</h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            Market Position: #{competitiveAnalysis.position}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Market Share ({competitiveAnalysis.marketShare}%)</h4>
            <div className="space-y-3">
              {competitiveAnalysis.keyCompetitors.map((competitor, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{competitor.competitor}</h5>
                    <span className="text-sm font-semibold">{competitor.share}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(competitor.share / 35) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${getGrowthColor(competitor.growth)}`}>
                      {competitor.growth > 0 ? '+' : ''}{competitor.growth}% growth
                    </span>
                    <span className="text-xs text-gray-600">
                      {competitor.strengths.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Win/Loss Analysis</h4>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{competitiveAnalysis.winLossAnalysis.winRate}%</div>
                <div className="text-sm text-green-600">Win Rate</div>
              </div>

              <div>
                <div className="text-sm font-medium text-green-700 mb-2">Main Win Reasons:</div>
                <ul className="space-y-1">
                  {competitiveAnalysis.winLossAnalysis.mainWinReasons.map((reason, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium text-red-700 mb-2">Main Loss Reasons:</div>
                <ul className="space-y-1">
                  {competitiveAnalysis.winLossAnalysis.mainLossReasons.map((reason, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}