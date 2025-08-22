'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFeedSocial } from '../../../../hooks/useFeedSocial'
import FormulariPost from './FormulariPost'
import PostItem from './PostItem'
import FiltresFeed from './FiltresFeed'
import HeaderGlobal from '../HeaderGlobal'

export default function FeedSocial() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('feed') // Para navegación móvil
  const router = useRouter()
  
  // Hook per gestionar el feed social
  const { posts, filtre, setFiltre, crearPost, ferLike, compartir, afegirComentari, eliminarPost, editarPost, pinnarPost, carregant } = useFeedSocial()
  
  // Simular detecció d'usuari administrador (en una app real vindria del context d'autenticació)
  const esAdmin = true // TODO: obtenir del context d'usuari
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global amb botó de menú mòbil */}
      <HeaderGlobal 
        mostrarBotoMobilMenu={true}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

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
                  <a href="#" className="flex items-center space-x-3 px-3 py-2 text-white bg-blue-500 rounded-lg transition-colors">
                    <span className="text-white">🏠</span>
                    <span className="text-sm font-medium">Xarxa Social</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">👤</span>
                    <span className="text-xs md:text-sm">El Meu Perfil</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">👥</span>
                    <span className="text-xs md:text-sm">Membres</span>
                  </a>
                  <button 
                    onClick={() => {
                      console.log('Mobile Grups clicked!');
                      window.location.href = '/grupos-avanzados';
                    }}
                    className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                  >
                    <span className="text-gray-600">👥</span>
                    <span className="text-xs md:text-sm">Grups</span>
                  </button>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">💬</span>
                    <span className="text-xs md:text-sm">Missatges</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">💬</span>
                    <span className="text-xs md:text-sm">Fòrums</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600">📝</span>
                    <span className="text-xs md:text-sm">Blogs</span>
                  </a>
                </nav>
              </div>

              {/* SERVICIOS */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SERVEIS</h3>
                <nav className="space-y-1">
                  <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
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

      {/* Navegación móvil inferior */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 gap-1">
          <button 
            onClick={() => setActiveSection('feed')}
            className={`py-3 text-xs ${activeSection === 'feed' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">🏠</span>
            Inici
          </button>
          <button 
            onClick={() => setActiveSection('seguint')}
            className={`py-3 text-xs ${activeSection === 'seguint' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">👥</span>
            Seguint
          </button>
          <button 
            onClick={() => {
              console.log('Bottom nav Grups clicked!');
              window.location.href = '/grupos-avanzados';
            }}
            className={`py-3 text-xs ${activeSection === 'grups' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">👥</span>
            Grups
          </button>
          <button 
            onClick={() => setActiveSection('perfil')}
            className={`py-3 text-xs ${activeSection === 'perfil' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <span className="block text-xl mb-1">👤</span>
            Perfil
          </button>
        </div>
      </div>

      {/* Layout principal responsive */}
      <div className="max-w-8xl mx-auto px-2 md:px-4 py-4 md:py-6 pb-20 lg:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-4">
          
          {/* COLUMNA 1 - Menú lateral - Solo desktop */}
          <div className="hidden md:block md:col-span-2 lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Menú lateral principal */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-2 md:p-4">
                  
                  {/* COMUNITAT */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 md:mb-3">COMUNITAT</h3>
                    <nav className="space-y-1">
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-white bg-blue-500 rounded-lg transition-colors">
                        <span className="text-white">🏠</span>
                        <span className="text-xs md:text-sm font-medium">Xarxa Social</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">👤</span>
                        <span className="text-xs md:text-sm">El Meu Perfil</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">👥</span>
                        <span className="text-xs md:text-sm">Membres</span>
                      </a>
                      <button 
                        onClick={() => {
                          console.log('Desktop Grups clicked!');
                          window.location.href = '/grupos-avanzados';
                        }}
                        className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <span className="text-gray-600">👥</span>
                        <span className="text-xs md:text-sm">Grups</span>
                      </button>
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">💬</span>
                        <span className="text-xs md:text-sm">Missatges</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">💬</span>
                        <span className="text-xs md:text-sm">Fòrums</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-gray-600">📝</span>
                        <span className="text-xs md:text-sm">Blogs</span>
                      </a>
                    </nav>
                  </div>

                  {/* SERVICIOS */}
                  <div className="mb-3 md:mb-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">SERVEIS</h3>
                    <nav className="space-y-1">
                      <a href="#" className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-1.5 md:py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
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

          {/* COLUMNA 2 - Widgets Seguint/Grups - Oculto en móvil */}
          <div className={`${activeSection === 'seguint' || activeSection === 'grups' ? 'block lg:block' : 'hidden md:hidden lg:block'} lg:col-span-2`}>
            <div className="sticky top-24 space-y-6">
              
              {/* Seguint section */}
              <div className={`${activeSection === 'seguint' || activeSection === 'feed' ? 'block' : 'hidden lg:block'} bg-white rounded-lg shadow-sm border`}>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-green-600">👥</span>
                    <h3 className="font-semibold text-gray-900">Seguint</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ACTIUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900">
                      RECENTS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Usuario Roberto */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      RJ
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Roberto Jiménez</div>
                      <div className="text-xs text-gray-500">@roberto_marketing</div>
                    </div>
                  </div>
                  
                  {/* Usuario Carmen */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      CR
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Carmen Ruiz</div>
                      <div className="text-xs text-gray-500">@carmen_designer</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Grups section */}
              <div className={`${activeSection === 'grups' || activeSection === 'feed' ? 'block' : 'hidden lg:block'} bg-white rounded-lg shadow-sm border`}>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-blue-600">👥</span>
                    <h3 className="font-semibold text-gray-900">Grups</h3>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-4">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600">
                      NOUS
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      ACTIUS
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  {/* Grupo Sevilla */}
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-300">
                      <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                        SG
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Sevilla Gastronomí...</div>
                      <div className="text-xs text-gray-500">1 membres</div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3 pt-3 border-t border-gray-100">
                    <button className="text-xs text-gray-600 hover:underline">VEURE TOT</button>
                  </div>
                </div>
              </div>

              {/* Anuncis section - Solo desktop */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Anuncis</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 3 - Feed Central */}
          <div className={`${activeSection === 'feed' ? 'block' : 'hidden md:block'} md:col-span-6 lg:col-span-6`}>
            <div className="space-y-6">
              
              {/* Formulari per crear posts */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 md:p-6">
                  <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Activitat</h1>
                  <FiltresFeed 
                    filtreActiu={filtre} 
                    onCanviarFiltre={setFiltre} 
                  />
                </div>
              </div>

              {/* Formulari de creació de posts */}
              <FormulariPost 
                onPublicar={crearPost as any}
                carregant={carregant}
              />

              {/* Llista de posts */}
              {posts.map(post => (
                <PostItem
                  key={post.id}
                  post={post}
                  onLike={ferLike}
                  onCompartir={compartir}
                  onAfegirComentari={afegirComentari}
                  onEliminarPost={eliminarPost}
                  onEditarPost={editarPost}
                  onPinnarPost={pinnarPost}
                  esAdmin={esAdmin}
                />
              ))}

              {/* Missatge si no hi ha posts */}
              {posts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <div className="text-gray-500 mb-2">📝</div>
                  <p className="text-gray-600">
                    No hi ha posts per mostrar amb aquest filtre.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA 4 - Widgets Perfil/Empreses */}
          <div className={`${activeSection === 'perfil' ? 'block' : 'hidden md:hidden lg:block'} lg:col-span-2`}>
            <div className="sticky top-24 space-y-6">
              
              {/* Completar perfil */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Completa el teu Perfil</h3>
                
                {/* Progreso circular */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="20, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600">20%</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Completar Perfil
                  </button>
                </div>

                {/* Lista de tareas */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-green-600">Informació general</span>
                    </div>
                    <span className="text-green-600 font-medium">5/6</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Experiència laboral</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de perfil</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Foto de portada</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-gray-600">Xarxes socials</span>
                    </div>
                    <span className="text-gray-500 font-medium">0/1</span>
                  </div>
                </div>
              </div>

              {/* Widget de Empresas */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Empreses</h3>
                  <button className="text-sm text-blue-600 hover:underline">Veure totes</button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      8
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Consultoria Empr...</div>
                      <div className="text-xs text-gray-500">
                        15 empleats • Sevilla
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      9
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Marketing Digital ...</div>
                      <div className="text-xs text-gray-500">
                        25 empleats • Barcelona
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-medium">
                      8
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">TechSolutions S.A.</div>
                      <div className="text-xs text-gray-500">
                        75 empleats • Madrid
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget de Sugerencias - Solo desktop */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Persones que potser coneixes</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      AV
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Ana Vega</div>
                      <div className="text-xs text-gray-500">Funcionària d'Hisenda</div>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline">Seguir</button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      JM
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">José Martín</div>
                      <div className="text-xs text-gray-500">Tècnic de Sistemes</div>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline">Seguir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}