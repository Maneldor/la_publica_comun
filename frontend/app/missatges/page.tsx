'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Circle,
  Image,
  FileText,
  Mic,
  Settings,
  Archive,
  Pin,
  Volume2,
  VolumeX,
  Users,
  UserPlus,
  Info,
  Download,
  Reply,
  Forward,
  Copy,
  Trash2
} from 'lucide-react'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import { useComunidad } from '../../hooks/useComunidad'
import { useMissatges } from '../../src/contextos/MissatgesContext'

// Tipos para el sistema de mensajería
interface Usuario {
  id: string
  nom: string
  avatar: string
  online: boolean
  ultimaConexio?: Date
}

interface Missatge {
  id: string
  emissorId: string
  contingut: string // Mensaje en idioma original SIN traducir
  data: Date
  llegit: boolean
  entregat: boolean
  tipus: 'text' | 'imatge' | 'arxiu' | 'audio' | 'video' | 'document'
  arxiu?: {
    nom: string
    url: string
    mida: number
    tipus: string
  }
  durada?: number // Para audio en segundos
  respostA?: string // ID del mensaje al que responde
  reenviaDe?: string // ID del usuario que reenvia
  reaccions?: { [emoji: string]: string[] }
}

interface Conversa {
  id: string
  tipus: 'individual' | 'grup'
  nom?: string // Solo para grupos
  participants: Usuario[]
  ultimMissatge?: Missatge
  missatgesNoLlegits: number
  data: Date
  silenciat: boolean
  fixat: boolean
  arxivat: boolean
  administradors?: string[]
  escrivint?: string[] // IDs de usuarios escribiendo
}

// Traducciones solo para la interfaz, NO para mensajes
const traduccions = {
  ca: {
    cercar: 'Cercar converses...',
    noConverses: 'No hi ha converses',
    online: 'En línia',
    escriuMissatge: 'Escriu un missatge...',
    enviar: 'Enviar',
    ara: 'ara',
    minuts: 'min',
    hores: 'h',
    dies: 'd',
    arxiu: 'Arxiu',
    imatge: 'Imatge',
    audio: 'Àudio',
    video: 'Vídeo',
    document: 'Document',
    descarregar: 'Descarregar',
    respondre: 'Respondre',
    reenviar: 'Reenviar',
    copiar: 'Copiar',
    eliminar: 'Eliminar',
    escrivint: 'està escrivint...',
    vist: 'vist',
    entregat: 'entregat'
  },
  es: {
    cercar: 'Buscar conversaciones...',
    noConverses: 'No hay conversaciones',
    online: 'En línea', 
    escriuMissatge: 'Escribe un mensaje...',
    enviar: 'Enviar',
    ara: 'ahora',
    minuts: 'min',
    hores: 'h',
    dies: 'd',
    arxiu: 'Archivo',
    imatge: 'Imagen',
    audio: 'Audio',
    video: 'Video',
    document: 'Documento',
    descarregar: 'Descargar',
    respondre: 'Responder',
    reenviar: 'Reenviar',
    copiar: 'Copiar',
    eliminar: 'Eliminar',
    escrivint: 'está escribiendo...',
    vist: 'visto',
    entregat: 'entregado'
  }
}

export default function MissatgesPage() {
  const { idioma } = useComunidad()
  const searchParams = useSearchParams()
  const { 
    converses: conversesContext, 
    crearConversa: crearConversaContext, 
    pucEnviarMissatges,
    enviarMissatge: enviarMissatgeContext
  } = useMissatges()
  const [conversaActiva, setConversaActiva] = useState<string | null>(null)
  const [missatgeNou, setMissatgeNou] = useState('')
  const [cercar, setCercar] = useState('')
  const [mostrarEmojis, setMostrarEmojis] = useState(false)
  const [arxiuSeleccionat, setArxiuSeleccionat] = useState<File | null>(null)
  const [gravantAudio, setGravantAudio] = useState(false)
  const [missatgeSeleccionat, setMissatgeSeleccionat] = useState<string | null>(null)
  const [respostA, setRespostA] = useState<Missatge | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isInitialLoad = useRef(true)
  
  const t = traduccions[idioma as keyof typeof traduccions] || traduccions.ca

  // Datos mock - conversaciones con mensajes en idiomas originales
  const [converses, setConverses] = useState<Conversa[]>([
    {
      id: 'conv1',
      tipus: 'individual',
      participants: [
        { 
          id: 'user1', 
          nom: 'Maria García', 
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=100&h=100&fit=crop&crop=face',
          online: true
        }
      ],
      ultimMissatge: {
        id: 'msg1',
        emissorId: 'user1',
        contingut: 'Hola! Com va el projecte de digitalització?', // Catalán original
        data: new Date(Date.now() - 30 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'text'
      },
      missatgesNoLlegits: 2,
      data: new Date(Date.now() - 30 * 60 * 1000),
      silenciat: false,
      fixat: false,
      arxivat: false,
      escrivint: []
    },
    {
      id: 'conv2', 
      tipus: 'individual',
      participants: [
        {
          id: 'user2',
          nom: 'Joan Martí',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          online: false,
          ultimaConexio: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ],
      ultimMissatge: {
        id: 'msg2',
        emissorId: 'user2', 
        contingut: 'Perfecto, nos vemos mañana en la reunión', // Español original
        data: new Date(Date.now() - 2 * 60 * 60 * 1000),
        llegit: true,
        entregat: true,
        tipus: 'text'
      },
      missatgesNoLlegits: 0,
      data: new Date(Date.now() - 2 * 60 * 60 * 1000),
      silenciat: false,
      fixat: false,
      arxivat: false,
      escrivint: []
    },
    {
      id: 'conv3',
      tipus: 'grup',
      nom: 'Equip Digitalització',
      participants: [
        {
          id: 'user3',
          nom: 'Anna Lopez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          online: true
        },
        {
          id: 'user4', 
          nom: 'Pere Vidal',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          online: false
        }
      ],
      ultimMissatge: {
        id: 'msg3',
        emissorId: 'user3',
        contingut: 'He pujat els documents a la carpeta compartida',
        data: new Date(Date.now() - 45 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'text'
      },
      missatgesNoLlegits: 1,
      data: new Date(Date.now() - 45 * 60 * 1000),
      silenciat: false,
      fixat: true,
      arxivat: false,
      administradors: ['user3'],
      escrivint: ['user4']
    }
  ])

  const [missatges, setMissatges] = useState<{[key: string]: Missatge[]}>({
    'conv1': [
      {
        id: 'msg1',
        emissorId: 'user1',
        contingut: 'Hola! Com va el projecte de digitalització?',
        data: new Date(Date.now() - 30 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'text'
      },
      {
        id: 'msg1b',
        emissorId: 'current-user',
        contingut: 'Molt bé! Estem avançant amb les proves',
        data: new Date(Date.now() - 25 * 60 * 1000),
        llegit: true,
        entregat: true,
        tipus: 'text'
      },
      {
        id: 'msg1c',
        emissorId: 'user1',
        contingut: '',
        data: new Date(Date.now() - 20 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'imatge',
        arxiu: {
          nom: 'captura_prototip.png',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          mida: 245760,
          tipus: 'image/png'
        }
      }
    ],
    'conv2': [
      {
        id: 'msg2',
        emissorId: 'user2',
        contingut: 'Perfecto, nos vemos mañana en la reunión',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000),
        llegit: true,
        entregat: true,
        tipus: 'text'
      },
      {
        id: 'msg2b',
        emissorId: 'current-user',
        contingut: 'De acuerdo, llevaré la documentación actualizada',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'text'
      }
    ],
    'conv3': [
      {
        id: 'msg3',
        emissorId: 'user3',
        contingut: 'He pujat els documents a la carpeta compartida',
        data: new Date(Date.now() - 45 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'text'
      },
      {
        id: 'msg3b',
        emissorId: 'user4',
        contingut: '',
        data: new Date(Date.now() - 40 * 60 * 1000),
        llegit: false,
        entregat: true,
        tipus: 'document',
        arxiu: {
          nom: 'especificacions_tecniques.pdf',
          url: '#',
          mida: 1024000,
          tipus: 'application/pdf'
        }
      }
    ]
  })

  const formatTemps = (data: Date) => {
    const ara = new Date()
    const diferencia = ara.getTime() - data.getTime()
    const minuts = Math.floor(diferencia / (1000 * 60))
    const hores = Math.floor(diferencia / (1000 * 60 * 60))
    const dies = Math.floor(diferencia / (1000 * 60 * 60 * 24))

    if (minuts < 1) return t.ara
    if (minuts < 60) return `${minuts}${t.minuts}`
    if (hores < 24) return `${hores}${t.hores}`
    return `${dies}${t.dies}`
  }

  // Efectos
  useEffect(() => {
    // Solo hacer scroll si hay una conversación activa y mensajes, y no es la càrrega inicial
    if (conversaActiva && missatges[conversaActiva] && missatges[conversaActiva].length > 0 && !isInitialLoad.current) {
      // Añadir un pequeño delay per evitar scroll instantàni
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
      return () => clearTimeout(timer)
    } else if (isInitialLoad.current && conversaActiva) {
      // Marcar que ya no es càrrega inicial després del primer render amb conversació
      isInitialLoad.current = false
    }
  }, [missatges, conversaActiva])

  // Efecto para asegurar posición correcta al cargar la página
  useEffect(() => {
    // Scroll a la parte superior al montar el componente
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Tambié resetear el scroll del body si existeix
    if (document.body) {
      document.body.scrollTop = 0
    }
    
    // Resetear scroll del document
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
  }, [])

  // Efecto para manejar parámetros URL (iniciar conversación desde TarjetaMiembro)
  useEffect(() => {
    const iniciarConversa = searchParams.get('iniciarConversa')
    const usuariNom = searchParams.get('usuariNom')
    const usuariAvatar = searchParams.get('usuariAvatar')
    
    if (iniciarConversa && usuariNom) {
      console.log('Iniciando conversación desde URL:', { iniciarConversa, usuariNom, usuariAvatar })
      
      // Crear o encontrar conversación existente
      const conversaExistent = converses.find(conv => 
        conv.participants.some(p => p.id === iniciarConversa)
      )
      
      if (conversaExistent) {
        // Si ya existe, seleccionarla
        setConversaActiva(conversaExistent.id)
      } else {
        // Intentar crear conversación usando el contexto si es posible
        if (pucEnviarMissatges(iniciarConversa)) {
          // Crear función async separada para manejar la creación
          const crearNovaConversa = async () => {
            try {
              // Usar el contexto para crear la conversación
              const conversaId = await crearConversaContext(iniciarConversa)
              
              // Crear conversación también en el sistema local
              const novaConversa: Conversa = {
                id: conversaId,
                tipus: 'individual',
                participants: [{
                  id: iniciarConversa,
                  nom: usuariNom,
                  avatar: usuariAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuariNom)}&background=3b82f6&color=ffffff`,
                  online: Math.random() > 0.5
                }],
                ultimMissatge: undefined,
                missatgesNoLlegits: 0,
                data: new Date(),
                silenciat: false,
                fixat: false,
                arxivat: false,
                escrivint: []
              }
              
              // Añadir a ambos sistemas
              setConverses(prev => [novaConversa, ...prev])
              setConversaActiva(conversaId)
              setMissatges(prev => ({ ...prev, [conversaId]: [] }))
              
              console.log('Nueva conversación creada en ambos sistemas:', conversaId)
            } catch (error) {
              console.error('Error creando conversación:', error)
              alert('Error creando la conversación: ' + (error as Error).message)
            }
          }
          
          crearNovaConversa()
        } else {
          alert('No puedes enviar mensajes a este usuario. Primero debéis conectar.')
        }
      }
      
      // Limpiar parámetros URL sin recargar la página
      window.history.replaceState({}, '', '/missatges')
    }
  }, [searchParams, crearConversaContext, pucEnviarMissatges])

  // Efecto para sincronizar conversaciones del contexto
  useEffect(() => {
    // Convertir conversaciones del contexto al formato local
    const convertirConversesContext = () => {
      if (conversesContext.length > 0) {
        const conversesConvertides = conversesContext.map(conv => {
          // Simulamos datos de participantes
          const participant = {
            id: conv.participants.find(p => p !== 'user-1') || 'unknown',
            nom: `Usuario ${conv.participants.find(p => p !== 'user-1')}`,
            avatar: `https://ui-avatars.com/api/?name=User&background=3b82f6&color=ffffff`,
            online: Math.random() > 0.5
          }
          
          const conversaLocal: Conversa = {
            id: conv.id,
            tipus: conv.tipus === 'directa' ? 'individual' : 'grup',
            participants: [participant],
            ultimMissatge: conv.ultimMissatge ? {
              id: conv.ultimMissatge.id,
              emissorId: conv.ultimMissatge.emissor,
              contingut: conv.ultimMissatge.contingut,
              data: conv.ultimMissatge.data,
              llegit: conv.ultimMissatge.estat === 'llegit',
              entregat: conv.ultimMissatge.estat === 'entregat' || conv.ultimMissatge.estat === 'llegit',
              tipus: 'text'
            } : undefined,
            missatgesNoLlegits: conv.noLlegits,
            data: conv.ultimActivitat,
            silenciat: conv.silenciada,
            fixat: false,
            arxivat: conv.estat === 'arxivada',
            escrivint: []
          }
          
          return conversaLocal
        })
        
        // Actualizar solo si hay cambios
        setConverses(prev => {
          const existentIds = prev.map(c => c.id)
          const newConversations = conversesConvertides.filter(c => !existentIds.includes(c.id))
          return newConversations.length > 0 ? [...newConversations, ...prev] : prev
        })
      }
    }
    
    convertirConversesContext()
  }, [conversesContext])

  // Auto-resize textarea
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = Math.min(element.scrollHeight, 128) + 'px'
  }

  const enviarMissatge = async () => {
    if ((!missatgeNou.trim() && !arxiuSeleccionat) || !conversaActiva) return

    const nouMissatge: Missatge = {
      id: `msg-${Date.now()}`,
      emissorId: 'current-user',
      contingut: missatgeNou || '', // Respetar idioma original del usuario
      data: new Date(),
      llegit: false,
      entregat: false,
      tipus: arxiuSeleccionat ? getTipoArchivo(arxiuSeleccionat) : 'text',
      respostA: respostA?.id
    }

    if (arxiuSeleccionat) {
      nouMissatge.arxiu = {
        nom: arxiuSeleccionat.name,
        url: URL.createObjectURL(arxiuSeleccionat),
        mida: arxiuSeleccionat.size,
        tipus: arxiuSeleccionat.type
      }
    }

    // Actualizar sistema local inmediatamente
    setMissatges(prev => ({
      ...prev,
      [conversaActiva]: [...(prev[conversaActiva] || []), nouMissatge]
    }))

    // Actualizar último mensaje en conversación
    setConverses(prev => prev.map(conv => 
      conv.id === conversaActiva 
        ? { 
            ...conv, 
            ultimMissatge: {
              id: nouMissatge.id,
              emissorId: nouMissatge.emissorId,
              contingut: nouMissatge.contingut,
              data: nouMissatge.data,
              llegit: nouMissatge.llegit,
              entregat: nouMissatge.entregat,
              tipus: nouMissatge.tipus
            },
            data: nouMissatge.data
          }
        : conv
    ))

    // Intentar también enviar a través del contexto para mantener sincronización
    try {
      await enviarMissatgeContext(conversaActiva, nouMissatge.contingut, nouMissatge.tipus as any)
    } catch (error) {
      console.log('No se pudo sincronizar con el contexto:', error)
      // No es crítico, el mensaje ya está en el sistema local
    }

    setMissatgeNou('')
    setArxiuSeleccionat(null)
    setRespostA(null)
    setMostrarEmojis(false)
  }

  const getTipoArchivo = (file: File): Missatge['tipus'] => {
    if (file.type.startsWith('image/')) return 'imatge'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const formatMidaArxiu = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setArxiuSeleccionat(file)
    }
  }

  const eliminarArxiuSeleccionat = () => {
    setArxiuSeleccionat(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMissatge()
    }
  }

  const conversaSeleccionada = conversaActiva ? converses.find(c => c.id === conversaActiva) : null
  const missatgesConversa = conversaActiva ? missatges[conversaActiva] || [] : []
  const usuarisEscrivint = conversaSeleccionada?.escrivint?.filter(id => id !== 'current-user') || []

  return (
    <LayoutGeneral paginaActual="missatges">
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
        
        {/* Panel esquerre - Lista de conversaciones */}
        <div className={`${conversaActiva ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 bg-white border-r border-gray-200 h-full`}>
          
          {/* Header de búsqueda */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.cercar}
                value={cercar}
                onChange={(e) => setCercar(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de conversaciones */}
          <div className="flex-1 overflow-y-auto max-h-full">
            {converses
              .filter(conv => 
                conv.participants[0]?.nom.toLowerCase().includes(cercar.toLowerCase()) ||
                conv.ultimMissatge?.contingut.toLowerCase().includes(cercar.toLowerCase())
              )
              .map(conversa => (
                <div
                  key={conversa.id}
                  onClick={() => setConversaActiva(conversa.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    conversaActiva === conversa.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {conversa.tipus === 'grup' ? (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                      ) : (
                        <img
                          src={conversa.participants[0]?.avatar}
                          alt={conversa.participants[0]?.nom}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      {conversa.participants[0]?.online && conversa.tipus === 'individual' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Información de conversación */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversa.tipus === 'grup' ? conversa.nom : conversa.participants[0]?.nom}
                          </h3>
                          {conversa.fixat && <Pin className="h-3 w-3 text-gray-500" />}
                          {conversa.silenciat && <VolumeX className="h-3 w-3 text-gray-500" />}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTemps(conversa.data)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex-1 min-w-0">
                          {/* Indicador de escribiendo */}
                          {conversa.escrivint && conversa.escrivint.length > 0 ? (
                            <p className="text-sm text-blue-600 italic truncate">
                              <span className="inline-flex space-x-1">
                                <span>•</span>
                                <span>•</span>
                                <span>•</span>
                              </span>
                              {conversa.escrivint.length === 1 
                                ? ` ${conversa.participants.find(p => p.id === conversa.escrivint![0])?.nom} ${t.escrivint}`
                                : ` ${conversa.escrivint.length} persones ${t.escrivint}`
                              }
                            </p>
                          ) : (
                            <div className="flex items-center space-x-1">
                              {conversa.ultimMissatge?.tipus !== 'text' && (
                                <span className="text-gray-500">
                                  {conversa.ultimMissatge?.tipus === 'imatge' && <Image className="h-3 w-3" />}
                                  {conversa.ultimMissatge?.tipus === 'document' && <FileText className="h-3 w-3" />}
                                  {conversa.ultimMissatge?.tipus === 'audio' && <Mic className="h-3 w-3" />}
                                  {conversa.ultimMissatge?.tipus === 'video' && <Video className="h-3 w-3" />}
                                </span>
                              )}
                              <p className="text-sm text-gray-600 truncate">
                                {/* Mostrar mensaje en idioma original SIN traducir */}
                                {conversa.ultimMissatge?.tipus === 'text'
                                  ? conversa.ultimMissatge?.contingut
                                  : `${t[conversa.ultimMissatge?.tipus as keyof typeof t] || conversa.ultimMissatge?.tipus}`
                                }
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {conversa.missatgesNoLlegits > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                              {conversa.missatgesNoLlegits}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {converses.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageCircle className="h-12 w-12 mb-4" />
                <p>{t.noConverses}</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel dret - Conversación activa */}
        {conversaActiva && conversaSeleccionada ? (
          <div className="flex flex-col flex-1 bg-white h-full">
            
            {/* Header de conversación */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setConversaActiva(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="relative">
                  {conversaSeleccionada.tipus === 'grup' ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <img
                      src={conversaSeleccionada.participants[0]?.avatar}
                      alt={conversaSeleccionada.participants[0]?.nom}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  {conversaSeleccionada.participants[0]?.online && conversaSeleccionada.tipus === 'individual' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h2 className="font-medium text-gray-900 flex items-center space-x-2">
                    <span>{conversaSeleccionada.tipus === 'grup' ? conversaSeleccionada.nom : conversaSeleccionada.participants[0]?.nom}</span>
                    {conversaSeleccionada.tipus === 'grup' && (
                      <span className="text-sm text-gray-500">({conversaSeleccionada.participants.length})</span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {conversaSeleccionada.tipus === 'grup' ? (
                      usuarisEscrivint.length > 0 
                        ? usuarisEscrivint.length === 1
                          ? `${conversaSeleccionada.participants.find(p => p.id === usuarisEscrivint[0])?.nom} ${t.escrivint}`
                          : `${usuarisEscrivint.length} persones ${t.escrivint}`
                        : `${conversaSeleccionada.participants.length} membres`
                    ) : (
                      conversaSeleccionada.participants[0]?.online 
                        ? t.online 
                        : `${t.vist} fa ${formatTemps(conversaSeleccionada.participants[0]?.ultimaConexio || new Date())}`
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-full">
              {respostA && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Responent a:</p>
                      <p className="text-sm text-blue-700 truncate">{respostA.contingut}</p>
                    </div>
                    <button 
                      onClick={() => setRespostA(null)}
                      className="text-blue-500 hover:text-blue-700 ml-2"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {missatgesConversa.map(missatge => {
                const esPropi = missatge.emissorId === 'current-user'
                const autor = conversaSeleccionada?.participants.find(p => p.id === missatge.emissorId)
                
                return (
                  <div
                    key={missatge.id}
                    className={`flex ${esPropi ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md group relative`}>
                      {/* Avatar para grupos y mensajes de otros */}
                      {!esPropi && conversaSeleccionada?.tipus === 'grup' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <img
                            src={autor?.avatar}
                            alt={autor?.nom}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-500 font-medium">{autor?.nom}</span>
                        </div>
                      )}
                      
                      {/* Mensaje respondido */}
                      {missatge.respostA && (
                        <div className="mb-1 text-xs text-gray-500 bg-gray-200 p-2 rounded-t-lg">
                          <div className="border-l-2 border-gray-400 pl-2">
                            {missatgesConversa.find(m => m.id === missatge.respostA)?.contingut}
                          </div>
                        </div>
                      )}
                      
                      {/* Contenido del mensaje */}
                      <div 
                        className={`px-4 py-2 rounded-lg cursor-pointer transition-all ${
                          esPropi
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 border'
                        } ${missatge.respostA ? 'rounded-t-none' : ''}`}
                        onClick={() => setMissatgeSeleccionat(missatge.id === missatgeSeleccionat ? null : missatge.id)}
                      >
                        {/* Contenido según tipo */}
                        {missatge.tipus === 'text' && (
                          <p className="text-sm whitespace-pre-wrap">{missatge.contingut}</p>
                        )}
                        
                        {missatge.tipus === 'imatge' && missatge.arxiu && (
                          <div className="space-y-2">
                            <img 
                              src={missatge.arxiu.url} 
                              alt={missatge.arxiu.nom}
                              className="rounded-lg max-w-full h-auto"
                            />
                            {missatge.contingut && (
                              <p className="text-sm">{missatge.contingut}</p>
                            )}
                          </div>
                        )}
                        
                        {(missatge.tipus === 'document' || missatge.tipus === 'audio' || missatge.tipus === 'video') && missatge.arxiu && (
                          <div className="flex items-center space-x-3 p-2">
                            <div className="flex-shrink-0">
                              {missatge.tipus === 'document' && <FileText className="h-8 w-8 text-red-500" />}
                              {missatge.tipus === 'audio' && <Mic className="h-8 w-8 text-green-500" />}
                              {missatge.tipus === 'video' && <Video className="h-8 w-8 text-purple-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{missatge.arxiu.nom}</p>
                              <p className="text-xs text-gray-500">{formatMidaArxiu(missatge.arxiu.mida)}</p>
                            </div>
                            <button className="flex-shrink-0 p-1 hover:bg-gray-200 rounded">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Reacciones */}
                        {missatge.reaccions && Object.keys(missatge.reaccions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(missatge.reaccions).map(([emoji, userIds]) => (
                              <span 
                                key={emoji}
                                className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                              >
                                <span>{emoji}</span>
                                <span>{userIds.length}</span>
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Timestamp y status */}
                        <div className={`flex items-center justify-between mt-1 ${
                          esPropi ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {formatTemps(missatge.data)}
                          </span>
                          {esPropi && (
                            <div className="flex items-center space-x-1">
                              {missatge.llegit ? (
                                <CheckCheck className="h-3 w-3 text-blue-300" />
                              ) : missatge.entregat ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Menú contextual */}
                      {missatgeSeleccionat === missatge.id && (
                        <div className={`absolute top-0 ${esPropi ? '-left-44' : '-right-44'} bg-white border rounded-lg shadow-lg p-2 z-10 w-40`}>
                          <button 
                            onClick={() => { setRespostA(missatge); setMissatgeSeleccionat(null) }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center space-x-2"
                          >
                            <Reply className="h-4 w-4" />
                            <span>{t.respondre}</span>
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center space-x-2">
                            <Forward className="h-4 w-4" />
                            <span>{t.reenviar}</span>
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center space-x-2">
                            <Copy className="h-4 w-4" />
                            <span>{t.copiar}</span>
                          </button>
                          {esPropi && (
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center space-x-2 text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span>{t.eliminar}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Archivo seleccionado preview */}
              {arxiuSeleccionat && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {arxiuSeleccionat.type.startsWith('image/') ? (
                        <Image className="h-6 w-6 text-blue-600" />
                      ) : arxiuSeleccionat.type.startsWith('video/') ? (
                        <Video className="h-6 w-6 text-purple-600" />
                      ) : arxiuSeleccionat.type.startsWith('audio/') ? (
                        <Mic className="h-6 w-6 text-green-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{arxiuSeleccionat.name}</p>
                      <p className="text-xs text-gray-500">{formatMidaArxiu(arxiuSeleccionat.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={eliminarArxiuSeleccionat}
                    className="p-1 hover:bg-blue-200 rounded-full"
                  >
                    <Circle className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={missatgeNou}
                    onChange={(e) => {
                      setMissatgeNou(e.target.value)
                      adjustTextareaHeight(e.target)
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder={t.escriuMissatge}
                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 min-h-[40px]"
                    rows={1}
                    style={{ height: '40px', overflowY: 'hidden' }}
                  />
                </div>
                
                <button 
                  onClick={() => setMostrarEmojis(!mostrarEmojis)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
                
                {missatgeNou.trim() || arxiuSeleccionat ? (
                  <button
                    onClick={enviarMissatge}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex-shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setGravantAudio(!gravantAudio)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      gravantAudio 
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Panel de emojis */}
              {mostrarEmojis && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-8 gap-2">
                    {['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '😎', '🤔', '😴', '🎉', '👏', '🙏'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setMissatgeNou(prev => prev + emoji)
                          setMostrarEmojis(false)
                        }}
                        className="p-2 hover:bg-gray-200 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center text-gray-500 max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Benvingut a Missatges</h3>
              <p className="text-gray-500">Selecciona una conversa per començar a xatejar amb els teus companys</p>
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>Comparteix arxius i imatges</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Video className="h-4 w-4" />
                  <span>Realitza trucades de vídeo</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Crea grups de treball</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutGeneral>
  )
}