export const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

export const ROLES = {
  ADMIN: 'ADMIN',
  GESTOR_EMPRESAS: 'GESTOR_EMPRESAS',
  AGENTE_IA: 'AGENTE_IA',
  EMPLEADO_PUBLICO: 'EMPLEADO_PUBLICO',
  EMPRESA: 'EMPRESA',
  ADMINISTRACION_PUBLICA: 'ADMINISTRACION_PUBLICA',
  SINDICATO: 'SINDICATO',
} as const;

export const COMMUNITIES = {
  ANDALUCIA: 'ANDALUCIA',
  ARAGON: 'ARAGON',
  ASTURIAS: 'ASTURIAS',
  BALEARES: 'BALEARES',
  CANARIAS: 'CANARIAS',
  CANTABRIA: 'CANTABRIA',
  CASTILLA_LA_MANCHA: 'CASTILLA_LA_MANCHA',
  CASTILLA_Y_LEON: 'CASTILLA_Y_LEON',
  CATALUNYA: 'CATALUNYA',
  CEUTA: 'CEUTA',
  EXTREMADURA: 'EXTREMADURA',
  GALICIA: 'GALICIA',
  LA_RIOJA: 'LA_RIOJA',
  MADRID: 'MADRID',
  MELILLA: 'MELILLA',
  MURCIA: 'MURCIA',
  NAVARRA: 'NAVARRA',
  PAIS_VASCO: 'PAIS_VASCO',
  VALENCIA: 'VALENCIA',
} as const;

export const EMPLOYEE_CATEGORIES = [
  'A1',
  'A2',
  'B',
  'C1',
  'C2',
] as const;

export const SALARY_RANGES = [
  'menos-20k',
  '20k-30k',
  '30k-40k',
  '40k-50k',
  '50k-60k',
  '60k-70k',
  '70k-80k',
  'mas-80k',
] as const;

export const CONTRACT_TYPES = [
  'Funcionario de carrera',
  'Funcionario interino',
  'Personal laboral fijo',
  'Personal laboral temporal',
  'Personal eventual',
] as const;

export const ORGANIZATION_TYPES = [
  'Administración General del Estado',
  'Comunidad Autónoma',
  'Diputación Provincial',
  'Ayuntamiento',
  'Organismo Autónomo',
  'Empresa Pública',
  'Universidad',
  'Otros',
] as const;

export const POST_CATEGORIES = [
  'Oposiciones',
  'Formación',
  'Noticias',
  'Recursos',
  'Herramientas',
  'Eventos',
  'Ofertas',
  'Otros',
] as const;

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'free',
    emailsPerMonth: 100,
    aiCredits: 10,
    maxPosts: 5,
    analytics: false,
  },
  STARTER: {
    name: 'starter',
    emailsPerMonth: 1000,
    aiCredits: 100,
    maxPosts: 20,
    analytics: true,
    price: 99,
  },
  PROFESSIONAL: {
    name: 'professional',
    emailsPerMonth: 5000,
    aiCredits: 500,
    maxPosts: 100,
    analytics: true,
    aiAgents: 2,
    price: 299,
  },
  ENTERPRISE: {
    name: 'enterprise',
    emailsPerMonth: -1, // unlimited
    aiCredits: -1, // unlimited
    maxPosts: -1, // unlimited
    analytics: true,
    aiAgents: -1, // unlimited
    price: 999,
  },
} as const;

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  VERIFICATION: 'verification',
  PASSWORD_RESET: 'password-reset',
  CAMPAIGN: 'campaign',
  NOTIFICATION: 'notification',
} as const;

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  POST_VIEW: 'post_view',
  EMAIL_OPEN: 'email_open',
  EMAIL_CLICK: 'email_click',
  LEAD_CREATED: 'lead_created',
  LEAD_CONVERTED: 'lead_converted',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  PROFILE_UPDATE: 'profile_update',
} as const;

export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  COMPANY: (id: string) => `company:${id}`,
  EMPLOYEE: (id: string) => `employee:${id}`,
  POST: (id: string) => `post:${id}`,
  POSTS_LIST: (page: number, limit: number) => `posts:list:${page}:${limit}`,
  ANALYTICS: (companyId: string, period: string) => `analytics:${companyId}:${period}`,
} as const;

export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 3600, // 1 hour
  LONG: 86400, // 24 hours
} as const;

export const AGENT_LEVELS = {
  BASICO: 'BASICO',
  AVANZADO: 'AVANZADO', 
  EXPERTO: 'EXPERTO',
} as const;

export const AGENT_TYPES = {
  COMERCIAL: 'COMERCIAL',
  RRHH: 'RRHH',
  DISENADOR: 'DISENADOR',
  ANALISTA: 'ANALISTA',
  SOPORTE: 'SOPORTE',
  MARKETING: 'MARKETING',
} as const;

// CAPACIDADES DE AGENTES IA - EQUIPO VIRTUAL COMPLETO
export const AGENT_MISSIONS = {
  // PLAN BÁSICO - "Asistente Virtual" (99€/mes)
  // Reemplaza: 1 Asistente Junior (1.200€/mes)
  BASICO: {
    // === GESTIÓN DE PERFIL EMPRESA ===
    CREAR_FICHA_EMPRESA: {
      name: 'Crear ficha de empresa',
      description: 'Solicitar datos, diseñar y publicar la ficha empresarial',
      category: 'comercial',
      prompt: 'Eres un consultor experto. Solicita todos los datos necesarios para crear una ficha empresarial atractiva: nombre, sector, descripción, servicios, valores, historia, equipo, contacto. Diseña una ficha profesional y pide confirmación antes de publicar.',
      requiredData: ['company_info', 'branding_preferences'],
      automation: true
    },
    ACTUALIZAR_ESTADISTICAS: {
      name: 'Informes de estadísticas básicas',
      description: 'Generar informes semanales de clics, visitas y engagement',
      category: 'analista',
      prompt: 'Analiza las métricas de la empresa (visitas, clics, tiempo en página) y genera un informe semanal claro y visual. Incluye recomendaciones básicas.',
      frequency: 'weekly',
      automation: true
    },
    RESPONDER_CONSULTAS: {
      name: 'Atención al cliente básica',
      description: 'Responder consultas simples de empleados públicos',
      category: 'soporte',
      prompt: 'Eres el representante de la empresa. Responde consultas sobre servicios, ubicación, horarios y información básica de manera profesional y amigable.',
      realtime: true
    },
  },

  // PLAN AVANZADO - "Equipo Comercial IA" (299€/mes)
  // Reemplaza: Comercial + Marketing + Analista (4.500€/mes)
  AVANZADO: {
    // === INTELIGENCIA COMPETITIVA ===
    SCRAPING_COMPETENCIA: {
      name: 'Análisis de competencia',
      description: 'Scrapear y analizar empresas similares para insights estratégicos',
      category: 'analista',
      prompt: 'Analiza empresas similares en el sector. Scrape sus ofertas, precios, servicios, y estrategias. Genera un informe competitivo con recomendaciones para destacar.',
      frequency: 'daily',
      automation: true,
      tools: ['web_scraping', 'data_analysis']
    },
    CREAR_OFERTAS: {
      name: 'Creación de ofertas personalizadas',
      description: 'Solicitar datos, diseñar ofertas y publicarlas tras aprobación',
      category: 'comercial',
      prompt: 'Solicita todos los datos necesarios: tipo de servicio, presupuesto, timeline, requisitos específicos. Diseña ofertas atractivas basadas en análisis competitivo. Presenta borrador para aprobación.',
      requiredData: ['service_details', 'pricing_strategy', 'target_audience'],
      approval_required: true
    },
    ENGAGEMENT_INTELIGENTE: {
      name: 'Interacción sutil con empleados',
      description: 'Contactar empleados que mostraron interés de forma natural',
      category: 'comercial',
      prompt: 'Cuando un empleado público muestre interés (ver perfil, guardar oferta, etc.), inicia conversación sutil. Aporta valor, no vendas directamente. Construye relación.',
      triggers: ['profile_view', 'offer_save', 'extended_visit'],
      subtlety: 'high'
    },
    INFORMES_AVANZADOS: {
      name: 'Análisis predictivo',
      description: 'Informes con predicciones y recomendaciones estratégicas',
      category: 'analista',
      prompt: 'Genera informes avanzados con análisis predictivo: tendencias del sector, oportunidades emergentes, riesgo de leads, ROI por canal.',
      frequency: 'weekly',
      includes: ['predictions', 'recommendations', 'roi_analysis']
    },
  },

  // PLAN PREMIUM - "Dirección General IA" (999€/mes)  
  // Reemplaza: Director Comercial + CMO + Data Scientist + RRHH (12.000€/mes)
  EXPERTO: {
    // === ESTRATEGIA EMPRESARIAL ===
    ESTRATEGIA_INTEGRAL: {
      name: 'Estrategia empresarial completa',
      description: 'Desarrollar planes estratégicos como un Director General',
      category: 'estrategia',
      prompt: 'Actúas como Director General. Analiza mercado, competencia, recursos internos. Desarrolla estrategia integral: expansión, diversificación, optimización, roadmap 12 meses.',
      deliverables: ['strategic_plan', 'roadmap', 'kpi_framework'],
      frequency: 'quarterly'
    },
    AUTOMATIZACION_COMPLETA: {
      name: 'Automatización de procesos',
      description: 'Automatizar flujos completos de trabajo empresarial',
      category: 'automatizacion',
      prompt: 'Diseña y ejecuta automatizaciones completas: lead scoring, nurturing, seguimiento, reportes, alertas. Optimiza todos los procesos empresariales.',
      includes: ['lead_automation', 'reporting', 'alerts', 'workflows']
    },
    HEADHUNTING_IA: {
      name: 'Reclutamiento inteligente',
      description: 'Identificar y contactar talento específico proactivamente',
      category: 'rrhh',
      prompt: 'Identifica empleados públicos con perfiles específicos que necesita la empresa. Análisis predictivo de disponibilidad. Acercamiento estratégico personalizado.',
      proactive: true,
      targeting: 'advanced'
    },
    EXPANSION_MERCADOS: {
      name: 'Expansión a nuevos mercados',
      description: 'Identificar y penetrar nuevos segmentos y geografías',
      category: 'estrategia',
      prompt: 'Analiza oportunidades de expansión: nuevas CCAA, sectores no explorados, nichos emergentes. Desarrolla planes de entrada específicos.',
      scope: 'nationwide'
    },
    PREDICCIONES_MERCADO: {
      name: 'Inteligencia de mercado avanzada',
      description: 'Predicciones de mercado y tendencias sectoriales',
      category: 'analista',
      prompt: 'Análisis predictivo avanzado: cambios regulatorios, tendencias oposiciones, presupuestos públicos, necesidades emergentes. Anticipa el mercado.',
      ai_models: ['predictive', 'sentiment', 'trend_analysis']
    },
  },
} as const;

// PROPUESTA DE VALOR - EQUIPOS VIRTUALES vs EQUIPOS REALES
export const AGENT_PRICING = {
  BASICO: {
    planName: 'Asistente Virtual',
    monthlyPrice: 99,
    replaces: 'Asistente Junior (1.200€/mes)',
    savings: '92% de ahorro',
    tokensIncluded: 10000,
    maxAgents: 1,
    missions: 3,
    capabilities: [
      'Crear y gestionar ficha empresa',
      'Informes semanales básicos',  
      'Atención cliente 24/7',
      'Chat integrado en dashboard'
    ],
    ideal_for: 'Empresas pequeñas o que empiezan'
  },
  AVANZADO: {
    planName: 'Equipo Comercial IA',
    monthlyPrice: 299,
    replaces: 'Comercial + Marketing + Analista (4.500€/mes)',
    savings: '93% de ahorro',
    tokensIncluded: 50000,
    maxAgents: 3,
    missions: 8, // básicas + avanzadas
    capabilities: [
      'Todo lo del plan básico +',
      'Análisis competencia diario',
      'Creación ofertas personalizadas',
      'Engagement inteligente con leads',
      'Informes predictivos avanzados',
      'Web scraping automático'
    ],
    ideal_for: 'Empresas en crecimiento'
  },
  EXPERTO: {
    planName: 'Dirección General IA',
    monthlyPrice: 999,
    replaces: 'Director + CMO + Data Scientist + RRHH (12.000€/mes)',
    savings: '92% de ahorro',
    tokensIncluded: 200000,
    maxAgents: 10,
    missions: 13, // todas las misiones
    capabilities: [
      'Todo lo de planes anteriores +',
      'Estrategia empresarial completa',
      'Automatización total de procesos',
      'Headhunting inteligente',
      'Expansión a nuevos mercados',
      'Inteligencia de mercado avanzada',
      'Soporte prioritario 24/7'
    ],
    ideal_for: 'Empresas establecidas y administraciones'
  },
} as const;

// CAPACIDADES TÉCNICAS POR PLAN
export const PLAN_FEATURES = {
  BASICO: {
    dashboard_chat: true,
    automated_reports: 'weekly',
    company_profile_management: true,
    basic_analytics: true,
    customer_support: 'business_hours',
    ai_agents: 1,
    monthly_tasks: 1000,
  },
  AVANZADO: {
    dashboard_chat: true,
    automated_reports: 'daily',
    company_profile_management: true,
    basic_analytics: true,
    advanced_analytics: true,
    competitive_intelligence: true,
    lead_engagement: true,
    offer_creation: true,
    web_scraping: true,
    customer_support: '24/7',
    ai_agents: 3,
    monthly_tasks: 5000,
  },
  EXPERTO: {
    dashboard_chat: true,
    automated_reports: 'real_time',
    company_profile_management: true,
    basic_analytics: true,
    advanced_analytics: true,
    competitive_intelligence: true,
    lead_engagement: true,
    offer_creation: true,
    web_scraping: true,
    strategic_planning: true,
    process_automation: true,
    intelligent_recruitment: true,
    market_expansion: true,
    predictive_analysis: true,
    custom_ai_models: true,
    priority_support: true,
    dedicated_account_manager: true,
    customer_support: '24/7',
    ai_agents: 10,
    monthly_tasks: 'unlimited',
  },
} as const;