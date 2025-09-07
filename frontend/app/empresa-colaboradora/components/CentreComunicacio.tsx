'use client'

import { useState } from 'react'
import { 
  MessageCircle, Video, Phone, Users, Send, 
  Plus, Search, Settings, Bell, Calendar,
  Clock, Star, Archive, Filter, Paperclip,
  Smile, MoreHorizontal, CheckCircle, Circle,
  Volume2, VolumeX, Monitor, Mic, MicOff,
  Camera, CameraOff, ScreenShare, UserPlus,
  Hash, Lock, Globe, Zap, Bot, TrendingUp,
  Mail, Slack, Instagram, Twitter
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  role: string
  avatar: string
  status: 'online' | 'offline' | 'busy' | 'away'
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

interface Channel {
  id: string
  name: string
  type: 'public' | 'private' | 'direct'
  members: number
  unread: number
  icon?: string
}

export default function CentreComunicacio() {
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'channels' | 'integrations'>('chat')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [videoSettings, setVideoSettings] = useState({
    camera: true,
    microphone: true,
    screen: false,
    recording: false
  })

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Maria González',
      role: 'Gestor Comercial',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=4f46e5&color=fff',
      status: 'online',
      lastMessage: 'Perfecte! El perfil de TechSolutions ja està aprovat',
      lastMessageTime: '10:30',
      unreadCount: 2
    },
    {
      id: '2', 
      name: 'Joan Puigvert',
      role: 'Admin Sistema',
      avatar: 'https://ui-avatars.com/api/?name=Joan+Puigvert&background=059669&color=fff',
      status: 'busy',
      lastMessage: 'Revisaré les noves funcionalitats aquest vespre',
      lastMessageTime: '09:45'
    },
    {
      id: '3',
      name: 'Ana Martín',
      role: 'Suport Tècnic',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Martin&background=dc2626&color=fff',
      status: 'away',
      lastMessage: 'Els documents estan penjats al servidor',
      lastMessageTime: 'Ahir'
    }
  ]

  const channels: Channel[] = [
    { id: '1', name: 'anuncis-generals', type: 'public', members: 156, unread: 3, icon: '📢' },
    { id: '2', name: 'suport-empreses', type: 'public', members: 89, unread: 12, icon: '💼' },
    { id: '3', name: 'desenvolupament', type: 'private', members: 12, unread: 0, icon: '⚡' },
    { id: '4', name: 'marketing-col·lab', type: 'public', members: 45, unread: 5, icon: '🎯' }
  ]

  const integrations = [
    { name: 'Slack', icon: Slack, connected: true, color: 'bg-purple-500' },
    { name: 'Microsoft Teams', icon: Video, connected: false, color: 'bg-blue-500' },
    { name: 'Zoom', icon: Camera, connected: true, color: 'bg-indigo-500' },
    { name: 'Email', icon: Mail, connected: true, color: 'bg-red-500' },
    { name: 'Calendari', icon: Calendar, connected: true, color: 'bg-green-500' },
    { name: 'Twitter', icon: Twitter, connected: false, color: 'bg-sky-500' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-red-500'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Lógica para enviar mensaje
      setMessage('')
    }
  }

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border border-indigo-200/60 p-8 mb-8 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Centre de Comunicació Enterprise</h1>
          <p className="text-slate-600 mt-2">Plataforma unificada per a comunicació professional avançada</p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">234</div>
              <div className="text-xs text-slate-600">Contactes actius</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">1.2K</div>
              <div className="text-xs text-slate-600">Missatges avui</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">45</div>
              <div className="text-xs text-slate-600">Videotrucades</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-xs text-slate-600">Canals actius</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Navigation Tabs
  const NavigationTabs = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 mb-6">
      <div className="flex">
        {[
          { key: 'chat', label: 'Xat & Missatges', icon: MessageCircle },
          { key: 'video', label: 'Videoconferències', icon: Video },
          { key: 'channels', label: 'Canals & Grups', icon: Hash },
          { key: 'integrations', label: 'Integracions', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl m-1'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  // Chat Interface
  const ChatInterface = () => (
    <div className="grid grid-cols-4 gap-6">
      {/* Contact List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">Contactes</h3>
            <button className="p-2 hover:bg-slate-100 rounded-lg">
              <Plus className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar contactes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {contacts.filter(contact => 
            contact.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedContact?.id === contact.id ? 'bg-indigo-50 border-indigo-200' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`w-3 h-3 ${getStatusColor(contact.status)} rounded-full border-2 border-white absolute -bottom-1 -right-1`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800 truncate">{contact.name}</h4>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-slate-500">{contact.lastMessageTime}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-sm text-slate-500 truncate mt-1">{contact.lastMessage}</p>
                  )}
                </div>
                {contact.unreadCount && (
                  <div className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {contact.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedContact.name}</h3>
                    <p className="text-sm text-slate-600">{selectedContact.role}</p>
                  </div>
                  <div className={`w-2 h-2 ${getStatusColor(selectedContact.status)} rounded-full`} />
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </button>
                  <button 
                    onClick={() => setIsVideoCall(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Video className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <MoreHorizontal className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Sample messages */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                  <p className="text-sm">Hola Maria! Com va la revisió del perfil de TechSolutions?</p>
                  <span className="text-xs opacity-75">10:25</span>
                </div>
              </div>
              
              <div className="flex">
                <img src={selectedContact.avatar} className="w-8 h-8 rounded-full mr-3" />
                <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                  <p className="text-sm text-slate-800">Perfecte! Ja està aprovat. Els documents són correctes i la informació és completa.</p>
                  <span className="text-xs text-slate-500">10:30</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-slate-50">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-200 rounded-lg">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                </button>
                <input
                  type="text"
                  placeholder="Escriu un missatge..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-white rounded-xl border focus:ring-2 focus:ring-indigo-500"
                />
                <button className="p-2 hover:bg-slate-200 rounded-lg">
                  <Smile className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Selecciona un contacte</h3>
              <p className="text-slate-500">Tria un contacte per començar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Video Conference Interface
  const VideoInterface = () => (
    <div className="space-y-6">
      {isVideoCall && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Videotrucada amb {selectedContact?.name}</p>
                <p className="text-sm opacity-75">Connexió establerta</p>
              </div>
            </div>
            
            {/* Video controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <button
                  onClick={() => setVideoSettings(prev => ({ ...prev, microphone: !prev.microphone }))}
                  className={`p-3 rounded-full ${videoSettings.microphone ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {videoSettings.microphone ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                </button>
                
                <button
                  onClick={() => setVideoSettings(prev => ({ ...prev, camera: !prev.camera }))}
                  className={`p-3 rounded-full ${videoSettings.camera ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {videoSettings.camera ? <Camera className="w-5 h-5 text-white" /> : <CameraOff className="w-5 h-5 text-white" />}
                </button>
                
                <button
                  onClick={() => setVideoSettings(prev => ({ ...prev, screen: !prev.screen }))}
                  className={`p-3 rounded-full ${videoSettings.screen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  <ScreenShare className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={() => setIsVideoCall(false)}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700"
                >
                  <Phone className="w-5 h-5 text-white transform rotate-135" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Reunions Ràpides</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Video className="w-5 h-5 inline mr-2" />
              Iniciar reunió ara
            </button>
            <button className="w-full p-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              <Calendar className="w-5 h-5 inline mr-2" />
              Programar reunió
            </button>
            <button className="w-full p-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
              <UserPlus className="w-5 h-5 inline mr-2" />
              Convidar participants
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Reunions Programades</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-800">Revisió Setmanal</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">10:00</span>
              </div>
              <p className="text-sm text-slate-600">Equip de desenvolupament</p>
            </div>
            
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-800">Demo Client</h4>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">15:30</span>
              </div>
              <p className="text-sm text-slate-600">Presentació funcionalitats</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Configuració Vídeo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Càmera</span>
              <button className={`w-12 h-6 rounded-full ${videoSettings.camera ? 'bg-indigo-600' : 'bg-slate-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${videoSettings.camera ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Micròfon</span>
              <button className={`w-12 h-6 rounded-full ${videoSettings.microphone ? 'bg-indigo-600' : 'bg-slate-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${videoSettings.microphone ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Gravació</span>
              <button className={`w-12 h-6 rounded-full ${videoSettings.recording ? 'bg-red-600' : 'bg-slate-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${videoSettings.recording ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Channels Interface  
  const ChannelsInterface = () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
          <h3 className="font-bold text-slate-800 mb-3">Canals Disponibles</h3>
          <button className="w-full p-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 inline mr-2" />
            Crear nou canal
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {channels.map((channel) => (
            <div key={channel.id} className="p-4 border-b hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">
                  {channel.type === 'private' ? <Lock className="w-4 h-4 text-slate-600" /> : 
                   channel.type === 'public' ? <Hash className="w-4 h-4 text-slate-600" /> :
                   <MessageCircle className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">#{channel.name}</h4>
                    <span className="text-xs text-slate-500">{channel.members} membres</span>
                  </div>
                  <p className="text-xs text-slate-600 capitalize">{channel.type}</p>
                </div>
                {channel.unread > 0 && (
                  <div className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {channel.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="text-center py-12">
          <Hash className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Selecciona un canal</h3>
          <p className="text-slate-500">Tria un canal per veure els missatges i unir-te a la conversa</p>
        </div>
      </div>
    </div>
  )

  // Integrations Interface
  const IntegrationsInterface = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Integracions Disponibles</h3>
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon
            return (
              <div key={integration.name} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{integration.name}</h4>
                    <p className={`text-xs ${integration.connected ? 'text-green-600' : 'text-slate-500'}`}>
                      {integration.connected ? 'Connectat' : 'Desconnectat'}
                    </p>
                  </div>
                </div>
                
                <button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  integration.connected 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}>
                  {integration.connected ? 'Desconnectar' : 'Connectar'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Analytics de Comunicació</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">87%</div>
            <div className="text-sm text-slate-600">Engagement Rate</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
            <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">2.4m</div>
            <div className="text-sm text-slate-600">Temps de resposta mitjà</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">15K</div>
            <div className="text-sm text-slate-600">Missatges aquest mes</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
            <Users className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">234</div>
            <div className="text-sm text-slate-600">Usuaris actius</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatInterface />
      case 'video': return <VideoInterface />
      case 'channels': return <ChannelsInterface />
      case 'integrations': return <IntegrationsInterface />
      default: return <ChatInterface />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <NavigationTabs />
        {renderContent()}
      </div>
    </div>
  )
}