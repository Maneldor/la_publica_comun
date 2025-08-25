'use client'

import { useState } from 'react'
import { ChevronLeft, Globe, Settings, Users, FileText, Plus, Save, Upload, Palette, Type, Eye, Monitor, User, Building, Scale, Search, Bell, MessageCircle, Calendar, Briefcase, UserPlus, Home, Hash, HelpCircle, Edit3, Edit, Trash2, Pin, Filter, BookOpen, Link, GraduationCap, Megaphone, Image, Video, Paperclip, Smile, MapPin, BarChart3, X, Shield, AlertTriangle, Ban, Clock, CheckCircle, XCircle, TrendingUp, Bot, Flag, Lock, MessageSquare, Rss } from 'lucide-react'
import { obtenerTodasLasComunidades, type ConfiguracionComunidad } from '../../../configuracion/comunidades'
import ModeratedInput from '../../../src/componentes/comunes/ModeratedInput'

export default function AdminComunitats() {
  const [selectedCommunity, setSelectedCommunity] = useState<string>('catalunya')
  const [activeTab, setActiveTab] = useState<string>('visual')
  const [showNewCommunityModal, setShowNewCommunityModal] = useState(false)
  
  const comunitats = obtenerTodasLasComunidades()
  const currentCommunity = comunitats.find(c => c.codigo === selectedCommunity)

  // Estados para configuración visual
  const [visualConfig, setVisualConfig] = useState({
    primaryColor: currentCommunity?.tema.colorPrimario || '#0066CC',
    secondaryColor: currentCommunity?.tema.colorSecundario || '#FF6B35',
    accentColor: currentCommunity?.tema.colorAccento || '#4CAF50',
    logo: '',
    favicon: '',
    fontFamily: 'Inter',
    headerStyle: 'modern'
  })

  // Estados para configuración de roles
  const [rolesConfig, setRolesConfig] = useState({
    funcionarios: {
      canCreateGroups: true,
      canPublishOffers: false,
      canAccessPrivateContent: true,
      visibleWidgets: ['news', 'events', 'forums', 'documents']
    },
    empresas: {
      canCreateGroups: false,
      canPublishOffers: true,
      canAccessPrivateContent: false,
      visibleWidgets: ['offers', 'news', 'events']
    },
    sindicatos: {
      canCreateGroups: true,
      canPublishOffers: false,
      canAccessPrivateContent: true,
      visibleWidgets: ['news', 'events', 'forums', 'surveys']
    },
    ciudadanos: {
      canCreateGroups: false,
      canPublishOffers: false,
      canAccessPrivateContent: false,
      visibleWidgets: ['news', 'events']
    }
  })

  // Estados para gestión de contenido
  const [contentConfig, setContentConfig] = useState({
    enabledFeeds: ['news', 'events', 'offers'],
    customGroups: ['Funcionarios', 'Empresas Tech', 'Sindicatos'],
    featuredContent: [],
    moderationLevel: 'automatic',
    allowUserCreatedContent: true
  })

  // Estados para vista previa
  const [previewRole, setPreviewRole] = useState<string>('funcionarios')

  // Estados para gestión de contenido
  const [contentManagementSection, setContentManagementSection] = useState<string>('feed')
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showAnnouncementPreviewModal, setShowAnnouncementPreviewModal] = useState(false)
  const [postFilters, setPostFilters] = useState({
    author: '',
    dateFrom: '',
    dateTo: '',
    contentType: 'all'
  })
  
  // Estados para blogs
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false)
  const [showBlogPreviewModal, setShowBlogPreviewModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiTask, setAiTask] = useState<string>('')
  const [blogFilters, setBlogFilters] = useState({
    author: '',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'draft',
    publishDate: '',
    publishTime: '',
    seoTitle: '',
    seoDescription: '',
    aiAgent: 'contingut-web',
    language: 'catala',
    coverImage: null as File | null
  })
  const [selectedBlog, setSelectedBlog] = useState<any>(null)
  
  // Datos mock para blogs
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Modernització de l\'administració pública catalana: nous reptes digitals',
      author: 'Maria Puig',
      category: 'Transformació Digital',
      status: 'published',
      publishDate: '2024-08-20',
      publishTime: '09:00',
      views: 1250,
      likes: 89,
      content: 'La transformació digital de l\'administració pública catalana ha esdevingut una prioritat estratègica...',
      tags: ['digitalització', 'administració', 'innovació'],
      seoTitle: 'Modernització Administració Pública Catalunya 2024',
      seoDescription: 'Descobreix els nous reptes i oportunitats de la digitalització en l\'administració catalana.',
      aiGenerated: true,
      aiAgent: 'contingut-web',
      language: 'catala',
      coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Guía práctica para la implementación de procesos ágiles en el sector público',
      author: 'Joan Martínez',
      category: 'Metodologies',
      status: 'draft',
      publishDate: '2024-08-25',
      publishTime: '14:30',
      views: 0,
      likes: 0,
      content: 'Los procesos ágiles han demostrado su eficacia en el sector privado. En este artículo exploramos...',
      tags: ['agile', 'procesos', 'eficiencia'],
      seoTitle: 'Procesos Ágiles Sector Público - Guía Práctica 2024',
      seoDescription: 'Aprende a implementar metodologías ágiles en organizaciones del sector público.',
      aiGenerated: false,
      aiAgent: '',
      language: 'castella',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'L\'impacte de la intel·ligència artificial en els serveis públics',
      author: 'Laura Vidal',
      category: 'Intel·ligència Artificial',
      status: 'scheduled',
      publishDate: '2024-08-26',
      publishTime: '10:00',
      views: 0,
      likes: 0,
      content: 'La IA està transformant la manera com les administracions públiques ofereixen serveis als ciutadans...',
      tags: ['IA', 'serveis públics', 'automació'],
      seoTitle: 'IA en Serveis Públics: Transformació Digital 2024',
      seoDescription: 'Explorem l\'impacte de la intel·ligència artificial en la millora dels serveis públics.',
      aiGenerated: true,
      aiAgent: 'contingut-web',
      language: 'catala',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Ciberseguridad en administraciones públicas: mejores prácticas',
      author: 'Pere Costa',
      category: 'Seguretat',
      status: 'published',
      publishDate: '2024-08-18',
      publishTime: '11:15',
      views: 892,
      likes: 45,
      content: 'La ciberseguridad es fundamental para proteger los datos ciudadanos y garantizar la continuidad...',
      tags: ['ciberseguritat', 'protecció dades', 'seguretat'],
      seoTitle: 'Ciberseguridad Administraciones Públicas - Guía 2024',
      seoDescription: 'Mejores prácticas de ciberseguridad para proteger las administraciones públicas.',
      aiGenerated: false,
      aiAgent: '',
      language: 'castella',
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop'
    }
  ])

  // Estados para fórums
  const [forumFilters, setForumFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [newForumTopic, setNewForumTopic] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    isPinned: false,
    isLocked: false,
    visibility: 'public',
    image: null as File | null
  })
  const [selectedForum, setSelectedForum] = useState<any>(null)
  const [showCreateForumModal, setShowCreateForumModal] = useState(false)
  const [showForumPreviewModal, setShowForumPreviewModal] = useState(false)
  
  // Estados para moderación consolidada con origen
  const [consolidatedModerationQueue, setConsolidatedModerationQueue] = useState([
    // Fòrums - Tema automáticamente detectado
    {
      id: 1,
      origin: 'forum',
      originIcon: 'Hash',
      type: 'forum_topic',
      title: 'Tema detectat com potencialment problemàtic',
      content: 'Aquest és un tema sobre els nous protocols que han implementat a la meva administració. Francament, són un caos total i no serveixen per a res. La persona responsable d\'això no té ni idea del que està fent, i sembla que només vol complicar-nos la vida als treballadors. A més, crec que hi ha interessos corruptes darrere d\'aquesta decisió...',
      author: 'Usuario123',
      category: 'Transformació Digital',
      parentContext: 'Tema: "Protocols de digitalització: dubtes i consultes"',
      locationPath: 'Fòrums > Transformació Digital > Protocols de digitalització',
      detected: ['spam', 'vulgar'],
      confidence: 85,
      status: 'pending',
      createdDate: '2024-08-25',
      moderationReason: 'Possible contingut inapropiat detectat per IA automàtica',
      actionUrl: 'forums/topic/1'
    },
    // Blogs - Comentario reportado manualmente
    {
      id: 2,
      origin: 'blog',
      originIcon: 'BookOpen',
      type: 'blog_comment',
      title: 'Comentari reportat per usuaris',
      content: 'L\'articulista clarament no entén res d\'IA. Les dades que presenta són completament falses i només serveixen per crear pánic innecessari. He llegit diversos estudis que contradiuen tot el que diu aquí. La IA no destruirà llocs de treball, tot el contrari, n\'hi crearà de nous. Aquesta informació és clarament errònia i hauria de ser eliminada.',
      author: 'UsuariAnonimo',
      category: 'Intel·ligència Artificial',
      parentContext: 'Blog: "L\'impacte de la IA en els serveis públics"',
      locationPath: 'Blogs > Intel·ligència Artificial > L\'impacte de la IA',
      detected: ['misinformation'],
      confidence: 72,
      status: 'pending',
      createdDate: '2024-08-24',
      moderationReason: 'Reportat per 3 usuaris com a informació incorrecta',
      actionUrl: 'blogs/post/3/comments',
      reportedBy: ['Maria Puig', 'Joan Martí', 'Pere Costa'],
      reportCount: 3
    },
    // Feed - Post automáticamente bloqueado
    {
      id: 3,
      origin: 'feed',
      originIcon: 'Home',
      type: 'feed_post',
      title: 'Post bloquejat automàticament',
      content: '🔥 OFERTA ESPECIAL NOMÉS AVUI! 🔥 Software de gestió empresarial amb 90% de descompte! Contacta\'ns ara per obtenir preus exclusius. Més de 10.000 clients satisfets! ✅ Garantia total ✅ Suport 24/7. WhatsApp: 600-XXX-XXX. NO et perdis aquesta oportunitat única!!!',
      author: 'empresa_test',
      category: 'General',
      parentContext: 'Feed Principal',
      locationPath: 'Feed Principal > Posts recents',
      detected: ['spam'],
      confidence: 94,
      status: 'blocked',
      createdDate: '2024-08-25',
      moderationReason: 'Bloquejat automàticament per alt nivell de spam',
      actionUrl: 'feed/post/156'
    },
    // Tablón de anuncios - Anuncio de miembro detectado
    {
      id: 4,
      origin: 'announcements',
      originIcon: 'Megaphone',
      type: 'announcement_member',
      title: 'Venda de vehicle particular',
      content: 'Venc el meu cotxe Seat Leon 2019, molt bon estat, tots els manteniments al dia. Preu: 15.000€ negociables. Contacte: 600-XXX-XXX. Aprofiteu aquesta oportunitat única!',
      author: 'Pere Costa',
      category: 'Compravenda',
      parentContext: 'Taulell d\'Anuncis > Anuncis de Membres',
      locationPath: 'Taulell d\'Anuncis > Compravenda',
      detected: ['commercial', 'spam'],
      confidence: 85,
      status: 'flagged',
      createdDate: '2024-08-25',
      moderationReason: 'Possible contingut comercial no autoritzat detectat automàticament',
      actionUrl: 'announcements/member/1'
    }
  ])

  // Estado para controlar reportes expandidos
  const [expandedReports, setExpandedReports] = useState<Set<number>>(new Set())

  const toggleReportExpansion = (reportId: number) => {
    const newExpanded = new Set(expandedReports)
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId)
    } else {
      newExpanded.add(reportId)
    }
    setExpandedReports(newExpanded)
  }

  // Estados para tablón de anuncios  
  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'normal',
    isPinned: false,
    expiresAt: '',
    coverImage: null as File | null,
    images: [] as File[],
    files: [] as File[]
  })
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Nous protocols de teletreball aprovats',
      content: 'A partir del proper mes, entraran en vigor els nous protocols de teletreball per a tots els empleats públics. Podeu consultar la documentació completa a la intranet.',
      author: 'Maria Puig - Recursos Humans',
      priority: 'high',
      isPinned: true,
      publishDate: '2024-08-20',
      views: 1247,
      expiresAt: '2024-09-20',
      coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop'
      ],
      files: [
        { name: 'protocol_teletreball.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'guia_aplicacio.docx', size: '1.1 MB', type: 'doc' }
      ]
    },
    {
      id: 2,
      title: 'Manteniment del sistema informàtic',
      content: 'El dimarts 27 d\'agost de 22:00 a 06:00 hi haurà manteniment programat dels sistemes. Durant aquest temps alguns serveis podrien no estar disponibles.',
      author: 'Joan Martí - IT',
      priority: 'urgent',
      isPinned: false,
      publishDate: '2024-08-25',
      views: 892,
      expiresAt: '2024-08-28',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=400&fit=crop',
      images: [],
      files: []
    },
    {
      id: 3,
      title: 'Curs de formació sobre IA generativa',
      content: 'Oberta la inscripció per al curs "Intel·ligència Artificial aplicada a l\'Administració Pública". Places limitades.',
      author: 'Laura Vidal - Formació',
      priority: 'normal',
      isPinned: false,
      publishDate: '2024-08-22',
      views: 634,
      expiresAt: null,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop'
      ],
      files: [
        { name: 'programa_curs_ia.pdf', size: '1.8 MB', type: 'pdf' },
        { name: 'inscripcio.xlsx', size: '0.5 MB', type: 'excel' }
      ]
    }
  ])

  const [memberAnnouncements, setMemberAnnouncements] = useState([
    {
      id: 1,
      title: 'Venda de vehicle particular',
      content: 'Venc el meu cotxe Seat Leon 2019, molt bon estat, tots els manteniments al dia. Preu: 15.000€ negociables. Contacte: 600-XXX-XXX. Aprofiteu aquesta oportunitat única!',
      author: 'Pere Costa',
      category: 'Compravenda',
      status: 'flagged',
      confidence: 85,
      moderationReason: 'Possible contingut comercial no autoritzat',
      createdDate: '2024-08-25'
    },
    {
      id: 2,
      title: 'Classes particulars d\'anglès',
      content: 'Soc professora titulada amb 10 anys d\'experiència. Ofereixo classes particulars d\'anglès a domicili. Preu especialment econòmic per a companys de l\'administració. Truqueu-me!',
      author: 'Anna Soler',
      category: 'Serveis',
      status: 'blocked',
      confidence: 92,
      moderationReason: 'Contingut promocional comercial bloquejat automàticament',
      createdDate: '2024-08-24'
    },
    {
      id: 3,
      title: 'Busco cotxe compartit per anar a la feina',
      content: 'Hola! Busco algú que vagi des de Sabadell cap al centre de Barcelona per compartir cotxe i despeses. Horari flexible entre 8:00-9:00. Si algú està interessat, podem parlar!',
      author: 'David Rodríguez',
      category: 'Transport',
      status: 'pending',
      confidence: 45,
      moderationReason: 'Revisió manual necessària - contingut dubtós',
      createdDate: '2024-08-25'
    }
  ])

  // Funciones para gestión de anuncios
  const handleEditAnnouncement = (announcement: any) => {
    // TODO: Implementar edición de anuncios
    console.log('Editando anuncio:', announcement)
  }

  const handleDeleteAnnouncement = (id: number) => {
    if (confirm('Estàs segur que vols eliminar aquest anunci?')) {
      setAnnouncements(announcements.filter(a => a.id !== id))
    }
  }

  const handleApproveMemberAnnouncement = (id: number) => {
    setMemberAnnouncements(prev => 
      prev.map(a => a.id === id ? {...a, status: 'approved'} : a)
    )
    alert('Anunci aprovat i publicat al taulell!')
  }

  const handleRejectMemberAnnouncement = (id: number) => {
    if (confirm('Estàs segur que vols rebutjar aquest anunci?')) {
      setMemberAnnouncements(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleEditMemberAnnouncement = (id: number) => {
    // TODO: Implementar edición de anuncios de miembros
    console.log('Editando anuncio de miembro:', id)
  }

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert('Si us plau, omple tots els camps obligatoris')
      return
    }

    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      author: 'Admin - ' + currentCommunity?.nombre,
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      // Convertir archivos a URLs para mostrar
      coverImage: newAnnouncement.coverImage ? URL.createObjectURL(newAnnouncement.coverImage) : '',
      images: newAnnouncement.images.map(img => URL.createObjectURL(img)),
      files: newAnnouncement.files.map(file => ({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.type || 'unknown'
      }))
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'normal',
      isPinned: false,
      expiresAt: '',
      coverImage: null,
      images: [],
      files: []
    })
    setShowCreateAnnouncementModal(false)
    alert('Anunci creat correctament!')
  }
  
  // Datos mock para fórums
  const [forumTopics, setForumTopics] = useState([
    {
      id: 1,
      title: 'Protocols de digitalització: dubtes i consultes',
      author: 'Joan Martí',
      category: 'Transformació Digital',
      status: 'active',
      createdDate: '2024-08-20',
      lastActivity: '2024-08-25',
      replies: 23,
      views: 456,
      isPinned: true,
      isLocked: false,
      tags: ['digitalització', 'protocols', 'consultes'],
      content: 'Obrim aquest fil per resoldre dubtes sobre els nous protocols de digitalització implementats...',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop',
      lastReply: {
        author: 'Maria Puig',
        date: '2024-08-25',
        time: '14:30'
      }
    },
    {
      id: 2,
      title: 'Compartim experiències amb IA en administracions locals',
      author: 'Laura Vidal',
      category: 'Intel·ligència Artificial',
      status: 'active',
      createdDate: '2024-08-22',
      lastActivity: '2024-08-24',
      replies: 12,
      views: 298,
      isPinned: false,
      isLocked: false,
      tags: ['IA', 'experiències', 'administracions locals'],
      content: 'Ens agradaria conèixer les vostres experiències implementant solucions d\'IA...',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
      lastReply: {
        author: 'Pere Costa',
        date: '2024-08-24',
        time: '16:45'
      }
    },
    {
      id: 3,
      title: 'RESOLT: Problemes amb certificats digitals',
      author: 'Carles Soler',
      category: 'Seguretat',
      status: 'resolved',
      createdDate: '2024-08-18',
      lastActivity: '2024-08-20',
      replies: 8,
      views: 187,
      isPinned: false,
      isLocked: true,
      tags: ['certificats', 'seguretat', 'resolt'],
      content: 'Hem tingut problemes amb la validació de certificats digitals...',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=300&fit=crop',
      lastReply: {
        author: 'Admin Tècnic',
        date: '2024-08-20',
        time: '09:15'
      }
    },
    {
      id: 4,
      title: 'Propostes millora: Portal ciutadà',
      author: 'Anna Puig',
      category: 'Metodologies',
      status: 'active',
      createdDate: '2024-08-19',
      lastActivity: '2024-08-23',
      replies: 31,
      views: 672,
      isPinned: false,
      isLocked: false,
      tags: ['portal ciutadà', 'millores', 'UX'],
      content: 'Recollim propostes per millorar l\'experiència d\'usuari del portal...',
      visibility: 'public',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=300&fit=crop',
      lastReply: {
        author: 'David Font',
        date: '2024-08-23',
        time: '11:20'
      }
    }
  ])
  
  // Datos mock para posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Nova normativa de digitalització aprovada',
      content: 'S\'ha aprovat la nova normativa per accelerar els processos de digitalització...',
      author: 'Joan Martí',
      authorRole: 'Funcionari',
      date: '2024-08-25',
      type: 'announcement',
      pinned: true,
      likes: 23,
      comments: 5
    },
    {
      id: 2, 
      title: 'Reunió de coordinació setmanal',
      content: 'Recordatori de la reunió de coordinació que tindrà lloc demà...',
      author: 'Laura Castell',
      authorRole: 'Administració',
      date: '2024-08-24',
      type: 'event',
      pinned: false,
      likes: 12,
      comments: 3
    },
    {
      id: 3,
      title: 'Nova oferta de treball disponible',
      content: 'TechInnovació busca desenvolupador full-stack per projectes amb l\'administració...',
      author: 'TechInnovació SL',
      authorRole: 'Empresa',
      date: '2024-08-23',
      type: 'job',
      pinned: false,
      likes: 18,
      comments: 8
    }
  ])

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'general',
    pinned: false,
    image: null as File | null,
    video: null as File | null,
    files: [] as File[],
    link: '',
    poll: null as any
  })

  // Estados para sistema de moderación
  const [moderationFilters, setModerationFilters] = useState({
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    priority: 'all'
  })

  // Estados para gestión de grupos
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [groupFilters, setGroupFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    members: 'all'
  })
  const [newGroup, setNewGroup] = useState({
    nom: '',
    descripcio: '',
    descripcioLarga: '',
    avatar: null as File | null,
    portada: null as File | null,
    tipus: 'publico',
    categoria: 'afinidad', // afinidad | profesional | geografico
    subcategoria: '',
    grupPareId: null as string | null, // ID del grup pare (null si és grup principal)
    subgrups: [] as string[], // IDs dels subgrups
    nivel: 0, // 0 = grup principal, 1-4 = subgrups
    administradors: [] as string[],
    moderadors: [] as string[],
    regles: [] as string[],
    etiquetes: [] as string[],
    esDestacado: false,
    teOfertes: false, // Si el grup té ofertes exclusives
    ofertes: [] as any[], // Array d'ofertes del grup
    configuracion: {
      ofertasExclusivas: false,
      requireApproval: true,
      allowMemberPosts: true
    }
  })

  // Estados para gestionar administradores y moderadores
  const [newAdmin, setNewAdmin] = useState('')
  const [newModerator, setNewModerator] = useState('')
  
  // Estados para vista previa
  const [showPreviewGroupModal, setShowPreviewGroupModal] = useState(false)
  const [previewMode, setPreviewMode] = useState<'card' | 'single'>('card')

  // Función para resetear el formulario
  const resetGroupForm = () => {
    setNewGroup({
      nom: '',
      descripcio: '',
      descripcioLarga: '',
      avatar: null,
      portada: null,
      tipus: 'publico',
      categoria: 'afinidad',
      subcategoria: '',
      grupPareId: null,
      subgrups: [],
      nivel: 0,
      administradors: [],
      moderadors: [],
      regles: [],
      etiquetes: [],
      esDestacado: false,
      teOfertes: false,
      ofertes: [],
      configuracion: {
        ofertasExclusivas: false,
        requireApproval: true,
        allowMemberPosts: true
      }
    })
    setNewAdmin('')
    setNewModerator('')
  }

  // Datos mock para grupos
  const [groups, setGroups] = useState([
    {
      id: 1,
      nom: 'Desenvolupadors Web Catalunya',
      categoria: 'profesional',
      subcategoria: 'Tecnologia',
      membres: 245,
      administradors: ['Joan Martinez'],
      estat: 'Actiu',
      dataCreacio: '2024-01-15',
      tipus: 'publico',
      descripcio: 'Grup per desenvolupadors web de Catalunya per compartir coneixements i experiències',
      descripcioLarga: 'Aquest grup està dedicat als professionals del desenvolupament web que treballen a Catalunya. Compartim recursos, experiències i oportunitats laborals en l\'àmbit de la tecnologia web.',
      avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=face',
      portada: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=200&fit=crop',
      moderadors: ['Maria Garcia', 'Pere Rodriguez'],
      etiquetes: ['React', 'Vue.js', 'JavaScript', 'PHP'],
      esDestacado: true,
      grupPareId: null,
      subgrups: ['6', '7'], // Té 2 subgrups
      nivel: 0,
      teOfertes: true,
      ofertes: [
        { id: 1, title: 'Curs React Avançat', discount: 20, company: 'TechAcademy' },
        { id: 2, title: 'Licència IntelliJ IDEA', discount: 15, company: 'JetBrains' }
      ],
      configuracion: { ofertasExclusivas: true, requireApproval: false, allowMemberPosts: true }
    },
    {
      id: 2,
      nom: 'Recursos Humans Generalitat',
      categoria: 'profesional',
      subcategoria: 'Administració',
      membres: 128,
      administradors: ['Ana Puig', 'Carme Roca'],
      estat: 'Actiu',
      dataCreacio: '2024-02-20',
      tipus: 'privado',
      descripcio: 'Grup privat per personal de RRHH de la Generalitat',
      descripcioLarga: 'Grup professional exclusiu per al personal de recursos humans que treballa a la Generalitat de Catalunya. Espai per compartir bones pràctiques i normatives.',
      avatar: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=100&h=100&fit=crop&crop=face',
      portada: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&h=200&fit=crop',
      moderadors: ['Laura Vidal'],
      etiquetes: ['RRHH', 'Gestió', 'Normatives'],
      esDestacado: false,
      grupPareId: null,
      subgrups: [],
      nivel: 0,
      teOfertes: false,
      ofertes: [],
      configuracion: { ofertasExclusivas: false, requireApproval: true, allowMemberPosts: true }
    },
    {
      id: 3,
      nom: 'Innovació Digital Sector Públic',
      categoria: 'profesional',
      subcategoria: 'Transformació Digital',
      membres: 89,
      administradors: ['Carles Soler'],
      estat: 'Actiu',
      dataCreacio: '2024-03-10',
      tipus: 'publico',
      descripcio: 'Espai per compartir iniciatives d\'innovació digital en el sector públic',
      descripcioLarga: 'Grup dedicat a professionals que treballen en la transformació digital del sector públic. Compartim casos d\'èxit, eines digitals i metodologies innovadores.',
      avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=face',
      portada: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=200&fit=crop',
      moderadors: ['Elena Rius', 'Jordi Mas'],
      etiquetes: ['Innovació', 'Digital', 'Administració'],
      esDestacado: true,
      grupPareId: null,
      subgrups: [],
      nivel: 0,
      teOfertes: true,
      ofertes: [{ id: 3, title: 'Microsoft Office 365', discount: 25, company: 'Microsoft' }],
      configuracion: { ofertasExclusivas: true, requireApproval: false, allowMemberPosts: true }
    },
    {
      id: 4,
      nom: 'Col·lectiu Docents Catalunya',
      categoria: 'geografico',
      subcategoria: 'Educació',
      membres: 312,
      administradors: ['Montse Vila', 'Pere Català'],
      estat: 'Actiu',
      dataCreacio: '2024-01-30',
      tipus: 'publico',
      descripcio: 'Grup dedicat als docents del sector públic de Catalunya',
      descripcioLarga: 'Comunitat de docents que treballen en centres educatius públics de Catalunya. Compartim recursos educatius, metodologies i experiències pedagògiques.',
      avatar: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop&crop=face',
      portada: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=200&fit=crop',
      moderadors: ['Albert Costa'],
      etiquetes: ['Educació', 'Pedagogia', 'Catalunya'],
      esDestacado: false,
      grupPareId: null,
      subgrups: ['8'],
      nivel: 0,
      teOfertes: false,
      ofertes: [],
      configuracion: { ofertasExclusivas: false, requireApproval: false, allowMemberPosts: true }
    },
    {
      id: 5,
      nom: 'Projectes Confidencials',
      categoria: 'profesional',
      subcategoria: 'Gestió',
      membres: 45,
      administradors: ['David Font'],
      estat: 'Arxivat',
      dataCreacio: '2023-11-15',
      tipus: 'oculto',
      descripcio: 'Grup per projectes especials i confidencials',
      descripcioLarga: 'Grup secret per a la gestió de projectes confidencials i d\'alta seguretat dins de l\'administració pública.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      portada: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=200&fit=crop',
      moderadors: ['Núria Bach'],
      etiquetes: ['Confidencial', 'Projectes'],
      esDestacado: false,
      grupPareId: null,
      subgrups: [],
      nivel: 0,
      teOfertes: false,
      ofertes: [],
      configuracion: { ofertasExclusivas: false, requireApproval: true, allowMemberPosts: false }
    },
    // Subgrupos de ejemplo
    {
      id: 6,
      nom: 'Frontend Developers',
      categoria: 'profesional',
      subcategoria: 'Desenvolupament Frontend',
      membres: 89,
      administradors: ['Laura Vidal'],
      estat: 'Actiu',
      dataCreacio: '2024-03-01',
      tipus: 'publico',
      descripcio: 'Subgrup especialitzat en desenvolupament frontend',
      descripcioLarga: 'Subgrup dedicat exclusivament al desenvolupament frontend dins del grup de Desenvolupadors Web Catalunya.',
      avatar: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=100&h=100&fit=crop',
      portada: null,
      moderadors: ['Carles Font'],
      etiquetes: ['React', 'Angular', 'Vue.js', 'CSS'],
      esDestacado: false,
      grupPareId: '1', // Pare: Desenvolupadors Web Catalunya
      subgrups: [],
      nivel: 1,
      teOfertes: false,
      ofertes: [],
      configuracion: { ofertasExclusivas: false, requireApproval: false, allowMemberPosts: true }
    },
    {
      id: 7,
      nom: 'Backend Developers',
      categoria: 'profesional',
      subcategoria: 'Desenvolupament Backend',
      membres: 67,
      administradors: ['Pere Rodriguez'],
      estat: 'Actiu',
      dataCreacio: '2024-03-05',
      tipus: 'publico',
      descripcio: 'Subgrup especialitzat en desenvolupament backend',
      descripcioLarga: 'Subgrup dedicat al desenvolupament backend i APIs dins del grup de Desenvolupadors Web Catalunya.',
      avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=100&h=100&fit=crop',
      portada: null,
      moderadors: ['Anna Soler'],
      etiquetes: ['Node.js', 'Python', 'Java', 'API'],
      esDestacado: false,
      grupPareId: '1', // Pare: Desenvolupadors Web Catalunya
      subgrups: [],
      nivel: 1,
      teOfertes: true,
      ofertes: [{ id: 4, title: 'AWS Credits', discount: 50, company: 'Amazon Web Services' }],
      configuracion: { ofertasExclusivas: true, requireApproval: false, allowMemberPosts: true }
    },
    {
      id: 8,
      nom: 'Educació Infantil',
      categoria: 'geografico',
      subcategoria: 'Educació Infantil',
      membres: 45,
      administradors: ['Montse Rius'],
      estat: 'Actiu',
      dataCreacio: '2024-04-10',
      tipus: 'publico',
      descripcio: 'Subgrup per docents d\'educació infantil',
      descripcioLarga: 'Subgrup especialitzat en metodologies i recursos per a l\'educació infantil.',
      avatar: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
      portada: null,
      moderadors: ['Carme Vila'],
      etiquetes: ['Infantil', 'Pedagogia', 'Recursos'],
      esDestacado: false,
      grupPareId: '4', // Pare: Col·lectiu Docents Catalunya
      subgrups: [],
      nivel: 1,
      teOfertes: false,
      ofertes: [],
      configuracion: { ofertasExclusivas: false, requireApproval: false, allowMemberPosts: true }
    }
  ])

  // Datos mock para reportes
  const [reports, setReports] = useState([
    {
      id: 1,
      postId: 'post-123',
      postContent: 'Aquest contingut pot ser inadequat per la plataforma...',
      reportedBy: 'Joan Martí',
      reportedUser: 'Pere Llopis',
      reportDate: '2024-08-25',
      category: 'spam',
      priority: 'medium',
      status: 'pending',
      description: 'Contingut repetitiu i irrelevant',
      moderatorNotes: ''
    },
    {
      id: 2,
      postId: 'post-124',
      postContent: 'Missatge amb llenguatge ofensiu...',
      reportedBy: 'Maria Gonzàlez',
      reportedUser: 'Jordi Puig',
      reportDate: '2024-08-24',
      category: 'inappropriate',
      priority: 'high',
      status: 'in_review',
      description: 'Llenguatge ofensiu i discriminatori',
      moderatorNotes: 'En revisió per l\'equip legal'
    },
    {
      id: 3,
      postId: 'post-125',
      postContent: 'Informació falsa sobre polítiques públiques...',
      reportedBy: 'Laura Vidal',
      reportedUser: 'Carles Font',
      reportDate: '2024-08-23',
      category: 'misinformation',
      priority: 'critical',
      status: 'resolved',
      description: 'Desinformació sobre normatives',
      moderatorNotes: 'Post eliminat i usuari advertit'
    }
  ])

  // Datos mock para usuarios suspendidos
  const [suspendedUsers, setSuspendedUsers] = useState([
    {
      id: 1,
      userName: 'Pere Llopis',
      userEmail: 'pere.llopis@example.com',
      suspensionDate: '2024-08-20',
      suspensionEnd: '2024-08-27',
      reason: 'Spam repetitiu',
      reportsCount: 3,
      status: 'active'
    },
    {
      id: 2,
      userName: 'Jordi Puig',
      userEmail: 'jordi.puig@example.com',
      suspensionDate: '2024-08-22',
      suspensionEnd: '2024-08-29',
      reason: 'Llenguatge ofensiu',
      reportsCount: 2,
      status: 'active'
    }
  ])

  // Estadísticas de moderación
  const [moderationStats, setModerationStats] = useState({
    totalReports: 15,
    pendingReports: 8,
    resolvedToday: 3,
    suspendedUsers: 2,
    mostReportedCategory: 'spam',
    averageResolutionTime: '2.5 hores',
    autoBlockedToday: 12,
    autoReviewedToday: 8,
    falsePositives: 2,
    byOrigin: {
      forum: {
        pending: 3,
        resolved: 1,
        blocked: 2
      },
      blog: {
        pending: 2,
        resolved: 1,
        blocked: 1
      },
      feed: {
        pending: 3,
        resolved: 1,
        blocked: 1
      },
      announcements: {
        pending: 1,
        resolved: 0,
        blocked: 2
      }
    }
  })

  // Sistema de moderación automática
  const [autoModerationConfig, setAutoModerationConfig] = useState({
    enabled: true,
    strictnessLevel: 'medium', // low, medium, high, strict
    autoBlock: true,
    autoReview: true,
    notifyModerators: true,
    categories: {
      homophobic: { enabled: true, action: 'block' },
      sexist: { enabled: true, action: 'block' },
      racist: { enabled: true, action: 'block' },
      violence: { enabled: true, action: 'review' },
      hate: { enabled: true, action: 'block' },
      spam: { enabled: true, action: 'review' },
      vulgar: { enabled: true, action: 'review' },
      misinformation: { enabled: true, action: 'review' }
    }
  })

  // Listas de palabras problemáticas (mock - en producción serían más extensas)
  const contentFilters = {
    homophobic: [
      'marimacho', 'marica', 'bollera', 'travelo', 'raruno', 'afeminado'
    ],
    sexist: [
      'zorra', 'puta', 'guarra', 'frígida', 'histérica', 'feminazi'
    ],
    racist: [
      'negro de mierda', 'moro', 'sudaca', 'chino', 'panchito', 'gitano'
    ],
    violence: [
      'matar', 'morir', 'suicidio', 'asesinar', 'golpear', 'pegar'
    ],
    hate: [
      'odio', 'desprecio', 'asco', 'muerte', 'eliminar', 'destruir'
    ],
    spam: [
      'compra ahora', 'oferta especial', 'dinero fácil', 'haz clic aquí', 'gratis'
    ],
    vulgar: [
      'joder', 'mierda', 'coño', 'polla', 'gilipollas', 'cabrón', 'hijo de puta'
    ],
    misinformation: [
      'vacunas causan', 'teoría conspiración', 'gobierno oculta', 'fake news', 'mentira oficial'
    ]
  }

  // Estado para contenido bloqueado automáticamente
  const [autoBlockedContent, setAutoBlockedContent] = useState([
    {
      id: 1,
      content: 'Aquest contingut conté llenguatge homòfob...',
      author: 'Usuario1',
      detectedCategory: 'homophobic',
      confidence: 95,
      timestamp: new Date().toISOString(),
      action: 'blocked',
      reviewed: false
    },
    {
      id: 2,
      content: 'Missatge amb contingut sexista...',
      author: 'Usuario2', 
      detectedCategory: 'sexist',
      confidence: 88,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'blocked',
      reviewed: false
    }
  ])
  
  // Estado para nueva comunidad
  const [newCommunity, setNewCommunity] = useState({
    nombre: '',
    codigo: '',
    host: '',
    idiomas: ['es'],
    idiomaDefecto: 'es',
    provincias: [],
    tema: {
      colorPrimario: '#0066CC',
      colorSecundario: '#FF6B35', 
      colorAccento: '#4CAF50'
    }
  })

  const handleSaveVisualConfig = () => {
    alert(`Configuració visual guardada per ${currentCommunity?.nombre}`)
  }

  const handleSaveRolesConfig = () => {
    alert(`Configuració de rols guardada per ${currentCommunity?.nombre}`)
  }

  const handleSaveContentConfig = () => {
    alert(`Configuració de contingut guardada per ${currentCommunity?.nombre}`)
  }

  // Funciones para gestión de posts
  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      // Análisis automático de contenido
      const analysisResult = analyzeContent(newPost.content, newPost.title)
      
      if (!analysisResult.allowed) {
        // Contenido bloqueado automáticamente
        handleAutoModerationResult(analysisResult, newPost.content, newPost.title)
        alert(analysisResult.message)
        return
      }

      if (analysisResult.requiresReview) {
        // Contenido requiere revisión
        handleAutoModerationResult(analysisResult, newPost.content, newPost.title)
        alert(`${analysisResult.message} Confiança de detecció: ${analysisResult.confidence}%`)
      }

      const post = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        author: 'Administrador',
        authorRole: 'Admin',
        date: new Date().toISOString().split('T')[0],
        type: newPost.type,
        pinned: newPost.pinned,
        likes: 0,
        comments: 0,
        image: newPost.image ? URL.createObjectURL(newPost.image) : null,
        video: newPost.video ? URL.createObjectURL(newPost.video) : null,
        files: newPost.files,
        link: newPost.link,
        autoModerated: analysisResult.requiresReview,
        moderationResult: analysisResult
      }
      setPosts([post, ...posts])
      setNewPost({ 
        title: '', 
        content: '', 
        type: 'general', 
        pinned: false, 
        image: null, 
        video: null, 
        files: [], 
        link: '',
        poll: null 
      })
      setShowCreatePostModal(false)
      
      if (analysisResult.requiresReview) {
        alert('Post creat i marcat per a revisió automàtica!')
      } else {
        alert('Post creat correctament!')
      }
    }
  }

  const handleDeletePost = (id: number) => {
    if (confirm('Estàs segur que vols eliminar aquest post?')) {
      setPosts(posts.filter(post => post.id !== id))
    }
  }

  const handleTogglePin = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, pinned: !post.pinned } : post
    ))
  }

  const filteredPosts = posts.filter(post => {
    if (postFilters.author && !post.author.toLowerCase().includes(postFilters.author.toLowerCase())) {
      return false
    }
    if (postFilters.contentType !== 'all' && post.type !== postFilters.contentType) {
      return false
    }
    if (postFilters.dateFrom && post.date < postFilters.dateFrom) {
      return false
    }
    if (postFilters.dateTo && post.date > postFilters.dateTo) {
      return false
    }
    return true
  })

  const handlePreviewPost = () => {
    if (newPost.title || newPost.content) {
      setShowPreviewModal(true)
    }
  }

  const handlePreviewAnnouncement = () => {
    if (newAnnouncement.title || newAnnouncement.content) {
      setShowAnnouncementPreviewModal(true)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPost({...newPost, image: file})
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPost({...newPost, video: file})
    }
  }

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewPost({...newPost, files: [...newPost.files, ...files]})
    }
  }

  const removeFile = (index: number) => {
    const newFiles = newPost.files.filter((_, i) => i !== index)
    setNewPost({...newPost, files: newFiles})
  }

  // Funciones para manejo de archivos en anuncios
  const handleAnnouncementCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewAnnouncement({...newAnnouncement, coverImage: file})
    }
  }

  const handleAnnouncementImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewAnnouncement({...newAnnouncement, images: [...newAnnouncement.images, ...files]})
    }
  }

  const handleAnnouncementFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setNewAnnouncement({...newAnnouncement, files: [...newAnnouncement.files, ...files]})
    }
  }

  const removeAnnouncementImage = (index: number) => {
    const newImages = newAnnouncement.images.filter((_, i) => i !== index)
    setNewAnnouncement({...newAnnouncement, images: newImages})
  }

  const removeAnnouncementFile = (index: number) => {
    const newFiles = newAnnouncement.files.filter((_, i) => i !== index)
    setNewAnnouncement({...newAnnouncement, files: newFiles})
  }

  // Funciones para moderación
  const handleUpdateReportStatus = (reportId: number, newStatus: string, notes?: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus, moderatorNotes: notes || report.moderatorNotes }
        : report
    ))
  }

  const handleSuspendUser = (reportId: number, days: number, reason: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report) {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + days)
      
      const suspension = {
        id: suspendedUsers.length + 1,
        userName: report.reportedUser,
        userEmail: `${report.reportedUser.toLowerCase().replace(' ', '.')}@example.com`,
        suspensionDate: new Date().toISOString().split('T')[0],
        suspensionEnd: endDate.toISOString().split('T')[0],
        reason: reason,
        reportsCount: reports.filter(r => r.reportedUser === report.reportedUser).length,
        status: 'active'
      }
      
      setSuspendedUsers([...suspendedUsers, suspension])
      handleUpdateReportStatus(reportId, 'resolved', `Usuari suspès per ${days} dies. Motiu: ${reason}`)
      alert(`Usuari ${report.reportedUser} suspès per ${days} dies`)
    }
  }

  const filteredReports = reports.filter(report => {
    if (moderationFilters.status !== 'all' && report.status !== moderationFilters.status) {
      return false
    }
    if (moderationFilters.category !== 'all' && report.category !== moderationFilters.category) {
      return false
    }
    if (moderationFilters.priority !== 'all' && report.priority !== moderationFilters.priority) {
      return false
    }
    if (moderationFilters.dateFrom && report.reportDate < moderationFilters.dateFrom) {
      return false
    }
    if (moderationFilters.dateTo && report.reportDate > moderationFilters.dateTo) {
      return false
    }
    return true
  })

  // Sistema de moderación automática
  const analyzeContent = (content: string, title?: string) => {
    if (!autoModerationConfig.enabled) return { allowed: true }

    const fullText = `${title || ''} ${content}`.toLowerCase()
    const detected = []
    let maxConfidence = 0
    let worstCategory = null

    // Analizar cada categoría
    Object.entries(contentFilters).forEach(([category, words]) => {
      if (!autoModerationConfig.categories[category]?.enabled) return

      const matches = words.filter(word => fullText.includes(word.toLowerCase()))
      if (matches.length > 0) {
        const confidence = Math.min(95, 60 + (matches.length * 15))
        detected.push({
          category,
          matches: matches.length,
          confidence,
          action: autoModerationConfig.categories[category].action
        })

        if (confidence > maxConfidence) {
          maxConfidence = confidence
          worstCategory = category
        }
      }
    })

    // Determinar acción
    if (detected.length === 0) {
      return { allowed: true }
    }

    const worstDetection = detected.find(d => d.category === worstCategory)
    const action = worstDetection?.action || 'review'

    return {
      allowed: action !== 'block',
      requiresReview: action === 'review' || action === 'block',
      detected,
      worstCategory,
      confidence: maxConfidence,
      action,
      message: action === 'block' 
        ? 'El contingut ha estat bloquejat automàticament per contenir llenguatge inapropiat.'
        : 'El contingut serà revisat abans de ser publicat.'
    }
  }

  const handleAutoModerationResult = (result: any, content: string, title?: string) => {
    if (!result.allowed) {
      // Contenido bloqueado - añadir a lista de bloqueados
      const blockedItem = {
        id: autoBlockedContent.length + 1,
        content: `${title ? title + ': ' : ''}${content.substring(0, 100)}...`,
        author: 'Administrador',
        detectedCategory: result.worstCategory,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        action: 'blocked',
        reviewed: false
      }
      setAutoBlockedContent([blockedItem, ...autoBlockedContent])
      
      // Actualizar estadísticas
      setModerationStats(prev => ({
        ...prev,
        autoBlockedToday: prev.autoBlockedToday + 1
      }))
    } else if (result.requiresReview) {
      // Contenido para revisión
      setModerationStats(prev => ({
        ...prev,
        autoReviewedToday: prev.autoReviewedToday + 1
      }))
    }

    return result
  }

  const handleCreateCommunity = () => {
    if (newCommunity.nombre && newCommunity.codigo) {
      // Aquí se crearía la nueva comunidad
      alert(`Nova comunitat "${newCommunity.nombre}" creada correctament!`)
      setShowNewCommunityModal(false)
      setNewCommunity({
        nombre: '',
        codigo: '',
        host: '',
        idiomas: ['es'],
        idiomaDefecto: 'es',
        provincias: [],
        tema: {
          colorPrimario: '#0066CC',
          colorSecundario: '#FF6B35', 
          colorAccento: '#4CAF50'
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Tornar al Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-8 h-8 text-blue-600" />
                Gestió de Comunitats
              </h1>
            </div>
            <button 
              onClick={() => setShowNewCommunityModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Comunitat
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Selector de Comunitat */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Selecciona Comunitat Autònoma</h2>
              <p className="text-gray-600">Tria la comunitat que vols gestionar</p>
            </div>
            <div className="w-80">
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              >
                {comunitats.map((comunitat) => (
                  <option key={comunitat.codigo} value={comunitat.codigo}>
                    {comunitat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Información de la comunidad seleccionada */}
          {currentCommunity && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Idiomes:</span>
                  <p className="text-gray-900">{currentCommunity.idiomas.join(', ')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Host:</span>
                  <p className="text-gray-900">{currentCommunity.host}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Províncias:</span>
                  <p className="text-gray-900">{currentCommunity.provincias.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('visual')}
                className={`${
                  activeTab === 'visual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <Palette className="w-4 h-4" />
                Configuració Visual
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`${
                  activeTab === 'roles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <Users className="w-4 h-4" />
                Configuració per Rols
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <FileText className="w-4 h-4" />
                Gestió de Contingut
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <Eye className="w-4 h-4" />
                Vista Prèvia Completa
              </button>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`${
                  activeTab === 'moderation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <Shield className="w-4 h-4" />
                Moderació
                {moderationStats.pendingReports > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {moderationStats.pendingReports}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Pestaña Configuració Visual */}
            {activeTab === 'visual' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuració Visual per {currentCommunity?.nombre}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colors */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Colors Corporatius</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Primari</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={visualConfig.primaryColor}
                            onChange={(e) => setVisualConfig({...visualConfig, primaryColor: e.target.value})}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={visualConfig.primaryColor}
                            onChange={(e) => setVisualConfig({...visualConfig, primaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundari</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={visualConfig.secondaryColor}
                            onChange={(e) => setVisualConfig({...visualConfig, secondaryColor: e.target.value})}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={visualConfig.secondaryColor}
                            onChange={(e) => setVisualConfig({...visualConfig, secondaryColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color d'Accent</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={visualConfig.accentColor}
                            onChange={(e) => setVisualConfig({...visualConfig, accentColor: e.target.value})}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={visualConfig.accentColor}
                            onChange={(e) => setVisualConfig({...visualConfig, accentColor: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Logotips i Tipografia */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Logotips i Tipografia</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Principal</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Clica per pujar el logo (.png, .svg)</p>
                          <p className="text-xs text-gray-500">Mida recomanada: 200x60px</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Favicon (.ico, .png)</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Principal</label>
                        <select
                          value={visualConfig.fontFamily}
                          onChange={(e) => setVisualConfig({...visualConfig, fontFamily: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="Inter">Inter (Modern)</option>
                          <option value="Roboto">Roboto (Clean)</option>
                          <option value="Open Sans">Open Sans (Friendly)</option>
                          <option value="Montserrat">Montserrat (Bold)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Vista Prèvia</h4>
                    <div 
                      className="border border-gray-300 rounded-lg p-4"
                      style={{
                        backgroundColor: visualConfig.primaryColor + '10',
                        borderColor: visualConfig.primaryColor
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: visualConfig.primaryColor }}
                        ></div>
                        <h5 style={{ color: visualConfig.primaryColor, fontFamily: visualConfig.fontFamily }}>
                          {currentCommunity?.nombre}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">Aquest és un exemple de com es veurà la interfície amb els colors seleccionats.</p>
                      <button 
                        className="mt-2 px-3 py-1 rounded text-sm text-white"
                        style={{ backgroundColor: visualConfig.accentColor }}
                      >
                        Botó d'exemple
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleSaveVisualConfig}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Configuració Visual
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Configuració per Rols */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuració per Rols - {currentCommunity?.nombre}</h3>
                  <p className="text-gray-600 mb-6">Defineix quins widgets i funcionalitats són visibles per cada tipus d'usuari</p>
                  
                  <div className="space-y-6">
                    {Object.entries(rolesConfig).map(([role, config]) => (
                      <div key={role} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 capitalize">{role}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Permisos</h5>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={config.canCreateGroups}
                                  onChange={(e) => setRolesConfig({
                                    ...rolesConfig,
                                    [role]: { ...config, canCreateGroups: e.target.checked }
                                  })}
                                  className="rounded border-gray-300 text-blue-600 mr-2"
                                />
                                Pot crear grups
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={config.canPublishOffers}
                                  onChange={(e) => setRolesConfig({
                                    ...rolesConfig,
                                    [role]: { ...config, canPublishOffers: e.target.checked }
                                  })}
                                  className="rounded border-gray-300 text-blue-600 mr-2"
                                />
                                Pot publicar ofertes
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={config.canAccessPrivateContent}
                                  onChange={(e) => setRolesConfig({
                                    ...rolesConfig,
                                    [role]: { ...config, canAccessPrivateContent: e.target.checked }
                                  })}
                                  className="rounded border-gray-300 text-blue-600 mr-2"
                                />
                                Accés a contingut privat
                              </label>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Widgets Visibles</h5>
                            <div className="space-y-2">
                              {['news', 'events', 'offers', 'forums', 'documents', 'surveys'].map((widget) => (
                                <label key={widget} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={config.visibleWidgets.includes(widget)}
                                    onChange={(e) => {
                                      const newWidgets = e.target.checked 
                                        ? [...config.visibleWidgets, widget]
                                        : config.visibleWidgets.filter(w => w !== widget)
                                      setRolesConfig({
                                        ...rolesConfig,
                                        [role]: { ...config, visibleWidgets: newWidgets }
                                      })
                                    }}
                                    className="rounded border-gray-300 text-blue-600 mr-2"
                                  />
                                  {widget.charAt(0).toUpperCase() + widget.slice(1)}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleSaveRolesConfig}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Configuració de Rols
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Gestió de Contingut */}
            {activeTab === 'content' && (
              <div className="flex h-[800px]">
                {/* Menú lateral */}
                <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestió de Contingut</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setContentManagementSection('feed')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'feed'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      Feed
                    </button>
                    <button
                      onClick={() => setContentManagementSection('grups')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'grups'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Grups
                    </button>
                    <button
                      onClick={() => setContentManagementSection('blogs')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'blogs'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      Blogs
                    </button>
                    <button
                      onClick={() => setContentManagementSection('forums')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'forums'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Hash className="w-4 h-4" />
                      Fòrums
                    </button>
                    <button
                      onClick={() => setContentManagementSection('tauell')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'tauell'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Megaphone className="w-4 h-4" />
                      Taulell d'Anuncis
                    </button>
                    <button
                      onClick={() => setContentManagementSection('enllcos')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'enllcos'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Link className="w-4 h-4" />
                      Enllaços
                    </button>
                    <button
                      onClick={() => setContentManagementSection('formacio')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'formacio'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      Formació
                    </button>
                    <button
                      onClick={() => setContentManagementSection('calendari')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                        contentManagementSection === 'calendari'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Calendari
                    </button>
                  </nav>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 p-6 overflow-hidden">
                  {/* Sección Feed */}
                  {contentManagementSection === 'feed' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">Gestió del Feed</h4>
                          <p className="text-gray-600">Gestiona els posts i contingut del feed principal</p>
                        </div>
                        <button
                          onClick={() => setShowCreatePostModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Nou Post
                        </button>
                      </div>

                      {/* Filtros */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <Filter className="w-4 h-4 text-gray-600" />
                          <h5 className="font-medium text-gray-900">Filtres</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                            <input
                              type="text"
                              placeholder="Cerca per autor..."
                              value={postFilters.author}
                              onChange={(e) => setPostFilters({...postFilters, author: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data des de</label>
                            <input
                              type="date"
                              value={postFilters.dateFrom}
                              onChange={(e) => setPostFilters({...postFilters, dateFrom: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data fins</label>
                            <input
                              type="date"
                              value={postFilters.dateTo}
                              onChange={(e) => setPostFilters({...postFilters, dateTo: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipus</label>
                            <select
                              value={postFilters.contentType}
                              onChange={(e) => setPostFilters({...postFilters, contentType: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="all">Tots</option>
                              <option value="general">General</option>
                              <option value="announcement">Anunci</option>
                              <option value="event">Esdeveniment</option>
                              <option value="job">Feina</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Lista de posts */}
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-900">Posts ({filteredPosts.length})</h5>
                        {filteredPosts.map((post) => (
                          <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {post.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                                  <h6 className="font-semibold text-gray-900">{post.title}</h6>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    post.type === 'announcement' ? 'bg-red-100 text-red-800' :
                                    post.type === 'event' ? 'bg-green-100 text-green-800' :
                                    post.type === 'job' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {post.type === 'announcement' ? 'Anunci' :
                                     post.type === 'event' ? 'Esdeveniment' :
                                     post.type === 'job' ? 'Feina' : 'General'}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm mb-3">{post.content}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Per {post.author} ({post.authorRole})</span>
                                  <span>·</span>
                                  <span>{post.date}</span>
                                  <span>·</span>
                                  <span>👍 {post.likes} M'agrada</span>
                                  <span>·</span>
                                  <span>💬 {post.comments} Comentaris</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleTogglePin(post.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    post.pinned
                                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                  }`}
                                  title={post.pinned ? 'Desfixar post' : 'Fixar post'}
                                >
                                  <Pin className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar post"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Eliminar post"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {filteredPosts.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No s'han trobat posts amb els filtres aplicats
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sección Grups */}
                  {contentManagementSection === 'grups' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Gestió de Grups</h3>
                          <p className="text-gray-600 mt-1">Administra tots els grups de la comunitat</p>
                        </div>
                        <button
                          onClick={() => setShowCreateGroupModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Crear Grup
                        </button>
                      </div>

                      {/* Filtros y búsqueda */}
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Search className="w-4 h-4 text-gray-600" />
                          <h5 className="font-medium text-gray-900">Filtres i Cerca</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
                            <input
                              type="text"
                              value={groupFilters.search}
                              onChange={(e) => setGroupFilters({...groupFilters, search: e.target.value})}
                              placeholder="Nom del grup..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                              value={groupFilters.category}
                              onChange={(e) => setGroupFilters({...groupFilters, category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Totes les categories</option>
                              <option value="afinidad">Afinitat</option>
                              <option value="profesional">Professional</option>
                              <option value="geografico">Geogràfic</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estat</label>
                            <select
                              value={groupFilters.status}
                              onChange={(e) => setGroupFilters({...groupFilters, status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Tots els estats</option>
                              <option value="Actiu">Actius</option>
                              <option value="Arxivat">Arxivats</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Membres</label>
                            <select
                              value={groupFilters.members}
                              onChange={(e) => setGroupFilters({...groupFilters, members: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Tots</option>
                              <option value="small">Petits (&lt; 50)</option>
                              <option value="medium">Mitjans (50-200)</option>
                              <option value="large">Grans (&gt; 200)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de grupos */}
                      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Categoria</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Membres</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Administrador</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Estat</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Data Creació</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Accions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {groups
                                .filter(group => {
                                  const matchesSearch = groupFilters.search === '' || 
                                    group.nom.toLowerCase().includes(groupFilters.search.toLowerCase())
                                  const matchesCategory = groupFilters.category === 'all' || group.categoria === groupFilters.category
                                  const matchesStatus = groupFilters.status === 'all' || group.estat === groupFilters.status
                                  const matchesMembers = groupFilters.members === 'all' || 
                                    (groupFilters.members === 'small' && group.membres < 50) ||
                                    (groupFilters.members === 'medium' && group.membres >= 50 && group.membres <= 200) ||
                                    (groupFilters.members === 'large' && group.membres > 200)
                                  return matchesSearch && matchesCategory && matchesStatus && matchesMembers
                                })
                                .map((group) => (
                                  <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                          {group.avatar ? (
                                            <img 
                                              src={group.avatar} 
                                              alt={group.nom} 
                                              className="w-10 h-10 rounded-lg object-cover"
                                            />
                                          ) : (
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                                              group.tipus === 'publico' ? 'bg-green-500' :
                                              group.tipus === 'privado' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}>
                                              {group.nom.substring(0, 2).toUpperCase()}
                                            </div>
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center space-x-2">
                                            {/* Indicador de nivel jerárquico */}
                                            {group.nivel > 0 && (
                                              <div className="flex items-center text-gray-400">
                                                {'└'.repeat(group.nivel)}
                                              </div>
                                            )}
                                            <div className="text-sm font-medium text-gray-900">{group.nom}</div>
                                            {group.esDestacado && <span className="text-yellow-600">⭐</span>}
                                            {group.teOfertes && <span className="text-green-600" title="Té ofertes">🎁</span>}
                                            {group.subgrups && group.subgrups.length > 0 && (
                                              <span className="text-blue-600" title={`${group.subgrups.length} subgrups`}>👥</span>
                                            )}
                                          </div>
                                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                                            <span className="capitalize">
                                              {group.tipus === 'publico' ? 'Públic' : 
                                               group.tipus === 'privado' ? 'Privat' : 'Ocult'}
                                            </span>
                                            {group.nivel > 0 && (
                                              <span className="text-blue-600">• Subgrup</span>
                                            )}
                                            {group.teOfertes && (
                                              <span className="text-green-600">• {group.ofertes.length} ofertes</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                      <div>
                                        <div className="font-medium capitalize">
                                          {group.categoria === 'profesional' ? 'Professional' :
                                           group.categoria === 'geografico' ? 'Geogràfic' : 'Afinitat'}
                                        </div>
                                        <div className="text-xs text-gray-500">{group.subcategoria}</div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">{group.membres}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                      <div>
                                        <div className="font-medium">{group.administradors[0]}</div>
                                        {group.administradors.length > 1 && (
                                          <div className="text-xs text-gray-500">
                                            +{group.administradors.length - 1} més
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        group.estat === 'Actiu' 
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {group.estat}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">{group.dataCreacio}</td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center space-x-2">
                                        <button 
                                          onClick={() => {
                                            setSelectedGroup(group)
                                            setShowEditGroupModal(true)
                                          }}
                                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                          title="Editar"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                          onClick={() => {
                                            setSelectedGroup(group)
                                            setShowMembersModal(true)
                                          }}
                                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                          title="Gestionar membres"
                                        >
                                          <Users className="w-4 h-4" />
                                        </button>
                                        <button 
                                          className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                                          title="Configurar permisos"
                                        >
                                          <Settings className="w-4 h-4" />
                                        </button>
                                        <button 
                                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                          title="Eliminar"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sección Blogs */}
                  {contentManagementSection === 'blogs' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Gestió de Blogs</h3>
                          <p className="text-gray-600 mt-1">Crea i gestiona les entrades del blog amb assistència d'IA</p>
                        </div>
                        <button
                          onClick={() => setShowCreateBlogModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Nova Entrada
                        </button>
                      </div>

                      {/* Filtros y búsqueda */}
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Search className="w-4 h-4 text-gray-600" />
                          <h5 className="font-medium text-gray-900">Filtres i Cerca</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                            <input
                              type="text"
                              value={blogFilters.author}
                              onChange={(e) => setBlogFilters({...blogFilters, author: e.target.value})}
                              placeholder="Filtrar per autor..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                              value={blogFilters.category}
                              onChange={(e) => setBlogFilters({...blogFilters, category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Totes les categories</option>
                              <option value="Transformació Digital">Transformació Digital</option>
                              <option value="Metodologies">Metodologies</option>
                              <option value="Intel·ligència Artificial">Intel·ligència Artificial</option>
                              <option value="Seguretat">Seguretat</option>
                              <option value="Innovació">Innovació</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estat</label>
                            <select
                              value={blogFilters.status}
                              onChange={(e) => setBlogFilters({...blogFilters, status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Tots els estats</option>
                              <option value="draft">Esborranys</option>
                              <option value="published">Publicats</option>
                              <option value="scheduled">Programats</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data des de</label>
                            <input
                              type="date"
                              value={blogFilters.dateFrom}
                              onChange={(e) => setBlogFilters({...blogFilters, dateFrom: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data fins</label>
                            <input
                              type="date"
                              value={blogFilters.dateTo}
                              onChange={(e) => setBlogFilters({...blogFilters, dateTo: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Taula de blogs */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Portada
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Títol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Autor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Estat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Data Publicació
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Estadístiques
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Accions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {blogPosts.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                  {/* Portada */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      {blog.coverImage ? (
                                        <img 
                                          src={blog.coverImage} 
                                          alt={`Portada de ${blog.title}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <Image className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  {/* Títol */}
                                  <td className="px-6 py-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {blog.title}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                          {blog.aiGenerated && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                              <Bot className="w-3 h-3 mr-1" />
                                              IA
                                            </span>
                                          )}
                                          <span className="text-xs text-gray-500">
                                            {blog.language === 'catala' ? '🏴󠁥󠁳󠁣󠁴󠁿' : '🇪🇸'} {blog.language}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {blog.author}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {blog.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      blog.status === 'published' 
                                        ? 'bg-green-100 text-green-800'
                                        : blog.status === 'scheduled'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {blog.status === 'published' ? 'Publicat' :
                                       blog.status === 'scheduled' ? 'Programat' : 'Esborrany'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div>{blog.publishDate}</div>
                                      <div className="text-xs text-gray-500">{blog.publishTime}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {blog.views}
                                      </div>
                                      <div className="flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {blog.likes}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => {
                                          setSelectedBlog(blog)
                                          setShowBlogPreviewModal(true)
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Vista previa"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedBlog(blog)
                                          setNewBlogPost({
                                            title: blog.title,
                                            content: blog.content,
                                            category: blog.category,
                                            tags: blog.tags,
                                            status: blog.status,
                                            publishDate: blog.publishDate,
                                            publishTime: blog.publishTime,
                                            seoTitle: blog.seoTitle,
                                            seoDescription: blog.seoDescription,
                                            aiAgent: blog.aiAgent,
                                            language: blog.language,
                                            coverImage: null // No se puede cargar File desde string
                                          })
                                          setShowCreateBlogModal(true)
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Editar"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm('Estàs segur que vols eliminar aquesta entrada?')) {
                                            setBlogPosts(blogPosts.filter(b => b.id !== blog.id))
                                          }
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                        title="Eliminar"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sección Fòrums */}
                  {contentManagementSection === 'forums' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Gestió de Fòrums</h3>
                          <p className="text-gray-600 mt-1">Administra els temes i discussions de la comunitat</p>
                        </div>
                        <button
                          onClick={() => setShowCreateForumModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Nou Tema
                        </button>
                      </div>

                      {/* Filtros y búsqueda */}
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Search className="w-4 h-4 text-gray-600" />
                          <h5 className="font-medium text-gray-900">Filtres i Cerca</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cerca</label>
                            <input
                              type="text"
                              value={forumFilters.search}
                              onChange={(e) => setForumFilters({...forumFilters, search: e.target.value})}
                              placeholder="Títol del tema..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                              value={forumFilters.category}
                              onChange={(e) => setForumFilters({...forumFilters, category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Totes les categories</option>
                              <option value="Transformació Digital">Transformació Digital</option>
                              <option value="Metodologies">Metodologies</option>
                              <option value="Intel·ligència Artificial">Intel·ligència Artificial</option>
                              <option value="Seguretat">Seguretat</option>
                              <option value="Innovació">Innovació</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estat</label>
                            <select
                              value={forumFilters.status}
                              onChange={(e) => setForumFilters({...forumFilters, status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="all">Tots els estats</option>
                              <option value="active">Actius</option>
                              <option value="resolved">Resolts</option>
                              <option value="locked">Bloquejats</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data des de</label>
                            <input
                              type="date"
                              value={forumFilters.dateFrom}
                              onChange={(e) => setForumFilters({...forumFilters, dateFrom: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data fins</label>
                            <input
                              type="date"
                              value={forumFilters.dateTo}
                              onChange={(e) => setForumFilters({...forumFilters, dateTo: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tabla de temas del fòrum */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Imatge
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tema
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Autor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Categoria
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Estat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Respostes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Última Activitat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Accions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {forumTopics.map((topic) => (
                                <tr key={topic.id} className="hover:bg-gray-50">
                                  {/* Imatge */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                      {topic.image ? (
                                        <img 
                                          src={topic.image} 
                                          alt={`Imatge de ${topic.title}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                          <Image className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  {/* Tema */}
                                  <td className="px-6 py-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0">
                                        {topic.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                                        {topic.isLocked && <Lock className="w-4 h-4 text-red-600" />}
                                        {!topic.isPinned && !topic.isLocked && <MessageSquare className="w-4 h-4 text-gray-400" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {topic.title}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                          {topic.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                              {topic.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                  #{tag}
                                                </span>
                                              ))}
                                              {topic.tags.length > 2 && (
                                                <span className="text-xs text-gray-500">+{topic.tags.length - 2}</span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {topic.author}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {topic.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                      topic.status === 'active' ? 'bg-green-100 text-green-800' :
                                      topic.status === 'resolved' ? 'bg-gray-100 text-gray-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {topic.status === 'active' ? 'Actiu' :
                                       topic.status === 'resolved' ? 'Resolt' :
                                       'Bloquejat'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        {topic.replies}
                                      </div>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Eye className="w-4 h-4 mr-1" />
                                        {topic.views}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>
                                      <p>{topic.lastReply.author}</p>
                                      <p className="text-xs">{topic.lastReply.date} {topic.lastReply.time}</p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => {
                                          setSelectedForum(topic)
                                          setShowForumPreviewModal(true)
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Veure tema"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setNewForumTopic({
                                            title: topic.title,
                                            content: topic.content,
                                            category: topic.category,
                                            tags: topic.tags,
                                            isPinned: topic.isPinned,
                                            isLocked: topic.isLocked,
                                            visibility: topic.visibility,
                                            image: null
                                          })
                                          setSelectedForum(topic)
                                          setShowCreateForumModal(true)
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Editar tema"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm('Estàs segur que vols eliminar aquest tema?')) {
                                            setForumTopics(forumTopics.filter(t => t.id !== topic.id))
                                          }
                                        }}
                                        className="text-red-600 hover:text-red-900"
                                        title="Eliminar tema"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Placeholder per altres seccions */}
                  {/* Sección Tablón de Anuncios */}
                  {contentManagementSection === 'tauell' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Taulell d'Anuncis</h3>
                          <p className="text-gray-600">Gestiona els anuncis oficials de la comunitat</p>
                        </div>
                        <button
                          onClick={() => setShowCreateAnnouncementModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Nou Anunci
                        </button>
                      </div>

                      {/* Lista de anuncios */}
                      <div className="bg-white rounded-lg border">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">Anuncis Actius</h4>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {announcements.map((announcement) => (
                            <div key={announcement.id} className="p-6 hover:bg-gray-50">
                              {/* Imagen de portada */}
                              {announcement.coverImage && (
                                <div className="mb-4">
                                  <img
                                    src={announcement.coverImage}
                                    alt={`Portada de ${announcement.title}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </div>
                              )}

                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="font-semibold text-gray-900">{announcement.title}</h5>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                      announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {announcement.priority === 'urgent' ? 'Urgent' :
                                       announcement.priority === 'high' ? 'Prioritat Alta' : 'Normal'}
                                    </span>
                                    {announcement.isPinned && (
                                      <Pin className="w-4 h-4 text-yellow-600" />
                                    )}
                                  </div>
                                  <p className="text-gray-700 mb-3">{announcement.content}</p>

                                  {/* Galería de imágenes */}
                                  {announcement.images && announcement.images.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-sm font-medium text-gray-700 mb-2">📷 Galeria d'imatges ({announcement.images.length})</p>
                                      <div className="flex gap-2 overflow-x-auto pb-2">
                                        {announcement.images.map((image, index) => (
                                          <img
                                            key={index}
                                            src={image}
                                            alt={`Imatge ${index + 1} de ${announcement.title}`}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => window.open(image, '_blank')}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Archivos adjuntos */}
                                  {announcement.files && announcement.files.length > 0 && (
                                    <div className="mb-4">
                                      <p className="text-sm font-medium text-gray-700 mb-2">📎 Arxius adjunts ({announcement.files.length})</p>
                                      <div className="space-y-1">
                                        {announcement.files.map((file, index) => (
                                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                            <Paperclip className="w-3 h-3 text-gray-500" />
                                            <span className="flex-1 truncate">{file.name}</span>
                                            <span className="text-gray-500 text-xs">{file.size}</span>
                                            <button className="text-blue-600 hover:text-blue-800 text-xs">
                                              Baixar
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>📅 {announcement.publishDate}</span>
                                    <span>👤 {announcement.author}</span>
                                    <span>👁️ {announcement.views} visualitzacions</span>
                                    {announcement.expiresAt && (
                                      <span>⏰ Caduca: {announcement.expiresAt}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditAnnouncement(announcement)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Moderación automática de anuncios de miembros */}
                      <div className="bg-white rounded-lg border">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">Anuncis de Membres per Revisar</h4>
                            <span className="text-sm text-gray-500">Moderació automàtica activa</span>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                          {memberAnnouncements.map((announcement) => (
                            <div key={announcement.id} className={`p-4 ${
                              announcement.status === 'blocked' ? 'bg-red-50' :
                              announcement.status === 'flagged' ? 'bg-orange-50' : 'bg-yellow-50'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  {/* Origen del contenido */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-sm bg-purple-100 text-purple-800 border border-purple-200">
                                      <Megaphone className="w-4 h-4" />
                                      <span>Anunci de Membre</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {announcement.createdDate}
                                    </div>
                                  </div>

                                  <h5 className="font-semibold text-gray-900 mb-1">{announcement.title}</h5>
                                  <p className="text-gray-600 text-sm mb-2">Per: {announcement.author}</p>

                                  {/* Botón para expandir/contraer el contenido */}
                                  <div className="mb-3">
                                    <button
                                      onClick={() => toggleReportExpansion(announcement.id + 100)}
                                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                                        expandedReports.has(announcement.id + 100)
                                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      {expandedReports.has(announcement.id + 100) 
                                        ? '▼ Amagar contingut' 
                                        : '▶ Veure contingut complet'
                                      }
                                    </button>
                                  </div>

                                  {/* Contenido completo expandible */}
                                  {expandedReports.has(announcement.id + 100) && (
                                    <div className={`mb-3 p-3 rounded-lg border-l-4 ${
                                      announcement.status === 'blocked' ? 'bg-red-50 border-red-300' :
                                      announcement.status === 'flagged' ? 'bg-orange-50 border-orange-300' :
                                      'bg-yellow-50 border-yellow-300'
                                    }`}>
                                      <div className="mb-2">
                                        <p className={`text-xs font-semibold mb-1 ${
                                          announcement.status === 'blocked' ? 'text-red-700' :
                                          announcement.status === 'flagged' ? 'text-orange-700' :
                                          'text-yellow-700'
                                        }`}>
                                          CONTINGUT DE L'ANUNCI:
                                        </p>
                                        <div className={`text-sm p-2 rounded bg-white border ${
                                          announcement.status === 'blocked' ? 'border-red-200' :
                                          announcement.status === 'flagged' ? 'border-orange-200' :
                                          'border-yellow-200'
                                        }`}>
                                          <p className="font-medium text-gray-900 mb-1">{announcement.title}</p>
                                          <p className="text-gray-700">{announcement.content}</p>
                                        </div>
                                      </div>
                                      
                                      <div className={`text-xs space-y-1 ${
                                        announcement.status === 'blocked' ? 'text-red-600' :
                                        announcement.status === 'flagged' ? 'text-orange-600' :
                                        'text-yellow-600'
                                      }`}>
                                        <p><strong>Autor:</strong> {announcement.author}</p>
                                        <p><strong>Categoria:</strong> {announcement.category}</p>
                                        <p><strong>Data:</strong> {announcement.createdDate}</p>
                                        <p><strong>Motiu:</strong> {announcement.moderationReason}</p>
                                        <p><strong>Confiança:</strong> {announcement.confidence}%</p>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleApproveMemberAnnouncement(announcement.id)}
                                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                    >
                                      Aprovar
                                    </button>
                                    <button
                                      onClick={() => handleRejectMemberAnnouncement(announcement.id)}
                                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                    >
                                      Rebutjar
                                    </button>
                                    {announcement.status !== 'blocked' && (
                                      <button
                                        onClick={() => handleEditMemberAnnouncement(announcement.id)}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                      >
                                        Editar i Aprovar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {contentManagementSection !== 'feed' && contentManagementSection !== 'grups' && contentManagementSection !== 'blogs' && contentManagementSection !== 'forums' && contentManagementSection !== 'tauell' && (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          {contentManagementSection === 'tauell' && <Megaphone className="w-8 h-8 text-gray-400" />}
                          {contentManagementSection === 'enllcos' && <Link className="w-8 h-8 text-gray-400" />}
                          {contentManagementSection === 'formacio' && <GraduationCap className="w-8 h-8 text-gray-400" />}
                          {contentManagementSection === 'calendari' && <Calendar className="w-8 h-8 text-gray-400" />}
                        </div>
                        <h4 className="font-medium text-gray-900 capitalize">{contentManagementSection}</h4>
                        <p className="text-gray-500 text-sm">Aquesta secció serà implementada aviat</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pestaña Vista Prèvia Completa */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Prèvia Completa - {currentCommunity?.nombre}</h3>
                  <p className="text-gray-600 mb-6">Simulació del dashboard real aplicant tota la configuració actual</p>
                  
                  {/* Selector de Rol */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Visualitzar com a:</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setPreviewRole('funcionarios')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          previewRole === 'funcionarios'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Funcionario
                      </button>
                      <button
                        onClick={() => setPreviewRole('empresas')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          previewRole === 'empresas'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        Empresa
                      </button>
                      <button
                        onClick={() => setPreviewRole('sindicatos')}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          previewRole === 'sindicatos'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Scale className="w-4 h-4" />
                        Sindicat
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Preview - Simulació Completa */}
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                    
                    {/* Header Real de La Pública */}
                    <div 
                      className="shadow-sm border-b"
                      style={{ backgroundColor: visualConfig.primaryColor }}
                    >
                      <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                              >
                                {currentCommunity?.nombre?.charAt(0)}
                              </div>
                              <div className="text-white">
                                <h1 className="font-bold text-lg">La Pública</h1>
                                <p className="text-xs opacity-90">{currentCommunity?.nombre}</p>
                              </div>
                            </div>
                            
                            {/* Barra de cerca */}
                            <div className="hidden md:flex items-center ml-8">
                              <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Cercar membres, grups, contingut..."
                                  className="pl-10 pr-4 py-2 w-80 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:bg-white/20"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Navigation i Avatar */}
                          <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-white/10 text-white">
                              <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-white">
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2 text-white text-sm">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: visualConfig.accentColor }}
                              >
                                {previewRole === 'funcionarios' ? '👤' : previewRole === 'empresas' ? '🏢' : '⚖️'}
                              </div>
                              <span>{previewRole === 'funcionarios' ? 'Funcionario' : previewRole === 'empresas' ? 'Empresa' : 'Sindicat'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layout Principal amb Sidebar + Contingut */}
                    <div className="flex min-h-96">
                      
                      {/* Sidebar Navegació */}
                      <div className="w-64 border-r border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <nav className="space-y-1">
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-white"
                               style={{ backgroundColor: visualConfig.primaryColor }}>
                              <Home className="w-4 h-4" />
                              Xarxa Social
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                              <Users className="w-4 h-4" />
                              Membres
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                              <UserPlus className="w-4 h-4" />
                              Grups
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                              <Hash className="w-4 h-4" />
                              Fòrums
                            </a>
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                              <Calendar className="w-4 h-4" />
                              Esdeveniments
                            </a>
                            {rolesConfig[previewRole as keyof typeof rolesConfig]?.visibleWidgets.includes('offers') && (
                              <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                                <Briefcase className="w-4 h-4" />
                                Ofertes
                              </a>
                            )}
                            {rolesConfig[previewRole as keyof typeof rolesConfig]?.visibleWidgets.includes('documents') && (
                              <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                                <FileText className="w-4 h-4" />
                                Documents
                              </a>
                            )}
                            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                              <HelpCircle className="w-4 h-4" />
                              Ajuda
                            </a>
                          </nav>
                        </div>
                      </div>

                      {/* Contingut Principal - Layout 3 Columnes */}
                      <div className="flex-1 p-6">
                        <div className="grid grid-cols-12 gap-6">
                          
                          {/* Columna Esquerra - Mètriques i Widgets */}
                          <div className="col-span-3 space-y-4">
                            {/* Mètriques Reals */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h5 className="font-semibold text-gray-900 mb-3">Estadístiques</h5>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Total Membres</span>
                                  <span className="font-bold" style={{ color: visualConfig.primaryColor }}>2,547</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Membres Online</span>
                                  <span className="font-bold" style={{ color: visualConfig.accentColor }}>342</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Grups Actius</span>
                                  <span className="font-bold" style={{ color: visualConfig.secondaryColor }}>89</span>
                                </div>
                                {rolesConfig[previewRole as keyof typeof rolesConfig]?.visibleWidgets.includes('offers') && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Empreses</span>
                                    <span className="font-bold" style={{ color: visualConfig.primaryColor }}>156</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Grups Personalitzats */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h5 className="font-semibold text-gray-900 mb-3">Els Meus Grups</h5>
                              <div className="space-y-2">
                                {contentConfig.customGroups.slice(0, 4).map((group, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: visualConfig.accentColor }}
                                    ></div>
                                    <span className="text-sm text-gray-700">{group}</span>
                                    <span className="text-xs text-gray-500 ml-auto">{Math.floor(Math.random() * 50) + 10}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Accions Ràpides */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h5 className="font-semibold text-gray-900 mb-3">Accions Ràpides</h5>
                              <div className="space-y-2">
                                {rolesConfig[previewRole as keyof typeof rolesConfig]?.canCreateGroups && (
                                  <button 
                                    className="w-full text-left text-sm px-3 py-2 rounded-lg text-white transition-colors hover:opacity-90"
                                    style={{ backgroundColor: visualConfig.primaryColor }}
                                  >
                                    ➕ Crear Grup
                                  </button>
                                )}
                                {rolesConfig[previewRole as keyof typeof rolesConfig]?.canPublishOffers && (
                                  <button 
                                    className="w-full text-left text-sm px-3 py-2 rounded-lg text-white transition-colors hover:opacity-90"
                                    style={{ backgroundColor: visualConfig.secondaryColor }}
                                  >
                                    💼 Publicar Oferta
                                  </button>
                                )}
                                {rolesConfig[previewRole as keyof typeof rolesConfig]?.canAccessPrivateContent && (
                                  <button 
                                    className="w-full text-left text-sm px-3 py-2 rounded-lg text-white transition-colors hover:opacity-90"
                                    style={{ backgroundColor: visualConfig.accentColor }}
                                  >
                                    🔒 Accedir Contingut Privat
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Columna Central - Feed d'Activitat */}
                          <div className="col-span-6 space-y-4">
                            {/* Crear Post */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <div className="flex items-start gap-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: visualConfig.accentColor }}
                                >
                                  {previewRole === 'funcionarios' ? '👤' : previewRole === 'empresas' ? '🏢' : '⚖️'}
                                </div>
                                <div className="flex-1">
                                  <textarea 
                                    placeholder="Què estàs pensant?"
                                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                                    rows={3}
                                  ></textarea>
                                  <div className="flex justify-between items-center mt-3">
                                    <div className="flex gap-2">
                                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">📷 Imatge</button>
                                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">📎 Arxiu</button>
                                    </div>
                                    <button 
                                      className="px-4 py-2 text-sm text-white rounded-lg"
                                      style={{ backgroundColor: visualConfig.primaryColor }}
                                    >
                                      Publicar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Feed d'Activitat */}
                            <div className="space-y-4">
                              {/* Post 1 */}
                              <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-start gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: visualConfig.primaryColor }}
                                  >
                                    JM
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h6 className="font-semibold text-gray-900">Joan Martí</h6>
                                      <span className="text-xs text-gray-500">· Funcionari · fa 2h</span>
                                    </div>
                                    <p className="text-gray-700 mb-3">Nou protocol de digitalització aprovat! 📄✨ Això millorarà molt els nostres processos interns.</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <button className="hover:text-blue-600">👍 12 M'agrada</button>
                                      <button className="hover:text-blue-600">💬 3 Comentaris</button>
                                      <button className="hover:text-blue-600">↗️ Compartir</button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Post 2 */}
                              <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex items-start gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    style={{ backgroundColor: visualConfig.secondaryColor }}
                                  >
                                    LC
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h6 className="font-semibold text-gray-900">Laura Castell</h6>
                                      <span className="text-xs text-gray-500">· Administració · fa 4h</span>
                                    </div>
                                    <p className="text-gray-700 mb-3">Recordatori: Reunió de coordinació demà a les 10:00h a la sala de juntes.</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <button className="hover:text-blue-600">👍 8 M'agrada</button>
                                      <button className="hover:text-blue-600">💬 1 Comentari</button>
                                      <button className="hover:text-blue-600">↗️ Compartir</button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Post 3 - Només si tenen permís per veure ofertes */}
                              {rolesConfig[previewRole as keyof typeof rolesConfig]?.visibleWidgets.includes('offers') && (
                                <div className="bg-white rounded-lg p-4 shadow-sm border">
                                  <div className="flex items-start gap-3">
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                      style={{ backgroundColor: visualConfig.accentColor }}
                                    >
                                      TI
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h6 className="font-semibold text-gray-900">TechInnovació SL</h6>
                                        <span className="text-xs text-gray-500">· Empresa · fa 6h</span>
                                      </div>
                                      <p className="text-gray-700 mb-3">🚀 Nova oferta: Desenvolupador Full-Stack per projectes innovadors amb l'administració pública.</p>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <button className="hover:text-blue-600">👍 15 M'agrada</button>
                                        <button className="hover:text-blue-600">💬 5 Comentaris</button>
                                        <button className="hover:text-blue-600">↗️ Compartir</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Columna Dreta - Widgets i Activitat Lateral */}
                          <div className="col-span-3 space-y-4">
                            {/* Esdeveniments */}
                            {rolesConfig[previewRole as keyof typeof rolesConfig]?.visibleWidgets.includes('events') && (
                              <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" style={{ color: visualConfig.accentColor }} />
                                  Propers Esdeveniments
                                </h5>
                                <div className="space-y-3">
                                  <div className="border-l-3 pl-3" style={{ borderColor: visualConfig.primaryColor }}>
                                    <p className="text-sm font-medium text-gray-900">Webinar: Digitalització</p>
                                    <p className="text-xs text-gray-500">Demà · 15:00h</p>
                                  </div>
                                  <div className="border-l-3 pl-3" style={{ borderColor: visualConfig.secondaryColor }}>
                                    <p className="text-sm font-medium text-gray-900">Reunió Coordinadors</p>
                                    <p className="text-xs text-gray-500">Dijous · 10:00h</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Membres Online */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h5 className="font-semibold text-gray-900 mb-3">Membres Online</h5>
                              <div className="space-y-2">
                                {['Anna Vila', 'Jordi Puig', 'Marta Soler', 'Pere Roca'].map((nom, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div 
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                                      style={{ backgroundColor: visualConfig.accentColor }}
                                    >
                                      {nom.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-sm text-gray-700">{nom}</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 ml-auto"></div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Feeds Actius */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h5 className="font-semibold text-gray-900 mb-3">Feeds Subscrits</h5>
                              <div className="space-y-2">
                                {contentConfig.enabledFeeds.map((feed, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: visualConfig.accentColor }}
                                    ></div>
                                    <span className="text-sm text-gray-700 capitalize">{feed}</span>
                                    <span className="text-xs text-gray-500 ml-auto">●</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">Vista Prèvia en Temps Real</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Aquesta simulació mostra com es veurà el dashboard aplicant la configuració visual (colors: {visualConfig.primaryColor}, {visualConfig.secondaryColor}, {visualConfig.accentColor}), 
                          els permisos de rol seleccionat, els widgets visibles, i els feeds actius configurats.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Moderació */}
            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema de Moderació - {currentCommunity?.nombre}</h3>
                  <p className="text-gray-600 mb-6">Gestiona reportes, usuaris suspesos i estadístiques de moderació</p>
                  
                  {/* Estadísticas principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                          <p className="text-2xl font-bold text-gray-900">{moderationStats.totalReports}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pendents</p>
                          <p className="text-2xl font-bold text-red-600">{moderationStats.pendingReports}</p>
                        </div>
                        <Clock className="w-8 h-8 text-red-500" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Resolts Avui</p>
                          <p className="text-2xl font-bold text-green-600">{moderationStats.resolvedToday}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Usuaris Suspesos</p>
                          <p className="text-2xl font-bold text-purple-600">{moderationStats.suspendedUsers}</p>
                        </div>
                        <Ban className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Categoria +Reportada</p>
                          <p className="text-lg font-bold text-gray-900 capitalize">{moderationStats.mostReportedCategory}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Temps Mitjà</p>
                          <p className="text-lg font-bold text-gray-900">{moderationStats.averageResolutionTime}</p>
                        </div>
                        <Clock className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas de Moderación Automática */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Moderació Automàtica</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        autoModerationConfig.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {autoModerationConfig.enabled ? 'Actiu' : 'Inactiu'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Bloquejats Avui</p>
                        <p className="text-xl font-bold text-red-600">{moderationStats.autoBlockedToday}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Per Revisió Avui</p>
                        <p className="text-xl font-bold text-orange-600">{moderationStats.autoReviewedToday}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Falsos Positius</p>
                        <p className="text-xl font-bold text-purple-600">{moderationStats.falsePositives}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Nivell Estrictesa</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">{autoModerationConfig.strictnessLevel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas por Origen de Contingut */}
                  <div className="bg-white rounded-lg border shadow-sm mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h5 className="font-medium text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                        Moderació per Origen de Contingut
                      </h5>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-4 gap-6">
                        {/* Fòrum */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Hash className="w-5 h-5 text-blue-600 mr-1" />
                            <span className="font-medium text-gray-900">Fòrum</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-yellow-50 p-2 rounded">
                              <p className="text-sm text-yellow-700">Pendents</p>
                              <p className="text-lg font-bold text-yellow-600">{moderationStats.byOrigin.forum.pending}</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-sm text-red-700">Bloquejats</p>
                              <p className="text-lg font-bold text-red-600">{moderationStats.byOrigin.forum.blocked}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-sm text-green-700">Resolts</p>
                              <p className="text-lg font-bold text-green-600">{moderationStats.byOrigin.forum.resolved}</p>
                            </div>
                          </div>
                        </div>

                        {/* Blog */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <FileText className="w-5 h-5 text-purple-600 mr-1" />
                            <span className="font-medium text-gray-900">Blog</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-yellow-50 p-2 rounded">
                              <p className="text-sm text-yellow-700">Pendents</p>
                              <p className="text-lg font-bold text-yellow-600">{moderationStats.byOrigin.blog.pending}</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-sm text-red-700">Bloquejats</p>
                              <p className="text-lg font-bold text-red-600">{moderationStats.byOrigin.blog.blocked}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-sm text-green-700">Resolts</p>
                              <p className="text-lg font-bold text-green-600">{moderationStats.byOrigin.blog.resolved}</p>
                            </div>
                          </div>
                        </div>

                        {/* Feed */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Rss className="w-5 h-5 text-orange-600 mr-1" />
                            <span className="font-medium text-gray-900">Feed</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-yellow-50 p-2 rounded">
                              <p className="text-sm text-yellow-700">Pendents</p>
                              <p className="text-lg font-bold text-yellow-600">{moderationStats.byOrigin.feed.pending}</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-sm text-red-700">Bloquejats</p>
                              <p className="text-lg font-bold text-red-600">{moderationStats.byOrigin.feed.blocked}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-sm text-green-700">Resolts</p>
                              <p className="text-lg font-bold text-green-600">{moderationStats.byOrigin.feed.resolved}</p>
                            </div>
                          </div>
                        </div>

                        {/* Anuncios */}
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Megaphone className="w-5 h-5 text-green-600 mr-1" />
                            <span className="font-medium text-gray-900">Anuncis</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-yellow-50 p-2 rounded">
                              <p className="text-sm text-yellow-700">Pendents</p>
                              <p className="text-lg font-bold text-yellow-600">{moderationStats.byOrigin.announcements.pending}</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-sm text-red-700">Bloquejats</p>
                              <p className="text-lg font-bold text-red-600">{moderationStats.byOrigin.announcements.blocked}</p>
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                              <p className="text-sm text-green-700">Resolts</p>
                              <p className="text-lg font-bold text-green-600">{moderationStats.byOrigin.announcements.resolved}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertes de Moderación Automática en Tiempo Real */}
                  <div className="bg-white rounded-lg border shadow-sm mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <Bot className="w-5 h-5 text-blue-600" />
                          Reportes Automàtics Recents
                        </h5>
                        <span className="text-sm text-gray-500">Actualització en temps real</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {/* Reportes automáticos y manuales con origen identificado */}
                        {consolidatedModerationQueue.map((item) => (
                          <div key={item.id} className={`flex items-start space-x-4 p-4 border rounded-lg ${
                            item.status === 'blocked' ? 'bg-red-50 border-red-200' :
                            item.status === 'pending' && item.confidence > 80 ? 'bg-orange-50 border-orange-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex-shrink-0">
                              {item.status === 'blocked' ? (
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                              ) : item.confidence > 80 ? (
                                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                              ) : (
                                <Flag className="w-5 h-5 text-yellow-600 mt-0.5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {/* Encabezado con origen prominente */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  {/* Origen del contenido - más prominente */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium text-sm ${
                                      item.origin === 'forum' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                      item.origin === 'blog' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                      item.origin === 'announcements' ? 'bg-green-100 text-green-800 border border-green-200' :
                                      'bg-orange-100 text-orange-800 border border-orange-200'
                                    }`}>
                                      {item.origin === 'forum' && <Hash className="w-4 h-4" />}
                                      {item.origin === 'blog' && <FileText className="w-4 h-4" />}
                                      {item.origin === 'feed' && <Rss className="w-4 h-4" />}
                                      {item.origin === 'announcements' && <Megaphone className="w-4 h-4" />}
                                      <span>
                                        {item.origin === 'forum' ? 'Fòrum' :
                                         item.origin === 'blog' ? 'Blog' : 
                                         item.origin === 'announcements' ? 'Taulell d\'Anuncis' :
                                         'Feed de la Comunitat'}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {item.createdDate}
                                    </div>
                                  </div>
                                  
                                  {/* Título del contenido */}
                                  <p className={`text-sm font-medium leading-snug ${
                                    item.status === 'blocked' ? 'text-red-900' :
                                    item.confidence > 80 ? 'text-orange-900' :
                                    'text-yellow-900'
                                  }`}>
                                    {item.title}
                                  </p>
                                </div>
                                
                                {/* Estado del reporte */}
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                                    item.status === 'blocked' ? 'text-red-700 bg-red-100 border border-red-200' :
                                    item.status === 'pending' ? 'text-orange-700 bg-orange-100 border border-orange-200' :
                                    'text-yellow-700 bg-yellow-100 border border-yellow-200'
                                  }`}>
                                    {item.status === 'blocked' ? 'BLOQUEJAT' :
                                     item.status === 'pending' ? 'PENDENT' : 'REVISIÓ'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {item.confidence}% confiança
                                  </span>
                                </div>
                              </div>
                              
                              <p className={`text-sm mb-2 ${
                                item.status === 'blocked' ? 'text-red-700' :
                                item.confidence > 80 ? 'text-orange-700' :
                                'text-yellow-700'
                              }`}>
                                {item.moderationReason}
                              </p>

                              {/* Botón para expandir/contraer el contenido */}
                              <div className="mb-3">
                                <button
                                  onClick={() => toggleReportExpansion(item.id)}
                                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                                    expandedReports.has(item.id)
                                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  {expandedReports.has(item.id) 
                                    ? '▼ Amagar contingut' 
                                    : '▶ Veure contingut complet'
                                  }
                                </button>
                              </div>

                              {/* Contenido completo expandible */}
                              {expandedReports.has(item.id) && (
                                <div className={`mb-3 p-3 rounded-lg border-l-4 ${
                                  item.status === 'blocked' ? 'bg-red-50 border-red-300' :
                                  item.confidence > 80 ? 'bg-orange-50 border-orange-300' :
                                  'bg-yellow-50 border-yellow-300'
                                }`}>
                                  <div className="mb-2">
                                    <p className={`text-xs font-semibold mb-1 ${
                                      item.status === 'blocked' ? 'text-red-700' :
                                      item.confidence > 80 ? 'text-orange-700' :
                                      'text-yellow-700'
                                    }`}>
                                      CONTINGUT REPORTAT:
                                    </p>
                                    <div className={`text-sm p-2 rounded bg-white border ${
                                      item.status === 'blocked' ? 'border-red-200' :
                                      item.confidence > 80 ? 'border-orange-200' :
                                      'border-yellow-200'
                                    }`}>
                                      <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                                      <p className="text-gray-700">{item.content}</p>
                                    </div>
                                  </div>
                                  
                                  <div className={`text-xs space-y-1 ${
                                    item.status === 'blocked' ? 'text-red-600' :
                                    item.confidence > 80 ? 'text-orange-600' :
                                    'text-yellow-600'
                                  }`}>
                                    <p><strong>Autor:</strong> {item.author}</p>
                                    <p><strong>Categoria:</strong> {item.category}</p>
                                    <p><strong>Data de creació:</strong> {item.createdDate}</p>
                                    <p><strong>Tipus de contingut:</strong> {
                                      item.type === 'forum_topic' ? 'Tema del Fòrum' :
                                      item.type === 'forum_comment' ? 'Comentari del Fòrum' :
                                      item.type === 'blog_post' ? 'Post del Blog' :
                                      item.type === 'blog_comment' ? 'Comentari del Blog' :
                                      item.type === 'feed_post' ? 'Post del Feed' :
                                      item.type
                                    }</p>
                                  </div>
                                </div>
                              )}
                              
                              <div className={`text-xs space-y-1 mb-3 ${
                                item.status === 'blocked' ? 'text-red-600' :
                                item.confidence > 80 ? 'text-orange-600' :
                                'text-yellow-600'
                              }`}>
                                <p><strong>Ubicació:</strong> {item.locationPath}</p>
                                <p><strong>Context:</strong> {item.parentContext}</p>
                                <p><strong>Detectat:</strong> {item.detected.join(', ')}</p>
                                <p><strong>Usuari:</strong> {item.author}</p>
                                {item.reportedBy && (
                                  <p><strong>Reportat per:</strong> {item.reportedBy.join(', ')} ({item.reportCount} reports)</p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => {
                                    setConsolidatedModerationQueue(prev => 
                                      prev.map(i => i.id === item.id ? {...i, status: 'approved'} : i)
                                    )
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                >
                                  Aprovar
                                </button>
                                <button 
                                  onClick={() => {
                                    setConsolidatedModerationQueue(prev => 
                                      prev.map(i => i.id === item.id ? {...i, status: 'rejected'} : i)
                                    )
                                  }}
                                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                                >
                                  Rebutjar
                                </button>
                                <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                                  Suspendre Usuari
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-start space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-yellow-900">Contingut marcat per revisió</p>
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">REVISIÓ</span>
                            </div>
                            <p className="text-sm text-yellow-700 mb-2">Possible spam detectat en publicació del blog</p>
                            <div className="text-xs text-yellow-600 space-y-1 mb-3">
                              <p><strong>Categoria:</strong> Spam</p>
                              <p><strong>Confiança:</strong> 78%</p>
                              <p><strong>Usuari:</strong> empresa_xyz</p>
                              <p><strong>Temps:</strong> Fa 5 minuts</p>
                            </div>
                            {/* Botón para expandir/contraer el contenido */}
                            <div className="mb-3">
                              <button
                                onClick={() => toggleReportExpansion(4)}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  expandedReports.has(4)
                                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {expandedReports.has(4) 
                                  ? '▼ Amagar contingut' 
                                  : '▶ Veure contingut complet'
                                }
                              </button>
                            </div>

                            {/* Contenido completo expandible */}
                            {expandedReports.has(4) && (
                              <div className="mb-3 p-3 rounded-lg border-l-4 bg-yellow-50 border-yellow-300">
                                <div className="mb-2">
                                  <p className="text-xs font-semibold mb-1 text-yellow-700">
                                    CONTINGUT REPORTAT:
                                  </p>
                                  <div className="text-sm p-2 rounded bg-white border border-yellow-200">
                                    <p className="font-medium text-gray-900 mb-1">Publicació promocional sobre serveis de consultoria</p>
                                    <p className="text-gray-700">Oferim serveis de consultoria especialitzada per a administracions públiques. Més de 15 anys d'experiència. Contacteu-nos per a més informació sobre els nostres paquets de serveis i descomptes especials per a aquest mes...</p>
                                  </div>
                                </div>
                                
                                <div className="text-xs space-y-1 text-yellow-600">
                                  <p><strong>Autor:</strong> empresa_xyz</p>
                                  <p><strong>Categoria:</strong> Serveis</p>
                                  <p><strong>Data de creació:</strong> 2024-08-25</p>
                                  <p><strong>Tipus de contingut:</strong> Post del Blog</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                                Aprovar
                              </button>
                              <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                                Bloquejar
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <Flag className="w-5 h-5 text-orange-600 mt-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-orange-900">Possible desinformació detectada</p>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">ALTA PRIORITAT</span>
                            </div>
                            <p className="text-sm text-orange-700 mb-2">Informació mèdica no verificada en publicació</p>
                            <div className="text-xs text-orange-600 space-y-1 mb-3">
                              <p><strong>Categoria:</strong> Misinformation</p>
                              <p><strong>Confiança:</strong> 82%</p>
                              <p><strong>Usuari:</strong> salut_natural</p>
                              <p><strong>Temps:</strong> Fa 12 minuts</p>
                            </div>
                            {/* Botón para expandir/contraer el contenido */}
                            <div className="mb-3">
                              <button
                                onClick={() => toggleReportExpansion(5)}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  expandedReports.has(5)
                                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {expandedReports.has(5) 
                                  ? '▼ Amagar contingut' 
                                  : '▶ Veure contingut complet'
                                }
                              </button>
                            </div>

                            {/* Contenido completo expandible */}
                            {expandedReports.has(5) && (
                              <div className="mb-3 p-3 rounded-lg border-l-4 bg-orange-50 border-orange-300">
                                <div className="mb-2">
                                  <p className="text-xs font-semibold mb-1 text-orange-700">
                                    CONTINGUT REPORTAT:
                                  </p>
                                  <div className="text-sm p-2 rounded bg-white border border-orange-200">
                                    <p className="font-medium text-gray-900 mb-1">Remei natural contra el COVID-19</p>
                                    <p className="text-gray-700">He descobert un remei natural que cura completament el COVID-19 en només 3 dies. Els metges no us ho diuen perquè les farmacèutiques perdrien diners, però aquesta planta que creix als nostres boscos és la solució definitiva. He curat 20 persones amb aquest mètode...</p>
                                  </div>
                                </div>
                                
                                <div className="text-xs space-y-1 text-orange-600">
                                  <p><strong>Autor:</strong> salut_natural</p>
                                  <p><strong>Categoria:</strong> Salut</p>
                                  <p><strong>Data de creació:</strong> 2024-08-25</p>
                                  <p><strong>Tipus de contingut:</strong> Post del Feed</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                                Bloquejar Immediatament
                              </button>
                              <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors">
                                Marcar Per Verificació
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-blue-900">Fals positiu corregit</p>
                              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">APROVAT</span>
                            </div>
                            <p className="text-sm text-blue-700 mb-2">Contingut inicialment marcat com spam ha estat aprovat per moderador</p>
                            <div className="text-xs text-blue-600 space-y-1">
                              <p><strong>Acció:</strong> Aprovat manualment</p>
                              <p><strong>Moderador:</strong> admin_marc</p>
                              <p><strong>Temps:</strong> Fa 18 minuts</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configuración de Moderación Automática */}
                  <div className="bg-white rounded-lg border shadow-sm mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">Configuració Moderació Automàtica</h5>
                        <button
                          onClick={() => setAutoModerationConfig(prev => ({...prev, enabled: !prev.enabled}))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            autoModerationConfig.enabled
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {autoModerationConfig.enabled ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                    
                    {autoModerationConfig.enabled && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Configuración general */}
                          <div className="space-y-4">
                            <h6 className="font-medium text-gray-900">Configuració General</h6>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Nivell d'Estrictesa</label>
                              <select
                                value={autoModerationConfig.strictnessLevel}
                                onChange={(e) => setAutoModerationConfig(prev => ({...prev, strictnessLevel: e.target.value}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="low">Baixa - Només contingut extremadament ofensiu</option>
                                <option value="medium">Mitjana - Contingut moderadament ofensiu</option>
                                <option value="high">Alta - La majoria de contingut qüestionable</option>
                                <option value="strict">Estricta - Qualsevol sospita de contingut inadequat</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={autoModerationConfig.autoBlock}
                                  onChange={(e) => setAutoModerationConfig(prev => ({...prev, autoBlock: e.target.checked}))}
                                  className="mr-2"
                                />
                                Bloquejar contingut automàticament
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={autoModerationConfig.autoReview}
                                  onChange={(e) => setAutoModerationConfig(prev => ({...prev, autoReview: e.target.checked}))}
                                  className="mr-2"
                                />
                                Marcar per revisió automàtica
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={autoModerationConfig.notifyModerators}
                                  onChange={(e) => setAutoModerationConfig(prev => ({...prev, notifyModerators: e.target.checked}))}
                                  className="mr-2"
                                />
                                Notificar moderadors
                              </label>
                            </div>
                          </div>

                          {/* Configuración por categorías */}
                          <div className="space-y-4">
                            <h6 className="font-medium text-gray-900">Categories i Accions</h6>
                            <div className="space-y-3">
                              {Object.entries(autoModerationConfig.categories).map(([category, config]) => (
                                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={config.enabled}
                                      onChange={(e) => setAutoModerationConfig(prev => ({
                                        ...prev,
                                        categories: {
                                          ...prev.categories,
                                          [category]: { ...config, enabled: e.target.checked }
                                        }
                                      }))}
                                      className="mr-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                      {category === 'homophobic' ? 'Homòfob' :
                                       category === 'sexist' ? 'Sexista' :
                                       category === 'racist' ? 'Racista' :
                                       category === 'violence' ? 'Violència' :
                                       category === 'hate' ? 'Odi' :
                                       category === 'spam' ? 'Spam' :
                                       category === 'vulgar' ? 'Vulgar' :
                                       category === 'misinformation' ? 'Desinformació' : category}
                                    </span>
                                  </div>
                                  <select
                                    value={config.action}
                                    onChange={(e) => setAutoModerationConfig(prev => ({
                                      ...prev,
                                      categories: {
                                        ...prev.categories,
                                        [category]: { ...config, action: e.target.value }
                                      }
                                    }))}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                                    disabled={!config.enabled}
                                  >
                                    <option value="review">Revisar</option>
                                    <option value="block">Bloquejar</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => alert('Configuració de moderació automàtica guardada!')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Guardar Configuració
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filtros para reportes */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <h5 className="font-medium text-gray-900">Filtrar Reportes</h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estat</label>
                        <select
                          value={moderationFilters.status}
                          onChange={(e) => setModerationFilters({...moderationFilters, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="all">Tots</option>
                          <option value="pending">Pendents</option>
                          <option value="in_review">En Revisió</option>
                          <option value="resolved">Resolts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select
                          value={moderationFilters.category}
                          onChange={(e) => setModerationFilters({...moderationFilters, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="all">Totes</option>
                          <option value="spam">Spam</option>
                          <option value="inappropriate">Contingut Inadequat</option>
                          <option value="misinformation">Desinformació</option>
                          <option value="harassment">Assetjament</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prioritat</label>
                        <select
                          value={moderationFilters.priority}
                          onChange={(e) => setModerationFilters({...moderationFilters, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="all">Totes</option>
                          <option value="critical">Crítica</option>
                          <option value="high">Alta</option>
                          <option value="medium">Mitjana</option>
                          <option value="low">Baixa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data des de</label>
                        <input
                          type="date"
                          value={moderationFilters.dateFrom}
                          onChange={(e) => setModerationFilters({...moderationFilters, dateFrom: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data fins</label>
                        <input
                          type="date"
                          value={moderationFilters.dateTo}
                          onChange={(e) => setModerationFilters({...moderationFilters, dateTo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lista de reportes */}
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h5 className="font-medium text-gray-900">Reportes ({filteredReports.length})</h5>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredReports.map((report) => (
                        <div key={report.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  report.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {report.status === 'pending' ? 'Pendent' :
                                   report.status === 'in_review' ? 'En Revisió' :
                                   report.status === 'resolved' ? 'Resolt' : 'Desconegut'}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  report.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                  report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {report.priority === 'critical' ? 'Crítica' :
                                   report.priority === 'high' ? 'Alta' :
                                   report.priority === 'medium' ? 'Mitjana' : 'Baixa'}
                                </span>
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full capitalize">
                                  {report.category}
                                </span>
                              </div>
                              
                              <h6 className="font-semibold text-gray-900 mb-2">Usuari Reportat: {report.reportedUser}</h6>
                              <p className="text-sm text-gray-700 mb-2"><strong>Contingut:</strong> {report.postContent}</p>
                              <p className="text-sm text-gray-600 mb-2"><strong>Motiu:</strong> {report.description}</p>
                              <p className="text-xs text-gray-500 mb-2">Reportat per {report.reportedBy} el {report.reportDate}</p>
                              
                              {report.moderatorNotes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-800"><strong>Notes del Moderador:</strong> {report.moderatorNotes}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              {report.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'in_review', 'En procés de revisió')}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Revisar
                                  </button>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'resolved', 'Reporte resolt sense accions')}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => handleSuspendUser(report.id, 7, 'Violació de normes comunitàries')}
                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    Suspendre 7d
                                  </button>
                                </>
                              )}
                              
                              {report.status === 'in_review' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'resolved', 'Revisió completada - sense accions necessàries')}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Resoldre
                                  </button>
                                  <button
                                    onClick={() => handleSuspendUser(report.id, 3, 'Contingut inadequat - primera advertència')}
                                    className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                                  >
                                    Suspendre 3d
                                  </button>
                                  <button
                                    onClick={() => handleSuspendUser(report.id, 30, 'Violació greu de normes comunitàries')}
                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    Suspendre 30d
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredReports.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          No s'han trobat reportes amb els filtres aplicats
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenido Bloqueado Automáticamente */}
                  <div className="bg-white rounded-lg border shadow-sm mt-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h5 className="font-medium text-gray-900">Contingut Bloquejat Automàticament ({autoBlockedContent.length})</h5>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {autoBlockedContent.map((item) => (
                        <div key={item.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                  Bloquejat Automàticament
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.confidence >= 90 ? 'bg-red-100 text-red-800' :
                                  item.confidence >= 75 ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  Confiança: {item.confidence}%
                                </span>
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full capitalize">
                                  {item.detectedCategory === 'homophobic' ? 'Homòfob' :
                                   item.detectedCategory === 'sexist' ? 'Sexista' :
                                   item.detectedCategory === 'racist' ? 'Racista' :
                                   item.detectedCategory === 'violence' ? 'Violència' :
                                   item.detectedCategory === 'hate' ? 'Odi' :
                                   item.detectedCategory === 'spam' ? 'Spam' :
                                   item.detectedCategory === 'vulgar' ? 'Vulgar' :
                                   item.detectedCategory === 'misinformation' ? 'Desinformació' : item.detectedCategory}
                                </span>
                              </div>
                              
                              <h6 className="font-semibold text-gray-900 mb-2">Autor: {item.author}</h6>
                              <p className="text-sm text-gray-700 mb-2"><strong>Contingut:</strong> {item.content}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                Bloquejat automàticament el {new Date(item.timestamp).toLocaleString('ca-ES')}
                              </p>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              {!item.reviewed && (
                                <>
                                  <button
                                    onClick={() => {
                                      setAutoBlockedContent(autoBlockedContent.map(content => 
                                        content.id === item.id 
                                          ? { ...content, reviewed: true, action: 'approved' }
                                          : content
                                      ))
                                      alert('Contingut aprovat i desblocat')
                                    }}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => {
                                      setAutoBlockedContent(autoBlockedContent.map(content => 
                                        content.id === item.id 
                                          ? { ...content, reviewed: true, action: 'confirmed_block' }
                                          : content
                                      ))
                                      alert('Bloqueig confirmat')
                                    }}
                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    Confirmar Bloqueig
                                  </button>
                                </>
                              )}
                              
                              {item.reviewed && (
                                <span className={`px-3 py-1 text-xs rounded font-medium ${
                                  item.action === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.action === 'approved' ? 'Aprovat' : 'Bloqueig Confirmat'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {autoBlockedContent.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          No hi ha contingut bloquejat automàticament
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usuaris suspesos */}
                  <div className="bg-white rounded-lg border shadow-sm mt-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h5 className="font-medium text-gray-900">Usuaris Suspesos ({suspendedUsers.length})</h5>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {suspendedUsers.map((user) => (
                        <div key={user.id} className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: visualConfig.secondaryColor }}
                            >
                              {user.userName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h6 className="font-semibold text-gray-900">{user.userName}</h6>
                              <p className="text-sm text-gray-600">{user.userEmail}</p>
                              <p className="text-xs text-gray-500">
                                Suspès del {user.suspensionDate} al {user.suspensionEnd}
                              </p>
                              <p className="text-xs text-red-600 font-medium">Motiu: {user.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{user.reportsCount} reportes</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status === 'active' ? 'Suspès' : 'Inactiu'}
                              </span>
                            </div>
                            <button
                              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              onClick={() => alert('Funcionalitat per aixecar suspensió')}
                            >
                              Aixecar Suspensió
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {suspendedUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          No hi ha usuaris suspesos actualment
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nou Post - Versión Avanzada */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-600" />
                  Crear Nou Post
                </h3>
                <button
                  onClick={() => setShowCreatePostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { 
                e.preventDefault()
                handleCreatePost()
              }} className="space-y-6">
                
                {/* Avatar y autor */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: visualConfig.primaryColor }}
                  >
                    AD
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">Administrador</span>
                      <span className="text-sm text-gray-500">· Admin</span>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Títol del post..."
                  />
                </div>

                {/* Contenido */}
                <div>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Què estàs pensant?"
                  ></textarea>
                </div>

                {/* Preview de imagen */}
                {newPost.image && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(newPost.image)} 
                      alt="Preview" 
                      className="max-w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPost({...newPost, image: null})}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Preview de video */}
                {newPost.video && (
                  <div className="relative">
                    <video 
                      src={URL.createObjectURL(newPost.video)} 
                      className="max-w-full h-64 rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => setNewPost({...newPost, video: null})}
                      className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Archivos adjuntos */}
                {newPost.files.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Arxius adjunts:</h5>
                    {newPost.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Enlaces */}
                {newPost.link && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700 truncate">{newPost.link}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewPost({...newPost, link: ''})}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Herramientas multimedia */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Imagen */}
                      <label className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Image className="w-5 h-5" />
                        <span className="text-sm">Imatge</span>
                      </label>

                      {/* Video */}
                      <label className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          className="hidden"
                        />
                        <Video className="w-5 h-5" />
                        <span className="text-sm">Vídeo</span>
                      </label>

                      {/* Archivos */}
                      <label className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFilesChange}
                          className="hidden"
                        />
                        <Paperclip className="w-5 h-5" />
                        <span className="text-sm">Arxius</span>
                      </label>

                      {/* Emojis */}
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Smile className="w-5 h-5" />
                        <span className="text-sm">Emojis</span>
                      </button>

                      {/* Ubicación */}
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm">Ubicació</span>
                      </button>

                      {/* Encuesta */}
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm">Enquesta</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campo para enlaces */}
                <div>
                  <input
                    type="url"
                    value={newPost.link}
                    onChange={(e) => setNewPost({...newPost, link: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Afegir enllaç (opcional)..."
                  />
                </div>

                {/* Configuraciones del post */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipus de Post</label>
                      <select
                        value={newPost.type}
                        onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="announcement">Anunci</option>
                        <option value="event">Esdeveniment</option>
                        <option value="job">Feina</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newPost.pinned}
                          onChange={(e) => setNewPost({...newPost, pinned: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 mr-2"
                        />
                        <Pin className="w-4 h-4 mr-1" />
                        Fixar post
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreatePostModal(false)}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel·lar
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePreviewPost}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-2"
                      disabled={!newPost.title && !newPost.content}
                    >
                      <Eye className="w-4 h-4" />
                      Vista Prèvia
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      style={{ backgroundColor: visualConfig.primaryColor }}
                    >
                      <Plus className="w-4 h-4" />
                      Crear Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Previa */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Vista Prèvia del Post
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Simulación del contexto real del feed */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="max-w-2xl mx-auto space-y-4">
                  
                  {/* Header simulado de La Pública */}
                  <div 
                    className="p-3 rounded-lg shadow-sm"
                    style={{ backgroundColor: visualConfig.primaryColor }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        {currentCommunity?.nombre?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">La Pública - {currentCommunity?.nombre}</span>
                        <p className="text-xs opacity-90">Vista prèvia en temps real</p>
                      </div>
                    </div>
                  </div>

                  {/* Post preview - Aspecto real del feed */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: visualConfig.primaryColor }}
                      >
                        AD
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h6 className="font-semibold text-gray-900">Administrador</h6>
                          <span className="text-xs text-gray-500">· Admin · ara mateix</span>
                          {newPost.pinned && <Pin className="w-4 h-4 text-blue-600" />}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            newPost.type === 'announcement' ? 'bg-red-100 text-red-800' :
                            newPost.type === 'event' ? 'bg-green-100 text-green-800' :
                            newPost.type === 'job' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newPost.type === 'announcement' ? 'Anunci' :
                             newPost.type === 'event' ? 'Esdeveniment' :
                             newPost.type === 'job' ? 'Feina' : 'General'}
                          </span>
                        </div>
                        
                        {/* Título del post */}
                        {newPost.title && (
                          <h5 className="font-semibold text-gray-900 mb-2">{newPost.title}</h5>
                        )}
                        
                        {/* Contenido del post */}
                        {newPost.content ? (
                          <div className="text-gray-700 mb-3">
                            {newPost.content.split('\n').map((line, index) => (
                              <p key={index} className="mb-1">{line}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic mb-3">Escriu contingut per veure la vista prèvia...</p>
                        )}

                        {/* Preview de imagen en la vista previa */}
                        {newPost.image && (
                          <div className="mb-3">
                            <img 
                              src={URL.createObjectURL(newPost.image)} 
                              alt="Preview" 
                              className="max-w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Preview de video en la vista previa */}
                        {newPost.video && (
                          <div className="mb-3">
                            <video 
                              src={URL.createObjectURL(newPost.video)} 
                              className="max-w-full h-48 rounded-lg"
                              controls
                            />
                          </div>
                        )}

                        {/* Archivos adjuntos en la vista previa */}
                        {newPost.files.length > 0 && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <h6 className="text-sm font-medium text-gray-900 mb-2">Arxius adjunts:</h6>
                            <div className="space-y-1">
                              {newPost.files.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{file.name}</span>
                                  <span className="text-xs">({Math.round(file.size / 1024)} KB)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Enlaces en la vista previa */}
                        {newPost.link && (
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Link className="w-4 h-4 text-blue-600" />
                              <a href={newPost.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                                {newPost.link}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {/* Botones de interacción */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t border-gray-100">
                          <button className="hover:text-blue-600 transition-colors">👍 0 M'agrada</button>
                          <button className="hover:text-blue-600 transition-colors">💬 0 Comentaris</button>
                          <button className="hover:text-blue-600 transition-colors">↗️ Compartir</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional de la preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">Vista Prèvia en Temps Real</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Aquesta és exactament la manera com es veurà el teu post en el feed de La Pública.
                          {newPost.pinned && ' El post apareixerà fixat a la part superior.'}
                          {' '} Tipus: <strong>{newPost.type === 'announcement' ? 'Anunci' :
                                                   newPost.type === 'event' ? 'Esdeveniment' :
                                                   newPost.type === 'job' ? 'Feina' : 'General'}</strong>
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-blue-600">
                          <span>✓ Colors corporatius aplicats</span>
                          <span>✓ Format responsive</span>
                          <span>✓ Interaccions disponibles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Tancar Vista Prèvia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Comunitat */}
      {showNewCommunityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-blue-600" />
                  Crear Nova Comunitat Autònoma
                </h3>
                <button
                  onClick={() => setShowNewCommunityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { 
                e.preventDefault()
                handleCreateCommunity()
              }} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Comunitat *</label>
                    <input
                      type="text"
                      value={newCommunity.nombre}
                      onChange={(e) => setNewCommunity({...newCommunity, nombre: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Comunitat Valenciana"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Codi *</label>
                    <input
                      type="text"
                      value={newCommunity.codigo}
                      onChange={(e) => setNewCommunity({...newCommunity, codigo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="valencia"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Host/Domini</label>
                  <input
                    type="text"
                    value={newCommunity.host}
                    onChange={(e) => setNewCommunity({...newCommunity, host: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="valencia.lapublica.es"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Primari</label>
                    <input
                      type="color"
                      value={newCommunity.tema.colorPrimario}
                      onChange={(e) => setNewCommunity({
                        ...newCommunity,
                        tema: { ...newCommunity.tema, colorPrimario: e.target.value }
                      })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Secundari</label>
                    <input
                      type="color"
                      value={newCommunity.tema.colorSecundario}
                      onChange={(e) => setNewCommunity({
                        ...newCommunity,
                        tema: { ...newCommunity.tema, colorSecundario: e.target.value }
                      })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color d'Accent</label>
                    <input
                      type="color"
                      value={newCommunity.tema.colorAccento}
                      onChange={(e) => setNewCommunity({
                        ...newCommunity,
                        tema: { ...newCommunity.tema, colorAccento: e.target.value }
                      })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewCommunityModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel·lar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Crear Comunitat
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Grup */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Crear Nou Grup</h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Informació Bàsica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom del Grup *</label>
                  <input
                    type="text"
                    value={newGroup.nom}
                    onChange={(e) => setNewGroup({...newGroup, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Desenvolupadors Web Catalunya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipus *</label>
                  <select
                    value={newGroup.tipus}
                    onChange={(e) => setNewGroup({...newGroup, tipus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="publico">Públic - Visible per tothom</option>
                    <option value="privado">Privat - Només amb invitació</option>
                    <option value="oculto">Ocult - Secret i només per invitació</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripció Curta *</label>
                <textarea
                  value={newGroup.descripcio}
                  onChange={(e) => setNewGroup({...newGroup, descripcio: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripció breu que apareix a la targeta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripció Llarga</label>
                <textarea
                  value={newGroup.descripcioLarga}
                  onChange={(e) => setNewGroup({...newGroup, descripcioLarga: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripció detallada que apareix dins del grup..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={newGroup.categoria}
                    onChange={(e) => setNewGroup({...newGroup, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="afinidad">Afinitat - Interessos comuns</option>
                    <option value="profesional">Professional - Àmbit de treball</option>
                    <option value="geografico">Geogràfic - Ubicació territorial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategoria</label>
                  <input
                    type="text"
                    value={newGroup.subcategoria}
                    onChange={(e) => setNewGroup({...newGroup, subcategoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Tecnologia, Administració..."
                  />
                </div>
              </div>

              {/* Jerarquia de Grups */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Tipo de Grupo</h4>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="groupType"
                        value="parent"
                        checked={!newGroup.grupPareId}
                        onChange={() => setNewGroup({
                          ...newGroup,
                          grupPareId: null,
                          nivel: 0
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Grupo Principal</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="groupType"
                        value="child"
                        checked={!!newGroup.grupPareId}
                        onChange={() => setNewGroup({
                          ...newGroup,
                          grupPareId: groups.find(g => g.nivel === 0)?.id?.toString() || null,
                          nivel: 1
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Subgrupo</span>
                    </label>
                  </div>
                </div>
                
                {newGroup.grupPareId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Grupo Padre *
                    </label>
                    <select
                      value={newGroup.grupPareId || ''}
                      onChange={(e) => {
                        const parentId = e.target.value || null
                        setNewGroup({
                          ...newGroup, 
                          grupPareId: parentId,
                          nivel: parentId ? 1 : 0
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecciona el grupo padre</option>
                      {groups
                        .filter(g => g.nivel === 0) // Solo grupos principales
                        .map(group => (
                          <option key={group.id} value={group.id}>
                            {group.nom} ({group.membres} miembros)
                          </option>
                        ))}
                    </select>
                    {newGroup.grupPareId && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-blue-800">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            Este será un subgrupo de "{groups.find(g => g.id.toString() === newGroup.grupPareId)?.nom}"
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          Los subgrupos heredan algunas configuraciones del grupo padre y aparecen anidados en la lista
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Administradors */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Administradors del Grup</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'administrador"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAdmin.trim() && !newGroup.administradors.includes(newAdmin.trim())) {
                        setNewGroup({
                          ...newGroup,
                          administradors: [...newGroup.administradors, newAdmin.trim()]
                        })
                        setNewAdmin('')
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {newGroup.administradors.map((admin, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{admin}</span>
                        {index === 0 && <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Principal</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewGroup({
                            ...newGroup,
                            administradors: newGroup.administradors.filter((_, i) => i !== index)
                          })
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {newGroup.administradors.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Cap administrador afegit</p>
                  )}
                </div>
              </div>

              {/* Moderadors */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Moderadors del Grup</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newModerator}
                    onChange={(e) => setNewModerator(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom del moderador"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newModerator.trim() && !newGroup.moderadors.includes(newModerator.trim())) {
                        setNewGroup({
                          ...newGroup,
                          moderadors: [...newGroup.moderadors, newModerator.trim()]
                        })
                        setNewModerator('')
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {newGroup.moderadors.map((moderator, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">{moderator}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewGroup({
                            ...newGroup,
                            moderadors: newGroup.moderadors.filter((_, i) => i !== index)
                          })
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {newGroup.moderadors.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Cap moderador afegit</p>
                  )}
                </div>
              </div>

              {/* Imatges */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar del Grup</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {newGroup.avatar ? (
                        <img src={URL.createObjectURL(newGroup.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewGroup({...newGroup, avatar: e.target.files[0]})
                          }
                        }}
                        className="text-sm text-gray-600 mb-1"
                      />
                      <p className="text-xs text-gray-500">Imatge quadrada, recomanat 100x100px</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portada del Grup</label>
                  <div className="space-y-2">
                    {newGroup.portada && (
                      <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden">
                        <img src={URL.createObjectURL(newGroup.portada)} alt="Portada" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewGroup({...newGroup, portada: e.target.files[0]})
                          }
                        }}
                        className="text-sm text-gray-600 mb-1"
                      />
                      <p className="text-xs text-gray-500">Imatge panoràmica, recomanat 800x200px</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestió d'Ofertes Exclusives */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Ofertes Exclusives</h4>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newGroup.teOfertes}
                      onChange={(e) => setNewGroup({ 
                        ...newGroup, 
                        teOfertes: e.target.checked,
                        ofertes: e.target.checked ? newGroup.ofertes : []
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Habilitar ofertes</span>
                  </label>
                </div>
                
                {newGroup.teOfertes && (
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                    {newGroup.ofertes.map((oferta, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-sm font-medium text-gray-800">Oferta {index + 1}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newOfertes = newGroup.ofertes.filter((_, i) => i !== index)
                              setNewGroup({ ...newGroup, ofertes: newOfertes })
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Títol de l'oferta
                            </label>
                            <input
                              type="text"
                              value={oferta.title}
                              onChange={(e) => {
                                const newOfertes = [...newGroup.ofertes]
                                newOfertes[index] = { ...oferta, title: e.target.value }
                                setNewGroup({ ...newGroup, ofertes: newOfertes })
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Ex: Curs React Avançat"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Descompte (%)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={oferta.discount}
                              onChange={(e) => {
                                const newOfertes = [...newGroup.ofertes]
                                newOfertes[index] = { ...oferta, discount: parseInt(e.target.value) || 0 }
                                setNewGroup({ ...newGroup, ofertes: newOfertes })
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="20"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Empresa
                            </label>
                            <input
                              type="text"
                              value={oferta.company}
                              onChange={(e) => {
                                const newOfertes = [...newGroup.ofertes]
                                newOfertes[index] = { ...oferta, company: e.target.value }
                                setNewGroup({ ...newGroup, ofertes: newOfertes })
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Ex: TechAcademy"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        const newOferta = {
                          id: Date.now(), // Temporal ID
                          title: '',
                          discount: 0,
                          company: ''
                        }
                        setNewGroup({ 
                          ...newGroup, 
                          ofertes: [...newGroup.ofertes, newOferta] 
                        })
                      }}
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      + Afegir nova oferta
                    </button>
                  </div>
                )}
              </div>

              {/* Configuració */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Configuració</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newGroup.esDestacado}
                      onChange={(e) => setNewGroup({...newGroup, esDestacado: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Grup destacat ⭐</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newGroup.configuracion.ofertasExclusivas}
                      onChange={(e) => setNewGroup({
                        ...newGroup, 
                        configuracion: {...newGroup.configuracion, ofertasExclusivas: e.target.checked}
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ofertes exclusives</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newGroup.configuracion.requireApproval}
                      onChange={(e) => setNewGroup({
                        ...newGroup, 
                        configuracion: {...newGroup.configuracion, requireApproval: e.target.checked}
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Requereix aprovació per unir-se</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newGroup.configuracion.allowMemberPosts}
                      onChange={(e) => setNewGroup({
                        ...newGroup, 
                        configuracion: {...newGroup.configuracion, allowMemberPosts: e.target.checked}
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Permetre posts dels membres</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  if (newGroup.nom && newGroup.descripcio) {
                    setShowPreviewGroupModal(true)
                  } else {
                    alert('Completa al menos el nombre y descripción para ver la vista previa')
                  }
                }}
                disabled={!newGroup.nom || !newGroup.descripcio}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Vista Previa</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateGroupModal(false)
                    resetGroupForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Lógica per crear el grup
                  if (newGroup.nom && newGroup.descripcio && newGroup.administradors.length > 0) {
                    console.log('Crear grup:', newGroup)
                    
                    // Crear el nou grup amb ID temporal
                    const groupId = Date.now()
                    const newGroupWithId = {
                      id: groupId,
                      nom: newGroup.nom,
                      categoria: newGroup.categoria,
                      subcategoria: newGroup.subcategoria,
                      membres: 0,
                      administradors: newGroup.administradors,
                      estat: 'Actiu' as string,
                      dataCreacio: new Date().toISOString().split('T')[0],
                      tipus: newGroup.tipus,
                      descripcio: newGroup.descripcio,
                      descripcioLarga: newGroup.descripcioLarga,
                      avatar: newGroup.avatar ? URL.createObjectURL(newGroup.avatar) : 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop&crop=face',
                      portada: newGroup.portada ? URL.createObjectURL(newGroup.portada) : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=200&fit=crop',
                      moderadors: newGroup.moderadors,
                      etiquetes: newGroup.etiquetes,
                      esDestacado: newGroup.esDestacado,
                      grupPareId: newGroup.grupPareId ? parseInt(newGroup.grupPareId) : null,
                      subgrups: newGroup.subgrups,
                      nivel: newGroup.nivel,
                      teOfertes: newGroup.teOfertes,
                      ofertes: newGroup.ofertes,
                      configuracion: newGroup.configuracion
                    }
                    
                    // Actualizar el estado dels grups
                    const updatedGroups = [...groups, newGroupWithId]
                    
                    // Si es un subgrup, actualitzar el grup pare
                    if (newGroup.grupPareId) {
                      const parentId = parseInt(newGroup.grupPareId)
                      const updatedGroupsWithParent = updatedGroups.map(group => {
                        if (group.id === parentId) {
                          return {
                            ...group,
                            subgrups: [...group.subgrups, groupId.toString()]
                          }
                        }
                        return group
                      })
                      setGroups(updatedGroupsWithParent)
                    } else {
                      setGroups(updatedGroups)
                    }
                    
                    setShowCreateGroupModal(false)
                    resetGroupForm()
                  } else {
                    alert('Si us plau, omple els camps obligatoris: Nom, Descripció i almenys un Administrador')
                  }
                }}
                disabled={!newGroup.nom || !newGroup.descripcio || newGroup.administradors.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                  Crear Grup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Grup */}
      {showEditGroupModal && selectedGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Editar Grup: {selectedGroup.nom}</h3>
              <button
                onClick={() => setShowEditGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Aquí s'afegirien els camps d'edició similars al modal de crear */}
              <div className="text-center py-8 text-gray-500">
                Formulari d'edició del grup {selectedGroup.nom}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setShowEditGroupModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => {
                  console.log('Guardar canvis')
                  setShowEditGroupModal(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Canvis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Previa */}
      {showPreviewGroupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Vista Previa: {newGroup.nom}</h3>
              <button
                onClick={() => setShowPreviewGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Toggle entre vistas */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setPreviewMode('card')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  previewMode === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vista Tarjeta
              </button>
              <button
                onClick={() => setPreviewMode('single')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  previewMode === 'single'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Página Individual
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {previewMode === 'card' ? (
                /* Vista Previa Tarjeta */
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {/* Portada */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                      {newGroup.portada && (
                        <img 
                          src={URL.createObjectURL(newGroup.portada)} 
                          alt="Portada" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      {newGroup.esDestacado && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Destacado
                        </div>
                      )}
                    </div>
                    
                    {/* Avatar y info principal */}
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {newGroup.avatar ? (
                            <img 
                              src={URL.createObjectURL(newGroup.avatar)} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {newGroup.nom}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">
                              {newGroup.categoria === 'profesional' ? '💼' : 
                               newGroup.categoria === 'geografico' ? '📍' : '❤️'} 
                              {newGroup.categoria.charAt(0).toUpperCase() + newGroup.categoria.slice(1)}
                            </span>
                            {newGroup.subcategoria && (
                              <span className="text-sm text-gray-500">
                                • {newGroup.subcategoria}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                        {newGroup.descripcio}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            0 miembros
                          </span>
                          <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-1" />
                            {newGroup.tipus === 'publico' ? 'Público' : 
                             newGroup.tipus === 'privado' ? 'Privado' : 'Oculto'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {newGroup.teOfertes && (
                            <span className="text-lg" title="Tiene ofertas exclusivas">🎁</span>
                          )}
                          {newGroup.grupPareId && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Subgrupo
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Unirse al grupo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Vista Previa Página Individual */
                <div className="bg-white">
                  {/* Header con portada */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
                    {newGroup.portada && (
                      <img 
                        src={URL.createObjectURL(newGroup.portada)} 
                        alt="Portada" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    
                    {/* Información principal sobre la portada */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-end space-x-4">
                        <div className="w-24 h-24 rounded-lg bg-white p-1 flex-shrink-0 overflow-hidden">
                          {newGroup.avatar ? (
                            <img 
                              src={URL.createObjectURL(newGroup.avatar)} 
                              alt="Avatar" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h1 className="text-3xl font-bold truncate">
                              {newGroup.nom}
                            </h1>
                            {newGroup.esDestacado && (
                              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                ⭐ Destacado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-white/90">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              0 miembros
                            </span>
                            <span>
                              {newGroup.categoria === 'profesional' ? '💼' : 
                               newGroup.categoria === 'geografico' ? '📍' : '❤️'} 
                              {newGroup.categoria.charAt(0).toUpperCase() + newGroup.categoria.slice(1)}
                              {newGroup.subcategoria && ` • ${newGroup.subcategoria}`}
                            </span>
                            <span className="flex items-center">
                              <Shield className="w-4 h-4 mr-1" />
                              {newGroup.tipus === 'publico' ? 'Público' : 
                               newGroup.tipus === 'privado' ? 'Privado' : 'Oculto'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Unirse al grupo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenido principal */}
                  <div className="max-w-4xl mx-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Columna principal */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h2 className="text-xl font-semibold mb-4">Acerca del grupo</h2>
                          <p className="text-gray-700 leading-relaxed">
                            {newGroup.descripcioLarga || newGroup.descripcio}
                          </p>
                          
                          {newGroup.grupPareId && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center text-blue-800">
                                <Users className="w-4 h-4 mr-2" />
                                <span className="font-medium">
                                  Subgrupo de "{groups.find(g => g.id.toString() === newGroup.grupPareId)?.nom}"
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
                          <div className="text-center py-8 text-gray-500">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Aún no hay actividad en este grupo</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Administradores */}
                        {newGroup.administradors.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Administradores</h3>
                            <div className="space-y-3">
                              {newGroup.administradors.map((admin, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="text-sm font-medium">{admin}</span>
                                  {index === 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Principal</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Moderadores */}
                        {newGroup.moderadors.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Moderadores</h3>
                            <div className="space-y-3">
                              {newGroup.moderadors.map((moderator, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="text-sm font-medium">{moderator}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Ofertas exclusivas */}
                        {newGroup.teOfertes && newGroup.ofertes.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold mb-4 flex items-center">
                              <span className="mr-2">🎁</span>
                              Ofertas Exclusivas
                            </h3>
                            <div className="space-y-3">
                              {newGroup.ofertes.map((oferta, index) => (
                                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-sm">{oferta.title}</p>
                                      <p className="text-xs text-gray-600">{oferta.company}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-lg font-bold text-green-600">-{oferta.discount}%</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Información adicional */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="font-semibold mb-4">Información</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tipo:</span>
                              <span className="font-medium">
                                {newGroup.tipus === 'publico' ? 'Público' : 
                                 newGroup.tipus === 'privado' ? 'Privado' : 'Oculto'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Categoría:</span>
                              <span className="font-medium">
                                {newGroup.categoria.charAt(0).toUpperCase() + newGroup.categoria.slice(1)}
                              </span>
                            </div>
                            {newGroup.subcategoria && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subcategoría:</span>
                                <span className="font-medium">{newGroup.subcategoria}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ofertas:</span>
                              <span className="font-medium">
                                {newGroup.teOfertes ? 'Sí' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setShowPreviewGroupModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar Vista Previa
              </button>
              <button
                onClick={() => {
                  setShowPreviewGroupModal(false)
                  // Aquí podría abrir directamente el modal de crear
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continuar Editando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestionar Membres */}
      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Gestionar Membres: {selectedGroup.nom}</h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total membres: {selectedGroup.membres}</p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Afegir Membre
                </button>
              </div>

              {/* Llista de membres per rol */}
              <div className="space-y-4">
                {/* Administradors */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Administradors ({selectedGroup.administradors?.length || 0})
                  </h5>
                  <div className="border rounded-lg divide-y">
                    {selectedGroup.administradors?.map((admin, index) => (
                      <div key={index} className="p-4 flex items-center justify-between hover:bg-blue-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                            {admin.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{admin}</p>
                            <p className="text-sm text-blue-600">
                              Administrador {index === 0 ? '(Principal)' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="text-sm border rounded px-2 py-1" defaultValue="admin">
                            <option value="admin">Administrador</option>
                            <option value="moderator">Moderador</option>
                            <option value="member">Membre</option>
                          </select>
                          {selectedGroup.administradors.length > 1 && (
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderadors */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Moderadors ({selectedGroup.moderadors?.length || 0})
                  </h5>
                  <div className="border rounded-lg divide-y">
                    {selectedGroup.moderadors?.length > 0 ? (
                      selectedGroup.moderadors.map((moderator, index) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-green-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
                              {moderator.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{moderator}</p>
                              <p className="text-sm text-green-600">Moderador</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select className="text-sm border rounded px-2 py-1" defaultValue="moderator">
                              <option value="admin">Administrador</option>
                              <option value="moderator">Moderador</option>
                              <option value="member">Membre</option>
                            </select>
                            <button className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 italic">
                        No hi ha moderadors assignats
                      </div>
                    )}
                  </div>
                </div>

                {/* Membres regulars (simulat) */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    Membres Regulars ({selectedGroup.membres - (selectedGroup.administradors?.length || 0) - (selectedGroup.moderadors?.length || 0)})
                  </h5>
                  <div className="border rounded-lg divide-y">
                    <div className="p-4 text-sm text-gray-500 text-center">
                      Llista de membres regulars...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Blog */}
      {showCreateBlogModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedBlog ? 'Editar Entrada de Blog' : 'Nova Entrada de Blog'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateBlogModal(false)
                  setSelectedBlog(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Títol i Asistent IA */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Títol de l'entrada *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newBlogPost.title}
                        onChange={(e) => setNewBlogPost({...newBlogPost, title: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escriu el títol de l'entrada..."
                      />
                      <button
                        onClick={() => {
                          setAiTask('generate-titles')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                        title="Generar títols alternatius amb IA"
                      >
                        <Bot className="w-4 h-4" />
                        <span>IA</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Imagen de Portada */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen de Portada
                    </label>
                    <div className="space-y-3">
                      {/* Vista previa de la imagen */}
                      {newBlogPost.coverImage && (
                        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={URL.createObjectURL(newBlogPost.coverImage)} 
                            alt="Vista previa portada" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Selector de archivo */}
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNewBlogPost({...newBlogPost, coverImage: e.target.files[0]})
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {newBlogPost.coverImage && (
                          <button
                            type="button"
                            onClick={() => setNewBlogPost({...newBlogPost, coverImage: null})}
                            className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Recomendado: 800x400px. Formato JPG, PNG o WebP.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Editor de Contingut */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contingut *
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setAiTask('generate-content')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Generar amb IA</span>
                      </button>
                      <button
                        onClick={() => {
                          setAiTask('improve-text')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 text-sm"
                        disabled={!newBlogPost.content.trim()}
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Millorar</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Rich Text Editor Simulat */}
                  <div className="border border-gray-300 rounded-lg">
                    {/* Barra d'Eines */}
                    <div className="border-b border-gray-200 p-2 flex items-center space-x-2 bg-gray-50">
                      <button className="p-2 rounded hover:bg-gray-200" title="Negreta">
                        <strong>B</strong>
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200" title="Cursiva">
                        <em>I</em>
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200" title="Subratllat">
                        <u>U</u>
                      </button>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <button className="p-2 rounded hover:bg-gray-200" title="Llista">
                        📝
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200" title="Enllaç">
                        🔗
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200" title="Imatge">
                        <Image className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200" title="Codi">
                        <code className="text-sm">&lt;/&gt;</code>
                      </button>
                    </div>
                    
                    {/* Àrea de Text */}
                    <textarea
                      value={newBlogPost.content}
                      onChange={(e) => setNewBlogPost({...newBlogPost, content: e.target.value})}
                      className="w-full h-96 p-4 border-0 resize-none focus:outline-none"
                      placeholder="Escriu el contingut de l'entrada de blog..."
                    />
                    
                    {/* Recompte de Paraules */}
                    <div className="border-t border-gray-200 p-2 text-right text-xs text-gray-500">
                      {newBlogPost.content.trim().split(/\s+/).filter(word => word.length > 0).length} paraules
                    </div>
                  </div>
                </div>

                {/* Vista Prèvia */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowBlogPreviewModal(true)}
                    disabled={!newBlogPost.title.trim() || !newBlogPost.content.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Vista Prèvia</span>
                  </button>
                </div>
              </div>

              {/* Panel Lateral */}
              <div className="space-y-6">
                {/* Agent IA i Idioma */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    Assistència d'IA
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-purple-700 mb-1">
                        Agent IA
                      </label>
                      <select
                        value={newBlogPost.aiAgent}
                        onChange={(e) => setNewBlogPost({...newBlogPost, aiAgent: e.target.value})}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="contingut-web">Agent Contingut Web</option>
                        <option value="redaccio-formal">Agent Redacció Formal</option>
                        <option value="comunicacio-publica">Agent Comunicació Pública</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-700 mb-1">
                        Idioma
                      </label>
                      <select
                        value={newBlogPost.language}
                        onChange={(e) => setNewBlogPost({...newBlogPost, language: e.target.value})}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="catala">Català</option>
                        <option value="castella">Castellà</option>
                        <option value="altres">Altres idiomes</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          setAiTask('create-summary')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs"
                        disabled={!newBlogPost.content.trim()}
                      >
                        Crear Resum
                      </button>
                      <button
                        onClick={() => {
                          setAiTask('optimize-seo')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                        disabled={!newBlogPost.title.trim() || !newBlogPost.content.trim()}
                      >
                        Optimitzar SEO
                      </button>
                      <button
                        onClick={() => {
                          setAiTask('translate')
                          setShowAIModal(true)
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                        disabled={!newBlogPost.content.trim()}
                      >
                        Traduir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Publicació */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Publicació</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Estat
                      </label>
                      <select
                        value={newBlogPost.status}
                        onChange={(e) => setNewBlogPost({...newBlogPost, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Esborrany</option>
                        <option value="published">Publicar ara</option>
                        <option value="scheduled">Programar</option>
                      </select>
                    </div>
                    
                    {newBlogPost.status === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Data
                          </label>
                          <input
                            type="date"
                            value={newBlogPost.publishDate}
                            onChange={(e) => setNewBlogPost({...newBlogPost, publishDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Hora
                          </label>
                          <input
                            type="time"
                            value={newBlogPost.publishTime}
                            onChange={(e) => setNewBlogPost({...newBlogPost, publishTime: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categoria i Tags */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Organització</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        value={newBlogPost.category}
                        onChange={(e) => setNewBlogPost({...newBlogPost, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecciona categoria</option>
                        <option value="Transformació Digital">Transformació Digital</option>
                        <option value="Metodologies">Metodologies</option>
                        <option value="Intel·ligència Artificial">Intel·ligència Artificial</option>
                        <option value="Seguretat">Seguretat</option>
                        <option value="Innovació">Innovació</option>
                        <option value="Normatives">Normatives</option>
                        <option value="Ciutadania Digital">Ciutadania Digital</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tags (separats per comes)
                      </label>
                      <input
                        type="text"
                        value={newBlogPost.tags.join(', ')}
                        onChange={(e) => setNewBlogPost({
                          ...newBlogPost, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="digitalització, innovació, IA..."
                      />
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    SEO
                    <button
                      onClick={() => {
                        setAiTask('optimize-seo')
                        setShowAIModal(true)
                      }}
                      className="ml-auto px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      disabled={!newBlogPost.title.trim() || !newBlogPost.content.trim()}
                    >
                      Optimitzar amb IA
                    </button>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Títol SEO (màx. 60 caràcters)
                      </label>
                      <input
                        type="text"
                        value={newBlogPost.seoTitle}
                        onChange={(e) => setNewBlogPost({...newBlogPost, seoTitle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        maxLength={60}
                        placeholder="Títol optimitzat per cercadors"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {newBlogPost.seoTitle.length}/60 caràcters
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripció SEO (màx. 155 caràcters)
                      </label>
                      <textarea
                        value={newBlogPost.seoDescription}
                        onChange={(e) => setNewBlogPost({...newBlogPost, seoDescription: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        maxLength={155}
                        placeholder="Descripció que apareixerà als cercadors"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {newBlogPost.seoDescription.length}/155 caràcters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botons d'Acció */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setShowCreateBlogModal(false)
                  setSelectedBlog(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    console.log('Guardar com a esborrany:', newBlogPost)
                    setShowCreateBlogModal(false)
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Guardar Esborrany
                </button>
                <button
                  onClick={() => {
                    const blogId = selectedBlog ? selectedBlog.id : Date.now()
                    const newBlog = {
                      id: blogId,
                      ...newBlogPost,
                      author: 'Usuari Actual',
                      views: selectedBlog ? selectedBlog.views : 0,
                      likes: selectedBlog ? selectedBlog.likes : 0,
                      aiGenerated: newBlogPost.content.includes('[IA:') || false
                    }
                    
                    if (selectedBlog) {
                      setBlogPosts(blogPosts.map(b => b.id === selectedBlog.id ? newBlog : b))
                    } else {
                      setBlogPosts([...blogPosts, newBlog])
                    }
                    
                    setShowCreateBlogModal(false)
                    setSelectedBlog(null)
                  }}
                  disabled={!newBlogPost.title.trim() || !newBlogPost.content.trim() || !newBlogPost.category}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {selectedBlog ? 'Actualitzar' : 'Publicar'} Entrada
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal IA */}
      {showAIModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Bot className="w-6 h-6 mr-2 text-purple-600" />
                Assistència d'IA
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {aiTask === 'generate-content' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Generar Contingut amb IA</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema del contingut
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: Digitalització de l'administració pública"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To i estil
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="formal">Formal i tècnic</option>
                        <option value="accessible">Accessible i divulgatiu</option>
                        <option value="professional">Professional i directe</option>
                        <option value="educational">Educatiu i didàctic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitud aproximada
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="short">Curt (300-500 paraules)</option>
                        <option value="medium">Mitjà (500-800 paraules)</option>
                        <option value="long">Llarg (800-1200 paraules)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {aiTask === 'generate-titles' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Generar Títols Alternatius</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Basant-se en el contingut actual, l'IA generarà títols alternatius optimitzats per SEO i engagement.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Títol actual:</p>
                      <p className="text-gray-900">{newBlogPost.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600 flex items-center">
                <Bot className="w-4 h-4 mr-1 text-purple-600" />
                Agent: {newBlogPost.aiAgent === 'contingut-web' ? 'Contingut Web' : 'Altre'}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    console.log('Executant tasca IA:', aiTask)
                    alert('Funcionalitat d\'IA simulada. En producció connectaria amb el servei d\'IA.')
                    setShowAIModal(false)
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generar amb IA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Prèvia Blog */}
      {showBlogPreviewModal && (selectedBlog || (newBlogPost.title && newBlogPost.content)) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Vista Prèvia de l'Entrada</h3>
              <button
                onClick={() => setShowBlogPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white max-h-96 overflow-y-auto">
              <article className="prose prose-lg max-w-none">
                {/* Imagen de Portada */}
                {((selectedBlog && selectedBlog.coverImage) || newBlogPost.coverImage) && (
                  <div className="w-full h-64 rounded-lg overflow-hidden mb-6 bg-gray-100">
                    <img 
                      src={
                        selectedBlog && selectedBlog.coverImage 
                          ? selectedBlog.coverImage 
                          : newBlogPost.coverImage 
                            ? URL.createObjectURL(newBlogPost.coverImage)
                            : ''
                      }
                      alt={`Portada de ${selectedBlog ? selectedBlog.title : newBlogPost.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedBlog ? selectedBlog.title : newBlogPost.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Per {selectedBlog ? selectedBlog.author : 'Usuari Actual'}</span>
                    <span>•</span>
                    <span>{selectedBlog ? selectedBlog.publishDate : new Date().toLocaleDateString('ca')}</span>
                    <span>•</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedBlog ? selectedBlog.category : newBlogPost.category}
                    </span>
                  </div>
                  
                  {((selectedBlog && selectedBlog.tags) || newBlogPost.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(selectedBlog ? selectedBlog.tags : newBlogPost.tags).map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="prose prose-lg max-w-none">
                  {(selectedBlog ? selectedBlog.content : newBlogPost.content).split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <button
                onClick={() => setShowBlogPreviewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tancar Vista Prèvia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Tema de Fòrum */}
      {showCreateForumModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedForum ? 'Editar Tema' : 'Crear Nou Tema'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForumModal(false)
                  setSelectedForum(null)
                  setNewForumTopic({
                    title: '',
                    content: '',
                    category: '',
                    tags: [] as string[],
                    isPinned: false,
                    isLocked: false,
                    visibility: 'public',
                    image: null
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Títol amb Moderació */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Títol del Tema</label>
                <ModeratedInput
                  value={newForumTopic.title}
                  onChange={(value) => setNewForumTopic({...newForumTopic, title: value})}
                  placeholder="Escriu el títol del tema..."
                  showSubmitButton={false}
                  multiline={false}
                  maxLength={200}
                  minLength={10}
                  realTimeAnalysis={true}
                />
              </div>

              {/* Contingut amb Moderació */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contingut</label>
                <ModeratedInput
                  value={newForumTopic.content}
                  onChange={(value) => setNewForumTopic({...newForumTopic, content: value})}
                  placeholder="Escriu el contingut del tema..."
                  multiline={true}
                  rows={6}
                  showSubmitButton={false}
                  maxLength={2000}
                  minLength={20}
                  realTimeAnalysis={true}
                  title={newForumTopic.title} // Para análisis conjunto título + contenido
                />
              </div>

              {/* Categoria i Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={newForumTopic.category}
                    onChange={(e) => setNewForumTopic({...newForumTopic, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoria</option>
                    <option value="Transformació Digital">Transformació Digital</option>
                    <option value="Metodologies">Metodologies</option>
                    <option value="Intel·ligència Artificial">Intel·ligència Artificial</option>
                    <option value="Seguretat">Seguretat</option>
                    <option value="Innovació">Innovació</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (separats per comes)</label>
                  <input
                    type="text"
                    value={newForumTopic.tags.join(', ')}
                    onChange={(e) => setNewForumTopic({
                      ...newForumTopic, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="digitalització, consulta, protocol..."
                  />
                </div>
              </div>

              {/* Imatge del tema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imatge del Tema</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewForumTopic({...newForumTopic, image: e.target.files[0]})
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {newForumTopic.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(newForumTopic.image)}
                      alt="Vista prèvia"
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Configuració del tema */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibilitat</label>
                  <select
                    value={newForumTopic.visibility}
                    onChange={(e) => setNewForumTopic({...newForumTopic, visibility: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Públic</option>
                    <option value="private">Privat</option>
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newForumTopic.isPinned}
                      onChange={(e) => setNewForumTopic({...newForumTopic, isPinned: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Fixar tema</span>
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newForumTopic.isLocked}
                      onChange={(e) => setNewForumTopic({...newForumTopic, isLocked: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Bloquejar tema</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setSelectedForum(null)
                  setShowForumPreviewModal(true)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Vista Prèvia
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreateForumModal(false)
                    setSelectedForum(null)
                    setNewForumTopic({
                      title: '',
                      content: '',
                      category: '',
                      tags: [] as string[],
                      isPinned: false,
                      isLocked: false,
                      visibility: 'public',
                      image: null
                    })
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel·lar
                </button>
                <button
                  onClick={() => {
                    if (newForumTopic.title && newForumTopic.content && newForumTopic.category) {
                      const topicData = {
                        ...newForumTopic,
                        id: selectedForum ? selectedForum.id : Date.now(),
                        author: 'Usuari Actual',
                        status: 'active',
                        createdDate: new Date().toISOString().split('T')[0],
                        lastActivity: new Date().toISOString().split('T')[0],
                        replies: selectedForum ? selectedForum.replies : 0,
                        views: selectedForum ? selectedForum.views : 0,
                        image: newForumTopic.image ? URL.createObjectURL(newForumTopic.image) : (selectedForum ? selectedForum.image : ''),
                        lastReply: {
                          author: 'Usuari Actual',
                          date: new Date().toISOString().split('T')[0],
                          time: new Date().toLocaleTimeString('ca', { hour: '2-digit', minute: '2-digit' })
                        }
                      }
                      
                      if (selectedForum) {
                        // Editar tema existent
                        setForumTopics(forumTopics.map(t => t.id === selectedForum.id ? topicData : t))
                      } else {
                        // Crear nou tema
                        setForumTopics([...forumTopics, topicData])
                      }
                      
                      setShowCreateForumModal(false)
                      setSelectedForum(null)
                      setNewForumTopic({
                        title: '',
                        content: '',
                        category: '',
                        tags: [] as string[],
                        isPinned: false,
                        isLocked: false,
                        visibility: 'public',
                        image: null
                      })
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedForum ? 'Guardar Canvis' : 'Crear Tema'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Prèvia Tema de Fòrum */}
      {showForumPreviewModal && (selectedForum || (newForumTopic.title && newForumTopic.content)) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Vista Prèvia del Tema</h3>
              <button
                onClick={() => setShowForumPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white max-h-96 overflow-y-auto">
              <div className="border border-gray-200 rounded-lg p-6">
                {/* Header del tema */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    {(selectedForum ? selectedForum.isPinned : newForumTopic.isPinned) && (
                      <Pin className="w-4 h-4 text-blue-600" />
                    )}
                    {(selectedForum ? selectedForum.isLocked : newForumTopic.isLocked) && (
                      <Lock className="w-4 h-4 text-red-600" />
                    )}
                    {!(selectedForum ? selectedForum.isPinned : newForumTopic.isPinned) && 
                     !(selectedForum ? selectedForum.isLocked : newForumTopic.isLocked) && (
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedForum ? selectedForum.title : newForumTopic.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>Per {selectedForum ? selectedForum.author : 'Usuari Actual'}</span>
                      <span>•</span>
                      <span>{selectedForum ? selectedForum.createdDate : new Date().toLocaleDateString('ca')}</span>
                      <span>•</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedForum ? selectedForum.category : newForumTopic.category}
                      </span>
                    </div>
                    
                    {((selectedForum && selectedForum.tags) || newForumTopic.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(selectedForum ? selectedForum.tags : newForumTopic.tags).map((tag: string, index: number) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Imatge del tema */}
                {((selectedForum && selectedForum.image) || newForumTopic.image) && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-6 bg-gray-100">
                    <img 
                      src={
                        selectedForum && selectedForum.image 
                          ? selectedForum.image 
                          : newForumTopic.image 
                            ? URL.createObjectURL(newForumTopic.image)
                            : ''
                      }
                      alt={`Imatge de ${selectedForum ? selectedForum.title : newForumTopic.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Contingut del tema */}
                <div className="prose prose-sm max-w-none mb-6">
                  {(selectedForum ? selectedForum.content : newForumTopic.content).split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Stats del tema */}
                {selectedForum && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {selectedForum.replies} respostes
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedForum.views} visualitzacions
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Última activitat: {selectedForum.lastReply.author} - {selectedForum.lastReply.date}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t">
              <button
                onClick={() => setShowForumPreviewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tancar Vista Prèvia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Anuncio */}
      {showCreateAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nou Anunci</h2>
              <button
                onClick={() => setShowCreateAnnouncementModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Títol de l'anunci *
                </label>
                <ModeratedInput
                  value={newAnnouncement.title}
                  onChange={(value) => setNewAnnouncement({...newAnnouncement, title: value})}
                  placeholder="Escriu el títol de l'anunci..."
                  maxLength={150}
                  minLength={5}
                  realTimeAnalysis={true}
                />
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contingut de l'anunci *
                </label>
                <ModeratedInput
                  multiline={true}
                  rows={6}
                  value={newAnnouncement.content}
                  onChange={(value) => setNewAnnouncement({...newAnnouncement, content: value})}
                  placeholder="Escriu el contingut de l'anunci..."
                  maxLength={2000}
                  minLength={10}
                  realTimeAnalysis={true}
                  title={newAnnouncement.title}
                />
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioritat
                </label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Prioritat Alta</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Fotografía de portada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotografia de portada
                </label>
                {newAnnouncement.coverImage ? (
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={URL.createObjectURL(newAnnouncement.coverImage)}
                      alt="Portada de l'anunci"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNewAnnouncement({...newAnnouncement, coverImage: null})}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <label className="cursor-pointer block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAnnouncementCoverImageChange}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Feu clic per seleccionar imatge de portada</span>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG fins a 5MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Galería de imágenes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Galeria d'imatges
                  </label>
                  <label className="cursor-pointer px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAnnouncementImagesChange}
                      className="hidden"
                    />
                    + Afegir imatges
                  </label>
                </div>
                {newAnnouncement.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 p-2">
                    {newAnnouncement.images.map((image, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Imatge ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAnnouncementImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-colors shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No hi ha imatges a la galeria</p>
                  </div>
                )}
              </div>

              {/* Archivos adjuntos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Arxius adjunts
                  </label>
                  <label className="cursor-pointer px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleAnnouncementFilesChange}
                      className="hidden"
                    />
                    + Afegir arxius
                  </label>
                </div>
                {newAnnouncement.files.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
                    {newAnnouncement.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">({Math.round(file.size / 1024)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAnnouncementFile(index)}
                          className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-500">No hi ha arxius adjunts</p>
                  </div>
                )}
              </div>

              {/* Opciones */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={newAnnouncement.isPinned}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, isPinned: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="pinned" className="ml-2 text-sm text-gray-700">
                    📌 Fixar a la part superior
                  </label>
                </div>

                <div>
                  <label htmlFor="expires" className="block text-sm font-medium text-gray-700 mb-2">
                    Data d'expiració (opcional)
                  </label>
                  <input
                    type="date"
                    id="expires"
                    value={newAnnouncement.expiresAt}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, expiresAt: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'anunci s'ocultarà automàticament després d'aquesta data
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowCreateAnnouncementModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel·lar
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handlePreviewAnnouncement}
                  disabled={!newAnnouncement.title.trim() && !newAnnouncement.content.trim()}
                  className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Vista Prèvia
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Crear Anunci
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Previa Anuncio */}
      {showAnnouncementPreviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Vista Prèvia de l'Anunci
                </h3>
                <button
                  onClick={() => setShowAnnouncementPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Simulación del contexto real del tablón de anuncios */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="max-w-3xl mx-auto space-y-4">
                  
                  {/* Header simulado de La Pública */}
                  <div 
                    className="p-3 rounded-lg shadow-sm"
                    style={{ backgroundColor: visualConfig.primaryColor }}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                      >
                        {currentCommunity?.nombre?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-sm">La Pública - {currentCommunity?.nombre}</span>
                        <p className="text-xs opacity-90">Tauler d'Anuncis - Vista prèvia</p>
                      </div>
                    </div>
                  </div>

                  {/* Announcement preview */}
                  <div className="bg-white rounded-lg border-l-4 border-blue-500 shadow-sm">
                    {/* Imagen de portada */}
                    {newAnnouncement.coverImage && (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(newAnnouncement.coverImage)} 
                          alt="Portada de l'anunci" 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white shadow-lg ${
                            newAnnouncement.priority === 'urgent' ? 'bg-red-600' :
                            newAnnouncement.priority === 'high' ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`}>
                            {newAnnouncement.priority === 'urgent' ? '🚨 URGENT' :
                             newAnnouncement.priority === 'high' ? '⚡ PRIORITAT ALTA' :
                             '📢 ANUNCI'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: visualConfig.primaryColor }}
                          >
                            AD
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900">Administrador</h6>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>ara mateix</span>
                              {newAnnouncement.isPinned && (
                                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  <Pin className="w-3 h-3" />
                                  Fixat
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Badge de prioridad sin imagen de portada */}
                        {!newAnnouncement.coverImage && (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            newAnnouncement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            newAnnouncement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {newAnnouncement.priority === 'urgent' ? '🚨 URGENT' :
                             newAnnouncement.priority === 'high' ? '⚡ PRIORITAT ALTA' :
                             '📢 ANUNCI'}
                          </span>
                        )}
                      </div>
                      
                      {/* Título del anuncio */}
                      {newAnnouncement.title ? (
                        <h4 className="text-lg font-bold text-gray-900 mb-3">{newAnnouncement.title}</h4>
                      ) : (
                        <p className="text-gray-400 italic mb-3">Escriu un títol per veure la vista prèvia...</p>
                      )}
                      
                      {/* Contenido del anuncio */}
                      {newAnnouncement.content ? (
                        <div className="text-gray-700 mb-4">
                          {newAnnouncement.content.split('\n').map((line, index) => (
                            <p key={index} className="mb-2">{line}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic mb-4">Escriu contingut per veure la vista prèvia...</p>
                      )}

                      {/* Galería de imágenes */}
                      {newAnnouncement.images.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">📷 Galeria d'imatges ({newAnnouncement.images.length})</p>
                          <div className="grid grid-cols-4 gap-2">
                            {newAnnouncement.images.map((image, index) => (
                              <img
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt={`Imatge ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Archivos adjuntos */}
                      {newAnnouncement.files.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">📎 Arxius adjunts ({newAnnouncement.files.length})</p>
                          <div className="space-y-1">
                            {newAnnouncement.files.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                <Paperclip className="w-3 h-3 text-gray-500" />
                                <span className="flex-1 truncate">{file.name}</span>
                                <span className="text-gray-500 text-xs">({Math.round(file.size / 1024)} KB)</span>
                                <button className="text-blue-600 hover:text-blue-800 text-xs">
                                  Baixar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fecha de expiración */}
                      {newAnnouncement.expiresAt && (
                        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            ⏰ Aquest anunci expirarà el {new Date(newAnnouncement.expiresAt).toLocaleDateString('ca-ES')}
                          </p>
                        </div>
                      )}
                      
                      {/* Footer con información */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span>📅 {new Date().toLocaleDateString('ca-ES')}</span>
                          <span>👁️ 0 visualitzacions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="hover:text-blue-600 transition-colors">❤️ Útil</button>
                          <button className="hover:text-blue-600 transition-colors">💬 Comentar</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional de la preview */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">Vista Prèvia en Temps Real</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Aquesta és exactament la manera com es veurà el teu anunci en el tauler d'anuncis de La Pública.
                          L'anunci apareixerà destacat amb la prioritat seleccionada.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAnnouncementPreviewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Tornar a l'Editor
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAnnouncementPreviewModal(false)
                      handleCreateAnnouncement()
                    }}
                    disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Crear Anunci
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}