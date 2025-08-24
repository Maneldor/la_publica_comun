'use client';

import React, { useState, useContext } from 'react';
import { 
  MapPin, 
  CheckCircle, 
  Star, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Percent,
  Building2,
  Eye,
  Heart,
  Gift,
  Tag,
  ExternalLink
} from 'lucide-react';
import { ComunidadContext } from '../../../app/ComunidadContext';
import { useIdioma } from '../../../hooks/useComunidad';
import { useFavoritos } from '../../contextos/FavoritosContext';

// Traducciones para TarjetaOferta
const traduccionesTarjeta = {
  ca: {
    verificada: 'Verificada',
    destacada: 'Destacada',
    exclusiva: 'Exclusiva',
    verDetalles: 'Veure detalls',
    canjear: 'Bescanviar',
    expiraHoy: 'Expira avui',
    expiraEn1Dia: 'Expira en 1 dia',
    expiraEnDias: 'Expira en {dias} dies',
    soloQuedan: 'Només queden {cantidad} disponibles',
    canjes: 'bescanvis'
  },
  es: {
    verificada: 'Verificada',
    destacada: 'Destacada',
    exclusiva: 'Exclusiva',
    verDetalles: 'Ver detalles',
    canjear: 'Canjear',
    expiraHoy: 'Expira hoy',
    expiraEn1Dia: 'Expira en 1 día',
    expiraEnDias: 'Expira en {dias} días',
    soloQuedan: 'Solo quedan {cantidad} disponibles',
    canjes: 'canjes'
  },
  eu: {
    verificada: 'Egiaztatuta',
    destacada: 'Nabarmenduta',
    exclusiva: 'Esklusibo',
    verDetalles: 'Xehetasunak ikusi',
    canjear: 'Trukatu',
    expiraHoy: 'Gaur iraungitzen da',
    expiraEn1Dia: '1 egunean iraungitzen da',
    expiraEnDias: '{dias} egunetan iraungitzen da',
    soloQuedan: '{cantidad} bakarrik geratzen dira',
    canjes: 'trukatutako'
  },
  gl: {
    verificada: 'Verificada',
    destacada: 'Destacada',
    exclusiva: 'Exclusiva',
    verDetalles: 'Ver detalles',
    canjear: 'Canxear',
    expiraHoy: 'Expira hoxe',
    expiraEn1Dia: 'Expira en 1 día',
    expiraEnDias: 'Expira en {dias} días',
    soloQuedan: 'Só quedan {cantidad} dispoñibles',
    canjes: 'canxes'
  }
};

// Tipos de ofertas comerciales
export type CategoriaOferta = 
  | 'GASTRONOMIA' 
  | 'VIAJES' 
  | 'TECNOLOGIA' 
  | 'SALUD_BIENESTAR' 
  | 'EDUCACION' 
  | 'HOGAR' 
  | 'MODA' 
  | 'OCIO_CULTURA' 
  | 'DEPORTES' 
  | 'SERVICIOS_PROFESIONALES';

export type TipoDescuento = 'PORCENTAJE' | 'CANTIDAD_FIJA' | 'PRECIO_ESPECIAL' | 'REGALO';
export type EstadoOferta = 'ACTIVA' | 'PAUSADA' | 'AGOTADA' | 'CADUCADA';
export type ModalidadOferta = 'ONLINE' | 'PRESENCIAL' | 'AMBAS';

export interface OfertaComercial {
  id: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  empresa: {
    id: string;
    nombre: string;
    logo?: string;
    sector: string;
    verificada: boolean;
  };
  categoria: CategoriaOferta;
  tipoDescuento: TipoDescuento;
  descuento: {
    valor: number; // Porcentaje o cantidad
    valorOriginal?: number; // Precio original
    valorFinal?: number; // Precio con descuento
    moneda?: string;
  };
  modalidad: ModalidadOferta;
  ubicaciones?: string[]; // Para ofertas presenciales
  codigoDescuento?: string;
  enlaceExterno?: string; // URL para redimir la oferta
  instrucciones?: string; // Cómo canjear la oferta
  fechaPublicacion: Date | string;
  fechaVencimiento?: Date | string;
  limitaciones?: string[];
  destacada: boolean;
  exclusiva: boolean; // Solo para empleados públicos
  estado: EstadoOferta;
  vistas: number;
  canjes: number; // Cuántas veces se ha canjeado
  favoritos: number;
  stockDisponible?: number; // Para ofertas limitadas
}

export interface TarjetaOfertaProps {
  oferta: OfertaComercial;
  isFavorite?: boolean;
  onToggleFavorite?: (ofertaId: string) => Promise<void>;
  onViewMore?: (ofertaId: string) => void;
  onRedeem?: (ofertaId: string) => void; // Cambio: de onApply a onRedeem
}

export function TarjetaOferta({ 
  oferta, 
  isFavorite,
  onToggleFavorite,
  onViewMore,
  onRedeem
}: TarjetaOfertaProps) {
  const contexto = useContext(ComunidadContext);
  const { idioma } = useIdioma();
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavoritos();
  const t = (traduccionesTarjeta as any)[idioma] || traduccionesTarjeta.es;
  
  // Determinar si es favorito usando el contexto de favoritos
  const esOfertaFavorita = isFavorite !== undefined ? isFavorite : esFavorito('oferta', oferta.id);
  
  // Si el contexto no está disponible, mostrar un placeholder
  if (!contexto) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-64 animate-pulse">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const tema = contexto.configuracion.tema;
  
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (esOfertaFavorita) {
        await eliminarFavorito('oferta', oferta.id);
      } else {
        await agregarFavorito('oferta', oferta.id, {
          titulo: oferta.titulo,
          descripcion: oferta.descripcion,
          imagen: oferta.imagen,
          empresa: oferta.empresa.nombre,
          categoria: oferta.categoria,
          descuento: formatearDescuento(),
          fechaVencimiento: oferta.fechaVencimiento
        });
      }
      
      // Si hay un callback externo, también llamarlo
      if (onToggleFavorite) {
        await onToggleFavorite(oferta.id);
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = () => {
    if (onViewMore) {
      onViewMore(oferta.id);
    }
  };

  const handleRedeem = () => {
    if (onRedeem) {
      onRedeem(oferta.id);
    }
  };

  // Formatear fechas
  const fechaPublicacion = typeof oferta.fechaPublicacion === 'string' 
    ? new Date(oferta.fechaPublicacion) 
    : oferta.fechaPublicacion;
  
  const diasPublicado = Math.floor((Date.now() - fechaPublicacion.getTime()) / (1000 * 60 * 60 * 24));
  
  // Formatear fecha de vencimiento
  const fechaVencimiento = oferta.fechaVencimiento 
    ? (typeof oferta.fechaVencimiento === 'string' ? new Date(oferta.fechaVencimiento) : oferta.fechaVencimiento)
    : null;
    
  const diasParaVencer = fechaVencimiento 
    ? Math.floor((fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Formatear texto de vencimiento
  const formatearVencimiento = () => {
    if (diasParaVencer === null) return null;
    
    if (diasParaVencer <= 0) {
      return t.expiraHoy;
    } else if (diasParaVencer === 1) {
      return t.expiraEn1Dia;
    } else {
      return t.expiraEnDias.replace('{dias}', diasParaVencer.toString());
    }
  };

  // Formatear texto de stock
  const formatearStock = () => {
    if (!oferta.stockDisponible || oferta.stockDisponible > 10) return null;
    return t.soloQuedan.replace('{cantidad}', oferta.stockDisponible.toString());
  };

  // Formatear descuento
  const formatearDescuento = () => {
    const { tipoDescuento, descuento } = oferta;
    
    switch (tipoDescuento) {
      case 'PORCENTAJE':
        return `${descuento.valor}% OFF`;
      case 'CANTIDAD_FIJA':
        return `${descuento.valor}${descuento.moneda || '€'} de descuento`;
      case 'PRECIO_ESPECIAL':
        return `${descuento.valorFinal}${descuento.moneda || '€'}`;
      case 'REGALO':
        return 'Regalo incluido';
      default:
        return `${descuento.valor}% OFF`;
    }
  };

  // Obtener color de la categoría
  const getColorCategoria = (categoria: CategoriaOferta) => {
    const colores = {
      GASTRONOMIA: 'bg-orange-100 text-orange-800',
      VIAJES: 'bg-blue-100 text-blue-800',
      TECNOLOGIA: 'bg-purple-100 text-purple-800',
      SALUD_BIENESTAR: 'bg-green-100 text-green-800',
      EDUCACION: 'bg-indigo-100 text-indigo-800',
      HOGAR: 'bg-yellow-100 text-yellow-800',
      MODA: 'bg-pink-100 text-pink-800',
      OCIO_CULTURA: 'bg-red-100 text-red-800',
      DEPORTES: 'bg-teal-100 text-teal-800',
      SERVICIOS_PROFESIONALES: 'bg-gray-100 text-gray-800'
    };
    return colores[categoria] || 'bg-gray-100 text-gray-800';
  };

  // Obtener icono de la modalidad
  const getModalidadIcon = (modalidad: ModalidadOferta) => {
    switch (modalidad) {
      case 'ONLINE': return '💻';
      case 'PRESENCIAL': return '🏪';
      case 'AMBAS': return '🔄';
      default: return '🛍️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
      {/* Imagen de la oferta */}
      {oferta.imagen && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={oferta.imagen} 
            alt={oferta.titulo}
            className="w-full h-full object-cover"
          />
          {/* Badge de descuento */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white shadow-md">
              <Percent size={14} className="mr-1" />
              {formatearDescuento()}
            </span>
          </div>
          {/* Badges adicionales */}
          <div className="absolute top-3 right-3 space-y-2">
            {oferta.exclusiva && (
              <span className="block px-2 py-1 rounded text-xs font-medium bg-purple-500 text-white shadow-md">
                {t.exclusiva}
              </span>
            )}
            {oferta.destacada && (
              <span className="block px-2 py-1 rounded text-xs font-medium bg-yellow-500 text-white shadow-md">
                <Star size={12} className="inline mr-1" />
                {t.destacada}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header con empresa */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {oferta.empresa.logo ? (
              <img 
                src={oferta.empresa.logo} 
                alt={`Logo ${oferta.empresa.nombre}`}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${tema.colorPrimario}20` }}
              >
                <Building2 size={20} style={{ color: tema.colorPrimario }} />
              </div>
            )}
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
                {oferta.titulo}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600 truncate">{oferta.empresa.nombre}</p>
                {oferta.empresa.verificada && (
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Categoría */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getColorCategoria(oferta.categoria)} flex-shrink-0 ml-2`}>
            {oferta.categoria}
          </span>
        </div>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {oferta.descripcion}
        </p>

        {/* Información clave */}
        <div className="space-y-2 mb-3">
          {/* Modalidad y ubicaciones */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span className="mr-1">{getModalidadIcon(oferta.modalidad)}</span>
              <span>{oferta.modalidad}</span>
            </div>
            {oferta.ubicaciones && oferta.ubicaciones.length > 0 && (
              <div className="flex items-center">
                <MapPin size={12} className="mr-1" />
                <span className="truncate max-w-24">
                  {oferta.ubicaciones.slice(0, 2).join(', ')}
                  {oferta.ubicaciones.length > 2 && ` +${oferta.ubicaciones.length - 2}`}
                </span>
              </div>
            )}
          </div>
          
          {/* Código de descuento si existe */}
          {oferta.codigoDescuento && (
            <div className="flex items-center text-xs">
              <Tag size={12} className="mr-1 text-gray-400" />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                {oferta.codigoDescuento}
              </span>
            </div>
          )}

          {/* Fecha de vencimiento */}
          {diasParaVencer !== null && (
            <div className="flex items-center text-xs">
              <Clock size={12} className="mr-1 text-gray-400" />
              <span className={`${diasParaVencer <= 7 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {formatearVencimiento()}
              </span>
            </div>
          )}
        </div>

        {/* Stock disponible */}
        {formatearStock() && (
          <div className="mb-3 text-xs text-orange-600 font-medium">
            ⚡ {formatearStock()}
          </div>
        )}

        {/* Estadísticas */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye size={12} className="mr-1" />
              {oferta.vistas}
            </span>
            <span className="flex items-center">
              <Heart size={12} className="mr-1" />
              {oferta.favoritos}
            </span>
          </div>
          <span className="font-medium text-gray-600">
            {oferta.canjes} {t.canjes}
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={handleViewMore}
            className="flex-1 px-3 py-2 text-sm font-medium rounded-md border transition-colors"
            style={{ 
              borderColor: tema.colorPrimario,
              color: tema.colorPrimario
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${tema.colorPrimario}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {t.verDetalles}
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-md border transition-colors ${
              esOfertaFavorita ? 'bg-red-50 border-red-200' : 'border-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            <Heart 
              size={16} 
              className={esOfertaFavorita ? 'text-red-500 fill-current' : 'text-gray-400'} 
            />
          </button>
          
          {onRedeem && oferta.estado === 'ACTIVA' && (
            <button
              onClick={handleRedeem}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-md text-white transition-all flex items-center justify-center"
              style={{ backgroundColor: tema.colorPrimario }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Gift size={16} className="mr-1" />
              {t.canjear}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}