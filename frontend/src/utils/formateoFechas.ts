// 🎯 UTILIDADES CENTRALIZADAS DE FORMATEO DE FECHAS
// Consolida todas las funciones duplicadas de formateo de fechas encontradas en el codebase

// ✅ CONFIGURACIONES DE IDIOMAS
const TEXTOS_IDIOMAS = {
  es: {
    ahora: 'Ahora',
    hoy: 'Hoy',
    ayer: 'Ayer',
    hace: 'Hace',
    dias: 'días',
    dia: 'día',
    semanas: 'semanas',
    semana: 'semana',
    meses: 'meses',
    mes: 'mes',
    años: 'años',
    año: 'año',
    minutos: 'm',
    horas: 'h',
    fa: 'fa'
  },
  ca: {
    ahora: 'Ara',
    hoy: 'Avui',
    ayer: 'Ahir',
    hace: 'Fa',
    dias: 'dies',
    dia: 'dia',
    semanas: 'setmanes',
    semana: 'setmana',
    meses: 'mesos',
    mes: 'mes',
    años: 'anys',
    año: 'any',
    minutos: 'm',
    horas: 'h',
    fa: 'fa'
  },
  eu: {
    ahora: 'Orain',
    hoy: 'Gaur',
    ayer: 'Atzo',
    hace: 'Duela',
    dias: 'egun',
    dia: 'egun',
    semanas: 'aste',
    semana: 'aste',
    meses: 'hilabete',
    mes: 'hilabete',
    años: 'urte',
    año: 'urte',
    minutos: 'm',
    horas: 'h',
    fa: 'duela'
  },
  gl: {
    ahora: 'Agora',
    hoy: 'Hoxe',
    ayer: 'Onte',
    hace: 'Hai',
    dias: 'días',
    dia: 'día',
    semanas: 'semanas',
    semana: 'semana',
    meses: 'meses',
    mes: 'mes',
    años: 'anos',
    año: 'ano',
    minutos: 'm',
    horas: 'h',
    fa: 'hai'
  }
} as const

type IdiomasSoportados = keyof typeof TEXTOS_IDIOMAS

// ✅ FUNCIÓN PRINCIPAL: Fecha relativa (consolida 4+ implementaciones duplicadas)
export function formatearFechaRelativa(
  fecha: Date | string,
  idioma: IdiomasSoportados = 'es'
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  const ahora = new Date()
  const diferencia = ahora.getTime() - fechaObj.getTime()
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
  const textos = TEXTOS_IDIOMAS[idioma]
  
  if (dias === 0) return textos.hoy
  if (dias === 1) return textos.ayer
  if (dias < 7) {
    return `${textos.hace} ${dias} ${dias === 1 ? textos.dia : textos.dias}`
  }
  if (dias < 30) {
    const semanas = Math.floor(dias / 7)
    return `${textos.hace} ${semanas} ${semanas === 1 ? textos.semana : textos.semanas}`
  }
  if (dias < 365) {
    const meses = Math.floor(dias / 30)
    return `${textos.hace} ${meses} ${meses === 1 ? textos.mes : textos.meses}`
  }
  
  const años = Math.floor(dias / 365)
  return `${textos.hace} ${años} ${años === 1 ? textos.año : textos.años}`
}

// ✅ FUNCIÓN TIEMPO RELATIVO: Para mensajería y notificaciones (consolida 3+ implementaciones)
export function formatearTiempoRelativo(
  fecha: Date | string,
  idioma: IdiomasSoportados = 'es'
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  const ahora = new Date()
  const diferencia = ahora.getTime() - fechaObj.getTime()
  
  const minutos = Math.floor(diferencia / (1000 * 60))
  const horas = Math.floor(diferencia / (1000 * 60 * 60))
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
  const textos = TEXTOS_IDIOMAS[idioma]
  
  if (minutos < 1) return textos.ahora
  if (minutos < 60) return `${minutos}${textos.minutos}`
  if (horas < 24) return `${horas}${textos.horas}`
  if (dias < 7) return `${textos.fa} ${dias}d`
  
  return formatearFechaRelativa(fechaObj, idioma)
}

// ✅ FUNCIÓN FECHA COMPLETA: Formato legible completo
export function formatearFechaCompleta(
  fecha: Date | string,
  idioma: string = 'es',
  opciones?: Intl.DateTimeFormatOptions
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  const opcionesPorDefecto: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opciones
  }
  
  return fechaObj.toLocaleDateString(idioma, opcionesPorDefecto)
}

// ✅ FUNCIÓN FECHA CORTA: Para listas y tarjetas
export function formatearFechaCorta(
  fecha: Date | string,
  idioma: string = 'es'
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  return fechaObj.toLocaleDateString(idioma, {
    month: 'short',
    day: 'numeric'
  })
}

// ✅ FUNCIÓN HORA: Formato estándar (consolida 2+ implementaciones)
export function formatearHora(
  fecha: Date | string,
  idioma: string = 'es',
  formato24h: boolean = true
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  return fechaObj.toLocaleTimeString(idioma, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !formato24h
  })
}

// ✅ FUNCIÓN FECHA Y HORA: Combinada
export function formatearFechaYHora(
  fecha: Date | string,
  idioma: string = 'es'
): string {
  const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
  
  return fechaObj.toLocaleDateString(idioma, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ FUNCIÓN VENCIMIENTO: Para ofertas y eventos (consolida 2+ implementaciones)
export function formatearVencimiento(
  fechaVencimiento: Date | string,
  idioma: IdiomasSoportados = 'es'
): {
  dias: number
  texto: string
  urgente: boolean
  expirado: boolean
} {
  const fechaVenc = typeof fechaVencimiento === 'string' 
    ? new Date(fechaVencimiento) 
    : fechaVencimiento
  const ahora = new Date()
  const diferencia = fechaVenc.getTime() - ahora.getTime()
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))
  
  const textos = TEXTOS_IDIOMAS[idioma]
  
  const expirado = dias < 0
  const urgente = dias <= 3 && dias > 0
  
  let texto: string
  if (expirado) {
    const diasVencidos = Math.abs(dias)
    texto = `Expirado ${textos.hace} ${diasVencidos} ${diasVencidos === 1 ? textos.dia : textos.dias}`
  } else if (dias === 0) {
    texto = `Vence ${textos.hoy}`
  } else if (dias === 1) {
    texto = `Vence mañana`
  } else if (dias < 7) {
    texto = `Vence en ${dias} ${dias === 1 ? textos.dia : textos.dias}`
  } else if (dias < 30) {
    const semanas = Math.ceil(dias / 7)
    texto = `Vence en ${semanas} ${semanas === 1 ? textos.semana : textos.semanas}`
  } else {
    const meses = Math.ceil(dias / 30)
    texto = `Vence en ${meses} ${meses === 1 ? textos.mes : textos.meses}`
  }
  
  return {
    dias,
    texto,
    urgente,
    expirado
  }
}

// ✅ FUNCIÓN DURACIÓN: Entre dos fechas
export function formatearDuracion(
  fechaInicio: Date | string,
  fechaFin: Date | string,
  idioma: IdiomasSoportados = 'es'
): string {
  const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio
  const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin
  
  const diferencia = fin.getTime() - inicio.getTime()
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
  
  const textos = TEXTOS_IDIOMAS[idioma]
  
  if (dias > 0) {
    return `${dias} ${dias === 1 ? textos.dia : textos.dias}`
  }
  if (horas > 0) {
    return `${horas}${textos.horas} ${minutos > 0 ? `${minutos}${textos.minutos}` : ''}`
  }
  return `${minutos}${textos.minutos}`
}

// ✅ FUNCIÓN RANGO DE FECHAS: Para eventos
export function formatearRangoFechas(
  fechaInicio: Date | string,
  fechaFin: Date | string,
  idioma: string = 'es'
): string {
  const inicio = typeof fechaInicio === 'string' ? new Date(fechaInicio) : fechaInicio
  const fin = typeof fechaFin === 'string' ? new Date(fechaFin) : fechaFin
  
  const mismoMes = inicio.getMonth() === fin.getMonth() && inicio.getFullYear() === fin.getFullYear()
  const mismoDia = inicio.toDateString() === fin.toDateString()
  
  if (mismoDia) {
    return `${formatearFechaCompleta(inicio, idioma)} de ${formatearHora(inicio, idioma)} a ${formatearHora(fin, idioma)}`
  }
  
  if (mismoMes) {
    return `${inicio.getDate()} - ${formatearFechaCompleta(fin, idioma)}`
  }
  
  return `${formatearFechaCorta(inicio, idioma)} - ${formatearFechaCorta(fin, idioma)}`
}

// ✅ UTILIDADES ADICIONALES

export function esFechaValida(fecha: any): fecha is Date {
  return fecha instanceof Date && !isNaN(fecha.getTime())
}

export function normalizarFecha(fecha: Date | string | null | undefined): Date | null {
  if (!fecha) return null
  
  try {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha
    return esFechaValida(fechaObj) ? fechaObj : null
  } catch {
    return null
  }
}

// ✅ CONSTANTES ÚTILES
export const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24
export const MILISEGUNDOS_POR_HORA = 1000 * 60 * 60
export const MILISEGUNDOS_POR_MINUTO = 1000 * 60