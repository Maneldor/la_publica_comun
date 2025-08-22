import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Clock, 
  Eye, 
  MessageCircle, 
  Heart, 
  Star,
  ExternalLink 
} from 'lucide-react';
import { Anuncio, CategoriaAnuncio } from '../../../tipos/anuncios';
import { useTraduccio } from '../../contextos/TraduccioContext';
import { useComunidad } from '../../../hooks/useComunidad';
import { useState, useEffect } from 'react';

interface TarjetaAnuncioProps {
  anuncio: Anuncio;
  vista?: 'grid' | 'list';
  onFavorito?: (anuncioId: string) => void;
  onContactar?: (anuncioId: string) => void;
}

// Iconos para categorías
const iconosCategoria = {
  TRABAJO: '💼',
  VIVIENDA: '🏠',
  VENTA: '📦',
  SERVICIOS: '⚙️',
  INTERCAMBIO: '🔄',
  EVENTOS: '📅'
};

export default function TarjetaAnuncio({ 
  anuncio, 
  vista = 'grid', 
  onFavorito, 
  onContactar 
}: TarjetaAnuncioProps) {
  const router = useRouter();
  const { configuracion, idioma } = useComunidad();
  const tema = configuracion.tema;

  // Obtener sistema de traducción unificado
  const { t, tDynamic } = useTraduccio();
  
  // Estado para contenido dinámico traducido
  const [tituloTraducido, setTituloTraducido] = useState({ texto: anuncio.titulo.texto, cargando: false });
  const [descripcionTraducida, setDescripcionTraducida] = useState({ texto: anuncio.descripcion.texto, cargando: false });
  
  // Efectos para traducir contenido dinámico
  useEffect(() => {
    const traducirTitulo = async () => {
      setTituloTraducido({ texto: anuncio.titulo.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: anuncio.titulo.texto,
          idiomaOriginal: anuncio.titulo.idiomaOriginal,
          tipo: 'anuncio'
        });
        setTituloTraducido({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setTituloTraducido({ texto: anuncio.titulo.texto, cargando: false });
      }
    };
    traducirTitulo();
  }, [anuncio.titulo.texto, anuncio.titulo.idiomaOriginal, tDynamic]);
  
  useEffect(() => {
    const traducirDescripcion = async () => {
      setDescripcionTraducida({ texto: anuncio.descripcion.texto, cargando: true });
      try {
        const textoTraducido = await tDynamic({
          texto: anuncio.descripcion.texto,
          idiomaOriginal: anuncio.descripcion.idiomaOriginal,
          tipo: 'anuncio'
        });
        setDescripcionTraducida({ texto: textoTraducido, cargando: false });
      } catch (error) {
        setDescripcionTraducida({ texto: anuncio.descripcion.texto, cargando: false });
      }
    };
    traducirDescripcion();
  }, [anuncio.descripcion.texto, anuncio.descripcion.idiomaOriginal, tDynamic]);

  // Funciones helper para traducciones de UI
  const getTextoUI = {
    desde: () => t('anuncio.desde', { fallback: 'desde' }),
    gratis: () => t('anuncio.gratis', { fallback: 'Gratis' }),
    negociable: () => t('anuncio.negociable', { fallback: 'Negociable' }),
    contactar: () => t('action.contactar', { fallback: 'Contactar' }),
    favorito: () => t('anuncio.favorito', { fallback: 'Añadir a favoritos' }),
    verificado: () => t('status.verificado', { fallback: 'Verificado' })
  };

  const formatearPrecio = (precio: any) => {
    if (precio.tipo === 'GRATUITO') return getTextoUI.gratis();
    if (precio.tipo === 'INTERCAMBIO') return t('anuncio.intercambio', { fallback: 'Intercambio' });
    
    let texto = `${precio.valor}€`;
    if (precio.negociable) texto += ` (${getTextoUI.negociable()})`;
    return texto;
  };

  const formatearFecha = (fecha: Date) => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    return fecha.toLocaleDateString();
  };

  const handleClick = () => {
    router.push(`/tauler-anuncis/${anuncio.id}`);
  };

  const handleFavorito = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorito) onFavorito(anuncio.id);
  };

  const handleContactar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContactar) onContactar(anuncio.id);
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
        vista === 'list' ? 'flex' : ''
      }`}
      onClick={handleClick}
    >
      {/* Imagen */}
      <div className={`${vista === 'list' ? 'w-48' : 'h-48'} bg-gray-100 relative flex-shrink-0`}>
        {anuncio.imagenes[0] ? (
          <img 
            src={anuncio.imagenes[0]} 
            alt={tituloTraducido.cargando ? anuncio.titulo.texto : tituloTraducido.texto}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">{iconosCategoria[anuncio.categoria]}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2">
          <span 
            className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
            style={{ backgroundColor: tema.colorPrimario }}
          >
            {anuncio.categoria}
          </span>
        </div>
        
        {anuncio.destacado && (
          <div className="absolute top-2 right-2">
            <Star size={16} className="text-yellow-500 fill-current" />
          </div>
        )}
      </div>
      
      {/* Contenido */}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {tituloTraducido.cargando ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              tituloTraducido.texto
            )}
          </h3>
          <button
            onClick={handleFavorito}
            className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
          >
            <Heart size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {descripcionTraducida.cargando ? (
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            descripcionTraducida.texto
          )}
        </p>
        
        {/* Precio */}
        <div className="text-lg font-bold text-gray-900 mb-2">
          {formatearPrecio(anuncio.precio)}
        </div>
        
        {/* Ubicación y fecha */}
        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <MapPin size={12} className="mr-1" />
            {anuncio.ubicacion.ciudad}
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatearFecha(anuncio.fechaCreacion)}
          </div>
        </div>
        
        {/* Autor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {anuncio.autor.avatar ? (
              <img 
                src={anuncio.autor.avatar} 
                alt={anuncio.autor.nombre}
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
            )}
            <div className="text-xs">
              <div className="font-medium text-gray-900">
                {anuncio.autor.nombre}
              </div>
              {anuncio.autor.verificado && (
                <div className="text-green-600">{getTextoUI.verificado()}</div>
              )}
            </div>
          </div>
          
          {/* Estadísticas */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              {anuncio.vistas}
            </div>
            <div className="flex items-center">
              <MessageCircle size={12} className="mr-1" />
              {anuncio.contactos}
            </div>
          </div>
        </div>
        
        {/* Botón de contacto (solo en vista lista) */}
        {vista === 'list' && (
          <div className="mt-4">
            <button
              onClick={handleContactar}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              {getTextoUI.contactar()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}