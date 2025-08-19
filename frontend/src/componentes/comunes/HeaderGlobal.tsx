'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePosts } from '../../contextos/PostsContext'
import ModalCrearPost from './especificos-comunidad/ModalCrearPost'
import ModalBusqueda from './especificos-comunidad/ModalBusqueda'
import ModalPerfilUsuari from './especificos-comunidad/ModalPerfilUsuari'
import { useCrearPostModal } from '../../../hooks/useCrearPostModal'
import { SelectorIdioma } from './SelectorIdioma'
import { useNotifications } from '../../contextos/NotificationsContext'
import NotificacionsHeader from './especificos-comunidad/NotificacionsHeader'
// Sistema de mensajería eliminado completamente

interface HeaderGlobalProps {
  botonsAddicionals?: React.ReactNode
  mostrarBotoMobilMenu?: boolean
  onToggleMobileMenu?: () => void
}

export default function HeaderGlobal({ 
  botonsAddicionals, 
  mostrarBotoMobilMenu = false, 
  onToggleMobileMenu 
}: HeaderGlobalProps) {
  const router = useRouter()
  const { posts, crearPost, carregant } = usePosts()
  const { modalObert, obrirModal, tancarModal } = useCrearPostModal()
  const [modalBusquedaObert, setModalBusquedaObert] = useState(false)
  const [terminiBusqueda, setTerminiBusqueda] = useState('')
  const [modalPerfilObert, setModalPerfilObert] = useState(false)
  const [usuariSeleccionat, setUsuariSeleccionat] = useState<any>(null)
  // Sistema de notificacions integrat directament al component

  const handleClickUsuari = (usuari: any) => {
    // Si es el usuario principal, ir a su perfil editable
    if (usuari.id === 'user-1') {
      router.push('/perfil')
    } else {
      // Para otros usuarios, abrir el modal de solo lectura
      setUsuariSeleccionat(usuari)
      setModalPerfilObert(true)
    }
  }

  // Datos de usuario de ejemplo para los perfiles del header
  const usuariPrincipal = {
    id: 'user-1',
    nom: 'Manel Amador',
    inicials: 'MA',
    rol: 'Administrador',
    avatar: '',
    email: 'manel@lapublica.com',
    estat: 'actiu'
  }

  return (
    <>
      {/* Header Responsive */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y búsqueda - Responsive */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Botó menú mòbil (opcional) */}
              {mostrarBotoMobilMenu && (
                <button 
                  onClick={onToggleMobileMenu}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white font-bold bg-blue-500">
                  LP
                </div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-gray-900">La pública</div>
                  <div className="text-xs text-gray-500">Comunitat Social</div>
                </div>
              </div>
              
              {/* Búsqueda - Oculta en móvil */}
              <div className="relative ml-4 hidden md:block">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={terminiBusqueda}
                  onChange={(e) => setTerminiBusqueda(e.target.value)}
                  onFocus={() => setModalBusquedaObert(true)}
                  placeholder="Cercar membres, grups, activitats..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            {/* Acciones del header - Responsive */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Selector d'idioma */}
              <SelectorIdioma />
              
              {/* Botons addicionals */}
              {botonsAddicionals}
              
              {/* Botón de invitaciones */}
              <button 
                onClick={() => router.push('/invitacions')}
                className="bg-green-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-1 md:space-x-2 hover:bg-green-700 transition-colors"
              >
                <span className="text-lg md:text-base">✉️</span>
                <span className="hidden sm:inline">Invitacions</span>
              </button>
              
              <button 
                onClick={obrirModal}
                className="bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center space-x-1 md:space-x-2 hover:bg-blue-600 transition-colors"
              >
                <span className="text-lg md:text-base">+</span>
                <span className="hidden sm:inline">Crear Publicació</span>
              </button>
              
              <div className="flex items-center space-x-1 md:space-x-2">
                {/* Component de notificacions integrat */}
                <NotificacionsHeader />
                
                {/* Botón de mensajería eliminado - sistema removido */}

                <button
                  onClick={() => handleClickUsuari(usuariPrincipal)}
                  className="w-7 h-7 md:w-8 md:h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer ml-2 md:ml-4"
                  title="Ver perfil de Manel Amador"
                >
                  MA
                </button>
              </div>
            </div>
          </div>

          {/* Búsqueda móvil */}
          <div className="md:hidden px-2 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={terminiBusqueda}
                onChange={(e) => setTerminiBusqueda(e.target.value)}
                onFocus={() => setModalBusquedaObert(true)}
                placeholder="Cercar..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Modal per crear posts des del header */}
      <ModalCrearPost
        isOpen={modalObert}
        onClose={tancarModal}
        onPublicar={async (publicacio) => { await crearPost(publicacio) }}
        carregant={carregant}
      />

      {/* Modal de búsqueda */}
      <ModalBusqueda
        isOpen={modalBusquedaObert}
        onClose={() => {
          setModalBusquedaObert(false)
          setTerminiBusqueda('')
        }}
        posts={posts}
        terminiBusquedaInicial={terminiBusqueda}
      />

      {/* Modal de perfil d'usuari */}
      {usuariSeleccionat && (
        <ModalPerfilUsuari
          isOpen={modalPerfilObert}
          onClose={() => {
            setModalPerfilObert(false)
            setUsuariSeleccionat(null)
          }}
          usuari={usuariSeleccionat}
          esPerfilPropi={usuariSeleccionat.id === 'user-1'}
        />
      )}

      {/* Sistema de mensajería completamente eliminado */}
    </>
  )
}