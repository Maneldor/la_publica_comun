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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 h-full flex flex-col">
      {/* Header con logo y badges */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {empresa.logo ? (
              <img 
                src={empresa.logo} 
                alt={`Logo ${empresa.name}`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${tema.colorPrimario}20` }}
              >
                <Building2 size={24} style={{ color: tema.colorPrimario }} />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
                {empresa.name}
              </h3>
              <p className="text-sm text-gray-500">{empresa.sector}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end space-y-1">
            {empresa.estadoPerfil === 'VERIFICADO' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={12} className="mr-1" />
                Verificada
              </span>
            )}
            {empresa.destacada && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star size={12} className="mr-1" />
                Destacada
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {empresa.descripcionPublica && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {empresa.descripcionPublica}
          </p>
        )}

        {/* Ubicación y empleados */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {empresa.ubicacionVisible && (empresa.city || empresa.province) && (
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              <span>{[empresa.city, empresa.province].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {empresa.employeeCount && (
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{empresa.employeeCount} empleados</span>
            </div>
          )}
        </div>

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

      {/* Acciones */}
      <div className="mt-auto p-4 pt-0 flex gap-2">
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