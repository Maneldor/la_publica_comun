'use client'

import LayoutGeneral from '@/componentes/comunes/LayoutGeneral'
import CategoriaForumPage from '@/componentes/comunes/especificos-comunidad/CategoriaForumPage'

interface ForumCategoriaPageProps {
  params: {
    id: string
  }
}

export default function ForumCategoriaPage({ params }: ForumCategoriaPageProps) {
  return (
    <LayoutGeneral paginaActual="forums">
      <CategoriaForumPage categoriaId={params.id} />
    </LayoutGeneral>
  )
}