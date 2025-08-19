'use client'

import LayoutXarxaSocial from '@/componentes/comunes/LayoutXarxaSocial'
import CategoriaForumPage from '@/componentes/comunes/especificos-comunidad/CategoriaForumPage'

interface ForumCategoriaPageProps {
  params: {
    id: string
  }
}

export default function ForumCategoriaPage({ params }: ForumCategoriaPageProps) {
  return (
    <LayoutXarxaSocial paginaActual="forums">
      <CategoriaForumPage categoriaId={params.id} />
    </LayoutXarxaSocial>
  )
}