export interface ConfiguracionComunidad {
  codigo: string;
  nombre: string;
  host: string;
  idiomas: string[];
  idiomaDefecto: string;
  tema: {
    colorPrimario: string;
    colorSecundario: string;
    colorAccento: string;
  };
  organizaciones: string[];
  provincias: string[];
  tiposUsuario: string[];
  caracteristicas: {
    empresas: boolean;
    sindicatos: boolean;
    oposiciones: boolean;
    bolsasTrabajo: boolean;
    interinidades: boolean;
  };
}

const COMUNIDADES: ConfiguracionComunidad[] = [
  {
    codigo: 'catalunya',
    nombre: 'Catalunya',
    host: 'lapublica.cat',
    idiomas: ['ca', 'es'],
    idiomaDefecto: 'ca',
    tema: {
      colorPrimario: '#0066CC',
      colorSecundario: '#FF6B35',
      colorAccento: '#4CAF50',
    },
    organizaciones: [
      'Generalitat de Catalunya',
      'Ajuntament de Barcelona',
      'Ajuntament de Girona',
      'Ajuntament de Lleida',
      'Ajuntament de Tarragona',
    ],
    provincias: ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'euskadi',
    nombre: 'Euskadi',
    host: 'lapublica.eus',
    idiomas: ['eu', 'es'],
    idiomaDefecto: 'eu',
    tema: {
      colorPrimario: '#009B48',
      colorSecundario: '#DC143C',
      colorAccento: '#FFA500',
    },
    organizaciones: [
      'Gobierno Vasco',
      'Ayuntamiento de Bilbao',
      'Ayuntamiento de Donostia',
      'Ayuntamiento de Vitoria-Gasteiz',
    ],
    provincias: ['Araba/Álava', 'Bizkaia', 'Gipuzkoa'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'galicia',
    nombre: 'Galicia',
    host: 'lapublica.gal',
    idiomas: ['gl', 'es'],
    idiomaDefecto: 'gl',
    tema: {
      colorPrimario: '#005EB8',
      colorSecundario: '#FFCC00',
      colorAccento: '#009639',
    },
    organizaciones: [
      'Xunta de Galicia',
      'Concello de A Coruña',
      'Concello de Vigo',
      'Concello de Santiago',
      'Concello de Ourense',
    ],
    provincias: ['A Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'madrid',
    nombre: 'Madrid',
    host: 'madrid.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#CD0E2A',
      colorSecundario: '#0066CC',
      colorAccento: '#FFB900',
    },
    organizaciones: [
      'Comunidad de Madrid',
      'Ayuntamiento de Madrid',
      'Ayuntamiento de Alcalá de Henares',
      'Ayuntamiento de Móstoles',
    ],
    provincias: ['Madrid'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'andalucia',
    nombre: 'Andalucía',
    host: 'andalucia.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#007F3D',
      colorSecundario: '#FFFFFF',
      colorAccento: '#E4002B',
    },
    organizaciones: [
      'Junta de Andalucía',
      'Ayuntamiento de Sevilla',
      'Ayuntamiento de Granada',
      'Ayuntamiento de Córdoba',
      'Ayuntamiento de Málaga',
    ],
    provincias: ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'valencia',
    nombre: 'Comunitat Valenciana',
    host: 'valencia.lapublica.es',
    idiomas: ['ca', 'es'],
    idiomaDefecto: 'ca',
    tema: {
      colorPrimario: '#003DA5',
      colorSecundario: '#FF6600',
      colorAccento: '#FFCC00',
    },
    organizaciones: [
      'Generalitat Valenciana',
      'Ajuntament de València',
      'Ajuntament d\'Alacant',
      'Ajuntament de Castelló',
    ],
    provincias: ['Alicante', 'Castellón', 'Valencia'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'baleares',
    nombre: 'Illes Balears',
    host: 'baleares.lapublica.es',
    idiomas: ['ca', 'es'],
    idiomaDefecto: 'ca',
    tema: {
      colorPrimario: '#0066CC',
      colorSecundario: '#FF9900',
      colorAccento: '#009639',
    },
    organizaciones: [
      'Govern de les Illes Balears',
      'Ajuntament de Palma',
      'Consell de Mallorca',
      'Consell d\'Eivissa',
    ],
    provincias: ['Baleares'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'aragon',
    nombre: 'Aragón',
    host: 'aragon.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#B8860B',
      colorSecundario: '#8B0000',
      colorAccento: '#FFD700',
    },
    organizaciones: [
      'Gobierno de Aragón',
      'Ayuntamiento de Zaragoza',
      'Ayuntamiento de Huesca',
      'Ayuntamiento de Teruel',
    ],
    provincias: ['Huesca', 'Teruel', 'Zaragoza'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'asturias',
    nombre: 'Asturias',
    host: 'asturias.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#0066CC',
      colorSecundario: '#FFD700',
      colorAccento: '#009639',
    },
    organizaciones: [
      'Principado de Asturias',
      'Ayuntamiento de Oviedo',
      'Ayuntamiento de Gijón',
      'Ayuntamiento de Avilés',
    ],
    provincias: ['Asturias'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'canarias',
    nombre: 'Canarias',
    host: 'canarias.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#FFD700',
      colorSecundario: '#0066CC',
      colorAccento: '#FF6600',
    },
    organizaciones: [
      'Gobierno de Canarias',
      'Ayuntamiento de Las Palmas',
      'Ayuntamiento de Santa Cruz de Tenerife',
      'Cabildo de Gran Canaria',
    ],
    provincias: ['Las Palmas', 'Santa Cruz de Tenerife'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'cantabria',
    nombre: 'Cantabria',
    host: 'cantabria.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#0066CC',
    },
    organizaciones: [
      'Gobierno de Cantabria',
      'Ayuntamiento de Santander',
      'Ayuntamiento de Torrelavega',
    ],
    provincias: ['Cantabria'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'castilla-mancha',
    nombre: 'Castilla-La Mancha',
    host: 'castillalamancha.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#0066CC',
    },
    organizaciones: [
      'Junta de Castilla-La Mancha',
      'Ayuntamiento de Toledo',
      'Ayuntamiento de Albacete',
      'Ayuntamiento de Ciudad Real',
    ],
    provincias: ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'castilla-leon',
    nombre: 'Castilla y León',
    host: 'castillayleon.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#0066CC',
    },
    organizaciones: [
      'Junta de Castilla y León',
      'Ayuntamiento de Valladolid',
      'Ayuntamiento de Burgos',
      'Ayuntamiento de Salamanca',
    ],
    provincias: ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'extremadura',
    nombre: 'Extremadura',
    host: 'extremadura.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#007F3D',
      colorSecundario: '#FFD700',
      colorAccento: '#8B0000',
    },
    organizaciones: [
      'Junta de Extremadura',
      'Ayuntamiento de Badajoz',
      'Ayuntamiento de Cáceres',
      'Ayuntamiento de Mérida',
    ],
    provincias: ['Badajoz', 'Cáceres'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'la-rioja',
    nombre: 'La Rioja',
    host: 'larioja.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#007F3D',
    },
    organizaciones: [
      'Gobierno de La Rioja',
      'Ayuntamiento de Logroño',
    ],
    provincias: ['La Rioja'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'murcia',
    nombre: 'Murcia',
    host: 'murcia.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#0066CC',
    },
    organizaciones: [
      'Región de Murcia',
      'Ayuntamiento de Murcia',
      'Ayuntamiento de Cartagena',
    ],
    provincias: ['Murcia'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
  {
    codigo: 'navarra',
    nombre: 'Navarra',
    host: 'navarra.lapublica.es',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    tema: {
      colorPrimario: '#8B0000',
      colorSecundario: '#FFD700',
      colorAccento: '#0066CC',
    },
    organizaciones: [
      'Gobierno de Navarra',
      'Ayuntamiento de Pamplona',
    ],
    provincias: ['Navarra'],
    tiposUsuario: ['miembro', 'empresa', 'administracion', 'sindicato'],
    caracteristicas: {
      empresas: true,
      sindicatos: true,
      oposiciones: true,
      bolsasTrabajo: true,
      interinidades: true,
    },
  },
];

export function obtenerComunidadActual(): ConfiguracionComunidad {
  if (typeof window === 'undefined') {
    // SSR: retornar Catalunya por defecto
    return COMUNIDADES[0];
  }

  const hostname = window.location.hostname;
  
  // En desarrollo (localhost), siempre devolver Catalunya
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return COMUNIDADES[0]; // Catalunya
  }
  
  // Buscar comunidad por hostname
  const comunidad = COMUNIDADES.find(c => 
    hostname.includes(c.host) || 
    hostname.includes(c.codigo)
  );

  // Si no se encuentra, usar Catalunya por defecto
  return comunidad || COMUNIDADES[0];
}

export function obtenerComunidadPorCodigo(codigo: string): ConfiguracionComunidad {
  const comunidad = COMUNIDADES.find(c => c.codigo === codigo);
  
  if (!comunidad) {
    throw new Error(`Comunidad con código "${codigo}" no encontrada`);
  }
  
  return comunidad;
}

export function obtenerTodasLasComunidades(): ConfiguracionComunidad[] {
  return COMUNIDADES;
}