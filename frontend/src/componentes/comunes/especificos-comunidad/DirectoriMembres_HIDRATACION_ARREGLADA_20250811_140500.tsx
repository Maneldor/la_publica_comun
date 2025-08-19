'use client'

import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter,
  Users,
  MapPin,
  Briefcase,
  Clock,
  Mail,
  MessageCircle,
  UserPlus,
  MoreVertical,
  Crown,
  Shield,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface PerfilUsuari {
  id: string
  nick: string
  nom: string
  cognom: string
  avatar?: string
  rol: 'embaixador' | 'membre'
  comunitat: string
  provincia: string
  organitzacio?: string
  ultimaActivitat: Date
  registrat: Date
  estat: 'actiu' | 'inactiu' | 'suspès'
  verificat: boolean
  descripcioBreu?: string
  interessos: string[]
  connexions: number
  posts: number
  grups: number
}

// Generar 50 usuaris mock amb noms catalans
const USUARIS_MOCK: PerfilUsuari[] = [
  {
    id: 'user-1',
    nick: '@tu_perfil',
    nom: 'Tu',
    cognom: 'Perfil',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rol: 'embaixador',
    comunitat: 'Catalunya',
    provincia: 'Barcelona',
    organitzacio: 'Ajuntament de Barcelona',
    ultimaActivitat: new Date(),
    registrat: new Date('2024-01-15'),
    estat: 'actiu',
    verificat: true,
    descripcioBreu: 'Funcionari públic apassionat per la innovació tecnològica',
    interessos: ['Tecnologia', 'Innovació', 'Sostenibilitat'],
    connexions: 45,
    posts: 23,
    grups: 5
  },
  {
    id: 'user-2',
    nick: '@maria_santos',
    nom: 'Maria',
    cognom: 'Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=100&h=100&fit=crop&crop=face',
    rol: 'membre',
    comunitat: 'Catalunya',
    provincia: 'Girona',
    organitzacio: 'Diputació de Girona',
    ultimaActivitat: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    registrat: new Date('2023-11-20'),
    estat: 'actiu',
    verificat: true,
    descripcioBreu: 'Coordinadora de projectes socials i comunitaris',
    interessos: ['Gestió Social', 'Voluntariat', 'Educació'],
    connexions: 78,
    posts: 89,
    grups: 8
  },
  {
    id: 'user-3',
    nick: '@jordi_martin',
    nom: 'Jordi',
    cognom: 'Martin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rol: 'membre',
    comunitat: 'Catalunya',
    provincia: 'Tarragona',
    organitzacio: 'Empresa Tecnològica SL',
    ultimaActivitat: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
    registrat: new Date('2024-02-10'),
    estat: 'actiu',
    verificat: true,
    descripcioBreu: 'Desenvolupador web especialitzat en solucions per al sector públic',
    interessos: ['Programació', 'Startups', 'Transformació Digital'],
    connexions: 34,
    posts: 45,
    grups: 3
  },
  {
    id: 'user-4',
    nick: '@anna_lopez',
    nom: 'Anna',
    cognom: 'López',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rol: 'membre',
    comunitat: 'Catalunya',
    provincia: 'Lleida',
    organitzacio: 'Generalitat de Catalunya',
    ultimaActivitat: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia ago
    registrat: new Date('2023-09-05'),
    estat: 'actiu',
    verificat: true,
    descripcioBreu: 'Especialista en polítiques públiques i desenvolupament territorial',
    interessos: ['Polítiques Públiques', 'Desenvolupament Rural', 'Medi Ambient'],
    connexions: 92,
    posts: 67,
    grups: 12
  },
  {
    id: 'user-5',
    nick: '@pere_vila',
    nom: 'Pere',
    cognom: 'Vila',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rol: 'membre',
    comunitat: 'Catalunya',
    provincia: 'Barcelona',
    organitzacio: 'CCOO Catalunya',
    ultimaActivitat: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3h ago
    registrat: new Date('2023-07-12'),
    estat: 'actiu',
    verificat: true,
    descripcioBreu: 'Representant sindical amb experiència en negociació col·lectiva',
    interessos: ['Drets Laborals', 'Negociació', 'Justícia Social'],
    connexions: 156,
    posts: 234,
    grups: 15
  }
]

// Generar més usuaris automàticament
const noms = ['Laura', 'Marc', 'Carla', 'David', 'Nuria', 'Albert', 'Marta', 'Joan', 'Sandra', 'Toni', 'Elena', 'Gerard', 'Cristina', 'Raul', 'Silvia']
const cognoms = ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Jiménez', 'Álvarez', 'Romero', 'Navarro', 'Torres']
const ciutats = ['Barcelona', 'Girona', 'Tarragona', 'Lleida']
const organitzacions = ['Ajuntament', 'Diputació', 'Generalitat', 'Consell Comarcal', 'Empresa Pública', 'Sindicat', 'Associació']

for (let i = 6; i <= 50; i++) {
  const nom = noms[i % noms.length]
  const cognom = cognoms[(i * 2) % cognoms.length]
  const nick = `@${nom.toLowerCase()}_${cognom.toLowerCase()}`
  const provincia = ciutats[i % ciutats.length]
  const organitzacio = organitzacions[(i * 3) % organitzacions.length]
  const rols: any[] = ['membre', 'embaixador']
  const rol = rols[i % rols.length]
  
  USUARIS_MOCK.push({
    id: `user-${i}`,
    nick,
    nom,
    cognom,
    avatar: `https://images.unsplash.com/photo-${1440000000000 + i}0000000?w=100&h=100&fit=crop&crop=face`,
    rol,
    comunitat: 'Catalunya',
    provincia,
    organitzacio: `${organitzacio} de ${provincia}`,
    ultimaActivitat: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)), // Determinístico
    registrat: new Date(Date.now() - (i * 1000 * 60 * 60 * 24 * 7)), // Determinístico
    estat: (i % 10) === 0 ? 'inactiu' : 'actiu', // Determinístico: 90% actius
    verificat: (i % 5) !== 0, // Determinístico: 80% verificats
    descripcioBreu: `Professional del sector públic treballant a ${organitzacio} de ${provincia}`,
    interessos: ['Administració', 'Gestió Pública', 'Innovació'].slice(0, (i % 3) + 1),
    connexions: (i * 3) % 200,
    posts: (i * 5) % 150,
    grups: (i % 20) + 1
  })
}

export default function DirectoriMembres() {
  const [cerca, setCerca] = useState('')
  const [filtreRol, setFiltreRol] = useState<string>('tots')
  const [filtreEstat, setFiltreEstat] = useState<string>('tots')
  const [filtreComunitat, setFiltreComunitat] = useState<string>('tots')
  const [ordenacio, setOrdenacio] = useState<'nom' | 'activitat' | 'registre' | 'connexions'>('activitat')

  // Filtrar usuaris
  const usuarisFiltrats = useMemo(() => {
    let filtrats = [...USUARIS_MOCK]

    // Filtre de cerca
    if (cerca) {
      filtrats = filtrats.filter(usuari =>
        usuari.nick.toLowerCase().includes(cerca.toLowerCase()) ||
        usuari.nom.toLowerCase().includes(cerca.toLowerCase()) ||
        usuari.cognom.toLowerCase().includes(cerca.toLowerCase())
      )
    }

    // Filtre per rol
    if (filtreRol !== 'tots') {
      filtrats = filtrats.filter(usuari => usuari.rol === filtreRol)
    }

    // Filtre per estat
    if (filtreEstat !== 'tots') {
      filtrats = filtrats.filter(usuari => usuari.estat === filtreEstat)
    }

    // Filtre per comunitat
    if (filtreComunitat !== 'tots') {
      filtrats = filtrats.filter(usuari => usuari.comunitat === filtreComunitat)
    }

    // Ordenació
    filtrats.sort((a, b) => {
      switch (ordenacio) {
        case 'nom':
          return a.nick.localeCompare(b.nick)
        case 'activitat':
          return b.ultimaActivitat.getTime() - a.ultimaActivitat.getTime()
        case 'registre':
          return b.registrat.getTime() - a.registrat.getTime()
        case 'connexions':
          return b.connexions - a.connexions
        default:
          return 0
      }
    })

    return filtrats
  }, [cerca, filtreRol, filtreEstat, filtreComunitat, ordenacio])

  const obtenerIconoRol = (rol: string) => {
    switch (rol) {
      case 'embaixador':
        return <Crown size={14} className="text-purple-500" />
      default:
        return null
    }
  }

  const obtenerColorRol = (rol: string) => {
    switch (rol) {
      case 'embaixador':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatearDataRelativa = (data: Date) => {
    const ara = new Date()
    const diferencia = ara.getTime() - data.getTime()
    const dies = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    
    if (dies === 0) return 'Avui'
    if (dies === 1) return 'Ahir'
    if (dies < 7) return `Fa ${dies} dies`
    if (dies < 30) return `Fa ${Math.floor(dies / 7)} setmanes`
    if (dies < 365) return `Fa ${Math.floor(dies / 30)} mesos`
    return `Fa ${Math.floor(dies / 365)} anys`
  }

  const renderTargetaUsuari = (usuari: PerfilUsuari) => {
    const esYo = usuari.id === 'user-1'
    
    return (
      <div 
        key={usuari.id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden relative"
      >
        {/* Contingut principal - igual que ListaMiembrosGrupo */}
        <div className="p-4">
          {/* Avatar i info bàsica */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="relative flex-shrink-0">
              <button className="block">
                {usuari.avatar ? (
                  <img 
                    src={usuari.avatar} 
                    alt={usuari.nick}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm hover:shadow-md transition-shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center hover:shadow-md transition-shadow">
                    <span className="text-white font-bold text-sm">
                      {usuari.nick.charAt(1)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </button>
              
              {/* Indicador de estado */}
              {usuari.estat === 'actiu' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate hover:text-blue-600 transition-colors cursor-pointer mb-1">
                {usuari.nick}
                {esYo && <span className="text-sm text-gray-500 ml-1">(Tu)</span>}
              </h3>
              
              {/* Rol amb icono */}
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${obtenerColorRol(usuari.rol)}`}>
                  {obtenerIconoRol(usuari.rol)}
                  <span className="capitalize">{usuari.rol}</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Estadístiques del membre */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock size={12} />
              <span>Unit {formatearDataRelativa(usuari.registrat)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users size={12} />
              <span>Actiu {formatearDataRelativa(usuari.ultimaActivitat)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <MessageCircle size={12} />
              <span>{usuari.posts} posts</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Mail size={12} />
              <span>{usuari.connexions} connexions</span>
            </div>
          </div>
          
          {/* Botons d'acció en dues files */}
          {!esYo && (
            <div className="space-y-2">
              {/* Primera fila: Connectar i Missatge */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  <UserPlus size={14} />
                  <span>Connectar</span>
                </button>
                
                <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <MessageCircle size={14} />
                  <span>Missatge</span>
                </button>
              </div>
              
              {/* Segona fila: Veure perfil */}
              <div className="flex">
                <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  Veure perfil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Directori de Membres
          </h1>
          <p className="text-gray-600">
            Descobreix i connecta amb altres membres de la comunitat
          </p>
        </div>
        
        {/* Filtres i cerca */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Cerca */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cercar per nick o nom..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={cerca}
                onChange={(e) => setCerca(e.target.value)}
              />
            </div>
            
            {/* Filtre per rol */}
            <select
              value={filtreRol}
              onChange={(e) => setFiltreRol(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="tots">Tots els rols</option>
              <option value="embaixador">Embaixadors</option>
              <option value="membre">Membres</option>
            </select>
            
            {/* Filtre per estat */}
            <select
              value={filtreEstat}
              onChange={(e) => setFiltreEstat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="tots">Tots els estats</option>
              <option value="actiu">Actius</option>
              <option value="inactiu">Inactius</option>
            </select>
            
            {/* Ordenació */}
            <select
              value={ordenacio}
              onChange={(e) => setOrdenacio(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="activitat">Per activitat</option>
              <option value="nom">Per nom</option>
              <option value="registre">Per data registre</option>
              <option value="connexions">Per connexions</option>
            </select>
          </div>
          
          {/* Estadístiques */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div>
              Mostrant {usuarisFiltrats.length} de {USUARIS_MOCK.length} membres
            </div>
            <div className="flex items-center space-x-4">
              <span>Actius: {USUARIS_MOCK.filter(u => u.estat === 'actiu').length}</span>
              <span>Verificats: {USUARIS_MOCK.filter(u => u.verificat).length}</span>
            </div>
          </div>
        </div>
        
        {/* Llista de membres */}
        {usuarisFiltrats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {usuarisFiltrats.map(renderTargetaUsuari)}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No s'han trobat membres
            </h3>
            <p className="text-gray-600">
              Prova ajustant els filtres de cerca
            </p>
          </div>
        )}
      </div>
    </div>
  )
}