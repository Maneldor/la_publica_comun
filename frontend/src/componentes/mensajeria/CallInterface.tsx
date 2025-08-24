'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { PropietatsCallInterface, Trucada } from '../../../tipos/mensajes'
import { 
  PhoneOff, Mic, MicOff, Video, VideoOff, 
  Monitor, MonitorOff, Volume2, VolumeX,
  Maximize2, Minimize2, Settings, Users
} from 'lucide-react'

// ✅ COMPONENTE PRINCIPAL: Interfaz de llamadas con WebRTC
export default function CallInterface({
  trucada,
  onFinalitzar,
  onToggleMicrofo,
  onToggleCamera,
  onTogglePantalla
}: PropietatsCallInterface) {
  const [videoLocal, setVideoLocal] = useState<MediaStream | null>(null)
  const [videoRemoto, setVideoRemoto] = useState<MediaStream | null>(null)
  const [microfonActivat, setMicrofonActivat] = useState(trucada.microfonActivat ?? true)
  const [camaraActivada, setCamaraActivada] = useState(trucada.camaraActivada ?? true)
  const [pantallCompartida, setPantallCompartida] = useState(trucada.pantallCompartida ?? false)
  const [volumeActivat, setVolumeActivat] = useState(true)
  const [pantallaCompleta, setPantallaCompleta] = useState(false)
  const [mostrarControls, setMostrarControls] = useState(true)
  const [duracionTrucada, setDuracionTrucada] = useState(0)

  const videoLocalRef = useRef<HTMLVideoElement>(null)
  const videoRemotoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // ✅ EFECTO: Contador de duración
  useEffect(() => {
    const interval = setInterval(() => {
      if (trucada.estat === 'activa') {
        const inicioTime = new Date(trucada.dataInici).getTime()
        const duracion = Math.floor((Date.now() - inicioTime) / 1000)
        setDuracionTrucada(duracion)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [trucada.estat, trucada.dataInici])

  // ✅ EFECTO: Ocultar controles automáticamente
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setMostrarControls(false)
      }, 3000)
    }

    if (mostrarControls) {
      resetControlsTimeout()
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [mostrarControls])

  // ✅ GESTIÓN DE STREAM LOCAL
  useEffect(() => {
    const inicializarStreamLocal = async () => {
      try {
        if (trucada.tipus === 'video') {
          const constraints = {
            video: camaraActivada,
            audio: microfonActivat
          }
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          setVideoLocal(stream)
          
          if (videoLocalRef.current) {
            videoLocalRef.current.srcObject = stream
          }
        } else {
          // Solo audio para llamadas de voz
          const stream = await navigator.mediaDevices.getUserMedia({ audio: microfonActivat })
          setVideoLocal(stream)
        }
      } catch (error) {
        console.error('Error accessing media devices:', error)
      }
    }

    inicializarStreamLocal()

    return () => {
      // Cleanup streams
      if (videoLocal) {
        videoLocal.getTracks().forEach(track => track.stop())
      }
    }
  }, [trucada.tipus, microfonActivat, camaraActivada])

  // ✅ MANEJO DE EVENTOS DE LLAMADA
  const handleToggleMicrofo = useCallback(() => {
    setMicrofonActivat(!microfonActivat)
    onToggleMicrofo()
    
    if (videoLocal) {
      videoLocal.getAudioTracks().forEach(track => {
        track.enabled = !microfonActivat
      })
    }
  }, [microfonActivat, onToggleMicrofo, videoLocal])

  const handleToggleCamera = useCallback(() => {
    setCamaraActivada(!camaraActivada)
    onToggleCamera()
    
    if (videoLocal) {
      videoLocal.getVideoTracks().forEach(track => {
        track.enabled = !camaraActivada
      })
    }
  }, [camaraActivada, onToggleCamera, videoLocal])

  const handleTogglePantalla = useCallback(async () => {
    try {
      if (!pantallCompartida) {
        // Iniciar compartición de pantalla
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        setPantallCompartida(true)
        onTogglePantalla()
        
        // Reemplazar track de video
        if (videoLocal) {
          const videoTrack = stream.getVideoTracks()[0]
          // TODO: Reemplazar en peer connection
        }
      } else {
        // Detener compartición de pantalla
        setPantallCompartida(false)
        onTogglePantalla()
        
        // Volver a cámara
        if (camaraActivada && videoLocal) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          // TODO: Reemplazar en peer connection
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }, [pantallCompartida, camaraActivada, videoLocal, onTogglePantalla])

  const handleTogglePantallaCompleta = useCallback(() => {
    if (!pantallaCompleta && containerRef.current) {
      containerRef.current.requestFullscreen()
      setPantallaCompleta(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setPantallaCompleta(false)
    }
  }, [pantallaCompleta])

  const handleMouseMove = useCallback(() => {
    setMostrarControls(true)
  }, [])

  const formatearDuracion = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black overflow-hidden ${pantallaCompleta ? 'w-screen h-screen' : 'w-full h-full'}`}
      onMouseMove={handleMouseMove}
    >
      {/* ✅ VIDEO REMOTO (Principal) */}
      <div className="relative w-full h-full">
        {trucada.tipus === 'video' && videoRemoto ? (
          <video
            ref={videoRemotoRef}
            autoPlay
            playsInline
            muted={!volumeActivat}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              {/* Avatar del participante remoto */}
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Usuari {trucada.participants[0]}
              </h3>
              <p className="text-gray-400">
                {trucada.estat === 'llamando' ? 'Trucant...' : 
                 trucada.estat === 'activa' ? 'En trucada' : 
                 'Connexió...'}
              </p>
            </div>
          </div>
        )}

        {/* ✅ VIDEO LOCAL (Picture-in-Picture) */}
        {trucada.tipus === 'video' && videoLocal && (
          <div className={`absolute ${pantallaCompleta ? 'top-4 right-4 w-48 h-36' : 'top-2 right-2 w-32 h-24'} bg-gray-800 rounded-lg overflow-hidden shadow-lg`}>
            <video
              ref={videoLocalRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!camaraActivada && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* ✅ INDICADORES DE ESTADO */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {/* Duración */}
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatearDuracion(duracionTrucada)}
          </div>
          
          {/* Estado de la llamada */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
            trucada.estat === 'activa' ? 'bg-green-500/80 text-white' :
            trucada.estat === 'llamando' ? 'bg-yellow-500/80 text-white' :
            'bg-red-500/80 text-white'
          }`}>
            {trucada.estat === 'activa' ? 'Activa' :
             trucada.estat === 'llamando' ? 'Trucant...' :
             'Connectant...'}
          </div>

          {/* Indicadores activos */}
          <div className="flex space-x-2">
            {!microfonActivat && (
              <div className="bg-red-500/80 backdrop-blur-sm text-white p-1 rounded-full">
                <MicOff className="w-4 h-4" />
              </div>
            )}
            {pantallCompartida && (
              <div className="bg-blue-500/80 backdrop-blur-sm text-white p-1 rounded-full">
                <Monitor className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* ✅ CONTROLES DE LLAMADA */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
          mostrarControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex justify-center items-center space-x-4">
            {/* Botón Micrófono */}
            <button
              onClick={handleToggleMicrofo}
              className={`p-4 rounded-full transition-all duration-200 ${
                microfonActivat 
                  ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {microfonActivat ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Botón Cámara (solo video calls) */}
            {trucada.tipus === 'video' && (
              <button
                onClick={handleToggleCamera}
                className={`p-4 rounded-full transition-all duration-200 ${
                  camaraActivada 
                    ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {camaraActivada ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>
            )}

            {/* Botón Compartir Pantalla */}
            <button
              onClick={handleTogglePantalla}
              className={`p-4 rounded-full transition-all duration-200 ${
                pantallCompartida 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              {pantallCompartida ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </button>

            {/* Botón Volumen */}
            <button
              onClick={() => setVolumeActivat(!volumeActivat)}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {volumeActivat ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Botón Pantalla Completa */}
            <button
              onClick={handleTogglePantallaCompleta}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
            >
              {pantallaCompleta ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>

            {/* Botón Finalizar */}
            <button
              onClick={onFinalitzar}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 scale-110"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

          {/* ✅ INFORMACIÓN ADICIONAL */}
          <div className="mt-4 text-center text-white/80 text-sm">
            <p>
              {trucada.tipus === 'video' ? 'Videotrucada' : 'Trucada de veu'} amb{' '}
              {trucada.participants.length > 1 
                ? `${trucada.participants.length} participants`
                : 'un participant'
              }
            </p>
          </div>
        </div>
      </div>

      {/* ✅ OVERLAY DE CARGA INICIAL */}
      {trucada.estat === 'llamando' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-semibold">Connectant...</p>
            <p className="text-sm text-white/80 mt-2">
              Establint connexió amb l'altre participant
            </p>
          </div>
        </div>
      )}

      {/* ✅ MENSAJES DE ERROR O ESTADO */}
      {trucada.estat === 'perdida' && (
        <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <PhoneOff className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold">Trucada perduda</p>
            <p className="text-sm text-white/80 mt-2">
              No s'ha pogut establir la connexió
            </p>
          </div>
        </div>
      )}
    </div>
  )
}