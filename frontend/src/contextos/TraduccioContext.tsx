'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { traduccioAutomatica, DiccionariTraduccions, ServicioTraduccionAutomatica } from '../servicios/traduccioAutomatica'
import { IdiomaOficial, ContenidoMultiidioma } from '../../tipos/i18n'
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
    idiomaOriginal?: IdiomaOficial
    tipo?: 'oferta' | 'anuncio' | 'evento' | 'institucional'
  }) => Promise<string>
  
  // ✅ NUEVAS FUNCIONES PARA CONTENIDO MULTIIDIOMA
  // Función para traducir contenido completo multiidioma
  translateContent: (contenido: ContenidoMultiidioma) => Promise<string>
  
  // Función para crear contenido multiidioma desde texto plano
  createMultilingualContent: (
    texto: string,
    autorId: string,
    tipoContenido: 'post' | 'comentario' | 'evento' | 'anuncio' | 'grupo',
    idiomaOriginal?: IdiomaOficial
  ) => Promise<ContenidoMultiidioma>
  
  // Función para obtener contenido en idioma específico
  getContentInLanguage: (contenido: ContenidoMultiidioma, idiomaDest?: IdiomaOficial) => Promise<string>
  
  // Estado del sistema
  idioma: IdiomaOficial
  idiomesDisponibles: IdiomaOficial[]
  estatCarrega: 'carregant' | 'carregat' | 'error'
  traduciendo: boolean
  
  // Configuración
  cambiarIdioma: (nouIdioma: IdiomaOficial) => void
  afegirTraduccions: (traduccions: Record<string, string>, idioma?: string) => void
  
  // ✅ NUEVAS CONFIGURACIONES
  // Configuración de preferencias de traducción del usuario
  configuracionUsuario: {
    traducirAutomaticamente: boolean
    mostrarIdiomaOriginal: boolean
    priorizarContenidoEnMiIdioma: boolean
  }
  
  actualizarConfiguracionUsuario: (config: Partial<{
    traducirAutomaticamente: boolean
    mostrarIdiomaOriginal: boolean
    priorizarContenidoEnMiIdioma: boolean
  }>) => void
  
  // Utilidades
  esIdiomaSuportat: (idioma: string) => boolean
  obtenirEstadistiques: () => {
    idiomesSuportats: number
    totalClaus: number
    traduccionsPerIdioma: Record<string, number>
    clausSenseTraduccion: string[]
    // ✅ NUEVAS ESTADÍSTICAS
    contenidoTraducido: {
      totalContenidos: number
      traduccionesEnCache: number
      traduccionesExitosas: number
      traduccionesFallidas: number
    }
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
  const [idioma, setIdioma] = useState<IdiomaOficial>(idiomaComunidad as IdiomaOficial)
  const [estatCarrega, setEstatCarrega] = useState<'carregant' | 'carregat' | 'error'>('carregant')
  const [habilitatDebug, setHabilitatDebug] = useState(habilitatDebugInicial)
  const [traduciendo, setTraduciendo] = useState(false)
  
  // ✅ NUEVA CONFIGURACIÓN DE USUARIO
  const [configuracionUsuario, setConfiguracionUsuario] = useState({
    traducirAutomaticamente: true,
    mostrarIdiomaOriginal: false,
    priorizarContenidoEnMiIdioma: true
  })

  // Sincronizar con el idioma de la comunidad
  useEffect(() => {
    if (idiomaComunidad !== idioma) {
      setIdioma(idiomaComunidad as IdiomaOficial)
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
    idiomaOriginal?: IdiomaOficial
    tipo?: 'oferta' | 'anuncio' | 'evento' | 'institucional'
  }): Promise<string> => {
    const idiomaOriginal = content.idiomaOriginal || 'es'
    
    // Si el idioma destino es igual al original, no traducir
    if (idioma === idiomaOriginal) {
      return content.texto
    }

    try {
      setTraduciendo(true)
      
      // Usar el nuevo servicio de traducción automática
      const resultado = await ServicioTraduccionAutomatica.traducirTexto(
        content.texto,
        idiomaOriginal,
        idioma
      )
      const textoTraducido = typeof resultado === 'string' ? resultado : resultado.textoTraducido
      
      if (habilitatDebug) {
        console.log(`🌐 Contingut dinàmic traduït (${content.tipo || 'genèric'}): ${idiomaOriginal} → ${idioma}`)
      }
      
      return textoTraducido
    } catch (error) {
      console.error('❌ Error traducint contingut dinàmic:', error)
      return content.texto // Fallback al original
    } finally {
      setTraduciendo(false)
    }
  }
  
  // ✅ NUEVA FUNCIÓN PARA TRADUCIR CONTENIDO COMPLETO MULTIIDIOMA
  const translateContent = async (contenido: ContenidoMultiidioma): Promise<string> => {
    return await ServicioTraduccionAutomatica.traducirContenido(contenido, idioma)
  }
  
  // ✅ NUEVA FUNCIÓN PARA CREAR CONTENIDO MULTIIDIOMA
  const createMultilingualContent = async (
    texto: string,
    autorId: string,
    tipoContenido: 'post' | 'comentario' | 'evento' | 'anuncio' | 'grupo',
    idiomaOriginal: IdiomaOficial = 'es'
  ): Promise<ContenidoMultiidioma> => {
    // Crear contenido manualmente ya que el método no existe en la clase
    const contenido: ContenidoMultiidioma = {
      id: `contenido_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      autorId,
      fechaCreacion: new Date(),
      idiomaOriginal,
      textoOriginal: texto,
      traducciones: {},
      tipoContenido,
      requiereTraduccion: true,
      esOficial: false
    }
    return contenido
  }
  
  // ✅ NUEVA FUNCIÓN PARA OBTENER CONTENIDO EN IDIOMA ESPECÍFICO
  const getContentInLanguage = async (
    contenido: ContenidoMultiidioma, 
    idiomaDest?: IdiomaOficial
  ): Promise<string> => {
    const idiomaDestino = idiomaDest || idioma
    return await ServicioTraduccionAutomatica.traducirContenido(contenido, idiomaDestino)
  }

  // Cambiar idioma
  const cambiarIdioma = (nouIdioma: IdiomaOficial) => {
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
  
  // ✅ NUEVA FUNCIÓN PARA ACTUALIZAR CONFIGURACIÓN DE USUARIO
  const actualizarConfiguracionUsuario = (config: Partial<{
    traducirAutomaticamente: boolean
    mostrarIdiomaOriginal: boolean
    priorizarContenidoEnMiIdioma: boolean
  }>) => {
    setConfiguracionUsuario(prev => ({ ...prev, ...config }))
    
    if (habilitatDebug) {
      console.log(`⚙️ Configuració d'usuari actualitzada:`, config)
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
    translateContent,
    createMultilingualContent,
    getContentInLanguage,
    idioma,
    idiomesDisponibles: configuracion.idiomas as IdiomaOficial[],
    estatCarrega,
    traduciendo,
    cambiarIdioma,
    afegirTraduccions,
    configuracionUsuario,
    actualizarConfiguracionUsuario,
    esIdiomaSuportat: traduccioAutomatica.esIdiomaSuportat,
    obtenirEstadistiques: () => {
      const statsBasicas = traduccioAutomatica.obtenirEstadistiques()
      // Estadísticas básicas por ahora, se pueden extender
      const statsContenido = {
        totalContenidos: 0,
        traduccionesEnCache: 0,
        traduccionesExitosas: 0,
        traduccionesFallidas: 0
      }
      
      return {
        ...statsBasicas,
        contenidoTraducido: statsContenido
      }
    },
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

// ✅ NUEVOS HOOKS ESPECIALIZADOS PARA CONTENIDO MULTIIDIOMA

// Hook para traducir contenido dinámico
export function useTDynamic() {
  const { tDynamic } = useTraduccio()
  return tDynamic
}

// Hook para manejar contenido multiidioma completo
export function useMultilingualContent() {
  const { 
    translateContent, 
    createMultilingualContent, 
    getContentInLanguage,
    configuracionUsuario,
    traduciendo 
  } = useTraduccio()
  
  return {
    translateContent,
    createMultilingualContent,
    getContentInLanguage,
    configuracionUsuario,
    traduciendo
  }
}

// Hook para posts con traducción automática
export function useTranslatedPost() {
  const { getContentInLanguage, configuracionUsuario, idioma } = useTraduccio()
  
  const translatePost = async (contenido: ContenidoMultiidioma) => {
    if (!configuracionUsuario.traducirAutomaticamente) {
      return contenido.textoOriginal
    }
    
    return await getContentInLanguage(contenido, idioma)
  }
  
  return { translatePost }
}

// Hook para configuración de usuario
export function useTranslationSettings() {
  const { 
    configuracionUsuario, 
    actualizarConfiguracionUsuario,
    idioma,
    idiomesDisponibles,
    cambiarIdioma
  } = useTraduccio()
  
  return {
    configuracionUsuario,
    actualizarConfiguracionUsuario,
    idioma,
    idiomesDisponibles,
    cambiarIdioma
  }
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

// ✅ NUEVO COMPONENTE PARA CONTENIDO MULTIIDIOMA
interface MultilingualContentProps {
  contenido: ContenidoMultiidioma
  mostrarIdiomOriginal?: boolean
  className?: string
  onTranslationError?: (error: Error) => void
}

export function MultilingualContent({ 
  contenido, 
  mostrarIdiomOriginal = false,
  className = '',
  onTranslationError
}: MultilingualContentProps) {
  const { getContentInLanguage, configuracionUsuario, idioma, traduciendo } = useTraduccio()
  const [textoMostrado, setTextoMostrado] = useState<string>(contenido.textoOriginal)
  const [cargando, setCargando] = useState(false)
  
  useEffect(() => {
    const traducirContenido = async () => {
      if (!configuracionUsuario.traducirAutomaticamente || idioma === contenido.idiomaOriginal) {
        setTextoMostrado(contenido.textoOriginal)
        return
      }
      
      try {
        setCargando(true)
        const textoTraducido = await getContentInLanguage(contenido, idioma)
        setTextoMostrado(textoTraducido)
      } catch (error) {
        console.error('Error traduciendo contenido:', error)
        setTextoMostrado(contenido.textoOriginal)
        if (onTranslationError) {
          onTranslationError(error as Error)
        }
      } finally {
        setCargando(false)
      }
    }
    
    traducirContenido()
  }, [contenido, idioma, configuracionUsuario.traducirAutomaticamente, getContentInLanguage, onTranslationError])
  
  if (cargando || traduciendo) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }
  
  return (
    <div className={className}>
      <div className="content">
        {textoMostrado}
      </div>
      {mostrarIdiomOriginal && contenido.idiomaOriginal !== idioma && (
        <div className="text-xs text-gray-500 mt-1 border-t pt-1">
          <span className="font-semibold">Original ({contenido.idiomaOriginal}):</span> {contenido.textoOriginal}
        </div>
      )}
    </div>
  )
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