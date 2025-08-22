'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { traduccioAutomatica, DiccionariTraduccions } from '../servicios/traduccioAutomatica'
// Simulación de servicio de traducción (en producción usar API real)
type IdiomasSoportados = 'ca' | 'es' | 'eu' | 'gl';

// Mock de traducción automática (en producción integrar con servicio real)
const traducirConCache = async (texto: string, idiomaOrigen: IdiomasSoportados, idiomaDestino: IdiomasSoportados): Promise<string> => {
  // Simulación: en producción aquí iría la llamada a la API de traducción
  console.log(`🌐 Traduciendo "${texto}" de ${idiomaOrigen} a ${idiomaDestino}`);
  return texto; // Por ahora devuelve el texto original
};
import { useComunidad } from '../../app/ComunidadContext'

interface TraduccioContextType {
  // Función principal de traducción
  t: (clau: string, opcions?: {
    fallback?: string
    variables?: Record<string, string | number>
    contexte?: string
  }) => string
  
  // Función para traducir contenido dinámico (ofertas, anuncios, eventos)
  tDynamic: (content: {
    texto: string
    idiomaOriginal?: IdiomasSoportados
    tipo?: 'oferta' | 'anuncio' | 'evento' | 'institucional'
  }) => Promise<string>
  
  // Estado del sistema
  idioma: string
  idiomesDisponibles: string[]
  estatCarrega: 'carregant' | 'carregat' | 'error'
  
  // Configuración
  cambiarIdioma: (nouIdioma: string) => void
  afegirTraduccions: (traduccions: Record<string, string>, idioma?: string) => void
  
  // Utilidades
  esIdiomaSuportat: (idioma: string) => boolean
  obtenirEstadistiques: () => {
    idiomesSuportats: number
    totalClaus: number
    traduccionsPerIdioma: Record<string, number>
    clausSenseTraduccion: string[]
  }
  
  // Debugging
  habilitatDebug: boolean
  toggleDebug: () => void
}

const TraduccioContext = createContext<TraduccioContextType | undefined>(undefined)

interface TraduccioProviderProps {
  children: ReactNode
  traduccionsInicials?: DiccionariTraduccions
  habilitatDebugInicial?: boolean
}

export function TraduccioProvider({ 
  children, 
  traduccionsInicials,
  habilitatDebugInicial = false
}: TraduccioProviderProps) {
  const { configuracion, idioma: idiomaComunidad } = useComunidad()
  const [idioma, setIdioma] = useState<string>(idiomaComunidad)
  const [estatCarrega, setEstatCarrega] = useState<'carregant' | 'carregat' | 'error'>('carregant')
  const [habilitatDebug, setHabilitatDebug] = useState(habilitatDebugInicial)

  // Sincronizar con el idioma de la comunidad
  useEffect(() => {
    if (idiomaComunidad !== idioma) {
      setIdioma(idiomaComunidad)
      traduccioAutomatica.configurarIdiomaPredeterminat(idiomaComunidad)
    }
  }, [idiomaComunidad, idioma])

  // Cargar traducciones iniciales
  useEffect(() => {
    const carregarTraduccions = async () => {
      try {
        setEstatCarrega('carregant')
        
        // Configurar idioma predeterminado basado en comunidad
        traduccioAutomatica.configurarIdiomaPredeterminat(idioma)
        
        // Importar traducciones adicionales si se proporcionan
        if (traduccionsInicials) {
          traduccioAutomatica.importarTraduccions(traduccionsInicials)
        }
        
        // Cargar traducciones específicas de la comunidad si existen
        await carregarTraduccionsEspecifiquesComunidad()
        
        setEstatCarrega('carregat')
        
        if (habilitatDebug) {
          console.log('🌐 Sistema de traducció inicialitzat:', {
            idioma,
            comunitat: configuracion.codigo,
            estadistiques: traduccioAutomatica.obtenirEstadistiques()
          })
        }
      } catch (error) {
        console.error('❌ Error carregant traduccions:', error)
        setEstatCarrega('error')
      }
    }

    carregarTraduccions()
  }, [idioma, configuracion.codigo, traduccionsInicials, habilitatDebug])

  // Cargar traducciones específicas de la comunidad
  const carregarTraduccionsEspecifiquesComunidad = async () => {
    // Traducciones específicas según la comunidad
    const traduccionsEspecifiques: Record<string, Record<string, Record<string, string>>> = {
      catalunya: {
        ca: {
          'comunitat.nom': 'Catalunya',
          'comunitat.organitzacio_principal': 'Generalitat de Catalunya',
          'comunitat.idioma_oficial': 'Català',
          'admin.tipus': 'Administració Pública Catalana',
        },
        es: {
          'comunitat.nom': 'Cataluña',
          'comunitat.organitzacio_principal': 'Generalitat de Cataluña',
          'comunitat.idioma_oficial': 'Catalán',
          'admin.tipus': 'Administración Pública Catalana',
        }
      },
      euskadi: {
        eu: {
          'comunitat.nom': 'Euskadi',
          'comunitat.organitzacio_principal': 'Eusko Jaurlaritza',
          'comunitat.idioma_oficial': 'Euskera',
          'admin.tipus': 'Euskadiko Administrazio Publikoa',
        },
        es: {
          'comunitat.nom': 'País Vasco',
          'comunitat.organitzacio_principal': 'Gobierno Vasco',
          'comunitat.idioma_oficial': 'Euskera',
          'admin.tipus': 'Administración Pública Vasca',
        }
      },
      galicia: {
        gl: {
          'comunitat.nom': 'Galicia',
          'comunitat.organitzacio_principal': 'Xunta de Galicia',
          'comunitat.idioma_oficial': 'Galego',
          'admin.tipus': 'Administración Pública Galega',
        },
        es: {
          'comunitat.nom': 'Galicia',
          'comunitat.organitzacio_principal': 'Xunta de Galicia',
          'comunitat.idioma_oficial': 'Gallego',
          'admin.tipus': 'Administración Pública Gallega',
        }
      }
    }

    const traduccionsComunitaria = traduccionsEspecifiques[configuracion.codigo]
    if (traduccionsComunitaria) {
      Object.entries(traduccionsComunitaria).forEach(([lang, traduccions]) => {
        traduccioAutomatica.afegirTraduccions(lang, traduccions)
      })
    }

    // Traducciones de organizaciones específicas
    const traduccionsOrganitzacions: Record<string, string> = {}
    configuracion.organizaciones.forEach((org, index) => {
      traduccionsOrganitzacions[`org.${index}`] = org
    })
    traduccioAutomatica.afegirTraduccions(idioma, traduccionsOrganitzacions)

    // Traducciones de provincias
    const traduccionsProvinces: Record<string, string> = {}
    configuracion.provincias.forEach((provincia, index) => {
      traduccionsProvinces[`provincia.${index}`] = provincia
    })
    traduccioAutomatica.afegirTraduccions(idioma, traduccionsProvinces)
  }

  // Función principal de traducción con debug
  const t = (clau: string, opcions?: {
    fallback?: string
    variables?: Record<string, string | number>
    contexte?: string
  }): string => {
    const traduccio = traduccioAutomatica.t(clau, idioma, opcions)
    
    if (habilitatDebug && traduccio === clau) {
      console.log(`🔍 Traducció mancant: "${clau}" per idioma "${idioma}"`)
    }
    
    return traduccio
  }

  // Función para traducir contenido dinámico con traducción automática
  const tDynamic = async (content: {
    texto: string
    idiomaOriginal?: IdiomasSoportados
    tipo?: 'oferta' | 'anuncio' | 'evento' | 'institucional'
  }): Promise<string> => {
    const idiomaOriginal = content.idiomaOriginal || 'es'
    
    // Si el idioma destino es igual al original, no traducir
    if (idioma === idiomaOriginal) {
      return content.texto
    }

    try {
      // Usar traducción automática para contenido dinámico
      const textoTraducido = await traducirConCache(
        content.texto,
        idiomaOriginal,
        idioma as any
      )
      
      if (habilitatDebug) {
        console.log(`🌐 Contingut dinàmic traduït (${content.tipo || 'genèric'}): ${idiomaOriginal} → ${idioma}`)
      }
      
      return textoTraducido
    } catch (error) {
      console.error('❌ Error traducint contingut dinàmic:', error)
      return content.texto // Fallback al original
    }
  }

  // Cambiar idioma
  const cambiarIdioma = (nouIdioma: string) => {
    if (traduccioAutomatica.esIdiomaSuportat(nouIdioma)) {
      setIdioma(nouIdioma)
      traduccioAutomatica.configurarIdiomaPredeterminat(nouIdioma)
      
      if (habilitatDebug) {
        console.log(`🌐 Idioma canviat a: ${nouIdioma}`)
      }
    } else {
      console.warn(`⚠️ Idioma no suportat: ${nouIdioma}`)
    }
  }

  // Agregar traducciones dinámicamente
  const afegirTraduccions = (traduccions: Record<string, string>, idiomaDesti?: string) => {
    const idiomaTraduccio = idiomaDesti || idioma
    traduccioAutomatica.afegirTraduccions(idiomaTraduccio, traduccions)
    
    if (habilitatDebug) {
      console.log(`📝 ${Object.keys(traduccions).length} traduccions afegides per ${idiomaTraduccio}`)
    }
  }

  // Toggle debug mode
  const toggleDebug = () => {
    setHabilitatDebug(!habilitatDebug)
    console.log(`🐛 Mode debug: ${!habilitatDebug ? 'ACTIVAT' : 'DESACTIVAT'}`)
  }

  const value: TraduccioContextType = {
    t,
    tDynamic,
    idioma,
    idiomesDisponibles: configuracion.idiomas,
    estatCarrega,
    cambiarIdioma,
    afegirTraduccions,
    esIdiomaSuportat: traduccioAutomatica.esIdiomaSuportat,
    obtenirEstadistiques: traduccioAutomatica.obtenirEstadistiques,
    habilitatDebug,
    toggleDebug
  }

  return (
    <TraduccioContext.Provider value={value}>
      {children}
    </TraduccioContext.Provider>
  )
}

// Hook para usar el contexto de traducción
export function useTraduccio() {
  const context = useContext(TraduccioContext)
  if (context === undefined) {
    throw new Error('useTraduccio ha de ser usat dins d\'un TraduccioProvider')
  }
  return context
}

// Hook simplificado que solo retorna la función t
export function useT() {
  const { t } = useTraduccio()
  return t
}

// Hook para traducciones con variables
export function useTWithVars() {
  const { t } = useTraduccio()
  
  return (clau: string, variables: Record<string, string | number>, fallback?: string) =>
    t(clau, { variables, fallback })
}

// Component wrapper para traducción inline
interface TProps {
  children: string
  variables?: Record<string, string | number>
  fallback?: string
  contexte?: string
}

export function T({ children, variables, fallback, contexte }: TProps) {
  const { t } = useTraduccio()
  return <>{t(children, { variables, fallback, contexte })}</>
}

// HOC para componentes que necesitan traducción
export function withTraduccio<P extends object>(
  Component: React.ComponentType<P & { t: (clau: string, opcions?: any) => string }>
) {
  return function ComponentWithTraduccio(props: P) {
    const { t } = useTraduccio()
    return <Component {...props} t={t} />
  }
}

export { TraduccioContext }