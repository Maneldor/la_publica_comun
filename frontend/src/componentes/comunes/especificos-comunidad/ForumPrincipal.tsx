'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ModalCategoriaForum from './ModalCategoriaForum'
import ModalCrearTema from './ModalCrearTema'
import { 
  MessageSquare,
  Pin,
  Lock,
  Users,
  Eye,
  MessageCircle,
  Clock,
  User,
  Search,
  Plus,
  Filter,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Shield,
  Crown
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
  },

  // Networking i Col·laboració
  {
    id: '6',
    title: 'Grup de treball: Ciutats Intel·ligents a Catalunya',
    description: 'Busquem professionals interessats en formar un grup de treball sobre Smart Cities...',
    author: 'Josep Fernàndez',
    category: 'Networking i Col·laboració',
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
  const [filteredTopics, setFilteredTopics] = useState(recentTopics)
  const [filteredCategories, setFilteredCategories] = useState(categories)
  const [modalCategory, setModalCategory] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false)
  const router = useRouter()

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Fa uns minuts'
    if (hours < 24) return `Fa ${hours}h`
    if (hours < 48) return 'Ahir'
    return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
  }

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
    
    // Filtrar categorías por búsqueda
    let filteredCats = categories
    if (searchTerm.trim()) {
      filteredCats = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredCategories(filteredCats)
  }, [searchTerm, selectedCategory, sortBy])

  const handleNewTopic = () => {
    setIsCreateTopicModalOpen(true)
  }

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    if (category) {
      setModalCategory(category)
      setIsModalOpen(true)
    }
  }

  const handleTopicClick = (topicId: string) => {
    // Navegar al tema específico
    router.push(`/forums/topic/${topicId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Fòrums de la Comunitat</h1>
              <p className="text-gray-600">Espai de debat i col·laboració per a professionals del sector públic</p>
            </div>
            <button 
              onClick={handleNewTopic}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nou tema
            </button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cercar en els fòrums..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => {
                  const value = e.target.value
                  if (value !== 'all') {
                    handleCategorySelect(value)
                  } else {
                    setSelectedCategory('all')
                  }
                }}
              >
                <option value="all">Totes les categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Més recents</option>
                <option value="popular">Més populars</option>
                <option value="replies">Més respostes</option>
              </select>
            </div>
          </div>

          {/* Filtros activos - Indicador visual */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <span>Filtres actius:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 rounded-md">
                    Cerca: "{searchTerm}"
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-blue-100 rounded-md">
                    Categoria: {categories.find(cat => cat.id === selectedCategory)?.name}
                  </span>
                )}
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="ml-auto text-blue-600 hover:text-blue-800 font-medium"
                >
                  Esborrar tots els filtres
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Categories</h2>
                <p className="text-gray-600">Explora els diferents temes de discussió</p>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredCategories.length === 0 && searchTerm ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No s'han trobat categories que coincideixin amb la cerca "{searchTerm}"</p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleCategorySelect(category.id)}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                {category.name}
                              </h3>
                              {category.isAdminOnly && (
                                <div className="flex items-center space-x-1">
                                  <div className="flex items-center justify-center w-5 h-5 bg-amber-100 rounded-full">
                                    <Crown size={12} className="text-amber-600" />
                                  </div>
                                  <span className="text-xs text-amber-600 font-medium px-2 py-0.5 bg-amber-50 rounded-full">
                                    Admin
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{category.topicCount} temes</span>
                              <span>{category.postCount} posts</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <p className="text-gray-600 mb-3 flex-1">{category.description}</p>
                            {category.isAdminOnly && (
                              <div className="flex items-center justify-center w-4 h-4 bg-red-100 rounded-full flex-shrink-0 mt-0.5">
                                <Shield size={10} className="text-red-600" />
                              </div>
                            )}
                          </div>
                          {category.lastPost && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MessageCircle size={14} className="mr-1" />
                              <span className="mr-2">Últim:</span>
                              <span className="font-medium text-gray-700">{category.lastPost.title}</span>
                              <span className="mx-2">per</span>
                              <span className="font-medium">{category.lastPost.author}</span>
                              <span className="mx-2">•</span>
                              <span>{formatDate(category.lastPost.date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Temes Recents</h2>
                <p className="text-gray-600">Les discussions més actives de la comunitat</p>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredTopics.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No s'han trobat temes que coincideixin amb els filtres aplicats.</p>
                    {searchTerm && (
                      <button 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('all')
                        }}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Esborrar filtres
                      </button>
                    )}
                  </div>
                ) : (
                  filteredTopics.map((topic) => (
                    <div key={topic.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleTopicClick(topic.id)}>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {topic.authorAvatar ? (
                            <img src={topic.authorAvatar} alt={topic.author} className="w-full h-full object-cover" />
                          ) : (
                            <User size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {topic.isPinned && (
                                <Pin size={16} className="text-blue-500" />
                              )}
                              {topic.isLocked && (
                                <Lock size={16} className="text-red-500" />
                              )}
                              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                                {topic.title}
                              </h3>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={20} />
                            </button>
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">{topic.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {topic.category}
                              </span>
                              <span>per {topic.author}</span>
                              <span>•</span>
                              <span>{formatDate(topic.lastActivity)}</span>
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
                            <div className="flex items-center mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
                                {topic.lastReplyAvatar ? (
                                  <img src={topic.lastReplyAvatar} alt={topic.lastReplyBy} className="w-full h-full object-cover" />
                                ) : (
                                  <User size={12} className="text-gray-400" />
                                )}
                              </div>
                              <span>Última resposta per {topic.lastReplyBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Forum Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadístiques del Fòrum</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temes totals</span>
                  <span className="font-semibold text-gray-900">128</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts totals</span>
                  <span className="font-semibold text-gray-900">658</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membres actius</span>
                  <span className="font-semibold text-gray-900">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nous aquest mes</span>
                  <span className="font-semibold text-blue-600">12</span>
                </div>
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membres Més Actius</h3>
              <div className="space-y-3">
                {[
                  { name: 'Maria Garcia', posts: 34, avatar: '/avatars/maria.jpg' },
                  { name: 'Joan Martinez', posts: 28, avatar: '/avatars/joan.jpg' },
                  { name: 'Anna López', posts: 23, avatar: '/avatars/anna.jpg' },
                  { name: 'Pere Rodríguez', posts: 19, avatar: '/avatars/pere.jpg' }
                ].map((member, index) => (
                  <div key={member.name} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={16} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.posts} posts</p>
                    </div>
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forum Rules */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Normes del Fòrum</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Respecta tots els membres de la comunitat
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Mantén les discussions constructives
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✓</span>
                  Utilitza un llenguatge professional
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">✗</span>
                  No publiquis contingut spam o promocional
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Modal Categoria Forum */}
      <ModalCategoriaForum 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={modalCategory}
        topics={recentTopics}
      />

      {/* Modal Crear Tema */}
      <ModalCrearTema 
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        categories={categories}
        userRole="admin-web" // TODO: Get from auth context
      />
    </div>
  )
}