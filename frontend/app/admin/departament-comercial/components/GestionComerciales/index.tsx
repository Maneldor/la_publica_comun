'use client'

import { 
  Users, Bot, Target, TrendingUp, Award, Plus, Edit, Eye, 
  MessageSquare, Calendar, Phone, Mail, BarChart3, Settings,
  Clock, CheckCircle, AlertTriangle, Star, ArrowUp, ArrowDown,
  MapPin, BookOpen, DollarSign, Activity, UserPlus, AlertCircle,
  Trophy, Brain, Send, Filter, Download, ChevronDown, X,
  School, CreditCard, MessageCircle, Shield, Zap, TrendingDown
} from 'lucide-react'
import { useState } from 'react'

interface Territorio {
  comunidadAutonoma: string
  provincias: string[]
  sectores: string[]
  leadsAsignados: number
  leadsActivos: number
  ventasTotales: number
  potencialMercado: number
}

interface MaterialFormacion {
  id: string
  titulo: string
  tipo: 'video' | 'documento' | 'quiz' | 'webinar' | 'curso'
  duracion: string
  completado: boolean
  progreso: number
  categoria: 'producto' | 'ventas' | 'tecnico' | 'soft-skills'
  obligatorio: boolean
  fechaLimite?: Date
}

interface PagoComision {
  id: string
  periodo: string
  base: number
  variable: number
  bonus: number
  total: number
  estado: 'pendiente' | 'procesando' | 'pagado'
  fechaPago?: Date
  detalles: {
    ventas: number
    objetivoCumplido: number
    bonusExtra: number
  }
}

interface ConflictoTerritorio {
  id: string
  tipo: 'solapamiento' | 'disputa' | 'reasignacion'
  territoriosAfectados: string[]
  comercialesInvolucrados: string[]
  estado: 'abierto' | 'en_revision' | 'resuelto'
  prioridad: 'baja' | 'media' | 'alta'
  fechaReporte: Date
  resolucion?: string
}

interface ConcursoComercial {
  id: string
  nombre: string
  tipo: 'individual' | 'equipo'
  periodo: string
  premio: string
  participantes: number
  lider: string
  miPosicion?: number
  metricas: {
    nombre: string
    valor: number
    objetivo: number
  }[]
  estado: 'activo' | 'finalizado'
}

interface Comercial {
  id: string
  nombre: string
  email: string
  telefono: string
  tipo: 'senior' | 'junior' | 'trainee'
  especialidad: 'empresa' | 'administracion' | 'mixta'
  territorio: {
    comunidadesAutonomas: string[]
    provincias: string[]
    sectores: string[]
  }
  rendimiento: {
    ventasMes: number
    ventasAnterior: number
    objetivoMes: number
    conversion: number
    leadsAsignados: number
    leadsActivos: number
    satisfaccionCliente: number
    tiempoCicloVenta: number
  }
  formacion: {
    nivelOnboarding: number
    cursosCompletados: number
    certificaciones: string[]
    proximaFormacion: string
    horasFormacion: number
  }
  comisiones: {
    estructura: {
      base: number
      variable: number
      bonus: number
    }
    pagosHistoricos: PagoComision[]
    proyeccionMes: number
  }
  colaboracion: {
    mensajesEquipo: number
    practicasCompartidas: number
    mentoring: boolean
    puntuacionColaboracion: number
  }
  gamificacion: {
    puntos: number
    nivel: string
    badges: string[]
    posicionRanking: number
    concursosGanados: number
  }
  forecasting: {
    prediccionMes: number
    confianza: number
    desviacionPromedio: number
    tendencia: 'alcista' | 'bajista' | 'estable'
  }
  estado: 'activo' | 'formacion' | 'baja' | 'vacaciones'
}

export default function GestionComerciales() {
  const [comerciales, setComerciales] = useState<Comercial[]>([])
  const [selectedComercial, setSelectedComercial] = useState<Comercial | null>(null)
  const [activeTab, setActiveTab] = useState('todos')
  const [showModalTerritorios, setShowModalTerritorios] = useState(false)
  const [showModalFormacion, setShowModalFormacion] = useState(false)
  const [showModalComisiones, setShowModalComisiones] = useState(false)
  const [showModalAnalytics, setShowModalAnalytics] = useState(false)
  const [showModalColaboracion, setShowModalColaboracion] = useState(false)
  const [showModalConflictos, setShowModalConflictos] = useState(false)
  const [showModalGamificacion, setShowModalGamificacion] = useState(false)
  const [showModalForecasting, setShowModalForecasting] = useState(false)
  const [filtroTerritorio, setFiltroTerritorio] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const comercialesMock: Comercial[] = [
    {
      id: '1',
      nombre: 'Maria Garcia',
      email: 'maria.garcia@lapublica.cat',
      telefono: '+34 666 123 456',
      tipo: 'senior',
      especialidad: 'empresa',
      territorio: {
        comunidadesAutonomas: ['Catalunya', 'Aragó'],
        provincias: ['Barcelona', 'Girona', 'Zaragoza'],
        sectores: ['Tecnologia', 'Industria', 'Serveis']
      },
      rendimiento: {
        ventasMes: 125000,
        ventasAnterior: 98000,
        objetivoMes: 100000,
        conversion: 32,
        leadsAsignados: 45,
        leadsActivos: 28,
        satisfaccionCliente: 4.8,
        tiempoCicloVenta: 21
      },
      formacion: {
        nivelOnboarding: 100,
        cursosCompletados: 24,
        certificaciones: ['Ventas B2B', 'CRM Avanzado', 'Negociación'],
        proximaFormacion: 'Leadership Skills',
        horasFormacion: 120
      },
      comisiones: {
        estructura: {
          base: 2000,
          variable: 15,
          bonus: 1000
        },
        pagosHistoricos: [],
        proyeccionMes: 3875
      },
      colaboracion: {
        mensajesEquipo: 156,
        practicasCompartidas: 12,
        mentoring: true,
        puntuacionColaboracion: 92
      },
      gamificacion: {
        puntos: 2450,
        nivel: 'Platinum',
        badges: ['Top Performer', 'Mentor', 'Innovador'],
        posicionRanking: 2,
        concursosGanados: 3
      },
      forecasting: {
        prediccionMes: 135000,
        confianza: 85,
        desviacionPromedio: 8,
        tendencia: 'alcista'
      },
      estado: 'activo'
    },
    {
      id: '2',
      nombre: 'Jordi Puig',
      email: 'jordi.puig@lapublica.cat',
      telefono: '+34 666 234 567',
      tipo: 'junior',
      especialidad: 'administracion',
      territorio: {
        comunidadesAutonomas: ['Catalunya'],
        provincias: ['Tarragona', 'Lleida'],
        sectores: ['Administració Pública', 'Educació']
      },
      rendimiento: {
        ventasMes: 45000,
        ventasAnterior: 38000,
        objetivoMes: 50000,
        conversion: 18,
        leadsAsignados: 32,
        leadsActivos: 20,
        satisfaccionCliente: 4.5,
        tiempoCicloVenta: 35
      },
      formacion: {
        nivelOnboarding: 75,
        cursosCompletados: 8,
        certificaciones: ['Ventas Básico'],
        proximaFormacion: 'Gestión Administraciones',
        horasFormacion: 45
      },
      comisiones: {
        estructura: {
          base: 1800,
          variable: 10,
          bonus: 500
        },
        pagosHistoricos: [],
        proyeccionMes: 2250
      },
      colaboracion: {
        mensajesEquipo: 89,
        practicasCompartidas: 3,
        mentoring: false,
        puntuacionColaboracion: 75
      },
      gamificacion: {
        puntos: 890,
        nivel: 'Silver',
        badges: ['Rookie', 'Team Player'],
        posicionRanking: 8,
        concursosGanados: 0
      },
      forecasting: {
        prediccionMes: 48000,
        confianza: 70,
        desviacionPromedio: 15,
        tendencia: 'estable'
      },
      estado: 'formacion'
    },
    {
      id: '3',
      nombre: 'Ana Rodríguez',
      email: 'ana.rodriguez@madrid.lapublica.es',
      telefono: '+34 666 345 678',
      tipo: 'senior',
      especialidad: 'mixta',
      territorio: {
        comunidadesAutonomas: ['Madrid', 'Castilla-La Mancha'],
        provincias: ['Madrid', 'Toledo', 'Guadalajara'],
        sectores: ['Todos']
      },
      rendimiento: {
        ventasMes: 180000,
        ventasAnterior: 165000,
        objetivoMes: 150000,
        conversion: 38,
        leadsAsignados: 58,
        leadsActivos: 35,
        satisfaccionCliente: 4.9,
        tiempoCicloVenta: 18
      },
      formacion: {
        nivelOnboarding: 100,
        cursosCompletados: 32,
        certificaciones: ['Ventas B2B', 'B2G Expert', 'Leadership', 'Digital Sales'],
        proximaFormacion: 'AI in Sales',
        horasFormacion: 200
      },
      comisiones: {
        estructura: {
          base: 2200,
          variable: 18,
          bonus: 1500
        },
        pagosHistoricos: [],
        proyeccionMes: 5440
      },
      colaboracion: {
        mensajesEquipo: 234,
        practicasCompartidas: 28,
        mentoring: true,
        puntuacionColaboracion: 98
      },
      gamificacion: {
        puntos: 3680,
        nivel: 'Diamond',
        badges: ['Elite', 'Mentor Gold', 'Innovador', 'Closer'],
        posicionRanking: 1,
        concursosGanados: 5
      },
      forecasting: {
        prediccionMes: 195000,
        confianza: 92,
        desviacionPromedio: 5,
        tendencia: 'alcista'
      },
      estado: 'activo'
    }
  ]

  useState(() => {
    setComerciales(comercialesMock)
  })

  const comunidadesAutonomas = [
    'Catalunya', 'Madrid', 'Andalucía', 'Valencia', 'Galicia', 
    'País Vasco', 'Castilla y León', 'Castilla-La Mancha', 'Aragón',
    'Extremadura', 'Asturias', 'Navarra', 'Murcia', 'Cantabria',
    'La Rioja', 'Baleares', 'Canarias', 'Ceuta', 'Melilla'
  ]

  const materialesFormacion: MaterialFormacion[] = [
    {
      id: '1',
      titulo: 'Onboarding - Introducción a La Pública',
      tipo: 'curso',
      duracion: '4h',
      completado: false,
      progreso: 0,
      categoria: 'producto',
      obligatorio: true,
      fechaLimite: new Date('2024-02-15')
    },
    {
      id: '2',
      titulo: 'Técnicas de Venta B2B',
      tipo: 'video',
      duracion: '2h',
      completado: false,
      progreso: 65,
      categoria: 'ventas',
      obligatorio: true
    },
    {
      id: '3',
      titulo: 'Gestión de Administraciones Públicas',
      tipo: 'documento',
      duracion: '1h',
      completado: true,
      progreso: 100,
      categoria: 'ventas',
      obligatorio: false
    }
  ]

  const conflictosTerritorios: ConflictoTerritorio[] = [
    {
      id: '1',
      tipo: 'solapamiento',
      territoriosAfectados: ['Barcelona', 'Hospitalet'],
      comercialesInvolucrados: ['Maria Garcia', 'Jordi Puig'],
      estado: 'abierto',
      prioridad: 'alta',
      fechaReporte: new Date('2024-01-20')
    },
    {
      id: '2',
      tipo: 'disputa',
      territoriosAfectados: ['Madrid Centro'],
      comercialesInvolucrados: ['Ana Rodríguez', 'Carlos López'],
      estado: 'en_revision',
      prioridad: 'media',
      fechaReporte: new Date('2024-01-18')
    }
  ]

  const concursosActivos: ConcursoComercial[] = [
    {
      id: '1',
      nombre: 'Reto Q1 2024',
      tipo: 'individual',
      periodo: 'Enero - Marzo 2024',
      premio: 'Bonus €2000 + Viaje',
      participantes: 12,
      lider: 'Ana Rodríguez',
      miPosicion: 2,
      metricas: [
        { nombre: 'Ventas Totales', valor: 125000, objetivo: 150000 },
        { nombre: 'Nuevos Clientes', valor: 8, objetivo: 10 },
        { nombre: 'Conversión', valor: 32, objetivo: 30 }
      ],
      estado: 'activo'
    }
  ]

  const calcularDistribucionAutomatica = (comunidad: string) => {
    const leadsDisponibles = Math.floor(Math.random() * 50) + 20
    const comercialesEnTerritorio = comerciales.filter(c => 
      c.territorio.comunidadesAutonomas.includes(comunidad)
    )
    
    if (comercialesEnTerritorio.length === 0) return []
    
    const distribucion = comercialesEnTerritorio.map(comercial => {
      const peso = comercial.tipo === 'senior' ? 1.5 : comercial.tipo === 'junior' ? 1 : 0.7
      const cargaActual = comercial.rendimiento.leadsActivos
      const capacidadRestante = Math.max(0, 50 - cargaActual)
      
      return {
        comercial: comercial.nombre,
        leadsAsignados: Math.floor((leadsDisponibles / comercialesEnTerritorio.length) * peso),
        capacidadRestante,
        prioridad: comercial.rendimiento.conversion
      }
    })
    
    return distribucion.sort((a, b) => b.prioridad - a.prioridad)
  }

  const generarRecomendacionesIA = (comercial: Comercial) => {
    const recomendaciones = []
    
    if (comercial.rendimiento.conversion < 25) {
      recomendaciones.push({
        tipo: 'formacion',
        titulo: 'Mejorar técnicas de cierre',
        descripcion: 'Tu tasa de conversión está por debajo del promedio. Recomendamos el curso "Técnicas Avanzadas de Cierre"',
        impacto: 'Alto'
      })
    }
    
    if (comercial.rendimiento.satisfaccionCliente < 4.5) {
      recomendaciones.push({
        tipo: 'proceso',
        titulo: 'Seguimiento post-venta',
        descripcion: 'Implementar check-ins regulares con clientes para mejorar satisfacción',
        impacto: 'Medio'
      })
    }
    
    if (comercial.colaboracion.puntuacionColaboracion < 80) {
      recomendaciones.push({
        tipo: 'colaboracion',
        titulo: 'Compartir mejores prácticas',
        descripcion: 'Participar más activamente en el canal de equipo y compartir casos de éxito',
        impacto: 'Medio'
      })
    }
    
    return recomendaciones
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Gestió Comercials Avançada
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema integral de gestió d'equips comercials amb IA
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nou Comercial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Equip Total</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{comerciales.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
              {comerciales.filter(c => c.estado === 'activo').length} actius
            </span>
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
              {comerciales.filter(c => c.estado === 'formacion').length} formació
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Vendes Mes</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold">
            €{comerciales.reduce((sum, c) => sum + c.rendimiento.ventasMes, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <ArrowUp className="w-4 h-4" />
            +18% vs mes anterior
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Conversió Mitjana</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">
            {(comerciales.reduce((sum, c) => sum + c.rendimiento.conversion, 0) / comerciales.length).toFixed(1)}%
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(comerciales.reduce((sum, c) => sum + c.rendimiento.conversion, 0) / comerciales.length)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Leads Actius</span>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold">
            {comerciales.reduce((sum, c) => sum + c.rendimiento.leadsActivos, 0)}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            De {comerciales.reduce((sum, c) => sum + c.rendimiento.leadsAsignados, 0)} assignats
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {['todos', 'actius', 'formació', 'top'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowModalTerritorios(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" />
                Territoris
              </button>
              <button 
                onClick={() => setShowModalFormacion(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                Formació
              </button>
              <button 
                onClick={() => setShowModalComisiones(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <DollarSign className="w-4 h-4" />
                Comissions
              </button>
              <button 
                onClick={() => setShowModalGamificacion(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <Trophy className="w-4 h-4" />
                Concursos
              </button>
              <button 
                onClick={() => setShowModalConflictos(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                Conflictes
              </button>
              <button 
                onClick={() => setShowModalColaboracion(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Col·laboració
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {comerciales
              .filter(c => activeTab === 'todos' || 
                (activeTab === 'actius' && c.estado === 'activo') ||
                (activeTab === 'formació' && c.estado === 'formacion') ||
                (activeTab === 'top' && c.gamificacion.posicionRanking <= 3))
              .map(comercial => (
              <div key={comercial.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {comercial.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{comercial.nombre}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          comercial.tipo === 'senior' ? 'bg-purple-100 text-purple-700' :
                          comercial.tipo === 'junior' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {comercial.tipo}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          comercial.estado === 'activo' ? 'bg-green-100 text-green-700' :
                          comercial.estado === 'formacion' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {comercial.estado}
                        </span>
                        {comercial.gamificacion.posicionRanking <= 3 && (
                          <span className="text-yellow-500">
                            {comercial.gamificacion.posicionRanking === 1 && '🥇'}
                            {comercial.gamificacion.posicionRanking === 2 && '🥈'}
                            {comercial.gamificacion.posicionRanking === 3 && '🥉'}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {comercial.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {comercial.telefono}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {comercial.territorio.comunidadesAutonomas.join(', ')}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-6 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Vendes Mes</div>
                          <div className="font-semibold">€{comercial.rendimiento.ventasMes.toLocaleString()}</div>
                          <div className={`text-xs flex items-center gap-1 ${
                            comercial.rendimiento.ventasMes > comercial.rendimiento.ventasAnterior 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {comercial.rendimiento.ventasMes > comercial.rendimiento.ventasAnterior 
                              ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(((comercial.rendimiento.ventasMes - comercial.rendimiento.ventasAnterior) / comercial.rendimiento.ventasAnterior * 100)).toFixed(1)}%
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Objectiu</div>
                          <div className="font-semibold">
                            {((comercial.rendimiento.ventasMes / comercial.rendimiento.objetivoMes) * 100).toFixed(0)}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${
                                comercial.rendimiento.ventasMes >= comercial.rendimiento.objetivoMes 
                                  ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(100, (comercial.rendimiento.ventasMes / comercial.rendimiento.objetivoMes) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Conversió</div>
                          <div className="font-semibold">{comercial.rendimiento.conversion}%</div>
                          <div className="text-xs text-gray-500">
                            {comercial.rendimiento.leadsActivos} leads
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Satisfacció</div>
                          <div className="font-semibold flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {comercial.rendimiento.satisfaccionCliente}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Formació</div>
                          <div className="font-semibold">{comercial.formacion.cursosCompletados} cursos</div>
                          <div className="text-xs text-gray-500">
                            {comercial.formacion.horasFormacion}h total
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500">Predicció</div>
                          <div className="font-semibold flex items-center gap-1">
                            {comercial.forecasting.tendencia === 'alcista' && <TrendingUp className="w-4 h-4 text-green-500" />}
                            {comercial.forecasting.tendencia === 'bajista' && <TrendingDown className="w-4 h-4 text-red-500" />}
                            {comercial.forecasting.tendencia === 'estable' && <Activity className="w-4 h-4 text-gray-500" />}
                            €{comercial.forecasting.prediccionMes.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {comercial.forecasting.confianza}% confiança
                          </div>
                        </div>
                      </div>

                      {comercial.gamificacion.badges.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          {comercial.gamificacion.badges.map(badge => (
                            <span key={badge} className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded text-xs font-medium">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedComercial(comercial)
                        setShowModalAnalytics(true)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedComercial(comercial)
                        setShowModalForecasting(true)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Brain className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Gestió Territoris */}
      {showModalTerritorios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Gestió de Territoris i Distribució Automàtica
              </h2>
              <button onClick={() => setShowModalTerritorios(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Comunitats Autònomes</h3>
                  <div className="space-y-2">
                    {comunidadesAutonomas.slice(0, 10).map(ca => {
                      const comercialesEnCA = comerciales.filter(c => 
                        c.territorio.comunidadesAutonomas.includes(ca)
                      )
                      return (
                        <div key={ca} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                          <span className="font-medium">{ca}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {comercialesEnCA.length} comercials
                            </span>
                            <button 
                              onClick={() => {
                                const distribucion = calcularDistribucionAutomatica(ca)
                                console.log('Distribución automática para', ca, distribucion)
                              }}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              Distribuir Leads
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Distribució Automàtica Intel·ligent</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mode Distribució</span>
                      <select className="px-3 py-1 border rounded">
                        <option>Per capacitat</option>
                        <option>Per rendiment</option>
                        <option>Per especialitat</option>
                        <option>Equilibrat</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Prioritat Senior</span>
                      <input type="range" min="1" max="3" defaultValue="1.5" step="0.1" className="w-24" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Límit per Comercial</span>
                      <input type="number" defaultValue="50" className="w-20 px-2 py-1 border rounded" />
                    </div>

                    <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Aplicar Distribució Global
                    </button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Simulació Distribució</h4>
                    <div className="space-y-2 text-sm">
                      {comerciales.slice(0, 3).map(c => (
                        <div key={c.id} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>{c.nombre}</span>
                          <span className="font-medium">+{Math.floor(Math.random() * 15) + 5} leads</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Mapa de Cobertura</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                  [Visualització Mapa Interactiu de Territoris]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sistema de Formació */}
      {showModalFormacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <School className="w-6 h-6 text-purple-600" />
                Sistema de Formació i Onboarding
              </h2>
              <button onClick={() => setShowModalFormacion(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">24</div>
                  <div className="text-sm text-purple-600">Cursos Disponibles</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">87%</div>
                  <div className="text-sm text-green-600">Taxa Finalització</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">4.6</div>
                  <div className="text-sm text-blue-600">Valoració Mitjana</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Programa Onboarding</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Setmana 1: Coneixement Producte</span>
                        <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded">En curs</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">6 de 10 mòduls completats</div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Setmana 2: Processos de Venda</span>
                        <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded">Pendent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">Començarà el 05/02/2024</div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Setmana 3: Pràctiques amb Mentor</span>
                        <span className="text-sm px-2 py-1 bg-gray-100 text-gray-600 rounded">Pendent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">Mentor assignat: Maria Garcia</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Biblioteca de Materials</h3>
                  <div className="space-y-2">
                    {materialesFormacion.map(material => (
                      <div key={material.id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{material.titulo}</span>
                              {material.obligatorio && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">Obligatori</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span>{material.tipo}</span>
                              <span>{material.duracion}</span>
                              <span className={material.completado ? 'text-green-600' : 'text-gray-500'}>
                                {material.progreso}% completat
                              </span>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                            {material.completado ? 'Revisar' : 'Començar'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-3 w-full py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                    Veure Tots els Materials
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Certificacions Disponibles</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Ventas B2B Avanzado', 'Gestión Sector Público', 'Negociación Estratégica'].map(cert => (
                    <div key={cert} className="border rounded-lg p-3 text-center hover:bg-gray-50">
                      <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                      <div className="font-medium text-sm">{cert}</div>
                      <button className="mt-2 text-xs text-blue-600 hover:underline">Més informació</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comissions i Incentius */}
      {showModalComisiones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Configuració de Comissions i Tracking de Pagaments
              </h2>
              <button onClick={() => setShowModalComisiones(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">€45,280</div>
                  <div className="text-sm text-green-600">Comissions Mes</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">€12,450</div>
                  <div className="text-sm text-blue-600">Bonus Pendents</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">€520,300</div>
                  <div className="text-sm text-purple-600">Total Anual</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">15.2%</div>
                  <div className="text-sm text-orange-600">% Mitjà Variable</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Estructura de Comissions</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Comercial Senior</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Salari Base</span>
                          <input type="number" defaultValue="2000" className="w-24 px-2 py-1 border rounded text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">% Variable (0-100% obj)</span>
                          <input type="number" defaultValue="10" className="w-20 px-2 py-1 border rounded text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">% Variable (100-110% obj)</span>
                          <input type="number" defaultValue="15" className="w-20 px-2 py-1 border rounded text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">&gt;110% objectiu</span>
                          <input type="number" defaultValue="20" className="w-20 px-2 py-1 border rounded text-sm" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bonus Trimestral</span>
                          <input type="number" defaultValue="1500" className="w-24 px-2 py-1 border rounded text-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Incentius Especials</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Bonus nou client estratègic: €500</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Bonus renovació &gt;€50K: €750</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm">Accelerador fi d'any: x1.5</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Historial de Pagaments</h3>
                  <div className="space-y-2">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Gener 2024</div>
                          <div className="text-sm text-gray-600">Base + Variable + Bonus</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">€5,875</div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Pagat</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Desembre 2023</div>
                          <div className="text-sm text-gray-600">Base + Variable + Bonus Extra</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">€7,250</div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Pagat</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Novembre 2023</div>
                          <div className="text-sm text-gray-600">Base + Variable</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">€4,320</div>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Pagat</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium mb-2">Projecció Febrer 2024</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Base</span>
                        <span className="font-medium">€2,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variable (125% objectiu)</span>
                        <span className="font-medium">€2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus nous clients</span>
                        <span className="font-medium">€1,000</span>
                      </div>
                      <div className="border-t pt-1 flex justify-between font-bold">
                        <span>Total Estimat</span>
                        <span className="text-blue-700">€5,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Exportar Informe
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Guardar Configuració
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Analytics Detallats */}
      {showModalAnalytics && selectedComercial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Analytics Detallats - {selectedComercial.nombre}
              </h2>
              <button onClick={() => setShowModalAnalytics(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    {selectedComercial.rendimiento.conversion}%
                  </div>
                  <div className="text-sm text-blue-600">Taxa Conversió</div>
                  <div className="text-xs text-blue-500 mt-1">+5% vs equip</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">
                    €{(selectedComercial.rendimiento.ventasMes / selectedComercial.rendimiento.leadsActivos).toFixed(0)}
                  </div>
                  <div className="text-sm text-green-600">Valor per Lead</div>
                  <div className="text-xs text-green-500 mt-1">Top 20%</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">
                    {selectedComercial.rendimiento.tiempoCicloVenta}d
                  </div>
                  <div className="text-sm text-purple-600">Cicle Venda</div>
                  <div className="text-xs text-purple-500 mt-1">-3d vs mitjana</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">
                    {selectedComercial.rendimiento.satisfaccionCliente}
                  </div>
                  <div className="text-sm text-orange-600">Satisfacció</div>
                  <div className="text-xs text-orange-500 mt-1">95 percentil</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-pink-700">
                    {((selectedComercial.rendimiento.ventasMes / selectedComercial.rendimiento.objetivoMes) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-pink-600">Objectiu</div>
                  <div className="text-xs text-pink-500 mt-1">Superant meta</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Evolució Mensual</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center text-gray-500">
                    [Gràfic de Línies - Vendes vs Objectius últims 12 mesos]
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Comparativa Equip</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center text-gray-500">
                    [Gràfic Radar - Comparació amb mitjana equip]
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Anàlisi per Segment</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Per Sector</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tecnologia</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€65K</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Industria</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€38K</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Serveis</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€22K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Per Tamany Client</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Enterprise (&gt;500)</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€75K</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Mid-Market</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€35K</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">SMB</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <span className="text-sm font-medium">€15K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Per Territori</h4>
                    <div className="space-y-2">
                      {selectedComercial.territorio.comunidadesAutonomas.map(ca => (
                        <div key={ca} className="flex justify-between items-center">
                          <span className="text-sm">{ca}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                            </div>
                            <span className="text-sm font-medium">
                              €{Math.floor(Math.random() * 80 + 20)}K
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Recomanacions IA</h3>
                <div className="grid grid-cols-2 gap-4">
                  {generarRecomendacionesIA(selectedComercial).map((rec, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className={`w-5 h-5 mt-0.5 ${
                          rec.impacto === 'Alto' ? 'text-red-500' :
                          rec.impacto === 'Medio' ? 'text-yellow-500' :
                          'text-green-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900">{rec.titulo}</h4>
                          <p className="text-sm text-blue-700 mt-1">{rec.descripcion}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded ${
                              rec.impacto === 'Alto' ? 'bg-red-100 text-red-700' :
                              rec.impacto === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              Impacte {rec.impacto}
                            </span>
                            <button className="text-xs text-blue-600 hover:underline">
                              Aplicar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sistema de Col·laboració */}
      {showModalColaboracion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Sistema de Col·laboració i Millors Pràctiques
              </h2>
              <button onClick={() => setShowModalColaboracion(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Xat d'Equip</h3>
                  <div className="border rounded-lg h-96 flex flex-col">
                    <div className="flex-1 p-4 space-y-3 overflow-auto bg-gray-50">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">MG</div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-sm">Maria Garcia</div>
                            <div className="text-sm mt-1">Acabo de tancar el deal amb TechCorp! 🎉</div>
                            <div className="text-xs text-gray-500 mt-1">10:30</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">JP</div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-sm">Jordi Puig</div>
                            <div className="text-sm mt-1">Felicitats Maria! Com has gestionat les objeccions de pressupost?</div>
                            <div className="text-xs text-gray-500 mt-1">10:32</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">MG</div>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="font-medium text-sm">Maria Garcia</div>
                            <div className="text-sm mt-1">He utilitzat la tècnica del valor vs cost que vam veure al training. T'ho comparteixo!</div>
                            <div className="text-xs text-gray-500 mt-1">10:35</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t p-3">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Escriu un missatge..."
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Biblioteca de Millors Pràctiques</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Gestió d'Objeccions de Preu</div>
                          <div className="text-sm text-gray-600 mt-1">Per Maria Garcia • 156 visualitzacions</div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Vendes</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">B2B</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">4.8</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Template Email Seguiment</div>
                          <div className="text-sm text-gray-600 mt-1">Per Ana Rodríguez • 89 visualitzacions</div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Templates</span>
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">Email</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">4.6</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Estratègia Sector Públic</div>
                          <div className="text-sm text-gray-600 mt-1">Per Jordi Puig • 234 visualitzacions</div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">B2G</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Estratègia</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">4.9</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="mt-3 w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    + Compartir Nova Pràctica
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Programa de Mentoring</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Mentors Disponibles</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">AR</div>
                          <div>
                            <div className="text-sm font-medium">Ana Rodríguez</div>
                            <div className="text-xs text-gray-500">5 anys exp.</div>
                          </div>
                        </div>
                        <button className="text-xs text-blue-600 hover:underline">Connectar</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">MG</div>
                          <div>
                            <div className="text-sm font-medium">Maria Garcia</div>
                            <div className="text-xs text-gray-500">3 anys exp.</div>
                          </div>
                        </div>
                        <button className="text-xs text-blue-600 hover:underline">Connectar</button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Sessions Programades</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="font-medium">Revisió Pipeline</div>
                        <div className="text-xs text-gray-600">Amb Ana R. • Demà 10:00</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Tècniques Negociació</div>
                        <div className="text-xs text-gray-600">Amb Maria G. • Dv. 15:00</div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Estadístiques Col·laboració</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pràctiques compartides</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Missatges enviats</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessions mentoring</span>
                        <span className="font-medium">8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestió de Conflictes de Territori */}
      {showModalConflictos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Gestió de Conflictes de Territori
              </h2>
              <button onClick={() => setShowModalConflictos(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-700">3</div>
                  <div className="text-sm text-red-600">Conflictes Actius</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">5</div>
                  <div className="text-sm text-yellow-600">En Revisió</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">12</div>
                  <div className="text-sm text-green-600">Resolts Aquest Mes</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">2.3d</div>
                  <div className="text-sm text-blue-600">Temps Mitjà Resolució</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Conflictes Actius</h3>
                <div className="space-y-3">
                  {conflictosTerritorios.map(conflicto => (
                    <div key={conflicto.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              conflicto.prioridad === 'alta' ? 'bg-red-100 text-red-700' :
                              conflicto.prioridad === 'media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              Prioritat {conflicto.prioridad}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              conflicto.estado === 'abierto' ? 'bg-red-100 text-red-700' :
                              conflicto.estado === 'en_revision' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {conflicto.estado === 'abierto' ? 'Obert' :
                               conflicto.estado === 'en_revision' ? 'En Revisió' : 'Resolt'}
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(conflicto.fechaReporte).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <div className="font-medium">
                              {conflicto.tipo === 'solapamiento' ? 'Solapament de Territori' :
                               conflicto.tipo === 'disputa' ? 'Disputa de Client' :
                               'Reassignació de Zona'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Territoris: {conflicto.territoriosAfectados.join(', ')}
                            </div>
                            <div className="text-sm text-gray-600">
                              Comercials: {conflicto.comercialesInvolucrados.join(', ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                            Revisar
                          </button>
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                            Resoldre
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Eines de Resolució Automàtica</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Algoritme de Distribució</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Reassigna automàticament leads basant-se en càrrega, rendiment i especialització
                      </p>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Executar Anàlisi
                      </button>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Divisió per Sectors</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Separa territoris per vertical d'indústria per evitar solapaments
                      </p>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Aplicar Divisió
                      </button>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Rotació Temporal</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Estableix rotacions mensuals per territoris conflictius
                      </p>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Configurar Rotació
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Historial de Resolucions</h3>
                  <div className="space-y-2">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">Barcelona Nord - Resolt</div>
                          <div className="text-xs text-gray-600">Divisió per CP • Fa 3 dies</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">Client TechCorp - Resolt</div>
                          <div className="text-xs text-gray-600">Assignat a senior • Fa 5 dies</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">Sector Educació - Resolt</div>
                          <div className="text-xs text-gray-600">Especialització • Fa 1 setmana</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gamificació */}
      {showModalGamificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Gamificació i Concursos Comercials
              </h2>
              <button onClick={() => setShowModalGamificacion(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Concursos Actius</h3>
                <div className="grid grid-cols-2 gap-4">
                  {concursosActivos.map(concurso => (
                    <div key={concurso.id} className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{concurso.nombre}</h4>
                          <p className="text-sm text-gray-600">{concurso.periodo}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          concurso.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {concurso.estado}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Líder: {concurso.lider}</span>
                          <span className="font-medium">{concurso.participantes} participants</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          La teva posició: #{concurso.miPosicion || '-'}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {concurso.metricas.map((metrica, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{metrica.nombre}</span>
                              <span>{metrica.valor} / {metrica.objetivo}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (metrica.valor / metrica.objetivo) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-orange-700">
                          🏆 {concurso.premio}
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">
                          Veure Ranking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Ranking Global</h3>
                  <div className="space-y-2">
                    {comerciales
                      .sort((a, b) => b.gamificacion.puntos - a.gamificacion.puntos)
                      .map((comercial, index) => (
                      <div key={comercial.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-center font-bold">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && `#${index + 1}`}
                          </div>
                          <div>
                            <div className="font-medium">{comercial.nombre}</div>
                            <div className="text-xs text-gray-600">{comercial.gamificacion.nivel}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">{comercial.gamificacion.puntos} pts</div>
                          <div className="text-xs text-gray-500">{comercial.gamificacion.concursosGanados} victòries</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Sistema de Badges</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { nom: 'Top Performer', icona: '⭐', descripcio: '3 mesos superant objectius' },
                      { nom: 'Closer', icona: '🎯', descripcio: '50+ deals tancats' },
                      { nom: 'Mentor', icona: '🤝', descripcio: 'Ajudar 5+ companys' },
                      { nom: 'Innovador', icona: '💡', descripcio: '10+ millors pràctiques' },
                      { nom: 'Speedster', icona: '⚡', descripcio: 'Cicle venda &lt;15 dies' },
                      { nom: 'Elite', icona: '👑', descripcio: 'Top 1 durant 3 mesos' }
                    ].map(badge => (
                      <div key={badge.nom} className="border rounded-lg p-3 text-center hover:bg-gray-50">
                        <div className="text-2xl mb-1">{badge.icona}</div>
                        <div className="text-xs font-medium">{badge.nom}</div>
                        <div className="text-xs text-gray-500 mt-1">{badge.descripcio}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium mb-2">Proper Badge</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <div>
                          <div className="text-sm font-medium">Rocket Launcher</div>
                          <div className="text-xs text-gray-600">5 nous clients en 1 mes</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-700">3/5</div>
                        <div className="text-xs text-gray-600">60%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Crear Nou Concurs</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom del Concurs</label>
                      <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Reto Q2 2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipus</label>
                      <select className="w-full px-3 py-2 border rounded">
                        <option>Individual</option>
                        <option>Equip</option>
                        <option>Departament</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Premi</label>
                      <input type="text" className="w-full px-3 py-2 border rounded" placeholder="€1000 + Viatge" />
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                    Crear Concurs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Forecasting Individual */}
      {showModalForecasting && selectedComercial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Forecasting Individual - {selectedComercial.nombre}
              </h2>
              <button onClick={() => setShowModalForecasting(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">
                    €{selectedComercial.forecasting.prediccionMes.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Predicció Mes</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">
                    {selectedComercial.forecasting.confianza}%
                  </div>
                  <div className="text-sm text-green-600">Confiança</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    ±{selectedComercial.forecasting.desviacionPromedio}%
                  </div>
                  <div className="text-sm text-blue-600">Desviació Mitjana</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    {selectedComercial.forecasting.tendencia === 'alcista' && <TrendingUp className="w-6 h-6 text-green-600" />}
                    {selectedComercial.forecasting.tendencia === 'bajista' && <TrendingDown className="w-6 h-6 text-red-600" />}
                    {selectedComercial.forecasting.tendencia === 'estable' && <Activity className="w-6 h-6 text-gray-600" />}
                    <span className="font-bold text-orange-700">
                      {selectedComercial.forecasting.tendencia === 'alcista' ? 'Alcista' :
                       selectedComercial.forecasting.tendencia === 'bajista' ? 'Baixista' : 'Estable'}
                    </span>
                  </div>
                  <div className="text-sm text-orange-600">Tendència</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Projecció Trimestral</h3>
                  <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center text-gray-500">
                    [Gràfic de Projecció - Escenaris Optimista/Realista/Pessimista]
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Pipeline Analysis</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Qualificació</span>
                        <span className="text-sm text-gray-600">€45K • 12 leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Proposta</span>
                        <span className="text-sm text-gray-600">€78K • 8 leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Negociació</span>
                        <span className="text-sm text-gray-600">€52K • 5 leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Tancament</span>
                        <span className="text-sm text-gray-600">€35K • 3 leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Anàlisi de Desviacions vs Objectius</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Històric Precisió</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Últims 3 mesos</span>
                          <span className="font-medium text-green-600">92%</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Últims 6 mesos</span>
                          <span className="font-medium text-yellow-600">87%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Últim any</span>
                          <span className="font-medium text-blue-600">89%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Factors de Risc</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">2 deals grans en risc (&gt;€25K)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Cicle venda allargant-se</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Pipeline saludable</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Patró Desviacions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">&lt;10%</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          <span className="font-medium text-green-600">78% dels casos</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">±10%</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <span className="font-medium text-yellow-600">15% dels casos</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">&gt;10%</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                          </div>
                          <span className="font-medium text-red-600">7% dels casos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Accions Recomanades per Millorar Forecast</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <div className="font-medium text-blue-800 mb-2">🎯 Focalitzar Leads Alts</div>
                    <p className="text-sm text-blue-700 mb-2">
                      Concentrar esforços en 2 leads de valor &gt;€25K amb alta probabilitat de tancament.
                    </p>
                    <div className="text-xs text-blue-600">Impacte previst: +20% predicció</div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                    <div className="font-medium text-green-800 mb-2">🤝 Col·laborar amb Equip</div>
                    <p className="text-sm text-green-700 mb-2">
                      Sol·licitar suport de Maria Garcia per deal TechCorp en fase negociació.
                    </p>
                    <div className="text-xs text-green-600">Impacte previst: +15% probabilitat</div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <div className="font-medium text-yellow-800 mb-2">📞 Accelerar Seguiments</div>
                    <p className="text-sm text-yellow-700 mb-2">
                      Programar trucades amb 5 leads en proposta aquesta setmana.
                    </p>
                    <div className="text-xs text-yellow-600">Impacte previst: -5 dies cicle</div>
                  </div>

                  <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                    <div className="font-medium text-purple-800 mb-2">📊 Millorar Qualificació</div>
                    <p className="text-sm text-purple-700 mb-2">
                      Implementar BANT complet en 12 leads de qualificació.
                    </p>
                    <div className="text-xs text-purple-600">Impacte previst: +10% conversió</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}