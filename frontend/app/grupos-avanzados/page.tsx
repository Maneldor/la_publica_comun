'use client'

import { useState, useEffect } from 'react'
import { useGruposAvanzados } from '../../src/contextos/GruposAvanzadosContext'
import { useAuth } from '../../src/contextos/AuthContext'
import GruposMiembros from '../../src/componentes/comunes/especificos-comunidad/GruposMiembros'
import FeedGrupoPrivado from '../../src/componentes/comunes/especificos-comunidad/FeedGrupoPrivado'
import ConexionesMiembros from '../../src/componentes/comunes/especificos-comunidad/ConexionesMiembros'
import ListaMiembrosGrupo from '../../src/componentes/comunes/especificos-comunidad/ListaMiembrosGrupo'
import OfertasExclusivasSimple from '../../src/componentes/comunes/especificos-comunidad/OfertasExclusivasSimple'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import { GrupoAvanzado } from '../../tipos/gruposAvanzados'
import ModalGrupoAvanzado from '../../src/componentes/comunes/especificos-comunidad/ModalGrupoAvanzado'
import ModalGestionGrupo from '../../src/componentes/comunes/especificos-comunidad/ModalGestionGrupo'
import ModalCompartirGrupo from '../../src/componentes/comunes/especificos-comunidad/ModalCompartirGrupo'
import { 
  ArrowLeft,
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
  Folder,
  Star,
  Pin,
  Bell,
  BellOff,
  LogOut,
  Check
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
    esMiembroGrupo,
    fijarGrupo,
    desfijarGrupo,
    estaFijado,
    toggleNotificacionesGrupo,
    tieneNotificacionesActivas,
    abandonarGrupo
  } = useGruposAvanzados()
  
  const [tabActiva, setTabActiva] = useState<'feed' | 'membres' | 'connexions' | 'arxius' | 'ofertes' | 'subgrups'>('feed')
  const [modalCrearGrupo, setModalCrearGrupo] = useState(false)
  const [modalEditarGrupo, setModalEditarGrupo] = useState<GrupoAvanzado | null>(null)
  const [modalGestionGrupo, setModalGestionGrupo] = useState(false)
  const [modalCompartir, setModalCompartir] = useState(false)
  const [menuOpcionsObert, setMenuOpcionsObert] = useState(false)
  const [modalAbandonar, setModalAbandonar] = useState(false)

  const handleSeleccionarGrupo = (grupoId: string) => {
    seleccionarGrupo(grupoId)
  }

  const handleVolverALista = () => {
    seleccionarGrupo('')
  }

  const handleCrearGrupo = () => {
    setModalCrearGrupo(true)
  }

  const handleEditarGrupo = (grupo: GrupoAvanzado) => {
    setModalEditarGrupo(grupo)
  }

  const handleGestionarGrupo = () => {
    setModalGestionGrupo(true)
  }

  // Determinar si el usuario es administrador web (puede editar grupos) o administrador de grupo (solo gestiona miembros)
  const esAdminWeb = user?.role === 'admin-web' // Solo el admin web puede editar grupos
  const esAdminOModeradorGrupo = grupoActivo ? (esAdminGrupo(grupoActivo.id) || esMiembroGrupo(grupoActivo.id)) : false

  const handleCompartirGrupo = () => {
    setModalCompartir(true)
  }

  const handleFijarGrupo = (grupoId: string) => {
    if (estaFijado(grupoId)) {
      desfijarGrupo(grupoId)
    } else {
      fijarGrupo(grupoId)
    }
    setMenuOpcionsObert(false)
  }

  const handleToggleNotificacions = (grupoId: string) => {
    toggleNotificacionesGrupo(grupoId)
    setMenuOpcionsObert(false)
  }

  const handleAbandonarGrupo = () => {
    setModalAbandonar(true)
    setMenuOpcionsObert(false)
  }

  const confirmarAbandonarGrupo = async () => {
    if (grupoActivo) {
      await abandonarGrupo(grupoActivo.id)
      setModalAbandonar(false)
    }
  }

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpcionsObert) {
        setMenuOpcionsObert(false)
      }
    }

    if (menuOpcionsObert) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpcionsObert])

  const renderContenidoGrupo = () => {
    if (!grupoActivo) {
      // Vista de lista de grupos cuando no hay grupo seleccionado
      return <GruposMiembros onSeleccionarGrupo={handleSeleccionarGrupo} />
    }

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
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header del grupo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {/* Portada */}
            <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
              {grupoActivo.portada && (
                <img 
                  src={grupoActivo.portada} 
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay gradual */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              
              {/* Botons d'acció */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                  onClick={handleVolverALista}
                  className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                >
                  <ArrowLeft size={16} />
                  <span>Tornar</span>
                </button>
                
                
                
                {/* Menú de opciones */}
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpcionsObert(!menuOpcionsObert)}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {menuOpcionsObert && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                      {/* Fijar/Desfijar */}
                      <button
                        onClick={() => handleFijarGrupo(grupoActivo.id)}
                        className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                      >
                        <Pin size={16} className={estaFijado(grupoActivo.id) ? 'text-blue-500' : 'text-gray-400'} />
                        <span className="text-sm">
                          {estaFijado(grupoActivo.id) ? 'Desfijar grup' : 'Fijar grup'}
                        </span>
                      </button>
                      
                      {/* Notificaciones */}
                      <button
                        onClick={() => handleToggleNotificacions(grupoActivo.id)}
                        className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                      >
                        {tieneNotificacionesActivas(grupoActivo.id) ? (
                          <Bell size={16} className="text-blue-500" />
                        ) : (
                          <BellOff size={16} className="text-gray-400" />
                        )}
                        <span className="text-sm">
                          {tieneNotificacionesActivas(grupoActivo.id) ? 'Silenciar notificacions' : 'Activar notificacions'}
                        </span>
                      </button>
                      
                      {/* Abandonar grupo */}
                      {esMiembro && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={handleAbandonarGrupo}
                            className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <LogOut size={16} />
                            <span className="text-sm">Abandonar grup</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Avatar del grupo en la portada - CUADRADO */}
              <div className="absolute -bottom-16 left-8">
                {grupoActivo.avatar ? (
                  <img 
                    src={grupoActivo.avatar} 
                    alt={grupoActivo.nombre}
                    className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Users size={48} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Informació del grup - En zona blanca */}
            <div className="px-8 pb-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between pt-20">
                
                {/* Info del grup */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{grupoActivo.nombre}</h1>
                    {getIconoTipo(grupoActivo.tipo)}
                    
                    {grupoActivo.esDestacado && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                        Destacat
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 max-w-3xl mb-3">{grupoActivo.descripcion}</p>
                  
                  {/* Estadístiques */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{grupoActivo.totalMiembros} membres</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={14} />
                      <span>{grupoActivo.estadisticas.postsEstesMes} posts aquest mes</span>
                    </div>
                    {grupoActivo.configuracion.ofertasExclusivas && (
                      <div className="flex items-center space-x-1">
                        <Gift size={14} />
                        <span>Ofertes exclusives</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botons d'acció */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  {!esMiembro ? (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Sol·licitar accés
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleCompartirGrupo}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <UserPlus size={16} />
                        <span>
                          {grupoActivo.tipo === 'publico' ? 'Convidar' : 'Recomanar'}
                        </span>
                      </button>
                      
                      {/* Botón para admin web - puede editar el grupo */}
                      {esAdminWeb && (
                        <button 
                          onClick={() => handleEditarGrupo(grupoActivo)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <span>Editar grup</span>
                        </button>
                      )}
                      
                      {/* Botón para admin/moderador de grupo - solo gestiona miembros */}
                      {!esAdminWeb && esAdminOModeradorGrupo && (
                        <button 
                          onClick={handleGestionarGrupo}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <span>Gestionar</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Jerarquia de navegació */}
              {jerarquia.length > 1 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-4 pt-4 border-t">
                  {jerarquia.map((grup, index) => (
                    <div key={grup.id} className="flex items-center space-x-2">
                      {index > 0 && <span className="text-gray-400">/</span>}
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
            </div>

            {/* Tabs de navegació - Integradas en el header */}
            <div className="border-t">
              <div className="px-8">
                <div className="flex space-x-8">
                  <button 
                    onClick={() => setTabActiva('feed')}
                    className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      tabActiva === 'feed' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Feed
                  </button>
                  <button 
                    onClick={() => setTabActiva('membres')}
                    className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      tabActiva === 'membres' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Membres <span className="text-gray-400">({grupoActivo.totalMiembros})</span>
                  </button>
                  <button 
                    onClick={() => setTabActiva('connexions')}
                    className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      tabActiva === 'connexions' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Connexions
                  </button>
                  <button 
                    onClick={() => setTabActiva('arxius')}
                    className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      tabActiva === 'arxius' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Arxius <span className="text-gray-400">({grupoActivo.estadisticas.totalArchivos})</span>
                  </button>
                  <button 
                    onClick={() => setTabActiva('ofertes')}
                    className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      tabActiva === 'ofertes' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Ofertes
                  </button>
                  {subgrupos.length > 0 && (
                    <button 
                      onClick={() => setTabActiva('subgrups')}
                      className={`py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        tabActiva === 'subgrups' 
                          ? 'border-blue-500 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Subgrups <span className="text-gray-400">({subgrupos.length})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contingut del grup */}
          <div className="space-y-6">
            {esMiembro ? (
              <>
                {tabActiva === 'feed' && <FeedGrupoPrivado grupoId={grupoActivo.id} />}
                {tabActiva === 'membres' && <ListaMiembrosGrupo grupoId={grupoActivo.id} />}
                {tabActiva === 'connexions' && <ConexionesMiembros grupoId={grupoActivo.id} />}
                {tabActiva === 'arxius' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <LayoutGeneral paginaActual="grups">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregant...</p>
          </div>
        </div>
      </LayoutGeneral>
    )
  }

  return (
    <LayoutGeneral paginaActual="grups">
      {renderContenidoGrupo()}
      
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

      {/* Modal Gestión Grupo - para admin/moderadores de grupo */}
      {modalGestionGrupo && grupoActivo && (
        <ModalGestionGrupo 
          grupo={grupoActivo}
          isOpen={modalGestionGrupo}
          onClose={() => setModalGestionGrupo(false)}
        />
      )}

      {/* Modal Compartir Grupo */}
      {modalCompartir && grupoActivo && (
        <ModalCompartirGrupo 
          grupo={grupoActivo}
          isOpen={modalCompartir}
          onClose={() => setModalCompartir(false)}
        />
      )}

      {/* Modal Abandonar Grupo */}
      {modalAbandonar && grupoActivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Abandonar grup
                </h3>
                <p className="text-sm text-gray-600">
                  Aquesta acció no es pot desfer
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Estàs segur que vols abandonar el grup <strong>"{grupoActivo.nombre}"</strong>? 
              Perdràs l'accés a totes les converses i contingut del grup.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setModalAbandonar(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={confirmarAbandonarGrupo}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Abandonar grup
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutGeneral>
  )
}