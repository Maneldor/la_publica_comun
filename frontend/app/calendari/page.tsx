'use client'

import LayoutGeneral from '../../src/componentes/comunes/LayoutGeneral'
import SistemaEventos from '../../src/componentes/comunes/especificos-comunidad/SistemaEventos'
import { useState } from 'react'

// Datos mock para el sistema de eventos
const usuario = {
  id: 'user-1',
  nombre: 'Manel',
  apellidos: 'Amador',
  email: 'manel@lapublica.cat',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  nick: '@manel_amador',
  tipo: 'miembro' as const,
  comunidadId: 'catalunya',
  verificado: true,
  activo: true,
  fechaRegistro: new Date('2024-01-01'),
  ultimoAcceso: new Date(),
  perfil: {
    biografia: '',
    configuracionPrivacidad: {
      perfilPublico: true,
      mostrarEmail: false,
      mostrarUbicacion: false,
      mostrarOrganizacion: true,
      permitirMensajes: true,
      permitirInvitacionesGrupos: true
    },
    porcentajeCompletado: 75
  },
  configuracion: {
    idioma: 'ca',
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
    },
    tema: 'claro' as const
  },
  estadisticas: {
    gruposCreados: 2,
    gruposUnido: 5,
    postsCreados: 12,
    comentarios: 45,
    conexiones: 23,
    puntuacionReputacion: 150
  }
}

const eventosMock = [
  {
    id: '1',
    titulo: 'Jornada de Formación en Administración Digital',
    descripcion: 'Sesión formativa sobre las nuevas herramientas digitales para mejorar la eficiencia administrativa en el sector público.',
    categoria: 'formacion' as const,
    tipo: 'presencial' as const,
    modalidad: 'publico' as const,
    fechaInicio: new Date('2024-09-15T10:00:00'),
    fechaFin: new Date('2024-09-15T17:00:00'),
    ubicacion: 'Palau Sant Jordi, Barcelona',
    capacidadMaxima: 200,
    asistentes: 156,
    fechaCreacion: new Date('2024-08-20T09:00:00'),
    creadorId: 'user-admin',
    comunidadId: 'catalunya',
    estado: 'programado' as const,
    esGratuito: true,
    requiereAprobacion: false,
    organizador: 'Generalitat de Catalunya',
    activo: true,
    etiquetas: ['formacion', 'digital', 'administracio'],
    contactoEmail: 'formacio@gencat.cat',
    certificacion: true,
    puntuacionFormacion: 6
  },
  {
    id: '2',
    titulo: 'Networking de Funcionarios Públicos',
    descripcion: 'Encuentro informal para facilitar el networking entre funcionarios de diferentes departamentos y administraciones.',
    categoria: 'networking' as const,
    tipo: 'presencial' as const,
    modalidad: 'publico' as const,
    fechaInicio: new Date('2024-09-18T19:00:00'),
    fechaFin: new Date('2024-09-18T22:00:00'),
    ubicacion: 'Hotel Majestic, Barcelona',
    capacidadMaxima: 100,
    asistentes: 67,
    fechaCreacion: new Date('2024-08-25T14:30:00'),
    creadorId: 'user-2',
    comunidadId: 'catalunya',
    estado: 'programado' as const,
    esGratuito: false,
    precio: 25,
    requiereAprobacion: false,
    organizador: 'Associació de Funcionaris de Catalunya',
    activo: true,
    etiquetas: ['networking', 'social', 'funcionaris']
  },
  {
    id: '3',
    titulo: 'Webinar: Innovación en el Servicio Público',
    descripcion: 'Conferencia online sobre las últimas tendencias en innovación aplicadas al sector público, con casos de éxito reales.',
    categoria: 'conferencia' as const,
    tipo: 'online' as const,
    modalidad: 'publico' as const,
    fechaInicio: new Date('2024-09-22T16:00:00'),
    fechaFin: new Date('2024-09-22T18:00:00'),
    ubicacionVirtual: 'https://zoom.us/j/123456789',
    capacidadMaxima: 500,
    asistentes: 234,
    fechaCreacion: new Date('2024-08-30T11:15:00'),
    creadorId: 'user-3',
    comunidadId: 'catalunya',
    estado: 'programado' as const,
    esGratuito: true,
    requiereAprobacion: false,
    organizador: 'Centre d\'Innovació Pública',
    activo: true,
    etiquetas: ['innovacio', 'online', 'conferencia']
  },
  {
    id: '4',
    titulo: 'Taller de Excel Avanzado para Administraciones',
    descripcion: 'Taller práctico de Excel avanzado orientado específicamente a tareas administrativas del sector público.',
    categoria: 'taller' as const,
    tipo: 'hibrido' as const,
    modalidad: 'publico' as const,
    fechaInicio: new Date('2024-09-25T09:00:00'),
    fechaFin: new Date('2024-09-25T13:00:00'),
    ubicacion: 'Escola d\'Administració Pública, Barcelona',
    ubicacionVirtual: 'https://teams.microsoft.com/l/meetup-join/123',
    capacidadMaxima: 50,
    asistentes: 32,
    fechaCreacion: new Date('2024-09-01T16:20:00'),
    creadorId: 'admin-1',
    comunidadId: 'catalunya',
    estado: 'programado' as const,
    esGratuito: true,
    requiereAprobacion: true,
    organizador: 'Escola d\'Administració Pública de Catalunya',
    activo: true,
    etiquetas: ['excel', 'formacio', 'practica'],
    certificacion: true,
    puntuacionFormacion: 4
  }
]

export default function CalendariPage() {
  const [eventosAsistiendo, setEventosAsistiendo] = useState<string[]>(['2', '4'])

  const onCrearEvento = async (evento: any) => {
    console.log('Creant nou esdeveniment:', evento)
    // Aquí iria la lógica para crear el evento en el backend
  }

  const onActualizarEvento = async (id: string, datos: any) => {
    console.log('Actualitzant esdeveniment:', id, datos)
    // Aquí iria la lógica para actualizar el evento en el backend
  }

  const onEliminarEvento = async (id: string) => {
    console.log('Eliminant esdeveniment:', id)
    // Aquí iria la lógica para eliminar el evento en el backend
  }

  const onGestionarAsistencia = async (eventoId: string, accion: 'asistir' | 'no-asistir' | 'quizas') => {
    console.log('Gestionant assistència:', eventoId, accion)
    
    setEventosAsistiendo(prev => {
      if (accion === 'asistir') {
        return [...prev.filter(id => id !== eventoId), eventoId]
      } else {
        return prev.filter(id => id !== eventoId)
      }
    })
    
    // Aquí iria la lógica para gestionar la asistencia en el backend
  }

  const onComentarEvento = async (eventoId: string, comentario: string) => {
    console.log('Afegint comentari a esdeveniment:', eventoId, comentario)
    // Aquí iria la lógica para añadir el comentario en el backend
  }

  return (
    <LayoutGeneral paginaActual="calendari" showPadding={false}>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <SistemaEventos
            usuario={usuario}
            eventos={eventosMock}
            eventosAsistiendo={eventosAsistiendo}
            onCrearEvento={onCrearEvento}
            onActualizarEvento={onActualizarEvento}
            onEliminarEvento={onEliminarEvento}
            onGestionarAsistencia={onGestionarAsistencia}
            onComentarEvento={onComentarEvento}
          />
        </div>
      </div>
    </LayoutGeneral>
  )
}