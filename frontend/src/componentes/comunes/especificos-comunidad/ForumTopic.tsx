'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ModeratedInput, { ModeratedInputRef } from '../ModeratedInput'
import { 
  ArrowLeft,
  MessageCircle,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  Pin,
  Lock,
  User,
  Calendar,
  Reply,
  ThumbsUp,
  Flag
} from 'lucide-react'

interface Reply {
  id: string
  content: string
  author: string
  authorAvatar?: string
  authorRole?: string
  createdAt: Date
  likes: number
  isLiked?: boolean
  replies?: Reply[]
}

interface TopicData {
  id: string
  title: string
  content: string
  author: string
  authorAvatar?: string
  authorRole?: string
  category: string
  isPinned: boolean
  isLocked: boolean
  replies: number
  views: number
  likes: number
  createdAt: Date
  lastActivity: Date
  tags?: string[]
}

interface ForumTopicProps {
  topicId: string
}

// Mock data estilo BuddyBoss
const getMockTopicData = (id: string): TopicData | null => {
  const topics: { [key: string]: TopicData } = {
    '1': {
      id: '1',
      title: 'Actualització del sistema de gestió documental',
      content: `Hola a tots,

Volem compartir amb vosaltres les noves funcionalitats que arribaran al nostre sistema de gestió documental el proper mes.

**Principals millores:**

• Cerca avançada amb reconeixement òptic (OCR)
• Integració directa amb signatura electrònica  
• Col·laboració en temps real
• App mòbil completament renovada

**Calendari de desplegament:**
- Setmana 1-2: Formació i migració
- Setmana 3-4: Activació progressiva

Estarem disponibles per resoldre qualsevol dubte durant tot el procés.

Gràcies per la vostra col·laboració! 🚀`,
      author: 'Admin Catalunya',
      authorAvatar: 'https://ui-avatars.com/api/?name=Admin+Catalunya&background=3b82f6&color=fff',
      authorRole: 'Administrador',
      category: 'Anuncis Oficials',
      isPinned: true,
      isLocked: false,
      replies: 12,
      views: 245,
      likes: 18,
      createdAt: new Date('2025-08-14T09:00:00'),
      lastActivity: new Date('2025-08-14T11:30:00'),
      tags: ['sistema', 'actualització']
    },
    '3': {
      id: '3',
      title: 'Nova normativa RGPD - Necessito la vostra ajuda',
      content: `Companys,

Estic treballant en la implementació de la nova normativa RGPD i m'agradaria conèixer les vostres experiències.

**Els meus dubtes principals són:**

1. **Consentiment explícit** - Com ho esteu gestionant?
2. **Dret a l'oblit** - Quin procés seguiu?
3. **Notificació de bretxes** - Teniu plantilles?

He estat llegint la documentació però sempre ajuda escoltar casos reals.

Quina ha estat la vostra experiència? Quins obstacles heu trobat?

Moltes gràcies per endavant! 🙏`,
      author: 'Maria Garcia',
      authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=10b981&color=fff',
      authorRole: 'Tècnica de Sistemes',
      category: 'Innovació i Transformació Digital',
      isPinned: false,
      isLocked: false,
      replies: 23,
      views: 156,
      likes: 12,
      createdAt: new Date('2025-08-13T14:30:00'),
      lastActivity: new Date('2025-08-14T10:30:00'),
      tags: ['rgpd', 'normativa', 'ajuda']
    }
  }
  
  return topics[id] || null
}

const getMockReplies = (topicId: string): Reply[] => {
  const repliesData: { [key: string]: Reply[] } = {
    '1': [
      {
        id: 'r1',
        content: 'Molt bona notícia! La funcionalitat de cerca avançada ens permetrà trobar documents molt més ràpidament. Quan estaran disponibles els materials de formació?',
        author: 'Laura Martí',
        authorAvatar: 'https://ui-avatars.com/api/?name=Laura+Marti&background=f59e0b&color=fff',
        authorRole: 'Coordinadora IT',
        createdAt: new Date('2025-08-14T09:15:00'),
        likes: 5,
        isLiked: false
      },
      {
        id: 'r2',
        content: 'Excel·lent! La integració amb signatura electrònica ens estalviarà molt temps. Funcionarà amb els certificats que ja tenim?',
        author: 'Carles Vidal',
        authorRole: 'Cap de Departament',
        createdAt: new Date('2025-08-14T09:45:00'),
        likes: 8,
        replies: [
          {
            id: 'r2-1',
            content: 'Sí Carles, serà compatible amb tots els certificats existents. També suportarem els nous estàndards europeus.',
            author: 'Admin Catalunya',
            authorAvatar: 'https://ui-avatars.com/api/?name=Admin+Catalunya&background=3b82f6&color=fff',
            authorRole: 'Administrador',
            createdAt: new Date('2025-08-14T09:50:00'),
            likes: 6
          }
        ]
      },
      {
        id: 'r3',
        content: 'Una pregunta important: durant la migració, tindrem accés als documents o hi haurà un període de inactivitat?',
        author: 'Anna Puig',
        authorRole: 'Arxivera',
        createdAt: new Date('2025-08-14T10:20:00'),
        likes: 4,
      }
    ],
    '3': [
      {
        id: 'r5',
        content: 'Hola Maria! A la nostra administració vam implementar el RGPD l\'any passat. Per al consentiment explícit, vam crear un sistema de checkboxes múltiples. T\'puc compartir la documentació si vols.',
        author: 'Joan Martinez',
        authorRole: 'Responsable Legal',
        createdAt: new Date('2025-08-13T15:00:00'),
        likes: 8,
      },
      {
        id: 'r6',
        content: 'Per la notificació de bretxes, us recomano contractar una auditoria externa. Nosaltres ho vam fer i ens va estalviar molts maldecaps.',
        author: 'Elena Rius',
        authorRole: 'Consultora RGPD',
        createdAt: new Date('2025-08-13T16:30:00'),
        likes: 6,
      },
      {
        id: 'r7',
        content: 'Maria, tenim plantilles per tot el procés. Si vols, podem fer una videoconferència per explicar-te el nostre flux de treball.',
        author: 'Pere Rodríguez',
        authorRole: 'Tècnic de Seguretat',
        createdAt: new Date('2025-08-14T08:15:00'),
        likes: 7,
        replies: [
          {
            id: 'r7-1',
            content: 'Fantàstic Pere! M\'agradaria molt. T\'envio un missatge privat per coordinar.',
            author: 'Maria Garcia',
            authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=10b981&color=fff',
            authorRole: 'Tècnica de Sistemes',
            createdAt: new Date('2025-08-14T08:30:00'),
            likes: 3,
              }
        ]
      }
    ]
  }
  
  return repliesData[topicId] || []
}

export default function ForumTopic({ topicId }: ForumTopicProps) {
  const [topic, setTopic] = useState<TopicData | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [newReply, setNewReply] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const topicData = getMockTopicData(topicId)
    const repliesData = getMockReplies(topicId)
    
    setTopic(topicData)
    setReplies(repliesData)
  }, [topicId])

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

  const handleLike = (replyId?: string) => {
    if (replyId) {
      setReplies(prev => prev.map(reply => {
        if (reply.id === replyId) {
          const newLikes = reply.isLiked ? reply.likes - 1 : reply.likes + 1
          return { ...reply, likes: newLikes, isLiked: !reply.isLiked }
        }
        return reply
      }))
    } else {
      const newIsLiked = !isLiked
      setIsLiked(newIsLiked)
      if (topic) {
        setTopic(prev => {
          if (!prev) return null
          const newLikes = newIsLiked ? prev.likes + 1 : prev.likes - 1
          return { ...prev, likes: newLikes }
        })
      }
    }
  }

  const handleReply = (content: string, parentId?: string) => {
    if (!content.trim()) return

    const newReplyObj: Reply = {
      id: `r-${Date.now()}`,
      content: content.trim(),
      author: 'Tu',
      authorAvatar: 'https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff',
      authorRole: 'Membre',
      createdAt: new Date(),
      likes: 0
    }

    if (parentId) {
      setReplies(prev => prev.map(reply => {
        if (reply.id === parentId) {
          return { ...reply, replies: [...(reply.replies || []), newReplyObj] }
        }
        return reply
      }))
    } else {
      setReplies(prev => [...prev, newReplyObj])
      if (topic) {
        setTopic(prev => {
          if (!prev) return null
          return { ...prev, replies: prev.replies + 1 }
        })
      }
    }

    setNewReply('')
    setReplyingTo(null)
  }

  if (!topic) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <MessageCircle size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tema no trobat</h2>
          <p className="text-gray-600 mb-6">El tema que cerques no existeix o ha estat eliminat.</p>
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
    <div className="w-full">
      
      {/* Header navegació - Estil BuddyBoss */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button 
              onClick={() => router.push('/forums')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              Fòrums
            </button>
            <div className="text-xs text-gray-500">
              {topic.category}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Topic Principal - Disseny BuddyBoss */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Topic Header */}
              <div className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
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
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{topic.title}</h1>

                {/* Author Info - Estil BuddyBoss */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={topic.authorAvatar} 
                      alt={topic.author} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {topic.authorRole === 'Administrador' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{topic.author}</span>
                      {topic.authorRole && (
                        <span className="text-xs text-white bg-gray-400 px-2 py-0.5 rounded-full">
                          {topic.authorRole}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(topic.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Eye size={12} className="mr-1" />
                        {topic.views}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topic Content */}
              <div className="px-6 py-6">
                <div className="prose max-w-none">
                  <div className="text-gray-800 whitespace-pre-line leading-relaxed text-sm">
                    {topic.content}
                  </div>
                </div>

                {/* Tags */}
                {topic.tags && (
                  <div className="flex items-center space-x-2 mt-6">
                    {topic.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium cursor-pointer transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions Bar - Estil BuddyBoss */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLike()}
                      className={`inline-flex items-center space-x-2 text-sm transition-colors ${
                        isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                      <span className="font-medium">{topic.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MessageCircle size={16} />
                      <span className="font-medium">{topic.replies}</span>
                    </div>
                    <button className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <Share2 size={16} />
                      <span>Compartir</span>
                    </button>
                    <button className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <Flag size={16} />
                      <span>Reportar</span>
                    </button>
                  </div>
                  
                  {!topic.isLocked && (
                    <button 
                      onClick={() => setReplyingTo('main')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Reply size={16} className="mr-2" />
                      Respondre
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Form */}
            {!topic.isLocked && replyingTo === 'main' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="px-6 py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Escriu una resposta
                  </h3>
                  <div className="space-y-4">
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Comparteix la teva opinió..."
                      className="w-full h-28 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Mantén un to respectuós i constructiu
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => setReplyingTo(null)}
                          className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Cancel·lar
                        </button>
                        <button 
                          onClick={() => handleReply(newReply)}
                          disabled={!newReply.trim()}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          Publicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Respostes ({replies.length})
              </h2>
              
              {replies.map((reply, index) => (
                <div key={reply.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={reply.authorAvatar} 
                        alt={reply.author} 
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-gray-900">{reply.author}</span>
                            {reply.authorRole && (
                              <span className="text-xs text-white bg-gray-400 px-2 py-0.5 rounded-full">
                                {reply.authorRole}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">#{index + 1}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        
                        <div className="text-gray-800 mb-4 text-sm leading-relaxed">
                          {reply.content}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => handleLike(reply.id)}
                              className={`inline-flex items-center space-x-1 text-sm transition-colors ${
                                reply.isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                              }`}
                            >
                              <ThumbsUp size={14} className={reply.isLiked ? 'fill-current' : ''} />
                              <span>{reply.likes}</span>
                            </button>
                            <button 
                              onClick={() => setReplyingTo(reply.id)}
                              className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Reply size={14} />
                              <span>Respondre</span>
                            </button>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                        
                        {/* Sub-replies */}
                        {reply.replies && reply.replies.length > 0 && (
                          <div className="mt-6 pl-6 border-l-2 border-gray-100 space-y-4">
                            {reply.replies.map((subReply) => (
                              <div key={subReply.id} className="flex items-start space-x-3">
                                <img 
                                  src={subReply.authorAvatar} 
                                  alt={subReply.author} 
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900">{subReply.author}</span>
                                    {subReply.authorRole && (
                                      <span className="text-xs text-white bg-gray-400 px-2 py-0.5 rounded-full">
                                        {subReply.authorRole}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-400">{formatDate(subReply.createdAt)}</span>
                                  </div>
                                  <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                                    {subReply.content}
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <button className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                      <ThumbsUp size={12} />
                                      <span>{subReply.likes}</span>
                                    </button>
                                    <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                                      Respondre
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form for this comment */}
                        {replyingTo === reply.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                            <textarea
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              placeholder={`Respondre a ${reply.author}...`}
                              className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            />
                            <div className="flex items-center justify-end space-x-2 mt-3">
                              <button 
                                onClick={() => setReplyingTo(null)}
                                className="px-3 py-1.5 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
                              >
                                Cancel·lar
                              </button>
                              <button 
                                onClick={() => handleReply(newReply, reply.id)}
                                disabled={!newReply.trim()}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                              >
                                Respondre
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {topic.isLocked && (
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mr-4">
                    <Lock size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900">Tema tancat</h3>
                    <p className="text-sm text-amber-700">Aquest tema no accepta noves respostes.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Topic Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadístiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visualitzacions</span>
                  <span className="text-sm font-semibold text-gray-900">{topic.views}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Respostes</span>
                  <span className="text-sm font-semibold text-gray-900">{topic.replies}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">M'agrada</span>
                  <span className="text-sm font-semibold text-gray-900">{topic.likes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Última activitat</span>
                  <span className="text-xs text-gray-500">{formatDate(topic.lastActivity)}</span>
                </div>
              </div>
            </div>

            {/* Related Topics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temes relacionats</h3>
              <div className="space-y-4">
                <a href="#" className="block group">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1 leading-snug">
                    Implementació de signatures digitals
                  </h4>
                  <p className="text-xs text-gray-500">8 respostes • Fa 2 dies</p>
                </a>
                <a href="#" className="block group">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1 leading-snug">
                    Migració de sistemes legacy
                  </h4>
                  <p className="text-xs text-gray-500">15 respostes • Fa 1 setmana</p>
                </a>
                <a href="#" className="block group">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1 leading-snug">
                    Formació personal IT
                  </h4>
                  <p className="text-xs text-gray-500">23 respostes • Fa 3 dies</p>
                </a>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categoria</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-lg">
                  📢
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{topic.category}</h4>
                  <p className="text-xs text-gray-500">128 temes • 658 respostes</p>
                </div>
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium text-left">
                Veure tots els temes →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}