'use client'

import { useState } from 'react'
import { Search, Menu, X, Bell } from 'lucide-react'
import { useIdioma } from '../../../hooks/useComunidad'

interface HeaderAdminProps {
  onToggleMobileMenu?: () => void
  mobileMenuOpen?: boolean
  totalAlerts?: number
}

export default function HeaderAdmin({ onToggleMobileMenu, mobileMenuOpen = false, totalAlerts = 0 }: HeaderAdminProps) {
  const { idioma } = useIdioma()
  const [searchTerm, setSearchTerm] = useState('')
  
  const t = {
    ca: {
      titulo: 'Panel d\'Administració',
      buscar: 'Cercar...',
      buscarPlaceholder: 'Cercar usuaris, cursos, empreses...'
    },
    es: {
      titulo: 'Panel de Administración',
      buscar: 'Buscar...',
      buscarPlaceholder: 'Buscar usuarios, cursos, empresas...'
    }
  }
  
  const translations = t[idioma as keyof typeof t] || t.es

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de búsqueda
    console.log('Búsqueda:', searchTerm)
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Lado izquierdo - Logo y botón mobile menu */}
          <div className="flex items-center gap-4">
            {/* Botón menu móvil */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">La Pública</h1>
                <p className="text-xs text-red-600 font-medium">Admin</p>
              </div>
            </div>
          </div>

          {/* Centro - Título (solo en desktop) */}
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900">
              {translations.titulo}
            </h2>
          </div>

          {/* Lado derecho - Buscador */}
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-64 lg:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder={translations.buscarPlaceholder}
                />
              </div>
              
              {/* Botón de búsqueda para mobile (opcional) */}
              <button
                type="submit"
                className="sm:hidden absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Search className="h-5 w-5 text-red-600 hover:text-red-700" />
              </button>
            </form>

            {/* Indicador de alertas y admin */}
            <div className="ml-4 hidden sm:flex items-center gap-4">
              {/* Indicador de alertas */}
              {totalAlerts > 0 && (
                <div className="relative">
                  <Bell className="w-5 h-5 text-red-600" />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalAlerts > 99 ? '99+' : totalAlerts}
                  </div>
                </div>
              )}
              
              {/* Indicador de admin */}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="ml-2 text-sm text-red-600 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Título móvil */}
      <div className="lg:hidden px-4 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 text-center">
          {translations.titulo}
        </h2>
      </div>
    </header>
  )
}