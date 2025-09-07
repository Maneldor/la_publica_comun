import React from 'react'
import { Building2, Bell, Settings, Crown, Sparkles } from 'lucide-react'
import { useEmpresaStore } from '../../../store/useEmpresaStore'
import { useTranslations } from '../../../hooks/useTranslations'

interface HeaderProps {
  empresaData: any
}

export default function Header({ empresaData }: HeaderProps) {
  const { notifications, setNotifications } = useEmpresaStore()
  const { t } = useTranslations()

  if (!empresaData) return null

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{empresaData.empresa.nombre}</h1>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/25 animate-pulse">
                    <Crown className="w-3 h-3" />
                    <span className="font-bold">{empresaData.empresa.plan}</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">MG</span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-700">{t('gestorComercial')}</div>
                <div className="text-slate-500">{empresaData.empresa.gestorComercial.nombre}</div>
              </div>
            </div>

            <button 
              className="relative p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              onClick={() => setNotifications(0)}
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}