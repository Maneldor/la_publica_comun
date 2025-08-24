// ✅ EXPORTS CENTRALIZADOS - Patrón Barrel
// Facilita imports y permite tree-shaking eficiente

export { FormularioEvento } from './FormularioEvento'
export { CalendarioEventos } from './CalendarioEventos'
export { DetalleEvento } from './DetalleEvento'

// ✅ Re-export de tipos para comodidad
export type {
  PropiedadesFormularioEvento,
  PropiedadesCalendarioEventos,
  PropiedadesDetalleEvento
} from '../../../tipos/eventos'