'use client'

import { useState } from 'react'
import { 
  Shield, Copyright, Lightbulb, FileText, Calendar, AlertTriangle,
  CheckCircle, TrendingUp, Euro, Search, Globe, Award, Lock,
  Plus, Edit, Eye, Download, Filter, RefreshCw, Clock
} from 'lucide-react'

export default function IntellectualProperty() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'trademarks' | 'patents' | 'monitoring'>('portfolio')

  const ipPortfolio = [
    {
      id: 'IP-001',
      title: 'La Pública - Marca Registrada',
      type: 'trademark',
      jurisdiction: 'España',
      status: 'active',
      registrationDate: '2023-03-15',
      expiryDate: '2033-03-15',
      classes: ['42 - Serveis tecnològics', '35 - Publicitat i negocis'],
      value: 85000,
      renewalDue: '2033-03-15',
      protectionLevel: 'high',
      riskLevel: 'low'
    },
    {
      id: 'IP-002',
      title: 'Sistema Multi-comunitari - Patent',
      type: 'patent',
      jurisdiction: 'UE',
      status: 'pending',
      registrationDate: null,
      expiryDate: null,
      classes: ['G06F - Processament de dades'],
      value: 250000,
      renewalDue: null,
      protectionLevel: 'pending',
      riskLevel: 'medium'
    },
    {
      id: 'IP-003',
      title: 'Codi Font Plataforma',
      type: 'copyright',
      jurisdiction: 'Internacional',
      status: 'active',
      registrationDate: '2023-01-10',
      expiryDate: '2095-01-10',
      classes: ['Software i aplicacions'],
      value: 150000,
      renewalDue: 'N/A',
      protectionLevel: 'high',
      riskLevel: 'low'
    },
    {
      id: 'IP-004',
      title: 'Design Interface Usuari',
      type: 'design',
      jurisdiction: 'UE',
      status: 'active',
      registrationDate: '2023-07-20',
      expiryDate: '2028-07-20',
      classes: ['14-02 - Interfícies gràfiques'],
      value: 45000,
      renewalDue: '2028-07-20',
      protectionLevel: 'medium',
      riskLevel: 'low'
    }
  ]

  const trademarkWatch = [
    {
      id: 'TW-001',
      similarMark: 'La Publica Social',
      applicant: 'Empresa desconeguda',
      jurisdiction: 'España',
      applicationDate: '2024-01-15',
      classes: ['35', '42'],
      similarityScore: 78,
      riskLevel: 'high',
      status: 'monitoring',
      actionRequired: 'Oposició recomanada'
    },
    {
      id: 'TW-002',
      similarMark: 'PublicNet',
      applicant: 'TechCorp S.A.',
      jurisdiction: 'França',
      applicationDate: '2024-01-08',
      classes: ['42'],
      similarityScore: 45,
      riskLevel: 'low',
      status: 'watching',
      actionRequired: 'Continuar monitoreig'
    }
  ]

  const patentApplications = [
    {
      id: 'PA-001',
      title: 'Sistema Autenticació Multi-entitat',
      inventors: ['Dr. Joan Martín', 'Dra. Anna Torres'],
      applicationDate: '2024-01-20',
      publicationDate: null,
      status: 'examination',
      examiner: 'Patent Office - Secció 2100',
      estimatedDecision: '2024-08-15',
      costs: 15000,
      nextDeadline: 'Resposta examinador',
      deadlineDate: '2024-03-20'
    }
  ]

  const ipMonitoring = [
    {
      category: 'Infracció Marca',
      description: 'Ús no autoritzat de "La Pública" en xarxes socials',
      detected: '2024-01-25',
      platform: 'Twitter/X',
      severity: 'medium',
      status: 'investigating',
      action: 'Carta de cesament enviada'
    },
    {
      category: 'Còpia Funcionalitat',
      description: 'Plataforma competidora utilitza característiques similars',
      detected: '2024-01-18',
      platform: 'Web externa',
      severity: 'high',
      status: 'legal_review',
      action: 'Anàlisi legal en curs'
    }
  ]

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      trademark: 'text-blue-600 bg-blue-100',
      patent: 'text-green-600 bg-green-100',
      copyright: 'text-purple-600 bg-purple-100',
      design: 'text-orange-600 bg-orange-100',
      trade_secret: 'text-red-600 bg-red-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      expired: 'text-red-600 bg-red-100',
      abandoned: 'text-gray-600 bg-gray-100',
      examination: 'text-blue-600 bg-blue-100',
      monitoring: 'text-orange-600 bg-orange-100',
      watching: 'text-blue-600 bg-blue-100',
      investigating: 'text-yellow-600 bg-yellow-100',
      legal_review: 'text-red-600 bg-red-100'
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

  const getProtectionLevelColor = (level: string) => {
    switch(level) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      case 'pending': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Propietat Intel·lectual</h2>
            <p className="text-gray-600">Gestió de patents, marques, drets d'autor i dissenys</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nova Sol·licitud
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              Informe IP
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">28</div>
                <div className="text-sm text-gray-600">Actius IP Totals</div>
              </div>
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">Marques Actives</div>
              </div>
              <Copyright className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Patents</div>
              </div>
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">€530K</div>
                <div className="text-sm text-gray-600">Valor Portfolio</div>
              </div>
              <Euro className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'portfolio', label: 'Portfolio IP', icon: Shield },
            { id: 'trademarks', label: 'Vigilància Marques', icon: Copyright },
            { id: 'patents', label: 'Patents i Sol·licituds', icon: Lightbulb },
            { id: 'monitoring', label: 'Monitoreig Infraccions', icon: AlertTriangle }
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

      {/* IP Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Portfolio de Propietat Intel·lectual</h3>
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
              {ipPortfolio.map(asset => (
                <div key={asset.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{asset.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(asset.type)}`}>
                          {asset.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {asset.jurisdiction}
                        </div>
                        {asset.registrationDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {asset.registrationDate}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          €{asset.value.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Classes: {Array.isArray(asset.classes) ? asset.classes.join(', ') : asset.classes}
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
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Venciment:</span>
                      <span className="ml-2 font-medium">
                        {asset.expiryDate || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Renovació:</span>
                      <span className="ml-2 font-medium">
                        {asset.renewalDue === 'N/A' ? 'N/A' : asset.renewalDue}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Protecció:</span>
                      <span className={`ml-2 font-medium ${getProtectionLevelColor(asset.protectionLevel)}`}>
                        {asset.protectionLevel.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risc:</span>
                      <span className={`ml-2 font-medium ${getRiskColor(asset.riskLevel)}`}>
                        {asset.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trademark Watch */}
      {activeTab === 'trademarks' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Vigilància de Marques</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Marca Similar</th>
                  <th className="text-left py-3 px-4">Sol·licitant</th>
                  <th className="text-center py-3 px-4">Jurisdicció</th>
                  <th className="text-center py-3 px-4">Classes</th>
                  <th className="text-center py-3 px-4">Similaritat</th>
                  <th className="text-center py-3 px-4">Risc</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Acció Recomanada</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {trademarkWatch.map(watch => (
                  <tr key={watch.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{watch.similarMark}</td>
                    <td className="py-3 px-4">{watch.applicant}</td>
                    <td className="py-3 px-4 text-center">{watch.jurisdiction}</td>
                    <td className="py-3 px-4 text-center">{watch.classes.join(', ')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        watch.similarityScore >= 70 ? 'text-red-600' :
                        watch.similarityScore >= 50 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {watch.similarityScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getRiskColor(watch.riskLevel)}`}>
                        {watch.riskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(watch.status)}`}>
                        {watch.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{watch.actionRequired}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <AlertTriangle className="w-4 h-4" />
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

      {/* Patents */}
      {activeTab === 'patents' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {patentApplications.map(patent => (
            <div key={patent.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{patent.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patent.status)}`}>
                  {patent.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Inventors:</span>
                  <span className="ml-2 font-medium">{patent.inventors.join(', ')}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sol·licitud:</span>
                  <span className="font-medium">{patent.applicationDate}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Examinador:</span>
                  <span className="font-medium">{patent.examiner}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Decisió estimada:</span>
                  <span className="font-medium text-indigo-600">{patent.estimatedDecision}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costos:</span>
                  <span className="font-medium">€{patent.costs.toLocaleString()}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600">Propera fita:</div>
                      <div className="text-sm font-medium text-orange-600">{patent.nextDeadline}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600">Data límit:</div>
                      <div className="text-sm font-medium">{patent.deadlineDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Monitoreig d'Infraccions</h3>
            <div className="space-y-4">
              {ipMonitoring.map((monitoring, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{monitoring.category}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(monitoring.status)}`}>
                          {monitoring.status.replace('_', ' ')}
                        </span>
                        <span className={`font-medium ${
                          monitoring.severity === 'high' ? 'text-red-600' :
                          monitoring.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {monitoring.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{monitoring.description}</p>
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Detectat:</span>
                      <span className="ml-2 font-medium">{monitoring.detected}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Plataforma:</span>
                      <span className="ml-2 font-medium">{monitoring.platform}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Acció:</span>
                      <span className="ml-2 font-medium text-indigo-600">{monitoring.action}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Severitat:</span>
                      <span className={`ml-2 font-medium ${
                        monitoring.severity === 'high' ? 'text-red-600' :
                        monitoring.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {monitoring.severity.toUpperCase()}
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