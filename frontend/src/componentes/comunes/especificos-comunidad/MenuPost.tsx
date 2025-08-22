'use client'

import { useState, useRef, useEffect } from 'react'

interface MenuPostProps {
  postId: string
  esPropiPost: boolean
  esAdmin?: boolean
  estaPinnat?: boolean
  onEditar?: () => void
  onEliminar?: () => void
  onReportar?: () => void
  onPinnar?: () => void
  onDespinnar?: () => void
}

export default function MenuPost({ 
  postId, 
  esPropiPost,
  esAdmin = false,
  estaPinnat = false,
  onEditar, 
  onEliminar, 
  onReportar,
  onPinnar,
  onDespinnar
}: MenuPostProps) {
  const [menuObert, setMenuObert] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuObert(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action()
    }
    setMenuObert(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setMenuObert(!menuObert)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <span className="text-gray-400">⋯</span>
      </button>

      {menuObert && (
        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border z-20">
          <div className="py-1">
            {/* Opcions d'administrador (sempre visibles per admins) */}
            {esAdmin && (
              <>
                {estaPinnat ? (
                  <button
                    onClick={() => handleAction(onDespinnar!)}
                    className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <span>📌</span>
                    <span>Despinnar publicació</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(onPinnar!)}
                    className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                  >
                    <span>📌</span>
                    <span>Pinnar publicació</span>
                  </button>
                )}
                
                {!esPropiPost && (
                  <button
                    onClick={() => handleAction(onEliminar!)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span>🗑️</span>
                    <span>Eliminar publicació (Admin)</span>
                  </button>
                )}
                
                <div className="border-t border-gray-200 my-1" />
              </>
            )}

            {esPropiPost ? (
              <>
                {/* Opcions del propi post */}
                <button
                  onClick={() => handleAction(onEditar!)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>✏️</span>
                  <span>Editar publicació</span>
                </button>
                
                <button
                  onClick={() => handleAction(onEliminar!)}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>Eliminar publicació</span>
                </button>

                <div className="border-t border-gray-200 my-1" />

                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>🔗</span>
                  <span>Copiar enllaç</span>
                </button>
              </>
            ) : (
              <>
                {/* Opcions per posts d'altres */}
                <button
                  onClick={() => handleAction(onReportar!)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>⚠️</span>
                  <span>Reportar publicació</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>🔇</span>
                  <span>Silenciar usuari</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>🚫</span>
                  <span>Bloquejar usuari</span>
                </button>

                <div className="border-t border-gray-200 my-1" />

                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>🔗</span>
                  <span>Copiar enllaç</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>💾</span>
                  <span>Guardar publicació</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}