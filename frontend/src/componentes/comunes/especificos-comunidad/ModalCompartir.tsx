'use client'

import { useState } from 'react'

interface ModalCompartirProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postContingut: string
}

export default function ModalCompartir({ isOpen, onClose, postId, postContingut }: ModalCompartirProps) {
  const [copiat, setCopiat] = useState(false)

  if (!isOpen) return null

  const urlPost = `${window.location.origin}/post/${postId}`

  const copiarEnllac = async () => {
    try {
      await navigator.clipboard.writeText(urlPost)
      setCopiat(true)
      setTimeout(() => setCopiat(false), 2000)
    } catch (err) {
      console.error('Error copiant l\'enllaç:', err)
    }
  }

  const compartirA = (plataforma: string) => {
    const text = encodeURIComponent(postContingut.slice(0, 100) + '...')
    const url = encodeURIComponent(urlPost)
    
    let shareUrl = ''
    
    switch (plataforma) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Compartir publicació
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-gray-400">✕</span>
            </button>
          </div>

          {/* Opcions de compartir */}
          <div className="space-y-3">
            {/* Copiar enllaç */}
            <button
              onClick={copiarEnllac}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                🔗
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">
                  {copiat ? 'Enllaç copiat!' : 'Copiar enllaç'}
                </div>
                <div className="text-sm text-gray-500">
                  Copia l'enllaç per compartir-lo on vulguis
                </div>
              </div>
            </button>

            {/* Xarxes socials */}
            <button
              onClick={() => compartirA('whatsapp')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                📱
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">WhatsApp</div>
                <div className="text-sm text-gray-500">Compartir via WhatsApp</div>
              </div>
            </button>

            <button
              onClick={() => compartirA('twitter')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                🐦
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Twitter</div>
                <div className="text-sm text-gray-500">Compartir a Twitter</div>
              </div>
            </button>

            <button
              onClick={() => compartirA('facebook')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                📘
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Facebook</div>
                <div className="text-sm text-gray-500">Compartir a Facebook</div>
              </div>
            </button>

            <button
              onClick={() => compartirA('linkedin')}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                💼
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">LinkedIn</div>
                <div className="text-sm text-gray-500">Compartir a LinkedIn</div>
              </div>
            </button>

            {/* Compartir dins la comunitat */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  👥
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">Enviar a companys</div>
                  <div className="text-sm text-gray-500">Compartir amb membres de la comunitat</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}