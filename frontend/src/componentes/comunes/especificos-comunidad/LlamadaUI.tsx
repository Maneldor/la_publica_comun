'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Volume2,
  X
} from 'lucide-react';
import { CallState, IncomingCallData } from '../../../servicios/webrtc';

interface PropiedadesLlamadaUI {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onAcceptCall: () => void;
  onRejectCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

interface PropiedadesLlamadaEntrante {
  incomingCall: IncomingCallData;
  onAccept: () => void;
  onReject: () => void;
}

// Componente para notificación de llamada entrante
export const LlamadaEntrante: React.FC<PropiedadesLlamadaEntrante> = ({
  incomingCall,
  onAccept,
  onReject
}) => {
  const [ringing, setRinging] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reproducir sonido de llamada
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(console.error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <audio ref={audioRef} src="/sounds/ringtone.mp3" />
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-pulse">
        <div className="text-center">
          {/* Avatar animado */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(incomingCall.callerName)}&size=128&background=random`}
                alt={incomingCall.callerName}
                className="w-full h-full object-cover"
              />
            </div>
            {ringing && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {incomingCall.callerName}
          </h2>
          <p className="text-gray-600 mb-8">
            {incomingCall.callType === 'video' ? 'Videollamada entrante' : 'Llamada entrante'}
          </p>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setRinging(false);
                onReject();
              }}
              className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              title="Rechazar"
            >
              <PhoneOff size={24} />
            </button>
            
            <button
              onClick={() => {
                setRinging(false);
                onAccept();
              }}
              className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110 animate-bounce"
              title="Aceptar"
            >
              {incomingCall.callType === 'video' ? <Video size={24} /> : <Phone size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal de llamada
export const LlamadaUI: React.FC<PropiedadesLlamadaUI> = ({
  callState,
  localStream,
  remoteStream,
  onAcceptCall,
  onRejectCall,
  onEndCall,
  onToggleMute,
  onToggleVideo
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Configurar streams de video
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Auto-ocultar controles
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (callState.callType === 'video' && callState.callStatus === 'connected') {
      window.addEventListener('mousemove', handleMouseMove);
      handleMouseMove(); // Iniciar timer
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [callState.callType, callState.callStatus]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Renderizar según el estado
  if (callState.callStatus === 'ringing' && callState.callDirection === 'outgoing') {
    // Llamada saliente - esperando respuesta
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(callState.remoteUserName || 'Usuario')}&size=128&background=random`}
                alt={callState.remoteUserName || 'Usuario'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
          </div>

          <h2 className="text-2xl font-bold mb-2">{callState.remoteUserName}</h2>
          <p className="text-gray-300 mb-8">Llamando...</p>

          <button
            onClick={onEndCall}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110 mx-auto"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (callState.callStatus === 'connecting') {
    // Conectando
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-xl">Conectando...</p>
        </div>
      </div>
    );
  }

  if (callState.callStatus === 'connected') {
    // Llamada activa
    return (
      <div 
        className={`fixed inset-0 bg-gray-900 z-50 ${!showControls && callState.callType === 'video' ? 'cursor-none' : ''}`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Video remoto (fondo completo) */}
        {callState.callType === 'video' && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Audio call UI */}
        {callState.callType === 'audio' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 mx-auto">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(callState.remoteUserName || 'Usuario')}&size=128&background=random`}
                  alt={callState.remoteUserName || 'Usuario'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{callState.remoteUserName}</h2>
              <div className="flex items-center justify-center space-x-2 text-gray-300">
                <Volume2 size={20} />
                <span>En llamada</span>
              </div>
            </div>
          </div>
        )}

        {/* Video local (picture-in-picture) */}
        {callState.callType === 'video' && callState.isVideoOn && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
          </div>
        )}

        {/* Información de llamada */}
        {showControls && (
          <div className="absolute top-4 left-4 text-white">
            <h3 className="text-lg font-semibold">{callState.remoteUserName}</h3>
            <p className="text-sm text-gray-300">
              {callState.callType === 'video' ? 'Videollamada' : 'Llamada de voz'}
            </p>
          </div>
        )}

        {/* Controles de llamada */}
        <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${!showControls && callState.callType === 'video' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex justify-center items-center space-x-4">
            {/* Silenciar/Desilenciar */}
            <button
              onClick={onToggleMute}
              className={`p-4 rounded-full transition-all ${
                callState.isMuted
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              } text-white`}
              title={callState.isMuted ? 'Activar micrófono' : 'Silenciar'}
            >
              {callState.isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Video on/off (solo para videollamadas) */}
            {callState.callType === 'video' && (
              <button
                onClick={onToggleVideo}
                className={`p-4 rounded-full transition-all ${
                  !callState.isVideoOn
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
                title={callState.isVideoOn ? 'Desactivar video' : 'Activar video'}
              >
                {callState.isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
            )}

            {/* Colgar */}
            <button
              onClick={onEndCall}
              className="p-5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
              title="Finalizar llamada"
            >
              <PhoneOff size={28} />
            </button>

            {/* Pantalla completa (solo para video) */}
            {callState.callType === 'video' && (
              <button
                onClick={toggleFullscreen}
                className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-all"
                title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Estilos CSS para mirror video
const styles = `
  .mirror {
    transform: scaleX(-1);
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}