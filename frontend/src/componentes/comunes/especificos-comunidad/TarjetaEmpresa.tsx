import React, { useState } from 'react';
import { useTema } from '../../../../hooks/useComunidad';
import { PerfilEmpresa } from '../../../../tipos/redSocial';
import { 
  Building, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  ExternalLink,
  Star,
  TrendingUp,
  FileText,
  MessageCircle,
  Shield,
  CheckCircle,
  Calendar,
  MoreHorizontal,
  UserPlus as Follow,
  Bell,
  Share2,
  Bookmark,
  Eye
} from 'lucide-react';
import { Boton } from './ui/Boton';

export interface PropiedadesTarjetaEmpresa {
  empresa: PerfilEmpresa;
  estadoSeguimiento?: 'no-sigue' | 'siguiendo' | 'seguidor-mutuo';
  mostrarEstadisticas?: boolean;
  mostrarContacto?: boolean;
  vista?: 'tarjeta' | 'lista' | 'destacado' | 'perfil';
  onSeguir?: (empresaId: string) => void;
  onDejarSeguir?: (empresaId: string) => void;
  onContactar?: (empresaId: string) => void;
  onVisitar?: (empresaId: string) => void;
  onCompartir?: (empresaId: string) => void;
  className?: string;
}

/**
 * Componente para mostrar empresas y organizaciones
 */
export const TarjetaEmpresa: React.FC<PropiedadesTarjetaEmpresa> = ({
  empresa,
  estadoSeguimiento = 'no-sigue',
  mostrarEstadisticas = true,
  mostrarContacto = false,
  vista = 'tarjeta',
  onSeguir,
  onDejarSeguir,
  onContactar,
  onVisitar,
  onCompartir,
  className = ''
}) => {
  const { colores } = useTema();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Obtener icono según tipo de empresa
  const obtenerIconoTipo = () => {
    const iconos = {
      'empresa-privada': <Building size={16} className="text-blue-600" />,
      'organismo-publico': <Shield size={16} className="text-green-600" />,
      'sindicato': <Users size={16} className="text-purple-600" />
    };
    return iconos[empresa.tipo];
  };

  // Obtener texto del tipo
  const obtenerTextoTipo = () => {
    const textos = {
      'empresa-privada': 'Empresa Privada',
      'organismo-publico': 'Organismo Público',
      'sindicato': 'Sindicato'
    };
    return textos[empresa.tipo];
  };

  // Obtener color del badge según tipo
  const obtenerColorTipo = () => {
    const colores = {
      'empresa-privada': 'bg-blue-100 text-blue-800',
      'organismo-publico': 'bg-green-100 text-green-800',
      'sindicato': 'bg-purple-100 text-purple-800'
    };
    return colores[empresa.tipo];
  };

  // Formatear números
  const formatearNumero = (numero: number) => {
    if (numero >= 1000) {
      return `${(numero / 1000).toFixed(1)}k`;
    }
    return numero.toString();
  };

  // Manejar seguimiento
  const manejarSeguimiento = () => {
    if (estadoSeguimiento === 'no-sigue') {
      if (onSeguir) onSeguir(empresa.id);
    } else {
      if (onDejarSeguir) onDejarSeguir(empresa.id);
    }
  };

  // Vista lista (para directorios)
  if (vista === 'lista') {
    return (
      <div className={`bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="relative">
                {empresa.logo ? (
                  <img
                    src={empresa.logo}
                    alt={empresa.nombre}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium border"
                    style={{ backgroundColor: colores.primario }}
                  >
                    {empresa.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                {empresa.verificado && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle size={16} className="text-green-600 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                    {empresa.nombre}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${obtenerColorTipo()}`}>
                    {obtenerTextoTipo()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {empresa.descripcion}
                </p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {empresa.ubicacion.ciudad}, {empresa.ubicacion.provincia}
                  </span>
                  {mostrarEstadisticas && (
                    <>
                      <span className="flex items-center">
                        <FileText size={12} className="mr-1" />
                        {empresa.estadisticas.ofertasPublicadas} ofertas
                      </span>
                      <span className="flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        {formatearNumero(empresa.estadisticas.visualizacionesPerfil)} vistas
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-2">
              {estadoSeguimiento === 'no-sigue' && (
                <Boton
                  variante="outline"
                  tamaño="sm"
                  onClick={manejarSeguimiento}
                  icono={<Follow size={16} />}
                >
                  Seguir
                </Boton>
              )}
              {onContactar && mostrarContacto && (
                <Boton
                  variante="ghost"
                  tamaño="sm"
                  onClick={() => onContactar(empresa.id)}
                  icono={<MessageCircle size={16} />}
                />
              )}
              <button
                onClick={() => onVisitar && onVisitar(empresa.id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista destacado (para páginas principales)
  if (vista === 'destacado') {
    return (
      <div className={`bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
        {/* Header con portada */}
        <div className="relative h-32">
          {empresa.portada ? (
            <img
              src={empresa.portada}
              alt={`Portada de ${empresa.nombre}`}
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
          
          {/* Verificación */}
          {empresa.verificado && (
            <div className="absolute top-3 right-3">
              <span className="bg-white bg-opacity-90 rounded-full p-2 flex items-center space-x-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-medium">Verificado</span>
              </span>
            </div>
          )}

          {/* Logo */}
          <div className="absolute -bottom-8 left-4">
            {empresa.logo ? (
              <img
                src={empresa.logo}
                alt={empresa.nombre}
                className="w-16 h-16 rounded-xl border-4 border-white object-cover"
              />
            ) : (
              <div 
                className="w-16 h-16 rounded-xl border-4 border-white flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: colores.primario }}
              >
                {empresa.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="pt-10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {empresa.nombre}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${obtenerColorTipo()}`}>
                  {obtenerIconoTipo()}
                  <span className="ml-1">{obtenerTextoTipo()}</span>
                </span>
                {estadoSeguimiento !== 'no-sigue' && (
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {estadoSeguimiento === 'siguiendo' ? 'Siguiendo' : 'Seguimiento mutuo'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {empresa.descripcion}
          </p>

          {/* Información de contacto */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={14} className="mr-2" />
              {empresa.ubicacion.ciudad}, {empresa.ubicacion.provincia}
            </div>
            {empresa.contacto.website && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe size={14} className="mr-2" />
                <a 
                  href={empresa.contacto.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 flex items-center"
                >
                  {empresa.contacto.website.replace('https://', '')}
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {mostrarEstadisticas && (
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {empresa.estadisticas.ofertasPublicadas}
                </div>
                <div className="text-xs text-gray-500">Ofertas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {formatearNumero(empresa.estadisticas.visualizacionesPerfil)}
                </div>
                <div className="text-xs text-gray-500">Vistas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {empresa.estadisticas.candidatosContactados}
                </div>
                <div className="text-xs text-gray-500">Contactos</div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex space-x-2">
            {estadoSeguimiento === 'no-sigue' ? (
              <Boton
                variante="primario"
                tamaño="sm"
                ancho="completo"
                onClick={manejarSeguimiento}
                icono={<Follow size={16} />}
              >
                Seguir empresa
              </Boton>
            ) : (
              <Boton
                variante="outline"
                tamaño="sm"
                ancho="completo"
                onClick={() => onVisitar && onVisitar(empresa.id)}
              >
                Ver perfil
              </Boton>
            )}
          </div>

          {/* Botones adicionales */}
          <div className="flex space-x-2 mt-3">
            {onContactar && mostrarContacto && (
              <Boton
                variante="ghost"
                tamaño="sm"
                onClick={() => onContactar(empresa.id)}
                icono={<MessageCircle size={16} />}
              >
                Contactar
              </Boton>
            )}
            {onCompartir && (
              <Boton
                variante="ghost"
                tamaño="sm"
                onClick={() => onCompartir(empresa.id)}
                icono={<Share2 size={16} />}
              />
            )}
          </div>
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
            {/* Logo */}
            <div className="relative">
              {empresa.logo ? (
                <img
                  src={empresa.logo}
                  alt={empresa.nombre}
                  className="w-12 h-12 rounded-lg object-cover border"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium border"
                  style={{ backgroundColor: colores.primario }}
                >
                  {empresa.nombre.charAt(0).toUpperCase()}
                </div>
              )}
              {empresa.verificado && (
                <div className="absolute -top-1 -right-1">
                  <CheckCircle size={16} className="text-green-600 bg-white rounded-full" />
                </div>
              )}
            </div>

            {/* Info básica */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 hover:underline cursor-pointer">
                {empresa.nombre}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${obtenerColorTipo()}`}>
                {obtenerTextoTipo()}
              </span>
              {estadoSeguimiento !== 'no-sigue' && (
                <div className="mt-1">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {estadoSeguimiento === 'siguiendo' ? 'Siguiendo' : 'Seguimiento mutuo'}
                  </span>
                </div>
              )}
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <Eye size={14} className="mr-2" />
                    Ver perfil completo
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <Bookmark size={14} className="mr-2" />
                    Guardar empresa
                  </button>
                  {onCompartir && (
                    <button 
                      onClick={() => onCompartir(empresa.id)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Share2 size={14} className="mr-2" />
                      Compartir
                    </button>
                  )}
                  <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <Bell size={14} className="mr-2" />
                    Activar notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {empresa.descripcion}
        </p>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin size={14} className="mr-1" />
          {empresa.ubicacion.ciudad}, {empresa.ubicacion.provincia}
        </div>

        {/* Estadísticas */}
        {mostrarEstadisticas && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <FileText size={14} className="mr-1" />
              {empresa.estadisticas.ofertasPublicadas} ofertas
            </span>
            <span className="flex items-center">
              <TrendingUp size={14} className="mr-1" />
              {formatearNumero(empresa.estadisticas.visualizacionesPerfil)} vistas
            </span>
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              {empresa.estadisticas.candidatosContactados} contactos
            </span>
          </div>
        )}

        {/* Información de contacto */}
        {mostrarContacto && (
          <div className="border-t border-gray-100 pt-3 mb-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2" />
                <a href={`mailto:${empresa.contacto.email}`} className="hover:text-blue-600">
                  {empresa.contacto.email}
                </a>
              </div>
              {empresa.contacto.telefono && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2" />
                  <a href={`tel:${empresa.contacto.telefono}`} className="hover:text-blue-600">
                    {empresa.contacto.telefono}
                  </a>
                </div>
              )}
              {empresa.contacto.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe size={14} className="mr-2" />
                  <a 
                    href={empresa.contacto.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center"
                  >
                    {empresa.contacto.website.replace('https://', '')}
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex space-x-2">
          {estadoSeguimiento === 'no-sigue' ? (
            <Boton
              variante="primario"
              tamaño="sm"
              ancho="completo"
              onClick={manejarSeguimiento}
              icono={<Follow size={16} />}
            >
              Seguir
            </Boton>
          ) : (
            <Boton
              variante="outline"
              tamaño="sm"
              ancho="completo"
              onClick={() => onVisitar && onVisitar(empresa.id)}
            >
              Ver perfil
            </Boton>
          )}
        </div>

        {/* Acciones adicionales */}
        {(onContactar && mostrarContacto) && (
          <div className="mt-2">
            <Boton
              variante="ghost"
              tamaño="sm"
              ancho="completo"
              onClick={() => onContactar(empresa.id)}
              icono={<MessageCircle size={16} />}
            >
              Enviar mensaje
            </Boton>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjetaEmpresa;