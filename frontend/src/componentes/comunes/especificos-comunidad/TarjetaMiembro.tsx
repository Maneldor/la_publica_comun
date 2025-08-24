'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotificacions } from '../../../contextos/NotificacionsContext'
import { useMissatges } from '../../../contextos/MissatgesContext'
import { obrirInterficieMissatges } from './MissatgesGlobal'
import { formatearFechaRelativa } from '../../../utils/formateoFechas'
import { 
  Crown, 
  Shield, 
  Star, 
  UserCheck, 
  UserPlus, 
  Clock, 
  MessageCircle, 
  Mail, 
  Activity, 
  Users,
  MoreVertical,
  CheckCircle 
} from 'lucide-react'

export type RolTipo = 'embaixador' | 'administrador' | 'moderador' | 'miembro' | 'membre'
export type EstadoConexion = 'conectado' | 'pendiente' | 'disponible'
export type LayoutTipo = 'compacto' | 'buddyboss' | 'horizontal' | 'admin'

export interface UsuarioBase {
  id: string
  nombre: string
  apellidos?: string
  nick?: string
  avatar?: string
  rol: RolTipo
  estado: 'activo' | 'inactivo'
  fechaRegistro?: Date
  ultimaActividad?: Date
  posts?: number
  comentarios?: number
  conexiones?: number
  verificado?: boolean
}

export interface TarjetaMiembroProps {
  usuario: UsuarioBase
  layout?: LayoutTipo
  estadoConexion?: EstadoConexion
  esYo?: boolean
  esAdmin?: boolean
  onConectar?: () => void
  onVerPerfil?: () => void
  onMissatge?: () => void
  onCambiarRol?: (nuevoRol: RolTipo) => void
  onEliminar?: () => void
  className?: string
}

export default function TarjetaMiembro({
  usuario,
  layout = 'compacto',
  estadoConexion = 'disponible',
  esYo = false,
  esAdmin = false,
  onConectar,
  onVerPerfil,
  onMissatge,
  onCambiarRol,
  onEliminar,
  className = ''
}: TarjetaMiembroProps) {
  const router = useRouter()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { enviarSolicitudConnexio } = useNotificacions()
  const { crearConversa, pucEnviarMissatges } = useMissatges()

  // Funciones utilitarias
  const obtenerIconoRol = (rol: RolTipo) => {
    switch (rol) {
      case 'embaixador':
        return <Crown size={14} className="text-purple-500" />
      case 'administrador':
        return <Shield size={14} className="text-blue-500" />
      case 'moderador':
        return <Star size={14} className="text-yellow-500" />
      default:
        return null
    }
  }

  const obtenerColorRol = (rol: RolTipo) => {
    switch (rol) {
      case 'embaixador':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'administrador':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'moderador':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // ✅ USANDO FUNCIÓN CENTRALIZADA DE FORMATEO

  const obtenerNombreCompleto = () => {
    // Si no té nombre, mostrar només el nick
    if (!usuario.nombre) {
      return usuario.nick
    }
    
    // Si té nom i cognoms
    return usuario.apellidos 
      ? `${usuario.nombre} ${usuario.apellidos}`
      : usuario.nombre
  }

  const obtenerIniciales = () => {
    if (usuario.nick) return usuario.nick.charAt(1)?.toUpperCase() || 'U'
    
    const nombreCompleto = obtenerNombreCompleto()
    const palabras = nombreCompleto?.split(' ') || []
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase()
    }
    return nombreCompleto?.charAt(0).toUpperCase() || 'U'
  }

  const manejarClickPerfil = () => {
    if (onVerPerfil) {
      onVerPerfil()
    } else if (esYo) {
      router.push('/perfil')
    } else {
      router.push(`/perfil/${usuario.id}`)
    }
  }

  const manejarClickConectar = async () => {
    if (onConectar) {
      // Si hi ha una funció personalitzada (per exemple, per grups), usar-la
      onConectar()
    } else {
      // Sinó, usar el sistema de notificacions per defecte
      try {
        await enviarSolicitudConnexio(
          usuario.id,
          'professional',
          `Hola ${usuario.nick || usuario.nombre}! M'agradaria connectar amb tu a La Pública.`
        )
        // Opcional: mostrar missatge de confirmació
        console.log(`Sol·licitud de connexió enviada a ${usuario.nombre}`)
      } catch (error) {
        console.error('Error enviant sol·licitud:', error)
      }
    }
  }

  const manejarClickMissatge = async () => {
    console.log('Clic al botó de missatge per:', usuario.nombre, usuario.id)
    
    if (onMissatge) {
      // Si hi ha una funció personalitzada, usar-la
      console.log('Usant funció personalitzada onMissatge')
      onMissatge()
    } else if (pucEnviarMissatges(usuario.id)) {
      // Redirigir a la pàgina principal de missatges amb el usuari seleccionat
      console.log('Redirigint a pàgina de missatges amb usuari:', usuario.id)
      const urlParams = new URLSearchParams()
      urlParams.set('iniciarConversa', usuario.id)
      urlParams.set('usuariNom', usuario.nombre)
      if (usuario.avatar) {
        urlParams.set('usuariAvatar', usuario.avatar)
      }
      
      // Usar router.push amb paràmetres
      router.push(`/missatges?${urlParams.toString()}`)
    } else {
      console.log('No es pot enviar missatges - no connectat')
      alert('No pots enviar missatges a aquest usuari. Primer heu de connectar.')
    }
  }

  // Renderizado de Avatar
  const renderAvatar = () => (
    <div className="relative flex-shrink-0">
      <button onClick={manejarClickPerfil} className="block">
        {usuario.avatar ? (
          <img 
            src={usuario.avatar} 
            alt={usuario.nick || obtenerNombreCompleto()}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:shadow-md transition-shadow"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-sm">
              {obtenerIniciales()}
            </span>
          </div>
        )}
      </button>
      
      {/* Indicador de estado */}
      {usuario.estado === 'activo' && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  )

  // Renderizado de info básica
  const renderInfoBasica = () => (
    <div className="flex-1 min-w-0">
      <h3 
        className="font-semibold text-gray-900 text-base truncate hover:text-blue-600 transition-colors cursor-pointer mb-1"
        onClick={manejarClickPerfil}
      >
        {obtenerNombreCompleto()}
        {esYo && <span className="text-sm text-gray-500 ml-1">(Tu)</span>}
      </h3>
      
      {/* Mostrar nick només si és diferent del nom mostrat */}
      {usuario.nombre && (
        <p className="text-sm text-gray-500">{usuario.nick}</p>
      )}
      
      {/* Badges */}
      <div className="flex items-center space-x-2 flex-wrap">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${obtenerColorRol(usuario.rol)}`}>
          {obtenerIconoRol(usuario.rol)}
          <span className="capitalize">{usuario.rol === 'miembro' ? 'membre' : usuario.rol}</span>
        </span>
        
        {estadoConexion === 'conectado' && (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <UserCheck size={12} />
            <span>Connectat</span>
          </span>
        )}
      </div>
    </div>
  )

  // Renderizado de estadísticas
  const renderEstadisticas = () => (
    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
      {usuario.fechaRegistro && (
        <div className="flex items-center space-x-1 text-gray-600">
          <Clock size={12} />
          <span>Unit {formatearFechaRelativa(usuario.fechaRegistro)}</span>
        </div>
      )}
      {usuario.ultimaActividad && (
        <div className="flex items-center space-x-1 text-gray-600">
          <Activity size={12} />
          <span>Actiu {formatearFechaRelativa(usuario.ultimaActividad)}</span>
        </div>
      )}
      {usuario.posts !== undefined && (
        <div className="flex items-center space-x-1 text-gray-600">
          <MessageCircle size={12} />
          <span>{usuario.posts} posts</span>
        </div>
      )}
      {usuario.conexiones !== undefined && (
        <div className="flex items-center space-x-1 text-gray-600">
          <Mail size={12} />
          <span>{usuario.conexiones} connexions</span>
        </div>
      )}
    </div>
  )

  // Renderizado de botones de conexión
  const renderBotonConexion = () => {
    if (estadoConexion === 'conectado') {
      return (
        <button 
          disabled
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg cursor-not-allowed"
        >
          <UserCheck size={14} />
          <span>Connectat</span>
        </button>
      )
    }
    
    if (estadoConexion === 'pendiente') {
      return (
        <button 
          disabled
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg cursor-not-allowed"
        >
          <Clock size={14} />
          <span>Pendent</span>
        </button>
      )
    }
    
    return (
      <button
        onClick={manejarClickConectar}
        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
      >
        <UserPlus size={14} />
        <span>Connectar</span>
      </button>
    )
  }

  // Renderizado de menú admin
  const renderMenuAdmin = () => {
    if (!esAdmin || esYo || usuario.rol === 'embaixador') return null

    return (
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>
        
        {menuAbierto && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                onCambiarRol?.('administrador')
                setMenuAbierto(false)
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              Fer administrador
            </button>
            <button
              onClick={() => {
                onCambiarRol?.('moderador')
                setMenuAbierto(false)
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              Fer moderador
            </button>
            <button
              onClick={() => {
                onCambiarRol?.('miembro')
                setMenuAbierto(false)
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              Fer membre regular
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                onEliminar?.()
                setMenuAbierto(false)
              }}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              Eliminar del grup
            </button>
          </div>
        )}
      </div>
    )
  }

  // Layout Compacto (por defecto)
  if (layout === 'compacto') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden relative ${className}`}>
        {renderMenuAdmin()}
        
        <div className="p-4">
          {/* Avatar y info básica */}
          <div className="flex items-start space-x-3 mb-3">
            {renderAvatar()}
            {renderInfoBasica()}
          </div>
          
          {/* Estadísticas */}
          {renderEstadisticas()}
          
          {/* Botones de acción */}
          {!esYo && (
            <div className="space-y-2">
              {/* Primera fila: Conectar o Mensaje (si ya conectado) */}
              <div className="flex space-x-2">
                {estadoConexion === 'conectado' ? (
                  <button
                    onClick={manejarClickMissatge}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                    title={`Enviar missatge a ${usuario.nombre} (estat: ${estadoConexion})`}
                  >
                    <MessageCircle size={14} />
                    <span>Missatge</span>
                  </button>
                ) : estadoConexion === 'pendiente' ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg cursor-not-allowed"
                    title={`Sol·licitud pendent amb ${usuario.nombre}`}
                  >
                    <Clock size={14} />
                    <span>Pendent</span>
                  </button>
                ) : (
                  renderBotonConexion()
                )}
              </div>
              
              {/* Segunda fila: Ver perfil */}
              <div className="flex">
                <button
                  onClick={manejarClickPerfil}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Veure perfil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Layout BuddyBoss
  if (layout === 'buddyboss') {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all ${className}`}>
        {/* Header con gradiente */}
        <div className="h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          {/* Avatar sobresaliente */}
          <div className="absolute -bottom-8 left-4">
            <div className="relative">
              {usuario.avatar ? (
                <img 
                  src={usuario.avatar} 
                  alt={obtenerNombreCompleto()}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {obtenerIniciales()}
                  </span>
                </div>
              )}
              
              {/* Indicador de estado */}
              {usuario.estado === 'activo' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="pt-10 p-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {obtenerNombreCompleto()}
            </h3>
            {usuario.ultimaActividad && (
              <p className="text-sm text-gray-500">
                Actiu {formatearFechaRelativa(usuario.ultimaActividad)}
              </p>
            )}
          </div>

          {/* Badge de rol centrado */}
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${obtenerColorRol(usuario.rol)}`}>
              {obtenerIconoRol(usuario.rol)}
              <span className="capitalize">{usuario.rol}</span>
            </span>
          </div>

          {/* Botones */}
          {!esYo && (
            <div className="space-y-2">
              <div className="flex space-x-2">
                {estadoConexion === 'conectado' ? (
                  <button
                    onClick={manejarClickMissatge}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                    title={`Enviar missatge a ${usuario.nombre} (estat: ${estadoConexion})`}
                  >
                    <MessageCircle size={14} />
                    <span>Missatge</span>
                  </button>
                ) : estadoConexion === 'pendiente' ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg cursor-not-allowed"
                  >
                    <Clock size={14} />
                    <span>Pendent</span>
                  </button>
                ) : (
                  renderBotonConexion()
                )}
              </div>
              
              <div className="flex">
                <button
                  onClick={manejarClickPerfil}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Veure perfil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Layout Horizontal - Redisseny més estilitzat i allargat
  if (layout === 'horizontal') {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden group ${className}`}>
        {/* Barra superior amb gradient */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        <div className="p-5">
          <div className="flex items-center space-x-4">
            {/* Avatar millorat */}
            <div className="relative flex-shrink-0">
              <button onClick={manejarClickPerfil} className="block group-hover:scale-105 transition-transform">
                {usuario.avatar ? (
                  <img 
                    src={usuario.avatar} 
                    alt={usuario.nick || obtenerNombreCompleto()}
                    className="w-16 h-16 rounded-full border-3 border-white shadow-lg hover:shadow-xl transition-shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:shadow-xl transition-shadow">
                    <span className="text-white font-bold text-lg">
                      {obtenerIniciales()}
                    </span>
                  </div>
                )}
              </button>
              
              {/* Indicador de estat millorat */}
              {usuario.estado === 'activo' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full shadow-sm">
                  <div className="w-full h-full rounded-full animate-pulse bg-green-400"></div>
                </div>
              )}
            </div>
            
            {/* Informació principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Nom i nick */}
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 
                      className="font-bold text-lg text-gray-900 truncate hover:text-blue-600 transition-colors cursor-pointer"
                      onClick={manejarClickPerfil}
                    >
                      {obtenerNombreCompleto()}
                    </h3>
                    {usuario.verificado && (
                      <CheckCircle size={16} className="text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{usuario.nick}</p>
                  
                  {/* Estadístiques en una sola línia */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    {usuario.fechaRegistro && (
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Unit {formatearFechaRelativa(usuario.fechaRegistro)}</span>
                      </div>
                    )}
                    {usuario.ultimaActividad && (
                      <div className="flex items-center space-x-1">
                        <Activity size={12} />
                        <span>Actiu {formatearFechaRelativa(usuario.ultimaActividad)}</span>
                      </div>
                    )}
                    {usuario.posts !== undefined && (
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={12} />
                        <span>{usuario.posts} posts</span>
                      </div>
                    )}
                    {usuario.conexiones !== undefined && (
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{usuario.conexiones} connexions</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border-2 ${obtenerColorRol(usuario.rol)} shadow-sm`}>
                      {obtenerIconoRol(usuario.rol)}
                      <span className="capitalize">{usuario.rol === 'miembro' ? 'membre' : usuario.rol}</span>
                    </span>
                    
                    {estadoConexion === 'conectado' && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border-2 border-green-200">
                        <UserCheck size={12} />
                        <span>Connectat</span>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Botones d'acció */}
                {!esYo && (
                  <div className="flex flex-col space-y-2 ml-4">
                    {estadoConexion === 'conectado' ? (
                      <button
                        onClick={manejarClickMissatge}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm hover:shadow-md"
                        title={`Enviar missatge a ${usuario.nombre}`}
                      >
                        <MessageCircle size={16} />
                        <span>Missatge</span>
                      </button>
                    ) : estadoConexion === 'pendiente' ? (
                      <button
                        disabled
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg cursor-not-allowed border border-yellow-200"
                      >
                        <Clock size={16} />
                        <span>Pendent</span>
                      </button>
                    ) : (
                      <button
                        onClick={manejarClickConectar}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
                      >
                        <UserPlus size={16} />
                        <span>Connectar</span>
                      </button>
                    )}
                    
                    <button
                      onClick={manejarClickPerfil}
                      className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Veure perfil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Layout por defecto (compacto)
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden relative ${className}`}>
      {renderMenuAdmin()}
      
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          {renderAvatar()}
          {renderInfoBasica()}
        </div>
        
        {renderEstadisticas()}
        
        {!esYo && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              renderBotonConexion()
            </div>
            
            <div className="flex">
              <button
                onClick={manejarClickPerfil}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Veure perfil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}