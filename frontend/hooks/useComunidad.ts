import { useContext, useEffect, useState } from 'react';
import { ConfiguracionComunidad, obtenerComunidadActual } from '../configuracion/comunidades';
import { ComunidadContext } from '../app/ComunidadContext';

/**
 * Hook principal para acceder a la configuración de la comunidad actual
 */
export const useComunidad = () => {
  const contexto = useContext(ComunidadContext);
  
  if (!contexto) {
    throw new Error('useComunidad debe usarse dentro de un ComunidadProvider');
  }
  
  return contexto;
};

/**
 * Hook para obtener solo la configuración de la comunidad
 */
export const useConfiguracionComunidad = (): ConfiguracionComunidad => {
  const { configuracion } = useComunidad();
  return configuracion;
};

/**
 * Hook para gestión de idiomas
 */
export const useIdioma = () => {
  const { idioma, cambiarIdioma, configuracion } = useComunidad();
  
  const idiomasDisponibles = configuracion.idiomas;
  const esPrincipal = idioma === configuracion.idiomaDefecto;
  
  const cambiarAIdiomaPrincipal = () => {
    cambiarIdioma(configuracion.idiomaDefecto);
  };
  
  const alternarIdioma = () => {
    const indiceActual = idiomasDisponibles.indexOf(idioma);
    const siguienteIndice = (indiceActual + 1) % idiomasDisponibles.length;
    cambiarIdioma(idiomasDisponibles[siguienteIndice]);
  };
  
  return {
    idioma,
    cambiarIdioma,
    idiomasDisponibles,
    esPrincipal,
    cambiarAIdiomaPrincipal,
    alternarIdioma
  };
};

/**
 * Hook para obtener el tema visual de la comunidad
 */
export const useTema = () => {
  const { configuracion } = useComunidad();
  const tema = configuracion.tema;
  
  // Aplicar variables CSS automáticamente
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primario', tema.colorPrimario);
    root.style.setProperty('--color-secundario', tema.colorSecundario);
    root.style.setProperty('--color-acento', tema.colorAccento);
  }, [tema]);
  
  return {
    // Colores principales
    primario: tema.colorPrimario,
    secundario: tema.colorSecundario,
    acento: tema.colorAccento,
    
    // Colores de texto
    texto: '#1f2937',
    textoSecundario: '#6b7280',
    
    // Tema completo para compatibilidad
    tema,
    colores: {
      primario: tema.colorPrimario,
      secundario: tema.colorSecundario,
      acento: tema.colorAccento
    }
  };
};

/**
 * Hook para verificar características disponibles
 */
export const useCaracteristicas = () => {
  const { configuracion } = useComunidad();
  
  const tieneCaracteristica = (caracteristica: string): boolean => {
    return (configuracion as any).caracteristicasSociales?.[caracteristica] === true;
  };
  
  const obtenerTerminologia = () => {
    return (configuracion as any).terminologia || {};
  };
  
  const caracteristicasActivas = (configuracion as any).caracteristicasSociales || {};
  
  return {
    tieneCaracteristica,
    caracteristicasActivas,
    terminologia: obtenerTerminologia(),
    // Helpers específicos
    tieneGruposPublicos: tieneCaracteristica('gruposPublicos'),
    tieneGruposPrivados: tieneCaracteristica('gruposPrivados'),
    tieneForos: tieneCaracteristica('foros'),
    tieneBlog: tieneCaracteristica('blog'),
    tieneTableAnuncios: tieneCaracteristica('tablonAnuncios'),
    tieneEmpresas: tieneCaracteristica('empresas'),
    tieneEventos: tieneCaracteristica('eventos'),
    tieneMensajeria: tieneCaracteristica('mensajeria'),
    tieneNotificaciones: tieneCaracteristica('notificaciones')
  };
};

/**
 * Hook para información geográfica
 */
export const useGeografia = () => {
  const { configuracion } = useComunidad();
  
  return {
    comunidad: configuracion.nombre,
    codigo: configuracion.codigo,
    provincias: configuracion.provincias || [],
    organismos: (configuracion as any).organismos || [],
    dominio: (configuracion as any).dominio || 'lapublica.es'
  };
};

/**
 * Hook para detectar cambios de dominio/comunidad
 */
export const useDetectorComunidad = () => {
  const [comunidadActual, setComunidadActual] = useState<ConfiguracionComunidad | null>(null);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    const detectarComunidad = () => {
      try {
        const comunidad = obtenerComunidadActual();
        setComunidadActual(comunidad);
      } catch (error) {
        console.error('Error detectando comunidad:', error);
        // Fallback a Catalunya
        setComunidadActual(obtenerComunidadActual());
      } finally {
        setCargando(false);
      }
    };
    
    detectarComunidad();
    
    // Detectar cambios en la URL (útil para desarrollo)
    const manejarCambioURL = () => {
      detectarComunidad();
    };
    
    window.addEventListener('popstate', manejarCambioURL);
    
    return () => {
      window.removeEventListener('popstate', manejarCambioURL);
    };
  }, []);
  
  return {
    comunidadActual,
    cargando,
    // Helper para verificar si estamos en una comunidad específica
    esComunidad: (codigo: string) => comunidadActual?.codigo === codigo
  };
};

/**
 * Hook para persistir preferencias del usuario
 */
export const usePreferenciasComunidad = () => {
  const { idioma, cambiarIdioma } = useIdioma();
  const { configuracion } = useComunidad();
  
  // Guardar preferencias en localStorage
  useEffect(() => {
    const preferencias = {
      idioma,
      comunidad: configuracion.codigo,
      ultimaVisita: new Date().toISOString()
    };
    
    localStorage.setItem('preferencias-comunidad', JSON.stringify(preferencias));
  }, [idioma, configuracion.codigo]);
  
  // Cargar preferencias guardadas
  const cargarPreferencias = () => {
    try {
      const preferenciasGuardadas = localStorage.getItem('preferencias-comunidad');
      if (preferenciasGuardadas) {
        const preferencias = JSON.parse(preferenciasGuardadas);
        
        // Aplicar idioma si está disponible en la comunidad actual
        if (configuracion.idiomas.includes(preferencias.idioma)) {
          cambiarIdioma(preferencias.idioma);
        }
        
        return preferencias;
      }
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    }
    
    return null;
  };
  
  const limpiarPreferencias = () => {
    localStorage.removeItem('preferencias-comunidad');
  };
  
  return {
    cargarPreferencias,
    limpiarPreferencias
  };
};

/**
 * Hook para URLs específicas de comunidad
 */
export const useRutasComunidad = () => {
  const { configuracion } = useComunidad();
  
  const generarRuta = (ruta: string): string => {
    // Si estamos en desarrollo, usar localhost
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000${ruta}`;
    }
    
    // En producción, usar el dominio de la comunidad
    return `https://${(configuracion as any).dominio || 'lapublica.es'}${ruta}`;
  };
  
  const generarRutaAbsoluta = (ruta: string): string => {
    return `https://${(configuracion as any).dominio || 'lapublica.es'}${ruta}`;
  };
  
  const esRutaLocal = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  };
  
  return {
    generarRuta,
    generarRutaAbsoluta,
    esRutaLocal,
    dominioBase: (configuracion as any).dominio || 'lapublica.es'
  };
};

/**
 * Hook para debugging en desarrollo
 */
export const useDebugComunidad = () => {
  const contexto = useComunidad();
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🏛️ Información de Comunidad:', {
        nombre: contexto.configuracion.nombre,
        codigo: contexto.configuracion.codigo,
        idioma: contexto.idioma,
        dominio: (contexto.configuracion as any).dominio || 'lapublica.es',
        caracteristicas: (contexto.configuracion as any).caracteristicasSociales || {}
      });
    }
  }, [contexto]);
  
  const logearInformacion = () => {
    console.table({
      'Comunidad': contexto.configuracion.nombre,
      'Código': contexto.configuracion.codigo,
      'Idioma Actual': contexto.idioma,
      'Idiomas Disponibles': contexto.configuracion.idiomas.join(', '),
      'Dominio': (contexto.configuracion as any).dominio || 'lapublica.es',
      'Características': JSON.stringify((contexto.configuracion as any).caracteristicasSociales || {})
    });
  };
  
  return {
    logearInformacion,
    contextoCompleto: contexto
  };
};