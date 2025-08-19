'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useComunidad } from '../ComunidadContext'
import { useUsuario } from '../../src/contextos/UsuarioContext'

export default function PerfilPage() {
  const { configuracion } = useComunidad()
  const router = useRouter()
  
  // Estado para las pestañas activas
  const [activeTab, setActiveTab] = useState('timeline')
  
  // Función para generar avatar con iniciales
  const generarAvatar = (nombre: string, apellidos: string) => {
    const iniciales = `${nombre.charAt(0)}${apellidos.charAt(0)}`.toUpperCase()
    const colores = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ]
    // Usar hash simple basado en el nombre para consistencia
    const hash = (nombre + apellidos).split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const colorIndex = hash % colores.length
    return {
      iniciales,
      colorClass: colores[colorIndex]
    }
  }

  // Función para generar gradiente de portada
  const generarPortada = (nombre: string) => {
    const gradientes = [
      'from-blue-600 via-purple-600 to-blue-800',
      'from-green-600 via-teal-600 to-blue-600',
      'from-purple-600 via-pink-600 to-red-600',
      'from-yellow-600 via-red-600 to-pink-600',
      'from-indigo-600 via-purple-600 to-pink-600'
    ]
    const hash = nombre.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const gradientIndex = hash % gradientes.length
    return gradientes[gradientIndex]
  }
  
  // Obtener datos del usuario desde el contexto
  const { usuario } = useUsuario()
  
  // Estado para forzar re-render cuando cambien los datos
  const [, setForceUpdate] = useState({})
  
  // Escuchar cambios en el usuario para actualizar la vista
  useEffect(() => {
    console.log('👤 Usuario actualizado en perfil:', usuario)
    setForceUpdate({}) // Forzar re-render
  }, [usuario])
  
  // Función para obtener el valor de un campo con privacidad
  const obtenerValor = (campo: any) => {
    if (campo && typeof campo === 'object' && 'valor' in campo) {
      return campo.valor
    }
    return campo || ''
  }

  // Estados para el perfil - solo datos reales del contexto
  const userData = useMemo(() => {
    if (!usuario) return null
    
    console.log('🔄 Recalculando userData con usuario:', usuario)
    
    return {
      // Datos básicos del registro
      nombre: obtenerValor(usuario.nombre) || '',
      apellidos: obtenerValor(usuario.apellidos) || '',
      nick: usuario.nick || '',
      email: usuario.email || '',
      comunidad: usuario.comunidad || '',
      
      // Datos opcionales (pueden estar vacíos)
      biografia: obtenerValor(usuario.biografia) || '',
      ubicacion: obtenerValor(usuario.ubicacion) || '',
      fechaNacimiento: obtenerValor(usuario.fechaNacimiento) || '',
      genero: obtenerValor(usuario.genero) || '',
      
      // Información laboral (puede estar vacía)
      puesto: obtenerValor(usuario.puesto) || '',
      organizacion: obtenerValor(usuario.organizacion) || '',
      departamento: obtenerValor(usuario.departamento) || '',
      anyosExperiencia: obtenerValor(usuario.anyosExperiencia) || '',
      grupoFuncionario: obtenerValor(usuario.grupoFuncionario) || '',
      especialidades: obtenerValor(usuario.especialidades) || [],
      
      // Datos del perfil
      rol: usuario.rol || 'miembro',
      estado: usuario.estado || 'activo',
      fechaRegistro: usuario.fechaRegistro || '',
      ultimaActividad: usuario.ultimaActividad || '',
      verificado: usuario.verificado || false,
      
      // Estadísticas
      posts: usuario.posts || 0,
      comentarios: usuario.comentarios || 0,
      conexiones: usuario.conexiones || 0,
      
      // Fotos
      fotoPerfil: usuario.fotoPerfil || null,
      fotoPortada: usuario.fotoPortada || null
    }
  }, [usuario])

  // Debug: mostrar estado del usuario
  console.log('🔍 Estado del usuario en perfil:', usuario)
  console.log('🔍 UserData calculado:', userData)

  // Mostrar loading si no hay usuario
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: No se pudieron cargar los datos del usuario</p>
          <p className="text-gray-600 mt-2">Usuario: {JSON.stringify(usuario)}</p>
        </div>
      </div>
    )
  }

  // Datos de actividad del usuario
  const actividades = [
    {
      id: 1,
      tipo: 'post',
      contenido: 'Acabo de completar el curso de transformación digital en la administración pública. ¡Muy recomendable para todos los compañeros!',
      timestamp: '2 horas',
      likes: 12,
      comentarios: 3,
      imagen: null
    },
    {
      id: 2,
      tipo: 'grupo',
      contenido: 'Se unió al grupo "Oposiciones A1 Catalunya 2024"',
      timestamp: '1 día',
      grupo: 'Oposiciones A1 Catalunya 2024',
      miembros: 847
    },
    {
      id: 3,
      tipo: 'documento',
      contenido: 'Compartió el documento "Guía de Contratación Pública 2024"',
      timestamp: '3 días',
      documento: 'Guía de Contratación Pública 2024.pdf',
      descargas: 156
    },
    {
      id: 4,
      tipo: 'logro',
      contenido: 'Completó 5 años de servicio',
      timestamp: '1 semana',
      logro: '5 años de servicio'
    }
  ]

  const conexiones = [
    { id: 1, nombre: 'Laura García', cargo: 'Administrativa', organismo: 'Ajuntament Barcelona', foto: null },
    { id: 2, nombre: 'Joan Martí', cargo: 'Técnico', organismo: 'Generalitat', foto: null },
    { id: 3, nombre: 'Ana Ruiz', cargo: 'Gestora', organismo: 'Diputació Barcelona', foto: null },
    { id: 4, nombre: 'Carlos Vega', cargo: 'Coordinador', organismo: 'Generalitat', foto: null }
  ]

  const todosLosGrupos = [
    { id: 1, nombre: 'Empleados Públicos Catalunya', miembros: 1247, tipo: 'público', grupoPadre: null },
    { id: 2, nombre: 'Oposiciones A1 2024', miembros: 847, tipo: 'privado', grupoPadre: null },
    { id: 3, nombre: 'Innovación Administrativa', miembros: 423, tipo: 'público', grupoPadre: null },
    { id: 4, nombre: 'Gestión de Proyectos', miembros: 356, tipo: 'privado', grupoPadre: null },
    { id: 5, nombre: 'Grupo Oculto Administradores', miembros: 12, tipo: 'oculto', grupoPadre: null },
    { id: 6, nombre: 'Profesionales Recursos Humanos', miembros: 89, tipo: 'profesional', grupoPadre: null },
    // Subgrupos - heredan privacidad del grupo padre
    { id: 7, nombre: 'Subgrupo Barcelona - Empleados Públicos', miembros: 234, tipo: 'público', grupoPadre: 1 },
    { id: 8, nombre: 'Subgrupo A1 Administrativo', miembros: 156, tipo: 'privado', grupoPadre: 2 },
    { id: 9, nombre: 'Subgrupo Innovación Digital', miembros: 87, tipo: 'público', grupoPadre: 3 },
    { id: 10, nombre: 'Subgrupo Secreto Admin', miembros: 5, tipo: 'oculto', grupoPadre: 5 },
    { id: 11, nombre: 'Subgrupo RH Técnico', miembros: 23, tipo: 'profesional', grupoPadre: 6 }
  ]

  // Filtrar solo grupos y subgrupos públicos para mostrar en el perfil
  // Los grupos/subgrupos privados, profesionales y ocultos no se muestran por privacidad
  const grupos = todosLosGrupos.filter(grupo => {
    // Si tiene grupo padre, verificar que tanto el grupo como el padre sean públicos
    if (grupo.grupoPadre !== null) {
      const grupoPadre = todosLosGrupos.find(g => g.id === grupo.grupoPadre)
      return grupo.tipo === 'público' && grupoPadre?.tipo === 'público'
    }
    // Si es un grupo raíz, solo verificar su propio tipo
    return grupo.tipo === 'público'
  })

  // Manejadores para las imágenes

  const renderTimelineTab = () => (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-4">
          <div className={`w-12 h-12 ${userData.fotoPerfil ? 'bg-gray-200' : generarAvatar(userData.nombre, userData.apellidos).colorClass} rounded-full flex items-center justify-center`}>
            {userData.fotoPerfil ? (
              <img src={userData.fotoPerfil} alt="Perfil" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-white font-bold">
                {generarAvatar(userData.nombre, userData.apellidos).iniciales}
              </span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              placeholder={`¿Qué estás pensando, ${userData.nombre}?`}
              className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Foto</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Documento</span>
                </button>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {actividades.map((actividad) => (
        <div key={actividad.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">MD</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{userData.nombre} {userData.apellidos}</h3>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 text-sm">hace {actividad.timestamp}</span>
              </div>
              
              <p className="text-gray-800 mb-4">{actividad.contenido}</p>
              
              {actividad.tipo === 'grupo' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{actividad.grupo}</h4>
                      <p className="text-sm text-gray-600">{actividad.miembros} miembros</p>
                    </div>
                  </div>
                </div>
              )}
              
              {actividad.tipo === 'documento' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{actividad.documento}</h4>
                      <p className="text-sm text-gray-600">{actividad.descargas} descargas</p>
                    </div>
                  </div>
                </div>
              )}
              
              {actividad.tipo === 'logro' && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">¡Logro desbloqueado!</h4>
                      <p className="text-sm text-gray-600">{actividad.logro}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {actividad.tipo === 'post' && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{actividad.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{actividad.comentarios}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.062 18 14.518 18 14c0-.482.114-.938.316-1.342m0 2.684a3 3 0 110-2.684M6.684 10.658C6.886 10.254 7 9.798 7 9.316m0 2.684a3 3 0 110-2.684" />
                      </svg>
                      <span>Compartir</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderAboutTab = () => (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
              {userData.nombre} {userData.apellidos}
            </div>
          </div>
          {userData.nick && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nick</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                {userData.nick}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              {userData.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comunidad</label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              Catalunya
            </div>
          </div>
          {userData.biografia && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[80px]">
                {userData.biografia}
              </div>
            </div>
          )}
          {userData.ubicacion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.ubicacion}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Información Laboral */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.puesto && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Puesto</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.puesto}
              </div>
            </div>
          )}
          {userData.organizacion && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organización</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.organizacion}
              </div>
            </div>
          )}
          {userData.departamento && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.departamento}
              </div>
            </div>
          )}
          {userData.grupoFuncionario && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grupo Funcionario</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.grupoFuncionario}
              </div>
            </div>
          )}
          {userData.anyosExperiencia && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Años de Experiencia</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.anyosExperiencia}
              </div>
            </div>
          )}
          {userData.fechaRegistro && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Registro</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                {userData.fechaRegistro}
              </div>
            </div>
          )}
          {userData.especialidades && userData.especialidades.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {userData.especialidades.map((esp: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {esp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userData.posts}</div>
            <div className="text-sm text-gray-600">Publicaciones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userData.comentarios}</div>
            <div className="text-sm text-gray-600">Comentarios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userData.conexiones}</div>
            <div className="text-sm text-gray-600">Conexiones</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderConnectionsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conexiones ({conexiones.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conexiones.map((conexion) => (
            <div key={conexion.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {conexion.nombre.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{conexion.nombre}</h4>
                <p className="text-sm text-gray-600">{conexion.cargo}</p>
                <p className="text-xs text-gray-500">{conexion.organismo}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGroupsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis Grupos ({grupos.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grupos.map((grupo) => (
            <div key={grupo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${grupo.tipo === 'público' ? 'bg-green-500' : 'bg-blue-500'} rounded-lg flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{grupo.nombre}</h4>
                  <p className="text-sm text-gray-600">{grupo.miembros} miembros</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${grupo.tipo === 'público' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {grupo.tipo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

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
            
            <a href="/perfil" className="flex items-center space-x-3 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Mi Perfil</span>
            </a>
            
            <a href="/miembros" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 515 0z" />
              </svg>
              <span>Miembros</span>
            </a>
            
            <a href="/grupos" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
        {/* Cover Photo */}
        <div className={`relative h-80 bg-gradient-to-r ${userData.fotoPortada ? '' : generarPortada(userData.nombre)}`}>
          {userData.fotoPortada && (
            <img src={userData.fotoPortada} alt="Portada" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white shadow-sm relative">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-end space-x-6">
              {/* Profile Photo */}
              <div className="relative -mt-20">
                <div className={`w-40 h-40 ${userData.fotoPerfil ? 'bg-gray-200' : generarAvatar(userData.nombre, userData.apellidos).colorClass} rounded-full border-6 border-white shadow-xl flex items-center justify-center overflow-hidden`}>
                  {userData.fotoPerfil ? (
                    <img src={userData.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl text-white font-bold">
                      {generarAvatar(userData.nombre, userData.apellidos).iniciales}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userData.nombre} {userData.apellidos}
                  </h1>
                  {userData.verificado && (
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">{userData.ultimaActividad || 'En línea'}</span>
                  </div>
                </div>
                
                {/* Mostrar datos solo si existen */}
                {userData.nick && (
                  <p className="text-lg text-blue-600 mb-1">{userData.nick}</p>
                )}
                
                {(userData.puesto || userData.organizacion) && (
                  <p className="text-gray-500 mb-2">
                    {userData.puesto && userData.organizacion ? 
                      `${userData.puesto} • ${userData.organizacion}` :
                      userData.puesto || userData.organizacion
                    }
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  {userData.ubicacion && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{userData.ubicacion}</span>
                    </div>
                  )}
                  
                  {userData.fechaRegistro && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Miembro desde {userData.fechaRegistro}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/perfil/editar')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Editar perfil</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'timeline', label: 'Timeline', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'about', label: 'Acerca de', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'connections', label: 'Conexiones', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { id: 'groups', label: 'Grupos', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {activeTab === 'timeline' && renderTimelineTab()}
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'connections' && renderConnectionsTab()}
          {activeTab === 'groups' && renderGroupsTab()}
        </div>
      </div>
    </div>
  )
}