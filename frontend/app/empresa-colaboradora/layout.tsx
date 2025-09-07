'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BarChart3, Briefcase, Settings, 
  FileText, Users, MessageSquare, Menu, X, Building2
} from 'lucide-react'

export default function EmpresaColaboradoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/empresa-colaboradora',
      icon: LayoutDashboard,
      description: 'Vista general'
    },
    {
      title: 'Perfil de Empresa',
      href: '/empresa-colaboradora/configuracio',
      icon: Building2,
      description: 'Gestió del perfil públic'
    },
    {
      title: 'Analytics i Informes',
      href: '/empresa-colaboradora/analytics-informes',
      icon: BarChart3,
      description: 'Mètriques i rendiment'
    },
    {
      title: 'Gestió d\'Ofertes',
      href: '/empresa-colaboradora/gestio-ofertes',
      icon: Briefcase,
      description: 'Les teves ofertes',
      badge: '47'
    },
    {
      title: 'Grups Ocults',
      href: '/empresa-colaboradora/grups-ocults',
      icon: Users,
      description: 'Espais col·laboratius',
      proBadge: true
    },
    {
      title: 'Centre de Comunicació',
      href: '/empresa-colaboradora/comunicacio',
      icon: MessageSquare,
      description: 'Xarxa professional'
    },
    {
      title: 'Missatges',
      href: '/empresa-colaboradora/missatges',
      icon: MessageSquare,
      description: 'Comunicacions'
    },
    {
      title: 'Comunitat',
      href: '/empresa-colaboradora/comunitat',
      icon: Users,
      description: 'Xarxa professional'
    },
    {
      title: 'Documentació',
      href: '/empresa-colaboradora/documentacio',
      icon: FileText,
      description: 'Guies i recursos'
    },
    {
      title: 'Configuració',
      href: '/empresa-colaboradora/settings',
      icon: Settings,
      description: 'Perfil i preferències'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/empresa-colaboradora') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Premium con Glassmorphism */}
      <aside className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}>
        {/* Header Premium */}
        <div className="h-20 border-b border-slate-200/60 flex items-center px-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Empresa Portal</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-slate-600 font-medium">TechSolutions BCN</p>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs rounded-full font-bold shadow-sm">
                    Premium Enterprise
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {sidebarOpen && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm ${active ? 'text-white' : 'text-slate-700'}`}>
                        {item.title}
                      </div>
                      <div className={`text-xs ${active ? 'text-white/80' : 'text-slate-500'}`}>
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Badge numérico */}
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    
                    {/* Badge PRO dorado */}
                    {item.proBadge && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md">
                        PRO
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Accions Ràpides Premium */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4 space-y-3">
            {/* Accions principals */}
            <div className="space-y-2">
              <Link
                href="/empresa-colaboradora/gestio-ofertes"
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Briefcase className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm">Nova Oferta</div>
                  <div className="text-xs text-white/80">Crear amb IA</div>
                </div>
              </Link>
              
              <Link
                href="/empresa-colaboradora/analytics-informes"
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                <div className="text-sm font-medium">Analytics</div>
              </Link>
            </div>
            
            {/* Status Premium */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-slate-300">Status Premium</div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-sm font-bold">Totes les funcions actives</div>
              <div className="text-xs text-slate-400 mt-1">Renovació automàtica: 23 dies</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-20'
      }`}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-800">
              {menuItems.find(item => isActive(item.href))?.title || 'Empresa Col·laboradora'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Tech+Solutions&background=4f46e5&color=fff"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-slate-800">TechSolutions BCN</div>
                <div className="text-xs text-slate-500">empresa@tech.com</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}