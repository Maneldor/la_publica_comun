'use client'

import { useState } from 'react'
import { 
  FileText, Zap, Template, Settings, Download, Upload,
  Play, Pause, CheckCircle, Clock, AlertTriangle, Copy,
  Plus, Edit, Eye, Search, Filter, RefreshCw
} from 'lucide-react'

export default function DocumentAutomation() {
  const [activeTab, setActiveTab] = useState<'templates' | 'generation' | 'workflows' | 'library'>('templates')

  const documentTemplates = [
    {
      id: 'TMPL-001',
      name: 'Contracte Col·laboració Empresarial',
      category: 'Contractes',
      entityTypes: ['Empresa Col·laboradora'],
      language: 'Català/Castellà',
      version: '2.3',
      status: 'active',
      usage: 45,
      lastUpdated: '2024-01-15',
      automation: 'high',
      fields: 28,
      approvals: ['Legal', 'Procurement']
    },
    {
      id: 'TMPL-002', 
      name: 'Acord Sindical Base',
      category: 'Laborals',
      entityTypes: ['Sindicat'],
      language: 'Català/Castellà',
      version: '1.8',
      status: 'active',
      usage: 12,
      lastUpdated: '2024-01-20',
      automation: 'medium',
      fields: 18,
      approvals: ['Legal', 'HR']
    },
    {
      id: 'TMPL-003',
      name: 'Consentiment GDPR Usuaris',
      category: 'GDPR',
      entityTypes: ['Usuari Individual'],
      language: 'Multiidioma',
      version: '3.1',
      status: 'active',
      usage: 892,
      lastUpdated: '2024-01-10',
      automation: 'high',
      fields: 12,
      approvals: ['DPO']
    }
  ]

  const generationQueue = [
    {
      id: 'GEN-001',
      template: 'Contracte Col·laboració Empresarial',
      entity: 'TechSolutions BCN S.L.',
      requestedBy: 'Maria González',
      status: 'generating',
      progress: 65,
      startTime: '2024-01-30 14:30',
      estimatedCompletion: '2024-01-30 14:45',
      priority: 'high'
    },
    {
      id: 'GEN-002',
      template: 'Acord Confidencialitat',
      entity: 'Consultoria Legal S.A.',
      requestedBy: 'Pere Martín',
      status: 'pending_review',
      progress: 100,
      startTime: '2024-01-30 13:15',
      estimatedCompletion: '2024-01-30 13:25',
      priority: 'medium'
    },
    {
      id: 'GEN-003',
      template: 'Consentiment GDPR',
      entity: 'Batch Generation (150 usuaris)',
      requestedBy: 'Anna Torres',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-30 12:00',
      estimatedCompletion: '2024-01-30 12:45',
      priority: 'low'
    }
  ]

  const automationWorkflows = [
    {
      id: 'WF-001',
      name: 'Onboarding Empresa Col·laboradora',
      trigger: 'Nova empresa aprovada',
      steps: [
        'Generar contracte base',
        'Enviar per revisió legal',
        'Notificar a Procurement',
        'Programar signatura digital'
      ],
      status: 'active',
      executions: 23,
      successRate: 96
    },
    {
      id: 'WF-002',
      name: 'Renovació Contractes',
      trigger: '60 dies abans venciment',
      steps: [
        'Avaluar rendiment',
        'Generar proposta renovació',
        'Enviar notificació parts',
        'Programar reunió negociació'
      ],
      status: 'active',
      executions: 8,
      successRate: 100
    }
  ]

  const documentLibrary = [
    {
      id: 'DOC-001',
      name: 'Contracte_TechSolutions_2024.pdf',
      template: 'Contracte Col·laboració',
      entity: 'TechSolutions BCN S.L.',
      generatedDate: '2024-01-28',
      status: 'signed',
      version: 'v1.0',
      size: '2.4 MB'
    },
    {
      id: 'DOC-002',
      name: 'Acord_Sindical_UGT_2024.pdf', 
      template: 'Acord Sindical Base',
      entity: 'UGT Catalunya',
      generatedDate: '2024-01-25',
      status: 'pending_signature',
      version: 'v2.1',
      size: '1.8 MB'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      generating: 'text-blue-600 bg-blue-100',
      pending_review: 'text-yellow-600 bg-yellow-100',
      completed: 'text-green-600 bg-green-100',
      error: 'text-red-600 bg-red-100',
      signed: 'text-green-600 bg-green-100',
      pending_signature: 'text-orange-600 bg-orange-100',
      draft: 'text-gray-600 bg-gray-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getAutomationColor = (level: string) => {
    switch(level) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Automatització de Documents</h2>
            <p className="text-gray-600">Generació automàtica i gestió de documents legals</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              Nova Plantilla
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Zap className="w-4 h-4" />
              Generar Document
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">24</div>
                <div className="text-sm text-gray-600">Plantilles Actives</div>
              </div>
              <Template className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Documents Generats</div>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Workflows Actius</div>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">97%</div>
                <div className="text-sm text-gray-600">Taxa Automatització</div>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'templates', label: 'Plantilles', icon: Template },
            { id: 'generation', label: 'Generació', icon: Zap },
            { id: 'workflows', label: 'Workflows', icon: Settings },
            { id: 'library', label: 'Biblioteca', icon: FileText }
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

      {/* Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Plantilles de Documents</h3>
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
              {documentTemplates.map(template => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(template.status)}`}>
                          {template.status}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                          {template.category}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        v{template.version} | {template.language} | {template.entityTypes.join(', ')}
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
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ús:</span>
                      <span className="ml-2 font-medium">{template.usage} vegades</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Camps:</span>
                      <span className="ml-2 font-medium">{template.fields}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Automatització:</span>
                      <span className={`ml-2 font-medium ${getAutomationColor(template.automation)}`}>
                        {template.automation.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Actualitzat:</span>
                      <span className="ml-2 font-medium">{template.lastUpdated}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Aprovacions:</span>
                      <span className="ml-2 font-medium">{template.approvals.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generation Queue */}
      {activeTab === 'generation' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Cua de Generació de Documents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Plantilla</th>
                  <th className="text-left py-3 px-4">Entitat</th>
                  <th className="text-left py-3 px-4">Sol·licitant</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Progrés</th>
                  <th className="text-center py-3 px-4">Prioritat</th>
                  <th className="text-center py-3 px-4">Estimat</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {generationQueue.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{item.template}</td>
                    <td className="py-3 px-4">{item.entity}</td>
                    <td className="py-3 px-4">{item.requestedBy}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{item.estimatedCompletion.split(' ')[1]}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        {item.status === 'generating' ? (
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
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

      {/* Workflows */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {automationWorkflows.map(workflow => (
            <div key={workflow.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{workflow.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                  {workflow.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Trigger:</span>
                  <span className="ml-2 font-medium text-indigo-600">{workflow.trigger}</span>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Passos del workflow:</div>
                  <div className="space-y-1">
                    {workflow.steps.map((step, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">
                          {idx + 1}
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-3 border-t">
                  <div>
                    <span className="text-gray-600">Execucions:</span>
                    <span className="ml-2 font-medium">{workflow.executions}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Taxa èxit:</span>
                    <span className="ml-2 font-medium text-green-600">{workflow.successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Library */}
      {activeTab === 'library' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Biblioteca de Documents</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-sm">
                  <Upload className="w-4 h-4" />
                  Pujar
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
                  <th className="text-left py-3 px-4">Document</th>
                  <th className="text-left py-3 px-4">Plantilla</th>
                  <th className="text-left py-3 px-4">Entitat</th>
                  <th className="text-center py-3 px-4">Data</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Mida</th>
                  <th className="text-center py-3 px-4">Accions</th>
                </tr>
              </thead>
              <tbody>
                {documentLibrary.map(doc => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{doc.template}</td>
                    <td className="py-3 px-4">{doc.entity}</td>
                    <td className="py-3 px-4 text-center">{doc.generatedDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{doc.size}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Download className="w-4 h-4" />
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
    </div>
  )
}