'use client'

import { useState } from 'react'
import { 
  Scale, FileText, Shield, Users, Building2, Crown, Briefcase,
  UserCheck, ShoppingBag, AlertTriangle, CheckCircle, Clock,
  TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
  Calendar, Bell, Target, Award, Eye, Download, RefreshCw,
  ArrowUp, ArrowDown, ChevronRight, Zap, DollarSign
} from 'lucide-react'

export default function DashboardJuridic() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedEntity, setSelectedEntity] = useState<'all' | string>('all')

  // Estadístiques per entitat
  const entitiesOverview = {
    empleats: {
      name: 'Empleats Públics',
      icon: Users,
      color: 'blue',
      contracts: 892,
      activeContracts: 834,
      pendingRenewals: 58,
      complianceScore: 97.3,
      disputes: 3,
      avgContractValue: 125000,
      riskLevel: 'low',
      keyMetrics: {
        laborCompliance: 98.5,
        collectiveAgreements: 12,
        disciplinaryProceedings: 2,
        dataProtection: 99.1
      }
    },
    empreses: {
      name: 'Empreses Col·laboradores',
      icon: Building2,
      color: 'green',
      contracts: 1247,
      activeContracts: 1156,
      pendingRenewals: 91,
      complianceScore: 95.8,
      disputes: 8,
      avgContractValue: 456000,
      riskLevel: 'medium',
      keyMetrics: {
        slaCompliance: 94.2,
        ndaActive: 234,
        partnerships: 67,
        commercialDisputes: 5
      }
    },
    administracions: {
      name: 'Administracions Públiques',
      icon: Crown,
      color: 'purple',
      contracts: 456,
      activeContracts: 423,
      pendingRenewals: 33,
      complianceScore: 98.9,
      disputes: 2,
      avgContractValue: 890000,
      riskLevel: 'low',
      keyMetrics: {
        publicTenders: 156,
        frameworkAgreements: 23,
        subsidies: 45,
        transparencyCompliance: 99.2
      }
    },
    sindicats: {
      name: 'Sindicats',
      icon: Briefcase,
      color: 'red',
      contracts: 78,
      activeContracts: 75,
      pendingRenewals: 3,
      complianceScore: 96.7,
      disputes: 1,
      avgContractValue: 45000,
      riskLevel: 'low',
      keyMetrics: {
        collectiveAgreements: 15,
        negotiationsActive: 3,
        laborConflicts: 1,
        representationAgreements: 8
      }
    },
    associacions: {
      name: 'Associacions Professionals',
      icon: Award,
      color: 'yellow',
      contracts: 234,
      activeContracts: 218,
      pendingRenewals: 16,
      complianceScore: 94.5,
      disputes: 2,
      avgContractValue: 67000,
      riskLevel: 'low',
      keyMetrics: {
        collaborationAgreements: 89,
        trainingPrograms: 34,
        certificationPrograms: 12,
        jointEvents: 23
      }
    },
    usuaris: {
      name: 'Usuaris Individuals',
      icon: UserCheck,
      color: 'indigo',
      contracts: 15420,
      activeContracts: 14980,
      pendingRenewals: 440,
      complianceScore: 99.2,
      disputes: 12,
      avgContractValue: 1200,
      riskLevel: 'low',
      keyMetrics: {
        termsAcceptance: 99.8,
        privacyConsents: 98.9,
        gdprRequests: 234,
        complaints: 89
      }
    },
    proveidors: {
      name: 'Proveïdors',
      icon: ShoppingBag,
      color: 'orange',
      contracts: 345,
      activeContracts: 312,
      pendingRenewals: 33,
      complianceScore: 93.4,
      disputes: 5,
      avgContractValue: 234000,
      riskLevel: 'medium',
      keyMetrics: {
        supplyAgreements: 234,
        slaCompliance: 91.2,
        penalties: 12,
        warranties: 89
      }
    }
  }

  // Contractes per estat
  const contractsByStatus = {
    draft: 234,
    negotiation: 156,
    pending_signature: 89,
    active: 2891,
    expiring_soon: 234,
    expired: 67,
    terminated: 45,
    disputed: 34
  }

  // Compliance Overview
  const complianceMetrics = {
    gdpr: { score: 98.2, trend: 'up', issues: 3 },
    labor: { score: 97.5, trend: 'stable', issues: 5 },
    commercial: { score: 94.8, trend: 'up', issues: 8 },
    regulatory: { score: 96.3, trend: 'down', issues: 12 },
    contractual: { score: 95.7, trend: 'up', issues: 7 },
    intellectual: { score: 99.1, trend: 'stable', issues: 1 }
  }

  // Recent Activities
  const recentActivities = [
    {
      type: 'contract_signed',
      entity: 'Ajuntament de Barcelona',
      entityType: 'administracions',
      description: 'Conveni marc de col·laboració signat',
      value: 1250000,
      timestamp: '2 hores'
    },
    {
      type: 'dispute_resolved',
      entity: 'TechCorp Solutions SL',
      entityType: 'empreses',
      description: 'Resolució favorable en reclamació SLA',
      value: 67000,
      timestamp: '4 hores'
    },
    {
      type: 'compliance_alert',
      entity: 'GDPR Update',
      entityType: 'regulatory',
      description: 'Nova regulació DPO requereix actualització',
      value: 0,
      timestamp: '6 hores'
    },
    {
      type: 'renewal_pending',
      entity: 'Sindicat UGT',
      entityType: 'sindicats',
      description: 'Conveni col·lectiu pendent renovació',
      value: 45000,
      timestamp: '1 dia'
    }
  ]

  // Risk Matrix
  const riskMatrix = {
    high: [
      { risk: 'Contractes sense renovació automàtica', probability: 75, impact: 85, entities: ['empreses', 'proveidors'] },
      { risk: 'Incompliment GDPR en transferències', probability: 45, impact: 95, entities: ['usuaris', 'empleats'] }
    ],
    medium: [
      { risk: 'Disputes comercials en augment', probability: 60, impact: 60, entities: ['empreses', 'proveidors'] },
      { risk: 'Venciments no notificats', probability: 70, impact: 50, entities: ['all'] }
    ],
    low: [
      { risk: 'Actualitzacions regulatòries menors', probability: 30, impact: 30, entities: ['administracions'] },
      { risk: 'Renovacions de certificacions', probability: 40, impact: 25, entities: ['associacions'] }
    ]
  }

  const getEntityIcon = (entityKey: string) => {
    return entitiesOverview[entityKey as keyof typeof entitiesOverview]?.icon || Users
  }

  const getEntityColor = (entityKey: string) => {
    return entitiesOverview[entityKey as keyof typeof entitiesOverview]?.color || 'gray'
  }

  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'contract_signed': return CheckCircle
      case 'dispute_resolved': return Shield
      case 'compliance_alert': return AlertTriangle
      case 'renewal_pending': return Clock
      default: return Activity
    }
  }

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return ArrowUp
      case 'down': return ArrowDown
      default: return Activity
    }
  }

  const calculateTotalMetric = (metric: string) => {
    return Object.values(entitiesOverview).reduce((sum, entity) => {
      return sum + (entity[metric as keyof typeof entity] as number || 0)
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Jurídic Multi-Entitat</h2>
            <p className="text-gray-600">Vista unificada de totes les relacions legals i compliance</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="week">Aquesta setmana</option>
              <option value="month">Aquest mes</option>
              <option value="quarter">Aquest trimestre</option>
              <option value="year">Aquest any</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {calculateTotalMetric('contracts').toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Contractes</div>
            <div className="text-xs text-blue-600 mt-1">
              +12% vs mes anterior
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">96.7%</div>
            <div className="text-sm text-gray-600">Compliance Global</div>
            <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +1.2% millora
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              {calculateTotalMetric('disputes')}
            </div>
            <div className="text-sm text-gray-600">Disputes Actius</div>
            <div className="text-xs text-gray-600 mt-1">
              87% taxa resolució
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              €{(Object.values(entitiesOverview).reduce((sum, entity) => 
                sum + (entity.contracts * entity.avgContractValue), 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Valor Total Gestionat</div>
            <div className="text-xs text-purple-600 mt-1">
              Across 7 entity types
            </div>
          </div>
        </div>
      </div>

      {/* Entities Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(entitiesOverview).map(([key, entity]) => {
          const Icon = entity.icon
          return (
            <div key={key} className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-${entity.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${entity.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{entity.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(entity.riskLevel)}`}>
                    Risc {entity.riskLevel}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{entity.contracts}</div>
                  <div className="text-xs text-gray-600">contractes</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Actius</div>
                  <div className="font-semibold">{entity.activeContracts}</div>
                </div>
                <div>
                  <div className="text-gray-600">Renovacions</div>
                  <div className="font-semibold text-orange-600">{entity.pendingRenewals}</div>
                </div>
                <div>
                  <div className="text-gray-600">Compliance</div>
                  <div className="font-semibold text-green-600">{entity.complianceScore}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Disputes</div>
                  <div className="font-semibold text-red-600">{entity.disputes}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-600">Valor mitjà contracte</div>
                <div className="text-lg font-bold text-indigo-600">
                  €{entity.avgContractValue.toLocaleString()}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Status Distribution */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Estat dels Contractes
          </h3>
          <div className="space-y-3">
            {Object.entries(contractsByStatus).map(([status, count]) => {
              const colors = {
                draft: 'gray',
                negotiation: 'yellow',
                pending_signature: 'orange',
                active: 'green',
                expiring_soon: 'red',
                expired: 'gray',
                terminated: 'gray',
                disputed: 'red'
              }
              const color = colors[status as keyof typeof colors] || 'gray'
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
                    <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">{count}</div>
                    <div className="text-xs text-gray-500">
                      ({((count / calculateTotalMetric('contracts')) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Compliance per Àrea
          </h3>
          <div className="space-y-3">
            {Object.entries(complianceMetrics).map(([area, metrics]) => {
              const TrendIcon = getTrendIcon(metrics.trend)
              const trendColor = metrics.trend === 'up' ? 'text-green-600' : 
                               metrics.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              
              return (
                <div key={area} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{area}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{metrics.score}%</span>
                        <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metrics.score >= 95 ? 'bg-green-500' :
                          metrics.score >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metrics.score}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {metrics.issues} issues pendents
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Activitat Recent
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => {
              const ActivityIcon = getActivityIcon(activity.type)
              const EntityIcon = activity.entityType !== 'regulatory' 
                ? getEntityIcon(activity.entityType)
                : Bell
              const color = activity.entityType !== 'regulatory'
                ? getEntityColor(activity.entityType)
                : 'gray'
              
              return (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <EntityIcon className={`w-4 h-4 text-${color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ActivityIcon className={`w-4 h-4 ${
                        activity.type === 'contract_signed' ? 'text-green-600' :
                        activity.type === 'dispute_resolved' ? 'text-blue-600' :
                        activity.type === 'compliance_alert' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`} />
                      <span className="text-sm font-medium truncate">{activity.entity}</span>
                    </div>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    {activity.value > 0 && (
                      <p className="text-xs font-semibold text-indigo-600 mt-1">
                        €{activity.value.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {activity.timestamp}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Matriu de Riscos Legals
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(riskMatrix).map(([level, risks]) => (
            <div key={level} className={`p-4 rounded-lg border ${
              level === 'high' ? 'border-red-200 bg-red-50' :
              level === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              <h4 className={`font-medium mb-3 capitalize ${
                level === 'high' ? 'text-red-900' :
                level === 'medium' ? 'text-yellow-900' :
                'text-green-900'
              }`}>
                Risc {level}
              </h4>
              <div className="space-y-2">
                {risks.map((risk, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{risk.risk}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span>Prob: {risk.probability}%</span>
                      <span>Impact: {risk.impact}%</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {risk.entities.map((entity, entityIdx) => {
                        if (entity === 'all') {
                          return <span key={entityIdx} className="text-xs text-gray-600">Totes les entitats</span>
                        }
                        const EntityIcon = getEntityIcon(entity)
                        const color = getEntityColor(entity)
                        return (
                          <div key={entityIdx} className={`w-5 h-5 bg-${color}-100 rounded flex items-center justify-center`}>
                            <EntityIcon className={`w-3 h-3 text-${color}-600`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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