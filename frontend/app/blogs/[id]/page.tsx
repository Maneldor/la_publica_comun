'use client'

import LayoutGeneral from '@/componentes/comunes/LayoutGeneral'
import BlogPost from '@/componentes/comunes/especificos-comunidad/BlogPost'

interface BlogPageProps {
  params: {
    id: string
  }
}

export default function BlogPage({ params }: BlogPageProps) {
  return (
    <LayoutGeneral paginaActual="blogs">
      <BlogPost blogId={params.id} />
    </LayoutGeneral>
  )
}