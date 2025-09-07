'use client'

import { useState } from 'react'
import { 
  TrendingUp, BarChart3, PieChart, Target, Calendar, 
  Brain, Zap, AlertTriangle, CheckCircle, ArrowUp, ArrowDown,
  Users, Building2, Crown, RefreshCw, Download, Settings,
  Activity, DollarSign, Eye, Filter, ChevronDown, ChevronRight,
  LineChart, TrendingDown
} from 'lucide-react'

export default function FPAForecasting() {
  const [selectedSegment, setSelectedSegment] = useState<'empleats' | 'empreses' | 'administracions' | 'all'>('all')
  const [forecastPeriod, setForecastPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'annual'>('Q1')
  const [scenarioMode, setScenarioMode] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic')
  const [showMLInsights, setShowMLInsights] = useState(true)

  const segmentsData = {
    empleats: {
      currentARR: 1250000,
      forecastGrowth: 12.8,
      confidence: 87,
      churnRisk: 4.2,
      upsellPotential: 320000,
      users: 24580,
      avgRevenuePerUser: 50.82,
      seasonality: 'low',
      mlPrediction: 1365000
    },
    empreses: {
      currentARR: 3200000,
      forecastGrowth: 18.4,
      confidence: 92,
      churnRisk: 2.8,
      upsellPotential: 850000,
      users: 1247,
      avgRevenuePerUser: 2567.84,
      seasonality: 'medium',
      mlPrediction: 3789000
    },
    administracions: {
      currentARR: 1530000,
      forecastGrowth: 22.1,
      confidence: 78,
      churnRisk: 1.9,
      upsellPotential: 420000,
      users: 187,
      avgRevenuePerUser: 8181.82,
      seasonality: 'high',
      mlPrediction: 1868000
    }
  }

  const scenarioData = {
    conservative: {
      growth: -15,
      probability: 20,
      factors: ['Recessió econòmica', 'Retallades pressupostàries', 'Competència agressiva']
    },
    realistic: {
      growth: 0,
      probability: 60,
      factors: ['Creixement normal', 'Condicions estables', 'Adopció esperada']
    },
    optimistic: {
      growth: +25,
      probability: 20,
      factors: ['Acceleració digital', 'Nous mercats', 'Innovació disruptiva']
    }
  }

  const mlInsights = [
    {
      type: 'opportunity',
      confidence: 94,
      message: 'Segment Empreses mostra patró d\'expansió del 34% en Q1 històric',
      impact: '+€680K ARR potencial',
      action: 'Intensificar outreach B2B'
    },
    {
      type: 'risk',
      confidence: 78,
      message: '23 contractes administracions amb risc renovació basat en usage patterns',
      impact: '-€340K ARR risc',
      action: 'Customer Success intervention'
    },
    {
      type: 'trend',
      confidence: 89,
      message: 'Correlació positiva entre esdeveniments sector públic i signups (+47%)',
      impact: '+€210K ARR estacional',
      action: 'Calendari marketing eventos'
    }
  ]

  const getSegmentIcon = (segment: string) => {
    switch(segment) {
      case 'empleats': return Users
      case 'empreses': return Building2
      case 'administracions': return Crown
      default: return BarChart3
    }
  }

  const formatCurrency = (amount: number) => `€${(amount / 1000).toFixed(0)}K`

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Planning & Analysis</h2>
            <p className="text-gray-600">Forecasting predictiu per línies de negoci amb ML</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Actualitzar ML Models
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Forecasts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Període</label>
            <select 
              value={forecastPeriod} 
              onChange={(e) => setForecastPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="Q1">Q1 2024</option>
              <option value="Q2">Q2 2024</option>
              <option value="Q3">Q3 2024</option>
              <option value="Q4">Q4 2024</option>
              <option value="annual">Anual 2024</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scenario</label>
            <select 
              value={scenarioMode} 
              onChange={(e) => setScenarioMode(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="conservative">Conservador</option>
              <option value="realistic">Realista</option>
              <option value="optimistic">Optimista</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowMLInsights(!showMLInsights)}
              className={`w-full px-3 py-2 rounded-lg transition-colors ${
                showMLInsights ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Brain className="w-4 h-4 mx-auto" />
              ML Insights
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(scenarioData).map(([scenario, data]) => (
            <div 
              key={scenario}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                scenarioMode === scenario
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setScenarioMode(scenario as any)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{scenario}</h4>
                <span className={`text-sm px-2 py-1 rounded ${
                  data.growth > 0 ? 'bg-green-100 text-green-700' :
                  data.growth < 0 ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {data.growth > 0 ? '+' : ''}{data.growth}%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Probabilitat: {data.probability}%
              </div>
              <div className="space-y-1">
                {data.factors.map((factor, idx) => (
                  <div key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    {factor}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedSegment === 'all' ? (
          Object.entries(segmentsData).map(([segment, data]) => {
            const Icon = getSegmentIcon(segment)
            return (
              <div key={segment} className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold capitalize">{segment}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    data.confidence >= 85 ? 'bg-green-100 text-green-700' :
                    data.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {data.confidence}% confiança
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">ARR Actual</div>
                    <div className="text-2xl font-bold">{formatCurrency(data.currentARR)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Predicció ML</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(data.mlPrediction)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">{data.forecastGrowth}%</div>
                    <div className="text-gray-600">Growth</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">{data.churnRisk}%</div>
                    <div className="text-gray-600">Churn Risk</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium text-gray-900">{formatCurrency(data.upsellPotential)}</div>
                    <div className="text-gray-600">Upsell</div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="lg:col-span-2">
            {selectedSegment !== 'all' && (
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const Icon = getSegmentIcon(selectedSegment)
                    return <Icon className="w-6 h-6 text-yellow-600" />
                  })()}
                  <h3 className="text-xl font-semibold capitalize">{selectedSegment} - Análisi Detallat</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(segmentsData[selectedSegment].currentARR)}
                    </div>
                    <div className="text-sm text-gray-600">ARR Actual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(segmentsData[selectedSegment].mlPrediction)}
                    </div>
                    <div className="text-sm text-gray-600">Predicció ML</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {segmentsData[selectedSegment].users.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Usuaris</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      €{segmentsData[selectedSegment].avgRevenuePerUser.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">ARPU</div>
                  </div>
                </div>

                {/* Detailed metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Mètriques de Risc</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm">Churn Risk</span>
                        <span className="font-semibold text-red-600">
                          {segmentsData[selectedSegment].churnRisk}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Seasonality</span>
                        <span className="font-semibold capitalize">
                          {segmentsData[selectedSegment].seasonality}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Oportunitats</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm">Upsell Potential</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(segmentsData[selectedSegment].upsellPotential)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm">Forecast Growth</span>
                        <span className="font-semibold text-blue-600">
                          {segmentsData[selectedSegment].forecastGrowth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ML Insights */}
      {showMLInsights && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Machine Learning Insights</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Actualitzat fa 2h
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mlInsights.map((insight, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    insight.type === 'opportunity' ? 'bg-green-100 text-green-700' :
                    insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {insight.type === 'opportunity' ? 'Oportunitat' :
                     insight.type === 'risk' ? 'Risc' : 'Tendència'}
                  </span>
                  <span className="text-xs text-gray-500">{insight.confidence}% confiança</span>
                </div>
                <p className="text-sm text-gray-800 mb-2">{insight.message}</p>
                <div className="text-sm font-medium text-gray-900 mb-2">{insight.impact}</div>
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  💡 {insight.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}