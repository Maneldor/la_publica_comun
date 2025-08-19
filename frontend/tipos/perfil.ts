export type NivellPrivacitat = 'public' | 'privat' | 'nomes_admin'

export interface ConfiguracioPrivacitatCamp {
  nivell: NivellPrivacitat
  visible: boolean // calculat segons qui mira el perfil
}

export interface PerfilUsuari {
  id: string
  nick: string
  
  // Camps bàsics (sempre visibles)
  avatar?: string
  dataRegistre: Date
  ultimaActivitat: Date
  estat: 'actiu' | 'inactiu' | 'suspès'
  verificat: boolean
  
  // Camps amb control de privacitat
  nom?: string
  cognoms?: string
  email?: string
  telefon?: string
  
  // Informació professional
  organitzacio?: string
  carrec?: string
  departament?: string
  ubicacioTreball?: string
  
  // Informació personal
  biografiaBrevu?: string
  biografiaCompleta?: string
  interessos: string[]
  habilitats: string[]
  idiomes: string[]
  
  // Ubicació
  provincia?: string
  ciutat?: string
  codiPostal?: string
  
  // Social
  enllaçosExterns: EnllaçExtern[]
  
  // Configuració de privacitat per cada camp
  configuracioPrivacitat: {
    nom: NivellPrivacitat
    cognoms: NivellPrivacitat
    email: NivellPrivacitat
    telefon: NivellPrivacitat
    organitzacio: NivellPrivacitat
    carrec: NivellPrivacitat
    departament: NivellPrivacitat
    ubicacioTreball: NivellPrivacitat
    biografiaCompleta: NivellPrivacitat
    provincia: NivellPrivacitat
    ciutat: NivellPrivacitat
    codiPostal: NivellPrivacitat
    enllaçosExterns: NivellPrivacitat
  }
  
  // Estadístiques (sempre públiques)
  estadistiques: {
    postsCreats: number
    comentaris: number
    connexionsTotal: number
    grupsParticipa: number
    reputacio: number
    badges: Badge[]
  }
  
  // Activitat recent
  activitatRecent: ActivitatPerfil[]
  
  // Grups als quals pertany (públics)
  grupsPublics: GrupPublic[]
}

export interface EnllaçExtern {
  id: string
  tipus: 'website' | 'linkedin' | 'twitter' | 'instagram' | 'github' | 'altres'
  url: string
  etiqueta?: string
  public: boolean
}

export interface Badge {
  id: string
  nom: string
  descripció: string
  icona: string
  color: string
  dataObtinguda: Date
}

export interface ActivitatPerfil {
  id: string
  tipus: 'post' | 'comentari' | 'unir_grup' | 'connexio' | 'badge'
  descripció: string
  data: Date
  enllaç?: string
}

export interface GrupPublic {
  id: string
  nom: string
  avatar?: string
  rol: 'embaixador' | 'administrador' | 'moderador' | 'membre'
  dataUnio: Date
}

// Funcions d'utilitat per la privacitat
export function podeVeureCamp(
  camp: NivellPrivacitat, 
  esPropiPerfil: boolean, 
  esAdmin: boolean
): boolean {
  if (esPropiPerfil) return true
  if (esAdmin) return true
  return camp === 'public'
}

export function aplicarPrivacitat(
  perfil: PerfilUsuari,
  esPropiPerfil: boolean,
  esAdmin: boolean
): PerfilUsuari {
  const perfilVisible = { ...perfil }
  
  // Aplicar configuració de privacitat
  Object.entries(perfil.configuracioPrivacitat).forEach(([camp, nivell]) => {
    if (!podeVeureCamp(nivell, esPropiPerfil, esAdmin)) {
      // @ts-ignore - esborrar camp privat
      delete perfilVisible[camp as keyof PerfilUsuari]
    }
  })
  
  // Filtrar enllaços externs privats
  if (!esPropiPerfil && !esAdmin) {
    perfilVisible.enllaçosExterns = perfil.enllaçosExterns.filter(enllac => enllac.public)
  }
  
  return perfilVisible
}

export interface FormulariEditarPerfil {
  // Camps editables
  nom?: string
  cognoms?: string
  email?: string
  telefon?: string
  organitzacio?: string
  carrec?: string
  departament?: string
  ubicacioTreball?: string
  biografiaBrevu?: string
  biografiaCompleta?: string
  interessos: string[]
  habilitats: string[]
  idiomes: string[]
  provincia?: string
  ciutat?: string
  codiPostal?: string
  
  // Configuració de privacitat
  configuracioPrivacitat: {
    nom: NivellPrivacitat
    cognoms: NivellPrivacitat
    email: NivellPrivacitat
    telefon: NivellPrivacitat
    organitzacio: NivellPrivacitat
    carrec: NivellPrivacitat
    departament: NivellPrivacitat
    ubicacioTreball: NivellPrivacitat
    biografiaCompleta: NivellPrivacitat
    provincia: NivellPrivacitat
    ciutat: NivellPrivacitat
    codiPostal: NivellPrivacitat
    enllaçosExterns: NivellPrivacitat
  }
  
  // Enllaços externs
  enllaçosExterns: EnllaçExtern[]
}