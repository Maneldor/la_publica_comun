'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  Notificacio, 
  SolicitudConnexio, 
  TipusNotificacio, 
  EstatNotificacio,
  ResumNotificacions
} from '../../tipos/notificacions'

interface NotificacionsContextType {
  notificacions: Notificacio[]
  solicituds: SolicitudConnexio[]
  resum: ResumNotificacions
  
  // Notificacions
  marcarComLlegida: (id: string) => void
  marcarTotesComLlegides: () => void
  eliminarNotificacio: (id: string) => void
  
  // Sol·licituds de connexió
  enviarSolicitudConnexio: (receptorId: string, tipusConnexio: string, missatge: string, metadata?: any) => Promise<void>
  acceptarSolicitud: (solicitudId: string) => Promise<void>
  rebutjarSolicitud: (solicitudId: string) => Promise<void>
  
  // Utilitats
  crearNotificacio: (
    tipus: TipusNotificacio, 
    receptorId: string, 
    emissor: any, 
    titol: string, 
    missatge: string,
    metadata?: any
  ) => void
}

const NotificacionsContext = createContext<NotificacionsContextType | null>(null)

interface NotificacionsProviderProps {
  children: ReactNode
}

export function NotificacionsProvider({ children }: NotificacionsProviderProps) {
  const [notificacions, setNotificacions] = useState<Notificacio[]>([])
  const [solicituds, setSolicituds] = useState<SolicitudConnexio[]>([])

  // Dades mock d'exemple
  useEffect(() => {
    const notificacionsMock: Notificacio[] = [
      {
        id: 'notif-1',
        tipus: 'solicitud-connexio',
        titol: 'Nova sol·licitud de connexió',
        missatge: 'Maria Santos vol connectar amb tu',
        emissor: {
          id: 'user-2',
          nom: 'Maria Santos',
          nick: '@maria_santos',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=100&h=100&fit=crop&crop=face'
        },
        receptor: 'user-1',
        estat: 'no-llegida',
        data: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        accio: {
          tipus: 'acceptar-connexio',
          dades: { solicitudId: 'sol-1' }
        }
      },
      {
        id: 'notif-2',
        tipus: 'invitacio-grup',
        titol: 'Invitació a grup',
        missatge: 'T\'han convidat a unir-te al grup "Innovació Digital"',
        emissor: {
          id: 'user-3',
          nom: 'Jordi Martín',
          nick: '@jordi_martin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        receptor: 'user-1',
        estat: 'no-llegida',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        accio: {
          tipus: 'veure-grup',
          dades: { grupId: 'grup-innovacio' }
        },
        metadata: {
          grupId: 'grup-innovacio'
        }
      }
    ]

    const solicitudsMock: SolicitudConnexio[] = [
      {
        id: 'sol-1',
        emissor: 'user-2',
        receptor: 'user-1',
        missatge: 'Hola! M\'agradaria connectar amb tu per compartir experiències sobre innovació pública.',
        estat: 'pendent',
        data: new Date(Date.now() - 1000 * 60 * 30),
        tipusConnexio: 'professional'
      }
    ]

    setNotificacions(notificacionsMock)
    setSolicituds(solicitudsMock)
  }, [])

  // Calcular resum
  const resum: ResumNotificacions = {
    total: notificacions.length,
    noLlegides: notificacions.filter(n => n.estat === 'no-llegida').length,
    solicitudsConnexio: solicituds.filter(s => s.estat === 'pendent').length,
    missatges: notificacions.filter(n => n.tipus === 'missatge-nou' && n.estat === 'no-llegida').length,
    grups: notificacions.filter(n => n.tipus === 'invitacio-grup' && n.estat === 'no-llegida').length
  }

  const marcarComLlegida = (id: string) => {
    setNotificacions(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, estat: 'llegida' as EstatNotificacio } : notif
      )
    )
  }

  const marcarTotesComLlegides = () => {
    setNotificacions(prev => 
      prev.map(notif => ({ ...notif, estat: 'llegida' as EstatNotificacio }))
    )
  }

  const eliminarNotificacio = (id: string) => {
    setNotificacions(prev => prev.filter(notif => notif.id !== id))
  }

  const crearNotificacio = (
    tipus: TipusNotificacio, 
    receptorId: string, 
    emissor: any, 
    titol: string, 
    missatge: string,
    metadata?: any
  ) => {
    const novaNotificacio: Notificacio = {
      id: `notif-${Date.now()}`,
      tipus,
      titol,
      missatge,
      emissor: {
        id: emissor.id,
        nom: emissor.nom || emissor.nombre,
        nick: emissor.nick,
        avatar: emissor.avatar
      },
      receptor: receptorId,
      estat: 'no-llegida',
      data: new Date(),
      metadata
    }

    setNotificacions(prev => [novaNotificacio, ...prev])
  }

  const enviarSolicitudConnexio = async (
    receptorId: string, 
    tipusConnexio: string, 
    missatge: string,
    metadata?: any
  ) => {
    // Simular enviament
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const novaSolicitud: SolicitudConnexio = {
      id: `sol-${Date.now()}`,
      emissor: 'user-1', // TODO: obtenir de context d'auth
      receptor: receptorId,
      missatge,
      estat: 'pendent',
      data: new Date(),
      tipusConnexio: tipusConnexio as any,
      metadata
    }

    setSolicituds(prev => [novaSolicitud, ...prev])

    // Crear notificació per al receptor
    crearNotificacio(
      'solicitud-connexio',
      receptorId,
      {
        id: 'user-1',
        nom: 'Tu Perfil', // TODO: obtenir nom real
        nick: '@tu_perfil',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      'Nova sol·licitud de connexió',
      'Vol connectar amb tu',
      { solicitudId: novaSolicitud.id }
    )
  }

  const acceptarSolicitud = async (solicitudId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setSolicituds(prev => 
      prev.map(sol => 
        sol.id === solicitudId ? { ...sol, estat: 'acceptada' } : sol
      )
    )

    // Marcar notificació relacionada com llegida
    const solicitud = solicituds.find(s => s.id === solicitudId)
    if (solicitud) {
      // Crear notificació de confirmació per a l'emissor
      crearNotificacio(
        'connexio-acceptada',
        solicitud.emissor,
        {
          id: 'user-1',
          nom: 'Tu Perfil',
          nick: '@tu_perfil'
        },
        'Connexió acceptada',
        'Ha acceptat la teva sol·licitud de connexió',
        { solicitudId }
      )
    }

    // Marcar la notificació original com llegida
    const notificacioRelacionada = notificacions.find(n => 
      n.accio?.dades?.solicitudId === solicitudId
    )
    if (notificacioRelacionada) {
      marcarComLlegida(notificacioRelacionada.id)
    }
  }

  const rebutjarSolicitud = async (solicitudId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setSolicituds(prev => 
      prev.map(sol => 
        sol.id === solicitudId ? { ...sol, estat: 'rebutjada' } : sol
      )
    )

    // Eliminar la notificació relacionada
    const notificacioRelacionada = notificacions.find(n => 
      n.accio?.dades?.solicitudId === solicitudId
    )
    if (notificacioRelacionada) {
      eliminarNotificacio(notificacioRelacionada.id)
    }
  }

  const value: NotificacionsContextType = {
    notificacions,
    solicituds,
    resum,
    marcarComLlegida,
    marcarTotesComLlegides,
    eliminarNotificacio,
    enviarSolicitudConnexio,
    acceptarSolicitud,
    rebutjarSolicitud,
    crearNotificacio
  }

  return (
    <NotificacionsContext.Provider value={value}>
      {children}
    </NotificacionsContext.Provider>
  )
}

export function useNotificacions() {
  const context = useContext(NotificacionsContext)
  if (!context) {
    throw new Error('useNotificacions ha de ser usat dins d\'un NotificacionsProvider')
  }
  return context
}