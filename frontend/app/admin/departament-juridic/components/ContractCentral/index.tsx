'use client'

import { useState } from 'react'
import { 
  FileText, Users, Building2, Crown, Briefcase, UserCheck, ShoppingBag,
  Award, Calendar, Clock, CheckCircle, AlertTriangle, XCircle,
  Eye, Edit, Plus, Download, Upload, Send, RefreshCw, Search,
  Filter, ChevronDown, ChevronRight, Shield, Zap, Bell,
  DollarSign, TrendingUp, Activity, Target, Mail, Phone
} from 'lucide-react'

export default function ContractCentral() {
  const [selectedEntity, setSelectedEntity] = useState<'all' | string>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | string>('all')
  const [selectedType, setSelectedType] = useState<'all' | string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  // Contract templates per tipus d'entitat
  const contractTemplates = {
    empleats: [
      'Contracte laboral indefinit',
      'Contracte temporal',
      'Conveni col·lectiu',
      'Acord de teletreball',
      'Confidencialitat empleat'
    ],
    empreses: [
      'Master Service Agreement (MSA)',
      'Service Level Agreement (SLA)',
      'Non-Disclosure Agreement (NDA)',
      'Partnership Agreement',
      'Contracte de serveis',
      'Joint Venture Agreement'
    ],
    administracions: [
      'Conveni marc',
      'Contracte públic de serveis',
      'Acord de subvenció',
      'Conveni de col·laboració',
      'Contracte de licitació'
    ],
    sindicats: [
      'Conveni col·lectiu sectorial',
      'Acord de negociació',
      'Protocol de vaga',
      'Acord de representació'
    ],
    associacions: [
      'Conveni de col·laboració',
      'Acord de formació',
      'Conveni de certificació',
      'Acord d\'esdeveniments'
    ],
    usuaris: [
      'Termes i condicions',
      'Política de privacitat',
      'Acord de llicència',
      'Consentiment GDPR'
    ],
    proveidors: [
      'Contracte de subministrament',
      'Acord de distribució',
      'Contracte de manteniment',
      'Garantia i servei'
    ]
  }

  // Sample contracts data
  const contracts = [
    {
      id: 'CTR-2024-001234',
      title: 'Conveni Marc de Col·laboració',
      entity: 'Ajuntament de Barcelona',
      entityType: 'administracions',
      type: 'Conveni marc',
      status: 'active',
      value: 1250000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      renewalType: 'automatic',
      complianceScore: 98,
      lastModified: '2024-01-15',
      owner: 'Maria García',
      department: 'Legal Public Sector',
      alerts: 0,
      documents: 12,
      versions: 3,
      signatures: 4,
      clauses: {
        total: 45,
        standard: 38,
        custom: 7,
        risky: 1
      }
    },
    {
      id: 'CTR-2024-001235',
      title: 'Master Service Agreement',
      entity: 'TechCorp Solutions SL',
      entityType: 'empreses',
      type: 'MSA',
      status: 'negotiation',
      value: 456000,
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      renewalType: 'manual',
      complianceScore: 94,
      lastModified: '2024-01-14',
      owner: 'Joan Martínez',
      department: 'Commercial Legal',
      alerts: 2,
      documents: 8,
      versions: 5,
      signatures: 0,
      clauses: {
        total: 52,
        standard: 45,
        custom: 7,
        risky: 2
      }
    },
    {
      id: 'CTR-2024-001236',
      title: 'Conveni Col·lectiu 2024',
      entity: 'Sindicat UGT Catalunya',
      entityType: 'sindicats',
      type: 'Conveni col·lectiu',
      status: 'pending_signature',
      value: 0,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      renewalType: 'negotiation',
      complianceScore: 97,
      lastModified: '2024-01-13',
      owner: 'Anna Puig',
      department: 'Labor Relations',
      alerts: 1,
      documents: 15,
      versions: 8,
      signatures: 2,
      clauses: {
        total: 78,
        standard: 65,
        custom: 13,
        risky: 0
      }
    },
    {
      id: 'CTR-2024-001237',
      title: 'Contracte de Subministrament',
      entity: 'Logistics Provider SA',
      entityType: 'proveidors',
      type: 'Supply Agreement',
      status: 'expiring_soon',
      value: 234000,
      startDate: '2023-02-15',
      endDate: '2024-02-14',
      renewalType: 'automatic',
      complianceScore: 91,
      lastModified: '2024-01-10',
      owner: 'Pere Sánchez',
      department: 'Procurement Legal',
      alerts: 3,
      documents: 6,
      versions: 2,
      signatures: 2,
      clauses: {
        total: 32,
        standard: 28,
        custom: 4,
        risky: 1
      }
    },
    {
      id: 'CTR-2024-001238',
      title: 'Acord de Formació Professional',
      entity: 'Col·legi Professional d\'Advocats',
      entityType: 'associacions',
      type: 'Training Agreement',
      status: 'active',
      value: 67000,
      startDate: '2023-09-01',
      endDate: '2024-08-31',
      renewalType: 'manual',
      complianceScore: 96,
      lastModified: '2024-01-08',
      owner: 'Laura Fernández',
      department: 'Partnerships',
      alerts: 0,
      documents: 9,
      versions: 2,
      signatures: 3,
      clauses: {
        total: 28,
        standard: 25,
        custom: 3,
        risky: 0
      }
    }
  ]

  const contractStatuses = {
    draft: { color: 'gray', label: 'Esborrany' },
    negotiation: { color: 'yellow', label: 'Negociació' },
    pending_signature: { color: 'orange', label: 'Pendent signatura' },
    active: { color: 'green', label: 'Actiu' },
    expiring_soon: { color: 'red', label: 'Expira aviat' },
    expired: { color: 'gray', label: 'Expirat' },
    terminated: { color: 'gray', label: 'Finalitzat' },
    disputed: { color: 'red', label: 'En disputa' }
  }

  const entityIcons = {
    empleats: Users,
    empreses: Building2,
    administracions: Crown,
    sindicats: Briefcase,
    associacions: Award,
    usuaris: UserCheck,
    proveidors: ShoppingBag
  }

  const entityColors = {
    empleats: 'blue',
    empreses: 'green',
    administracions: 'purple',
    sindicats: 'red',
    associacions: 'yellow',
    usuaris: 'indigo',
    proveidors: 'orange'
  }

  const getStatusColor = (status: string) => {
    return contractStatuses[status as keyof typeof contractStatuses]?.color || 'gray'
  }

  const getStatusLabel = (status: string) => {
    return contractStatuses[status as keyof typeof contractStatuses]?.label || status
  }

  const getEntityIcon = (entityType: string) => {
    return entityIcons[entityType as keyof typeof entityIcons] || FileText
  }

  const getEntityColor = (entityType: string) => {
    return entityColors[entityType as keyof typeof entityColors] || 'gray'
  }

  const getRenewalTypeColor = (type: string) => {
    switch(type) {
      case 'automatic': return 'text-green-600 bg-green-100'
      case 'manual': return 'text-blue-600 bg-blue-100'
      case 'negotiation': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredContracts = contracts.filter(contract => {
    if (selectedEntity !== 'all' && contract.entityType !== selectedEntity) return false
    if (selectedStatus !== 'all' && contract.status !== selectedStatus) return false
    if (selectedType !== 'all' && contract.type !== selectedType) return false
    if (searchTerm && !contract.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contract.entity.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contract Central</h2>
            <p className="text-gray-600">Gestió unificada de contractes multi-entitat</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" />
              Nou Contracte
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar contractes per títol, entitat..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtres
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipus d'Entitat</label>
                <select 
                  value={selectedEntity} 
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Totes les entitats</option>
                  {Object.keys(contractTemplates).map(entity => (
                    <option key={entity} value={entity}>{entity.charAt(0).toUpperCase() + entity.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estat</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Tots els estats</option>
                  {Object.entries(contractStatuses).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipus de Contracte</label>
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Tots els tipus</option>
                  <option value="MSA">MSA</option>
                  <option value="SLA">SLA</option>
                  <option value="NDA">NDA</option>
                  <option value="Conveni marc">Conveni marc</option>
                  <option value="Conveni col·lectiu">Conveni col·lectiu</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Mostrant {filteredContracts.length} de {contracts.length} contractes
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4">Contracte</th>
                <th className="text-left py-3 px-4">Entitat</th>
                <th className="text-center py-3 px-4">Estat</th>
                <th className="text-right py-3 px-4">Valor</th>
                <th className="text-center py-3 px-4">Venciment</th>
                <th className="text-center py-3 px-4">Renovació</th>
                <th className="text-center py-3 px-4">Compliance</th>
                <th className="text-center py-3 px-4">Alertes</th>
                <th className="text-center py-3 px-4">Accions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => {
                const EntityIcon = getEntityIcon(contract.entityType)
                const entityColor = getEntityColor(contract.entityType)
                const statusColor = getStatusColor(contract.status)
                const daysToExpiry = Math.floor((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <tr 
                    key={contract.id} 
                    className={`border-b hover:bg-gray-50 cursor-pointer ${
                      selectedContract === contract.id ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => setSelectedContract(selectedContract === contract.id ? null : contract.id)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-sm text-gray-600">{contract.id}</div>
                        <div className="text-xs text-gray-500">{contract.type}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 bg-${entityColor}-100 rounded-lg flex items-center justify-center`}>
                          <EntityIcon className={`w-4 h-4 text-${entityColor}-600`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{contract.entity}</div>
                          <div className="text-xs text-gray-600 capitalize">{contract.entityType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-700`}>
                        {getStatusLabel(contract.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {contract.value > 0 ? (
                        <div>
                          <div className="font-semibold">€{contract.value.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">anual</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div>
                        <div className={`text-sm font-medium ${
                          daysToExpiry <= 30 ? 'text-red-600' :
                          daysToExpiry <= 90 ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {daysToExpiry > 0 ? `${daysToExpiry} dies` : 'Expirat'}
                        </div>
                        <div className="text-xs text-gray-500">{contract.endDate}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRenewalTypeColor(contract.renewalType)}`}>
                        {contract.renewalType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div>
                        <div className={`text-lg font-bold ${getComplianceColor(contract.complianceScore)}`}>
                          {contract.complianceScore}%
                        </div>
                        <div className="text-xs text-gray-600">
                          {contract.clauses.risky} risky clauses
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {contract.alerts > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Bell className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">{contract.alerts}</span>
                        </div>
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1 hover:bg-gray-200 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Download className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Contract Details Panel */}
        {selectedContract && (
          <div className="border-t bg-indigo-50 p-6">
            {(() => {
              const contract = contracts.find(c => c.id === selectedContract)
              if (!contract) return null
              
              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Detalls del Contracte</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Propietari:</span>
                        <span className="font-medium">{contract.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departament:</span>
                        <span className="font-medium">{contract.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última modificació:</span>
                        <span className="font-medium">{contract.lastModified}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inici:</span>
                        <span className="font-medium">{contract.startDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Documents i Versions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Documents:</span>
                        <span className="font-medium">{contract.documents} arxius</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Versions:</span>
                        <span className="font-medium">{contract.versions} revisions</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signatures:</span>
                        <span className="font-medium">{contract.signatures} de 4</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Anàlisi de Clàusules</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total clàusules:</span>
                        <span className="font-medium">{contract.clauses.total}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estàndard:</span>
                        <span className="font-medium text-green-600">{contract.clauses.standard}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Personalitzades:</span>
                        <span className="font-medium text-blue-600">{contract.clauses.custom}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Risc alt:</span>
                        <span className="font-medium text-red-600">{contract.clauses.risky}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Template Library */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Biblioteca de Plantilles per Entitat
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(contractTemplates).slice(0, 4).map(([entity, templates]) => {
            const Icon = getEntityIcon(entity)
            const color = getEntityColor(entity)
            
            return (
              <div key={entity} className="border rounded-lg p-4">
                <div className={`flex items-center gap-2 mb-3 text-${color}-600`}>
                  <Icon className="w-5 h-5" />
                  <h4 className="font-medium capitalize">{entity}</h4>
                </div>
                <div className="space-y-2">
                  {templates.slice(0, 3).map((template, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left text-sm px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                  {templates.length > 3 && (
                    <button className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      +{templates.length - 3} més...
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  )
}