'use client'

import { useState } from 'react'
import { 
  Scale, AlertTriangle, FileText, Calendar, Clock, CheckCircle,
  Users, Building2, Gavel, Target, TrendingUp, Euro, MessageSquare,
  Plus, Edit, Eye, Mail, Phone, Download, Filter, Search
} from 'lucide-react'

export default function DisputeResolution() {
  const [activeTab, setActiveTab] = useState<'active' | 'mediation' | 'litigation' | 'analytics'>('active')

  const activeDisputes = [
    {
      id: 'DIS-001',
      title: 'Conflicte Contractual - Serveis IT',
      parties: ['La Pública Comú', 'TechSolutions BCN S.L.'],
      type: 'Contractual',
      entityType: 'Empresa Col·laboradora',
      amount: 125000,
      status: 'mediation',
      priority: 'high',
      filed: '2024-01-15',
      lastUpdate: '2024-01-28',
      assignedLawyer: 'Maria González',
      nextAction: 'Sessió mediació',
      nextDate: '2024-02-05',
      riskAssessment: 'medium',
      description: 'Incompliment de SLA en serveis de desenvolupament'
    },
    {
      id: 'DIS-002',
      title: 'Reclamació Laboral - Acomiadament',
      parties: ['Empleat Joan M.', 'La Pública Comú'],
      type: 'Laboral',
      entityType: 'Empleat Públic',
      amount: 45000,
      status: 'investigation',
      priority: 'medium',
      filed: '2024-01-20',
      lastUpdate: '2024-01-25',
      assignedLawyer: 'Pere Martín',
      nextAction: 'Recollida evidències',
      nextDate: '2024-02-10',
      riskAssessment: 'low',
      description: 'Qüestionament del procediment d\'acomiadament'
    },
    {
      id: 'DIS-003',
      title: 'Disputa Sindical - Condicions Laborals',
      parties: ['Sindicat Treballadors', 'La Pública Comú'],
      type: 'Sindical',
      entityType: 'Sindicat',
      amount: 0,
      status: 'negotiation',
      priority: 'high',
      filed: '2024-01-08',
      lastUpdate: '2024-01-30',
      assignedLawyer: 'Anna Torres',
      nextAction: 'Reunió negociació',
      nextDate: '2024-02-03',
      riskAssessment: 'high',
      description: 'Reclamació millora condicions i increment salarial'
    }
  ]

  const mediationCases = [
    {
      id: 'MED-001',
      case: 'DIS-001',
      mediator: 'Carlos Ruiz (Extern)',
      startDate: '2024-01-25',
      sessions: 2,
      nextSession: '2024-02-05',
      progress: 40,
      status: 'ongoing',
      estimatedResolution: '2024-03-15',
      costs: 8500
    },
    {
      id: 'MED-002',
      case: 'DIS-005',
      mediator: 'Laura Pérez (Extern)',
      startDate: '2024-01-10',
      sessions: 4,
      nextSession: null,
      progress: 85,
      status: 'near_agreement',
      estimatedResolution: '2024-02-10',
      costs: 12000
    }
  ]

  const litigationCases = [
    {
      id: 'LIT-001',
      case: 'DIS-008',
      court: 'Jutjat Contenciós Administratiu nº3',
      judge: 'Il·lma. Sra. Carmen López',
      ourLawyer: 'Maria González',
      opposingLawyer: 'Bufete Martínez & Asociados',
      filedDate: '2023-11-20',
      hearingDate: '2024-03-15',
      status: 'discovery',
      amount: 250000,
      riskLevel: 'high',
      nextDeadline: 'Presentació al·legacions',
      deadlineDate: '2024-02-20'
    }
  ]

  const resolutionAnalytics = [
    {
      period: '2023',
      totalDisputes: 47,
      resolved: 42,
      mediated: 28,
      litigated: 14,
      wonCases: 35,
      lostCases: 7,
      avgResolutionTime: 145,
      totalCosts: 340000,
      savings: 180000
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      mediation: 'text-blue-600 bg-blue-100',
      investigation: 'text-yellow-600 bg-yellow-100',
      negotiation: 'text-purple-600 bg-purple-100',
      litigation: 'text-red-600 bg-red-100',
      resolved: 'text-green-600 bg-green-100',
      ongoing: 'text-blue-600 bg-blue-100',
      near_agreement: 'text-green-600 bg-green-100',
      discovery: 'text-orange-600 bg-orange-100',
      trial: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getEntityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Empresa Col·laboradora': 'text-blue-600 bg-blue-100',
      'Empleat Públic': 'text-green-600 bg-green-100',
      'Sindicat': 'text-red-600 bg-red-100',
      'Associació Professional': 'text-purple-600 bg-purple-100',
      'Proveïdor': 'text-orange-600 bg-orange-100',
      'Usuari Individual': 'text-gray-600 bg-gray-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resolució de Disputes</h2>
            <p className="text-gray-600">Gestió de conflictes, mediació i litigació</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nova Disputa
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              Informe
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">23</div>
                <div className="text-sm text-gray-600">Disputes Actives</div>
              </div>
              <Scale className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">En Mediació</div>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-sm text-gray-600">En Litigació</div>
              </div>
              <Gavel className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Taxa Resolució</div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'active', label: 'Disputes Actives', icon: AlertTriangle },
            { id: 'mediation', label: 'Mediació', icon: MessageSquare },
            { id: 'litigation', label: 'Litigació', icon: Gavel },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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

      {/* Active Disputes */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Disputes en Curs</h3>
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
            
            <div className="space-y-4">
              {activeDisputes.map(dispute => (
                <div key={dispute.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{dispute.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dispute.status)}`}>
                          {dispute.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getEntityTypeColor(dispute.entityType)}`}>
                          {dispute.entityType}
                        </span>
                        <span className={`font-medium ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                      <div className="text-xs text-gray-500">
                        Parts: {dispute.parties.join(' vs ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Import:</span>
                      <span className="ml-2 font-medium">
                        {dispute.amount > 0 ? `€${dispute.amount.toLocaleString()}` : 'No monetari'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Presentat:</span>
                      <span className="ml-2 font-medium">{dispute.filed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Advocat:</span>
                      <span className="ml-2 font-medium">{dispute.assignedLawyer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Propera acció:</span>
                      <span className="ml-2 font-medium text-indigo-600">{dispute.nextAction}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Data:</span>
                      <span className="ml-2 font-medium">{dispute.nextDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risc:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(dispute.riskAssessment)}`}>
                        {dispute.riskAssessment.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mediation */}
      {activeTab === 'mediation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mediationCases.map(mediation => (
            <div key={mediation.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Cas {mediation.case}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(mediation.status)}`}>
                  {mediation.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mediador:</span>
                  <span className="font-medium">{mediation.mediator}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions:</span>
                  <span className="font-medium">{mediation.sessions} realitzades</span>
                </div>
                
                {mediation.nextSession && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Propera sessió:</span>
                    <span className="font-medium text-indigo-600">{mediation.nextSession}</span>
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progrés:</span>
                    <span className="font-medium">{mediation.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${mediation.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resolució estimada:</span>
                  <span className="font-medium">{mediation.estimatedResolution}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costos:</span>
                  <span className="font-medium">€{mediation.costs.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Litigation */}
      {activeTab === 'litigation' && (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Cas</th>
                  <th className="text-left py-3 px-4">Tribunal</th>
                  <th className="text-left py-3 px-4">Jutge</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Import</th>
                  <th className="text-center py-3 px-4">Risc</th>
                  <th className="text-center py-3 px-4">Propera Fita</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {litigationCases.map(litigation => (
                  <tr key={litigation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{litigation.case}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{litigation.court}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{litigation.judge}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(litigation.status)}`}>
                        {litigation.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      €{litigation.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getRiskColor(litigation.riskLevel)}`}>
                        {litigation.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm">
                        <div className="font-medium">{litigation.nextDeadline}</div>
                        <div className="text-gray-600">{litigation.deadlineDate}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <FileText className="w-4 h-4" />
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

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Taxa Resolució</div>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">145</div>
                  <div className="text-sm text-gray-600">Dies Mitjans</div>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">€340K</div>
                  <div className="text-sm text-gray-600">Costos Totals</div>
                </div>
                <Euro className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">€180K</div>
                  <div className="text-sm text-gray-600">Estalvis Mediació</div>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Distribució per Tipus de Disputa</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contractual</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Laboral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sindical</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Administratiu</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Mètodes de Resolució</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mediació</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Negociació directa</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Litigació</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
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