'use client'

import { useState, useEffect } from 'react'
import {
  Crown, Shield, Globe, Zap, Users, BarChart3,
  Settings, Bell, Key, Database, Cloud, Lock,
  FileText, MessageSquare, Calendar, Target,
  Award, Briefcase, TrendingUp, Activity,
  Plus, Edit3, Eye, Save, X, Info,
  CheckCircle, AlertTriangle, Clock, Star,
  Download, Upload, Share2, Link2, Mail,
  Phone, MapPin, Building2, Package, CreditCard
} from 'lucide-react'

interface EnterpriseProfileFeaturesProps {
  empresaId: string
  planEmpresa: 'basic' | 'premium'
}

interface ComplianceStatus {
  gdpr: boolean
  iso27001: boolean
  lopd: boolean
  esquemaNacional: boolean
  lastAudit: string
  nextAudit: string
}

interface APIIntegration {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  lastSync: string
  endpoint: string
  type: 'crm' | 'erp' | 'hr' | 'analytics'
}

interface WhiteLabelConfig {
  enabled: boolean
  customLogo: string
  primaryColor: string
  secondaryColor: string
  customDomain: string
  customEmailFooter: string
}

export default function EnterpriseProfileFeatures({ empresaId, planEmpresa }: EnterpriseProfileFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState('compliance')
  const [isConfiguring, setIsConfiguring] = useState(false)
  
  // Mock data - En producción vendría de APIs
  const [complianceData, setComplianceData] = useState<ComplianceStatus>({
    gdpr: true,
    iso27001: true,
    lopd: true,
    esquemaNacional: false,
    lastAudit: '2024-09-01',
    nextAudit: '2024-12-01'
  })
  
  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([
    {
      id: '1',
      name: 'Salesforce CRM',
      status: 'active',
      lastSync: '2024-11-20T10:30:00Z',
      endpoint: 'https://api.salesforce.com/v1',
      type: 'crm'
    },
    {
      id: '2',
      name: 'SAP ERP',
      status: 'error',
      lastSync: '2024-11-19T15:45:00Z',
      endpoint: 'https://sap.empresa.com/api',
      type: 'erp'
    },
    {
      id: '3',
      name: 'Workday HR',
      status: 'inactive',
      lastSync: '2024-11-15T09:00:00Z',
      endpoint: 'https://workday.com/api/v2',
      type: 'hr'
    }
  ])
  
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>({
    enabled: true,
    customLogo: '/api/placeholder/200/80',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    customDomain: 'portal.techsolutions.cat',
    customEmailFooter: 'TechSolutions Barcelona - Innovación Tecnológica'
  })

  const features = [
    { 
      id: 'compliance', 
      name: 'Compliment Normatiu', 
      icon: Shield,
      description: 'Gestió de certificacions i auditories'
    },
    { 
      id: 'api-integrations', 
      name: 'Integracions API', 
      icon: Database,
      description: 'Connexions amb sistemes empresarials'
    },
    { 
      id: 'white-label', 
      name: 'Marca Blanca', 
      icon: Crown,
      description: 'Personalització completa de la plataforma'
    },
    { 
      id: 'advanced-security', 
      name: 'Seguretat Avançada', 
      icon: Lock,
      description: 'SSO, 2FA i auditoria de seguretat'
    },
    { 
      id: 'analytics', 
      name: 'Analytics Enterprise', 
      icon: BarChart3,
      description: 'Informes avançats i business intelligence'
    },
    { 
      id: 'support', 
      name: 'Suport Premium', 
      icon: MessageSquare,
      description: 'Atenció 24/7 i gestor dedicat'
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-700 bg-green-100 border-green-200'
      case 'error': return 'text-red-700 bg-red-100 border-red-200'
      case 'inactive': return 'text-gray-700 bg-gray-100 border-gray-200'
      default: return 'text-gray-700 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      case 'inactive': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl border border-purple-200/60 p-6">
      {/* Header Enterprise */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Funcionalitats Enterprise
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-full">
                PREMIUM
              </span>
            </h2>
            <p className="text-slate-600">Eines avançades per a la gestió empresarial</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          {isConfiguring ? 'Finalitzar' : 'Configurar'}
        </button>
      </div>

      {/* Feature Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {features.map(feature => {
          const Icon = feature.icon
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeFeature === feature.id
                  ? 'bg-white text-indigo-700 shadow-md border border-indigo-200'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{feature.name}</span>
            </button>
          )
        })}
      </div>

      {/* Feature Content */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-6">
        
        {/* Compliance Management */}
        {activeFeature === 'compliance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Gestió de Compliment Normatiu
              </h3>
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
                95% Compliment
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Status */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Certificacions Actives</h4>
                
                <div className="space-y-3">
                  {[
                    { key: 'gdpr', name: 'GDPR - Protecció de Dades', status: complianceData.gdpr },
                    { key: 'iso27001', name: 'ISO 27001 - Seguretat', status: complianceData.iso27001 },
                    { key: 'lopd', name: 'LOPD - Dades Personals', status: complianceData.lopd },
                    { key: 'esquemaNacional', name: 'Esquema Nacional Seguretat', status: complianceData.esquemaNacional }
                  ].map(cert => (
                    <div key={cert.key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          cert.status ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {cert.status ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <Clock className="w-4 h-4 text-gray-600" />
                          }
                        </div>
                        <span className="text-sm font-medium text-slate-700">{cert.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        cert.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cert.status ? 'Actiu' : 'Pendent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Calendar */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Calendari d'Auditories</h4>
                
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-600">Última Auditoria</span>
                    <span className="text-sm font-medium text-slate-800">
                      {new Date(complianceData.lastAudit).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Propera Auditoria</span>
                    <span className="text-sm font-medium text-orange-700">
                      {new Date(complianceData.nextAudit).toLocaleDateString('ca-ES')}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 mb-1">Preparació Auditoria</h5>
                      <p className="text-sm text-blue-700">
                        Documentació actualitzada automàticament. 
                        Es recomana revisar les polítiques de seguretat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Integrations */}
        {activeFeature === 'api-integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Integracions API Empresarials
              </h3>
              {isConfiguring && (
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Integració
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {apiIntegrations.map(integration => (
                <div key={integration.id} className="p-4 bg-white rounded-xl border border-slate-200/60">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{integration.name}</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{integration.type}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      {integration.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Última sincronització:</span>
                      <span className="font-medium">
                        {new Date(integration.lastSync).toLocaleString('ca-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Endpoint:</span>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                        {integration.endpoint.substring(0, 30)}...
                      </span>
                    </div>
                  </div>

                  {isConfiguring && (
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                      <button className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors">
                        <Settings className="w-4 h-4 inline mr-1" />
                        Configurar
                      </button>
                      <button className="flex-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors">
                        <Activity className="w-4 h-4 inline mr-1" />
                        Test
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* White Label Configuration */}
        {activeFeature === 'white-label' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Crown className="w-5 h-5 text-indigo-600" />
                Configuració Marca Blanca
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Actiu:</span>
                <button
                  onClick={() => setWhiteLabelConfig({...whiteLabelConfig, enabled: !whiteLabelConfig.enabled})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    whiteLabelConfig.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    whiteLabelConfig.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {whiteLabelConfig.enabled && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Configuration */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Configuració Visual</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 block mb-2">Logo Personalitzat</label>
                      <div className="flex items-center gap-4">
                        <img 
                          src={whiteLabelConfig.customLogo} 
                          alt="Custom Logo" 
                          className="w-16 h-8 object-contain bg-slate-100 rounded border"
                        />
                        {isConfiguring && (
                          <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors">
                            <Upload className="w-4 h-4 inline mr-1" />
                            Canviar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600 block mb-2">Color Primari</label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg border border-slate-200"
                            style={{ backgroundColor: whiteLabelConfig.primaryColor }}
                          />
                          <input 
                            type="text" 
                            value={whiteLabelConfig.primaryColor}
                            disabled={!isConfiguring}
                            onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, primaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600 block mb-2">Color Secundari</label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-lg border border-slate-200"
                            style={{ backgroundColor: whiteLabelConfig.secondaryColor }}
                          />
                          <input 
                            type="text" 
                            value={whiteLabelConfig.secondaryColor}
                            disabled={!isConfiguring}
                            onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, secondaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domain and Communication */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700">Domini i Comunicació</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 block mb-2">Domini Personalitzat</label>
                      <input 
                        type="text" 
                        value={whiteLabelConfig.customDomain}
                        disabled={!isConfiguring}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, customDomain: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-600 block mb-2">Peu d'Email</label>
                      <textarea 
                        value={whiteLabelConfig.customEmailFooter}
                        disabled={!isConfiguring}
                        onChange={(e) => setWhiteLabelConfig({...whiteLabelConfig, customEmailFooter: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-700">
                          <p className="font-medium">Domini verificat</p>
                          <p>SSL actiu i DNS configurat correctament</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other features with similar structure... */}
        {activeFeature === 'advanced-security' && (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Seguretat Avançada</h3>
            <p className="text-slate-600">SSO, autenticació de doble factor i auditoria de seguretat</p>
          </div>
        )}

        {activeFeature === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Analytics Enterprise</h3>
            <p className="text-slate-600">Business Intelligence i informes personalitzats</p>
          </div>
        )}

        {activeFeature === 'support' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Suport Premium 24/7</h3>
            <p className="text-slate-600">Gestor dedicat i atenció telefònica prioritària</p>
          </div>
        )}
      </div>
    </div>
  )
}