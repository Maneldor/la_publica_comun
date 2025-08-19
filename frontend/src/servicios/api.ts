// src/servicios/api.ts

import { Post, Grupo, PerfilEmpresa, Usuario } from '../../tipos/redSocial';
import { CompanyProfile } from '../componentes/empresas/TarjetaEmpresa';

// --- BASE DE DATOS SIMULADA (MOCKS) ---

const mockPosts: Post[] = [
  {
    id: 'post-1',
    autorId: 'user-02',
    tipo: 'texto',
    contenido: '¡Excelente jornada sobre #TransformaciónDigital en el sector público! 🚀 Las nuevas herramientas de IA están revolucionando la gestión tributaria.',
    etiquetas: ['TransformaciónDigital', 'IA', 'SectorPúblico'],
    fechaCreacion: new Date('2025-07-17T18:00:00Z'),
    visibilidad: 'publico',
    moderado: true,
    fijado: false,
    comentarios: [],
    reacciones: [],
    estadisticas: { 
      reacciones: { like: 45, celebrar: 12 }, 
      comentarios: 12, 
      compartidos: 8, 
      visualizaciones: 156 
    },
  },
  {
    id: 'post-2',
    autorId: 'user-03',
    grupoId: 'group-01',
    tipo: 'imagen',
    contenido: 'Orgulloso de anunciar que nuestro centro ha sido reconocido como "Centro Educativo Digital del Año" 🏆',
    multimedia: [
      {
        tipo: 'imagen',
        url: '/api/placeholder/600/300',
        descripcion: 'Premio Centro Educativo Digital del Año'
      }
    ],
    etiquetas: ['Educación', 'Digital', 'Premio'],
    fechaCreacion: new Date('2025-07-17T16:30:00Z'),
    visibilidad: 'publico',
    moderado: true,
    fijado: false,
    comentarios: [],
    reacciones: [],
    estadisticas: { 
      reacciones: { like: 128, celebrar: 30 }, 
      comentarios: 23, 
      compartidos: 34, 
      visualizaciones: 456 
    },
  }
];

const mockGrupos: Grupo[] = [
  { 
    id: 'group-01', 
    nombre: 'Desarrolladores React', 
    descripcion: 'Grupo para desarrolladores React del sector público',
    tipo: 'publico',
    categoria: 'profesional',
    subcategoria: 'Tecnología',
    comunidadId: 'catalunya',
    creadorId: 'user-01',
    administradores: ['user-01'],
    moderadores: ['user-02'],
    miembros: [],
    fechaCreacion: new Date('2025-01-01'),
    configuracion: {
      requiereAprobacion: false,
      permitirInvitaciones: true,
      moderacionPosts: false
    },
    estadisticas: {
      totalMiembros: 234,
      miembrosActivos: 156,
      postsEstesMes: 12,
      crecimientoMensual: 4.2
    },
    etiquetas: ['react', 'desarrollo', 'frontend']
  },
  { 
    id: 'group-02', 
    nombre: 'Marketing Digital', 
    descripcion: 'Estrategias de marketing digital para el sector público',
    tipo: 'privado',
    categoria: 'profesional',
    subcategoria: 'Marketing',
    comunidadId: 'catalunya',
    creadorId: 'user-03',
    administradores: ['user-03'],
    moderadores: [],
    miembros: [],
    fechaCreacion: new Date('2025-01-15'),
    configuracion: {
      requiereAprobacion: true,
      permitirInvitaciones: false,
      moderacionPosts: true
    },
    estadisticas: {
      totalMiembros: 156,
      miembrosActivos: 89,
      postsEstesMes: 8,
      crecimientoMensual: 3.8
    },
    etiquetas: ['marketing', 'digital', 'publicidad']
  }
];

const mockEmpresas: PerfilEmpresa[] = [
    { 
      id: 'empresa-1', 
      nombre: 'TechSolutions S.A.',
      razonSocial: 'TechSolutions Sociedad Anónima',
      cif: 'A12345678',
      tipo: 'empresa-privada',
      descripcion: 'Empresa de soluciones tecnológicas',
      ubicacion: {
        direccion: 'Calle Tecnología, 123',
        ciudad: 'Barcelona',
        provincia: 'Barcelona',
        codigoPostal: '08001',
        pais: 'España'
      },
      contacto: {
        email: 'contacto@techsolutions.com',
        telefono: '934567890',
        website: 'https://techsolutions.com'
      },
      datosLegales: {
        numeroRegistroMercantil: 'Barcelona',
        fechaConstitucion: new Date('2020-01-15'),
        capitalSocial: 100000,
        sectorActividad: 'Tecnología'
      },
      comunidadId: 'catalunya',
      gestorId: 'user-empresa-1',
      verificado: true,
      activo: true,
      fechaRegistro: new Date('2024-01-01'),
      configuracion: {
        perfilPublico: true,
        permitirContactoDirecto: true,
        mostrarDatosContacto: true,
        notificacionesAnalytics: true
      },
      estadisticas: {
        ofertasPublicadas: 5,
        candidatosContactados: 25,
        visualizacionesPerfil: 234,
        interaccionesPosts: 12
      }
    },
    { 
      id: 'empresa-2', 
      nombre: 'Consultoría Global',
      razonSocial: 'Consultoría Global S.L.',
      cif: 'B87654321',
      tipo: 'empresa-privada',
      descripcion: 'Consultoría especializada en administración pública',
      ubicacion: {
        direccion: 'Avenida Consultoría, 456',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        codigoPostal: '28001',
        pais: 'España'
      },
      contacto: {
        email: 'info@consultoriaglobal.com',
        telefono: '915678901'
      },
      datosLegales: {
        numeroRegistroMercantil: 'Madrid',
        fechaConstitucion: new Date('2018-06-10'),
        capitalSocial: 50000,
        sectorActividad: 'Consultoría'
      },
      comunidadId: 'madrid',
      gestorId: 'user-empresa-2',
      verificado: false,
      activo: true,
      fechaRegistro: new Date('2024-02-15'),
      configuracion: {
        perfilPublico: true,
        permitirContactoDirecto: false,
        mostrarDatosContacto: false,
        notificacionesAnalytics: false
      },
      estadisticas: {
        ofertasPublicadas: 12,
        candidatosContactados: 67,
        visualizacionesPerfil: 445,
        interaccionesPosts: 23
      }
    }
];

// --- SERVICIOS DE API SIMULADOS ---

// Simula un retraso de red
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  fetchPosts: async (filtro: string, pagina: number): Promise<Post[]> => {
    console.log(`API: Obteniendo posts con filtro "${filtro}" y página ${pagina}...`);
    await networkDelay(800);
    return mockPosts;
  },
  fetchGruposSugeridos: async (): Promise<Grupo[]> => {
    console.log('API: Obteniendo grupos sugeridos...');
    await networkDelay(1200);
    return mockGrupos;
  },
  fetchEmpresasSugeridas: async (): Promise<PerfilEmpresa[]> => {
    console.log('API: Obteniendo empresas sugeridas...');
    await networkDelay(1500);
    return mockEmpresas;
  },
  
  // Nuevos métodos para empresas
  getEmpresas: async (params: {
    page: number;
    limit: number;
    search?: string;
    sectors?: string[];
    ubicacion?: string;
    verificadas?: boolean;
    destacadas?: boolean;
  }): Promise<CompanyProfile[]> => {
    console.log('API: Obteniendo empresas con filtros...', params);
    await networkDelay(800);
    // Aquí iría la llamada real a la API
    // return fetch(`/api/empresas?${queryString}`).then(res => res.json());
    return [];
  },
  
  getEmpresasSeguidas: async (): Promise<string[]> => {
    console.log('API: Obteniendo empresas seguidas...');
    await networkDelay(500);
    // Aquí iría la llamada real a la API
    return [];
  },
  
  seguirEmpresa: async (empresaId: string): Promise<void> => {
    console.log(`API: Siguiendo empresa ${empresaId}...`);
    await networkDelay(300);
    // Aquí iría la llamada real a la API
  },
  
  dejarDeSeguirEmpresa: async (empresaId: string): Promise<void> => {
    console.log(`API: Dejando de seguir empresa ${empresaId}...`);
    await networkDelay(300);
    // Aquí iría la llamada real a la API
  },
  
  // Podríamos añadir más funciones aquí (fetchEventos, etc.)
};