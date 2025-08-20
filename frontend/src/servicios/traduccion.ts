// Servicio de traducción automática
// En producción esto sería Google Translate API, DeepL, etc.

export type IdiomasSoportados = 'es' | 'ca' | 'eu' | 'gl';

// Mock de traducciones comunes para demostración
const TRADUCCIONES_MOCK: Record<string, Record<IdiomasSoportados, string>> = {
  // Tecnología
  'MacBook Pro 13" M2 - Como nuevo': {
    es: 'MacBook Pro 13" M2 - Como nuevo',
    ca: 'MacBook Pro 13" M2 - Com nou',
    eu: 'MacBook Pro 13" M2 - Berri moduan',
    gl: 'MacBook Pro 13" M2 - Como novo'
  },
  'Vendo MacBook Pro de 13 pulgadas con chip M2, apenas 3 meses de uso. Incluye cargador original y funda. Perfecto estado.': {
    es: 'Vendo MacBook Pro de 13 pulgadas con chip M2, apenas 3 meses de uso. Incluye cargador original y funda. Perfecto estado.',
    ca: 'Venc MacBook Pro de 13 polzades amb xip M2, tot just 3 mesos d\'ús. Inclou carregador original i funda. Estat perfecte.',
    eu: 'MacBook Pro 13 hazbetekoa M2 txiparekin saltzen dut, 3 hilabeteko erabilerarik ia egin gabe. Jatorrizko kargagailua eta fundua barne. Egoera ezin hobea.',
    gl: 'Vendo MacBook Pro de 13 polgadas con chip M2, apenas 3 meses de uso. Inclúe cargador orixinal e funda. Estado perfecto.'
  },
  
  // Vivienda
  'Habitación en piso compartido - Centro': {
    es: 'Habitación en piso compartido - Centro',
    ca: 'Habitació en pis compartit - Centre',
    eu: 'Gela pisu partekatuan - Erdialden',
    gl: 'Habitación en piso compartido - Centro'
  },
  'Alquilo habitación individual en piso compartido en el centro de la ciudad. Piso muy tranquilo, ideal para funcionarios.': {
    es: 'Alquilo habitación individual en piso compartido en el centro de la ciudad. Piso muy tranquilo, ideal para funcionarios.',
    ca: 'Llogue habitació individual en pis compartit al centre de la ciutat. Pis molt tranquil, ideal per a funcionaris.',
    eu: 'Gela bakarra alokatzen dut pisu partekatuan hiriko erdialdean. Pisu oso lasaia, funtzionarientzako ezin hobea.',
    gl: 'Alquilo habitación individual en piso compartido no centro da cidade. Piso moi tranquilo, ideal para funcionarios.'
  },
  
  // Servicios
  'Clases de inglés - Preparación B2/C1': {
    es: 'Clases de inglés - Preparación B2/C1',
    ca: 'Classes d\'anglès - Preparació B2/C1',
    eu: 'Ingelesa eskolak - B2/C1 prestaketa',
    gl: 'Clases de inglés - Preparación B2/C1'
  },
  'Profesora nativa ofrece clases de inglés para funcionarios. Especializada en preparación de certificaciones oficiales.': {
    es: 'Profesora nativa ofrece clases de inglés para funcionarios. Especializada en preparación de certificaciones oficiales.',
    ca: 'Professora nativa ofereix classes d\'anglès per a funcionaris. Especialitzada en preparació de certificacions oficials.',
    eu: 'Irakasle jatorrak funtzionarientzako ingelesa eskolak eskaintzen ditu. Ziurtagiri ofizialen prestaketan espezializatua.',
    gl: 'Profesora nativa ofrece clases de inglés para funcionarios. Especializada en preparación de certificacións oficiais.'
  }
};

// Función para traducir texto
export async function traducirTexto(
  texto: string, 
  idiomaOrigen: IdiomasSoportados, 
  idiomaDestino: IdiomasSoportados
): Promise<string> {
  
  // Si es el mismo idioma, devolver el original
  if (idiomaOrigen === idiomaDestino) {
    return texto;
  }
  
  // Buscar en traducciones mock
  const traduccionExacta = TRADUCCIONES_MOCK[texto];
  if (traduccionExacta && traduccionExacta[idiomaDestino]) {
    return traduccionExacta[idiomaDestino];
  }
  
  // Simulación de API de traducción con delay realista
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Traducciones básicas por patrón
  return traducirPorPatron(texto, idiomaDestino);
}

// Función para traducir por patrones comunes
function traducirPorPatron(texto: string, idioma: IdiomasSoportados): string {
  const patrones = {
    ca: {
      'Vendo ': 'Venc ',
      'Como nuevo': 'Com nou',
      'Perfecto estado': 'Estat perfecte',
      'Incluye': 'Inclou',
      'Alquilo': 'Llogue',
      'Centro': 'Centre',
      'Ideal para': 'Ideal per a',
      'funcionarios': 'funcionaris',
      'Profesora': 'Professora',
      'ofrece': 'ofereix',
      'Especializada': 'Especialitzada',
      'preparación': 'preparació',
      'certificaciones': 'certificacions'
    },
    eu: {
      'Vendo ': 'Saltzen dut ',
      'Como nuevo': 'Berri moduan',
      'Perfecto estado': 'Egoera ezin hobea',
      'Incluye': 'Barne dago',
      'Alquilo': 'Alokatzen dut',
      'Centro': 'Erdialden',
      'Ideal para': 'Ezin hobea',
      'funcionarios': 'funtzionarientzako',
      'Profesora': 'Irakasle',
      'ofrece': 'eskaintzen du',
      'Especializada': 'Espezializatua',
      'preparación': 'prestaketan',
      'certificaciones': 'ziurtagirietan'
    },
    gl: {
      'Vendo ': 'Vendo ',
      'Como nuevo': 'Como novo',
      'Perfecto estado': 'Estado perfecto',
      'Incluye': 'Inclúe',
      'Alquilo': 'Alquilo',
      'Centro': 'Centro',
      'Ideal para': 'Ideal para',
      'funcionarios': 'funcionarios',
      'Profesora': 'Profesora',
      'ofrece': 'ofrece',
      'Especializada': 'Especializada',
      'preparación': 'preparación',
      'certificaciones': 'certificacións'
    }
  };
  
  let textoTraducido = texto;
  const patronesIdioma = patrones[idioma];
  
  if (patronesIdioma) {
    Object.entries(patronesIdioma).forEach(([original, traduccion]) => {
      textoTraducido = textoTraducido.replace(new RegExp(original, 'gi'), traduccion);
    });
  }
  
  return textoTraducido;
}

// Función para obtener idioma de la comunidad
export function obtenerIdiomaComunidad(provincia: string): IdiomasSoportados {
  const mapeoProvincias: Record<string, IdiomasSoportados> = {
    // Catalunya
    'Barcelona': 'ca',
    'Girona': 'ca',
    'Lleida': 'ca',
    'Tarragona': 'ca',
    
    // País Vasco
    'Araba': 'eu',
    'Bizkaia': 'eu', 
    'Gipuzkoa': 'eu',
    'Álava': 'eu',
    'Vizcaya': 'eu',
    'Guipúzcoa': 'eu',
    
    // Galicia
    'A Coruña': 'gl',
    'Lugo': 'gl',
    'Ourense': 'gl',
    'Pontevedra': 'gl',
    'La Coruña': 'gl',
    'Orense': 'gl',
    
    // Valencia (también catalán)
    'Castellón': 'ca',
    'Valencia': 'ca',
    'Alicante': 'ca',
    'Castelló': 'ca',
    'València': 'ca',
    
    // Balears (catalán)
    'Palma': 'ca',
    'Illes Balears': 'ca',
    'Baleares': 'ca'
  };
  
  return mapeoProvincias[provincia] || 'es';
}

// Cache de traducciones para evitar llamadas repetidas
const cacheTraduccion = new Map<string, string>();

export function generarClaveCache(texto: string, idiomaOrigen: IdiomasSoportados, idiomaDestino: IdiomasSoportados): string {
  return `${texto}|${idiomaOrigen}|${idiomaDestino}`;
}

export async function traducirConCache(
  texto: string,
  idiomaOrigen: IdiomasSoportados,
  idiomaDestino: IdiomasSoportados
): Promise<string> {
  const clave = generarClaveCache(texto, idiomaOrigen, idiomaDestino);
  
  if (cacheTraduccion.has(clave)) {
    return cacheTraduccion.get(clave)!;
  }
  
  const traduccion = await traducirTexto(texto, idiomaOrigen, idiomaDestino);
  cacheTraduccion.set(clave, traduccion);
  
  return traduccion;
}