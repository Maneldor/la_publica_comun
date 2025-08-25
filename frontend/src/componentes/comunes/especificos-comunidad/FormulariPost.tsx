'use client'

import { useState, useRef } from 'react'
import { NovaPublicacio } from '../../../../hooks/useFeedSocial'
import ModeratedInput, { ModeratedInputRef } from '../ModeratedInput'

interface FormulariPostProps {
  onPublicar: (publicacio: NovaPublicacio) => Promise<void>
  carregant: boolean
}

export default function FormulariPost({ onPublicar, carregant }: FormulariPostProps) {
  const [imatge, setImatge] = useState<File | null>(null)
  const [expandit, setExpandit] = useState(false)
  const moderatedInputRef = useRef<ModeratedInputRef>(null)

  const handleSubmit = async (contingut: string, moderationResult: any) => {
    if (!moderatedInputRef.current) return

    try {
      await onPublicar({
        contingut,
        imatge: imatge || undefined,
        moderationResult
      })

      // Reset form solo si la publicación fue exitosa
      moderatedInputRef.current.reset()
      setImatge(null)
      setExpandit(false)
    } catch (error) {
      console.error('Error al publicar:', error)
    }
  }

  const handleFocus = () => {
    setExpandit(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImatge(file)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 md:p-6">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Activitat</h1>
        
        <div>
          {/* Input per crear post */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium flex-shrink-0">
              MA
            </div>
            
            <div className="flex-1">
              {expandit ? (
                <ModeratedInput
                  ref={moderatedInputRef}
                  multiline={true}
                  rows={4}
                  placeholder="Què estàs pensant, Manel?"
                  className="w-full bg-gray-100 focus:bg-white"
                  showSubmitButton={false}
                  disabled={carregant}
                  minLength={5}
                  maxLength={500}
                />
              ) : (
                <ModeratedInput
                  ref={moderatedInputRef}
                  multiline={false}
                  placeholder="Què estàs pensant, Manel?"
                  className="w-full bg-gray-100 rounded-full focus:bg-white"
                  showSubmitButton={false}
                  disabled={carregant}
                  minLength={5}
                  maxLength={500}
                  onChange={() => setExpandit(true)}
                />
              )}
            </div>
          </div>

          {/* Opcions expandides */}
          {expandit && (
            <div className="ml-11 md:ml-13 space-y-4">
              {/* Preview d'imatge */}
              {imatge && (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(imatge)} 
                    alt="Preview" 
                    className="max-w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImatge(null)}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Botons d'acció */}
              <div className="flex items-center justify-between">
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
                    <span className="flex items-center space-x-1">
                      📷 <span className="text-sm">Imatge</span>
                    </span>
                  </label>
                  
                  {/* Botó d'emoji */}
                  <button
                    type="button"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    disabled={carregant}
                  >
                    <span className="flex items-center space-x-1">
                      😊 <span className="text-sm">Emojis</span>
                    </span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExpandit(false)
                      moderatedInputRef.current?.reset()
                      setImatge(null)
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={carregant}
                  >
                    Cancel·lar
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (moderatedInputRef.current) {
                        const contingut = moderatedInputRef.current.getValue()
                        const moderationResult = moderatedInputRef.current.checkContent()
                        if (contingut.trim() && !moderatedInputRef.current.isContentBlocked()) {
                          handleSubmit(contingut, moderationResult)
                        }
                      }
                    }}
                    disabled={!moderatedInputRef.current?.getValue()?.trim() || carregant || moderatedInputRef.current?.isContentBlocked()}
                    className="px-4 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white"
                  >
                    {carregant ? 'Publicant...' : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}