'use client'

import { useState, useEffect } from 'react'

interface ModalEditarPostProps {
  isOpen: boolean
  onClose: () => void
  onGuardar: (nouContingut: string) => void
  contingutActual: string
  carregant?: boolean
}

export default function ModalEditarPost({ 
  isOpen, 
  onClose, 
  onGuardar, 
  contingutActual,
  carregant = false 
}: ModalEditarPostProps) {
  const [contingut, setContingut] = useState('')

  useEffect(() => {
    if (isOpen) {
      setContingut(contingutActual)
    }
  }, [isOpen, contingutActual])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (contingut.trim()) {
      onGuardar(contingut.trim())
      onClose()
    }
  }

  const caracteresRestants = 500 - contingut.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Editar Publicació</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <textarea
              value={contingut}
              onChange={(e) => setContingut(e.target.value)}
              placeholder="Què vols compartir?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              maxLength={500}
              disabled={carregant}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${caracteresRestants < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                {caracteresRestants} caràcters restants
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={carregant}
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={!contingut.trim() || carregant}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {carregant ? 'Guardant...' : 'Guardar Canvis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}