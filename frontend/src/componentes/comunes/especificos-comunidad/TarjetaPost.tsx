import React, { useState } from 'react';
import { useTema } from '../../../../hooks/useComunidad';
import { Post, Comentario, TipoPost } from '../../../../tipos/redSocial';
import { formatearTiempoRelativo } from '../../../utils/formateoFechas';
import { useFavoritos } from '../../../contextos/FavoritosContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  Image,
  Video,
  Link,
  Users,
  Clock,
  Star,
  Flag,
  Eye,
  ThumbsUp,
  Smile,
  Frown,
  Angry
} from 'lucide-react';

export interface PropiedadesTarjetaPost {
  post: Post;
  onLike?: (postId: string, emoji: string) => void;
  onComment?: (postId: string, comentario: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  canModerate?: boolean;
  className?: string;
}

/**
 * Componente para mostrar posts en el feed social
 */
export const TarjetaPost: React.FC<PropiedadesTarjetaPost> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onReport,
  onDelete,
  canModerate = false,
  className = ''
}) => {
  const { colores } = useTema();
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavoritos();
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [reaccionSeleccionada, setReaccionSeleccionada] = useState<string | null>(null);
  
  // Determinar si el post es favorito
  const esPostFavorito = esFavorito('post', post.id);

  // Obtener icono según tipo de post
  const obtenerIconoTipo = () => {
    const iconos = {
      texto: <FileText size={16} />,
      imagen: <Image size={16} />,
      video: <Video size={16} />,
      enlace: <Link size={16} />,
      documento: <FileText size={16} />,
      evento: <Calendar size={16} />,
      oferta: <Users size={16} />,
      demanda: <Star size={16} />
    };
    return iconos[post.tipo] || <FileText size={16} />;
  };

  // Obtener texto del tipo de post
  const obtenerTextoTipo = () => {
    const textos = {
      texto: 'Publicación',
      imagen: 'Compartió una imagen',
      video: 'Compartió un video',
      enlace: 'Compartió un enlace',
      documento: 'Compartió un documento',
      evento: 'Creó un evento',
      oferta: 'Publicó una oferta',
      demanda: 'Publicó una demanda'
    };
    return textos[post.tipo] || 'Publicación';
  };

  // ✅ USANDO FUNCIÓN CENTRALIZADA DE FORMATEO

  // Manejar reacción
  const manejarReaccion = (emoji: string) => {
    setReaccionSeleccionada(emoji);
    if (onLike) {
      onLike(post.id, emoji);
    }
  };

  // Manejar comentario
  const manejarComentario = () => {
    if (nuevoComentario.trim() && onComment) {
      onComment(post.id, nuevoComentario);
      setNuevoComentario('');
    }
  };

  // Renderizar contenido según tipo
  const renderizarContenido = () => {
    switch (post.tipo) {
      case 'evento':
        return post.evento && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
            <div className="flex items-start space-x-3">
              <Calendar size={20} className="text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">{post.evento.titulo}</h4>
                <p className="text-sm text-blue-700 mt-1">{post.evento.descripcion}</p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-blue-600">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {post.evento.fechaInicio.toLocaleDateString()}
                  </span>
                  {post.evento.ubicacion && (
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {post.evento.ubicacion}
                    </span>
                  )}
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    {post.evento.modalidad}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'oferta':
        return post.oferta && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
            <div className="flex items-start space-x-3">
              <Users size={20} className="text-green-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">{post.oferta.titulo}</h4>
                <p className="text-sm text-green-700">{post.oferta.organizacion}</p>
                <p className="text-sm text-green-600 mt-1">{post.oferta.descripcion}</p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-green-600">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {post.oferta.ubicacion}
                  </span>
                  {post.oferta.salario && (
                    <span className="bg-green-100 px-2 py-1 rounded">
                      €{post.oferta.salario.minimo}-{post.oferta.salario.maximo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'demanda':
        return post.demanda && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
            <div className="flex items-start space-x-3">
              <Star size={20} className="text-orange-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900">{post.demanda.titulo}</h4>
                <p className="text-sm text-orange-600 mt-1">{post.demanda.descripcion}</p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-orange-600">
                  {post.demanda.ubicacion && (
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {post.demanda.ubicacion}
                    </span>
                  )}
                  {post.demanda.presupuesto && (
                    <span className="bg-orange-100 px-2 py-1 rounded">
                      €{post.demanda.presupuesto.minimo}-{post.demanda.presupuesto.maximo}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'enlace':
        return post.enlace && (
          <div className="border border-gray-200 rounded-lg mt-3 overflow-hidden">
            {post.enlace.imagen && (
              <img 
                src={post.enlace.imagen} 
                alt={post.enlace.titulo}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900">{post.enlace.titulo}</h4>
              {post.enlace.descripcion && (
                <p className="text-sm text-gray-600 mt-1">{post.enlace.descripcion}</p>
              )}
              <a
                href={post.enlace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-2 flex items-center hover:underline"
              >
                {post.enlace.url} <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Renderizar multimedia
  const renderizarMultimedia = () => {
    if (!post.multimedia || post.multimedia.length === 0) return null;

    return (
      <div className="mt-3">
        {post.multimedia.map((media, index) => (
          <div key={index} className="mb-2">
            {media.tipo === 'imagen' && (
              <img
                src={media.url}
                alt={media.descripcion || 'Imagen'}
                className="w-full rounded-lg max-h-96 object-cover"
              />
            )}
            {media.tipo === 'video' && (
              <video
                src={media.url}
                controls
                className="w-full rounded-lg max-h-96"
              >
                Tu navegador no soporta el elemento video.
              </video>
            )}
            {media.tipo === 'documento' && (
              <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3">
                <FileText size={24} className="text-gray-600" />
                <div>
                  <p className="font-medium">{media.nombre}</p>
                  {media.descripcion && (
                    <p className="text-sm text-gray-600">{media.descripcion}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };


  // Contar reacciones
  const contarReacciones = () => {
    const total = Object.values(post.estadisticas.reacciones).reduce((sum, count) => sum + count, 0);
    return total;
  };

  return (
    <article className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Header del post */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Avatar del autor */}
            <div className="relative">
              {(post as any).autor?.avatar ? (
                <img
                  src={(post as any).autor.avatar}
                  alt={(post as any).autor.nom}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: colores.primario }}
                >
                  {(post as any).autor.nom?.charAt(0).toUpperCase()}
                </div>
              )}
              {(post as any).autor?.verificat && (
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                  style={{ backgroundColor: colores.primario }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Información del autor */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                  {(post as any).autor.nom} {(post as any).autor.apellidos}
                </h3>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-500 flex items-center">
                  {obtenerIconoTipo()}
                  <span className="ml-1">{obtenerTextoTipo()}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {(post as any).autor.perfil?.càrrec && (
                  <>
                    <span>{(post as any).autor.perfil.càrrec}</span>
                    {(post as any).autor.perfil.departament && <span>en {(post as any).autor.perfil.departament}</span>}
                    <span>•</span>
                  </>
                )}
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatearTiempoRelativo(post.fechaCreacion, 'es')}
                </span>
              </div>
            </div>
          </div>

          {/* Menú de opciones */}
          <div className="relative">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>

            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  <button
                    onClick={async () => {
                      try {
                        if (esPostFavorito) {
                          await eliminarFavorito('post', post.id);
                        } else {
                          await agregarFavorito('post', post.id, {
                            titulo: post.contenido.substring(0, 50) + (post.contenido.length > 50 ? '...' : ''),
                            descripcion: post.contenido,
                            autor: post.autor.nombre,
                            fechaPublicacion: post.fechaPublicacion,
                            tipo: post.tipo,
                            categoria: post.categoria || 'general'
                          });
                        }
                        
                        // Si hay callback externo, llamarlo también
                        if (onSave) onSave(post.id);
                      } catch (error) {
                        console.error('Error al cambiar favorito:', error);
                      }
                      setMenuAbierto(false);
                    }}
                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left ${
                      esPostFavorito ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    <Bookmark size={16} className={`mr-2 ${esPostFavorito ? 'fill-current' : ''}`} />
                    {esPostFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  </button>
                  {onReport && (
                    <button
                      onClick={() => {
                        onReport(post.id);
                        setMenuAbierto(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Flag size={16} className="mr-2" />
                      Reportar
                    </button>
                  )}
                  {canModerate && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(post.id);
                        setMenuAbierto(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <Flag size={16} className="mr-2" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del post */}
      <div className="px-4 pb-3">
        {/* Texto principal */}
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-900 whitespace-pre-wrap">{post.contenido}</p>
        </div>

        {/* Etiquetas */}
        {post.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.etiquetas.map((etiqueta, index) => (
              <span
                key={index}
                className="text-sm px-2 py-1 rounded-full cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: `${colores.primario}15`,
                  color: colores.primario 
                }}
              >
                #{etiqueta}
              </span>
            ))}
          </div>
        )}

        {/* Contenido específico del tipo */}
        {renderizarContenido()}

        {/* Multimedia */}
        {renderizarMultimedia()}
      </div>

      {/* Estadísticas */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              {post.estadisticas.visualizaciones}
            </span>
            {contarReacciones() > 0 && (
              <span className="flex items-center">
                <Heart size={14} className="mr-1" />
                {contarReacciones()}
              </span>
            )}
            {post.estadisticas.comentarios > 0 && (
              <span className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                {post.estadisticas.comentarios}
              </span>
            )}
          </div>
          {post.fijado && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Fijado
            </span>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Reacciones */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => manejarReaccion('👍')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                reaccionSeleccionada === '👍'
                  ? 'bg-red-50 text-red-600'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Heart size={18} className={reaccionSeleccionada === '👍' ? 'fill-current' : ''} />
              <span className="text-sm font-medium">Me gusta</span>
            </button>
          </div>

          {/* Comentar */}
          <button
            onClick={() => setMostrarComentarios(!mostrarComentarios)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors duration-200"
          >
            <MessageCircle size={18} />
            <span className="text-sm font-medium">Comentar</span>
          </button>

          {/* Compartir */}
          {onShare && (
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors duration-200"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Compartir</span>
            </button>
          )}
        </div>
      </div>

      {/* Sección de comentarios */}
      {mostrarComentarios && (
        <div className="border-t border-gray-100">
          {/* Nuevo comentario */}
          <div className="p-4">
            <div className="flex space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: colores.primario }}
              >
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-offset-2 focus:border-transparent outline-none"
                  style={{ '--focus-ring-color': colores.primario + '40' } as React.CSSProperties}
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={manejarComentario}
                    disabled={!nuevoComentario.trim()}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    style={{ backgroundColor: colores.primario }}
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de comentarios */}
          {post.comentarios.length > 0 && (
            <div className="px-4 pb-4 space-y-4">
              {post.comentarios.slice(0, 3).map((comentario) => (
                <div key={comentario.id} className="flex space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: colores.primario }}
                  >
                    C
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-sm text-gray-900">Usuario</p>
                      <p className="text-sm text-gray-700 mt-1">{comentario.contenido}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{formatearTiempoRelativo(comentario.fechaCreacion, 'es')}</span>
                      <button className="hover:underline">Me gusta</button>
                      <button className="hover:underline">Responder</button>
                    </div>
                  </div>
                </div>
              ))}
              
              {post.comentarios.length > 3 && (
                <button className="text-sm text-gray-600 hover:underline">
                  Ver {post.comentarios.length - 3} comentarios más
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default TarjetaPost;