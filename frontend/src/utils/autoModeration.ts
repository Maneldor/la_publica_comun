// Sistema de Moderación Automática
// Detecta contenido problemático antes de la publicación

export interface ModerationResult {
  allowed: boolean
  requiresReview: boolean
  detected: DetectedIssue[]
  worstCategory: string | null
  confidence: number
  action: 'allow' | 'review' | 'block'
  message: string
}

export interface DetectedIssue {
  category: string
  matches: number
  confidence: number
  action: 'review' | 'block'
}

export interface AutoModerationConfig {
  enabled: boolean
  strictnessLevel: 'low' | 'medium' | 'high' | 'strict'
  autoBlock: boolean
  autoReview: boolean
  notifyModerators: boolean
  categories: {
    [key: string]: {
      enabled: boolean
      action: 'review' | 'block'
    }
  }
}

// Listas de palabras problemáticas (en producción serían más extensas y estarían en BD)
const contentFilters = {
  homophobic: [
    'marimacho', 'marica', 'bollera', 'travelo', 'raruno', 'afeminado', 'gay de mierda',
    'bollero', 'tortillera', 'maricón', 'pluma', 'sarasa'
  ],
  sexist: [
    'zorra', 'puta', 'guarra', 'frígida', 'histérica', 'feminazi', 'golfa', 
    'furcia', 'ramera', 'facilona', 'calientapollas'
  ],
  racist: [
    'negro de mierda', 'moro', 'sudaca', 'chino', 'panchito', 'gitano', 'paki',
    'negro cabeza', 'morito', 'sudamericano de mierda', 'maricón chino'
  ],
  violence: [
    'matar', 'morir', 'suicidio', 'asesinar', 'golpear', 'pegar', 'apuñalar',
    'disparar', 'torturar', 'violar', 'agredir', 'destruir'
  ],
  hate: [
    'odio', 'desprecio', 'asco', 'muerte', 'eliminar', 'destruir', 'aniquilar',
    'exterminar', 'quemar', 'linchar'
  ],
  spam: [
    'compra ahora', 'oferta especial', 'dinero fácil', 'haz clic aquí', 'gratis',
    'oferta limitada', 'gana dinero', 'trabajo desde casa', 'inversión garantizada'
  ],
  vulgar: [
    'joder', 'mierda', 'coño', 'polla', 'gilipollas', 'cabrón', 'hijo de puta',
    'me cago en', 'follar', 'hostias', 'cojones', 'capullo'
  ],
  misinformation: [
    'vacunas causan', 'teoría conspiración', 'gobierno oculta', 'fake news', 'mentira oficial',
    'tierra plana', 'chemtrails', 'illuminati controla'
  ]
}

// Configuración por defecto
const defaultConfig: AutoModerationConfig = {
  enabled: true,
  strictnessLevel: 'medium',
  autoBlock: true,
  autoReview: true,
  notifyModerators: true,
  categories: {
    homophobic: { enabled: true, action: 'block' },
    sexist: { enabled: true, action: 'block' },
    racist: { enabled: true, action: 'block' },
    violence: { enabled: true, action: 'review' },
    hate: { enabled: true, action: 'block' },
    spam: { enabled: true, action: 'review' },
    vulgar: { enabled: true, action: 'review' },
    misinformation: { enabled: true, action: 'review' }
  }
}

// Función principal de análisis de contenido
export const analyzeContent = (
  content: string, 
  title?: string, 
  config: AutoModerationConfig = defaultConfig
): ModerationResult => {
  if (!config.enabled) {
    return { 
      allowed: true, 
      requiresReview: false, 
      detected: [], 
      worstCategory: null, 
      confidence: 0, 
      action: 'allow',
      message: '' 
    }
  }

  const fullText = `${title || ''} ${content}`.toLowerCase()
  const detected: DetectedIssue[] = []
  let maxConfidence = 0
  let worstCategory = null

  // Analizar cada categoría
  Object.entries(contentFilters).forEach(([category, words]) => {
    if (!config.categories[category]?.enabled) return

    const matches = words.filter(word => fullText.includes(word.toLowerCase()))
    if (matches.length > 0) {
      // Calcular confianza basada en número de coincidencias y nivel de estrictez
      let baseConfidence = 60 + (matches.length * 15)
      
      // Ajustar según nivel de estrictez
      switch (config.strictnessLevel) {
        case 'low':
          baseConfidence = Math.max(75, baseConfidence)
          break
        case 'high':
          baseConfidence = Math.min(95, baseConfidence + 10)
          break
        case 'strict':
          baseConfidence = Math.min(98, baseConfidence + 20)
          break
      }

      const confidence = Math.min(98, baseConfidence)
      detected.push({
        category,
        matches: matches.length,
        confidence,
        action: config.categories[category].action
      })

      if (confidence > maxConfidence) {
        maxConfidence = confidence
        worstCategory = category
      }
    }
  })

  // Determinar acción final
  if (detected.length === 0) {
    return {
      allowed: true,
      requiresReview: false,
      detected: [],
      worstCategory: null,
      confidence: 0,
      action: 'allow',
      message: ''
    }
  }

  const worstDetection = detected.find(d => d.category === worstCategory)
  const action = worstDetection?.action || 'review'

  // Mensajes según la acción
  const messages = {
    block: 'La teva publicació conté contingut inapropiat i ha estat bloquejada automàticament. Si creus que és un error, contacta amb els moderadors.',
    review: 'La teva publicació serà revisada abans de ser visible per assegurar que compleix les normes de la comunitat.',
    allow: ''
  }

  // Mensajes específicos por categoría
  const categoryMessages = {
    homophobic: 'Contingut homòfob detectat',
    sexist: 'Contingut sexista detectat', 
    racist: 'Contingut racista detectat',
    violence: 'Contingut violent detectat',
    hate: 'Discurs d\'odi detectat',
    spam: 'Contingut publicitari detectat',
    vulgar: 'Llenguatge vulgar detectat',
    misinformation: 'Possible desinformació detectada'
  }

  const specificMessage = worstCategory ? categoryMessages[worstCategory as keyof typeof categoryMessages] : ''

  return {
    allowed: action !== 'block',
    requiresReview: action === 'review' || action === 'block',
    detected,
    worstCategory,
    confidence: maxConfidence,
    action: action as 'allow' | 'review' | 'block',
    message: action === 'allow' ? '' : `${specificMessage}. ${messages[action as keyof typeof messages]}`
  }
}

// Función para obtener estadísticas de moderación
export const getModerationStats = () => {
  // En producción, estos datos vendrían de la API
  return {
    totalBlocked: 45,
    totalReviewed: 23,
    todayBlocked: 8,
    todayReviewed: 5,
    falsePositives: 2,
    mostCommonCategory: 'vulgar'
  }
}

// Función para reportar falsos positivos
export const reportFalsePositive = (content: string, detectedCategory: string) => {
  // En producción, esto enviaría la información a la API para mejorar el sistema
  console.log('False positive reported:', { content, detectedCategory })
}