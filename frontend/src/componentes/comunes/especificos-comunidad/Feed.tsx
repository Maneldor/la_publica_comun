'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  MoreHorizontal,
  Plus,
  Filter,
  Search,
  TrendingUp,
  Calendar,
  Briefcase,
  MapPin,
  Clock
} from 'lucide-react';
import { useComunidad, useCaracteristicas, useTema } from '../../../hooks/useComunidad';
import { useAuth } from '../../../contextos/AuthContext';
import { Boton } from './ui/Boton';
import CrearPost from './CrearPost';
import TarjetaPost from './TarjetaPost';
import { Post, TipoPost, Usuario } from '../../../tipos/redSocial';

interface PropiedadesFeed {
  mostrarCrearPost?: boolean;
  filtroTipo?: TipoPost | 'todos';
  usuarioId?: string;
  titulo?: string;
}

interface FeedEstado {
  posts: Post[];
  cargando: boolean;
  error: string | null;
  pagina: number;
  tieneMas: boolean;
  filtroActivo: TipoPost | 'todos';
  terminoBusqueda: string;
}

const tiposFiltro = [
  { valor: 'todos', nombre: 'Todos', icono: <TrendingUp size={16} /> },
  { valor: 'texto', nombre: 'Publicaciones', icono: <MessageCircle size={16} /> },
  { valor: 'imagen', nombre: 'Fotos', icono: <Eye size={16} /> },
  { valor: 'evento', nombre: 'Eventos', icono: <Calendar size={16} /> },
  { valor: 'oferta', nombre: 'Ofertas', icono: <Briefcase size={16} /> },
  { valor: 'demanda', nombre: 'Demandas', icono: <Search size={16} /> }
];

export const Feed: React.FC<PropiedadesFeed> = ({
  mostrarCrearPost = true,
  filtroTipo = 'todos',
  usuarioId,
  titulo = 'Activitat'
}) => {
  const { configuracion } = useComunidad();
  const { terminologia } = useCaracteristicas();
  const { colores } = useTema();
  const { usuario: usuarioAutenticado } = useAuth();

  const [estado, setEstado] = useState<FeedEstado>({
    posts: [],
    cargando: true,
    error: null,
    pagina: 1,
    tieneMas: true,
    filtroActivo: filtroTipo,
    terminoBusqueda: ''
  });

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [postsCacheados, setPostsCacheados] = useState<{ [key: string]: Post[] }>({});

  // Simular API call - reemplazar con llamada real
  const cargarPosts = useCallback(async (pagina: number = 1, tipo: string = 'todos', reset: boolean = false) => {
    if (!usuarioAutenticado) return;

    const cacheKey = `${tipo}_${pagina}_${usuarioId || 'feed'}`;
    
    // Verificar cache primero
    if (postsCacheados[cacheKey] && !reset) {
      setEstado(prev => ({
        ...prev,
        posts: pagina === 1 ? postsCacheados[cacheKey] : [...prev.posts, ...postsCacheados[cacheKey]],
        cargando: false
      }));
      return;
    }

    setEstado(prev => ({ ...prev, cargando: true, error: null }));

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Datos mock - reemplazar con API real
      const postsNuevos: Post[] = Array.from({ length: 10 }, (_, i) => {
        const index = ((pagina - 1) * 10) + i;
        const tipos = ['texto', 'imagen', 'evento', 'oferta', 'demanda'] as TipoPost[];
        const tipoRandom = tipos[index % tipos.length];
        
        // Filtrar por tipo si es necesario
        const tipoFinal = tipo !== 'todos' ? tipo as TipoPost : tipoRandom;
        
        return {
          id: `post-${index}`,
          tipo: tipoFinal,
          contenido: generarContenidoMock(tipoFinal, index),
          autorId: usuarioId || `user-${(index % 5) + 1}`,
          autor: generarAutorMock(index),
          fechaCreacion: new Date(2025, 7, 10 - index), // Posts más antiguos
          comentarios: [],
          reacciones: generarReaccionesMock(index),
          multimedia: tipoFinal === 'imagen' ? [{ tipo: 'imagen', url: `https://picsum.photos/600/400?random=${index}` }] : [],
          estadisticas: {
            visualizaciones: 45 + index,
            comentarios: 12 + (index % 5),
            reacciones: generarEstadisticasReacciones(index),
            compartidos: 3 + (index % 3)
          },
          etiquetas: [],
          visibilidad: 'publico' as const,
          moderado: false,
          fijado: index < 2 && pagina === 1, // Primeros 2 posts fijados en primera página
          // Datos específicos según tipo
          ...(tipoFinal === 'oferta' && {
            oferta: {
              titulo: `Oferta de ${['Desenvolupador', 'Analista', 'Gestor', 'Tècnic'][index % 4]}`,
              organizacion: `${configuracion.organizaciones[index % configuracion.organizaciones.length]}`,
              descripcion: 'Busquem professional qualificat...',
              categoria: 'tecnologia',
              ubicacion: configuracion.provincias[index % configuracion.provincias.length],
              salario: { minimo: 25000 + (index * 2000) },
              fechaLimite: new Date(2025, 8, 10),
              requisitos: ['Experiència 2+ anys', 'Català i castellà']
            }
          }),
          ...(tipoFinal === 'evento' && {
            evento: {
              titulo: `${['Conferència', 'Taller', 'Seminari', 'Curs'][index % 4]} sobre innovació pública`,
              descripcion: 'Event formatiu per empleats públics',
              fechaInicio: new Date(2025, 7, 17 + index),
              ubicacion: configuracion.provincias[index % configuracion.provincias.length],
              modalidad: index % 2 === 0 ? 'presencial' as const : 'online' as const
            }
          }),
          ...(tipoFinal === 'demanda' && {
            demanda: {
              titulo: `Cerca ${['col·laboració', 'recursos', 'formació', 'assessorament'][index % 4]}`,
              descripcion: 'Necessito ajuda amb...',
              categoria: ['empleo', 'formacion', 'recursos', 'colaboracion'][index % 4],
              ubicacion: configuracion.provincias[index % configuracion.provincias.length],
              contacto: 'contacte@exemple.cat'
            }
          })
        };
      });

      // Simular que no hay más posts después de cierto número
      const tieneMas = pagina < 5;

      // Cachear resultados
      setPostsCacheados(prev => ({
        ...prev,
        [cacheKey]: postsNuevos
      }));

      setEstado(prev => ({
        ...prev,
        posts: reset || pagina === 1 ? postsNuevos : [...prev.posts, ...postsNuevos],
        cargando: false,
        tieneMas,
        pagina
      }));

    } catch (error) {
      console.error('Error cargando posts:', error);
      setEstado(prev => ({
        ...prev,
        error: 'Error al cargar las publicaciones',
        cargando: false
      }));
    }
  }, [usuarioAutenticado, usuarioId, postsCacheados, configuracion]);

  // Funciones helper para generar datos mock
  const generarContenidoMock = (tipo: TipoPost, index: number): string => {
    const contenidos = {
      texto: [
        `Molt content de compartir la meva experiència a ${configuracion.nombre}! 🎉`,
        `Reflexions sobre la modernització de l'administració pública...`,
        `Avui he tingut una reunió molt productiva sobre digitalització`,
        `Compartint recursos útils per la nostra comunitat professional`
      ],
      imagen: [
        'Una imatge que captura perfectament el nostre treball diari',
        'Moment inspirador de la jornada laboral',
        'Compartint aquest gran moment amb vosaltres',
        'Una perspectiva diferent del nostre entorn de treball'
      ],
      evento: [
        'Us convido a participar en aquest event formatiu',
        'No us perdeu aquesta oportunitat de formació',
        'Event imprescindible per actualitzar coneixements',
        'Espai de trobada per compartir experiències'
      ],
      oferta: [
        'Oportunitat laboral excel·lent per unir-se al nostre equip',
        'Cerquem talent per enfortir la nostra organització',
        'Posició estratègica per contribuir al servei públic',
        'Oportunitat única de desenvolupament professional'
      ],
      demanda: [
        'Necessito orientació sobre aquest tema específic',
        'Busco col·laboració per aquest projecte interessant',
        'Algú té experiència amb aquesta qüestió?',
        'Agrairia molt el vostre suport i consells'
      ]
    };
    return contenidos[tipo][index % contenidos[tipo].length];
  };

  const generarAutorMock = (index: number): Usuario => {
    const noms = ['Maria García', 'Joan Martínez', 'Anna López', 'Pau Rodríguez', 'Carme Sánchez'];
    const càrrecs = ['Tècnica d\'Administració', 'Analista de Sistemes', 'Gestora de Projectes', 'Cap de Servei', 'Coordinadora'];
    
    return {
      id: `user-${(index % 5) + 1}`,
      nom: noms[index % noms.length],
      apellidos: '',
      email: `${noms[index % noms.length].toLowerCase().replace(' ', '.')}@${configuracion.domini}`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(noms[index % noms.length])}&background=random`,
      tipus: 'empleat-public',
      perfil: {
        càrrec: càrrecs[index % càrrecs.length],
        departament: configuracion.organizaciones[index % configuracion.organizaciones.length],
        ubicacio: configuracion.provincias[index % configuracion.provincias.length],
        bio: 'Professional compromès amb el servei públic'
      },
      configuracio: {
        idioma: configuracion.idiomas[0],
        notificacions: true,
        privacitat: 'publico'
      },
      estadistiques: {
        publicacions: 25 + (index % 20),
        connexions: 100 + (index % 80),
        puntuacio: 500 + (index % 400)
      },
      dataRegistre: new Date(2025, 6 - index, 10),
      ultimaActivitat: new Date(2025, 7, 10 - index),
      actiu: true,
      verificat: index % 3 !== 0
    };
  };

  const generarReaccionesMock = (index: number) => {
    const emojis = ['👍', '❤️', '😊', '👏', '🤔'];
    return emojis.slice(0, (index % 3) + 1).map((emoji, i) => ({
      id: `reaction-${index}-${i}`,
      usuarioId: `user-${i + 1}`,
      emoji,
      fechaCreacion: new Date(2025, 7, 10)
    }));
  };

  const generarEstadisticasReacciones = (index: number) => {
    return {
      '👍': 10 + (index % 8),
      '❤️': 7 + (index % 6),
      '😊': 5 + (index % 4),
      '👏': 3 + (index % 3),
      '🤔': 1 + (index % 2)
    };
  };

  // Cargar posts inicial
  useEffect(() => {
    if (usuarioAutenticado) {
      cargarPosts(1, estado.filtroActivo, true);
    }
  }, [usuarioAutenticado, estado.filtroActivo, cargarPosts]);

  // Manejar creación de post
  const manejarCrearPost = async (nuevoPost: Partial<Post>) => {
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const postCompleto: Post = {
        id: `post-nuevo-${estado.posts.length + 1}`,
        tipo: nuevoPost.tipo || 'texto',
        contenido: nuevoPost.contenido || '',
        autorId: usuarioAutenticado!.id,
        autor: {
          id: usuarioAutenticado!.id,
          nom: usuarioAutenticado!.nombre || '',
          apellidos: usuarioAutenticado!.apellidos || '',
          email: usuarioAutenticado!.email || '',
          avatar: usuarioAutenticado!.avatar || null,
          tipus: usuarioAutenticado!.tipo as any,
          perfil: {
            càrrec: '',
            departament: '',
            ubicacio: '',
            bio: ''
          },
          configuracio: {
            idioma: configuracion.idiomas[0],
            notificacions: true,
            privacitat: 'publico'
          },
          estadistiques: {
            publicacions: 0,
            connexions: 0,
            puntuacio: 0
          },
          dataRegistre: new Date(2025, 7, 1),
          ultimaActivitat: new Date(2025, 7, 10),
          actiu: true,
          verificat: false
        },
        fechaCreacion: new Date(2025, 7, 10),
        comentarios: [],
        reacciones: [],
        multimedia: nuevoPost.multimedia || [],
        estadisticas: {
          visualizaciones: 0,
          comentarios: 0,
          reacciones: {},
          compartidos: 0
        },
        etiquetas: nuevoPost.etiquetas || [],
        visibilidad: nuevoPost.visibilidad || 'publico',
        moderado: false,
        fijado: false,
        ...nuevoPost
      };

      // Agregar al inicio de la lista
      setEstado(prev => ({
        ...prev,
        posts: [postCompleto, ...prev.posts]
      }));

      // Limpiar cache para forzar recarga
      setPostsCacheados({});
      
    } catch (error) {
      console.error('Error creando post:', error);
      alert('Error al crear la publicación');
    }
  };

  // Manejar cambio de filtro
  const manejarCambioFiltro = (nuevoFiltro: TipoPost | 'todos') => {
    if (nuevoFiltro !== estado.filtroActivo) {
      setEstado(prev => ({
        ...prev,
        filtroActivo: nuevoFiltro,
        posts: [],
        pagina: 1,
        tieneMas: true
      }));
    }
  };

  // Cargar más posts
  const cargarMasPosts = () => {
    if (!estado.cargando && estado.tieneMas) {
      cargarPosts(estado.pagina + 1, estado.filtroActivo);
    }
  };

  if (!usuarioAutenticado) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Inicia sessió per veure el feed</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{titulo}</h1>
          {mostrarCrearPost && (
            <Boton
              variante="primario"
              onClick={() => setMostrarModalCrear(true)}
              icono={<Plus size={16} />}
              className="shrink-0"
            >
              Crear Post
            </Boton>
          )}
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {tiposFiltro.map((filtro) => (
            <button
              key={filtro.valor}
              onClick={() => manejarCambioFiltro(filtro.valor as TipoPost | 'todos')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                estado.filtroActivo === filtro.valor
                  ? `bg-[${colores.primario}] text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filtro.icono}
              <span>{filtro.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed de posts */}
      <div className="space-y-4">
        {estado.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{estado.error}</p>
            <Boton
              variante="secundario"
              onClick={() => cargarPosts(1, estado.filtroActivo, true)}
              className="mt-2"
            >
              Reintentar
            </Boton>
          </div>
        )}

        {estado.posts.length === 0 && !estado.cargando && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-400 mb-4">
              <MessageCircle size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hi ha publicacions encara
            </h3>
            <p className="text-gray-500 mb-4">
              Sigues el primer en compartir alguna cosa amb la comunitat!
            </p>
            {mostrarCrearPost && (
              <Boton
                variante="primario"
                onClick={() => setMostrarModalCrear(true)}
                icono={<Plus size={16} />}
              >
                Crear primera publicació
              </Boton>
            )}
          </div>
        )}

        {estado.posts.map((post) => (
          <TarjetaPost
            key={post.id}
            post={post}
            onLike={(postId, emoji) => {
              // Simular toggle like
              setEstado(prev => ({
                ...prev,
                posts: prev.posts.map(p => 
                  p.id === postId 
                    ? {
                        ...p,
                        reacciones: p.reacciones.some(r => r.usuarioId === usuarioAutenticado.id)
                          ? p.reacciones.filter(r => r.usuarioId !== usuarioAutenticado.id)
                          : [...p.reacciones, {
                              id: `reaction-${p.id}-${p.reacciones.length + 1}`,
                              usuarioId: usuarioAutenticado.id,
                              emoji,
                              fechaCreacion: new Date(2025, 7, 10)
                            }],
                        estadisticas: {
                          ...p.estadisticas,
                          reacciones: {
                            ...p.estadisticas.reacciones,
                            [emoji]: (p.estadisticas.reacciones[emoji] || 0) + 
                              (p.reacciones.some(r => r.usuarioId === usuarioAutenticado.id) ? -1 : 1)
                          }
                        }
                      }
                    : p
                )
              }));
            }}
            onComment={(postId, contenido) => {
              // Simular agregar comentario
              const nuevoComentario = {
                id: `comment-${postId}-${estado.posts.find(p => p.id === postId)?.comentarios.length || 0 + 1}`,
                contenido,
                autorId: usuarioAutenticado.id,
                autor: estado.posts.find(p => p.id === postId)?.autor || usuarioAutenticado as any,
                fechaCreacion: new Date(2025, 7, 10),
                reacciones: []
              };
              
              setEstado(prev => ({
                ...prev,
                posts: prev.posts.map(p =>
                  p.id === postId
                    ? {
                        ...p,
                        comentarios: [nuevoComentario, ...p.comentarios],
                        estadisticas: {
                          ...p.estadisticas,
                          comentarios: p.estadisticas.comentarios + 1
                        }
                      }
                    : p
                )
              }));
            }}
            onShare={(postId) => {
              // Simular compartir
              navigator.share && navigator.share({
                title: 'La Pública - Post',
                url: `${window.location.origin}/posts/${postId}`
              });
            }}
          />
        ))}

        {/* Cargando */}
        {estado.cargando && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Botón cargar más */}
        {!estado.cargando && estado.tieneMas && estado.posts.length > 0 && (
          <div className="text-center py-6">
            <Boton
              variante="secundario"
              onClick={cargarMasPosts}
              className="w-full"
            >
              Carregar més publicacions
            </Boton>
          </div>
        )}

        {/* Fin del feed */}
        {!estado.tieneMas && estado.posts.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Has arribat al final del feed</p>
          </div>
        )}
      </div>

      {/* Modal crear post */}
      {mostrarCrearPost && (
        <CrearPost
          abierto={mostrarModalCrear}
          onCerrar={() => setMostrarModalCrear(false)}
          onCrearPost={manejarCrearPost}
          usuario={usuarioAutenticado as any}
          tipoInicial="texto"
        />
      )}
    </div>
  );
};

export default Feed;