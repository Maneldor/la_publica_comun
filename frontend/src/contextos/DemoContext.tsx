'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { 
  ConfiguracionDemo, 
  DatosDemo, 
  AnalyticsDemo, 
  EventoTracking, 
  VistaDemo, 
  NavegacionDemo,
  AudienciaDemo,
  CTA,
  ConfiguracionTour,
  TipoEventoDemo 
} from '../../tipos/demo'

// ✅ INTERFACE DEL CONTEXTO DEMO
interface DemoContextType {
  // Configuración
  configuracion: ConfiguracionDemo
  setConfiguracion: (config: Partial<ConfiguracionDemo>) => void
  
  // Navegación
  navegacion: NavegacionDemo
  cambiarVista: (vista: VistaDemo) => void
  retroceder: () => void
  
  // Datos demo
  datosDemo: DatosDemo
  actualizarDatos: (datos: Partial<DatosDemo>) => void
  
  // Analytics y tracking
  analytics: AnalyticsDemo
  trackearEvento: (evento: Omit<EventoTracking, 'timestamp'>) => void
  
  // Tour guiado
  tourActivo: boolean
  pasoTourActual: number
  iniciarTour: () => void
  siguientePasoTour: () => void
  finalizarTour: () => void
  
  // CTAs dinámicos
  ctasActivos: CTA[]
  mostrarCTA: (ctaId: string) => void
  ocultarCTA: (ctaId: string) => void
  
  // Estado UI
  cargando: boolean
  error: string | null
  modoKiosko: boolean
  
  // Utilidades
  reiniciarDemo: () => void
  exportarResultados: () => void
}

// ✅ CONTEXTO
const DemoContext = createContext<DemoContextType | undefined>(undefined)

// ✅ CONFIGURACIÓN INICIAL
const configuracionInicial: ConfiguracionDemo = {
  audiencia: 'administracion',
  modo: 'libre',
  comunidadId: 'catalunya',
  idioma: 'es',
  duracionMaxima: 30,
  funcionalidadesDestacadas: ['networking_profesional', 'grupos_tematicos', 'eventos_formativos'],
  tracking: true,
  personalizacion: {
    mostrarOnboarding: true,
    destacarFuncionalidades: [],
    ocultarFuncionalidades: []
  }
}

const navegacionInicial: NavegacionDemo = {
  vistaActual: 'dashboard',
  historial: [],
  breadcrumbs: ['Inicio'],
  puedeRetroceder: false
}

const analyticsInicial: AnalyticsDemo = {
  sesionId: `demo_${Date.now()}`,
  duracionTotal: 0,
  eventos: [],
  puntuacionInteres: 0,
  funcionesUsadas: [],
  seccionesMasVisitadas: [],
  probabilidadConversion: 0
}

// ✅ PROVIDER COMPONENT
export function DemoProvider({ 
  children, 
  configuracionInicial: configProp 
}: { 
  children: ReactNode
  configuracionInicial?: Partial<ConfiguracionDemo>
}) {
  // Estados principales
  const [configuracion, setConfiguracionState] = useState<ConfiguracionDemo>({
    ...configuracionInicial,
    ...configProp
  })
  const [navegacion, setNavegacion] = useState<NavegacionDemo>(navegacionInicial)
  const [analytics, setAnalytics] = useState<AnalyticsDemo>(analyticsInicial)
  const [datosDemo, setDatosDemo] = useState<DatosDemo>({
    usuarios: [],
    grupos: [],
    posts: [],
    eventos: [],
    ofertas: [],
    estadisticasGlobales: {
      totalUsuarios: 0,
      usuariosActivos: 0,
      gruposActivos: 0,
      postsEsteMes: 0,
      eventosProximos: 0,
      engagement: { likesPromedio: 0, comentariosPromedio: 0, compartidosPromedio: 0 },
      crecimiento: { usuariosNuevos: 0, gruposNuevos: 0, tendencia: 'estable' }
    }
  })
  
  // Estados UI
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modoKiosko, setModoKiosko] = useState(false)
  
  // Estados del tour
  const [tourActivo, setTourActivo] = useState(false)
  const [pasoTourActual, setPasoTourActual] = useState(0)
  
  // CTAs dinámicos
  const [ctasActivos, setCTAsActivos] = useState<CTA[]>([
    {
      id: 'solicitar_demo',
      texto: 'Solicitar Demo Personalizada',
      tipo: 'primario',
      icono: '🎯',
      accion: 'solicitar_demo_personal',
      visible: false,
      destacado: true,
      condiciones: [
        { tipo: 'tiempo_minimo', valor: 5 },
        { tipo: 'secciones_visitadas', valor: ['feed', 'grupos'] }
      ]
    },
    {
      id: 'contactar_ventas',
      texto: 'Hablar con un Experto',
      tipo: 'secundario', 
      icono: '💬',
      accion: 'contactar_ventas',
      visible: false,
      destacado: false,
      condiciones: [
        { tipo: 'tiempo_minimo', valor: 10 }
      ]
    }
  ])
  
  // ✅ TIMER PARA ANALYTICS
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        duracionTotal: prev.duracionTotal + 1
      }))
      
      // Evaluar CTAs dinámicos
      evaluarCTAs()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // ✅ FUNCIONES PRINCIPALES
  
  const setConfiguracion = useCallback((config: Partial<ConfiguracionDemo>) => {
    setConfiguracionState(prev => ({ ...prev, ...config }))
    
    // Track cambio de configuración
    trackearEvento({
      tipo: 'cambio_vista',
      usuarioDemo: configuracion.usuarioInicialId || 'anonimo',
      seccion: 'configuracion',
      accion: 'actualizar_config',
      metadata: config
    })
  }, [])
  
  const cambiarVista = useCallback((vista: VistaDemo) => {
    const tiempoEnVistaAnterior = Date.now() - (navegacion.historial.length > 0 ? 0 : Date.now())
    
    // Track tiempo en vista anterior
    if (navegacion.vistaActual) {
      trackearEvento({
        tipo: 'tiempo_en_seccion',
        usuarioDemo: configuracion.usuarioInicialId || 'anonimo',
        seccion: navegacion.vistaActual,
        accion: 'salir_seccion',
        tiempo: tiempoEnVistaAnterior
      })
    }
    
    // Actualizar navegación
    setNavegacion(prev => ({
      vistaActual: vista,
      historial: [...prev.historial, prev.vistaActual].filter(Boolean) as VistaDemo[],
      breadcrumbs: [...prev.breadcrumbs, getNombreVista(vista)],
      puedeRetroceder: true,
      siguienteVistaSugerida: getSiguienteVistaSugerida(vista, configuracion.audiencia)
    }))
    
    // Track cambio de vista
    trackearEvento({
      tipo: 'cambio_vista',
      usuarioDemo: configuracion.usuarioInicialId || 'anonimo', 
      seccion: vista,
      accion: 'entrar_seccion'
    })
  }, [navegacion, configuracion])
  
  const retroceder = useCallback(() => {
    if (navegacion.historial.length === 0) return
    
    const vistaAnterior = navegacion.historial[navegacion.historial.length - 1]
    
    setNavegacion(prev => ({
      vistaActual: vistaAnterior,
      historial: prev.historial.slice(0, -1),
      breadcrumbs: prev.breadcrumbs.slice(0, -1),
      puedeRetroceder: prev.historial.length > 1
    }))
  }, [navegacion])
  
  const trackearEvento = useCallback((evento: Omit<EventoTracking, 'timestamp'>) => {
    const eventoCompleto: EventoTracking = {
      ...evento,
      timestamp: new Date()
    }
    
    setAnalytics(prev => {
      const nuevoEventos = [...prev.eventos, eventoCompleto]
      
      // Actualizar métricas derivadas
      const funcionesUsadas = Array.from(new Set(nuevoEventos.map(e => e.accion)))
      const seccionesMasVisitadas = calcularSeccionesMasVisitadas(nuevoEventos)
      const puntuacionInteres = calcularPuntuacionInteres(nuevoEventos)
      const probabilidadConversion = calcularProbabilidadConversion(nuevoEventos, prev.duracionTotal)
      
      return {
        ...prev,
        eventos: nuevoEventos,
        funcionesUsadas,
        seccionesMasVisitadas,
        puntuacionInteres,
        probabilidadConversion
      }
    })
  }, [])
  
  const actualizarDatos = useCallback((datos: Partial<DatosDemo>) => {
    setDatosDemo(prev => ({ ...prev, ...datos }))
  }, [])
  
  // ✅ TOUR GUIADO
  const iniciarTour = useCallback(() => {
    setTourActivo(true)
    setPasoTourActual(0)
    trackearEvento({
      tipo: 'inicio_sesion',
      usuarioDemo: configuracion.usuarioInicialId || 'anonimo',
      seccion: 'tour',
      accion: 'iniciar_tour'
    })
  }, [configuracion, trackearEvento])
  
  const siguientePasoTour = useCallback(() => {
    setPasoTourActual(prev => prev + 1)
  }, [])
  
  const finalizarTour = useCallback(() => {
    setTourActivo(false)
    setPasoTourActual(0)
    trackearEvento({
      tipo: 'conversion',
      usuarioDemo: configuracion.usuarioInicialId || 'anonimo',
      seccion: 'tour',
      accion: 'finalizar_tour'
    })
  }, [configuracion, trackearEvento])
  
  // ✅ GESTIÓN DE CTAs
  const mostrarCTA = useCallback((ctaId: string) => {
    setCTAsActivos(prev => prev.map(cta => 
      cta.id === ctaId ? { ...cta, visible: true } : cta
    ))
  }, [])
  
  const ocultarCTA = useCallback((ctaId: string) => {
    setCTAsActivos(prev => prev.map(cta => 
      cta.id === ctaId ? { ...cta, visible: false } : cta
    ))
  }, [])
  
  const evaluarCTAs = useCallback(() => {
    ctasActivos.forEach(cta => {
      if (cta.visible || !cta.condiciones) return
      
      const cumpleCondiciones = cta.condiciones.every(condicion => {
        switch (condicion.tipo) {
          case 'tiempo_minimo':
            return analytics.duracionTotal >= (condicion.valor as number) * 60
          case 'secciones_visitadas':
            const secciones = condicion.valor as string[]
            return secciones.every(seccion => 
              analytics.eventos.some(e => e.seccion === seccion)
            )
          case 'interacciones_minimas':
            return analytics.eventos.length >= (condicion.valor as number)
          default:
            return false
        }
      })
      
      if (cumpleCondiciones) {
        mostrarCTA(cta.id)
      }
    })
  }, [ctasActivos, analytics, mostrarCTA])
  
  // ✅ UTILIDADES
  const reiniciarDemo = useCallback(() => {
    setNavegacion(navegacionInicial)
    setAnalytics({
      ...analyticsInicial,
      sesionId: `demo_${Date.now()}`
    })
    setTourActivo(false)
    setPasoTourActual(0)
    setCTAsActivos(prev => prev.map(cta => ({ ...cta, visible: false })))
    
    trackearEvento({
      tipo: 'inicio_sesion',
      usuarioDemo: 'anonimo',
      seccion: 'demo',
      accion: 'reiniciar_demo'
    })
  }, [trackearEvento])
  
  const exportarResultados = useCallback(() => {
    const resultados = {
      sessionId: analytics.sesionId,
      configuracion,
      analytics,
      navegacion
    }
    
    // En producción, enviar a analytics
    console.log('📊 Resultados Demo:', resultados)
    
    // Descargar como JSON para análisis
    const blob = new Blob([JSON.stringify(resultados, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-results-${analytics.sesionId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [analytics, configuracion, navegacion])
  
  // ✅ VALUE OBJECT
  const value: DemoContextType = {
    configuracion,
    setConfiguracion,
    navegacion,
    cambiarVista,
    retroceder,
    datosDemo,
    actualizarDatos,
    analytics,
    trackearEvento,
    tourActivo,
    pasoTourActual,
    iniciarTour,
    siguientePasoTour,
    finalizarTour,
    ctasActivos,
    mostrarCTA,
    ocultarCTA,
    cargando,
    error,
    modoKiosko,
    reiniciarDemo,
    exportarResultados
  }
  
  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}

// ✅ HOOK DE USO
export function useDemo(): DemoContextType {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo debe usarse dentro de un DemoProvider')
  }
  return context
}

// ✅ FUNCIONES AUXILIARES
function getNombreVista(vista: VistaDemo): string {
  const nombres = {
    onboarding: 'Bienvenida',
    dashboard: 'Panel',
    feed: 'Inicio', 
    grupos: 'Grupos',
    eventos: 'Eventos',
    directorio: 'Directorio',
    mensajeria: 'Mensajes',
    empresas: 'Empresas',
    analytics: 'Analytics',
    configuracion: 'Configuración'
  }
  return nombres[vista as keyof typeof nombres] || vista
}

function getSiguienteVistaSugerida(vistaActual: VistaDemo, audiencia: AudienciaDemo): VistaDemo | undefined {
  const flujos = {
    administracion: ['dashboard', 'grupos', 'eventos', 'directorio'],
    empresa: ['dashboard', 'directorio', 'grupos', 'mensajeria'],
    sindicato: ['dashboard', 'grupos', 'eventos', 'feed'],
    ciudadano: ['feed', 'eventos', 'grupos', 'directorio'],
    stakeholder: ['dashboard', 'analytics', 'grupos', 'usuarios'],
    desarrollador: ['analytics', 'configuracion', 'grupos', 'feed']
  }
  
  const flujo = flujos[audiencia] || flujos.administracion
  const indexActual = flujo.indexOf(vistaActual)
  
  return indexActual >= 0 && indexActual < flujo.length - 1 
    ? flujo[indexActual + 1] as VistaDemo
    : undefined
}

function calcularSeccionesMasVisitadas(eventos: EventoTracking[]): string[] {
  const seccionCount = eventos.reduce((acc, evento) => {
    acc[evento.seccion] = (acc[evento.seccion] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(seccionCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([seccion]) => seccion)
}

function calcularPuntuacionInteres(eventos: EventoTracking[]): number {
  const puntajes = {
    'click_funcionalidad': 10,
    'interaccion_post': 15,
    'exploracion_grupo': 20,
    'tiempo_en_seccion': 5,
    'cambio_vista': 3
  }
  
  const total = eventos.reduce((suma, evento) => {
    return suma + (puntajes[evento.tipo as keyof typeof puntajes] || 1)
  }, 0)
  
  return Math.min(100, Math.round(total / eventos.length * 10))
}

function calcularProbabilidadConversion(eventos: EventoTracking[], duracion: number): number {
  // Algoritmo simple basado en engagement
  const factorTiempo = Math.min(duracion / 600, 1) // Max 10 minutos
  const factorInteracciones = Math.min(eventos.length / 20, 1) // Max 20 interacciones
  const factorSecciones = Math.min(new Set(eventos.map(e => e.seccion)).size / 5, 1) // Max 5 secciones
  
  return Math.round((factorTiempo + factorInteracciones + factorSecciones) / 3 * 100)
}