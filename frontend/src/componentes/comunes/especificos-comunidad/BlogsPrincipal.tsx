'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import ModalCrearBlog from './ModalCrearBlog'
import { 
  LayoutGrid,
  List,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Eye,
  MessageCircle,
  Clock,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  Plus,
  Settings
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar: string
  authorRole: string
  category: string
  tags: string[]
  featuredImage: string
  publishedAt: Date
  views: number
  likes: number
  comments: number
  readTime: number
  isPublished: boolean
  isFeatured: boolean
}

interface BlogCategory {
  id: string
  name: string
  count: number
  color: string
}

// Categories comunes per a blogs
const blogCategories: BlogCategory[] = [
  { id: 'tecnologia', name: 'Tecnologia', count: 24, color: 'bg-blue-500' },
  { id: 'viatges', name: 'Viatges', count: 18, color: 'bg-green-500' },
  { id: 'esports', name: 'Esports', count: 15, color: 'bg-red-500' },
  { id: 'cultura', name: 'Cultura', count: 12, color: 'bg-purple-500' },
  { id: 'salut', name: 'Salut i Benestar', count: 16, color: 'bg-emerald-500' },
  { id: 'gastronomia', name: 'Gastronomia', count: 14, color: 'bg-orange-500' },
  { id: 'educacio', name: 'Educació', count: 11, color: 'bg-indigo-500' },
  { id: 'entreteniment', name: 'Entreteniment', count: 9, color: 'bg-pink-500' },
  { id: 'negocis', name: 'Negocis', count: 13, color: 'bg-gray-600' },
  { id: 'estil-vida', name: 'Estil de Vida', count: 10, color: 'bg-yellow-500' }
]

const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Les millors apps de viatge per al 2025',
    excerpt: 'Descobreix les aplicacions mòbils més útils per planificar i gaudir dels teus viatges aquest any.',
    content: 'Viatjar s\'ha tornat molt més fàcil gràcies a la tecnologia...',
    author: 'Maria Rodríguez',
    authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=10b981&color=fff',
    authorRole: 'Travel Blogger',
    category: 'Viatges',
    tags: ['viatges', 'apps', 'tecnologia', 'turisme'],
    featuredImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-14'),
    views: 1247,
    likes: 89,
    comments: 23,
    readTime: 8,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Intel·ligència Artificial: revolució o evolució?',
    excerpt: 'Anàlisi de com la IA està canviant el món tal com el coneixem i què podem esperar del futur.',
    content: 'La intel·ligència artificial ha deixat de ser ciència ficció...',
    author: 'Jordi Tech',
    authorAvatar: 'https://ui-avatars.com/api/?name=Jordi+Tech&background=3b82f6&color=fff',
    authorRole: 'Analista Tecnològic',
    category: 'Tecnologia',
    tags: ['ia', 'tecnologia', 'futur', 'innovació'],
    featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-13'),
    views: 2156,
    likes: 167,
    comments: 45,
    readTime: 12,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '3',
    title: 'El Barça i la nova era post-Messi',
    excerpt: 'Com el FC Barcelona s\'ha reinventat després de l\'era Messi i quins són els seus objectius per aquesta temporada.',
    content: 'Des de la sortida de Lionel Messi, el FC Barcelona...',
    author: 'Anna Sports',
    authorAvatar: 'https://ui-avatars.com/api/?name=Anna+Sports&background=dc2626&color=fff',
    authorRole: 'Periodista Esportiva',
    category: 'Esports',
    tags: ['futbol', 'barça', 'messi', 'la liga'],
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-12'),
    views: 1834,
    likes: 156,
    comments: 67,
    readTime: 10,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '4',
    title: 'Mindfulness: l\'art de viure el present',
    excerpt: 'Tècniques pràctiques de mindfulness per reduir l\'estrès i millorar el benestar mental.',
    content: 'En un món cada vegada més accelerat, el mindfulness...',
    author: 'Laura Zen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Laura+Zen&background=10b981&color=fff',
    authorRole: 'Coach de Benestar',
    category: 'Salut i Benestar',
    tags: ['mindfulness', 'salut mental', 'benestar', 'meditació'],
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-11'),
    views: 987,
    likes: 124,
    comments: 31,
    readTime: 7,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '5',
    title: 'Cuina catalana: tradició i modernitat',
    excerpt: 'Un viatge gastronòmic per Catalunya descobrint com la cuina tradicional s\'adapta als temps moderns.',
    content: 'La gastronomia catalana és un trésor cultural...',
    author: 'Carles Chef',
    authorAvatar: 'https://ui-avatars.com/api/?name=Carles+Chef&background=ea580c&color=fff',
    authorRole: 'Xef i Consultor Gastronòmic',
    category: 'Gastronomia',
    tags: ['cuina', 'catalunya', 'tradició', 'gastronomia'],
    featuredImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-10'),
    views: 756,
    likes: 89,
    comments: 19,
    readTime: 9,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '6',
    title: 'Emprenedoria digital: claves per l\'èxit',
    excerpt: 'Consells pràctics per llançar i fer créixer un negoci digital en l\'ecosistema actual.',
    content: 'L\'emprenedoria digital ofereix oportunitats úniques...',
    author: 'Marc Business',
    authorAvatar: 'https://ui-avatars.com/api/?name=Marc+Business&background=4b5563&color=fff',
    authorRole: 'Consultor en Negocis Digitals',
    category: 'Negocis',
    tags: ['emprenedoria', 'digital', 'negocis', 'startup'],
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-09'),
    views: 1342,
    likes: 98,
    comments: 34,
    readTime: 11,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '7',
    title: 'Art contemporani català: noves veus',
    excerpt: 'Descobreix els artistes catalans emergents que estan revolucionant l\'escena artística internacional.',
    content: 'L\'art contemporani català viu un moment d\'efervescència...',
    author: 'Núria Art',
    authorAvatar: 'https://ui-avatars.com/api/?name=Nuria+Art&background=8b5cf6&color=fff',
    authorRole: 'Crítica d\'Art',
    category: 'Cultura',
    tags: ['art', 'cultura', 'catalunya', 'artistes'],
    featuredImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-08'),
    views: 623,
    likes: 67,
    comments: 12,
    readTime: 8,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '8',
    title: 'Educació del futur: tendències 2025',
    excerpt: 'Com està evolucionant l\'educació amb les noves tecnologies i metodologies pedagògiques.',
    content: 'L\'educació està experimentant una transformació radical...',
    author: 'Pere Educació',
    authorAvatar: 'https://ui-avatars.com/api/?name=Pere+Educacio&background=6366f1&color=fff',
    authorRole: 'Pedagog i Investigador',
    category: 'Educació',
    tags: ['educació', 'pedagogia', 'tecnologia', 'aprenentatge'],
    featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-07'),
    views: 894,
    likes: 76,
    comments: 28,
    readTime: 6,
    isPublished: true,
    isFeatured: false
  }
]

type ViewMode = 'grid' | 'list'
type SortOption = 'recent' | 'popular' | 'featured'

export default function BlogsPrincipal() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs)
  const [isAdmin] = useState(false) // TODO: Get from auth context
  const router = useRouter()

  useEffect(() => {
    let filtered = mockBlogs

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      const categoryName = blogCategories.find(cat => cat.id === selectedCategory)?.name
      if (categoryName) {
        filtered = filtered.filter(blog => blog.category === categoryName)
      }
    }

    // Ordenar
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
        break
      case 'featured':
        filtered = [...filtered].sort((a, b) => {
          if (a.isFeatured === b.isFeatured) {
            return b.publishedAt.getTime() - a.publishedAt.getTime()
          }
          return a.isFeatured ? -1 : 1
        })
        break
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        break
    }

    setFilteredBlogs(filtered)
  }, [searchTerm, selectedCategory, sortBy])

  const handleBlogClick = (blogId: string) => {
    router.push(`/blogs/${blogId}`)
  }

  const handleCreateBlog = () => {
    // setIsCreateModalOpen(true)
    alert('Modal crear blog - Solo admins')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog de La Pública</h1>
              <p className="text-gray-600">Descobreix articles, anàlisis i reflexions sobre el sector públic català</p>
            </div>
            {isAdmin && (
              <button 
                onClick={handleCreateBlog}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={20} className="mr-2" />
                Nou Article
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mockBlogs.length}</p>
                  <p className="text-sm text-gray-500">Articles publicats</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockBlogs.reduce((acc, blog) => acc + blog.views, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Visualitzacions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockBlogs.reduce((acc, blog) => acc + blog.likes, 0)}
                  </p>
                  <p className="text-sm text-gray-500">M'agrada</p>
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
                    {mockBlogs.reduce((acc, blog) => acc + blog.comments, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Comentaris</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca articles, autors o etiquetes..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Totes les categories</option>
                {blogCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                ))}
              </select>

              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="recent">Més recents</option>
                <option value="popular">Més populars</option>
                <option value="featured">Destacats</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article trobat' : 'articles trobats'}
              {searchTerm && (
                <span className="font-medium"> per "{searchTerm}"</span>
              )}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Esborrar filtres
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp size={16} />
            <span>Vista: {viewMode === 'grid' ? 'Graella' : 'Llista'}</span>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cap article trobat</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Prova a modificar els filtres de cerca o explora altres categories.'
                : 'Encara no hi ha articles publicats al blog.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Veure tots els articles
              </button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} viewMode={viewMode} onClick={() => handleBlogClick(blog.id)} />
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredBlogs.length > 0 && filteredBlogs.length >= 9 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Carregar més articles
            </button>
          </div>
        )}
      </div>

      {/* Modal Crear Blog */}
      {/* <ModalCrearBlog 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
    </div>
  )
}

// Blog Card Component
interface BlogCardProps {
  blog: BlogPost
  viewMode: ViewMode
  onClick: () => void
}

function BlogCard({ blog, viewMode, onClick }: BlogCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ca-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 h-48 md:h-auto flex-shrink-0">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            {blog.isFeatured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <TrendingUp size={12} className="mr-1" />
                Destacat
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
              {blog.readTime} min
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {blog.category}
              </span>
              <time className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(blog.publishedAt)}
              </time>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {blog.title}
            </h3>
            
            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
              {blog.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={blog.authorAvatar} 
                  alt={blog.author}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                  <p className="text-xs text-gray-500">{blog.authorRole}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {blog.views}
                </div>
                <div className="flex items-center">
                  <Heart size={14} className="mr-1" />
                  {blog.likes}
                </div>
                <div className="flex items-center">
                  <MessageCircle size={14} className="mr-1" />
                  {blog.comments}
                </div>
              </div>
            </div>
            
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {blog.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{blog.tags.length - 3} més</span>
                )}
              </div>
            )}
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
          src={blog.featuredImage} 
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
        {blog.isFeatured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <TrendingUp size={12} className="mr-1" />
            Destacat
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
          {blog.readTime} min
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {blog.category}
          </span>
          <time className="text-sm text-gray-500 flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatDate(blog.publishedAt)}
          </time>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img 
              src={blog.authorAvatar} 
              alt={blog.author}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.author}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              {blog.views}
            </div>
            <div className="flex items-center">
              <Heart size={12} className="mr-1" />
              {blog.likes}
            </div>
          </div>
        </div>
        
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                <Tag size={8} className="mr-1" />
                {tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{blog.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}