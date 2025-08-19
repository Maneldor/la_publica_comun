'use client'

import { useState } from 'react'
import { AlertTriangle, X, Users, Lock } from 'lucide-react'

interface ModalConfirmacioGrupProps {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => Promise<void>
  grupNom: string
  grupActualNom?: string
  esRestriccioBloqueig: boolean
}

export default function ModalConfirmacioGrup({ 
  isOpen, 
  onClose, 
  onConfirmar, 
  grupNom,
  grupActualNom,
  esRestriccioBloqueig 
}: ModalConfirmacioGrupProps) {
  const [carregant, setCarregant] = useState(false)

  if (!isOpen) return null

  const handleConfirmar = async () => {
    setCarregant(true)
    try {
      await onConfirmar()
      onClose()
    } catch (error) {
      console.error('Error confirmant acció:', error)
    } finally {
      setCarregant(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {esRestriccioBloqueig ? (
              <AlertTriangle className="text-red-500" size={24} />
            ) : (
              <Lock className="text-yellow-500" size={24} />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {esRestriccioBloqueig ? 'Accés restringit' : 'Unir-se al grup'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contingut */}
        <div className="px-6 py-4">
          {esRestriccioBloqueig ? (
            // Cas: No es pot unir perquè ja té un grup privat
            <div>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-1">
                      No pots unir-te a aquest grup
                    </h3>
                    <p className="text-sm text-red-700">
                      Ja ets membre d'un grup privat/professional i només es permet estar en un grup d'aquest tipus alhora.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">El teu grup actual:</h4>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Users size={16} className="text-blue-500" />
                    <div>
                      <p className="font-medium text-blue-800">{grupActualNom}</p>
                      <p className="text-sm text-blue-600">Grup privat professional</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Grup sol·licitat:</h4>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Lock size={16} className="text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800">{grupNom}</p>
                      <p className="text-sm text-orange-600">Grup privat professional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">S'ha enviat una alerta</h4>
                    <p className="text-sm text-yellow-700">
                      Els administradors han estat notificats d'aquest intent per poder revisar la situació.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Possible solució:</strong> Si vols canviar-te a aquest grup, primer hauràs d'abandonar el teu grup actual i després sol·licitar l'accés al nou grup.</p>
              </div>
            </div>
          ) : (
            // Cas: Pot unir-se al grup privat
            <div>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Lock size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">
                      Sol·licitud d'accés al grup privat
                    </h3>
                    <p className="text-sm text-blue-700">
                      Aquest és un grup privat que requereix aprovació dels administradors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Lock size={16} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">{grupNom}</p>
                    <p className="text-sm text-gray-600">Grup privat professional</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Important</h4>
                    <p className="text-sm text-yellow-700">
                      Només pots ser membre d'un grup privat/professional alhora. Aquest serà el teu únic grup d'aquest tipus.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Què passarà:</strong> S'enviarà la teva sol·licitud als administradors del grup per a la seva aprovació. Rebràs una notificació quan revisin la teva sol·licitud.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {esRestriccioBloqueig ? 'Entesos' : 'Cancel·lar'}
          </button>
          
          {!esRestriccioBloqueig && (
            <button
              onClick={handleConfirmar}
              disabled={carregant}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {carregant ? 'Enviant...' : 'Enviar sol·licitud'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}