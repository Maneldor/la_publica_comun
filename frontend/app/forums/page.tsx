'use client'

import LayoutXarxaSocial from '@/componentes/comunes/LayoutXarxaSocial'
import ForumPrincipal from '@/componentes/comunes/especificos-comunidad/ForumPrincipal'

export default function ForumsPage() {
  return (
    <LayoutXarxaSocial paginaActual="forums">
      <ForumPrincipal />
    </LayoutXarxaSocial>
  )
}