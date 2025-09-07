'use client'

import { useState, useEffect, useRef } from 'react'
import { useTema, useIdioma } from '../../../../hooks/useComunidad'
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Search,
  Plus,
  MoreVertical,
  Users,
  Bell,
  Star,
  Paperclip,
  Smile,
  CheckCircle,
  Clock
} from 'lucide-react'

interface Conversa {
  id: string
  nom: string
  tipo: 'individual' | 'grup' | 'suport'
  avatar?: string
  ultimMissatge: string
  hora: string
  noLlegits: number
  online: boolean
  assignat?: string
  prioritat?: 'baixa' | 'normal' | 'alta' | 'urgent'
  estat?: 'obert' | 'pendent' | 'resolt' | 'tancat'
}

interface Missatge {
  id: string
  userId: string
  userNom: string
  avatar?: string
  contingut: string
  hora: string
  llegit: boolean
  tipo: 'text' | 'imatge' | 'arxiu' | 'sistema'
  arxiu?: {
    nom: string
    tipus: string
    mida: string
  }
}

export default function CentreComunicacio() {
  const tema = useTema()
  const idioma = useIdioma()
  const [conversaActiva, setConversaActiva] = useState<string>('conv-1')
  const [converses, setConverses] = useState<Conversa[]>([])
  const [missatges, setMissatges] = useState<Missatge[]>([])
  const [nouMissatge, setNouMissatge] = useState('')
  const [cercaText, setCercaText] = useState('')
  const [filtreActiu, setFiltreActiu] = useState<'tots' | 'noLlegits' | 'suport'>('tots')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simular càrrega de dades
    setTimeout(() => {
      setConverses(generateMockConverses())
      setMissatges(generateMockMissatges(conversaActiva))
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    if (conversaActiva) {
      setMissatges(generateMockMissatges(conversaActiva))
    }
  }, [conversaActiva])

  useEffect(() => {
    scrollToBottom()
  }, [missatges])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateMockConverses = (): Conversa[] => {
    return [
      {
        id: 'conv-1',
        nom: 'Equip Tècnic La Pública',
        tipo: 'suport',
        ultimMissatge: 'Hem revisat la teva consulta sobre les noves funcionalitats...',
        hora: '14:32',
        noLlegits: 2,
        online: true,
        assignat: 'Marc Suport',
        prioritat: 'normal',
        estat: 'obert'
      },
      {
        id: 'conv-2',
        nom: 'Ajuntament de Barcelona',
        tipo: 'individual',
        avatar: '/api/placeholder/40/40',
        ultimMissatge: 'Gràcies per la vostra col·laboració en el projecte...',
        hora: '13:45',
        noLlegits: 0,
        online: false,
        prioritat: 'alta'
      },
      {
        id: 'conv-3',
        nom: 'Grup Empreses Tech Catalunya',
        tipo: 'grup',
        ultimMissatge: 'Algú ha provat les noves eines d\'IA?',
        hora: '12:18',
        noLlegits: 5,
        online: true,
        prioritat: 'normal'
      },
      {
        id: 'conv-4',
        nom: 'Generalitat de Catalunya',
        tipo: 'individual',
        avatar: '/api/placeholder/40/40',
        ultimMissatge: 'Necessitem revisar els requisits per a la nova convocatòria',
        hora: '11:30',
        noLlegits: 1,
        online: true,
        prioritat: 'urgent'
      },
      {
        id: 'conv-5',
        nom: 'Suport Facturació',
        tipo: 'suport',
        ultimMissatge: 'La teva factura ha estat processada correctament',
        hora: 'Ahir',
        noLlegits: 0,
        online: false,
        assignat: 'Laura Finances',
        estat: 'resolt'
      }
    ]
  }

  const generateMockMissatges = (conversaId: string): Missatge[] => {
    const missatgesBase = [
      {
        id: 'msg-1',
        userId: 'other',
        userNom: 'Marc Suport',
        avatar: '/api/placeholder/32/32',
        contingut: 'Hola! Hem revisat la teva consulta sobre les noves funcionalitats d\'IA. Estem treballant en implementar-les al més aviat possible.',
        hora: '14:30',
        llegit: true,
        tipo: 'text' as const
      },
      {
        id: 'msg-2',
        userId: 'me',
        userNom: 'Tu',
        contingut: 'Perfecte! M\'interessaria especialment la funcionalitat de matching intel·ligent de candidats.',
        hora: '14:31',
        llegit: true,
        tipo: 'text' as const
      },
      {
        id: 'msg-3',
        userId: 'other',
        userNom: 'Marc Suport',
        avatar: '/api/placeholder/32/32',
        contingut: 'Excellente elecció! Aquesta funcionalitat està en fase beta. T\'enviïo la documentació.',
        hora: '14:32',
        llegit: false,
        tipo: 'text' as const
      },
      {
        id: 'msg-4',
        userId: 'other',
        userNom: 'Marc Suport',
        avatar: '/api/placeholder/32/32',
        contingut: 'Aquí tens el document amb tots els detalls.',
        hora: '14:32',
        llegit: false,
        tipo: 'arxiu' as const,
        arxiu: {
          nom: 'Matching_IA_Documentation.pdf',
          tipus: 'PDF',
          mida: '2.4 MB'
        }
      }
    ]

    return missatgesBase
  }

  const enviarMissatge = () => {
    if (nouMissatge.trim()) {
      const nouMsg: Missatge = {
        id: `msg-${Date.now()}`,
        userId: 'me',
        userNom: 'Tu',
        contingut: nouMissatge,
        hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
        llegit: true,
        tipo: 'text'
      }
      
      setMissatges(prev => [...prev, nouMsg])
      setNouMissatge('')

      // Simular resposta automàtica després de 2 segons
      setTimeout(() => {
        const resposta: Missatge = {
          id: `msg-${Date.now() + 1}`,
          userId: 'other',
          userNom: 'Marc Suport',
          avatar: '/api/placeholder/32/32',
          contingut: 'Gràcies per la teva consulta. Revisarem la informació i et respondrem aviat.',
          hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
          llegit: false,
          tipo: 'text'
        }
        setMissatges(prev => [...prev, resposta])
      }, 2000)
    }
  }

  const getPrioritatColor = (prioritat?: string) => {
    switch (prioritat) {
      case 'urgent': return 'border-l-red-500'
      case 'alta': return 'border-l-orange-500'
      case 'normal': return 'border-l-blue-500'
      default: return 'border-l-gray-300'
    }
  }

  const getEstatColor = (estat?: string) => {
    switch (estat) {
      case 'resolt': return 'text-green-600 bg-green-50'
      case 'pendent': return 'text-orange-600 bg-orange-50'
      case 'tancat': return 'text-gray-600 bg-gray-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const conversesFiltrades = converses.filter(conversa => {
    const matchText = conversa.nom.toLowerCase().includes(cercaText.toLowerCase())
    const matchFiltre = filtreActiu === 'tots' || 
                       (filtreActiu === 'noLlegits' && conversa.noLlegits > 0) ||
                       (filtreActiu === 'suport' && conversa.tipo === 'suport')
    return matchText && matchFiltre
  })

  const traduccions = {
    ca: {
      centreComunicacio: "Centre de Comunicació",
      cerca: "Cercar converses...",
      tots: "Tots",
      noLlegits: "No llegits",
      suport: "Suport",
      escriuMissatge: "Escriu un missatge...",
      enviar: "Enviar",
      online: "En línia",
      offline: "Desconnectat",
      grup: "Grup",
      individual: "Individual",
      arxiu: "Arxiu",
      descarregar: "Descarregar",
      carregant: "Carregant missatges..."
    },
    es: {
      centreComunicacio: "Centro de Comunicación",
      cerca: "Buscar conversaciones...",
      tots: "Todos",
      noLlegits: "No leídos",
      suport: "Soporte",
      escriuMissatge: "Escribe un mensaje...",
      enviar: "Enviar",
      online: "En línea",
      offline: "Desconectado",
      grup: "Grupo",
      individual: "Individual",
      arxiu: "Archivo",
      descarregar: "Descargar",
      carregant: "Cargando mensajes..."
    }
  }

  const t = traduccions[idioma as keyof typeof traduccions] || traduccions.ca

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.carregant}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20">
      <div className="flex h-full">
        {/* Sidebar - Llista de converses */}
        <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-white/50 flex flex-col">
          {/* Header sidebar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t.centreComunicacio}</h2>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Cerca */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.cerca}
                value={cercaText}
                onChange={(e) => setCercaText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              {[
                { key: 'tots', label: t.tots },
                { key: 'noLlegits', label: t.noLlegits },
                { key: 'suport', label: t.suport }
              ].map((filtre) => (
                <button
                  key={filtre.key}
                  onClick={() => setFiltreActiu(filtre.key as any)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filtreActiu === filtre.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filtre.label}
                </button>
              ))}
            </div>
          </div>

          {/* Llista converses */}
          <div className="flex-1 overflow-y-auto">
            {conversesFiltrades.map((conversa) => (
              <div
                key={conversa.id}
                onClick={() => setConversaActiva(conversa.id)}
                className={`p-4 border-l-4 cursor-pointer transition-all ${
                  conversaActiva === conversa.id 
                    ? 'bg-blue-50 border-l-blue-500' 
                    : `border-l-transparent hover:bg-gray-50 ${getPrioritatColor(conversa.prioritat)}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {conversa.avatar ? (
                      <img 
                        src={conversa.avatar} 
                        alt={conversa.nom}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        conversa.tipo === 'grup' ? 'bg-purple-100' :
                        conversa.tipo === 'suport' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {conversa.tipo === 'grup' ? (
                          <UserGroupIcon className="w-5 h-5 text-purple-600" />
                        ) : conversa.tipo === 'suport' ? (
                          <MessageCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    )}
                    {conversa.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{conversa.nom}</h3>
                      <span className="text-xs text-gray-500">{conversa.hora}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-1">{conversa.ultimMissatge}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {conversa.assignat && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {conversa.assignat}
                          </span>
                        )}
                        {conversa.estat && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getEstatColor(conversa.estat)}`}>
                            {conversa.estat}
                          </span>
                        )}
                      </div>
                      {conversa.noLlegits > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversa.noLlegits}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Àrea principal - Chat */}
        <div className="flex-1 flex flex-col">
          {conversaActiva ? (
            <>
              {/* Header chat */}
              <div className="bg-white/70 backdrop-blur-sm border-b border-white/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {converses.find(c => c.id === conversaActiva)?.nom}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {converses.find(c => c.id === conversaActiva)?.online ? t.online : t.offline}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Missatges */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {missatges.map((missatge) => (
                  <div
                    key={missatge.id}
                    className={`flex gap-3 ${
                      missatge.userId === 'me' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {missatge.userId !== 'me' && missatge.avatar && (
                      <img 
                        src={missatge.avatar} 
                        alt={missatge.userNom}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    
                    <div className={`max-w-xs lg:max-w-md ${
                      missatge.userId === 'me' ? 'order-last' : ''
                    }`}>
                      {missatge.userId !== 'me' && (
                        <div className="text-sm text-gray-600 mb-1">{missatge.userNom}</div>
                      )}
                      
                      <div className={`rounded-xl px-4 py-3 ${
                        missatge.userId === 'me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}>
                        {missatge.tipo === 'text' && (
                          <p className="text-sm">{missatge.contingut}</p>
                        )}
                        
                        {missatge.tipo === 'arxiu' && missatge.arxiu && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Paperclip className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{missatge.arxiu.nom}</p>
                              <p className="text-xs text-gray-500">{missatge.arxiu.tipus} • {missatge.arxiu.mida}</p>
                            </div>
                            <button className="text-sm text-blue-600 hover:underline">
                              {t.descarregar}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                        missatge.userId === 'me' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{missatge.hora}</span>
                        {missatge.userId === 'me' && (
                          missatge.llegit ? (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input missatge */}
              <div className="bg-white/70 backdrop-blur-sm border-t border-white/50 p-4">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={nouMissatge}
                      onChange={(e) => setNouMissatge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && enviarMissatge()}
                      placeholder={t.escriuMissatge}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={enviarMissatge}
                    disabled={!nouMissatge.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Selecciona una conversa per començar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}