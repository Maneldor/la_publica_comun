'use client'

import { Languages } from 'lucide-react'
import { useComunidad } from '../../../app/ComunidadContext'

const NOMS_IDIOMES = {
  'ca': 'Català',
  'es': 'Español', 
  'eu': 'Euskera',
  'gl': 'Galego'
}

export function SelectorIdioma() {
  const { configuracion, idioma, cambiarIdioma } = useComunidad()
  
  // Solo mostrar si tiene más de un idioma
  if (configuracion.idiomas.length <= 1) {
    return null
  }

  const idiomaAlternatiu = configuracion.idiomas.find(i => i !== idioma)
  
  if (!idiomaAlternatiu) {
    return null
  }

  return (
    <button
      onClick={() => cambiarIdioma(idiomaAlternatiu)}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={`Canviar a ${NOMS_IDIOMES[idiomaAlternatiu as keyof typeof NOMS_IDIOMES]}`}
    >
      <Languages className="w-4 h-4" />
      <span className="hidden sm:inline text-xs">
        {NOMS_IDIOMES[idiomaAlternatiu as keyof typeof NOMS_IDIOMES]}
      </span>
    </button>
  )
}