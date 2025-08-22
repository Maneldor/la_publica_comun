'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react'
import { FiltrosGrupoAvanzado, ConfiguracionFeedGrupo, EstadisticasGrupoDashboard } from '../../../tipos/gruposAvanzados'

// ✅ TÉCNICA AVANZADA #1: Context para configuración y preferencias de usuario
// Este tipo de datos cambia poco pero es accedido frecuentemente
interface ConfiguracionContextType {
  // Filtros y configuración
  filtros: FiltrosGrupoAvanzado
  setFiltros: (filtros: FiltrosGrupoAvanzado) => void
  configuracionFeed: ConfiguracionFeedGrupo
  setConfiguracionFeed: (config: ConfiguracionFeedGrupo) => void
  
  // Estadísticas (solo admin)
  estadisticasDashboard: EstadisticasGrupoDashboard | null
  obtenerEstadisticas: () => Promise<void>
  cargandoEstadisticas: boolean
  
  // Preferencias de usuario persistidas
  gruposFijados: string[]
  notificacionesActivas: string[]
  fijarGrupo: (grupoId: string) => void
  desfijarGrupo: (grupoId: string) => void
  estaFijado: (grupoId: string) => boolean
  toggleNotificacionesGrupo: (grupoId: string) => void
  tieneNotificacionesActivas: (grupoId: string) => boolean
  
  // Utilidades
  resetearConfiguracion: () => void
}

const ConfiguracionContext = createContext<ConfiguracionContextType | undefined>(undefined)

// ✅ TÉCNICA #2: Default configurations como constantes
const DEFAULT_FILTROS: FiltrosGrupoAvanzado = {
  categoria: 'todos',
  tipus: 'todos',
  estado: 'activo',
  ordenarPer: 'recent',
  soloMisGrupos: false,
  textoBusqueda: ''
}

const DEFAULT_CONFIGURACION_FEED: ConfiguracionFeedGrupo = {
  mostrarAvatars: true,
  mostrarHorarios: true,
  ordenPostsPer: 'recent',
  filtrarPorTipus: 'todos',
  notificacionesInstantaneas: true,
  sonidoNotificaciones: true,
  temaDark: false
}

// ✅ TÉCNICA #3: LocalStorage utilities con error handling
const STORAGE_KEYS = {
  FILTROS: 'grupos_filtros',
  CONFIGURACION_FEED: 'grupos_config_feed',
  GRUPOS_FIJADOS: 'grupos_fijados',
  NOTIFICACIONES: 'grupos_notificaciones'
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error)
  }
}

export function ConfiguracionProvider({ children }: { children: ReactNode }) {
  // ✅ TÉCNICA #4: Lazy initialization con localStorage
  const [filtros, setFiltrosState] = useState<FiltrosGrupoAvanzado>(() => 
    loadFromStorage(STORAGE_KEYS.FILTROS, DEFAULT_FILTROS)
  )
  
  const [configuracionFeed, setConfiguracionFeedState] = useState<ConfiguracionFeedGrupo>(() =>
    loadFromStorage(STORAGE_KEYS.CONFIGURACION_FEED, DEFAULT_CONFIGURACION_FEED)
  )
  
  const [gruposFijados, setGruposFijados] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.GRUPOS_FIJADOS, [])
  )
  
  const [notificacionesActivas, setNotificacionesActivas] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICACIONES, [])
  )
  
  const [estadisticasDashboard, setEstadisticasDashboard] = useState<EstadisticasGrupoDashboard | null>(null)
  const [cargandoEstadisticas, setCargandoEstadisticas] = useState(false)

  // ✅ TÉCNICA #5: Auto-persist to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FILTROS, filtros)
  }, [filtros])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONFIGURACION_FEED, configuracionFeed)
  }, [configuracionFeed])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GRUPOS_FIJADOS, gruposFijados)
  }, [gruposFijados])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICACIONES, notificacionesActivas)
  }, [notificacionesActivas])

  // ✅ TÉCNICA #6: Wrapped setters que incluyen persistencia
  const setFiltros = useCallback((nuevosFiltros: FiltrosGrupoAvanzado) => {
    setFiltrosState(nuevosFiltros)
    // Persistence es automático gracias al useEffect
  }, [])

  const setConfiguracionFeed = useCallback((nuevaConfig: ConfiguracionFeedGrupo) => {
    setConfiguracionFeedState(nuevaConfig)
    // Persistence es automático gracias al useEffect
  }, [])

  // ✅ TÉCNICA #7: Estadísticas con caché temporal
  const obtenerEstadisticas = useCallback(async (): Promise<void> => {
    setCargandoEstadisticas(true)
    
    try {
      // Simular API call pesada
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const estadisticas: EstadisticasGrupoDashboard = {
        totalGrupos: 45,
        gruposActivos: 38,
        totalMembres: 1247,
        membresActius: 892,
        postsEsteMes: 456,
        ofertesActives: 23,
        activitatPromig: 78.5,
        creixementMensual: 12.3,
        topGrupos: [
          { nom: 'Desenvolupadors Frontend', membres: 234, activitat: 95 },
          { nom: 'Marketing Digital', membres: 189, activitat: 87 },
          { nom: 'Disseny UX/UI', membres: 156, activitat: 82 }
        ],
        tendencies: [
          { mes: 'Gen', nous: 23, actius: 156 },
          { mes: 'Feb', nous: 34, actius: 178 },
          { mes: 'Mar', nous: 29, actius: 189 },
          { mes: 'Abr', nous: 45, actius: 234 }
        ]
      }
      
      setEstadisticasDashboard(estadisticas)
    } catch (error) {
      console.error('Error obtenint estadístiques:', error)
    } finally {
      setCargandoEstadisticas(false)
    }
  }, [])

  // ✅ TÉCNICA #8: Optimized array operations
  const fijarGrupo = useCallback((grupoId: string) => {
    setGruposFijados(prev => {
      if (prev.includes(grupoId)) return prev // Already pinned
      return [...prev, grupoId]
    })
  }, [])

  const desfijarGrupo = useCallback((grupoId: string) => {
    setGruposFijados(prev => prev.filter(id => id !== grupoId))
  }, [])

  const estaFijado = useCallback((grupoId: string): boolean => {
    return gruposFijados.includes(grupoId)
  }, [gruposFijados])

  const toggleNotificacionesGrupo = useCallback((grupoId: string) => {
    setNotificacionesActivas(prev => {
      if (prev.includes(grupoId)) {
        return prev.filter(id => id !== grupoId) // Remove
      } else {
        return [...prev, grupoId] // Add
      }
    })
  }, [])

  const tieneNotificacionesActivas = useCallback((grupoId: string): boolean => {
    return notificacionesActivas.includes(grupoId)
  }, [notificacionesActivas])

  const resetearConfiguracion = useCallback(() => {
    setFiltrosState(DEFAULT_FILTROS)
    setConfiguracionFeedState(DEFAULT_CONFIGURACION_FEED)
    setGruposFijados([])
    setNotificacionesActivas([])
    
    // También limpiar localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    })
  }, [])

  // ✅ TÉCNICA #9: Selective memoization
  // Solo memoizar el value object cuando cambien las dependencias relevantes
  const contextValue = useMemo(() => ({
    filtros,
    setFiltros,
    configuracionFeed,
    setConfiguracionFeed,
    estadisticasDashboard,
    obtenerEstadisticas,
    cargandoEstadisticas,
    gruposFijados,
    notificacionesActivas,
    fijarGrupo,
    desfijarGrupo,
    estaFijado,
    toggleNotificacionesGrupo,
    tieneNotificacionesActivas,
    resetearConfiguracion
  }), [
    filtros,
    setFiltros,
    configuracionFeed,
    setConfiguracionFeed,
    estadisticasDashboard,
    obtenerEstadisticas,
    cargandoEstadisticas,
    gruposFijados,
    notificacionesActivas,
    fijarGrupo,
    desfijarGrupo,
    estaFijado,
    toggleNotificacionesGrupo,
    tieneNotificacionesActivas,
    resetearConfiguracion
  ])

  return (
    <ConfiguracionContext.Provider value={contextValue}>
      {children}
    </ConfiguracionContext.Provider>
  )
}

export function useConfiguracion() {
  const context = useContext(ConfiguracionContext)
  if (context === undefined) {
    throw new Error('useConfiguracion must be used within a ConfiguracionProvider')
  }
  return context
}