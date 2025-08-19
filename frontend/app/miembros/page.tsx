'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useComunidad } from '../ComunidadContext'
import { useConexiones } from '../../src/contextos/ConexionesContext'
import TarjetaMiembro, { type RolTipo } from '../../src/componentes/comunes/especificos-comunidad/TarjetaMiembro'
import { MissatgesGlobal } from '../../src/componentes/comunes/especificos-comunidad/MissatgesGlobal'
// Sistema de mensajería eliminado

export default function MiembrosPage() {
  const { configuracion } = useComunidad()
  const router = useRouter()
  const { enviarSolicitudConexion, esConectado, tieneSolicitudPendiente } = useConexiones()
  // Sistema de mensajería eliminado
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Funciones para manejar las acciones
  const handleConectar = async (miembro: any) => {
    try {
      await enviarSolicitudConexion(miembro.id, 'general', `Hola ${miembro.nombre}, me gustaría conectar contigo en La Pública.`)
      alert(`Solicitud de conexión enviada a ${miembro.nombre} ${miembro.apellidos}`)
    } catch (error) {
      console.error('Error al enviar solicitud:', error)
      alert('Error al enviar la solicitud de conexión')
    }
  }

  // Función de mensajería eliminada - sistema removido

  // Datos de ejemplo de miembros con más información estilo BuddyBoss
  const miembros = [
    {
      id: 'user-2',
      nombre: 'Laura García',
      apellidos: 'Martínez',
      cargo: 'Técnica Superior',
      organismo: 'Ajuntament de Barcelona',
      provincia: 'Barcelona',
      avatar: null,
      portada: null,
      estado: 'En línea',
      ultimaActividad: '2 min',
      miembro_desde: 'Marzo 2020',
      conexiones: 47,
      grupos: 8,
      posts: 124,
      especialidades: ['Contratación Pública', 'Urbanismo'],
      ubicacion: 'Barcelona, Catalunya',
      verificado: true
    },
    {
      id: 'user-3',
      nombre: 'Joan',
      apellidos: 'Martí Puig',
      cargo: 'Administrativo',
      organismo: 'Generalitat de Catalunya',
      provincia: 'Barcelona',
      avatar: null,
      portada: null,
      estado: 'Ausente',
      ultimaActividad: '1 hora',
      miembro_desde: 'Enero 2019',
      conexiones: 92,
      grupos: 12,
      posts: 289,
      especialidades: ['Recursos Humanos', 'Gestión Administrativa'],
      ubicacion: 'Barcelona, Catalunya',
      verificado: true
    },
    {
      id: 'user-4',
      nombre: 'Ana',
      apellidos: 'Ruiz Fernández',
      cargo: 'Gestora de Proyectos',
      organismo: 'Diputació de Barcelona',
      provincia: 'Barcelona',
      avatar: null,
      portada: null,
      estado: 'En línea',
      ultimaActividad: '5 min',
      miembro_desde: 'Julio 2021',
      conexiones: 63,
      grupos: 6,
      posts: 87,
      especialidades: ['Gestión de Proyectos', 'Innovación'],
      ubicacion: 'Barcelona, Catalunya',
      verificado: false
    },
    {
      id: 'user-5',
      nombre: 'Carlos',
      apellidos: 'Vega López',
      cargo: 'Coordinador',
      organismo: 'Generalitat de Catalunya',
      provincia: 'Girona',
      avatar: null,
      portada: null,
      estado: 'Desconectado',
      ultimaActividad: '2 días',
      miembro_desde: 'Septiembre 2018',
      conexiones: 156,
      grupos: 15,
      posts: 456,
      especialidades: ['Coordinación', 'Planificación Estratégica'],
      ubicacion: 'Girona, Catalunya',
      verificado: true
    },
    {
      id: 'user-6',
      nombre: 'María',
      apellidos: 'González Sánchez',
      cargo: 'Técnica Jurídica',
      organismo: 'Ajuntament de Lleida',
      provincia: 'Lleida',
      avatar: null,
      portada: null,
      estado: 'En línea',
      ultimaActividad: '10 min',
      miembro_desde: 'Noviembre 2020',
      conexiones: 34,
      grupos: 4,
      posts: 67,
      especialidades: ['Derecho Administrativo', 'Contencioso'],
      ubicacion: 'Lleida, Catalunya',
      verificado: true
    },
    {
      id: 'user-7',
      nombre: 'David',
      apellidos: 'Jiménez Torres',
      cargo: 'Analista de Sistemas',
      organismo: 'Generalitat de Catalunya',
      provincia: 'Tarragona',
      avatar: null,
      portada: null,
      estado: 'Ausente',
      ultimaActividad: '3 horas',
      miembro_desde: 'Mayo 2019',
      conexiones: 78,
      grupos: 9,
      posts: 234,
      especialidades: ['Sistemas de Información', 'Digitalización'],
      ubicacion: 'Tarragona, Catalunya',
      verificado: false
    }
  ]

  const filtros = [
    { id: 'todos', label: 'Todos los miembros', count: isClient ? miembros.length : 0 },
    { id: 'activos', label: 'Activos', count: isClient ? miembros.filter(m => m.estado === 'En línea').length : 0 },
    { id: 'verificados', label: 'Verificados', count: isClient ? miembros.filter(m => m.verificado).length : 0 },
    { id: 'nuevos', label: 'Nuevos miembros', count: isClient ? 2 : 0 }
  ]

  const miembrosFiltrados = miembros.filter(miembro => {
    // Filtro por búsqueda
    const coincideBusqueda = busqueda === '' || 
      miembro.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      miembro.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      miembro.organismo.toLowerCase().includes(busqueda.toLowerCase()) ||
      miembro.especialidades.some(esp => esp.toLowerCase().includes(busqueda.toLowerCase()))

    // Filtro por categoría
    let coincideFiltro = true
    switch(filtroActivo) {
      case 'activos':
        coincideFiltro = miembro.estado === 'En línea'
        break
      case 'verificados':
        coincideFiltro = miembro.verificado
        break
      case 'nuevos':
        coincideFiltro = ['Julio 2021', 'Noviembre 2020'].includes(miembro.miembro_desde)
        break
      default:
        coincideFiltro = true
    }

    return coincideBusqueda && coincideFiltro
  })

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case 'En línea': return 'bg-green-400'
      case 'Ausente': return 'bg-yellow-400'
      default: return 'bg-gray-400'
    }
  }

  const getIniciales = (nombre: string, apellidos: string) => {
    return `${nombre.charAt(0)}${apellidos.split(' ')[0]?.charAt(0) || ''}`
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">La Pública</h2>
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </a>
            
            <a href="/perfil" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Mi Perfil</span>
            </a>
            
            <a href="/miembros" className="flex items-center space-x-3 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Miembros</span>
            </a>
            
            <a href="/grupos" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Grupos</span>
            </a>
            
            <a href="/mensajes" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Mensajes</span>
            </a>
            
            <a href="/blog" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Blog</span>
            </a>
            
            <a href="/foros" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h4a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V8a2 2 0 012-2h4z" />
              </svg>
              <span>Foros</span>
            </a>
            
            <a href="/anuncios" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Anuncios</span>
            </a>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">EMPRESAS</h3>
            <nav className="space-y-2">
              <a href="/empresas" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Directorio</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Miembros</h1>
                <p className="text-gray-600 mt-1">Conecta con empleados públicos de {configuracion.nombre}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {isClient ? miembrosFiltrados.length : 0} miembros
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar miembros..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filtros.map((filtro) => (
                <button
                  key={filtro.id}
                  onClick={() => setFiltroActivo(filtro.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filtroActivo === filtro.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {filtro.label} ({filtro.count})
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid - Estilo BuddyBoss Unificado */}
          {isClient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {miembrosFiltrados.map((miembro) => {
                // Determinar estado de conexión
                let estadoConexion: 'conectado' | 'pendiente' | 'disponible' = 'disponible'
                if (esConectado(miembro.id)) {
                  estadoConexion = 'conectado'
                } else if (tieneSolicitudPendiente(miembro.id)) {
                  estadoConexion = 'pendiente'
                }

                // Mapear datos al formato del componente unificado
                const usuarioUnificado = {
                  id: miembro.id,
                  nombre: miembro.nombre,
                  apellidos: miembro.apellidos,
                  avatar: miembro.avatar || undefined,
                  rol: 'miembro' as RolTipo,
                  estado: 'activo' as 'activo' | 'inactivo',
                  ultimaActividad: new Date(), // Podríamos parsear miembro.ultimaActividad si fuera necesario
                  verificado: true
                }

                return (
                  <TarjetaMiembro
                    key={miembro.id}
                    usuario={usuarioUnificado}
                    layout="buddyboss"
                    estadoConexion={estadoConexion}
                    onConectar={() => handleConectar(miembro)}
                    onVerPerfil={() => router.push(`/perfil/${miembro.id}`)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse">Cargando miembros...</div>
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium">
              Cargar más miembros
            </button>
          </div>
        </div>
      </div>
      
      {/* Component global de missatges */}
      <MissatgesGlobal />
    </div>
  )
}