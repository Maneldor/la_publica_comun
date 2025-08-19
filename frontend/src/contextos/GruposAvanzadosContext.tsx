'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { 
  GrupoAvanzado, 
  MiembroGrupoAvanzado, 
  PostGrupo, 
  OfertaGrupo, 
  ActividadGrupo,
  RolGrupo,
  FiltrosGrupoAvanzado,
  ConfiguracionFeedGrupo,
  EstadisticasGrupoDashboard
} from '../../tipos/gruposAvanzados'
import { useNotifications } from './NotificationsContext'

interface GruposAvanzadosContextType {
  // Estado principal
  grupos: GrupoAvanzado[]
  grupoActivo: GrupoAvanzado | null
  cargando: boolean
  
  // Gestión de grupos
  crearGrupo: (datos: Partial<GrupoAvanzado>) => Promise<GrupoAvanzado>
  editarGrupo: (id: string, datos: Partial<GrupoAvanzado>) => Promise<void>
  eliminarGrupo: (id: string) => Promise<void>
  seleccionarGrupo: (id: string) => void
  
  // Gestión de subgrupos
  crearSubgrupo: (grupoPadreId: string, datos: Partial<GrupoAvanzado>) => Promise<GrupoAvanzado>
  obtenerJerarquiaGrupo: (grupoId: string) => GrupoAvanzado[]
  obtenerSubgrupos: (grupoPadreId: string) => GrupoAvanzado[]
  
  // Gestión de miembros
  miembros: MiembroGrupoAvanzado[]
  agregarMiembro: (grupoId: string, usuarioId: string, rol?: RolGrupo) => Promise<void>
  removerMiembro: (grupoId: string, usuarioId: string) => Promise<void>
  cambiarRolMiembro: (grupoId: string, usuarioId: string, nuevoRol: RolGrupo) => Promise<void>
  invitarMiembro: (grupoId: string, email: string, rol?: RolGrupo) => Promise<void>
  
  // Feed del grupo
  posts: PostGrupo[]
  crearPost: (grupoId: string, datos: Partial<PostGrupo>) => Promise<PostGrupo>
  editarPost: (postId: string, datos: Partial<PostGrupo>) => Promise<void>
  eliminarPost: (postId: string) => Promise<void>
  reaccionarPost: (postId: string, tipo: string) => Promise<void>
  comentarPost: (postId: string, contenido: string) => Promise<void>
  
  // Ofertas exclusivas
  ofertas: OfertaGrupo[]
  crearOferta: (grupoId: string, datos: Partial<OfertaGrupo>) => Promise<OfertaGrupo>
  reclamarOferta: (ofertaId: string) => Promise<void>
  
  // Actividades
  actividades: ActividadGrupo[]
  registrarActividad: (grupoId: string, actividad: Partial<ActividadGrupo>) => void
  
  // Filtros y configuración
  filtros: FiltrosGrupoAvanzado
  setFiltros: (filtros: FiltrosGrupoAvanzado) => void
  configuracionFeed: ConfiguracionFeedGrupo
  setConfiguracionFeed: (config: ConfiguracionFeedGrupo) => void
  
  // Estadísticas para admin
  estadisticasDashboard: EstadisticasGrupoDashboard | null
  obtenerEstadisticas: () => Promise<void>
  
  // Utilidades
  puedeGestionarGrupo: (grupoId: string, accion: string) => boolean
  esAdminGrupo: (grupoId: string) => boolean
  esMiembroGrupo: (grupoId: string) => boolean
}

const GruposAvanzadosContext = createContext<GruposAvanzadosContextType | undefined>(undefined)

// Perfiles de usuarios mock
const PERFILES_USUARIOS: Record<string, { nombre: string; nick: string; avatar: string }> = {
  'user-1': { nombre: 'Tu', nick: '@tu_perfil', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  'user-2': { nombre: 'Maria Gonzalez', nick: '@maria_gonzalez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b151b04c?w=50&h=50&fit=crop&crop=face' },
  'user-3': { nombre: 'Jordi Martinez', nick: '@jordi_martinez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
  'user-4': { nombre: 'Anna Lopez', nick: '@anna_lopez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
  'user-5': { nombre: 'Pere Soler', nick: '@pere_soler', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
  'user-6': { nombre: 'Laura Ruiz', nick: '@laura_ruiz', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face' },
  'user-7': { nombre: 'Marc Vila', nick: '@marc_vila', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  'user-8': { nombre: 'Carla Ferrer', nick: '@carla_ferrer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face' },
  'user-9': { nombre: 'David Puig', nick: '@david_puig', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
  'user-10': { nombre: 'Nuria Camps', nick: '@nuria_camps', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face' },
  'user-11': { nombre: 'Albert Roca', nick: '@albert_roca', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=50&h=50&fit=crop&crop=face' },
  'user-12': { nombre: 'Marta Vidal', nick: '@marta_vidal', avatar: 'https://images.unsplash.com/photo-1606814893907-c2e42943c91f?w=50&h=50&fit=crop&crop=face' },
  'user-13': { nombre: 'Joan Mas', nick: '@joan_mas', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
  'user-14': { nombre: 'Sandra Mora', nick: '@sandra_mora', avatar: 'https://images.unsplash.com/photo-1502767089025-6572583495f4?w=50&h=50&fit=crop&crop=face' },
  'user-15': { nombre: 'Toni Serra', nick: '@toni_serra', avatar: 'https://images.unsplash.com/photo-1522075469751-3847ae2e8ff5?w=50&h=50&fit=crop&crop=face' },
  'user-16': { nombre: 'Elena Costa', nick: '@elena_costa', avatar: 'https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=50&h=50&fit=crop&crop=face' },
  'user-17': { nombre: 'Gerard Font', nick: '@gerard_font', avatar: 'https://images.unsplash.com/photo-1489161133408-e7bd02b12468?w=50&h=50&fit=crop&crop=face' },
  'user-18': { nombre: 'Cristina Pla', nick: '@cristina_pla', avatar: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=50&h=50&fit=crop&crop=face' },
  'user-19': { nombre: 'Raul Gomez', nick: '@raul_gomez', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=50&h=50&fit=crop&crop=face' },
  'user-20': { nombre: 'Silvia Blanc', nick: '@silvia_blanc', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face' },
  'admin-1': { nombre: 'Admin Sistema', nick: '@admin_sistema', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }
}

// Mock data inicial
const GRUPOS_MOCK: GrupoAvanzado[] = [
  {
    id: 'grupo-funcionaris-educacio',
    nombre: 'Funcionaris d\'Educació Catalunya',
    slug: 'funcionaris-educacio-catalunya',
    descripcion: 'Grup professional per a funcionaris del sector educatiu català',
    descripcionLarga: 'Aquest grup està destinat a professionals de l\'educació pública catalana per compartir experiències, recursos i oportunitats de desenvolupament professional.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    portada: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=300&fit=crop',
    tipo: 'privado',
    categoria: 'profesional',
    subcategoria: 'Educació',
    
    grupoPadreId: undefined,
    subgrupos: ['subgrupo-primaria', 'subgrupo-secundaria'],
    nivel: 0,
    rutaCompleta: 'funcionaris-educacio-catalunya',
    
    comunidadId: 'cat',
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2025-01-10'),
    activo: true,
    
    propietarioId: 'admin-1',
    configuracion: {
      requiereAprobacion: true,
      permitirInvitaciones: true,
      soloInvitacion: false,
      moderacionPosts: true,
      permitirMultimedia: true,
      permitirDocumentos: true,
      limiteTamañoArchivo: 50,
      formatosPermitidos: ['jpg', 'png', 'pdf', 'doc', 'docx'],
      chatHabilitado: true,
      mensajeriaPrivada: true,
      notificacionesGrupo: true,
      permitirSubgrupos: true,
      nivelMaximoSubgrupos: 3,
      ofertasExclusivas: true,
      sistemaReputacion: true,
      gamificacion: false,
      temaPersonalizado: 'educacion',
      coloresPersonalizados: {
        primario: '#2563eb',
        secundario: '#3b82f6',
        fondo: '#f8fafc'
      }
    },
    estadisticas: {
      totalMiembros: 247,
      miembrosActivos: 156,
      miembrosNuevos7dias: 8,
      miembrosNuevos30dias: 23,
      totalPosts: 342,
      postsEstesMes: 45,
      totalComentarios: 1205,
      totalReacciones: 2890,
      totalArchivos: 89,
      totalMultimedia: 56,
      totalDocumentos: 33,
      espacioUsado: 1250,
      actividadDiaria: [],
      horasMasActivas: [9, 10, 11, 14, 15, 16],
      totalSubgrupos: 2,
      subgruposActivos: 2
    },
    
    miembros: [
      {
        usuarioId: 'user-1',
        rol: 'administrador',
        estado: 'activo',
        fechaUnion: new Date('2024-01-15'),
        fechaUltimaActividad: new Date('2025-01-10'),
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: true,
          puedeModerar: true,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 23,
        comentarios: 78,
        archivosSubidos: 12,
        advertencias: 0
      }
    ],
    totalMiembros: 247,
    limiteMiembros: 500,
    
    etiquetas: ['educació', 'funcionaris', 'catalunya', 'ensenyament'],
    reglas: [
      {
        id: 'regla-1',
        titulo: 'Respecte mutu',
        descripcion: 'Mantenir sempre un to respectuós en totes les interaccions',
        orden: 1,
        activa: true,
        fechaCreacion: new Date('2024-01-15')
      },
      {
        id: 'regla-2',
        titulo: 'Contingut professional',
        descripcion: 'El contingut ha d\'estar relacionat amb l\'àmbit educatiu professional',
        orden: 2,
        activa: true,
        fechaCreacion: new Date('2024-01-15')
      }
    ],
    
    esDestacado: true,
    permiteInvitaciones: true,
    requiereAprobacion: true
  },
  // GRUPOS PÚBLICOS
  {
    id: 'grupo-amants-gossos',
    nombre: 'Amants dels Gossos',
    slug: 'amants-dels-gossos',
    descripcion: 'Grup per a amants dels gossos i les mascotes. Compartim consells, fotos i experiències.',
    descripcionLarga: 'Un espai per a tots els empleats públics que estimen els gossos. Comparteix fotos de la teva mascota, consells de cura, recomanacions de veterinaris i parcs per gossos.',
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
    portada: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=300&fit=crop',
    tipo: 'publico',
    categoria: 'social',
    subcategoria: 'Animals',
    
    grupoPadreId: undefined,
    subgrupos: [],
    nivel: 0,
    rutaCompleta: 'amants-dels-gossos',
    
    comunidadId: 'cat',
    fechaCreacion: new Date('2024-03-10'),
    fechaActualizacion: new Date('2025-01-10'),
    activo: true,
    
    propietarioId: 'user-2',
    configuracion: {
      requiereAprobacion: false,
      permitirInvitaciones: true,
      soloInvitacion: false,
      moderacionPosts: false,
      permitirMultimedia: true,
      permitirDocumentos: false,
      limiteTamañoArchivo: 10,
      formatosPermitidos: ['jpg', 'png', 'gif'],
      chatHabilitado: true,
      mensajeriaPrivada: true,
      notificacionesGrupo: true,
      permitirSubgrupos: false,
      nivelMaximoSubgrupos: 0,
      ofertasExclusivas: false,
      sistemaReputacion: false,
      gamificacion: true,
      temaPersonalizado: 'animals',
      coloresPersonalizados: {
        primario: '#f59e0b',
        secundario: '#fbbf24',
        fondo: '#fef3c7'
      }
    },
    estadisticas: {
      totalMiembros: 89,
      miembrosActivos: 67,
      miembrosNuevos7dias: 3,
      miembrosNuevos30dias: 12,
      totalPosts: 156,
      postsEstesMes: 28,
      totalComentarios: 432,
      totalReacciones: 1240,
      totalArchivos: 234,
      totalMultimedia: 234,
      totalDocumentos: 0,
      espacioUsado: 450,
      actividadDiaria: [],
      horasMasActivas: [8, 12, 18, 20, 21],
      totalSubgrupos: 0,
      subgruposActivos: 0
    },
    
    miembros: [
      {
        usuarioId: 'user-1',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-03-15'),
        fechaUltimaActividad: new Date('2025-01-09'),
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 8,
        comentarios: 24,
        archivosSubidos: 18,
        advertencias: 0
      }
    ],
    totalMiembros: 89,
    limiteMiembros: 200,
    
    etiquetas: ['gossos', 'mascotes', 'animals', 'social', 'fotos'],
    reglas: [
      {
        id: 'regla-gossos-1',
        titulo: 'Respecte pels animals',
        descripcion: 'Sempre tractar els temes d\'animals amb respecte i amor',
        orden: 1,
        activa: true,
        fechaCreacion: new Date('2024-03-10')
      },
      {
        id: 'regla-gossos-2',
        titulo: 'Fotos apropiades',
        descripcion: 'Només compartir fotos apropiades i respectuoses',
        orden: 2,
        activa: true,
        fechaCreacion: new Date('2024-03-10')
      }
    ],
    
    esDestacado: false,
    permiteInvitaciones: true,
    requiereAprobacion: false
  },
  {
    id: 'grupo-senderisme',
    nombre: 'Senderisme Catalunya',
    slug: 'senderisme-catalunya',
    descripcion: 'Grup per als amants del senderisme i la natura. Organitzem rutes i compartim experiències.',
    descripcionLarga: 'Descobreix els millors senderos de Catalunya amb altres empleats públics. Organitzem excursions de cap de setmana, compartim consells d\'equipament i rutes recomanades.',
    avatar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop',
    portada: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=300&fit=crop',
    tipo: 'publico',
    categoria: 'deportivo',
    subcategoria: 'Senderisme',
    
    grupoPadreId: undefined,
    subgrupos: [],
    nivel: 0,
    rutaCompleta: 'senderisme-catalunya',
    
    comunidadId: 'cat',
    fechaCreacion: new Date('2024-02-20'),
    fechaActualizacion: new Date('2025-01-08'),
    activo: true,
    
    propietarioId: 'user-3',
    configuracion: {
      requiereAprobacion: false,
      permitirInvitaciones: true,
      soloInvitacion: false,
      moderacionPosts: false,
      permitirMultimedia: true,
      permitirDocumentos: true,
      limiteTamañoArchivo: 25,
      formatosPermitidos: ['jpg', 'png', 'pdf', 'gpx'],
      chatHabilitado: true,
      mensajeriaPrivada: true,
      notificacionesGrupo: true,
      permitirSubgrupos: true,
      nivelMaximoSubgrupos: 2,
      ofertasExclusivas: true,
      sistemaReputacion: true,
      gamificacion: true,
      temaPersonalizado: 'natura',
      coloresPersonalizados: {
        primario: '#059669',
        secundario: '#10b981',
        fondo: '#d1fae5'
      }
    },
    estadisticas: {
      totalMiembros: 134,
      miembrosActivos: 98,
      miembrosNuevos7dias: 5,
      miembrosNuevos30dias: 18,
      totalPosts: 203,
      postsEstesMes: 32,
      totalComentarios: 567,
      totalReacciones: 1890,
      totalArchivos: 178,
      totalMultimedia: 156,
      totalDocumentos: 22,
      espacioUsado: 890,
      actividadDiaria: [],
      horasMasActivas: [7, 8, 19, 20, 21],
      totalSubgrupos: 0,
      subgruposActivos: 0
    },
    
    miembros: [
      {
        usuarioId: 'user-3',
        rol: 'propietario',
        estado: 'activo',
        fechaUnion: new Date('2024-02-20'),
        fechaUltimaActividad: new Date('2025-01-10'),
        usuario: PERFILES_USUARIOS['user-3'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: true,
          puedeModerar: true,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 32,
        comentarios: 89,
        archivosSubidos: 15,
        advertencias: 0
      },
      {
        usuarioId: 'user-1',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-03-01'),
        fechaUltimaActividad: new Date('2025-01-09'),
        usuario: PERFILES_USUARIOS['user-1'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 14,
        comentarios: 38,
        archivosSubidos: 8,
        advertencias: 0
      },
      {
        usuarioId: 'user-5',
        rol: 'moderador',
        estado: 'activo',
        fechaUnion: new Date('2024-02-25'),
        fechaUltimaActividad: new Date('2025-01-08'),
        usuario: PERFILES_USUARIOS['user-5'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: true,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 22,
        comentarios: 61,
        archivosSubidos: 12,
        advertencias: 0
      },
      {
        usuarioId: 'user-8',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-04-10'),
        fechaUltimaActividad: new Date('2025-01-07'),
        usuario: PERFILES_USUARIOS['user-8'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 18,
        comentarios: 45,
        archivosSubidos: 9,
        advertencias: 0
      },
      {
        usuarioId: 'user-11',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-05-05'),
        fechaUltimaActividad: new Date('2025-01-06'),
        usuario: PERFILES_USUARIOS['user-11'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 11,
        comentarios: 29,
        archivosSubidos: 7,
        advertencias: 0
      },
      {
        usuarioId: 'user-15',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-06-15'),
        fechaUltimaActividad: new Date('2025-01-05'),
        usuario: PERFILES_USUARIOS['user-15'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 7,
        comentarios: 21,
        archivosSubidos: 4,
        advertencias: 0
      },
      {
        usuarioId: 'user-17',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-08-20'),
        fechaUltimaActividad: new Date('2025-01-04'),
        usuario: PERFILES_USUARIOS['user-17'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 5,
        comentarios: 16,
        archivosSubidos: 3,
        advertencias: 0
      },
      {
        usuarioId: 'user-19',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-10-01'),
        fechaUltimaActividad: new Date('2025-01-03'),
        usuario: PERFILES_USUARIOS['user-19'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 3,
        comentarios: 9,
        archivosSubidos: 2,
        advertencias: 0
      }
    ],
    totalMiembros: 134,
    limiteMiembros: 300,
    
    etiquetas: ['senderisme', 'natura', 'excursions', 'muntanya', 'esport'],
    reglas: [
      {
        id: 'regla-sender-1',
        titulo: 'Respecte per la natura',
        descripcion: 'Sempre respectar el medi ambient i deixar els senderos nets',
        orden: 1,
        activa: true,
        fechaCreacion: new Date('2024-02-20')
      },
      {
        id: 'regla-sender-2',
        titulo: 'Seguretat primer',
        descripcion: 'Prioritzar sempre la seguretat en les activitats i excursions',
        orden: 2,
        activa: true,
        fechaCreacion: new Date('2024-02-20')
      }
    ],
    
    esDestacado: true,
    permiteInvitaciones: true,
    requiereAprobacion: false
  },
  // GRUPOS PROFESIONALES
  {
    id: 'grupo-policies',
    nombre: 'Policies Catalunya',
    slug: 'policies-catalunya',
    descripcion: 'Grup professional exclusiu per a policies i forces de seguretat de Catalunya.',
    descripcionLarga: 'Espai de trobada per als professionals de la policia catalana. Compartim protocols, experiències operatives, formació especialitzada i coordinació entre diferents cossos.',
    avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
    portada: 'https://images.unsplash.com/photo-1582719471297-f9fbc05b5e59?w=800&h=300&fit=crop',
    tipo: 'privado',
    categoria: 'profesional',
    subcategoria: 'Seguretat',
    
    grupoPadreId: undefined,
    subgrupos: [],
    nivel: 0,
    rutaCompleta: 'policies-catalunya',
    
    comunidadId: 'cat',
    fechaCreacion: new Date('2024-01-05'),
    fechaActualizacion: new Date('2025-01-11'),
    activo: true,
    
    propietarioId: 'user-4',
    configuracion: {
      requiereAprobacion: true,
      permitirInvitaciones: false,
      soloInvitacion: true,
      moderacionPosts: true,
      permitirMultimedia: true,
      permitirDocumentos: true,
      limiteTamañoArchivo: 100,
      formatosPermitidos: ['jpg', 'png', 'pdf', 'doc', 'docx', 'mp4'],
      chatHabilitado: true,
      mensajeriaPrivada: true,
      notificacionesGrupo: true,
      permitirSubgrupos: true,
      nivelMaximoSubgrupos: 4,
      ofertasExclusivas: true,
      sistemaReputacion: true,
      gamificacion: false,
      temaPersonalizado: 'policia',
      coloresPersonalizados: {
        primario: '#1e40af',
        secundario: '#3b82f6',
        fondo: '#dbeafe'
      }
    },
    estadisticas: {
      totalMiembros: 89,
      miembrosActivos: 71,
      miembrosNuevos7dias: 3,
      miembrosNuevos30dias: 8,
      totalPosts: 145,
      postsEstesMes: 19,
      totalComentarios: 312,
      totalReacciones: 678,
      totalArchivos: 187,
      totalMultimedia: 67,
      totalDocumentos: 120,
      espacioUsado: 1890,
      actividadDiaria: [],
      horasMasActivas: [6, 7, 14, 22, 23],
      totalSubgrupos: 0,
      subgruposActivos: 0
    },
    
    miembros: [
      {
        usuarioId: 'user-1',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-02-01'),
        fechaUltimaActividad: new Date('2025-01-10'),
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: false,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 5,
        comentarios: 18,
        archivosSubidos: 3,
        advertencias: 0
      }
    ],
    totalMiembros: 89,
    limiteMiembros: 200,
    
    etiquetas: ['policies', 'seguretat', 'Catalunya', 'professional', 'protocols'],
    reglas: [
      {
        id: 'regla-pol-1',
        titulo: 'Confidencialitat operativa',
        descripcion: 'Respectar estrictament la confidencialitat de les operacions i informació sensible',
        orden: 1,
        activa: true,
        fechaCreacion: new Date('2024-01-05')
      },
      {
        id: 'regla-pol-2',
        titulo: 'Ètica professional',
        descripcion: 'Mantenir els més alts estàndards ètics i de conducta professional',
        orden: 2,
        activa: true,
        fechaCreacion: new Date('2024-01-05')
      },
      {
        id: 'regla-pol-3',
        titulo: 'Verificació de credencials',
        descripcion: 'Tots els membres han de verificar la seva condició com a agent de policia',
        orden: 3,
        activa: true,
        fechaCreacion: new Date('2024-01-05')
      }
    ],
    
    esDestacado: true,
    permiteInvitaciones: false,
    requiereAprobacion: true
  },
  {
    id: 'grupo-bombers',
    nombre: 'Bombers Catalunya',
    slug: 'bombers-catalunya',
    descripcion: 'Grup professional exclusiu per a bombers i personal d\'emergències de Catalunya.',
    descripcionLarga: 'Espai de coordinació per als professionals del cos de bombers. Compartim protocols d\'emergències, tècniques de rescat, formació contínua i experiències sobre el terreny.',
    avatar: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&h=100&fit=crop',
    portada: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&h=300&fit=crop',
    tipo: 'privado',
    categoria: 'profesional',
    subcategoria: 'Emergències',
    
    grupoPadreId: undefined,
    subgrupos: [],
    nivel: 0,
    rutaCompleta: 'bombers-catalunya',
    
    comunidadId: 'cat',
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2025-01-10'),
    activo: true,
    
    propietarioId: 'user-5',
    configuracion: {
      requiereAprobacion: true,
      permitirInvitaciones: false,
      soloInvitacion: true,
      moderacionPosts: true,
      permitirMultimedia: true,
      permitirDocumentos: true,
      limiteTamañoArchivo: 150,
      formatosPermitidos: ['jpg', 'png', 'pdf', 'doc', 'docx', 'mp4', 'avi'],
      chatHabilitado: true,
      mensajeriaPrivada: true,
      notificacionesGrupo: true,
      permitirSubgrupos: true,
      nivelMaximoSubgrupos: 3,
      ofertasExclusivas: true,
      sistemaReputacion: true,
      gamificacion: false,
      temaPersonalizado: 'bombers',
      coloresPersonalizados: {
        primario: '#dc2626',
        secundario: '#ef4444',
        fondo: '#fee2e2'
      }
    },
    estadisticas: {
      totalMiembros: 67,
      miembrosActivos: 54,
      miembrosNuevos7dias: 2,
      miembrosNuevos30dias: 5,
      totalPosts: 98,
      postsEstesMes: 14,
      totalComentarios: 234,
      totalReacciones: 456,
      totalArchivos: 156,
      totalMultimedia: 78,
      totalDocumentos: 78,
      espacioUsado: 2150,
      actividadDiaria: [],
      horasMasActivas: [6, 7, 8, 14, 15, 22],
      totalSubgrupos: 0,
      subgruposActivos: 0
    },
    
    miembros: [
      {
        usuarioId: 'user-5',
        rol: 'propietario',
        estado: 'activo',
        fechaUnion: new Date('2024-01-10'),
        fechaUltimaActividad: new Date('2025-01-10'),
        usuario: PERFILES_USUARIOS['user-5'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: true,
          puedeModerar: true,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 24,
        comentarios: 68,
        archivosSubidos: 16,
        advertencias: 0
      },
      {
        usuarioId: 'user-7',
        rol: 'administrador',
        estado: 'activo',
        fechaUnion: new Date('2024-01-15'),
        fechaUltimaActividad: new Date('2025-01-09'),
        usuario: PERFILES_USUARIOS['user-7'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: true,
          puedeCrearSubgrupos: true,
          puedeModerar: true,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 16,
        comentarios: 45,
        archivosSubidos: 12,
        advertencias: 0
      },
      {
        usuarioId: 'user-9',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-02-20'),
        fechaUltimaActividad: new Date('2025-01-08'),
        usuario: PERFILES_USUARIOS['user-9'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: false,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 7,
        comentarios: 21,
        archivosSubidos: 4,
        advertencias: 0
      },
      {
        usuarioId: 'user-11',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-04-05'),
        fechaUltimaActividad: new Date('2025-01-07'),
        usuario: PERFILES_USUARIOS['user-11'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: false,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 12,
        comentarios: 34,
        archivosSubidos: 8,
        advertencias: 0
      },
      {
        usuarioId: 'user-15',
        rol: 'miembro',
        estado: 'activo',
        fechaUnion: new Date('2024-07-12'),
        fechaUltimaActividad: new Date('2025-01-06'),
        usuario: PERFILES_USUARIOS['user-15'],
        permisos: {
          puedePublicar: true,
          puedeComentar: true,
          puedeSubirArchivos: true,
          puedeInvitar: false,
          puedeCrearSubgrupos: false,
          puedeModerar: false,
          puedeVerMiembros: true,
          puedeEnviarMensajes: true
        },
        postsCreados: 4,
        comentarios: 15,
        archivosSubidos: 3,
        advertencias: 0
      }
    ],
    totalMiembros: 67,
    limiteMiembros: 120,
    
    etiquetas: ['bombers', 'emergències', 'rescat', 'Catalunya', 'professional'],
    reglas: [
      {
        id: 'regla-bomb-1',
        titulo: 'Protocols d\'emergència',
        descripcion: 'Respectar i complir tots els protocols establerts per situacions d\'emergència',
        orden: 1,
        activa: true,
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 'regla-bomb-2',
        titulo: 'Seguretat primer',
        descripcion: 'La seguretat del personal i ciutadans és sempre la prioritat màxima',
        orden: 2,
        activa: true,
        fechaCreacion: new Date('2024-01-10')
      },
      {
        id: 'regla-bomb-3',
        titulo: 'Acreditació professional',
        descripcion: 'Verificar la pertinença al cos de bombers o serveis d\'emergència',
        orden: 3,
        activa: true,
        fechaCreacion: new Date('2024-01-10')
      }
    ],
    
    esDestacado: false,
    permiteInvitaciones: false,
    requiereAprobacion: true
  }
]

const POSTS_MOCK: PostGrupo[] = [
  {
    id: 'post-1',
    autorId: 'user-1',
    grupoId: 'grupo-funcionaris-educacio',
    tipo: 'texto',
    contenido: 'Comparteixo aquesta experiència interessant sobre metodologies innovadores a l\'aula...',
    fechaCreacion: new Date('2025-01-10'),
    estado: 'publicado',
    multimedia: [],
    documentos: [],
    comentarios: [],
    reacciones: [
      {
        id: 'reac-1',
        usuarioId: 'user-2',
        tipo: 'like',
        fechaCreacion: new Date('2025-01-10')
      }
    ],
    compartidos: 3,
    esPinneado: false,
    esDestacado: false,
    permiteComentarios: true,
    visibilidad: 'miembros',
    etiquetas: ['metodologia', 'innovacio'],
    mencionados: []
  },
  {
    id: 'post-2',
    autorId: 'user-2',
    grupoId: 'grupo-amants-gossos',
    tipo: 'imagen',
    contenido: 'El meu gos Max gaudint del parc! 🐕',
    fechaCreacion: new Date('2025-01-09'),
    estado: 'publicado',
    multimedia: [
      {
        id: 'media-1',
        tipo: 'imagen',
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
        titulo: 'Max al parc'
      }
    ],
    documentos: [],
    comentarios: [],
    reacciones: [],
    compartidos: 0,
    esPinneado: false,
    esDestacado: false,
    permiteComentarios: true,
    visibilidad: 'miembros',
    etiquetas: ['gos', 'parc', 'diversio'],
    mencionados: []
  },
  {
    id: 'post-3',
    autorId: 'user-3',
    grupoId: 'grupo-senderisme',
    tipo: 'texto',
    contenido: 'Qui s\'apunta per la ruta del Montseny aquest cap de setmana? Sortida a les 8h des de Barcelona!',
    fechaCreacion: new Date('2025-01-08'),
    estado: 'publicado',
    multimedia: [],
    documentos: [],
    comentarios: [],
    reacciones: [],
    compartidos: 0,
    esPinneado: true,
    esDestacado: false,
    permiteComentarios: true,
    visibilidad: 'miembros',
    etiquetas: ['montseny', 'excursio', 'capsetmana'],
    mencionados: []
  },
  {
    id: 'post-4',
    autorId: 'user-4',
    grupoId: 'grupo-policies',
    tipo: 'documento',
    contenido: 'Nou protocol d\'actuació en controls de trànsit actualitzat per 2025',
    fechaCreacion: new Date('2025-01-07'),
    estado: 'publicado',
    multimedia: [],
    documentos: [
      {
        id: 'doc-1',
        nombre: 'protocol-controls-transit-2025.pdf',
        tipo: 'pdf',
        tamaño: 1800000,
        url: '#'
      }
    ],
    comentarios: [],
    reacciones: [],
    compartidos: 0,
    esPinneado: false,
    esDestacado: true,
    permiteComentarios: true,
    visibilidad: 'miembros',
    etiquetas: ['protocol', 'transit', 'actualizacio'],
    mencionados: []
  },
  {
    id: 'post-5',
    autorId: 'user-5',
    grupoId: 'grupo-bombers',
    tipo: 'texto',
    contenido: 'Recordatori: formació sobre nous equips de rescat aquàtic aquest divendres a les 9h al parc central.',
    fechaCreacion: new Date('2025-01-06'),
    estado: 'publicado',
    multimedia: [],
    documentos: [],
    comentarios: [],
    reacciones: [],
    compartidos: 0,
    esPinneado: true,
    esDestacado: false,
    permiteComentarios: true,
    visibilidad: 'miembros',
    etiquetas: ['formacio', 'rescat', 'aquatic'],
    mencionados: []
  }
]

const OFERTAS_MOCK: OfertaGrupo[] = [
  {
    id: 'oferta-1',
    grupoId: 'grupo-funcionaris-educacio',
    autorId: 'admin-1',
    titulo: 'Curs de Formació Contínua - 20% Descompte',
    descripcion: 'Descompte exclusiu per membres del grup en el curs de metodologies educatives',
    categoria: 'formacio',
    tipo: 'descuento',
    porcentajeDescuento: 20,
    fechaInicio: new Date('2025-01-01'),
    fechaFin: new Date('2025-03-31'),
    esIlimitada: false,
    limiteCantidad: 50,
    cantidadUsada: 12,
    rolesPermitidos: ['administrador', 'moderador', 'miembro'],
    enlaceExterno: 'https://formacio.gencat.cat/cursos/metodologies',
    codigoDescuento: 'EDUFUNC20',
    activa: true,
    destacada: true,
    fechaCreacion: new Date('2024-12-15'),
    visualizaciones: 156,
    interesados: ['user-1', 'user-2', 'user-3'],
    reclamados: [
      {
        id: 'reclamo-1',
        ofertaId: 'oferta-1',
        usuarioId: 'user-1',
        fechaReclamo: new Date('2025-01-05'),
        estado: 'utilizada',
        codigoUnico: 'EDUFUNC20-USER1-2025'
      }
    ]
  },
  {
    id: 'oferta-2',
    grupoId: 'grupo-senderisme',
    autorId: 'user-3',
    titulo: 'Material de Muntanya - 15% Descompte',
    descripcion: 'Descompte exclusiu a Decathlon per material de senderisme i muntanya',
    categoria: 'esport',
    tipo: 'descuento',
    porcentajeDescuento: 15,
    fechaInicio: new Date('2025-01-01'),
    fechaFin: new Date('2025-04-30'),
    esIlimitada: false,
    limiteCantidad: 100,
    cantidadUsada: 23,
    rolesPermitidos: ['miembro', 'moderador', 'administrador'],
    enlaceExterno: 'https://decathlon.cat/senderisme',
    codigoDescuento: 'SENDER15',
    activa: true,
    destacada: true,
    fechaCreacion: new Date('2024-12-20'),
    visualizaciones: 89,
    interesados: ['user-1', 'user-3', 'user-6'],
    reclamados: [
      {
        id: 'reclamo-2',
        ofertaId: 'oferta-2',
        usuarioId: 'user-3',
        fechaReclamo: new Date('2025-01-03'),
        estado: 'utilizada',
        codigoUnico: 'SENDER15-USER3-2025'
      }
    ]
  },
  {
    id: 'oferta-3',
    grupoId: 'grupo-bombers',
    autorId: 'user-5',
    titulo: 'Curs de Primers Auxilis Avançats - Gratuït',
    descripcion: 'Curs gratuït de primers auxilis per a familiars de bombers',
    categoria: 'formacio',
    tipo: 'gratis',
    fechaInicio: new Date('2025-02-01'),
    fechaFin: new Date('2025-02-28'),
    esIlimitada: false,
    limiteCantidad: 30,
    cantidadUsada: 8,
    rolesPermitidos: ['miembro', 'moderador', 'administrador'],
    enlaceExterno: 'https://bombers.gencat.cat/formacio/primers-auxilis',
    codigoDescuento: 'BOMBERS2025',
    activa: true,
    destacada: true,
    fechaCreacion: new Date('2025-01-01'),
    visualizaciones: 45,
    interesados: ['user-5', 'user-7'],
    reclamados: [
      {
        id: 'reclamo-3',
        ofertaId: 'oferta-3',
        usuarioId: 'user-5',
        fechaReclamo: new Date('2025-01-02'),
        estado: 'activa',
        codigoUnico: 'BOMBERS2025-USER5-2025'
      }
    ]
  }
]

export function GruposAvanzadosProvider({ children }: { children: ReactNode }) {
  const [grupos, setGrupos] = useState<GrupoAvanzado[]>(GRUPOS_MOCK)
  const [grupoActivo, setGrupoActivo] = useState<GrupoAvanzado | null>(null)
  const [miembros, setMiembros] = useState<MiembroGrupoAvanzado[]>([])
  const [posts, setPosts] = useState<PostGrupo[]>(POSTS_MOCK)
  const [ofertas, setOfertas] = useState<OfertaGrupo[]>(OFERTAS_MOCK)
  const [actividades, setActividades] = useState<ActividadGrupo[]>([])
  const [cargando, setCargando] = useState(false)
  const [estadisticasDashboard, setEstadisticasDashboard] = useState<EstadisticasGrupoDashboard | null>(null)
  
  const [filtros, setFiltros] = useState<FiltrosGrupoAvanzado>({})
  const [configuracionFeed, setConfiguracionFeed] = useState<ConfiguracionFeedGrupo>({
    mostrarActividad: true,
    mostrarNuevosMiembros: true,
    mostrarOfertas: true,
    filtroTipoPost: ['texto', 'imagen', 'video', 'documento', 'oferta'],
    ordenamiento: 'recientes'
  })
  
  const { afegirNotificacio } = useNotifications()

  // Funciones de gestión de grupos
  const crearGrupo = async (datos: Partial<GrupoAvanzado>): Promise<GrupoAvanzado> => {
    setCargando(true)
    try {
      const nuevoGrupo: GrupoAvanzado = {
        id: `grupo-${Date.now()}`,
        nombre: datos.nombre || '',
        slug: datos.nombre?.toLowerCase().replace(/\s+/g, '-') || '',
        descripcion: datos.descripcion || '',
        tipo: datos.tipo || 'publico',
        categoria: datos.categoria || 'profesional',
        grupoPadreId: datos.grupoPadreId,
        subgrupos: [],
        nivel: datos.nivel || 0,
        rutaCompleta: datos.rutaCompleta || datos.nombre?.toLowerCase().replace(/\s+/g, '-') || '',
        comunidadId: datos.comunidadId || 'cat',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true,
        propietarioId: 'user-1', // Usuario actual
        configuracion: {
          requiereAprobacion: false,
          permitirInvitaciones: true,
          soloInvitacion: false,
          moderacionPosts: false,
          permitirMultimedia: true,
          permitirDocumentos: true,
          limiteTamañoArchivo: 10,
          formatosPermitidos: ['jpg', 'png', 'pdf'],
          chatHabilitado: true,
          mensajeriaPrivada: true,
          notificacionesGrupo: true,
          permitirSubgrupos: true,
          nivelMaximoSubgrupos: 4,
          ofertasExclusivas: false,
          sistemaReputacion: false,
          gamificacion: false,
          ...datos.configuracion
        },
        estadisticas: {
          totalMiembros: 1,
          miembrosActivos: 1,
          miembrosNuevos7dias: 1,
          miembrosNuevos30dias: 1,
          totalPosts: 0,
          postsEstesMes: 0,
          totalComentarios: 0,
          totalReacciones: 0,
          totalArchivos: 0,
          totalMultimedia: 0,
          totalDocumentos: 0,
          espacioUsado: 0,
          actividadDiaria: [],
          horasMasActivas: [],
          totalSubgrupos: 0,
          subgruposActivos: 0
        },
        miembros: [
          {
            usuarioId: 'user-1',
            rol: 'propietario',
            estado: 'activo',
            fechaUnion: new Date(),
            permisos: {
              puedePublicar: true,
              puedeComentar: true,
              puedeSubirArchivos: true,
              puedeInvitar: true,
              puedeCrearSubgrupos: true,
              puedeModerar: true,
              puedeVerMiembros: true,
              puedeEnviarMensajes: true
            },
            postsCreados: 0,
            comentarios: 0,
            archivosSubidos: 0,
            advertencias: 0
          }
        ],
        totalMiembros: 1,
        etiquetas: datos.etiquetas || [],
        reglas: datos.reglas || [],
        esDestacado: false,
        permiteInvitaciones: true,
        requiereAprobacion: datos.configuracion?.requiereAprobacion || false,
        ...datos
      }

      setGrupos(prev => [...prev, nuevoGrupo])
      
      afegirNotificacio({
        tipus: 'grup',
        titol: 'Grup creat',
        descripcio: `S'ha creat el grup "${nuevoGrupo.nombre}" exitosament`
      })
      
      return nuevoGrupo
    } finally {
      setCargando(false)
    }
  }

  const crearSubgrupo = async (grupoPadreId: string, datos: Partial<GrupoAvanzado>): Promise<GrupoAvanzado> => {
    const grupoPadre = grupos.find(g => g.id === grupoPadreId)
    if (!grupoPadre) throw new Error('Grup pare no trobat')
    
    if (grupoPadre.nivel >= 4) {
      throw new Error('S\'ha arribat al nivell màxim de subgrups (4)')
    }

    const rutaCompleta = `${grupoPadre.rutaCompleta}/${datos.nombre?.toLowerCase().replace(/\s+/g, '-')}`
    
    const subgrupo = await crearGrupo({
      ...datos,
      grupoPadreId,
      nivel: grupoPadre.nivel + 1,
      rutaCompleta,
      categoria: grupoPadre.categoria,
      comunidadId: grupoPadre.comunidadId
    })

    // Actualizar el grupo padre
    setGrupos(prev => prev.map(g => 
      g.id === grupoPadreId 
        ? { 
            ...g, 
            subgrupos: [...g.subgrupos, subgrupo.id],
            estadisticas: {
              ...g.estadisticas,
              totalSubgrupos: g.estadisticas.totalSubgrupos + 1,
              subgruposActivos: g.estadisticas.subgruposActivos + 1
            }
          }
        : g
    ))

    return subgrupo
  }

  const seleccionarGrupo = (id: string) => {
    const grupo = grupos.find(g => g.id === id)
    if (grupo) {
      setGrupoActivo(grupo)
      setMiembros(grupo.miembros)
      
      // Cargar posts del grupo
      const postsGrupo = posts.filter(p => p.grupoId === id)
      setPosts(postsGrupo)
      
      // Cargar ofertas del grupo
      const ofertasGrupo = ofertas.filter(o => o.grupoId === id)
      setOfertas(ofertasGrupo)
    }
  }

  const obtenerJerarquiaGrupo = (grupoId: string): GrupoAvanzado[] => {
    const grupo = grupos.find(g => g.id === grupoId)
    if (!grupo) return []

    const jerarquia: GrupoAvanzado[] = [grupo]
    let grupoPadre = grupo.grupoPadreId ? grupos.find(g => g.id === grupo.grupoPadreId) : null
    
    while (grupoPadre) {
      jerarquia.unshift(grupoPadre)
      grupoPadre = grupoPadre.grupoPadreId ? grupos.find(g => g.id === grupoPadre.grupoPadreId) : null
    }
    
    return jerarquia
  }

  const obtenerSubgrupos = (grupoPadreId: string): GrupoAvanzado[] => {
    return grupos.filter(g => g.grupoPadreId === grupoPadreId)
  }

  // Funciones de gestión de miembros
  const agregarMiembro = async (grupoId: string, usuarioId: string, rol: RolGrupo = 'miembro'): Promise<void> => {
    const nuevoMiembro: MiembroGrupoAvanzado = {
      usuarioId,
      rol,
      estado: 'activo',
      fechaUnion: new Date(),
      permisos: {
        puedePublicar: true,
        puedeComentar: true,
        puedeSubirArchivos: true,
        puedeInvitar: rol !== 'miembro',
        puedeCrearSubgrupos: ['embaixador', 'administrador'].includes(rol),
        puedeModerar: ['embaixador', 'administrador', 'moderador'].includes(rol),
        puedeVerMiembros: true,
        puedeEnviarMensajes: true
      },
      postsCreados: 0,
      comentarios: 0,
      archivosSubidos: 0,
      advertencias: 0
    }

    setGrupos(prev => prev.map(g => 
      g.id === grupoId 
        ? { 
            ...g, 
            miembros: [...g.miembros, nuevoMiembro],
            totalMiembros: g.totalMiembros + 1
          }
        : g
    ))

    afegirNotificacio({
      tipus: 'grup',
      titol: 'Nou membre',
      descripcio: `S'ha afegit un nou membre al grup`
    })
  }

  const crearPost = async (grupoId: string, datos: Partial<PostGrupo>): Promise<PostGrupo> => {
    const nuevoPost: PostGrupo = {
      id: `post-${Date.now()}`,
      autorId: 'user-1',
      grupoId,
      tipo: datos.tipo || 'texto',
      contenido: datos.contenido || '',
      fechaCreacion: new Date(),
      estado: 'publicado',
      multimedia: datos.multimedia || [],
      documentos: datos.documentos || [],
      comentarios: [],
      reacciones: [],
      compartidos: 0,
      esPinneado: false,
      esDestacado: false,
      permiteComentarios: true,
      visibilidad: 'miembros',
      etiquetas: datos.etiquetas || [],
      mencionados: datos.mencionados || [],
      ...datos
    }

    setPosts(prev => [...prev, nuevoPost])
    
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Nova publicació',
      descripcio: `S'ha creat una nova publicació al grup`
    })

    return nuevoPost
  }

  const crearOferta = async (grupoId: string, datos: Partial<OfertaGrupo>): Promise<OfertaGrupo> => {
    const nuevaOferta: OfertaGrupo = {
      id: `oferta-${Date.now()}`,
      grupoId,
      autorId: 'user-1',
      titulo: datos.titulo || '',
      descripcion: datos.descripcion || '',
      categoria: datos.categoria || 'general',
      tipo: datos.tipo || 'descuento',
      fechaInicio: datos.fechaInicio || new Date(),
      esIlimitada: datos.esIlimitada || false,
      cantidadUsada: 0,
      rolesPermitidos: datos.rolesPermitidos || ['miembro'],
      activa: true,
      destacada: false,
      fechaCreacion: new Date(),
      visualizaciones: 0,
      interesados: [],
      reclamados: [],
      ...datos
    }

    setOfertas(prev => [...prev, nuevaOferta])
    
    afegirNotificacio({
      tipus: 'grup',
      titol: 'Nova oferta',
      descripcio: `S'ha creat una nova oferta exclusiva: "${nuevaOferta.titulo}"`
    })

    return nuevaOferta
  }

  // Funciones de utilidad
  const puedeGestionarGrupo = (grupoId: string, accion: string): boolean => {
    const grupo = grupos.find(g => g.id === grupoId)
    if (!grupo) return false

    const miembro = grupo.miembros.find(m => m.usuarioId === 'user-1')
    if (!miembro) return false

    switch (accion) {
      case 'editar':
      case 'eliminar':
        return ['embaixador', 'administrador'].includes(miembro.rol)
      case 'moderar':
        return ['embaixador', 'administrador', 'moderador'].includes(miembro.rol)
      case 'invitar':
        return miembro.permisos.puedeInvitar
      case 'crear_subgrupo':
        return miembro.permisos.puedeCrearSubgrupos
      default:
        return false
    }
  }

  const esAdminGrupo = (grupoId: string): boolean => {
    return puedeGestionarGrupo(grupoId, 'editar')
  }

  const esMiembroGrupo = (grupoId: string): boolean => {
    const grupo = grupos.find(g => g.id === grupoId)
    return !!grupo?.miembros.find(m => m.usuarioId === 'user-1')
  }

  // Funciones stub para completar la interfaz
  const editarGrupo = async (id: string, datos: Partial<GrupoAvanzado>): Promise<void> => {
    setGrupos(prev => prev.map(g => g.id === id ? { ...g, ...datos } : g))
  }

  const eliminarGrupo = async (id: string): Promise<void> => {
    setGrupos(prev => prev.filter(g => g.id !== id))
  }

  const removerMiembro = async (grupoId: string, usuarioId: string): Promise<void> => {
    setGrupos(prev => prev.map(g => 
      g.id === grupoId 
        ? { ...g, miembros: g.miembros.filter(m => m.usuarioId !== usuarioId) }
        : g
    ))
  }

  const cambiarRolMiembro = async (grupoId: string, usuarioId: string, nuevoRol: RolGrupo): Promise<void> => {
    setGrupos(prev => prev.map(g => 
      g.id === grupoId 
        ? { 
            ...g, 
            miembros: g.miembros.map(m => 
              m.usuarioId === usuarioId ? { ...m, rol: nuevoRol } : m
            )
          }
        : g
    ))
  }

  const invitarMiembro = async (grupoId: string, email: string, rol: RolGrupo = 'miembro'): Promise<void> => {
    // Implementar lógica de invitación
  }

  const editarPost = async (postId: string, datos: Partial<PostGrupo>): Promise<void> => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...datos } : p))
  }

  const eliminarPost = async (postId: string): Promise<void> => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const reaccionarPost = async (postId: string, tipo: string): Promise<void> => {
    // Implementar lógica de reacciones
  }

  const comentarPost = async (postId: string, contenido: string): Promise<void> => {
    // Implementar lógica de comentarios
  }

  const reclamarOferta = async (ofertaId: string): Promise<void> => {
    // Implementar lógica de reclamar ofertas
  }

  const registrarActividad = (grupoId: string, actividad: Partial<ActividadGrupo>) => {
    const nuevaActividad: ActividadGrupo = {
      id: `actividad-${Date.now()}`,
      grupoId,
      usuarioId: 'user-1',
      tipo: actividad.tipo || 'post',
      accion: actividad.accion || '',
      descripcion: actividad.descripcion || '',
      fechaActividad: new Date(),
      esPublica: true,
      ...actividad
    }
    
    setActividades(prev => [...prev, nuevaActividad])
  }

  const obtenerEstadisticas = async (): Promise<void> => {
    // Implementar lógica de estadísticas
  }

  return (
    <GruposAvanzadosContext.Provider value={{
      grupos,
      grupoActivo,
      cargando,
      crearGrupo,
      editarGrupo,
      eliminarGrupo,
      seleccionarGrupo,
      crearSubgrupo,
      obtenerJerarquiaGrupo,
      obtenerSubgrupos,
      miembros,
      agregarMiembro,
      removerMiembro,
      cambiarRolMiembro,
      invitarMiembro,
      posts,
      crearPost,
      editarPost,
      eliminarPost,
      reaccionarPost,
      comentarPost,
      ofertas,
      crearOferta,
      reclamarOferta,
      actividades,
      registrarActividad,
      filtros,
      setFiltros,
      configuracionFeed,
      setConfiguracionFeed,
      estadisticasDashboard,
      obtenerEstadisticas,
      puedeGestionarGrupo,
      esAdminGrupo,
      esMiembroGrupo
    }}>
      {children}
    </GruposAvanzadosContext.Provider>
  )
}

export function useGruposAvanzados() {
  const context = useContext(GruposAvanzadosContext)
  if (context === undefined) {
    throw new Error('useGruposAvanzados must be used within a GruposAvanzadosProvider')
  }
  return context
}