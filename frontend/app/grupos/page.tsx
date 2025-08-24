'use client'
import { useState } from 'react'
import { useComunidad } from '../ComunidadContext'
import { formatearNumero } from '../../src/utils/formateoNumeros'

export default function GruposPage() {
  const { configuracion } = useComunidad()
  const [filtroActivo, setFiltroActivo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  // Datos de ejemplo - Grupos estilo BuddyBoss
  const grupos = [
    {
      id: '1',
      nombre: 'Empleados Públicos Catalunya',
      descripcion: 'Comunidad oficial para empleados públicos de Catalunya. Compartimos experiencias, normativas y oportunidades profesionales.',
      tipo: 'publico',
      imagen: null,
      miembros: 1247,
      actividad: '2 min',
      admin: 'Laura García',
      fechaCreacion: 'Enero 2020',
      categoria: 'Oficial',
      trending: true
    },
    {
      id: '2',
      nombre: 'Oposiciones A1 Catalunya 2024',
      descripcion: 'Grupo de estudio y apoyo mutuo para las oposiciones del grupo A1 en Catalunya. Acceso por solicitud.',
      tipo: 'privado',
      imagen: null,
      miembros: 847,
      actividad: '5 min',
      admin: 'Joan Martí',
      fechaCreacion: 'Marzo 2023',
      categoria: 'Formación',
      trending: false
    },
    {
      id: '3',
      nombre: 'Círculo Directivo - Alta Gestión',
      descripcion: 'Espacio exclusivo para directivos y alta gestión de la administración pública. Solo por invitación directa.',
      tipo: 'oculto',
      imagen: null,
      miembros: 23,
      actividad: '1 hora',
      admin: 'Carlos Vega',
      fechaCreacion: 'Septiembre 2021',
      categoria: 'Directivo',
      trending: false
    },
    {
      id: '4',
      nombre: 'Innovación Administrativa',
      descripcion: 'Exploramos nuevas metodologías y tecnologías para modernizar la administración pública.',
      tipo: 'publico',
      imagen: null,
      miembros: 423,
      actividad: '30 min',
      admin: 'Ana Ruiz',
      fechaCreacion: 'Abril 2021',
      categoria: 'Innovación',
      trending: true
    },
    {
      id: '5',
      nombre: 'Jurídico Administrativo',
      descripcion: 'Consultas, casos prácticos y actualizaciones normativas del derecho administrativo.',
      tipo: 'publico',
      imagen: null,
      miembros: 634,
      actividad: '1 día',
      admin: 'María González',
      fechaCreacion: 'Febrero 2021',
      categoria: 'Legal',
      trending: false
    },
    {
      id: '6',
      nombre: 'Gestores de RRHH - Privado',
      descripcion: 'Grupo privado para gestores de recursos humanos. Estrategias, normativas y casos prácticos.',
      tipo: 'privado',
      imagen: null,
      miembros: 156,
      actividad: '2 horas',
      admin: 'David Jiménez',
      fechaCreacion: 'Junio 2022',
      categoria: 'RRHH',
      trending: false
    }
  ]

  const filtros = [
    { id: 'todos', label: 'Todos los grupos', count: grupos.length },
    { id: 'mis-grupos', label: 'Mis grupos', count: 3 },
    { id: 'publicos', label: 'Públicos', count: grupos.filter(g => g.tipo === 'publico').length },
    { id: 'privados', label: 'Privados', count: grupos.filter(g => g.tipo === 'privado').length },
    { id: 'ocultos', label: 'Solo invitación', count: grupos.filter(g => g.tipo === 'oculto').length }
  ]

  const gruposFiltrados = grupos.filter(grupo => {
    // Filtro por búsqueda
    const coincideBusqueda = busqueda === '' || 
      grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      grupo.categoria.toLowerCase().includes(busqueda.toLowerCase())

    // Filtro por categoría
    let coincideFiltro = true
    switch(filtroActivo) {
      case 'mis-grupos':
        coincideFiltro = ['1', '4', '5'].includes(grupo.id) // Simular grupos del usuario
        break
      case 'publicos':
        coincideFiltro = grupo.tipo === 'publico'
        break
      case 'privados':
        coincideFiltro = grupo.tipo === 'privado'
        break
      case 'ocultos':
        // Solo mostrar grupos ocultos si el usuario tiene acceso
        coincideFiltro = grupo.tipo === 'oculto' && grupo.id === '3' // Simular acceso
        break
      default:
        // Para "todos", no mostrar grupos ocultos a menos que tengas acceso
        coincideFiltro = grupo.tipo !== 'oculto' || grupo.id === '3'
    }

    return coincideBusqueda && coincideFiltro
  })

  const getIniciales = (nombre: string) => {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  const getTipoIcon = (tipo: string) => {
    if (tipo === 'privado') {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    } else if (tipo === 'oculto') {
      return (
        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6.121-3.878a3 3 0 11-4.243 4.243m4.243-4.243L21 21m-9-9l2.121-2.121m0 0a5.5 5.5 0 117.778 7.778L15 15" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  const handleAccionGrupo = (grupo: any, accion: string) => {
    if (accion === 'unirse') {
      if (grupo.tipo === 'publico') {
        console.log(`Uniéndose automáticamente al grupo público: ${grupo.nombre}`)
      } else if (grupo.tipo === 'privado') {
        console.log(`Solicitando acceso al grupo privado: ${grupo.nombre}`)
      } else if (grupo.tipo === 'oculto') {
        console.log(`Grupo oculto requiere invitación: ${grupo.nombre}`)
      }
    }
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
              <span>Dashboard</span>
            </a>
            
            <a href="/perfil" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Mi Perfil</span>
            </a>
            
            <a href="/miembros" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Miembros</span>
            </a>
            
            <a href="/grupos" className="flex items-center space-x-3 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 712 2m-6 9l2 2 4-4" />
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
                <h1 className="text-3xl font-bold text-gray-900">Grupos</h1>
                <p className="text-gray-600 mt-1">Descubre y únete a comunidades de empleados públicos de {configuracion.nombre}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Crear Grupo
                </button>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {gruposFiltrados.length} grupos
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
                  placeholder="Buscar grupos..."
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

          {/* Groups Grid - Calcado de BuddyBoss */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gruposFiltrados.map((grupo) => (
              <div key={grupo.id} className="w-full max-w-sm mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-sm overflow-hidden h-full">
                {/* Header con imagen/fondo - Estilo BuddyBoss */}
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                  {grupo.imagen && (
                    <img src={grupo.imagen} alt={grupo.nombre} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  
                  {/* Badge de trending */}
                  {grupo.trending && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        TRENDING
                      </span>
                    </div>
                  )}

                  {/* Tipo de grupo */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white bg-opacity-90 rounded-full p-2">
                      {getTipoIcon(grupo.tipo)}
                    </div>
                  </div>

                  {/* Avatar del grupo sobresaliente - Estilo BuddyBoss */}
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 bg-white rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
                      {grupo.imagen ? (
                        <img src={grupo.imagen} alt={grupo.nombre} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {getIniciales(grupo.nombre)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content - Estilo BuddyBoss */}
                <div className="pt-10 pb-6 px-6">
                  {/* Group Info */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 pr-2 leading-tight">
                        {grupo.nombre}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium capitalize">
                        {grupo.tipo}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {grupo.descripcion}
                    </p>

                    {/* Categoría */}
                    <div className="flex items-center mb-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {grupo.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Stats - Estilo BuddyBoss */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 714 0zM7 10a2 2 0 11-4 0 2 2 0 714 0z" />
                        </svg>
                        <span className="font-medium">{formatearNumero(grupo.miembros)}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{grupo.actividad}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin info */}
                  <div className="text-xs text-gray-500 mb-4">
                    Admin: <span className="font-medium">{grupo.admin}</span> • 
                    Creado en {grupo.fechaCreacion}
                  </div>

                  {/* Action Button - Solo uno según tipo */}
                  <div>
                    {grupo.tipo === 'publico' && (
                      <button 
                        onClick={() => handleAccionGrupo(grupo, 'unirse')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Unirse
                      </button>
                    )}
                    {grupo.tipo === 'privado' && (
                      <button 
                        onClick={() => handleAccionGrupo(grupo, 'unirse')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Solicitar acceso
                      </button>
                    )}
                    {grupo.tipo === 'oculto' && (
                      <button 
                        disabled
                        className="w-full bg-gray-300 text-gray-500 text-sm font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        Solo por invitación
                      </button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium">
              Cargar más grupos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}