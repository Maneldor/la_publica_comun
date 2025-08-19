import { useState, useEffect } from 'react';
import { traducciones, type IdiomaDisponible, type Traducciones } from './traducciones';
import { obtenerComunidadActual } from '../../configuracion/comunidades';

export function useTraduccion() {
  const [idioma, setIdioma] = useState<IdiomaDisponible>('es');
  const [t, setT] = useState<Traducciones>(traducciones.es);

  useEffect(() => {
    // Detectar automáticamente el idioma basado en la comunidad
    const comunidadActual = obtenerComunidadActual();
    const idiomaDetectado = comunidadActual.idiomaDefecto as IdiomaDisponible;
    
    // Verificar que el idioma esté soportado
    if (idiomaDetectado && traducciones[idiomaDetectado]) {
      setIdioma(idiomaDetectado);
      setT(traducciones[idiomaDetectado]);
    } else {
      // Fallback a español si no está soportado
      setIdioma('es');
      setT(traducciones.es);
    }
  }, []);

  const cambiarIdioma = (nuevoIdioma: IdiomaDisponible) => {
    setIdioma(nuevoIdioma);
    setT(traducciones[nuevoIdioma]);
  };

  return {
    idioma,
    t,
    cambiarIdioma,
    idiomasDisponibles: Object.keys(traducciones) as IdiomaDisponible[],
  };
}