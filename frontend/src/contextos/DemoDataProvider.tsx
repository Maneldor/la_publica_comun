'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { DatosDemo, AudienciaDemo, DatosComunidadDemo } from '../../tipos/demo'
import { Usuario, Grupo, Post, EventoPost } from '../../tipos/redSocial'

// ✅ DATOS DEMO ESPECIALIZADOS POR AUDIENCIA Y COMUNIDAD
export class DemoDataManager {
  
  // ✅ USUARIOS DEMO POR AUDIENCIA
  static generarUsuarios(audiencia: AudienciaDemo, comunidadId: string): any[] {
    const baseUsuarios = this.getUsuariosBase(comunidadId)
    
    switch (audiencia) {
      case 'administracion':
        return this.filtrarParaAdministracion(baseUsuarios) as any
      case 'empresa':
        return this.adaptarParaEmpresas(baseUsuarios) as any
      case 'sindicato':
        return this.filtrarParaSindicatos(baseUsuarios) as any
      case 'stakeholder':
        return this.destacarLiderazgo(baseUsuarios) as any
      default:
        return baseUsuarios.slice(0, 12) as any
    }
  }
  
  // ✅ GRUPOS DEMO POR AUDIENCIA  
  static generarGrupos(audiencia: AudienciaDemo, comunidadId: string): any[] {
    const baseGrupos = this.getGruposBase(comunidadId)
    
    switch (audiencia) {
      case 'administracion':
        return this.destacarGruposFuncionarios(baseGrupos)
      case 'empresa':
        return this.destacarGruposEmpresariales(baseGrupos)
      case 'sindicato':
        return this.destacarGruposSindicales(baseGrupos)
      case 'stakeholder':
        return this.destacarGruposEstrategicos(baseGrupos)
      default:
        return baseGrupos.slice(0, 8)
    }
  }
  
  // ✅ POSTS DEMO CON ENGAGEMENT REALISTA
  static generarPosts(audiencia: AudienciaDemo, usuarios: any[]): any[] {
    const plantillasPosts = this.getPlantillasPosts(audiencia) as any[]
    
    return plantillasPosts.map((plantilla: any, index: number) => ({
      id: `post_demo_${index + 1}`,
      autorId: usuarios[index % usuarios.length].id!,
      autor: {
        nombre: usuarios[index % usuarios.length].nombre || 'Usuario',
        avatar: usuarios[index % usuarios.length].avatar,
        verificado: usuarios[index % usuarios.length].verificado || false
      },
      contenido: plantilla.contenido,
      tipo: 'publicacion' as const,
      fechaCreacion: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      fechaActualizacion: new Date(),
      privacidad: 'publico' as const,
      estadisticas: {
        visualizaciones: Math.floor(Math.random() * 500) + 50,
        reacciones: {
          like: Math.floor(Math.random() * 50) + 5,
          love: Math.floor(Math.random() * 20) + 2,
          celebrar: Math.floor(Math.random() * 15) + 1
        },
        comentarios: Math.floor(Math.random() * 15) + 2,
        compartidos: Math.floor(Math.random() * 10) + 1
      },
      etiquetas: plantilla.etiquetas,
      multimedia: plantilla.multimedia ? [{
        id: `media_${index}`,
        url: plantilla.multimedia,
        tipo: 'imagen' as const,
        descripcion: plantilla.contenido.substring(0, 100)
      }] : undefined
    }))
  }
  
  // ✅ EVENTOS DEMO RELEVANTES
  static generarEventos(audiencia: AudienciaDemo, comunidadId: string): any[] {
    const plantillasEventos = this.getPlantillasEventos(audiencia, comunidadId) as any[]
    
    return plantillasEventos.map((plantilla: any, index: number) => {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() + Math.floor(Math.random() * 30))
      
      const fechaFin = new Date(fechaInicio)
      fechaFin.setHours(fechaInicio.getHours() + plantilla.duracionHoras)
      
      return {
        id: `evento_demo_${index + 1}`,
        autorId: 'sistema',
        autor: { nombre: plantilla.organizador, verificado: true },
        contenido: plantilla.descripcion,
        tipo: 'evento' as const,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        privacidad: 'publico' as const,
        eventoData: {
          titulo: plantilla.titulo,
          descripcion: plantilla.descripcion,
          fechaInicio,
          fechaFin,
          ubicacion: plantilla.ubicacion,
          modalidad: plantilla.modalidad,
          organizador: plantilla.organizador,
          categoria: plantilla.categoria,
          capacidadMaxima: plantilla.capacidad,
          requiereInscripcion: plantilla.requiereInscripcion,
          esGratuito: plantilla.esGratuito,
          precio: plantilla.precio,
          etiquetas: plantilla.etiquetas
        },
        estadisticas: {
          visualizaciones: Math.floor(Math.random() * 200) + 30,
          reacciones: { like: Math.floor(Math.random() * 25) + 3 },
          comentarios: Math.floor(Math.random() * 8) + 1,
          compartidos: Math.floor(Math.random() * 5) + 1
        }
      }
    })
  }
  
  // ✅ DATOS BASE POR COMUNIDAD
  private static getUsuariosBase(comunidadId: string): any[] {
    const usuarios: Record<string, any[]> = {
      catalunya: [
        {
          id: 'cat_user_1',
          nombre: 'Maria',
          apellidos: 'García Puig',
          email: 'maria.garcia@gencat.cat',
          tipo: 'administracion',
          comunidadId: 'catalunya',
          verificado: true,
          activo: true,
          fechaRegistro: new Date('2021-03-15'),
          perfil: {
            biografia: 'Tècnica Superior de la Generalitat de Catalunya. Especialista en administració electrònica i atenció ciutadana.',
            ubicacion: 'Barcelona',
            cargo: 'Tècnica Superior - Departament de la Presidència',
            configuracionPrivacidad: {
              perfilPublico: true,
              mostrarEmail: false,
              mostrarUbicacion: true,
              mostrarOrganizacion: true,
              permitirMensajes: true,
              permitirInvitacionesGrupos: true
            },
            porcentajeCompletado: 90
          },
          estadisticas: {
            gruposCreados: 2,
            gruposUnido: 8,
            postsCreados: 45,
            comentarios: 123,
            conexiones: 67,
            puntuacionReputacion: 856
          }
        },
        {
          id: 'cat_user_2', 
          nombre: 'Jordi',
          apellidos: 'Solé Martínez',
          email: 'jordi.sole@ajbcn.cat',
          tipo: 'administracion',
          comunidadId: 'catalunya',
          verificado: true,
          activo: true,
          fechaRegistro: new Date('2020-09-08'),
          perfil: {
            biografia: 'Funcionari de l\'Ajuntament de Barcelona. Coordinador de projectes de ciutat intel·ligent i participació ciutadana.',
            ubicacion: 'Barcelona',
            cargo: 'Coordinador de Projectes - Ajuntament de Barcelona',
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
          estadisticas: {
            gruposCreados: 4,
            gruposUnido: 12,
            postsCreados: 78,
            comentarios: 234,
            conexiones: 145,
            puntuacionReputacion: 1234
          }
        }
      ],
      madrid: [
        {
          id: 'mad_user_1',
          nombre: 'Ana',
          apellidos: 'Rodríguez López',
          email: 'ana.rodriguez@madrid.org',
          tipo: 'administracion',
          comunidadId: 'madrid',
          verificado: true,
          activo: true,
          fechaRegistro: new Date('2021-01-20'),
          perfil: {
            biografia: 'Funcionaria de la Comunidad de Madrid. Especializada en gestión de recursos humanos y modernización administrativa.',
            ubicacion: 'Madrid',
            cargo: 'Técnica Superior - Consejería de Hacienda',
            configuracionPrivacidad: {
              perfilPublico: true,
              mostrarEmail: false,
              mostrarUbicacion: true, 
              mostrarOrganizacion: true,
              permitirMensajes: true,
              permitirInvitacionesGrupos: true
            },
            porcentajeCompletado: 92
          }
        }
      ]
    }
    
    return (usuarios[comunidadId] || usuarios.catalunya) as any
  }
  
  private static getGruposBase(comunidadId: string): any[] {
    const grupos: Record<string, any[]> = {
      catalunya: [
        {
          id: 'cat_grupo_1',
          nombre: 'Funcionaris Generalitat Catalunya',
          descripcion: 'Grup oficial per a funcionaris i empleats públics de la Generalitat de Catalunya. Compartim recursos, experiències i resolvem dubtes professionals.',
          categoria: 'profesional',
          tipo: 'publico',
          comunidadId: 'catalunya',
          estadisticas: {
            totalMiembros: 2347,
            miembrosActivos: 1891,
            postsEstesMes: 189,
            crecimientoMensual: 67
          },
          etiquetas: ['generalitat', 'funcionaris', 'catalunya']
        },
        {
          id: 'cat_grupo_2', 
          nombre: 'Innovació en l\'Administració Pública',
          descripcion: 'Espai de col·laboració per a professionals que treballen en la modernització i digitalització de l\'administració pública catalana.',
          categoria: 'profesional',
          tipo: 'publico',
          comunidadId: 'catalunya',
          estadisticas: {
            totalMiembros: 856,
            miembrosActivos: 634,
            postsEstesMes: 78,
            crecimientoMensual: 23
          },
          etiquetas: ['innovacio', 'digitalitzacio', 'modernitzacio']
        }
      ]
    }
    
    return (grupos[comunidadId] || grupos.catalunya).map(grupo => ({
      ...grupo,
      miembros: [],
      administradores: ['sistema'],
      moderadores: [],
      fechaCreacion: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      creadorId: 'sistema',
      configuracion: {
        requiereAprobacion: false,
        permitirInvitaciones: true,
        moderacionPosts: false,
        limiteMiembros: 5000
      }
    })) as Grupo[]
  }
  
  private static getPlantillasPosts(audiencia: AudienciaDemo) {
    const plantillas = {
      administracion: [
        {
          contenido: '🏛️ Comparteixo la meva experiència amb la implementació del nou sistema de gestió documental a la nostra unitat. Hem aconseguit reduir un 40% el temps de tramitació. Quines eines esteu utilitzant vosaltres?',
          etiquetas: ['administracio', 'digitalizacio', 'eficiencia'],
          multimedia: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop'
        },
        {
          contenido: '📋 Interessant jornada sobre transparència i govern obert organitzada pel EAPC. Els ponents van destacar la importància de la participació ciutadana en els processos de presa de decisions. #TransparenciaPublica',
          etiquetas: ['transparencia', 'participacio', 'formacio']
        },
        {
          contenido: '💡 Proposta: crear un grup de treball interdepartamental per a l\'harmonització de procediments administratius. Qui s\'hi apunta? Podríem començar amb una reunió virtual la setmana vinent.',
          etiquetas: ['colaboracio', 'procediments', 'millora']
        }
      ],
      empresa: [
        {
          contenido: '🏢 La nostra empresa ha col·laborat exitosament amb l\'Ajuntament en el projecte de ciutat intel·ligent. Un exemple perfecte de col·laboració publico-privada que beneficia la ciutadania. Estem orgullosos del resultat!',
          etiquetas: ['colaboracion', 'smart-city', 'publico-privado'],
          multimedia: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop'
        },
        {
          contenido: '💼 Busquem professional amb experiència en administració pública per unir-se al nostre equip de consultoria especialitzada en transformació digital del sector públic.',
          etiquetas: ['feina', 'consultoria', 'transformacio-digital']
        }
      ]
    }
    
    return plantillas[audiencia as keyof typeof plantillas] || plantillas.administracion
  }
  
  private static getPlantillasEventos(audiencia: AudienciaDemo, comunidadId: string) {
    return [
      {
        titulo: 'Jornada de Transformació Digital a l\'Administració',
        descripcion: 'Jornada formativa sobre les últimes tendències en digitalització dels serveis públics, amb casos pràctics i bones pràctiques.',
        ubicacion: 'Escola d\'Administració Pública de Catalunya - Barcelona',
        modalidad: 'presencial' as const,
        organizador: 'EAPC - Generalitat de Catalunya',
        categoria: 'formacion' as const,
        capacidad: 150,
        requiereInscripcion: true,
        esGratuito: true,
        duracionHoras: 6,
        etiquetas: ['formacio', 'digitalizacio', 'administracio']
      },
      {
        titulo: 'Networking Professionals del Sector Públic',
        descripcion: 'Trobada informal per connectar amb altres professionals del sector públic, compartir experiències i crear sinèrgies.',
        ubicacion: 'Centre de Congressos de Catalunya - Girona',
        modalidad: 'presencial' as const,
        organizador: 'La Pública Catalunya',
        categoria: 'networking' as const,
        capacidad: 80,
        requiereInscripcion: true,
        esGratuito: false,
        precio: 25,
        duracionHoras: 3,
        etiquetas: ['networking', 'professionals', 'connexions']
      }
    ]
  }
  
  // ✅ FILTROS Y ADAPTACIONES POR AUDIENCIA
  private static filtrarParaAdministracion(usuarios: Usuario[]): Usuario[] {
    return usuarios.filter(u => 
      u.tipo === 'administracion' || u.tipo === 'admin-web'
    ).slice(0, 15)
  }
  
  private static adaptarParaEmpresas(usuarios: Usuario[]): Usuario[] {
    // Mostrar mix de funcionarios y empresarios para mostrar networking
    return usuarios.slice(0, 10).map(u => ({
      ...u,
      perfil: {
        ...u.perfil,
        biografia: u.perfil?.biografia?.replace('funcionari', 'professional') || ''
      }
    }))
  }
  
  private static filtrarParaSindicatos(usuarios: Usuario[]): Usuario[] {
    return usuarios.filter(u => u.tipo !== 'empresa').slice(0, 12)
  }
  
  private static destacarLiderazgo(usuarios: Usuario[]): Usuario[] {
    return usuarios.map(u => ({
      ...u,
      estadisticas: {
        ...u.estadisticas,
        puntuacionReputacion: (u.estadisticas?.puntuacionReputacion || 0) * 1.5,
        gruposCreados: (u.estadisticas?.gruposCreados || 0) + 2
      }
    }))
  }
  
  private static destacarGruposFuncionarios(grupos: Grupo[]): Grupo[] {
    return grupos.filter(g => 
      g.etiquetas?.includes('funcionaris') || 
      g.etiquetas?.includes('administracio')
    )
  }
  
  private static destacarGruposEmpresariales(grupos: Grupo[]): Grupo[] {
    return grupos.map(g => ({
      ...g,
      descripcion: g.descripcion + ' Oportunitats de col·laboració publico-privada.'
    }))
  }
  
  private static destacarGruposSindicales(grupos: Grupo[]): Grupo[] {
    return grupos.filter(g => !g.etiquetas?.includes('empresa'))
  }
  
  private static destacarGruposEstrategicos(grupos: Grupo[]): Grupo[] {
    return grupos.map(g => ({
      ...g,
      estadisticas: {
        ...g.estadisticas!,
        totalMiembros: g.estadisticas!.totalMiembros * 1.3,
        miembrosActivos: g.estadisticas!.miembrosActivos * 1.2
      }
    }))
  }
}

// ✅ HOOK PARA USAR DATOS DEMO
export function useDemoData() {
  const [datosDemo, setDatosDemo] = useState<DatosDemo | null>(null)
  const [cargando, setCargando] = useState(true)
  
  const cargarDatos = useCallback(async (
    audiencia: AudienciaDemo, 
    comunidadId: string
  ) => {
    setCargando(true)
    
    // Simular carga asíncrona
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const usuarios = DemoDataManager.generarUsuarios(audiencia, comunidadId) as any[]
    const grupos = DemoDataManager.generarGrupos(audiencia, comunidadId) as any[]
    const posts = DemoDataManager.generarPosts(audiencia, usuarios) as any[]
    const eventos = DemoDataManager.generarEventos(audiencia, comunidadId) as any[]
    
    const estadisticasGlobales = {
      totalUsuarios: usuarios.length * 100, // Simular más usuarios
      usuariosActivos: Math.floor(usuarios.length * 75),
      gruposActivos: grupos.length,
      postsEsteMes: posts.length * 15,
      eventosProximos: eventos.length,
      engagement: {
        likesPromedio: 12,
        comentariosPromedio: 4,
        compartidosPromedio: 2
      },
      crecimiento: {
        usuariosNuevos: Math.floor(usuarios.length * 0.15),
        gruposNuevos: Math.floor(grupos.length * 0.25),
        tendencia: 'subiendo' as const
      }
    }
    
    setDatosDemo({
      usuarios,
      grupos,
      posts,
      eventos,
      ofertas: [], // Añadir ofertas vacías por ahora
      estadisticasGlobales
    })
    
    setCargando(false)
  }, [])
  
  return {
    datosDemo,
    cargando,
    cargarDatos
  }
}

// ✅ PROVIDER COMPONENT
interface DemoDataProviderProps {
  children: ReactNode
  audiencia?: AudienciaDemo
  comunidadId?: string
}

export function DemoDataProvider({ 
  children, 
  audiencia = 'administracion',
  comunidadId = 'catalunya' 
}: DemoDataProviderProps) {
  const { datosDemo, cargando, cargarDatos } = useDemoData()
  
  useEffect(() => {
    cargarDatos(audiencia, comunidadId)
  }, [audiencia, comunidadId, cargarDatos])
  
  if (cargando || !datosDemo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-medium">Preparant la demo...</p>
          <p className="text-sm text-gray-500">Carregant dades personalitzades per {audiencia}</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}