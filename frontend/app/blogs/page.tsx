'use client'

import LayoutXarxaSocial from '@/componentes/comunes/LayoutXarxaSocial'
import BlogsPrincipal from '@/componentes/comunes/especificos-comunidad/BlogsPrincipal'

export default function BlogsPage() {
  return (
    <LayoutXarxaSocial paginaActual="blogs">
      <BlogsPrincipal />
    </LayoutXarxaSocial>
  )
}