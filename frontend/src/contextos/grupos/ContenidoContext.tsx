'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useReducer } from 'react'
import { PostGrupo, OfertaGrupo, ActividadGrupo } from '../../../tipos/gruposAvanzados'
import { useNotifications } from '../NotificationsContext'

// ✅ TÉCNICA AVANZADA #1: useReducer para estado complejo
// Esto es mejor que múltiples useState para operaciones relacionadas
type ContenidoAction = 
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'ADD_POST'; post: PostGrupo }
  | { type: 'UPDATE_POST'; postId: string; data: Partial<PostGrupo> }
  | { type: 'DELETE_POST'; postId: string }
  | { type: 'ADD_REACCION'; postId: string; tipo: string }
  | { type: 'ADD_OFERTA'; oferta: OfertaGrupo }
  | { type: 'RECLAMAR_OFERTA'; ofertaId: string }
  | { type: 'ADD_ACTIVIDAD'; actividad: ActividadGrupo }

interface ContenidoState {
  posts: PostGrupo[]
  ofertas: OfertaGrupo[]
  actividades: ActividadGrupo[]
  cargando: boolean
}

// ✅ TÉCNICA: Reducer pattern para estado complejo y predecible
function contenidoReducer(state: ContenidoState, action: ContenidoAction): ContenidoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, cargando: action.loading }
    
    case 'ADD_POST':
      return { 
        ...state, 
        posts: [action.post, ...state.posts] // Newest first
      }
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.postId ? { ...post, ...action.data } : post
        )
      }
    
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.postId)
      }
    
    case 'ADD_REACCION':
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.postId 
            ? { 
                ...post, 
                reaccions: {
                  ...post.reaccions,
                  [action.tipo]: (post.reaccions?.[action.tipo] || 0) + 1
                }
              }
            : post
        )
      }
    
    case 'ADD_OFERTA':
      return {
        ...state,
        ofertas: [action.oferta, ...state.ofertas]
      }
    
    case 'RECLAMAR_OFERTA':
      return {
        ...state,
        ofertas: state.ofertas.map(oferta =>
          oferta.id === action.ofertaId
            ? { ...oferta, reclamada: true, reclamadaPerUsuariId: 'user-1' }
            : oferta
        )
      }
    
    case 'ADD_ACTIVIDAD':
      return {
        ...state,
        actividades: [action.actividad, ...state.actividades].slice(0, 100) // ✅ OPTIMIZACIÓN: Limit activity history
      }
    
    default:
      return state
  }
}

interface ContenidoContextType {
  // Estado
  posts: PostGrupo[]
  ofertas: OfertaGrupo[]
  actividades: ActividadGrupo[]
  cargando: boolean
  
  // Posts
  crearPost: (grupoId: string, datos: Partial<PostGrupo>) => Promise<PostGrupo>
  editarPost: (postId: string, datos: Partial<PostGrupo>) => Promise<void>
  eliminarPost: (postId: string) => Promise<void>
  reaccionarPost: (postId: string, tipo: string) => Promise<void>
  comentarPost: (postId: string, contenido: string) => Promise<void>
  
  // Ofertas
  crearOferta: (grupoId: string, datos: Partial<OfertaGrupo>) => Promise<OfertaGrupo>
  reclamarOferta: (ofertaId: string) => Promise<void>
  
  // Actividades
  registrarActividad: (grupoId: string, actividad: Partial<ActividadGrupo>) => void
  
  // Utilidades
  obtenerPostsGrupo: (grupoId: string) => PostGrupo[]
  obtenerOfertasGrupo: (grupoId: string) => OfertaGrupo[]
}

const ContenidoContext = createContext<ContenidoContextType | undefined>(undefined)

// ✅ TÉCNICA AVANZADA #2: Lazy Initial State
// Solo crear el estado inicial cuando sea necesario
function createInitialState(): ContenidoState {
  return {
    posts: [],
    ofertas: [],
    actividades: [],
    cargando: false
  }
}

export function ContenidoProvider({ children }: { children: ReactNode }) {
  // ✅ useReducer vs useState: Mejor para estado complejo y operaciones relacionadas
  const [state, dispatch] = useReducer(contenidoReducer, undefined, createInitialState)
  const { afegirNotificacio } = useNotifications()

  // ✅ TÉCNICA #3: Debounced Operations para actividades frecuentes
  const [activityQueue, setActivityQueue] = useState<ActividadGrupo[]>([])
  
  // ✅ TÉCNICA #4: Batch Operations - Procesar actividades en lotes
  const processActivityQueue = useCallback(() => {
    if (activityQueue.length > 0) {
      activityQueue.forEach(actividad => {
        dispatch({ type: 'ADD_ACTIVIDAD', actividad })
      })
      setActivityQueue([])
    }
  }, [activityQueue])

  // Procesar queue cada 2 segundos para no saturar
  React.useEffect(() => {
    const interval = setInterval(processActivityQueue, 2000)
    return () => clearInterval(interval)
  }, [processActivityQueue])

  const crearPost = useCallback(async (grupoId: string, datos: Partial<PostGrupo>): Promise<PostGrupo> => {
    dispatch({ type: 'SET_LOADING', loading: true })
    
    const nuevoPost: PostGrupo = {
      id: `post-${Date.now()}`,
      autorId: 'user-1',
      grupoId,
      contingut: datos.contingut || '',
      tipus: datos.tipus || 'text',
      dataCreacio: new Date(),
      reaccions: {},
      comentaris: [],
      etiquetes: datos.etiquetes || [],
      ...datos
    }
    
    try {
      // Optimistic update
      dispatch({ type: 'ADD_POST', post: nuevoPost })
      
      // Simular API call con delay realista
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // ✅ TÉCNICA: Auto-register activity
      const actividad: ActividadGrupo = {
        id: `activity-${Date.now()}`,
        usuarioId: 'user-1',
        grupoId,
        tipus: 'nou_post',
        descripcio: `Ha creat un nou post: "${datos.contingut?.substring(0, 50)}..."`,
        data: new Date(),
        detalls: { postId: nuevoPost.id }
      }
      
      // Add to queue instead of direct dispatch for performance
      setActivityQueue(prev => [...prev, actividad])
      
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Post publicat',
        descripcio: 'El teu post s\'ha publicat correctament',
        tipus: 'success',
        data: new Date()
      })
      
      return nuevoPost
    } catch (error) {
      // Rollback optimistic update
      dispatch({ type: 'DELETE_POST', postId: nuevoPost.id })
      
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut publicar el post',
        tipus: 'error',
        data: new Date()
      })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [afegirNotificacio])

  const reaccionarPost = useCallback(async (postId: string, tipo: string): Promise<void> => {
    // ✅ TÉCNICA: Immediate UI feedback para interacciones rápidas
    dispatch({ type: 'ADD_REACCION', postId, tipo })
    
    try {
      // Background API call - no await para UX fluida
      setTimeout(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
        // API success - nothing to do, optimistic update already applied
      }, 0)
      
    } catch (error) {
      // En caso de error, podrías hacer rollback aquí
      console.error('Error al reaccionar:', error)
    }
  }, [])

  const crearOferta = useCallback(async (grupoId: string, datos: Partial<OfertaGrupo>): Promise<OfertaGrupo> => {
    const nuevaOferta: OfertaGrupo = {
      id: `oferta-${Date.now()}`,
      creadorId: 'user-1',
      grupoId,
      titol: datos.titol || '',
      descripcio: datos.descripcio || '',
      tipusOferta: datos.tipusOferta || 'descompte',
      valorDescompte: datos.valorDescompte || 0,
      dataInici: datos.dataInici || new Date(),
      dataFi: datos.dataFi || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      limitReclamacions: datos.limitReclamacions || 100,
      reclamacionsActuals: 0,
      activa: true,
      ...datos
    }
    
    try {
      dispatch({ type: 'ADD_OFERTA', oferta: nuevaOferta })
      
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Register activity
      const actividad: ActividadGrupo = {
        id: `activity-${Date.now()}`,
        usuarioId: 'user-1',
        grupoId,
        tipus: 'nova_oferta',
        descripcio: `Ha creat una nova oferta: "${nuevaOferta.titol}"`,
        data: new Date(),
        detalls: { ofertaId: nuevaOferta.id }
      }
      
      setActivityQueue(prev => [...prev, actividad])
      
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Oferta creada',
        descripcio: `L'oferta "${nuevaOferta.titol}" s'ha creat correctament`,
        tipus: 'success',
        data: new Date()
      })
      
      return nuevaOferta
    } catch (error) {
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut crear l\'oferta',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [afegirNotificacio])

  const reclamarOferta = useCallback(async (ofertaId: string): Promise<void> => {
    dispatch({ type: 'RECLAMAR_OFERTA', ofertaId })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Oferta reclamada',
        descripcio: 'Has reclamat l\'oferta correctament',
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      afegirNotificacio({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut reclamar l\'oferta',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [afegirNotificacio])

  // ✅ TÉCNICA #5: Memoized Selectors - Solo re-calcular cuando cambian los datos relevantes
  const obtenerPostsGrupo = useCallback((grupoId: string): PostGrupo[] => {
    return state.posts.filter(post => post.grupoId === grupoId)
  }, [state.posts])

  const obtenerOfertasGrupo = useCallback((grupoId: string): OfertaGrupo[] => {
    return state.ofertas.filter(oferta => oferta.grupoId === grupoId && oferta.activa)
  }, [state.ofertas])

  // Simplified methods for direct dispatch
  const editarPost = useCallback(async (postId: string, datos: Partial<PostGrupo>): Promise<void> => {
    dispatch({ type: 'UPDATE_POST', postId, data: datos })
  }, [])

  const eliminarPost = useCallback(async (postId: string): Promise<void> => {
    dispatch({ type: 'DELETE_POST', postId })
  }, [])

  const comentarPost = useCallback(async (postId: string, contenido: string): Promise<void> => {
    // Implementation would add comment to post
    console.log('Commenting on post:', postId, contenido)
  }, [])

  const registrarActividad = useCallback((grupoId: string, actividad: Partial<ActividadGrupo>): void => {
    const nuevaActividad: ActividadGrupo = {
      id: `activity-${Date.now()}`,
      usuarioId: 'user-1',
      grupoId,
      data: new Date(),
      ...actividad
    } as ActividadGrupo
    
    setActivityQueue(prev => [...prev, nuevaActividad])
  }, [])

  const contextValue = useMemo(() => ({
    posts: state.posts,
    ofertas: state.ofertas,
    actividades: state.actividades,
    cargando: state.cargando,
    crearPost,
    editarPost,
    eliminarPost,
    reaccionarPost,
    comentarPost,
    crearOferta,
    reclamarOferta,
    registrarActividad,
    obtenerPostsGrupo,
    obtenerOfertasGrupo
  }), [
    state,
    crearPost,
    editarPost,
    eliminarPost,
    reaccionarPost,
    comentarPost,
    crearOferta,
    reclamarOferta,
    registrarActividad,
    obtenerPostsGrupo,
    obtenerOfertasGrupo
  ])

  return (
    <ContenidoContext.Provider value={contextValue}>
      {children}
    </ContenidoContext.Provider>
  )
}

export function useContenido() {
  const context = useContext(ContenidoContext)
  if (context === undefined) {
    throw new Error('useContenido must be used within a ContenidoProvider')
  }
  return context
}