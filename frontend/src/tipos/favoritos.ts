export type TipoFavorito = 
  | 'evento' 
  | 'empresa' 
  | 'miembro' 
  | 'grupo' 
  | 'post' 
  | 'oferta' 
  | 'blog' 
  | 'tema-foro';

export interface FavoritoBase {
  id: string;
  usuarioId: string;
  tipo: TipoFavorito;
  fechaGuardado: Date;
  notas?: string; // Notas personales del usuario
}

export interface FavoritoEvento extends FavoritoBase {
  tipo: 'evento';
  eventoId: string;
  titulo: string;
  fecha: Date;
  ubicacion?: string;
  imagen?: string;
}

export interface FavoritoEmpresa extends FavoritoBase {
  tipo: 'empresa';
  empresaId: string;
  nombre: string;
  sector: string;
  logo?: string;
}

export interface FavoritoMiembro extends FavoritoBase {
  tipo: 'miembro';
  miembroId: string;
  nombre: string;
  apellidos: string;
  avatar?: string;
  organizacion?: string;
}

export interface FavoritoGrupo extends FavoritoBase {
  tipo: 'grupo';
  grupoId: string;
  nombre: string;
  descripcion: string;
  miembros: number;
  avatar?: string;
}

export interface FavoritoPost extends FavoritoBase {
  tipo: 'post';
  postId: string;
  titulo?: string;
  contenido: string;
  autorNombre: string;
  fechaPost: Date;
}

export interface FavoritoOferta extends FavoritoBase {
  tipo: 'oferta';
  ofertaId: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  salario?: string;
}

export interface FavoritoBlog extends FavoritoBase {
  tipo: 'blog';
  blogId: string;
  titulo: string;
  resumen: string;
  autor: string;
  fechaPublicacion: Date;
}

export interface FavoritoTemaForo extends FavoritoBase {
  tipo: 'tema-foro';
  temaId: string;
  titulo: string;
  categoria: string;
  respuestas: number;
  ultimaActividad: Date;
}

export type Favorito = 
  | FavoritoEvento 
  | FavoritoEmpresa 
  | FavoritoMiembro 
  | FavoritoGrupo 
  | FavoritoPost 
  | FavoritoOferta 
  | FavoritoBlog 
  | FavoritoTemaForo;

export interface EstadisticasFavoritos {
  total: number;
  porTipo: Record<TipoFavorito, number>;
}

// Interfaces para acciones
export interface AccionFavorito {
  tipo: 'agregar' | 'eliminar' | 'actualizar_notas';
  favorito: Partial<Favorito>;
}

export interface FiltrosFavoritos {
  tipo?: TipoFavorito;
  busqueda?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}