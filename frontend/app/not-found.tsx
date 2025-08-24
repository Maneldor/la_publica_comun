'use client'

import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-lg w-full text-center">
        {/* Número 404 grande */}
        <div className="mb-8">
          <div className="text-8xl font-bold opacity-20 select-none" 
               style={{ color: '#3b82f6' }}>
            404
          </div>
        </div>

        {/* Icono */}
        <div className="mb-8">
          <div 
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#3b82f6' + '20' || '#3b82f620' }}
          >
            <Search 
              className="w-12 h-12" 
              style={{ color: '#3b82f6' }}
            />
          </div>
        </div>

        {/* Título y mensaje */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pàgina no trobada
          </h1>
          <p className="text-gray-600 mb-2">
            La página que buscas no existe en La Pública.
          </p>
          <p className="text-sm text-gray-500">
            Potser s'ha mogut, eliminat o has escrit malament l'URL.
          </p>
        </div>

        {/* Sugerencias */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg text-left">
          <h3 className="font-semibold text-gray-800 mb-3">
            Què pots fer:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Comprova que l'URL sigui correcta
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Utilitza el menú de navegació principal
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Cerca el contingut amb la barra de cerca
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              Torna a la pàgina anterior amb el botó del navegador
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors inline-block"
            style={{ backgroundColor: '#3b82f6' }}
          >
            <Home className="w-5 h-5" />
            Anar a l'inici
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Pàgina anterior
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Enllaços útils:
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/grupos" 
              className="hover:underline"
              style={{ color: '#3b82f6' }}
            >
              Grups
            </Link>
            <Link 
              href="/eventos" 
              className="hover:underline"
              style={{ color: '#3b82f6' }}
            >
              Esdeveniments
            </Link>
            <Link 
              href="/ofertes" 
              className="hover:underline"
              style={{ color: '#3b82f6' }}
            >
              Ofertes
            </Link>
            <Link 
              href="/foro" 
              className="hover:underline"
              style={{ color: '#3b82f6' }}
            >
              Fòrum
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}