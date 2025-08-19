'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X,
  Upload,
  Image as ImageIcon,
  Palette,
  Eye,
  Type,
  Tag,
  Send,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  BookOpen,
  Save,
  FileText,
  Globe
} from 'lucide-react'

interface ModalCrearBlogProps {
  isOpen: boolean
  onClose: () => void
  blogData?: any // For editing existing blogs
  isEditing?: boolean
}

interface FormData {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featuredImage: string | null
  isPublished: boolean
  isFeatured: boolean
  readTime: number
}

interface BlogCategory {
  id: string
  name: string
  color: string
}

const blogCategories: BlogCategory[] = [
  { id: 'tecnologia', name: 'Tecnologia', color: 'bg-blue-500' },
  { id: 'viatges', name: 'Viatges', color: 'bg-green-500' },
  { id: 'esports', name: 'Esports', color: 'bg-red-500' },
  { id: 'cultura', name: 'Cultura', color: 'bg-purple-500' },
  { id: 'salut', name: 'Salut i Benestar', color: 'bg-emerald-500' },
  { id: 'gastronomia', name: 'Gastronomia', color: 'bg-orange-500' },
  { id: 'educacio', name: 'Educació', color: 'bg-indigo-500' },
  { id: 'entreteniment', name: 'Entreteniment', color: 'bg-pink-500' },
  { id: 'negocis', name: 'Negocis', color: 'bg-gray-600' },
  { id: 'estil-vida', name: 'Estil de Vida', color: 'bg-yellow-500' }
]

const SUGGESTED_TAGS = [
  'tecnologia', 'ia', 'apps', 'digital', 'innovació', 'viatges', 'turisme',
  'destinacions', 'consells', 'esports', 'futbol', 'barça', 'fitness',
  'salut', 'benestar', 'mindfulness', 'nutrició', 'cuina', 'receptes',
  'gastronomia', 'cultura', 'art', 'música', 'cinema', 'educació',
  'aprenentatge', 'negocis', 'emprenedoria', 'startup', 'màrqueting',
  'estil-vida', 'moda', 'tendències', 'catalunya', 'barcelona'
]

export default function ModalCrearBlog({ isOpen, onClose, blogData, isEditing = false }: ModalCrearBlogProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: null,
    isPublished: false,
    isFeatured: false,
    readTime: 0
  })
  const [currentTag, setCurrentTag] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [previewMode, setPreviewMode] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      
      // Initialize form data if editing
      if (isEditing && blogData) {
        setFormData({
          title: blogData.title || '',
          excerpt: blogData.excerpt || '',
          content: blogData.content || '',
          category: blogData.category || '',
          tags: blogData.tags || [],
          featuredImage: blogData.featuredImage || null,
          isPublished: blogData.isPublished || false,
          isFeatured: blogData.isFeatured || false,
          readTime: blogData.readTime || 0
        })
      }
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Reset form when closing
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: '',
          tags: [],
          featuredImage: null,
          isPublished: false,
          isFeatured: false,
          readTime: 0
        })
        setErrors({})
        setPreviewMode(false)
      }, 300)
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isEditing, blogData])

  // Calculate estimated read time based on content
  useEffect(() => {
    const wordsPerMinute = 200
    const wordCount = formData.content.trim().split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
    setFormData(prev => ({ ...prev, readTime }))
  }, [formData.content])

  // Update suggested tags based on content
  useEffect(() => {
    const contentLower = (formData.title + ' ' + formData.content + ' ' + formData.excerpt).toLowerCase()
    const relevant = SUGGESTED_TAGS.filter(tag => 
      contentLower.includes(tag.toLowerCase()) && 
      !formData.tags.includes(tag)
    ).slice(0, 5)
    setSuggestedTags(relevant)
  }, [formData.title, formData.content, formData.excerpt, formData.tags])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || currentTag.trim()
    if (tagToAdd && !formData.tags.includes(tagToAdd) && formData.tags.length < 8) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagToAdd]
      }))
      if (!tag) setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, image: 'La imatge no pot superar els 10MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          featuredImage: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El títol és obligatori'
    } else if (formData.title.length < 20) {
      newErrors.title = 'El títol ha de tenir almenys 20 caràcters'
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'El resum és obligatori'
    } else if (formData.excerpt.length < 50) {
      newErrors.excerpt = 'El resum ha de tenir almenys 50 caràcters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contingut és obligatori'
    } else if (formData.content.length < 200) {
      newErrors.content = 'El contingut ha de tenir almenys 200 caràcters'
    }

    if (!formData.category) {
      newErrors.category = 'Has de seleccionar una categoria'
    }

    if (!formData.featuredImage) {
      newErrors.image = 'Has d\'afegir una imatge destacada'
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Has d\'afegir almenys una etiqueta'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (publishNow: boolean = false) => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Update publication status if publishing
      const finalFormData = {
        ...formData,
        isPublished: publishNow || formData.isPublished
      }

      // Simular creación/edición de blog
      await new Promise(resolve => setTimeout(resolve, 2000))

      const action = isEditing ? 'actualitzat' : 'creat'
      const status = finalFormData.isPublished ? 'publicat' : 'desat com a esborrany'

      console.log(`Blog ${action}:`, finalFormData)

      // Navegar al blog si se publica
      if (finalFormData.isPublished) {
        const blogId = isEditing ? blogData?.id : Date.now().toString()
        router.push(`/blogs/${blogId}`)
      }
      
      onClose()
    } catch (error) {
      console.error('Error guardant el blog:', error)
      setErrors({ submit: 'Error guardant el blog. Torna-ho a intentar.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  const selectedCategory = blogCategories.find(cat => cat.id === formData.category)

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-6xl max-h-[95vh] bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      } flex`}>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Editar Article' : 'Crear Nou Article'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isEditing ? 'Modifica el contingut del teu article' : 'Escriu un article per a la comunitat de La Pública'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    previewMode 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eye size={16} className="mr-2 inline" />
                  {previewMode ? 'Editar' : 'Vista prèvia'}
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {previewMode ? (
              /* Preview Mode */
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Featured Image Preview */}
                    {formData.featuredImage && (
                      <div className="relative h-64">
                        <img 
                          src={formData.featuredImage} 
                          alt="Vista prèvia"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center space-x-3 mb-4">
                            {selectedCategory && (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${selectedCategory.color}`}>
                                {selectedCategory.name}
                              </span>
                            )}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 backdrop-blur-sm text-white">
                              <Clock size={14} className="mr-1" />
                              {formData.readTime} min lectura
                            </span>
                          </div>
                          <h1 className="text-3xl font-bold text-white leading-tight">
                            {formData.title || 'Títol del teu article'}
                          </h1>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="mb-6">
                        <p className="text-xl text-gray-700 leading-relaxed">
                          {formData.excerpt || 'Resum del teu article...'}
                        </p>
                      </div>
                      
                      <div className="prose prose-lg max-w-none">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {formData.content || 'Contingut del teu article...'}
                        </div>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                <Tag size={12} className="mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="p-6 space-y-6">
                
                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Títol de l'article *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Escriu un títol atractiu i descriptiu..."
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg ${
                      errors.title ? 'border-red-300' : 'border-gray-200'
                    }`}
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.title && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.title}
                      </p>
                    )}
                    <span className="text-sm text-gray-500 ml-auto">
                      {formData.title.length}/200
                    </span>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Resum de l'article *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Escriu un resum atractiu que resumeixi el contingut principal..."
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.excerpt ? 'border-red-300' : 'border-gray-200'
                    }`}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.excerpt && (
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        {errors.excerpt}
                      </p>
                    )}
                    <span className="text-sm text-gray-500 ml-auto">
                      {formData.excerpt.length}/500
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.category ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Selecciona una categoria...</option>
                    {blogCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.category}
                    </p>
                  )}
                  {selectedCategory && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${selectedCategory.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                          #
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedCategory.name}</p>
                          <p className="text-xs text-gray-600">Articles sobre aquesta temàtica</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured Image */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-3 block">
                    Imatge destacada *
                  </label>
                  
                  {formData.featuredImage ? (
                    <div className="relative">
                      <img 
                        src={formData.featuredImage} 
                        alt="Vista prèvia"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleInputChange('featuredImage', null)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-1">
                          Clica per pujar una imatge o arrossega-la aquí
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF fins a 10MB</p>
                      </div>
                    </label>
                  )}
                  {errors.image && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Contingut de l'article *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Escriu el contingut complet del teu article. Pots utilitzar Markdown per donar format al text..."
                    rows={15}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${
                      errors.content ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-4">
                      {errors.content && (
                        <p className="text-red-600 text-sm flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {errors.content}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        Temps de lectura estimat: {formData.readTime} min
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formData.content.length} caràcters
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Etiquetes *
                  </label>
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Afegeix una etiqueta..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={20}
                    />
                    <button
                      onClick={() => handleAddTag()}
                      disabled={!currentTag.trim() || formData.tags.length >= 8}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      <Tag size={16} className="mr-1" />
                      Afegir
                    </button>
                  </div>
                  
                  {/* Suggested Tags */}
                  {suggestedTags.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Etiquetes suggerides:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {errors.tags && (
                    <p className="text-red-600 text-sm mb-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.tags}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Màxim 8 etiquetes. Prem Enter o clica "Afegir" per afegir cada etiqueta.
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-6">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Article destacat</span>
                </label>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Globe size={16} />
                  <span>Visible per tots els membres</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Cancel·lar
                </button>
                
                <button 
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save size={16} className="mr-2" />
                  )}
                  Desar esborrany
                </button>
                
                <button 
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  {isEditing ? 'Actualitzar' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}