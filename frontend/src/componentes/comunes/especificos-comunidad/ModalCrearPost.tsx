'use client'

import { useState } from 'react'
import { NovaPublicacio } from '../../../../hooks/useFeedSocial'

interface ModalCrearPostProps {
  isOpen: boolean
  onClose: () => void
  onPublicar: (publicacio: NovaPublicacio) => Promise<void>
  carregant?: boolean
}

export default function ModalCrearPost({ 
  isOpen, 
  onClose, 
  onPublicar, 
  carregant = false 
}: ModalCrearPostProps) {
  const [contingut, setContingut] = useState('')
  const [imatge, setImatge] = useState<File | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contingut.trim()) return

    try {
      await onPublicar({
        contingut: contingut.trim(),
        imatge: imatge || undefined
      })

      // Reset form i tancar modal
      setContingut('')
      setImatge(null)
      onClose()
    } catch (error) {
      console.error('Error creant el post:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImatge(file)
    }
  }

  const handleClose = () => {
    if (!carregant) {
      setContingut('')
      setImatge(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full z-10 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Crear nova publicació
            </h2>
            <button 
              type="button"
              onClick={handleClose}
              disabled={carregant}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            >
              <span className="text-gray-400">✕</span>
            </button>
          </div>

          {/* Contingut */}
          <div className="p-4">
            {/* Usuari info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                MA
              </div>
              <div>
                <div className="font-medium text-gray-900">Manel Amador</div>
                <div className="text-sm text-gray-500">Publicant a La Pública</div>
              </div>
            </div>

            {/* Textarea per al contingut */}
            <div className="mb-4">
              <textarea
                value={contingut}
                onChange={(e) => setContingut(e.target.value)}
                placeholder="Què estàs pensant, Manel?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                rows={4}
                disabled={carregant}
                autoFocus
              />
            </div>

            {/* Preview d'imatge */}
            {imatge && (
              <div className="relative mb-4">
                <img 
                  src={URL.createObjectURL(imatge)} 
                  alt="Preview" 
                  className="max-w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImatge(null)}
                  disabled={carregant}
                  className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-opacity disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Opcions adicionals */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <span className="text-sm font-medium text-gray-700">Afegir a la teva publicació</span>
              <div className="flex items-center space-x-3">
                {/* Botó d'imatge */}
                <label className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={carregant}
                  />
                  <span className="text-xl">📷</span>
                </label>
                
                {/* Botó d'emoji */}
                <button
                  type="button"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-xl"
                  disabled={carregant}
                  title="Emojis"
                >
                  😊
                </button>

                {/* Botó d'ubicació */}
                <button
                  type="button"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-xl"
                  disabled={carregant}
                  title="Ubicació"
                >
                  📍
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {contingut.length}/500 caràcters
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={carregant}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                disabled={!contingut.trim() || carregant || contingut.length > 500}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {carregant ? 'Publicant...' : 'Publicar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}