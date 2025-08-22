'use client'

import { useState, useRef, useEffect } from 'react'
import { useMissatges } from '../../../contextos/MissatgesContext'
import { 
  MessageCircle, 
  Send, 
  Smile, 
  Paperclip, 
  X, 
  Minimize2,
  Maximize2,
  Archive,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react'

interface InterficieMissatgesProps {
  obert: boolean
  onTancar: () => void
  conversaId?: string
}

export default function InterficieMissatges({ 
  obert, 
  onTancar, 
  conversaId 
}: InterficieMissatgesProps) {
  const [missatge, setMissatge] = useState('')
  const [minimitzat, setMinimitzat] = useState(false)
  const [menuObert, setMenuObert] = useState(false)
  const missatgesRef = useRef<HTMLDivElement>(null)
  
  const { 
    conversaActiva, 
    obrirConversa, 
    tancarConversa, 
    enviarMissatge,
    arxivarConversa,
    obtenirNomConversa,
    marcarComLlegits
  } = useMissatges()

  // Obrir conversa automàticament si es passa un ID
  useEffect(() => {
    if (conversaId && obert) {
      console.log('🎯 useEffect: Obrint conversa', conversaId)
      obrirConversa(conversaId)
    }
  }, [conversaId, obert]) // Eliminem obrirConversa de les dependències per evitar bucle infinit

  // Scroll automàtic als nous missatges
  useEffect(() => {
    if (missatgesRef.current) {
      missatgesRef.current.scrollTop = missatgesRef.current.scrollHeight
    }
  }, [conversaActiva?.missatges])

  // Marcar missatges com llegits quan s'obre la conversa
  useEffect(() => {
    if (conversaActiva && obert && !minimitzat) {
      marcarComLlegits(conversaActiva.id)
    }
  }, [conversaActiva?.id, obert, minimitzat]) // Eliminem marcarComLlegits i usem només l'ID

  const handleEnviarMissatge = async () => {
    console.log('🟡 Intentant enviar missatge:', missatge)
    console.log('🟡 Conversa activa:', conversaActiva)
    
    if (!missatge.trim() || !conversaActiva) {
      console.log('🔴 No es pot enviar - missatge buit o no hi ha conversa activa')
      return
    }
    
    try {
      console.log('🟢 Cridant enviarMissatge amb ID:', conversaActiva.id)
      await enviarMissatge(conversaActiva.id, missatge)
      console.log('🟢 Netejant el textarea...')
      setMissatge('')
      console.log('🟢 Missatge enviat i textarea netejat')
    } catch (error) {
      console.error('🔴 Error enviant missatge:', error)
      alert('Error enviant el missatge: ' + (error as Error).message)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviarMissatge()
    }
  }

  const formatearTemps = (data: Date) => {
    const ara = new Date()
    const esAvui = data.toDateString() === ara.toDateString()
    
    if (esAvui) {
      return data.toLocaleTimeString('ca-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    return data.toLocaleDateString('ca-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleTancar = () => {
    tancarConversa()
    onTancar()
  }

  if (!obert) return null

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-4 border-blue-500 z-50 transition-all duration-200 ${
      minimitzat ? 'h-14' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          {conversaActiva ? (
            <>
              {/* Avatar de l'altre participant */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {conversaActiva.participantsDetall?.[0]?.avatar ? (
                  <img 
                    src={conversaActiva.participantsDetall[0].avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <MessageCircle size={16} className="text-gray-600" />
                )}
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {conversaActiva.participantsDetall?.[0]?.nom || 'Conversa'}
                </h3>
                <p className="text-xs text-gray-500">
                  {conversaActiva.participantsDetall?.[0]?.estat === 'online' 
                    ? 'En línia' 
                    : 'Fora de línia'
                  }
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <MessageCircle size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Missatges</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {conversaActiva && (
            <>
              <button 
                onClick={() => setMenuObert(!menuObert)}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-gray-600" />
              </button>
              
              {/* Menu desplegable */}
              {menuObert && (
                <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      arxivarConversa(conversaActiva.id)
                      setMenuObert(false)
                    }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Archive size={14} />
                    <span>Arxivar conversa</span>
                  </button>
                  <button
                    onClick={() => setMenuObert(false)}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Info size={14} />
                    <span>Informació</span>
                  </button>
                </div>
              )}
            </>
          )}
          
          <button 
            onClick={() => setMinimitzat(!minimitzat)}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {minimitzat ? (
              <Maximize2 size={16} className="text-gray-600" />
            ) : (
              <Minimize2 size={16} className="text-gray-600" />
            )}
          </button>
          
          <button 
            onClick={handleTancar}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {!minimitzat && (
        <>
          {/* Contingut dels missatges */}
          <div 
            ref={missatgesRef}
            className="flex-1 overflow-y-auto p-3 space-y-3"
            style={{ height: 'calc(100% - 112px)' }}
          >
            {conversaActiva ? (
              conversaActiva.missatges.length > 0 ? (
                conversaActiva.missatges.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.emissor === 'user-1' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${
                      msg.emissor === 'user-1'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.contingut}</p>
                      <p className={`text-xs mt-1 ${
                        msg.emissor === 'user-1' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatearTemps(msg.data)}
                        {msg.editat && <span className="ml-1">(editat)</span>}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>Encara no hi ha missatges</p>
                  <p className="text-xs">Envia el primer missatge per començar la conversa</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Selecciona una conversa</p>
              </div>
            )}
          </div>

          {/* Input per enviar missatges */}
          {conversaActiva && (
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={missatge}
                    onChange={(e) => {
                      console.log('📝 Canvi en textarea:', e.target.value)
                      setMissatge(e.target.value)
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Escriu un missatge..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                    style={{ maxHeight: '100px' }}
                  />
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile size={16} className="text-gray-600" />
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={16} className="text-gray-600" />
                  </button>
                  
                  <button
                    onClick={handleEnviarMissatge}
                    disabled={!missatge.trim()}
                    className={`p-2 rounded-lg transition-colors ${
                      missatge.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}