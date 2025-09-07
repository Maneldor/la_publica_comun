'use client'

import { useState } from 'react'
import { 
  User, Shield, FileText, Calendar, AlertTriangle, CheckCircle,
  Clock, Eye, Search, Filter, Download, Settings, Lock,
  UserCheck, Users, Database, Mail, Phone, Globe, Trash2
} from 'lucide-react'

export default function UserLegalManagement() {
  const [activeTab, setActiveTab] = useState<'gdpr' | 'consents' | 'requests' | 'privacy'>('gdpr')

  const userGDPRStatus = [
    {
      id: 'USR-001',
      name: 'Maria González',
      email: 'maria.gonzalez@lapublica.cat',
      userType: 'Empleat Públic',
      registrationDate: '2023-05-15',
      lastActivity: '2024-01-28',
      gdprCompliance: 98,
      consentsGiven: 8,
      dataCategories: ['Personal', 'Professional', 'Communications', 'Analytics'],
      status: 'active',
      riskLevel: 'low'
    },
    {
      id: 'USR-002',
      name: 'Joan Martín',
      email: 'joan.martin@empresa.com',
      userType: 'Empresa Col·laboradora',
      registrationDate: '2023-08-22',
      lastActivity: '2024-01-25',
      gdprCompliance: 85,
      consentsGiven: 5,
      dataCategories: ['Personal', 'Business', 'Communications'],
      status: 'pending_review',
      riskLevel: 'medium'
    },
    {
      id: 'USR-003',
      name: 'Anna Pérez',
      email: 'anna.perez@sindicat.org',
      userType: 'Sindicat',
      registrationDate: '2023-11-10',
      lastActivity: '2024-01-20',
      gdprCompliance: 92,
      consentsGiven: 6,
      dataCategories: ['Personal', 'Union', 'Communications'],
      status: 'active',
      riskLevel: 'low'
    }
  ]

  const consentManagement = [
    {
      category: 'Dades Personals Bàsiques',
      description: 'Nom, cognoms, email, telèfon',
      totalUsers: 2847,
      consentsGiven: 2847,
      percentage: 100,
      status: 'compliant',
      lastUpdated: '2024-01-15'
    },
    {
      category: 'Comunicacions de Màrqueting',
      description: 'Newsletter, promocions, esdeveniments',
      totalUsers: 2847,
      consentsGiven: 1892,
      percentage: 66,
      status: 'active',
      lastUpdated: '2024-01-20'
    },
    {
      category: 'Analytics i Millores',
      description: 'Tracking d\'ús, millores de servei',
      totalUsers: 2847,
      consentsGiven: 2234,
      percentage: 78,
      status: 'active',
      lastUpdated: '2024-01-22'
    },
    {
      category: 'Compartició amb Tercers',
      description: 'Partners estratègics, col·laboradors',
      totalUsers: 2847,
      consentsGiven: 456,
      percentage: 16,
      status: 'low_adoption',
      lastUpdated: '2024-01-18'
    }
  ]

  const dataRequests = [
    {
      id: 'REQ-001',
      type: 'Data Export',
      requestor: 'Maria González',
      email: 'maria.gonzalez@lapublica.cat',
      requestDate: '2024-01-25',
      status: 'processing',
      dueDate: '2024-02-25',
      complexity: 'standard',
      dataCategories: ['Personal', 'Activity', 'Communications']
    },
    {
      id: 'REQ-002',
      type: 'Data Deletion',
      requestor: 'Carlos Ruiz',
      email: 'carlos.ruiz@deleted.com',
      requestDate: '2024-01-20',
      status: 'completed',
      dueDate: '2024-02-20',
      complexity: 'complex',
      dataCategories: ['All Categories']
    },
    {
      id: 'REQ-003',
      type: 'Data Rectification',
      requestor: 'Laura Torres',
      email: 'laura.torres@lapublica.cat',
      requestDate: '2024-01-28',
      status: 'pending',
      dueDate: '2024-02-28',
      complexity: 'simple',
      dataCategories: ['Personal']
    }
  ]

  const privacyMetrics = [
    {
      metric: 'Compliance General GDPR',
      value: 94,
      change: +2,
      status: 'excellent'
    },
    {
      metric: 'Temps Resposta Mitjà',
      value: 18,
      unit: 'dies',
      change: -3,
      status: 'good'
    },
    {
      metric: 'Sol·licituds Pendents',
      value: 12,
      change: +4,
      status: 'attention'
    },
    {
      metric: 'Incidents Privacitat',
      value: 2,
      change: 0,
      status: 'good'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      pending_review: 'text-yellow-600 bg-yellow-100',
      suspended: 'text-red-600 bg-red-100',
      processing: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      pending: 'text-orange-600 bg-orange-100',
      compliant: 'text-green-600 bg-green-100',
      low_adoption: 'text-orange-600 bg-orange-100'
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

  const getUserTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Empleat Públic': 'text-blue-600 bg-blue-100',
      'Empresa Col·laboradora': 'text-purple-600 bg-purple-100',
      'Sindicat': 'text-red-600 bg-red-100',
      'Associació Professional': 'text-orange-600 bg-orange-100',
      'Usuari Individual': 'text-green-600 bg-green-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const getMetricStatusColor = (status: string) => {
    switch(status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'attention': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestió Legal d'Usuaris</h2>
            <p className="text-gray-600">GDPR, privacitat i gestió de consentiments</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Export GDPR
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Settings className="w-4 h-4" />
              Configuració
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'gdpr', label: 'Status GDPR', icon: Shield },
            { id: 'consents', label: 'Consentiments', icon: UserCheck },
            { id: 'requests', label: 'Sol·licituds', icon: FileText },
            { id: 'privacy', label: 'Mètriques Privacitat', icon: Lock }
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

      {/* GDPR Status */}
      {activeTab === 'gdpr' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Status de Compliance GDPR per Usuari</h3>
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
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4">Usuari</th>
                    <th className="text-left py-3 px-4">Tipus</th>
                    <th className="text-center py-3 px-4">Compliance</th>
                    <th className="text-center py-3 px-4">Consentiments</th>
                    <th className="text-center py-3 px-4">Categories Dades</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Risc</th>
                    <th className="text-center py-3 px-4">Accions</th>
                  </tr>
                </thead>
                <tbody>
                  {userGDPRStatus.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getUserTypeColor(user.userType)}`}>
                          {user.userType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="text-sm font-bold text-indigo-600">{user.gdprCompliance}%</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium">{user.consentsGiven}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium">{user.dataCategories.length}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-medium ${getRiskColor(user.riskLevel)}`}>
                          {user.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Consents */}
      {activeTab === 'consents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">Consents Essencials</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-600">Analytics</div>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">66%</div>
                  <div className="text-sm text-gray-600">Màrqueting</div>
                </div>
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">16%</div>
                  <div className="text-sm text-gray-600">Tercers</div>
                </div>
                <Globe className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Gestió de Consentiments per Categoria</h3>
            </div>
            <div className="divide-y">
              {consentManagement.map((consent, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{consent.category}</h4>
                      <p className="text-sm text-gray-600">{consent.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(consent.status)}`}>
                      {consent.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Total usuaris:</span>
                      <span className="ml-2 font-medium">{consent.totalUsers}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Consents donats:</span>
                      <span className="ml-2 font-medium text-green-600">{consent.consentsGiven}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Percentatge:</span>
                      <span className="ml-2 font-medium">{consent.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Actualitzat:</span>
                      <span className="ml-2 font-medium">{consent.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        consent.percentage >= 90 ? 'bg-green-600' :
                        consent.percentage >= 70 ? 'bg-blue-600' :
                        consent.percentage >= 50 ? 'bg-orange-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${consent.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Sol·licituds de Drets d'Usuari</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Tipus</th>
                  <th className="text-left py-3 px-4">Sol·licitant</th>
                  <th className="text-center py-3 px-4">Data</th>
                  <th className="text-center py-3 px-4">Venciment</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Complexitat</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {dataRequests.map(request => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{request.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {request.type === 'Data Export' && <Download className="w-4 h-4 text-blue-600" />}
                        {request.type === 'Data Deletion' && <Trash2 className="w-4 h-4 text-red-600" />}
                        {request.type === 'Data Rectification' && <FileText className="w-4 h-4 text-orange-600" />}
                        <span className="text-sm">{request.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{request.requestor}</div>
                        <div className="text-sm text-gray-600">{request.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{request.requestDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`${
                        new Date(request.dueDate) < new Date(Date.now() + 7*24*60*60*1000) 
                          ? 'text-red-600 font-medium' : 'text-gray-600'
                      }`}>
                        {request.dueDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.complexity === 'simple' ? 'text-green-600 bg-green-100' :
                        request.complexity === 'standard' ? 'text-blue-600 bg-blue-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {request.complexity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Mail className="w-4 h-4" />
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

      {/* Privacy Metrics */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {privacyMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600">{metric.metric}</div>
                  {metric.change !== 0 && (
                    <div className={`text-xs ${metric.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                    </div>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                    {metric.value}
                  </div>
                  {metric.unit && (
                    <div className="text-sm text-gray-600 mb-1">{metric.unit}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Distribució de Sol·licituds per Tipus</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Export de dades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eliminació de dades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rectificació de dades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Temps de Resolució Mitjà</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sol·licituds simples</span>
                  <span className="text-sm font-medium text-green-600">5 dies</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sol·licituds estàndard</span>
                  <span className="text-sm font-medium text-blue-600">18 dies</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sol·licituds complexes</span>
                  <span className="text-sm font-medium text-orange-600">28 dies</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mitjana general</span>
                    <span className="text-sm font-bold text-indigo-600">18 dies</span>
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