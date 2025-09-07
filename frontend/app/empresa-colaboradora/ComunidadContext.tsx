'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface ComunidadContextType {
  comunidadActual: {
    id: string
    nom: string
    idioma: 'ca' | 'es' | 'eu' | 'gl'
    colors: {
      primary: string
      secondary: string
      accent: string
    }
  }
}

const defaultContext: ComunidadContextType = {
  comunidadActual: {
    id: 'catalunya',
    nom: 'Catalunya',
    idioma: 'ca',
    colors: {
      primary: '#4F46E5',
      secondary: '#7C3AED', 
      accent: '#F59E0B'
    }
  }
}

export const ComunidadContext = createContext<ComunidadContextType>(defaultContext)

interface ComunidadProviderProps {
  children: ReactNode
}

export function ComunidadProvider({ children }: ComunidadProviderProps) {
  return (
    <ComunidadContext.Provider value={defaultContext}>
      {children}
    </ComunidadContext.Provider>
  )
}

export function useComunidad() {
  const context = useContext(ComunidadContext)
  if (!context) {
    throw new Error('useComunidad must be used within a ComunidadProvider')
  }
  return context
}