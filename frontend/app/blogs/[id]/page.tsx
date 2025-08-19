'use client'

import LayoutXarxaSocial from '@/componentes/comunes/LayoutXarxaSocial'
import BlogPost from '@/componentes/comunes/especificos-comunidad/BlogPost'

interface BlogPageProps {
  params: {
    id: string
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  return (
    <LayoutXarxaSocial paginaActual="blogs">
      <BlogPost blogId={params.id} />
    </LayoutXarxaSocial>
  )
}