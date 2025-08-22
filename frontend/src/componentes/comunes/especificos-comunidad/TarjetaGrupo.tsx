import React, { useState } from 'react';
import { useTema } from '../../../../hooks/useComunidad';
import { Grupo, TipoGrupo, CategoriaGrupo } from '../../../../tipos/redSocial';
import { 
  Users, 
  Lock, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  Settings,
  UserPlus,
  Check,
  X,
  Crown,
  Shield,
  Hash,
  MoreHorizontal
} from 'lucide-react';
import { Boton } from './ui/Boton';

export interface PropiedadesTarjetaGrupo {
  grupo: Grupo;
  estadoMiembro?: 'no-miembro' | 'pendiente' | 'miembro' | 'administrador' | 'moderador';
  mostrarEstadisticas?: boolean;
  mostrarAcciones?: boolean;
  vista?: 'tarjeta' | 'lista' | 'destacado';
  onUnirse?: (grupoId: string) => void;
  onAbandonar?: (grupoId: string) => void;
  onGestionar?: (grupoId: string) => void;
  onVisitar?: (grupoId: string) => void;
  className?: string;
}

/**
 * Componente para mostrar grupos en diferentes contextos
 */
export const TarjetaGrupo: React.FC<PropiedadesTarjetaGrupo> = ({
  grupo,
  estadoMiembro = 'no-miembro',
  mostrarEstadisticas = true,
  mostrarAcciones = true,
  vista = 'tarjeta',
  onUnirse,
  onAbandonar,
  onGestionar,
  onVisitar,
  className = ''
}) => {
  const { colores } = useTema();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Obtener icono según tipo de grupo
  const obtenerIconoTipo = () => {
    const iconos = {
      publico: <Users size={16} className="text-green-600" />,
      privado: <Lock size={16} className="text-yellow-600" />,
      oculto: <EyeOff size={16} className="text-red-600" />
    };
    return iconos[grupo.tipo];
  };

  // Obtener texto del tipo
  const obtenerTextoTipo = () => {
    const textos = {
      publico: 'Público',
      privado: 'Privado',
      oculto: 'Oculto'
    };
    return textos[grupo.tipo];
  };

  // Obtener color de la categoría
  const obtenerColorCategoria = () => {
    const colores = {
      afinidad: 'bg-blue-100 text-blue-800',
      profesional: 'bg-green-100 text-green-800',
      geografico: 'bg-purple-100 text-purple-800'
    };
    return colores[grupo.categoria];
  };

  // Obtener rol del usuario
  const obtenerRol = () => {
    switch (estadoMiembro) {
      case 'administrador':
        return { icono: <Crown size={14} />, texto: 'Administrador', color: 'text-yellow-600' };
      case 'moderador':
        return { icono: <Shield size={14} />, texto: 'Moderador', color: 'text-blue-600' };
      case 'miembro':
        return { icono: <Check size={14} />, texto: 'Miembro', color: 'text-green-600' };
      case 'pendiente':
        return { icono: <Calendar size={14} />, texto: 'Pendiente', color: 'text-orange-600' };
      default:
        return null;
    }
  };

  // Formatear número de miembros
  const formatearMiembros = (numero: number) => {
    if (numero >= 1000) {
      return `${(numero / 1000).toFixed(1)}k`;
    }
    return numero.toString();
  };

  // Manejar acción principal
  const manejarAccionPrincipal = () => {
    switch (estadoMiembro) {
      case 'no-miembro':
        if (onUnirse) onUnirse(grupo.id);
        break;
      case 'miembro':
      case 'administrador':
      case 'moderador':
        if (onVisitar) onVisitar(grupo.id);
        break;
      default:
        if (onVisitar) onVisitar(grupo.id);
    }
  };

  // Renderizar según vista
  if (vista === 'lista') {
    return (
      <div className={`bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar del grupo */}
              <div className="relative">
                {grupo.avatar ? (
                  <img
                    src={grupo.avatar}
                    alt={grupo.nombre}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: colores.primario }}
                  >
                    {grupo.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -top-1 -right-1">
                  {obtenerIconoTipo()}
                </div>
              </div>

              {/* Información del grupo */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                    {grupo.nombre}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${obtenerColorCategoria()}`}>
                    {grupo.subcategoria}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {grupo.descripcion}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Users size={12} className="mr-1" />
                    {formatearMiembros(grupo.estadisticas.totalMiembros)} miembros
                  </span>
                  <span className="flex items-center">
                    <MessageCircle size={12} className="mr-1" />
                    {grupo.estadisticas.postsEstesMes}
                  </span>
                  {obtenerRol() && (
                    <span className={`flex items-center ${obtenerRol()?.color}`}>
                      {obtenerRol()?.icono}
                      <span className="ml-1">{obtenerRol()?.texto}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            {mostrarAcciones && (
              <div className="flex items-center space-x-2">
                {estadoMiembro === 'no-miembro' && (
                  <Boton
                    variante="outline"
                    tamaño="sm"
                    onClick={() => onUnirse && onUnirse(grupo.id)}
                    icono={<UserPlus size={16} />}
                  >
                    Unirse
                  </Boton>
                )}
                {(estadoMiembro === 'administrador' || estadoMiembro === 'moderador') && (
                  <Boton
                    variante="ghost"
                    tamaño="sm"
                    onClick={() => onGestionar && onGestionar(grupo.id)}
                    icono={<Settings size={16} />}
                  />
                )}
                <button
                  onClick={manejarAccionPrincipal}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver grupo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'destacado') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
        {/* Imagen de portada */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          {grupo.portada ? (
            <img
              src={grupo.portada}
              alt={`Portada de ${grupo.nombre}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${colores.primario}88, ${colores.secundario}88)`
              }}
            />
          )}

          {/* Avatar del grupo */}
          <div className="absolute -bottom-6 left-4">
            {grupo.avatar ? (
              <img
                src={grupo.avatar}
                alt={grupo.nombre}
                className="w-16 h-16 rounded-xl border-4 border-white object-cover"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl border-4 border-white flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: colores.primario }}
              >
                {grupo.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="pt-8 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {grupo.nombre}
              </h3>
              <span className={`inline-block text-xs px-3 py-1 rounded-full ${obtenerColorCategoria()}`}>
                {grupo.subcategoria}
              </span>
            </div>
            {obtenerRol() && (
              <span className={`flex items-center text-sm ${obtenerRol()?.color} bg-gray-50 px-2 py-1 rounded-full`}>
                {obtenerRol()?.icono}
                <span className="ml-1">{obtenerRol()?.texto}</span>
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {grupo.descripcion}
          </p>

          {/* Tags de Tipo de Grupo y Destacado */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Tag de tipo de grupo */}
            <span className="bg-white border-2 border-gray-200 rounded-full px-3 py-1 flex items-center space-x-1">
              {obtenerIconoTipo()}
              <span className="text-xs font-medium text-gray-700">{obtenerTextoTipo()}</span>
            </span>
            
            {/* Tag de destacado (ejemplo - puedes añadir lógica para mostrar si está destacado) */}
            {(grupo as any).destacado && (
              <span className="bg-yellow-100 border-2 border-yellow-200 rounded-full px-3 py-1 flex items-center space-x-1">
                <span className="text-yellow-600">⭐</span>
                <span className="text-xs font-medium text-yellow-700">Destacat</span>
              </span>
            )}
          </div>



          {/* Acciones */}
          {mostrarAcciones && (
            <div className="flex space-x-2">
              {estadoMiembro === 'no-miembro' && (
                <Boton
                  variante="primario"
                  tamaño="sm"
                  ancho="completo"
                  onClick={() => onUnirse && onUnirse(grupo.id)}
                  icono={<UserPlus size={16} />}
                >
                  Accedir
                </Boton>
              )}
              {estadoMiembro === 'pendiente' && (
                <Boton
                  variante="secundario"
                  tamaño="sm"
                  ancho="completo"
                  disabled
                  icono={<Calendar size={16} />}
                >
                  Solicitud pendiente
                </Boton>
              )}
              {(estadoMiembro === 'miembro' || estadoMiembro === 'administrador' || estadoMiembro === 'moderador') && (
                <Boton
                  variante="outline"
                  tamaño="sm"
                  ancho="completo"
                  onClick={manejarAccionPrincipal}
                >
                  Accedir
                </Boton>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista tarjeta normal (por defecto)
  return (
    <div className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="relative">
              {grupo.avatar ? (
                <img
                  src={grupo.avatar}
                  alt={grupo.nombre}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: colores.primario }}
                >
                  {grupo.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -top-1 -right-1">
                {obtenerIconoTipo()}
              </div>
            </div>

            {/* Info básica */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 hover:underline cursor-pointer">
                {grupo.nombre}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${obtenerColorCategoria()}`}>
                {grupo.subcategoria}
              </span>
            </div>
          </div>

          {/* Menú de opciones */}
          <div className="relative">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <MoreHorizontal size={16} className="text-gray-500" />
            </button>
            
            {menuAbierto && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Ver detalles
                  </button>
                  {(estadoMiembro === 'administrador' || estadoMiembro === 'moderador') && (
                    <button 
                      onClick={() => onGestionar && onGestionar(grupo.id)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Settings size={14} className="mr-2" />
                      Gestionar
                    </button>
                  )}
                  {estadoMiembro === 'miembro' && (
                    <button 
                      onClick={() => onAbandonar && onAbandonar(grupo.id)}
                      className="flex items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      Abandonar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {grupo.descripcion}
        </p>

        {/* Estadísticas */}
        {mostrarEstadisticas && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              {formatearMiembros(grupo.estadisticas.totalMiembros)}
            </span>
            <span className="flex items-center">
              <MessageCircle size={14} className="mr-1" />
              {grupo.estadisticas.postsEstesMes}
            </span>
            <span className={`flex items-center ${grupo.estadisticas.crecimientoMensual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={14} className="mr-1" />
              {grupo.estadisticas.crecimientoMensual >= 0 ? '+' : ''}{grupo.estadisticas.crecimientoMensual}%
            </span>
          </div>
        )}

        {/* Rol del usuario */}
        {obtenerRol() && (
          <div className={`flex items-center justify-center py-2 mb-3 rounded-lg bg-gray-50 ${obtenerRol()?.color}`}>
            {obtenerRol()?.icono}
            <span className="ml-2 text-sm font-medium">{obtenerRol()?.texto}</span>
          </div>
        )}

        {/* Etiquetas */}
        {grupo.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {grupo.etiquetas.slice(0, 2).map((etiqueta, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${colores.primario}15`,
                  color: colores.primario 
                }}
              >
                #{etiqueta}
              </span>
            ))}
            {grupo.etiquetas.length > 2 && (
              <span className="text-xs text-gray-500">
                +{grupo.etiquetas.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Acciones */}
        {mostrarAcciones && (
          <div className="flex space-x-2">
            {estadoMiembro === 'no-miembro' && (
              <Boton
                variante="primario"
                tamaño="sm"
                ancho="completo"
                onClick={() => onUnirse && onUnirse(grupo.id)}
                icono={<UserPlus size={16} />}
              >
                Unirse
              </Boton>
            )}
            {estadoMiembro === 'pendiente' && (
              <Boton
                variante="secundario"
                tamaño="sm"
                ancho="completo"
                disabled
                icono={<Calendar size={16} />}
              >
                Pendiente
              </Boton>
            )}
            {(estadoMiembro === 'miembro' || estadoMiembro === 'administrador' || estadoMiembro === 'moderador') && (
              <Boton
                variante="outline"
                tamaño="sm"
                ancho="completo"
                onClick={manejarAccionPrincipal}
              >
                Ver grupo
              </Boton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaGrupo;