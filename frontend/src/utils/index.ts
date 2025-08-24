// 🎯 BARREL EXPORT: Todas las utilidades centralizadas
// Punto único de acceso para todas las funciones utilitarias de la aplicación

// Formateo de fechas
export * from './formateoFechas'

// Formateo de ofertas
export * from './formateoOfertas'

// ✅ FUNCIONES ADICIONALES COMUNES (consolidadas)

// Función para generar IDs únicos (vista en múltiples archivos)
export function generateId(prefijo?: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return prefijo ? `${prefijo}_${timestamp}_${random}` : `${timestamp}_${random}`
}

// Función para formatear números (miembros, views, etc)
export function formatearNumero(numero: number): string {
  if (numero < 1000) return numero.toString()
  if (numero < 1000000) return `${(numero / 1000).toFixed(1)}K`
  return `${(numero / 1000000).toFixed(1)}M`
}

// Función para obtener iniciales de nombres
export function obtenerIniciales(nombre: string, apellido?: string): string {
  const inicial1 = nombre?.charAt(0)?.toUpperCase() || '?'
  const inicial2 = apellido?.charAt(0)?.toUpperCase() || nombre?.charAt(1)?.toUpperCase() || ''
  return inicial1 + inicial2
}

// Función para truncar texto
export function truncarTexto(texto: string, longitud: number = 150): string {
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud).trim() + '...'
}

// Función para validar email (vista en varios archivos)
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Función para normalizar strings (búsquedas, filtros)
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim()
}

// Función para calcular porcentaje de similitud entre strings
export function similaridad(str1: string, str2: string): number {
  const a = normalizar(str1)
  const b = normalizar(str2)
  
  if (a === b) return 100
  if (a.length === 0 || b.length === 0) return 0
  
  const matriz: number[][] = []
  const lenA = a.length
  const lenB = b.length
  
  for (let i = 0; i <= lenA; i++) {
    matriz[i] = [i]
  }
  
  for (let j = 0; j <= lenB; j++) {
    matriz[0][j] = j
  }
  
  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,     // Eliminación
        matriz[i][j - 1] + 1,     // Inserción
        matriz[i - 1][j - 1] + cost // Substitución
      )
    }
  }
  
  const distancia = matriz[lenA][lenB]
  const maxLen = Math.max(lenA, lenB)
  return Math.round(((maxLen - distancia) / maxLen) * 100)
}

// Función para debounce (para inputs de búsqueda)
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Función para throttle (para scroll events)
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Función para deep clone
export function clonar<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj) as unknown as T
  if (Array.isArray(obj)) return obj.map(item => clonar(item)) as unknown as T
  
  const clonedObj = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = clonar(obj[key])
    }
  }
  return clonedObj
}

// Función para capitalizar texto
export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

// Función para capitalizar cada palabra
export function capitalizarPalabras(texto: string): string {
  return texto
    .split(' ')
    .map(palabra => capitalizar(palabra))
    .join(' ')
}

// Función para formatear file size
export function formatearTamañoArchivo(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Función para verificar si es imagen
export function esImagen(archivo: File | string): boolean {
  if (typeof archivo === 'string') {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(archivo)
  }
  return archivo.type.startsWith('image/')
}

// Función para verificar si es video
export function esVideo(archivo: File | string): boolean {
  if (typeof archivo === 'string') {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(archivo)
  }
  return archivo.type.startsWith('video/')
}

// Función para obtener color de estado
export function colorEstado(estado: string): string {
  const colores: Record<string, string> = {
    'activo': '#10B981',
    'inactivo': '#6B7280',
    'online': '#10B981',
    'offline': '#6B7280',
    'ausent': '#F59E0B',
    'ocupado': '#EF4444',
    'pendiente': '#F59E0B',
    'completado': '#10B981',
    'error': '#EF4444',
    'cancelado': '#6B7280'
  }
  return colores[estado.toLowerCase()] || '#6B7280'
}

// Función para generar avatar URL
export function generarAvatarUrl(nombre: string, tamano: number = 40): string {
  const iniciales = obtenerIniciales(nombre)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(iniciales)}&size=${tamano}&background=random&color=fff&format=svg`
}

// ✅ CONSTANTES ÚTILES
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const REGEX_TELEFONO = /^(\+34|0034|34)?[6789]\d{8}$/
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']