'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Favorito, 
  TipoFavorito, 
  FavoritoEvento, 
  EstadisticasFavoritos,
  FiltrosFavoritos 
} from '../tipos/favoritos';

interface FavoritosContextType {
  favoritos: Favorito[];
  estadisticas: EstadisticasFavoritos;
  cargando: boolean;
  
  // Acciones principales
  agregarFavorito: (tipo: TipoFavorito, itemId: string, datos: any) => Promise<void>;
  eliminarFavorito: (tipo: TipoFavorito, itemId: string) => Promise<void>;
  esFavorito: (tipo: TipoFavorito, itemId: string) => boolean;
  
  // Obtener favoritos por tipo
  obtenerFavoritosPorTipo: (tipo: TipoFavorito) => Favorito[];
  
  // Filtros y búsqueda
  filtrarFavoritos: (filtros: FiltrosFavoritos) => Favorito[];
  
  // Utilidades
  actualizarNotasFavorito: (tipo: TipoFavorito, itemId: string, notas: string) => Promise<void>;
  limpiarFavoritos: (tipo?: TipoFavorito) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

interface FavoritosProviderProps {
  children: ReactNode;
  usuarioId: string;
}

export const FavoritosProvider: React.FC<FavoritosProviderProps> = ({ 
  children, 
  usuarioId 
}) => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar favoritos del localStorage al inicializar
  useEffect(() => {
    cargarFavoritos();
  }, [usuarioId]);

  const cargarFavoritos = () => {
    try {
      const favoritosGuardados = localStorage.getItem(`favoritos_${usuarioId}`);
      if (favoritosGuardados) {
        const favoritos = JSON.parse(favoritosGuardados);
        console.log('📥 Cargando favoritos desde localStorage:', favoritos.length);
        // Convertir fechas de string a Date
        const favoritosConFechas = favoritos.map((fav: any) => ({
          ...fav,
          fechaGuardado: new Date(fav.fechaGuardado),
          ...(fav.fecha && { fecha: new Date(fav.fecha) }),
          ...(fav.fechaPost && { fechaPost: new Date(fav.fechaPost) }),
          ...(fav.fechaPublicacion && { fechaPublicacion: new Date(fav.fechaPublicacion) }),
          ...(fav.ultimaActividad && { ultimaActividad: new Date(fav.ultimaActividad) })
        }));
        console.log('✅ Favoritos cargados:', favoritosConFechas);
        setFavoritos(favoritosConFechas);
      } else {
        console.log('📭 No hay favoritos guardados en localStorage');
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setCargando(false);
    }
  };

  const guardarFavoritos = (nuevosFavoritos: Favorito[]) => {
    try {
      localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(nuevosFavoritos));
      setFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  };

  const agregarFavorito = async (tipo: TipoFavorito, itemId: string, datos: any): Promise<void> => {
    try {
      console.log('🔄 Agregando favorito:', { tipo, itemId, datos });
      
      // Verificar si ya existe
      if (esFavorito(tipo, itemId)) {
        console.log('❌ Favorito ya existe, saltando...');
        return;
      }

      const nuevoFavorito: Favorito = {
        id: `${tipo}_${itemId}_${Date.now()}`,
        usuarioId,
        tipo,
        fechaGuardado: new Date(),
        [`${tipo}Id`]: itemId, // Añadir el campo específico del tipo (e.g., ofertaId, eventoId)
        ...datos
      } as Favorito;

      const nuevosFavoritos = [...favoritos, nuevoFavorito];
      console.log('✅ Guardando favorito:', nuevoFavorito);
      console.log('📊 Total favoritos:', nuevosFavoritos.length);
      guardarFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error agregando favorito:', error);
      throw error;
    }
  };

  const eliminarFavorito = async (tipo: TipoFavorito, itemId: string): Promise<void> => {
    try {
      console.log('🗑️ Eliminando favorito:', { tipo, itemId });
      
      const nuevosFavoritos = favoritos.filter(fav => {
        const campo = `${tipo}Id` as keyof Favorito;
        return !(fav.tipo === tipo && (fav as any)[campo] === itemId);
      });
      
      console.log('✅ Favoritos después de eliminar:', nuevosFavoritos.length);
      guardarFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      throw error;
    }
  };

  const esFavorito = (tipo: TipoFavorito, itemId: string): boolean => {
    const campo = `${tipo}Id` as keyof Favorito;
    const resultado = favoritos.some(fav => fav.tipo === tipo && (fav as any)[campo] === itemId);
    console.log('🔍 Verificando favorito:', { tipo, itemId, campo, resultado, totalFavoritos: favoritos.length });
    return resultado;
  };

  const obtenerFavoritosPorTipo = (tipo: TipoFavorito): Favorito[] => {
    return favoritos.filter(fav => fav.tipo === tipo);
  };

  const filtrarFavoritos = (filtros: FiltrosFavoritos): Favorito[] => {
    let resultado = [...favoritos];

    if (filtros.tipo) {
      resultado = resultado.filter(fav => fav.tipo === filtros.tipo);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(fav => {
        // Buscar en diferentes campos según el tipo
        switch (fav.tipo) {
          case 'evento':
            return (fav as FavoritoEvento).titulo.toLowerCase().includes(busqueda);
          case 'empresa':
            return (fav as any).nombre.toLowerCase().includes(busqueda);
          case 'miembro':
            const miembro = fav as any;
            return `${miembro.nombre} ${miembro.apellidos}`.toLowerCase().includes(busqueda);
          default:
            return false;
        }
      });
    }

    if (filtros.fechaDesde) {
      resultado = resultado.filter(fav => fav.fechaGuardado >= filtros.fechaDesde!);
    }

    if (filtros.fechaHasta) {
      resultado = resultado.filter(fav => fav.fechaGuardado <= filtros.fechaHasta!);
    }

    return resultado;
  };

  const actualizarNotasFavorito = async (tipo: TipoFavorito, itemId: string, notas: string): Promise<void> => {
    try {
      const nuevosFavoritos = favoritos.map(fav => {
        const campo = `${tipo}Id` as keyof Favorito;
        if (fav.tipo === tipo && (fav as any)[campo] === itemId) {
          return { ...fav, notas };
        }
        return fav;
      });
      
      guardarFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error actualizando notas:', error);
      throw error;
    }
  };

  const limpiarFavoritos = async (tipo?: TipoFavorito): Promise<void> => {
    try {
      let nuevosFavoritos: Favorito[];
      
      if (tipo) {
        nuevosFavoritos = favoritos.filter(fav => fav.tipo !== tipo);
      } else {
        nuevosFavoritos = [];
      }
      
      guardarFavoritos(nuevosFavoritos);
    } catch (error) {
      console.error('Error limpiando favoritos:', error);
      throw error;
    }
  };

  // Calcular estadísticas
  const estadisticas: EstadisticasFavoritos = {
    total: favoritos.length,
    porTipo: {
      evento: favoritos.filter(f => f.tipo === 'evento').length,
      empresa: favoritos.filter(f => f.tipo === 'empresa').length,
      miembro: favoritos.filter(f => f.tipo === 'miembro').length,
      grupo: favoritos.filter(f => f.tipo === 'grupo').length,
      post: favoritos.filter(f => f.tipo === 'post').length,
      oferta: favoritos.filter(f => f.tipo === 'oferta').length,
      blog: favoritos.filter(f => f.tipo === 'blog').length,
      'tema-foro': favoritos.filter(f => f.tipo === 'tema-foro').length,
    }
  };

  const value: FavoritosContextType = {
    favoritos,
    estadisticas,
    cargando,
    agregarFavorito,
    eliminarFavorito,
    esFavorito,
    obtenerFavoritosPorTipo,
    filtrarFavoritos,
    actualizarNotasFavorito,
    limpiarFavoritos
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = (): FavoritosContextType => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de un FavoritosProvider');
  }
  return context;
};