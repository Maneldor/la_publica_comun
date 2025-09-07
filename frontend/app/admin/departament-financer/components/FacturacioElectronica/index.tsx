'use client'

import { useState } from 'react'
import { 
  Zap, FileText, CheckCircle, AlertTriangle, Clock, XCircle,
  Shield, Award, Bot, Crown, Building2, Users, RefreshCw,
  Download, Eye, Edit, Plus, Settings, Filter, Search,
  DollarSign, TrendingUp, BarChart3, Activity, Calendar,
  Mail, Phone, Upload, Globe, Database, Send
} from 'lucide-react'

export default function FacturacioElectronica() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly')
  const [selectedEntity, setSelectedEntity] = useState<'all' | 'empleats' | 'empreses' | 'administracions'>('all')
  const [showSIIDetails, setShowSIIDetails] = useState(false)
  const [complianceFilter, setComplianceFilter] = useState<'all' | 'compliant' | 'warning' | 'error'>('all')

  const facturacioOverview = {
    totalInvoices: 8947,
    electronicPercentage: 98.7,
    siiCompliant: 96.3,
    aeatCompliant: 97.8,
    averageProcessingTime: 2.3,
    automationRate: 94.5,
    totalAmount: 5980000,
    errorRate: 1.3
  }

  const invoices = [
    {
      id: 'FE-2024-001234',
      customer: 'Ajuntament de Barcelona',
      entity: 'administracions',
      amount: 2988,
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      status: 'sent',
      siiStatus: 'compliant',
      aeatStatus: 'accepted',
      format: 'FacturaE',
      taxAmount: 627.48,
      processedAt: '2024-01-15 10:23:45',
      electronicSignature: true,
      deliveryMethod: 'FACe',
      complianceScore: 100
    },
    {
      id: 'FE-2024-001235',
      customer: 'Hospital Vall d\'Hebron',
      entity: 'empleats',
      amount: 1788,
      issueDate: '2024-01-14',
      dueDate: '2024-02-13',
      status: 'processing',
      siiStatus: 'pending',
      aeatStatus: 'processing',
      format: 'UBL',
      taxAmount: 375.48,
      processedAt: '2024-01-14 15:45:32',
      electronicSignature: true,
      deliveryMethod: 'Email',
      complianceScore: 85
    },
    {
      id: 'FE-2024-001236',
      customer: 'Indra Sistemas SA',
      entity: 'empreses',
      amount: 4980,
      issueDate: '2024-01-13',
      dueDate: '2024-02-12',
      status: 'error',
      siiStatus: 'error',
      aeatStatus: 'rejected',
      format: 'FacturaE',
      taxAmount: 1045.8,
      processedAt: '2024-01-13 09:12:15',
      electronicSignature: false,
      deliveryMethod: 'EDI',
      complianceScore: 45,
      errorMessage: 'Invalid VAT number format'
    },
    {
      id: 'FE-2024-001237',
      customer: 'Generalitat de Catalunya',
      entity: 'administracions',
      amount: 7440,
      issueDate: '2024-01-12',
      dueDate: '2024-02-11',
      status: 'delivered',
      siiStatus: 'compliant',
      aeatStatus: 'accepted',
      format: 'FacturaE',
      taxAmount: 1562.4,
      processedAt: '2024-01-12 11:30:20',
      electronicSignature: true,
      deliveryMethod: 'FACe',
      complianceScore: 100
    }
  ]

  const siiMetrics = {
    totalSubmissions: 8947,
    acceptedSubmissions: 8615,
    pendingSubmissions: 201,
    rejectedSubmissions: 131,
    averageResponseTime: '4.2 minutes',
    complianceRate: 96.3,
    lastSubmission: '2024-01-15 16:45:23',
    automatedSubmissions: 8456
  }

  const aeatCompliance = {
    publicSectorRequirements: {
      electronicInvoicing: { required: true, compliance: 99.2, description: 'Obligatòria per sector públic' },
      faceIntegration: { required: true, compliance: 97.8, description: 'Integració amb plataforma FACe' },
      structuredData: { required: true, compliance: 98.5, description: 'Dades estructurades FacturaE' },
      digitalSignature: { required: true, compliance: 96.1, description: 'Signatura electrònica avançada' }
    },
    taxCompliance: {
      ivaCalculation: { compliance: 99.7, description: 'Càlcul automàtic IVA' },
      retentionTax: { compliance: 98.9, description: 'Retencions IRPF' },
      equivalenceSurcharge: { compliance: 97.3, description: 'Recàrrec d\'equivalència' },
      exemptTransactions: { compliance: 99.1, description: 'Operacions exemptes' }
    }
  }

  const automationWorkflow = [
    {
      stage: 'Invoice Generation',
      description: 'Auto-generation from contracts',
      automated: true,
      success: 99.2,
      avgTime: '30 seconds'
    },
    {
      stage: 'Tax Calculation',
      description: 'Automatic tax computation',
      automated: true,
      success: 99.7,
      avgTime: '5 seconds'
    },
    {
      stage: 'Format Conversion',
      description: 'FacturaE/UBL formatting',
      automated: true,
      success: 98.1,
      avgTime: '15 seconds'
    },
    {
      stage: 'Digital Signature',
      description: 'Electronic signature application',
      automated: true,
      success: 96.8,
      avgTime: '45 seconds'
    },
    {
      stage: 'SII Submission',
      description: 'AEAT SII automatic submission',
      automated: true,
      success: 96.3,
      avgTime: '2 minutes'
    },
    {
      stage: 'Delivery',
      description: 'Customer delivery (FACe/Email/EDI)',
      automated: true,
      success: 97.5,
      avgTime: '1 minute'
    }
  ]

  const getEntityColor = (entity: string) => {
    switch(entity) {
      case 'empleats': return 'blue'
      case 'empreses': return 'green'
      case 'administracions': return 'purple'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'text-blue-600 bg-blue-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-orange-600 bg-orange-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplianceColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'text-green-600 bg-green-100'
      case 'accepted': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-orange-600 bg-orange-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Facturació Electrònica</h2>
            <p className="text-gray-600">Obligatòria amb SII automàtic i compliance AEAT per sector públic</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSIIDetails(!showSIIDetails)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showSIIDetails ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Database className="w-4 h-4" />
              SII Status
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Invoices
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Període</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="annual">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entitat</label>
            <select 
              value={selectedEntity} 
              onChange={(e) => setSelectedEntity(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Totes les entitats</option>
              <option value="empleats">Empleats Públics</option>
              <option value="empreses">Empreses</option>
              <option value="administracions">Administracions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance</label>
            <select 
              value={complianceFilter} 
              onChange={(e) => setComplianceFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Tots els estats</option>
              <option value="compliant">Compliant</option>
              <option value="warning">Avisos</option>
              <option value="error">Errors</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Sync SII
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Factures Total</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{facturacioOverview.totalInvoices.toLocaleString()}</div>
          <div className="text-sm text-blue-600">
            {facturacioOverview.electronicPercentage}% electròniques
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">SII Compliance</span>
            <Database className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{facturacioOverview.siiCompliant}%</div>
          <div className="text-sm text-green-600">AEAT integració</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Processing Time</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{facturacioOverview.averageProcessingTime}m</div>
          <div className="text-sm text-purple-600">mitjana</div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Automation</span>
            <Bot className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{facturacioOverview.automationRate}%</div>
          <div className="text-sm text-orange-600">processat automàtic</div>
        </div>
      </div>

      {/* SII Details */}
      {showSIIDetails && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Sistema d'Informació Immediata (SII)</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              AEAT Connected
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{siiMetrics.acceptedSubmissions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Acceptades</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{siiMetrics.pendingSubmissions}</div>
              <div className="text-sm text-gray-600">Pendents</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{siiMetrics.rejectedSubmissions}</div>
              <div className="text-sm text-gray-600">Rebutjades</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{siiMetrics.averageResponseTime}</div>
              <div className="text-sm text-gray-600">Temps resposta</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Última sincronització:</span>
                <span className="font-medium">{siiMetrics.lastSubmission}</span>
              </div>
              <div className="flex justify-between">
                <span>Submissions automàtiques:</span>
                <span className="font-medium text-blue-600">
                  {siiMetrics.automatedSubmissions} ({((siiMetrics.automatedSubmissions / siiMetrics.totalSubmissions) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AEAT Compliance Dashboard */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold">AEAT Compliance Dashboard</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Sector Públic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Public Sector Requirements</h4>
            <div className="space-y-3">
              {Object.entries(aeatCompliance.publicSectorRequirements).map(([key, requirement]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      requirement.compliance >= 95 ? 'bg-green-500' :
                      requirement.compliance >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium">{requirement.description}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    requirement.compliance >= 95 ? 'text-green-600' :
                    requirement.compliance >= 90 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {requirement.compliance}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Tax Compliance</h4>
            <div className="space-y-3">
              {Object.entries(aeatCompliance.taxCompliance).map(([key, compliance]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">{compliance.description}</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {compliance.compliance}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Automation Workflow */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Automated Processing Workflow</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            End-to-End Automation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {automationWorkflow.map((stage, idx) => (
            <div key={idx} className="p-4 border rounded-lg text-center">
              <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                stage.automated ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {stage.automated ? <Bot className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>
              
              <h4 className="font-medium text-sm mb-2">{stage.stage}</h4>
              <p className="text-xs text-gray-600 mb-3">{stage.description}</p>
              
              <div className="space-y-1 text-xs">
                <div className={`font-medium ${
                  stage.success >= 95 ? 'text-green-600' :
                  stage.success >= 90 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stage.success}% èxit
                </div>
                <div className="text-gray-600">{stage.avgTime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold">Electronic Invoices</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {invoices.filter(invoice => 
                (selectedEntity === 'all' || invoice.entity === selectedEntity) &&
                (complianceFilter === 'all' || 
                  (complianceFilter === 'compliant' && invoice.siiStatus === 'compliant') ||
                  (complianceFilter === 'warning' && invoice.complianceScore < 90) ||
                  (complianceFilter === 'error' && invoice.status === 'error')
                )
              ).length} factures
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-center py-3 px-4">SII Status</th>
                <th className="text-center py-3 px-4">AEAT Status</th>
                <th className="text-center py-3 px-4">Compliance</th>
                <th className="text-center py-3 px-4">Delivery</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter(invoice => {
                  if (selectedEntity !== 'all' && invoice.entity !== selectedEntity) return false
                  if (complianceFilter === 'compliant' && invoice.siiStatus !== 'compliant') return false
                  if (complianceFilter === 'warning' && invoice.complianceScore >= 90) return false
                  if (complianceFilter === 'error' && invoice.status !== 'error') return false
                  return true
                })
                .map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{invoice.customer}</div>
                        <div className="text-sm text-gray-600">{invoice.id}</div>
                        <div className="text-xs text-gray-500">{invoice.issueDate}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-semibold">€{invoice.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">IVA: €{invoice.taxAmount.toFixed(2)}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getComplianceColor(invoice.siiStatus)}`}>
                        {invoice.siiStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getComplianceColor(invoice.aeatStatus)}`}>
                        {invoice.aeatStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className={`font-semibold ${getComplianceScoreColor(invoice.complianceScore)}`}>
                        {invoice.complianceScore}%
                      </div>
                      <div className="text-xs text-gray-600">{invoice.format}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="text-sm">{invoice.deliveryMethod}</div>
                      {invoice.electronicSignature && (
                        <Shield className="w-3 h-3 text-green-500 mx-auto mt-1" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded" title="View Invoice">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Download">
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                        {invoice.status === 'error' && (
                          <button className="p-1 hover:bg-gray-200 rounded" title="Retry">
                            <RefreshCw className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                        <button className="p-1 hover:bg-gray-200 rounded" title="Send">
                          <Send className="w-4 h-4 text-green-600" />
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
  )
}