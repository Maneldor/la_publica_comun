import React, { useState, useEffect } from 'react';
import { useTema } from '../../../../hooks/useComunidad';
import { Post, Grupo, Usuario, MiembroGrupo } from '../../../../tipos/redSocial';
import TarjetaPost from './TarjetaPost';
import { 
  Plus, 
  Filter, 
  TrendingUp, 
  Users, 
  Calendar,
  MessageCircle,
  Pin,
  Star,
  RefreshCw,
  Search,
  Settings,
  Bell,
  Hash,
  Image,
  Video,
  FileText,
  Link,
  MapPin,
  Clock,
  Eye,
  MoreHorizontal,
  Flag,
  Shield,
  Crown,
  UserPlus,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Boton } from './ui/Boton';
import { Tarjeta, EncabezadoTarjeta, ContenidoTarjeta } from './ui/Tarjeta';

interface PropiedadesFeedGrupo {
  grupo: Grupo;
  usuario: Usuario;
  posts: Post[];
  miembrosRecientes: MiembroGrupo[];
  estadisticasGrupo: {
    postsHoy: number;
    postsEstesMes: number;
    miembrosActivos: number;
    interaccionesPromedio: number;
  };
  rolUsuario: 'administrador' | 'moderador' | 'miembro' | 'no-miembro';
  onCrearPost?: () => void;
  onFijarPost?: (postId: string) => void;
  onEliminarPost?: (postId: string) => void;
  onModerarPost?: (postId: string, accion: 'aprobar' | 'rechazar') => void;
  onCargarMasPosts?: () => void;
  onInvitarMiembros?: () => void;
  onGestionarGrupo?: () => void;
  className?: string;
}

type FiltroFeedGrupo = 'recientes' | 'populares' | 'fijados' | 'pendientes' | 'mis-posts';
type TipoContenido = 'todos' | 'texto' | 'imagen' | 'video' | 'enlace' | 'evento' | 'oferta' | 'demanda';

/**
 * Feed de actividad específico para un grupo
 */
export const FeedGrupo: React.FC<PropiedadesFeedGrupo> = ({
  grupo,
  usuario,
  posts,
  miembrosRecientes,
  estadisticasGrupo,
  rolUsuario,
  onCrearPost,
  onFijarPost,
  onEliminarPost,
  onModerarPost,
  onCargarMasPosts,
  onInvitarMiembros,
  onGestionarGrupo,
  className = ''
}) => {
  const { colores } = useTema();
  const [filtroActivo, setFiltroActivo] = useState<FiltroFeedGrupo>('recientes');
  const [tipoContenido, setTipoContenido] = useState<TipoContenido>('todos');
  const [postsFiltrados, setPostsFiltrados] = useState(posts);
  const [cargandoPosts, setCargandoPosts] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Filtros disponibles según el rol
  const obtenerFiltrosDisponibles = () => {
    const filtrosBase = [
      { id: 'recientes', nombre: 'Recientes', icono: <Clock size={16} /> },
      { id: 'populares', nombre: 'Populares', icono: <TrendingUp size={16} /> },
      { id: 'fijados', nombre: 'Fijados', icono: <Pin size={16} /> },
      { id: 'mis-posts', nombre: 'Mis Posts', icono: <Users size={16} /> }
    ];

    if (rolUsuario === 'administrador' || rolUsuario === 'moderador') {
      filtrosBase.push({
        id: 'pendientes',
        nombre: 'Pendientes',
        icono: <Flag size={16} />
      });
    }

    return filtrosBase;
  };

  // Tipos de contenido
  const tiposContenido = [
    { id: 'todos', nombre: 'Todos', icono: <Hash size={16} /> },
    { id: 'texto', nombre: 'Texto', icono: <MessageCircle size={16} /> },
    { id: 'imagen', nombre: 'Imágenes', icono: <Image size={16} /> },
    { id: 'video', nombre: 'Videos', icono: <Video size={16} /> },
    { id: 'enlace', nombre: 'Enlaces', icono: <Link size={16} /> },
    { id: 'evento', nombre: 'Eventos', icono: <Calendar size={16} /> },
    { id: 'oferta', nombre: 'Ofertas', icono: <Star size={16} /> },
    { id: 'demanda', nombre: 'Demandas', icono: <Search size={16} /> }
  ];

  // Aplicar filtros
  useEffect(() => {
    let filtrados = [...posts];

    // Filtrar por búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(post => 
        post.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
        post.etiquetas.some(tag => tag.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    // Filtrar por tipo de contenido
    if (tipoContenido !== 'todos') {
      filtrados = filtrados.filter(post => post.tipo === tipoContenido);
    }

    // Aplicar filtro principal
    switch (filtroActivo) {
      case 'recientes':
        filtrados = filtrados.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
        break;
      case 'populares':
        filtrados = filtrados.sort((a, b) => {
          const engagementA = Object.values(a.estadisticas.reacciones).reduce((sum, count) => sum + count, 0) + a.estadisticas.comentarios;
          const engagementB = Object.values(b.estadisticas.reacciones).reduce((sum, count) => sum + count, 0) + b.estadisticas.comentarios;
          return engagementB - engagementA;
        });
        break;
      case 'fijados':
        filtrados = filtrados.filter(post => post.fijado);
        break;
      case 'pendientes':
        filtrados = filtrados.filter(post => !post.moderado);
        break;
      case 'mis-posts':
        filtrados = filtrados.filter(post => post.autorId === usuario.id);
        break;
    }

    setPostsFiltrados(filtrados);
  }, [filtroActivo, tipoContenido, busqueda, posts, usuario.id]);

  // Widget de información del grupo
  const WidgetInfoGrupo = () => (
    <Tarjeta className="mb-6">
      <ContenidoTarjeta>
        <div className="flex items-start space-x-4">
          {grupo.avatar ? (
            <img
              src={grupo.avatar}
              alt={grupo.nombre}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: colores.primario }}
            >
              {grupo.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {grupo.nombre}
            </h2>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {grupo.descripcion}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Users size={14} className="mr-1" />
                {grupo.estadisticas.totalMiembros} miembros
              </span>
              <span className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                {estadisticasGrupo.postsEstesMes} posts/mes
              </span>
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {grupo.tipo === 'publico' ? 'Público' : grupo.tipo === 'privado' ? 'Privado' : 'Oculto'}
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas de actividad */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {estadisticasGrupo.postsHoy}
              </div>
              <div className="text-xs text-gray-500">Posts hoy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {estadisticasGrupo.miembrosActivos}
              </div>
              <div className="text-xs text-gray-500">Activos</div>
            </div>
          </div>
        </div>

        {/* Acciones según rol */}
        <div className="mt-4 space-y-2">
          {onCrearPost && (
            <Boton
              variante="primario"
              tamaño="sm"
              ancho="completo"
              onClick={onCrearPost}
              icono={<Plus size={16} />}
            >
              Crear post en el grupo
            </Boton>
          )}
          
          <div className="flex space-x-2">
            {(rolUsuario === 'administrador' || rolUsuario === 'moderador') && onInvitarMiembros && (
              <Boton
                variante="outline"
                tamaño="sm"
                onClick={onInvitarMiembros}
                icono={<UserPlus size={16} />}
              >
                Invitar
              </Boton>
            )}
            
            {rolUsuario === 'administrador' && onGestionarGrupo && (
              <Boton
                variante="ghost"
                tamaño="sm"
                onClick={onGestionarGrupo}
                icono={<Settings size={16} />}
              />
            )}
          </div>
        </div>
      </ContenidoTarjeta>
    </Tarjeta>
  );

  // Widget de miembros recientes
  const WidgetMiembrosRecientes = () => (
    <Tarjeta className="mb-6">
      <EncabezadoTarjeta>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Miembros Recientes</h3>
          <a href={`/grupos/${grupo.id}/miembros`} className="text-sm text-blue-600 hover:text-blue-800">
            Ver todos
          </a>
        </div>
      </EncabezadoTarjeta>
      <ContenidoTarjeta>
        <div className="space-y-3">
          {miembrosRecientes.slice(0, 5).map((miembro, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: colores.primario }}
              >
                M
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo Miembro</p>
                <p className="text-xs text-gray-500">
                  Se unió {new Date(miembro.fechaUnion).toLocaleDateString()}
                </p>
              </div>
              {miembro.rol !== 'miembro' && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  {miembro.rol === 'administrador' ? (
                    <Crown size={12} className="inline mr-1" />
                  ) : (
                    <Shield size={12} className="inline mr-1" />
                  )}
                  {miembro.rol}
                </span>
              )}
            </div>
          ))}
        </div>
      </ContenidoTarjeta>
    </Tarjeta>
  );

  // Widget de reglas del grupo
  const WidgetReglas = () => (
    <Tarjeta>
      <EncabezadoTarjeta>
        <h3 className="font-semibold text-gray-900">Reglas del Grupo</h3>
      </EncabezadoTarjeta>
      <ContenidoTarjeta>
        {grupo.reglas && grupo.reglas.length > 0 ? (
          <div className="space-y-2">
            {grupo.reglas.slice(0, 3).map((regla, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-sm font-medium text-gray-500 mt-0.5">
                  {index + 1}.
                </span>
                <p className="text-sm text-gray-700">{regla}</p>
              </div>
            ))}
            {grupo.reglas.length > 3 && (
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Ver todas las reglas
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hay reglas específicas para este grupo.
          </p>
        )}
      </ContenidoTarjeta>
    </Tarjeta>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar izquierdo - Info del grupo */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <WidgetInfoGrupo />
            <WidgetMiembrosRecientes />
            <WidgetReglas />
          </div>
        </div>

        {/* Feed principal del grupo */}
        <div className="lg:col-span-3">
          {/* Controles del feed */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Actividad del Grupo
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                {(rolUsuario === 'administrador' || rolUsuario === 'moderador') && (
                  <Boton
                    variante="ghost"
                    tamaño="sm"
                    icono={<Shield size={16} />}
                  >
                    Moderar
                  </Boton>
                )}
              </div>
            </div>

            {/* Búsqueda */}
            <div className="relative mb-4">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar en el grupo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-transparent outline-none"
                style={{ '--focus-ring-color': colores.primario + '40' } as React.CSSProperties}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filtros principales */}
            <div className="flex items-center space-x-1 overflow-x-auto mb-4">
              {obtenerFiltrosDisponibles().map((filtro) => (
                <button
                  key={filtro.id}
                  onClick={() => setFiltroActivo(filtro.id as FiltroFeedGrupo)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    filtroActivo === filtro.id
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: filtroActivo === filtro.id ? colores.primario : 'transparent'
                  }}
                >
                  {filtro.icono}
                  <span>{filtro.nombre}</span>
                </button>
              ))}
            </div>

            {/* Filtros avanzados */}
            {mostrarFiltros && (
              <div className="border-t border-gray-200 pt-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de contenido
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tiposContenido.map((tipo) => (
                      <button
                        key={tipo.id}
                        onClick={() => setTipoContenido(tipo.id as TipoContenido)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                          tipoContenido === tipo.id
                            ? 'text-white'
                            : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
                        }`}
                        style={{
                          backgroundColor: tipoContenido === tipo.id ? colores.primario : 'transparent'
                        }}
                      >
                        {tipo.icono}
                        <span>{tipo.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Posts del grupo */}
          <div className="space-y-6">
            {/* Posts fijados primero */}
            {filtroActivo !== 'fijados' && 
             postsFiltrados.filter(post => post.fijado).map((post) => (
              <div key={`fijado-${post.id}`} className="relative">
                <div className="absolute -top-2 left-4 z-10">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Pin size={12} className="mr-1" />
                    Fijado
                  </span>
                </div>
                <TarjetaPost
                  {...{
                    post: post,
                    autor: {
                      nombre: 'Usuario',
                      apellidos: 'Ejemplo',
                      verificado: true,
                      cargo: 'Miembro del Grupo'
                    }
                  } as any}
                  puedeModerar={rolUsuario === 'administrador' || rolUsuario === 'moderador'}
                  onLike={(postId: any) => console.log('Like:', postId)}
                  onComentar={(postId: any, comentario: any) => console.log('Comentario:', postId, comentario)}
                  onCompartir={(postId: any) => console.log('Compartir:', postId)}
                  onGuardar={(postId: any) => console.log('Guardar:', postId)}
                  onEliminar={onEliminarPost}
                />
              </div>
            ))}

            {/* Posts normales */}
            {postsFiltrados.filter(post => !post.fijado || filtroActivo === 'fijados').map((post) => (
              <div key={post.id} className="relative">
                {/* Indicadores de moderación */}
                {!post.moderado && (rolUsuario === 'administrador' || rolUsuario === 'moderador') && (
                  <div className="absolute -top-2 right-4 z-10">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <Flag size={12} className="mr-1" />
                      Pendiente moderación
                    </span>
                  </div>
                )}

                <TarjetaPost
                  {...{
                    post: post,
                    autor: {
                      nombre: 'Usuario',
                      apellidos: 'Ejemplo',
                      verificado: true,
                      cargo: 'Miembro del Grupo'
                    }
                  } as any}
                  puedeModerar={rolUsuario === 'administrador' || rolUsuario === 'moderador'}
                  onLike={(postId: any) => console.log('Like:', postId)}
                  onComentar={(postId: any, comentario: any) => console.log('Comentario:', postId, comentario)}
                  onCompartir={(postId: any) => console.log('Compartir:', postId)}
                  onGuardar={(postId: any) => console.log('Guardar:', postId)}
                  onEliminar={onEliminarPost}
                />

                {/* Acciones de moderación */}
                {!post.moderado && (rolUsuario === 'administrador' || rolUsuario === 'moderador') && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-orange-800">
                        Este post necesita moderación
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onModerarPost && onModerarPost(post.id, 'aprobar')}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => onModerarPost && onModerarPost(post.id, 'rechazar')}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Opciones adicionales para administradores */}
                {(rolUsuario === 'administrador' || rolUsuario === 'moderador') && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => onFijarPost && onFijarPost(post.id)}
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <Pin size={12} />
                      <span>{post.fijado ? 'Desfijar' : 'Fijar'} post</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Botón cargar más */}
            {onCargarMasPosts && (
              <div className="text-center py-6">
                <Boton
                  variante="outline"
                  onClick={onCargarMasPosts}
                  cargando={cargandoPosts}
                  icono={<RefreshCw size={16} />}
                >
                  Cargar más posts
                </Boton>
              </div>
            )}

            {/* Estado vacío */}
            {postsFiltrados.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filtroActivo === 'mis-posts' 
                      ? 'No has publicado nada aún'
                      : `No hay ${filtroActivo === 'fijados' ? 'posts fijados' : 'posts'} en este grupo`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filtroActivo === 'mis-posts'
                      ? '¡Comparte algo interesante con el grupo!'
                      : '¡Sé el primero en compartir contenido en este grupo!'
                    }
                  </p>
                  {onCrearPost && (
                    <Boton
                      variante="primario"
                      onClick={onCrearPost}
                      icono={<Plus size={16} />}
                    >
                      Crear post
                    </Boton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedGrupo;