import DirectoriMembres from '../../src/componentes/comunes/especificos-comunidad/DirectoriMembres'
import LayoutXarxaSocial from '../../src/componentes/comunes/LayoutXarxaSocial'

export default function MembresPage() {
  return (
    <LayoutXarxaSocial paginaActual="membres">
      <DirectoriMembres />
    </LayoutXarxaSocial>
  )
}