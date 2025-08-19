'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useNotifications } from './NotificationsContext'

export interface GrupPrivat {
  id: string
  nom: string
  categoria: 'afinidad' | 'profesional' | 'geografico'
  tipus: 'publico' | 'privado' | 'oculto'
  dataUnio: Date
  esActiu: boolean
}

export interface SolicitudGrup {
  id: string
  grupId: string
  grupNom: string
  usuariId: string
  usuariNom: string
  dataCreacio: Date
  estat: 'pendent' | 'aprovada' | 'denegada'
  motiu?: string
}

export interface AlertaAdmin {
  id: string
  tipus: 'grup_privat_multiple'
  usuariId: string
  usuariNom: string
  grupActualId: string
  grupActualNom: string
  grupSolicitudId: string
  grupSolicitudNom: string
  dataCreacio: Date
  llegida: boolean
  processada: boolean
}

interface GroupMembershipContextType {
  grupsPrivats: GrupPrivat[]
  solicituds: SolicitudGrup[]
  alertes: AlertaAdmin[]
  
  // Funcions per gestionar membresies
  intentarUnirseGrup: (grupId: string, grupNom: string, categoria: 'afinidad' | 'profesional' | 'geografico', tipus: 'publico' | 'privado' | 'oculto') => Promise<boolean>
  abandonarGrup: (grupId: string) => Promise<void>
  
  // Funcions per administradors
  processarSolicitud: (solicitudId: string, aprovada: boolean, motiu?: string) => Promise<void>
  marcarAlertaLlegida: (alertaId: string) => void
  marcarAlertaProcessada: (alertaId: string) => void
  
  // Verificacions
  teGrupPrivat: () => boolean
  potUnirseGrupPrivat: (categoria: 'afinidad' | 'profesional' | 'geografico') => boolean
}

const GroupMembershipContext = createContext<GroupMembershipContextType | undefined>(undefined)

// Mock data inicial
const GRUPS_PRIVATS_MOCK: GrupPrivat[] = [
  {
    id: 'grup-funcionaris-salut',
    nom: 'Funcionaris de Salut',
    categoria: 'profesional',
    tipus: 'privado',
    dataUnio: new Date(2025, 6, 15),
    esActiu: true
  }
]

const SOLICITUDS_MOCK: SolicitudGrup[] = []

const ALERTES_MOCK: AlertaAdmin[] = []

export function GroupMembershipProvider({ children }: { children: ReactNode }) {
  const [grupsPrivats, setGrupsPrivats] = useState<GrupPrivat[]>(GRUPS_PRIVATS_MOCK)
  const [solicituds, setSolicituds] = useState<SolicitudGrup[]>(SOLICITUDS_MOCK)
  const [alertes, setAlertes] = useState<AlertaAdmin[]>(ALERTES_MOCK)
  
  const { afegirNotificacio } = useNotifications()

  const teGrupPrivat = (): boolean => {
    return grupsPrivats.some(grup => 
      (grup.categoria === 'profesional' || grup.categoria === 'afinidad') && 
      grup.tipus === 'privado' && 
      grup.esActiu
    )
  }

  const potUnirseGrupPrivat = (categoria: 'afinidad' | 'profesional' | 'geografico'): boolean => {
    // Els grups geogràfics sempre es poden unir
    if (categoria === 'geografico') return true
    
    // Per grups d'afinitat i professionals, només un grup privat
    const teGrupPrivatActiu = grupsPrivats.some(grup => 
      (grup.categoria === 'profesional' || grup.categoria === 'afinidad') && 
      grup.tipus === 'privado' && 
      grup.esActiu
    )
    
    return !teGrupPrivatActiu
  }

  const intentarUnirseGrup = async (
    grupId: string, 
    grupNom: string, 
    categoria: 'afinidad' | 'profesional' | 'geografico', 
    tipus: 'publico' | 'privado' | 'oculto'
  ): Promise<boolean> => {
    
    // Si és grup públic, sempre es pot unir
    if (tipus === 'publico') {
      const nouGrup: GrupPrivat = {
        id: grupId,
        nom: grupNom,
        categoria,
        tipus,
        dataUnio: new Date(),
        esActiu: true
      }
      setGrupsPrivats(prev => [...prev, nouGrup])
      return true
    }

    // Si és grup privat/oculto i ja té un grup privat/professional
    if ((tipus === 'privado' || tipus === 'oculto') && !potUnirseGrupPrivat(categoria)) {
      // Crear alerta per admin
      const grupActual = grupsPrivats.find(g => 
        (g.categoria === 'profesional' || g.categoria === 'afinidad') && 
        g.tipus === 'privado' && 
        g.esActiu
      )

      if (grupActual) {
        const novaAlerta: AlertaAdmin = {
          id: Date.now().toString(),
          tipus: 'grup_privat_multiple',
          usuariId: 'user-1', // Usuari actual
          usuariNom: 'Manel Amador',
          grupActualId: grupActual.id,
          grupActualNom: grupActual.nom,
          grupSolicitudId: grupId,
          grupSolicitudNom: grupNom,
          dataCreacio: new Date(),
          llegida: false,
          processada: false
        }

        setAlertes(prev => [...prev, novaAlerta])

        // Crear notificació per admin
        afegirNotificacio({
          tipus: 'grup',
          titol: 'Solicitud múltiple grup privat',
          descripcio: `Manel Amador ha intentat unir-se a "${grupNom}" tenint ja "${grupActual.nom}"`
        })
      }

      return false // No es pot unir
    }

    // Si pot unir-se, crear solicitud (per grups privats) o unir-se directament
    if (tipus === 'privado' || tipus === 'oculto') {
      const novaSolicitud: SolicitudGrup = {
        id: Date.now().toString(),
        grupId,
        grupNom,
        usuariId: 'user-1',
        usuariNom: 'Manel Amador',
        dataCreacio: new Date(),
        estat: 'pendent'
      }

      setSolicituds(prev => [...prev, novaSolicitud])
      
      // Notificar usuari
      afegirNotificacio({
        tipus: 'grup',
        titol: 'Solicitud enviada',
        descripcio: `La teva solicitud per unir-te a "${grupNom}" s'ha enviat per aprovació`
      })

      return true // Solicitud creada
    }

    return false
  }

  const abandonarGrup = async (grupId: string): Promise<void> => {
    setGrupsPrivats(prev => prev.filter(grup => grup.id !== grupId))
    
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Has abandonat el grup',
      descripcio: 'Has abandonat el grup exitosament'
    })
  }

  const processarSolicitud = async (solicitudId: string, aprovada: boolean, motiu?: string): Promise<void> => {
    const solicitud = solicituds.find(s => s.id === solicitudId)
    if (!solicitud) return

    if (aprovada) {
      // Afegir a grups
      const nouGrup: GrupPrivat = {
        id: solicitud.grupId,
        nom: solicitud.grupNom,
        categoria: 'profesional', // Assumim que les solicituds són per grups professionals
        tipus: 'privado',
        dataUnio: new Date(),
        esActiu: true
      }
      setGrupsPrivats(prev => [...prev, nouGrup])
    }

    // Actualitzar solicitud
    setSolicituds(prev => prev.map(s => 
      s.id === solicitudId 
        ? { ...s, estat: aprovada ? 'aprovada' : 'denegada', motiu }
        : s
    ))

    // Notificar usuari
    afegirNotificacio({
      tipus: 'grup',
      titol: aprovada ? 'Solicitud aprovada' : 'Solicitud denegada',
      descripcio: aprovada 
        ? `S'ha aprovat la teva solicitud per "${solicitud.grupNom}"`
        : `S'ha denegat la teva solicitud per "${solicitud.grupNom}". Motiu: ${motiu || 'No especificat'}`
    })
  }

  const marcarAlertaLlegida = (alertaId: string): void => {
    setAlertes(prev => prev.map(alerta => 
      alerta.id === alertaId 
        ? { ...alerta, llegida: true }
        : alerta
    ))
  }

  const marcarAlertaProcessada = (alertaId: string): void => {
    setAlertes(prev => prev.map(alerta => 
      alerta.id === alertaId 
        ? { ...alerta, processada: true, llegida: true }
        : alerta
    ))
  }

  return (
    <GroupMembershipContext.Provider value={{
      grupsPrivats,
      solicituds,
      alertes,
      intentarUnirseGrup,
      abandonarGrup,
      processarSolicitud,
      marcarAlertaLlegida,
      marcarAlertaProcessada,
      teGrupPrivat,
      potUnirseGrupPrivat
    }}>
      {children}
    </GroupMembershipContext.Provider>
  )
}

export function useGroupMembership() {
  const context = useContext(GroupMembershipContext)
  if (context === undefined) {
    throw new Error('useGroupMembership must be used within a GroupMembershipProvider')
  }
  return context
}