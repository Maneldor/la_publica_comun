import React from 'react'
import { BarChart3, Building2, FileCheck, TrendingUp, Eye, MessageCircle, Bot, Search, Plus } from 'lucide-react'
import { useEmpresaStore } from '../../../store/useEmpresaStore'
import { useTranslations } from '../../../hooks/useTranslations'

interface SidebarProps {
  empresaData: any
}

export default function Sidebar({ empresaData }: SidebarProps) {
  const { activeSection, setActiveSection, setShowAIChat } = useEmpresaStore()
  const { t } = useTranslations()

  const sidebarItems = [
    { id: 'dashboard', name: t('dashboard'), icon: BarChart3, active: activeSection === 'dashboard' },
    { id: 'perfil', name: t('perfilEmpresa'), icon: Building2, active: activeSection === 'perfil' },
    { id: 'ofertes', name: t('mevasOfertes'), icon: FileCheck, badge: empresaData?.metrics.ofertes.actives || 0, active: activeSection === 'ofertes' },
    { id: 'analytics', name: t('analytics'), icon: TrendingUp, active: activeSection === 'analytics' },
    { id: 'grups', name: t('grupsOcults'), icon: Eye, proBadge: true, active: activeSection === 'grups' },
    { id: 'comunicacio', name: t('comunicacio'), icon: MessageCircle, active: activeSection === 'comunicacio' },
    { id: 'ia', name: t('configIA'), icon: Bot, active: activeSection === 'ia' },
    { id: 'recursos', name: t('recursos'), icon: Search, active: activeSection === 'recursos' }
  ]

  const quickActions = [
    { 
      title: t('novaOferta'), 
      desc: t('creaOfertaIA'),
      icon: Plus, 
      color: "bg-gradient-to-r from-blue-600 to-indigo-600",
      action: "create_offer"
    },
    { 
      title: t('analytics'), 
      desc: t('veureRendiment'),
      icon: BarChart3, 
      color: "bg-gradient-to-r from-emerald-600 to-teal-600",
      action: "view_analytics"
    },
    { 
      title: t('chatIA'), 
      desc: t('assessorComercial'),
      icon: Bot, 
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      action: "open_ai"
    }
  ]

  return (
    <aside className="w-80 bg-white/60 backdrop-blur-md border-r border-slate-200/60 min-h-screen">
      <nav className="p-6">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.active ? 'bg-white/20' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.proBadge && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold">
                    PRO
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-500 mb-4">{t('accionsRapides')}</h3>
          <div className="space-y-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <button
                  key={idx}
                  onClick={() => action.action === 'open_ai' && setShowAIChat(true)}
                  className={`w-full p-4 ${action.color} text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{action.title}</div>
                      <div className="text-xs opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">{action.desc}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </aside>
  )
}