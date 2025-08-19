'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  User,
  Calendar,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Heart,
  MoreHorizontal,
  Tag
} from 'lucide-react'

interface ForumTopic {
  id: string
  title: string
  description: string
  author: string
  authorAvatar?: string
  category: string
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
  lastPost?: {
    title: string
    author: string
    date: Date
  }
}

interface CategoriaForumPageProps {
  categoriaId: string
}

// Mock data - importar desde ForumPrincipal en una app real
const categories: ForumCategory[] = [
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
  // Anuncis Oficials
  {
    id: '1',
    title: 'Actualització del sistema de gestió documental',
    description: 'Informem sobre les noves funcionalitats del sistema de gestió documental corporatiu...',
    author: 'Admin Catalunya',
    authorAvatar: '/avatars/admin.jpg',
    category: 'Anuncis Oficials',
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
    isPinned: false,
    isLocked: false,
    replies: 18,
    views: 134,
    lastActivity: new Date('2025-08-12T14:45:00'),
    lastReplyBy: 'Sandra Vila',
  }
]

export default function CategoriaForumPage({ categoriaId }: CategoriaForumPageProps) {
  const [category, setCategory] = useState<ForumCategory | null>(null)
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([])
  const router = useRouter()

  useEffect(() => {
    const foundCategory = categories.find(cat => cat.id === categoriaId)
    if (foundCategory) {
      setCategory(foundCategory)
      const categoryTopics = recentTopics.filter(topic => topic.category === foundCategory.name)
      setTopics(categoryTopics)
      setFilteredTopics(categoryTopics)
    }
  }, [categoriaId])

  useEffect(() => {
    let filtered = topics
    
    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = topics.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
  }, [searchTerm, sortBy, topics])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) return 'Fa uns minuts'
    if (hours < 24) return `Fa ${hours}h`
    if (days < 7) return `Fa ${days} dies`
    return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/forums/topic/${topicId}`)
  }

  const handleNewTopic = () => {
    alert(`Crear nou tema a la categoria: ${category?.name}`)
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Categoria no trobada</h2>
          <p className="text-gray-600 mb-6">La categoria que cerques no existeix.</p>
          <button 
            onClick={() => router.push('/forums')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Tornar als fòrums
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header amb banner de categoria */}
      <div className={`${category.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => router.push('/forums')}
            className="inline-flex items-center text-white/80 hover:text-white font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Tornar als fòrums
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl">
                {category.icon}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">{category.name}</h1>
                <p className="text-xl text-white/90 mb-4 max-w-2xl leading-relaxed">{category.description}</p>
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <MessageCircle size={18} />
                    <span className="font-medium">{category.topicCount} temes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye size={18} />
                    <span className="font-medium">{category.postCount} posts</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleNewTopic}
              className="bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-white/90 transition-colors font-medium shadow-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Nou tema
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Cercar en ${category.name}...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Més recents</option>
                  <option value="popular">Més populars</option>
                  <option value="replies">Més respostes</option>
                </select>
              </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
              {filteredTopics.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  {searchTerm ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Cap resultat</h3>
                      <p className="text-gray-600 mb-6">No s'han trobat temes que coincideixin amb "{searchTerm}"</p>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Esborrar cerca
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Cap tema encara</h3>
                      <p className="text-gray-600 mb-6">Sigues el primer en crear un tema en aquesta categoria.</p>
                      <button 
                        onClick={handleNewTopic}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
                      >
                        <Plus size={20} className="mr-2" />
                        Crear primer tema
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {filteredTopics.length} {filteredTopics.length === 1 ? 'tema' : 'temes'}
                      {searchTerm && (
                        <span className="text-gray-500 font-normal"> per "{searchTerm}"</span>
                      )}
                    </h2>
                  </div>

                  {filteredTopics.map((topic, index) => (
                    <div 
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              {topic.isPinned && (
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                                  <Pin size={12} className="text-blue-600" />
                                </div>
                              )}
                              {topic.isLocked && (
                                <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                                  <Lock size={12} className="text-red-600" />
                                </div>
                              )}
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {topic.title}
                              </h3>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {topic.authorAvatar ? (
                                      <img src={topic.authorAvatar} alt={topic.author} className="w-full h-full object-cover" />
                                    ) : (
                                      <User size={14} className="text-gray-500" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{topic.author}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar size={14} className="mr-1" />
                                  {formatDate(topic.lastActivity)}
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
                            
                            {topic.lastReplyBy && (
                              <div className="flex items-center mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
                                  {topic.lastReplyAvatar ? (
                                    <img src={topic.lastReplyAvatar} alt={topic.lastReplyBy} className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={12} className="text-gray-400" />
                                  )}
                                </div>
                                <span>Última resposta per <span className="font-medium">{topic.lastReplyBy}</span></span>
                              </div>
                            )}
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              // Menú de opciones
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Category Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadístiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temes totals</span>
                  <span className="text-lg font-bold text-gray-900">{category.topicCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts totals</span>
                  <span className="text-lg font-bold text-gray-900">{category.postCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temes aquesta setmana</span>
                  <span className="text-lg font-bold text-green-600">+{Math.floor(category.topicCount * 0.1)}</span>
                </div>
              </div>
            </div>

            {/* Moderators */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderadors</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Admin+Catalunya&background=3b82f6&color=fff" 
                    alt="Admin Catalunya" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Admin Catalunya</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Maria+Garcia&background=10b981&color=fff" 
                    alt="Maria Garcia" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Maria Garcia</p>
                    <p className="text-xs text-gray-500">Moderadora</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forum Rules */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Normes de la categoria</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Mantén els temes relacionats amb la categoria
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Utilitza títols descriptius i clars
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Cerca abans de crear un tema nou
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✗</span>
                  No dupliquis temes existents
                </li>
              </ul>
            </div>

            {/* Related Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories relacionades</h3>
              <div className="space-y-3">
                {categories
                  .filter(cat => cat.id !== category.id)
                  .slice(0, 3)
                  .map(relatedCat => (
                  <a 
                    key={relatedCat.id}
                    href={`/forums/categoria/${relatedCat.id}`}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${relatedCat.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                      {relatedCat.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {relatedCat.name}
                      </h4>
                      <p className="text-xs text-gray-500">{relatedCat.topicCount} temes</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}