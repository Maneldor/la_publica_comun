'use client'

import { useState } from 'react'
import { Post } from '../../../../hooks/useFeedSocial'
import ComentarisPost from './ComentarisPost'
import ModalCompartir from './ModalCompartir'
import MenuPost from './MenuPost'
import ModalEditarPost from './ModalEditarPost'

interface PostItemProps {
  post: Post
  onLike: (postId: string) => void
  onCompartir: (postId: string) => void
  onAfegirComentari: (postId: string, contingut: string) => void
  onEliminarPost: (postId: string) => void
  onEditarPost: (postId: string, nouContingut: string) => void
  onPinnarPost: (postId: string) => void
  esAdmin?: boolean
}

export default function PostItem({ 
  post, 
  onLike, 
  onCompartir, 
  onAfegirComentari, 
  onEliminarPost, 
  onEditarPost, 
  onPinnarPost, 
  esAdmin = false 
}: PostItemProps) {
  const { autor, contingut, imatge, dataCreacio, interaccions, comentaris, esPropiPost, estaPinnat } = post
  const [mostrarComentaris, setMostrarComentaris] = useState(false)
  const [modalCompartirObert, setModalCompartirObert] = useState(false)
  const [modalEditarObert, setModalEditarObert] = useState(false)

  const handleLike = () => {
    onLike(post.id)
  }

  const handleCompartir = () => {
    setModalCompartirObert(true)
  }

  const handleComentar = () => {
    setMostrarComentaris(!mostrarComentaris)
  }

  const handleEliminarPost = () => {
    if (window.confirm('Estàs segur que vols eliminar aquesta publicació?')) {
      onEliminarPost(post.id)
    }
  }

  const handleReportar = () => {
    alert('Gràcies per reportar. L\'equip revisarà aquesta publicació.')
  }

  const handleEditar = () => {
    setModalEditarObert(true)
  }

  const handleGuardarEdicio = (nouContingut: string) => {
    onEditarPost(post.id, nouContingut)
  }

  const handlePinnar = () => {
    onPinnarPost(post.id)
  }

  return (
    <div id={`post-${post.id}`} className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow ${estaPinnat ? 'ring-2 ring-purple-200 bg-purple-50' : ''}`}>
      {estaPinnat && (
        <div className="px-4 py-2 bg-purple-100 border-b border-purple-200">
          <div className="flex items-center space-x-2 text-sm text-purple-700">
            <span>📌</span>
            <span className="font-medium">Publicació pinnada</span>
          </div>
        </div>
      )}
      <div className="p-4">
        {/* Header del post */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium flex-shrink-0">
              {autor.inicials}
            </div>
            <div>
              <div className="font-medium text-gray-900 text-sm md:text-base">{autor.nom}</div>
              <div className="text-xs md:text-sm text-gray-500">{dataCreacio}</div>
            </div>
          </div>
          <MenuPost
            postId={post.id}
            esPropiPost={esPropiPost}
            esAdmin={esAdmin}
            estaPinnat={estaPinnat}
            onEditar={handleEditar}
            onEliminar={handleEliminarPost}
            onReportar={handleReportar}
            onPinnar={handlePinnar}
            onDespinnar={handlePinnar}
          />
        </div>

        {/* Contingut */}
        <div className="mb-3">
          <p className="text-gray-900 text-sm md:text-base whitespace-pre-wrap">{contingut}</p>
          
          {/* Imatge del post */}
          {imatge && (
            <div className="mt-3">
              <div className="w-full h-32 md:h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Imatge del post</span>
              </div>
            </div>
          )}
        </div>

        {/* Estadístiques d'interaccions */}
        {(interaccions.likes > 0 || interaccions.comentaris > 0) && (
          <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-500 mb-3">
            {interaccions.likes > 0 && (
              <span>❤️ {interaccions.likes} m'agrada{interaccions.likes !== 1 ? 'n' : ''}</span>
            )}
            {interaccions.comentaris > 0 && (
              <span>💬 {interaccions.comentaris} comentari{interaccions.comentaris !== 1 ? 's' : ''}</span>
            )}
            {interaccions.comparticions > 0 && (
              <span>↗️ {interaccions.comparticions} compartici{interaccions.comparticions !== 1 ? 'ons' : 'ó'}</span>
            )}
          </div>
        )}

        {/* Botons d'acció */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors ${
              interaccions.usuariHaFetLike 
                ? 'text-red-600 hover:bg-red-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>❤️</span>
            <span className="text-xs md:text-sm">M'agrada</span>
          </button>
          
          <button 
            onClick={handleComentar}
            className="flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>💬</span>
            <span className="text-xs md:text-sm">Comentar</span>
          </button>
          
          <button 
            onClick={handleCompartir}
            className="flex items-center space-x-1 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>↗️</span>
            <span className="text-xs md:text-sm">Compartir</span>
          </button>
        </div>

        {/* Sistema de comentaris */}
        <ComentarisPost
          postId={post.id}
          comentaris={comentaris}
          onAfegirComentari={onAfegirComentari}
          mostrarComentaris={mostrarComentaris || comentaris.length > 0}
        />
      </div>

      {/* Modal de compartir */}
      <ModalCompartir
        isOpen={modalCompartirObert}
        onClose={() => {
          setModalCompartirObert(false)
          onCompartir(post.id) // Increment comptador quan es tanca el modal
        }}
        postId={post.id}
        postContingut={contingut}
      />

      {/* Modal d'editar */}
      <ModalEditarPost
        isOpen={modalEditarObert}
        onClose={() => setModalEditarObert(false)}
        onGuardar={handleGuardarEdicio}
        contingutActual={contingut}
      />
    </div>
  )
}