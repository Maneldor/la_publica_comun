export type TipusNotificacio = 
  | 'solicitud-connexio'
  | 'connexio-acceptada'
  | 'invitacio-grup'
  | 'mencio'
  | 'missatge-nou'
  | 'grup-actualitzat'

export type EstatNotificacio = 'no-llegida' | 'llegida' | 'arxivada'

export interface Notificacio {
  id: string
  tipus: TipusNotificacio
  titol: string
  missatge: string
  emissor: {
    id: string
    nom: string
    avatar?: string
    nick?: string
  }
  receptor: string
  estat: EstatNotificacio
  data: Date
  accio?: {
    tipus: 'acceptar-connexio' | 'veure-grup' | 'veure-perfil' | 'obrir-conversa'
    dades?: any
  }
  metadata?: {
    grupId?: string
    conversaId?: string
    [key: string]: any
  }
}

export interface SolicitudConnexio {
  id: string
  emissor: string
  receptor: string
  missatge?: string
  estat: 'pendent' | 'acceptada' | 'rebutjada'
  data: Date
  tipusConnexio: 'general' | 'professional' | 'grup'
  metadata?: {
    grupId?: string
    [key: string]: any
  }
}

export interface ResumNotificacions {
  total: number
  noLlegides: number
  solicitudsConnexio: number
  missatges: number
  grups: number
}