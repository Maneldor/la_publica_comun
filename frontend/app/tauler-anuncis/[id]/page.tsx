'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  User,
  Star,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  Flag,
  Shield,
  Bookmark,
  Download,
  Image as ImageIcon,
  Paperclip,
  Reply
} from 'lucide-react';
import LayoutGeneral from '../../../src/componentes/comunes/LayoutGeneral';
import ModeratedInput, { ModeratedInputRef } from '../../../src/componentes/comunes/ModeratedInput';
import { useComunidad } from '../../../hooks/useComunidad';
import { useTraduccio } from '../../../src/contextos/TraduccioContext';
import { Anuncio } from '../../../tipos/anuncios';
import { crearContenidoMultiidioma } from '../../../src/utils/contenidoMultiidioma';

// Interface para comentarios
interface Comentario {
  id: string;
  autor: {
    nombre: string;
    avatar: string;
    verificado: boolean;
    organizacion: string;
  };
  contenido: string;
  fechaCreacion: Date;
  likes: number;
  isLiked: boolean;
  respuestas: Comentario[];
}

// Mock data para el anuncio - usando los mismos datos que en la página principal
const mockAnuncios: Anuncio[] = [
  {
    id: '1',
    tipoOperacion: 'OFERTA' as 'OFERTA' | 'DEMANDA',
    titulo: crearContenidoMultiidioma('Pis de 3 habitacions - Zona Eixample', 'ca'),
    descripcion: crearContenidoMultiidioma('Llogue pis de 3 habitacions, 2 banys, menjador i cuina equipada. Molt lluminós, acabat de reformar. Metro a 2 minuts. Ideal per a famílies de funcionaris. Aquest pis es troba en un dels barris més prestigiosos de Barcelona, amb excel·lents connexions de transport públic i a prop de tots els serveis necessaris. L\'habitatge compta amb calefacció central, aire condicionat i ascensor. Està completament moblat i equipat, llest per entrar a viure.', 'ca'),
    categoria: 'VIVIENDA',
    subcategoria: 'ALQUILER',
    precio: {
      tipo: 'FIJO',
      valor: 1200,
      moneda: 'EUR',
      negociable: false
    },
    ubicacion: {
      provincia: 'Barcelona',
      ciudad: 'Barcelona'
    },
    contacto: {
      preferencia: 'WHATSAPP',
      telefono: '+34 666 123 456',
      horarioContacto: 'Matins i vesprades (9h-13h / 16h-19h)',
      email: 'montse.vila@barcelona.cat'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop'
    ],
    tags: ['pis', 'eixample', 'reformat', 'funcionaris', 'metro', 'lluminós', 'equipat'],
    autor: {
      id: 'user1',
      nombre: 'Montse',
      apellidos: 'Vila',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4b0?w=100&h=100&fit=crop',
      organizacion: 'Ajuntament de Barcelona',
      provincia: 'Barcelona',
      verificado: true,
      valoracion: 4.8,
      fechaRegistro: new Date('2023-01-15')
    },
    fechaCreacion: new Date('2024-01-20T10:00:00'),
    fechaModificacion: new Date('2024-01-20T10:00:00'),
    fechaExpiracion: new Date('2024-04-20T23:59:59'),
    estado: 'ACTIVO',
    vistas: 156,
    favoritos: 23,
    contactos: 8,
    reportes: 0,
    verificado: true,
    destacado: true
  } as Anuncio,
  {
    id: '2',
    tipoOperacion: 'OFERTA' as 'OFERTA' | 'DEMANDA',
    titulo: crearContenidoMultiidioma('MacBook Pro 13" M2 - Como nuevo', 'es'),
    descripcion: crearContenidoMultiidioma('Vendo MacBook Pro de 13 pulgadas con chip M2, apenas 3 meses de uso. Incluye cargador original, funda de cuero, ratón Apple Magic Mouse y soporte para portátil. Estado impecable, garantía vigente hasta enero 2026. Ideal para trabajar desde casa o para estudiantes. El equipo viene con macOS Ventura instalado y todas las actualizaciones al día. Batería en perfecto estado, pantalla sin arañazos ni defectos.', 'es'),
    categoria: 'VENTA',
    subcategoria: 'ELECTRONICA',
    precio: {
      tipo: 'NEGOCIABLE',
      valor: 1400,
      moneda: 'EUR',
      negociable: true
    },
    ubicacion: {
      provincia: 'Madrid',
      ciudad: 'Madrid'
    },
    contacto: {
      preferencia: 'TELEFONO',
      telefono: '+34 600 123 456',
      email: 'carlos.ruiz@madrid.es',
      horarioContacto: 'Tardes preferiblemente'
    },
    imagenes: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop'
    ],
    tags: ['macbook', 'apple', 'ordenador', 'como nuevo', 'garantía', 'M2', 'portátil'],
    autor: {
      id: 'user2',
      nombre: 'Carlos',
      apellidos: 'Ruiz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      organizacion: 'Comunidad de Madrid',
      provincia: 'Madrid',
      verificado: true,
      valoracion: 4.9,
      fechaRegistro: new Date('2023-05-10')
    },
    fechaCreacion: new Date('2024-01-19T14:30:00'),
    fechaModificacion: new Date('2024-01-19T14:30:00'),
    fechaExpiracion: new Date('2024-03-19T23:59:59'),
    estado: 'ACTIVO',
    vistas: 234,
    favoritos: 45,
    contactos: 12,
    reportes: 0,
    verificado: true,
    destacado: false
  } as Anuncio
];

// Mock comentarios
const mockComentarios: Comentario[] = [
  {
    id: '1',
    autor: {
      nombre: 'Anna García',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      verificado: true,
      organizacion: 'Ajuntament de Barcelona'
    },
    contenido: 'M\'interessa molt aquest pis. Està disponible per visitar aquest cap de setmana?',
    fechaCreacion: new Date('2024-01-21T09:15:00'),
    likes: 2,
    isLiked: false,
    respuestas: [
      {
        id: '1-1',
        autor: {
          nombre: 'Montse Vila',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4b0?w=100&h=100&fit=crop',
          verificado: true,
          organizacion: 'Ajuntament de Barcelona'
        },
        contenido: 'Hola Anna! Sí, està disponible. Em pots contactar per WhatsApp per concertar la visita.',
        fechaCreacion: new Date('2024-01-21T10:30:00'),
        likes: 1,
        isLiked: false,
        respuestas: []
      }
    ]
  },
  {
    id: '2',
    autor: {
      nombre: 'Josep Martín',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      verificado: true,
      organizacion: 'Generalitat de Catalunya'
    },
    contenido: 'Excel·lent zona i preu molt raonable per l\'Eixample. Recomanable!',
    fechaCreacion: new Date('2024-01-20T16:45:00'),
    likes: 5,
    isLiked: true,
    respuestas: []
  }
];

// Iconos para categorías
const iconosCategoria = {
  TRABAJO: '💼',
  VIVIENDA: '🏠',
  VENTA: '📦',
  SERVICIOS: '⚙️',
  INTERCAMBIO: '🔄',
  EVENTOS: '📅'
};

export default function AnuncioSinglePage() {
  const router = useRouter();
  const params = useParams();
  const { configuracion } = useComunidad();
  const tema = configuracion.tema;
  const { t, tDynamic } = useTraduccio();
  
  // Estados
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>(mockComentarios);
  const [loading, setLoading] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [showContacto, setShowContacto] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  
  const comentarioInputRef = useRef<ModeratedInputRef>(null);
  
  // Estados para contenido traducido
  const [tituloTraducido, setTituloTraducido] = useState({ texto: '', cargando: true });
  const [descripcionTraducida, setDescripcionTraducida] = useState({ texto: '', cargando: true });

  // Cargar anuncio
  useEffect(() => {
    const cargarAnuncio = async () => {
      setLoading(true);
      try {
        // Simular llamada a API
        const anuncioId = params.id as string;
        const anuncioEncontrado = mockAnuncios.find(a => a.id === anuncioId);
        
        if (anuncioEncontrado) {
          setAnuncio(anuncioEncontrado);
          // Simular incremento de vistas
          anuncioEncontrado.vistas += 1;
        }
        
      } catch (error) {
        console.error('Error al cargar anuncio:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarAnuncio();
  }, [params.id]);

  // Traducir contenido cuando cambie el anuncio
  useEffect(() => {
    const traducirContenido = async () => {
      if (!anuncio) return;

      // Traducir título
      setTituloTraducido({ texto: anuncio.titulo.texto, cargando: true });
      try {
        const tituloTrad = await tDynamic({
          texto: anuncio.titulo.texto,
          idiomaOriginal: anuncio.titulo.idiomaOriginal,
          tipo: 'anuncio'
        });
        setTituloTraducido({ texto: tituloTrad, cargando: false });
      } catch (error) {
        setTituloTraducido({ texto: anuncio.titulo.texto, cargando: false });
      }

      // Traducir descripción
      setDescripcionTraducida({ texto: anuncio.descripcion.texto, cargando: true });
      try {
        const descripcionTrad = await tDynamic({
          texto: anuncio.descripcion.texto,
          idiomaOriginal: anuncio.descripcion.idiomaOriginal,
          tipo: 'anuncio'
        });
        setDescripcionTraducida({ texto: descripcionTrad, cargando: false });
      } catch (error) {
        setDescripcionTraducida({ texto: anuncio.descripcion.texto, cargando: false });
      }
    };

    traducirContenido();
  }, [anuncio, tDynamic]);

  // Funciones helper
  const formatearPrecio = (precio: any) => {
    if (precio.tipo === 'GRATUITO') return t('anuncio.gratis', { fallback: 'Gratis' });
    if (precio.tipo === 'INTERCAMBIO') return t('anuncio.intercambio', { fallback: 'Intercambio' });
    
    let texto = `${precio.valor}€`;
    if (precio.negociable) texto += ` (${t('anuncio.negociable', { fallback: 'Negociable' })})`;
    return texto;
  };

  const formatearFecha = (fecha: Date) => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return t('tiempo.hoy', { fallback: 'Hoy' });
    if (dias === 1) return t('tiempo.ayer', { fallback: 'Ayer' });
    if (dias < 7) return t('tiempo.hace_dias', { fallback: `Hace ${dias} días`, variables: { dias } });
    return fecha.toLocaleDateString();
  };

  const handleContactar = () => {
    setShowContacto(!showContacto);
    if (anuncio) {
      // Simular incremento de contactos
      anuncio.contactos += 1;
    }
  };

  const handleFavorito = () => {
    setEsFavorito(!esFavorito);
    if (anuncio) {
      anuncio.favoritos += esFavorito ? -1 : 1;
    }
  };

  const handleEnviarComentario = async (contenido: string) => {
    if (!contenido.trim() || !anuncio) return;

    const nuevoComent: Comentario = {
      id: Date.now().toString(),
      autor: {
        nombre: 'Usuario Actual',
        avatar: 'https://ui-avatars.com/api/?name=Usuario+Actual&background=3b82f6&color=fff',
        verificado: true,
        organizacion: 'Tu Organización'
      },
      contenido: contenido,
      fechaCreacion: new Date(),
      likes: 0,
      isLiked: false,
      respuestas: []
    };

    setComentarios([nuevoComent, ...comentarios]);
    comentarioInputRef.current?.reset();
  };

  const handleLikeComentario = (comentarioId: string) => {
    setComentarios(prev => prev.map(comentario => 
      comentario.id === comentarioId
        ? { 
            ...comentario, 
            isLiked: !comentario.isLiked,
            likes: comentario.isLiked ? comentario.likes - 1 : comentario.likes + 1
          }
        : comentario
    ));
  };

  if (loading) {
    return (
      <LayoutGeneral paginaActual="tauler-anuncis">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </LayoutGeneral>
    );
  }

  if (!anuncio) {
    return (
      <LayoutGeneral paginaActual="tauler-anuncis">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('anuncio.no_encontrado', { fallback: 'Anunci no trobat' })}
            </h2>
            <button
              onClick={() => router.push('/tauler-anuncis')}
              className="text-blue-600 hover:text-blue-700"
            >
              {t('action.volver', { fallback: 'Tornar als anuncis' })}
            </button>
          </div>
        </div>
      </LayoutGeneral>
    );
  }

  return (
    <LayoutGeneral paginaActual="tauler-anuncis">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header con navegación */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('action.volver', { fallback: 'Tornar' })}
          </button>
          
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-4">
            <button 
              onClick={() => router.push('/tauler-anuncis')}
              className="hover:text-gray-700"
            >
              {t('navigation.tablón', { fallback: 'Taulell d\'Anuncis' })}
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {anuncio.categoria} - {anuncio.ubicacion.ciudad}
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galería de imágenes */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={anuncio.imagenes[imagenSeleccionada] || anuncio.imagenes[0]}
                  alt={tituloTraducido.texto}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                
                {/* Badges sobre la imagen */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span 
                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                      anuncio.tipoOperacion === 'OFERTA'
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {anuncio.tipoOperacion === 'OFERTA' 
                      ? `🏷️ ${t('anuncio.ofrezco', { fallback: 'OFEREIXO' })}`
                      : `🔍 ${t('anuncio.busco', { fallback: 'BUSCO' })}`
                    }
                  </span>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg"
                    style={{ backgroundColor: tema.colorPrimario }}
                  >
                    {iconosCategoria[anuncio.categoria]} {anuncio.categoria}
                  </span>
                  {anuncio.destacado && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white shadow-lg">
                      <Star size={16} className="inline mr-1" />
                      {t('anuncio.destacado', { fallback: 'Destacat' })}
                    </span>
                  )}
                </div>
                
                {/* Navegación de imágenes */}
                {anuncio.imagenes.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {anuncio.imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setImagenSeleccionada(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === imagenSeleccionada ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Miniaturas de imágenes */}
              {anuncio.imagenes.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {anuncio.imagenes.map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenSeleccionada(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === imagenSeleccionada 
                          ? 'border-blue-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={imagen}
                        alt={`${tituloTraducido.texto} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del anuncio */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              
              {/* Título */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {tituloTraducido.cargando ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  tituloTraducido.texto
                )}
              </h1>
              
              {/* Precio */}
              <div className="text-3xl font-bold mb-4" style={{ color: tema.colorPrimario }}>
                {formatearPrecio(anuncio.precio)}
              </div>
              
              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {anuncio.ubicacion.ciudad}, {anuncio.ubicacion.provincia}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatearFecha(anuncio.fechaCreacion)}
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {anuncio.vistas} {t('anuncio.visualizaciones', { fallback: 'visualitzacions' })}
                </div>
                <div className="flex items-center">
                  <Heart size={16} className="mr-1" />
                  {anuncio.favoritos} {t('anuncio.favoritos', { fallback: 'favorits' })}
                </div>
              </div>
              
              {/* Tags */}
              {anuncio.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {anuncio.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Descripción */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('anuncio.descripcion', { fallback: 'Descripció' })}
                </h3>
                {descripcionTraducida.cargando ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <div className="text-gray-700 whitespace-pre-line">
                    {descripcionTraducida.texto}
                  </div>
                )}
              </div>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={handleFavorito}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    esFavorito 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={16} className={`mr-2 ${esFavorito ? 'fill-current' : ''}`} />
                  {esFavorito 
                    ? t('action.quitar_favorito', { fallback: 'Treure favorit' })
                    : t('action.añadir_favorito', { fallback: 'Afegir favorit' })
                  }
                </button>
                
                <button className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 size={16} className="mr-2" />
                  {t('action.compartir', { fallback: 'Compartir' })}
                </button>
                
                <button className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Flag size={16} className="mr-2" />
                  {t('action.reportar', { fallback: 'Reportar' })}
                </button>
              </div>
            </div>

            {/* Sección de comentarios */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {t('anuncio.comentarios', { fallback: 'Comentaris' })} ({comentarios.length})
              </h3>
              
              {/* Formulario nuevo comentario */}
              <div className="mb-6">
                <ModeratedInput
                  ref={comentarioInputRef}
                  multiline={true}
                  rows={3}
                  placeholder={t('anuncio.escribir_comentario', { fallback: 'Escriu un comentari...' })}
                  onSubmit={handleEnviarComentario}
                  submitText={t('action.comentar', { fallback: 'Comentar' })}
                  minLength={5}
                  maxLength={500}
                />
              </div>
              
              {/* Lista de comentarios */}
              <div className="space-y-4">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={comentario.autor.avatar}
                        alt={comentario.autor.nombre}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comentario.autor.nombre}
                          </span>
                          {comentario.autor.verificado && (
                            <Shield size={14} className="text-green-600" />
                          )}
                          <span className="text-sm text-gray-500">
                            {comentario.autor.organizacion}
                          </span>
                          <span className="text-sm text-gray-400">
                            · {formatearFecha(comentario.fechaCreacion)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comentario.contenido}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => handleLikeComentario(comentario.id)}
                            className={`flex items-center gap-1 ${
                              comentario.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            }`}
                          >
                            <Heart size={14} className={comentario.isLiked ? 'fill-current' : ''} />
                            {comentario.likes}
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <Reply size={14} className="mr-1 inline" />
                            {t('action.responder', { fallback: 'Respondre' })}
                          </button>
                        </div>
                        
                        {/* Respuestas */}
                        {comentario.respuestas.length > 0 && (
                          <div className="mt-4 ml-4 space-y-3">
                            {comentario.respuestas.map((respuesta) => (
                              <div key={respuesta.id} className="flex items-start gap-3">
                                <img
                                  src={respuesta.autor.avatar}
                                  alt={respuesta.autor.nombre}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-sm">
                                      {respuesta.autor.nombre}
                                    </span>
                                    {respuesta.autor.verificado && (
                                      <Shield size={12} className="text-green-600" />
                                    )}
                                    <span className="text-xs text-gray-400">
                                      · {formatearFecha(respuesta.fechaCreacion)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{respuesta.contenido}</p>
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
              
              {comentarios.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>{t('anuncio.sin_comentarios', { fallback: 'Sigues el primer a comentar' })}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Información del autor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={anuncio.autor.avatar}
                  alt={anuncio.autor.nombre}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {anuncio.autor.nombre} {anuncio.autor.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600">{anuncio.autor.organizacion}</p>
                  {anuncio.autor.verificado && (
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <Shield size={14} className="mr-1" />
                      {t('status.verificado', { fallback: 'Verificat' })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{anuncio.autor.valoracion}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {t('anuncio.miembro_desde', { fallback: 'Membre des de' })} {anuncio.autor.fechaRegistro.getFullYear()}
                </div>
              </div>
              
              {/* Botón contactar principal */}
              <button
                onClick={handleContactar}
                className="w-full px-4 py-3 rounded-lg text-white font-medium transition-colors mb-3"
                style={{ backgroundColor: tema.colorPrimario }}
              >
                <MessageCircle size={20} className="mr-2 inline" />
                {t('action.contactar', { fallback: 'Contactar' })}
              </button>
              
              {/* Información de contacto expandible */}
              {showContacto && (
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  {anuncio.contacto.telefono && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-500" />
                      <div>
                        <a 
                          href={`tel:${anuncio.contacto.telefono}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {anuncio.contacto.telefono}
                        </a>
                        {anuncio.contacto.preferencia === 'WHATSAPP' && (
                          <p className="text-xs text-gray-600">
                            {t('contacto.whatsapp_preferido', { fallback: 'WhatsApp preferit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {anuncio.contacto.email && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-500" />
                      <a 
                        href={`mailto:${anuncio.contacto.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {anuncio.contacto.email}
                      </a>
                    </div>
                  )}
                  
                  {anuncio.contacto.horarioContacto && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {anuncio.contacto.horarioContacto}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Estadísticas del anuncio */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                {t('anuncio.estadisticas', { fallback: 'Estadístiques' })}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('anuncio.visualizaciones', { fallback: 'Visualitzacions' })}:</span>
                  <span className="font-medium">{anuncio.vistas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('anuncio.favoritos', { fallback: 'Favorits' })}:</span>
                  <span className="font-medium">{anuncio.favoritos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('anuncio.contactos', { fallback: 'Contactes' })}:</span>
                  <span className="font-medium">{anuncio.contactos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('anuncio.publicado', { fallback: 'Publicat' })}:</span>
                  <span className="font-medium">{formatearFecha(anuncio.fechaCreacion)}</span>
                </div>
                {anuncio.fechaExpiracion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('anuncio.expira', { fallback: 'Expira' })}:</span>
                    <span className="font-medium">{formatearFecha(anuncio.fechaExpiracion)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Anuncios relacionados */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                {t('anuncio.relacionados', { fallback: 'Anuncis relacionats' })}
              </h4>
              <div className="space-y-3">
                {mockAnuncios
                  .filter(a => a.id !== anuncio.id && a.categoria === anuncio.categoria)
                  .slice(0, 3)
                  .map((anuncioRelacionado) => (
                    <button
                      key={anuncioRelacionado.id}
                      onClick={() => router.push(`/tauler-anuncis/${anuncioRelacionado.id}`)}
                      className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-3">
                        <img
                          src={anuncioRelacionado.imagenes[0]}
                          alt={anuncioRelacionado.titulo.texto}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-gray-900 truncate">
                            {anuncioRelacionado.titulo.texto}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {formatearPrecio(anuncioRelacionado.precio)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {anuncioRelacionado.ubicacion.ciudad}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutGeneral>
  );
}