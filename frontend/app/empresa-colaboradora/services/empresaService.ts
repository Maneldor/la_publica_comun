// Servicio para obtener datos dinámicos de la empresa colaboradora

export interface EmpresaMetrics {
  ofertes: {
    actives: number
    limit: number
    progress: number
    trend: number
  }
  visualitzacions: {
    total: number
    thisMonth: number
    growth: number
    dailyAverage: number
    sources: {
      organic: number
      direct: number
      social: number
      referral: number
    }
  }
  clicks: {
    total: number
    conversion: number
    growth: number
    bounceRate: number
  }
  comunitats: {
    actives: number
    total: number
    top: string[]
    performance: { [key: string]: number }
  }
  pipeline: {
    pending: number
    inReview: number
    approved: number
    rejected: number
  }
}

export interface EmpresaAlert {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired?: boolean
  actionUrl?: string
}

export interface EmpresaData {
  empresa: {
    id: string
    nombre: string
    logo?: string
    sector: string
    plan: 'Basic' | 'Professional' | 'Premium Enterprise'
    planExpiry: Date
    billingCycle: 'monthly' | 'yearly'
    gestorComercial: {
      id: string
      nombre: string
      avatar?: string
      email: string
      phone?: string
      availability: string
    }
  }
  metrics: EmpresaMetrics
  alerts: EmpresaAlert[]
  performance: {
    weeklyTrend: number[]
    monthlyTrend: number[]
    bestPerformingOffer: {
      title: string
      views: number
      clicks: number
      applications: number
    }
  }
}

// Simular llamada API con datos dinámicos
export async function fetchEmpresaData(empresaId: string): Promise<EmpresaData> {
  // Sin delay para debugging
  // await new Promise(resolve => setTimeout(resolve, 50))
  
  // Generar datos dinámicos basados en la hora actual
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay()
  
  // Variación basada en hora del día (más actividad en horario laboral)
  const activityMultiplier = (hour >= 9 && hour <= 18) ? 1.3 : 0.7
  
  // Variación basada en día de la semana (menos actividad en fin de semana)
  const weekdayMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.2
  
  const baseViews = 8000
  const baseClicks = 2000
  
  return {
    empresa: {
      id: empresaId,
      nombre: "TechSolutions Barcelona S.L.",
      logo: "/api/placeholder/60/60",
      sector: "Tecnología",
      plan: "Premium Enterprise",
      planExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 días
      billingCycle: 'yearly',
      gestorComercial: {
        id: 'gest-001',
        nombre: "Maria González",
        avatar: "/api/placeholder/40/40",
        email: "maria.gonzalez@lapublica.cat",
        phone: "+34 666 555 444",
        availability: "Disponible"
      }
    },
    metrics: {
      ofertes: {
        actives: Math.floor(47 + Math.random() * 10),
        limit: 100,
        progress: 47 + Math.floor(Math.random() * 10),
        trend: Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 10
      },
      visualitzacions: {
        total: Math.floor(24650 + Math.random() * 5000),
        thisMonth: Math.floor(baseViews * activityMultiplier * weekdayMultiplier + Math.random() * 1000),
        growth: Math.random() * 30 - 5, // Entre -5% y +25%
        dailyAverage: Math.floor(baseViews / 30 * activityMultiplier),
        sources: {
          organic: Math.floor(Math.random() * 40 + 30),
          direct: Math.floor(Math.random() * 20 + 20),
          social: Math.floor(Math.random() * 20 + 15),
          referral: Math.floor(Math.random() * 15 + 10)
        }
      },
      clicks: {
        total: Math.floor(baseClicks * activityMultiplier * weekdayMultiplier + Math.random() * 500),
        conversion: Math.random() * 5 + 7, // Entre 7% y 12%
        growth: Math.random() * 40 - 10, // Entre -10% y +30%
        bounceRate: Math.random() * 20 + 30 // Entre 30% y 50%
      },
      comunitats: {
        actives: Math.floor(12 + Math.random() * 5),
        total: 17,
        top: ["Catalunya", "Madrid", "Andalusia", "Valencia", "País Basc"].slice(0, 3 + Math.floor(Math.random() * 2)),
        performance: {
          "Catalunya": Math.random() * 30 + 70,
          "Madrid": Math.random() * 30 + 60,
          "Andalusia": Math.random() * 30 + 50,
          "Valencia": Math.random() * 30 + 40
        }
      },
      pipeline: {
        pending: Math.floor(Math.random() * 15 + 5),
        inReview: Math.floor(Math.random() * 20 + 10),
        approved: Math.floor(Math.random() * 40 + 20),
        rejected: Math.floor(Math.random() * 5 + 1)
      }
    },
    alerts: generateDynamicAlerts(),
    performance: {
      weeklyTrend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000 + 500)),
      monthlyTrend: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000 + 500)),
      bestPerformingOffer: {
        title: getRandomOfferTitle(),
        views: Math.floor(Math.random() * 5000 + 1000),
        clicks: Math.floor(Math.random() * 500 + 100),
        applications: Math.floor(Math.random() * 50 + 10)
      }
    }
  }
}

// Generar alertas dinámicas basadas en el contexto actual
function generateDynamicAlerts(): EmpresaAlert[] {
  const alerts: EmpresaAlert[] = []
  const now = new Date()
  
  // Alerta de éxito reciente
  if (Math.random() > 0.3) {
    alerts.push({
      id: `alert-${Date.now()}-1`,
      type: 'success',
      title: 'Oferta Aprovada',
      message: `La vostra oferta '${getRandomOfferTitle()}' ha estat aprovada per ${getRandomCommunity()}`,
      timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000), // Última hora
      read: false,
      actionRequired: false
    })
  }
  
  // Alerta de warning si se acerca al límite
  if (Math.random() > 0.5) {
    alerts.push({
      id: `alert-${Date.now()}-2`,
      type: 'warning',
      title: 'Límit Proper',
      message: `Esteu utilitzant el ${Math.floor(Math.random() * 20 + 70)}% del vostre pla`,
      timestamp: new Date(now.getTime() - Math.random() * 3 * 60 * 60 * 1000), // Últimas 3 horas
      read: false,
      actionRequired: true,
      actionUrl: '/upgrade-plan'
    })
  }
  
  // Alerta informativa
  alerts.push({
    id: `alert-${Date.now()}-3`,
    type: 'info',
    title: 'Nova Funcionalitat',
    message: getRandomFeatureMessage(),
    timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000), // Último día
    read: Math.random() > 0.7,
    actionRequired: false
  })
  
  // Alerta de rendimiento
  if (Math.random() > 0.6) {
    alerts.push({
      id: `alert-${Date.now()}-4`,
      type: 'info',
      title: 'Millora de Rendiment',
      message: `Les vostres ofertes han tingut un ${Math.floor(Math.random() * 30 + 10)}% més de visualitzacions aquesta setmana`,
      timestamp: new Date(now.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000), // Últimos 2 días
      read: true,
      actionRequired: false
    })
  }
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Funciones auxiliares para generar contenido dinámico
function getRandomOfferTitle(): string {
  const titles = [
    'Desenvolupador Senior React',
    'Project Manager Digital',
    'Data Scientist',
    'DevOps Engineer',
    'UX/UI Designer',
    'Full Stack Developer',
    'Product Owner',
    'Scrum Master',
    'Backend Developer Python',
    'Frontend Developer Vue.js'
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

function getRandomCommunity(): string {
  const communities = [
    'Catalunya',
    'Madrid',
    'Andalusia',
    'València',
    'País Basc',
    'Galícia',
    'Castella i Lleó'
  ]
  return communities[Math.floor(Math.random() * communities.length)]
}

function getRandomFeatureMessage(): string {
  const messages = [
    'Ara podeu programar ofertes amb IA. Proveu-ho!',
    'Nova eina d\'anàlisi de competència disponible',
    'Hem millorat el sistema de matching de candidats',
    'Exportació de dades a Excel ara disponible',
    'Noves plantilles d\'ofertes optimitzades per SEO'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Función para obtener estadísticas en tiempo real
export async function fetchRealTimeStats(empresaId: string): Promise<{
  activeUsers: number
  viewsLastHour: number
  clicksLastHour: number
  newApplications: number
}> {
  // await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    activeUsers: Math.floor(Math.random() * 50 + 10),
    viewsLastHour: Math.floor(Math.random() * 100 + 50),
    clicksLastHour: Math.floor(Math.random() * 20 + 5),
    newApplications: Math.floor(Math.random() * 10)
  }
}

// Función para simular WebSocket de actualizaciones en tiempo real
export function subscribeToRealTimeUpdates(
  empresaId: string,
  callback: (update: any) => void
): () => void {
  const interval = setInterval(() => {
    const updateTypes = ['view', 'click', 'application', 'alert']
    const type = updateTypes[Math.floor(Math.random() * updateTypes.length)]
    
    callback({
      type,
      timestamp: new Date(),
      data: {
        offerId: `offer-${Math.floor(Math.random() * 100)}`,
        community: getRandomCommunity(),
        value: Math.floor(Math.random() * 100)
      }
    })
  }, 5000 + Math.random() * 10000) // Entre 5 y 15 segundos
  
  return () => clearInterval(interval)
}