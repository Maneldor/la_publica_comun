// Tipos para el sistema de asesoramiento
import { ContenidoMultiidioma } from '../hooks/useContenidoTraducido';

export type TipoAsesorament = 
  | 'JURIDIC'
  | 'FISCAL'
  | 'LABORAL'
  | 'FINANCIER'
  | 'IMMOBILIARI'
  | 'FAMILIAR'
  | 'PENAL'
  | 'ADMINISTRATIU'
  | 'ALTRES';

export type ModalitatiAsesorament = 
  | 'TELEFONIC'
  | 'PRESENCIAL'
  | 'EMAIL'
  | 'VIDEOCONFERENCIA'
  | 'CHAT';

export type TipusTarifa = 
  | 'GRATUITA'
  | 'PRIMERA_CONSULTA_GRATUITA'
  | 'DESCOMPTE'
  | 'TARIFA_ESPECIAL'
  | 'TARIFA_NORMAL';

export interface TarifaAsesorament {
  tipus: TipusTarifa;
  preu?: number;
  percentatgeDescompte?: number;
  descripcio: ContenidoMultiidioma;
  condicions?: ContenidoMultiidioma;
}

export interface HorariAtencio {
  dilluns?: { inici: string; fi: string };
  dimarts?: { inici: string; fi: string };
  dimecres?: { inici: string; fi: string };
  dijous?: { inici: string; fi: string };
  divendres?: { inici: string; fi: string };
  dissabte?: { inici: string; fi: string };
  diumenge?: { inici: string; fi: string };
  notes?: ContenidoMultiidioma;
}

export interface EmpresaAsesorament {
  id: string;
  nom: string;
  logo?: string;
  descripcio: ContenidoMultiidioma;
  especialitats: TipoAsesorament[];
  ubicacio: {
    provincia: string;
    ciutat: string;
    direccio?: string;
    codiPostal?: string;
  };
  contacte: {
    telefon?: string;
    email?: string;
    web?: string;
    whatsapp?: string;
  };
  horariAtencio: HorariAtencio;
  verificada: boolean;
  puntuacio?: number;
  totalRessenyes: number;
  dataRegistre: Date;
}

export interface ServeiAsesorament {
  id: string;
  empresa: EmpresaAsesorament;
  tipus: TipoAsesorament;
  titol: ContenidoMultiidioma;
  descripcio: ContenidoMultiidioma;
  modalitats: ModalitatiAsesorament[];
  tarifa: TarifaAsesorament;
  duracio?: string; // "30 min", "1h", "segons necessitat"
  idiomes: string[]; // ['ca', 'es', 'en']
  
  // Disponibilitat
  disponible: boolean;
  horariFranges?: string[]; // ["9:00-12:00", "15:00-18:00"]
  tempsResposta?: string; // "24h", "48h", "immediat"
  
  // Característiques especials
  primeraConsultaGratuita: boolean;
  consultaUrgent: boolean;
  desplacament: boolean;
  
  // Estadístiques
  consultesTotals: number;
  puntuacioMitjana?: number;
  totalRessenyes: number;
  
  // Metadata
  dataCreacio: Date;
  dataActualitzacio: Date;
  actiu: boolean;
}

export interface SolicitudAsesorament {
  id: string;
  usuari: {
    id: string;
    nom: string;
    email: string;
    telefon?: string;
    provincia: string;
  };
  servei: ServeiAsesorament;
  modalitat: ModalitatiAsesorament;
  
  // Detalls de la consulta
  assumpte: string;
  descripcio: string;
  urgencia: 'BAIXA' | 'MITJANA' | 'ALTA';
  prefereixHorari?: string;
  
  // Estado
  estat: 'PENDENT' | 'CONFIRMADA' | 'EN_PROCES' | 'FINALITZADA' | 'CANCELADA';
  dataCreacio: Date;
  dataConfirmacio?: Date;
  dataCita?: Date;
  
  // Seguimiento
  notes?: string;
  ressenya?: {
    puntuacio: number;
    comentari: string;
    dataRessenya: Date;
  };
}

export interface FiltresAsesorament {
  tipus?: TipoAsesorament;
  modalitat?: ModalitatiAsesorament[];
  provincia?: string;
  gratuita?: boolean;
  primeraConsultaGratuita?: boolean;
  disponibleAra?: boolean;
  puntuacioMinima?: number;
  ordenPer?: 'PUNTUACIO' | 'PREU' | 'PROXIMITAT' | 'DISPONIBILITAT';
}

export interface EstadistiquesAsesorament {
  totalServeis: number;
  serveisProvincia: { [provincia: string]: number };
  serveisPerTipus: { [tipus in TipoAsesorament]: number };
  solicitudsActives: number;
  solicitudsResoltes: number;
  puntuacioMitjanaGlobal: number;
  empresesActives: number;
}