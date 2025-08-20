import { useState, useEffect } from 'react';
import { useComunidad } from './useComunidad';
import { traducirConCache, obtenerIdiomaComunidad, IdiomasSoportados } from '../src/servicios/traduccion';

// Tipos para contenido multiidioma
export interface ContenidoMultiidioma {
  texto: string;
  idiomaOriginal: IdiomasSoportados;
  traducciones?: Partial<Record<IdiomasSoportados, string>>;
}

export interface ContenidoTraducido {
  texto: string;
  cargando: boolean;
  error?: string;
}

// Hook principal para obtener contenido traducido
export function useContenidoTraducido(contenido: ContenidoMultiidioma): ContenidoTraducido {
  const { usuario } = useComunidad();
  const [resultado, setResultado] = useState<ContenidoTraducido>({
    texto: contenido.texto,
    cargando: false
  });

  useEffect(() => {
    const traducirContenido = async () => {
      if (!usuario?.provincia) {
        setResultado({ texto: contenido.texto, cargando: false });
        return;
      }

      const idiomaDestino = obtenerIdiomaComunidad(usuario.provincia);
      
      // Si el idioma destino es igual al original, no traducir
      if (idiomaDestino === contenido.idiomaOriginal) {
        setResultado({ texto: contenido.texto, cargando: false });
        return;
      }

      // Verificar si ya tenemos la traducción
      if (contenido.traducciones && contenido.traducciones[idiomaDestino]) {
        setResultado({ 
          texto: contenido.traducciones[idiomaDestino]!, 
          cargando: false 
        });
        return;
      }

      // Realizar traducción automática
      setResultado(prev => ({ ...prev, cargando: true }));
      
      try {
        const textoTraducido = await traducirConCache(
          contenido.texto, 
          contenido.idiomaOriginal, 
          idiomaDestino
        );
        
        setResultado({ 
          texto: textoTraducido, 
          cargando: false 
        });
      } catch (error) {
        console.error('Error traduciendo contenido:', error);
        setResultado({ 
          texto: contenido.texto, // Fallback al original
          cargando: false,
          error: 'Error en traducción'
        });
      }
    };

    traducirContenido();
  }, [contenido.texto, contenido.idiomaOriginal, usuario?.provincia]);

  return resultado;
}

// Hook para traducir múltiples textos
export function useContenidosTraducidos(contenidos: ContenidoMultiidioma[]): ContenidoTraducido[] {
  const { usuario } = useComunidad();
  const [resultados, setResultados] = useState<ContenidoTraducido[]>(
    contenidos.map(c => ({ texto: c.texto, cargando: false }))
  );

  useEffect(() => {
    const traducirTodos = async () => {
      if (!usuario?.provincia) {
        setResultados(contenidos.map(c => ({ texto: c.texto, cargando: false })));
        return;
      }

      const idiomaDestino = obtenerIdiomaComunidad(usuario.provincia);
      
      setResultados(prev => prev.map(r => ({ ...r, cargando: true })));

      try {
        const traducciones = await Promise.all(
          contenidos.map(async (contenido) => {
            if (idiomaDestino === contenido.idiomaOriginal) {
              return { texto: contenido.texto, cargando: false };
            }

            if (contenido.traducciones && contenido.traducciones[idiomaDestino]) {
              return { 
                texto: contenido.traducciones[idiomaDestino]!, 
                cargando: false 
              };
            }

            const textoTraducido = await traducirConCache(
              contenido.texto,
              contenido.idiomaOriginal,
              idiomaDestino
            );
            
            return { texto: textoTraducido, cargando: false };
          })
        );

        setResultados(traducciones);
      } catch (error) {
        console.error('Error traduciendo contenidos:', error);
        setResultados(contenidos.map(c => ({ 
          texto: c.texto, 
          cargando: false,
          error: 'Error en traducción' 
        })));
      }
    };

    traducirTodos();
  }, [contenidos, usuario?.provincia]);

  return resultados;
}

// Hook simplificado para texto único
export function useTextoTraducido(texto: string, idiomaOriginal: IdiomasSoportados = 'es'): string {
  const contenidoTraducido = useContenidoTraducido({
    texto,
    idiomaOriginal
  });
  
  return contenidoTraducido.texto;
}

// Helper para crear contenido multiidioma fácilmente
export function crearContenidoMultiidioma(
  texto: string, 
  idiomaOriginal: IdiomasSoportados = 'es',
  traducciones?: Partial<Record<IdiomasSoportados, string>>
): ContenidoMultiidioma {
  return {
    texto,
    idiomaOriginal,
    traducciones
  };
}

// Hook para detectar si necesitamos traducción
export function useNecesitaTraduccion(): boolean {
  const { usuario } = useComunidad();
  
  if (!usuario?.provincia) return false;
  
  const idiomaDestino = obtenerIdiomaComunidad(usuario.provincia);
  return idiomaDestino !== 'es';
}