'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, Building2, ChevronDown, RefreshCw } from 'lucide-react';
import LayoutXarxaSocial from '../../../src/componentes/comunes/LayoutXarxaSocial';
import { TarjetaEmpresa } from '../../../src/componentes/empresas';
import { useEmpresas } from '../../../src/hooks/useEmpresas';
import { useComunidad } from '../../../hooks/useComunidad';

// Componente Skeleton para loading
function EmpresaSkeleton() {
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
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
}

// Sectores disponibles
const SECTORES = [
  'Tecnología',
  'Consultoría',
  'Servicios',
  'Industria',
  'Salud',
  'Educación',
  'Construcción',
  'Transporte'
];

// Ubicaciones disponibles
const UBICACIONES = [
  'Barcelona',
  'Madrid',
  'Valencia',
  'Sevilla',
  'Bilbao',
  'Zaragoza',
  'Málaga',
  'Palma'
];

export default function EmpresasColaboradorasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contexto = useComunidad();
  const tema = contexto.configuracion.tema;
  const idioma = contexto.idioma;
  
  const {
    empresas,
    loading,
    error,
    hasMore,
    seguidas,
    filtros,
    setSearchTerm,
    setSectorFilter,
    setUbicacionFilter,
    setSoloVerificadas,
    setSoloDestacadas,
    followEmpresa,
    unfollowEmpresa,
    resetFilters,
    loadMore,
    refreshEmpresas
  } = useEmpresas();

  // Estado local para UI
  const [showFilters, setShowFilters] = useState(false);

  // Sincronizar filtros con URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const sector = searchParams.get('sector');
    const ubicacion = searchParams.get('ubicacion');
    const verificadas = searchParams.get('verificadas');
    const destacadas = searchParams.get('destacadas');

    if (search) setSearchTerm(search);
    if (sector) setSectorFilter(sector.split(','));
    if (ubicacion) setUbicacionFilter(ubicacion);
    if (verificadas === 'true') setSoloVerificadas(true);
    if (destacadas === 'true') setSoloDestacadas(true);
  }, [searchParams]);

  // Handlers
  const handleFollow = async (empresaId: string) => {
    if (seguidas.has(empresaId)) {
      await unfollowEmpresa(empresaId);
    } else {
      await followEmpresa(empresaId);
    }
  };

  const handleViewMore = (empresaId: string) => {
    router.push(`/empresas/${empresaId}`);
  };

  const handleClearFilters = () => {
    resetFilters();
    router.push('/dashboard/empresas');
  };

  // Calcular si hay filtros activos
  const hasActiveFilters = 
    filtros.searchTerm || 
    filtros.sectorFilter.length > 0 || 
    filtros.ubicacionFilter || 
    filtros.soloVerificadas || 
    filtros.soloDestacadas;

  return (
    <LayoutXarxaSocial paginaActual="dashboard">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              Dashboard
            </button>
            <span className="text-gray-500">›</span>
            <span style={{ color: tema.colorPrimario }} className="font-medium">
              {idioma === 'ca' ? 'Empreses Col·laboradores' : 'Empresas Colaboradoras'}
            </span>
          </div>
        </nav>

        {/* Título y contador */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {idioma === 'ca' ? 'Empreses Col·laboradores' : 'Empresas Colaboradoras'}
          </h1>
          <p className="text-gray-600">
            {empresas.length} {idioma === 'ca' ? 'empreses trobades' : 'empresas encontradas'}
          </p>
        </div>

        {/* Barra de filtros */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          {/* Búsqueda principal */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={filtros.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={idioma === 'ca' ? 'Cercar empreses...' : 'Buscar empresas...'}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} className="mr-2" />
              {idioma === 'ca' ? 'Filtres' : 'Filtros'}
              <ChevronDown 
                size={16} 
                className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* Filtros expandibles */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtro por sector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {idioma === 'ca' ? 'Sector' : 'Sector'}
                  </label>
                  <select
                    value={filtros.sectorFilter[0] || ''}
                    onChange={(e) => setSectorFilter(e.target.value ? [e.target.value] : [])}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{idioma === 'ca' ? 'Tots els sectors' : 'Todos los sectores'}</option>
                    {SECTORES.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {idioma === 'ca' ? 'Ubicació' : 'Ubicación'}
                  </label>
                  <select
                    value={filtros.ubicacionFilter}
                    onChange={(e) => setUbicacionFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{idioma === 'ca' ? 'Totes les ubicacions' : 'Todas las ubicaciones'}</option>
                    {UBICACIONES.map(ubi => (
                      <option key={ubi} value={ubi}>{ubi}</option>
                    ))}
                  </select>
                </div>

                {/* Toggles */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.soloVerificadas}
                      onChange={(e) => setSoloVerificadas(e.target.checked)}
                      className="mr-2"
                      style={{ accentColor: tema.colorPrimario }}
                    />
                    <span className="text-sm">{idioma === 'ca' ? 'Només verificades' : 'Solo verificadas'}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.soloDestacadas}
                      onChange={(e) => setSoloDestacadas(e.target.checked)}
                      className="mr-2"
                      style={{ accentColor: tema.colorPrimario }}
                    />
                    <span className="text-sm">{idioma === 'ca' ? 'Només destacades' : 'Solo destacadas'}</span>
                  </label>
                </div>

                {/* Botón limpiar */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <X size={16} className="mr-1" />
                      {idioma === 'ca' ? 'Netejar filtres' : 'Limpiar filtros'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Estados de la página */}
        {loading && !empresas.length ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <EmpresaSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {idioma === 'ca' ? 'Error al carregar empreses' : 'Error al cargar empresas'}
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshEmpresas}
              className="inline-flex items-center px-4 py-2 rounded-md text-white"
              style={{ backgroundColor: tema.colorPrimario }}
            >
              <RefreshCw size={16} className="mr-2" />
              {idioma === 'ca' ? 'Tornar a intentar' : 'Reintentar'}
            </button>
          </div>
        ) : empresas.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Building2 className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {idioma === 'ca' ? 'No s\'han trobat empreses' : 'No se encontraron empresas'}
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? (idioma === 'ca' ? 'Prova amb altres filtres' : 'Prueba con otros filtros')
                : (idioma === 'ca' ? 'Encara no hi ha empreses col·laboradores' : 'Aún no hay empresas colaboradoras')
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-4 py-2 rounded-md border"
                style={{ color: tema.colorPrimario, borderColor: tema.colorPrimario }}
              >
                {idioma === 'ca' ? 'Netejar filtres' : 'Limpiar filtros'}
              </button>
            )}
          </div>
        ) : (
          // Success state - Grid de empresas
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {empresas.map((empresa, index) => (
                <div
                  key={empresa.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TarjetaEmpresa
                    empresa={empresa}
                    isFollowing={seguidas.has(empresa.id)}
                    onFollow={handleFollow}
                    onViewMore={handleViewMore}
                  />
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 rounded-md text-white transition-opacity"
                  style={{ 
                    backgroundColor: tema.colorPrimario,
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {idioma === 'ca' ? 'Carregant...' : 'Cargando...'}
                    </>
                  ) : (
                    idioma === 'ca' ? 'Carregar més' : 'Cargar más'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </LayoutXarxaSocial>
  );
}