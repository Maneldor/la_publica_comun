'use client'

import { useState } from 'react'
import { 
  Users, Briefcase, FileText, Calendar, AlertTriangle, CheckCircle,
  Clock, Shield, Award, TrendingUp, Activity, Download, RefreshCw,
  Plus, Edit, Eye, Mail, Phone, MessageSquare, Target, Bell
} from 'lucide-react'

export default function LaborRelations() {
  const [activeTab, setActiveTab] = useState<'agreements' | 'negotiations' | 'disputes' | 'compliance'>('agreements')

  const collectiveAgreements = [
    {
      id: 'CA-001',
      title: 'Conveni Col·lectiu General 2024-2026',
      union: 'UGT Catalunya',
      employees: 892,
      status: 'active',
      signedDate: '2024-01-01',
      expiryDate: '2026-12-31',
      salaryIncrease: 3.5,
      benefits: ['Teletreball 3 dies', 'Formació continua', 'Plus transport'],
      complianceScore: 98
    },
    {
      id: 'CA-002',
      title: 'Acord Sectorial Administració Pública',
      union: 'CCOO',
      employees: 1456,
      status: 'negotiation',
      signedDate: null,
      expiryDate: '2024-06-30',
      salaryIncrease: 2.8,
      benefits: ['35 hores setmanals', 'Conciliació familiar'],
      complianceScore: 0
    }
  ]

  const negotiations = [
    {
      id: 'NEG-001',
      topic: 'Increment salarial 2024',
      union: 'CSIF',
      status: 'in_progress',
      startDate: '2024-01-10',
      meetings: 3,
      nextMeeting: '2024-02-05',
      progress: 65,
      keyDemands: ['3.5% increment', 'Revisió categories', 'Bonus productivitat']
    },
    {
      id: 'NEG-002',
      topic: 'Pla d\'Igualtat',
      union: 'CGT',
      status: 'final_phase',
      startDate: '2023-11-15',
      meetings: 8,
      nextMeeting: '2024-01-25',
      progress: 85,
      keyDemands: ['Paritat òrgans', 'Protocol assetjament', 'Auditoria salarial']
    }
  ]

  const laborDisputes = [
    {
      id: 'DIS-001',
      type: 'Acomiadament improcedent',
      employee: 'Joan M.',
      department: 'IT',
      status: 'mediation',
      filedDate: '2024-01-05',
      hearingDate: '2024-02-15',
      claimAmount: 45000,
      risk: 'medium'
    },
    {
      id: 'DIS-002',
      type: 'Discriminació',
      employee: 'Maria P.',
      department: 'HR',
      status: 'investigation',
      filedDate: '2024-01-12',
      hearingDate: null,
      claimAmount: 0,
      risk: 'high'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      negotiation: 'text-yellow-600 bg-yellow-100',
      expired: 'text-red-600 bg-red-100',
      in_progress: 'text-blue-600 bg-blue-100',
      final_phase: 'text-purple-600 bg-purple-100',
      mediation: 'text-orange-600 bg-orange-100',
      investigation: 'text-red-600 bg-red-100'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Relacions Laborals i Sindicals</h2>
            <p className="text-gray-600">Gestió de convenis, negociacions i conflictes laborals</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nou Conveni
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'agreements', label: 'Convenis Col·lectius', icon: FileText },
            { id: 'negotiations', label: 'Negociacions', icon: MessageSquare },
            { id: 'disputes', label: 'Conflictes', icon: AlertTriangle },
            { id: 'compliance', label: 'Compliance Laboral', icon: Shield }
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

      {/* Collective Agreements */}
      {activeTab === 'agreements' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Convenis Col·lectius Actius</h3>
          </div>
          <div className="divide-y">
            {collectiveAgreements.map(agreement => (
              <div key={agreement.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{agreement.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agreement.status)}`}>
                        {agreement.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sindicat:</span>
                        <span className="ml-2 font-medium">{agreement.union}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Empleats:</span>
                        <span className="ml-2 font-medium">{agreement.employees}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Increment:</span>
                        <span className="ml-2 font-medium text-green-600">+{agreement.salaryIncrease}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Vigència:</span>
                        <span className="ml-2 font-medium">{agreement.expiryDate || 'Pendent'}</span>
                      </div>
                    </div>
                    {agreement.benefits.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {agreement.benefits.map((benefit, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    )}
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negotiations */}
      {activeTab === 'negotiations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {negotiations.map(negotiation => (
            <div key={negotiation.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{negotiation.topic}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(negotiation.status)}`}>
                  {negotiation.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sindicat:</span>
                  <span className="font-medium">{negotiation.union}</span>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progrés:</span>
                    <span className="font-medium">{negotiation.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${negotiation.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reunions:</span>
                  <span className="font-medium">{negotiation.meetings}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Propera reunió:</span>
                  <span className="font-medium text-indigo-600">{negotiation.nextMeeting}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-2">Demandes clau:</div>
                  <div className="space-y-1">
                    {negotiation.keyDemands.map((demand, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {demand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Cas</th>
                  <th className="text-left py-3 px-4">Tipus</th>
                  <th className="text-left py-3 px-4">Empleat</th>
                  <th className="text-center py-3 px-4">Estat</th>
                  <th className="text-center py-3 px-4">Risc</th>
                  <th className="text-right py-3 px-4">Reclamació</th>
                  <th className="text-center py-3 px-4">Vista</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {laborDisputes.map(dispute => (
                  <tr key={dispute.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{dispute.id}</td>
                    <td className="py-3 px-4">{dispute.type}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{dispute.employee}</div>
                        <div className="text-sm text-gray-600">{dispute.department}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getRiskColor(dispute.risk)}`}>
                        {dispute.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {dispute.claimAmount > 0 ? `€${dispute.claimAmount.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {dispute.hearingDate || 'Pendent'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Edit className="w-4 h-4" />
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

      {/* Compliance */}
      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Estatut dels Treballadors</h4>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
            <div className="text-sm text-gray-600">Compliance</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Contractes revisats:</span>
                <span className="font-medium">892/892</span>
              </div>
              <div className="flex justify-between">
                <span>Issues pendents:</span>
                <span className="font-medium text-yellow-600">3</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Prevenció Riscos Laborals</h4>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">96.2%</div>
            <div className="text-sm text-gray-600">Compliance</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Avaluacions:</span>
                <span className="font-medium">234/245</span>
              </div>
              <div className="flex justify-between">
                <span>Formacions pendents:</span>
                <span className="font-medium text-orange-600">12</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Pla d'Igualtat</h4>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">94.8%</div>
            <div className="text-sm text-gray-600">Compliance</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mesures implementades:</span>
                <span className="font-medium">45/48</span>
              </div>
              <div className="flex justify-between">
                <span>Auditoria:</span>
                <span className="font-medium text-green-600">Aprovada</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}