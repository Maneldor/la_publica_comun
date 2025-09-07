import { useContext } from 'react'
import { ComunidadContext } from '../../ComunidadContext'

const traduccions = {
  ca: {
    // Header
    planPremium: "Premium Enterprise",
    gestorComercial: "Gestor Comercial",
    
    // Sidebar
    dashboard: "Dashboard Principal",
    perfilEmpresa: "Perfil de Empresa",
    mevasOfertes: "Gestió d'Ofertes",
    analytics: "Analytics i Informes",
    grupsOcults: "Grups Ocults",
    comunicacio: "Centre de Comunicació",
    configIA: "Configuració IA",
    recursos: "Recursos i Suport",
    
    // Quick Actions
    novaOferta: "Nova Oferta",
    creaOfertaIA: "Crea una oferta amb IA",
    veureRendiment: "Veure rendiment",
    chatIA: "Chat IA",
    assessorComercial: "Assessor comercial",
    accionsRapides: "Accions Ràpides",
    
    // Metrics
    ofertesActives: "Ofertes Actives",
    usPla: "Ús del pla",
    visualitzacions: "Visualitzacions",
    visualitzacionsAquestMes: "Visualitzacions aquest mes",
    clicks: "Clicks",
    conversio: "conversió",
    comunitatsActives: "Comunitats Actives",
    
    // Pipeline
    pipelineAprovacio: "Pipeline d'Aprovació",
    pendents: "Pendents",
    enRevisio: "En Revisió",
    aprovades: "Aprovades",
    rebutjades: "Rebutjades",
    
    // Notificacions
    notificacions: "Notificacions",
    ofertaAprovada: "Oferta Aprovada",
    limitProper: "Límit Proper",
    novaFuncionalitat: "Nova Funcionalitat",
    
    // Performance
    rendimentUltims30Dies: "Rendiment dels Últims 30 Dies",
    graficRendiment: "Gràfic de rendiment es carregarà aquí",
    
    // AI Chat
    assessorComercialIA: "Assessor Comercial IA",
    especialistaEmpreses: "Especialista en empreses col·laboradores",
    hola: "Hola! Soc el vostre assessor comercial IA.",
    pucAjudar: "Puc ajudar-vos amb optimització d'ofertes, anàlisi de rendiment i estratègies per millorar la vostra presència a La Pública.",
    recomanacio: "Recomanació",
    oportunitat: "Oportunitat",
    pregunteuMetriques: "Pregunteu sobre les vostres mètriques...",
    
    // Alerts
    fa2minuts: "fa 2 minuts",
    fa1hora: "fa 1 hora",
    fa3hores: "fa 3 hores",
    
    // Loading states
    carregantDades: "Carregant dades...",
    tornAIntentar: "Tornar a intentar",
    
    // Buttons
    verDetalls: "Veure detalls",
    verPendents: "Ver Pendents",
    revisar: "Revisar",
    verAprovades: "Ver Aprovades",
    verMotius: "Ver Motius",
    veureOferta: "Veure Oferta",
    revisarLimit: "Revisar Límit",
    descobrir: "Descobrir",
    veureTotsNotificacions: "Veure totes les notificacions",
    gestionarPla: "Gestionar Pla",
    veureTotsTooltips: "Veure Tots els Tips",
    chat: "Chat",
    cita: "Cita"
  },
  es: {
    // Header
    planPremium: "Premium Enterprise",
    gestorComercial: "Gestor Comercial",
    
    // Sidebar
    dashboard: "Dashboard Principal",
    perfilEmpresa: "Perfil de Empresa",
    mevasOfertes: "Gestión de Ofertas",
    analytics: "Analytics e Informes",
    grupsOcults: "Grupos Ocultos",
    comunicacio: "Centro de Comunicación",
    configIA: "Configuración IA",
    recursos: "Recursos y Soporte",
    
    // Quick Actions
    novaOferta: "Nueva Oferta",
    creaOfertaIA: "Crea una oferta con IA",
    veureRendiment: "Ver rendimiento",
    chatIA: "Chat IA",
    assessorComercial: "Asesor comercial",
    accionsRapides: "Acciones Rápidas",
    
    // Metrics
    ofertesActives: "Ofertas Activas",
    usPla: "Uso del plan",
    visualitzacions: "Visualizaciones",
    visualitzacionsAquestMes: "Visualizaciones este mes",
    clicks: "Clics",
    conversio: "conversión",
    comunitatsActives: "Comunidades Activas",
    
    // Pipeline
    pipelineAprovacio: "Pipeline de Aprobación",
    pendents: "Pendientes",
    enRevisio: "En Revisión",
    aprovades: "Aprobadas",
    rebutjades: "Rechazadas",
    
    // Notificacions
    notificacions: "Notificaciones",
    ofertaAprovada: "Oferta Aprobada",
    limitProper: "Límite Próximo",
    novaFuncionalitat: "Nueva Funcionalidad",
    
    // Performance
    rendimentUltims30Dies: "Rendimiento de los Últimos 30 Días",
    graficRendiment: "Gráfico de rendimiento se cargará aquí",
    
    // AI Chat
    assessorComercialIA: "Asesor Comercial IA",
    especialistaEmpreses: "Especialista en empresas colaboradoras",
    hola: "¡Hola! Soy vuestro asesor comercial IA.",
    pucAjudar: "Puedo ayudaros con optimización de ofertas, análisis de rendimiento y estrategias para mejorar vuestra presencia en La Pública.",
    recomanacio: "Recomendación",
    oportunitat: "Oportunidad",
    pregunteuMetriques: "Pregunta sobre tus métricas...",
    
    // Alerts
    fa2minuts: "hace 2 minutos",
    fa1hora: "hace 1 hora",
    fa3hores: "hace 3 horas",
    
    // Loading states
    carregantDades: "Cargando datos...",
    tornAIntentar: "Reintentar",
    
    // Buttons
    verDetalls: "Ver detalles",
    verPendents: "Ver Pendientes",
    revisar: "Revisar",
    verAprovades: "Ver Aprobadas",
    verMotius: "Ver Motivos",
    veureOferta: "Ver Oferta",
    revisarLimit: "Revisar Límite",
    descobrir: "Descubrir",
    veureTotsNotificacions: "Ver todas las notificaciones",
    gestionarPla: "Gestionar Plan",
    veureTotsTooltips: "Ver Todos los Tips",
    chat: "Chat",
    cita: "Cita"
  }
}

export function useTranslations() {
  const contexto = useContext(ComunidadContext)
  const idioma = contexto?.idioma || 'ca'
  
  const t = (key: keyof typeof traduccions.ca): string => {
    const lang = idioma === 'ca' ? 'ca' : 'es'
    return traduccions[lang][key] || traduccions.ca[key]
  }

  // Función para formatear tiempo relativo
  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (idioma === 'ca') {
      if (minutes < 60) return `fa ${minutes} ${minutes === 1 ? 'minut' : 'minuts'}`
      if (hours < 24) return `fa ${hours} ${hours === 1 ? 'hora' : 'hores'}`
      return `fa ${days} ${days === 1 ? 'dia' : 'dies'}`
    } else {
      if (minutes < 60) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
      if (hours < 24) return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`
    }
  }

  return { t, formatTimeAgo, idioma }
}