'use client'

import LayoutGeneral from '@/componentes/comunes/LayoutGeneral'
import BlogsPrincipal from '@/componentes/comunes/especificos-comunidad/BlogsPrincipal'

export default function BlogsPage() {
  return (
    <LayoutGeneral paginaActual="blogs">
      <BlogsPrincipal />
    </LayoutGeneral>
  )
}