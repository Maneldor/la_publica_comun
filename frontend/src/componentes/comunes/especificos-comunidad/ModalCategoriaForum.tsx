'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  X,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  User,
  ArrowRight,
  Calendar,
  TrendingUp
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

interface ModalCategoriaForumProps {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    name: string
    description: string
    icon: string
    color: string
    topicCount: number
    postCount: number
  } | null
  topics: ForumTopic[]
}

export default function ModalCategoriaForum({ 
  isOpen, 
  onClose, 
  category, 
  topics 
}: ModalCategoriaForumProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Fa uns minuts'
    if (hours < 24) return `Fa ${hours}h`
    if (hours < 48) return 'Ahir'
    return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/forums/topic/${topicId}`)
    onClose()
  }

  const handleViewAllTopics = () => {
    if (category) {
      router.push(`/forums/categoria/${category.id}`)
      onClose()
    }
  }

  const filteredTopics = topics.filter(topic => topic.category === category?.name)

  if (!isVisible) return null

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
      <div className={`relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              {category && (
                <>
                  <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{category.topicCount} temes</span>
                      <span>•</span>
                      <span>{category.postCount} posts</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cap tema encara</h3>
              <p className="text-gray-600 mb-6">Sigues el primer en crear un tema en aquesta categoria.</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                Crear primer tema
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredTopics.length}</div>
                  <div className="text-sm text-blue-700">Temes actius</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredTopics.reduce((acc, topic) => acc + topic.replies, 0)}
                  </div>
                  <div className="text-sm text-green-700">Total respostes</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredTopics.reduce((acc, topic) => acc + topic.views, 0)}
                  </div>
                  <div className="text-sm text-purple-700">Visualitzacions</div>
                </div>
              </div>

              {/* Topics List */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2" />
                Temes més recents
              </h3>
              
              <div className="space-y-3">
                {filteredTopics.slice(0, 6).map((topic) => (
                  <div 
                    key={topic.id}
                    onClick={() => handleTopicClick(topic.id)}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {topic.isPinned && (
                            <Pin size={14} className="text-blue-500 flex-shrink-0" />
                          )}
                          {topic.isLocked && (
                            <Lock size={14} className="text-red-500 flex-shrink-0" />
                          )}
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {topic.title}
                          </h4>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {topic.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User size={12} className="mr-1" />
                              {topic.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {formatDate(topic.lastActivity)}
                            </span>
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
                        
                        {topic.lastReplyBy && (
                          <div className="flex items-center mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                            <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-2">
                              {topic.lastReplyAvatar ? (
                                <img src={topic.lastReplyAvatar} alt={topic.lastReplyBy} className="w-full h-full object-cover" />
                              ) : (
                                <User size={10} className="text-gray-400" />
                              )}
                            </div>
                            <span>Última resposta per {topic.lastReplyBy}</span>
                          </div>
                        )}
                      </div>
                      
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTopics.length > 6 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Mostrant 6 de {filteredTopics.length} temes
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tancar
            </button>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleViewAllTopics}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                Veure tots els temes
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}