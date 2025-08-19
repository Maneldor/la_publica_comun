'use client'

// Paleta de colors per avatars automàtics
const AVATAR_COLORS = [
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#14B8A6', // teal-500
  '#8B5A2B', // brown-600
]

// Interfície per configuració d'avatar
export interface AvatarConfig {
  backgroundColor: string
  textColor: string
  initials: string
  nick: string
}

export class AvatarGenerator {
  
  // Generar hash simple per consistència de colors
  private static stringToHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Obtenir color consistent basat en el nick
  private static getColorForNick(nick: string): string {
    const hash = this.stringToHash(nick)
    const colorIndex = hash % AVATAR_COLORS.length
    return AVATAR_COLORS[colorIndex]
  }

  // Extreure inicials del nick
  private static extractInitials(nick: string): string {
    // Eliminar @ si existeix
    const cleanNick = nick.startsWith('@') ? nick.slice(1) : nick
    
    // Agafar les dues primeres lletres
    const initials = cleanNick.slice(0, 2).toUpperCase()
    
    // Si només hi ha una lletra, duplicar-la
    return initials.length === 1 ? initials + initials : initials
  }

  // Generar configuració completa d'avatar
  public static generateAvatar(nick: string): AvatarConfig {
    const backgroundColor = this.getColorForNick(nick)
    const initials = this.extractInitials(nick)
    
    return {
      backgroundColor,
      textColor: '#FFFFFF', // Sempre blanc per bona llegibilitat
      initials,
      nick
    }
  }

  // Generar URL d'avatar SVG (per si volem usar com a src)
  public static generateAvatarSVG(nick: string, size: number = 64): string {
    const config = this.generateAvatar(nick)
    
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${config.backgroundColor}"/>
        <text 
          x="50%" 
          y="50%" 
          text-anchor="middle" 
          dominant-baseline="central" 
          fill="${config.textColor}" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-weight="bold" 
          font-size="${size * 0.4}"
        >
          ${config.initials}
        </text>
      </svg>
    `.trim()
    
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  // Validar si un usuari té avatar personalitzat
  public static hasCustomAvatar(avatarUrl?: string): boolean {
    if (!avatarUrl) return false
    
    // Si comença amb data:image/svg+xml, és un avatar generat automàticament
    if (avatarUrl.startsWith('data:image/svg+xml')) return false
    
    // Si conté "images.unsplash.com" és un avatar mock
    if (avatarUrl.includes('images.unsplash.com')) return false
    
    return true
  }

  // Generar avatar per defecte quan un usuari es registra
  public static generateDefaultAvatar(nick: string): string {
    return this.generateAvatarSVG(nick)
  }
}

// Funció d'ajuda per components
export const getAvatarForUser = (nick: string, customAvatar?: string): string => {
  // Si té avatar personalitzat, usar-lo
  if (customAvatar && AvatarGenerator.hasCustomAvatar(customAvatar)) {
    return customAvatar
  }
  
  // Sinó, generar avatar automàtic
  return AvatarGenerator.generateDefaultAvatar(nick)
}

// Funció per obtenir inicials
export const getInitialsForUser = (nick: string): string => {
  return AvatarGenerator.generateAvatar(nick).initials
}

// Funció per obtenir color de fons
export const getBackgroundColorForUser = (nick: string): string => {
  return AvatarGenerator.generateAvatar(nick).backgroundColor
}