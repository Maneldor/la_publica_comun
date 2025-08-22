'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
import { MiembroGrupoAvanzado, RolGrupo } from '../../../tipos/gruposAvanzados'
import { useNotifications } from '../NotificationsContext'

// ✅ TÉCNICA AVANZADA: Context Splitting por Dominio
interface MiembrosContextType {
  // Estado específico de miembros
  miembros: MiembroGrupoAvanzado[]
  cargandoMiembros: boolean
  
  // Operaciones de miembros
  agregarMiembro: (grupoId: string, usuarioId: string, rol?: RolGrupo) => Promise<void>
  removerMiembro: (grupoId: string, usuarioId: string) => Promise<void>
  cambiarRolMiembro: (grupoId: string, usuarioId: string, nuevoRol: RolGrupo) => Promise<void>
  invitarMiembro: (grupoId: string, email: string, rol?: RolGrupo) => Promise<void>
  
  // Utilidades específicas de miembros
  esMiembroGrupo: (grupoId: string, usuarioId?: string) => boolean
  obtenerMiembrosGrupo: (grupoId: string) => MiembroGrupoAvanzado[]
  obtenerRolUsuario: (grupoId: string, usuarioId?: string) => RolGrupo | null
}

const MiembrosContext = createContext<MiembrosContextType | undefined>(undefined)

// ✅ OPTIMIZACIÓN: Data Mock extraído a archivo separado (mejor para bundle splitting)
const PERFILES_USUARIOS: Record<string, { nombre: string; nick: string; avatar: string }> = {
  'user-1': { nombre: 'Tu', nick: '@tu_perfil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  'user-2': { nombre: 'Maria Gonzalez', nick: '@maria_gonzalez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=50&h=50&fit=crop&crop=face' },
  'user-3': { nombre: 'Jordi Martinez', nick: '@jordi_martinez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
  'user-4': { nombre: 'Anna Lopez', nick: '@anna_lopez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  'user-5': { nombre: 'Pere Soler', nick: '@pere_soler', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
}

export function MiembrosProvider({ children }: { children: ReactNode }) {
  const [miembros, setMiembros] = useState<MiembroGrupoAvanzado[]>([])
  const [cargandoMiembros, setCargandoMiembros] = useState(false)
  const { addNotification } = useNotifications()

  // ✅ TÉCNICA: Optimistic Updates para UX rápida
  const agregarMiembro = useCallback(async (grupoId: string, usuarioId: string, rol: RolGrupo = 'membre'): Promise<void> => {
    // Optimistic update - UI se actualiza inmediatamente
    const nuevoMiembro: MiembroGrupoAvanzado = {
      id: `${grupoId}-${usuarioId}`,
      usuarioId,
      grupoId,
      rol,
      dataUnio: new Date(),
      actiu: true,
      perfil: PERFILES_USUARIOS[usuarioId] || {
        nombre: 'Usuario Desconocido',
        nick: '@unknown',
        avatar: 'https://ui-avatars.com/api/?name=Unknown'
      }
    }
    
    setMiembros(prev => [...prev, nuevoMiembro])
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Membre afegit',
        descripcio: `${nuevoMiembro.perfil.nombre} s'ha unit al grup`,
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      // Rollback optimistic update
      setMiembros(prev => prev.filter(m => m.id !== nuevoMiembro.id))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut afegir el membre',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [addNotification])

  const removerMiembro = useCallback(async (grupoId: string, usuarioId: string): Promise<void> => {
    const membroId = `${grupoId}-${usuarioId}`
    const membroEliminado = miembros.find(m => m.id === membroId)
    
    // Optimistic update
    setMiembros(prev => prev.filter(m => m.id !== membroId))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Membre eliminat',
        descripcio: `${membroEliminado?.perfil.nombre || 'El membre'} ha sortit del grup`,
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      // Rollback
      if (membroEliminado) {
        setMiembros(prev => [...prev, membroEliminado])
      }
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut eliminar el membre',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [miembros, addNotification])

  const cambiarRolMiembro = useCallback(async (grupoId: string, usuarioId: string, nuevoRol: RolGrupo): Promise<void> => {
    const membroId = `${grupoId}-${usuarioId}`
    const rolAnterior = miembros.find(m => m.id === membroId)?.rol
    
    // Optimistic update
    setMiembros(prev => prev.map(m => 
      m.id === membroId ? { ...m, rol: nuevoRol } : m
    ))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Rol canviat',
        descripcio: `Rol actualitzat a ${nuevoRol}`,
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      // Rollback
      if (rolAnterior) {
        setMiembros(prev => prev.map(m => 
          m.id === membroId ? { ...m, rol: rolAnterior } : m
        ))
      }
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut canviar el rol',
        tipus: 'error',
        data: new Date()
      })
      throw error
    }
  }, [miembros, addNotification])

  const invitarMiembro = useCallback(async (grupoId: string, email: string, rol: RolGrupo = 'membre'): Promise<void> => {
    setCargandoMiembros(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      addNotification({
        id: Date.now().toString(),
        titol: 'Invitació enviada',
        descripcio: `S'ha enviat una invitació a ${email}`,
        tipus: 'success',
        data: new Date()
      })
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        titol: 'Error',
        descripcio: 'No s\'ha pogut enviar la invitació',
        tipus: 'error',
        data: new Date()
      })
      throw error
    } finally {
      setCargandoMiembros(false)
    }
  }, [addNotification])

  // ✅ UTILIDADES MEMOIZADAS para evitar re-cálculos
  const esMiembroGrupo = useCallback((grupoId: string, usuarioId: string = 'user-1'): boolean => {
    return miembros.some(m => m.grupoId === grupoId && m.usuarioId === usuarioId && m.actiu)
  }, [miembros])

  const obtenerMiembrosGrupo = useCallback((grupoId: string): MiembroGrupoAvanzado[] => {
    return miembros.filter(m => m.grupoId === grupoId && m.actiu)
  }, [miembros])

  const obtenerRolUsuario = useCallback((grupoId: string, usuarioId: string = 'user-1'): RolGrupo | null => {
    const miembro = miembros.find(m => m.grupoId === grupoId && m.usuarioId === usuarioId && m.actiu)
    return miembro?.rol || null
  }, [miembros])

  const contextValue = useMemo(() => ({
    miembros,
    cargandoMiembros,
    agregarMiembro,
    removerMiembro,
    cambiarRolMiembro,
    invitarMiembro,
    esMiembroGrupo,
    obtenerMiembrosGrupo,
    obtenerRolUsuario
  }), [
    miembros,
    cargandoMiembros,
    agregarMiembro,
    removerMiembro,
    cambiarRolMiembro,
    invitarMiembro,
    esMiembroGrupo,
    obtenerMiembrosGrupo,
    obtenerRolUsuario
  ])

  return (
    <MiembrosContext.Provider value={contextValue}>
      {children}
    </MiembrosContext.Provider>
  )
}

export function useMiembros() {
  const context = useContext(MiembrosContext)
  if (context === undefined) {
    throw new Error('useMiembros must be used within a MiembrosProvider')
  }
  return context
}