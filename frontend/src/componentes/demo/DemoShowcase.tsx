'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDemo } from '@/contextos/DemoContext'
import { DemoDataProvider, useDemoData } from '@/contextos/DemoDataProvider'
import { DemoProvider } from '@/contextos/DemoContext'
import { ConfiguracionDemo, AudienciaDemo, VistaDemo } from '../../../tipos/demo'
import GuidedTour, { useGuidedTour } from './GuidedTour'
import DemoHeader from './DemoHeader'
import DemoNavigation from './DemoNavigation'
import DemoContent from './DemoContent'
import DemoCTAs from './DemoCTAs'
import DemoAnalytics from './DemoAnalytics'

// ✅ COMPONENTE PRINCIPAL REFACTORIZADO
interface DemoShowcaseProps {
  // Configuración inicial
  audienciaInicial?: AudienciaDemo
  comunidadId?: string
  modoKiosko?: boolean
  
  // Personalización
  mostrarOnboarding?: boolean
  mostrarTour?: boolean
  mostrarCTAs?: boolean
  mostrarAnalytics?: boolean
  
  // Datos personalizados
  datosPersonalizados?: {
    nombreOrganizacion?: string
    logoOrganizacion?: string
    coloresPersonalizados?: {
      primario: string
      secundario: string
    }
  }
  
  // Callbacks
  onConversion?: (tipo: string, datos: any) => void
  onAnalytics?: (evento: any) => void
  onError?: (error: Error) => void
}

export default function DemoShowcase({
  audienciaInicial = 'administracion',
  comunidadId = 'catalunya',
  modoKiosko = false,
  mostrarOnboarding = true,
  mostrarTour = true,
  mostrarCTAs = true,
  mostrarAnalytics = false,
  datosPersonalizados,
  onConversion,
  onAnalytics,
  onError
}: DemoShowcaseProps) {
  
  return (
    <DemoProvider
      configuracionInicial={{
        audiencia: audienciaInicial,
        comunidadId,
        modo: modoKiosko ? 'presentacion' : 'libre',
        personalizacion: {
          mostrarOnboarding,
          destacarFuncionalidades: [],
          ocultarFuncionalidades: [],
          datosPersonalizados
        }
      }}
    >
      <DemoDataProvider 
        audiencia={audienciaInicial}
        comunidadId={comunidadId}
      >
        <DemoShowcaseInner
          mostrarTour={mostrarTour}
          mostrarCTAs={mostrarCTAs}
          mostrarAnalytics={mostrarAnalytics}
          modoKiosko={modoKiosko}
          onConversion={onConversion}
          onAnalytics={onAnalytics}
          onError={onError}
        />
      </DemoDataProvider>
    </DemoProvider>
  )
}

// ✅ COMPONENTE INTERNO CON ACCESO A CONTEXTOS
interface DemoShowcaseInnerProps {
  mostrarTour: boolean
  mostrarCTAs: boolean
  mostrarAnalytics: boolean
  modoKiosko: boolean
  onConversion?: (tipo: string, datos: any) => void
  onAnalytics?: (evento: any) => void
  onError?: (error: Error) => void
}

function DemoShowcaseInner({
  mostrarTour,
  mostrarCTAs, 
  mostrarAnalytics,
  modoKiosko,
  onConversion,
  onAnalytics,
  onError
}: DemoShowcaseInnerProps) {
  const { 
    configuracion,
    navegacion,
    cambiarVista,
    analytics,
    trackearEvento,
    reiniciarDemo 
  } = useDemo()
  
  const { tourActivo, iniciarTour, finalizarTour, saltarTour } = useGuidedTour(configuracion.audiencia)
  const [mostrarBienvenida, setMostrarBienvenida] = useState(configuracion.personalizacion.mostrarOnboarding)
  
  // ✅ EFECTO: Inicialización y tracking
  useEffect(() => {
    trackearEvento({
      tipo: 'inicio_sesion',
      usuarioDemo: 'demo_user',
      seccion: 'demo_showcase',
      accion: 'inicializar_demo',
      metadata: {
        audiencia: configuracion.audiencia,
        comunidad: configuracion.comunidadId,
        modo: configuracion.modo
      }
    })
    
    // Auto-reinicio en modo kiosko
    if (modoKiosko) {
      const timeout = setTimeout(() => {
        reiniciarDemo()
      }, 10 * 60 * 1000) // 10 minutos
      
      return () => clearTimeout(timeout)
    }
  }, [])
  
  // ✅ EFECTO: Enviar analytics externos
  useEffect(() => {
    if (onAnalytics && analytics.eventos.length > 0) {
      const ultimoEvento = analytics.eventos[analytics.eventos.length - 1]
      onAnalytics(ultimoEvento)
    }
  }, [analytics.eventos, onAnalytics])
  
  // ✅ MANEJO DE CONVERSIONES
  const handleConversion = useCallback((tipo: string, datos: any) => {
    trackearEvento({
      tipo: 'conversion',
      usuarioDemo: 'demo_user',
      seccion: 'cta',
      accion: tipo,
      metadata: datos
    })
    
    onConversion?.(tipo, {
      ...datos,
      sessionId: analytics.sesionId,
      duracionSesion: analytics.duracionTotal,
      puntuacionInteres: analytics.puntuacionInteres,
      funcionesUsadas: analytics.funcionesUsadas
    })
  }, [analytics, trackearEvento, onConversion])
  
  // ✅ BIENVENIDA INICIAL
  if (mostrarBienvenida) {
    return (
      <BienvenidaDemo
        audiencia={configuracion.audiencia}
        datosPersonalizados={configuracion.personalizacion.datosPersonalizados}
        onIniciar={() => setMostrarBienvenida(false)}
        onIniciarConTour={() => {
          setMostrarBienvenida(false)
          if (mostrarTour) {
            setTimeout(iniciarTour, 500)
          }
        }}
        onSaltarDemo={() => {
          setMostrarBienvenida(false)
          if (onConversion) {
            onConversion('saltar_demo', { razon: 'no_interesado' })
          }
        }}
      />
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ HEADER */}
      <DemoHeader 
        audiencia={configuracion.audiencia}
        datosPersonalizados={configuracion.personalizacion.datosPersonalizados}
        modoKiosko={modoKiosko}
        onReiniciar={reiniciarDemo}
        onExportar={() => {
          // Generar y descargar reporte de la sesión
          const reporte = {
            sessionId: analytics.sesionId,
            duracion: analytics.duracionTotal,
            audiencia: configuracion.audiencia,
            vistasVisitadas: navegacion.historial,
            funcionesUsadas: analytics.funcionesUsadas,
            puntuacionInteres: analytics.puntuacionInteres,
            probabilidadConversion: analytics.probabilidadConversion
          }
          
          const blob = new Blob([JSON.stringify(reporte, null, 2)], {
            type: 'application/json'
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `demo-session-${analytics.sesionId}.json`
          a.click()
          URL.revokeObjectURL(url)
        }}
      />
      
      {/* ✅ NAVEGACIÓN */}
      <DemoNavigation 
        vistaActual={navegacion.vistaActual}
        audiencia={configuracion.audiencia}
        onCambiarVista={cambiarVista}
        puedeRetroceder={navegacion.puedeRetroceder}
        onRetroceder={() => {
          // Implementar lógica de retroceso del contexto
        }}
      />
      
      {/* ✅ CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DemoContent 
          vista={navegacion.vistaActual}
          audiencia={configuracion.audiencia}
          comunidadId={configuracion.comunidadId}
        />
      </main>
      
      {/* ✅ CTAs FLOTANTES */}
      {mostrarCTAs && (
        <DemoCTAs 
          audiencia={configuracion.audiencia}
          analytics={analytics}
          onConversion={handleConversion}
        />
      )}
      
      {/* ✅ GUIDED TOUR */}
      {mostrarTour && (
        <GuidedTour
          activo={tourActivo}
          audiencia={configuracion.audiencia}
          onFinalizar={finalizarTour}
          onSaltar={saltarTour}
        />
      )}
      
      {/* ✅ ANALYTICS DEBUG (solo para desarrollo) */}
      {mostrarAnalytics && process.env.NODE_ENV === 'development' && (
        <DemoAnalytics analytics={analytics} />
      )}
      
      {/* ✅ MODO KIOSKO: Overlay de inactividad */}
      {modoKiosko && (
        <InactividadOverlay 
          tiempoLimite={5 * 60 * 1000} // 5 minutos
          onInactivo={() => {
            reiniciarDemo()
            setMostrarBienvenida(true)
          }}
        />
      )}
    </div>
  )
}

// ✅ COMPONENTE: Bienvenida inicial
interface BienvenidaDemoProps {
  audiencia: AudienciaDemo
  datosPersonalizados?: {
    nombreOrganizacion?: string
    logoOrganizacion?: string
  }
  onIniciar: () => void
  onIniciarConTour: () => void
  onSaltarDemo: () => void
}

function BienvenidaDemo({ 
  audiencia, 
  datosPersonalizados, 
  onIniciar, 
  onIniciarConTour,
  onSaltarDemo 
}: BienvenidaDemoProps) {
  const mensajes = {
    administracion: {
      titulo: '¡Benvingut a La Pública!',
      subtitulo: 'La xarxa social professional del sector públic',
      descripcion: 'Descobreix com connectar amb col·legues, participar en grups temàtics i accedir a formació especialitzada.',
      beneficios: [
        '🤝 Networking amb altres funcionaris',
        '📚 Formació contínua especialitzada', 
        '💬 Grups de discussió professionals',
        '📅 Esdeveniments del sector públic'
      ]
    },
    empresa: {
      titulo: '¡Bienvenido a La Pública!',
      subtitulo: 'Tu puerta de entrada al sector público',
      descripcion: 'Descubre oportunidades de colaboración público-privada y conecta con decisores clave.',
      beneficios: [
        '💼 Oportunidades de negocio',
        '🎯 Contacto directo con decisores',
        '📈 Colaboración público-privada',
        '🔍 Licitaciones y concursos'
      ]
    },
    stakeholder: {
      titulo: 'Panel de Control Ejecutivo',
      subtitulo: 'Vista estratégica de La Pública',
      descripcion: 'Métricas clave, ROI y análisis de impacto de la plataforma en tu organización.',
      beneficios: [
        '📊 Dashboards ejecutivos',
        '💡 Insights estratégicos',
        '📈 Métricas de adopción',
        '🎯 ROI measurable'
      ]
    },
    sindicato: {
      titulo: 'Portal Sindical',
      subtitulo: 'Representación y participación sindical',
      descripcion: 'Herramientas para la gestión sindical y comunicación con afiliados.',
      beneficios: [
        '🤝 Gestión de afiliados',
        '📋 Negociación colectiva',
        '📢 Comunicación sindical',
        '🎯 Movilizaciones'
      ]
    },
    ciudadano: {
      titulo: 'Participación Ciudadana',
      subtitulo: 'Tu voz en las decisiones públicas',
      descripcion: 'Participa activamente en consultas y decisiones que afectan tu comunidad.',
      beneficios: [
        '🗳️ Consultas públicas',
        '👁️ Transparencia',
        '💡 Propuestas ciudadanas',
        '📊 Seguimiento de políticas'
      ]
    },
    desarrollador: {
      titulo: 'Panel Técnico',
      subtitulo: 'Configuración y desarrollo',
      descripcion: 'Herramientas técnicas para administradores y desarrolladores.',
      beneficios: [
        '⚙️ Configuración avanzada',
        '🔌 APIs y integraciones',
        '📊 Monitorización',
        '👥 Gestión de usuarios'
      ]
    }
  }
  
  const mensaje = mensajes[audiencia] || mensajes.administracion
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo personalizado o por defecto */}
        <div className="mb-8">
          {datosPersonalizados?.logoOrganizacion ? (
            <img 
              src={datosPersonalizados.logoOrganizacion} 
              alt={datosPersonalizados.nombreOrganizacion}
              className="h-16 mx-auto mb-4"
            />
          ) : (
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">LP</span>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {mensaje.titulo}
          </h1>
          <p className="text-xl text-gray-600">
            {mensaje.subtitulo}
          </p>
        </div>
        
        {/* Descripción */}
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          {mensaje.descripcion}
        </p>
        
        {/* Beneficios */}
        <div className="grid md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
          {mensaje.beneficios.map((beneficio, index) => (
            <div key={index} className="flex items-center justify-center space-x-2 text-gray-700">
              <span>{beneficio}</span>
            </div>
          ))}
        </div>
        
        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={onIniciarConTour}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
          >
            <span>🎯 Tour Guiado</span>
          </button>
          
          <button
            onClick={onIniciar}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Explorar Libremente
          </button>
          
          <button
            onClick={onSaltarDemo}
            className="text-gray-500 hover:text-gray-700 underline text-sm transition-colors"
          >
            No me interesa ahora
          </button>
        </div>
        
        {/* Personalización para organización */}
        {datosPersonalizados?.nombreOrganizacion && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              Demo personalizada para {datosPersonalizados.nombreOrganizacion}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ COMPONENTE: Overlay de inactividad para kiosko
interface InactividadOverlayProps {
  tiempoLimite: number
  onInactivo: () => void
}

function InactividadOverlay({ tiempoLimite, onInactivo }: InactividadOverlayProps) {
  const [tiempoRestante, setTiempoRestante] = useState(tiempoLimite)
  const [mostrarAviso, setMostrarAviso] = useState(false)
  
  useEffect(() => {
    let ultimaActividad = Date.now()
    
    const checkActividad = () => {
      const tiempoInactivo = Date.now() - ultimaActividad
      
      if (tiempoInactivo > tiempoLimite * 0.8 && !mostrarAviso) {
        setMostrarAviso(true)
        setTiempoRestante(tiempoLimite - tiempoInactivo)
      }
      
      if (tiempoInactivo > tiempoLimite) {
        onInactivo()
      }
    }
    
    const resetTimer = () => {
      ultimaActividad = Date.now()
      setMostrarAviso(false)
    }
    
    // Listeners para actividad
    const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    eventos.forEach(evento => {
      document.addEventListener(evento, resetTimer, true)
    })
    
    const interval = setInterval(checkActividad, 1000)
    
    return () => {
      clearInterval(interval)
      eventos.forEach(evento => {
        document.removeEventListener(evento, resetTimer, true)
      })
    }
  }, [tiempoLimite, mostrarAviso, onInactivo])
  
  if (!mostrarAviso) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ¿Sigues ahí?
        </h3>
        <p className="text-gray-600 mb-6">
          La demo se reiniciará automáticamente en{' '}
          <strong>{Math.ceil(tiempoRestante / 1000)} segundos</strong> por inactividad.
        </p>
        <button
          onClick={() => setMostrarAviso(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Continuar Demo
        </button>
      </div>
    </div>
  )
}

// ✅ EXPORTS
export { DemoShowcase, BienvenidaDemo }