'use client'

import { useState, ReactNode } from 'react'
import HeaderGlobal from './HeaderGlobal'

interface LayoutXarxaSocialProps {
  children: ReactNode
  paginaActual?: 'dashboard' | 'membres' | 'grups' | 'forums' | 'blogs'
}

export default function LayoutXarxaSocial({ 
  children, 
  paginaActual = 'dashboard' 
}: LayoutXarxaSocialProps) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                <h2 className="text-lg font-semibold">Menú</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* COMUNITAT */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">COMUNITAT</h3>
                <nav className="space-y-1">
                  <a 
                    href="/dashboard" 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive('dashboard') 
                        ? 'text-white bg-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={isActive('dashboard') ? 'text-white' : 'text-gray-600'}>🏠</span>
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
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">📄</span>
                    <span className="text-xs md:text-sm">Anuncis</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">💼</span>
                    <span className="text-xs md:text-sm">Ofertes</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">👁️</span>
                    <span className="text-xs md:text-sm">Assessorament</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">🔗</span>
                    <span className="text-xs md:text-sm">Enllaços d'Interès</span>
                  </a>
                </nav>
              </div>

              {/* ACCIONES RÁPIDAS */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ACCIONS RÀPIDES</h3>
                <nav className="space-y-1">
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">🔍</span>
                    <span className="text-xs md:text-sm">Cercar</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">🔔</span>
                    <span className="text-xs md:text-sm">Notificacions</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">📅</span>
                    <span className="text-xs md:text-sm">Calendari</span>
                  </a>
                </nav>
              </div>

              {/* CONFIGURACIÓN */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CONFIGURACIÓ</h3>
                <nav className="space-y-1">
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">⚙️</span>
                    <span className="text-xs md:text-sm">Configuració</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal con padding-top para el header fijo */}
      <div className="pt-16">
        <div className="max-w-8xl mx-auto px-2 md:px-4 py-4 md:py-6 pb-20 lg:pb-6">
          {/* Tarjetas de estadísticas */}
          <div className="hidden lg:flex lg:gap-4 mb-4">
            {/* Espacio para columna 1 (menú) */}
            <div className="lg:w-64 lg:flex-shrink-0"></div>
            
            {/* 3 tarjetas sobre columnas 2-3 */}
            <div className="flex-1 mr-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">1,247</div>
                      <div className="text-xs text-gray-500">Total Membres</div>
                    </div>
                    <div className="text-lg text-blue-500">👥</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">127</div>
                      <div className="text-xs text-gray-500">Membres Online</div>
                    </div>
                    <div className="text-lg text-green-500">🟢</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">8</div>
                      <div className="text-xs text-gray-500">Grups</div>
                    </div>
                    <div className="text-lg text-purple-500">🏢</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2 tarjetas sobre columna 4 */}
            <div className="lg:w-80 lg:flex-shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">42</div>
                      <div className="text-xs text-gray-500">Empreses</div>
                    </div>
                    <div className="text-lg text-orange-500">🏭</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">89</div>
                      <div className="text-xs text-gray-500">Esdeveniments</div>
                    </div>
                    <div className="text-lg text-red-500">📅</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid principal de 4 columnas */}
          <div className="lg:flex lg:gap-4">
            
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
                          href="/dashboard" 
                          className={`flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors ${
                            isActive('dashboard') 
                              ? 'text-white bg-blue-500' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span className={isActive('dashboard') ? 'text-white' : 'text-gray-600'}>🏠</span>
                          <span className="text-xs md:text-sm font-medium">Xarxa Social</span>
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
                    <div className="mb-3 md:mb-6">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SERVEIS</h3>
                      <nav className="space-y-1">
                        <a href="/dashboard/empresas" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">🏢</span>
                          <span className="text-xs md:text-sm">Empreses Col·laboradores</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">📄</span>
                          <span className="text-xs md:text-sm">Anuncis</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">💼</span>
                          <span className="text-xs md:text-sm">Ofertes</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">👁️</span>
                          <span className="text-xs md:text-sm">Assessorament</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">🔗</span>
                          <span className="text-xs md:text-sm">Enllaços d'Interès</span>
                        </a>
                      </nav>
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div className="mb-3 md:mb-6">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">ACCIONS RÀPIDES</h3>
                      <nav className="space-y-1">
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">🔍</span>
                          <span className="text-xs md:text-sm">Cercar</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">🔔</span>
                          <span className="text-xs md:text-sm">Notificacions</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">📅</span>
                          <span className="text-xs md:text-sm">Calendari</span>
                        </a>
                      </nav>
                    </div>

                    {/* CONFIGURACIÓN */}
                    <div className="mb-3 md:mb-6">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">CONFIGURACIÓ</h3>
                      <nav className="space-y-1">
                        <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-gray-600">⚙️</span>
                          <span className="text-xs md:text-sm">Configuració</span>
                        </a>
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

            {/* COLUMNA 2 - Seguint - Solo desktop */}
            <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
              <div className="space-y-4">
                {/* Card de Seguint */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🤝 Seguint</h3>
                    
                    {/* Pestañas */}
                    <div className="flex space-x-4 mb-4 border-b">
                      <button className="pb-2 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                        ACTIUS
                      </button>
                      <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                        RECENTS
                      </button>
                    </div>

                    {/* Lista de usuarios */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          RJ
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Roberto Jiménez</div>
                          <div className="text-xs text-gray-500">@roberto_marketing</div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">MA</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          CR
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Carmen Ruiz</div>
                          <div className="text-xs text-gray-500">@carmen_designer</div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 py-2">
                      VEURE TOT
                    </button>
                  </div>
                </div>

                {/* Card de Grups */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Grups</h3>
                    
                    {/* Pestañas */}
                    <div className="flex space-x-4 mb-4 border-b">
                      <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                        NOUS
                      </button>
                      <button className="pb-2 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                        ACTIUS
                      </button>
                    </div>

                    {/* Lista de grupos */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Sevilla Gastronomi...</h4>
                          <p className="text-xs text-gray-500">1 membres</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700 py-2">
                      VEURE TOT
                    </button>
                  </div>
                </div>

                {/* Card de Anuncis */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📣 Anuncis</h3>
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No hi ha anuncis disponibles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA 3 - Contenido principal (Feed) */}
            <div className="lg:flex-1">
              {children}
            </div>

            {/* COLUMNA 4 - Perfil y widgets - Solo desktop */}
            <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
              <div className="space-y-4">
                {/* Widget de Perfil */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Completa el teu Perfil</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="8" fill="none"/>
                        <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 28 * 0.2} ${2 * Math.PI * 28 * 0.8}`} strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">20%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Completat</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Informació general</span>
                      <span className="text-green-500 font-medium">5/6</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experiència laboral</span>
                      <span className="text-gray-400 font-medium">0/3</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Foto de perfil</span>
                      <span className="text-gray-400 font-medium">0/1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Foto de portada</span>
                      <span className="text-gray-400 font-medium">0/1</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Xarxes socials</span>
                      <span className="text-gray-400 font-medium">0/1</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                    Completar Perfil
                  </button>
                </div>

                {/* Widget de Empreses */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Empreses</h3>
                    <a href="/dashboard/empresas" className="text-xs text-blue-500 hover:text-blue-600">Ver totes</a>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">Consultoria Empre...</h4>
                        <p className="text-xs text-gray-500">15 empleats · Sevilla</p>
                      </div>
                      <span className="text-xs text-blue-500 flex-shrink-0">9</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">Marketing Digital ...</h4>
                        <p className="text-xs text-gray-500">25 empleats · Barcelona</p>
                      </div>
                      <span className="text-xs text-blue-500 flex-shrink-0">8</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">TechSolutions S.A.</h4>
                        <p className="text-xs text-gray-500">75 empleats · Madrid</p>
                      </div>
                      <span className="text-xs text-blue-500 flex-shrink-0">9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navegación móvil inferior */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 gap-1">
          <a 
            href="/dashboard"
            className={`py-3 text-xs text-center ${isActive('dashboard') ? 'text-blue-600' : 'text-gray-600'}`}
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
    </div>
  )
}