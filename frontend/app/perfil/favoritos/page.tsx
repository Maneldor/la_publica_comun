'use client'

import { useState } from 'react'
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral'
import { useFavoritos } from '../../../src/contextos/FavoritosContext'
import { TipoFavorito } from '../../../src/tipos/favoritos'
import { 
  Calendar, 
  Building, 
  Users, 
  UserCircle, 
  FileText, 
  Briefcase, 
  MessageSquare,
  BookOpen,
  Trash2,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react'

export default function FavoritosPage() {
  const { 
    favoritos, 
    estadisticas, 
    eliminarFavorito, 
    obtenerFavoritosPorTipo,
    filtrarFavoritos 
  } = useFavoritos()
  
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoFavorito | 'todos'>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<string | null>(null)

  // Filtrar favoritos según tipo y búsqueda
  const favoritosFiltrados = tipoSeleccionado === 'todos' 
    ? filtrarFavoritos({ busqueda })
    : filtrarFavoritos({ tipo: tipoSeleccionado, busqueda })

  const tiposFavoritos = [
    { id: 'todos', nombre: 'Todos', icono: Star, color: 'bg-gray-100 text-gray-700' },
    { id: 'evento', nombre: 'Eventos', icono: Calendar, color: 'bg-blue-100 text-blue-700', count: estadisticas.porTipo.evento },
    { id: 'empresa', nombre: 'Empresas', icono: Building, color: 'bg-purple-100 text-purple-700', count: estadisticas.porTipo.empresa },
    { id: 'miembro', nombre: 'Miembros', icono: UserCircle, color: 'bg-green-100 text-green-700', count: estadisticas.porTipo.miembro },
    { id: 'grupo', nombre: 'Grupos', icono: Users, color: 'bg-indigo-100 text-indigo-700', count: estadisticas.porTipo.grupo },
    { id: 'oferta', nombre: 'Ofertas', icono: Briefcase, color: 'bg-orange-100 text-orange-700', count: estadisticas.porTipo.oferta },
    { id: 'post', nombre: 'Posts', icono: MessageSquare, color: 'bg-pink-100 text-pink-700', count: estadisticas.porTipo.post },
    { id: 'blog', nombre: 'Blogs', icono: BookOpen, color: 'bg-cyan-100 text-cyan-700', count: estadisticas.porTipo.blog },
    { id: 'tema-foro', nombre: 'Foros', icono: FileText, color: 'bg-yellow-100 text-yellow-700', count: estadisticas.porTipo['tema-foro'] }
  ]

  const handleEliminarFavorito = async (tipo: TipoFavorito, itemId: string) => {
    try {
      await eliminarFavorito(tipo, itemId)
      setMostrarConfirmacion(null)
    } catch (error) {
      console.error('Error eliminando favorito:', error)
    }
  }

  const getIconoTipo = (tipo: TipoFavorito) => {
    const tipoConfig = tiposFavoritos.find(t => t.id === tipo)
    return tipoConfig?.icono || Star
  }

  const getColorTipo = (tipo: TipoFavorito) => {
    const tipoConfig = tiposFavoritos.find(t => t.id === tipo)
    return tipoConfig?.color || 'bg-gray-100 text-gray-700'
  }

  return (
    <LayoutGeneral paginaActual="perfil">
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
                <p className="text-gray-600 mt-1">
                  Tienes {estadisticas.total} {estadisticas.total === 1 ? 'elemento' : 'elementos'} guardados
                </p>
              </div>
              
              {/* Buscador */}
              <div className="relative w-full sm:w-auto">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en favoritos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filtros por tipo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tiposFavoritos.map((tipo) => {
                const Icono = tipo.icono
                const isSelected = tipoSeleccionado === tipo.id
                const count = tipo.id === 'todos' ? estadisticas.total : tipo.count
                
                return (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoSeleccionado(tipo.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      isSelected 
                        ? tipo.color 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icono size={18} />
                    <span className="font-medium">{tipo.nombre}</span>
                    {count !== undefined && count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isSelected ? 'bg-white/30' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lista de favoritos */}
          {favoritosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoritosFiltrados.map((favorito) => {
                const Icono = getIconoTipo(favorito.tipo)
                const colorClase = getColorTipo(favorito.tipo)
                
                return (
                  <div 
                    key={favorito.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    {/* Imagen si existe */}
                    {(favorito as any).imagen && (
                      <div className="h-32 bg-gray-100 relative overflow-hidden">
                        <img 
                          src={(favorito as any).imagen} 
                          alt={(favorito as any).titulo || (favorito as any).nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClase}`}>
                            <Icono size={14} className="mr-1" />
                            {favorito.tipo}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      {!((favorito as any).imagen) && (
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClase}`}>
                            <Icono size={14} className="mr-1" />
                            {favorito.tipo}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {(favorito as any).titulo || (favorito as any).nombre || 'Sin título'}
                      </h3>
                      
                      {/* Información específica por tipo */}
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        {favorito.tipo === 'evento' && (favorito as any).fecha && (
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2" />
                            {new Date((favorito as any).fecha).toLocaleDateString('es-ES')}
                          </div>
                        )}
                        
                        {(favorito as any).ubicacion && (
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-2" />
                            <span className="truncate">{(favorito as any).ubicacion}</span>
                          </div>
                        )}
                        
                        {(favorito as any).organizacion && (
                          <div className="flex items-center">
                            <Building size={14} className="mr-2" />
                            <span className="truncate">{(favorito as any).organizacion}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-500">
                          <Clock size={14} className="mr-2" />
                          Guardado {new Date(favorito.fechaGuardado).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <button 
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => {
                            // Aquí iría la navegación al detalle
                            console.log('Ver detalle:', favorito)
                          }}
                        >
                          <ExternalLink size={16} />
                          <span>Ver</span>
                        </button>
                        
                        {mostrarConfirmacion === favorito.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                const itemId = (favorito as any)[`${favorito.tipo}Id`]
                                handleEliminarFavorito(favorito.tipo, itemId)
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Confirmar eliminación"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => setMostrarConfirmacion(null)}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                              title="Cancelar"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setMostrarConfirmacion(favorito.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar de favoritos"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes favoritos
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {busqueda 
                  ? 'No se encontraron favoritos con ese criterio de búsqueda'
                  : 'Empieza a guardar eventos, empresas, miembros y más contenido que te interese'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutGeneral>
  )
}