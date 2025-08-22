// Tipos para contenido multiidioma
export interface ContenidoMultiidioma {
  texto: string;
  idiomaOriginal: 'ca' | 'es' | 'eu' | 'gl';
  traducciones?: Partial<Record<'ca' | 'es' | 'eu' | 'gl', string>>;
}

// Helper para crear contenido multiidioma fácilmente
export function crearContenidoMultiidioma(
  texto: string, 
  idiomaOriginal: 'ca' | 'es' | 'eu' | 'gl' = 'es',
  traducciones?: Partial<Record<'ca' | 'es' | 'eu' | 'gl', string>>
): ContenidoMultiidioma {
  return {
    texto,
    idiomaOriginal,
    traducciones
  };
}