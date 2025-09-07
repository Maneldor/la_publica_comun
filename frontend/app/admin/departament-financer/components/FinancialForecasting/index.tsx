'use client'

import { useState } from 'react'
import { 
  Target, TrendingUp, BarChart3, PieChart, Users, Building2, Crown,
  DollarSign, Calendar, Bot, Brain, Zap, Activity, Award,
  CheckCircle, AlertTriangle, Clock, RefreshCw, Download,
  ArrowUp, ArrowDown, LineChart, TrendingDown, Eye, Settings
} from 'lucide-react'

export default function FinancialForecasting() {
  const [forecastHorizon, setForecastHorizon] = useState<'3m' | '6m' | '12m' | '24m'>('12m')
  const [selectedMetric, setSelectedMetric] = useState<'arr' | 'mrr' | 'cohorts' | 'retention'>('arr')
  const [showMLModel, setShowMLModel] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState<'high' | 'medium' | 'all'>('medium')

  const forecastingOverview = {
    currentARR: 5980000,
    forecastedARR: 8450000,
    arrGrowthRate: 41.3,
    currentMRR: 498333,
    forecastedMRR: 704167,
    mrrGrowthRate: 41.3,
    confidence: 87,
    lastUpdated: '2024-01-15 16:45:23'
  }

  const arrForecasts = {
    '3m': {
      predicted: 6580000,
      confidence: 94,
      scenarios: {
        optimistic: 7120000,
        realistic: 6580000,
        pessimistic: 6040000
      }
    },
    '6m': {
      predicted: 7380000,
      confidence: 89,
      scenarios: {
        optimistic: 8200000,
        realistic: 7380000,
        pessimistic: 6560000
      }
    },
    '12m': {
      predicted: 8450000,
      confidence: 82,
      scenarios: {
        optimistic: 9850000,
        realistic: 8450000,
        pessimistic: 7050000
      }
    },
    '24m': {
      predicted: 12650000,
      confidence: 71,
      scenarios: {
        optimistic: 15800000,
        realistic: 12650000,
        pessimistic: 9500000
      }
    }
  }

  const cohortAnalysis = [
    {
      cohort: '2023 Q1',
      customers: 342,
      initialARR: 890000,
      currentARR: 1340000,
      retention: 89.2,
      expansion: 167,
      churn: 10.8,
      nrr: 149.5,
      ltv: 45600,
      paybackMonths: 8.3
    },
    {
      cohort: '2023 Q2',
      customers: 389,
      initialARR: 1045000,
      currentARR: 1520000,
      retention: 91.5,
      expansion: 158,
      churn: 8.5,
      nrr: 144.5,
      ltv: 52300,
      paybackMonths: 7.9
    },
    {
      cohort: '2023 Q3',
      customers: 427,
      initialARR: 1234000,
      currentARR: 1650000,
      retention: 93.1,
      expansion: 141,
      churn: 6.9,
      nrr: 131.3,
      ltv: 48900,
      paybackMonths: 9.1
    },
    {
      cohort: '2023 Q4',
      customers: 456,
      initialARR: 1456000,
      currentARR: 1670000,
      retention: 94.7,
      expansion: 128,
      churn: 5.3,
      nrr: 121.2,
      ltv: 56700,
      paybackMonths: 8.7
    }
  ]

  const retentionForecasts = {
    empleats: {
      current: 84.2,
      forecast3m: 85.1,
      forecast6m: 86.3,
      forecast12m: 87.8,
      factors: ['Training programs', 'Feature adoption', 'Support quality'],
      confidence: 91
    },
    empreses: {
      current: 91.7,
      forecast3m: 92.3,
      forecast6m: 93.1,
      forecast12m: 94.2,
      factors: ['Contract length', 'Integration depth', 'ROI demonstration'],
      confidence: 88
    },
    administracions: {
      current: 96.3,
      forecast3m: 96.8,
      forecast6m: 97.2,
      forecast12m: 97.9,
      factors: ['Budget stability', 'Compliance requirements', 'Long-term contracts'],
      confidence: 95
    }
  }

  const mlModelMetrics = {
    accuracy: 87.3,
    precision: 91.7,
    recall: 84.2,
    f1Score: 87.8,
    features: 247,
    trainingData: '36 months',
    lastTrained: '2024-01-10',
    predictionInputs: [
      'Historical revenue patterns',
      'Customer usage metrics',
      'Market seasonality',
      'Economic indicators',
      'Competitive landscape',
      'Product roadmap impacts'
    ],
    modelTypes: {
      timeSeries: 'LSTM Neural Networks',
      cohort: 'Random Forest',
      churn: 'XGBoost',
      upsell: 'Logistic Regression'
    }
  }

  const forecastDrivers = [
    {
      driver: 'New Customer Acquisition',
      impact: 35,
      trend: 'increasing',
      confidence: 89,
      contribution: 1470000,
      details: 'Q2 marketing campaigns showing 23% higher conversion'
    },
    {
      driver: 'Customer Expansion',
      impact: 28,
      trend: 'stable',
      confidence: 92,
      contribution: 1176000,
      details: 'Upsell rate maintains at 34% with new AI features'
    },
    {
      driver: 'Price Optimization',
      impact: 18,
      trend: 'increasing',
      confidence: 84,
      contribution: 756000,
      details: 'Q3 price increases for Enterprise plans'
    },
    {
      driver: 'Churn Reduction',
      impact: 12,
      trend: 'improving',
      confidence: 78,
      contribution: 504000,
      details: 'Customer success initiatives reducing churn by 1.2%'
    },
    {
      driver: 'Market Expansion',
      impact: 7,
      trend: 'stable',
      confidence: 65,
      contribution: 294000,
      details: 'International expansion in early stages'
    }
  ]

  const getSegmentColor = (segment: string) => {
    switch(segment) {
      case 'empleats': return 'blue'
      case 'empreses': return 'green'
      case 'administracions': return 'purple'
      default: return 'gray'
    }
  }

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'increasing': return 'text-green-600'
      case 'improving': return 'text-green-600'
      case 'stable': return 'text-blue-600'
      case 'decreasing': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100'
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100'
    if (confidence >= 70) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Forecasting</h2>
            <p className="text-gray-600">Predicció ARR/MRR i cohort analysis amb ML avançat</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMLModel(!showMLModel)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showMLModel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Brain className="w-4 h-4" />
              ML Model Details
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Forecasts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Horitzó Temporal</label>
            <select 
              value={forecastHorizon} 
              onChange={(e) => setForecastHorizon(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="3m">3 mesos</option>
              <option value="6m">6 mesos</option>
              <option value="12m">12 mesos</option>
              <option value="24m">24 mesos</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mètrica</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="arr">ARR Forecast</option>
              <option value="mrr">MRR Forecast</option>
              <option value="cohorts">Cohort Analysis</option>
              <option value="retention">Retention Analysis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confiança</label>
            <select 
              value={confidenceThreshold} 
              onChange={(e) => setConfidenceThreshold(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les prediccions</option>
              <option value="high">Alta confiança ({'>'}85%)</option>
              <option value="medium">Confiança mitjana ({'>'}70%)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update Forecasts
            </button>
          </div>
        </div>
      </div>

      {/* Main Forecast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">ARR Forecast ({forecastHorizon})</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(arrForecasts[forecastHorizon].confidence)}`}>
              {arrForecasts[forecastHorizon].confidence}% confidence
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Current ARR</div>
                <div className="text-2xl font-bold">€{(forecastingOverview.currentARR / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Predicted ARR</div>
                <div className="text-2xl font-bold text-green-600">
                  €{(arrForecasts[forecastHorizon].predicted / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium mb-3">Scenario Analysis</div>
              <div className="space-y-2">
                {Object.entries(arrForecasts[forecastHorizon].scenarios).map(([scenario, value]) => (
                  <div key={scenario} className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{scenario}:</span>
                    <span className={`font-semibold ${
                      scenario === 'optimistic' ? 'text-green-600' :
                      scenario === 'pessimistic' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      €{(value / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-600 font-medium">
                Growth Projection: +{(((arrForecasts[forecastHorizon].predicted - forecastingOverview.currentARR) / forecastingOverview.currentARR) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">MRR Trend Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Current MRR</div>
                <div className="text-2xl font-bold">€{forecastingOverview.currentMRR.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Growth Rate</div>
                <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                  <ArrowUp className="w-5 h-5" />
                  {forecastingOverview.mrrGrowthRate}%
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium mb-3">Monthly Breakdown</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-green-100 rounded">
                  <div className="font-semibold text-green-900">€245K</div>
                  <div className="text-green-600">New MRR</div>
                </div>
                <div className="text-center p-2 bg-blue-100 rounded">
                  <div className="font-semibold text-blue-900">€178K</div>
                  <div className="text-blue-600">Expansion</div>
                </div>
                <div className="text-center p-2 bg-red-100 rounded">
                  <div className="font-semibold text-red-900">-€67K</div>
                  <div className="text-red-600">Churn</div>
                </div>
              </div>
            </div>

            <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">
                Net MRR Growth: +€356K/month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ML Model Details */}
      {showMLModel && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Machine Learning Forecasting Models</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {mlModelMetrics.features} features
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mlModelMetrics.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{mlModelMetrics.precision}%</div>
              <div className="text-sm text-gray-600">Precision</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{mlModelMetrics.recall}%</div>
              <div className="text-sm text-gray-600">Recall</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{mlModelMetrics.f1Score}%</div>
              <div className="text-sm text-gray-600">F1 Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3">Model Types</h4>
              <div className="space-y-2">
                {Object.entries(mlModelMetrics.modelTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium text-blue-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3">Prediction Inputs</h4>
              <div className="space-y-1">
                {mlModelMetrics.predictionInputs.map((input, idx) => (
                  <div key={idx} className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {input}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 flex justify-between">
            <span>Training Data: {mlModelMetrics.trainingData}</span>
            <span>Last Trained: {mlModelMetrics.lastTrained}</span>
          </div>
        </div>
      )}

      {/* Cohort Analysis or Retention Based on Selection */}
      {selectedMetric === 'cohorts' ? (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">Cohort Analysis</h3>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              Quarterly Cohorts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Cohort</th>
                  <th className="text-right py-3 px-4">Customers</th>
                  <th className="text-right py-3 px-4">Initial ARR</th>
                  <th className="text-right py-3 px-4">Current ARR</th>
                  <th className="text-center py-3 px-4">Retention</th>
                  <th className="text-center py-3 px-4">NRR</th>
                  <th className="text-right py-3 px-4">LTV</th>
                  <th className="text-center py-3 px-4">Payback</th>
                </tr>
              </thead>
              <tbody>
                {cohortAnalysis.map((cohort, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{cohort.cohort}</td>
                    <td className="py-3 px-4 text-right">{cohort.customers}</td>
                    <td className="py-3 px-4 text-right">€{(cohort.initialARR / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-right font-semibold">€{(cohort.currentARR / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        cohort.retention >= 90 ? 'text-green-600' :
                        cohort.retention >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cohort.retention}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        cohort.nrr >= 120 ? 'text-green-600' :
                        cohort.nrr >= 100 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {cohort.nrr}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">€{(cohort.ltv / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-center">{cohort.paybackMonths} mesos</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedMetric === 'retention' ? (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Retention Forecasting by Segment</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(retentionForecasts).map(([segment, forecast]) => {
              const color = getSegmentColor(segment)
              const Icon = segment === 'empleats' ? Users : segment === 'empreses' ? Building2 : Crown
              
              return (
                <div key={segment} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <h4 className="font-medium capitalize">{segment}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(forecast.confidence)}`}>
                      {forecast.confidence}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Current Retention</div>
                      <div className="text-2xl font-bold">{forecast.current}%</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>3 mesos:</span>
                        <span className="font-medium text-green-600">{forecast.forecast3m}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>6 mesos:</span>
                        <span className="font-medium text-green-600">{forecast.forecast6m}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>12 mesos:</span>
                        <span className="font-medium text-green-600">{forecast.forecast12m}%</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-600 mb-2">Key Factors:</div>
                      {forecast.factors.map((factor, idx) => (
                        <div key={idx} className="text-xs text-gray-700">• {factor}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Forecast Drivers */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold">Revenue Growth Drivers</h3>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
            Impact Analysis
          </span>
        </div>

        <div className="space-y-4">
          {forecastDrivers.map((driver, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{driver.driver}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(driver.confidence)}`}>
                    {driver.confidence}% confidence
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${getTrendColor(driver.trend)}`}>
                    {driver.trend}
                  </span>
                  <span className="font-semibold text-green-600">
                    €{(driver.contribution / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              <div className="flex items-center mb-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                  <div 
                    className="bg-orange-500 h-3 rounded-full" 
                    style={{ width: `${driver.impact}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{driver.impact}% impact</span>
              </div>

              <p className="text-sm text-gray-600">{driver.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}