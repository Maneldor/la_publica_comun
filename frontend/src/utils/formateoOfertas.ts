// 🎯 UTILIDADES CENTRALIZADAS DE FORMATEO DE OFERTAS
// Consolida funciones duplicadas de formateo específico para ofertas

import { formatearVencimiento } from './formateoFechas'
import { formatearDinero } from './formateoNumeros'

// ✅ TIPOS DE DESCUENTO SOPORTADOS
export type TipoDescuento = 'porcentaje' | 'cantidad' | 'fijo' | 'envio_gratis' | '2x1' | '3x2'

// ✅ FUNCIÓN PRINCIPAL: Formatear descuento (consolida implementaciones duplicadas)
export function formatearDescuento(
  tipoDescuento: TipoDescuento | string,
  descuento: number,
  moneda: string = '€'
): string {
  switch (tipoDescuento) {
    case 'porcentaje':
      return `${descuento}% dto`
    case 'cantidad':
      return `-${descuento}${moneda}`
    case 'fijo':
      return `Por ${descuento}${moneda}`
    case 'envio_gratis':
      return 'Envío gratis'
    case '2x1':
      return '2x1'
    case '3x2':
      return '3x2'
    default:
      return `${descuento}% dto`
  }
}

// ✅ FUNCIÓN PRECIO: Formatear precios con descuentos
export function formatearPrecio(
  precioOriginal: number,
  tipoDescuento?: TipoDescuento | string,
  descuento?: number,
  moneda: string = '€'
): {
  precioOriginal: string
  precioFinal: string
  ahorro: string
  tieneDescuento: boolean
} {
  const precioOriginalFormateado = `${precioOriginal.toFixed(2)}${moneda}`
  
  if (!tipoDescuento || !descuento) {
    return {
      precioOriginal: precioOriginalFormateado,
      precioFinal: precioOriginalFormateado,
      ahorro: '',
      tieneDescuento: false
    }
  }
  
  let precioFinal = precioOriginal
  let ahorro = 0
  
  switch (tipoDescuento) {
    case 'porcentaje':
      ahorro = (precioOriginal * descuento) / 100
      precioFinal = precioOriginal - ahorro
      break
    case 'cantidad':
      ahorro = descuento
      precioFinal = Math.max(0, precioOriginal - descuento)
      break
    case 'fijo':
      precioFinal = descuento
      ahorro = precioOriginal - descuento
      break
    case 'envio_gratis':
      // El precio no cambia, pero hay ahorro en envío
      ahorro = 5.95 // Precio estimado de envío
      break
    case '2x1':
      precioFinal = precioOriginal / 2
      ahorro = precioOriginal / 2
      break
    case '3x2':
      precioFinal = (precioOriginal * 2) / 3
      ahorro = precioOriginal / 3
      break
  }
  
  return {
    precioOriginal: precioOriginalFormateado,
    precioFinal: `${Math.max(0, precioFinal).toFixed(2)}${moneda}`,
    ahorro: ahorro > 0 ? `${ahorro.toFixed(2)}${moneda}` : '',
    tieneDescuento: ahorro > 0
  }
}

// ✅ FUNCIÓN ESTADO OFERTA: Determina el estado basado en fechas y stock
export function calcularEstadoOferta(
  fechaInicio: Date | string,
  fechaFin: Date | string,
  stock?: number,
  activa: boolean = true
): {
  estado: 'activa' | 'proximamente' | 'expirada' | 'agotada' | 'pausada'
  urgente: boolean
  texto: string
  color: string
} {
  if (!activa) {
    return {
      estado: 'pausada',
      urgente: false,
      texto: 'Oferta pausada',
      color: '#6B7280'
    }
  }
  
  if (typeof stock === 'number' && stock <= 0) {
    return {
      estado: 'agotada',
      urgente: false,
      texto: 'Agotada',
      color: '#EF4444'
    }
  }
  
  const ahora = new Date()
  const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio
  const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin
  
  if (ahora < inicio) {
    return {
      estado: 'proximamente',
      urgente: false,
      texto: 'Próximamente',
      color: '#3B82F6'
    }
  }
  
  if (ahora > fin) {
    return {
      estado: 'expirada',
      urgente: false,
      texto: 'Expirada',
      color: '#6B7280'
    }
  }
  
  const { dias, urgente } = formatearVencimiento(fin)
  
  return {
    estado: 'activa',
    urgente,
    texto: 'Activa',
    color: urgente ? '#F59E0B' : '#10B981'
  }
}

// ✅ FUNCIÓN CATEGORÍA: Formatear categorías con iconos
export function formatearCategoriaOferta(categoria: string): {
  nombre: string
  icono: string
  color: string
} {
  const categorias: Record<string, { nombre: string; icono: string; color: string }> = {
    'tecnologia': { nombre: 'Tecnología', icono: '💻', color: '#3B82F6' },
    'hogar': { nombre: 'Hogar', icono: '🏠', color: '#10B981' },
    'moda': { nombre: 'Moda', icono: '👕', color: '#EC4899' },
    'alimentacion': { nombre: 'Alimentación', icono: '🍎', color: '#F59E0B' },
    'salud': { nombre: 'Salud', icono: '💊', color: '#EF4444' },
    'deportes': { nombre: 'Deportes', icono: '⚽', color: '#8B5CF6' },
    'viajes': { nombre: 'Viajes', icono: '✈️', color: '#06B6D4' },
    'educacion': { nombre: 'Educación', icono: '📚', color: '#84CC16' },
    'entretenimiento': { nombre: 'Entretenimiento', icono: '🎬', color: '#F97316' },
    'servicios': { nombre: 'Servicios', icono: '🔧', color: '#6366F1' }
  }
  
  return categorias[categoria.toLowerCase()] || {
    nombre: categoria,
    icono: '🏷️',
    color: '#6B7280'
  }
}

// ✅ FUNCIÓN POPULARIDAD: Calcular y formatear popularidad
export function calcularPopularidad(
  visualizaciones: number,
  aplicaciones: number,
  fechaCreacion: Date | string
): {
  puntuacion: number
  nivel: 'baja' | 'media' | 'alta' | 'viral'
  texto: string
  tendencia: 'subiendo' | 'estable' | 'bajando'
} {
  const fechaCreac = typeof fechaCreacion === 'string' ? new Date(fechaCreacion) : fechaCreacion
  const diasDesdeCreacion = Math.max(1, Math.floor((Date.now() - fechaCreac.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Calcular puntuación basada en interacciones por día
  const visualizacionesPorDia = visualizaciones / diasDesdeCreacion
  const aplicacionesPorDia = aplicaciones / diasDesdeCreacion
  const tasaConversion = visualizaciones > 0 ? (aplicaciones / visualizaciones) * 100 : 0
  
  const puntuacion = (visualizacionesPorDia * 0.1) + (aplicacionesPorDia * 2) + (tasaConversion * 0.5)
  
  let nivel: 'baja' | 'media' | 'alta' | 'viral'
  let texto: string
  
  if (puntuacion < 10) {
    nivel = 'baja'
    texto = 'Poco popular'
  } else if (puntuacion < 50) {
    nivel = 'media'
    texto = 'Popularidad media'
  } else if (puntuacion < 100) {
    nivel = 'alta'
    texto = 'Muy popular'
  } else {
    nivel = 'viral'
    texto = '🔥 Trending'
  }
  
  // Determinar tendencia (simplificado)
  const tendencia: 'subiendo' | 'estable' | 'bajando' = diasDesdeCreacion < 7 ? 'subiendo' : 'estable'
  
  return {
    puntuacion: Math.round(puntuacion),
    nivel,
    texto,
    tendencia
  }
}

// ✅ FUNCIÓN COMPATIBILIDAD: Para ofertas de empleo y similares
export function evaluarCompatibilidad(
  requisitosOferta: string[],
  perfilUsuario: string[],
  experienciaRequerida?: number,
  experienciaUsuario?: number
): {
  porcentaje: number
  compatible: boolean
  requisitosCoincidentes: string[]
  requisitosFaltantes: string[]
  texto: string
} {
  const requisitosCoincidentes = requisitosOferta.filter(req => 
    perfilUsuario.some(perfil => 
      perfil.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(perfil.toLowerCase())
    )
  )
  
  const requisitosFaltantes = requisitosOferta.filter(req => 
    !requisitosCoincidentes.includes(req)
  )
  
  let porcentaje = (requisitosCoincidentes.length / requisitosOferta.length) * 100
  
  // Ajustar por experiencia
  if (experienciaRequerida && experienciaUsuario) {
    const factorExperiencia = Math.min(experienciaUsuario / experienciaRequerida, 1.2)
    porcentaje *= factorExperiencia
  }
  
  porcentaje = Math.min(100, Math.round(porcentaje))
  
  const compatible = porcentaje >= 60
  
  let texto: string
  if (porcentaje >= 90) texto = '🎯 Excelente match'
  else if (porcentaje >= 75) texto = '✅ Muy compatible'
  else if (porcentaje >= 60) texto = '👍 Compatible'
  else if (porcentaje >= 40) texto = '⚠️ Parcialmente compatible'
  else texto = '❌ Poco compatible'
  
  return {
    porcentaje,
    compatible,
    requisitosCoincidentes,
    requisitosFaltantes,
    texto
  }
}

// ✅ FUNCIÓN FORMATO APLICACIONES: Para mostrar número de candidatos
export function formatearAplicaciones(numero: number): string {
  if (numero === 0) return 'Sin candidatos'
  if (numero === 1) return '1 candidato'
  if (numero < 10) return `${numero} candidatos`
  if (numero < 50) return `${numero} candidatos`
  if (numero < 100) return '50+ candidatos'
  if (numero < 500) return '100+ candidatos'
  return '500+ candidatos'
}

// ✅ FUNCIÓN FORMATO SALARIO: Para ofertas de trabajo
export function formatearSalario(
  salarioMin?: number,
  salarioMax?: number,
  moneda: string = '€',
  periodo: 'hora' | 'mes' | 'año' = 'año'
): string {
  const sufijo = periodo === 'hora' ? '/h' : periodo === 'mes' ? '/mes' : '/año'
  
  if (!salarioMin && !salarioMax) return 'Salario a negociar'
  
  if (salarioMin && !salarioMax) {
    return `Desde ${formatearDinero(salarioMin, '')}${moneda}${sufijo}`
  }
  
  if (!salarioMin && salarioMax) {
    return `Hasta ${formatearDinero(salarioMax, '')}${moneda}${sufijo}`
  }
  
  if (salarioMin === salarioMax) {
    return `${formatearDinero(salarioMin!, '')}${moneda}${sufijo}`
  }
  
  return `${formatearDinero(salarioMin!, '')}-${formatearDinero(salarioMax!, '')}${moneda}${sufijo}`
}

// ✅ CONSTANTES ÚTILES
export const CATEGORIAS_OFERTAS = [
  'tecnologia', 'hogar', 'moda', 'alimentacion', 'salud', 
  'deportes', 'viajes', 'educacion', 'entretenimiento', 'servicios'
] as const

export const TIPOS_DESCUENTO = [
  'porcentaje', 'cantidad', 'fijo', 'envio_gratis', '2x1', '3x2'
] as const