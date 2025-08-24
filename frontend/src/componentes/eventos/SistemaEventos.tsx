'use client'

import React, { useState } from 'react'
import { Plus, Calendar, List, Filter, Clock } from 'lucide-react'
import { Evento, FormularioEventoData } from '../../../tipos/eventos'
import { useEventos, useEventosFiltros, useEventosData } from '../../contextos/EventosContext'
import { useComunidad } from '../../../hooks/useComunidad'
import { FormularioEvento, CalendarioEventos, DetalleEvento } from './index'

// ✅ COMPONENTE PRINCIPAL SIMPLIFICADO
// De 1,545 líneas → ~200 líneas usando componentes separados

interface PropiedadesSistemaEventos {
  className?: string
}

export function SistemaEventos({ className = '' }: PropiedadesSistemaEventos) {
  const { configuracion } = useComunidad()
  
  // ✅ TÉCNICA: Usar hooks especializados
  const { filtros, configuracionCalendario, setConfiguracionCalendario } = useEventosFiltros()
  const { 
    eventos, 
    cargando,
    comentarios,
    crearEvento,
    gestionarAsistencia,
    comentarEvento,
    obtenerAsistencia,
    obtenerComentarios
  } = useEventosData()
  
  // ✅ ESTADO LOCAL MÍNIMO - Solo UI state
  const [vistaActual, setVistaActual] = useState<'calendario' | 'lista'>('calendario')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [eventoDetalle, setEventoDetalle] = useState<Evento | null>(null)
  const [eventoEditando, setEventoEditando] = useState<Evento | undefined>()

  // ✅ HANDLERS SIMPLIFICADOS
  const manejarCrearEvento = async (datos: FormularioEventoData) => {
    await crearEvento(datos)
    setFormularioAbierto(false)
  }

  const manejarSeleccionarEvento = (evento: Evento) => {
    setEventoDetalle(evento)
  }

  const manejarGestionarAsistencia = async (accion: 'asistir' | 'no-asistir' | 'quizas') => {
    if (eventoDetalle) {
      await gestionarAsistencia(eventoDetalle.id, accion)
    }
  }

  const manejarComentarEvento = async (comentario: string) => {
    if (eventoDetalle) {
      await comentarEvento(eventoDetalle.id, comentario)
    }
  }

  // ✅ TÉCNICA: Early return para loading state
  if (cargando) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema d'Esdeveniments
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona i participa en esdeveniments de la comunitat
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Selector de vista */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVistaActual('calendario')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActual === 'calendario'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: vistaActual === 'calendario' ? configuracion.tema.colorPrimario : 'transparent'
              }}
            >
              <Calendar size={16} className="mr-2" />
              Calendari
            </button>
            <button
              onClick={() => setVistaActual('lista')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActual === 'lista'
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: vistaActual === 'lista' ? configuracion.tema.colorPrimario : 'transparent'
              }}
            >
              <List size={16} className="mr-2" />
              Llista
            </button>
          </div>
          
          {/* Botón crear evento */}
          <button
            onClick={() => setFormularioAbierto(true)}
            className="flex items-center px-4 py-2 text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: configuracion.tema.colorPrimario }}
          >
            <Plus size={16} className="mr-2" />
            Nou Esdeveniment
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      {vistaActual === 'calendario' ? (
        <CalendarioEventos
          eventos={eventos}
          configuracion={configuracionCalendario}
          onCambiarConfiguracion={setConfiguracionCalendario}
          onSeleccionarEvento={manejarSeleccionarEvento}
          cargando={cargando}
        />
      ) : (
        <ListaEventos
          eventos={eventos}
          onSeleccionarEvento={manejarSeleccionarEvento}
          cargando={cargando}
        />
      )}

      {/* Modales */}
      <FormularioEvento
        abierto={formularioAbierto}
        onCerrar={() => {
          setFormularioAbierto(false)
          setEventoEditando(undefined)
        }}
        onGuardar={manejarCrearEvento}
        evento={eventoEditando}
        esEdicion={!!eventoEditando}
        cargando={cargando}
      />

      {eventoDetalle && (
        <DetalleEvento
          evento={eventoDetalle}
          abierto={!!eventoDetalle}
          onCerrar={() => setEventoDetalle(null)}
          estaAsistiendo={obtenerAsistencia(eventoDetalle.id) === 'asistir'}
          onGestionarAsistencia={manejarGestionarAsistencia}
          onComentarEvento={manejarComentarEvento}
          comentarios={obtenerComentarios(eventoDetalle.id)}
          cargando={cargando}
        />
      )}
    </div>
  )
}

// ✅ COMPONENTE LISTA SIMPLE (para completar la funcionalidad)
interface PropiedadesListaEventos {
  eventos: Evento[]
  onSeleccionarEvento: (evento: Evento) => void
  cargando?: boolean
}

function ListaEventos({ eventos, onSeleccionarEvento, cargando }: PropiedadesListaEventos) {
  const { configuracion } = useComunidad()

  if (cargando) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hi ha esdeveniments</h3>
        <p className="text-gray-500">Crea el primer esdeveniment per començar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
        <div
          key={evento.id}
          className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSeleccionarEvento(evento)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {evento.titulo}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {evento.descripcion}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {evento.fechaInicio.toLocaleDateString('es')}
                </span>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {evento.fechaInicio.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {evento.ubicacion && (
                  <span className="flex items-center">
                    📍 {evento.ubicacion}
                  </span>
                )}
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${configuracion.tema.colorPrimario}15`,
                    color: configuracion.tema.colorPrimario
                  }}
                >
                  {evento.categoria}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {evento.asistentes} assistents
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}