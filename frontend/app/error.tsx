'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log del error para debugging
    console.error('❌ Error en la aplicación:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-lg w-full text-center">
        {/* Icono de error */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-red-100">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Título y mensaje */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ups! Ha ocurrido un error
          </h1>
          <p className="text-gray-600 mb-2">
            Lo sentimos, algo ha ido mal en La Pública.
          </p>
          <p className="text-sm text-gray-500">
            Nuestro equipo ha sido notificado automáticamente.
          </p>
        </div>

        {/* Detalles del error (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              Detalls de l'error (només en desenvolupament):
            </h3>
            <pre className="text-xs text-red-600 overflow-auto">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar de nuevo
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Si el problema persiste, contacta con soporte técnico.
          </p>
        </div>
      </div>
    </div>
  )
}