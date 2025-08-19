'use client'

import PerfilPublic from '../../../src/componentes/comunes/especificos-comunidad/PerfilPublic'
import LayoutXarxaSocial from '../../../src/componentes/comunes/LayoutXarxaSocial'

interface PerfilPageProps {
  params: { id: string }
}

export default function PerfilPage({ params }: PerfilPageProps) {
  const { id } = params

  return (
    <LayoutXarxaSocial paginaActual="perfil">
      <PerfilPublic usuariId={id} />
    </LayoutXarxaSocial>
  )
}