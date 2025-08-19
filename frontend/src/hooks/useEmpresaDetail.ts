'use client';

import { useState, useEffect, useCallback } from 'react';
import { CompanyProfile } from '../componentes/empresas/TarjetaEmpresa';
import { api } from '../servicios/api';

interface CompanyDetailProfile extends CompanyProfile {
  descripcionCompleta?: string;
  contactoPublico?: string;
  websiteUrl?: string;
  redesSociales?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  address?: string;
  fechaCreacionPerfil?: Date | string;
}

interface UseEmpresaDetailReturn {
  empresa: CompanyDetailProfile | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  isFollowing: boolean;
  followEmpresa: () => Promise<void>;
  unfollowEmpresa: () => Promise<void>;
  refreshEmpresa: () => Promise<void>;
}

export function useEmpresaDetail(empresaId: string): UseEmpresaDetailReturn {
  const [empresa, setEmpresa] = useState<CompanyDetailProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch detalle de empresa
  const fetchEmpresaDetail = useCallback(async () => {
    if (!empresaId) return;
    
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      // Simulación de llamada API - Reemplazar con API real
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular delay
      
      // Mock de empresa detallada
      if (empresaId === 'not-found') {
        setNotFound(true);
        return;
      }

      const mockEmpresa: CompanyDetailProfile = {
        id: empresaId,
        name: `Empresa ${empresaId}`,
        logo: `https://via.placeholder.com/200?text=Logo`,
        sector: 'Tecnología',
        descripcionPublica: 'Empresa líder en soluciones tecnológicas para el sector público.',
        descripcionCompleta: `Somos una empresa especializada en el desarrollo de soluciones tecnológicas innovadoras para el sector público. 
        
Con más de 15 años de experiencia, hemos trabajado con múltiples administraciones públicas implementando sistemas de gestión, plataformas digitales y soluciones de transformación digital.

Nuestro equipo está formado por profesionales altamente cualificados en diversas áreas tecnológicas, incluyendo desarrollo de software, arquitectura de sistemas, análisis de datos y ciberseguridad.

Nos comprometemos con la excelencia en el servicio y la innovación constante para mejorar la eficiencia de las administraciones públicas y la calidad de los servicios al ciudadano.`,
        tags: ['Tecnología', 'Transformación Digital', 'Software', 'Consultoría TI', 'Ciberseguridad'],
        ubicacionVisible: true,
        city: 'Barcelona',
        province: 'Barcelona',
        address: 'Av. Diagonal 123, 08028 Barcelona',
        estadoPerfil: 'VERIFICADO',
        destacada: true,
        employeeCount: '50-200',
        verifiedAt: new Date('2024-01-15'),
        contactoPublico: 'contacto@empresa.es',
        websiteUrl: 'https://www.empresa.es',
        redesSociales: {
          linkedin: 'https://linkedin.com/company/empresa',
          twitter: 'https://twitter.com/empresa',
        },
        fechaCreacionPerfil: new Date('2023-06-20'),
      };

      setEmpresa(mockEmpresa);

      // Verificar si el usuario sigue la empresa
      // Simulación - Reemplazar con API real
      const siguiendo = Math.random() > 0.5;
      setIsFollowing(siguiendo);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la empresa');
      console.error('Error fetching empresa detail:', err);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  // Seguir empresa
  const followEmpresa = useCallback(async () => {
    if (!empresa) return;
    
    try {
      await api.seguirEmpresa(empresa.id);
      setIsFollowing(true);
    } catch (err) {
      setError('Error al seguir la empresa');
      throw err;
    }
  }, [empresa]);

  // Dejar de seguir empresa
  const unfollowEmpresa = useCallback(async () => {
    if (!empresa) return;
    
    try {
      await api.dejarDeSeguirEmpresa(empresa.id);
      setIsFollowing(false);
    } catch (err) {
      setError('Error al dejar de seguir la empresa');
      throw err;
    }
  }, [empresa]);

  // Refrescar datos de empresa
  const refreshEmpresa = useCallback(async () => {
    await fetchEmpresaDetail();
  }, [fetchEmpresaDetail]);

  // Effect para cargar empresa
  useEffect(() => {
    fetchEmpresaDetail();
  }, [empresaId]);

  return {
    empresa,
    loading,
    error,
    notFound,
    isFollowing,
    followEmpresa,
    unfollowEmpresa,
    refreshEmpresa
  };
}