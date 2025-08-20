'use client'

import { useState, useEffect } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Crown,
  Shield,
  Eye,
  Lock,
  Globe,
  MessageSquare,
  FileText,
  Gift,
  UserPlus,
  Clock,
  CheckCircle
} from 'lucide-react'
import { GrupoAvanzado, RolGrupo } from '../../../../tipos/gruposAvanzados'

interface GruposMiembrosProps {
  onSeleccionarGrupo: (grupoId: string) => void
}

export default function GruposMiembros({ onSeleccionarGrupo }: GruposMiembrosProps) {
  const { 
    grupos, 
    cargando, 
    esMiembroGrupo,
    agregarMiembro
  } = useGruposAvanzados()
  
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'meus' | 'publics' | 'professionals'>('meus')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('')
  const [vistaActiva, setVistaActiva] = useState<'grid' | 'llista'>('grid')

  // Filtrar grupos según el filtro de tipo seleccionado
  const gruposFiltradosPorTipo = grupos.filter(grupo => {
    // Nunca mostrar grupos ocultos (solo por invitación)
    if (grupo.tipo === 'oculto') return false

    switch (filtroTipo) {
      case 'meus':
        return esMiembroGrupo(grupo.id)
      case 'publics':
        return grupo.tipo === 'publico'
      case 'professionals':
        return grupo.tipo === 'privado' // 'privado' = profesional
      default:
        return false
    }
  })

  // Filtrar por búsqueda y categoría
  const gruposFiltrados = gruposFiltradosPorTipo.filter(grupo => {
    if (busqueda && !grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !grupo.descripcion.toLowerCase().includes(busqueda.toLowerCase())) {
      return false
    }
    
    // Filtro por categoría solo si está seleccionado
    if (categoriaFiltro && grupo.categoria !== categoriaFiltro) return false
    
    return true
  })

  // Separar para mostrar secciones
  const misGrupos = gruposFiltrados.filter(grupo => esMiembroGrupo(grupo.id))
  const gruposDisponibles = gruposFiltrados.filter(grupo => !esMiembroGrupo(grupo.id))

  // Estadísticas según filtros
  const todosLosGruposVisibles = grupos.filter(g => g.tipo !== 'oculto')
  const estadisticas = {
    todos: todosLosGruposVisibles.length,
    misGrupos: todosLosGruposVisibles.filter(g => esMiembroGrupo(g.id)).length,
    gruposPublicos: todosLosGruposVisibles.filter(g => g.tipo === 'publico').length,
    gruposProfesionales: todosLosGruposVisibles.filter(g => g.tipo === 'privado').length,
    pendientesAprobacion: 0 // TODO: implementar lógica de solicitudes pendientes
  }

  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'publico': return <Globe size={16} className="text-green-500" />
      case 'privado': return <Lock size={16} className="text-yellow-500" />
      default: return <Users size={16} className="text-gray-500" />
    }
  }

  const obtenerEstadoAcceso = (grupo: GrupoAvanzado) => {
    const esMiembro = esMiembroGrupo(grupo.id)
    
    if (esMiembro) {
      return {
        texto: 'Membre',
        color: 'bg-green-100 text-green-800',
        accion: () => onSeleccionarGrupo(grupo.id),
        textoBoton: 'Accedir'
      }
    }

    if (grupo.tipo === 'publico') {
      return {
        texto: 'Públic',
        color: 'bg-blue-100 text-blue-800',
        accion: () => {
          // Unirse directamente a grupo público
          agregarMiembro(grupo.id, 'user-1', 'miembro')
        },
        textoBoton: 'Unir-se'
      }
    }

    if (grupo.tipo === 'privado') {
      return {
        texto: 'Requereix aprovació',
        color: 'bg-yellow-100 text-yellow-800',
        accion: () => {
          // TODO: Enviar solicitud de acceso
          console.log('Solicitar acceso a grupo profesional:', grupo.id)
        },
        textoBoton: 'Sol·licitar accés'
      }
    }

    return {
      texto: 'No disponible',
      color: 'bg-gray-100 text-gray-800',
      accion: () => {},
      textoBoton: 'No disponible'
    }
  }

  const renderTarjetaGrupo = (grupo: GrupoAvanzado) => {
    const estado = obtenerEstadoAcceso(grupo)
    const esMiembro = esMiembroGrupo(grupo.id)
    
    // URLs de imágenes placeholder que funcionan
    const avatarPlaceholder = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    const portadaPlaceholder = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=160&fit=crop'
    
    if (vistaActiva === 'llista') {
      // Vista de lista horizontal
      return (
        <div 
          key={grupo.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 p-4"
        >
          <div className="flex items-center space-x-4">
            {/* Avatar del grupo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-200 overflow-hidden">
                <img 
                  src={grupo.avatar || avatarPlaceholder} 
                  alt={grupo.nombre} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMiIgeT0iMTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJtMTcgMjEtNS02LTUtNiIvPgo8L3N2Zz4KPC9zdmc+'
                  }}
                />
              </div>
            </div>
            
            {/* Información del grupo */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {grupo.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {grupo.descripcion}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users size={16} className="text-gray-400" />
                      <span>{grupo.totalMiembros} membres</span>
                    </div>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      grupo.tipo === 'publico' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {obtenerIconoTipo(grupo.tipo)}
                      <span className="capitalize">
                        {grupo.tipo === 'publico' ? 'Públic' : 'Professional'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">
                      {traduirCategoria(grupo.categoria)}
                    </span>
                  </div>
                </div>
                
                {/* Botón de acción */}
                <div className="flex-shrink-0">
                  <button 
                    onClick={estado.accion}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      esMiembro 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : grupo.tipo === 'publico'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {esMiembro ? (
                        <>
                          <Eye size={14} />
                          <span>{estado.textoBoton}</span>
                        </>
                      ) : grupo.tipo === 'publico' ? (
                        <>
                          <UserPlus size={14} />
                          <span>{estado.textoBoton}</span>
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          <span>{estado.textoBoton}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    // Vista de grid (tarjeta)
    return (
      <div 
        key={grupo.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        {/* Header con portada estilo BuddyBoss */}
        <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
          {/* Solo mostrar imagen si es grupo público o si tiene portada personalizada sin texto */}
          {grupo.tipo === 'publico' ? (
            <img 
              src={grupo.portada || portadaPlaceholder} 
              alt={grupo.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            /* Para grupos profesionales: mostrar gradiente azul por defecto */
            /* TODO: Cuando se implemente la edición, permitir imagen personalizada */
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          {/* Avatar del grupo - Estilo BuddyBoss */}
          <div className="absolute -bottom-6 left-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full p-0.5 shadow-lg">
                <img 
                  src={grupo.avatar || avatarPlaceholder} 
                  alt={grupo.nombre} 
                  className="w-full h-full rounded-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMiIgeT0iMTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJtMTcgMjEtNS02LTUtNiIvPgo8L3N2Zz4KPC9zdmc+'
                  }}
                />
              </div>
              
              {/* Indicador de estado online - estilo BuddyBoss */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4 pt-8">
          {/* Header de información - Mejorado para evitar superposición */}
          <div className="mb-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-base text-gray-900 truncate group-hover:text-blue-600 transition-colors leading-tight">
                  {grupo.nombre}
                </h3>
              </div>
            </div>
            
            {/* Fila separada para categoría y miembros - Sin superposición */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                {traduirCategoria(grupo.categoria)}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1">
                <Users size={12} className="text-gray-400" />
                <span className="text-xs">{grupo.totalMiembros} membres</span>
              </div>
            </div>
            
            {/* Descripción */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-snug">
              {grupo.descripcion}
            </p>
          </div>


          {/* Badge de tipo de grupo */}
          <div className="mb-3">
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              grupo.tipo === 'publico' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {obtenerIconoTipo(grupo.tipo)}
              <span className="capitalize">
                {grupo.tipo === 'publico' ? 'Públic' : 'Professional'}
              </span>
            </div>
          </div>

          {/* Botón principal - ancho completo */}
          <div className="px-1">
            <button 
              onClick={estado.accion}
              className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                esMiembro 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl' 
                  : grupo.tipo === 'publico'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                {esMiembro ? (
                  <>
                    <Eye size={14} />
                    <span>{estado.textoBoton}</span>
                  </>
                ) : grupo.tipo === 'publico' ? (
                  <>
                    <UserPlus size={14} />
                    <span>{estado.textoBoton}</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} />
                    <span>{estado.textoBoton}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const categories = ['professional', 'social', 'cultural', 'esportiu', 'tecnològic']

  // Función para traducir categorías del español al catalán
  const traduirCategoria = (categoria: string): string => {
    const traducciones: { [key: string]: string } = {
      'profesional': 'professional',
      'deportivo': 'esportiu',
      'tecnologico': 'tecnològic',
      'cultural': 'cultural',
      'social': 'social'
    }
    return traducciones[categoria.toLowerCase()] || categoria
  }

  if (cargando) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregant grups...</p>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grups</h1>
          <p className="text-gray-600">Descobreix i uneix-te a grups de la comunitat</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cercar grups per nom o descripció..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros principales */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFiltroTipo('meus')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'meus' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Els meus Grups ({estadisticas.misGrupos})
            </button>
            <button 
              onClick={() => setFiltroTipo('publics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'publics' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grups Públics ({estadisticas.gruposPublicos})
            </button>
            <button 
              onClick={() => setFiltroTipo('professionals')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'professionals' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grups Professionals ({estadisticas.gruposProfesionales})
            </button>
          </div>
          
          {/* Toggle de vista */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVistaActiva('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                vistaActiva === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vista en graella"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              onClick={() => setVistaActiva('llista')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                vistaActiva === 'llista'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vista en llista"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filtro por categoría - Solo visible en modo públicos */}
        {filtroTipo === 'publics' && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar per categoria:
            </label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setCategoriaFiltro('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  categoriaFiltro === '' 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Totes les categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                    categoriaFiltro === cat 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Información para grupos profesionales */}
        {filtroTipo === 'professionals' && (
          <div className="border-t pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-yellow-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-900 mb-1">
                    Grups Professionals - Accés Restringit
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Aquests són grups privats d'accés exclusiu per a membres que pertanyin al col·lectiu concret. 
                    Per accedir-hi cal sol·licitar l'accés i acreditar la pertinença al col·lectiu professional. 
                    Un cop confirmada la teva pertinença, l'embaixador del grup t'atorgarà l'accés.
                  </p>
                  <p className="text-sm text-yellow-800 mt-2 font-medium">
                    ⚠️ Important: Per lògica professional, només es pot pertànyer a un grup professional alhora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resultados filtrados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {filtroTipo === 'meus' && 'Els meus Grups'}
            {filtroTipo === 'publics' && 'Grups Públics'} 
            {filtroTipo === 'professionals' && 'Grups Professionals'}
          </h2>
          <span className="text-sm text-gray-500">{gruposFiltrados.length} grups</span>
        </div>
        
        {gruposFiltrados.length > 0 ? (
          <div className={vistaActiva === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
            : "space-y-4"
          }>
            {gruposFiltrados.map(renderTarjetaGrupo)}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hi ha grups
              {filtroTipo === 'publics' && ' públics'}
              {filtroTipo === 'professionals' && ' professionals'} 
              {filtroTipo === 'meus' && ' als quals pertanys'}
              {busqueda && ` que coincideixin amb "${busqueda}"`}
              {categoriaFiltro && ` de la categoria "${categoriaFiltro}"`}
            </h3>
            <p className="text-gray-600">
              Prova canviant els filtres de cerca per trobar més grups.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}