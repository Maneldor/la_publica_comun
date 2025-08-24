'use client'

import React, { useState, useEffect } from 'react'
import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import { PortadaCursTarjeta } from '../../src/componentes/comunes'
import { Tarjeta, ContenidoTarjeta, PieTarjeta } from '../../src/componentes/comunes/especificos-comunidad/ui/Tarjeta'
import { useIdioma } from '../../hooks/useComunidad'
import { 
  BookOpen,
  Search,
  LayoutGrid,
  List,
  Star,
  Clock,
  Users,
  Award,
  Play,
  Heart,
  Zap
} from 'lucide-react'
import { Curs, CategoriaFormacio, NivellCurs, ModalitateFormacio, EstatatCurs } from '../../src/tipos/formacion'

// Traducciones
const traduccions = {
  ca: {
    // Header
    titol: 'Formació Professional',
    subtitol: 'Desenvolupa les teves competències amb cursos especialitzats per al sector públic',
    
    // Estadísticas
    cursosDisponibles: 'Cursos disponibles',
    horasFormacio: 'Hores de formació',
    certificatsEmesos: 'Certificats emesos',
    usuarisActius: 'Usuaris actius',
    
    // Filtros
    cercarCursos: 'Cercar cursos...',
    totesCategories: 'Totes les categories',
    totsNivells: 'Tots els nivells',
    totesModalitats: 'Totes les modalitats',
    nomesDestacats: 'Només destacats',
    nomesGratuitats: 'Només gratuïts',
    ambCertificat: 'Amb certificat',
    vistaGraella: 'Vista en graella',
    vistaLlista: 'Vista en llista',
    
    // Categorías
    TECNOLOGIA: 'Tecnologia',
    ADMINISTRACIO: 'Administració',
    GESTIO: 'Gestió',
    IDIOMES: 'Idiomes',
    JURIDIC: 'Jurídic',
    FINANCES: 'Finances',
    COMUNICACIO: 'Comunicació',
    LIDERATGE: 'Lideratge',
    SOSTENIBILITAT: 'Sostenibilitat',
    DIGITAL: 'Transformació Digital',
    
    // Niveles
    basic: 'Bàsic',
    intermedio: 'Intermedi',
    avanzado: 'Avançat',
    
    // Modalidades
    online: 'En línia',
    presencial: 'Presencial',
    mixta: 'Mixta',
    
    // Resultados
    cursosEncontrats: 'cursos trobats',
    netejarFiltres: 'Netejar filtres',
    noCursos: 'No s\'han trobat cursos',
    ajustarFiltres: 'Prova ajustant els filtres de cerca',
    
    // Acciones
    veureCurs: 'Veure curs',
    inscriureS: 'Inscriu-te',
    continuarCurs: 'Continuar',
    minuts: 'min',
    hores: 'h',
    estudiants: 'estudiants',
    leccions: 'leccions',
    gratuït: 'Gratuït',
    certificat: 'Certificat',
    destacat: 'Destacat',
    nou: 'Nou'
  },
  es: {
    // Header
    titol: 'Formación Profesional',
    subtitol: 'Desarrolla tus competencias con cursos especializados para el sector público',
    
    // Estadísticas
    cursosDisponibles: 'Cursos disponibles',
    horasFormacio: 'Horas de formación',
    certificatsEmesos: 'Certificados emitidos',
    usuarisActius: 'Usuarios activos',
    
    // Filtros
    cercarCursos: 'Buscar cursos...',
    totesCategories: 'Todas las categorías',
    totsNivells: 'Todos los niveles',
    totesModalitats: 'Todas las modalidades',
    nomesDestacats: 'Solo destacados',
    nomesGratuitats: 'Solo gratuitos',
    ambCertificat: 'Con certificado',
    vistaGraella: 'Vista en cuadrícula',
    vistaLlista: 'Vista en lista',
    
    // Categorías
    TECNOLOGIA: 'Tecnología',
    ADMINISTRACIO: 'Administración',
    GESTIO: 'Gestión',
    IDIOMES: 'Idiomas',
    JURIDIC: 'Jurídico',
    FINANCES: 'Finanzas',
    COMUNICACIO: 'Comunicación',
    LIDERATGE: 'Liderazgo',
    SOSTENIBILITAT: 'Sostenibilidad',
    DIGITAL: 'Transformación Digital',
    
    // Niveles
    basic: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    
    // Modalidades
    online: 'Online',
    presencial: 'Presencial',
    mixta: 'Mixta',
    
    // Resultados
    cursosEncontrats: 'cursos encontrados',
    netejarFiltres: 'Limpiar filtros',
    noCursos: 'No se encontraron cursos',
    ajustarFiltres: 'Prueba ajustando los filtros de búsqueda',
    
    // Acciones
    veureCurs: 'Ver curso',
    inscriureS: 'Inscríbete',
    continuarCurs: 'Continuar',
    minuts: 'min',
    hores: 'h',
    estudiants: 'estudiantes',
    leccions: 'lecciones',
    gratuït: 'Gratuito',
    certificat: 'Certificado',
    destacat: 'Destacado',
    nou: 'Nuevo'
  }
}

// Datos mock siguiendo los estándares
const getCursosMock = (idioma: string): Curs[] => {
  const cursos = [
    {
      id: '1',
      titol: idioma === 'ca' ? 'Transformació Digital a l\'Administració Pública' : 'Transformación Digital en la Administración Pública',
      descripcio: idioma === 'ca' ? 'Aprèn a implementar solucions digitals eficients en el sector públic' : 'Aprende a implementar soluciones digitales eficientes en el sector público',
      instructor: {
        nom: 'Dr. Anna',
        cognoms: 'Martínez García',
        email: 'anna.martinez@formacio.cat',
        bio: 'Experta en digitalització del sector públic amb 15 anys d\'experiència',
        avatar: 'https://ui-avatars.com/api/?name=Anna+Martinez&background=3b82f6&color=fff'
      },
      categoria: 'DIGITAL' as CategoriaFormacio,
      nivel: 'intermedio' as NivellCurs,
      modalitat: 'online' as ModalitateFormacio,
      duracio: 480, // 8 horas
      certificat: true,
      preu: 0, // Gratuito
      dataCreacio: new Date('2024-01-15'),
      dataPublicacio: new Date('2024-02-01'),
      leccions: [], // Se llenarían en detalle
      avaluacions: [],
      recursos: [],
      estat: 'ACTIU' as EstatatCurs,
      publicat: true,
      destacat: true,
      totalInscrits: 324,
      totalCompletats: 267,
      valoracioMitjana: 4.8,
      totalValoracions: 89,
      generatPerIA: false
    },
    {
      id: '2',
      titol: idioma === 'ca' ? 'Excel Avançat per a Gestió Administrativa' : 'Excel Avanzado para Gestión Administrativa',
      descripcio: idioma === 'ca' ? 'Domina les funcions avançades d\'Excel aplicades a la gestió pública' : 'Domina las funciones avanzadas de Excel aplicadas a la gestión pública',
      instructor: {
        nom: 'Jordi',
        cognoms: 'Puig Solé',
        email: 'jordi.puig@formacio.cat',
        bio: 'Consultor especialitzat en productivitat i eines digitals',
        avatar: 'https://ui-avatars.com/api/?name=Jordi+Puig&background=10b981&color=fff'
      },
      categoria: 'TECNOLOGIA' as CategoriaFormacio,
      nivel: 'avanzado' as NivellCurs,
      modalitat: 'mixta' as ModalitateFormacio,
      duracio: 360, // 6 horas
      certificat: true,
      preu: 89,
      dataCreacio: new Date('2024-02-10'),
      dataPublicacio: new Date('2024-02-20'),
      leccions: [],
      avaluacions: [],
      recursos: [],
      estat: 'ACTIU' as EstatatCurs,
      publicat: true,
      destacat: false,
      totalInscrits: 156,
      totalCompletats: 134,
      valoracioMitjana: 4.6,
      totalValoracions: 67,
      generatPerIA: false
    },
    {
      id: '3',
      titol: idioma === 'ca' ? 'Gestió de Projectes Públics' : 'Gestión de Proyectos Públicos',
      descripcio: idioma === 'ca' ? 'Metodologies àgils adaptades al sector públic' : 'Metodologías ágiles adaptadas al sector público',
      instructor: {
        nom: 'Maria',
        cognoms: 'López Fernández',
        email: 'maria.lopez@formacio.cat',
        bio: 'Project Manager certificada amb experiència en administració pública',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=f59e0b&color=fff'
      },
      categoria: 'GESTIO' as CategoriaFormacio,
      nivel: 'intermedio' as NivellCurs,
      modalitat: 'presencial' as ModalitateFormacio,
      duracio: 720, // 12 horas
      certificat: true,
      preu: 150,
      dataCreacio: new Date('2024-01-20'),
      dataPublicacio: new Date('2024-03-01'),
      leccions: [],
      avaluacions: [],
      recursos: [],
      estat: 'ACTIU' as EstatatCurs,
      publicat: true,
      destacat: true,
      totalInscrits: 89,
      totalCompletats: 76,
      valoracioMitjana: 4.9,
      totalValoracions: 23,
      generatPerIA: false
    },
    {
      id: '4',
      titol: idioma === 'ca' ? 'Comunicació Efectiva en l\'Administració' : 'Comunicación Efectiva en la Administración',
      descripcio: idioma === 'ca' ? 'Millora les teves habilitats de comunicació amb ciutadans i equips' : 'Mejora tus habilidades de comunicación con ciudadanos y equipos',
      instructor: {
        nom: 'Pere',
        cognoms: 'Rosell Vidal',
        email: 'pere.rosell@formacio.cat',
        bio: 'Expert en comunicació institucional i atenció ciutadana',
        avatar: 'https://ui-avatars.com/api/?name=Pere+Rosell&background=8b5cf6&color=fff'
      },
      categoria: 'COMUNICACIO' as CategoriaFormacio,
      nivel: 'basic' as NivellCurs,
      modalitat: 'online' as ModalitateFormacio,
      duracio: 240, // 4 horas
      certificat: true,
      preu: 0, // Gratuito
      dataCreacio: new Date('2024-03-05'),
      dataPublicacio: new Date('2024-03-15'),
      leccions: [],
      avaluacions: [],
      recursos: [],
      estat: 'ACTIU' as EstatatCurs,
      publicat: true,
      destacat: false,
      totalInscrits: 445,
      totalCompletats: 398,
      valoracioMitjana: 4.4,
      totalValoracions: 156,
      generatPerIA: true // Ejemplo de curso generado con IA
    }
  ]

  return cursos
}

const categories = ['TECNOLOGIA', 'ADMINISTRACIO', 'GESTIO', 'IDIOMES', 'JURIDIC', 'FINANCES', 'COMUNICACIO', 'LIDERATGE', 'SOSTENIBILITAT', 'DIGITAL']
const nivells = ['basic', 'intermedio', 'avanzado']
const modalitats = ['online', 'presencial', 'mixta']

export default function FormacioPage() {
  const { idioma } = useIdioma()
  const t = (traduccions as any)[idioma] || traduccions.es

  const [cursos] = useState(getCursosMock(idioma))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState('all')
  const [selectedNivell, setSelectedNivell] = useState('all')
  const [selectedModalitat, setSelectedModalitat] = useState('all')
  const [nomesDestacats, setNomesDestacats] = useState(false)
  const [nomesGratuitos, setNomesGratuitos] = useState(false)
  const [ambCertificat, setAmbCertificat] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredCursos, setFilteredCursos] = useState(cursos)

  useEffect(() => {
    let filtered = cursos

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(curs =>
        curs.titol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curs.descripcio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curs.instructor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curs.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtros adicionales
    if (selectedCategoria !== 'all') {
      filtered = filtered.filter(curs => curs.categoria === selectedCategoria)
    }
    if (selectedNivell !== 'all') {
      filtered = filtered.filter(curs => curs.nivel === selectedNivell)
    }
    if (selectedModalitat !== 'all') {
      filtered = filtered.filter(curs => curs.modalitat === selectedModalitat)
    }
    if (nomesDestacats) {
      filtered = filtered.filter(curs => curs.destacat)
    }
    if (nomesGratuitos) {
      filtered = filtered.filter(curs => curs.preu === 0)
    }
    if (ambCertificat) {
      filtered = filtered.filter(curs => curs.certificat)
    }

    setFilteredCursos(filtered)
  }, [searchTerm, selectedCategoria, selectedNivell, selectedModalitat, nomesDestacats, nomesGratuitos, ambCertificat, cursos])

  const formatDuracio = (minutos: number) => {
    if (minutos < 60) {
      return `${minutos} ${t.minuts}`
    }
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return mins > 0 ? `${horas}h ${mins}${t.minuts}` : `${horas}${t.hores}`
  }

  const getColorCategoria = (categoria: CategoriaFormacio) => {
    const colores = {
      TECNOLOGIA: 'bg-blue-100 text-blue-800',
      ADMINISTRACIO: 'bg-green-100 text-green-800',
      GESTIO: 'bg-purple-100 text-purple-800',
      IDIOMES: 'bg-yellow-100 text-yellow-800',
      JURIDIC: 'bg-red-100 text-red-800',
      FINANCES: 'bg-indigo-100 text-indigo-800',
      COMUNICACIO: 'bg-pink-100 text-pink-800',
      LIDERATGE: 'bg-orange-100 text-orange-800',
      SOSTENIBILITAT: 'bg-emerald-100 text-emerald-800',
      DIGITAL: 'bg-cyan-100 text-cyan-800'
    }
    return colores[categoria] || 'bg-gray-100 text-gray-800'
  }

  const getColorNivell = (nivell: NivellCurs) => {
    const colores = {
      basic: 'bg-green-100 text-green-800',
      intermedio: 'bg-yellow-100 text-yellow-800',
      avanzado: 'bg-red-100 text-red-800'
    }
    return colores[nivell] || 'bg-gray-100 text-gray-800'
  }

  return (
    <LayoutGeneral paginaActual="formacio">
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.titol}</h1>
                <p className="text-gray-600">{t.subtitol}</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{cursos.length}</p>
                    <p className="text-sm text-gray-500">{t.cursosDisponibles}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(cursos.reduce((acc, c) => acc + c.duracio, 0) / 60)}h
                    </p>
                    <p className="text-sm text-gray-500">{t.horasFormacio}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {cursos.reduce((acc, c) => acc + c.totalCompletats, 0)}
                    </p>
                    <p className="text-sm text-gray-500">{t.certificatsEmesos}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {cursos.reduce((acc, c) => acc + c.totalInscrits, 0)}
                    </p>
                    <p className="text-sm text-gray-500">{t.usuarisActius}</p>
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
                    placeholder={t.cercarCursos}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                  >
                    <option value="all">{t.totesCategories}</option>
                    {categories.map(categoria => (
                      <option key={categoria} value={categoria}>{(t as any)[categoria]}</option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedNivell}
                    onChange={(e) => setSelectedNivell(e.target.value)}
                  >
                    <option value="all">{t.totsNivells}</option>
                    {nivells.map(nivell => (
                      <option key={nivell} value={nivell}>{(t as any)[nivell]}</option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={selectedModalitat}
                    onChange={(e) => setSelectedModalitat(e.target.value)}
                  >
                    <option value="all">{t.totesModalitats}</option>
                    {modalitats.map(modalitat => (
                      <option key={modalitat} value={modalitat}>{(t as any)[modalitat]}</option>
                    ))}
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
                      title={t.vistaGraella}
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
                      title={t.vistaLlista}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkboxes de filtro */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nomesDestacats}
                    onChange={(e) => setNomesDestacats(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{t.nomesDestacats}</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nomesGratuitos}
                    onChange={(e) => setNomesGratuitos(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{t.nomesGratuitats}</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ambCertificat}
                    onChange={(e) => setAmbCertificat(e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{t.ambCertificat}</span>
                </label>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{filteredCursos.length} {t.cursosEncontrats}</span>
                {(searchTerm || selectedCategoria !== 'all' || selectedNivell !== 'all' || selectedModalitat !== 'all' || nomesDestacats || nomesGratuitos || ambCertificat) && (
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategoria('all')
                      setSelectedNivell('all')
                      setSelectedModalitat('all')
                      setNomesDestacats(false)
                      setNomesGratuitos(false)
                      setAmbCertificat(false)
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t.netejarFiltres}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lista de cursos */}
          {filteredCursos.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-6'
            }`}>
              {filteredCursos.map((curs) => (
                <Tarjeta 
                  key={curs.id} 
                  className="h-full flex flex-col overflow-hidden"
                  hover
                  padding="none"
                >
                  {/* Portada del curso - altura fija */}
                  <div className="h-48">
                    <PortadaCursTarjeta categoria={curs.categoria} className="h-full" />
                  </div>
                  
                  {/* Contenido del curso - flex-grow para ocupar espacio disponible */}
                  <ContenidoTarjeta className="flex-grow flex flex-col">
                    {/* Header con instructor - altura fija */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={curs.instructor.avatar} 
                          alt={`${curs.instructor.nom} ${curs.instructor.cognoms}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-tight">
                            {curs.titol}
                          </h3>
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {curs.instructor.nom} {curs.instructor.cognoms}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badges - altura fija */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 h-6 overflow-hidden">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorCategoria(curs.categoria)}`}>
                        {(t as any)[curs.categoria]}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorNivell(curs.nivel)}`}>
                        {(t as any)[curs.nivel]}
                      </span>
                      {curs.destacat && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star size={12} className="mr-1" />
                          {t.destacat}
                        </span>
                      )}
                      {curs.generatPerIA && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Zap size={12} className="mr-1" />
                          IA
                        </span>
                      )}
                    </div>

                    {/* Descripción - altura fija con line-clamp */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                      {curs.descripcio}
                    </p>

                    {/* Información del curso - altura fija */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          <span>{formatDuracio(curs.duracio)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={12} className="mr-1" />
                          <span>{curs.totalInscrits} {t.estudiants}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Play size={12} className="mr-1" />
                          <span>{curs.leccions?.length || 6} {t.leccions}</span>
                        </div>
                        {curs.certificat && (
                          <div className="flex items-center text-green-600">
                            <Award size={12} className="mr-1" />
                            <span>{t.certificat}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating - altura fija */}
                    <div className="flex items-center justify-between mb-3 h-7">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < Math.floor(curs.valoracioMitjana)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {curs.valoracioMitjana} ({curs.totalValoracions})
                        </span>
                      </div>
                      {curs.preu === 0 ? (
                        <span className="text-sm font-semibold text-green-600">{t.gratuït}</span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">{curs.preu}€</span>
                      )}
                    </div>

                  </ContenidoTarjeta>
                  
                  {/* Footer con acciones - siempre al final */}
                  <PieTarjeta className="mt-auto">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = `/formacio/${curs.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
                      >
                        {t.veureCurs}
                      </button>
                      <button className="p-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        <Heart size={18} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </PieTarjeta>
                </Tarjeta>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.noCursos}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {t.ajustarFiltres}
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutGeneral>
  )
}