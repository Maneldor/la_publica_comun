// Tipos para el sistema de enlaces de interés
import { ContenidoMultiidioma } from '../hooks/useContenidoTraducido';

export type TipusInstitucio = 
  | 'AJUNTAMENT'
  | 'DIPUTACIO'
  | 'GENERALITAT'
  | 'ESTAT'
  | 'SINDICAT'
  | 'ASSOCIACIO_PROFESSIONAL'
  | 'COL_LEGI_PROFESSIONAL'
  | 'DEPARTAMENT'
  | 'ORGANISME_AUTONOM'
  | 'UNIVERSITAT'
  | 'ALTRES';

export type AmbitTerritorial = 
  | 'LOCAL'
  | 'COMARCAL'
  | 'PROVINCIAL'
  | 'AUTONOMIC'
  | 'ESTATAL'
  | 'INTERNACIONAL';

export interface ContacteInstitucio {
  telefon?: string;
  email?: string;
  web: string;
  adreça?: string;
  codiPostal?: string;
  ciutat?: string;
  provincia?: string;
}

export interface InstitucioEnllac {
  id: string;
  nom: ContenidoMultiidioma;
  tipus: TipusInstitucio;
  ambit: AmbitTerritorial;
  descripcio: ContenidoMultiidioma;
  logo?: string;
  contacte: ContacteInstitucio;
  
  // Classificació adicional
  tags: string[]; // ['funcionaris', 'oposicions', 'formacio', etc.]
  sectors?: string[]; // ['educacio', 'sanitat', 'seguretat', etc.]
  
  // Metadatos
  verificat: boolean;
  destacat: boolean;
  dataRegistre: Date;
  dataActualitzacio: Date;
  actiu: boolean;
  
  // Estadístiques
  visites: number;
  clics: number;
}

export interface FiltresEnllacos {
  cerca?: string;
  tipus?: TipusInstitucio;
  ambit?: AmbitTerritorial;
  provincia?: string;
  sector?: string;
  nomesTelefon?: boolean;
  nomesEmail?: boolean;
  nomesVerificats?: boolean;
  nomesDestacats?: boolean;
  ordenPer?: 'NOM' | 'TIPUS' | 'VISITES' | 'DATA';
  ordenDireccio?: 'ASC' | 'DESC';
}

export interface EstadistiquesEnllacos {
  totalInstitucions: number;
  institucionsPerTipus: { [K in TipusInstitucio]: number };
  institucionsPerAmbit: { [K in AmbitTerritorial]: number };
  institucionsPerProvincia: { [provincia: string]: number };
  totalVisites: number;
  totalClics: number;
  institucionsVerificades: number;
  institucionsDestacades: number;
}

// Catàleg predefinit de tipus d'institucions amb metadades
export interface TipusInstitucioMetadata {
  nom: ContenidoMultiidioma;
  descripcio: ContenidoMultiidioma;
  icona: string;
  color: string;
  exemples: string[];
}

export const TIPUS_INSTITUCIONS_METADATA: Record<TipusInstitucio, TipusInstitucioMetadata> = {
  AJUNTAMENT: {
    nom: {
      texto: 'Ajuntaments',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Ajuntaments', es: 'Ayuntamientos' }
    },
    descripcio: {
      texto: 'Governs locals municipals',
      idiomaOriginal: 'ca', 
      traducciones: { ca: 'Governs locals municipals', es: 'Gobiernos locales municipales' }
    },
    icona: '🏛️',
    color: '#3B82F6',
    exemples: ['Ajuntament de Barcelona', 'Ajuntament de Madrid']
  },
  DIPUTACIO: {
    nom: {
      texto: 'Diputacions',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Diputacions', es: 'Diputaciones' }
    },
    descripcio: {
      texto: 'Governs provincials',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Governs provincials', es: 'Gobiernos provinciales' }
    },
    icona: '🏢',
    color: '#8B5CF6',
    exemples: ['Diputació de Barcelona', 'Diputación de Madrid']
  },
  GENERALITAT: {
    nom: {
      texto: 'Generalitats',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Generalitats', es: 'Generalidades' }
    },
    descripcio: {
      texto: 'Governs autonòmics',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Governs autonòmics', es: 'Gobiernos autonómicos' }
    },
    icona: '🏛️',
    color: '#F59E0B',
    exemples: ['Generalitat de Catalunya', 'Generalitat Valenciana']
  },
  ESTAT: {
    nom: {
      texto: 'Administració Estatal',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Administració Estatal', es: 'Administración Estatal' }
    },
    descripcio: {
      texto: 'Organismes del govern central',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Organismes del govern central', es: 'Organismos del gobierno central' }
    },
    icona: '🇪🇸',
    color: '#DC2626',
    exemples: ['Ministeris', 'Delegacions del Govern']
  },
  SINDICAT: {
    nom: {
      texto: 'Sindicats',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Sindicats', es: 'Sindicatos' }
    },
    descripcio: {
      texto: 'Organitzacions sindicals',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Organitzacions sindicals', es: 'Organizaciones sindicales' }
    },
    icona: '✊',
    color: '#EF4444',
    exemples: ['CCOO', 'UGT', 'CGT']
  },
  ASSOCIACIO_PROFESSIONAL: {
    nom: {
      texto: 'Associacions Professionals',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Associacions Professionals', es: 'Asociaciones Profesionales' }
    },
    descripcio: {
      texto: 'Associacions de funcionaris i empleats públics',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Associacions de funcionaris i empleats públics', es: 'Asociaciones de funcionarios y empleados públicos' }
    },
    icona: '👥',
    color: '#10B981',
    exemples: ['Associació de Funcionaris', 'Federació d\'Empleats Públics']
  },
  COL_LEGI_PROFESSIONAL: {
    nom: {
      texto: 'Col·legis Professionals',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Col·legis Professionals', es: 'Colegios Profesionales' }
    },
    descripcio: {
      texto: 'Col·legis oficials de professionals',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Col·legis oficials de professionals', es: 'Colegios oficiales de profesionales' }
    },
    icona: '🎓',
    color: '#6366F1',
    exemples: ['Col·legi d\'Advocats', 'Col·legi de Metges']
  },
  DEPARTAMENT: {
    nom: {
      texto: 'Departaments',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Departaments', es: 'Departamentos' }
    },
    descripcio: {
      texto: 'Departaments governamentals específics',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Departaments governamentals específics', es: 'Departamentos gubernamentales específicos' }
    },
    icona: '🏢',
    color: '#0EA5E9',
    exemples: ['Departament d\'Educació', 'Departament de Salut']
  },
  ORGANISME_AUTONOM: {
    nom: {
      texto: 'Organismes Autònoms',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Organismes Autònoms', es: 'Organismos Autónomos' }
    },
    descripcio: {
      texto: 'Entitats públiques amb autonomia',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Entitats públiques amb autonomia', es: 'Entidades públicas con autonomía' }
    },
    icona: '⚖️',
    color: '#7C3AED',
    exemples: ['SEPE', 'INSS', 'Agència Tributària']
  },
  UNIVERSITAT: {
    nom: {
      texto: 'Universitats',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Universitats', es: 'Universidades' }
    },
    descripcio: {
      texto: 'Universitats públiques',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Universitats públiques', es: 'Universidades públicas' }
    },
    icona: '🎓',
    color: '#059669',
    exemples: ['Universitat de Barcelona', 'Universidad Complutense']
  },
  ALTRES: {
    nom: {
      texto: 'Altres',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Altres', es: 'Otros' }
    },
    descripcio: {
      texto: 'Altres institucions d\'interès',
      idiomaOriginal: 'ca',
      traducciones: { ca: 'Altres institucions d\'interès', es: 'Otras instituciones de interés' }
    },
    icona: '📋',
    color: '#6B7280',
    exemples: ['Fundacions', 'Observatoris']
  }
};