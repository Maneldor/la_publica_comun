'use client'

import { useState } from 'react'
import { useFeedSocial } from '../../hooks/useFeedSocial'
import FormulariPost from '../../src/componentes/comunes/especificos-comunidad/FormulariPost'
import PostItem from '../../src/componentes/comunes/especificos-comunidad/PostItem'
import FiltresFeed from '../../src/componentes/comunes/especificos-comunidad/FiltresFeed'
import LayoutXarxaSocial from '../../src/componentes/comunes/LayoutXarxaSocial'
import { MissatgesGlobal } from '../../src/componentes/comunes/especificos-comunidad/MissatgesGlobal'
import { useGruposAvanzados } from '../../src/contextos/GruposAvanzadosContext'

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('feed')
  
  // Hook per gestionar el feed social
  const { posts, filtre, setFiltre, crearPost, ferLike, compartir, afegirComentari, eliminarPost, editarPost, pinnarPost, carregant } = useFeedSocial()
  
  // Hook per gestionar els grups
  const { grupos, esMiembroGrupo } = useGruposAvanzados()
  
  // Simular detecció d'usuari administrador (en una app real vindria del context d'autenticació)
  const esAdmin = true // TODO: obtenir del context d'usuari
  
  // Obtenir els meus grups
  const misGrupos = grupos.filter(grupo => esMiembroGrupo(grupo.id)).slice(0, 3)

  return (
    <LayoutXarxaSocial paginaActual="dashboard">
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
          
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <FormulariPost 
              onCrearPost={crearPost}
              carregant={carregant}
            />
          </div>
        </div>
        
        {/* Llista de posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No hi ha activitat encara</h3>
              <p className="text-gray-600">Sigues el primer en compartir alguna cosa!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post}
                onLike={() => ferLike(post.id)}
                onShare={() => compartir(post.id)}
                onComment={(comentari) => afegirComentari(post.id, comentari)}
                onDelete={() => eliminarPost(post.id)}
                onEdit={(contengut) => editarPost(post.id, contengut)}
                onPin={() => pinnarPost(post.id)}
                esAdmin={esAdmin}
              />
            ))
          )}
        </div>
      </div>

      {/* Component global de missatges */}
      <MissatgesGlobal />
    </LayoutXarxaSocial>
  )
}