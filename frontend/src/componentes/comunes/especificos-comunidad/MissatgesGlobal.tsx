'use client'

import { useState, useEffect } from 'react'
import InterficieMissatges from './InterficieMissatges'

// Component global per gestionar l'estat de la interfície de missatges
let globalMissatgesHandler: {
  obrirConversa: (conversaId?: string) => void
  tancarConversa: () => void
} | null = null

export function MissatgesGlobal() {
  const [obert, setObert] = useState(false)
  const [conversaId, setConversaId] = useState<string | undefined>()

  const obrirConversa = (nouConversaId?: string) => {
    console.log('Obrint conversa:', nouConversaId)
    setConversaId(nouConversaId)
    setObert(true)
  }

  const tancarConversa = () => {
    setObert(false)
    setConversaId(undefined)
  }

  useEffect(() => {
    // Registrar els handlers globals només una vegada
    globalMissatgesHandler = {
      obrirConversa,
      tancarConversa
    }
    
    return () => {
      // Netejar quan es desmunta
      globalMissatgesHandler = null
    }
  }, [])

  return (
    <InterficieMissatges
      obert={obert}
      onTancar={tancarConversa}
      conversaId={conversaId}
    />
  )
}

// Funcions globals per obrir/tancar la interfície des de qualsevol component
export const obrirInterficieMissatges = (conversaId?: string) => {
  console.log('obrirInterficieMissatges cridat amb:', conversaId)
  if (globalMissatgesHandler) {
    globalMissatgesHandler.obrirConversa(conversaId)
  } else {
    console.warn('MissatgesGlobal no està muntat - assegurat que el component està renderitzat')
  }
}

export const tancarInterficieMissatges = () => {
  if (globalMissatgesHandler) {
    globalMissatgesHandler.tancarConversa()
  }
}