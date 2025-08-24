// Tipos para el sistema de formación con IA

export type CategoriaFormacio = 
  | 'TECNOLOGIA' 
  | 'ADMINISTRACIO' 
  | 'GESTIO' 
  | 'IDIOMES' 
  | 'JURIDIC' 
  | 'FINANCES' 
  | 'COMUNICACIO' 
  | 'LIDERATGE'
  | 'SOSTENIBILITAT'
  | 'DIGITAL';

export type NivellCurs = 'basic' | 'intermedio' | 'avanzado';
export type ModalitateFormacio = 'online' | 'presencial' | 'mixta';
export type EstatatCurs = 'ESBORRANY' | 'ACTIU' | 'PAUSAT' | 'FINALITZAT';
export type TipusContingut = 'text' | 'video' | 'audio' | 'interactiu' | 'avaluacio';

// Estructura principal del curso
export interface Curs {
  id: string;
  titol: string;
  descripcio: string;
  instructor: {
    nom: string;
    cognoms: string;
    email: string;
    bio?: string;
    avatar?: string;
  };
  categoria: CategoriaFormacio;
  nivel: NivellCurs;
  modalitat: ModalitateFormacio;
  duracio: number; // en minutos
  certificat: boolean;
  preu?: number; // null si es gratuito
  
  // Fechas
  dataCreacio: Date;
  dataPublicacio?: Date;
  dataInici?: Date;
  dataLimit?: Date;
  
  // Contenido
  leccions: Leccio[];
  avaluacions: Avaluacio[];
  recursos: RecursCurs[];
  
  // Estado
  estat: EstatatCurs;
  publicat: boolean;
  destacat: boolean;
  
  // Estadísticas
  totalInscrits: number;
  totalCompletats: number;
  valoracioMitjana: number;
  totalValoracions: number;
  
  // Metadatos IA
  generatPerIA: boolean;
  promptOriginal?: string;
  versioIA?: string;
  optimitzacionsIA?: OptimitzacioIA[];
}

// Lección individual
export interface Leccio {
  id: string;
  cursId: string;
  titol: string;
  descripcio: string;
  ordre: number;
  duracioEstimada: number; // en minutos
  
  // Contenido
  continguts: ContingutLeccio[];
  exercicis?: ExerciciLeccio[];
  
  // Estado
  obligatoria: boolean;
  visible: boolean;
  
  // IA
  generatPerIA: boolean;
  dificultatIA?: number; // 1-10
  tagsSugeritsIA?: string[];
}

// Contenido de lección
export interface ContingutLeccio {
  id: string;
  tipus: TipusContingut;
  titol: string;
  contingut: string; // HTML, markdown, or URL
  ordre: number;
  duracioEstimada: number;
  recursos?: string[]; // URLs de archivos adjuntos
}

// Evaluaciones
export interface Avaluacio {
  id: string;
  cursId: string;
  titol: string;
  descripcio: string;
  tipus: 'quiz' | 'practica' | 'projecte' | 'examen';
  preguntes: PreguntaAvaluacio[];
  tempsLimit?: number; // en minutos
  intentsMaxims?: number;
  notaMinima: number; // para aprobar
  pes: number; // peso en la nota final
  
  // IA
  generatPerIA: boolean;
  analisiDificultatIA?: AnalisiDificultatIA;
}

// Pregunta de evaluación
export interface PreguntaAvaluacio {
  id: string;
  tipus: 'multiple' | 'oberta' | 'vertader_fals' | 'ordenar' | 'emparellar';
  pregunta: string;
  opcions?: string[]; // para multiple choice
  respostaCorrecta: string | string[];
  explicacio?: string;
  puntuacio: number;
  
  // IA
  generatPerIA: boolean;
  dificultatEstimada?: number;
  tagsTematica?: string[];
}

// Progreso del usuario
export interface ProgressCurs {
  usuariId: string;
  cursId: string;
  dataInscripcio: Date;
  dataInici?: Date;
  dataCompletacio?: Date;
  
  // Estado general
  estat: 'inscrit' | 'en_progres' | 'completat' | 'abandonat';
  percentatgeCompletacio: number;
  tempsInvertit: number; // en minutos
  
  // Progreso detallado
  leccionsCompletades: string[]; // IDs de lecciones
  avaluacionsRealitzades: ResultatAvaluacio[];
  notaFinal?: number;
  
  // Personalización IA
  recomanacionsIA?: RecomanacioPersonalitzada[];
  ritmeAprenentatge?: 'lent' | 'normal' | 'rapid';
}

// Resultados de evaluación
export interface ResultatAvaluacio {
  avaluacioId: string;
  dataRealitzacio: Date;
  tempsInvertit: number;
  nota: number;
  respostes: RespostaUsuari[];
  intents: number;
  superat: boolean;
}

// Respuesta del usuario
export interface RespostaUsuari {
  preguntaId: string;
  resposta: string | string[];
  correcta: boolean;
  puntuacioObinguda: number;
  tempsResposta: number;
}

// Sistema de IA - Servicios
export interface ServeiIA {
  generarCurs: (prompt: GenerarCursPrompt) => Promise<Curs>;
  optimitzarContingut: (contingut: string, objectiu: string) => Promise<string>;
  crearAvaluacions: (contingut: string, parametres: ParametresAvaluacio) => Promise<Avaluacio>;
  analitzarDificultat: (contingut: string) => Promise<AnalisiDificultatIA>;
  personalitzarContingut: (curs: Curs, perfilUsuari: PerfilUsuari) => Promise<ContingutPersonalitzat>;
  traduirCurs: (curs: Curs, idiomes: string[]) => Promise<CursMultiidioma>;
  generarRecomanacions: (historialUsuari: ProgressCurs[], preferencies: PreferenciesUsuari) => Promise<RecomanacioIA[]>;
}

// Prompts y parámetros para IA
export interface GenerarCursPrompt {
  tema: string;
  objectius: string[];
  duracio: number;
  niveau: NivellCurs;
  categoria: CategoriaFormacio;
  audiencia: string;
  modalitat: ModalitateFormacio;
  incloureCertificat: boolean;
  requisitosPrevios?: string;
  recursosDisponibles?: string[];
}

export interface ParametresAvaluacio {
  nombrePreguntes: number;
  tipus: ('multiple' | 'oberta' | 'vertader_fals')[];
  nivell: NivellCurs;
  tematica: string[];
  tempsEstimat: number;
}

// Análisis y optimizaciones IA
export interface AnalisiDificultatIA {
  nivellDetectat: NivellCurs;
  puntuacioDificultat: number; // 1-10
  conceptesClau: string[];
  requisitsPrevios: string[];
  recomanacions: string[];
  tempsEstimatReal: number;
}

export interface OptimitzacioIA {
  tipus: 'contingut' | 'estructura' | 'avaluacio' | 'duracio';
  descripcio: string;
  impacteEstimat: 'baix' | 'mig' | 'alt';
  implementat: boolean;
  dataCreacio: Date;
}

export interface RecomanacioPersonalitzada {
  tipus: 'contingut_extra' | 'ejercici_adicional' | 'recurso_suplementario' | 'ritmo_sugerido';
  titol: string;
  descripcio: string;
  prioritat: number; // 1-5
  implementada: boolean;
}

// Contenido personalizado
export interface ContingutPersonalitzat {
  usuariId: string;
  cursId: string;
  modificacions: ModificacioContingut[];
  rutaAprenentatge: EtapaAprenentatge[];
  recomanacionsAddicionals: RecursCurs[];
}

export interface ModificacioContingut {
  leccioId: string;
  tipus: 'simplificar' | 'ampliar' | 'exemple_adicional' | 'exercici_extra';
  contingutOriginal: string;
  contingutModificat: string;
  raonament: string;
}

export interface EtapaAprenentatge {
  ordre: number;
  leccioIds: string[];
  objectiu: string;
  duracioEstimada: number;
  recomanacionsIA: string[];
}

// Recursos
export interface RecursCurs {
  id: string;
  nom: string;
  tipus: 'pdf' | 'video' | 'audio' | 'enllaç' | 'document' | 'presentacio';
  url: string;
  mida?: number; // en bytes
  descripcio?: string;
  obligatori: boolean;
  ordre?: number;
}

// Multiidioma con IA
export interface CursMultiidioma {
  cursOriginal: Curs;
  traduccions: {
    [idioma: string]: CursTraduit;
  };
  metadadesTraducció: {
    serveiUtilitzat: string;
    dataTraducció: Date;
    qualitat: number; // 1-10
    revisatPerHuma: boolean;
  };
}

export interface CursTraduit {
  titol: string;
  descripcio: string;
  leccions: LeccioTraduit[];
  avaluacions: AvaluacioTraduit[];
  recursos: RecursTraduit[];
}

export interface LeccioTraduit {
  id: string;
  titol: string;
  descripcio: string;
  continguts: ContingutTraduit[];
}

export interface ContingutTraduit {
  id: string;
  titol: string;
  contingut: string;
}

export interface AvaluacioTraduit {
  id: string;
  titol: string;
  descripcio: string;
  preguntes: PreguntaTraduit[];
}

export interface PreguntaTraduit {
  id: string;
  pregunta: string;
  opcions?: string[];
  explicacio?: string;
}

export interface RecursTraduit {
  id: string;
  nom: string;
  descripcio?: string;
}

// Recomendaciones IA
export interface RecomanacioIA {
  id: string;
  usuariId: string;
  tipusRecomanacio: 'curs_similar' | 'millora_competencies' | 'seguiment_carrera' | 'tendencies_sector';
  cursRecomanat: Curs;
  raonament: string;
  puntuacio: number; // relevancia 0-1
  dataCreacio: Date;
  vista: boolean;
  acceptada?: boolean;
}

// Perfil de usuario para personalización
export interface PerfilUsuari {
  usuariId: string;
  competenciesActuals: string[];
  objectiusAprenentatge: string[];
  tempsDisponible: number; // minutos por semana
  preferenciesTormacio: PreferenciesUsuari;
  historialCompletacions: ProgressCurs[];
  avaluacionsPerformance: PerformanceUsuari;
}

export interface PreferenciesUsuari {
  modalitats: ModalitateFormacio[];
  categories: CategoriaFormacio[];
  duracioMaximaLeccio: number;
  tipusContingutPreferit: TipusContingut[];
  notificacions: boolean;
  recordatoris: boolean;
}

export interface PerformanceUsuari {
  mitjanaCompletacio: number; // %
  mitjanaQualificacions: number;
  tempsPromigProgramacio: number;
  tendenciaMillora: 'pujant' | 'estable' | 'baixant';
  fortaleseses: string[];
  areasMellora: string[];
}

// Estadísticas y analytics
export interface AnalyticsCurs {
  cursId: string;
  periode: {
    dataInici: Date;
    dataFi: Date;
  };
  
  // Métricas básicas
  totalVisualitzacions: number;
  totalInscripcions: number;
  totalCompletacions: number;
  mitjanaTempsFinalitzacio: number;
  
  // Engagement
  mittjanaTempsPerLeccio: { [leccioId: string]: number };
  taxesAbandonament: { [leccioId: string]: number };
  interaccionsPerContingut: { [contingutId: string]: number };
  
  // Evaluaciones
  mitjanaNotesAvaluacions: { [avaluacioId: string]: number };
  taxesAprovar: { [avaluacioId: string]: number };
  preguntesDificils: PreguntaAvaluacio[];
  
  // Feedback
  valoracionsRebudes: ValoracioCurs[];
  comentarisDestacats: ComentariCurs[];
  
  // Predicciones IA
  prediccioAbandonament: PrediccioAbandonament[];
  recomanacionsMillora: RecomanacioMillora[];
}

export interface ValoracioCurs {
  usuariId: string;
  cursId: string;
  puntuacio: number; // 1-5
  comentari?: string;
  dataCreacio: Date;
  aspectesValorats: {
    contingut: number;
    instructor: number;
    dificultad: number;
    utilitat: number;
  };
}

export interface ComentariCurs {
  id: string;
  usuariId: string;
  cursId: string;
  comentari: string;
  dataCreacio: Date;
  destacat: boolean;
  respostesInstructor?: string;
}

export interface PrediccioAbandonament {
  usuariId: string;
  probabilitat: number; // 0-1
  factorsRisc: string[];
  recomanacionsIntervencio: string[];
  dataPrediccio: Date;
}

export interface RecomanacioMillora {
  tipas: 'contingut' | 'estructura' | 'avaluacio' | 'recursos';
  descripcio: string;
  impacteEstimat: number; // sobre completacions
  costImplementacio: 'baix' | 'mig' | 'alt';
  prioritat: number; // 1-5
  basatEnDades: string[];
}

// Certificaciones
export interface Certificat {
  id: string;
  usuariId: string;
  cursId: string;
  dataEmissio: Date;
  codiVerificacio: string;
  urlVerificacio: string;
  validFilsA?: Date;
  institucioEmissora: string;
  firmaDigital: string;
  metadadesCurs: {
    titol: string;
    durada: number;
    nivell: NivellCurs;
    categoria: CategoriaFormacio;
    instructor: string;
  };
}