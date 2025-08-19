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
  Crown,
  Shield
} from 'lucide-react'

interface ModalCrearTemaProps {
  isOpen: boolean
  onClose: () => void
  categories: any[]
  userRole?: string
}

interface FormData {
  title: string
  content: string
  category: string
  tags: string[]
  coverType: 'none' | 'color' | 'image'
  coverColor: string
  coverImage: string | null
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green  
  '#8b5cf6', // Purple
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange-600
  '#ec4899', // Pink
  '#6366f1', // Indigo
]

export default function ModalCrearTema({ isOpen, onClose, categories, userRole = 'miembro' }: ModalCrearTemaProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: '',
    tags: [],
    coverType: 'color',
    coverColor: '#3b82f6',
    coverImage: null
  })
  const [currentTag, setCurrentTag] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Reset form when closing
        setFormData({
          title: '',
          content: '',
          category: '',
          tags: [],
          coverType: 'color',
          coverColor: '#3b82f6',
          coverImage: null
        })
        setErrors({})
      }, 300)
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'La imatge no pot superar els 5MB' }))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: e.target?.result as string,
          coverType: 'image'
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El títol és obligatori'
    } else if (formData.title.length < 10) {
      newErrors.title = 'El títol ha de tenir almenys 10 caràcters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contingut és obligatori'
    } else if (formData.content.length < 20) {
      newErrors.content = 'El contingut ha de tenir almenys 20 caràcters'
    }

    if (!formData.category) {
      newErrors.category = 'Has de seleccionar una categoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simular creación de tema
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Crear nuevo tema mock
      const newTopic = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.content.substring(0, 150) + '...',
        content: formData.content,
        author: 'Tu',
        authorAvatar: 'https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff',
        category: categories.find(cat => cat.id === formData.category)?.name || '',
        isPinned: false,
        isLocked: false,
        replies: 0,
        views: 0,
        likes: 0,
        lastActivity: new Date(),
        lastReplyBy: '',
        tags: formData.tags,
        coverType: formData.coverType,
        coverColor: formData.coverColor,
        coverImage: formData.coverImage
      }

      console.log('Nou tema creat:', newTopic)

      // Navegar al nuevo tema
      router.push(`/forums/topic/${newTopic.id}`)
      onClose()
    } catch (error) {
      console.error('Error creant el tema:', error)
      setErrors({ submit: 'Error creant el tema. Torna-ho a intentar.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  const selectedCategory = categories.find(cat => cat.id === formData.category)
  
  // Filtrar categorías según permisos del usuario
  const availableCategories = categories.filter(category => {
    if (!category.isAdminOnly) return true
    
    // Si la categoría es admin-only, verificar si el usuario tiene permisos
    if (category.allowedRoles && category.allowedRoles.includes(userRole)) {
      return true
    }
    
    return false
  })

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
      <div className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Crear Nou Tema</h2>
              <p className="text-gray-600 mt-1">Comparteix les teves idees amb la comunitat</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh] p-6">
          <div className="space-y-6">
            
            {/* Cover Options */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                Portada del tema
              </label>
              
              {/* Cover Preview */}
              <div className="mb-4">
                <div 
                  className={`w-full h-32 rounded-xl flex items-center justify-center text-white font-semibold text-lg relative overflow-hidden ${
                    formData.coverType === 'none' ? 'bg-gray-200' : ''
                  }`}
                  style={{
                    backgroundColor: formData.coverType === 'color' ? formData.coverColor : 'transparent',
                    backgroundImage: formData.coverType === 'image' && formData.coverImage ? `url(${formData.coverImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {formData.coverType === 'image' && formData.coverImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  )}
                  <span className={`relative z-10 ${formData.coverType === 'none' ? 'text-gray-500' : 'text-white'}`}>
                    {formData.title || 'Vista previa del títol'}
                  </span>
                </div>
              </div>

              {/* Cover Type Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleInputChange('coverType', 'none')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.coverType === 'none' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Type size={16} />
                  <span className="text-sm font-medium">Sense portada</span>
                </button>
                <button
                  onClick={() => handleInputChange('coverType', 'color')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.coverType === 'color' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Palette size={16} />
                  <span className="text-sm font-medium">Color</span>
                </button>
                <button
                  onClick={() => handleInputChange('coverType', 'image')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    formData.coverType === 'image' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon size={16} />
                  <span className="text-sm font-medium">Imatge</span>
                </button>
              </div>

              {/* Color Picker */}
              {formData.coverType === 'color' && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Tria un color per la portada:</p>
                  <div className="flex items-center space-x-3">
                    <div className="grid grid-cols-5 gap-2">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => handleInputChange('coverColor', color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            formData.coverColor === color 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {formData.coverColor === color && (
                            <Check size={16} className="text-white mx-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.coverColor}
                        onChange={(e) => handleInputChange('coverColor', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <span className="text-sm text-gray-500">Personalitzat</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {formData.coverType === 'image' && (
                <div>
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Clica per pujar una imatge o arrossega-la aquí
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF fins a 5MB</p>
                    </div>
                  </label>
                  {errors.image && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Títol del tema *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Escriu un títol descriptiu i atractiu..."
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
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
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.isAdminOnly ? '(Admin)' : ''}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.category}
                </p>
              )}
              {selectedCategory && (
                <div className={`mt-3 p-3 rounded-lg ${selectedCategory.isAdminOnly ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${selectedCategory.color} rounded-lg flex items-center justify-center text-white text-sm relative`}>
                      {selectedCategory.icon}
                      {selectedCategory.isAdminOnly && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <Crown size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{selectedCategory.name}</p>
                        {selectedCategory.isAdminOnly && (
                          <span className="text-xs text-amber-700 font-medium px-2 py-0.5 bg-amber-100 rounded-full flex items-center">
                            <Shield size={10} className="mr-1" />
                            Admin Only
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{selectedCategory.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Contingut *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Escriu el contingut del teu tema. Pots utilitzar Markdown per donar format al text..."
                rows={8}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.content ? 'border-red-300' : 'border-gray-200'
                }`}
                maxLength={5000}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.content && (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.content}
                  </p>
                )}
                <span className="text-sm text-gray-500 ml-auto">
                  {formData.content.length}/5000
                </span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">
                Etiquetes (opcional)
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
                  onClick={handleAddTag}
                  disabled={!currentTag.trim() || formData.tags.length >= 5}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Tag size={16} className="mr-1" />
                  Afegir
                </button>
              </div>
              
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
              
              <p className="text-xs text-gray-500">
                Màxim 5 etiquetes. Prem Enter o clica "Afegir" per afegir cada etiqueta.
              </p>
            </div>

          </div>
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
            <div className="text-sm text-gray-500">
              <Eye size={16} className="inline mr-1" />
              El tema serà visible per tots els membres de la comunitat
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center min-w-[120px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creant...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Crear tema
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}