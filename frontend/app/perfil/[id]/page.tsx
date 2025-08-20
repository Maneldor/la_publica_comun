'use client'

import PerfilPublic from '../../../src/componentes/comunes/especificos-comunidad/PerfilPublic'
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral'

interface PerfilPageProps {
  params: { id: string }
}

export default function PerfilPage({ params }: PerfilPageProps) {
  const { id } = params

  return (
    <LayoutGeneral paginaActual="perfil">
      <PerfilPublic usuariId={id} />
    </LayoutGeneral>
  )
}