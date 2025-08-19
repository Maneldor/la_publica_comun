'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { obtenerComunidadActual, ConfiguracionComunidad } from '../configuracion/comunidades'

interface ComunidadContextType {
  configuracion: ConfiguracionComunidad
  idioma: string
  cambiarIdioma: (idioma: string) => void
  estaActiva: boolean
}

const ComunidadContext = createContext<ComunidadContextType | undefined>(undefined)

interface ComunidadProviderProps {
  children: ReactNode
}

export function ComunidadProvider({ children }: ComunidadProviderProps) {
  // Inicializar directamente para evitar pantalla de carga
  const [configuracion] = useState<ConfiguracionComunidad>(() => obtenerComunidadActual())
  const [idioma, setIdioma] = useState<string>(() => obtenerComunidadActual().idiomaDefecto)

  const cambiarIdioma = (nuevoIdioma: string) => {
    setIdioma(nuevoIdioma)
  }

  return (
    <ComunidadContext.Provider value={{
      configuracion,
      idioma,
      cambiarIdioma,
      estaActiva: true
    }}>
      {children}
    </ComunidadContext.Provider>
  )
}

// Hook para usar el contexto
export const useComunidad = () => {
  const context = useContext(ComunidadContext)
  if (context === undefined) {
    throw new Error('useComunidad must be used within a ComunidadProvider')
  }
  return context
}

export { ComunidadContext }

// Configuración de Catalunya para compatibilidad con backup
export const configuracionCatalunya = {
  codigo: 'catalunya',
  nombre: 'Catalunya',
  host: 'lapublica.cat',
  idiomas: ['ca', 'es'],
  idiomaDefecto: 'ca',
  tema: {
    colorPrimario: '#0066CC',
    colorSecundario: '#FF6B35',
    colorAccento: '#4CAF50',
  },
  organizaciones: [
    'Generalitat de Catalunya',
    'Ajuntament de Barcelona',
  ],
  provincias: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
  caracteristicas: {
    empresas: true,
    sindicatos: true,
    oposiciones: true,
    bolsasTrabajo: true,
    interinidades: true,
  },
}