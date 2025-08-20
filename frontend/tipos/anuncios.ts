// Tipos para el sistema de tablón de anuncios
import { ContenidoMultiidioma } from '../hooks/useContenidoTraducido';

export type CategoriaAnuncio = 
  | 'TRABAJO'
  | 'VIVIENDA' 
  | 'VENTA'
  | 'SERVICIOS'
  | 'INTERCAMBIO'
  | 'EVENTOS';

export type SubcategoriaAnuncio = {
  TRABAJO: 'OFERTA_EMPLEO' | 'INTERCAMBIO_PUESTO' | 'SUSTITUCION' | 'OPOSICIONES';
  VIVIENDA: 'ALQUILER' | 'VENTA' | 'INTERCAMBIO' | 'COMPARTIR';
  VENTA: 'LIBROS' | 'MATERIAL_OFICINA' | 'ELECTRONICA' | 'HOGAR' | 'OTROS';
  SERVICIOS: 'CLASES' | 'TRADUCCIONES' | 'ASESORIA' | 'REPARACIONES' | 'OTROS';
  INTERCAMBIO: 'OBJETOS' | 'TURNOS' | 'SERVICIOS' | 'OTROS';
  EVENTOS: 'SOCIAL' | 'CULTURAL' | 'DEPORTIVO' | 'FAMILIAR' | 'PROFESIONAL';
};

export type EstadoAnuncio = 'ACTIVO' | 'PAUSADO' | 'VENDIDO' | 'CADUCADO' | 'MODERACION';

export type TipoPrecio = 'FIJO' | 'NEGOCIABLE' | 'INTERCAMBIO' | 'GRATUITO';

export interface UbicacionAnuncio {
  provincia: string;
  ciudad: string;
  codigoPostal?: string;
  direccion?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface ContactoAnuncio {
  telefono?: string;
  email?: string;
  whatsapp?: string;
  preferencia: 'TELEFONO' | 'EMAIL' | 'WHATSAPP' | 'CHAT_INTERNO';
  horarioContacto?: string;
}

export interface PrecioAnuncio {
  tipo: TipoPrecio;
  valor?: number;
  moneda: string;
  negociable: boolean;
}

export interface UsuarioAnuncio {
  id: string;
  nombre: string;
  apellidos?: string;
  avatar?: string;
  organizacion: string;
  provincia: string;
  verificado: boolean;
  valoracion?: number;
  fechaRegistro: Date;
}

export interface AnuncioBase {
  id: string;
  titulo: ContenidoMultiidioma;
  descripcion: ContenidoMultiidioma;
  categoria: CategoriaAnuncio;
  subcategoria: string;
  precio: PrecioAnuncio;
  ubicacion: UbicacionAnuncio;
  contacto: ContactoAnuncio;
  imagenes: string[];
  tags: string[];
  
  // Metadata
  autor: UsuarioAnuncio;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaExpiracion: Date;
  estado: EstadoAnuncio;
  
  // Estadísticas
  vistas: number;
  favoritos: number;
  contactos: number;
  
  // Moderación
  reportes: number;
  verificado: boolean;
  destacado: boolean;
}

// Extensiones específicas por categoría
export interface AnuncioTrabajo extends AnuncioBase {
  categoria: 'TRABAJO';
  detalles: {
    tipoContrato?: string;
    jornada?: string;
    salario?: {
      min?: number;
      max?: number;
      moneda: string;
    };
    experienciaRequerida?: string;
    tituloRequerido?: string;
    fechaIncorporacion?: Date;
  };
}

export interface AnuncioVivienda extends AnuncioBase {
  categoria: 'VIVIENDA';
  detalles: {
    superficie?: number;
    habitaciones?: number;
    banos?: number;
    planta?: string;
    ascensor?: boolean;
    amueblado?: boolean;
    mascotas?: boolean;
    gastos?: number;
    fianza?: number;
    tipoVivienda?: string;
  };
}

export interface AnuncioVenta extends AnuncioBase {
  categoria: 'VENTA';
  detalles: {
    estado: 'NUEVO' | 'COMO_NUEVO' | 'BUEN_ESTADO' | 'USADO' | 'PARA_REPARAR';
    marca?: string;
    modelo?: string;
    anoCompra?: number;
    garantia?: boolean;
    entregaDomicilio?: boolean;
  };
}

export interface AnuncioServicio extends AnuncioBase {
  categoria: 'SERVICIOS';
  detalles: {
    modalidad: 'PRESENCIAL' | 'ONLINE' | 'AMBAS';
    duracion?: string;
    experiencia?: string;
    certificaciones?: string[];
    disponibilidad?: string;
    desplazamiento?: boolean;
  };
}

export interface AnuncioIntercambio extends AnuncioBase {
  categoria: 'INTERCAMBIO';
  detalles: {
    busco: string;
    ofrezco: string;
    valorAproximado?: number;
    flexible: boolean;
  };
}

export interface AnuncioEvento extends AnuncioBase {
  categoria: 'EVENTOS';
  detalles: {
    fechaEvento: Date;
    horaInicio?: string;
    horaFin?: string;
    plazasDisponibles?: number;
    inscripcionRequerida: boolean;
    precio?: PrecioAnuncio;
    organizador: string;
  };
}

export type Anuncio = 
  | AnuncioTrabajo 
  | AnuncioVivienda 
  | AnuncioVenta 
  | AnuncioServicio 
  | AnuncioIntercambio 
  | AnuncioEvento;

// Filtros de búsqueda
export interface FiltrosAnuncios {
  categoria?: CategoriaAnuncio;
  subcategoria?: string;
  ubicacion?: {
    provincia?: string;
    ciudad?: string;
    radio?: number; // km
  };
  precio?: {
    min?: number;
    max?: number;
    tipo?: TipoPrecio[];
  };
  fechaPublicacion?: {
    desde?: Date;
    hasta?: Date;
  };
  estado?: EstadoAnuncio[];
  destacados?: boolean;
  conImagenes?: boolean;
  busqueda?: string;
  tags?: string[];
  ordenPor?: 'FECHA' | 'PRECIO' | 'VISTAS' | 'RELEVANCIA';
  ordenDireccion?: 'ASC' | 'DESC';
}

// Estadísticas del tablón
export interface EstadisticasTablon {
  totalAnuncios: number;
  anunciosActivos: number;
  anunciosHoy: number;
  categorias: {
    [K in CategoriaAnuncio]: number;
  };
  ubicaciones: {
    provincia: string;
    cantidad: number;
  }[];
  tendencias: {
    periodo: string;
    anunciosNuevos: number;
    contactosRealizados: number;
  }[];
}