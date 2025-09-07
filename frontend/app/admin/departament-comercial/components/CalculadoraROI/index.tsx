'use client'

import { 
  Calculator, Building2, Users, TrendingUp, DollarSign, Clock, 
  CheckCircle, AlertCircle, FileText, Download, Share2, 
  BarChart3, PieChart, LineChart, Target, Zap, Award,
  ArrowRight, ArrowUp, ArrowDown, RefreshCw, Save
} from 'lucide-react'
import { useState } from 'react'

interface ParametrosAdministracion {
  tipoEntidad: 'ayuntamiento' | 'diputacion' | 'consejeria' | 'organismo_autonomo'
  numeroEmpleados: number
  presupuestoAnual: number
  gastosIT: number
  procesosDigitalizados: number
  procesosTotal: number
  ciudadanosServidos: number
  tramitesAnuales: number
  tiempoMedioTramite: number // minutos
  costoMedioEmpleadoHora: number
  nivelDigitalizacion: 'bajo' | 'medio' | 'alto'
  sectoresPrioritarios: string[]
}

interface SolucionIA {
  id: string
  nombre: string
  descripcion: string
  tipoSolucion: 'automatizacion_tramites' | 'chatbot_ciudadanos' | 'analisis_datos' | 'gestion_recursos' | 'seguridad' | 'prediccion_demanda'
  costoImplementacion: number
  costoMensual: number
  tiempoImplementacion: number // meses
  ahorros: {
    reduccionTiempoTramites: number // %
    reduccionPersonalNecesario: number // %
    mejoraSatisfaccionCiudadana: number // %
    reduccionErrores: number // %
    ahorroEnergiaRecursos: number // %
  }
  beneficios: {
    aumentoProductividad: number // %
    mejorTransparencia: number // %
    reduccionTiemposEspera: number // %
    mayorAccesibilidad: number // %
  }
  riesgos: {
    probabilidadFallo: number // %
    costoMantenimiento: number // % del costo inicial
    necesidadFormacion: 'baja' | 'media' | 'alta'
    resistenciaCambio: 'baja' | 'media' | 'alta'
  }
  requisitosTecnicos: string[]
  impactoRegulatorio: string[]
  certificacionesNecesarias: string[]
}

interface ResultadoROI {
  roiAnual: number
  roiTreasAños: number
  roiCincoAños: number
  ahorroAnual: number
  costoTotalImplementacion: number
  tiempoRecuperacionInversion: number // meses
  beneficiosNoMonetarios: string[]
  riesgosIdentificados: string[]
  recomendaciones: string[]
  detalleAhorros: {
    reduccionCostoPersonal: number
    ahorroTiempo: number
    reduccionErrores: number
    eficienciaEnergetica: number
    otros: number
  }
  impactoSocial: {
    ciudadanosBeneficiados: number
    mejoraTiempoRespuesta: number // %
    incrementoSatisfaccion: number // %
    reduccionDesplazamientos: number // %
  }
}

interface CalculadoraROIProps {
  solucionesDisponibles: SolucionIA[]
  onGenerarInforme: (parametros: ParametrosAdministracion, soluciones: SolucionIA[], resultado: ResultadoROI) => void
}

export default function CalculadoraROI({ solucionesDisponibles, onGenerarInforme }: CalculadoraROIProps) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [parametros, setParametros] = useState<ParametrosAdministracion>({
    tipoEntidad: 'ayuntamiento',
    numeroEmpleados: 100,
    presupuestoAnual: 5000000,
    gastosIT: 200000,
    procesosDigitalizados: 20,
    procesosTotal: 100,
    ciudadanosServidos: 50000,
    tramitesAnuales: 10000,
    tiempoMedioTramite: 30,
    costoMedioEmpleadoHora: 25,
    nivelDigitalizacion: 'medio',
    sectoresPrioritarios: []
  })
  
  const [solucionesSeleccionadas, setSolucionesSeleccionadas] = useState<SolucionIA[]>([])
  const [resultadoROI, setResultadoROI] = useState<ResultadoROI | null>(null)
  const [mostrandoComparativa, setMostrandoComparativa] = useState(false)

  const calcularROI = () => {
    let costoTotalImplementacion = solucionesSeleccionadas.reduce((acc, sol) => acc + sol.costoImplementacion, 0)
    let costoMensualTotal = solucionesSeleccionadas.reduce((acc, sol) => acc + sol.costoMensual, 0)
    let costoAnualTotal = costoMensualTotal * 12

    // Cálculo de ahorros
    let ahorroPersonal = 0
    let ahorroTiempo = 0
    let ahorroErrores = 0
    let ahorroEnergia = 0

    solucionesSeleccionadas.forEach(solucion => {
      // Ahorro en personal
      const reduccionPersonal = (parametros.numeroEmpleados * solucion.ahorros.reduccionPersonalNecesario) / 100
      ahorroPersonal += reduccionPersonal * parametros.costoMedioEmpleadoHora * 8 * 250 // 250 días laborables

      // Ahorro en tiempo de tramitación
      const tramitesAfectados = parametros.tramitesAnuales * 0.3 // Asumimos que cada solución afecta 30% de trámites
      const minutosAhorradosPorTramite = (parametros.tiempoMedioTramite * solucion.ahorros.reduccionTiempoTramites) / 100
      const horasAhorradasAnuales = (tramitesAfectados * minutosAhorradosPorTramite) / 60
      ahorroTiempo += horasAhorradasAnuales * parametros.costoMedioEmpleadoHora

      // Ahorro por reducción de errores
      ahorroErrores += (parametros.gastosIT * 0.15 * solucion.ahorros.reduccionErrores) / 100

      // Ahorro energético
      ahorroEnergia += (parametros.gastosIT * 0.1 * solucion.ahorros.ahorroEnergiaRecursos) / 100
    })

    const ahorroAnualTotal = ahorroPersonal + ahorroTiempo + ahorroErrores + ahorroEnergia
    const beneficioNetoAnual = ahorroAnualTotal - costoAnualTotal

    // ROI calculations
    const roiAnual = ((beneficioNetoAnual) / costoTotalImplementacion) * 100
    const roiTreasAños = (((ahorroAnualTotal * 3) - (costoAnualTotal * 3) - costoTotalImplementacion) / costoTotalImplementacion) * 100
    const roiCincoAños = (((ahorroAnualTotal * 5) - (costoAnualTotal * 5) - costoTotalImplementacion) / costoTotalImplementacion) * 100

    // Tiempo de recuperación
    const tiempoRecuperacion = costoTotalImplementacion / (beneficioNetoAnual > 0 ? (beneficioNetoAnual / 12) : 1)

    // Impacto social
    const ciudadanosBeneficiados = Math.round(parametros.ciudadanosServidos * 0.7)
    const mejoraTiempoRespuesta = solucionesSeleccionadas.reduce((acc, sol) => acc + sol.ahorros.reduccionTiempoTramites, 0) / solucionesSeleccionadas.length
    const incrementoSatisfaccion = solucionesSeleccionadas.reduce((acc, sol) => acc + sol.ahorros.mejoraSatisfaccionCiudadana, 0) / solucionesSeleccionadas.length

    const resultado: ResultadoROI = {
      roiAnual: Math.round(roiAnual),
      roiTreasAños: Math.round(roiTreasAños),
      roiCincoAños: Math.round(roiCincoAños),
      ahorroAnual: Math.round(ahorroAnualTotal),
      costoTotalImplementacion: Math.round(costoTotalImplementacion),
      tiempoRecuperacionInversion: Math.round(tiempoRecuperacion),
      beneficiosNoMonetarios: [
        'Millora de la transparència administrativa',
        'Major accessibilitat per a ciutadans amb discapacitat',
        'Reducció de la petjada de carboni',
        'Millora de la imatge institucional'
      ],
      riesgosIdentificados: [
        'Resistència al canvi per part dels empleats',
        'Necessitat de formació contínua',
        'Dependència tecnològica',
        'Possibles problemes de ciberseguretat'
      ],
      recomendaciones: [
        'Implementació gradual per fases',
        'Pla de formació intensiu',
        'Monitorització contínua de resultats',
        'Avaluació trimestral dels beneficis'
      ],
      detalleAhorros: {
        reduccionCostoPersonal: Math.round(ahorroPersonal),
        ahorroTiempo: Math.round(ahorroTiempo),
        reduccionErrores: Math.round(ahorroErrores),
        eficienciaEnergetica: Math.round(ahorroEnergia),
        otros: 0
      },
      impactoSocial: {
        ciudadanosBeneficiados,
        mejoraTiempoRespuesta: Math.round(mejoraTiempoRespuesta),
        incrementoSatisfaccion: Math.round(incrementoSatisfaccion),
        reduccionDesplazamientos: 35
      }
    }

    setResultadoROI(resultado)
    setPaso(3)
  }

  const getTipoEntidadLabel = (tipo: string) => {
    switch (tipo) {
      case 'ayuntamiento': return 'Ajuntament'
      case 'diputacion': return 'Diputació'
      case 'consejeria': return 'Conselleria'
      case 'organismo_autonomo': return 'Organisme Autònom'
      default: return tipo
    }
  }

  const getSolucionIcon = (tipo: string) => {
    switch (tipo) {
      case 'automatizacion_tramites': return <FileText className="w-5 h-5" />
      case 'chatbot_ciudadanos': return <Users className="w-5 h-5" />
      case 'analisis_datos': return <BarChart3 className="w-5 h-5" />
      case 'gestion_recursos': return <Target className="w-5 h-5" />
      case 'seguridad': return <AlertCircle className="w-5 h-5" />
      case 'prediccion_demanda': return <TrendingUp className="w-5 h-5" />
      default: return <Zap className="w-5 h-5" />
    }
  }

  const getSolucionColor = (tipo: string) => {
    switch (tipo) {
      case 'automatizacion_tramites': return 'text-blue-600 bg-blue-100'
      case 'chatbot_ciudadanos': return 'text-green-600 bg-green-100'
      case 'analisis_datos': return 'text-purple-600 bg-purple-100'
      case 'gestion_recursos': return 'text-orange-600 bg-orange-100'
      case 'seguridad': return 'text-red-600 bg-red-100'
      case 'prediccion_demanda': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-600" />
            Calculadora ROI per Administració Pública
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4" />
            Especialitzat en sector públic espanyol
          </div>
        </div>

        {/* Progreso */}
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso >= stepNum 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && <ArrowRight className="w-4 h-4 mx-3 text-gray-400" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Paràmetres Entitat</span>
          <span>Selecció Solucions</span>
          <span>Resultats ROI</span>
        </div>
      </div>

      {/* Paso 1: Parámetros de la entidad */}
      {paso === 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-6">Paràmetres de l'Entitat</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipus d'Entitat</label>
                <select 
                  value={parametros.tipoEntidad}
                  onChange={(e) => setParametros({...parametros, tipoEntidad: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="ayuntamiento">Ajuntament</option>
                  <option value="diputacion">Diputació</option>
                  <option value="consejeria">Conselleria</option>
                  <option value="organismo_autonomo">Organisme Autònom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número d'Empleats</label>
                <input 
                  type="number"
                  value={parametros.numeroEmpleados}
                  onChange={(e) => setParametros({...parametros, numeroEmpleados: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pressupost Anual (€)</label>
                <input 
                  type="number"
                  value={parametros.presupuestoAnual}
                  onChange={(e) => setParametros({...parametros, presupuestoAnual: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gastos IT Anuals (€)</label>
                <input 
                  type="number"
                  value={parametros.gastosIT}
                  onChange={(e) => setParametros({...parametros, gastosIT: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Mitjà Empleat/Hora (€)</label>
                <input 
                  type="number"
                  value={parametros.costoMedioEmpleadoHora}
                  onChange={(e) => setParametros({...parametros, costoMedioEmpleadoHora: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciutadans Servits</label>
                <input 
                  type="number"
                  value={parametros.ciudadanosServidos}
                  onChange={(e) => setParametros({...parametros, ciudadanosServidos: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tràmits Anuals</label>
                <input 
                  type="number"
                  value={parametros.tramitesAnuales}
                  onChange={(e) => setParametros({...parametros, tramitesAnuales: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temps Mitjà Tràmit (minuts)</label>
                <input 
                  type="number"
                  value={parametros.tiempoMedioTramite}
                  onChange={(e) => setParametros({...parametros, tiempoMedioTramite: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Processos Digitalitzats / Total</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number"
                    value={parametros.procesosDigitalizados}
                    onChange={(e) => setParametros({...parametros, procesosDigitalizados: parseInt(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                  <input 
                    type="number"
                    value={parametros.procesosTotal}
                    onChange={(e) => setParametros({...parametros, procesosTotal: parseInt(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivell de Digitalització</label>
                <select 
                  value={parametros.nivelDigitalizacion}
                  onChange={(e) => setParametros({...parametros, nivelDigitalizacion: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="bajo">Baix (&lt;30% processos)</option>
                  <option value="medio">Mitjà (30-70% processos)</option>
                  <option value="alto">Alt (&gt;70% processos)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button 
              onClick={() => setPaso(2)}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Següent: Seleccionar Solucions
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Selección de soluciones */}
      {paso === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Selecció de Solucions d'IA</h3>
              <div className="text-sm text-gray-600">
                Seleccionades: {solucionesSeleccionadas.length} / {solucionesDisponibles.length}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {solucionesDisponibles.map((solucion) => (
                <div 
                  key={solucion.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    solucionesSeleccionadas.find(s => s.id === solucion.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const isSelected = solucionesSeleccionadas.find(s => s.id === solucion.id)
                    if (isSelected) {
                      setSolucionesSeleccionadas(prev => prev.filter(s => s.id !== solucion.id))
                    } else {
                      setSolucionesSeleccionadas(prev => [...prev, solucion])
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getSolucionColor(solucion.tipoSolucion)}`}>
                        {getSolucionIcon(solucion.tipoSolucion)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{solucion.nombre}</h4>
                        <p className="text-sm text-gray-600">{solucion.descripcion}</p>
                      </div>
                    </div>
                    {solucionesSeleccionadas.find(s => s.id === solucion.id) && (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cost implementació:</span>
                      <div className="font-medium">€{solucion.costoImplementacion.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Cost mensual:</span>
                      <div className="font-medium">€{solucion.costoMensual.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Implementació: {solucion.tiempoImplementacion} mesos</span>
                    <span className="text-green-600 font-medium">
                      -{solucion.ahorros.reduccionTiempoTramites}% temps tràmits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              onClick={() => setPaso(1)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Anterior
            </button>
            <button 
              onClick={calcularROI}
              disabled={solucionesSeleccionadas.length === 0}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Calcular ROI
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Resultados ROI */}
      {paso === 3 && resultadoROI && (
        <div className="space-y-6">
          {/* Métricas principales ROI */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">ROI 5 Anys</p>
                  <p className="text-2xl font-bold">{resultadoROI.roiCincoAños}%</p>
                  <p className="text-xs text-green-200">Retorn d'inversió</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Estalvi Anual</p>
                  <p className="text-2xl font-bold">€{Math.round(resultadoROI.ahorroAnual / 1000)}K</p>
                  <p className="text-xs text-blue-200">Benefici net</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Inversió Total</p>
                  <p className="text-2xl font-bold">€{Math.round(resultadoROI.costoTotalImplementacion / 1000)}K</p>
                  <p className="text-xs text-purple-200">Cost inicial</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Payback</p>
                  <p className="text-2xl font-bold">{resultadoROI.tiempoRecuperacionInversion}</p>
                  <p className="text-xs text-orange-200">mesos</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>

          {/* Desglose de ahorros */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Desglos d'Estalvis Anuals</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-sm font-medium">Reducció Cost Personal</span>
                  <span className="font-bold text-green-600">€{resultadoROI.detalleAhorros.reduccionCostoPersonal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Estalvi en Temps</span>
                  <span className="font-bold text-blue-600">€{resultadoROI.detalleAhorros.ahorroTiempo.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                  <span className="text-sm font-medium">Reducció d'Errors</span>
                  <span className="font-bold text-purple-600">€{resultadoROI.detalleAhorros.reduccionErrores.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                  <span className="text-sm font-medium">Eficiència Energètica</span>
                  <span className="font-bold text-orange-600">€{resultadoROI.detalleAhorros.eficienciaEnergetica.toLocaleString()}</span>
                </div>
              </div>

              {/* Impacto social */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Impacte Social</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ciutadans beneficiats:</span>
                    <span className="font-medium">{resultadoROI.impactoSocial.ciudadanosBeneficiados.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Millora temps resposta:</span>
                    <span className="font-medium text-green-600">-{resultadoROI.impactoSocial.mejoraTiempoRespuesta}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Increment satisfacció:</span>
                    <span className="font-medium text-blue-600">+{resultadoROI.impactoSocial.incrementoSatisfaccion}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reducció desplaçaments:</span>
                    <span className="font-medium text-purple-600">-{resultadoROI.impactoSocial.reduccionDesplazamientos}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios no monetarios y riesgos */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-700">Beneficis No Monetaris</h3>
              <ul className="space-y-2">
                {resultadoROI.beneficiosNoMonetarios.map((beneficio, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-700">Riscos Identificats</h3>
              <ul className="space-y-2">
                {resultadoROI.riesgosIdentificados.map((riesgo, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <span className="text-sm">{riesgo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-900">Recomanacions d'Implementació</h3>
            <ul className="grid grid-cols-2 gap-3">
              {resultadoROI.recomendaciones.map((recomendacion, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <span className="text-sm text-indigo-800">{recomendacion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Acciones */}
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setPaso(2)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recalcular
            </button>

            <div className="flex gap-3">
              <button 
                onClick={() => onGenerarInforme(parametros, solucionesSeleccionadas, resultadoROI)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generar Informe
              </button>
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descarregar PDF
              </button>
              <button 
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}