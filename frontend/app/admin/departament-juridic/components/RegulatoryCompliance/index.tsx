'use client'

import { useState } from 'react'
import { 
  FileCheck, AlertTriangle, CheckCircle, Clock, Calendar, TrendingUp,
  Shield, Book, Globe, Building2, Users, Briefcase, Gavel, Target,
  Plus, Edit, Eye, Download, Filter, Search, RefreshCw, Bell
} from 'lucide-react'

export default function RegulatoryCompliance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'audits' | 'tracking'>('overview')

  const regulatoryDomains = [
    {
      id: 'GDPR',
      name: 'Protecció de Dades (GDPR)',
      category: 'Privacitat i Dades',
      applicability: ['Empleats Públics', 'Empreses Col·laboradores', 'Usuaris Individuals'],
      complianceScore: 94,
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15',
      criticalRequirements: 12,
      completedRequirements: 11,
      riskLevel: 'low',
      regulatoryBody: 'AEPD'
    },
    {
      id: 'LOPD',
      name: 'Llei Orgànica Protecció Dades',
      category: 'Privacitat i Dades',
      applicability: ['Empleats Públics', 'Administracions'],
      complianceScore: 89,
      status: 'minor_gaps',
      lastAudit: '2023-12-20',
      nextReview: '2024-06-20',
      criticalRequirements: 8,
      completedRequirements: 7,
      riskLevel: 'medium',
      regulatoryBody: 'AEPD'
    },
    {
      id: 'LSSI',
      name: 'Llei Serveis Societat Informació',
      category: 'Digital i Tecnologia',
      applicability: ['Plataforma Digital', 'Usuaris'],
      complianceScore: 96,
      status: 'compliant',
      lastAudit: '2024-01-10',
      nextReview: '2024-10-10',
      criticalRequirements: 15,
      completedRequirements: 15,
      riskLevel: 'low',
      regulatoryBody: 'CNMC'
    },
    {
      id: 'ET',
      name: 'Estatut dels Treballadors',
      category: 'Laboral',
      applicability: ['Empleats Públics', 'Contractes Laborals'],
      complianceScore: 92,
      status: 'compliant',
      lastAudit: '2023-11-30',
      nextReview: '2024-05-30',
      criticalRequirements: 25,
      completedRequirements: 23,
      riskLevel: 'low',
      regulatoryBody: 'Ministeri de Treball'
    },
    {
      id: 'PRL',
      name: 'Prevenció Riscos Laborals',
      category: 'Seguretat Laboral',
      applicability: ['Empleats', 'Centres de Treball'],
      complianceScore: 87,
      status: 'minor_gaps',
      lastAudit: '2023-10-15',
      nextReview: '2024-04-15',
      criticalRequirements: 18,
      completedRequirements: 16,
      riskLevel: 'medium',
      regulatoryBody: 'ITSS'
    }
  ]

  const complianceRequirements = [
    {
      id: 'REQ-001',
      domain: 'GDPR',
      title: 'Registre d\'Activitats de Tractament',
      description: 'Mantenir registre actualitzat de totes les activitats de tractament de dades',
      priority: 'high',
      status: 'completed',
      assignee: 'DPO - Maria González',
      dueDate: '2024-03-01',
      completionDate: '2024-01-15',
      evidence: 'Registre_Tractaments_2024.pdf'
    },
    {
      id: 'REQ-002',
      domain: 'GDPR',
      title: 'Avaluació d\'Impacte DPIA',
      description: 'Realitzar DPIA per a nous tractaments d\'alt risc',
      priority: 'high',
      status: 'in_progress',
      assignee: 'DPO - Maria González',
      dueDate: '2024-02-28',
      completionDate: null,
      evidence: null
    },
    {
      id: 'REQ-003',
      domain: 'PRL',
      title: 'Pla de Prevenció Actualitzat',
      description: 'Actualització del pla de prevenció de riscos laborals',
      priority: 'medium',
      status: 'pending',
      assignee: 'Tècnic PRL - Joan Martín',
      dueDate: '2024-04-15',
      completionDate: null,
      evidence: null
    }
  ]

  const auditSchedule = [
    {
      id: 'AUD-001',
      domain: 'GDPR',
      type: 'Internal Audit',
      auditor: 'Equip Intern DPO',
      scheduledDate: '2024-02-15',
      status: 'scheduled',
      scope: ['Registres tractament', 'Mesures seguretat', 'Drets usuaris'],
      estimatedDuration: 5
    },
    {
      id: 'AUD-002',
      domain: 'PRL',
      type: 'External Audit',
      auditor: 'Mútua Laboral - Inspector certificat',
      scheduledDate: '2024-03-20',
      status: 'scheduled',
      scope: ['Avaluació riscos', 'Plans prevenció', 'Formació treballadors'],
      estimatedDuration: 3
    },
    {
      id: 'AUD-003',
      domain: 'LSSI',
      type: 'Compliance Review',
      auditor: 'Consultoria Legal Externa',
      scheduledDate: '2024-01-25',
      status: 'in_progress',
      scope: ['Política cookies', 'Informació legal', 'Accessibilitat'],
      estimatedDuration: 2
    }
  ]

  const trackingMetrics = [
    {
      category: 'Compliance General',
      current: 92,
      target: 95,
      trend: +2,
      status: 'improving'
    },
    {
      category: 'Auditories Pendents',
      current: 3,
      target: 0,
      trend: -1,
      status: 'improving'
    },
    {
      category: 'Requeriments Crítics',
      current: 89,
      target: 95,
      trend: +5,
      status: 'improving'
    },
    {
      category: 'Riscos d\'Alt Impacte',
      current: 2,
      target: 0,
      trend: 0,
      status: 'stable'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      compliant: 'text-green-600 bg-green-100',
      minor_gaps: 'text-yellow-600 bg-yellow-100',
      major_gaps: 'text-red-600 bg-red-100',
      non_compliant: 'text-red-600 bg-red-100',
      completed: 'text-green-600 bg-green-100',
      in_progress: 'text-blue-600 bg-blue-100',
      pending: 'text-yellow-600 bg-yellow-100',
      overdue: 'text-red-600 bg-red-100',
      scheduled: 'text-blue-600 bg-blue-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Privacitat i Dades': 'text-blue-600 bg-blue-100',
      'Digital i Tecnologia': 'text-purple-600 bg-purple-100',
      'Laboral': 'text-green-600 bg-green-100',
      'Seguretat Laboral': 'text-orange-600 bg-orange-100',
      'Contractual': 'text-indigo-600 bg-indigo-100'
    }
    return colors[category] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliment Normatiu</h2>
            <p className="text-gray-600">Gestió del compliment de normatives i regulacions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nova Normativa
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              Informe Compliment
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-sm text-gray-600">Compliance Global</div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-sm text-gray-600">Normatives Actives</div>
              </div>
              <Book className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-sm text-gray-600">Auditories Programades</div>
              </div>
              <FileCheck className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-gray-600">Requeriments Pendents</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'overview', label: 'Panorama General', icon: Shield },
            { id: 'requirements', label: 'Requeriments', icon: FileCheck },
            { id: 'audits', label: 'Auditories', icon: Search },
            { id: 'tracking', label: 'Seguiment', icon: TrendingUp }
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

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Domini Regulatoris</h3>
            <div className="space-y-4">
              {regulatoryDomains.map(domain => (
                <div key={domain.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{domain.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(domain.category)}`}>
                          {domain.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(domain.status)}`}>
                          {domain.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Òrgan: {domain.regulatoryBody} | Aplicable a: {domain.applicability.join(', ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Compliance:</span>
                      <span className="ml-2 font-bold text-indigo-600">{domain.complianceScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Requeriments:</span>
                      <span className="ml-2 font-medium">{domain.completedRequirements}/{domain.criticalRequirements}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Última auditoria:</span>
                      <span className="ml-2 font-medium">{domain.lastAudit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Propera revisió:</span>
                      <span className="ml-2 font-medium text-indigo-600">{domain.nextReview}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risc:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(domain.riskLevel)}`}>
                        {domain.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            domain.complianceScore >= 90 ? 'bg-green-600' :
                            domain.complianceScore >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${domain.complianceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requirements */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Requeriments de Compliment</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                  <Search className="w-4 h-4" />
                  Buscar
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                  <Filter className="w-4 h-4" />
                  Filtres
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Requeriment</th>
                  <th className="text-left py-3 px-4">Domini</th>
                  <th className="text-center py-3 px-4">Prioritat</th>
                  <th className="text-left py-3 px-4">Assignat</th>
                  <th className="text-center py-3 px-4">Venciment</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Evidència</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {complianceRequirements.map(requirement => (
                  <tr key={requirement.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{requirement.title}</div>
                        <div className="text-sm text-gray-600">{requirement.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                        {requirement.domain}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPriorityColor(requirement.priority)}`}>
                        {requirement.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">{requirement.assignee}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`${
                        new Date(requirement.dueDate) < new Date() && requirement.status !== 'completed'
                          ? 'text-red-600 font-medium' : 'text-gray-600'
                      }`}>
                        {requirement.dueDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(requirement.status)}`}>
                        {requirement.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {requirement.evidence ? (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audits */}
      {activeTab === 'audits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {auditSchedule.map(audit => (
            <div key={audit.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{audit.domain} - {audit.type}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(audit.status)}`}>
                  {audit.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Auditor:</span>
                  <span className="font-medium">{audit.auditor}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data programada:</span>
                  <span className="font-medium text-indigo-600">{audit.scheduledDate}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Durada estimada:</span>
                  <span className="font-medium">{audit.estimatedDuration} dies</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-2">Abast de l'auditoria:</div>
                  <div className="space-y-1">
                    {audit.scope.map((item, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {trackingMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600">{metric.category}</div>
                  <div className={`text-xs ${
                    metric.status === 'improving' ? 'text-green-600' :
                    metric.status === 'declining' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className={`text-2xl font-bold ${
                    metric.current >= metric.target ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {metric.current}{typeof metric.current === 'number' && metric.category.includes('%') ? '%' : ''}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    / {metric.target}{typeof metric.target === 'number' && metric.category.includes('%') ? '%' : ''}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.current >= metric.target ? 'bg-green-600' : 'bg-orange-600'
                    }`}
                    style={{ 
                      width: `${Math.min((metric.current / metric.target) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Distribució per Categories</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Privacitat i Dades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Laboral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Digital i Tecnologia</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Seguretat Laboral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Evolució Temporal</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gener 2024</span>
                  <span className="text-sm font-medium text-gray-600">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Febrer 2024</span>
                  <span className="text-sm font-medium text-gray-600">90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Març 2024</span>
                  <span className="text-sm font-medium text-indigo-600">92%</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tendència</span>
                    <span className="text-sm font-bold text-green-600">+4% (3 mesos)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}