'use client'

import { useState, useEffect } from 'react'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Crown,
  Shield,
  Eye,
  Lock,
  Globe,
  Folder,
  TrendingUp,
  Activity,
  UserPlus,
  MessageSquare,
  FileText,
  BarChart3,
  Calendar,
  Gift
} from 'lucide-react'
import { GrupoAvanzado, RolGrupo } from '../../../../tipos/gruposAvanzados'

interface DashboardGruposAdminProps {
  onCrearGrupo: () => void
  onEditarGrupo: (grupo: GrupoAvanzado) => void
}

export default function DashboardGruposAdmin({ onCrearGrupo, onEditarGrupo }: DashboardGruposAdminProps) {
  const { 
    grupos, 
    cargando, 
    seleccionarGrupo,
    filtros,
    setFiltros,
    puedeGestionarGrupo,
    obtenerSubgrupos
  } = useGruposAvanzados()
  
  const [vistaActual, setVistaActual] = useState<'grid' | 'lista' | 'jerarquia'>('grid')
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<GrupoAvanzado | null>(null)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Filtrar grupos según criterios
  const gruposFiltrados = grupos.filter(grupo => {
    if (filtros.busqueda && !grupo.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) &&
        !grupo.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())) {
      return false
    }
    if (filtros.categoria && grupo.categoria !== filtros.categoria) return false
    if (filtros.tipo && grupo.tipo !== filtros.tipo) return false
    if (filtros.nivel !== undefined && grupo.nivel !== filtros.nivel) return false
    if (filtros.activos !== undefined && grupo.activo !== filtros.activos) return false
    
    return true
  })

  // Estadísticas generales
  const estadisticas = {
    totalGrupos: grupos.length,
    gruposActivos: grupos.filter(g => g.activo).length,
    totalMiembros: grupos.reduce((sum, g) => sum + g.totalMiembros, 0),
    gruposPrivados: grupos.filter(g => g.tipo === 'privado').length,
    subgrupos: grupos.filter(g => g.nivel > 0).length
  }

  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'publico': return <Globe size={16} className="text-green-500" />
      case 'privado': return <Lock size={16} className="text-yellow-500" />
      case 'oculto': return <Eye size={16} className="text-red-500" />
      default: return <Users size={16} className="text-gray-500" />
    }
  }

  const obtenerIconoRol = (rol: RolGrupo, size = 16) => {
    switch (rol) {
      case 'embaixador': return <Crown size={size} className="text-purple-500" />
      case 'administrador': return <Shield size={size} className="text-blue-500" />
      case 'moderador': return <Users size={size} className="text-green-500" />
      default: return <Users size={size} className="text-gray-500" />
    }
  }

  const renderTarjetaGrupo = (grupo: GrupoAvanzado) => {
    const subgrupos = obtenerSubgrupos(grupo.id)
    const puedeGestionar = puedeGestionarGrupo(grupo.id, 'editar')
    
    return (
      <div 
        key={grupo.id}
        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        {/* Portada del grupo */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          {grupo.portada && (
            <img 
              src={grupo.portada} 
              alt={grupo.nombre}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Badges de estado */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {obtenerIconoTipo(grupo.tipo)}
            {grupo.esDestacado && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Destacat
              </span>
            )}
            {!grupo.activo && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Inactiu
              </span>
            )}
          </div>

          {/* Avatar del grupo */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-12 h-12 bg-white rounded-lg border-2 border-white shadow-sm overflow-hidden">
              {grupo.avatar ? (
                <img src={grupo.avatar} alt={grupo.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Users size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contingut de la targeta */}
        <div className="p-4 pt-8">
          {/* Capçalera */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{grupo.nombre}</h3>
                {grupo.nivel > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Nivell {grupo.nivel}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="capitalize">{grupo.categoria}</span>
                <span>•</span>
                <span>{grupo.totalMiembros} membres</span>
                {subgrupos.length > 0 && (
                  <>
                    <span>•</span>
                    <span>{subgrupos.length} subgrups</span>
                  </>
                )}
              </div>
            </div>

            {puedeGestionar && (
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Descripció */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {grupo.descripcion}
          </p>

          {/* Estadístiques ràpides */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Activity size={14} className="text-green-500" />
              <span className="text-gray-600">{grupo.estadisticas.postsEstesMes} posts</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp size={14} className="text-blue-500" />
              <span className="text-gray-600">{grupo.estadisticas.miembrosActivos} actius</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <FileText size={14} className="text-purple-500" />
              <span className="text-gray-600">{grupo.estadisticas.totalArchivos} arxius</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Gift size={14} className="text-orange-500" />
              <span className="text-gray-600">
                {grupo.configuracion.ofertasExclusivas ? 'Ofertes' : 'Sense ofertes'}
              </span>
            </div>
          </div>

          {/* Accions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => seleccionarGrupo(grupo.id)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Veure grup
            </button>
            
            {puedeGestionar && (
              <button
                onClick={() => onEditarGrupo(grupo)}
                className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings size={16} />
              </button>
            )}
          </div>

          {/* Subgrups (si n'hi ha) */}
          {subgrupos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Subgrups ({subgrupos.length})
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Veure tots
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {subgrupos.slice(0, 3).map(subgrupo => (
                  <div
                    key={subgrupo.id}
                    className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded text-xs"
                  >
                    <Folder size={12} />
                    <span className="truncate max-w-20">{subgrupo.nombre}</span>
                  </div>
                ))}
                
                {subgrupos.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{subgrupos.length - 3} més
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderVistaJerarquia = () => {
    const gruposRaiz = grupos.filter(g => g.nivel === 0)
    
    const renderGrupoConSubgrupos = (grupo: GrupoAvanzado, profunditat = 0) => {
      const subgrupos = obtenerSubgrupos(grupo.id)
      const margin = profunditat * 24
      
      return (
        <div key={grupo.id} style={{ marginLeft: `${margin}px` }}>
          {/* Grup principal */}
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border mb-2 hover:shadow-sm">
            <div className="flex items-center space-x-2 flex-1">
              {obtenerIconoTipo(grupo.tipo)}
              <span className="font-medium text-gray-900">{grupo.nombre}</span>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{grupo.totalMiembros} membres</span>
                <span className="capitalize">{grupo.categoria}</span>
                {subgrupos.length > 0 && (
                  <span>{subgrupos.length} subgrups</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => seleccionarGrupo(grupo.id)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Veure
              </button>
              
              {puedeGestionarGrupo(grupo.id, 'editar') && (
                <button
                  onClick={() => onEditarGrupo(grupo)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Settings size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Subgrups */}
          {subgrupos.map(subgrupo => renderGrupoConSubgrupos(subgrupo, profunditat + 1))}
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {gruposRaiz.map(grupo => renderGrupoConSubgrupos(grupo))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestió de Grups</h1>
          <p className="text-gray-600">
            Administra tots els grups i subgrups de la comunitat
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'grid', icon: BarChart3, label: 'Targetes' },
              { key: 'lista', icon: FileText, label: 'Llista' },
              { key: 'jerarquia', icon: Folder, label: 'Jerarquia' }
            ].map(vista => (
              <button
                key={vista.key}
                onClick={() => setVistaActual(vista.key as any)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  vistaActual === vista.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <vista.icon size={14} />
                <span className="hidden sm:inline">{vista.label}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={onCrearGrupo}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            <span>Crear Grup</span>
          </button>
        </div>
      </div>

      {/* Estadístiques generals */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Grups', valor: estadisticas.totalGrupos, icon: Users, color: 'blue' },
          { label: 'Grups Actius', valor: estadisticas.gruposActivos, icon: Activity, color: 'green' },
          { label: 'Total Membres', valor: estadisticas.totalMiembros, icon: UserPlus, color: 'purple' },
          { label: 'Grups Privats', valor: estadisticas.gruposPrivados, icon: Lock, color: 'yellow' },
          { label: 'Subgrups', valor: estadisticas.subgrupos, icon: Folder, color: 'orange' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.valor}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres i cerca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cercar grups per nom o descripció..."
            value={filtros.busqueda || ''}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
            mostrarFiltros ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={16} />
          <span>Filtres</span>
        </button>
      </div>

      {/* Panel de filtres expandit */}
      {mostrarFiltros && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filtros.categoria || ''}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Totes les categories</option>
              <option value="profesional">Professional</option>
              <option value="afinidad">Afinitat</option>
              <option value="geografico">Geogràfic</option>
            </select>

            <select
              value={filtros.tipo || ''}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tots els tipus</option>
              <option value="publico">Públic</option>
              <option value="privado">Privat</option>
              <option value="oculto">Ocult</option>
            </select>

            <select
              value={filtros.nivel?.toString() || ''}
              onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value ? parseInt(e.target.value) : undefined })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tots els nivells</option>
              <option value="0">Grups principals</option>
              <option value="1">Nivell 1</option>
              <option value="2">Nivell 2</option>
              <option value="3">Nivell 3</option>
              <option value="4">Nivell 4</option>
            </select>

            <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white">
              <input
                type="checkbox"
                checked={filtros.activos ?? true}
                onChange={(e) => setFiltros({ ...filtros, activos: e.target.checked })}
              />
              <span className="text-sm">Només actius</span>
            </label>
          </div>
        </div>
      )}

      {/* Contingut principal */}
      <div>
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : gruposFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hi ha grups
            </h3>
            <p className="text-gray-600 mb-6">
              {filtros.busqueda || filtros.categoria || filtros.tipo 
                ? 'No s\'han trobat grups amb aquests filtres' 
                : 'Crea el primer grup per començar'
              }
            </p>
            <button
              onClick={onCrearGrupo}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Crear primer grup
            </button>
          </div>
        ) : (
          <>
            {vistaActual === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gruposFiltrados.map(renderTarjetaGrupo)}
              </div>
            )}
            
            {vistaActual === 'jerarquia' && renderVistaJerarquia()}
            
            {vistaActual === 'lista' && (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Grup</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tipus</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Categoria</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Membres</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Activitat</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Accions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {gruposFiltrados.map(grupo => (
                        <tr key={grupo.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                {grupo.avatar ? (
                                  <img src={grupo.avatar} alt={grupo.nombre} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Users size={20} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{grupo.nombre}</p>
                                <p className="text-sm text-gray-600 truncate max-w-48">{grupo.descripcion}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {obtenerIconoTipo(grupo.tipo)}
                              <span className="text-sm text-gray-600 capitalize">{grupo.tipo}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 capitalize">{grupo.categoria}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-900">{grupo.totalMiembros}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{grupo.estadisticas.postsEstesMes} posts</span>
                              <span>{grupo.estadisticas.miembrosActivos} actius</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => seleccionarGrupo(grupo.id)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                              >
                                Veure
                              </button>
                              {puedeGestionarGrupo(grupo.id, 'editar') && (
                                <button
                                  onClick={() => onEditarGrupo(grupo)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Settings size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}