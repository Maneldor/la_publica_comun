'use client'

import { useState, useEffect } from 'react'
import { AudienciaDemo, AnalyticsDemo } from '../../../tipos/demo'
import { 
  Zap, 
  Calendar, 
  Download, 
  Phone, 
  Mail, 
  MessageSquare,
  X,
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'

interface DemoCTAsProps {
  audiencia: AudienciaDemo
  analytics: AnalyticsDemo
  onConversion: (tipo: string, datos: any) => void
}

export default function DemoCTAs({
  audiencia,
  analytics,
  onConversion
}: DemoCTAsProps) {
  const [ctaActivo, setCTAActivo] = useState<string | null>(null)
  const [modalAbierto, setModalAbierto] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    organizacion: '',
    cargo: '',
    mensaje: ''
  })
  
  // ✅ LÓGICA: Determinar CTA inteligente basado en comportamiento
  useEffect(() => {
    const determinarCTA = () => {
      const { duracionTotal, puntuacionInteres, funcionesUsadas, probabilidadConversion } = analytics
      
      // CTA por tiempo de sesión
      if (duracionTotal > 180000) { // 3+ minutos
        if (probabilidadConversion > 0.7) {
          setCTAActivo('conversion_alta')
        } else if (puntuacionInteres > 50) {
          setCTAActivo('interes_medio')
        }
      } else if (duracionTotal > 60000) { // 1+ minuto
        setCTAActivo('engagement_inicial')
      }
      
      // CTA específicos por audiencia y comportamiento
      if (funcionesUsadas.includes('licitacions') && audiencia === 'empresa') {
        setCTAActivo('demo_empresas')
      } else if (funcionesUsadas.includes('analytics') && audiencia === 'stakeholder') {
        setCTAActivo('reunion_ejecutiva')
      }
    }
    
    const timer = setTimeout(determinarCTA, 5000) // Esperar 5s antes de mostrar CTA
    return () => clearTimeout(timer)
  }, [analytics, audiencia])
  
  // ✅ CONFIGURACIÓN: CTAs por audiencia
  const configuracionesCTA = {
    administracion: {
      conversion_alta: {
        titulo: '¿T\'agrada el que veus?',
        descripcion: 'Implementa La Pública a la teva organització en menys de 30 dies.',
        accion: 'Sol·licitar Implementació',
        color: 'blue',
        urgencia: 'Oferta especial fins final de mes'
      },
      interes_medio: {
        titulo: 'Descobreix més funcionalitats',
        descripcion: 'Programa una demo personalitzada amb dades de la teva organització.',
        accion: 'Reservar Demo',
        color: 'green',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Mantén-te informat',
        descripcion: 'Rep actualitzacions sobre La Pública i casos d\'èxit del sector públic.',
        accion: 'Subscriure\'s',
        color: 'purple',
        urgencia: null
      }
    },
    empresa: {
      demo_empresas: {
        titulo: '¿Quieres acceso directo al sector público?',
        descripcion: 'Únete a empresas que ya colaboran con administraciones a través de La Pública.',
        accion: 'Solicitar Acceso Empresas',
        color: 'green',
        urgencia: '50 plazas disponibles este trimestre'
      },
      conversion_alta: {
        titulo: 'Oportunidades B2G esperándote',
        descripcion: 'Accede a licitaciones exclusivas y conecta con decisores clave.',
        accion: 'Empezar Ahora',
        color: 'green',
        urgencia: 'Primeros 30 días gratis'
      },
      interes_medio: {
        titulo: 'Explora más oportunidades',
        descripcion: 'Ve nuestro catálogo completo de soluciones B2G.',
        accion: 'Ver Catálogo',
        color: 'green',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Mantente informado',
        descripcion: 'Recibe alertas de nuevas licitaciones.',
        accion: 'Suscribirse',
        color: 'green',
        urgencia: null
      }
    },
    stakeholder: {
      reunion_ejecutiva: {
        titulo: 'ROI demostrado en organizaciones similares',
        descripcion: 'Ve casos de éxito y análisis de ROI específicos para tu sector.',
        accion: 'Agendar Reunión Ejecutiva',
        color: 'purple',
        urgencia: 'Disponibilidad limitada esta semana'
      },
      conversion_alta: {
        titulo: 'Implementación estratégica',
        descripcion: 'Programa piloto con análisis de impacto y roadmap personalizado.',
        accion: 'Iniciar Proyecto Piloto',
        color: 'purple',
        urgencia: 'Q4 2024 - últimas plazas'
      },
      interes_medio: {
        titulo: 'Análisis detallado',
        descripcion: 'Recibe un informe personalizado de implementación.',
        accion: 'Solicitar Análisis',
        color: 'purple',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Información ejecutiva',
        descripcion: 'Whitepaper con casos de éxito y ROI.',
        accion: 'Descargar Whitepaper',
        color: 'purple',
        urgencia: null
      }
    },
    sindicato: {
      conversion_alta: {
        titulo: 'Fortalece tu organización',
        descripcion: 'Implementa herramientas de gestión sindical modernas.',
        accion: 'Solicitar Demo Sindical',
        color: 'red',
        urgencia: 'Mejora tu representación'
      },
      interes_medio: {
        titulo: 'Conoce más funciones',
        descripcion: 'Ve cómo otros sindicatos usan La Pública.',
        accion: 'Ver Casos de Éxito',
        color: 'red',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Información sindical',
        descripcion: 'Mantente al día con novedades sindicales.',
        accion: 'Suscribirse',
        color: 'red',
        urgencia: null
      }
    },
    ciudadano: {
      conversion_alta: {
        titulo: 'Tu voz cuenta',
        descripcion: 'Únete a miles de ciudadanos que participan activamente.',
        accion: 'Participar Ahora',
        color: 'indigo',
        urgencia: 'Consulta ciudadana activa'
      },
      interes_medio: {
        titulo: 'Explora la participación',
        descripcion: 'Ve cómo puedes influir en las decisiones públicas.',
        accion: 'Ver Cómo Participar',
        color: 'indigo',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Mantente informado',
        descripcion: 'Recibe actualizaciones de consultas ciudadanas.',
        accion: 'Suscribirse',
        color: 'indigo',
        urgencia: null
      }
    },
    desarrollador: {
      conversion_alta: {
        titulo: 'Implementación técnica',
        descripcion: 'Acceso completo a APIs y documentación técnica.',
        accion: 'Acceso Técnico',
        color: 'gray',
        urgencia: 'Sandbox disponible'
      },
      interes_medio: {
        titulo: 'Documentación técnica',
        descripcion: 'Explora nuestras APIs y capacidades técnicas.',
        accion: 'Ver Documentación',
        color: 'gray',
        urgencia: null
      },
      engagement_inicial: {
        titulo: 'Actualizaciones técnicas',
        descripcion: 'Mantente al día con cambios en APIs.',
        accion: 'Suscribirse',
        color: 'gray',
        urgencia: null
      }
    }
  }
  
  const getCtaConfig = () => {
    const configs = configuracionesCTA[audiencia as keyof typeof configuracionesCTA]
    if (!configs || !ctaActivo) return configuracionesCTA.administracion.engagement_inicial
    return configs[ctaActivo as keyof typeof configs] || configuracionesCTA.administracion.engagement_inicial
  }
  
  const ctaConfig = getCtaConfig()
  
  // ✅ MANEJO: Conversión
  const handleConversion = (tipoCTA: string) => {
    const datosConversion = {
      cta: tipoCTA,
      audiencia,
      duracionSesion: analytics.duracionTotal,
      puntuacionInteres: analytics.puntuacionInteres,
      funcionesUsadas: analytics.funcionesUsadas,
      formulario: formData
    }
    
    onConversion(tipoCTA, datosConversion)
    setModalAbierto(null)
    setCTAActivo(null)
    
    // Mostrar CTA de agradecimiento
    setTimeout(() => setCTAActivo('gracias'), 500)
  }
  
  // ✅ COMPONENTE: Formulario de conversión
  const FormularioConversion = ({ tipoCTA }: { tipoCTA: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre completo *"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="email"
          placeholder="Email corporativo *"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Organización *"
          value={formData.organizacion}
          onChange={(e) => setFormData(prev => ({ ...prev, organizacion: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <input
        type="text"
        placeholder="Cargo"
        value={formData.cargo}
        onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <textarea
        placeholder="Mensaje o requisitos específicos"
        value={formData.mensaje}
        onChange={(e) => setFormData(prev => ({ ...prev, mensaje: e.target.value }))}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleConversion(tipoCTA)}
          disabled={!formData.nombre || !formData.email || !formData.organizacion}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <span>{ctaConfig?.accion || 'Enviar'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => setModalAbierto(null)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
  
  // No mostrar CTAs si no hay configuración o es muy pronto
  if (!ctaActivo || !ctaConfig || analytics.duracionTotal < 30000) {
    return null
  }
  
  // ✅ CTA: Mensaje de agradecimiento
  if (ctaActivo === 'gracias') {
    return (
      <div className="fixed bottom-6 right-6 max-w-sm bg-green-500 text-white p-6 rounded-lg shadow-xl z-50 animate-slide-up">
        <div className="flex items-start space-x-3">
          <Star className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold mb-1">¡Gracias por tu interés!</h4>
            <p className="text-sm text-green-100 mb-4">
              Nos pondremos en contacto contigo en las próximas 24 horas.
            </p>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>24h respuesta</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>Demo personalizada</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setCTAActivo(null)}
            className="text-green-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }
  
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
    green: 'bg-green-500 hover:bg-green-600 border-green-500',
    purple: 'bg-purple-500 hover:bg-purple-600 border-purple-500'
  }
  
  return (
    <>
      {/* ✅ CTA FLOTANTE */}
      <div className="fixed bottom-6 right-6 max-w-sm bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 animate-slide-up">
        {ctaConfig.urgencia && (
          <div className="bg-red-500 text-white text-center py-2 px-4 rounded-t-lg">
            <div className="flex items-center justify-center space-x-2 text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>{ctaConfig.urgencia}</span>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">{ctaConfig.titulo}</h4>
              <p className="text-sm text-gray-600 mb-4">{ctaConfig.descripcion}</p>
              
              {/* Indicadores de valor */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>+2.847 usuarios</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>87% adopción</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setCTAActivo(null)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModalAbierto(ctaActivo)}
              className={`flex-1 ${colorClasses[ctaConfig.color as keyof typeof colorClasses]} text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
            >
              <span>{ctaConfig.accion}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {/* Acciones rápidas */}
            <div className="flex space-x-2">
              <button 
                onClick={() => onConversion('contacto_rapido', { tipo: 'telefono', audiencia })}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Llamada rápida"
              >
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => onConversion('contacto_rapido', { tipo: 'email', audiencia })}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Email directo"
              >
                <Mail className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ MODAL: Formulario de conversión */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{ctaConfig.titulo}</h3>
                  <p className="text-gray-600 mt-1">{ctaConfig.descripcion}</p>
                </div>
                <button 
                  onClick={() => setModalAbierto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <FormularioConversion tipoCTA={modalAbierto} />
            </div>
            
            {/* Footer con garantías */}
            <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Respuesta en 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Demo personalizada</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Sin compromiso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}