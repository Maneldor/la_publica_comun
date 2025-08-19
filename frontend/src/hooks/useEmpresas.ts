'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CompanyProfile } from '../componentes/empresas/TarjetaEmpresa';
import { api } from '../servicios/api';

// Interfaces
interface FiltrosEmpresas {
  searchTerm: string;
  sectorFilter: string[];
  ubicacionFilter: string;
  soloVerificadas: boolean;
  soloDestacadas: boolean;
}

interface UseEmpresasReturn {
  // Estado
  empresas: CompanyProfile[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  seguidas: Set<string>;
  
  // Filtros
  filtros: FiltrosEmpresas;
  setSearchTerm: (term: string) => void;
  setSectorFilter: (sectors: string[]) => void;
  setUbicacionFilter: (ubicacion: string) => void;
  setSoloVerificadas: (value: boolean) => void;
  setSoloDestacadas: (value: boolean) => void;
  
  // Acciones
  followEmpresa: (empresaId: string) => Promise<void>;
  unfollowEmpresa: (empresaId: string) => Promise<void>;
  getEmpresasSeguidas: () => CompanyProfile[];
  
  // Utilidades
  resetFilters: () => void;
  loadMore: () => Promise<void>;
  refreshEmpresas: () => Promise<void>;
}

const ITEMS_PER_PAGE = 12;

export function useEmpresas(): UseEmpresasReturn {
  // Estado principal
  const [empresas, setEmpresas] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [seguidas, setSeguidas] = useState<Set<string>>(new Set());

  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string[]>([]);
  const [ubicacionFilter, setUbicacionFilter] = useState('');
  const [soloVerificadas, setSoloVerificadas] = useState(false);
  const [soloDestacadas, setSoloDestacadas] = useState(false);

  // Objeto de filtros
  const filtros = useMemo(() => ({
    searchTerm,
    sectorFilter,
    ubicacionFilter,
    soloVerificadas,
    soloDestacadas
  }), [searchTerm, sectorFilter, ubicacionFilter, soloVerificadas, soloDestacadas]);

  // Fetch empresas con filtros
  const fetchEmpresas = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Simulación de llamada API - Reemplazar con API real
      const response = await api.getEmpresas({
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        sectors: sectorFilter,
        ubicacion: ubicacionFilter,
        verificadas: soloVerificadas,
        destacadas: soloDestacadas
      });

      // Simulación de respuesta - Reemplazar con respuesta real
      const mockEmpresas: CompanyProfile[] = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
        id: `empresa-${(pageNum - 1) * ITEMS_PER_PAGE + i + 1}`,
        name: `Empresa ${(pageNum - 1) * ITEMS_PER_PAGE + i + 1}`,
        sector: ['Tecnología', 'Consultoría', 'Servicios', 'Industria'][i % 4],
        descripcionPublica: 'Empresa colaboradora con el sector público especializada en soluciones innovadoras.',
        logo: `https://via.placeholder.com/150?text=E${i + 1}`,
        tags: ['Innovación', 'Tecnología', 'Sostenibilidad', 'Calidad'],
        ubicacionVisible: true,
        city: 'Barcelona',
        province: 'Barcelona',
        estadoPerfil: i % 3 === 0 ? 'VERIFICADO' : 'ACTIVO',
        destacada: i % 5 === 0,
        employeeCount: '50-200'
      }));

      if (append) {
        setEmpresas(prev => [...prev, ...mockEmpresas]);
      } else {
        setEmpresas(mockEmpresas);
      }

      setHasMore(mockEmpresas.length === ITEMS_PER_PAGE);
      setPage(pageNum);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empresas');
      console.error('Error fetching empresas:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sectorFilter, ubicacionFilter, soloVerificadas, soloDestacadas]);

  // Fetch empresas seguidas
  const fetchEmpresasSeguidas = useCallback(async () => {
    try {
      // Simulación de llamada API - Reemplazar con API real
      const response = await api.getEmpresasSeguidas();
      
      // Simulación de respuesta
      const mockSeguidas = ['empresa-1', 'empresa-3', 'empresa-5'];
      setSeguidas(new Set(mockSeguidas));
    } catch (err) {
      console.error('Error fetching empresas seguidas:', err);
    }
  }, []);

  // Seguir empresa
  const followEmpresa = useCallback(async (empresaId: string) => {
    try {
      // Simulación de llamada API - Reemplazar con API real
      await api.seguirEmpresa(empresaId);
      
      setSeguidas(prev => {
        const newSet = new Set(prev);
        newSet.add(empresaId);
        return newSet;
      });
    } catch (err) {
      setError('Error al seguir la empresa');
      throw err;
    }
  }, []);

  // Dejar de seguir empresa
  const unfollowEmpresa = useCallback(async (empresaId: string) => {
    try {
      // Simulación de llamada API - Reemplazar con API real
      await api.dejarDeSeguirEmpresa(empresaId);
      
      setSeguidas(prev => {
        const newSet = new Set(prev);
        newSet.delete(empresaId);
        return newSet;
      });
    } catch (err) {
      setError('Error al dejar de seguir la empresa');
      throw err;
    }
  }, []);

  // Obtener empresas seguidas
  const getEmpresasSeguidas = useCallback(() => {
    return empresas.filter(empresa => seguidas.has(empresa.id));
  }, [empresas, seguidas]);

  // Reset filtros
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSectorFilter([]);
    setUbicacionFilter('');
    setSoloVerificadas(false);
    setSoloDestacadas(false);
    setPage(1);
  }, []);

  // Cargar más empresas
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchEmpresas(page + 1, true);
  }, [hasMore, loading, page, fetchEmpresas]);

  // Refrescar empresas
  const refreshEmpresas = useCallback(async () => {
    setPage(1);
    await fetchEmpresas(1, false);
  }, [fetchEmpresas]);

  // Effect para cargar empresas iniciales
  useEffect(() => {
    fetchEmpresas(1, false);
    fetchEmpresasSeguidas();
  }, []); // Solo en mount

  // Effect para recargar cuando cambian los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      fetchEmpresas(1, false);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sectorFilter, ubicacionFilter, soloVerificadas, soloDestacadas]);

  return {
    // Estado
    empresas,
    loading,
    error,
    hasMore,
    seguidas,
    
    // Filtros
    filtros,
    setSearchTerm,
    setSectorFilter,
    setUbicacionFilter,
    setSoloVerificadas,
    setSoloDestacadas,
    
    // Acciones
    followEmpresa,
    unfollowEmpresa,
    getEmpresasSeguidas,
    
    // Utilidades
    resetFilters,
    loadMore,
    refreshEmpresas
  };
}