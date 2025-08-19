'use client'

import { useState, useEffect, useRef } from 'react'
import { useBuscador, ResultatBusqueda } from '../../../../hooks/useBuscador'
import { Post } from '../../../../hooks/useFeedSocial'
import ModalPerfilUsuari from './ModalPerfilUsuari'

interface ModalBusquedaProps {
  isOpen: boolean
  onClose: () => void
  posts: Post[]
  terminiBusquedaInicial?: string
}

export default function ModalBusqueda({ 
  isOpen, 
  onClose, 
  posts, 
  terminiBusquedaInicial = '' 
}: ModalBusquedaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [modalPerfilObert, setModalPerfilObert] = useState(false)
  const [usuariSeleccionat, setUsuariSeleccionat] = useState<any>(null)
  
  const {
    terminiBusqueda,
    tipusFiltro,
    resultats,
    totalResultats,
    cercar,
    canviarFiltre,
    netejaBusqueda
  } = useBuscador(posts)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      if (terminiBusquedaInicial) {
        cercar(terminiBusquedaInicial)
      }
    }
  }, [isOpen, terminiBusquedaInicial, cercar])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cercar(e.target.value)
  }

  const handleClose = () => {
    netejaBusqueda()
    onClose()
  }

  const handleClickUsuari = (membre: any) => {
    setUsuariSeleccionat(membre)
    setModalPerfilObert(true)
  }

  const handleConnectar = (membre: any) => {
    // Lògica per connectar directament sense obrir el perfil
    alert(`Connectant amb ${membre.nom}...`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header amb buscador */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={terminiBusqueda}
                onChange={handleInputChange}
                placeholder="Cercar membres, grups, publicacions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Filtres */}
          <div className="flex space-x-2 mt-3">
            {(['tot', 'posts', 'membres', 'grups'] as const).map((tipus) => (
              <button
                key={tipus}
                onClick={() => canviarFiltre(tipus)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  tipusFiltro === tipus
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tipus === 'tot' ? 'Tot' : 
                 tipus === 'posts' ? 'Publicacions' :
                 tipus === 'membres' ? 'Membres' : 'Grups'}
              </button>
            ))}
          </div>
        </div>

        {/* Resultats */}
        <div className="overflow-y-auto max-h-96">
          {!terminiBusqueda.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg">Comença a escriure per cercar</p>
              <p className="text-sm">Pots cercar membres, grups, publicacions i més</p>
            </div>
          ) : totalResultats === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.625M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg">No s'han trobat resultats</p>
              <p className="text-sm">Prova amb altres termes de cerca</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Posts */}
              {resultats.posts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Publicacions ({resultats.posts.length})
                  </h3>
                  <div className="space-y-2">
                    {resultats.posts.map((post) => (
                      <div key={post.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {post.autor.inicials}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{post.autor.nom}</p>
                            <p className="text-xs text-gray-500">{post.dataCreacio}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{post.contingut}</p>
                        <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                          <span>❤️ {post.interaccions.likes}</span>
                          <span>💬 {post.interaccions.comentaris}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Membres */}
              {resultats.membres.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Membres ({resultats.membres.length})
                  </h3>
                  <div className="space-y-2">
                    {resultats.membres.map((membre) => (
                      <div key={membre.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-600 transition-colors"
                            onClick={() => handleClickUsuari(membre)}
                          >
                            {membre.inicials}
                          </div>
                          <div className="flex-1">
                            <button
                              onClick={() => handleClickUsuari(membre)}
                              className="font-medium text-left hover:text-blue-600 hover:underline transition-colors"
                            >
                              {membre.nom}
                            </button>
                            <p className="text-sm text-gray-500">{membre.rol}</p>
                          </div>
                          <div className="ml-auto">
                            <button 
                              onClick={() => handleConnectar(membre)}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Connectar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grups */}
              {resultats.grups.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Grups ({resultats.grups.length})
                  </h3>
                  <div className="space-y-2">
                    {resultats.grups.map((grup) => (
                      <div key={grup.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{grup.nom}</h4>
                            <p className="text-sm text-gray-600 mt-1">{grup.descripcio}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              👥 {grup.membres} membres
                            </p>
                          </div>
                          <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">
                            Unir-se
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de perfil d'usuari */}
      {usuariSeleccionat && (
        <ModalPerfilUsuari
          isOpen={modalPerfilObert}
          onClose={() => {
            setModalPerfilObert(false)
            setUsuariSeleccionat(null)
          }}
          usuari={usuariSeleccionat}
          esPerfilPropi={false}
        />
      )}
    </div>
  )
}