'use client'

import { useState, ReactNode } from 'react'
import HeaderGlobal from './HeaderGlobal'
import ModalBusqueda from './especificos-comunidad/ModalBusqueda'
import ModalMissatgesGlobal from './especificos-comunidad/ModalMissatgesGlobal'
import ModalConfiguracioEmails from './especificos-comunidad/ModalConfiguracioEmails'
import ModalConfiguracio from './especificos-comunidad/ModalConfiguracio'
import DebugTraduccions from './especificos-comunidad/DebugTraduccions'
import { usePresencia } from '../../hooks/usePresencia'
import { useT } from '../../contextos/TraduccioContext'

interface LayoutGeneralProps {
  children: ReactNode
  paginaActual?: 'dashboard' | 'xarxa-social' | 'membres' | 'grups' | 'forums' | 'blogs' | 'perfil' | 'empresas' | 'tauler-anuncis' | 'ofertes' | 'assessorament' | 'enllcos-interes' | 'missatges' | 'notificacions' | 'calendari'
}

export default function LayoutGeneral({ 
  children, 
  paginaActual = 'dashboard' 
}: LayoutGeneralProps) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modalBusquedaObert, setModalBusquedaObert] = useState(false)
  const [modalMissatgesObert, setModalMissatgesObert] = useState(false)
  const [modalConfiguracioEmailsObert, setModalConfiguracioEmailsObert] = useState(false)
  const [modalConfiguracioObert, setModalConfiguracioObert] = useState(false)
  const [terminiBusqueda, setTerminiBusqueda] = useState('')

  // Hook per gestionar presència online/offline
  usePresencia()
  
  // Hook per traduccions automàtiques
  const t = useT()

  const isActive = (pagina: string) => paginaActual === pagina

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <HeaderGlobal 
          mostrarBotoMobilMenu={true}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* Menú móvil deslizable */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t('nav.menu', { fallback: 'Menú' })}</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* COMUNITAT */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('section.comunitat')}</h3>
                <nav className="space-y-1">
                  <a 
                    href="/xarxa-social" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      (isActive('dashboard') || isActive('xarxa-social')) 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={(isActive('dashboard') || isActive('xarxa-social')) ? 'text-white' : 'text-gray-600'}>🏠</span>
                    <span className="text-sm font-medium">Xarxa Social</span>
                  </a>
                  <button 
                    onClick={() => {
                      window.location.href = '/perfil';
                    }}
                    className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-600">👤</span>
                    <span className="text-xs md:text-sm">El Meu Perfil</span>
                  </button>
                  <a 
                    href="/membres" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('membres') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('membres') ? 'text-white' : 'text-gray-600'}>👥</span>
                    <span className="text-xs md:text-sm">Membres</span>
                  </a>
                  <a 
                    href="/grupos-avanzados" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('grups') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('grups') ? 'text-white' : 'text-gray-600'}>👥</span>
                    <span className="text-xs md:text-sm">Grups</span>
                  </a>
                  <a 
                    href="/forums" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('forums') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('forums') ? 'text-white' : 'text-gray-600'}>💬</span>
                    <span className="text-xs md:text-sm">Fòrums</span>
                  </a>
                  <a 
                    href="/blogs" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('blogs') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('blogs') ? 'text-white' : 'text-gray-600'}>📝</span>
                    <span className="text-xs md:text-sm">Blogs</span>
                  </a>
                </nav>
              </div>

              {/* SERVICIOS */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SERVEIS</h3>
                <nav className="space-y-1">
                  <a href="/dashboard/empresas" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">🏢</span>
                    <span className="text-xs md:text-sm">Empreses Col·laboradores</span>
                  </a>
                  <a 
                    href="/ofertes" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('ofertes') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('ofertes') ? 'text-white' : 'text-gray-600'}>💼</span>
                    <span className="text-xs md:text-sm">Ofertes</span>
                  </a>
                  <a 
                    href="/tauler-anuncis" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('tauler-anuncis') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('tauler-anuncis') ? 'text-white' : 'text-gray-600'}>📄</span>
                    <span className="text-xs md:text-sm">Taulell d'Anuncis</span>
                  </a>
                  <a 
                    href="/assessorament" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('assessorament') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('assessorament') ? 'text-white' : 'text-gray-600'}>👁️</span>
                    <span className="text-xs md:text-sm">Assessorament</span>
                  </a>
                  <a 
                    href="/enllcos-interes" 
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('enllcos-interes') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('enllcos-interes') ? 'text-white' : 'text-gray-600'}>🔗</span>
                    <span className="text-xs md:text-sm">Enllaços d'Interès</span>
                  </a>
                </nav>
              </div>

              {/* ACCIONES RÁPIDAS */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ACCIONS RÀPIDES</h3>
                <nav className="space-y-1">
                  <button 
                    onClick={() => setModalBusquedaObert(true)}
                    className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <span className="text-gray-600">🔍</span>
                    <span className="text-xs md:text-sm">Cercar</span>
                  </button>
                  <a 
                    href="/missatges"
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('missatges') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <span className={isActive('missatges') ? 'text-white' : 'text-gray-600'}>💬</span>
                    <span className="text-xs md:text-sm">Missatges</span>
                  </a>
                  <a 
                    href="/notificacions"
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('notificacions') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <span className={isActive('notificacions') ? 'text-white' : 'text-gray-600'}>🔔</span>
                    <span className="text-xs md:text-sm">Notificacions</span>
                  </a>
                  <a 
                    href="/calendari"
                    className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                      isActive('calendari') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                    <span className={isActive('calendari') ? 'text-white' : 'text-gray-600'}>📅</span>
                    <span className="text-xs md:text-sm">Calendari</span>
                  </a>
                </nav>
              </div>

              {/* CONFIGURACIÓN */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CONFIGURACIÓ</h3>
                <nav className="space-y-1">
                  <button 
                    onClick={() => setModalConfiguracioObert(true)}
                    className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="text-gray-600">⚙️</span>
                    <span className="text-xs md:text-sm">Configuració</span>
                  </button>
                  <button 
                    onClick={() => setModalConfiguracioEmailsObert(true)}
                    className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <span className="text-gray-600">📧</span>
                    <span className="text-xs md:text-sm">Emails</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal con padding-top para el header fijo */}
      <div className="pt-16">
        <div className="lg:flex lg:gap-4 max-w-8xl mx-auto px-2 md:px-4 py-4 md:py-6 pb-20 lg:pb-6">
          
          {/* COLUMNA 1 - Menú lateral fijo - Solo desktop */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="fixed left-4 top-20 bottom-6 w-64 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-2 md:p-4">
                  
                  {/* COMUNITAT */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 md:mb-3">COMUNITAT</h3>
                    <nav className="space-y-1">
                      <a 
                        href="/xarxa-social" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          (isActive('dashboard') || isActive('xarxa-social')) 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={(isActive('dashboard') || isActive('xarxa-social')) ? 'text-white' : 'text-gray-600'}>🏠</span>
                        <span className="text-xs md:text-sm font-medium">Xarxa Social</span>
                      </a>
                      <button 
                        onClick={() => {
                          window.location.href = '/perfil';
                        }}
                        className={`w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('perfil') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('perfil') ? 'text-white' : 'text-gray-600'}>👤</span>
                        <span className="text-xs md:text-sm">El Meu Perfil</span>
                      </button>
                      <a 
                        href="/membres" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('membres') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('membres') ? 'text-white' : 'text-gray-600'}>👥</span>
                        <span className="text-xs md:text-sm">Membres</span>
                      </a>
                      <a 
                        href="/grupos-avanzados" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('grups') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('grups') ? 'text-white' : 'text-gray-600'}>👥</span>
                        <span className="text-xs md:text-sm">Grups</span>
                      </a>
                      <a 
                        href="/forums" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('forums') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('forums') ? 'text-white' : 'text-gray-600'}>💬</span>
                        <span className="text-xs md:text-sm">Fòrums</span>
                      </a>
                      <a 
                        href="/blogs" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('blogs') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('blogs') ? 'text-white' : 'text-gray-600'}>📝</span>
                        <span className="text-xs md:text-sm">Blogs</span>
                      </a>
                    </nav>
                  </div>

                  {/* SERVICIOS */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SERVEIS</h3>
                    <nav className="space-y-1">
                      <a 
                        href="/dashboard/empresas" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('empresas') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('empresas') ? 'text-white' : 'text-gray-600'}>🏢</span>
                        <span className="text-xs md:text-sm">Empreses Col·laboradores</span>
                      </a>
                      <a 
                        href="/ofertes" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('ofertes') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('ofertes') ? 'text-white' : 'text-gray-600'}>💼</span>
                        <span className="text-xs md:text-sm">Ofertes</span>
                      </a>
                      <a 
                        href="/tauler-anuncis" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('tauler-anuncis') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('tauler-anuncis') ? 'text-white' : 'text-gray-600'}>📄</span>
                        <span className="text-xs md:text-sm">Taulell d'Anuncis</span>
                      </a>
                      <a 
                        href="/assessorament" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('assessorament') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('assessorament') ? 'text-white' : 'text-gray-600'}>👁️</span>
                        <span className="text-xs md:text-sm">Assessorament</span>
                      </a>
                      <a 
                        href="/enllcos-interes" 
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('enllcos-interes') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={isActive('enllcos-interes') ? 'text-white' : 'text-gray-600'}>🔗</span>
                        <span className="text-xs md:text-sm">Enllaços d'Interès</span>
                      </a>
                    </nav>
                  </div>

                  {/* ACCIONES RÁPIDAS */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ACCIONS RÀPIDES</h3>
                    <nav className="space-y-1">
                      <button 
                        onClick={() => setModalBusquedaObert(true)}
                        className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left">
                        <span className="text-gray-600">🔍</span>
                        <span className="text-xs md:text-sm">Cercar</span>
                      </button>
                      <a 
                        href="/missatges"
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('missatges') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        <span className={isActive('missatges') ? 'text-white' : 'text-gray-600'}>💬</span>
                        <span className="text-xs md:text-sm">Missatges</span>
                      </a>
                      <a 
                        href="/notificacions"
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('notificacions') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        <span className={isActive('notificacions') ? 'text-white' : 'text-gray-600'}>🔔</span>
                        <span className="text-xs md:text-sm">Notificacions</span>
                      </a>
                      <a 
                        href="/calendari"
                        className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                          isActive('calendari') 
                            ? 'text-white bg-blue-500' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        <span className={isActive('calendari') ? 'text-white' : 'text-gray-600'}>📅</span>
                        <span className="text-xs md:text-sm">Calendari</span>
                      </a>
                    </nav>
                  </div>

                  {/* CONFIGURACIÓN */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CONFIGURACIÓ</h3>
                    <nav className="space-y-1">
                      <button 
                        onClick={() => setModalConfiguracioObert(true)}
                        className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-gray-600">⚙️</span>
                        <span className="text-xs md:text-sm">Configuració</span>
                      </button>
                      <button 
                        onClick={() => setModalConfiguracioEmailsObert(true)}
                        className="w-full flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-gray-600">📧</span>
                        <span className="text-xs md:text-sm">Emails</span>
                      </button>
                    </nav>
                  </div>

                  {/* Perfil usuario */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        MA
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Manel Amador</div>
                        <div className="text-xs text-gray-500">plegats.cat@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL - Ocupa todo el espacio restante */}
          <div className="lg:flex-1 lg:ml-0">
            {children}
          </div>

        </div>
      </div>

      {/* Navegación móvil inferior */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 gap-1">
          <a 
            href="/xarxa-social"
            className={`py-3 text-xs text-center ${(isActive('dashboard') || isActive('xarxa-social')) ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">🏠</span>
            Inici
          </a>
          <a 
            href="/membres"
            className={`py-3 text-xs text-center ${isActive('membres') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">👥</span>
            Membres
          </a>
          <a 
            href="/forums"
            className={`py-3 text-xs text-center ${isActive('forums') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">💬</span>
            Fòrums
          </a>
          <a 
            href="/blogs"
            className={`py-3 text-xs text-center ${isActive('blogs') ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">📝</span>
            Blogs
          </a>
          <button className="py-3 text-xs text-gray-600 text-center">
            <span className="block text-xl mb-1">⚙️</span>
            Més
          </button>
        </div>
      </div>

      {/* Modal de búsqueda global */}
      <ModalBusqueda 
        isOpen={modalBusquedaObert}
        onClose={() => {
          setModalBusquedaObert(false)
          setTerminiBusqueda('')
        }}
        posts={[]}
      />

      {/* Modal de missatges global */}
      <ModalMissatgesGlobal
        isOpen={modalMissatgesObert}
        onClose={() => setModalMissatgesObert(false)}
      />

      {/* Modal de configuració d'emails */}
      <ModalConfiguracioEmails
        isOpen={modalConfiguracioEmailsObert}
        onClose={() => setModalConfiguracioEmailsObert(false)}
      />

      {/* Modal de configuració general */}
      <ModalConfiguracio
        isOpen={modalConfiguracioObert}
        onClose={() => setModalConfiguracioObert(false)}
      />
    </div>
  )
}