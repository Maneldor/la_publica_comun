'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
import { GrupoAvanzado } from '../../../tipos/gruposAvanzados'
import { useNotifications } from '../NotificationsContext'

// ✅ OPTIMIZACIÓN #1: Interface específica y pequeña (solo 8 métodos vs 42)
interface GruposContextType {
  // Estado básico
  grupos: GrupoAvanzado[]
  grupoActivo: GrupoAvanzado | null
  cargando: boolean
  
  // Operaciones CRUD básicas
  crearGrupo: (datos: Partial<GrupoAvanzado>) => Promise<GrupoAvanzado>
  editarGrupo: (id: string, datos: Partial<GrupoAvanzado>) => Promise<void>
  eliminarGrupo: (id: string) => Promise<void>
  seleccionarGrupo: (id: string) => void
  
  // Utilidades específicas de grupos
  esAdminGrupo: (grupoId: string) => boolean
}

const GruposContext = createContext<GruposContextType | undefined>(undefined)

// ✅ OPTIMIZACIÓN #2: Memoización del Provider
export function GruposProvider({ children }: { children: ReactNode }) {
  const [grupos, setGrupos] = useState<GrupoAvanzado[]>([])
  const [grupoActivo, setGrupoActivo] = useState<GrupoAvanzado | null>(null)
  const [cargando, setCargando] = useState(false)
  const { addNotification } = useNotifications()

  // ✅ OPTIMIZACIÓN #3: useCallback para funciones que se pasan a componentes hijos
  const crearGrupo = useCallback(async (datos: Partial<GrupoAvanzado>): Promise<GrupoAvanzado> => {
    setCargando(true)
    try {
      // Simular API call
      const nuevoGrupo: GrupoAvanzado = {
        id: `grupo-${Date.now()}`,
        nom: datos.nom || '',
        descripcio: datos.descripcio || '',
        categoria: datos.categoria || 'general',
        tipus: datos.tipus || 'public',
        creadorId: 'user-1',
        dataCreacio: new Date(),
        membres: [],
        administradors: ['user-1'],
        configuracio: {
          requireAprovacio: false,
          limitMembres: 1000,
          permetInvitacions: true,
          moderacioPosts: false
        },
        estadistiques: {
          totalMembres: 1,
          membresActius: 1,
          postsEsteMes: 0,
          creixementMensual: 0
        },
        ...datos
      }
      
      setGrupos(prev => [nuevoGrupo, ...prev])
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Grup creat',
        descripcio: `El grup "${nuevoGrupo.nom}" s'ha creat correctament`,
        tipus: 'success',
        data: new Date()
      })
      
      return nuevoGrupo
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut crear el grup',
        tipus: 'error',
        data: new Date()
      })
      throw error
    } finally {
      setCargando(false)
    }
  }, [addNotification])

  const editarGrupo = useCallback(async (id: string, datos: Partial<GrupoAvanzado>): Promise<void> => {
    try {
      setGrupos(prev => prev.map(grup => 
        grup.id === id ? { ...grup, ...datos } : grup
      ))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Grup actualitzat',
        descripcio: 'Els canvis s\'han guardat correctament',
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut actualitzar el grup',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [addNotification])

  const eliminarGrupo = useCallback(async (id: string): Promise<void> => {
    try {
      setGrupos(prev => prev.filter(grup => grup.id !== id))
      
      if (grupoActivo?.id === id) {
        setGrupoActivo(null)
      }
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Grup eliminat',
        descripcio: 'El grup s\'ha eliminat correctament',
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut eliminar el grup',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [grupoActivo, addNotification])

  const seleccionarGrupo = useCallback((id: string) => {
    const grup = grupos.find(g => g.id === id)
    setGrupoActivo(grup || null)
  }, [grupos])

  const esAdminGrupo = useCallback((grupoId: string): boolean => {
    const grup = grupos.find(g => g.id === grupoId)
    return grup?.administradors.includes('user-1') || false
  }, [grupos])

  // ✅ OPTIMIZACIÓN #4: useMemo para el value object
  // Evita recrear el objeto en cada render
  const contextValue = useMemo(() => ({
    grupos,
    grupoActivo, 
    cargando,
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    seleccionarGrupo,
    esAdminGrupo
  }), [
    grupos,
    grupoActivo,
    cargando,
    crearGrupo,
    editarGrupo,
    eliminarGrupo,
    seleccionarGrupo,
    esAdminGrupo
  ])

  return (
    <GruposContext.Provider value={contextValue}>
      {children}
    </GruposContext.Provider>
  )
}

// ✅ OPTIMIZACIÓN #5: Hook personalizado con validación
export function useGrupos() {
  const context = useContext(GruposContext)
  if (context === undefined) {
    throw new Error('useGrupos must be used within a GruposProvider')
  }
  return context
}