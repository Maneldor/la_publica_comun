'use client'

import { 
  FileText, Bot, Users, Building2, Plus, Edit, Eye, Copy, 
  Download, Share2, Send, Zap, Target, Brain, CheckCircle, 
  Clock, Star, Award, Settings, RefreshCw, Save, Sparkles,
  TrendingUp, DollarSign, Calendar, User, Mail, Phone
} from 'lucide-react'
import { useState } from 'react'

interface Cliente {
  id: string
  nombre: string
  tipo: 'empresa_privada' | 'administracion_publica'
  contacto: {
    nombre: string
    email: string
    telefono: string
    cargo: string
  }
  empresa: {
    nombre: string
    sector: string
    empleados: number
    presupuesto: number
    ubicacion: string
  }
  necesidades: string[]
  puntosDolor: string[]
  objetivos: string[]
  presupuestoEstimado: number
  tiempoDecision: string
  competencia: string[]
  historialInteracciones: string[]
}

interface PlantillaPropuesta {
  id: string
  nombre: string
  descripcion: string
  tipoCliente: 'empresa_privada' | 'administracion_publica' | 'ambos'
  categoria: 'basica' | 'intermedia' | 'avanzada' | 'premium'
  secciones: {
    id: string
    titulo: string
    tipo: 'texto' | 'lista' | 'tabla' | 'grafico' | 'precios'
    contenido: string
    variables: string[]
    obligatoria: boolean
  }[]
  configuracion: {
    logoEmpresa: boolean
    firmaDigital: boolean
    validezOferta: number // días
    condicionesPago: string[]
    clausulasEspeciales: string[]
  }
  estadisticas: {
    usosTotal: number
    tasaExito: number
    tiempoMedioGeneracion: number // minutos
    valorMedioProyectos: number
  }
}

interface PropuestaGenerada {
  id: string
  cliente: Cliente
  plantilla: PlantillaPropuesta
  titulo: string
  fechaCreacion: Date
  fechaExpiracion: Date
  estado: 'borrador' | 'enviada' | 'vista' | 'aceptada' | 'rechazada' | 'expirada'
  valorTotal: number
  contenidoGenerado: {
    resumenEjecutivo: string
    analisisNecesidades: string
    solucionPropuesta: string
    beneficiosROI: string
    cronogramaImplementacion: string
    presupuestoDetallado: string
    terminosCondiciones: string
  }
  personalizaciones: {
    seccionId: string
    contenidoOriginal: string
    contenidoPersonalizado: string
  }[]
  metricas: {
    tiempoVisualizacion: number
    seccionesVistas: string[]
    interacciones: {
      tipo: 'view' | 'download' | 'share' | 'comment'
      fecha: Date
      duracion?: number
    }[]
  }
  comentariosCliente: {
    seccion: string
    comentario: string
    fecha: Date
    resuelto: boolean
  }[]
}

interface GeneradorPropuestasProps {
  clientes: Cliente[]
  plantillas: PlantillaPropuesta[]
  propuestasExistentes: PropuestaGenerada[]
  onCrearPropuesta: (propuesta: PropuestaGenerada) => void
  onActualizarPropuesta: (propuesta: PropuestaGenerada) => void
  onEnviarPropuesta: (propuesta: PropuestaGenerada) => void
}

export default function GeneradorPropuestas({ 
  clientes, 
  plantillas, 
  propuestasExistentes,
  onCrearPropuesta,
  onActualizarPropuesta,
  onEnviarPropuesta
}: GeneradorPropuestasProps) {
  const [vistaActiva, setVistaActiva] = useState<'lista' | 'generador' | 'editor'>('lista')
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  
  // Estados del generador
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<PlantillaPropuesta | null>(null)
  const [propuestaEnEdicion, setPropuestaEnEdicion] = useState<PropuestaGenerada | null>(null)
  const [generandoPropuesta, setGenerandoPropuesta] = useState(false)
  
  // Configuración del generador
  const [configuracionGenerador, setConfiguracionGenerador] = useState({
    incluirAnalisisCompetencia: true,
    incluirCasosExito: true,
    incluirTestimonios: true,
    nivelDetalle: 'intermedio' as 'basico' | 'intermedio' | 'avanzado',
    enfoqueVenta: 'consultivo' as 'directo' | 'consultivo' | 'tecnico'
  })

  const propuestasFiltradas = propuestasExistentes.filter(p => {
    if (filtroEstado !== 'todas' && p.estado !== filtroEstado) return false
    if (filtroTipo !== 'todos' && p.cliente.tipo !== filtroTipo) return false
    return true
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'borrador': return 'bg-gray-100 text-gray-800'
      case 'enviada': return 'bg-blue-100 text-blue-800'
      case 'vista': return 'bg-purple-100 text-purple-800'
      case 'aceptada': return 'bg-green-100 text-green-800'
      case 'rechazada': return 'bg-red-100 text-red-800'
      case 'expirada': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'borrador': return <Edit className="w-4 h-4" />
      case 'enviada': return <Send className="w-4 h-4" />
      case 'vista': return <Eye className="w-4 h-4" />
      case 'aceptada': return <CheckCircle className="w-4 h-4" />
      case 'rechazada': return <Eye className="w-4 h-4" />
      case 'expirada': return <Clock className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const generatePropuestaIA = async () => {
    if (!clienteSeleccionado || !plantillaSeleccionada) return

    setGenerandoPropuesta(true)

    // Simulación de generación con IA (en realidad sería una llamada a API)
    setTimeout(() => {
      const nuevaPropuesta: PropuestaGenerada = {
        id: Date.now().toString(),
        cliente: clienteSeleccionado,
        plantilla: plantillaSeleccionada,
        titulo: `Proposta per ${clienteSeleccionado.empresa.nombre} - Solucions IA`,
        fechaCreacion: new Date(),
        fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        estado: 'borrador',
        valorTotal: clienteSeleccionado.presupuestoEstimado,
        contenidoGenerado: {
          resumenEjecutivo: `Proposta integral de solucions d'Intel·ligència Artificial per a ${clienteSeleccionado.empresa.nombre}, dissenyada per optimitzar els processos operatius i incrementar l'eficiència en un ${clienteSeleccionado.empresa.sector} amb ${clienteSeleccionado.empresa.empleados} empleats.`,
          analisisNecesidades: `Anàlisi detallat de necessitats: ${clienteSeleccionado.necesidades.join(', ')}. Punts de dolor identificats: ${clienteSeleccionado.puntosDolor.join(', ')}.`,
          solucionPropuesta: `Solució personalitzada que inclou implementació de sistemes d'IA adaptats al sector ${clienteSeleccionado.empresa.sector}, amb especial atenció als objectius: ${clienteSeleccionado.objetivos.join(', ')}.`,
          beneficiosROI: `ROI estimat del 250% en els primers 18 mesos, amb estalvis operacionals de fins al 40% i millora de productivitat del 60%.`,
          cronogramaImplementacion: `Implementació en 3 fases durant 6 mesos, amb entregables cada 6 setmanes i suport continu durant el primer any.`,
          presupuestoDetallado: `Pressupost detallat per fases, amb cost total de €${clienteSeleccionado.presupuestoEstimado.toLocaleString()}, inclou llicències, implementació i formació.`,
          terminosCondiciones: `Condicions de pagament flexibles, garantia de 12 mesos, suport 24/7 i formació inclosa per a l'equip tècnic.`
        },
        personalizaciones: [],
        metricas: {
          tiempoVisualizacion: 0,
          seccionesVistas: [],
          interacciones: []
        },
        comentariosCliente: []
      }

      onCrearPropuesta(nuevaPropuesta)
      setPropuestaEnEdicion(nuevaPropuesta)
      setVistaActiva('editor')
      setGenerandoPropuesta(false)
    }, 3000) // Simular tiempo de generación
  }

  const estadisticas = {
    totalPropuestas: propuestasExistentes.length,
    propuestasEnviadas: propuestasExistentes.filter(p => p.estado !== 'borrador').length,
    propuestasAceptadas: propuestasExistentes.filter(p => p.estado === 'aceptada').length,
    tasaConversion: propuestasExistentes.length > 0 ? Math.round((propuestasExistentes.filter(p => p.estado === 'aceptada').length / propuestasExistentes.filter(p => p.estado !== 'borrador').length) * 100) || 0 : 0,
    valorTotalPropuestas: propuestasExistentes.reduce((acc, p) => acc + p.valorTotal, 0),
    tiempoMedioGeneracion: 12 // minutos
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Propostes</p>
              <p className="text-2xl font-bold">{estadisticas.totalPropuestas}</p>
              <p className="text-xs text-blue-200">Generated</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Taxa Conversió</p>
              <p className="text-2xl font-bold">{estadisticas.tasaConversion}%</p>
              <p className="text-xs text-green-200">Win rate</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Valor Total</p>
              <p className="text-2xl font-bold">€{Math.round(estadisticas.valorTotalPropuestas / 1000)}K</p>
              <p className="text-xs text-purple-200">Pipeline</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Temps Mitjà</p>
              <p className="text-2xl font-bold">{estadisticas.tiempoMedioGeneracion}min</p>
              <p className="text-xs text-orange-200">Generació IA</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Acceptades</p>
              <p className="text-2xl font-bold">{estadisticas.propuestasAceptadas}</p>
              <p className="text-xs text-indigo-200">Aquest mes</p>
            </div>
            <CheckCircle className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">IA Powered</p>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-xs text-teal-200">Automatització</p>
            </div>
            <Bot className="w-8 h-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Controles principales */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaActiva('lista')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  vistaActiva === 'lista' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Llistat Propostes
              </button>
              <button
                onClick={() => setVistaActiva('generador')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  vistaActiva === 'generador' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Bot className="w-4 h-4 inline mr-2" />
                Generador IA
              </button>
            </div>

            {vistaActiva === 'lista' && (
              <>
                <select 
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="todas">Tots els estats</option>
                  <option value="borrador">Esborranys</option>
                  <option value="enviada">Enviades</option>
                  <option value="vista">Vistes</option>
                  <option value="aceptada">Acceptades</option>
                  <option value="rechazada">Rebutjades</option>
                </select>

                <select 
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="todos">Tots els clients</option>
                  <option value="empresa_privada">Empresa Privada</option>
                  <option value="administracion_publica">Admin. Pública</option>
                </select>
              </>
            )}
          </div>

          {vistaActiva === 'lista' && (
            <button 
              onClick={() => setVistaActiva('generador')}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Nova Proposta IA
            </button>
          )}
        </div>
      </div>

      {/* Vista lista de propuestas */}
      {vistaActiva === 'lista' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Proposta</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Client</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Valor</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Estat</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Creada</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Expira</th>
                <th className="text-left p-3 text-xs font-semibold text-gray-900">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {propuestasFiltradas.map((propuesta) => (
                <tr key={propuesta.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{propuesta.titulo}</div>
                      <div className="text-xs text-gray-500">Plantilla: {propuesta.plantilla.nombre}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-sm">{propuesta.cliente.empresa.nombre}</div>
                      <div className="text-xs text-gray-500">{propuesta.cliente.contacto.nombre}</div>
                      <div className="text-xs text-gray-400">{propuesta.cliente.contacto.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-sm">€{propuesta.valorTotal.toLocaleString()}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getEstadoIcon(propuesta.estado)}
                      <span className={`text-xs px-2 py-1 rounded ${getEstadoColor(propuesta.estado)}`}>
                        {propuesta.estado}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">{propuesta.fechaCreacion.toLocaleDateString('ca-ES')}</div>
                  </td>
                  <td className="p-3">
                    <div className={`text-sm ${
                      new Date(propuesta.fechaExpiracion) < new Date() ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {propuesta.fechaExpiracion.toLocaleDateString('ca-ES')}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setPropuestaEnEdicion(propuesta)
                          setVistaActiva('editor')
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Veure"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800"
                        title="Descarregar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {propuesta.estado === 'borrador' && (
                        <button 
                          onClick={() => onEnviarPropuesta(propuesta)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Enviar"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generador IA */}
      {vistaActiva === 'generador' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Selección de cliente */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Seleccionar Client
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clientes.map((cliente) => (
                <div 
                  key={cliente.id}
                  onClick={() => setClienteSeleccionado(cliente)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    clienteSeleccionado?.id === cliente.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{cliente.empresa.nombre}</div>
                      <div className="text-xs text-gray-600">{cliente.contacto.nombre} • {cliente.contacto.cargo}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cliente.tipo === 'empresa_privada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {cliente.tipo === 'empresa_privada' ? 'Privada' : 'Pública'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pressupost: €{cliente.presupuestoEstimado.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Sector: {cliente.empresa.sector} • {cliente.empresa.empleados} empleats
                  </div>
                  {clienteSeleccionado?.id === cliente.id && (
                    <CheckCircle className="w-4 h-4 text-indigo-600 absolute top-2 right-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selección de plantilla */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Plantilla
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {plantillas
                .filter(p => !clienteSeleccionado || p.tipoCliente === clienteSeleccionado.tipo || p.tipoCliente === 'ambos')
                .map((plantilla) => (
                <div 
                  key={plantilla.id}
                  onClick={() => setPlantillaSeleccionada(plantilla)}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    plantillaSeleccionada?.id === plantilla.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{plantilla.nombre}</div>
                      <div className="text-xs text-gray-600">{plantilla.descripcion}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      plantilla.categoria === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                      plantilla.categoria === 'avanzada' ? 'bg-red-100 text-red-800' :
                      plantilla.categoria === 'intermedia' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {plantilla.categoria}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{plantilla.secciones.length} seccions</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{plantilla.estadisticas.tasaExito}% èxit</span>
                    </div>
                  </div>
                  {plantillaSeleccionada?.id === plantilla.id && (
                    <CheckCircle className="w-4 h-4 text-purple-600 absolute top-2 right-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuración y generación */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-green-600" />
              Configuració IA
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivell de Detall</label>
                <select 
                  value={configuracionGenerador.nivelDetalle}
                  onChange={(e) => setConfiguracionGenerador({...configuracionGenerador, nivelDetalle: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="basico">Bàsic</option>
                  <option value="intermedio">Intermig</option>
                  <option value="avanzado">Avançat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enfocament de Venda</label>
                <select 
                  value={configuracionGenerador.enfoqueVenta}
                  onChange={(e) => setConfiguracionGenerador({...configuracionGenerador, enfoqueVenta: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="directo">Directe</option>
                  <option value="consultivo">Consultiu</option>
                  <option value="tecnico">Tècnic</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={configuracionGenerador.incluirAnalisisCompetencia}
                    onChange={(e) => setConfiguracionGenerador({...configuracionGenerador, incluirAnalisisCompetencia: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Anàlisi competència</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={configuracionGenerador.incluirCasosExito}
                    onChange={(e) => setConfiguracionGenerador({...configuracionGenerador, incluirCasosExito: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Casos d'èxit</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={configuracionGenerador.incluirTestimonios}
                    onChange={(e) => setConfiguracionGenerador({...configuracionGenerador, incluirTestimonios: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Testimonis</span>
                </label>
              </div>
            </div>

            {/* Información seleccionada */}
            {(clienteSeleccionado || plantillaSeleccionada) && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="text-xs text-gray-600 space-y-1">
                  {clienteSeleccionado && (
                    <div>✓ Client: {clienteSeleccionado.empresa.nombre}</div>
                  )}
                  {plantillaSeleccionada && (
                    <div>✓ Plantilla: {plantillaSeleccionada.nombre}</div>
                  )}
                </div>
              </div>
            )}

            <button 
              onClick={generatePropuestaIA}
              disabled={!clienteSeleccionado || !plantillaSeleccionada || generandoPropuesta}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {generandoPropuesta ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generant amb IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar Proposta IA
                </>
              )}
            </button>

            {generandoPropuesta && (
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600 mb-2">Proces de generació</div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <div className="text-xs text-gray-500 mt-1">Analitzant dades del client i personalitzant contingut...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor de propuesta */}
      {vistaActiva === 'editor' && propuestaEnEdicion && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{propuestaEnEdicion.titulo}</h2>
              <p className="text-sm text-gray-600">
                Client: {propuestaEnEdicion.cliente.empresa.nombre} • 
                Valor: €{propuestaEnEdicion.valorTotal.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button 
                onClick={() => onEnviarPropuesta(propuestaEnEdicion)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Proposta
              </button>
              <button 
                onClick={() => setVistaActiva('lista')}
                className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
              >
                Tancar
              </button>
            </div>
          </div>

          {/* Contenido de la propuesta */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Resum Executiu</h3>
              <textarea 
                value={propuestaEnEdicion.contenidoGenerado.resumenEjecutivo}
                onChange={(e) => setPropuestaEnEdicion({
                  ...propuestaEnEdicion,
                  contenidoGenerado: {
                    ...propuestaEnEdicion.contenidoGenerado,
                    resumenEjecutivo: e.target.value
                  }
                })}
                className="w-full p-3 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Anàlisi de Necessitats</h3>
              <textarea 
                value={propuestaEnEdicion.contenidoGenerado.analisisNecesidades}
                onChange={(e) => setPropuestaEnEdicion({
                  ...propuestaEnEdicion,
                  contenidoGenerado: {
                    ...propuestaEnEdicion.contenidoGenerado,
                    analisisNecesidades: e.target.value
                  }
                })}
                className="w-full p-3 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Solució Proposada</h3>
              <textarea 
                value={propuestaEnEdicion.contenidoGenerado.solucionPropuesta}
                onChange={(e) => setPropuestaEnEdicion({
                  ...propuestaEnEdicion,
                  contenidoGenerado: {
                    ...propuestaEnEdicion.contenidoGenerado,
                    solucionPropuesta: e.target.value
                  }
                })}
                className="w-full p-3 border border-gray-300 rounded text-sm"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Beneficis i ROI</h3>
                <textarea 
                  value={propuestaEnEdicion.contenidoGenerado.beneficiosROI}
                  onChange={(e) => setPropuestaEnEdicion({
                    ...propuestaEnEdicion,
                    contenidoGenerado: {
                      ...propuestaEnEdicion.contenidoGenerado,
                      beneficiosROI: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded text-sm"
                  rows={3}
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Cronograma</h3>
                <textarea 
                  value={propuestaEnEdicion.contenidoGenerado.cronogramaImplementacion}
                  onChange={(e) => setPropuestaEnEdicion({
                    ...propuestaEnEdicion,
                    contenidoGenerado: {
                      ...propuestaEnEdicion.contenidoGenerado,
                      cronogramaImplementacion: e.target.value
                    }
                  })}
                  className="w-full p-3 border border-gray-300 rounded text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}