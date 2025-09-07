'use client'

import { useState } from 'react'
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, Activity,
  TrendingUp, TrendingDown, BarChart3, Users, Building2, Crown,
  FileText, Bot, Zap, Eye, Settings, RefreshCw, Download,
  Award, Target, Calendar, Mail, Phone, Globe, Database,
  ArrowUp, ArrowDown, Bell, Search, Filter, Plus, Edit
} from 'lucide-react'

export default function RiskManagement() {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<'all' | 'operational' | 'financial' | 'regulatory' | 'strategic'>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [showMitigation, setShowMitigation] = useState(true)
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  const riskOverview = {
    totalRisks: 47,
    criticalRisks: 8,
    highRisks: 15,
    mediumRisks: 18,
    lowRisks: 6,
    mitigatedRisks: 34,
    overallRiskScore: 6.7,
    trendsImproving: 12,
    trendsWorsening: 5
  }

  const operationalRisks = [
    {
      id: 'OP-001',
      name: 'System Downtime',
      category: 'operational',
      severity: 'high',
      probability: 15,
      impact: 'Very High',
      riskScore: 8.5,
      trend: 'stable',
      lastAssessment: '2024-01-15',
      owner: 'Infrastructure Team',
      status: 'monitored',
      mitigation: {
        current: ['Redundant systems', '24/7 monitoring', 'Failover procedures'],
        planned: ['Additional data center', 'Improved backup systems'],
        effectiveness: 78
      },
      kpis: [
        { metric: 'Uptime', current: 99.97, target: 99.95 },
        { metric: 'MTTR', current: 15, target: 30 },
        { metric: 'Incidents/Month', current: 2, target: 5 }
      ]
    },
    {
      id: 'OP-002',
      name: 'Data Security Breach',
      category: 'operational',
      severity: 'critical',
      probability: 8,
      impact: 'Critical',
      riskScore: 9.2,
      trend: 'improving',
      lastAssessment: '2024-01-14',
      owner: 'Security Team',
      status: 'active',
      mitigation: {
        current: ['Multi-factor auth', 'Encryption', 'Regular audits', 'SOC monitoring'],
        planned: ['Zero-trust architecture', 'Enhanced endpoint protection'],
        effectiveness: 85
      },
      kpis: [
        { metric: 'Security Score', current: 92, target: 85 },
        { metric: 'Vulnerabilities', current: 3, target: 10 },
        { metric: 'Training Completion', current: 94, target: 90 }
      ]
    }
  ]

  const financialRisks = [
    {
      id: 'FIN-001',
      name: 'Customer Concentration Risk',
      category: 'financial',
      severity: 'medium',
      probability: 25,
      impact: 'High',
      riskScore: 7.1,
      trend: 'worsening',
      lastAssessment: '2024-01-13',
      owner: 'Sales Team',
      status: 'monitored',
      mitigation: {
        current: ['Customer diversification', 'Contract terms', 'Relationship management'],
        planned: ['New market segments', 'International expansion'],
        effectiveness: 65
      },
      kpis: [
        { metric: 'Top 5 Customer %', current: 67, target: 50 },
        { metric: 'New Customers/Q', current: 89, target: 120 },
        { metric: 'Churn Rate', current: 3.2, target: 5.0 }
      ]
    },
    {
      id: 'FIN-002',
      name: 'Cash Flow Risk',
      category: 'financial',
      severity: 'low',
      probability: 12,
      impact: 'Medium',
      riskScore: 4.8,
      trend: 'improving',
      lastAssessment: '2024-01-12',
      owner: 'Finance Team',
      status: 'monitored',
      mitigation: {
        current: ['Cash reserves', 'Credit facility', 'Monthly forecasting'],
        planned: ['Extended credit line', 'Invoice factoring'],
        effectiveness: 89
      },
      kpis: [
        { metric: 'Cash Runway', current: 28, target: 18 },
        { metric: 'DSO', current: 32, target: 45 },
        { metric: 'Collection Rate', current: 96.7, target: 95.0 }
      ]
    }
  ]

  const regulatoryRisks = [
    {
      id: 'REG-001',
      name: 'GDPR Compliance',
      category: 'regulatory',
      severity: 'high',
      probability: 20,
      impact: 'Very High',
      riskScore: 8.0,
      trend: 'stable',
      lastAssessment: '2024-01-11',
      owner: 'Legal Team',
      status: 'compliant',
      mitigation: {
        current: ['Privacy by design', 'Data mapping', 'Training programs', 'DPO appointed'],
        planned: ['Automated compliance monitoring', 'Enhanced consent management'],
        effectiveness: 92
      },
      kpis: [
        { metric: 'Compliance Score', current: 94, target: 90 },
        { metric: 'Data Requests', current: 12, target: 20 },
        { metric: 'Training Rate', current: 97, target: 95 }
      ]
    },
    {
      id: 'REG-002',
      name: 'Public Procurement Rules',
      category: 'regulatory',
      severity: 'medium',
      probability: 30,
      impact: 'Medium',
      riskScore: 6.5,
      trend: 'stable',
      lastAssessment: '2024-01-10',
      owner: 'Legal Team',
      status: 'compliant',
      mitigation: {
        current: ['Legal review', 'Compliance training', 'Regular audits'],
        planned: ['Automated compliance checks', 'Enhanced documentation'],
        effectiveness: 83
      },
      kpis: [
        { metric: 'Tender Success Rate', current: 34.7, target: 30.0 },
        { metric: 'Compliance Violations', current: 0, target: 0 },
        { metric: 'Legal Reviews', current: 156, target: 100 }
      ]
    }
  ]

  const strategicRisks = [
    {
      id: 'STR-001',
      name: 'Competitive Threat',
      category: 'strategic',
      severity: 'high',
      probability: 35,
      impact: 'High',
      riskScore: 7.8,
      trend: 'worsening',
      lastAssessment: '2024-01-09',
      owner: 'Strategy Team',
      status: 'active',
      mitigation: {
        current: ['Product differentiation', 'Patent protection', 'Customer loyalty'],
        planned: ['AI capabilities', 'Partnership strategy', 'Market expansion'],
        effectiveness: 71
      },
      kpis: [
        { metric: 'Market Share', current: 23.7, target: 25.0 },
        { metric: 'Win Rate', current: 34.7, target: 40.0 },
        { metric: 'Customer NPS', current: 72, target: 75 }
      ]
    }
  ]

  const allRisks = [...operationalRisks, ...financialRisks, ...regulatoryRisks, ...strategicRisks]

  const complianceFrameworks = [
    {
      framework: 'ISO 27001',
      status: 'certified',
      lastAudit: '2023-11-15',
      nextAudit: '2024-11-15',
      compliance: 96,
      findings: 3,
      criticality: 'low'
    },
    {
      framework: 'SOC 2 Type II',
      status: 'certified',
      lastAudit: '2023-12-20',
      nextAudit: '2024-12-20',
      compliance: 94,
      findings: 5,
      criticality: 'medium'
    },
    {
      framework: 'ENS (CCN-STIC)',
      status: 'in_progress',
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      compliance: 87,
      findings: 8,
      criticality: 'medium'
    },
    {
      framework: 'GDPR',
      status: 'compliant',
      lastAudit: '2024-01-05',
      nextAudit: '2024-07-05',
      compliance: 98,
      findings: 2,
      criticality: 'low'
    }
  ]

  const riskTrends = [
    { period: '2023-Q1', score: 7.2, risks: 52 },
    { period: '2023-Q2', score: 6.9, risks: 49 },
    { period: '2023-Q3', score: 6.5, risks: 51 },
    { period: '2023-Q4', score: 6.8, risks: 48 },
    { period: '2024-Q1', score: 6.7, risks: 47 }
  ]

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-red-600 bg-red-100'
      case 'monitored': return 'text-yellow-600 bg-yellow-100'
      case 'mitigated': return 'text-blue-600 bg-blue-100'
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'certified': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'improving': return 'text-green-600'
      case 'stable': return 'text-blue-600'
      case 'worsening': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-red-600 bg-red-100'
    if (score >= 7.0) return 'text-orange-600 bg-orange-100'
    if (score >= 5.0) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Risk Management</h2>
            <p className="text-gray-600">Operational risk monitoring i regulatory compliance tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMitigation(!showMitigation)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showMitigation ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              Mitigation Plans
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Risk Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria de Risc</label>
            <select 
              value={selectedRiskCategory} 
              onChange={(e) => setSelectedRiskCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les categories</option>
              <option value="operational">Operacional</option>
              <option value="financial">Financer</option>
              <option value="regulatory">Regulatori</option>
              <option value="strategic">Estratègic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severitat</label>
            <select 
              value={selectedSeverity} 
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les severitats</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Mitjana</option>
              <option value="low">Baixa</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Update Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Risks</span>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{riskOverview.totalRisks}</div>
          <div className="text-sm text-gray-600">{riskOverview.mitigatedRisks} mitigated</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical Risks</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{riskOverview.criticalRisks}</div>
          <div className="text-sm text-red-600">require immediate attention</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Risk Score</span>
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{riskOverview.overallRiskScore}/10</div>
          <div className="text-sm text-gray-600">overall assessment</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Improving</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{riskOverview.trendsImproving}</div>
          <div className="text-sm text-green-600">trends positive</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Worsening</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{riskOverview.trendsWorsening}</div>
          <div className="text-sm text-red-600">need attention</div>
        </div>
      </div>

      {/* Risk Register */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Risk Register</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {allRisks.filter(risk => 
              (selectedRiskCategory === 'all' || risk.category === selectedRiskCategory) &&
              (selectedSeverity === 'all' || risk.severity === selectedSeverity)
            ).length} risks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Risk</th>
                <th className="text-center py-3 px-4">Category</th>
                <th className="text-center py-3 px-4">Severity</th>
                <th className="text-center py-3 px-4">Risk Score</th>
                <th className="text-center py-3 px-4">Probability</th>
                <th className="text-center py-3 px-4">Trend</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Owner</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRisks
                .filter(risk => {
                  if (selectedRiskCategory !== 'all' && risk.category !== selectedRiskCategory) return false
                  if (selectedSeverity !== 'all' && risk.severity !== selectedSeverity) return false
                  return true
                })
                .map((risk) => (
                  <tr 
                    key={risk.id} 
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      selectedRisk === risk.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{risk.name}</div>
                        <div className="text-sm text-gray-600">{risk.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                        {risk.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-bold ${getRiskScoreColor(risk.riskScore)}`}>
                        {risk.riskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{risk.probability}%</td>
                    <td className="py-3 px-4 text-center">
                      <div className={`flex items-center justify-center gap-1 ${getTrendColor(risk.trend)}`}>
                        {risk.trend === 'improving' ? <TrendingUp className="w-4 h-4" /> :
                         risk.trend === 'worsening' ? <TrendingDown className="w-4 h-4" /> :
                         <Activity className="w-4 h-4" />}
                        <span className="text-xs capitalize">{risk.trend}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(risk.status)}`}>
                        {risk.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{risk.owner}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded" title="View Details">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Edit Risk">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        {risk.severity === 'critical' && (
                          <button className="p-1 hover:bg-gray-200 rounded" title="Alert">
                            <Bell className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Risk Details Panel */}
        {selectedRisk && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {(() => {
              const risk = allRisks.find(r => r.id === selectedRisk)
              if (!risk) return null
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Risk Details: {risk.name}</h4>
                    <button 
                      onClick={() => setSelectedRisk(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Current Mitigation:</h5>
                      <ul className="space-y-1">
                        {risk.mitigation.current.map((measure, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {measure}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Effectiveness: </span>
                        <span className={`${
                          risk.mitigation.effectiveness >= 80 ? 'text-green-600' :
                          risk.mitigation.effectiveness >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {risk.mitigation.effectiveness}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Performance Indicators:</h5>
                      <div className="space-y-2">
                        {risk.kpis.map((kpi, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>{kpi.metric}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{kpi.current}</span>
                              <span className="text-gray-500">(target: {kpi.target})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {risk.mitigation.planned.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h5 className="font-medium text-sm mb-2">Planned Mitigation:</h5>
                      <ul className="space-y-1">
                        {risk.mitigation.planned.map((measure, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <Clock className="w-3 h-3 text-blue-500" />
                            {measure}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Compliance Frameworks */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">Regulatory Compliance</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            4 Frameworks Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceFrameworks.map((framework, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{framework.framework}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(framework.status)}`}>
                    {framework.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    framework.compliance >= 95 ? 'bg-green-100 text-green-700' :
                    framework.compliance >= 90 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {framework.compliance}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Last Audit:</span>
                  <span className="font-medium">{framework.lastAudit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Audit:</span>
                  <span className="font-medium">{framework.nextAudit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Findings:</span>
                  <span className={`font-medium ${
                    framework.findings === 0 ? 'text-green-600' :
                    framework.findings <= 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {framework.findings}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Criticality:</span>
                  <span className={`font-medium capitalize ${
                    framework.criticality === 'low' ? 'text-green-600' :
                    framework.criticality === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {framework.criticality}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      framework.compliance >= 95 ? 'bg-green-500' :
                      framework.compliance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${framework.compliance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Trends */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">Risk Trends</h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            Quarterly Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Risk Score Trend</h4>
            <div className="space-y-3">
              {riskTrends.map((trend, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{trend.period}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{trend.risks} risks</span>
                    <span className={`font-bold ${getRiskScoreColor(trend.score).split(' ')[0]}`}>
                      {trend.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Risk Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-medium text-red-900">Critical</span>
                <div className="flex items-center gap-2">
                  <div className="bg-red-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(riskOverview.criticalRisks / riskOverview.totalRisks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-red-600">{riskOverview.criticalRisks}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="font-medium text-orange-900">High</span>
                <div className="flex items-center gap-2">
                  <div className="bg-orange-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(riskOverview.highRisks / riskOverview.totalRisks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-orange-600">{riskOverview.highRisks}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="font-medium text-yellow-900">Medium</span>
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(riskOverview.mediumRisks / riskOverview.totalRisks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-yellow-600">{riskOverview.mediumRisks}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-medium text-blue-900">Low</span>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-200 rounded-full h-2 w-24">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(riskOverview.lowRisks / riskOverview.totalRisks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-blue-600">{riskOverview.lowRisks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}