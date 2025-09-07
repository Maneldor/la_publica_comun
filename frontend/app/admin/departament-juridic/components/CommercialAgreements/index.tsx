'use client'

import { useState } from 'react'
import { 
  Building2, HandshakeIcon, FileText, Calendar, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Euro, Users, Target, Award, BarChart3, RefreshCw,
  Plus, Edit, Eye, Mail, Phone, MessageSquare, Download, Filter
} from 'lucide-react'

export default function CommercialAgreements() {
  const [activeTab, setActiveTab] = useState<'agreements' | 'negotiations' | 'performance' | 'renewals'>('agreements')

  const commercialAgreements = [
    {
      id: 'CA-001',
      title: 'Acord Marco Serveis Tecnològics',
      partner: 'TechSolutions BCN S.L.',
      type: 'B2B',
      entityType: 'Empresa Col·laboradora',
      value: 750000,
      status: 'active',
      signedDate: '2024-01-15',
      expiryDate: '2026-01-15',
      performance: 95,
      services: ['Desenvolupament software', 'Manteniment sistemes', 'Consultoria IT'],
      kpis: { delivery: 97, quality: 93, cost: 98 },
      risk: 'low'
    },
    {
      id: 'CA-002',
      title: 'Conveni Col·laboració Formativa',
      partner: 'Col·legi Professional Advocats',
      type: 'B2P',
      entityType: 'Associació Professional',
      value: 125000,
      status: 'negotiation',
      signedDate: null,
      expiryDate: '2024-12-31',
      performance: 0,
      services: ['Formació jurídica', 'Assessorament especialitzat', 'Certificacions'],
      kpis: { delivery: 0, quality: 0, cost: 0 },
      risk: 'medium'
    },
    {
      id: 'CA-003',
      title: 'Acord Subcontractació Neteja',
      partner: 'Limpiezas Integrales S.A.',
      type: 'B2B',
      entityType: 'Proveïdor',
      value: 320000,
      status: 'renewal_pending',
      signedDate: '2022-03-01',
      expiryDate: '2024-02-29',
      performance: 87,
      services: ['Neteja oficines', 'Manteniment', 'Subministraments'],
      kpis: { delivery: 89, quality: 85, cost: 87 },
      risk: 'high'
    }
  ]

  const negotiations = [
    {
      id: 'NEG-001',
      title: 'Renovació Acord Tecnològic',
      partner: 'InnovateTech S.L.',
      value: 890000,
      stage: 'contract_review',
      progress: 78,
      startDate: '2024-01-10',
      targetDate: '2024-03-15',
      keyTerms: ['Increment 5% anual', 'SLA 99.5%', 'Escabilitat cloud'],
      nextMilestone: 'Signatura definitiva',
      stakeholders: ['CTO', 'Legal', 'Procurement']
    },
    {
      id: 'NEG-002',
      title: 'Nou Conveni Sindical',
      partner: 'Sindicat Treballadors Públics',
      value: 0,
      stage: 'terms_discussion',
      progress: 45,
      startDate: '2023-11-20',
      targetDate: '2024-06-30',
      keyTerms: ['Millores salarials', 'Flexibilitat horaria', 'Formació'],
      nextMilestone: 'Proposta econòmica',
      stakeholders: ['HR Director', 'Legal', 'Union Reps']
    }
  ]

  const performanceMetrics = [
    {
      partner: 'TechSolutions BCN',
      agreements: 3,
      totalValue: 2150000,
      avgPerformance: 94,
      onTimeDelivery: 97,
      qualityScore: 91,
      costEfficiency: 89,
      riskLevel: 'low'
    },
    {
      partner: 'Consultoria Estratègica',
      agreements: 2,
      totalValue: 680000,
      avgPerformance: 88,
      onTimeDelivery: 85,
      qualityScore: 92,
      costEfficiency: 87,
      riskLevel: 'medium'
    }
  ]

  const upcomingRenewals = [
    {
      id: 'CA-003',
      title: 'Acord Subcontractació Neteja',
      partner: 'Limpiezas Integrales S.A.',
      expiryDate: '2024-02-29',
      daysRemaining: 25,
      value: 320000,
      performance: 87,
      recommendation: 'Renegociar condicions'
    },
    {
      id: 'CA-007',
      title: 'Conveni Formació Contínua',
      partner: 'Universitat Politècnica',
      expiryDate: '2024-04-15',
      daysRemaining: 70,
      value: 450000,
      performance: 96,
      recommendation: 'Renovació automàtica'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      negotiation: 'text-yellow-600 bg-yellow-100',
      renewal_pending: 'text-orange-600 bg-orange-100',
      expired: 'text-red-600 bg-red-100',
      draft: 'text-gray-600 bg-gray-100'
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

  const getEntityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Empresa Col·laboradora': 'text-blue-600 bg-blue-100',
      'Associació Professional': 'text-purple-600 bg-purple-100',
      'Proveïdor': 'text-orange-600 bg-orange-100',
      'Sindicat': 'text-red-600 bg-red-100',
      'Administració Pública': 'text-green-600 bg-green-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Acords Comercials i Col·laboracions</h2>
            <p className="text-gray-600">Gestió d'acords amb empreses, associacions, sindicats i proveïdors</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nou Acord
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
            { id: 'agreements', label: 'Acords Actius', icon: HandshakeIcon },
            { id: 'negotiations', label: 'Negociacions', icon: MessageSquare },
            { id: 'performance', label: 'Rendiment', icon: BarChart3 },
            { id: 'renewals', label: 'Renovacions', icon: RefreshCw }
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

      {/* Active Agreements */}
      {activeTab === 'agreements' && (
        <div className="space-y-4">
          {commercialAgreements.map(agreement => (
            <div key={agreement.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{agreement.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agreement.status)}`}>
                      {agreement.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getEntityTypeColor(agreement.entityType)}`}>
                      {agreement.entityType}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {agreement.partner}
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      €{agreement.value.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {agreement.expiryDate || 'Pendent'}
                    </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Serveis Contractats:</div>
                  <div className="flex flex-wrap gap-2">
                    {agreement.services.map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                
                {agreement.status === 'active' && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">KPIs de Rendiment:</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Entrega:</span>
                        <span className="font-medium">{agreement.kpis.delivery}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Qualitat:</span>
                        <span className="font-medium">{agreement.kpis.quality}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Cost:</span>
                        <span className="font-medium">{agreement.kpis.cost}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Avaluació de Risc:</div>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${getRiskColor(agreement.risk)}`}>
                      {agreement.risk.toUpperCase()}
                    </span>
                    {agreement.status === 'active' && (
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Rendiment Global</div>
                        <div className="text-sm font-bold text-indigo-600">{agreement.performance}%</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Negotiations */}
      {activeTab === 'negotiations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {negotiations.map(negotiation => (
            <div key={negotiation.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{negotiation.title}</h3>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                  {negotiation.stage.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Soci:</span>
                  <span className="font-medium">{negotiation.partner}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Estimat:</span>
                  <span className="font-medium">
                    {negotiation.value > 0 ? `€${negotiation.value.toLocaleString()}` : 'No monetari'}
                  </span>
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
                  <span className="text-gray-600">Data objectiu:</span>
                  <span className="font-medium text-indigo-600">{negotiation.targetDate}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-2">Termes clau:</div>
                  <div className="space-y-1">
                    {negotiation.keyTerms.map((term, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {term}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="text-xs text-gray-600 mb-1">Propera fita:</div>
                  <div className="text-sm font-medium text-orange-600">{negotiation.nextMilestone}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Performance */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">€3.2M</div>
                  <div className="text-sm text-gray-600">Valor Total Acords</div>
                </div>
                <Euro className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">Rendiment Mitjà</div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600">Acords Actius</div>
                </div>
                <HandshakeIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Renovacions Pendents</div>
                </div>
                <RefreshCw className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Rendiment per Soci</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Soci</th>
                    <th className="text-center py-3 px-4">Acords</th>
                    <th className="text-right py-3 px-4">Valor Total</th>
                    <th className="text-center py-3 px-4">Rendiment</th>
                    <th className="text-center py-3 px-4">Entrega</th>
                    <th className="text-center py-3 px-4">Qualitat</th>
                    <th className="text-center py-3 px-4">Risc</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceMetrics.map((metric, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{metric.partner}</td>
                      <td className="py-3 px-4 text-center">{metric.agreements}</td>
                      <td className="py-3 px-4 text-right">€{metric.totalValue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium text-indigo-600">{metric.avgPerformance}%</span>
                      </td>
                      <td className="py-3 px-4 text-center">{metric.onTimeDelivery}%</td>
                      <td className="py-3 px-4 text-center">{metric.qualityScore}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${getRiskColor(metric.riskLevel)}`}>
                          {metric.riskLevel.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Renewals */}
      {activeTab === 'renewals' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Renovacions Properes (6 mesos)</h3>
            <div className="space-y-4">
              {upcomingRenewals.map(renewal => (
                <div key={renewal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{renewal.title}</h4>
                      <p className="text-sm text-gray-600">{renewal.partner}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-600">
                        {renewal.daysRemaining} dies
                      </div>
                      <div className="text-xs text-gray-600">fins venciment</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Venciment:</span>
                      <span className="ml-2 font-medium">{renewal.expiryDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor:</span>
                      <span className="ml-2 font-medium">€{renewal.value.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rendiment:</span>
                      <span className="ml-2 font-medium text-indigo-600">{renewal.performance}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Recomanació:</span>
                      <span className={`ml-2 font-medium ${
                        renewal.recommendation.includes('Renovació') ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {renewal.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}