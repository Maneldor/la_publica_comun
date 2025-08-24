'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log del error crítico
    console.error('💥 Error global crítico:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            {/* Icono de error crítico */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Título y mensaje */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Error crític del sistema
              </h1>
              <p className="text-gray-600 mb-2">
                S'ha produït un error crític a La Pública.
              </p>
              <p className="text-sm text-gray-500">
                El nostre equip ha estat notificat automàticament.
              </p>
            </div>

            {/* Detalles del error (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Detalls de l'error:
                </h3>
                <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-red-500 mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Botón de reset */}
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Reiniciar aplicació
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Recarregar pàgina
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Si el problema persisteix, contacta amb el suport tècnic
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}