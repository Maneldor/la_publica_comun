'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useConexiones } from '../../../contextos/ConexionesContext'
import TarjetaMiembro from './TarjetaMiembro'
import { MissatgesGlobal } from './MissatgesGlobal'
import { AvatarGenerator } from '../../../utils/avatarGenerator'
// Sistema de mensajería eliminado
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
  UserCheck,
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
  nom?: string  // Ara és opcional
  cognom?: string  // Ara és opcional
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

// Generar usuaris mock amb avatars automàtics
const USUARIS_MOCK: PerfilUsuari[] = [
  {
    id: 'user-1',
    nick: '@tu_perfil',
    nom: 'Tu',  // L'usuari actual té nom
    cognom: 'Perfil',
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
    nom: 'Maria Santos', // Alguns usuaris decideixen mostrar el nom
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
    nick: '@jordi_dev',
    // No té nom/cognom - només nick
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
    nick: '@anna_public',
    // No té nom/cognom - només nick  
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
    nick: '@syndic_bcn',
    nom: 'Pere Vila', // Alguns usuaris decideixen mostrar el nom
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
  
  // Només el 30% dels usuaris decideixen mostrar el seu nom real
  const mostraNom = (i % 10) < 3
  
  USUARIS_MOCK.push({
    id: `user-${i}`,
    nick,
    // Només alguns usuaris tenen nom/cognom visible
    ...(mostraNom ? { nom: `${nom} ${cognom}` } : {}),
    // Els avatars es generaran automàticament basats en el nick
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
  const router = useRouter()
  const { enviarSolicitudConexion, esConectado, tieneSolicitudPendiente } = useConexiones()
  // Sistema de mensajería eliminado
  const [cerca, setCerca] = useState('')
  const [pestanyaActiva, setPestanyaActiva] = useState<'tots' | 'connexions' | 'sense-connexio'>('tots')
  const [vistaActiva, setVistaActiva] = useState<'grid' | 'llista'>('grid')
  const [filtreRol, setFiltreRol] = useState<string>('tots')
  const [filtreEstat, setFiltreEstat] = useState<string>('tots')
  const [filtreComunitat, setFiltreComunitat] = useState<string>('tots')
  const [ordenacio, setOrdenacio] = useState<'nom' | 'activitat' | 'registre' | 'connexions'>('activitat')

  // Funciones para manejar las acciones
  const handleConectar = async (usuari: PerfilUsuari) => {
    try {
      await enviarSolicitudConexion(usuari.id, 'general', `Hola ${usuari.nick}, m'agradaria connectar amb tu a La Pública.`)
      alert(`Sol·licitud de connexió enviada a ${usuari.nick}`)
    } catch (error) {
      console.error('Error al enviar sol·licitud:', error)
      alert('Error al enviar la sol·licitud de connexió')
    }
  }

  // Función de mensajería eliminada - sistema removido

  // Filtrar usuaris
  const usuarisFiltrats = useMemo(() => {
    let filtrats = [...USUARIS_MOCK]
    
    // Filtrar la pròpia targeta
    filtrats = filtrats.filter(usuari => usuari.id !== 'user-1')

    // Filtre per pestanya de connexions
    if (pestanyaActiva === 'connexions') {
      filtrats = filtrats.filter(usuari => esConectado(usuari.id))
    } else if (pestanyaActiva === 'sense-connexio') {
      filtrats = filtrats.filter(usuari => !esConectado(usuari.id) && !tieneSolicitudPendiente(usuari.id))
    }
    
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
  }, [cerca, pestanyaActiva, filtreRol, filtreEstat, filtreComunitat, ordenacio, esConectado, tieneSolicitudPendiente])

  // Funciones utilitarias movidas al componente TarjetaMiembro unificado

  const renderTargetaUsuari = (usuari: PerfilUsuari) => {
    const esYo = usuari.id === 'user-1'
    
    // Determinar estado de conexión
    let estadoConexion: 'conectado' | 'pendiente' | 'disponible' = 'disponible'
    if (esConectado(usuari.id)) {
      estadoConexion = 'conectado'
    } else if (tieneSolicitudPendiente(usuari.id)) {
      estadoConexion = 'pendiente'
    }

    // Mapear datos al formato del componente unificado
    const usuarioUnificado = {
      id: usuari.id,
      nombre: usuari.nom, // Pot ser undefined
      apellidos: usuari.cognom, // Pot ser undefined
      nick: usuari.nick,
      avatar: usuari.avatar || AvatarGenerator.generateDefaultAvatar(usuari.nick), // Generar avatar automàtic si no en té
      rol: usuari.rol,
      estado: usuari.estat === 'actiu' ? 'activo' as const : 'inactivo' as const,
      fechaRegistro: usuari.registrat,
      ultimaActividad: usuari.ultimaActivitat,
      posts: usuari.posts,
      conexiones: usuari.connexions,
      verificado: usuari.verificat
    }

    return (
      <TarjetaMiembro
        key={usuari.id}
        usuario={usuarioUnificado}
        layout={vistaActiva === 'grid' ? 'buddyboss' : 'horizontal'}
        estadoConexion={estadoConexion}
        esYo={esYo}
        onConectar={() => handleConectar(usuari)}
        onVerPerfil={() => router.push(esYo ? '/perfil' : `/perfil/${usuari.id}`)}
      />
    )
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Directori de Membres
          </h1>
          <p className="text-gray-600">
            Descobreix i connecta amb altres membres de la comunitat
          </p>
        </div>

        {/* Pestanyes de connexions */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setPestanyaActiva('tots')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    pestanyaActiva === 'tots'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Users size={16} className="inline mr-2" />
                  Tots ({USUARIS_MOCK.filter(u => u.id !== 'user-1').length})
                </button>
                
                <button
                  onClick={() => setPestanyaActiva('connexions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    pestanyaActiva === 'connexions'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserCheck size={16} className="inline mr-2" />
                  Connexions ({USUARIS_MOCK.filter(u => u.id !== 'user-1' && esConectado(u.id)).length})
                </button>
                
                <button
                  onClick={() => setPestanyaActiva('sense-connexio')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    pestanyaActiva === 'sense-connexio'
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserPlus size={16} className="inline mr-2" />
                  Sense connexió ({USUARIS_MOCK.filter(u => u.id !== 'user-1' && !esConectado(u.id) && !tieneSolicitudPendiente(u.id)).length})
                </button>
              </nav>

              {/* Toggle de vista */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVistaActiva('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    vistaActiva === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vista en graella"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setVistaActiva('llista')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    vistaActiva === 'llista'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vista en llista"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
          <div className={vistaActiva === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
            : "space-y-4"
          }>
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
      
      {/* Component global de missatges */}
      <MissatgesGlobal />
    </div>
  )
}