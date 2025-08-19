// Servicio WebRTC para llamadas de voz y video
import { io, Socket } from 'socket.io-client';

export interface CallConfig {
  iceServers: RTCIceServer[];
}

export interface CallState {
  isInCall: boolean;
  callType: 'audio' | 'video' | null;
  callDirection: 'incoming' | 'outgoing' | null;
  remoteUserId: string | null;
  remoteUserName: string | null;
  roomId: string | null;
  isMuted: boolean;
  isVideoOn: boolean;
  callStatus: 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended' | 'error';
}

export interface IncomingCallData {
  callerId: string;
  callerName: string;
  callType: 'audio' | 'video';
  roomId: string;
}

export class WebRTCService {
  private socket: Socket | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  
  private config: CallConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  private callState: CallState = {
    isInCall: false,
    callType: null,
    callDirection: null,
    remoteUserId: null,
    remoteUserName: null,
    roomId: null,
    isMuted: false,
    isVideoOn: false,
    callStatus: 'idle'
  };

  private onStateChange: ((state: CallState) => void) | null = null;
  private onLocalStream: ((stream: MediaStream) => void) | null = null;
  private onRemoteStream: ((stream: MediaStream) => void) | null = null;
  private onIncomingCall: ((data: IncomingCallData) => void) | null = null;

  constructor() {
    console.log('🎥 WebRTC Service inicializado');
  }

  // Inicializar el servicio con el socket
  initialize(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  // Configurar listeners del socket
  private setupSocketListeners() {
    if (!this.socket) return;

    // Llamada entrante
    this.socket.on('call:incoming', (data: IncomingCallData) => {
      console.log('📞 Llamada entrante:', data);
      this.callState = {
        ...this.callState,
        callDirection: 'incoming',
        remoteUserId: data.callerId,
        remoteUserName: data.callerName,
        callType: data.callType,
        roomId: data.roomId,
        callStatus: 'ringing'
      };
      this.updateState();
      this.onIncomingCall?.(data);
    });

    // Llamada aceptada
    this.socket.on('call:accepted', async (data) => {
      console.log('✅ Llamada aceptada:', data);
      this.callState.callStatus = 'connecting';
      this.updateState();
      
      // Crear oferta WebRTC
      await this.createOffer();
    });

    // Llamada rechazada
    this.socket.on('call:rejected', (data) => {
      console.log('❌ Llamada rechazada:', data);
      this.endCall();
      alert(data.reason || 'Llamada rechazada');
    });

    // Llamada finalizada
    this.socket.on('call:ended', (data) => {
      console.log('📞 Llamada finalizada por el otro usuario');
      this.endCall();
    });

    // Usuario desconectado
    this.socket.on('user:disconnected', (data) => {
      if (data.userId === this.callState.remoteUserId) {
        console.log('❌ El otro usuario se desconectó');
        this.endCall();
      }
    });

    // Destinatario offline
    this.socket.on('call:recipientOffline', (data) => {
      console.log('❌ Usuario no disponible');
      this.endCall();
      alert('El usuario no está disponible');
    });

    // WebRTC signaling
    this.socket.on('webrtc:offer', async (data) => {
      console.log('🎥 Oferta WebRTC recibida');
      await this.handleOffer(data.offer);
    });

    this.socket.on('webrtc:answer', async (data) => {
      console.log('🎥 Respuesta WebRTC recibida');
      await this.handleAnswer(data.answer);
    });

    this.socket.on('webrtc:iceCandidate', async (data) => {
      console.log('🧊 ICE candidate recibido');
      await this.handleIceCandidate(data.candidate);
    });

    // Actualizaciones de estado
    this.socket.on('call:statusUpdate', (data) => {
      console.log('📊 Actualización de estado:', data);
      // Manejar cambios de estado del otro usuario (mute, video, etc.)
    });
  }

  // Iniciar una llamada
  async initiateCall(recipientId: string, callType: 'audio' | 'video') {
    try {
      console.log('📞 Iniciando llamada:', { recipientId, callType });
      
      // Generar ID único para la sala
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.callState = {
        ...this.callState,
        isInCall: true,
        callType,
        callDirection: 'outgoing',
        remoteUserId: recipientId,
        roomId,
        callStatus: 'ringing',
        isVideoOn: callType === 'video'
      };
      this.updateState();

      // Obtener stream local
      await this.getUserMedia(callType === 'video');

      // Notificar al servidor
      this.socket?.emit('call:initiate', {
        recipientId,
        callType,
        roomId
      });

    } catch (error) {
      console.error('Error al iniciar llamada:', error);
      this.endCall();
      alert('Error al acceder al micrófono/cámara');
    }
  }

  // Aceptar una llamada entrante
  async acceptCall() {
    try {
      console.log('✅ Aceptando llamada');
      
      this.callState.isInCall = true;
      this.callState.callStatus = 'connecting';
      this.updateState();

      // Obtener stream local
      await this.getUserMedia(this.callState.callType === 'video');

      // Notificar al servidor
      this.socket?.emit('call:accept', {
        callerId: this.callState.remoteUserId,
        roomId: this.callState.roomId
      });

      // Esperar la oferta WebRTC del llamador
    } catch (error) {
      console.error('Error al aceptar llamada:', error);
      this.rejectCall('Error al acceder al micrófono/cámara');
    }
  }

  // Rechazar una llamada entrante
  rejectCall(reason?: string) {
    console.log('❌ Rechazando llamada');
    
    this.socket?.emit('call:reject', {
      callerId: this.callState.remoteUserId,
      roomId: this.callState.roomId,
      reason
    });

    this.endCall();
  }

  // Finalizar llamada
  endCall() {
    console.log('📞 Finalizando llamada');
    
    // Notificar al servidor si estamos en llamada
    if (this.callState.isInCall) {
      this.socket?.emit('call:end', {
        recipientId: this.callState.remoteUserId,
        roomId: this.callState.roomId
      });
    }

    // Limpiar recursos
    this.cleanup();
  }

  // Obtener stream de usuario
  private async getUserMedia(video: boolean) {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.onLocalStream?.(this.localStream);
      
      console.log('📹 Stream local obtenido');
    } catch (error) {
      console.error('Error al obtener media:', error);
      throw error;
    }
  }

  // Crear conexión peer
  private async createPeerConnection() {
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection(this.config);

    // Agregar stream local
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    // Manejar tracks remotos
    this.peerConnection.ontrack = (event) => {
      console.log('🎥 Track remoto recibido');
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.onRemoteStream?.(this.remoteStream);
      }
    };

    // Manejar ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Enviando ICE candidate');
        this.socket?.emit('webrtc:iceCandidate', {
          recipientId: this.callState.remoteUserId,
          candidate: event.candidate,
          roomId: this.callState.roomId
        });
      }
    };

    // Manejar cambios de estado
    this.peerConnection.onconnectionstatechange = () => {
      console.log('📊 Estado de conexión:', this.peerConnection?.connectionState);
      
      if (this.peerConnection?.connectionState === 'connected') {
        this.callState.callStatus = 'connected';
        this.updateState();
      } else if (this.peerConnection?.connectionState === 'failed') {
        this.endCall();
      }
    };
  }

  // Crear oferta WebRTC
  private async createOffer() {
    await this.createPeerConnection();
    
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    
    console.log('📤 Enviando oferta WebRTC');
    this.socket?.emit('webrtc:offer', {
      recipientId: this.callState.remoteUserId,
      offer,
      roomId: this.callState.roomId
    });
  }

  // Manejar oferta recibida
  private async handleOffer(offer: RTCSessionDescriptionInit) {
    await this.createPeerConnection();
    
    await this.peerConnection!.setRemoteDescription(offer);
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    
    console.log('📤 Enviando respuesta WebRTC');
    this.socket?.emit('webrtc:answer', {
      recipientId: this.callState.remoteUserId,
      answer,
      roomId: this.callState.roomId
    });
  }

  // Manejar respuesta recibida
  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection?.setRemoteDescription(answer);
  }

  // Manejar ICE candidate recibido
  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection?.addIceCandidate(candidate);
  }

  // Silenciar/desilenciar micrófono
  toggleMute() {
    if (!this.localStream) return;
    
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.callState.isMuted = !audioTrack.enabled;
      this.updateState();

      // Notificar al otro usuario
      this.socket?.emit('call:updateStatus', {
        recipientId: this.callState.remoteUserId,
        status: this.callState.isMuted ? 'muted' : 'unmuted',
        roomId: this.callState.roomId
      });
    }
  }

  // Activar/desactivar video
  toggleVideo() {
    if (!this.localStream) return;
    
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      this.callState.isVideoOn = videoTrack.enabled;
      this.updateState();

      // Notificar al otro usuario
      this.socket?.emit('call:updateStatus', {
        recipientId: this.callState.remoteUserId,
        status: this.callState.isVideoOn ? 'videoOn' : 'videoOff',
        roomId: this.callState.roomId
      });
    }
  }

  // Limpiar recursos
  private cleanup() {
    // Detener tracks locales
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Cerrar conexión peer
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Limpiar streams
    this.remoteStream = null;

    // Resetear estado
    this.callState = {
      isInCall: false,
      callType: null,
      callDirection: null,
      remoteUserId: null,
      remoteUserName: null,
      roomId: null,
      isMuted: false,
      isVideoOn: false,
      callStatus: 'idle'
    };
    this.updateState();
  }

  // Actualizar estado y notificar
  private updateState() {
    this.onStateChange?.(this.callState);
  }

  // Setters para callbacks
  setOnStateChange(callback: (state: CallState) => void) {
    this.onStateChange = callback;
  }

  setOnLocalStream(callback: (stream: MediaStream) => void) {
    this.onLocalStream = callback;
  }

  setOnRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStream = callback;
  }

  setOnIncomingCall(callback: (data: IncomingCallData) => void) {
    this.onIncomingCall = callback;
  }

  // Getters
  getCallState() {
    return this.callState;
  }
}

// Instancia singleton
export const webRTCService = new WebRTCService();