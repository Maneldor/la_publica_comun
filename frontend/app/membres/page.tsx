import DirectoriMembres from '../../src/componentes/comunes/especificos-comunidad/DirectoriMembres'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'

export default function MembresPage() {
  return (
    <LayoutGeneral paginaActual="membres">
      <DirectoriMembres />
    </LayoutGeneral>
  )
}