'use client'

import LayoutGeneral from '@/componentes/comunes/LayoutGeneral'
import ForumTopic from '@/componentes/comunes/especificos-comunidad/ForumTopic'

interface ForumTopicPageProps {
  params: {
    id: string
  }
}

export default function ForumTopicPage({ params }: ForumTopicPageProps) {
  return (
    <LayoutGeneral paginaActual="forums">
      <ForumTopic topicId={params.id} />
    </LayoutGeneral>
  )
}