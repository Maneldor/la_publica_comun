'use client'

import { useState } from 'react'
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp,
  Users, Building2, Crown, Award, UserCheck, ShoppingBag, Briefcase,
  FileText, Activity, Download, RefreshCw, Filter, Search, Bell,
  Eye, Edit, Calendar, BarChart3, Target, Zap
} from 'lucide-react'

export default function ComplianceMatrix() {
  const [selectedEntity, setSelectedEntity] = useState<'all' | string>('all')
  const [selectedRegulation, setSelectedRegulation] = useState<'all' | string>('all')
  const [complianceView, setComplianceView] = useState<'matrix' | 'timeline' | 'risks'>('matrix')

  // Compliance requirements per entity type
  const complianceRequirements = {
    empleats: {
      name: 'Empleats Públics',
      icon: Users,
      color: 'blue',
      regulations: {
        'GDPR': { compliance: 98.5, issues: 2, deadline: '2024-05-25' },
        'LOPD': { compliance: 97.8, issues: 3, deadline: '2024-03-15' },
        'Estatut Treballadors': { compliance: 99.2, issues: 1, deadline: 'Ongoing' },
        'Prevenció Riscos': { compliance: 96.4, issues: 5, deadline: '2024-06-30' },
        'Conveni Col·lectiu': { compliance: 98.1, issues: 2, deadline: '2024-12-31' }
      }
    },
    empreses: {
      name: 'Empreses Col·laboradores',
      icon: Building2,
      color: 'green',
      regulations: {
        'GDPR': { compliance: 96.3, issues: 4, deadline: '2024-05-25' },
        'LSSI': { compliance: 94.7, issues: 6, deadline: '2024-04-30' },
        'Contractació Mercantil': { compliance: 95.8, issues: 3, deadline: 'Ongoing' },
        'ISO 27001': { compliance: 92.4, issues: 8, deadline: '2024-11-15' },
        'SOC 2': { compliance: 89.6, issues: 12, deadline: '2024-09-30' }
      }
    },
    administracions: {
      name: 'Administracions Públiques',
      icon: Crown,
      color: 'purple',
      regulations: {
        'Llei Contractes Sector Públic': { compliance: 98.9, issues: 1, deadline: 'Ongoing' },
        'Llei Transparència': { compliance: 97.5, issues: 2, deadline: 'Ongoing' },
        'ENS': { compliance: 94.2, issues: 7, deadline: '2024-07-01' },
        'Administració Electrònica': { compliance: 96.8, issues: 4, deadline: 'Ongoing' },
        'Protecció Dades': { compliance: 99.1, issues: 1, deadline: '2024-05-25' }
      }
    },
    sindicats: {
      name: 'Sindicats',
      icon: Briefcase,
      color: 'red',
      regulations: {
        'Llibertat Sindical': { compliance: 99.5, issues: 0, deadline: 'Ongoing' },
        'Negociació Col·lectiva': { compliance: 98.2, issues: 1, deadline: 'Ongoing' },
        'Protecció Dades Afiliats': { compliance: 97.6, issues: 2, deadline: '2024-05-25' },
        'Transparència Sindical': { compliance: 95.3, issues: 3, deadline: '2024-06-30' }
      }
    },
    associacions: {
      name: 'Associacions Professionals',
      icon: Award,
      color: 'yellow',
      regulations: {
        'Llei Associacions': { compliance: 96.7, issues: 3, deadline: 'Ongoing' },
        'GDPR': { compliance: 94.8, issues: 5, deadline: '2024-05-25' },
        'Formació Professional': { compliance: 93.2, issues: 6, deadline: '2024-08-31' },
        'Col·legis Professionals': { compliance: 95.1, issues: 4, deadline: 'Ongoing' }
      }
    },
    usuaris: {
      name: 'Usuaris Individuals',
      icon: UserCheck,
      color: 'indigo',
      regulations: {
        'GDPR': { compliance: 99.2, issues: 1, deadline: '2024-05-25' },
        'LOPD': { compliance: 98.7, issues: 1, deadline: '2024-03-15' },
        'LSSI': { compliance: 97.9, issues: 2, deadline: '2024-04-30' },
        'Drets Consumidors': { compliance: 98.4, issues: 2, deadline: 'Ongoing' }
      }
    },
    proveidors: {
      name: 'Proveïdors',
      icon: ShoppingBag,
      color: 'orange',
      regulations: {
        'Contractació Mercantil': { compliance: 93.6, issues: 6, deadline: 'Ongoing' },
        'SLA Compliance': { compliance: 91.8, issues: 8, deadline: 'Monthly' },
        'ISO 9001': { compliance: 90.4, issues: 9, deadline: '2024-10-31' },
        'Protecció Dades': { compliance: 92.7, issues: 7, deadline: '2024-05-25' }
      }
    }
  }

  // Upcoming compliance deadlines
  const upcomingDeadlines = [
    { regulation: 'GDPR Annual Review', entity: 'all', date: '2024-05-25', priority: 'high' },
    { regulation: 'ENS Certification', entity: 'administracions', date: '2024-07-01', priority: 'critical' },
    { regulation: 'ISO 27001 Audit', entity: 'empreses', date: '2024-11-15', priority: 'medium' },
    { regulation: 'Conveni Col·lectiu Renewal', entity: 'empleats', date: '2024-12-31', priority: 'high' },
    { regulation: 'SOC 2 Assessment', entity: 'empreses', date: '2024-09-30', priority: 'high' }
  ]

  // Compliance risks
  const complianceRisks = [
    {
      risk: 'GDPR Data Breach Protocol',
      entities: ['all'],
      severity: 'high',
      likelihood: 'medium',
      impact: 'critical',
      mitigation: 'Implement automated breach detection and response system'
    },
    {
      risk: 'Contract Renewal Tracking',
      entities: ['empreses', 'proveidors'],
      severity: 'medium',
      likelihood: 'high',
      impact: 'high',
      mitigation: 'Deploy automated alert system 90/60/30 days before expiry'
    },
    {
      risk: 'Public Procurement Compliance',
      entities: ['administracions'],
      severity: 'high',
      likelihood: 'low',
      impact: 'critical',
      mitigation: 'Regular audit of procurement processes'
    }
  ]

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-100'
    if (score >= 85) return 'text-yellow-600 bg-yellow-100'
    if (score >= 75) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
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

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const calculateOverallCompliance = () => {
    let total = 0
    let count = 0
    Object.values(complianceRequirements).forEach(entity => {
      Object.values(entity.regulations).forEach(reg => {
        total += reg.compliance
        count++
      })
    })
    return (total / count).toFixed(1)
  }

  const calculateEntityCompliance = (entity: any) => {
    const scores = Object.values(entity.regulations).map((r: any) => r.compliance)
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliance Matrix</h2>
            <p className="text-gray-600">Matriu de compliance regulatori per entitat</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{calculateOverallCompliance()}%</div>
              <div className="text-xs text-gray-600">Compliance Global</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Matrix
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setComplianceView('matrix')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              complianceView === 'matrix' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Matrix View
          </button>
          <button
            onClick={() => setComplianceView('timeline')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              complianceView === 'timeline' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setComplianceView('risks')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              complianceView === 'risks' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Risk Assessment
          </button>
        </div>
      </div>

      {/* Compliance Matrix View */}
      {complianceView === 'matrix' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Entitat</th>
                  <th className="text-center py-3 px-4">Compliance</th>
                  <th className="text-center py-3 px-4">GDPR</th>
                  <th className="text-center py-3 px-4">Contractual</th>
                  <th className="text-center py-3 px-4">Sectorial</th>
                  <th className="text-center py-3 px-4">Issues</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(complianceRequirements).map(([key, entity]) => {
                  const Icon = entity.icon
                  const totalIssues = Object.values(entity.regulations).reduce((sum, reg) => sum + reg.issues, 0)
                  
                  return (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-${entity.color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 text-${entity.color}-600`} />
                          </div>
                          <span className="font-medium">{entity.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          getComplianceColor(Number(calculateEntityCompliance(entity)))
                        }`}>
                          {calculateEntityCompliance(entity)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {entity.regulations['GDPR'] ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            getComplianceColor(entity.regulations['GDPR'].compliance)
                          }`}>
                            {entity.regulations['GDPR'].compliance}%
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {entity.regulations['Contractació Mercantil'] || entity.regulations['Llei Contractes Sector Públic'] ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            getComplianceColor(
                              (entity.regulations['Contractació Mercantil'] || entity.regulations['Llei Contractes Sector Públic']).compliance
                            )
                          }`}>
                            {(entity.regulations['Contractació Mercantil'] || entity.regulations['Llei Contractes Sector Públic']).compliance}%
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-600">
                          {Object.keys(entity.regulations).length} regs
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {totalIssues > 0 ? (
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            totalIssues > 10 ? 'bg-red-100 text-red-600' :
                            totalIssues > 5 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {totalIssues} issues
                          </span>
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {complianceView === 'timeline' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Upcoming Compliance Deadlines
          </h3>
          
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, idx) => {
              const entityData = deadline.entity === 'all' ? null : 
                complianceRequirements[deadline.entity as keyof typeof complianceRequirements]
              const Icon = entityData?.icon || Shield
              const color = entityData?.color || 'gray'
              
              return (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{deadline.regulation}</div>
                    <div className="text-sm text-gray-600">
                      {deadline.entity === 'all' ? 'Totes les entitats' : entityData?.name}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{deadline.date}</div>
                    <div className="text-xs text-gray-600">
                      {Math.ceil((new Date(deadline.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dies
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(deadline.priority)}`}>
                    {deadline.priority}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Risk Assessment View */}
      {complianceView === 'risks' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Compliance Risk Assessment
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {complianceRisks.map((risk, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium">{risk.risk}</h4>
                  <span className={`text-sm font-medium ${getSeverityColor(risk.severity)}`}>
                    {risk.severity} severity
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600">Likelihood</div>
                    <div className={`font-medium ${getSeverityColor(risk.likelihood)}`}>
                      {risk.likelihood}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600">Impact</div>
                    <div className={`font-medium ${getSeverityColor(risk.impact)}`}>
                      {risk.impact}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600">Entities</div>
                    <div className="font-medium">
                      {risk.entities[0] === 'all' ? 'All' : risk.entities.length}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-xs font-medium text-blue-700 mb-1">Mitigation:</div>
                  <div className="text-sm text-blue-600">{risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}