'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  MessageCircle,
  UserPlus,
  Settings,
  Shield,
  Crown,
  Star,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Award,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react'
import { PerfilUsuari, aplicarPrivacitat } from '../../../../tipos/perfil'
import { useUsuario } from '../../../contextos/UsuarioContext'
import { useRouter } from 'next/navigation'

// Mock data per usuaris que no tenen dades
const PERFIL_MOCK: PerfilUsuari = {
  id: 'user-1',
  nick: '@tu_perfil',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  dataRegistre: new Date('2024-01-15'),
  ultimaActivitat: new Date(),
  estat: 'actiu',
  verificat: true,
  
  nom: 'Joan',
  cognoms: 'García Martín',
  email: 'joan.garcia@ajuntament.cat',
  telefon: '+34 600 123 456',
  
  organitzacio: 'Ajuntament de Barcelona',
  carrec: 'Tècnic en Innovació Tecnològica',
  departament: 'Àrea de Tecnologia i Transformació Digital',
  ubicacioTreball: 'Barcelona, Catalunya',
  
  biografiaBrevu: 'Funcionari públic apassionat per la innovació tecnològica',
  biografiaCompleta: 'Tècnic especialitzat en transformació digital del sector públic amb més de 8 anys d\'experiència. M\'interessa especialment la implementació de solucions tecnològiques que millorin els serveis als ciutadans i l\'eficiència de l\'administració pública.',
  interessos: ['Tecnologia', 'Innovació', 'Sostenibilitat', 'Participació Ciutadana'],
  habilitats: ['JavaScript', 'React', 'Node.js', 'Gestió de Projectes', 'Anàlisi de Dades'],
  idiomes: ['Català', 'Castellà', 'Anglès'],
  
  provincia: 'Barcelona',
  ciutat: 'Barcelona',
  codiPostal: '08001',
  
  enllaçosExterns: [
    {
      id: '1',
      tipus: 'linkedin',
      url: 'https://linkedin.com/in/joan-garcia',
      etiqueta: 'LinkedIn Professional',
      public: true
    },
    {
      id: '2',
      tipus: 'github',
      url: 'https://github.com/joangarcia',
      etiqueta: 'Projectes Open Source',
      public: true
    }
  ],
  
  configuracioPrivacitat: {
    nom: 'public',
    cognoms: 'public',
    email: 'nomes_admin',
    telefon: 'privat',
    organitzacio: 'public',
    carrec: 'public',
    departament: 'public',
    ubicacioTreball: 'public',
    biografiaCompleta: 'public',
    provincia: 'public',
    ciutat: 'public',
    codiPostal: 'privat',
    enllaçosExterns: 'public'
  },
  
  estadistiques: {
    postsCreats: 23,
    comentaris: 156,
    connexionsTotal: 45,
    grupsParticipa: 5,
    reputacio: 85,
    badges: [
      {
        id: '1',
        nom: 'Innovador',
        descripció: 'Ha contribuït amb idees innovadores',
        icona: '💡',
        color: 'yellow',
        dataObtinguda: new Date('2024-03-15')
      },
      {
        id: '2',
        nom: 'Connector',
        descripció: 'Ha establert moltes connexions valuoses',
        icona: '🤝',
        color: 'blue',
        dataObtinguda: new Date('2024-05-20')
      }
    ]
  },
  
  activitatRecent: [
    {
      id: '1',
      tipus: 'post',
      descripció: 'Ha publicat sobre transformació digital',
      data: new Date(Date.now() - 1000 * 60 * 60 * 2),
      enllaç: '/posts/123'
    },
    {
      id: '2',
      tipus: 'unir_grup',
      descripció: 'S\'ha unit al grup "Amants dels Gossos"',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24),
      enllaç: '/grupos-avanzados'
    },
    {
      id: '3',
      tipus: 'connexio',
      descripció: 'S\'ha connectat amb Maria Santos',
      data: new Date(Date.now() - 1000 * 60 * 60 * 48)
    }
  ],
  
  grupsPublics: [
    {
      id: 'grup-1',
      nom: 'Funcionaris d\'Educació',
      avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
      rol: 'embaixador',
      dataUnio: new Date('2024-02-01'),
      tipus: 'públic',
      grupPare: null
    },
    {
      id: 'grup-2',
      nom: 'Amants dels Gossos',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
      rol: 'membre',
      dataUnio: new Date('2024-07-15'),
      tipus: 'públic',
      grupPare: null
    },
    {
      id: 'subgrup-1',
      nom: 'Subgrup Educació Primària',
      avatar: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
      rol: 'membre',
      dataUnio: new Date('2024-03-10'),
      tipus: 'públic',
      grupPare: 'grup-1'
    }
  ]
  // NOTA: Els subgrups de grups privats/professionals/ocults NO apareixen aquí
  // per respectar la privacitat de l'usuari
}

interface PerfilPublicProps {
  usuariId: string
}

export default function PerfilPublic({ usuariId }: PerfilPublicProps) {
  const [perfil, setPerfil] = useState<PerfilUsuari | null>(null)
  const [esPropiPerfil, setEsPropiPerfil] = useState(false)
  const [esAdmin, setEsAdmin] = useState(false) // TODO: obtenir del context d'auth
  const [pestañaActiva, setPestañaActiva] = useState<'informacio' | 'activitat' | 'grups'>('informacio')
  const { usuario, cargarUsuario } = useUsuario()
  const router = useRouter()

  useEffect(() => {
    const cargarPerfilUsuario = async () => {
      try {
        const esPropi = usuariId === 'user-1' || usuariId === usuario?.id
        setEsPropiPerfil(esPropi)
        
        let datosUsuario = null
        
        // Si es el perfil propio, usar los datos del contexto
        if (esPropi && usuario) {
          datosUsuario = usuario
        } else {
          // Si es otro usuario, cargar sus datos
          datosUsuario = await cargarUsuario(usuariId)
        }
        
        if (datosUsuario) {
          // Convertir DatosUsuario a PerfilUsuari
          const perfilConvertido: PerfilUsuari = {
            id: datosUsuario.id,
            nick: datosUsuario.nick || `@usuario_${datosUsuario.id}`,
            avatar: datosUsuario.fotoPerfil,
            dataRegistre: new Date(datosUsuario.fechaRegistro || '2024-01-15'),
            ultimaActivitat: new Date(),
            estat: 'actiu',
            verificat: true,
            
            nom: datosUsuario.nombre?.valor || datosUsuario.nombre || '',
            cognoms: datosUsuario.apellidos?.valor || datosUsuario.apellidos || '',
            email: datosUsuario.email,
            telefon: datosUsuario.telefono?.valor || datosUsuario.telefono || '',
            
            organitzacio: datosUsuario.organizacion?.valor || datosUsuario.organizacion || 'Ajuntament de Barcelona',
            carrec: datosUsuario.cargo?.valor || datosUsuario.cargo || 'Funcionari Públic',
            departament: datosUsuario.departamento?.valor || datosUsuario.departamento || 'Administració',
            ubicacioTreball: `${datosUsuario.provincia?.valor || datosUsuario.provincia || 'Barcelona'}, Catalunya`,
            
            biografiaBrevu: datosUsuario.biografia?.valor || datosUsuario.biografia || 'Funcionari públic',
            biografiaCompleta: datosUsuario.biografia?.valor || datosUsuario.biografia || 'Funcionari públic de l\'administració catalana.',
            interessos: datosUsuario.intereses || ['Tecnologia', 'Innovació', 'Sostenibilitat'],
            habilitats: datosUsuario.habilidades || ['Gestió', 'Administració', 'Atenció al ciutadà'],
            idiomes: datosUsuario.idiomas || ['Català', 'Castellà'],
            
            provincia: datosUsuario.provincia?.valor || datosUsuario.provincia || 'Barcelona',
            ciutat: datosUsuario.ciudad?.valor || datosUsuario.ciudad || 'Barcelona',
            codiPostal: datosUsuario.codigoPostal?.valor || datosUsuario.codigoPostal || '08001',
            
            enllaçosExterns: [],
            
            configuracioPrivacitat: {
              nom: 'public',
              cognoms: 'public',
              email: esPropi ? 'public' : 'nomes_admin',
              telefon: 'privat',
              organitzacio: 'public',
              carrec: 'public',
              departament: 'public',
              ubicacioTreball: 'public',
              biografiaCompleta: 'public',
              provincia: 'public',
              ciutat: 'public',
              codiPostal: 'privat',
              enllaçosExterns: 'public'
            },
            
            estadistiques: {
              postsCreats: Math.floor(Math.random() * 100),
              comentaris: Math.floor(Math.random() * 300),
              connexionsTotal: Math.floor(Math.random() * 100),
              grupsParticipa: Math.floor(Math.random() * 10),
              reputacio: Math.floor(Math.random() * 100),
              badges: []
            },
            
            activitatRecent: [],
            grupsPublics: []
          }
          
          // Aplicar configuració de privacitat
          const perfilVisible = aplicarPrivacitat(perfilConvertido, esPropi, esAdmin)
          setPerfil(perfilVisible)
        }
      } catch (error) {
        console.error('Error carregant perfil:', error)
        // En cas d'error, usar dades mock
        const perfilVisible = aplicarPrivacitat(PERFIL_MOCK, usuariId === 'user-1', esAdmin)
        setPerfil(perfilVisible)
      }
    }
    
    cargarPerfilUsuario()
  }, [usuariId, esAdmin, usuario, cargarUsuario])

  if (!perfil) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregant perfil...</p>
        </div>
      </div>
    )
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

  const obtenerIconoRol = (rol: string) => {
    switch (rol) {
      case 'embaixador':
        return <Crown size={14} className="text-purple-500" />
      case 'administrador':
        return <Shield size={14} className="text-blue-500" />
      case 'moderador':
        return <Star size={14} className="text-yellow-500" />
      default:
        return null
    }
  }

  const obtenerIconoExtern = (tipus: string) => {
    switch (tipus) {
      case 'linkedin':
        return <Linkedin size={16} className="text-blue-600" />
      case 'github':
        return <Github size={16} className="text-gray-800" />
      case 'twitter':
        return <Twitter size={16} className="text-blue-400" />
      case 'instagram':
        return <Instagram size={16} className="text-pink-500" />
      case 'website':
        return <Globe size={16} className="text-gray-600" />
      default:
        return <ExternalLink size={16} className="text-gray-600" />
    }
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header del perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          {/* Portada */}
          <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            {/* Botó d'editar si és el propi perfil */}
            {esPropiPerfil && (
              <button 
                onClick={() => router.push('/perfil/editar')}
                className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all"
              >
                <Settings size={16} />
                <span>Editar perfil</span>
              </button>
            )}
          </div>
          
          {/* Informació principal */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 mb-6">
              
              {/* Avatar i info bàsica */}
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-4 md:mb-0">
                <div className="relative mb-4 md:mb-0">
                  {perfil.avatar ? (
                    <img 
                      src={perfil.avatar} 
                      alt={perfil.nick}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-3xl">
                        {perfil.nick.charAt(1)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  
                  {/* Indicador d'estat */}
                  {perfil.estat === 'actiu' && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-400 border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Verificat */}
                  {perfil.verificat && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 border-4 border-white rounded-full flex items-center justify-center">
                      <Shield size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="pb-2 min-w-0 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {perfil.nick}
                    {esPropiPerfil && <span className="text-lg text-gray-500 ml-2">(Tu perfil)</span>}
                  </h1>
                  
                  {(perfil.nom || perfil.cognoms) && (
                    <p className="text-lg md:text-xl text-gray-600 mb-2">
                      {perfil.nom} {perfil.cognoms}
                    </p>
                  )}
                  
                  {perfil.biografiaBrevu && (
                    <p className="text-gray-600 mb-3 mt-8 md:mt-6 md:ml-4">{perfil.biografiaBrevu}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    {perfil.organitzacio && (
                      <div className="flex items-center space-x-1">
                        <Briefcase size={14} />
                        <span>{perfil.organitzacio}</span>
                      </div>
                    )}
                    {perfil.ciutat && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{perfil.ciutat}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Registrat {formatearDataRelativa(perfil.dataRegistre)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botons d'acció */}
              {!esPropiPerfil && (
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <UserPlus size={16} />
                    <span>Connectar</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle size={16} />
                    <span>Missatge</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Estadístiques */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{perfil.estadistiques.postsCreats}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{perfil.estadistiques.connexionsTotal}</div>
                <div className="text-sm text-gray-600">Connexions</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{perfil.estadistiques.grupsParticipa}</div>
                <div className="text-sm text-gray-600">Grups</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{perfil.estadistiques.reputacio}</div>
                <div className="text-sm text-gray-600">Reputació</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{perfil.estadistiques.badges.length}</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navegació de pestanyes */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setPestañaActiva('informacio')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                pestañaActiva === 'informacio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Informació
            </button>
            <button
              onClick={() => setPestañaActiva('activitat')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                pestañaActiva === 'activitat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Activitat
            </button>
            <button
              onClick={() => setPestañaActiva('grups')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                pestañaActiva === 'grups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Grups ({perfil.grupsPublics.length})
            </button>
          </div>
          
          {/* Contingut de les pestanyes */}
          <div className="p-6">
            {pestañaActiva === 'informacio' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Informació professional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informació Professional</h3>
                  
                  {perfil.carrec && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Càrrec</dt>
                      <dd className="text-sm text-gray-900">{perfil.carrec}</dd>
                    </div>
                  )}
                  
                  {perfil.departament && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Departament</dt>
                      <dd className="text-sm text-gray-900">{perfil.departament}</dd>
                    </div>
                  )}
                  
                  {perfil.ubicacioTreball && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ubicació</dt>
                      <dd className="text-sm text-gray-900">{perfil.ubicacioTreball}</dd>
                    </div>
                  )}
                  
                  {perfil.habilitats.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">Habilitats</dt>
                      <dd className="flex flex-wrap gap-2">
                        {perfil.habilitats.map((habilitat, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {habilitat}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
                
                {/* Informació personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informació Personal</h3>
                  
                  {perfil.biografia && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Biografia</dt>
                      <dd className="text-sm text-gray-900">{perfil.biografiaCompleta}</dd>
                    </div>
                  )}
                  
                  {perfil.interessos.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">Interessos</dt>
                      <dd className="flex flex-wrap gap-2">
                        {perfil.interessos.map((interes, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {interes}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  
                  {perfil.idiomes.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">Idiomes</dt>
                      <dd className="flex flex-wrap gap-2">
                        {perfil.idiomes.map((idioma, index) => (
                          <span key={index} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {idioma}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  
                  {perfil.enllaçosExterns.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500 mb-2">Enllaços</dt>
                      <dd className="space-y-2">
                        {perfil.enllaçosExterns.map((enllac) => (
                          <a
                            key={enllac.id}
                            href={enllac.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {obtenerIconoExtern(enllac.tipus)}
                            <span>{enllac.etiqueta || enllac.url}</span>
                            <ExternalLink size={12} />
                          </a>
                        ))}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {pestañaActiva === 'activitat' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activitat Recent</h3>
                {perfil.activitatRecent.map((activitat) => (
                  <div key={activitat.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Activity size={16} className="text-blue-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activitat.descripció}</p>
                      <p className="text-xs text-gray-500">{formatearDataRelativa(activitat.data)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {pestañaActiva === 'grups' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grups Públics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {perfil.grupsPublics.map((grup) => (
                    <div key={grup.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      {grup.avatar ? (
                        <img 
                          src={grup.avatar} 
                          alt={grup.nom}
                          className="w-12 h-12 rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                          <Users size={20} className="text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{grup.nom}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          {obtenerIconoRol(grup.rol)}
                          <span className="capitalize">{grup.rol}</span>
                          <span>•</span>
                          <span>Unit {formatearDataRelativa(grup.dataUnio)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Badges */}
        {perfil.estadistiques.badges.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges Obtinguts</h3>
            <div className="flex flex-wrap gap-4">
              {perfil.estadistiques.badges.map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{badge.icona}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{badge.nom}</h4>
                    <p className="text-sm text-gray-600">{badge.descripció}</p>
                    <p className="text-xs text-gray-500">{formatearDataRelativa(badge.dataObtinguda)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}