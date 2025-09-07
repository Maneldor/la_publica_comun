'use client'

import { useState } from 'react'
import { 
  Building2, TrendingUp, Wrench, Clock, Euro, Package, AlertCircle, Activity,
  Shield, HardDrive, Server, GitBranch, Bot, FileCode, ChevronUp, ChevronDown
} from 'lucide-react'

interface ServiceRequest {
  id: string
  empresa: string
  tipo: 'mantenimiento' | 'desarrollo' | 'diseño' | 'ia' | 'emergencia'
  descripcion: string
  estado: 'pendiente' | 'analizando' | 'en_proceso' | 'completado' | 'facturado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  asignadoA: 'IA' | 'Equipo' | 'Mixto'
  iaAnalisis?: {
    confianza: number
  }
}

interface IAAgent {
  id: string
  nombre: string
  tipo: 'mantenimiento' | 'desarrollo' | 'soporte' | 'analisis'
  estado: 'activo' | 'ocupado' | 'inactivo'
  tareasCompletadas: number
  tasaExito: number
}

interface DashboardProps {
  serviceRequests: ServiceRequest[]
  iaAgents: IAAgent[]
  expandedCards: Set<string>
  toggleCardExpansion: (cardId: string) => void
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}

export default function Dashboard({
  serviceRequests,
  iaAgents,
  expandedCards,
  toggleCardExpansion,
  getPriorityColor,
  getStatusColor
}: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold">47</span>
          </div>
          <p className="text-sm text-gray-600">Empreses amb servei actiu</p>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12% aquest mes
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">156</span>
          </div>
          <p className="text-sm text-gray-600">Tasques completades</p>
          <div className="mt-2 text-xs text-gray-500">
            89% resoltes per IA
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold">1.2h</span>
          </div>
          <p className="text-sm text-gray-600">Temps mitjà resolució</p>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            -35% millora
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Euro className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold">€12.4k</span>
          </div>
          <p className="text-sm text-gray-600">Ingressos aquest mes</p>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +28% vs mes anterior
          </div>
        </div>
      </div>

      {/* Resumen de todas las funcionalidades */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { id: 'repositori', icon: Package, title: 'Repositori', color: 'indigo', data: [
            { label: 'Components', value: '47' },
            { label: 'Plugins actius', value: '15' },
            { label: 'Templates', value: '12' }
          ], extra: '98.5% deployments exitosos', extraColor: 'green' },
          
          { id: 'incidencias', icon: AlertCircle, title: 'Incidències', color: 'orange', data: [
            { label: 'Nous tickets', value: '8' },
            { label: 'En procés', value: '12' },
            { label: 'Resolts avui', value: '23' }
          ], extra: '1.2h temps mitjà', extraColor: 'blue' },

          { id: 'monitorizacion', icon: Activity, title: 'Monitorització', color: 'green', data: [
            { label: 'Servidors actius', value: '12/12' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Alertes', value: '2' }
          ], extra: 'CPU mitjà: 32%', extraColor: 'orange' },

          { id: 'seguridad', icon: Shield, title: 'Seguretat', color: 'blue', data: [
            { label: 'SSL vàlids', value: '47/47' },
            { label: 'Vulnerabilitats', value: '0' },
            { label: 'Scans avui', value: '156' }
          ], extra: 'Últim scan: fa 15min', extraColor: 'green' },

          { id: 'backups', icon: HardDrive, title: 'Backups', color: 'purple', data: [
            { label: 'Backups avui', value: '47' },
            { label: 'Taxa d\'èxit', value: '100%' },
            { label: 'Espai utilitzat', value: '2.3TB' }
          ], extra: 'Pròxim: 02:00h', extraColor: 'blue' },

          { id: 'infraestructura', icon: Server, title: 'Infraestructura', color: 'gray', data: [
            { label: 'Servidors', value: '12' },
            { label: 'Dominis', value: '47' },
            { label: 'Databases', value: '23' }
          ], extra: 'Càrrega mitjana: 0.8', extraColor: 'gray' },

          { id: 'servicios', icon: Building2, title: 'Serveis Externs', color: 'cyan', data: [
            { label: 'Sol·licituds actives', value: '3' },
            { label: 'Empreses clients', value: '47' },
            { label: 'Ingressos mes', value: '€12.4k' }
          ], extra: '89% resoltes per IA', extraColor: 'purple' },

          { id: 'kanban', icon: GitBranch, title: 'Projectes', color: 'orange', data: [
            { label: 'En desenvolupament', value: '5' },
            { label: 'En testing', value: '3' },
            { label: 'Completats', value: '28' }
          ], extra: '65% amb assistència IA', extraColor: 'blue' },

          { id: 'ia-agents', icon: Bot, title: 'Agents IA', color: 'purple', data: [
            { label: 'Agents actius', value: '4' },
            { label: 'Tasques completades', value: '156' },
            { label: 'Taxa d\'èxit mitjana', value: '96.8%' }
          ], extra: '2 agents ocupats', extraColor: 'yellow' },

          { id: 'facturacion', icon: Euro, title: 'Facturació', color: 'emerald', data: [
            { label: 'Factures generades', value: '23' },
            { label: 'Ingressos mensuals', value: '€12.4k' },
            { label: 'Pagaments pendents', value: '3' }
          ], extra: '+28% vs mes anterior', extraColor: 'emerald' },

          { id: 'documentacion', icon: FileCode, title: 'Documentació', color: 'slate', data: [
            { label: 'Documents actius', value: '156' },
            { label: 'APIs documentades', value: '12' },
            { label: 'Guies d\'integració', value: '8' }
          ], extra: 'SDK per 12 llenguatges', extraColor: 'indigo' }
        ].map((card) => (
          <div key={card.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <card.icon className={`w-4 h-4 text-${card.color}-600`} />
                <h4 className="font-semibold text-gray-900 text-sm">{card.title}</h4>
              </div>
              <button
                onClick={() => toggleCardExpansion(card.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {expandedCards.has(card.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Contenido siempre visible - datos principales */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{card.data[0].label}</span>
                <span className="font-semibold">{card.data[0].value}</span>
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedCards.has(card.id) && (
              <div className="mt-3 space-y-1">
                {card.data.slice(1).map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
                <div className={`mt-2 text-xs text-${card.extraColor}-600`}>
                  {card.extra}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estado en tiempo real - Tarjetas expandibles */}
      <div className="grid grid-cols-4 gap-4">
        {/* Solicitudes activas */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-gray-900 text-sm">Sol·licituds Actives</h4>
            </div>
            <button
              onClick={() => toggleCardExpansion('solicitudes')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expandedCards.has('solicitudes') ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Contenido siempre visible */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Sol·licituds actives</span>
              <span className="font-semibold">{serviceRequests.filter(s => s.estado !== 'completado').length}</span>
            </div>
          </div>

          {/* Contenido expandible */}
          {expandedCards.has('solicitudes') && (
            <div className="mt-3 space-y-2">
              {serviceRequests.filter(s => s.estado !== 'completado').slice(0, 3).map((request) => (
                <div key={request.id} className={`p-2 rounded border text-xs ${getPriorityColor(request.prioridad)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{request.empresa}</div>
                      <div className="text-xs opacity-75 truncate">{request.descripcion.substring(0, 40)}...</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs px-1 py-0.5 rounded ${getStatusColor(request.estado)}`}>
                          {request.estado}
                        </span>
                        {request.asignadoA === 'IA' && (
                          <Bot className="w-3 h-3 text-purple-600" />
                        )}
                      </div>
                    </div>
                    {request.iaAnalisis && (
                      <div className="text-right ml-2">
                        <div className="text-xs font-bold text-purple-600">{request.iaAnalisis.confianza}%</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {serviceRequests.filter(s => s.estado !== 'completado').length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{serviceRequests.filter(s => s.estado !== 'completado').length - 3} més
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estado de Agentes IA */}
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-gray-900 text-sm">Agents IA</h4>
            </div>
            <button
              onClick={() => toggleCardExpansion('agents')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expandedCards.has('agents') ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Contenido siempre visible */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Agents actius</span>
              <span className="font-semibold">{iaAgents.filter(a => a.estado === 'activo' || a.estado === 'ocupado').length}</span>
            </div>
          </div>

          {/* Contenido expandible */}
          {expandedCards.has('agents') && (
            <div className="mt-3 space-y-2">
              {iaAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-2 rounded bg-gray-50 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.estado === 'activo' ? 'bg-green-500' :
                      agent.estado === 'ocupado' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium">{agent.nombre}</div>
                      <div className="text-xs text-gray-500">{agent.tipo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{agent.tasaExito}%</div>
                    <div className="text-xs text-gray-500">{agent.tareasCompletadas}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}