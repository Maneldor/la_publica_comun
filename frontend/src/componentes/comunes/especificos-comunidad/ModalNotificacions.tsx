'use client'

import { useNotifications } from '../../../contextos/NotificationsContext'

interface ModalNotificacionsProps {
  isOpen: boolean
  onClose: () => void
}

const navegarAEnllaç = (notificacio: any) => {
  if (!notificacio.enllaç) return

  const { tipus, id, comentariId } = notificacio.enllaç

  switch (tipus) {
    case 'post':
      // Scrollar al post específic del feed
      const postElement = document.getElementById(`post-${id}`)
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth' })
        postElement.classList.add('animate-pulse')
        setTimeout(() => postElement.classList.remove('animate-pulse'), 2000)
      }
      break
      
    case 'comentari':
      // Scrollar al comentari específic
      const commentElement = document.getElementById(`comment-${comentariId}`)
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth' })
        commentElement.classList.add('bg-yellow-100', 'animate-pulse')
        setTimeout(() => {
          commentElement.classList.remove('bg-yellow-100', 'animate-pulse')
        }, 3000)
      } else {
        // Si no troba el comentari, va al post
        navegarAEnllaç({ enllaç: { tipus: 'post', id } })
      }
      break
      
    case 'perfil':
      // Simular navegació a perfil (en una app real seria amb router)
      console.log(`Navegant al perfil: ${id}`)
      break
      
    case 'missatge':
      // Simular navegació a missatges
      console.log(`Obrint conversa: ${id}`)
      break
      
    case 'grup':
      // Simular navegació a grup
      console.log(`Navegant al grup: ${id}`)
      break
  }
}

export default function ModalNotificacions({ isOpen, onClose }: ModalNotificacionsProps) {
  const { notificacions, marcarComLlegida, marcarTotesComLlegides } = useNotifications()

  if (!isOpen) return null

  const getIcono = (tipus: string) => {
    switch (tipus) {
      case 'like': return '❤️'
      case 'comentari': return '💬'
      case 'missatge': return '✉️'
      case 'seguiment': return '👤'
      case 'grup': return '👥'
      default: return '🔔'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'ara mateix'
    if (minutes < 60) return `fa ${minutes}m`
    if (hours < 24) return `fa ${hours}h`
    return `fa ${days}d`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notificacions</h2>
          <div className="flex items-center space-x-2">
            {notificacions.some(n => !n.llegida) && (
              <button
                onClick={marcarTotesComLlegides}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Marcar totes
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Llista de notificacions */}
        <div className="overflow-y-auto max-h-80">
          {notificacions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <span className="text-4xl block mb-2">🔔</span>
              No tens notificacions
            </div>
          ) : (
            notificacions.map((notificacio) => (
              <div
                key={notificacio.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notificacio.llegida ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  marcarComLlegida(notificacio.id)
                  if (notificacio.enllaç) {
                    navegarAEnllaç(notificacio)
                    onClose() // Tancar modal després de navegar
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notificacio.usuari ? (
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {notificacio.usuari.inicials}
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        {getIcono(notificacio.tipus)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notificacio.titol}
                      </p>
                      {!notificacio.llegida && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notificacio.descripcio}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notificacio.dataCreacio)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notificacions.length > 0 && (
          <div className="p-3 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Veure totes les notificacions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}