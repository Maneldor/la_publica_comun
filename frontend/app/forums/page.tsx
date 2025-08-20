'use client'

import LayoutGeneral from '@/componentes/comunes/LayoutGeneral'
import ForumPrincipal from '@/componentes/comunes/especificos-comunidad/ForumPrincipal'

export default function ForumsPage() {
  return (
    <LayoutGeneral paginaActual="forums">
      <ForumPrincipal />
    </LayoutGeneral>
  )
}