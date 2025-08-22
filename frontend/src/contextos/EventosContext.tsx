'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useReducer } from 'react'
import { 
  Evento, 
  ComentarioEvento, 
  AsistenciaEvento,
  FiltrosEvento, 
  ConfiguracionCalendario,
  EstadisticasEventos,
  FormularioEventoData,
  AccionAsistencia,
  VistaCalendario,
  CategoriaEvento
} from '../../tipos/eventos'
import { useNotifications } from './NotificationsContext'

// ✅ TÉCNICA AVANZADA #1: useReducer para estado complejo de eventos
type EventosAction = 
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_EVENTOS'; eventos: Evento[] }
  | { type: 'ADD_EVENTO'; evento: Evento }
  | { type: 'UPDATE_EVENTO'; eventoId: string; data: Partial<Evento> }
  | { type: 'DELETE_EVENTO'; eventoId: string }
  | { type: 'SET_ASISTENCIAS'; asistencias: AsistenciaEvento[] }
  | { type: 'UPDATE_ASISTENCIA'; eventoId: string; usuarioId: string; accion: AccionAsistencia }
  | { type: 'ADD_COMENTARIO'; comentario: ComentarioEvento }
  | { type: 'SET_COMENTARIOS'; eventoId: string; comentarios: ComentarioEvento[] }

interface EventosState {
  eventos: Evento[]
  asistencias: AsistenciaEvento[]
  comentarios: { [eventoId: string]: ComentarioEvento[] }
  cargando: boolean
  estadisticas: EstadisticasEventos | null
}

function eventosReducer(state: EventosState, action: EventosAction): EventosState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.loading }
    
    case 'SET_EVENTOS':
      return { ...state, eventos: action.eventos }
    
    case 'ADD_EVENTO':
      return { 
        ...state, 
        eventos: [action.evento, ...state.eventos].sort((a, b) => 
          new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        )
      }
    
    case 'UPDATE_EVENTO':
      return {
        ...state,
        eventos: state.eventos.map(evento => 
          evento.id === action.eventoId ? { ...evento, ...action.data } : evento
        )
      }
    
    case 'DELETE_EVENTO':
      return {
        ...state,
        eventos: state.eventos.filter(evento => evento.id !== action.eventoId)
      }
    
    case 'SET_ASISTENCIAS':
      return { ...state, asistencias: action.asistencias }
    
    case 'UPDATE_ASISTENCIA':
      const asistenciaExistente = state.asistencias.find(
        a => a.eventoId === action.eventoId && a.usuarioId === action.usuarioId
      )
      
      if (asistenciaExistente) {
        return {
          ...state,
          asistencias: state.asistencias.map(a =>
            a.eventoId === action.eventoId && a.usuarioId === action.usuarioId
              ? { ...a, estado: action.accion, fechaRespuesta: new Date() }
              : a
          )
        }
      } else {
        const nuevaAsistencia: AsistenciaEvento = {
          id: `${action.eventoId}-${action.usuarioId}`,
          usuarioId: action.usuarioId,
          eventoId: action.eventoId,
          estado: action.accion,
          fechaRespuesta: new Date()
        }
        
        return {
          ...state,
          asistencias: [...state.asistencias, nuevaAsistencia]
        }
      }
    
    case 'ADD_COMENTARIO':
      const eventoId = action.comentario.eventoId
      return {
        ...state,
        comentarios: {
          ...state.comentarios,
          [eventoId]: [
            ...(state.comentarios[eventoId] || []),
            action.comentario
          ]
        }
      }
    
    case 'SET_COMENTARIOS':
      return {
        ...state,
        comentarios: {
          ...state.comentarios,
          [action.eventoId]: action.comentarios
        }
      }
    
    default:
      return state
  }
}

// ✅ TÉCNICA #2: Contexto separado para filtros y configuración
interface EventosFiltrosContextType {
  filtros: FiltrosEvento
  setFiltros: (filtros: Partial<FiltrosEvento>) => void
  configuracionCalendario: ConfiguracionCalendario
  setConfiguracionCalendario: (config: Partial<ConfiguracionCalendario>) => void
  resetearFiltros: () => void
}

interface EventosDataContextType {
  // Estado
  eventos: Evento[]
  asistencias: AsistenciaEvento[]
  comentarios: { [eventoId: string]: ComentarioEvento[] }
  cargando: boolean
  estadisticas: EstadisticasEventos | null
  
  // CRUD Eventos
  crearEvento: (datos: FormularioEventoData) => Promise<Evento>
  actualizarEvento: (id: string, datos: Partial<Evento>) => Promise<void>
  eliminarEvento: (id: string) => Promise<void>
  
  // Asistencias
  gestionarAsistencia: (eventoId: string, accion: AccionAsistencia) => Promise<void>
  obtenerAsistencia: (eventoId: string, usuarioId?: string) => AccionAsistencia | null
  
  // Comentarios
  comentarEvento: (eventoId: string, contenido: string) => Promise<void>
  obtenerComentarios: (eventoId: string) => ComentarioEvento[]
  
  // Utilidades
  obtenerEventosPorCategoria: (categoria: CategoriaEvento) => Evento[]
  obtenerEventosProximos: (dias?: number) => Evento[]
  obtenerMisEventos: (usuarioId?: string) => Evento[]
  cargarEstadisticas: () => Promise<void>
}

const EventosFiltrosContext = createContext<EventosFiltrosContextType | undefined>(undefined)
const EventosDataContext = createContext<EventosDataContextType | undefined>(undefined)

// ✅ DEFAULTS
const DEFAULT_FILTROS: FiltrosEvento = {
  busqueda: '',
  categoria: 'todas',
  tipo: 'todos',
  modalidad: 'todas',
  fecha: 'todos',
  soloAsistiendo: false,
  soloOrganizados: false,
  estado: ['programado', 'en-progreso']
}

const DEFAULT_CONFIG_CALENDARIO: ConfiguracionCalendario = {
  vista: 'mes',
  fechaInicial: new Date(),
  mostrarFinDeSemana: true,
  horaInicio: 8,
  horaFin: 22,
  intervaloHoras: 1
}

function createInitialState(): EventosState {
  return {
    eventos: [],
    asistencias: [],
    comentarios: {},
    cargando: false,
    estadisticas: null
  }
}

// ✅ PROVIDER PARA FILTROS (Cambia poco, accedido frecuentemente)
export function EventosFiltrosProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltrosState] = useState<FiltrosEvento>(DEFAULT_FILTROS)
  const [configuracionCalendario, setConfiguracionState] = useState<ConfiguracionCalendario>(DEFAULT_CONFIG_CALENDARIO)

  const setFiltros = useCallback((nuevosFiltros: Partial<FiltrosEvento>) => {
    setFiltrosState(prev => ({ ...prev, ...nuevosFiltros }))
  }, [])

  const setConfiguracionCalendario = useCallback((nuevaConfig: Partial<ConfiguracionCalendario>) => {
    setConfiguracionState(prev => ({ ...prev, ...nuevaConfig }))
  }, [])

  const resetearFiltros = useCallback(() => {
    setFiltrosState(DEFAULT_FILTROS)
  }, [])

  const contextValue = useMemo(() => ({
    filtros,
    setFiltros,
    configuracionCalendario,
    setConfiguracionCalendario,
    resetearFiltros
  }), [filtros, setFiltros, configuracionCalendario, setConfiguracionCalendario, resetearFiltros])

  return (
    <EventosFiltrosContext.Provider value={contextValue}>
      {children}
    </EventosFiltrosContext.Provider>
  )
}

// ✅ PROVIDER PARA DATA (Cambia frecuentemente)
export function EventosDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventosReducer, undefined, createInitialState)
  const { addNotification } = useNotifications()

  // ✅ TÉCNICA #3: Optimistic Updates con Rollback
  const crearEvento = useCallback(async (datos: FormularioEventoData): Promise<Evento> => {
    dispatch({ type: 'SET_LOADING', loading: true })

    const nuevoEvento: Evento = {
      id: `evento-${Date.now()}`,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      tipo: datos.tipo,
      modalidad: datos.modalidad,
      fechaInicio: new Date(datos.fechaInicio),
      fechaFin: datos.fechaFin ? new Date(datos.fechaFin) : undefined,
      ubicacion: datos.ubicacion,
      capacidadMaxima: datos.capacidadMaxima,
      asistentes: 0,
      fechaCreacion: new Date(),
      creadorId: 'user-1', // TODO: Get from auth context
      comunidadId: 'comunidad-actual',
      estado: 'programado',
      esGratuito: datos.esGratuito,
      requiereAprobacion: datos.requiereAprobacion,
      organizador: 'Usuario Actual',
      activo: true,
      etiquetas: datos.etiquetas,
      urlReunion: datos.urlReunion,
      imagenPortada: datos.imagenPortada,
      precio: datos.precio
    }

    try {
      // Optimistic update
      dispatch({ type: 'ADD_EVENTO', evento: nuevoEvento })

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 800))

      addNotification({
        id: Date.now().toString(),
        titol: 'Esdeveniment creat',
        descripcio: `L'esdeveniment "${nuevoEvento.titulo}" s'ha creat correctament`,
        tipus: 'success',
        data: new Date()
      })

      return nuevoEvento
    } catch (error) {
      // Rollback
      dispatch({ type: 'DELETE_EVENTO', eventoId: nuevoEvento.id })
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut crear l\'esdeveniment',
        tipus: 'error',
        data: new Date()
      })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [addNotification])

  const gestionarAsistencia = useCallback(async (eventoId: string, accion: AccionAsistencia): Promise<void> => {
    const usuarioId = 'user-1' // TODO: Get from auth

    // Optimistic update
    dispatch({ type: 'UPDATE_ASISTENCIA', eventoId, usuarioId, accion })

    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const mensajes = {
        asistir: 'T\'has apuntat a l\'esdeveniment',
        'no-asistir': 'Has cancel·lat la teva assistència',
        quizas: 'Has marcat l\'esdeveniment com a "potser"'
      }

      addNotification({
        id: Date.now().toString(),
        titol: 'Assistència actualitzada',
        descripcio: mensajes[accion],
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      // TODO: Rollback en caso de error
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut actualitzar l\'assistència',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [addNotification])

  const comentarEvento = useCallback(async (eventoId: string, contenido: string): Promise<void> => {
    const nuevoComentario: ComentarioEvento = {
      id: `comentario-${Date.now()}`,
      autorId: 'user-1',
      eventoId,
      contenido,
      fechaCreacion: new Date(),
      autor: {
        nombre: 'Usuario Actual',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
      }
    }

    try {
      dispatch({ type: 'ADD_COMENTARIO', comentario: nuevoComentario })
      await new Promise(resolve => setTimeout(resolve, 400))
    } catch (error) {
      console.error('Error al comentar:', error)
      throw error
    }
  }, [])

  // ✅ UTILIDADES MEMOIZADAS
  const obtenerAsistencia = useCallback((eventoId: string, usuarioId: string = 'user-1'): AccionAsistencia | null => {
    const asistencia = state.asistencias.find(a => a.eventoId === eventoId && a.usuarioId === usuarioId)
    return asistencia?.estado || null
  }, [state.asistencias])

  const obtenerComentarios = useCallback((eventoId: string): ComentarioEvento[] => {
    return state.comentarios[eventoId] || []
  }, [state.comentarios])

  const obtenerEventosPorCategoria = useCallback((categoria: CategoriaEvento): Evento[] => {
    return state.eventos.filter(evento => evento.categoria === categoria && evento.activo)
  }, [state.eventos])

  const obtenerEventosProximos = useCallback((dias: number = 7): Evento[] => {
    const ahora = new Date()
    const limite = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000)
    
    return state.eventos
      .filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio)
        return fechaEvento >= ahora && fechaEvento <= limite && evento.estado === 'programado'
      })
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
  }, [state.eventos])

  const obtenerMisEventos = useCallback((usuarioId: string = 'user-1'): Evento[] => {
    return state.eventos.filter(evento => evento.creadorId === usuarioId)
  }, [state.eventos])

  // Simplified methods that dispatch directly
  const actualizarEvento = useCallback(async (id: string, datos: Partial<Evento>): Promise<void> => {
    dispatch({ type: 'UPDATE_EVENTO', eventoId: id, data: datos })
  }, [])

  const eliminarEvento = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_EVENTO', eventoId: id })
  }, [])

  const cargarEstadisticas = useCallback(async (): Promise<void> => {
    // TODO: Implement statistics loading
    console.log('Cargando estadísticas de eventos...')
  }, [])

  const contextValue = useMemo(() => ({
    eventos: state.eventos,
    asistencias: state.asistencias,
    comentarios: state.comentarios,
    cargando: state.cargando,
    estadisticas: state.estadisticas,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    gestionarAsistencia,
    obtenerAsistencia,
    comentarEvento,
    obtenerComentarios,
    obtenerEventosPorCategoria,
    obtenerEventosProximos,
    obtenerMisEventos,
    cargarEstadisticas
  }), [
    state,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    gestionarAsistencia,
    obtenerAsistencia,
    comentarEvento,
    obtenerComentarios,
    obtenerEventosPorCategoria,
    obtenerEventosProximos,
    obtenerMisEventos,
    cargarEstadisticas
  ])

  return (
    <EventosDataContext.Provider value={contextValue}>
      {children}
    </EventosDataContext.Provider>
  )
}

// ✅ COMPOSITE PROVIDER
export function EventosProvider({ children }: { children: ReactNode }) {
  return (
    <EventosFiltrosProvider>
      <EventosDataProvider>
        {children}
      </EventosDataProvider>
    </EventosFiltrosProvider>
  )
}

// ✅ HOOKS OPTIMIZADOS
export function useEventosFiltros() {
  const context = useContext(EventosFiltrosContext)
  if (context === undefined) {
    throw new Error('useEventosFiltros must be used within an EventosFiltrosProvider')
  }
  return context
}

export function useEventosData() {
  const context = useContext(EventosDataContext)
  if (context === undefined) {
    throw new Error('useEventosData must be used within an EventosDataProvider')
  }
  return context
}

// ✅ CONVENIENCE HOOK
export function useEventos() {
  const filtros = useEventosFiltros()
  const data = useEventosData()
  
  return {
    ...filtros,
    ...data
  }
}