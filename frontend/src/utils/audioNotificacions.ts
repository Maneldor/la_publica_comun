'use client'

// Sistema de notificacions d'àudio
export class AudioNotificacions {
  private static instance: AudioNotificacions
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  private constructor() {
    // Singleton pattern
  }

  static getInstance(): AudioNotificacions {
    if (!AudioNotificacions.instance) {
      AudioNotificacions.instance = new AudioNotificacions()
    }
    return AudioNotificacions.instance
  }

  private async initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn('No s\'ha pogut inicialitzar AudioContext:', error)
      }
    }
  }

  // Generar so sintètic per missatge enviat
  async playMissatgeEnviat() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // So suau i agradable per missatge enviat
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Error reproduint so d\'enviament:', error)
    }
  }

  // Generar so per missatge rebut
  async playMissatgeRebut() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // So més notable per missatge rebut
      const oscillator1 = this.audioContext.createOscillator()
      const oscillator2 = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator1.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // Do
      oscillator2.frequency.setValueAtTime(659.25, this.audioContext.currentTime) // Mi

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)

      oscillator1.start(this.audioContext.currentTime)
      oscillator2.start(this.audioContext.currentTime)
      oscillator1.stop(this.audioContext.currentTime + 0.4)
      oscillator2.stop(this.audioContext.currentTime + 0.4)
    } catch (error) {
      console.warn('Error reproduint so de recepció:', error)
    }
  }

  // Activar/desactivar sons
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-notifications-enabled', enabled.toString())
    }
  }

  isEnabled(): boolean {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('audio-notifications-enabled')
      if (stored !== null) {
        this.enabled = stored === 'true'
      }
    }
    return this.enabled
  }

  // So per errors o avisos
  async playError() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.5)

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.5)
    } catch (error) {
      console.warn('Error reproduint so d\'error:', error)
    }
  }

  // So per notificacions generals
  async playNotificacio() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // So elegant i distintiu per notificacions
      const oscillator1 = this.audioContext.createOscillator()
      const oscillator2 = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Notes: Sol i Si (sons més aguts i atractius)
      oscillator1.frequency.setValueAtTime(784, this.audioContext.currentTime) // Sol5
      oscillator2.frequency.setValueAtTime(988, this.audioContext.currentTime) // Si5

      gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6)

      oscillator1.start(this.audioContext.currentTime)
      oscillator2.start(this.audioContext.currentTime + 0.1)
      oscillator1.stop(this.audioContext.currentTime + 0.3)
      oscillator2.stop(this.audioContext.currentTime + 0.6)
    } catch (error) {
      console.warn('Error reproduint so de notificació:', error)
    }
  }

  // So per trucades entrants
  async playTrucadaEntrant() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // So més insistent per trucades
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.5)
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 1)

      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.25)
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + 0.5)
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.75)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 1.5)
    } catch (error) {
      console.warn('Error reproduint so de trucada:', error)
    }
  }

  // So d'èxit per accions completades
  async playExit() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // Progressió ascendent per transmetre èxit
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime) // La4
      oscillator.frequency.exponentialRampToValueAtTime(659, this.audioContext.currentTime + 0.2) // Mi5
      oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.4) // La5

      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.6)
    } catch (error) {
      console.warn('Error reproduint so d\'èxit:', error)
    }
  }

  // So per mencions o alertes importants
  async playMencio() {
    if (!this.enabled) return

    await this.initAudioContext()
    if (!this.audioContext) return

    try {
      // Triple beep per mencions
      const times = [0, 0.15, 0.3]
      
      times.forEach((time) => {
        const oscillator = this.audioContext!.createOscillator()
        const gainNode = this.audioContext!.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext!.destination)

        oscillator.frequency.setValueAtTime(1000, this.audioContext!.currentTime + time)
        gainNode.gain.setValueAtTime(0.18, this.audioContext!.currentTime + time)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + time + 0.1)

        oscillator.start(this.audioContext!.currentTime + time)
        oscillator.stop(this.audioContext!.currentTime + time + 0.1)
      })
    } catch (error) {
      console.warn('Error reproduint so de menció:', error)
    }
  }
}

// Export d'una instància per facilitar l'ús
export const audioNotificacions = AudioNotificacions.getInstance()