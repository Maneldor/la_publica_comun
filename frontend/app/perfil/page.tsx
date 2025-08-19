'use client'

import PerfilPublic from '../../src/componentes/comunes/especificos-comunidad/PerfilPublic'
import LayoutXarxaSocial from '../../src/componentes/comunes/LayoutXarxaSocial'

export default function PerfilPage() {
  // Cuando es tu propio perfil, usamos user-1 como ID
  // En producción esto vendría del contexto de autenticación
  return (
    <LayoutXarxaSocial paginaActual="perfil">
      <PerfilPublic usuariId="user-1" />
    </LayoutXarxaSocial>
  )
}