'use client'

import { useState } from 'react'
import { useConexiones } from '../../../contextos/ConexionesContext'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
// Sistema de mensajería de grupo eliminado
// MensajeriaGrupo eliminado
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Clock, 
  Shield, 
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Filter,
  Crown,
  X,
  Check,
  AlertTriangle
} from 'lucide-react'

interface ConexionesMiembrosProps {
  grupoId: string
}

export default function ConexionesMiembros({ grupoId }: ConexionesMiembrosProps) {
  const { 
    conexiones,
    solicitudesEnviadas,
    solicitudesRecibidas,
    enviarSolicitudConexion,
    aceptarSolicitud,
    rechazarSolicitud,
    bloquearUsuario,
    eliminarConexion,
    esConectado,
    tieneSolicitudPendiente,
    obtenerConexionesGrupo,
    totalConexiones,
    solicitudesPendientes
  } = useConexiones()

  const { grupoActivo } = useGruposAvanzados()
  // Sistema de mensajería eliminado

  const [vistaActiva, setVistaActiva] = useState<'miembros' | 'conexiones' | 'solicitudes'>('miembros')
  const [busqueda, setBusqueda] = useState('')
  const [modalSolicitud, setModalSolicitud] = useState<{
    abierto: boolean
    usuarioId: string
    nombre: string
  }>({ abierto: false, usuarioId: '', nombre: '' })
  const [mensajeSolicitud, setMensajeSolicitud] = useState('')
  const [cargando, setCargando] = useState(false)
  const [modalMensajeria, setModalMensajeria] = useState<{
    abierto: boolean
    usuarioId: string
  }>({ abierto: false, usuarioId: '' })

  if (!grupoActivo) return null

  const miembrosGrupo = grupoActivo.miembros
  const conexionesGrupo = obtenerConexionesGrupo(grupoId)

  // Filtrar miembros según búsqueda
  const miembrosFiltrados = miembrosGrupo.filter(miembro =>
    miembro.usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    (miembro.usuario as any)?.nick?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleEnviarSolicitud = async () => {
    if (!modalSolicitud.usuarioId) return

    setCargando(true)
    try {
      await enviarSolicitudConexion(
        modalSolicitud.usuarioId,
        grupoId,
        mensajeSolicitud.trim() || undefined
      )
      setModalSolicitud({ abierto: false, usuarioId: '', nombre: '' })
      setMensajeSolicitud('')
    } catch (error) {
      console.error('Error enviando solicitud:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleIniciarMensaje = async (usuarioId: string) => {
    if (!esConectado(usuarioId)) {
      alert('Només pots enviar missatges a usuaris connectats')
      return
    }
    
    setModalMensajeria({ abierto: true, usuarioId })
  }

  const renderEstadoConexion = (usuarioId: string) => {
    if (usuarioId === 'user-1') return null // Usuario actual

    if (esConectado(usuarioId)) {
      return (
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck size={12} className="mr-1" />
            Connectat
          </span>
          <button className="text-red-600 hover:text-red-800 p-1">
            <UserX size={14} />
          </button>
        </div>
      )
    }

    if (tieneSolicitudPendiente(usuarioId)) {
      const solicitud = [...solicitudesEnviadas, ...solicitudesRecibidas]
        .find(s => s.usuarioOrigenId === usuarioId || s.usuarioDestinoId === usuarioId)
      
      if (solicitud?.usuarioOrigenId === 'user-1') {
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Enviada
          </span>
        )
      } else {
        return (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => aceptarSolicitud(solicitud!.id)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              <Check size={12} className="mr-1" />
              Acceptar
            </button>
            <button
              onClick={() => rechazarSolicitud(solicitud!.id)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <X size={12} />
            </button>
          </div>
        )
      }
    }

    return (
      <button
        onClick={() => setModalSolicitud({ 
          abierto: true, 
          usuarioId, 
          nombre: miembrosGrupo.find(m => m.usuarioId === usuarioId)?.usuario?.nombre || 'Usuari'
        })}
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
      >
        <UserPlus size={12} className="mr-1" />
        Connectar
      </button>
    )
  }

  const renderMiembro = (miembro: any) => {
    const esUsuarioActual = miembro.usuarioId === 'user-1'
    
    return (
      <div key={miembro.usuarioId} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {miembro.usuario?.nombre?.charAt(0) || 'U'}
              </span>
            </div>
            
            {/* Badge de rol */}
            <div className="absolute -top-1 -right-1">
              {miembro.rol === 'propietario' && <Crown size={16} className="text-purple-500" />}
              {miembro.rol === 'administrador' && <Shield size={16} className="text-blue-500" />}
              {miembro.rol === 'moderador' && <Users size={16} className="text-green-500" />}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900 truncate">
                {miembro.usuario?.nombre || 'Usuari'}
                {esUsuarioActual && <span className="text-sm text-gray-500 ml-1">(Tu)</span>}
              </p>
              
              {miembro.usuario?.nick && (
                <p className="text-sm text-gray-500">@{miembro.usuario.nick}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize">{miembro.rol}</span>
              <span>•</span>
              <span>Membre des de {miembro.fechaUnion.toLocaleDateString()}</span>
              
              {miembro.estadisticas && (
                <>
                  <span>•</span>
                  <span>{miembro.estadisticas.postsRealizados} posts</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!esUsuarioActual && (
            <>
              {renderEstadoConexion(miembro.usuarioId)}
              
              <button 
                onClick={() => handleIniciarMensaje(miembro.usuarioId)}
                disabled={!esConectado(miembro.usuarioId)}
                className={`p-2 rounded-lg transition-colors ${
                  esConectado(miembro.usuarioId)
                    ? 'text-blue-600 hover:bg-blue-50'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <MessageCircle size={16} />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <MoreHorizontal size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const renderConexio = (conexion: any) => {
    const esOrigen = conexion.usuarioOrigenId === 'user-1'
    const usuarioConectat = esOrigen 
      ? miembrosGrupo.find(m => m.usuarioId === conexion.usuarioDestinoId)
      : miembrosGrupo.find(m => m.usuarioId === conexion.usuarioOrigenId)

    if (!usuarioConectat) return null

    return (
      <div key={conexion.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {usuarioConectat.usuario?.nombre?.charAt(0) || 'U'}
            </span>
          </div>
          
          <div>
            <p className="font-medium text-gray-900">
              {usuarioConectat.usuario?.nombre || 'Usuari'}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Connectat el {conexion.fechaRespuesta.toLocaleDateString()}</span>
              
              {conexion.mensajesIntercambiados > 0 && (
                <>
                  <span>•</span>
                  <span>{conexion.mensajesIntercambiados} missatges</span>
                </>
              )}
              
              {conexion.nivelConfianza > 1 && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Heart size={12} className="text-red-500" />
                    <span>Nivell {conexion.nivelConfianza}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              const otroUsuario = conexion.usuarioOrigenId === 'user-1' 
                ? conexion.usuarioDestinoId 
                : conexion.usuarioOrigenId
              handleIniciarMensaje(otroUsuario)
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <MessageCircle size={16} />
          </button>
          
          <button 
            onClick={() => eliminarConexion(conexion.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <UserX size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header amb estadístiques */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Connexions del Grup</h2>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{totalConexiones} connexions</span>
            </div>
            
            {solicitudesPendientes > 0 && (
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{solicitudesPendientes} pendents</span>
              </div>
            )}
          </div>
        </div>

        {/* Navegació */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'miembros', label: `Membres (${miembrosGrupo.length})`, icon: Users },
            { key: 'conexiones', label: `Connexions (${conexionesGrupo.length})`, icon: UserCheck },
            { key: 'solicitudes', label: `Sol·licituds (${solicitudesPendientes})`, icon: Clock }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setVistaActiva(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActiva === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Barra de cerca */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cercar membres..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Contingut principal */}
      <div className="space-y-4">
        {vistaActiva === 'miembros' && (
          <>
            {miembrosFiltrados.map(renderMiembro)}
          </>
        )}

        {vistaActiva === 'conexiones' && (
          <>
            {conexionesGrupo.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <UserCheck size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Encara no tens connexions en aquest grup
                </h3>
                <p className="text-gray-600">
                  Connecta amb altres membres per començar a col·laborar
                </p>
              </div>
            ) : (
              conexionesGrupo.map(renderConexio)
            )}
          </>
        )}

        {vistaActiva === 'solicitudes' && (
          <>
            {solicitudesRecibidas.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tens sol·licituds pendents
                </h3>
                <p className="text-gray-600">
                  Les noves sol·licituds de connexió apareixeran aquí
                </p>
              </div>
            ) : (
              solicitudesRecibidas.map(solicitud => {
                const usuariOrigen = miembrosGrupo.find(m => m.usuarioId === solicitud.usuarioOrigenId)
                
                return (
                  <div key={solicitud.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {usuariOrigen?.usuario?.nombre?.charAt(0) || 'U'}
                        </span>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {usuariOrigen?.usuario?.nombre || 'Usuari'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {solicitud.mensaje}
                        </p>
                        <p className="text-xs text-gray-500">
                          {solicitud.fechaSolicitud.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => aceptarSolicitud(solicitud.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        <Check size={14} />
                        <span>Acceptar</span>
                      </button>
                      
                      <button
                        onClick={() => rechazarSolicitud(solicitud.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X size={14} />
                        <span>Rebutjar</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}
      </div>

      {/* Modal per enviar sol·licitud de connexió */}
      {modalSolicitud.abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Connectar amb {modalSolicitud.nombre}
              </h3>
              <button
                onClick={() => setModalSolicitud({ abierto: false, usuarioId: '', nombre: '' })}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Missatge personalitzat (opcional)
                </label>
                <textarea
                  value={mensajeSolicitud}
                  onChange={(e) => setMensajeSolicitud(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Explica perquè t'agradaria connectar amb aquesta persona..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setModalSolicitud({ abierto: false, usuarioId: '', nombre: '' })}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel·lar
                </button>
                
                <button
                  onClick={handleEnviarSolicitud}
                  disabled={cargando}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {cargando ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <UserPlus size={16} />
                  )}
                  <span>Enviar sol·licitud</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de mensajería eliminado - sistema removido */}
    </div>
  )
}