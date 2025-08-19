'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ConexionMiembro } from '../../tipos/gruposAvanzados'
import { useNotifications } from './NotificationsContext'

interface ConexionesContextType {
  // Conexiones
  conexiones: ConexionMiembro[]
  solicitudesEnviadas: ConexionMiembro[]
  solicitudesRecibidas: ConexionMiembro[]
  
  // Gestión de conexiones
  enviarSolicitudConexion: (usuarioDestinoId: string, grupoId: string, mensaje?: string) => Promise<void>
  aceptarSolicitud: (conexionId: string) => Promise<void>
  rechazarSolicitud: (conexionId: string) => Promise<void>
  bloquearUsuario: (conexionId: string) => Promise<void>
  eliminarConexion: (conexionId: string) => Promise<void>
  
  // Consultas
  esConectado: (usuarioId: string) => boolean
  tieneSolicitudPendiente: (usuarioId: string) => boolean
  obtenerConexionEntre: (usuarioId1: string, usuarioId2: string) => ConexionMiembro | null
  obtenerConexionesGrupo: (grupoId: string) => ConexionMiembro[]
  
  // Estadísticas
  totalConexiones: number
  conexionesActivas: number
  solicitudesPendientes: number
}

const ConexionesContext = createContext<ConexionesContextType | undefined>(undefined)

// Mock data inicial - coincidir con los IDs de miembros reales
const CONEXIONES_MOCK: ConexionMiembro[] = [
  {
    id: 'conexion-1',
    usuarioOrigenId: 'user-1',
    usuarioDestinoId: 'user-2', // Laura García
    grupoId: 'grupo-funcionaris-educacio',
    estado: 'aceptada',
    fechaSolicitud: new Date('2025-01-05'),
    fechaRespuesta: new Date('2025-01-06'),
    mensaje: 'M\'agradaria connectar per compartir experiències educatives',
    origen: 'grupo',
    nivelConfianza: 4,
    mensajesIntercambiados: 12,
    colaboracionesRealizadas: 2
  },
  {
    id: 'conexion-2',
    usuarioOrigenId: 'user-3', // Joan Martí Puig
    usuarioDestinoId: 'user-1',
    grupoId: 'grupo-funcionaris-educacio',
    estado: 'pendiente',
    fechaSolicitud: new Date('2025-01-08'),
    mensaje: 'Hola! He vist el teu perfil al grup i m\'interessaria connectar',
    origen: 'perfil',
    nivelConfianza: 1,
    mensajesIntercambiados: 0,
    colaboracionesRealizadas: 0
  },
  {
    id: 'conexion-3',
    usuarioOrigenId: 'user-1',
    usuarioDestinoId: 'user-4', // Ana Ruiz Fernández
    grupoId: 'grupo-funcionaris-educacio',
    estado: 'aceptada',
    fechaSolicitud: new Date('2025-01-03'),
    fechaRespuesta: new Date('2025-01-04'),
    mensaje: 'Connectem per col·laborar en projectes educatius',
    origen: 'actividad',
    nivelConfianza: 5,
    mensajesIntercambiados: 25,
    colaboracionesRealizadas: 3
  }
]

export function ConexionesProvider({ children }: { children: ReactNode }) {
  const [conexiones, setConexiones] = useState<ConexionMiembro[]>(CONEXIONES_MOCK)
  const { afegirNotificacio } = useNotifications()
  
  const usuarioActual = 'user-1' // ID del usuario actual

  // Filtrar conexiones por tipo
  const solicitudesEnviadas = conexiones.filter(c => 
    c.usuarioOrigenId === usuarioActual && c.estado === 'pendiente'
  )
  
  const solicitudesRecibidas = conexiones.filter(c => 
    c.usuarioDestinoId === usuarioActual && c.estado === 'pendiente'
  )

  const enviarSolicitudConexion = async (
    usuarioDestinoId: string, 
    grupoId: string, 
    mensaje?: string
  ): Promise<void> => {
    // Verificar que no existe ya una conexión
    const conexionExistente = conexiones.find(c => 
      (c.usuarioOrigenId === usuarioActual && c.usuarioDestinoId === usuarioDestinoId) ||
      (c.usuarioOrigenId === usuarioDestinoId && c.usuarioDestinoId === usuarioActual)
    )

    if (conexionExistente) {
      throw new Error('Ja existeix una connexió amb aquest usuari')
    }

    const nuevaConexion: ConexionMiembro = {
      id: `conexion-${Date.now()}`,
      usuarioOrigenId: usuarioActual,
      usuarioDestinoId,
      grupoId,
      estado: 'pendiente',
      fechaSolicitud: new Date(),
      mensaje: mensaje || 'Sol·licitud de connexió',
      origen: 'grupo',
      nivelConfianza: 1,
      mensajesIntercambiados: 0,
      colaboracionesRealizadas: 0
    }

    setConexiones(prev => [...prev, nuevaConexion])

    // Notificar al usuario destinatario
    afegirNotificacio({
      tipus: 'seguiment',
      titol: 'Nova sol·licitud de connexió',
      descripcio: `Has rebut una sol·licitud de connexió d'un membre del grup`,
      enllaç: {
        tipus: 'perfil',
        id: usuarioActual
      }
    })
  }

  const aceptarSolicitud = async (conexionId: string): Promise<void> => {
    setConexiones(prev => prev.map(c => 
      c.id === conexionId 
        ? { ...c, estado: 'aceptada', fechaRespuesta: new Date() }
        : c
    ))

    const conexion = conexiones.find(c => c.id === conexionId)
    if (conexion) {
      afegirNotificacio({
        tipus: 'seguiment',
        titol: 'Connexió acceptada',
        descripcio: 'La teva sol·licitud de connexió ha estat acceptada',
        enllaç: {
          tipus: 'perfil',
          id: conexion.usuarioDestinoId
        }
      })
    }
  }

  const rechazarSolicitud = async (conexionId: string): Promise<void> => {
    setConexiones(prev => prev.map(c => 
      c.id === conexionId 
        ? { ...c, estado: 'rechazada', fechaRespuesta: new Date() }
        : c
    ))

    const conexion = conexiones.find(c => c.id === conexionId)
    if (conexion) {
      afegirNotificacio({
        tipus: 'seguiment',
        titol: 'Sol·licitud processada',
        descripcio: 'Has rebutjat una sol·licitud de connexió'
      })
    }
  }

  const bloquearUsuario = async (conexionId: string): Promise<void> => {
    setConexiones(prev => prev.map(c => 
      c.id === conexionId 
        ? { ...c, estado: 'bloqueada', fechaRespuesta: new Date() }
        : c
    ))

    afegirNotificacio({
      tipus: 'seguiment',
      titol: 'Usuari bloquejat',
      descripcio: 'Has bloquejat aquest usuari'
    })
  }

  const eliminarConexion = async (conexionId: string): Promise<void> => {
    setConexiones(prev => prev.filter(c => c.id !== conexionId))
    
    afegirNotificacio({
      tipus: 'seguiment',
      titol: 'Connexió eliminada',
      descripcio: 'Has eliminat la connexió amb aquest usuari'
    })
  }

  const esConectado = (usuarioId: string): boolean => {
    return conexiones.some(c => 
      ((c.usuarioOrigenId === usuarioActual && c.usuarioDestinoId === usuarioId) ||
       (c.usuarioOrigenId === usuarioId && c.usuarioDestinoId === usuarioActual)) &&
      c.estado === 'aceptada'
    )
  }

  const tieneSolicitudPendiente = (usuarioId: string): boolean => {
    return conexiones.some(c => 
      ((c.usuarioOrigenId === usuarioActual && c.usuarioDestinoId === usuarioId) ||
       (c.usuarioOrigenId === usuarioId && c.usuarioDestinoId === usuarioActual)) &&
      c.estado === 'pendiente'
    )
  }

  const obtenerConexionEntre = (usuarioId1: string, usuarioId2: string): ConexionMiembro | null => {
    return conexiones.find(c => 
      (c.usuarioOrigenId === usuarioId1 && c.usuarioDestinoId === usuarioId2) ||
      (c.usuarioOrigenId === usuarioId2 && c.usuarioDestinoId === usuarioId1)
    ) || null
  }

  const obtenerConexionesGrupo = (grupoId: string): ConexionMiembro[] => {
    return conexiones.filter(c => c.grupoId === grupoId && c.estado === 'aceptada')
  }

  // Estadísticas
  const totalConexiones = conexiones.filter(c => 
    (c.usuarioOrigenId === usuarioActual || c.usuarioDestinoId === usuarioActual) &&
    c.estado === 'aceptada'
  ).length

  const conexionesActivas = conexiones.filter(c => 
    (c.usuarioOrigenId === usuarioActual || c.usuarioDestinoId === usuarioActual) &&
    c.estado === 'aceptada' &&
    c.mensajesIntercambiados > 0
  ).length

  const solicitudesPendientes = solicitudesRecibidas.length

  return (
    <ConexionesContext.Provider value={{
      conexiones,
      solicitudesEnviadas,
      solicitudesRecibidas,
      enviarSolicitudConexion,
      aceptarSolicitud,
      rechazarSolicitud,
      bloquearUsuario,
      eliminarConexion,
      esConectado,
      tieneSolicitudPendiente,
      obtenerConexionEntre,
      obtenerConexionesGrupo,
      totalConexiones,
      conexionesActivas,
      solicitudesPendientes
    }}>
      {children}
    </ConexionesContext.Provider>
  )
}

export function useConexiones() {
  const context = useContext(ConexionesContext)
  if (context === undefined) {
    throw new Error('useConexiones must be used within a ConexionesProvider')
  }
  return context
}