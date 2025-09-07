'use client'

import { 
  Calendar, Clock, CheckCircle, AlertTriangle, DollarSign, Users, 
  TrendingUp, RefreshCw, Eye, Edit, Send, Plus, Filter, Search,
  ArrowUp, ArrowDown, Target, Star, Award
} from 'lucide-react'
import { useState } from 'react'

interface Cliente {
  id: string
  nombre: string
  empresa: string
  tipo: 'empresa_privada' | 'administracion_publica'
  email: string
  telefono: string
  gestorAsignado: string
  fechaContratacion: Date
  valorContrato: number
  servicios: string[]
  satisfaccion: number
}

interface Renovacion {
  id: string
  cliente: Cliente
  fechaVencimiento: Date
  valorActual: number
  valorPropuesto: number
  estado: 'pendiente' | 'en_negociacion' | 'renovada' | 'perdida' | 'cancelada'
  probabilidadRenovacion: number
  motivosCancelacion?: string[]
  nuevosServicios?: string[]
  observaciones: string
  fechaUltimoContacto: Date
  diasParaVencimiento: number
  historialRenovaciones: number
  tendenciaSatisfaccion: 'positiva' | 'negativa' | 'estable'
}

interface RenovacionesProps {
  leads: any[]
  comerciales: any[]
}

export default function Renovaciones({ leads, comerciales }: RenovacionesProps) {
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroDias, setFiltroDias] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [renovacionSeleccionada, setRenovacionSeleccionada] = useState<Renovacion | null>(null)

  // Datos mock de renovaciones
  const [renovaciones] = useState<Renovacion[]>([
    {
      id: '1',
      cliente: {
        id: '1',
        nombre: 'Maria González',
        empresa: 'Ajuntament de Barcelona',
        tipo: 'administracion_publica',
        email: 'maria.gonzalez@bcn.cat',
        telefono: '+34 932 123 456',
        gestorAsignado: 'Anna Puig',
        fechaContratacion: new Date('2023-02-15'),
        valorContrato: 75000,
        servicios: ['Chatbot IA', 'Automatización trámites', 'Soporte 24/7'],
        satisfaccion: 4.2
      },
      fechaVencimiento: new Date('2024-02-15'),
      valorActual: 75000,
      valorPropuesto: 85000,
      estado: 'en_negociacion',
      probabilidadRenovacion: 78,
      nuevosServicios: ['Analytics avanzado', 'IA predictiva'],
      observaciones: 'Muy satisfechos con el servicio actual. Interesados en expandir funcionalidades.',
      fechaUltimoContacto: new Date('2024-01-25'),
      diasParaVencimiento: 21,
      historialRenovaciones: 1,
      tendenciaSatisfaccion: 'positiva'
    },
    {
      id: '2',
      cliente: {
        id: '2',
        nombre: 'Jordi Martínez',
        empresa: 'TechCorp Solutions',
        tipo: 'empresa_privada',
        email: 'j.martinez@techcorp.es',
        telefono: '+34 933 456 789',
        gestorAsignado: 'Marc Vila',
        fechaContratacion: new Date('2023-05-10'),
        valorContrato: 45000,
        servicios: ['CRM personalizado', 'IA ventas', 'Integración API'],
        satisfaccion: 3.8
      },
      fechaVencimiento: new Date('2024-05-10'),
      valorActual: 45000,
      valorPropuesto: 52000,
      estado: 'pendiente',
      probabilidadRenovacion: 65,
      observaciones: 'Evaluando ROI actual. Requieren más datos de rendimiento.',
      fechaUltimoContacto: new Date('2024-01-20'),
      diasParaVencimiento: 109,
      historialRenovaciones: 0,
      tendenciaSatisfaccion: 'estable'
    },
    {
      id: '3',
      cliente: {
        id: '3',
        nombre: 'Carmen López',
        empresa: 'Diputació de Girona',
        tipo: 'administracion_publica',
        email: 'c.lopez@girona.cat',
        telefono: '+34 972 987 654',
        gestorAsignado: 'Anna Puig',
        fechaContratacion: new Date('2023-01-20'),
        valorContrato: 120000,
        servicios: ['Plataforma IA completa', 'Consultoría', 'Formación'],
        satisfaccion: 4.6
      },
      fechaVencimiento: new Date('2024-01-20'),
      valorActual: 120000,
      valorPropuesto: 135000,
      estado: 'renovada',
      probabilidadRenovacion: 100,
      nuevosServicios: ['Machine Learning avanzado', 'Dashboard ejecutivo'],
      observaciones: 'Renovación exitosa con servicios adicionales.',
      fechaUltimoContacto: new Date('2024-01-15'),
      diasParaVencimiento: -11,
      historialRenovaciones: 1,
      tendenciaSatisfaccion: 'positiva'
    }
  ])

  const renovacionesFiltradas = renovaciones.filter(r => {
    if (filtroEstado !== 'todas' && r.estado !== filtroEstado) return false
    if (filtroTipo !== 'todos' && r.cliente.tipo !== filtroTipo) return false
    if (filtroDias !== 'todos') {
      const dias = r.diasParaVencimiento
      if (filtroDias === 'vencidas' && dias >= 0) return false
      if (filtroDias === '30_dias' && (dias < 0 || dias > 30)) return false
      if (filtroDias === '60_dias' && (dias < 30 || dias > 60)) return false
      if (filtroDias === '90_dias' && (dias < 60 || dias > 90)) return false
    }
    if (busqueda && !r.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) && 
        !r.cliente.empresa.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'en_negociacion': return 'bg-blue-100 text-blue-800'
      case 'renovada': return 'bg-green-100 text-green-800'
      case 'perdida': return 'bg-red-100 text-red-800'
      case 'cancelada': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <Clock className="w-4 h-4" />
      case 'en_negociacion': return <RefreshCw className="w-4 h-4" />
      case 'renovada': return <CheckCircle className="w-4 h-4" />
      case 'perdida': return <AlertTriangle className="w-4 h-4" />
      case 'cancelada': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPrioridadColor = (dias: number) => {
    if (dias < 0) return 'text-red-600 bg-red-100'
    if (dias <= 30) return 'text-orange-600 bg-orange-100'
    if (dias <= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const estadisticas = {
    totalRenovaciones: renovaciones.length,
    pendientes: renovaciones.filter(r => r.estado === 'pendiente').length,
    enNegociacion: renovaciones.filter(r => r.estado === 'en_negociacion').length,
    renovadas: renovaciones.filter(r => r.estado === 'renovada').length,
    valorTotal: renovaciones.reduce((acc, r) => acc + r.valorPropuesto, 0),
    tasaRenovacion: renovaciones.length > 0 ? Math.round((renovaciones.filter(r => r.estado === 'renovada').length / renovaciones.length) * 100) : 0
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Renovacions</p>
              <p className="text-2xl font-bold">{estadisticas.totalRenovaciones}</p>
              <p className="text-xs text-blue-200">Contractes</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pendents</p>
              <p className="text-2xl font-bold">{estadisticas.pendientes}</p>
              <p className="text-xs text-yellow-200">A gestionar</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Negociació</p>
              <p className="text-2xl font-bold">{estadisticas.enNegociacion}</p>
              <p className="text-xs text-purple-200">En procés</p>
            </div>
            <RefreshCw className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Renovades</p>
              <p className="text-2xl font-bold">{estadisticas.renovadas}</p>
              <p className="text-xs text-green-200">Tancades</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Taxa Renovació</p>
              <p className="text-2xl font-bold">{estadisticas.tasaRenovacion}%</p>
              <p className="text-xs text-indigo-200">Èxit</p>
            </div>
            <Target className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Valor Total</p>
              <p className="text-2xl font-bold">€{Math.round(estadisticas.valorTotal / 1000)}K</p>
              <p className="text-xs text-orange-200">Pipeline</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todas">Tots els estats</option>
              <option value="pendiente">Pendents</option>
              <option value="en_negociacion">En negociació</option>
              <option value="renovada">Renovades</option>
              <option value="perdida">Perdudes</option>
              <option value="cancelada">Cancel·lades</option>
            </select>

            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Tots els tipus</option>
              <option value="empresa_privada">Empresa Privada</option>
              <option value="administracion_publica">Admin. Pública</option>
            </select>

            <select 
              value={filtroDias}
              onChange={(e) => setFiltroDias(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="todos">Tots els terminis</option>
              <option value="vencidas">Vençudes</option>
              <option value="30_dias">Pròxims 30 dies</option>
              <option value="60_dias">30-60 dies</option>
              <option value="90_dias">60-90 dies</option>
            </select>

            <div className="relative">
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar client..." 
                className="pl-8 pr-4 py-2 border border-gray-300 rounded text-sm w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {renovacionesFiltradas.length} de {renovaciones.length} renovacions
          </div>
        </div>
      </div>

      {/* Tabla de renovaciones */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Client</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Tipus</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Valor Actual</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Valor Proposat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Venciment</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Probabilitat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Estat</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Satisfacció</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-900">Accions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {renovacionesFiltradas.map((renovacion) => (
              <tr key={renovacion.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{renovacion.cliente.nombre}</div>
                    <div className="text-xs text-gray-500">{renovacion.cliente.empresa}</div>
                    <div className="text-xs text-gray-400">{renovacion.cliente.gestorAsignado}</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    renovacion.cliente.tipo === 'administracion_publica' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {renovacion.cliente.tipo === 'administracion_publica' ? 'Pública' : 'Privada'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium">€{renovacion.valorActual.toLocaleString()}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium text-green-600">€{renovacion.valorPropuesto.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">
                    +€{(renovacion.valorPropuesto - renovacion.valorActual).toLocaleString()}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{renovacion.fechaVencimiento.toLocaleDateString('ca-ES')}</div>
                  <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${getPrioridadColor(renovacion.diasParaVencimiento)}`}>
                    {renovacion.diasParaVencimiento < 0 
                      ? `Vençuda fa ${Math.abs(renovacion.diasParaVencimiento)} dies`
                      : `${renovacion.diasParaVencimiento} dies`
                    }
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${renovacion.probabilidadRenovacion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{renovacion.probabilidadRenovacion}%</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(renovacion.estado)}
                    <span className={`text-xs px-2 py-1 rounded ${getEstadoColor(renovacion.estado)}`}>
                      {renovacion.estado.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{renovacion.cliente.satisfaccion}</span>
                    <div className="flex items-center gap-1 ml-1">
                      {renovacion.tendenciaSatisfaccion === 'positiva' ? (
                        <ArrowUp className="w-3 h-3 text-green-600" />
                      ) : renovacion.tendenciaSatisfaccion === 'negativa' ? (
                        <ArrowDown className="w-3 h-3 text-red-600" />
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setRenovacionSeleccionada(renovacion)}
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
                      title="Contactar"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de detalls de renovación seleccionada */}
      {renovacionSeleccionada && (
        <div className="bg-white rounded-lg border border-indigo-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{renovacionSeleccionada.cliente.empresa}</h3>
              <p className="text-sm text-gray-600">{renovacionSeleccionada.cliente.nombre} • {renovacionSeleccionada.cliente.email}</p>
              <p className="text-sm text-indigo-600">Gestor: {renovacionSeleccionada.cliente.gestorAsignado}</p>
            </div>
            <button 
              onClick={() => setRenovacionSeleccionada(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Informació Contracte</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contractació:</span>
                  <span className="font-medium">{renovacionSeleccionada.cliente.fechaContratacion.toLocaleDateString('ca-ES')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor actual:</span>
                  <span className="font-medium">€{renovacionSeleccionada.valorActual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor proposat:</span>
                  <span className="font-medium text-green-600">€{renovacionSeleccionada.valorPropuesto.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Increment:</span>
                  <span className="font-medium text-green-600">
                    +€{(renovacionSeleccionada.valorPropuesto - renovacionSeleccionada.valorActual).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Serveis Actuals</h4>
              <div className="space-y-2">
                {renovacionSeleccionada.cliente.servicios.map((servicio, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {servicio}
                  </div>
                ))}
              </div>
              
              {renovacionSeleccionada.nuevosServicios && renovacionSeleccionada.nuevosServicios.length > 0 && (
                <>
                  <h4 className="font-medium text-sm text-blue-900 mt-4">Nous Serveis Proposats</h4>
                  <div className="space-y-2">
                    {renovacionSeleccionada.nuevosServicios.map((servicio, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-blue-800">
                        <Plus className="w-3 h-3 text-blue-600" />
                        {servicio}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Estat de la Renovació</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Probabilitat:</span>
                  <span className="font-medium">{renovacionSeleccionada.probabilidadRenovacion}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Satisfacció:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{renovacionSeleccionada.cliente.satisfaccion}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Últim contacte:</span>
                  <span className="font-medium">{renovacionSeleccionada.fechaUltimoContacto.toLocaleDateString('ca-ES')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Renovacions:</span>
                  <span className="font-medium">{renovacionSeleccionada.historialRenovaciones}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Observacions</h4>
            <p className="text-sm text-gray-600">{renovacionSeleccionada.observaciones}</p>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
              Programar seguiment
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Crear proposta
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Marcar com renovada
            </button>
          </div>
        </div>
      )}
    </div>
  )
}