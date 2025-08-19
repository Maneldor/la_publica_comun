'use client'

import { useState } from 'react'
import { useGruposAvanzados } from '../../src/contextos/GruposAvanzadosContext'
import { useAuth } from '../../src/contextos/AuthContext'
import DashboardGruposAdmin from '../../src/componentes/comunes/especificos-comunidad/DashboardGruposAdmin'
import GruposMiembros from '../../src/componentes/comunes/especificos-comunidad/GruposMiembros'
import FeedGrupoPrivado from '../../src/componentes/comunes/especificos-comunidad/FeedGrupoPrivado'
import ConexionesMiembros from '../../src/componentes/comunes/especificos-comunidad/ConexionesMiembros'
import ListaMiembrosGrupo from '../../src/componentes/comunes/especificos-comunidad/ListaMiembrosGrupo'
import OfertasExclusivasSimple from '../../src/componentes/comunes/especificos-comunidad/OfertasExclusivasSimple'
import LayoutXarxaSocial from '../../src/componentes/comunes/LayoutXarxaSocial'
import { GrupoAvanzado } from '../../tipos/gruposAvanzados'
import ModalGrupoAvanzado from '../../src/componentes/comunes/especificos-comunidad/ModalGrupoAvanzado'
import { 
  ArrowLeft,
  Settings,
  Users,
  MessageSquare,
  FileText,
  Gift,
  MoreVertical,
  Crown,
  Shield,
  UserPlus,
  Eye,
  Lock,
  Globe,
  Share2,
  Folder,
  Search,
  Bell,
  Calendar,
  Link
} from 'lucide-react'

export default function GruposAvanzadosPage() {
  const { user, isLoading } = useAuth()
  const { 
    grupos, 
    grupoActivo, 
    seleccionarGrupo, 
    crearGrupo,
    obtenerJerarquiaGrupo,
    obtenerSubgrupos,
    esAdminGrupo,
    esMiembroGrupo
  } = useGruposAvanzados()
  
  // Esta página ES SOLO para miembros (descubrir/unirse a grupos)
  // Los admins gestionan grupos desde su propio dashboard
  const esVistaMiembro = true // Siempre vista de miembro en esta página
  
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'grupo'>('dashboard')
  const [tabActiva, setTabActiva] = useState<'feed' | 'membres' | 'connexions' | 'arxius' | 'ofertes' | 'subgrups'>('feed')
  const [modalCrearGrupo, setModalCrearGrupo] = useState(false)
  const [modalEditarGrupo, setModalEditarGrupo] = useState<GrupoAvanzado | null>(null)

  const handleSeleccionarGrupo = (grupoId: string) => {
    seleccionarGrupo(grupoId)
    setVistaActiva('grupo')
  }

  const handleCrearGrupo = () => {
    setModalCrearGrupo(true)
  }

  const handleEditarGrupo = (grupo: GrupoAvanzado) => {
    setModalEditarGrupo(grupo)
  }

  const renderHeaderGrupo = () => {
    if (!grupoActivo) return null

    const jerarquia = obtenerJerarquiaGrupo(grupoActivo.id)
    const subgrupos = obtenerSubgrupos(grupoActivo.id)
    const esAdmin = esAdminGrupo(grupoActivo.id)
    const esMiembro = esMiembroGrupo(grupoActivo.id)

    const getIconoTipo = (tipo: string) => {
      switch (tipo) {
        case 'publico': return <Globe size={16} className="text-green-500" />
        case 'privado': return <Lock size={16} className="text-yellow-500" />
        case 'oculto': return <Eye size={16} className="text-red-500" />
        default: return <Users size={16} className="text-gray-500" />
      }
    }

    return (
      <div className="bg-white border-b border-gray-200">
        {/* Portada del grup */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          {grupoActivo.portada && (
            <img 
              src={grupoActivo.portada} 
              alt={grupoActivo.nombre}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay gradual */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Botons d'acció */}
          <div className="absolute top-4 right-5 flex items-center space-x-2">
            <button
              onClick={() => setVistaActiva('dashboard')}
              className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
            >
              <ArrowLeft size={16} />
              <span>Tornar</span>
            </button>
            
            {esAdmin && (
              <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
                <Settings size={16} />
              </button>
            )}
            
            <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
              <Share2 size={16} />
            </button>
            
            <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Informació del grup */}
        <div className="px-5 pb-4">
          <div className="flex items-end justify-between -mt-12">
            {/* Avatar del grup */}
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden">
                {grupoActivo.avatar ? (
                  <img src={grupoActivo.avatar} alt={grupoActivo.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Users size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="pb-2">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{grupoActivo.nombre}</h1>
                  {getIconoTipo(grupoActivo.tipo)}
                  
                  {grupoActivo.esDestacado && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Destacat
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 max-w-2xl">{grupoActivo.descripcion}</p>
              </div>
            </div>

            {/* Botons d'acció del grup */}
            <div className="flex items-center space-x-3 pb-2">
              {!esMiembro ? (
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Sol·licitar accés
                </button>
              ) : (
                <>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <UserPlus size={16} />
                    <span>Convidar</span>
                  </button>
                  
                  {esAdmin && (
                    <button 
                      onClick={() => handleEditarGrupo(grupoActivo)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings size={16} />
                      <span>Gestionar</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Jerarquia de navegació */}
          {jerarquia.length > 1 && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
              {jerarquia.map((grup, index) => (
                <div key={grup.id} className="flex items-center space-x-2">
                  {index > 0 && <span>/</span>}
                  <button
                    onClick={() => handleSeleccionarGrupo(grup.id)}
                    className={`hover:text-blue-600 transition-colors ${
                      grup.id === grupoActivo.id ? 'font-medium text-gray-900' : ''
                    }`}
                  >
                    {grup.nombre}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Estadístiques i navegació */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{grupoActivo.totalMiembros} membres</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare size={16} />
                <span>{grupoActivo.estadisticas.postsEstesMes} posts aquest mes</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText size={16} />
                <span>{grupoActivo.estadisticas.totalArchivos} arxius</span>
              </div>
              {grupoActivo.configuracion.ofertasExclusivas && (
                <div className="flex items-center space-x-1">
                  <Gift size={16} />
                  <span>Ofertes exclusives</span>
                </div>
              )}
              {subgrupos.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span>{subgrupos.length} subgrups</span>
                </div>
              )}
            </div>

            {/* Tabs de navegació */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setTabActiva('feed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tabActiva === 'feed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Feed
              </button>
              <button 
                onClick={() => setTabActiva('membres')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tabActiva === 'membres' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Membres
              </button>
              <button 
                onClick={() => setTabActiva('connexions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tabActiva === 'connexions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Connexions
              </button>
              <button 
                onClick={() => setTabActiva('arxius')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tabActiva === 'arxius' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Arxius
              </button>
              {grupoActivo.configuracion.ofertasExclusivas && (
                <button 
                  onClick={() => setTabActiva('ofertes')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tabActiva === 'ofertes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ofertes
                </button>
              )}
              {subgrupos.length > 0 && (
                <button 
                  onClick={() => setTabActiva('subgrups')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tabActiva === 'subgrups' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Subgrups
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TEMPORAL: Comentar loading state para testing
  if (false && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregant...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {vistaActiva === 'dashboard' ? (
        <LayoutXarxaSocial paginaActual="grups">
          {/* Esta página solo muestra vista de miembro - sin gestión admin */}
          <GruposMiembros
            onSeleccionarGrupo={handleSeleccionarGrupo}
          />
        </LayoutXarxaSocial>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
            <HeaderGlobal />
          </div>
          <div className="pt-16">
            <div>
              {renderHeaderGrupo()}
              
              <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Sidebar esquerra */}
              <div className="lg:col-span-1 space-y-4">
                {/* Informació del grup */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Sobre aquest grup</h3>
                  <p className="text-sm text-gray-600 mb-4">{grupoActivo?.descripcionLarga || grupoActivo?.descripcion}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Privacitat</span>
                      <span className="font-medium text-gray-900 capitalize">{grupoActivo?.tipo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Categoria</span>
                      <span className="font-medium text-gray-900 capitalize">{grupoActivo?.categoria}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Creat</span>
                      <span className="font-medium text-gray-900">
                        {grupoActivo?.fechaCreacion.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Membres recents */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Membres</h3>
                    <span className="text-sm text-gray-500">{grupoActivo?.totalMiembros} total</span>
                  </div>
                  
                  <div className="space-y-3">
                    {grupoActivo?.miembros.slice(0, 5).map((membre) => (
                      <div key={membre.usuarioId} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {membre.usuario?.nombre || 'Usuari'}
                          </p>
                          <div className="flex items-center space-x-1">
                            {membre.rol === 'embaixador' && <Crown size={12} className="text-purple-500" />}
                            {membre.rol === 'administrador' && <Shield size={12} className="text-blue-500" />}
                            <span className="text-xs text-gray-500 capitalize">{membre.rol}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Veure tots els membres
                  </button>
                </div>
              </div>

              {/* Contingut principal */}
              <div className="lg:col-span-3">
                {grupoActivo && esMiembroGrupo(grupoActivo.id) ? (
                  <>
                    {tabActiva === 'feed' && <FeedGrupoPrivado grupoId={grupoActivo.id} />}
                    {tabActiva === 'membres' && <ListaMiembrosGrupo grupoId={grupoActivo.id} />}
                    {tabActiva === 'connexions' && <ConexionesMiembros grupoId={grupoActivo.id} />}
                    {tabActiva === 'arxius' && (
                      <div className="bg-white rounded-lg border p-8 text-center">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Gestió d'arxius
                        </h3>
                        <p className="text-gray-600">
                          Funcionalitat d'arxius en desenvolupament
                        </p>
                      </div>
                    )}
                    {tabActiva === 'ofertes' && <OfertasExclusivasSimple grupoId={grupoActivo.id} />}
                    {tabActiva === 'subgrups' && (
                      <div className="bg-white rounded-lg border p-8 text-center">
                        <Folder size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Subgrups
                        </h3>
                        <p className="text-gray-600">
                          Gestió de subgrups en desenvolupament
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <Lock size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Grup privat
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Necessites ser membre d'aquest grup per veure el seu contingut.
                    </p>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Sol·licitar accés
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <ModalGrupoAvanzado
        isOpen={modalCrearGrupo}
        onClose={() => setModalCrearGrupo(false)}
      />
      
      <ModalGrupoAvanzado
        isOpen={!!modalEditarGrupo}
        onClose={() => setModalEditarGrupo(null)}
        grupo={modalEditarGrupo}
      />
    </>
  )
}