'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ModalCategoriaForum from './ModalCategoriaForum'
import ModalCrearTema from './ModalCrearTema'
import { 
  MessageSquare,
  Pin,
  Lock,
  Eye,
  MessageCircle,
  Clock,
  Search,
  Plus,
  LayoutGrid,
  List,
  Hash
} from 'lucide-react'

interface ForumTopic {
  id: string
  title: string
  description: string
  author: string
  authorAvatar?: string
  category: string
  featuredImage: string
  isPinned: boolean
  isLocked: boolean
  replies: number
  views: number
  lastActivity: Date
  lastReplyBy: string
  lastReplyAvatar?: string
}

interface ForumCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  topicCount: number
  postCount: number
  isAdminOnly?: boolean
  allowedRoles?: string[]
  lastPost?: {
    title: string
    author: string
    date: Date
  }
}

// Datos mock
const categories: ForumCategory[] = [
  {
    id: '0',
    name: 'Informació i Anuncis de La Pública',
    description: 'Informació oficial i anuncis exclusius de la plataforma. Només per administradors.',
    icon: '🏛️',
    color: 'bg-indigo-600',
    topicCount: 3,
    postCount: 8,
    isAdminOnly: true,
    allowedRoles: ['admin-web', 'gestor-empreses'],
    lastPost: {
      title: 'Benvinguts a La Pública - Guia de la plataforma',
      author: 'Equip La Pública',
      date: new Date('2025-08-14T12:00:00')
    }
  },
  {
    id: '1',
    name: 'Anuncis Oficials',
    description: 'Comunicacions oficials de la comunitat',
    icon: '📢',
    color: 'bg-blue-500',
    topicCount: 5,
    postCount: 23,
    lastPost: {
      title: 'Actualització de la plataforma',
      author: 'Admin Catalunya',
      date: new Date('2025-08-14')
    }
  },
  {
    id: '2',
    name: 'Innovació i Transformació Digital',
    description: 'Debats sobre digitalització del sector públic',
    icon: '💡',
    color: 'bg-green-500',
    topicCount: 34,
    postCount: 187,
    lastPost: {
      title: 'Implementació d\'IA en administracions locals',
      author: 'Maria Garcia',
      date: new Date('2025-08-13')
    }
  },
  {
    id: '3',
    name: 'Networking i Col·laboració',
    description: 'Espai per connectar i col·laborar amb altres membres',
    icon: '🤝',
    color: 'bg-purple-500',
    topicCount: 28,
    postCount: 156,
    lastPost: {
      title: 'Grup de treball sobre sostenibilitat',
      author: 'Joan Martinez',
      date: new Date('2025-08-12')
    }
  },
  {
    id: '4',
    name: 'Recursos i Eines',
    description: 'Comparteix recursos útils per al sector públic',
    icon: '🛠️',
    color: 'bg-orange-500',
    topicCount: 19,
    postCount: 89,
    lastPost: {
      title: 'Guia d\'automatització de processos',
      author: 'Anna López',
      date: new Date('2025-08-11')
    }
  },
  {
    id: '5',
    name: 'Preguntes i Respostes',
    description: 'Resol dubtes i ajuda altres membres',
    icon: '❓',
    color: 'bg-red-500',
    topicCount: 42,
    postCount: 203,
    lastPost: {
      title: 'Com millorar l\'atenció ciutadana digital?',
      author: 'Pere Rodríguez',
      date: new Date('2025-08-10')
    }
  }
]

const recentTopics: ForumTopic[] = [
  // Informació i Anuncis de La Pública (Admin Only)
  {
    id: '0-1',
    title: 'Benvinguts a La Pública - Guia oficial de la plataforma',
    description: 'Descobreix tot el que necessites saber sobre La Pública: funcionalitats, normes de la comunitat, i com aprofitar al màxim la teva experiència...',
    author: 'Equip La Pública',
    authorAvatar: 'https://ui-avatars.com/api/?name=La+Publica&background=4338ca&color=fff',
    category: 'Informació i Anuncis de La Pública',
    featuredImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    isPinned: true,
    isLocked: false,
    replies: 3,
    views: 156,
    lastActivity: new Date('2025-08-14T12:00:00'),
    lastReplyBy: 'Admin Catalunya',
    lastReplyAvatar: '/avatars/admin.jpg'
  },
  {
    id: '0-2',
    title: 'Roadmap 2025: Noves funcionalitats planificades',
    description: 'Us presentem el roadmap de desenvolupament per aquest 2025 amb les noves funcionalitats que implementarem...',
    author: 'CTO La Pública',
    authorAvatar: 'https://ui-avatars.com/api/?name=CTO&background=4338ca&color=fff',
    category: 'Informació i Anuncis de La Pública',
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    isPinned: true,
    isLocked: false,
    replies: 2,
    views: 89,
    lastActivity: new Date('2025-08-13T18:30:00'),
    lastReplyBy: 'Product Manager',
  },
  {
    id: '0-3',
    title: 'Polítiques de privacitat i ús de dades actualitzades',
    description: 'Hem actualitzat les nostres polítiques de privacitat per complir amb les últimes normatives. Llegiu els canvis més importants...',
    author: 'Legal Team',
    authorAvatar: 'https://ui-avatars.com/api/?name=Legal&background=4338ca&color=fff',
    category: 'Informació i Anuncis de La Pública',
    featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: true,
    replies: 0,
    views: 234,
    lastActivity: new Date('2025-08-12T16:15:00'),
    lastReplyBy: '',
  },

  // Anuncis Oficials
  {
    id: '1',
    title: 'Actualització del sistema de gestió documental',
    description: 'Informem sobre les noves funcionalitats del sistema de gestió documental corporatiu...',
    author: 'Admin Catalunya',
    authorAvatar: '/avatars/admin.jpg',
    category: 'Anuncis Oficials',
    featuredImage: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&h=400&fit=crop',
    isPinned: true,
    isLocked: false,
    replies: 12,
    views: 245,
    lastActivity: new Date('2025-08-14T11:30:00'),
    lastReplyBy: 'Laura Martí',
    lastReplyAvatar: '/avatars/laura.jpg'
  },
  {
    id: '2',
    title: 'Nou protocol de seguretat informàtica',
    description: 'S\'ha aprovat el nou protocol de seguretat per a totes les administracions...',
    author: 'Secretaria General',
    category: 'Anuncis Oficials',
    featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
    isPinned: true,
    isLocked: true,
    replies: 5,
    views: 189,
    lastActivity: new Date('2025-08-14T09:15:00'),
    lastReplyBy: 'Carles Vidal',
  },

  // Innovació i Transformació Digital
  {
    id: '3',
    title: 'Nova normativa sobre protecció de dades en administracions públiques',
    description: 'Discussió sobre els canvis recents en la normativa RGPD aplicada al sector públic...',
    author: 'Maria Garcia',
    authorAvatar: '/avatars/maria.jpg',
    category: 'Innovació i Transformació Digital',
    isPinned: false,
    isLocked: false,
    replies: 23,
    views: 156,
    lastActivity: new Date('2025-08-14T10:30:00'),
    lastReplyBy: 'Joan Martinez',
    lastReplyAvatar: '/avatars/joan.jpg'
  },
  {
    id: '4',
    title: 'IA aplicada a l\'atenció ciutadana',
    description: 'Com podem integrar intel·ligència artificial per millorar els serveis ciutadans...',
    author: 'Núria Pérez',
    category: 'Innovació i Transformació Digital',
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 45,
    views: 298,
    lastActivity: new Date('2025-08-13T16:20:00'),
    lastReplyBy: 'Albert Roca',
  },
  {
    id: '5',
    title: 'Blockchain en la gestió pública',
    description: 'Debat sobre l\'ús de blockchain per garantir transparència en els processos administratius...',
    author: 'Jordi Pons',
    category: 'Innovació i Transformació Digital',
    featuredImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 18,
    views: 134,
    lastActivity: new Date('2025-08-12T14:45:00'),
    lastReplyBy: 'Sandra Vila',
  },

  // Networking i Col·laboració
  {
    id: '6',
    title: 'Grup de treball: Ciutats Intel·ligents a Catalunya',
    description: 'Busquem professionals interessats en formar un grup de treball sobre Smart Cities...',
    author: 'Josep Fernàndez',
    category: 'Networking i Col·laboració',
    featuredImage: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 31,
    views: 187,
    lastActivity: new Date('2025-08-13T09:15:00'),
    lastReplyBy: 'Marta Soler',
  },
  {
    id: '7',
    title: 'Col·laboració entre ajuntaments per projectes de sostenibilitat',
    description: 'Proposta de crear una xarxa de col·laboració per compartir bones pràctiques...',
    author: 'Elena Rius',
    category: 'Networking i Col·laboració',
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 27,
    views: 203,
    lastActivity: new Date('2025-08-13T13:30:00'),
    lastReplyBy: 'Marc Torres',
  },
  {
    id: '8',
    title: 'Trobada anual de professionals del sector públic',
    description: 'Organització de la trobada anual per facilitar el networking entre professionals...',
    author: 'Associació Professional',
    category: 'Networking i Col·laboració',
    featuredImage: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 56,
    views: 412,
    lastActivity: new Date('2025-08-11T18:45:00'),
    lastReplyBy: 'Cristina Molina',
  },

  // Recursos i Eines
  {
    id: '9',
    title: 'Experiències amb la implementació de tràmits digitals',
    description: 'Compartiu les vostres experiències amb la digitalització de tràmits...',
    author: 'Anna López',
    category: 'Recursos i Eines',
    featuredImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 18,
    views: 94,
    lastActivity: new Date('2025-08-13T15:45:00'),
    lastReplyBy: 'Pere Rodríguez',
  },
  {
    id: '10',
    title: 'Eines de col·laboració remota per a equips públics',
    description: 'Recomanacions d\'eines per facilitar el treball en equip a distància...',
    author: 'Tech Team',
    category: 'Recursos i Eines',
    featuredImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 34,
    views: 276,
    lastActivity: new Date('2025-08-12T11:20:00'),
    lastReplyBy: 'Raquel Camps',
  },
  {
    id: '11',
    title: 'Plataformes de formació online per funcionaris',
    description: 'Comparació de diferents plataformes per a la formació continuada del personal...',
    author: 'Formació RRHH',
    category: 'Recursos i Eines',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 22,
    views: 167,
    lastActivity: new Date('2025-08-10T16:30:00'),
    lastReplyBy: 'David Serrano',
  },

  // Preguntes i Respostes
  {
    id: '12',
    title: 'Com millorar l\'atenció ciutadana digital?',
    description: 'Cerco consells per optimitzar els canals digitals d\'atenció als ciutadans...',
    author: 'Pere Rodríguez',
    category: 'Preguntes i Respostes',
    featuredImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 41,
    views: 289,
    lastActivity: new Date('2025-08-14T08:15:00'),
    lastReplyBy: 'Sílvia Navarro',
  },
  {
    id: '13',
    title: 'Procediment per implementar firma electrònica',
    description: 'Quins són els passos necessaris per implementar la firma electrònica en els nostres processos?',
    author: 'Miquel Rosell',
    category: 'Preguntes i Respostes',
    featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 15,
    views: 128,
    lastActivity: new Date('2025-08-13T12:45:00'),
    lastReplyBy: 'Legal Team',
  },
  {
    id: '14',
    title: 'Dubtes sobre la nova llei de transparència',
    description: 'Necessito aclarir alguns aspectes de la implementació de la llei de transparència...',
    author: 'Carmen Ruiz',
    category: 'Preguntes i Respostes',
    featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    isPinned: false,
    isLocked: false,
    replies: 8,
    views: 67,
    lastActivity: new Date('2025-08-11T10:30:00'),
    lastReplyBy: 'Expert Legal',
  }
]

export default function ForumPrincipal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredTopics, setFilteredTopics] = useState(recentTopics)
  const [modalCategory, setModalCategory] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false)
  const router = useRouter()

  // Ejecutar filtrado cuando cambien los valores
  useEffect(() => {
    let filtered = recentTopics
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name
      if (categoryName) {
        filtered = filtered.filter(topic => topic.category === categoryName)
      }
    }
    
    // Ordenar
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views + b.replies) - (a.views + a.replies))
        break
      case 'replies':
        filtered = [...filtered].sort((a, b) => b.replies - a.replies)
        break
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
        break
    }
    
    setFilteredTopics(filtered)
  }, [searchTerm, selectedCategory, sortBy])

  const handleNewTopic = () => {
    setIsCreateTopicModalOpen(true)
  }


  const handleTopicClick = (topicId: string) => {
    // Navegar al tema específico
    router.push(`/forums/topic/${topicId}`)
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Fòrums de la Comunitat</h1>
              <p className="text-gray-600">Espai de debat i col·laboració per a professionals del sector públic</p>
            </div>
            <button 
              onClick={handleNewTopic}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} className="mr-2" />
              Nou tema
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Hash size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  <p className="text-sm text-gray-500">Categories</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{recentTopics.length}</p>
                  <p className="text-sm text-gray-500">Temes actius</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentTopics.reduce((acc, topic) => acc + topic.replies, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Respostes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentTopics.reduce((acc, topic) => acc + topic.views, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Visualitzacions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cercar temes en els fòrums..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Totes les categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Més recents</option>
                  <option value="popular">Més populars</option>
                  <option value="replies">Més respostes</option>
                </select>

                {/* Toggle vista */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Vista en graella"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Vista en llista"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{filteredTopics.length} temes trobats</span>
              {(searchTerm || selectedCategory !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Netejar filtres
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Lista de temas */}
        {filteredTopics.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
              : 'space-y-4'
          }`}>
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} viewMode={viewMode} onClick={() => handleTopicClick(topic.id)} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-12 text-center">
            <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No s'han trobat temes
            </h3>
            <p className="text-gray-600">
              Prova ajustant els filtres de cerca o crea un nou tema
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
      {isModalOpen && modalCategory && (
        <ModalCategoriaForum 
          category={modalCategory}
          topics={filteredTopics.filter(t => t.category === modalCategory.name)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateTopicModalOpen && (
        <ModalCrearTema 
          isOpen={isCreateTopicModalOpen}
          onClose={() => setIsCreateTopicModalOpen(false)}
          categories={categories}
          userRole="EMPLEADO_PUBLICO"
        />
      )}
    </div>
  )
}

// Componente TopicCard para mostrar cada tema
interface TopicCardProps {
  topic: ForumTopic
  viewMode: 'grid' | 'list'
  onClick: () => void
}

function TopicCard({ topic, viewMode, onClick }: TopicCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Fa uns minuts'
    if (hours < 24) return `Fa ${hours}h`
    if (hours < 48) return 'Ahir'
    return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
  }

  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0">
            <img 
              src={topic.featuredImage} 
              alt={topic.title}
              className="w-full h-full object-cover"
            />
            {topic.isPinned && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Pin size={12} className="mr-1" />
                Destacat
              </div>
            )}
            {topic.isLocked && (
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                <Lock size={12} className="mr-1" />
                Tancat
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {topic.category}
              </span>
              <time className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                {formatDate(topic.lastActivity)}
              </time>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {topic.title}
            </h3>
            
            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
              {topic.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={topic.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.author)}&background=4338ca&color=fff`} 
                  alt={topic.author}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{topic.author}</p>
                  <p className="text-xs text-gray-500">Membre actiu</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {topic.views}
                </div>
                <div className="flex items-center">
                  <MessageCircle size={14} className="mr-1" />
                  {topic.replies}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="relative">
        <img 
          src={topic.featuredImage} 
          alt={topic.title}
          className="w-full h-48 object-cover"
        />
        {topic.isPinned && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Pin size={12} className="mr-1" />
            Destacat
          </div>
        )}
        {topic.isLocked && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs flex items-center">
            <Lock size={12} className="mr-1" />
            Tancat
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {topic.category}
          </span>
          <time className="text-sm text-gray-500 flex items-center">
            <Clock size={14} className="mr-1" />
            {formatDate(topic.lastActivity)}
          </time>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {topic.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {topic.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img 
              src={topic.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topic.author)}&background=4338ca&color=fff`} 
              alt={topic.author}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{topic.author}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              {topic.views}
            </div>
            <div className="flex items-center">
              <MessageCircle size={12} className="mr-1" />
              {topic.replies}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
