// ⚠️ DEPRECATED: Este archivo ha sido refactorizado para mejor rendimiento
// Usa los nuevos contextos en /contextos/grupos/ en su lugar

// MIGRACIÓN:
// ❌ import { useGruposAvanzados } from './GruposAvanzadosContext'
// ✅ import { useGrupos, useMiembros, useContenido, useConfiguracion } from './grupos'

// O para compatibilidad temporal:
// ✅ import { useGruposCompleto } from './grupos'

'use client'

import { ReactNode } from 'react'
import { GruposCompoundProvider, useGruposCompleto } from './grupos'

// ✅ Wrapper de compatibilidad temporal
export function GruposAvanzadosProvider({ children }: { children: ReactNode }) {
  console.warn('⚠️ GruposAvanzadosProvider está deprecated. Usa GruposCompoundProvider en su lugar.')
  
  return (
    <GruposCompoundProvider>
      {children}
    </GruposCompoundProvider>
  )
}

// ✅ Hook de compatibilidad temporal
export function useGruposAvanzados() {
  console.warn('⚠️ useGruposAvanzados está deprecated. Usa hooks específicos (useGrupos, useMiembros, etc.) para mejor rendimiento.')
  
  const { grupos, miembros, contenido, configuracion } = useGruposCompleto()
  
  // Mapear a la antigua interface para compatibilidad
  return {
    // Estado principal
    grupos: grupos.grupos,
    grupoActivo: grupos.grupoActivo,
    cargando: grupos.cargando,
    
    // Gestión de grupos
    crearGrupo: grupos.crearGrupo,
    editarGrupo: grupos.editarGrupo,
    eliminarGrupo: grupos.eliminarGrupo,
    seleccionarGrupo: grupos.seleccionarGrupo,
    
    // TODO: Agregar el resto de mapeos según se necesiten
    // Por ahora solo exponemos los más usados
    
    // Gestión de miembros
    miembros: miembros.miembros,
    agregarMiembro: miembros.agregarMiembro,
    removerMiembro: miembros.removerMiembro,
    
    // Posts
    posts: contenido.posts,
    crearPost: contenido.crearPost,
    
    // Ofertas
    ofertas: contenido.ofertas,
    crearOferta: contenido.crearOferta,
    
    // Configuración
    filtros: configuracion.filtros,
    setFiltros: configuracion.setFiltros,
    
    // Utilidades básicas
    esAdminGrupo: grupos.esAdminGrupo,
    esMiembroGrupo: miembros.esMiembroGrupo
  }
}