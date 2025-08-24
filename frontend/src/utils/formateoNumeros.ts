/**
 * Utilidades para formateo de números siguiendo las convenciones españolas
 * - Miles: punto (.) - Ej: 1.590
 * - Decimales: coma (,) - Ej: 1.590,50
 */

export function formatearNumero(numero: number, opciones?: {
  decimales?: number;
  mostrarDecimales?: boolean;
}): string {
  const { decimales = 0, mostrarDecimales = false } = opciones || {};
  
  // Si el número tiene decimales y no queremos mostrarlos, redondeamos
  const numeroFinal = mostrarDecimales ? numero : Math.round(numero);
  
  // Convertir a string con decimales si es necesario
  let numeroStr = mostrarDecimales 
    ? numeroFinal.toFixed(decimales)
    : numeroFinal.toString();
    
  // Separar parte entera y decimal
  const partes = numeroStr.split('.');
  const parteEntera = partes[0];
  const parteDecimal = partes[1];
  
  // Formatear parte entera con puntos cada 3 dígitos
  const parteEnteraFormateada = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Unir con coma decimal si hay decimales
  if (mostrarDecimales && parteDecimal) {
    return `${parteEnteraFormateada},${parteDecimal}`;
  }
  
  return parteEnteraFormateada;
}

export function formatearDinero(cantidad: number, moneda: string = '€', opciones?: {
  decimales?: number;
  mostrarDecimales?: boolean;
}): string {
  const numeroFormateado = formatearNumero(cantidad, opciones);
  return `${numeroFormateado}${moneda}`;
}

export function formatearPorcentaje(numero: number, decimales: number = 1): string {
  const numeroFormateado = formatearNumero(numero, { 
    decimales, 
    mostrarDecimales: decimales > 0 
  });
  return `${numeroFormateado}%`;
}

// Ejemplos de uso:
// formatearNumero(1590) → "1.590"
// formatearNumero(1590.50, { mostrarDecimales: true, decimales: 2 }) → "1.590,50"
// formatearDinero(1590) → "1.590€"
// formatearDinero(1590.50, '€', { mostrarDecimales: true, decimales: 2 }) → "1.590,50€"