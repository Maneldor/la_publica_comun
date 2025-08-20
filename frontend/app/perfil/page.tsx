'use client'

import PerfilPublic from '../../src/componentes/comunes/especificos-comunidad/PerfilPublic'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'

export default function PerfilPage() {
  // Cuando es tu propio perfil, usamos user-1 como ID
  // En producción esto vendría del contexto de autenticación
  return (
    <LayoutGeneral paginaActual="perfil">
      <PerfilPublic usuariId="user-1" />
    </LayoutGeneral>
  )
}