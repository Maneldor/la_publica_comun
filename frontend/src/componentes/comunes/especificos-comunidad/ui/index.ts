// Exportaciones centralizadas de componentes UI
export { 
  Boton,
  default as BotonDefault 
} from './Boton';

export { 
  Tarjeta,
  EncabezadoTarjeta,
  ContenidoTarjeta,
  PieTarjeta,
  TarjetaEstadistica,
  default as TarjetaDefault 
} from './Tarjeta';

// Re-exportar tipos si es necesario
export type { PropiedadesBoton } from './Boton';
export type { 
  PropiedadesTarjeta,
  PropiedadesEncabezadoTarjeta,
  PropiedadesContenidoTarjeta,
  PropiedadesPieTarjeta 
} from './Tarjeta';