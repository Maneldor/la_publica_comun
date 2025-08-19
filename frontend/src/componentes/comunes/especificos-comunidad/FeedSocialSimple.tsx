'use client'

import { useState } from 'react'
import HeaderGlobal from '../HeaderGlobal'

export default function FeedSocialSimple() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Posts estáticos sin hooks problemáticos
  const posts = [
    {
      id: '1',
      autor: {
        nom: 'Gestor Empresa',
        inicials: 'GE',
        rol: 'Gestor Empresarial'
      },
      contingut: 'Fent proves amb arxius',
      dataCreacio: '5 ago 2025',
      interaccions: {
        likes: 3,
        comentaris: 1,
        comparticions: 0
      }
    }
  ]

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
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contingut principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar esquerra */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Navegació</h3>
              <nav className="space-y-2">
                <a href="#" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  🏠 Inici
                </a>
                <a href="#" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  👤 Perfil
                </a>
                <a href="#" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  👥 Grups
                </a>
              </nav>
            </div>
          </div>

          {/* Contingut central */}
          <div className="lg:col-span-6">
            {/* Formulari per crear post */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Què vols compartir?"
              />
              <div className="flex justify-end mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Publicar
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{post.autor.inicials}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.autor.nom}</h3>
                      <p className="text-sm text-gray-600">{post.autor.rol}</p>
                    </div>
                    <span className="text-sm text-gray-500 ml-auto">{post.dataCreacio}</span>
                  </div>
                  
                  <p className="text-gray-800 mb-4">{post.contingut}</p>
                  
                  <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>❤️</span>
                      <span className="text-sm">{post.interaccions.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>💬</span>
                      <span className="text-sm">{post.interaccions.comentaris}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>📤</span>
                      <span className="text-sm">{post.interaccions.comparticions}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar dreta */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Activitat Recent</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p>Nou membre unit: <span className="font-medium">Maria Garcia</span></p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Nou grup creat: <span className="font-medium">Oposicions 2024</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}