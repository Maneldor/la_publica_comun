'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useMensajeriaData, useMensajeriaUI } from '@/contextos/MensajeriaContext'
import { Mensaje, Conversacion, TipoMensaje } from '../../../tipos/mensajes'
import { 
  MoreVertical, Phone, Video, Info, Send, Paperclip, 
  Smile, Mic, Image, X, Download, Reply, Copy, Trash2,
  CheckCheck, Check, Clock, AlertCircle
} from 'lucide-react'
import MessageInput from './MessageInput'

interface ChatWindowProps {
  conversacio: Conversacion
}

// ✅ COMPONENTE PRINCIPAL: Ventana de chat optimizada
export default function ChatWindow({ conversacio }: ChatWindowProps) {
  const { 
    missatges, 
    usuarisEscrivint, 
    enviarMissatge, 
    marcarComLlegit, 
    iniciarTrucada,
    cargando 
  } = useMensajeriaData()
  const { mostrarDetallsConversa, setMostrarDetallsConversa } = useMensajeriaUI()
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [missatgeSeleccionat, setMissatgeSeleccionat] = useState<string | null>(null)

  // ✅ SCROLL AUTOMÁTICO: Solo cuando hay mensajes nuevos
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [missatges])

  // ✅ MARCAR COMO LEÍDOS: Cuando el usuario ve los mensajes
  useEffect(() => {
    const missatgesConversacio = missatges[conversacio.id] || []
    const missatgesNoLlegits = missatgesConversacio.filter((m: Mensaje) => 
      m.conversacioId === conversacio.id && 
      m.estat !== 'llegit' && 
      m.autorId !== 'current-user-id' // TODO: Get from auth context
    )

    missatgesNoLlegits.forEach((missatge: Mensaje) => {
      marcarComLlegit(conversacio.id, [missatge.id])
    })
  }, [missatges, conversacio.id, marcarComLlegit])

  const handleEnviarMissatge = useCallback(async (
    text: string, 
    tipus: TipoMensaje = 'text', 
    arxiu?: File
  ) => {
    await enviarMissatge({
      conversacioId: conversacio.id,
      text,
      tipus,
      arxiu
    })
  }, [conversacio.id, enviarMissatge])

  const handleIniciarTrucada = useCallback((tipus: 'audio' | 'video') => {
    iniciarTrucada(conversacio.id, tipus)
  }, [conversacio.id, iniciarTrucada])

  const usuarisEscrivintEnAquesta = usuarisEscrivint.filter(
    u => u.conversacioId === conversacio.id && u.actiu
  )

  const missatgesConversa = (missatges[conversacio.id] || [])
    .sort((a: Mensaje, b: Mensaje) => new Date(a.dataCreacio).getTime() - new Date(b.dataCreacio).getTime())

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ✅ HEADER DE CONVERSACIÓN */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <img
            src={conversacio.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversacio.nom || 'Usuario')}&background=random`}
            alt={conversacio.nom}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-medium text-gray-900">
              {conversacio.nom || 'Conversa'}
            </h2>
            <p className="text-xs text-gray-500">
              {conversacio.tipus === 'grupo' 
                ? `${conversacio.participants.length} participants`
                : 'En línia fa 5 minuts' // TODO: Real status
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleIniciarTrucada('audio')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Trucar"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => handleIniciarTrucada('video')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Videotrucada"
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setMostrarDetallsConversa(!mostrarDetallsConversa)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Informació"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* ✅ ÁREA DE MENSAJES */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {cargando && missatgesConversa.length === 0 ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <MensajeSkeletonLoader key={i} esPropio={i % 2 === 0} />
            ))}
          </div>
        ) : missatgesConversa.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
            </div>
            <p className="text-sm font-medium">Comença una conversa</p>
            <p className="text-xs text-center mt-1">
              Envia el teu primer missatge per començar a xatejar amb {conversacio.nom}
            </p>
          </div>
        ) : (
          <>
            {missatgesConversa.map((missatge: Mensaje, index: number) => {
              const missatgeAnterior = index > 0 ? missatgesConversa[index - 1] : null
              const esGrupMissatges = missatgeAnterior && 
                missatgeAnterior.autorId === missatge.autorId &&
                new Date(missatge.dataCreacio).getTime() - new Date(missatgeAnterior.dataCreacio).getTime() < 5 * 60 * 1000 // 5 minuts

              return (
                <MensajeItem
                  key={missatge.id}
                  missatge={missatge}
                  esGrupMissatges={!!esGrupMissatges}
                  esSeleccionat={missatge.id === missatgeSeleccionat}
                  onSeleccionar={setMissatgeSeleccionat}
                  conversacio={conversacio}
                />
              )
            })}

            {/* ✅ INDICADOR DE ESCRITURA */}
            {usuarisEscrivintEnAquesta.length > 0 && (
              <div className="flex items-center space-x-2">
                <img
                  src={`https://ui-avatars.com/api/?name=Usuario&background=random`}
                  alt="Escrivint"
                  className="w-6 h-6 rounded-full"
                />
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ✅ INPUT DE MENSAJE */}
      <MessageInput
        onEnviarMissatge={handleEnviarMissatge}
        onEscribint={() => {}} // TODO: Implement typing indicator
        placeholder={`Missatge a ${conversacio.nom}...`}
      />
    </div>
  )
}

// ✅ SUBCOMPONENTE: Item de mensaje optimizado
interface MensajeItemProps {
  missatge: Mensaje
  esGrupMissatges: boolean
  esSeleccionat: boolean
  onSeleccionar: (id: string | null) => void
  conversacio: Conversacion
}

function MensajeItem({ 
  missatge, 
  esGrupMissatges, 
  esSeleccionat, 
  onSeleccionar,
  conversacio 
}: MensajeItemProps) {
  const esPropio = missatge.autorId === 'current-user-id' // TODO: Get from auth context
  const [mostrarMenu, setMostrarMenu] = useState(false)

  const renderizarContingut = () => {
    switch (missatge.tipus) {
      case 'text':
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {missatge.text}
          </p>
        )
      
      case 'imatge':
        if (!missatge.arxiu) return null
        return (
          <div className="max-w-sm">
            <img
              src={missatge.arxiu.url}
              alt={missatge.arxiu.nom}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(missatge.arxiu?.url, '_blank')}
            />
            {missatge.text && (
              <p className="text-sm mt-2 leading-relaxed">{missatge.text}</p>
            )}
          </div>
        )
      
      case 'document':
        if (!missatge.arxiu) return null
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{missatge.arxiu.nom}</p>
              <p className="text-xs text-gray-500">
                {(missatge.arxiu.mida / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )
      
      default:
        return (
          <p className="text-sm text-gray-500 italic">
            Tipus de missatge no suportat: {missatge.tipus}
          </p>
        )
    }
  }

  const renderizarEstatMissatge = () => {
    if (!esPropio) return null

    switch (missatge.estat) {
      case 'enviando':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'enviado':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'entregado':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'llegit':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'} ${esGrupMissatges ? 'mt-1' : 'mt-4'}`}>
      <div className="max-w-[70%] group">
        {/* ✅ AVATAR (només si no és grup de missatges) */}
        {!esPropio && !esGrupMissatges && (
          <div className="flex items-end space-x-2 mb-1">
            <img
              src={`https://ui-avatars.com/api/?name=${missatge.autorId}&background=random`}
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
            {conversacio.tipus === 'grupo' && (
              <span className="text-xs text-gray-500 font-medium">
                Usuario {missatge.autorId.slice(0, 8)}
              </span>
            )}
          </div>
        )}

        {/* ✅ BURBUJA DE MENSAJE */}
        <div
          className={`relative px-4 py-2 rounded-2xl shadow-sm cursor-pointer transition-all ${
            esPropio
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md'
          } ${esSeleccionat ? 'ring-2 ring-blue-300' : ''}`}
          onClick={() => onSeleccionar(esSeleccionat ? null : missatge.id)}
        >
          {renderizarContingut()}

          {/* ✅ METADATA */}
          <div className={`flex items-center justify-end space-x-1 mt-1 ${
            esPropio ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">
              {new Date(missatge.dataCreacio).toLocaleTimeString('ca', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {renderizarEstatMissatge()}
          </div>

          {/* ✅ MENÚ CONTEXTUAL */}
          {esSeleccionat && (
            <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs hover:bg-gray-100">
                <Reply className="w-3 h-3" />
                <span>Respondre</span>
              </button>
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs hover:bg-gray-100">
                <Copy className="w-3 h-3" />
                <span>Copiar</span>
              </button>
              {esPropio && (
                <button className="flex items-center space-x-2 w-full px-3 py-2 text-xs hover:bg-gray-100 text-red-600">
                  <Trash2 className="w-3 h-3" />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ✅ SKELETON LOADER
function MensajeSkeletonLoader({ esPropio }: { esPropio: boolean }) {
  return (
    <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[70%] space-y-2">
        {!esPropio && (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        )}
        <div className={`p-4 rounded-2xl animate-pulse ${
          esPropio ? 'bg-gray-200 rounded-br-md' : 'bg-gray-100 rounded-bl-md'
        }`}>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}