'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageCircle, 
  Bell, 
  Settings, 
  Plus, 
  Users, 
  Calendar, 
  Briefcase, 
  BarChart3, 
  Building, 
  Globe, 
  Menu, 
  X, 
  Home, 
  UserPlus, 
  Heart, 
  Share, 
  Eye, 
  Clock, 
  MapPin, 
  Star,
  CheckCircle,
  Crown,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';

// Importar todos los componentes desarrollados
import { BusquedaGlobal } from './BusquedaGlobal';
import { SistemaNotificaciones } from './SistemaNotificaciones';
// SistemaMensajeria eliminado
import { CrearPost } from './CrearPost';
import { DashboardPrincipal } from './DashboardPrincipal';
import { GestionGrupos } from './GestionGrupos';
import { DashboardEmpresa } from './DashboardEmpresa';
import { SistemaEventos } from './SistemaEventos';
import { AnalyticsGlobales } from './AnalyticsGlobales';

import { 
  Usuario, 
  Grupo, 
  Post, 
  EventoPost, 
  OfertaPost, 
  Evento,
  Conversacion, 
  Mensaje, 
  Notificacion, 
  TipoUsuario, 
  CategoriaGrupo,
  TipoGrupo 
} from '../../../../tipos/redSocial';

interface PropiedadesDemoCompleta {
  modoDemo?: boolean;
}

// Datos de ejemplo para la demo
const usuariosEjemplo: Usuario[] = [
  {
    id: 'user1',
    nombre: 'María',
    apellidos: 'García López',
    email: 'maria.garcia@generalitat.cat',
    tipo: 'miembro',
    comunidadId: 'catalunya',
    verificado: true,
    activo: true,
    fechaRegistro: new Date('2020-01-15'),
    perfil: {
      biografia: 'Especialista en administración electrónica y modernización de servicios públicos. 15 años de experiencia en la Generalitat.',
      ubicacion: 'Barcelona',
      cargo: 'Técnica Superior de Administración General',
      configuracionPrivacidad: {
        perfilPublico: true,
        mostrarEmail: false,
        mostrarUbicacion: true,
        mostrarOrganizacion: true,
        permitirMensajes: true,
        permitirInvitacionesGrupos: true
      },
      porcentajeCompletado: 85
    },
    configuracion: {
      idioma: 'ca',
      tema: 'claro' as const,
      notificaciones: {
        email: {
          mensajes: true,
          grupoNuevoPost: true,
          invitacionGrupo: true,
          tablonAnuncios: true,
          eventos: true
        },
        push: {
          mensajes: true,
          grupoNuevoPost: true,
          invitacionGrupo: true,
          menciones: true
        }
      }
    },
    estadisticas: {
      gruposCreados: 2,
      gruposUnido: 8,
      postsCreados: 45,
      comentarios: 123,
      conexiones: 67,
      puntuacionReputacion: 892
    }
  },
  {
    id: 'user2',
    nombre: 'Josep',
    apellidos: 'Martínez Ruiz',
    email: 'josep.martinez@ajbcn.cat',
    tipo: 'miembro',
    comunidadId: 'catalunya',
    verificado: true,
    activo: true,
    fechaRegistro: new Date('2019-03-22'),
    perfil: {
      biografia: 'Gestión de RRHH en el sector público. Especializado en procesos de selección y desarrollo profesional.',
      ubicacion: 'Barcelona',
      cargo: 'Responsable de Recursos Humanos',
      configuracionPrivacidad: {
        perfilPublico: true,
        mostrarEmail: false,
        mostrarUbicacion: true,
        mostrarOrganizacion: true,
        permitirMensajes: true,
        permitirInvitacionesGrupos: true
      },
      porcentajeCompletado: 80
    },
    configuracion: {
      idioma: 'ca',
      tema: 'claro' as const,
      notificaciones: {
        email: { mensajes: true, grupoNuevoPost: false, invitacionGrupo: true, tablonAnuncios: false, eventos: true },
        push: { mensajes: true, grupoNuevoPost: false, invitacionGrupo: true, menciones: true }
      }
    },
    estadisticas: {
      gruposCreados: 1,
      gruposUnido: 5,
      postsCreados: 23,
      comentarios: 89,
      conexiones: 45,
      puntuacionReputacion: 567
    }
  },
  {
    id: 'empresa1',
    nombre: 'Ayuntamiento de Barcelona',
    apellidos: '',
    email: 'rrhh@ajbcn.cat',
    tipo: 'administracion',
    comunidadId: 'catalunya',
    verificado: true,
    activo: true,
    fechaRegistro: new Date('2018-01-01'),
    perfil: {
      biografia: 'Ayuntamiento de Barcelona. Portal oficial para empleados públicos, oposiciones y servicios ciudadanos.',
      ubicacion: 'Barcelona',
      cargo: 'Administración Local',
      configuracionPrivacidad: {
        perfilPublico: true,
        mostrarEmail: true,
        mostrarUbicacion: true,
        mostrarOrganizacion: true,
        permitirMensajes: true,
        permitirInvitacionesGrupos: true
      },
      porcentajeCompletado: 95
    },
    configuracion: {
      idioma: 'ca',
      tema: 'claro' as const,
      notificaciones: {
        email: { mensajes: true, grupoNuevoPost: true, invitacionGrupo: true, tablonAnuncios: true, eventos: true },
        push: { mensajes: true, grupoNuevoPost: true, invitacionGrupo: true, menciones: true }
      }
    },
    estadisticas: {
      gruposCreados: 3,
      gruposUnido: 2,
      postsCreados: 67,
      comentarios: 234,
      conexiones: 156,
      puntuacionReputacion: 1234
    }
  },
  {
    id: 'admin1',
    nombre: 'Anna',
    apellidos: 'Puig Solé',
    email: 'anna.puig@lapublica.cat',
    tipo: 'admin-web',
    comunidadId: 'catalunya',
    verificado: true,
    activo: true,
    fechaRegistro: new Date('2017-01-01'),
    perfil: {
      biografia: 'Administradora principal de La Pública Catalunya. Gestión de comunidades y soporte técnico.',
      ubicacion: 'Barcelona',
      cargo: 'Administradora de la Plataforma',
      configuracionPrivacidad: {
        perfilPublico: true,
        mostrarEmail: false,
        mostrarUbicacion: true,
        mostrarOrganizacion: true,
        permitirMensajes: true,
        permitirInvitacionesGrupos: true
      },
      porcentajeCompletado: 100
    },
    configuracion: {
      idioma: 'ca',
      tema: 'claro' as const,
      notificaciones: {
        email: { mensajes: true, grupoNuevoPost: true, invitacionGrupo: true, tablonAnuncios: true, eventos: true },
        push: { mensajes: true, grupoNuevoPost: true, invitacionGrupo: true, menciones: true }
      }
    },
    estadisticas: {
      gruposCreados: 5,
      gruposUnido: 10,
      postsCreados: 123,
      comentarios: 456,
      conexiones: 234,
      puntuacionReputacion: 2345
    }
  }
];

const gruposEjemplo: Grupo[] = [
  {
    id: 'grupo1',
    nombre: 'Oposiciones Educación Catalunya',
    descripcion: 'Grupo de apoyo y recursos para opositores de educación en Catalunya. Compartimos temarios, experiencias y resolvemos dudas.',
    categoria: 'profesional',
    tipo: 'publico',
    subcategoria: 'educacion',
    comunidadId: 'catalunya',
    creadorId: 'user1',
    administradores: ['user1'],
    moderadores: [],
    miembros: [],
    fechaCreacion: new Date('2021-09-15'),
    reglas: [
      'Mantén un tono respetuoso en todas las interacciones',
      'Comparte recursos útiles para el estudio',
      'No hagas spam ni promociones no relacionadas',
      'Ayuda a otros miembros con sus dudas'
    ],
    configuracion: {
      requiereAprobacion: false,
      permitirInvitaciones: true,
      moderacionPosts: false,
      limiteMiembros: 2000
    },
    estadisticas: {
      totalMiembros: 1247,
      miembrosActivos: 892,
      postsEstesMes: 156,
      crecimientoMensual: 45
    },
    etiquetas: ['oposiciones', 'educacion', 'catalunya']
  },
  {
    id: 'grupo2',
    nombre: 'Desarrolladores Administración Electrónica',
    descripcion: 'Comunidad de desarrolladores que trabajamos en proyectos de administración electrónica y transformación digital.',
    categoria: 'profesional',
    tipo: 'publico' as 'publico' | 'privado' | 'oculto',
    miembros: [],
    administradores: ['user2'],
    moderadores: [],
    fechaCreacion: new Date('2020-11-03'),
    comunidadId: 'catalunya',
    avatar: '',
    creadorId: 'user2',
    subcategoria: 'profesional',
    configuracion: {
      requiereAprobacion: true,
      limiteMiembros: 1000,
      permitirInvitaciones: true,
      moderacionPosts: false,
    }
  },
  {
    id: 'grupo3',
    nombre: 'Networking Barcelona Sector Público',
    descripcion: 'Eventos de networking y actividades para profesionales del sector público en el área metropolitana de Barcelona.',
    categoria: 'geografico',
    tipo: 'publico' as 'publico' | 'privado' | 'oculto',
    miembros: [],
    administradores: ['empresa1'],
    moderadores: [],
    fechaCreacion: new Date('2022-01-20'),
    comunidadId: 'catalunya',
    avatar: '',
    creadorId: 'empresa1',
    subcategoria: 'local',
    configuracion: {
      requiereAprobacion: false,
      limiteMiembros: 1500,
      permitirInvitaciones: true,
      moderacionPosts: false,
    }
  }
];

const postsEjemplo: Post[] = [
  {
    id: 'post1',
    tipo: 'texto',
    contenido: '¡Hola a todos! Acabo de aprobar las oposiciones de Técnico Superior de Administración General. Ha sido un camino largo pero muy gratificante. Si alguien tiene dudas sobre el proceso o necesita consejos de estudio, estaré encantada de ayudar. ¡Ánimo a todos los que estáis preparándoos! 💪',
    autorId: 'user1',
    fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000),
    etiquetas: [],
    visibilidad: 'publico' as const,
    moderado: false,
    fijado: false,
    comentarios: [],
    reacciones: [],
    estadisticas: {
      visualizaciones: 234,
      comentarios: 23,
      reacciones: { like: 89 },
      compartidos: 12
    },
    grupoId: 'grupo1'
  },
  {
    id: 'post2',
    tipo: 'oferta',
    contenido: 'El Ayuntamiento de Barcelona convoca 15 plazas de Técnico/a de Administración General. Proceso selectivo por oposición libre. ¡No te lo pierdas!',
    autorId: 'empresa1',
    fechaCreacion: new Date(Date.now() - 6 * 60 * 60 * 1000),
    etiquetas: ['ofertas', 'trabajo'],
    visibilidad: 'publico' as const,
    moderado: false,
    fijado: false,
    comentarios: [],
    reacciones: [],
    estadisticas: {
      visualizaciones: 567,
      comentarios: 45,
      reacciones: { like: 156 },
      compartidos: 78
    },
    oferta: {
      titulo: 'Técnico/a de Administración General',
      organizacion: 'Ayuntamiento de Barcelona',
      descripcion: 'Plaza de Técnico/a de Administración General',
      categoria: 'administracion',
      ubicacion: 'Barcelona',
      salario: {
        minimo: 28000,
        maximo: 35000
      },
      fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      requisitos: []
    }
  },
  {
    id: 'post3',
    tipo: 'evento',
    contenido: 'Organizamos una jornada sobre "Transformación Digital en la Administración Pública" el próximo viernes. Tendremos ponentes expertos y habrá networking posterior. ¡Apúntate!',
    autorId: 'user2',
    fechaCreacion: new Date(Date.now() - 12 * 60 * 60 * 1000),
    etiquetas: ['eventos', 'formacion'],
    visibilidad: 'publico' as const,
    moderado: false,
    fijado: false,
    comentarios: [],
    reacciones: [],
    estadisticas: {
      visualizaciones: 345,
      comentarios: 18,
      reacciones: { like: 67 },
      compartidos: 31
    },
    grupoId: 'grupo2',
    evento: {
      titulo: 'Jornada Transformación Digital',
      descripcion: 'Jornada sobre transformación digital en la administración pública',
      fechaInicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      ubicacion: 'Palau de Congressos de Catalunya',
      modalidad: 'presencial'
    }
  }
];

const eventosEjemplo: Evento[] = [
  {
    id: 'evento1',
    titulo: 'Jornada de Formación: Administración Electrónica 2024',
    descripcion: 'Jornada formativa sobre las últimas novedades en administración electrónica, nuevas tecnologías y procedimientos digitales.',
    categoria: 'formacion',
    modalidad: 'presencial',
    fechaInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    ubicacion: 'Palau Sant Jordi, Barcelona',
    capacidadMaxima: 300,
    asistentes: 187,
    fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    creadorId: 'empresa1',
    comunidadId: 'catalunya',
    estado: 'programado',
    esGratuito: true,
    requiereAprobacion: false,
    organizador: 'Generalitat de Catalunya',
    activo: true,
    etiquetas: ['formación', 'administración', 'digital', 'catalunya']
  },
  {
    id: 'evento2',
    titulo: 'Networking Mensual - Sector Público Barcelona',
    descripcion: 'Encuentro mensual de profesionales del sector público para networking, intercambio de experiencias y creación de sinergias.',
    categoria: 'networking',
    modalidad: 'presencial',
    fechaInicio: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    fechaFin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    ubicacion: 'Hotel Barcelona Center, Barcelona',
    capacidadMaxima: 100,
    asistentes: 67,
    fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    creadorId: 'user2',
    comunidadId: 'catalunya',
    estado: 'programado',
    esGratuito: false,
    precio: 25,
    requiereAprobacion: false,
    organizador: 'Asociación de Funcionarios de Catalunya',
    activo: true,
    etiquetas: ['networking', 'profesional', 'barcelona']
  }
];

export const DemoCompleta: React.FC<PropiedadesDemoCompleta> = ({ modoDemo = true }) => {
  const { configuracion } = useComunidad();
  const [usuarioActual, setUsuarioActual] = useState<Usuario>(usuariosEjemplo[0]);
  const [vistaActual, setVistaActual] = useState<'feed' | 'grupos' | 'eventos' | 'empresas' | 'analytics'>('feed');
  
  // Estados para modales y componentes
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [mensajeriaAbierta, setMensajeriaAbierta] = useState(false);
  const [crearPostAbierto, setCrearPostAbierto] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  
  // Estados de datos
  const [posts, setPosts] = useState<Post[]>(postsEjemplo);
  const [grupos, setGrupos] = useState<Grupo[]>(gruposEjemplo);
  const [eventos, setEventos] = useState<Evento[]>(eventosEjemplo);
  const [eventosAsistiendo, setEventosAsistiendo] = useState<string[]>(['evento1']);

  // Datos de ejemplo para notificaciones
  const notificacionesEjemplo: Notificacion[] = [
    {
      id: 'notif1',
      usuarioId: usuarioActual.id,
      tipo: 'reaccion-post',
      titulo: 'Nueva reacción',
      mensaje: 'A Josep Martínez le gusta tu publicación sobre oposiciones.',
      leida: false,
      fechaCreacion: new Date(Date.now() - 30 * 60 * 1000),
      datos: { postId: 'post1', autorId: 'user2' }
    },
    {
      id: 'notif2',
      usuarioId: usuarioActual.id,
      tipo: 'comentario-post',
      titulo: 'Nuevo comentario',
      mensaje: 'Anna Puig comentó en tu publicación.',
      leida: false,
      fechaCreacion: new Date(Date.now() - 60 * 60 * 1000),
      datos: { postId: 'post1', comentarioId: 'comment1' }
    },
    {
      id: 'notif3',
      usuarioId: usuarioActual.id,
      tipo: 'post-grupo',
      titulo: 'Nueva actividad en grupo',
      mensaje: 'Hay 5 nuevas publicaciones en "Oposiciones Educación Catalunya".',
      leida: true,
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000),
      datos: { grupoId: 'grupo1', nuevasPublicaciones: 5 }
    }
  ];

  // Conversaciones de ejemplo
  const conversacionesEjemplo: Conversacion[] = [
    {
      id: 'conv1',
      participantes: [usuarioActual.id, usuariosEjemplo[1].id],
      tipo: 'individual',
      ultimoMensaje: {
        id: 'msg1',
        conversacionId: 'conv1',
        emisorId: usuariosEjemplo[1].id,
        tipo: 'texto',
        contenido: '¡Felicidades por aprobar las oposiciones! ¿Podrías ayudarme con algunas dudas sobre el temario?',
        fechaEnvio: new Date(Date.now() - 30 * 60 * 1000),
        editado: false
      },
      fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fechaActualizacion: new Date(Date.now() - 30 * 60 * 1000),
      archivada: false,
      silenciada: false
    },
    {
      id: 'conv2',
      participantes: [usuarioActual.id, usuariosEjemplo[2].id],
      tipo: 'individual',
      ultimoMensaje: {
        id: 'msg2',
        conversacionId: 'conv2',
        emisorId: usuariosEjemplo[2].id,
        tipo: 'texto',
        contenido: 'Hola María, estamos interesados en tu perfil para una plaza en nuestro departamento. ¿Podrías contactarnos?',
        fechaEnvio: new Date(Date.now() - 2 * 60 * 60 * 1000),
        editado: false
      },
      fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      fechaActualizacion: new Date(Date.now() - 2 * 60 * 60 * 1000),
      archivada: false,
      silenciada: false
    }
  ];

  // Funciones de manejo
  const manejarCrearPost = async (post: Partial<Post>) => {
    const nuevoPost: Post = {
      id: `post_${Date.now()}`,
      tipo: post.tipo || 'texto',
      contenido: post.contenido || '',
      autorId: usuarioActual.id,
      fechaCreacion: new Date(),
      etiquetas: [],
      visibilidad: 'publico',
      moderado: false,
      fijado: false,
      comentarios: [],
      reacciones: [],
      estadisticas: {
        visualizaciones: 0,
        comentarios: 0,
        reacciones: {},
        compartidos: 0
      },
      ...post
    };
    setPosts(prev => [nuevoPost, ...prev]);
  };

  const manejarGestionarAsistenciaEvento = async (eventoId: string, accion: 'asistir' | 'no-asistir' | 'quizas') => {
    if (accion === 'asistir') {
      setEventosAsistiendo(prev => [...prev, eventoId]);
      // Incrementar contador de asistentes
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId 
          ? { ...evento, asistentes: (evento.asistentes || 0) + 1 }
          : evento
      ));
    } else if (accion === 'no-asistir') {
      setEventosAsistiendo(prev => prev.filter(id => id !== eventoId));
      // Decrementar contador de asistentes
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId 
          ? { ...evento, asistentes: Math.max(0, (evento.asistentes || 0) - 1) }
          : evento
      ));
    }
  };

  const obtenerIconoTipoUsuario = (tipo: TipoUsuario) => {
    switch (tipo) {
      case 'admin-web': return <Crown size={16} className="text-yellow-500" />;
      case 'administracion': return <Building size={16} className="text-blue-500" />;
      case 'empresa': return <Building size={16} className="text-green-500" />;
      case 'gestor-empresas': 
      case 'gestor-administraciones': return <Shield size={16} className="text-purple-500" />;
      default: return null;
    }
  };

  // Navegación principal
  const opcionesNavegacion = [
    { id: 'feed', nombre: 'Inicio', icono: <Home size={20} />, descripcion: 'Feed principal de actividad' },
    { id: 'grupos', nombre: 'Grupos', icono: <Users size={20} />, descripcion: 'Comunidades y grupos temáticos' },
    { id: 'eventos', nombre: 'Eventos', icono: <Calendar size={20} />, descripcion: 'Jornadas, formación y networking' },
    { id: 'empresas', nombre: 'Empresas', icono: <Building size={20} />, descripcion: 'Organismos y empresas' },
    { id: 'analytics', nombre: 'Analytics', icono: <BarChart3 size={20} />, descripcion: 'Estadísticas de la plataforma', soloAdmin: true }
  ];

  const renderizarContenido = () => {
    switch (vistaActual) {
      case 'feed':
        return (
          <DashboardPrincipal
            usuario={usuarioActual}
            posts={posts}
            grupos={grupos.slice(0, 3)}
            eventos={eventos.slice(0, 2)}
            usuarios={usuariosEjemplo.slice(1, 4)}
            onCrearPost={async () => setCrearPostAbierto(true)}
            onLikePost={async (postId) => {
              setPosts(prev => prev.map(post => 
                post.id === postId 
                  ? { ...post, estadisticas: { ...post.estadisticas, reacciones: { ...post.estadisticas?.reacciones, like: (post.estadisticas?.reacciones?.like || 0) + 1 } } }
                  : post
              ));
            }}
            onComentarPost={async (postId, comentario) => {
              setPosts(prev => prev.map(post => 
                post.id === postId 
                  ? { ...post, estadisticas: { ...post.estadisticas, comentarios: (post.estadisticas?.comentarios || 0) + 1 } }
                  : post
              ));
            }}
            onCompartirPost={async (postId) => {
              setPosts(prev => prev.map(post => 
                post.id === postId 
                  ? { ...post, estadisticas: { ...post.estadisticas, compartidos: (post.estadisticas?.compartidos || 0) + 1 } }
                  : post
              ));
            }}
            onSeguirUsuario={async (usuarioId) => console.log('Seguir usuario:', usuarioId)}
            onUnirseGrupo={async (grupoId) => console.log('Unirse a grupo:', grupoId)}
          />
        );

      case 'grupos':
        return (
          <GestionGrupos
            usuario={usuarioActual}
            grupos={grupos}
            onCrearGrupo={async (grupo) => {
              const nuevoGrupo: Grupo = {
                id: `grupo_${Date.now()}`,
                nombre: grupo.nombre || '',
                descripcion: grupo.descripcion || '',
                categoria: grupo.categoria || 'profesional',
                subcategoria: grupo.subcategoria || 'general',
                tipo: grupo.tipo || 'publico',
                miembros: [],
                administradores: [usuarioActual.id],
                moderadores: [],
                fechaCreacion: new Date(),
                comunidadId: configuracion.codigo,
                creadorId: usuarioActual.id,
                etiquetas: [],
                estadisticas: {
                  totalMiembros: 1,
                  miembrosActivos: 1,
                  postsEstesMes: 0,
                  crecimientoMensual: 0
                },
                configuracion: grupo.configuracion || {
                  requiereAprobacion: false,
                  limiteMiembros: 1000,
                  permitirInvitaciones: true,
                  moderacionPosts: false,
                            },
                ...grupo
              };
              setGrupos(prev => [nuevoGrupo, ...prev]);
              return nuevoGrupo;
            }}
            onActualizarGrupo={async (id, datos) => {
              setGrupos(prev => prev.map(grupo => 
                grupo.id === id ? { ...grupo, ...datos } : grupo
              ));
            }}
            onEliminarGrupo={async (id) => {
              setGrupos(prev => prev.filter(grupo => grupo.id !== id));
            }}
            onGestionarMiembro={async (grupoId, usuarioId, accion) => {
              console.log('Gestionar miembro:', grupoId, usuarioId, accion);
            }}
            onModerarPost={async (postId, accion) => {
              console.log('Moderar post:', postId, accion);
            }}
          />
        );

      case 'eventos':
        return (
          <SistemaEventos
            usuario={usuarioActual}
            eventos={eventos}
            eventosAsistiendo={eventosAsistiendo}
            onCrearEvento={async (evento) => {
              const nuevoEvento: Evento = {
                id: `evento_${Date.now()}`,
                titulo: evento.titulo || '',
                descripcion: evento.descripcion || '',
                categoria: evento.categoria || 'formacion',
                modalidad: evento.modalidad || 'presencial',
                fechaInicio: evento.fechaInicio || new Date(),
                fechaFin: evento.fechaFin || new Date(),
                ubicacion: evento.ubicacion,
                capacidadMaxima: evento.capacidadMaxima,
                asistentes: 0,
                fechaCreacion: new Date(),
                creadorId: usuarioActual.id || '',
                comunidadId: configuracion.codigo,
                estado: 'programado' as const,
                esGratuito: evento.esGratuito ?? true,
                requiereAprobacion: evento.requiereAprobacion ?? false,
                organizador: evento.organizador || '',
                activo: true,
                etiquetas: evento.etiquetas || [],
                ...evento
              };
              setEventos(prev => [nuevoEvento, ...prev]);
            }}
            onActualizarEvento={async (id, datos) => {
              setEventos(prev => prev.map(evento => 
                evento.id === id ? { ...evento, ...datos } : evento
              ));
            }}
            onEliminarEvento={async (id) => {
              setEventos(prev => prev.filter(evento => evento.id !== id));
            }}
            onGestionarAsistencia={manejarGestionarAsistenciaEvento}
            onComentarEvento={async (eventoId, comentario) => {
              console.log('Comentar evento:', eventoId, comentario);
            }}
          />
        );

      case 'empresas':
        if (usuarioActual.tipo === 'administracion' || usuarioActual.tipo === 'empresa') {
          return (
            <DashboardEmpresa
              empresa={usuarioActual}
              ofertas={[]}
              candidatos={[]}
              conversaciones={conversacionesEjemplo}
              estadisticas={{
                visitasPerfilMes: 234,
                seguidoresMes: 45,
                candidatosMes: 67,
                ofertasActivas: 3,
                tasaRespuesta: 85,
                tiempoMedioRespuesta: '2.5h',
                interaccionesMes: 189,
                alcancePosts: 1250,
                topOfertas: [
                  { id: '1', titulo: 'Técnico Administración General', candidatos: 45, vistas: 234 },
                  { id: '2', titulo: 'Analista de Sistemas', candidatos: 32, vistas: 189 }
                ],
                trendsData: []
              }}
              onCrearOferta={async (oferta) => console.log('Crear oferta:', oferta)}
              onActualizarOferta={async (id, datos) => console.log('Actualizar oferta:', id, datos)}
              onEliminarOferta={async (id) => console.log('Eliminar oferta:', id)}
              onGestionarCandidato={async (candidatoId, accion) => console.log('Gestionar candidato:', candidatoId, accion)}
              onActualizarPerfil={async (datos) => console.log('Actualizar perfil:', datos)}
            />
          );
        } else {
          return (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Building size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Directorio de Organismos y Empresas
                </h3>
                <p className="text-gray-600 mb-6">
                  Explora las organizaciones públicas y empresas colaboradoras de {configuracion.nombre}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {usuariosEjemplo.filter(u => u.tipo === 'administracion' || u.tipo === 'empresa').map(empresa => (
                    <div key={empresa.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={empresa.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(empresa.nombre)}&background=random`}
                          alt={empresa.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{empresa.nombre}</h4>
                            {empresa.verificado && <CheckCircle size={16} className="text-blue-500" />}
                            {obtenerIconoTipoUsuario(empresa.tipo)}
                          </div>
                          <p className="text-sm text-gray-600">{empresa.perfil?.cargo}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{empresa.perfil?.biografia}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {empresa.perfil?.ubicacion}
                        </div>
                        <Boton variante="secundario" tamaño="sm">
                          Ver perfil
                        </Boton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

      case 'analytics':
        if (usuarioActual.tipo === 'admin-web') {
          return (
            <AnalyticsGlobales
              usuario={usuarioActual}
              estadisticasGenerales={{
                totalUsuarios: 15420,
                usuariosActivos: 8934,
                nuevosUsuariosMes: 342,
                totalGrupos: 156,
                gruposActivos: 134,
                totalPosts: 2847,
                postsMes: 892,
                totalEventos: 45,
                eventosMes: 12,
                totalOfertas: 89,
                ofertasMes: 23,
                tasaRetencion: 76,
                tiempoPromedioSesion: 24.5,
                paginasVistasSesion: 4.2,
                tasaRebote: 32
              }}
              estadisticasComunidades={[
                {
                  comunidadId: 'catalunya',
                  nombre: 'Catalunya',
                  usuarios: 8934,
                  usuariosActivos: 5234,
                  grupos: 89,
                  posts: 1456,
                  eventos: 23,
                  ofertas: 45,
                  crecimientoUsuarios: 12,
                  participacion: 68,
                  satisfaccion: 87
                },
                {
                  comunidadId: 'madrid',
                  nombre: 'Madrid',
                  usuarios: 4567,
                  usuariosActivos: 2678,
                  grupos: 43,
                  posts: 892,
                  eventos: 15,
                  ofertas: 32,
                  crecimientoUsuarios: 8,
                  participacion: 62,
                  satisfaccion: 82
                }
              ]}
              tendenciasUsuarios={[]}
              rendimientoContenido={{
                postsMasPopulares: [
                  {
                    id: 'post1',
                    contenido: 'Guía completa para preparar oposiciones de administración general',
                    autor: 'María García',
                    likes: 234,
                    comentarios: 67,
                    compartidos: 45,
                    alcance: 1250
                  }
                ],
                gruposMasActivos: [
                  {
                    id: 'grupo1',
                    nombre: 'Oposiciones Educación Catalunya',
                    miembros: 1247,
                    postsUltimoMes: 89,
                    participacion: 76,
                    crecimiento: 12
                  }
                ],
                eventosMasPopulares: [
                  {
                    id: 'evento1',
                    titulo: 'Jornada de Formación: Administración Electrónica 2024',
                    asistentes: 187,
                    categoria: 'formacion',
                    satisfaccion: 92
                  }
                ],
                ofertasMasDemandadas: [
                  {
                    id: 'oferta1',
                    titulo: 'Técnico/a de Administración General',
                    candidatos: 156,
                    vistas: 892,
                    tasaConversion: 17.5
                  }
                ]
              }}
              reporteActividad={{
                horasActividad: Array.from({ length: 24 }, (_, i) => ({
                  hora: i,
                  actividad: Math.floor(Math.random() * 100) + 20
                })),
                diasSemana: [
                  { dia: 'Lun', actividad: 85 },
                  { dia: 'Mar', actividad: 92 },
                  { dia: 'Mié', actividad: 88 },
                  { dia: 'Jue', actividad: 95 },
                  { dia: 'Vie', actividad: 78 },
                  { dia: 'Sáb', actividad: 45 },
                  { dia: 'Dom', actividad: 32 }
                ],
                dispositivosUsados: [
                  { dispositivo: 'desktop', porcentaje: 65, usuarios: 5607 },
                  { dispositivo: 'mobile', porcentaje: 28, usuarios: 2410 },
                  { dispositivo: 'tablet', porcentaje: 7, usuarios: 603 }
                ],
                ubicacionesUsuarios: [
                  { provincia: 'Barcelona', usuarios: 4532, porcentaje: 51 },
                  { provincia: 'Madrid', usuarios: 2345, porcentaje: 26 },
                  { provincia: 'Valencia', usuarios: 1234, porcentaje: 14 }
                ]
              }}
              alertasSeguridad={[
                {
                  id: 'alert1',
                  tipo: 'spam',
                  titulo: 'Actividad de spam detectada',
                  descripcion: 'Se han detectado 5 usuarios enviando mensajes spam en los últimos 30 minutos.',
                  severidad: 'media',
                  fecha: new Date(Date.now() - 30 * 60 * 1000),
                  resuelta: false,
                  afectados: 12
                }
              ]}
              configuracionAnalytics={{
                frecuenciaReportes: 'semanal',
                emailsNotificacion: ['admin@lapublica.cat'],
                alertasEnabled: true,
                metricsEnabled: ['usuarios', 'contenido', 'actividad'],
                retencionDatos: 365,
                privacidadDatos: true
              }}
              onActualizarConfiguracion={async (config) => console.log('Actualizar config:', config)}
              onExportarReporte={async (tipo, filtros) => console.log('Exportar reporte:', tipo, filtros)}
              onGenerarInforme={async (parametros) => console.log('Generar informe:', parametros)}
            />
          );
        } else {
          return (
            <div className="max-w-2xl mx-auto text-center py-12">
              <Shield size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Acceso Restringido
              </h3>
              <p className="text-gray-600">
                Esta sección está disponible solo para administradores de la plataforma.
              </p>
            </div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header principal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y navegación */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: configuracion.tema.colorPrimario }}
                >
                  LP
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">La Pública</h1>
                  <p className="text-xs text-gray-500">{configuracion.nombre}</p>
                </div>
              </div>

              {/* Navegación desktop */}
              <nav className="hidden lg:flex items-center space-x-1">
                {opcionesNavegacion
                  .filter(opcion => !opcion.soloAdmin || usuarioActual.tipo === 'admin-web')
                  .map(opcion => (
                  <button
                    key={opcion.id}
                    onClick={() => setVistaActual(opcion.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      vistaActual === opcion.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title={opcion.descripcion}
                  >
                    {opcion.icono}
                    <span>{opcion.nombre}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Acciones del header */}
            <div className="flex items-center space-x-3">
              {/* Búsqueda */}
              <button
                onClick={() => setBusquedaAbierta(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Search size={16} />
                <span className="text-sm text-gray-600">Buscar...</span>
              </button>

              {/* Crear post */}
              <Boton
                variante="primario"
                tamaño="sm"
                onClick={() => setCrearPostAbierto(true)}
                icono={<Plus size={16} />}
                className="hidden sm:flex"
              >
                Crear
              </Boton>

              {/* Notificaciones */}
              <SistemaNotificaciones
                usuario={usuarioActual}
                notificaciones={notificacionesEjemplo}
                onMarcarLeida={async (id) => console.log('Marcar leída:', id)}
                onMarcarTodasLeidas={async () => console.log('Marcar todas leídas')}
                onEliminarNotificacion={async (id) => console.log('Eliminar notificación:', id)}
                onActualizarConfiguracion={async (config) => console.log('Actualizar config notif:', config)}
                configuracion={{
                  likes: true,
                  comentarios: true,
                  compartidos: true,
                  nuevosSeguidores: true,
                  mensajes: true,
                  eventos: true,
                  ofertas: true,
                  gruposActividad: true,
                  gruposInvitaciones: true,
                  email: false,
                  push: true,
                  sonido: true
                }}
              />

              {/* Mensajes */}
              <button
                onClick={() => setMensajeriaAbierta(true)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Mensajes"
              >
                <MessageCircle size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Perfil del usuario */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {usuarioActual.nombre} {usuarioActual.apellidos}
                    </p>
                    {usuarioActual.verificado && <CheckCircle size={14} className="text-blue-500" />}
                    {usuarioActual.tipo && obtenerIconoTipoUsuario(usuarioActual.tipo)}
                  </div>
                  <p className="text-xs text-gray-500">{usuarioActual.perfil?.cargo}</p>
                </div>
                <img
                  src={usuarioActual.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((usuarioActual.nombre || '') + ' ' + (usuarioActual.apellidos || ''))}&background=random`}
                  alt={`${usuarioActual.nombre || ''} ${usuarioActual.apellidos || ''}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              </div>

              {/* Menú móvil */}
              <button
                onClick={() => setMenuMovilAbierto(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {modoDemo && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap size={20} className="text-blue-600" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">Demo Funcional de La Pública</h3>
                <p className="text-sm text-blue-700">
                  Explora todas las funcionalidades de la red social profesional del sector público. 
                  Cambia de usuario: {' '}
                  <select
                    value={usuarioActual.id || ''}
                    onChange={(e) => setUsuarioActual(usuariosEjemplo.find(u => u.id === e.target.value) || usuariosEjemplo[0])}
                    className="text-blue-800 bg-blue-50 border border-blue-300 rounded px-2 py-1 text-sm"
                  >
                    {usuariosEjemplo.map(usuario => (
                      <option key={usuario.id} value={usuario.id || ''}>
                        {usuario.nombre} ({usuario.tipo?.replace('-', ' ')})
                      </option>
                    ))}
                  </select>
                </p>
              </div>
            </div>
          </div>
        )}

        {renderizarContenido()}
      </main>

      {/* Menú móvil */}
      {menuMovilAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Navegación</h3>
              <button
                onClick={() => setMenuMovilAbierto(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {opcionesNavegacion
                .filter(opcion => !opcion.soloAdmin || usuarioActual.tipo === 'admin-web')
                .map(opcion => (
                <button
                  key={opcion.id}
                  onClick={() => {
                    setVistaActual(opcion.id as any);
                    setMenuMovilAbierto(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    vistaActual === opcion.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opcion.icono}
                  <div>
                    <div className="font-medium">{opcion.nombre}</div>
                    <div className="text-xs text-gray-500">{opcion.descripcion}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Modales */}
      <BusquedaGlobal
        abierto={busquedaAbierta}
        onCerrar={() => setBusquedaAbierta(false)}
        usuario={usuarioActual}
        onSeleccionarResultado={(tipo, item) => {
          console.log('Resultado seleccionado:', tipo, item);
          setBusquedaAbierta(false);
        }}
      />

      {/* SistemaMensajeria eliminado - sistema removido */}

      <CrearPost
        abierto={crearPostAbierto}
        onCerrar={() => setCrearPostAbierto(false)}
        onCrearPost={manejarCrearPost}
        usuario={usuarioActual}
        grupos={grupos}
      />
    </div>
  );
};

export default DemoCompleta;