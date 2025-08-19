'use client'

import { useState } from 'react'

export interface Comentari {
  id: string
  autor: {
    nom: string
    inicials: string
  }
  contingut: string
  dataCreacio: string
}

interface ComentarisPostProps {
  postId: string
  comentaris: Comentari[]
  onAfegirComentari: (postId: string, contingut: string) => void
  mostrarComentaris: boolean
}

export default function ComentarisPost({ 
  postId, 
  comentaris, 
  onAfegirComentari, 
  mostrarComentaris 
}: ComentarisPostProps) {
  const [nouComentari, setNouComentari] = useState('')
  const [mostrarFormulari, setMostrarFormulari] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nouComentari.trim()) return

    onAfegirComentari(postId, nouComentari.trim())
    setNouComentari('')
    setMostrarFormulari(false)
  }

  // Sempre mostrar si hi ha comentaris existents o si s'ha activat mostrarComentaris
  if (!mostrarComentaris && comentaris.length === 0) {
    return null
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {/* Llista de comentaris existents - sempre visible si hi ha comentaris */}
      {comentaris.length > 0 && (
        <div className="space-y-3 mb-3">
          {comentaris.map(comentari => (
            <div key={comentari.id} className="flex space-x-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {comentari.autor.inicials}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {comentari.autor.nom}
                  </div>
                  <div className="text-sm text-gray-700">
                    {comentari.contingut}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-3">
                  {comentari.dataCreacio}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulari per afegir comentari */}
      {mostrarFormulari ? (
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            MA
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={nouComentari}
              onChange={(e) => setNouComentari(e.target.value)}
              placeholder="Escriu un comentari..."
              className="w-full px-3 py-2 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulari(false)
                  setNouComentari('')
                }}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                disabled={!nouComentari.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Comentar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setMostrarFormulari(true)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Escriu un comentari...
        </button>
      )}
    </div>
  )
}