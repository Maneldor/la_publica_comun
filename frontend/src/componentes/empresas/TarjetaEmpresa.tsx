'use client';

import React, { useState, useContext } from 'react';
import { MapPin, CheckCircle, Star, Building2, Users } from 'lucide-react';
import { ComunidadContext } from '../../../app/ComunidadContext';

// Tipos
export type EstadoPerfil = 'BORRADOR' | 'ACTIVO' | 'PAUSADO' | 'VERIFICADO';

export interface CompanyProfile {
  id: string;
  name: string;
  logo?: string;
  imagen?: string; // Nueva imagen de portada
  sector: string;
  descripcionPublica?: string;
  tags?: string[];
  ubicacionVisible: boolean;
  city?: string;
  province?: string;
  estadoPerfil: EstadoPerfil;
  destacada: boolean;
  employeeCount?: string;
  verifiedAt?: Date | string;
}

export interface EmpresaCardProps {
  empresa: CompanyProfile;
  isFollowing?: boolean;
  onFollow?: (empresaId: string) => Promise<void>;
  onViewMore?: (empresaId: string) => void;
}

export function TarjetaEmpresa({ 
  empresa, 
  isFollowing = false,
  onFollow,
  onViewMore 
}: EmpresaCardProps) {
  const contexto = useContext(ComunidadContext);
  
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
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    if (!onFollow) return;
    
    setIsLoading(true);
    try {
      await onFollow(empresa.id);
      setFollowing(!following);
    } catch (error) {
      console.error('Error al seguir empresa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = () => {
    if (onViewMore) {
      onViewMore(empresa.id);
    }
  };

  // Parsear tags si vienen como string JSON
  const parsedTags = empresa.tags ? 
    (typeof empresa.tags === 'string' ? JSON.parse(empresa.tags) : empresa.tags) 
    : [];

  // Imágenes placeholder por sector
  const getImagenPorSector = (sector: string): string => {
    const imagenesSector: { [key: string]: string } = {
      'Tecnología': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',
      'Salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop',
      'Educación': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop',
      'Alimentación': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      'Servicios': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=200&fit=crop',
      'Construcción': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=200&fit=crop',
      'Transporte': 'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=400&h=200&fit=crop',
      'Finanzas': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
      'Comercio': 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=400&h=200&fit=crop',
      'Turismo': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop',
      'Consultoría': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop',
      'Ingeniería': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=200&fit=crop',
      'Marketing': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=200&fit=crop',
      'Retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop'
    };
    
    // Imagen por defecto para oficina/empresa genérica
    const imagenDefecto = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop';
    
    // Buscar coincidencia parcial en el sector
    for (const [key, value] of Object.entries(imagenesSector)) {
      if (sector.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return imagenDefecto;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
      {/* Imagen de portada */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
        <img 
          src={empresa.imagen || getImagenPorSector(empresa.sector)} 
          alt={empresa.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getImagenPorSector(empresa.sector);
          }}
        />
        
        {/* Overlay gradient suave */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Logo de la empresa en la esquina inferior izquierda */}
        <div className="absolute bottom-3 left-3">
          {empresa.logo ? (
            <img 
              src={empresa.logo} 
              alt={`Logo ${empresa.name}`}
              className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-lg bg-white"
            />
          ) : (
            <div 
              className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-white shadow-lg bg-white"
            >
              <Building2 size={24} style={{ color: tema.colorPrimario }} />
            </div>
          )}
        </div>

        {/* Badges en la esquina superior derecha */}
        <div className="absolute top-3 right-3 space-y-2">
          {empresa.estadoPerfil === 'VERIFICADO' && (
            <span className="block px-2 py-1 rounded text-xs font-medium bg-green-500 text-white shadow-md">
              <CheckCircle size={12} className="inline mr-1" />
              Verificada
            </span>
          )}
          {empresa.destacada && (
            <span className="block px-2 py-1 rounded text-xs font-medium bg-yellow-500 text-white shadow-md">
              <Star size={12} className="inline mr-1" />
              Destacada
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Nombre y sector */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-1">
            {empresa.name}
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{empresa.sector}</span>
            {empresa.employeeCount && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-1" />
                  <span>{empresa.employeeCount} empleados</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Descripción */}
        {empresa.descripcionPublica && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {empresa.descripcionPublica}
          </p>
        )}

        {/* Ubicación */}
        {empresa.ubicacionVisible && (empresa.city || empresa.province) && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{[empresa.city, empresa.province].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Tags */}
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {parsedTags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: `${tema.colorPrimario}15`,
                  color: tema.colorPrimario
                }}
              >
                {tag}
              </span>
            ))}
            {parsedTags.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{parsedTags.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>

      {/* Acciones - Al fondo de la tarjeta */}
      <div className="p-4 pt-0 flex gap-2 mt-auto">
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
          Ver más
        </button>
        
        {onFollow && (
          <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: following ? '#f3f4f6' : tema.colorPrimario,
              color: following ? '#374151' : 'white',
              border: following ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : (
              following ? 'Siguiendo' : 'Seguir'
            )}
          </button>
        )}
      </div>
    </div>
  );
}