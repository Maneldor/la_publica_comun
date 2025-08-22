'use client'

import { ReactNode } from 'react'
import { GruposProvider } from './GruposContext'
import { MiembrosProvider } from './MiembrosContext'
import { ContenidoProvider } from './ContenidoContext'
import { ConfiguracionProvider } from './ConfiguracionContext'

// ✅ TÉCNICA AVANZADA: Composite Provider Pattern
// En lugar de anidar manualmente todos los providers, creamos uno compuesto
interface GruposCompoundProviderProps {
  children: ReactNode
}

export function GruposCompoundProvider({ children }: GruposCompoundProviderProps) {
  return (
    <ConfiguracionProvider>
      <GruposProvider>
        <MiembrosProvider>
          <ContenidoProvider>
            {children}
          </ContenidoProvider>
        </MiembrosProvider>
      </GruposProvider>
    </ConfiguracionProvider>
  )
}

// ✅ TÉCNICA: Convenience hooks que combinan múltiples contextos
export function useGruposCompleto() {
  // En casos donde necesitas acceso a todo, este hook evita imports múltiples
  const { useGrupos } = require('./GruposContext')
  const { useMiembros } = require('./MiembrosContext')
  const { useContenido } = require('./ContenidoContext')
  const { useConfiguracion } = require('./ConfiguracionContext')
  
  const grupos = useGrupos()
  const miembros = useMiembros()
  const contenido = useContenido()
  const configuracion = useConfiguracion()
  
  return {
    grupos,
    miembros,
    contenido,
    configuracion
  }
}

// Re-export individual hooks
export { useGrupos } from './GruposContext'
export { useMiembros } from './MiembrosContext'
export { useContenido } from './ContenidoContext'
export { useConfiguracion } from './ConfiguracionContext'

// Re-export individual providers (para casos específicos)
export { GruposProvider } from './GruposContext'
export { MiembrosProvider } from './MiembrosContext'  
export { ContenidoProvider } from './ContenidoContext'
export { ConfiguracionProvider } from './ConfiguracionContext'