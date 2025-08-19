'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useConexiones } from './ConexionesContext'
import { audioNotificacions } from '../utils/audioNotificacions'
import { emailNotificacions } from '../utils/emailNotificacions'
import { 
  Missatge, 
  Conversa, 
  ConversaDetall, 
  ResumConverses 
} from '../../tipos/missatges'

interface MissatgesContextType {
  converses: Conversa[]
  conversaActiva: ConversaDetall | null
  resum: ResumConverses
  
  // Gestió de converses
  obtenirConverses: () => Promise<void>
  crearConversa: (participantId: string) => Promise<string>
  obrirConversa: (conversaId: string) => Promise<void>
  tancarConversa: () => void
  arxivarConversa: (conversaId: string) => Promise<void>
  
  // Gestió de missatges
  enviarMissatge: (conversaId: string, contingut: string, tipus?: 'text' | 'imatge' | 'adjunt') => Promise<void>
  marcarComLlegits: (conversaId: string) => Promise<void>
  editarMissatge: (missatgeId: string, nouContingut: string) => Promise<void>
  eliminarMissatge: (missatgeId: string) => Promise<void>
  
  // Utilitats
  pucEnviarMissatges: (participantId: string) => boolean
  obtenirNomConversa: (conversa: Conversa) => string
}

const MissatgesContext = createContext<MissatgesContextType | null>(null)

interface MissatgesProviderProps {
  children: ReactNode
}

export function MissatgesProvider({ children }: MissatgesProviderProps) {
  const [converses, setConverses] = useState<Conversa[]>([])
  const [conversaActiva, setConversaActiva] = useState<ConversaDetall | null>(null)
  const { esConectado } = useConexiones()

  // Dades mock d'exemple
  useEffect(() => {
    const conversesMock: Conversa[] = [
      {
        id: 'conv-1',
        tipus: 'directa',
        participants: ['user-1', 'user-2'],
        ultimActivitat: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        dataCreacio: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dies ago
        estat: 'activa',
        noLlegits: 2,
        silenciada: false,
        ultimMissatge: {
          id: 'msg-last-1',
          conversaId: 'conv-1',
          emissor: 'user-2',
          contingut: 'Hola! Com va el projecte?',
          data: new Date(Date.now() - 1000 * 60 * 30),
          estat: 'entregat',
          tipus: 'text'
        }
      }
    ]

    setConverses(conversesMock)
  }, [])

  // Calcular resum
  const resum: ResumConverses = {
    total: converses.length,
    noLlegides: converses.reduce((acc, conv) => acc + conv.noLlegits, 0),
    actives: converses.filter(c => c.estat === 'activa').length,
    arxivades: converses.filter(c => c.estat === 'arxivada').length,
    nousContactes: 0 // Implementar lògica segons necessitat
  }

  const pucEnviarMissatges = (participantId: string) => {
    // Només es poden enviar missatges a usuaris connectats
    return esConectado(participantId)
  }

  const obtenirNomConversa = (conversa: Conversa) => {
    if (conversa.tipus === 'grup') {
      return conversa.nom || 'Grup sense nom'
    }
    
    // Per converses directes, obtenir el nom de l'altre participant
    const altreParticipant = conversa.participants.find(p => p !== 'user-1') // TODO: obtenir usuari actual
    
    // Aquí hauríem de fer una consulta per obtenir les dades de l'usuari
    // Per ara, retornem un nom genèric
    return `Usuari ${altreParticipant}`
  }

  const obtenirConverses = async () => {
    // Simular càrrega des del servidor
    await new Promise(resolve => setTimeout(resolve, 500))
    // Les converses ja es carreguen al useEffect
  }

  const crearConversa = async (participantId: string) => {
    console.log('🆕 crearConversa cridat amb participant:', participantId)
    
    if (!pucEnviarMissatges(participantId)) {
      console.log('🔴 No es poden enviar missatges - usuari no connectat')
      throw new Error('No pots enviar missatges a aquest usuari. Primer heu de connectar.')
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    // Verificar si ja existeix una conversa amb aquest participant
    const conversaExistent = converses.find(c => 
      c.tipus === 'directa' && c.participants.includes(participantId)
    )

    console.log('🆕 Conversa existent trobada:', conversaExistent)

    if (conversaExistent) {
      console.log('🆕 Retornant conversa existent amb ID:', conversaExistent.id)
      return conversaExistent.id
    }

    // Crear nova conversa
    const novaConversa: Conversa = {
      id: `conv-${Date.now()}`,
      tipus: 'directa',
      participants: ['user-1', participantId],
      ultimActivitat: new Date(),
      dataCreacio: new Date(),
      estat: 'activa',
      noLlegits: 0,
      silenciada: false
    }

    console.log('🆕 Nova conversa creada:', novaConversa)
    setConverses(prev => {
      const novesConverses = [novaConversa, ...prev]
      console.log('🆕 Actualitzant llista de converses:', novesConverses)
      return novesConverses
    })
    return novaConversa.id
  }

  const obrirConversa = useCallback(async (conversaId: string) => {
    console.log('📬 obrirConversa cridat amb ID:', conversaId)
    console.log('📬 converses disponibles:', converses)
    
    await new Promise(resolve => setTimeout(resolve, 200))

    const conversa = converses.find(c => c.id === conversaId)
    console.log('📬 conversa trobada:', conversa)
    if (!conversa) throw new Error('Conversa no trobada')

    // Simular càrrega de missatges
    const missatgesMock: Missatge[] = [
      {
        id: 'msg-1',
        conversaId: conversaId,
        emissor: 'user-2',
        contingut: 'Hola! Com estàs?',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        estat: 'llegit',
        tipus: 'text'
      },
      {
        id: 'msg-2',
        conversaId: conversaId,
        emissor: 'user-1',
        contingut: 'Molt bé, gràcies! I tu?',
        data: new Date(Date.now() - 1000 * 60 * 60), // 1h ago
        estat: 'llegit',
        tipus: 'text'
      },
      {
        id: 'msg-3',
        conversaId: conversaId,
        emissor: 'user-2',
        contingut: 'Perfecte! Volia comentar-te sobre el projecte nou.',
        data: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        estat: 'entregat',
        tipus: 'text'
      }
    ]

    const participantsDetallMock = [
      {
        id: 'user-2',
        nom: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=100&h=100&fit=crop&crop=face',
        nick: '@maria_santos',
        ultimActivitat: new Date(Date.now() - 1000 * 60 * 15),
        estat: 'online' as const
      }
    ]

    const conversaDetall: ConversaDetall = {
      ...conversa,
      missatges: missatgesMock,
      participantsDetall: participantsDetallMock
    }

    setConversaActiva(conversaDetall)
    
    // Marcar conversa com llegida
    await marcarComLlegits(conversaId)
  }, [converses])

  const tancarConversa = () => {
    setConversaActiva(null)
  }

  const arxivarConversa = async (conversaId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setConverses(prev => 
      prev.map(c => 
        c.id === conversaId ? { ...c, estat: 'arxivada' as const } : c
      )
    )
  }

  const enviarMissatge = async (
    conversaId: string, 
    contingut: string, 
    tipus: 'text' | 'imatge' | 'adjunt' = 'text'
  ) => {
    console.log('💬 enviarMissatge cridat:', { conversaId, contingut, tipus })
    console.log('💬 conversaActiva actual:', conversaActiva)
    console.log('💬 conversaActiva?.id:', conversaActiva?.id)
    console.log('💬 conversaId === conversaActiva?.id:', conversaId === conversaActiva?.id)
    
    if (!contingut.trim()) {
      console.log('🔴 Contingut buit, sortint...')
      return
    }

    await new Promise(resolve => setTimeout(resolve, 200))

    const nouMissatge: Missatge = {
      id: `msg-${Date.now()}`,
      conversaId,
      emissor: 'user-1',
      contingut: contingut.trim(),
      data: new Date(),
      estat: 'enviat',
      tipus
    }
    
    console.log('💬 Nou missatge creat:', nouMissatge)

    // Afegir missatge a la conversa activa si està oberta
    if (conversaActiva && conversaActiva.id === conversaId) {
      console.log('🟢 Afegint missatge a conversa activa...')
      setConversaActiva(prev => {
        console.log('🟢 Estat anterior de conversa activa:', prev)
        const nouEstat = prev ? {
          ...prev,
          missatges: [...prev.missatges, nouMissatge]
        } : null
        console.log('🟢 Nou estat de conversa activa:', nouEstat)
        return nouEstat
      })
    } else {
      console.log('🔴 NO s\'afegeix a conversa activa:', {
        conversaActiva: !!conversaActiva,
        conversaActivaId: conversaActiva?.id,
        conversaId,
        match: conversaActiva?.id === conversaId
      })
    }

    // Actualitzar la llista de converses
    setConverses(prev => 
      prev.map(c => 
        c.id === conversaId ? {
          ...c,
          ultimMissatge: nouMissatge,
          ultimActivitat: new Date()
        } : c
      )
    )

    console.log('🟢 Missatge processat correctament')

    // Reproduir so d'enviament
    audioNotificacions.playMissatgeEnviat()

    // Enviar notificació per email al destinatari
    await enviarEmailNotificacio(conversaId, nouMissatge)

    // Simular resposta automàtica després de 2-5 segons
    setTimeout(() => {
      simularRespuestaAutomatica(conversaId)
    }, Math.random() * 3000 + 2000)
  }

  const simularRespuestaAutomatica = (conversaId: string) => {
    const respostesAutomatiques = [
      'Interessant! Explica\'m més.',
      'D\'acord, ho tinc en compte.',
      'Gràcies per la informació!',
      'Podríem quedar per parlar-ho presencialment?',
      'Perfecte, seguim així.'
    ]

    const resposta = respostesAutomatiques[Math.floor(Math.random() * respostesAutomatiques.length)]
    
    const nouMissatge: Missatge = {
      id: `msg-auto-${Date.now()}`,
      conversaId,
      emissor: 'user-2', // L'altre participant
      contingut: resposta,
      data: new Date(),
      estat: 'entregat',
      tipus: 'text'
    }

    // Afegir a la conversa activa
    if (conversaActiva && conversaActiva.id === conversaId) {
      setConversaActiva(prev => prev ? {
        ...prev,
        missatges: [...prev.missatges, nouMissatge]
      } : null)
    }

    // Reproduir so de missatge rebut
    audioNotificacions.playMissatgeRebut()

    // Actualitzar llista de converses
    setConverses(prev => 
      prev.map(c => 
        c.id === conversaId ? {
          ...c,
          ultimMissatge: nouMissatge,
          ultimActivitat: new Date(),
          noLlegits: c.id === conversaActiva?.id ? 0 : c.noLlegits + 1
        } : c
      )
    )
  }

  // Funció per enviar email de notificació
  const enviarEmailNotificacio = async (conversaId: string, missatge: Missatge) => {
    try {
      // Trobar la conversa per obtenir els participants
      const conversa = converses.find(c => c.id === conversaId)
      if (!conversa) return

      // Trobar el destinatari (l'altre participant que no és l'emissor)
      const destinatariId = conversa.participants.find(p => p !== missatge.emissor)
      if (!destinatariId) return

      // Obtenir dades del destinatari
      const dadesDestinatari = await emailNotificacions.obtenirDadesUsuariPerEmail(destinatariId)
      if (!dadesDestinatari) return

      // Obtenir dades de l'emissor (simulat)
      const dadesEmisor = await emailNotificacions.obtenirDadesUsuariPerEmail(missatge.emissor)
      if (!dadesEmisor) return

      // Preparar dades per l'email
      const dadesEmail = {
        destinatariEmail: dadesDestinatari.email,
        destinatariNom: dadesDestinatari.nom,
        remitentNom: dadesEmisor.nom,
        remitentNick: `@${dadesEmisor.nom.toLowerCase().replace(' ', '_')}`,
        contingutMissatge: missatge.contingut,
        urlConversa: `${window.location.origin}/missatges/${conversaId}`
      }

      console.log('📧 Enviant email de notificació...')
      const emailEnviat = await emailNotificacions.enviarEmailMissatgeNou(dadesEmail)
      
      if (emailEnviat) {
        console.log('📧 Email de notificació enviat correctament')
      } else {
        console.log('📧 Email de notificació no s\'ha pogut enviar')
      }

    } catch (error) {
      console.error('📧 Error enviant email de notificació:', error)
    }
  }

  const marcarComLlegits = useCallback(async (conversaId: string) => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    setConverses(prev => 
      prev.map(c => 
        c.id === conversaId ? { ...c, noLlegits: 0 } : c
      )
    )
  }, [])

  const editarMissatge = async (missatgeId: string, nouContingut: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (conversaActiva) {
      setConversaActiva(prev => prev ? {
        ...prev,
        missatges: prev.missatges.map(m => 
          m.id === missatgeId ? {
            ...m,
            contingut: nouContingut,
            editat: true,
            dataEdicio: new Date()
          } : m
        )
      } : null)
    }
  }

  const eliminarMissatge = async (missatgeId: string) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (conversaActiva) {
      setConversaActiva(prev => prev ? {
        ...prev,
        missatges: prev.missatges.filter(m => m.id !== missatgeId)
      } : null)
    }
  }

  const value: MissatgesContextType = {
    converses,
    conversaActiva,
    resum,
    obtenirConverses,
    crearConversa,
    obrirConversa,
    tancarConversa,
    arxivarConversa,
    enviarMissatge,
    marcarComLlegits,
    editarMissatge,
    eliminarMissatge,
    pucEnviarMissatges,
    obtenirNomConversa
  }

  return (
    <MissatgesContext.Provider value={value}>
      {children}
    </MissatgesContext.Provider>
  )
}

export function useMissatges() {
  const context = useContext(MissatgesContext)
  if (!context) {
    throw new Error('useMissatges ha de ser usat dins d\'un MissatgesProvider')
  }
  return context
}