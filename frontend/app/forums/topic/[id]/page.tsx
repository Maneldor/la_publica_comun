'use client'

import LayoutXarxaSocial from '@/componentes/comunes/LayoutXarxaSocial'
import ForumTopic from '@/componentes/comunes/especificos-comunidad/ForumTopic'

interface ForumTopicPageProps {
  params: {
    id: string
  }
}

export default function ForumTopicPage({ params }: ForumTopicPageProps) {
  return (
    <LayoutXarxaSocial paginaActual="forums">
      <ForumTopic topicId={params.id} />
    </LayoutXarxaSocial>
  )
}