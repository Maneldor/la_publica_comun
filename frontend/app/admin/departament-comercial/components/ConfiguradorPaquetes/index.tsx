'use client'

import { 
  Package, Bot, Users, Cog, Plus, Edit, Eye, Copy, Trash2, 
  CheckCircle, AlertCircle, Zap, Target, Calculator, Star,
  Brain, Briefcase, Building2, Settings, Save, RefreshCw
} from 'lucide-react'
import { useState } from 'react'

interface ComponenteIA {
  id: string
  nombre: string
  tipo: 'analisis_datos' | 'automatizacion_procesos' | 'chatbot' | 'prediccion' | 'optimizacion' | 'seguridad'
  descripcion: string
  complejidad: 'baixa' | 'mitjana' | 'alta'
  tiempoImplementacion: number // en semanas
  costeDesarrollo: number
  costeMensual: number
  prerequisitos: string[]
  compatibilidadSectores: ('empresa_privada' | 'administracion_publica' | 'ambos')[]
  metricas: {
    ahorroTiempo: number // horas/mes
    mejoraProcesos: number // % mejora
    roiEsperado: number // % ROI anual
  }
}

interface ServicioGestor {
  id: string
  nombre: string
  tipo: 'gestor_empresa' | 'gestor_ia'
  descripcion: string
  especialidades: string[]
  horasMensuales: number
  costeMensual: number
  disponibilidadSectores: ('empresa_privada' | 'administracion_publica' | 'ambos')[]
  certificaciones: string[]
  experienciaMinima: number // años
  serviciosIncluidos: string[]
}

interface PaquetePersonalizado {
  id: string
  nombre: string
  descripcion: string
  tipoCliente: 'empresa_privada' | 'administracion_publica' | 'ambos'
  componentesIA: {
    componenteId: string
    configuracion: Record<string, any>
    prioridad: number
  }[]
  serviciosGestor: {
    servicioId: string
    horasAsignadas: number
    especialidadRequerida: string[]
  }[]
  precioTotal: number
  precioMensual: number
  tiempoImplementacion: number
  nivelComplejidad: 'baixa' | 'mitjana' | 'alta'
  roiEstimado: number
  ahorrosEstimados: {
    tiempo: number
    coste: number
    productividad: number
  }
  requisitos: string[]
  garantias: string[]
  soporte: {
    nivel: 'basic' | 'premium' | 'enterprise'
    horasIncluidas: number
    tiempoRespuesta: string
  }
  metricas: {
    satisfaccionEsperada: number
    probabilidadExito: number
    riesgosIdentificados: string[]
  }
}

interface ConfiguradorPaquetesProps {
  componentesIA: ComponenteIA[]
  serviciosGestor: ServicioGestor[]
  paquetesExistentes: PaquetePersonalizado[]
  onCreatePaquete: (paquete: PaquetePersonalizado) => void
  onUpdatePaquete: (paquete: PaquetePersonalizado) => void
  onDeletePaquete: (id: string) => void
}

export default function ConfiguradorPaquetes({ 
  componentesIA, 
  serviciosGestor, 
  paquetesExistentes,
  onCreatePaquete,
  onUpdatePaquete,
  onDeletePaquete
}: ConfiguradorPaquetesProps) {
  const [modoVista, setModoVista] = useState<'lista' | 'configurador'>('lista')
  const [paqueteEnEdicion, setPaqueteEnEdicion] = useState<PaquetePersonalizado | null>(null)
  const [componentesSeleccionados, setComponentesSeleccionados] = useState<ComponenteIA[]>([])
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioGestor[]>([])
  const [tipoClienteSeleccionado, setTipoClienteSeleccionado] = useState<'empresa_privada' | 'administracion_publica' | 'ambos'>('empresa_privada')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroComplejidad, setFiltroComplejidad] = useState<string>('todas')

  const [configuracionPaquete, setConfiguracionPaquete] = useState({
    nombre: '',
    descripcion: '',
    nivelSoporte: 'premium' as 'basic' | 'premium' | 'enterprise'
  })

  const paquetesFiltrados = paquetesExistentes.filter(p => {
    if (filtroTipo !== 'todos' && p.tipoCliente !== filtroTipo) return false
    if (filtroComplejidad !== 'todas' && p.nivelComplejidad !== filtroComplejidad) return false
    return true
  })

  const calcularPrecioTotal = () => {
    const costoIA = componentesSeleccionados.reduce((acc, comp) => acc + comp.costeDesarrollo, 0)
    const costoMensualIA = componentesSeleccionados.reduce((acc, comp) => acc + comp.costeMensual, 0)
    const costoGestores = serviciosSeleccionados.reduce((acc, serv) => acc + serv.costeMensual, 0)
    
    return {
      inicial: costoIA,
      mensual: costoMensualIA + costoGestores
    }
  }

  const calcularROIEstimado = () => {
    const ahorroTiempo = componentesSeleccionados.reduce((acc, comp) => acc + comp.metricas.ahorroTiempo, 0)
    const mejoraProcesos = componentesSeleccionados.reduce((acc, comp) => acc + comp.metricas.mejoraProcesos, 0) / componentesSeleccionados.length || 0
    const roiPromedio = componentesSeleccionados.reduce((acc, comp) => acc + comp.metricas.roiEsperado, 0) / componentesSeleccionados.length || 0
    
    return {
      ahorroTiempo,
      mejoraProcesos,
      roiPromedio
    }
  }

  const calcularComplejidad = (): 'baixa' | 'mitjana' | 'alta' => {
    const complejidades = componentesSeleccionados.map(c => c.complejidad)
    if (complejidades.includes('alta')) return 'alta'
    if (complejidades.includes('mitjana')) return 'mitjana'
    return 'baixa'
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'analisis_datos': return <Brain className="w-4 h-4" />
      case 'automatizacion_procesos': return <Cog className="w-4 h-4" />
      case 'chatbot': return <Bot className="w-4 h-4" />
      case 'prediccion': return <Target className="w-4 h-4" />
      case 'optimizacion': return <Zap className="w-4 h-4" />
      case 'seguridad': return <AlertCircle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const getComplejidadColor = (complejidad: string) => {
    switch (complejidad) {
      case 'baixa': return 'text-green-600 bg-green-100'
      case 'mitjana': return 'text-yellow-600 bg-yellow-100'
      case 'alta': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const crearPaquetePersonalizado = () => {
    const precios = calcularPrecioTotal()
    const roi = calcularROIEstimado()
    const complejidad = calcularComplejidad()
    
    const nuevoPaquete: PaquetePersonalizado = {
      id: Date.now().toString(),
      nombre: configuracionPaquete.nombre,
      descripcion: configuracionPaquete.descripcion,
      tipoCliente: tipoClienteSeleccionado,
      componentesIA: componentesSeleccionados.map((comp, i) => ({
        componenteId: comp.id,
        configuracion: {},
        prioridad: i + 1
      })),
      serviciosGestor: serviciosSeleccionados.map((serv, i) => ({
        servicioId: serv.id,
        horasAsignadas: serv.horasMensuales,
        especialidadRequerida: serv.especialidades
      })),
      precioTotal: precios.inicial,
      precioMensual: precios.mensual,
      tiempoImplementacion: Math.max(...componentesSeleccionados.map(c => c.tiempoImplementacion), 4),
      nivelComplejidad: complejidad,
      roiEstimado: roi.roiPromedio,
      ahorrosEstimados: {
        tiempo: roi.ahorroTiempo,
        coste: Math.round(precios.mensual * 0.3),
        productividad: roi.mejoraProcesos
      },
      requisitos: componentesSeleccionados.flatMap(c => c.prerequisitos),
      garantias: [
        'Implementació en temps acordat',
        'Suport tècnic 24/7',
        'Formació inclosa',
        'Garantia de satisfacció'
      ],
      soporte: {
        nivel: configuracionPaquete.nivelSoporte,
        horasIncluidas: configuracionPaquete.nivelSoporte === 'basic' ? 10 : 
                       configuracionPaquete.nivelSoporte === 'premium' ? 25 : 50,
        tiempoRespuesta: configuracionPaquete.nivelSoporte === 'enterprise' ? '1h' : 
                        configuracionPaquete.nivelSoporte === 'premium' ? '4h' : '24h'
      },
      metricas: {
        satisfaccionEsperada: 4.2,
        probabilidadExito: 85,
        riesgosIdentificados: []
      }
    }
    
    onCreatePaquete(nuevoPaquete)
    
    // Reset form
    setComponentesSeleccionados([])
    setServiciosSeleccionados([])
    setConfiguracionPaquete({ nombre: '', descripcion: '', nivelSoporte: 'premium' })
    setModoVista('lista')
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setModoVista('lista')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                modoVista === 'lista' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Paquets Existents
            </button>
            <button
              onClick={() => setModoVista('configurador')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                modoVista === 'configurador' 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Cog className="w-4 h-4 inline mr-2" />
              Configurador Intel·ligent
            </button>
          </div>

          {modoVista === 'lista' && (
            <>
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="todos">Tots els tipus</option>
                <option value="empresa_privada">Empresa Privada</option>
                <option value="administracion_publica">Admin. Pública</option>
                <option value="ambos">Ambdós</option>
              </select>

              <select 
                value={filtroComplejidad}
                onChange={(e) => setFiltroComplejidad(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="todas">Totes les complexitats</option>
                <option value="baixa">Baixa</option>
                <option value="mitjana">Mitjana</option>
                <option value="alta">Alta</option>
              </select>
            </>
          )}
        </div>

        {modoVista === 'lista' && (
          <button 
            onClick={() => setModoVista('configurador')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Crear Paquet Personalitzat
          </button>
        )}
      </div>

      {/* Vista lista de paquetes */}
      {modoVista === 'lista' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paquetesFiltrados.map((paquete) => (
            <div key={paquete.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{paquete.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">{paquete.descripcion}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  paquete.tipoCliente === 'empresa_privada' ? 'bg-green-100 text-green-800' :
                  paquete.tipoCliente === 'administracion_publica' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {paquete.tipoCliente === 'ambos' ? 'Universal' : 
                   paquete.tipoCliente === 'empresa_privada' ? 'Empresa' : 'Admin. Pública'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preu inicial:</span>
                  <span className="font-bold text-green-600">€{paquete.precioTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preu mensual:</span>
                  <span className="font-medium">€{paquete.precioMensual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI estimat:</span>
                  <span className="font-medium text-blue-600">{paquete.roiEstimado}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Implementació:</span>
                  <span className="font-medium">{paquete.tiempoImplementacion} setmanes</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getComplejidadColor(paquete.nivelComplejidad)}`}>
                  {paquete.nivelComplejidad} complexitat
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{paquete.metricas.satisfaccionEsperada}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-600">Components IA: {paquete.componentesIA.length}</div>
                <div className="text-xs text-gray-600">Serveis Gestor: {paquete.serviciosGestor.length}</div>
                <div className="text-xs text-gray-600">
                  Estalvi temps: {paquete.ahorrosEstimados.tiempo}h/mes
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button 
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Veure detalls"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-800"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeletePaquete(paquete.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  paquete.soporte.nivel === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                  paquete.soporte.nivel === 'premium' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {paquete.soporte.nivel} support
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configurador intel·ligent */}
      {modoVista === 'configurador' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Configuració básica */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-lg mb-4">Configuració Bàsica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom del Paquet</label>
                  <input 
                    type="text"
                    value={configuracionPaquete.nombre}
                    onChange={(e) => setConfiguracionPaquete({...configuracionPaquete, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Ex: Paquet IA Administració"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripció</label>
                  <textarea 
                    value={configuracionPaquete.descripcion}
                    onChange={(e) => setConfiguracionPaquete({...configuracionPaquete, descripcion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Descripció del paquet personalitzat..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipus de Client</label>
                  <select 
                    value={tipoClienteSeleccionado}
                    onChange={(e) => setTipoClienteSeleccionado(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="empresa_privada">Empresa Privada</option>
                    <option value="administracion_publica">Administració Pública</option>
                    <option value="ambos">Ambdós</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivell de Suport</label>
                  <select 
                    value={configuracionPaquete.nivelSoporte}
                    onChange={(e) => setConfiguracionPaquete({...configuracionPaquete, nivelSoporte: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="basic">Bàsic (10h/mes)</option>
                    <option value="premium">Premium (25h/mes)</option>
                    <option value="enterprise">Enterprise (50h/mes)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resum y pricing */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">Resum del Paquet</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Components IA:</span>
                  <span className="font-medium">{componentesSeleccionados.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Serveis Gestor:</span>
                  <span className="font-medium">{serviciosSeleccionados.length}</span>
                </div>
                <div className="border-t border-indigo-400 pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Preu inicial:</span>
                    <span className="font-bold">€{calcularPrecioTotal().inicial.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preu mensual:</span>
                    <span className="font-bold">€{calcularPrecioTotal().mensual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI estimat:</span>
                    <span className="font-bold">{calcularROIEstimado().roiPromedio.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={crearPaquetePersonalizado}
                disabled={componentesSeleccionados.length === 0 || !configuracionPaquete.nombre}
                className="w-full mt-4 bg-white text-indigo-600 px-4 py-2 rounded font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Crear Paquet
              </button>
            </div>
          </div>

          {/* Components IA */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4">Components d'IA</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {componentesIA
                .filter(comp => comp.compatibilidadSectores.includes(tipoClienteSeleccionado) || comp.compatibilidadSectores.includes('ambos'))
                .map((componente) => (
                <div 
                  key={componente.id}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    componentesSeleccionados.find(c => c.id === componente.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const isSelected = componentesSeleccionados.find(c => c.id === componente.id)
                    if (isSelected) {
                      setComponentesSeleccionados(prev => prev.filter(c => c.id !== componente.id))
                    } else {
                      setComponentesSeleccionados(prev => [...prev, componente])
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(componente.tipo)}
                      <span className="font-medium text-sm">{componente.nombre}</span>
                    </div>
                    {componentesSeleccionados.find(c => c.id === componente.id) && (
                      <CheckCircle className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{componente.descripcion}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded ${getComplejidadColor(componente.complejidad)}`}>
                      {componente.complejidad}
                    </span>
                    <div className="text-right">
                      <div className="font-medium">€{componente.costeMensual}/mes</div>
                      <div className="text-gray-500">{componente.tiempoImplementacion}w impl.</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Serveis Gestor */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-lg mb-4">Serveis de Gestor</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {serviciosGestor
                .filter(serv => serv.disponibilidadSectores.includes(tipoClienteSeleccionado) || serv.disponibilidadSectores.includes('ambos'))
                .map((servicio) => (
                <div 
                  key={servicio.id}
                  className={`p-3 border rounded cursor-pointer transition-all ${
                    serviciosSeleccionados.find(s => s.id === servicio.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const isSelected = serviciosSeleccionados.find(s => s.id === servicio.id)
                    if (isSelected) {
                      setServiciosSeleccionados(prev => prev.filter(s => s.id !== servicio.id))
                    } else {
                      setServiciosSeleccionados(prev => [...prev, servicio])
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {servicio.tipo === 'gestor_empresa' ? <Briefcase className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      <span className="font-medium text-sm">{servicio.nombre}</span>
                    </div>
                    {serviciosSeleccionados.find(s => s.id === servicio.id) && (
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{servicio.descripcion}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded ${
                      servicio.tipo === 'gestor_empresa' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {servicio.tipo === 'gestor_empresa' ? 'Empresa' : 'IA'}
                    </span>
                    <div className="text-right">
                      <div className="font-medium">€{servicio.costeMensual}/mes</div>
                      <div className="text-gray-500">{servicio.horasMensuales}h/mes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}