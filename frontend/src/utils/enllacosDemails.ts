'use client'

// Utilitats per gestionar els enllaços directes dels emails

export interface ParametresEnllac {
  tipus: 'missatge' | 'notificacio' | 'grup' | 'perfil'
  id: string
  accio?: string
  data?: string
}

// Generar enllaç directe per email
export function generarEnllacDirecte(parametres: ParametresEnllac): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lapublica.cat'
  
  switch (parametres.tipus) {
    case 'missatge':
      return `${baseUrl}/missatges?conversa=${parametres.id}&from=email&timestamp=${parametres.data || Date.now()}`
    
    case 'notificacio':
      return `${baseUrl}/notificacions?tipus=${parametres.accio || 'totes'}&highlight=${parametres.id}&from=email`
    
    case 'grup':
      const accioGrup = parametres.accio ? `&action=${parametres.accio}` : ''
      return `${baseUrl}/grupos-avanzados?grup=${parametres.id}${accioGrup}&from=email`
    
    case 'perfil':
      return `${baseUrl}/perfil/${parametres.id}?from=email`
    
    default:
      return `${baseUrl}?from=email`
  }
}

// Processar enllaç directe quan l'usuari arriba desde email
export function processarEnllacEmail(): {
  esDesdeEmail: boolean
  tipus?: string
  parametres?: Record<string, string>
} {
  if (typeof window === 'undefined') return { esDesdeEmail: false }
  
  const urlParams = new URLSearchParams(window.location.search)
  const esDesdeEmail = urlParams.has('from') && urlParams.get('from') === 'email'
  
  if (!esDesdeEmail) return { esDesdeEmail: false }
  
  // Extreure tots els paràmetres
  const parametres: Record<string, string> = {}
  urlParams.forEach((value, key) => {
    if (key !== 'from') {
      parametres[key] = value
    }
  })
  
  // Determinar tipus basant-se en la ruta
  const path = window.location.pathname
  let tipus = ''
  
  if (path.includes('/missatges')) tipus = 'missatge'
  else if (path.includes('/notificacions')) tipus = 'notificacio'
  else if (path.includes('/grupos-avanzados')) tipus = 'grup'
  else if (path.includes('/perfil')) tipus = 'perfil'
  
  return {
    esDesdeEmail: true,
    tipus,
    parametres
  }
}

// Marcar notificació com vista (tracking per emails)
export function marcarEmailComVist(
  tipus: 'missatge' | 'notificacio' | 'grup',
  id: string,
  usuariId: string = 'user-1'
) {
  // En producció, esto seria una llamada a la API para registrar que el usuario
  // ha visto la notificación desde el email
  const tracking = {
    id,
    tipus,
    usuariId,
    dataVista: new Date(),
    origen: 'email'
  }
  
  console.log('📧 Marcar email com vist:', tracking)
  
  // Guardar en localStorage temporalment
  const trackingKey = `email-tracking-${tipus}-${id}`
  localStorage.setItem(trackingKey, JSON.stringify(tracking))
  
  // En producció:
  // await fetch('/api/tracking/email-clicks', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(tracking)
  // })
}

// Obtenir estadístiques d'emails (per dashboard admin)
export function obtenirEstadistiquesEmails(): {
  emailsEnviats: number
  emailsVistos: number
  ratioObertura: number
  linksMesClicats: Array<{ tipus: string; count: number }>
} {
  // En producció, això vindria d'una API
  const emails = []
  
  // Obtenir tracking del localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('email-tracking-')) {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          emails.push(JSON.parse(data))
        } catch (e) {
          console.warn('Error parsing email tracking data:', e)
        }
      }
    }
  }
  
  // Calcular estadístiques
  const emailsEnviats = 50 // Mock - en producció vindria de la BD
  const emailsVistos = emails.length
  const ratioObertura = emailsEnviats > 0 ? (emailsVistos / emailsEnviats) * 100 : 0
  
  // Contar clics per tipus
  const comptadorTipus: Record<string, number> = {}
  emails.forEach(email => {
    comptadorTipus[email.tipus] = (comptadorTipus[email.tipus] || 0) + 1
  })
  
  const linksMesClicats = Object.entries(comptadorTipus)
    .map(([tipus, count]) => ({ tipus, count }))
    .sort((a, b) => b.count - a.count)
  
  return {
    emailsEnviats,
    emailsVistos,
    ratioObertura: Math.round(ratioObertura * 100) / 100,
    linksMesClicats
  }
}

// Validar token d'email (per evitar spam/abuse)
export function validarTokenEmail(token: string, id: string, timestamp: string): boolean {
  // En producció, això seria una validació real del token
  // Per ara, només validem que el timestamp no sigui massa antic
  
  if (!token || !id || !timestamp) return false
  
  const timestampNumeric = parseInt(timestamp, 10)
  if (isNaN(timestampNumeric)) return false
  
  // El enllaç és vàlid durant 30 dies
  const ara = Date.now()
  const diferencia = ara - timestampNumeric
  const diesEnMs = 30 * 24 * 60 * 60 * 1000 // 30 dies
  
  return diferencia <= diesEnMs
}

// Netejar URL després de processar l'enllaç d'email
export function netejarURLEmail() {
  if (typeof window === 'undefined') return
  
  const url = new URL(window.location.href)
  const hasEmailParams = url.searchParams.has('from') && url.searchParams.get('from') === 'email'
  
  if (hasEmailParams) {
    // Mantenir només els paràmetres essencials, eliminar els de tracking
    const paramsEssencials = ['conversa', 'tipus', 'grup', 'highlight']
    const nouSearchParams = new URLSearchParams()
    
    paramsEssencials.forEach(param => {
      const value = url.searchParams.get(param)
      if (value) {
        nouSearchParams.set(param, value)
      }
    })
    
    // Actualitzar URL sense recarregar la pàgina
    const novaUrl = `${url.pathname}${nouSearchParams.toString() ? `?${nouSearchParams.toString()}` : ''}`
    window.history.replaceState(null, '', novaUrl)
    
    console.log('🔗 URL netejada després de processar enllaç d\'email')
  }
}