'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search, MessageCircle, User, Clock, Check, CheckCheck, Send, Paperclip, Smile, Phone, Video, MoreVertical, ArrowLeft, PhoneOff, VideoOff, Mic, MicOff, Info, BellOff, Bell, Archive, Trash2, UserX, Download, Eye, Image, FileText, Music, Film, File } from 'lucide-react'
import { useMissatges } from '../../../contextos/MissatgesContext'
import { audioNotificacions } from '../../../utils/audioNotificacions'

interface Conversacio {
  id: string
  membre: {
    id: string
    nom: string
    avatar?: string
    inicials: string
    estat: 'online' | 'offline' | 'ausent'
  }
  ultimMissatge: {
    text: string
    hora: string
    llegit: boolean
    enviatPerMi: boolean
  }
  missatgesNoLlegits: number
}

interface Missatge {
  id: string
  text: string
  hora: string
  enviatPerMi: boolean
  llegit?: boolean
  tipus?: 'text' | 'imatge' | 'document' | 'audio' | 'video'
  arxiu?: {
    nom: string
    url: string
    mida: number
    tipus: string
  }
}

interface ModalMissatgesGlobalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModalMissatgesGlobal({ isOpen, onClose }: ModalMissatgesGlobalProps) {
  const [termineCerca, setTermineCerca] = useState('')
  const [conversacioSeleccionada, setConversacioSeleccionada] = useState<Conversacio | null>(null)
  const [nouMissatge, setNouMissatge] = useState('')
  const [missatges, setMissatges] = useState<Missatge[]>([])
  const [trucadaActiva, setTrucadaActiva] = useState(false)
  const [tipusTrucada, setTipusTrucada] = useState<'audio' | 'video' | null>(null)
  const [urlJitsi, setUrlJitsi] = useState<string | null>(null)
  const [menuOpcionsObert, setMenuOpcionsObert] = useState(false)
  const [conversacioSilenciada, setConversacioSilenciada] = useState(false)
  const [menuArxiusObert, setMenuArxiusObert] = useState(false)
  const [arxiuSeleccionat, setArxiuSeleccionat] = useState<File | null>(null)
  const [previewArxiu, setPreviewArxiu] = useState<string | null>(null)
  const [emojiPickerObert, setEmojiPickerObert] = useState(false)
  const missatgesEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const menuOpcionsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  
  // Context de missatges real
  const { enviarMissatge, marcarComLlegits } = useMissatges()
  
  // Simular dades de conversacions
  const [conversacions] = useState<Conversacio[]>([
    {
      id: 'conv-1',
      membre: {
        id: 'user-2',
        nom: 'Maria Garcia',
        inicials: 'MG',
        estat: 'online'
      },
      ultimMissatge: {
        text: 'Perfecte! Ens veiem demà a la reunió',
        hora: '10:30',
        llegit: true,
        enviatPerMi: false
      },
      missatgesNoLlegits: 0
    },
    {
      id: 'conv-2',
      membre: {
        id: 'user-3',
        nom: 'Joan Martínez',
        inicials: 'JM',
        estat: 'offline'
      },
      ultimMissatge: {
        text: 'Gràcies per la informació!',
        hora: 'Ahir',
        llegit: true,
        enviatPerMi: true
      },
      missatgesNoLlegits: 0
    },
    {
      id: 'conv-3',
      membre: {
        id: 'user-4',
        nom: 'Anna Puig',
        inicials: 'AP',
        estat: 'online'
      },
      ultimMissatge: {
        text: 'Tens disponibilitat aquesta setmana?',
        hora: '09:15',
        llegit: false,
        enviatPerMi: false
      },
      missatgesNoLlegits: 2
    },
    {
      id: 'conv-4',
      membre: {
        id: 'user-5',
        nom: 'Pere Rodríguez',
        inicials: 'PR',
        estat: 'ausent'
      },
      ultimMissatge: {
        text: 'He revisat el document, tot correcte',
        hora: 'Dimarts',
        llegit: true,
        enviatPerMi: true
      },
      missatgesNoLlegits: 0
    }
  ])

  // Carregar missatges quan es selecciona una conversa
  useEffect(() => {
    if (conversacioSeleccionada) {
      // Simular càrrega de missatges
      const missatgesSimulats: Missatge[] = [
        {
          id: '1',
          text: 'Hola! Com estàs?',
          hora: '09:00',
          enviatPerMi: false,
          llegit: true
        },
        {
          id: '2',
          text: 'Molt bé, gràcies! I tu?',
          hora: '09:05',
          enviatPerMi: true,
          llegit: true
        },
        {
          id: '3',
          text: 'Perfecte! Volia comentar-te sobre el projecte...',
          hora: '09:10',
          enviatPerMi: false,
          llegit: true
        },
        {
          id: '4',
          text: 'Sí, dis-me. Estic escoltant',
          hora: '09:12',
          enviatPerMi: true,
          llegit: true
        },
        {
          id: '5',
          text: conversacioSeleccionada.ultimMissatge.text,
          hora: conversacioSeleccionada.ultimMissatge.hora,
          enviatPerMi: conversacioSeleccionada.ultimMissatge.enviatPerMi,
          llegit: conversacioSeleccionada.ultimMissatge.llegit
        }
      ]
      setMissatges(missatgesSimulats)
      
      // Marcar missatges com llegits
      if (conversacioSeleccionada.id) {
        marcarComLlegits(conversacioSeleccionada.id)
      }
    }
  }, [conversacioSeleccionada, marcarComLlegits])

  // Scroll automàtic als nous missatges
  useEffect(() => {
    missatgesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [missatges])

  // Tancar menús quan es fa clic fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpcionsRef.current && !menuOpcionsRef.current.contains(event.target as Node)) {
        setMenuOpcionsObert(false)
      }
      
      // Tancar menú d'arxius quan es fa clic fora
      const arxiusButton = event.target as Element
      if (!arxiusButton?.closest('.relative')) {
        setMenuArxiusObert(false)
      }
      
      // Tancar emoji picker quan es fa clic fora
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setEmojiPickerObert(false)
      }
    }

    if (menuOpcionsObert || menuArxiusObert || emojiPickerObert) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpcionsObert, menuArxiusObert])

  // Filtrar conversacions segons el terme de cerca
  const conversacionsFiltrades = conversacions.filter(conv =>
    conv.membre.nom.toLowerCase().includes(termineCerca.toLowerCase())
  )

  // Enviar missatge
  const handleEnviarMissatge = async () => {
    if (nouMissatge.trim() && conversacioSeleccionada) {
      const nouMissatgeObj: Missatge = {
        id: Date.now().toString(),
        text: nouMissatge,
        hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
        enviatPerMi: true,
        llegit: false
      }
      
      setMissatges(prev => [...prev, nouMissatgeObj])
      setNouMissatge('')
      
      // Enviar al context real
      await enviarMissatge(conversacioSeleccionada.id, nouMissatge)
    }
  }

  // Iniciar trucada amb Jitsi Meet
  const iniciarTrucada = (tipus: 'audio' | 'video') => {
    if (!conversacioSeleccionada) return
    
    // Generar nom únic per la sala
    const nomSala = `lapublica-${conversacioSeleccionada.id}-${Date.now()}`
    
    // Configuració de Jitsi Meet
    const domain = 'meet.jit.si'
    const options = {
      roomName: nomSala,
      width: '100%',
      height: '100%',
      parentNode: undefined,
      configOverwrite: {
        startWithAudioMuted: tipus === 'audio' ? false : true,
        startWithVideoMuted: tipus === 'audio' ? true : false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        // Configuració en català
        defaultLanguage: 'ca',
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'desktop',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'chat',
          'recording',
          'livestreaming',
          'settings',
          'videoquality',
          'tileview',
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_REMOTE_DISPLAY_NAME: conversacioSeleccionada.membre.nom,
        APP_NAME: 'La Pública - Videotrucada'
      },
      userInfo: {
        displayName: 'Manel Amador' // TODO: Obtenir del context d'usuari
      }
    }
    
    // Construir URL de Jitsi
    const jitsiUrl = `https://${domain}/${nomSala}#config.defaultLanguage="ca"&interfaceConfig.APP_NAME="La Pública"&userInfo.displayName="Manel Amador"`
    
    setUrlJitsi(jitsiUrl)
    setTipusTrucada(tipus)
    setTrucadaActiva(true)
    
    // Reproduir so de trucada
    audioNotificacions.playTrucadaEntrant()
    
    // Afegir missatge al xat informant de la trucada
    const missatgeTrucada: Missatge = {
      id: Date.now().toString(),
      text: `📞 Has iniciat una ${tipus === 'video' ? 'videotrucada' : 'trucada de veu'}`,
      hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
      enviatPerMi: true,
      llegit: false
    }
    setMissatges(prev => [...prev, missatgeTrucada])
  }

  // Finalitzar trucada
  const finalitzarTrucada = () => {
    setTrucadaActiva(false)
    setTipusTrucada(null)
    setUrlJitsi(null)
    
    // Afegir missatge al xat
    const missatgeFi: Missatge = {
      id: Date.now().toString(),
      text: '📞 Trucada finalitzada',
      hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
      enviatPerMi: true,
      llegit: false
    }
    setMissatges(prev => [...prev, missatgeFi])
  }

  // Funcions del menú d'opcions
  const veurePerfil = () => {
    if (!conversacioSeleccionada) return
    console.log('Navegant al perfil de:', conversacioSeleccionada.membre.nom)
    // TODO: Implementar navegació al perfil
    setMenuOpcionsObert(false)
  }

  const alternarSilenciar = () => {
    setConversacioSilenciada(!conversacioSilenciada)
    console.log(conversacioSilenciada ? 'Dessilenciant conversa' : 'Silenciant conversa')
    audioNotificacions.playExit()
    setMenuOpcionsObert(false)
  }


  const arxivarConversa = () => {
    if (!conversacioSeleccionada) return
    console.log('Arxivant conversa:', conversacioSeleccionada.id)
    // TODO: Implementar arxivar conversa
    audioNotificacions.playExit()
    setMenuOpcionsObert(false)
  }

  const eliminarConversa = () => {
    if (!conversacioSeleccionada) return
    const confirmar = window.confirm('Estàs segur que vols eliminar aquesta conversa? Aquesta acció no es pot desfer.')
    if (confirmar) {
      console.log('Eliminant conversa:', conversacioSeleccionada.id)
      // TODO: Implementar eliminar conversa
      setConversacioSeleccionada(null)
      setMenuOpcionsObert(false)
    }
  }

  const bloquejarContacte = () => {
    if (!conversacioSeleccionada) return
    const confirmar = window.confirm(`Estàs segur que vols bloquejar ${conversacioSeleccionada.membre.nom}? No podran contactar amb tu.`)
    if (confirmar) {
      console.log('Bloquejant contacte:', conversacioSeleccionada.membre.nom)
      // TODO: Implementar bloquejar contacte
      setMenuOpcionsObert(false)
    }
  }

  const exportarChat = () => {
    if (!conversacioSeleccionada) return
    console.log('Exportant xat de:', conversacioSeleccionada.membre.nom)
    // TODO: Implementar exportació de xat (PDF/TXT)
    setMenuOpcionsObert(false)
  }

  // Funcions per gestionar arxius
  const manejarSeleccioArxiu = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setArxiuSeleccionat(file)
      
      // Crear preview per imatges
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewArxiu(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewArxiu(null)
      }
      
      setMenuArxiusObert(false)
    }
  }

  const formatarMidaArxiu = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const obtenirTipusArxiu = (file: File) => {
    if (file.type.startsWith('image/')) return 'imatge'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type.startsWith('video/')) return 'video'
    return 'document'
  }

  const enviarArxiu = async () => {
    if (!arxiuSeleccionat || !conversacioSeleccionada) return

    // Simular upload de l'arxiu (en producció seria un servei real)
    const arxiuUrl = URL.createObjectURL(arxiuSeleccionat)
    
    const nouMissatgeArxiu: Missatge = {
      id: Date.now().toString(),
      text: arxiuSeleccionat.name,
      hora: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
      enviatPerMi: true,
      llegit: false,
      tipus: obtenirTipusArxiu(arxiuSeleccionat),
      arxiu: {
        nom: arxiuSeleccionat.name,
        url: arxiuUrl,
        mida: arxiuSeleccionat.size,
        tipus: arxiuSeleccionat.type
      }
    }
    
    setMissatges(prev => [...prev, nouMissatgeArxiu])
    setArxiuSeleccionat(null)
    setPreviewArxiu(null)
    
    // Reproduir so d'enviament
    audioNotificacions.playMissatgeEnviat()
  }

  const cancelarArxiu = () => {
    setArxiuSeleccionat(null)
    setPreviewArxiu(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Afegir emoji al missatge
  const afegirEmoji = (emoji: string) => {
    setNouMissatge(prev => prev + emoji)
    setEmojiPickerObert(false)
  }

  // Tancar el modal i netejar estat
  const handleClose = () => {
    setConversacioSeleccionada(null)
    setTermineCerca('')
    setNouMissatge('')
    setMissatges([])
    setMenuOpcionsObert(false)
    setEmojiPickerObert(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      {/* Modal principal - ocupa la major part de la pantalla */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[85vh] flex">
        
        {/* PART ESQUERRA - Llista de conversacions (1/3 de l'ample) */}
        <div className="w-full md:w-[400px] border-r flex flex-col">
          
          {/* Header esquerra */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Missatges</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newState = !audioNotificacions.isEnabled()
                  audioNotificacions.setEnabled(newState)
                  if (newState) audioNotificacions.playExit()
                }}
                className={`p-2 rounded-lg transition-colors ${
                  audioNotificacions.isEnabled() 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={audioNotificacions.isEnabled() ? 'Desactivar sons' : 'Activar sons'}
              >
                {audioNotificacions.isEnabled() ? (
                  <Bell className="w-5 h-5" />
                ) : (
                  <BellOff className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Buscador */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={termineCerca}
                onChange={(e) => setTermineCerca(e.target.value)}
                placeholder="Cercar converses..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Llista de conversacions */}
          <div className="flex-1 overflow-y-auto">
            {conversacions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tens converses encara
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Per començar una conversa, primer has de tenir una connexió amb un altre membre.
                </p>
                <button
                  onClick={() => window.location.href = '/membres'}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Explorar Membres
                </button>
              </div>
            ) : conversacionsFiltrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-600">
                  No s'han trobat converses amb "{termineCerca}"
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {conversacionsFiltrades.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setConversacioSeleccionada(conv)}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                      conversacioSeleccionada?.id === conv.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.membre.avatar ? (
                        <img
                          src={conv.membre.avatar}
                          alt={conv.membre.nom}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {conv.membre.inicials}
                        </div>
                      )}
                      {conv.membre.estat === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                      {conv.membre.estat === 'ausent' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Contingut */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {conv.membre.nom}
                        </h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {conv.ultimMissatge.hora}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex items-center">
                          {conv.ultimMissatge.enviatPerMi && (
                            <>
                              {conv.ultimMissatge.llegit ? (
                                <CheckCheck className="w-4 h-4 text-blue-500 mr-1 flex-shrink-0" />
                              ) : (
                                <Check className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                              )}
                            </>
                          )}
                          {conv.ultimMissatge.text}
                        </p>
                        {conv.missatgesNoLlegits > 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex-shrink-0">
                            {conv.missatgesNoLlegits}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PART DRETA - Conversa seleccionada (2/3 de l'ample) */}
        <div className={`${conversacioSeleccionada ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {conversacioSeleccionada ? (
            <>
              {/* Header conversa */}
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                  {/* Botó tornar enrere (només mòbil) */}
                  <button
                    onClick={() => setConversacioSeleccionada(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {/* Avatar i nom */}
                  <div className="relative">
                    {conversacioSeleccionada.membre.avatar ? (
                      <img
                        src={conversacioSeleccionada.membre.avatar}
                        alt={conversacioSeleccionada.membre.nom}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversacioSeleccionada.membre.inicials}
                      </div>
                    )}
                    {conversacioSeleccionada.membre.estat === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {conversacioSeleccionada.membre.nom}
                      </h3>
                      {conversacioSilenciada && (
                        <BellOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {conversacioSeleccionada.membre.estat === 'online' ? 'En línia' : 
                       conversacioSeleccionada.membre.estat === 'ausent' ? 'Ausent' : 'Desconnectat'}
                    </p>
                  </div>
                </div>

                {/* Accions */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => iniciarTrucada('audio')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Iniciar trucada de veu"
                  >
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => iniciarTrucada('video')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Iniciar videotrucada"
                  >
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative" ref={menuOpcionsRef}>
                    <button 
                      onClick={() => setMenuOpcionsObert(!menuOpcionsObert)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Més opcions"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Menú desplegable d'opcions */}
                    {menuOpcionsObert && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">
                        <button
                          onClick={veurePerfil}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Info className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Informació del contacte</span>
                        </button>
                        

                        <button
                          onClick={alternarSilenciar}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {conversacioSilenciada ? (
                            <Bell className="w-4 h-4 text-gray-500" />
                          ) : (
                            <BellOff className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-sm">
                            {conversacioSilenciada ? 'Activar notificacions' : 'Silenciar notificacions'}
                          </span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={arxivarConversa}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Archive className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Arxivar conversa</span>
                        </button>

                        <button
                          onClick={exportarChat}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Exportar xat</span>
                        </button>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={eliminarConversa}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Eliminar conversa</span>
                        </button>

                        <button
                          onClick={bloquejarContacte}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <UserX className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Bloquejar contacte</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Àrea de missatges */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {missatges.map((missatge) => (
                    <div
                      key={missatge.id}
                      className={`flex ${missatge.enviatPerMi ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl ${
                          missatge.enviatPerMi
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-900 border'
                        }`}
                      >
                        {/* Renderitzar segons el tipus de missatge */}
                        {missatge.tipus === 'imatge' && missatge.arxiu ? (
                          <div className="p-2">
                            <img 
                              src={missatge.arxiu.url} 
                              alt={missatge.arxiu.nom}
                              className="w-full h-auto rounded-lg mb-2 max-h-64 object-cover"
                              onClick={() => window.open(missatge.arxiu!.url, '_blank')}
                              style={{ cursor: 'pointer' }}
                            />
                            <p className="text-xs opacity-75">{missatge.arxiu.nom}</p>
                          </div>
                        ) : missatge.tipus === 'document' && missatge.arxiu ? (
                          <div className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                missatge.enviatPerMi ? 'bg-blue-400' : 'bg-gray-100'
                              }`}>
                                {missatge.arxiu.tipus.includes('pdf') ? (
                                  <FileText className="w-6 h-6" />
                                ) : (
                                  <File className="w-6 h-6" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{missatge.arxiu.nom}</p>
                                <p className="text-xs opacity-75">{formatarMidaArxiu(missatge.arxiu.mida)}</p>
                              </div>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = missatge.arxiu!.url
                                  link.download = missatge.arxiu!.nom
                                  link.click()
                                }}
                                className={`p-1 rounded ${
                                  missatge.enviatPerMi ? 'hover:bg-blue-400' : 'hover:bg-gray-100'
                                }`}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : missatge.tipus === 'audio' && missatge.arxiu ? (
                          <div className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                missatge.enviatPerMi ? 'bg-blue-400' : 'bg-gray-100'
                              }`}>
                                <Music className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{missatge.arxiu.nom}</p>
                                <p className="text-xs opacity-75">{formatarMidaArxiu(missatge.arxiu.mida)}</p>
                              </div>
                            </div>
                            <audio controls className="w-full mt-2" style={{ height: '32px' }}>
                              <source src={missatge.arxiu.url} type={missatge.arxiu.tipus} />
                              El teu navegador no suporta àudio.
                            </audio>
                          </div>
                        ) : missatge.tipus === 'video' && missatge.arxiu ? (
                          <div className="p-2">
                            <video 
                              controls 
                              className="w-full h-auto rounded-lg mb-2 max-h-64"
                              preload="metadata"
                            >
                              <source src={missatge.arxiu.url} type={missatge.arxiu.tipus} />
                              El teu navegador no suporta vídeo.
                            </video>
                            <p className="text-xs opacity-75 px-1">{missatge.arxiu.nom}</p>
                          </div>
                        ) : (
                          // Missatge de text normal
                          <div className="px-4 py-2">
                            <p className="text-sm">{missatge.text}</p>
                          </div>
                        )}
                        
                        {/* Timestamp i estat */}
                        <div className={`px-3 pb-2 flex items-center justify-end space-x-1 ${
                          missatge.enviatPerMi ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{missatge.hora}</span>
                          {missatge.enviatPerMi && (
                            missatge.llegit ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={missatgesEndRef} />
                </div>
              </div>

              {/* Preview d'arxiu seleccionat */}
              {arxiuSeleccionat && (
                <div className="px-4 py-2 border-t bg-blue-50">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    {previewArxiu ? (
                      <img 
                        src={previewArxiu} 
                        alt={arxiuSeleccionat.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {arxiuSeleccionat.type.startsWith('audio/') ? (
                          <Music className="w-6 h-6 text-gray-600" />
                        ) : arxiuSeleccionat.type.startsWith('video/') ? (
                          <Film className="w-6 h-6 text-gray-600" />
                        ) : arxiuSeleccionat.type.includes('pdf') ? (
                          <FileText className="w-6 h-6 text-gray-600" />
                        ) : (
                          <File className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{arxiuSeleccionat.name}</p>
                      <p className="text-xs text-gray-600">{formatarMidaArxiu(arxiuSeleccionat.size)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={enviarArxiu}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Enviar
                      </button>
                      <button
                        onClick={cancelarArxiu}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Camp d'entrada de missatge */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button 
                      onClick={() => setMenuArxiusObert(!menuArxiusObert)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Adjuntar arxiu"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {/* Menú d'arxius */}
                    {menuArxiusObert && (
                      <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button
                          onClick={() => {
                            fileInputRef.current?.click()
                            setMenuArxiusObert(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          <Image className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Imatges</span>
                        </button>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click()
                            setMenuArxiusObert(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Documents</span>
                        </button>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click()
                            setMenuArxiusObert(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          <Music className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Àudio</span>
                        </button>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click()
                            setMenuArxiusObert(false)
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          <Film className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Vídeos</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Input d'arxius ocult */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                      onChange={manejarSeleccioArxiu}
                      className="hidden"
                    />
                  </div>
                  
                  <input
                    type="text"
                    value={nouMissatge}
                    onChange={(e) => setNouMissatge(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnviarMissatge()}
                    placeholder="Escriu un missatge..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="relative" ref={emojiPickerRef}>
                    <button 
                      onClick={() => setEmojiPickerObert(!emojiPickerObert)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Seleccionar emoji"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Emoji Picker */}
                    {emojiPickerObert && (
                      <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20 w-80">
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Emojis</h3>
                        </div>
                        
                        {/* Categories d'emojis */}
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {/* Emoticons */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">😊 Emoticons</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Gestos */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">👋 Gestos</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Objectes */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">🎯 Objectes</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Natura */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">🌿 Natura</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Menjar */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">🍎 Menjar</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Activitats */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">⚽ Activitats</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Símbols */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">💯 Símbols</h4>
                            <div className="grid grid-cols-8 gap-1">
                              {['💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '👋', '✌️', '👌', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => afegirEmoji(emoji)}
                                  className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEnviarMissatge}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Pantalla buida quan no hi ha conversa seleccionada
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Selecciona una conversa
                </h3>
                <p className="text-gray-600">
                  Tria una conversa de la llista per començar a xatejar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal de trucada amb Jitsi Meet */}
    {trucadaActiva && urlJitsi && (
      <div className="fixed inset-0 z-[60] bg-black">
        <div className="relative w-full h-full">
          {/* Header de la trucada */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                <div className="relative">
                  {conversacioSeleccionada?.membre.avatar ? (
                    <img
                      src={conversacioSeleccionada.membre.avatar}
                      alt={conversacioSeleccionada.membre.nom}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversacioSeleccionada?.membre.inicials}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{conversacioSeleccionada?.membre.nom}</h3>
                  <p className="text-xs opacity-90">
                    {tipusTrucada === 'video' ? 'Videotrucada' : 'Trucada de veu'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={finalitzarTrucada}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <PhoneOff className="w-5 h-5" />
                <span>Finalitzar</span>
              </button>
            </div>
          </div>

          {/* Iframe de Jitsi Meet */}
          <iframe
            ref={iframeRef}
            src={urlJitsi}
            className="w-full h-full"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ border: 'none' }}
            title="Videotrucada La Pública"
          />

          {/* Missatge informatiu */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-center">
            <div className="inline-flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Trucada en curs amb {conversacioSeleccionada?.membre.nom}</span>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}