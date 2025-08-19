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
}

// Export d'una instància per facilitar l'ús
export const audioNotificacions = AudioNotificacions.getInstance()