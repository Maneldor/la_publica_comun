'use client'

import { useState } from 'react'
import { useFeedSocial } from '../../hooks/useFeedSocial'
import FormulariPost from '../../src/componentes/comunes/especificos-comunidad/FormulariPost'
import PostItem from '../../src/componentes/comunes/especificos-comunidad/PostItem'
import FiltresFeed from '../../src/componentes/comunes/especificos-comunidad/FiltresFeed'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import { MissatgesGlobal } from '../../src/componentes/comunes/especificos-comunidad/MissatgesGlobal'
import { useGruposAvanzados } from '../../src/contextos/GruposAvanzadosContext'

export default function XarxaSocialPage() {
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
    <LayoutGeneral paginaActual="xarxa-social">
      {/* Tarjetas de estadísticas */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-3 mb-4">
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

      {/* Grid principal de 3 columnas de contenido con proporciones específicas */}
      <div className="lg:grid lg:grid-cols-[280px_1fr_320px] lg:gap-4">

        {/* COLUMNA 1 - Seguint - Solo desktop */}
        <div className="hidden lg:block">
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

        {/* COLUMNA 2 - Contenido principal (Feed) */}
        <div>
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
                  {...{
                    onCrearPost: crearPost,
                    carregant: carregant
                  } as any}
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
                    {...{
                      key: post.id,
                      post: post,
                      onLike: () => ferLike(post.id),
                      onShare: () => compartir(post.id),
                      onComment: (comentari: any) => afegirComentari(post.id, comentari),
                      onDelete: () => eliminarPost(post.id),
                      onEdit: (contengut: any) => editarPost(post.id, contengut),
                      onPin: () => pinnarPost(post.id),
                      esAdmin: esAdmin
                    } as any}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA 3 - Perfil y widgets - Solo desktop */}
        <div className="hidden lg:block">
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

      {/* Component global de missatges */}
      <MissatgesGlobal />
    </LayoutGeneral>
  )
}