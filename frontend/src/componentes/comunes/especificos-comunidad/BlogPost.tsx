'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Tag,
  MoreHorizontal,
  Bookmark,
  ThumbsUp,
  Reply
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

interface Comment {
  id: string
  author: string
  authorAvatar: string
  authorRole: string
  content: string
  publishedAt: Date
  likes: number
  replies: Comment[]
  isLiked: boolean
}

interface BlogPostProps {
  blogId: string
}

// Mock data - same as BlogsPrincipal
const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'El futur de l\'administració electrònica a Catalunya',
    excerpt: 'Descobreix com la digitalització està transformant els serveis públics catalans i quines són les tendències per als propers anys.',
    content: `La transformació digital de l'administració pública catalana ha estat un dels reptes més importants dels últims anys. Aquesta digitalització no només ha canviat la manera com els ciutadans interactuen amb les administracions, sinó que també ha millorat l'eficiència i la transparència dels processos interns.

## Els Pilars de la Transformació Digital

### 1. Serveis Digitals Centrats en l'Usuari
L'enfocament principal ha estat posar el ciutadà al centre de tots els processos. Això significa:
- Simplificació dels tràmits
- Reducció de la burocràcia
- Millora de l'experiència d'usuari

### 2. Interoperabilitat entre Sistemes
Un dels aspectes més crítics és garantir que els diferents sistemes puguin comunicar-se entre ells de manera eficient.

### 3. Seguretat i Privacitat de les Dades
La protecció de les dades personals és fonamental en qualsevol procés de digitalització.

## Tendències Futures

### Intel·ligència Artificial i Automatització
La IA començarà a jugar un paper més important en l'automatització de processos repetitius i en l'atenció ciutadana.

### Blockchain per a la Transparència
La tecnologia blockchain ofereix noves oportunitats per garantir la transparència i la integritat dels processos administratius.

## Reptes i Oportunitats

Tot i els avenços significatius, encara hi ha reptes importants per superar:

1. **Bretxa Digital**: Garantir que tots els ciutadans puguin accedir als serveis digitals
2. **Formació del Personal**: Capacitar els empleats públics en les noves tecnologies
3. **Ciberseguretat**: Protegir els sistemes contra amenaces cada vegada més sofisticades

## Conclusió

El futur de l'administració electrònica a Catalunya és prometedor. Amb les inversions adequades en tecnologia, formació i infraestructura, Catalunya pot convertir-se en un referent mundial en administració digital.`,
    author: 'Dr. Maria Fernández',
    authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=3b82f6&color=fff',
    authorRole: 'Directora de Transformació Digital',
    category: 'Transformació Digital',
    tags: ['digitalització', 'administració', 'catalunya'],
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
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
    title: 'Innovació oberta: col·laborant amb la societat civil',
    excerpt: 'Com les administracions públiques poden beneficiar-se de la col·laboració amb ciutadans i organitzacions per impulsar la innovació.',
    content: `La innovació oberta en el sector públic representa un canvi de paradigma fonamental en la manera com les administracions desenvolupen polítiques i serveis. Aquest enfocament reconeix que les millors idees no sempre sorgeixen dins de les organitzacions governamentals, sinó que poden provenir de la societat civil, empreses, universitats i ciutadans individuals.

## Què és la Innovació Oberta?

La innovació oberta és un model que fomenta la col·laboració entre diferents actors per desenvolupar solucions més efectives i sostenibles. En el context del sector públic, això significa:

- Involucrar ciutadans en el disseny de serveis
- Col·laborar amb empreses per desenvolupar tecnologies
- Treballar amb universitats per a la recerca aplicada
- Crear ecosistemes d'innovació públic-privats

## Beneficis per a l'Administració Pública

### Millor Comprensió de les Necessitats Ciutadanes
Quan els ciutadans participen directament en el procés d'innovació, les administracions obtenen una comprensió més profunda de les seves necessitats reals.

### Accés a Noves Tecnologies i Coneixements
La col·laboració amb el sector privat i acadèmic permet accedir a tecnologies i coneixements que potser no estan disponibles internament.

### Reducció de Costos i Riscos
Compartir els costos i riscos del desenvolupament d'innovacions amb altres actors pot fer que projectes ambiciosos siguin més viables.

## Exemples d'Èxit

### Plataformes de Participació Ciutadana
Moltes ciutats han implementat plataformes digitals on els ciutadans poden proposar idees, votar iniciatives i col·laborar en projectes municipals.

### Living Labs Urbans
Els laboratoris vivents permeten experimentar amb noves solucions en entorns reals, involucrant tots els actors interessats.

### Hackathons Cívics
Aquests esdeveniments reuneixen desenvolupadors, dissenyadors i ciutadans per crear solucions tecnològiques a problemes urbans específics.

## Reptes i Barreres

Tot i els beneficis evidents, la implementació de la innovació oberta encara presenta alguns reptes:

1. **Resistència al Canvi**: Les estructures burocràtiques tradicionals poden resistir-se a nous models de col·laboració
2. **Gestió de la Propietat Intel·lectual**: Cal establir marcs clars sobre qui posseeix els resultats de la col·laboració
3. **Coordinació Complexa**: Gestionar múltiples actors amb interessos diferents requereix habilitats de coordinació sofisticades

## Recomanacions per a la Implementació

Per implementar amb èxit la innovació oberta, les administracions públiques haurien de:

- Establir marcs regulatoris clars
- Invertir en capacitació del personal
- Crear canals de comunicació efectius
- Desenvolupar mètriques per avaluar l'impacte
- Fomentar una cultura d'experimentació i aprenentatge

## Conclusió

La innovació oberta ofereix una oportunitat única per transformar la manera com les administracions públiques serveixen els ciutadans. Tot i que presenta reptes, els beneficis potencials justifiquen l'esforç d'implementar aquest enfocament col·laboratiu.`,
    author: 'Joan Martí',
    authorAvatar: 'https://ui-avatars.com/api/?name=Joan+Marti&background=10b981&color=fff',
    authorRole: 'Expert en Innovació Pública',
    category: 'Innovació Pública',
    tags: ['innovació', 'col·laboració', 'societat civil'],
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-13'),
    views: 856,
    likes: 67,
    comments: 15,
    readTime: 6,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '3',
    title: 'Ciutats sostenibles: el repte del segle XXI',
    excerpt: 'Anàlisi de les estratègies que estan implementant les ciutats catalanes per esdevenir més sostenibles i resilients.',
    content: `Les ciutats sostenibles representen una de les aspiracions més importants del segle XXI. Amb més del 70% de la població mundial vivint en àrees urbanes, la sostenibilitat urbana és clau per fer front als reptes del canvi climàtic, la gestió de recursos i la qualitat de vida dels ciutadans.

## El Concepte de Ciutat Sostenible

Una ciutat sostenible és aquella que satisfà les necessitats dels seus habitants actuals sense comprometre la capacitat de les generacions futures de satisfer les seves pròpies necessitats. Això implica un equilibri entre:

- **Sostenibilitat Ambiental**: Protecció del medi ambient i ús eficient dels recursos
- **Sostenibilitat Econòmica**: Desenvolupament econòmic que no depredi els recursos naturals
- **Sostenibilitat Social**: Equitat, inclusió i qualitat de vida per a tots els ciutadans

## Estratègies Clau per a la Sostenibilitat Urbana

### 1. Energia Renovable i Eficiència Energètica

Les ciutats catalanes estan invertint massivament en:
- Instal·lació de panells solars en edificis públics
- Sistemes de calefacció i refrigeració eficients
- Il·luminació LED en espais públics
- Promoció de l'autoconsum energètic

### 2. Mobilitat Sostenible

La transformació del transport urbà inclou:
- Expansió del transport públic electrificat
- Promoció de la bicicleta amb carrils bici protegits
- Zones de baixes emissions
- Infraestructura per a vehicles elèctrics

### 3. Gestió Integral de Residus

Estratègies de economia circular:
- Separació selectiva avançada
- Compostatge comunitari
- Reducció del plàstic d'un sol ús
- Promoció de la reutilització i reparació

### 4. Espais Verds i Biodiversitat

Creació i manteniment de:
- Parcs urbans i jardins verticals
- Cobertes verdes en edificis
- Corredors ecològics
- Horts urbans comunitaris

## Casos d'Èxit a Catalunya

### Barcelona: Superilles
El model de superilles ha revolucionat l'espai urbà, prioritzant els vianants i ciclistes sobre el trànsit rodat.

### Girona: Gestió de l'Aigua
Girona ha implementat sistemes innovadors de recollida d'aigua de pluja i reutilització d'aigües grises.

### Vic: Energia 100% Renovable
La ciutat de Vic s'ha compromès a ser 100% renovable abans del 2030.

## Reptes i Obstacles

### Financiació
Els projectes de sostenibilitat requereixen inversions significatives a llarg termini.

### Coordinació Institucional
La sostenibilitat urbana requereix coordinació entre diferents nivells de govern i departaments.

### Participació Ciutadana
L'èxit depèn de la implicació activa dels ciutadans en els projectes de sostenibilitat.

### Canvi Cultural
Moltes iniciatives requereixen canvis en els hàbits i comportaments ciutadans.

## Tecnologies Emergents

### Internet de les Coses (IoT)
Sensors intel·ligents per monitoritzar la qualitat de l'aire, el trànsit i el consum energètic.

### Intel·ligència Artificial
Optimització de recursos basada en dades i prediccions.

### Economia Circular Digital
Plataformes digitals per facilitar l'intercanvi, reutilització i reciclatge.

## Indicadors de Sostenibilitat

Per mesurar el progrés, les ciutats utilitzen indicadors com:
- Emissions de CO2 per capita
- Percentatge d'energia renovable
- Qualitat de l'aire
- Metres quadrats d'espai verd per habitant
- Percentatge de residus reciclats

## El Futur de les Ciutats Sostenibles

### Visió 2030
Les ciutats catalanes aspiren a:
- Neutralitat climàtica
- Economia circular completa
- Mobilitat 100% sostenible
- Accessibilitat universal als serveis

### Innovació Contínua
La sostenibilitat urbana és un procés dinàmic que requereix innovació constant i adaptació a noves tecnologies i reptes.

## Conclusió

Les ciutats sostenibles no són només una aspiració, sinó una necessitat urgent. Catalunya està liderant moltes iniciatives innovadores que poden servir de model per a altres regions. L'èxit depèn de la col·laboració entre administracions, empreses i ciutadans, així com de la voluntat política de mantenir el compromís a llarg termini.`,
    author: 'Anna Puig',
    authorAvatar: 'https://ui-avatars.com/api/?name=Anna+Puig&background=10b981&color=fff',
    authorRole: 'Consultora en Sostenibilitat Urbana',
    category: 'Sostenibilitat',
    tags: ['sostenibilitat', 'ciutats', 'medi ambient'],
    featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-12'),
    views: 1089,
    likes: 95,
    comments: 31,
    readTime: 10,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '4',
    title: 'La participació ciutadana en l\'era digital',
    excerpt: 'Plataformes digitals i noves metodologies per fomentar la participació activa dels ciutadans en les decisions públiques.',
    content: `La participació ciutadana digital ha revolucionat la manera com els ciutadans s'involucren en els processos democràtics i en la presa de decisions públiques. Les noves tecnologies ofereixen oportunitats sense precedents per crear canals de comunicació més directes, transparents i accessibles entre administracions i ciutadania.

## L'Evolució de la Participació Ciutadana

### Del Model Tradicional al Digital
Tradicionalment, la participació ciutadana es limitava a:
- Votacions electorals
- Consultes presencials ocasionals
- Audiències públiques amb assistència limitada
- Processos burocràtics complexos

Amb la digitalització, hem avançat cap a:
- Consultes en línia massives
- Plataformes de participació permanent
- Cocreiació de polítiques públiques
- Feedback continuu sobre serveis públics

## Plataformes i Eines Digitals

### Plataformes de Consulta
Sistemes que permeten als governs llançar consultes específiques sobre temes d'interès públic:
- Decidim (desenvolupada a Barcelona)
- Consul (utilitzada a Madrid)
- CitizenLab
- MySidewalk

### Eines de Cocreiació
Plataformes que permeten la col·laboració directa en el disseny de polítiques:
- Workshops virtuals
- Mapes col·laboratius
- Pressupostos participatius digitals
- Laboratoris d'innovació ciutadana

### Aplicacions Mòbils
Apps que faciliten la participació des de qualsevol lloc:
- Reportatge d'incidències urbanes
- Votació en temps real
- Geolocalització de propostes
- Notificacions personalitzades

## Beneficis de la Participació Digital

### Major Accessibilitat
- Eliminació de barreres geogràfiques
- Flexibilitat horària
- Accessibilitat per a persones amb mobilitat reduïda
- Traducció automàtica a diferents idiomes

### Participació Més Inclusiva
- Veus que tradicionalment no participaven
- Joves més implicats
- Grups minoritaris amb major representació
- Processos més transparents

### Eficiència i Cost-Efectivitat
- Reducció de costos organitzatius
- Processament automàtic de dades
- Anàlisi en temps real
- Escalabilitat per a grans poblacions

## Metodologies Innovadores

### Design Thinking Públic
Aplicació de metodologies de disseny centrat en l'usuari per a la creació de polítiques públiques.

### Gamificació
Ús d'elements de joc per augmentar la motivació i participació ciutadana.

### Intel·ligència Col·lectiva
Plataformes que agreguen coneixement distribuït per resoldre problemes complexos.

### Deliberació Digital
Espais en línia per al debat estructurat i la construcció de consensos.

## Casos d'Èxit

### Barcelona: Decidim
Plataforma que ha involucrat més de 400.000 ciutadans en decisions municipals, des de pressupostos participatius fins a la planificació urbana.

### Madrid: Decide Madrid
Sistema que ha permès a centenars de milers de ciutadans proposar i votar iniciatives ciutadanes.

### Reykjavik: Better Reykjavik
Plataforma que ha canalitzat milers de propostes ciutadanes, moltes de les quals s'han implementat.

## Reptes i Limitacions

### Bretxa Digital
- Exclusió de persones sense accés a tecnologia
- Diferències generacionals en l'ús de plataformes
- Necessitat de mantenir canals presencials

### Qualitat de la Participació
- Risc de participació superficial
- Necessitat de formació ciutadana
- Gestió de debats polaritzats

### Transparència i Confiança
- Percepció sobre l'ús real dels resultats
- Necessitat de comunicar l'impacte
- Gestió d'expectatives ciutadanes

### Aspectes Tècnics
- Ciberseguretat i protecció de dades
- Usabilitat per a tots els perfils
- Interoperabilitat entre sistemes

## Millors Pràctiques

### Disseny Inclusiu
- Accessibilitat web segons estàndards internacionals
- Interfícies intuïtives per a tots els nivells tècnics
- Suport multidioma

### Comunicació Efectiva
- Campanyes de sensibilització
- Formació ciutadana en participació digital
- Feedback constant sobre resultats

### Hibridació
- Combinació de canals digitals i presencials
- Adaptació a diferents perfils de ciutadania
- Flexibilitat metodològica

## Tecnologies Emergents

### Intel·ligència Artificial
- Anàlisi automàtica de propostes ciutadanes
- Detecció de temes emergents
- Personalització de la participació

### Blockchain
- Votació segura i verificable
- Transparència en la presa de decisions
- Rastrejabilitat de propostes

### Realitat Virtual i Augmentada
- Visualització de projectes urbans
- Simulació d'impactes de polítiques
- Experiències immersives de participació

## El Futur de la Participació Digital

### Tendències Emergents
- Participació continuada vs. puntual
- Micro-participació integrada en la vida quotidiana
- Personalització basada en interessos
- Participació predictiva

### Reptes Futurs
- Saturació participativa
- Gestió de la complexitat
- Equilibri entre eficiència i inclusió
- Sostenibilitat dels processos

## Conclusió

La participació ciutadana digital ofereix oportunitats extraordinàries per aprofundir la democràcia i millorar la qualitat de les polítiques públiques. Tot i que encara hi ha reptes per superar, especialment en matèria d'inclusió i qualitat de la participació, els avenços tecnològics i metodològics continuen obrint noves possibilitats.

L'èxit depèn de la capacitat de les administracions per adoptar un enfocament híbrid que combini el millor dels mons digital i presencial, sempre amb l'objectiu de construir una societat més participativa, inclusiva i democràtica.`,
    author: 'Pere Rodriguez',
    authorAvatar: 'https://ui-avatars.com/api/?name=Pere+Rodriguez&background=8b5cf6&color=fff',
    authorRole: 'Especialista en Participació',
    category: 'Participació Ciutadana',
    tags: ['participació', 'digital', 'ciutadania'],
    featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-11'),
    views: 743,
    likes: 52,
    comments: 18,
    readTime: 7,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '5',
    title: 'Transparència i govern obert: experiències europees',
    excerpt: 'Comparació d\'iniciatives de transparència i govern obert implementades a diferents països europeus i les seves lliçons.',
    content: `La transparència i el govern obert s'han convertit en pilars fonamentals de les democràcies modernes. A Europa, diversos països han pionerat iniciatives innovadores que serveixen de model per a altres nacions i regions. Aquest article analitza les experiències més destacades i extreu lliçons valuoses per a la implementació d'aquestes polítiques.`,
    author: 'Carles Vila',
    authorAvatar: 'https://ui-avatars.com/api/?name=Carles+Vila&background=f59e0b&color=fff',
    authorRole: 'Analista de Polítiques Públiques',
    category: 'Transparència',
    tags: ['transparència', 'govern obert', 'europa'],
    featuredImage: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-10'),
    views: 654,
    likes: 41,
    comments: 12,
    readTime: 9,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '6',
    title: 'Bones pràctiques en gestió de dades públiques',
    excerpt: 'Casos d\'èxit en la gestió, protecció i ús de dades públiques per millorar els serveis als ciutadans.',
    content: `La gestió de dades públiques ha esdevingut un dels aspectes més crítics de l'administració moderna. La capacitat de recollir, analitzar i utilitzar dades de manera efectiva pot transformar completament la qualitat dels serveis públics i la presa de decisions gubernamentals.`,
    author: 'Laura Santos',
    authorAvatar: 'https://ui-avatars.com/api/?name=Laura+Santos&background=6366f1&color=fff',
    authorRole: 'Data Scientist Pública',
    category: 'Bones Pràctiques',
    tags: ['dades', 'gestió', 'serveis públics'],
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    publishedAt: new Date('2025-08-09'),
    views: 892,
    likes: 73,
    comments: 25,
    readTime: 12,
    isPublished: true,
    isFeatured: true
  }
]

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Joan Martinez',
    authorAvatar: 'https://ui-avatars.com/api/?name=Joan+Martinez&background=3b82f6&color=fff',
    authorRole: 'Gestor TIC Municipal',
    content: 'Article excel·lent! M\'ha estat molt útil per entendre les tendències actuals. A la nostra administració local estem implementant alguns d\'aquests canvis i és interessant veure com altres territories ho estan abordant.',
    publishedAt: new Date('2025-08-14T14:30:00'),
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: 'Maria Fernández',
        authorAvatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=10b981&color=fff',
        authorRole: 'Directora de Transformació Digital',
        content: 'Gràcies Joan! Si us plau, comparteix la teva experiència amb la implementació. Segur que seria molt valuosa per a la resta de la comunitat.',
        publishedAt: new Date('2025-08-14T15:15:00'),
        likes: 8,
        isLiked: true,
        replies: []
      }
    ]
  },
  {
    id: '2',
    author: 'Anna López',
    authorAvatar: 'https://ui-avatars.com/api/?name=Anna+Lopez&background=f59e0b&color=fff',
    authorRole: 'Consultora en Digitalització',
    content: 'Molt interessant la part sobre la interoperabilitat. És un dels grans reptes que veiem a tots els projectes. Seria fantàstic poder aprofundir més en aquest tema en un proper article.',
    publishedAt: new Date('2025-08-14T16:45:00'),
    likes: 15,
    isLiked: false,
    replies: []
  },
  {
    id: '3',
    author: 'Pere Rodríguez',
    authorAvatar: 'https://ui-avatars.com/api/?name=Pere+Rodriguez&background=8b5cf6&color=fff',
    authorRole: 'Analista de Sistemes',
    content: 'La secció sobre ciberseguretat em sembla especialment rellevant. En la nostra experiència, és fonamental no deixar aquest aspecte per al final del procés de digitalització.',
    publishedAt: new Date('2025-08-14T17:20:00'),
    likes: 9,
    isLiked: false,
    replies: []
  }
]

export default function BlogPost({ blogId }: BlogPostProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const router = useRouter()

  useEffect(() => {
    const foundBlog = mockBlogs.find(b => b.id === blogId)
    if (foundBlog) {
      setBlog(foundBlog)
      // Simulate loading comments for the specific blog
      if (blogId === '1') {
        setComments(mockComments)
      } else {
        setComments([])
      }
    }
  }, [blogId])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ca-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ca-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (blog) {
      setBlog({
        ...blog,
        likes: isLiked ? blog.likes - 1 : blog.likes + 1
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Enllaç copiat al portapapers!')
    }
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Tu',
      authorAvatar: 'https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff',
      authorRole: 'Membre de la comunitat',
      content: newComment,
      publishedAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    }
    
    setComments([comment, ...comments])
    setNewComment('')
    
    // Update comment count
    if (blog) {
      setBlog({
        ...blog,
        comments: blog.comments + 1
      })
    }
  }

  const handleReplySubmit = (commentId: string) => {
    if (!replyContent.trim()) return
    
    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: 'Tu',
      authorAvatar: 'https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff',
      authorRole: 'Membre de la comunitat',
      content: replyContent,
      publishedAt: new Date(),
      likes: 0,
      isLiked: false,
      replies: []
    }
    
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    
    setReplyContent('')
    setReplyingTo(null)
  }

  const handleCommentLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? { 
                      ...reply, 
                      isLiked: !reply.isLiked,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                    }
                  : reply
              )
            }
          : comment
      ))
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      ))
    }
  }

  if (!blog) {
    return (
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Article no trobat</h2>
            <p className="text-gray-600 mb-6">L'article que cerques no existeix.</p>
            <button 
              onClick={() => router.push('/blogs')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Tornar als blogs
            </button>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Featured Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Article Meta on Image */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                  {blog.category}
                </span>
                {blog.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <BookOpen size={14} className="mr-1" />
                    Destacat
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/20 backdrop-blur-sm text-white">
                  <Clock size={14} className="mr-1" />
                  {blog.readTime} min lectura
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            
            {/* Author and Date */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <img 
                  src={blog.authorAvatar} 
                  alt={blog.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{blog.author}</h3>
                  <p className="text-sm text-gray-600">{blog.authorRole}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(blog.publishedAt)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye size={14} className="mr-1" />
                  {blog.views.toLocaleString()} visualitzacions
                </div>
              </div>
            </div>

            {/* Article Excerpt */}
            <div className="mb-8">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                {blog.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-800 leading-relaxed space-y-6" 
                   style={{ whiteSpace: 'pre-line' }}>
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mb-8 pb-6 border-b border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className={`inline-flex items-center px-4 py-2 rounded-xl transition-colors ${
                    isLiked 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={16} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {blog.likes}
                </button>
                
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle size={16} className="mr-2" />
                  {blog.comments}
                </button>
                
                <button 
                  onClick={handleBookmark}
                  className={`inline-flex items-center px-4 py-2 rounded-xl transition-colors ${
                    isBookmarked 
                      ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={16} className={`mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  Desar
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Share2 size={16} className="mr-2" />
                  Compartir
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Comentaris ({blog.comments})
                </h3>

                {/* New Comment Form */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff" 
                      alt="Tu"
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escriu un comentari..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex items-center justify-end mt-3 space-x-3">
                        <button 
                          onClick={() => setNewComment('')}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel·lar
                        </button>
                        <button 
                          onClick={handleCommentSubmit}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-100 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={comment.authorAvatar} 
                          alt={comment.author}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                              <p className="text-sm text-gray-500">{comment.authorRole}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(comment.publishedAt)} a les {formatTime(comment.publishedAt)}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {comment.content}
                          </p>
                          
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => handleCommentLike(comment.id)}
                              className={`inline-flex items-center space-x-1 text-sm transition-colors ${
                                comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <ThumbsUp size={14} className={comment.isLiked ? 'fill-current' : ''} />
                              <span>{comment.likes}</span>
                            </button>
                            
                            <button 
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <Reply size={14} />
                              <span>Respondre</span>
                            </button>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-200">
                              <div className="flex items-start space-x-3">
                                <img 
                                  src="https://ui-avatars.com/api/?name=Tu&background=6366f1&color=fff" 
                                  alt="Tu"
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Respondre a ${comment.author}...`}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                  />
                                  <div className="flex items-center justify-end mt-2 space-x-2">
                                    <button 
                                      onClick={() => {
                                        setReplyingTo(null)
                                        setReplyContent('')
                                      }}
                                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                    >
                                      Cancel·lar
                                    </button>
                                    <button 
                                      onClick={() => handleReplySubmit(comment.id)}
                                      disabled={!replyContent.trim()}
                                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                      Respondre
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <img 
                                    src={reply.authorAvatar} 
                                    alt={reply.author}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <div>
                                        <h5 className="font-medium text-gray-900 text-sm">{reply.author}</h5>
                                        <p className="text-xs text-gray-500">{reply.authorRole}</p>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDate(reply.publishedAt)} a les {formatTime(reply.publishedAt)}
                                      </div>
                                    </div>
                                    
                                    <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                                      {reply.content}
                                    </p>
                                    
                                    <button 
                                      onClick={() => handleCommentLike(reply.id, true, comment.id)}
                                      className={`inline-flex items-center space-x-1 text-xs transition-colors ${
                                        reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                      }`}
                                    >
                                      <ThumbsUp size={12} className={reply.isLiked ? 'fill-current' : ''} />
                                      <span>{reply.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Encara no hi ha comentaris. Sigues el primer en comentar!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}