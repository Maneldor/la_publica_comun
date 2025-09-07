'use client'

import { useState } from 'react'
import { 
  Eye, EyeOff, Lock, Shield, Crown, Plus, Users, Settings,
  Calendar, Clock, Target, Activity, Star, AlertTriangle,
  Edit, Trash2, Share2, Copy, CheckCircle, X, Sparkles
} from 'lucide-react'
import PremiumGroupFeatures from './PremiumGroupFeatures'

export default function GrupsOcults() {
  const [activeTab, setActiveTab] = useState<'actius' | 'arxiu' | 'configuracio'>('actius')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const grupsOcults = [
    {
      id: 'GO-001',
      nom: 'Directius Senior Tech',
      descripcio: 'Posicions executives i de direcció en el sector tecnològic',
      membres: 156,
      ofertes: 8,
      nivel: 'C-Level',
      created: '2024-01-15',
      lastActivity: '2024-01-28',
      status: 'actiu',
      visibility: 'invitation_only',
      moderacio: 'manual',
      stats: {
        aplicacions: 234,
        conversions: 18,
        satisfaccio: 94
      },
      tags: ['Executive', 'Tech', 'Leadership', 'Strategy']
    },
    {
      id: 'GO-002', 
      nom: 'Experts Ciberseguretat',
      descripcio: 'Especialistes en seguretat informàtica i compliance',
      membres: 89,
      ofertes: 12,
      nivel: 'Expert',
      created: '2024-01-10',
      lastActivity: '2024-01-29',
      status: 'actiu',
      visibility: 'by_approval',
      moderacio: 'automatica',
      stats: {
        aplicacions: 445,
        conversions: 31,
        satisfaccio: 96
      },
      tags: ['Security', 'Compliance', 'Infrastructure']
    },
    {
      id: 'GO-003',
      nom: 'Projectes Confidencials',
      descripcio: 'Iniciatives estratègiques amb alt nivell de discreció',
      membres: 23,
      ofertes: 3,
      nivel: 'Top Secret',
      created: '2023-12-20',
      lastActivity: '2024-01-25',
      status: 'actiu',
      visibility: 'invitation_only',
      moderacio: 'manual',
      stats: {
        aplicacions: 67,
        conversions: 8,
        satisfaccio: 98
      },
      tags: ['Confidential', 'Strategic', 'Innovation']
    }
  ]

  const getVisibilityColor = (visibility: string) => {
    switch(visibility) {
      case 'invitation_only': return 'text-red-600 bg-red-100'
      case 'by_approval': return 'text-amber-600 bg-amber-100'
      case 'public': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case 'Top Secret': return 'text-red-600 bg-red-100 border-red-200'
      case 'C-Level': return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'Expert': return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'Professional': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const CreateGroupModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Crear Grup Ocult</h3>
              <p className="text-sm text-slate-600">Funcionalitat Premium Enterprise</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom del Grup
            </label>
            <input
              type="text"
              placeholder="Ex: Experts IA Avançada"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripció
            </label>
            <textarea
              placeholder="Descripció detallada del grup i els seus objectius..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nivell de Seguretat
              </label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="professional">Professional</option>
                <option value="expert">Expert</option>
                <option value="c-level">C-Level</option>
                <option value="top-secret">Top Secret</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Visibilitat
              </label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="invitation_only">Només Invitació</option>
                <option value="by_approval">Per Aprovació</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (separats per comes)
            </label>
            <input
              type="text"
              placeholder="IA, Machine Learning, Innovation"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowCreateModal(false)}
            className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel·lar
          </button>
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Crown className="w-4 h-4 inline mr-2" />
            Crear Grup
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                Grups Ocults
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold rounded-full">
                  PREMIUM
                </span>
              </h2>
              <p className="text-slate-600">Ofertes confidencials per a talents exclusius</p>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Grup
          </button>
        </div>

        {/* Stats ràpids */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{grupsOcults.length}</div>
            <div className="text-sm text-slate-600">Grups Actius</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {grupsOcults.reduce((acc, grup) => acc + grup.membres, 0)}
            </div>
            <div className="text-sm text-slate-600">Membres Totals</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">
              {grupsOcults.reduce((acc, grup) => acc + grup.ofertes, 0)}
            </div>
            <div className="text-sm text-slate-600">Ofertes Actives</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6">
        <div className="flex gap-2 border-b mb-6">
          {[
            { id: 'actius', label: 'Grups Actius', icon: Eye, count: grupsOcults.length },
            { id: 'arxiu', label: 'Arxiu', icon: Archive, count: 2 },
            { id: 'configuracio', label: 'Configuració', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grups Actius */}
        {activeTab === 'actius' && (
          <div className="space-y-4">
            {grupsOcults.map(grup => (
              <div key={grup.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{grup.nom}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full border ${getNivelColor(grup.nivel)}`}>
                        <Lock className="w-3 h-3 inline mr-1" />
                        {grup.nivel}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityColor(grup.visibility)}`}>
                        {grup.visibility.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{grup.descripcio}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {grup.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{grup.membres}</div>
                    <div className="text-xs text-slate-500">Membres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{grup.ofertes}</div>
                    <div className="text-xs text-slate-500">Ofertes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{grup.stats.aplicacions}</div>
                    <div className="text-xs text-slate-500">Aplicacions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{grup.stats.conversions}</div>
                    <div className="text-xs text-slate-500">Contractats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">{grup.stats.satisfaccio}%</div>
                    <div className="text-xs text-slate-500">Satisfacció</div>
                  </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Creat: {grup.created}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Última activitat: {grup.lastActivity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Actiu</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Configuració */}
        {activeTab === 'configuracio' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Configuració de Seguretat</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Moderació automàtica</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Verificació d'identitat obligatòria</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Encriptació end-to-end</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Notificacions i Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Nous membres</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Ofertes noves</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Activitat sospitosa</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Features Section */}
      <PremiumGroupFeatures 
        empresaId="empresa-001"
        planEmpresa="premium"
      />

      {showCreateModal && <CreateGroupModal />}
    </div>
  )
}