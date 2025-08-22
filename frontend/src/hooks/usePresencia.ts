'use client'

import { useEffect, useCallback } from 'react'
import { emailNotificacionsService } from '../servicios/emailNotificacions'

// Hook per gestionar la presència online/offline de l'usuari
export function usePresencia(usuariId: string = 'user-1') {
  
  // Actualitzar activitat cada cop que l'usuari interactua
  const actualitzarActivitat = useCallback(() => {
    emailNotificacionsService.actualitzarActivitatUsuari(usuariId)
  }, [usuariId])

  // Configurar listeners per detectar activitat
  useEffect(() => {
    // Actualitzar activitat immediatament
    actualitzarActivitat()

    // Events que indiquen que l'usuari està actiu
    const eventsDActivitat = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'focus'
    ]

    // Throttle per evitar massa crides
    let ultimaActualitzacio = 0
    const throttleInterval = 30000 // 30 segons

    const handleActivitat = () => {
      const ara = Date.now()
      if (ara - ultimaActualitzacio > throttleInterval) {
        actualitzarActivitat()
        ultimaActualitzacio = ara
      }
    }

    // Afegir listeners
    eventsDActivitat.forEach(event => {
      document.addEventListener(event, handleActivitat, { passive: true })
    })

    // Detectar quan l'usuari canvia de pestanya/finestra
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        actualitzarActivitat()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Detectar quan l'usuari torna a la finestra
    const handleFocus = () => {
      actualitzarActivitat()
    }

    window.addEventListener('focus', handleFocus)

    // Actualitzar activitat periòdicament mentre l'usuari està actiu
    const interval = setInterval(() => {
      if (!document.hidden) {
        actualitzarActivitat()
      }
    }, 60000) // Cada minut

    // Cleanup
    return () => {
      eventsDActivitat.forEach(event => {
        document.removeEventListener(event, handleActivitat)
      })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [actualitzarActivitat])

  // Detectar online/offline
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Usuari connectat a internet')
      actualitzarActivitat()
    }

    const handleOffline = () => {
      console.log('🌐 Usuari desconnectat d\'internet')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [actualitzarActivitat])

  // Detectar quan l'usuari tanca la pestanya/finestra
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Marcar l'usuari com offline
      const ultimaActivitat = new Date(Date.now() - 11 * 60 * 1000) // 11 minuts enrere
      localStorage.setItem(`user-${usuariId}-last-activity`, ultimaActivitat.toISOString())
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [usuariId])

  return {
    actualitzarActivitat,
    esOnline: () => emailNotificacionsService.esUsuariOnline(usuariId)
  }
}