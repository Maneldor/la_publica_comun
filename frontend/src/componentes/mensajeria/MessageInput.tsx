'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { PropietatsMessageInput, TipoMensaje } from '../../../tipos/mensajes'
import { 
  Send, Paperclip, Smile, Mic, Image, X, 
  FileText, Video, MapPin, Plus
} from 'lucide-react'

// ✅ COMPONENTE OPTIMIZADO: Input de mensaje con funcionalidades avanzadas
export default function MessageInput({
  onEnviarMissatge,
  onEscribint,
  desactivat = false,
  placeholder = "Escriu un missatge..."
}: PropietatsMessageInput) {
  const [text, setText] = useState('')
  const [adjuntant, setAdjuntant] = useState(false)
  const [mostrarEmojis, setMostrarEmojis] = useState(false)
  const [gravantAudio, setGravantAudio] = useState(false)
  const [mostrarOpcionsAdjunt, setMostrarOpcionsAdjunt] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ✅ TÉCNICA: Auto-resize del textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 120) // Max 120px
      textarea.style.height = `${newHeight}px`
    }
  }, [])

  const handleTextChange = useCallback((value: string) => {
    setText(value)
    adjustTextareaHeight()
    
    // Indicador de escritura
    if (value.trim() && !desactivat) {
      onEscribint?.(true)
      
      // Timeout para parar el indicador
      const timeout = setTimeout(() => {
        onEscribint?.(false)
      }, 1000)
      
      return () => clearTimeout(timeout)
    } else {
      onEscribint?.(false)
    }
  }, [onEscribint, desactivat, adjustTextareaHeight])

  const handleEnviar = useCallback(async () => {
    const textTrimmed = text.trim()
    if (!textTrimmed || adjuntant || desactivat) return

    try {
      setAdjuntant(true)
      await onEnviarMissatge(textTrimmed, 'text')
      setText('')
      adjustTextareaHeight()
      onEscribint?.(false)
    } catch (error) {
      console.error('Error enviant missatge:', error)
    } finally {
      setAdjuntant(false)
    }
  }, [text, adjuntant, desactivat, onEnviarMissatge, adjustTextareaHeight, onEscribint])

  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }, [handleEnviar])

  // ✅ GESTIÓN DE ARCHIVOS
  const handleFileSelect = useCallback(async (file: File, tipo: TipoMensaje) => {
    if (desactivat) return

    try {
      setAdjuntant(true)
      setMostrarOpcionsAdjunt(false)
      
      await onEnviarMissatge(
        file.type.startsWith('image/') ? '' : `📎 ${file.name}`, 
        tipo, 
        file
      )
    } catch (error) {
      console.error('Error enviant arxiu:', error)
    } finally {
      setAdjuntant(false)
    }
  }, [desactivat, onEnviarMissatge])

  const triggerFileInput = useCallback((acceptTypes: string, tipoMensaje: TipoMensaje) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptTypes
      fileInputRef.current.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          handleFileSelect(file, tipoMensaje)
        }
      }
      fileInputRef.current.click()
    }
  }, [handleFileSelect])

  // ✅ GRABACIÓN DE AUDIO
  const iniciarGravacioAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, {
          type: 'audio/webm'
        })
        
        handleFileSelect(audioFile, 'audio')
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setGravantAudio(true)
    } catch (error) {
      console.error('Error iniciant gravació:', error)
    }
  }, [handleFileSelect])

  const pararGravacioAudio = useCallback(() => {
    if (mediaRecorderRef.current && gravantAudio) {
      mediaRecorderRef.current.stop()
      setGravantAudio(false)
    }
  }, [gravantAudio])

  // ✅ EMOJIS RÁPIDOS
  const emojisRapidos = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥']

  const afegirEmoji = useCallback((emoji: string) => {
    setText(prev => prev + emoji)
    setMostrarEmojis(false)
    textareaRef.current?.focus()
  }, [])

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* ✅ PANEL DE EMOJIS */}
      {mostrarEmojis && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {emojisRapidos.map(emoji => (
              <button
                key={emoji}
                onClick={() => afegirEmoji(emoji)}
                className="text-xl hover:bg-white rounded p-1 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ OPCIONES DE ADJUNTOS */}
      {mostrarOpcionsAdjunt && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => triggerFileInput('image/*', 'imatge')}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Image className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Imatge</span>
            </button>
            
            <button
              onClick={() => triggerFileInput('video/*', 'video')}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Vídeo</span>
            </button>
            
            <button
              onClick={() => triggerFileInput('*/*', 'document')}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Document</span>
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement location sharing
                console.log('Compartir ubicació')
                setMostrarOpcionsAdjunt(false)
              }}
              className="flex flex-col items-center space-y-2 p-3 hover:bg-white rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600">Ubicació</span>
            </button>
          </div>
        </div>
      )}

      {/* ✅ ÁREA PRINCIPAL DE INPUT */}
      <div className="flex items-end space-x-3">
        {/* ✅ BOTÓN DE ADJUNTAR */}
        <button
          onClick={() => setMostrarOpcionsAdjunt(!mostrarOpcionsAdjunt)}
          disabled={desactivat || adjuntant}
          className={`p-2 rounded-full transition-colors ${
            mostrarOpcionsAdjunt 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-500 hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {mostrarOpcionsAdjunt ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>

        {/* ✅ TEXTAREA CON AUTO-RESIZE */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={desactivat || adjuntant}
            rows={1}
            className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed max-h-30 overflow-y-auto"
            style={{ minHeight: '44px' }}
          />

          {/* ✅ CONTADOR DE CARACTERES */}
          {text.length > 1800 && (
            <div className={`absolute bottom-1 right-12 text-xs px-2 py-1 rounded ${
              text.length > 2000 ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
            }`}>
              {2000 - text.length}
            </div>
          )}
        </div>

        {/* ✅ BOTONES LATERALES */}
        <div className="flex items-center space-x-1">
          {/* Botón de Emoji */}
          <button
            onClick={() => setMostrarEmojis(!mostrarEmojis)}
            disabled={desactivat}
            className={`p-2 rounded-full transition-colors ${
              mostrarEmojis 
                ? 'bg-yellow-500 text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* ✅ BOTÓN DE AUDIO/ENVIAR */}
          {text.trim() ? (
            <button
              onClick={handleEnviar}
              disabled={desactivat || adjuntant}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onMouseDown={iniciarGravacioAudio}
              onMouseUp={pararGravacioAudio}
              onTouchStart={iniciarGravacioAudio}
              onTouchEnd={pararGravacioAudio}
              disabled={desactivat || adjuntant}
              className={`p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                gravantAudio 
                  ? 'bg-red-500 text-white scale-110 animate-pulse' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ✅ ESTADO DE GRABACIÓN */}
      {gravantAudio && (
        <div className="mt-2 flex items-center justify-center space-x-2 text-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Gravant àudio... Manté premut</span>
        </div>
      )}

      {/* ✅ ESTADO DE ADJUNTANDO */}
      {adjuntant && (
        <div className="mt-2 flex items-center justify-center space-x-2 text-blue-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Enviant...</span>
        </div>
      )}

      {/* ✅ INPUT HIDDEN PARA ARCHIVOS */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
      />
    </div>
  )
}