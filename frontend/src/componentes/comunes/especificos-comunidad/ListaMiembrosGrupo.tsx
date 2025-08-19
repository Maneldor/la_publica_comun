'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useGruposAvanzados } from '../../../contextos/GruposAvanzadosContext'
import { useConexiones } from '../../../contextos/ConexionesContext'
import TarjetaMiembro, { type RolTipo } from './TarjetaMiembro'
import ModalPerfilUsuari from './ModalPerfilUsuari'
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Crown,
  Shield,
  UserCheck,
  UserPlus,
  MessageCircle,
  Mail,
  Clock,
  ChevronDown,
  Star,
  Activity
} from 'lucide-react'
import { MiembroGrupoAvanzado, RolGrupo } from '../../../../tipos/gruposAvanzados'

interface ListaMiembrosGrupoProps {
  grupoId: string
}

export default function ListaMiembrosGrupo({ grupoId }: ListaMiembrosGrupoProps) {
  const router = useRouter()
  const { grupoActivo, esAdminGrupo, cambiarRolMiembro, removerMiembro } = useGruposAvanzados()
  const { esConectado, enviarSolicitudConexion } = useConexiones()
  
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState<RolGrupo | 'todos'>('todos')
  const [ordenamiento, setOrdenamiento] = useState<'nombre' | 'fecha' | 'actividad'>('nombre')
  const [perfilSeleccionado, setPerfilSeleccionado] = useState<string | null>(null)
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null)
  
  const esAdmin = esAdminGrupo(grupoId)
  
  // Obtener miembros del grupo activo
  const miembros = grupoActivo?.miembros || []
  
  // Filtrar y ordenar miembros
  const miembrosFiltrados = useMemo(() => {
    let filtrados = [...miembros]
    
    // Filtrar por búsqueda
    if (busqueda) {
      filtrados = filtrados.filter(miembro => {
        const nick = miembro.usuario?.nick || `@user${miembro.usuarioId.slice(-1)}`
        return nick.toLowerCase().includes(busqueda.toLowerCase())
      })
    }
    
    // Filtrar por rol
    if (filtroRol !== 'todos') {
      filtrados = filtrados.filter(miembro => miembro.rol === filtroRol)
    }
    
    // Ordenar
    filtrados.sort((a, b) => {
      switch (ordenamiento) {
        case 'nombre':
          const nickA = a.usuario?.nick || `@user${a.usuarioId.slice(-1)}`
          const nickB = b.usuario?.nick || `@user${b.usuarioId.slice(-1)}`
          return nickA.localeCompare(nickB)
        case 'fecha':
          return b.fechaUnion.getTime() - a.fechaUnion.getTime()
        case 'actividad':
          const actividadA = a.fechaUltimaActividad || a.fechaUnion
          const actividadB = b.fechaUltimaActividad || b.fechaUnion
          return actividadB.getTime() - actividadA.getTime()
        default:
          return 0
      }
    })
    
    // Ordenar por rol (embaixador > admin > moderador > miembro)
    const ordenRoles = { embaixador: 0, administrador: 1, moderador: 2, miembro: 3 }
    filtrados.sort((a, b) => ordenRoles[a.rol] - ordenRoles[b.rol])
    
    return filtrados
  }, [miembros, busqueda, filtroRol, ordenamiento])
  
  // Estadísticas
  const estadisticas = {
    total: miembros.length,
    embaixadors: miembros.filter(m => m.rol === 'embaixador').length,
    administradores: miembros.filter(m => m.rol === 'administrador').length,
    moderadores: miembros.filter(m => m.rol === 'moderador').length,
    miembros: miembros.filter(m => m.rol === 'miembro').length,
    activos: miembros.filter(m => m.estado === 'activo').length
  }
  
  // Funciones utilitarias movidas al componente TarjetaMiembro unificado
  
  const handleConectar = async (miembro: MiembroGrupoAvanzado) => {
    if (grupoActivo) {
      await enviarSolicitudConexion(
        miembro.usuarioId, 
        grupoActivo.id,
        `Hola! M'agradaria connectar amb tu a través del grup ${grupoActivo.nombre}`
      )
    }
  }
  
  // Función de mensajería eliminada - sistema de mensajería removido
  
  const handleCambiarRol = async (usuarioId: string, nuevoRol: RolGrupo) => {
    await cambiarRolMiembro(grupoId, usuarioId, nuevoRol)
    setMenuAbierto(null)
  }
  
  const handleRemoverMiembro = async (usuarioId: string) => {
    if (confirm('Estàs segur que vols eliminar aquest membre del grup?')) {
      await removerMiembro(grupoId, usuarioId)
      setMenuAbierto(null)
    }
  }
  
  const renderTarjetaMiembro = (miembro: MiembroGrupoAvanzado) => {
    const esYo = miembro.usuarioId === 'user-1' // TODO: obtener del contexto de auth
    const conectado = esConectado(miembro.usuarioId)
    const nombre = miembro.usuario?.nombre || `Usuario ${miembro.usuarioId}`
    const nick = miembro.usuario?.nick || `@user${miembro.usuarioId.slice(-1)}`
    
    // Determinar estado de conexión
    const estadoConexion: 'conectado' | 'pendiente' | 'disponible' = conectado ? 'conectado' : 'disponible'

    // Mapear datos al formato del componente unificado
    const usuarioUnificado = {
      id: miembro.usuarioId,
      nombre: nombre,
      nick: nick,
      avatar: miembro.usuario?.avatar,
      rol: miembro.rol as RolTipo,
      estado: miembro.estado,
      fechaRegistro: miembro.fechaUnion,
      ultimaActividad: miembro.fechaUltimaActividad || miembro.fechaUnion,
      posts: miembro.postsCreados,
      comentarios: miembro.comentarios,
      verificado: true
    }

    return (
      <TarjetaMiembro
        key={miembro.usuarioId}
        usuario={usuarioUnificado}
        layout="compacto"
        estadoConexion={estadoConexion}
        esYo={esYo}
        esAdmin={esAdmin && !esYo && miembro.rol !== 'embaixador'}
        onConectar={() => handleConectar(miembro)}
        onVerPerfil={() => {
          setPerfilSeleccionado(miembro.usuarioId)
        }}
        onCambiarRol={(nuevoRol) => handleCambiarRol(miembro.usuarioId, nuevoRol)}
        onEliminar={() => handleRemoverMiembro(miembro.usuarioId)}
      />
    )
  }
  
  if (!grupoActivo) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <Users size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">No s'ha seleccionat cap grup</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Membres del grup ({estadisticas.total})
          </h2>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Actius:</span>
            <span className="font-medium text-gray-900">{estadisticas.activos}</span>
          </div>
        </div>
        
        {/* Mini estadísticas por rol */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {estadisticas.embaixadors > 0 && (
            <div className="flex items-center space-x-1">
              <Crown size={12} className="text-purple-500" />
              <span className="text-gray-600">Embaixadors: {estadisticas.embaixadors}</span>
            </div>
          )}
          {estadisticas.administradores > 0 && (
            <div className="flex items-center space-x-1">
              <Shield size={12} className="text-blue-500" />
              <span className="text-gray-600">Admins: {estadisticas.administradores}</span>
            </div>
          )}
          {estadisticas.moderadores > 0 && (
            <div className="flex items-center space-x-1">
              <Star size={12} className="text-yellow-500" />
              <span className="text-gray-600">Moderadors: {estadisticas.moderadores}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Users size={12} className="text-gray-500" />
            <span className="text-gray-600">Membres: {estadisticas.miembros}</span>
          </div>
        </div>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cercar membres per nick (@usuari)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          {/* Filtro por rol */}
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value as RolGrupo | 'todos')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Tots els rols</option>
            <option value="embaixador">Embaixadors</option>
            <option value="administrador">Administradors</option>
            <option value="moderador">Moderadors</option>
            <option value="miembro">Membres</option>
          </select>
          
          {/* Ordenamiento */}
          <select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value as 'nombre' | 'fecha' | 'actividad')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="nombre">Ordenar per nick</option>
            <option value="fecha">Ordenar per data d'unió</option>
            <option value="actividad">Ordenar per activitat</option>
          </select>
        </div>
      </div>
      
      {/* Lista de miembros */}
      {miembrosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {miembrosFiltrados.map(renderTarjetaMiembro)}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No s'han trobat membres
          </h3>
          <p className="text-gray-600">
            Prova canviant els filtres de cerca
          </p>
        </div>
      )}
      
      {/* Modal de perfil */}
      {perfilSeleccionado && (
        <ModalPerfilUsuari
          usuariId={perfilSeleccionado}
          obert={true}
          onTancar={() => setPerfilSeleccionado(null)}
        />
      )}
    </div>
  )
}