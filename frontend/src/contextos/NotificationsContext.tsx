'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Notificacio {
  id: string
  tipus: 'like' | 'comentari' | 'missatge' | 'seguiment' | 'grup'
  titol: string
  descripcio: string
  usuari?: {
    nom: string
    avatar?: string
    inicials: string
  }
  llegida: boolean
  dataCreacio: Date
  enllaç?: {
    tipus: 'post' | 'comentari' | 'perfil' | 'grup' | 'missatge'
    id: string
    comentariId?: string // Per navegar directament al comentari
  }
}

interface NotificationsContextType {
  notificacions: Notificacio[]
  notificacionsNoLlegides: number
  afegirNotificacio: (notificacio: Omit<Notificacio, 'id' | 'llegida' | 'dataCreacio'>) => void
  marcarComLlegida: (id: string) => void
  marcarTotesComLlegides: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Notificacions mock inicials que coincideixen amb el contingut real
const NOTIFICACIONS_MOCK: Notificacio[] = [
  {
    id: '1',
    tipus: 'like',
    titol: 'Nova reacció',
    descripcio: 'Roberto Jiménez ha reaccionat al teu post "Fent proves amb arxius"',
    usuari: {
      nom: 'Roberto Jiménez',
      inicials: 'RJ'
    },
    llegida: false,
    dataCreacio: new Date(2025, 7, 10, 14, 30),
    enllaç: {
      tipus: 'post',
      id: '1' // ID real del post que existeix
    }
  },
  {
    id: '2', 
    tipus: 'seguiment',
    titol: 'Nou seguidor',
    descripcio: 'Carmen Ruiz ha començat a seguir-te',
    usuari: {
      nom: 'Carmen Ruiz',
      inicials: 'CR'
    },
    llegida: false,
    dataCreacio: new Date(2025, 7, 10, 12, 15),
    enllaç: {
      tipus: 'perfil',
      id: 'user-carmen'
    }
  },
  {
    id: '3',
    tipus: 'missatge',
    titol: 'Nou missatge',
    descripcio: 'Ana Vega t\'ha enviat un missatge privat',
    usuari: {
      nom: 'Ana Vega',
      inicials: 'AV'
    },
    llegida: false,
    dataCreacio: new Date(2025, 7, 10, 10, 45),
    enllaç: {
      tipus: 'missatge',
      id: 'conversation-ana-vega'
    }
  }
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notificacions, setNotificacions] = useState<Notificacio[]>(NOTIFICACIONS_MOCK)

  const notificacionsNoLlegides = notificacions.filter(n => !n.llegida).length

  const afegirNotificacio = (novaNotificacio: Omit<Notificacio, 'id' | 'llegida' | 'dataCreacio'>) => {
    const notificacio: Notificacio = {
      ...novaNotificacio,
      id: Date.now().toString(),
      llegida: false,
      dataCreacio: new Date()
    }
    
    setNotificacions(prev => [notificacio, ...prev])
  }

  const marcarComLlegida = (id: string) => {
    setNotificacions(prev => 
      prev.map(n => n.id === id ? { ...n, llegida: true } : n)
    )
  }

  const marcarTotesComLlegides = () => {
    setNotificacions(prev => 
      prev.map(n => ({ ...n, llegida: true }))
    )
  }

  return (
    <NotificationsContext.Provider value={{
      notificacions,
      notificacionsNoLlegides,
      afegirNotificacio,
      marcarComLlegida,
      marcarTotesComLlegides
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}