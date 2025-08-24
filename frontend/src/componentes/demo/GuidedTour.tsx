'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useDemo } from '@/contextos/DemoContext'
import { PasoTour, AudienciaDemo } from '../../../tipos/demo'
import { ChevronRight, ChevronLeft, X, Target, Play, SkipForward } from 'lucide-react'

// ✅ PASOS DEL TOUR POR AUDIENCIA
const TOURS_POR_AUDIENCIA: Record<AudienciaDemo, PasoTour[]> = {
  administracion: [
    {
      id: 'bienvenida',
      titulo: '¡Benvingut a La Pública!',
      descripcion: 'Descobreix com aquesta plataforma connecta funcionaris i millora la col·laboració en el sector públic.',
      posicion: 'bottom',
      duracionMaxima: 30,
      siguientePaso: 'dashboard'
    },
    {
      id: 'dashboard',
      titulo: 'El teu Panel Principal',
      descripcion: 'Aquí tens un resum de l\'activitat més rellevant: grups, esdeveniments i connexions professionals.',
      selector: '[data-tour="dashboard"]',
      posicion: 'bottom',
      accionRequerida: 'wait',
      duracionMaxima: 20,
      siguientePaso: 'navegacion'
    },
    {
      id: 'navegacion',
      titulo: 'Navegació Principal',
      descripcion: 'Utilitza aquest menú per accedir a grups, esdeveniments, directori de funcionaris i més funcionalitats.',
      selector: '[data-tour="nav-menu"]',
      posicion: 'right',
      accionRequerida: 'hover',
      duracionMaxima: 15,
      siguientePaso: 'grupos'
    },
    {
      id: 'grupos',
      titulo: 'Grups Professionals',
      descripcion: 'Connecta amb col·legues del teu departament, participa en grups temàtics i comparteix coneixements.',
      selector: '[data-tour="grupos-section"]',
      posicion: 'top',
      accionRequerida: 'click',
      siguientePaso: 'eventos'
    },
    {
      id: 'eventos',
      titulo: 'Esdeveniments i Formació',
      descripcion: 'Descobreix jornades formatives, conferències i activitats de networking del sector públic.',
      selector: '[data-tour="eventos-section"]',
      posicion: 'top',
      accionRequerida: 'click',
      siguientePaso: 'networking'
    },
    {
      id: 'networking',
      titulo: 'Networking Professional',
      descripcion: 'Troba i connecta amb altres professionals del sector públic. Amplia la teva xarxa de contactes.',
      selector: '[data-tour="directorio-section"]',
      posicion: 'left',
      siguientePaso: 'final'
    },
    {
      id: 'final',
      titulo: 'Comença a Explorar!',
      descripcion: 'Ja tens les eines bàsiques. Explora lliurement la plataforma i descobreix com pot millorar la teva feina diària.',
      posicion: 'bottom',
      duracionMaxima: 20
    }
  ],
  empresa: [
    {
      id: 'bienvenida',
      titulo: '¡Bienvenido a La Pública!',
      descripcion: 'Descubre oportunidades de colaboración con el sector público y conecta con funcionarios clave.',
      posicion: 'bottom',
      duracionMaxima: 30,
      siguientePaso: 'oportunidades'
    },
    {
      id: 'oportunidades',
      titulo: 'Oportunidades de Negocio',
      descripcion: 'Encuentra licitaciones, concursos y oportunidades de colaboración público-privada.',
      selector: '[data-tour="empresas-section"]',
      posicion: 'top',
      accionRequerida: 'click',
      siguientePaso: 'networking'
    },
    {
      id: 'networking',
      titulo: 'Contactos Clave',
      descripcion: 'Conecta directamente con decisores y técnicos del sector público relevantes para tu sector.',
      selector: '[data-tour="directorio-section"]',
      posicion: 'left',
      accionRequerida: 'hover',
      siguientePaso: 'grupos'
    },
    {
      id: 'grupos',
      titulo: 'Comunidades Especializadas',
      descripcion: 'Participa en grupos sectoriales donde empresas y administración colaboran e intercambian conocimiento.',
      selector: '[data-tour="grupos-section"]',
      posicion: 'top',
      siguientePaso: 'final'
    },
    {
      id: 'final',
      titulo: '¡Comienza a Conectar!',
      descripcion: 'Todo listo para encontrar las mejores oportunidades de colaboración público-privada.',
      posicion: 'bottom'
    }
  ],
  stakeholder: [
    {
      id: 'bienvenida',
      titulo: 'Panel de Control Ejecutivo',
      descripcion: 'Vista estratégica de la actividad, engagement y métricas clave de la plataforma.',
      posicion: 'bottom',
      siguientePaso: 'analytics'
    },
    {
      id: 'analytics',
      titulo: 'Analytics y Métricas',
      descripcion: 'Dashboard completo con KPIs de adopción, engagement y ROI de la plataforma.',
      selector: '[data-tour="analytics-section"]',
      posicion: 'top',
      accionRequerida: 'click',
      siguientePaso: 'impacto'
    },
    {
      id: 'impacto',
      titulo: 'Impacto y Resultados',
      descripcion: 'Visualiza el impacto real: colaboraciones generadas, tiempo ahorrado y eficiencia mejorada.',
      selector: '[data-tour="dashboard"]',
      posicion: 'bottom',
      siguientePaso: 'final'
    }
  ],
  sindicato: [
    {
      id: 'bienvenida',
      titulo: 'Bienvenido Representante Sindical',
      descripcion: 'Conecta con afiliados, organiza actividades y mantente al día con las necesidades del colectivo.',
      posicion: 'bottom',
      siguientePaso: 'grupos'
    },
    {
      id: 'grupos',
      titulo: 'Grupos de Afiliados',
      descripcion: 'Crea y gestiona comunidades de afiliados por departamentos, categorías profesionales o intereses.',
      selector: '[data-tour="grupos-section"]',
      posicion: 'top',
      accionRequerida: 'click',
      siguientePaso: 'eventos'
    }
  ],
  ciudadano: [
    {
      id: 'bienvenida',
      titulo: 'Bienvenido Ciudadano',
      descripcion: 'Accede a eventos públicos, conecta con tu administración y participa en la vida pública.',
      posicion: 'bottom',
      siguientePaso: 'eventos'
    }
  ],
  desarrollador: [
    {
      id: 'bienvenida',
      titulo: 'Panel Técnico',
      descripcion: 'Explora las capacidades técnicas, APIs y configuraciones de la plataforma.',
      posicion: 'bottom',
      siguientePaso: 'configuracion'
    }
  ]
}

// ✅ COMPONENTE PRINCIPAL DEL TOUR
interface GuidedTourProps {
  activo: boolean
  audiencia: AudienciaDemo
  onFinalizar: () => void
  onSaltar: () => void
}

export default function GuidedTour({ 
  activo, 
  audiencia, 
  onFinalizar, 
  onSaltar 
}: GuidedTourProps) {
  const { trackearEvento } = useDemo()
  const [pasoActual, setPasoActual] = useState(0)
  const [posicionTooltip, setPosicionTooltip] = useState({ x: 0, y: 0 })
  const [elementoObjetivo, setElementoObjetivo] = useState<Element | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  
  const pasos = TOURS_POR_AUDIENCIA[audiencia] || []
  const paso = pasos[pasoActual]
  
  // ✅ EFECTO: Posicionar tooltip y highlight
  useEffect(() => {
    if (!activo || !paso) return
    
    const posicionarTooltip = () => {
      if (paso.selector) {
        const elemento = document.querySelector(paso.selector)
        if (elemento) {
          setElementoObjetivo(elemento)
          const rect = elemento.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
          
          let x = rect.left + scrollLeft + rect.width / 2
          let y = rect.top + scrollTop
          
          // Ajustar según posición deseada
          switch (paso.posicion) {
            case 'top':
              y = rect.top + scrollTop - 20
              break
            case 'bottom':
              y = rect.bottom + scrollTop + 20
              break
            case 'left':
              x = rect.left + scrollLeft - 20
              y = rect.top + scrollTop + rect.height / 2
              break
            case 'right':
              x = rect.right + scrollLeft + 20
              y = rect.top + scrollTop + rect.height / 2
              break
          }
          
          setPosicionTooltip({ x, y })
          
          // Scroll suave al elemento
          elemento.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      } else {
        // Centrar en pantalla si no hay selector
        setPosicionTooltip({ 
          x: window.innerWidth / 2, 
          y: window.innerHeight / 2 
        })
        setElementoObjetivo(null)
      }
    }
    
    // Esperar un tick para que el DOM esté listo
    setTimeout(posicionarTooltip, 100)
    
    // Reposicionar en resize
    window.addEventListener('resize', posicionarTooltip)
    return () => window.removeEventListener('resize', posicionarTooltip)
  }, [activo, paso, pasoActual])
  
  // ✅ NAVEGACIÓN DEL TOUR
  const siguientePaso = useCallback(() => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(prev => prev + 1)
      trackearEvento({
        tipo: 'click_funcionalidad',
        usuarioDemo: 'tour',
        seccion: 'guided-tour',
        accion: 'siguiente_paso',
        metadata: { paso: paso?.id, siguiente: pasos[pasoActual + 1]?.id }
      })
    } else {
      finalizarTour()
    }
  }, [pasoActual, pasos, paso, trackearEvento])
  
  const pasoAnterior = useCallback(() => {
    if (pasoActual > 0) {
      setPasoActual(prev => prev - 1)
    }
  }, [pasoActual])
  
  const finalizarTour = useCallback(() => {
    trackearEvento({
      tipo: 'conversion',
      usuarioDemo: 'tour',
      seccion: 'guided-tour', 
      accion: 'finalizar_tour',
      metadata: { 
        pasosCompletados: pasoActual + 1,
        totalPasos: pasos.length,
        completado: pasoActual === pasos.length - 1
      }
    })
    onFinalizar()
  }, [pasoActual, pasos.length, trackearEvento, onFinalizar])
  
  const saltarTour = useCallback(() => {
    trackearEvento({
      tipo: 'abandono',
      usuarioDemo: 'tour',
      seccion: 'guided-tour',
      accion: 'saltar_tour',
      metadata: { 
        pasoAbandonado: paso?.id,
        pasoNumero: pasoActual + 1
      }
    })
    onSaltar()
  }, [paso, pasoActual, trackearEvento, onSaltar])
  
  // ✅ MANEJO DE ACCIONES REQUERIDAS
  useEffect(() => {
    if (!activo || !paso?.accionRequerida || !elementoObjetivo) return
    
    const manejarAccion = (event: Event) => {
      // Auto-avance si se cumple la acción requerida
      if (paso.accionRequerida === 'click' && event.type === 'click') {
        setTimeout(siguientePaso, 1000)
      } else if (paso.accionRequerida === 'hover' && event.type === 'mouseenter') {
        setTimeout(siguientePaso, 2000)
      }
    }
    
    const eventType = paso.accionRequerida === 'click' ? 'click' : 
                     paso.accionRequerida === 'hover' ? 'mouseenter' : null
    
    if (eventType) {
      elementoObjetivo.addEventListener(eventType, manejarAccion)
      return () => elementoObjetivo.removeEventListener(eventType, manejarAccion)
    }
  }, [activo, paso, elementoObjetivo, siguientePaso])
  
  // ✅ AUTO-AVANCE POR TIEMPO
  useEffect(() => {
    if (!activo || !paso?.duracionMaxima || paso.accionRequerida) return
    
    const timer = setTimeout(() => {
      siguientePaso()
    }, paso.duracionMaxima * 1000)
    
    return () => clearTimeout(timer)
  }, [activo, paso, siguientePaso])
  
  if (!activo || !paso) return null
  
  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* ✅ OVERLAY CON HIGHLIGHT */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        style={{
          background: elementoObjetivo ? 
            `radial-gradient(circle at ${posicionTooltip.x}px ${posicionTooltip.y}px, transparent 100px, rgba(0,0,0,0.7) 120px)` :
            'rgba(0,0,0,0.7)'
        }}
      />
      
      {/* ✅ HIGHLIGHT DEL ELEMENTO */}
      {elementoObjetivo && (
        <div
          className="absolute border-2 border-blue-400 rounded-lg shadow-lg animate-pulse"
          style={{
            left: elementoObjetivo.getBoundingClientRect().left - 4,
            top: elementoObjetivo.getBoundingClientRect().top + window.pageYOffset - 4,
            width: elementoObjetivo.getBoundingClientRect().width + 8,
            height: elementoObjetivo.getBoundingClientRect().height + 8,
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* ✅ TOOLTIP */}
      <div
        ref={tooltipRef}
        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm z-60 transform transition-all duration-300"
        style={{
          left: Math.max(20, Math.min(posicionTooltip.x - 150, window.innerWidth - 320)),
          top: Math.max(20, posicionTooltip.y - (paso.posicion === 'bottom' ? -20 : 80))
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">{paso.titulo}</h3>
          </div>
          <button
            onClick={saltarTour}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {paso.descripcion}
          </p>
          
          {/* Indicador de acción requerida */}
          {paso.accionRequerida && (
            <div className="mb-4 p-2 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-800 font-medium">
                {paso.accionRequerida === 'click' && '👆 Haz clic en el elemento resaltado'}
                {paso.accionRequerida === 'hover' && '🖱️ Pasa el ratón sobre el elemento resaltado'}  
                {paso.accionRequerida === 'wait' && '⏱️ Observa esta sección unos segundos'}
                {paso.accionRequerida === 'scroll' && '📜 Desplázate por esta sección'}
              </p>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progreso del tour</span>
              <span className="text-xs text-gray-500">
                {pasoActual + 1} / {pasos.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((pasoActual + 1) / pasos.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={pasoAnterior}
              disabled={pasoActual === 0}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={saltarTour}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
              >
                <SkipForward className="w-4 h-4" />
                <span>Saltar tour</span>
              </button>
              
              <button
                onClick={siguientePaso}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <span>
                  {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Siguiente'}
                </span>
                {pasoActual === pasos.length - 1 ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ✅ HOOK PARA CONTROLAR EL TOUR
export function useGuidedTour(audiencia: AudienciaDemo) {
  const [tourActivo, setTourActivo] = useState(false)
  const { trackearEvento } = useDemo()
  
  const iniciarTour = useCallback(() => {
    setTourActivo(true)
    trackearEvento({
      tipo: 'inicio_sesion',
      usuarioDemo: 'tour',
      seccion: 'guided-tour',
      accion: 'iniciar_tour',
      metadata: { audiencia }
    })
  }, [audiencia, trackearEvento])
  
  const finalizarTour = useCallback(() => {
    setTourActivo(false)
  }, [])
  
  const saltarTour = useCallback(() => {
    setTourActivo(false)
  }, [])
  
  return {
    tourActivo,
    iniciarTour,
    finalizarTour,
    saltarTour
  }
}