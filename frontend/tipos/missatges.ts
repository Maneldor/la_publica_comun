export interface Missatge {
  id: string
  conversaId: string
  emissor: string
  contingut: string
  data: Date
  estat: 'enviat' | 'entregat' | 'llegit'
  tipus: 'text' | 'imatge' | 'adjunt'
  adjunt?: {
    nom: string
    url: string
    tipus: string
    tamany: number
  }
  editat?: boolean
  dataEdicio?: Date
}

export interface Conversa {
  id: string
  tipus: 'directa' | 'grup'
  participants: string[]
  ultimMissatge?: Missatge
  ultimActivitat: Date
  dataCreacio: Date
  nom?: string // Per converses grupals
  avatar?: string
  estat: 'activa' | 'arxivada' | 'bloquejada'
  noLlegits: number
  silenciada: boolean
  metadata?: {
    grupId?: string
    iniciadaPer?: string
    [key: string]: any
  }
}

export interface ConversaDetall extends Conversa {
  missatges: Missatge[]
  participantsDetall: {
    id: string
    nom: string
    avatar?: string
    nick?: string
    ultimActivitat: Date
    estat: 'online' | 'offline' | 'absent'
  }[]
}

export interface ResumConverses {
  total: number
  noLlegides: number
  actives: number
  arxivades: number
  nousContactes: number
}