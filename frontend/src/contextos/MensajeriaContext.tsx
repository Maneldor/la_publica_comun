'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useReducer, useEffect } from 'react'
import { 
  Mensaje, 
  Conversacion, 
  Trucada, 
  NotificacioMensatge,
  EstatEscriptura,
  ConfiguracioMensajeria,
  FiltresMensajeria,
  EstadistiquesMensajeria,
  TipoMensaje,
  TipoTrucada,
  EstadoMensaje,
  EnviarMensajeRequest
} from '../../tipos/mensajes'
import { useNotifications } from './NotificationsContext'

// ✅ TÉCNICA AVANZADA #1: Triple Context Pattern para Mensajería Compleja
// 1. MensajeriaData - Mensajes y conversaciones (cambia frecuentemente)
// 2. MensajeriaUI - Estado de UI (modales, selecciones)
// 3. MensajeriaConfig - Configuración y filtros (cambia raramente)

// ✅ REDUCER PARA ESTADO COMPLEJO DE MENSAJERÍA
type MensajeriaAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_CONVERSACIONES'; conversaciones: Conversacion[] }
  | { type: 'ADD_CONVERSACIO'; conversacion: Conversacion }
  | { type: 'UPDATE_CONVERSACIO'; conversacioId: string; data: Partial<Conversacion> }
  | { type: 'DELETE_CONVERSACIO'; conversacioId: string }
  | { type: 'SET_MISSATGES'; conversacioId: string; missatges: Mensaje[] }
  | { type: 'ADD_MISSATGE'; missatge: Mensaje }
  | { type: 'UPDATE_MISSATGE'; missatgeId: string; data: Partial<Mensaje> }
  | { type: 'DELETE_MISSATGE'; missatgeId: string }
  | { type: 'MARK_AS_READ'; conversacioId: string; missatgeIds: string[] }
  | { type: 'SET_TYPING'; typing: EstatEscriptura }
  | { type: 'REMOVE_TYPING'; usuariId: string; conversacioId: string }
  | { type: 'SET_TRUCADA'; trucada: Trucada | null }
  | { type: 'ADD_NOTIFICACIO'; notificacio: NotificacioMensatge }

interface MensajeriaState {
  conversaciones: Conversacion[]
  mensajesPorConversacion: { [conversacioId: string]: Mensaje[] }
  usuarisEscrivint: EstatEscriptura[]
  trucadaActiva: Trucada | null
  notificacions: NotificacioMensatge[]
  cargando: boolean
  conectado: boolean
  estadisticas: EstadistiquesMensajeria | null
}

function mensajeriaReducer(state: MensajeriaState, action: MensajeriaAction): MensajeriaState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.loading }
    
    case 'SET_CONVERSACIONES':
      return { ...state, conversaciones: action.conversaciones }
    
    case 'ADD_CONVERSACIO':
      return { 
        ...state, 
        conversaciones: [action.conversacion, ...state.conversaciones] 
      }
    
    case 'UPDATE_CONVERSACIO':
      return {
        ...state,
        conversaciones: state.conversaciones.map(conv =>
          conv.id === action.conversacioId ? { ...conv, ...action.data } : conv
        )
      }
    
    case 'DELETE_CONVERSACIO':
      return {
        ...state,
        conversaciones: state.conversaciones.filter(conv => conv.id !== action.conversacioId),
        mensajesPorConversacion: {
          ...state.mensajesPorConversacion,
          [action.conversacioId]: undefined
        }
      }
    
    case 'SET_MISSATGES':
      return {
        ...state,
        mensajesPorConversacion: {
          ...state.mensajesPorConversacion,
          [action.conversacioId]: action.missatges || []
        }
      }
    
    case 'ADD_MISSATGE':
      const conversacioId = action.missatge.conversacioId
      const missatgesExistents = state.mensajesPorConversacion[conversacioId] || []
      
      return {
        ...state,
        mensajesPorConversacion: {
          ...state.mensajesPorConversacion,
          [conversacioId]: [...missatgesExistents, action.missatge]
        },
        // Actualizar última actividad de la conversación
        conversaciones: state.conversaciones.map(conv =>
          conv.id === conversacioId
            ? {
                ...conv,
                ultimMissatge: {
                  id: action.missatge.id,
                  text: action.missatge.text || '[Archivo]',
                  autorNom: 'Usuario', // TODO: Get from user context
                  data: action.missatge.dataCreacio,
                  tipus: action.missatge.tipus
                },
                dataUltimaActivitat: action.missatge.dataCreacio,
                missatgesNoLlegits: conv.missatgesNoLlegits + (action.missatge.autorId !== 'current-user' ? 1 : 0)
              }
            : conv
        )
      }
    
    case 'UPDATE_MISSATGE':
      return {
        ...state,
        mensajesPorConversacion: Object.fromEntries(
          Object.entries(state.mensajesPorConversacion).map(([convId, missatges]) => [
            convId,
            missatges.map(msg =>
              msg.id === action.missatgeId ? { ...msg, ...action.data } : msg
            )
          ])
        )
      }
    
    case 'MARK_AS_READ':
      return {
        ...state,
        mensajesPorConversacion: {
          ...state.mensajesPorConversacion,
          [action.conversacioId]: (state.mensajesPorConversacion[action.conversacioId] || []).map(msg =>
            action.missatgeIds.includes(msg.id) 
              ? { ...msg, estat: 'llegit', dataLectura: new Date() }
              : msg
          )
        },
        conversaciones: state.conversaciones.map(conv =>
          conv.id === action.conversacioId
            ? { ...conv, missatgesNoLlegits: Math.max(0, conv.missatgesNoLlegits - action.missatgeIds.length) }
            : conv
        )
      }
    
    case 'SET_TYPING':
      const existingTyping = state.usuarisEscrivint.find(
        t => t.usuariId === action.typing.usuariId && t.conversacioId === action.typing.conversacioId
      )
      
      if (existingTyping) {
        return {
          ...state,
          usuarisEscrivint: state.usuarisEscrivint.map(t =>
            t.usuariId === action.typing.usuariId && t.conversacioId === action.typing.conversacioId
              ? action.typing
              : t
          )
        }
      }
      
      return {
        ...state,
        usuarisEscrivint: [...state.usuarisEscrivint, action.typing]
      }
    
    case 'REMOVE_TYPING':
      return {
        ...state,
        usuarisEscrivint: state.usuarisEscrivint.filter(
          t => !(t.usuariId === action.usuariId && t.conversacioId === action.conversacioId)
        )
      }
    
    case 'SET_TRUCADA':
      return { ...state, trucadaActiva: action.trucada }
    
    case 'ADD_NOTIFICACIO':
      return {
        ...state,
        notificacions: [action.notificacio, ...state.notificacions.slice(0, 49)] // Limit to 50
      }
    
    default:
      return state
  }
}

// ✅ CONTEXTO PARA DATOS (Cambia frecuentemente)
interface MensajeriaDataContextType {
  // Estado
  conversaciones: Conversacion[]
  mensajesPorConversacion: { [conversacioId: string]: Mensaje[] }
  missatges: { [conversacioId: string]: Mensaje[] } // Alias para compatibilidad
  usuarisEscrivint: EstatEscriptura[]
  trucadaActiva: Trucada | null
  notificacions: NotificacioMensatge[]
  cargando: boolean
  conectado: boolean
  estadisticas: EstadistiquesMensajeria | null
  
  // Conversaciones
  crearConversacio: (participants: string[], tipus?: 'individual' | 'grupo', nom?: string) => Promise<Conversacion>
  eliminarConversacio: (conversacioId: string) => Promise<void>
  arxivarConversacio: (conversacioId: string, arxivat: boolean) => Promise<void>
  silenciarConversacio: (conversacioId: string, silenciat: boolean) => Promise<void>
  
  // Mensajes
  enviarMissatge: (request: EnviarMensajeRequest) => Promise<Mensaje>
  cargarMissatges: (conversacioId: string, limit?: number, offset?: number) => Promise<Mensaje[]>
  marcarComLlegit: (conversacioId: string, missatgeIds: string[]) => Promise<void>
  eliminarMissatge: (missatgeId: string) => Promise<void>
  
  // Llamadas
  iniciarTrucada: (conversacioId: string, tipus: TipoTrucada) => Promise<void>
  finalitzarTrucada: () => Promise<void>
  respondirTrucada: (acceptar: boolean) => Promise<void>
  
  // Utilidades
  obtenirMissatges: (conversacioId: string) => Mensaje[]
  obtenirConversacio: (conversacioId: string) => Conversacion | undefined
  obtenirUsuarisEscrivint: (conversacioId: string) => EstatEscriptura[]
}

// ✅ CONTEXTO PARA UI (Estado de interfaz)
interface MensajeriaUIContextType {
  // UI State
  modalAbierto: boolean
  conversacioSeleccionada: string | null
  conversacioActiva: string | null // Alias para compatibilidad
  vistaActual: 'conversaciones' | 'chat' | 'llamada'
  menuContextualAbierto: string | null
  mostrarDetallsConversa: boolean
  setMostrarDetallsConversa: (mostrar: boolean) => void
  minimitzat: boolean
  setMinimitzat: (minimitzat: boolean) => void
  filtres: FiltresMensajeria
  setFiltres: (filtres: Partial<FiltresMensajeria>) => void
  
  // UI Actions
  abrirModal: () => void
  cerrarModal: () => void
  seleccionarConversacio: (conversacioId: string) => void
  cambiarVista: (vista: 'conversaciones' | 'chat' | 'llamada') => void
  toggleMenuContextual: (menuId: string | null) => void
}

// ✅ CONTEXTO PARA CONFIGURACIÓN (Cambia raramente)
interface MensajeriaConfigContextType {
  // Configuración
  configuracion: ConfiguracioMensajeria
  configuracio: ConfiguracioMensajeria // Alias para compatibilidad
  filtros: FiltresMensajeria
  
  // Actions
  actualizarConfiguracion: (config: Partial<ConfiguracioMensajeria>) => void
  actualizarFiltros: (filtros: Partial<FiltresMensajeria>) => void
  resetearFiltros: () => void
}

const MensajeriaDataContext = createContext<MensajeriaDataContextType | undefined>(undefined)
const MensajeriaUIContext = createContext<MensajeriaUIContextType | undefined>(undefined)
const MensajeriaConfigContext = createContext<MensajeriaConfigContextType | undefined>(undefined)

// ✅ DEFAULTS
const DEFAULT_CONFIG: ConfiguracioMensajeria = {
  notificacionsSo: true,
  notificacionsVisuals: true,
  notificacionsDesktop: true,
  mostrarEstatLectura: true,
  mostrarUltimaConexio: true,
  bloquejarDesconeguts: false,
  temaFosc: false,
  midaFont: 'normal',
  mostrarEmojis: true,
  autodescarregarMedia: true,
  qualityVideo: 'mitja',
  micPerDefecte: true,
  camaraPerDefecte: false
}

const DEFAULT_FILTROS: FiltresMensajeria = {
  cerca: '',
  mostrarNomesNoLlegits: false,
  mostrarNomesOnline: false,
  tipus: 'tots',
  estat: 'actius',
  periode: 'tots'
}

function createInitialState(): MensajeriaState {
  return {
    conversaciones: [],
    mensajesPorConversacion: {},
    usuarisEscrivint: [],
    trucadaActiva: null,
    notificacions: [],
    cargando: false,
    conectado: false,
    estadisticas: null
  }
}

// ✅ PROVIDER PARA DATOS
export function MensajeriaDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mensajeriaReducer, undefined, createInitialState)
  const { afegirNotificacio } = useNotifications()

  // ✅ TÉCNICA: Simular WebSocket connection
  useEffect(() => {
    const connectWebSocket = async () => {
      // TODO: Implement real WebSocket connection
      console.log('Conectando WebSocket de mensajería...')
      
      // Simular conexión exitosa
      setTimeout(() => {
        dispatch({ type: 'SET_LOADING', loading: false })
      }, 1000)
    }

    connectWebSocket()
    
    return () => {
      console.log('Desconectando WebSocket...')
    }
  }, [])

  const enviarMissatge = useCallback(async (request: EnviarMensajeRequest): Promise<Mensaje> => {
    const nuevoMissatge: Mensaje = {
      id: `msg-${Date.now()}`,
      conversacioId: request.conversacioId,
      autorId: 'current-user',
      text: request.text,
      tipus: request.tipus,
      estat: 'enviando',
      dataCreacio: new Date()
    }

    try {
      // Optimistic update
      dispatch({ type: 'ADD_MISSATGE', missatge: nuevoMissatge })
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update status
      dispatch({ 
        type: 'UPDATE_MISSATGE', 
        missatgeId: nuevoMissatge.id, 
        data: { estat: 'enviado' } 
      })
      
      return nuevoMissatge
    } catch (error) {
      dispatch({ 
        type: 'UPDATE_MISSATGE', 
        missatgeId: nuevoMissatge.id, 
        data: { estat: 'error' } 
      })
      throw error
    }
  }, [])

  const crearConversacio = useCallback(async (
    participants: string[], 
    tipus: 'individual' | 'grupo' = 'individual', 
    nom?: string
  ): Promise<Conversacion> => {
    const novaConversacio: Conversacion = {
      id: `conv-${Date.now()}`,
      tipus,
      nom,
      participants,
      missatgesNoLlegits: 0,
      dataUltimaActivitat: new Date(),
      dataCreacio: new Date(),
      silenciat: false,
      arxivat: false,
      fixat: false
    }

    try {
      dispatch({ type: 'ADD_CONVERSACIO', conversacion: novaConversacio })
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Conversa creada',
        descripcio: `Nova conversa ${tipus} creada`,
        tipus: 'success',
        data: new Date()
      })
      
      return novaConversacio
    } catch (error) {
      dispatch({ type: 'DELETE_CONVERSACIO', conversacioId: novaConversacio.id })
      throw error
    }
  }, [afegirNotificacio])

  const marcarComLlegit = useCallback(async (conversacioId: string, missatgeIds: string[]): Promise<void> => {
    dispatch({ type: 'MARK_AS_READ', conversacioId, missatgeIds })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error('Error marcando como leído:', error)
    }
  }, [])

  const iniciarTrucada = useCallback(async (conversacioId: string, tipus: TipoTrucada): Promise<void> => {
    const trucada: Trucada = {
      id: `call-${Date.now()}`,
      conversacioId,
      iniciadorId: 'current-user',
      participants: ['current-user'], // TODO: Add other participants
      tipus,
      estat: 'llamando',
      dataInici: new Date(),
      urlSala: `https://meet.jit.si/lapublica-${Date.now()}`
    }

    dispatch({ type: 'SET_TRUCADA', trucada })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      dispatch({ 
        type: 'SET_TRUCADA', 
        trucada: { ...trucada, estat: 'activa' } 
      })
    } catch (error) {
      dispatch({ type: 'SET_TRUCADA', trucada: null })
      throw error
    }
  }, [])

  // Utilidades memoizadas
  const obtenirMissatges = useCallback((conversacioId: string): Mensaje[] => {
    return state.mensajesPorConversacion[conversacioId] || []
  }, [state.mensajesPorConversacion])

  const obtenirConversacio = useCallback((conversacioId: string): Conversacion | undefined => {
    return state.conversaciones.find(conv => conv.id === conversacioId)
  }, [state.conversaciones])

  const obtenirUsuarisEscrivint = useCallback((conversacioId: string): EstatEscriptura[] => {
    return state.usuarisEscrivint.filter(typing => typing.conversacioId === conversacioId)
  }, [state.usuarisEscrivint])

  // Simplified implementations
  const cargarMissatges = useCallback(async (conversacioId: string, limit = 50, offset = 0): Promise<Mensaje[]> => {
    // TODO: Implement pagination
    return obtenirMissatges(conversacioId)
  }, [obtenirMissatges])

  const eliminarConversacio = useCallback(async (conversacioId: string): Promise<void> => {
    dispatch({ type: 'DELETE_CONVERSACIO', conversacioId })
  }, [])

  const arxivarConversacio = useCallback(async (conversacioId: string, arxivat: boolean): Promise<void> => {
    dispatch({ type: 'UPDATE_CONVERSACIO', conversacioId, data: { arxivat } })
  }, [])

  const silenciarConversacio = useCallback(async (conversacioId: string, silenciat: boolean): Promise<void> => {
    dispatch({ type: 'UPDATE_CONVERSACIO', conversacioId, data: { silenciat } })
  }, [])

  const eliminarMissatge = useCallback(async (missatgeId: string): Promise<void> => {
    dispatch({ type: 'DELETE_MISSATGE', missatgeId })
  }, [])

  const finalitzarTrucada = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_TRUCADA', trucada: null })
  }, [])

  const respondirTrucada = useCallback(async (acceptar: boolean): Promise<void> => {
    if (acceptar && state.trucadaActiva) {
      dispatch({ 
        type: 'SET_TRUCADA', 
        trucada: { ...state.trucadaActiva, estat: 'activa' } 
      })
    } else {
      dispatch({ type: 'SET_TRUCADA', trucada: null })
    }
  }, [state.trucadaActiva])

  const contextValue = useMemo(() => ({
    ...state,
    missatges: state.mensajesPorConversacion, // Alias para compatibilidad
    crearConversacio,
    eliminarConversacio,
    arxivarConversacio,
    silenciarConversacio,
    enviarMissatge,
    cargarMissatges,
    marcarComLlegit,
    eliminarMissatge,
    iniciarTrucada,
    finalitzarTrucada,
    respondirTrucada,
    obtenirMissatges,
    obtenirConversacio,
    obtenirUsuarisEscrivint
  }), [
    state,
    crearConversacio,
    eliminarConversacio,
    arxivarConversacio,
    silenciarConversacio,
    enviarMissatge,
    cargarMissatges,
    marcarComLlegit,
    eliminarMissatge,
    iniciarTrucada,
    finalitzarTrucada,
    respondirTrucada,
    obtenirMissatges,
    obtenirConversacio,
    obtenirUsuarisEscrivint
  ])

  return (
    <MensajeriaDataContext.Provider value={contextValue}>
      {children}
    </MensajeriaDataContext.Provider>
  )
}

// ✅ PROVIDER PARA UI
export function MensajeriaUIProvider({ children }: { children: ReactNode }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [conversacioSeleccionada, setConversacioSeleccionada] = useState<string | null>(null)
  const [vistaActual, setVistaActual] = useState<'conversaciones' | 'chat' | 'llamada'>('conversaciones')
  const [menuContextualAbierto, setMenuContextualAbierto] = useState<string | null>(null)
  const [mostrarDetallsConversa, setMostrarDetallsConversa] = useState(false)
  const [minimitzat, setMinimitzat] = useState(false)
  const [filtres, setFiltresState] = useState<FiltresMensajeria>({
    cercar: '',
    estat: 'todos',
    tipus: 'todos',
    dateFrom: null,
    dateTo: null,
    participants: []
  })

  const abrirModal = useCallback(() => setModalAbierto(true), [])
  const cerrarModal = useCallback(() => {
    setModalAbierto(false)
    setConversacioSeleccionada(null)
    setVistaActual('conversaciones')
  }, [])

  const seleccionarConversacio = useCallback((conversacioId: string) => {
    setConversacioSeleccionada(conversacioId)
    setVistaActual('chat')
  }, [])

  const cambiarVista = useCallback((vista: 'conversaciones' | 'chat' | 'llamada') => {
    setVistaActual(vista)
  }, [])

  const toggleMenuContextual = useCallback((menuId: string | null) => {
    setMenuContextualAbierto(menuId)
  }, [])

  const setFiltres = useCallback((filtresNous: Partial<FiltresMensajeria>) => {
    setFiltresState(prev => ({ ...prev, ...filtresNous }))
  }, [])

  const contextValue = useMemo(() => ({
    modalAbierto,
    conversacioSeleccionada,
    conversacioActiva: conversacioSeleccionada, // Alias para compatibilidad
    vistaActual,
    menuContextualAbierto,
    mostrarDetallsConversa,
    setMostrarDetallsConversa,
    minimitzat,
    setMinimitzat,
    filtres,
    setFiltres,
    abrirModal,
    cerrarModal,
    seleccionarConversacio,
    cambiarVista,
    toggleMenuContextual
  }), [
    modalAbierto,
    conversacioSeleccionada,
    vistaActual,
    menuContextualAbierto,
    mostrarDetallsConversa,
    minimitzat,
    filtres,
    abrirModal,
    cerrarModal,
    seleccionarConversacio,
    cambiarVista,
    toggleMenuContextual,
    setFiltres
  ])

  return (
    <MensajeriaUIContext.Provider value={contextValue}>
      {children}
    </MensajeriaUIContext.Provider>
  )
}

// ✅ PROVIDER PARA CONFIGURACIÓN
export function MensajeriaConfigProvider({ children }: { children: ReactNode }) {
  const [configuracion, setConfiguracion] = useState<ConfiguracioMensajeria>(DEFAULT_CONFIG)
  const [filtros, setFiltros] = useState<FiltresMensajeria>(DEFAULT_FILTROS)

  const actualizarConfiguracion = useCallback((config: Partial<ConfiguracioMensajeria>) => {
    setConfiguracion(prev => ({ ...prev, ...config }))
  }, [])

  const actualizarFiltros = useCallback((nuevosFiltros: Partial<FiltresMensajeria>) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }))
  }, [])

  const resetearFiltros = useCallback(() => {
    setFiltros(DEFAULT_FILTROS)
  }, [])

  const contextValue = useMemo(() => ({
    configuracion,
    configuracio: configuracion, // Alias para compatibilidad
    filtros,
    actualizarConfiguracion,
    actualizarFiltros,
    resetearFiltros
  }), [configuracion, filtros, actualizarConfiguracion, actualizarFiltros, resetearFiltros])

  return (
    <MensajeriaConfigContext.Provider value={contextValue}>
      {children}
    </MensajeriaConfigContext.Provider>
  )
}

// ✅ COMPOSITE PROVIDER
export function MensajeriaProvider({ children }: { children: ReactNode }) {
  return (
    <MensajeriaConfigProvider>
      <MensajeriaUIProvider>
        <MensajeriaDataProvider>
          {children}
        </MensajeriaDataProvider>
      </MensajeriaUIProvider>
    </MensajeriaConfigProvider>
  )
}

// ✅ HOOKS ESPECIALIZADOS
export function useMensajeriaData() {
  const context = useContext(MensajeriaDataContext)
  if (context === undefined) {
    throw new Error('useMensajeriaData must be used within a MensajeriaDataProvider')
  }
  return context
}

export function useMensajeriaUI() {
  const context = useContext(MensajeriaUIContext)
  if (context === undefined) {
    throw new Error('useMensajeriaUI must be used within a MensajeriaUIProvider')
  }
  return context
}

export function useMensajeriaConfig() {
  const context = useContext(MensajeriaConfigContext)
  if (context === undefined) {
    throw new Error('useMensajeriaConfig must be used within a MensajeriaConfigProvider')
  }
  return context
}

// ✅ CONVENIENCE HOOK
export function useMensajeria() {
  const data = useMensajeriaData()
  const ui = useMensajeriaUI()
  const config = useMensajeriaConfig()
  
  return {
    ...data,
    ...ui,
    ...config
  }
}