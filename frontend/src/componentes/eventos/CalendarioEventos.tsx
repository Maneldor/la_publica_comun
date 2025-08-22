'use client'

import React, { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { PropiedadesCalendarioEventos, Evento, VistaCalendario } from '../../../tipos/eventos'
import { useCalendarioEventos, DiaCalendario } from '../../hooks/useCalendarioEventos'
import { useComunidad } from '../../../hooks/useComunidad'

// ✅ COMPONENTE SEPARADO Y OPTIMIZADO
export function CalendarioEventos({ 
  eventos, 
  configuracion, 
  onCambiarConfiguracion, 
  onSeleccionarEvento,
  cargando = false
}: PropiedadesCalendarioEventos) {
  const { configuracion: configComunidad } = useComunidad()
  
  // ✅ TÉCNICA: Usar hook personalizado para lógica compleja
  const {
    fechaSeleccionada,
    calendarioMes,
    calendarioSemana,
    calendarioDia,
    navegarMes,
    navegarSemana,
    navegarDia,
    irAHoy,
    formatearFecha
  } = useCalendarioEventos(eventos, configuracion)

  const cambiarVista = (vista: VistaCalendario) => {
    onCambiarConfiguracion({ vista })
  }

  const navegarCalendario = (direccion: 'anterior' | 'siguiente') => {
    switch (configuracion.vista) {
      case 'mes':
        navegarMes(direccion)
        break
      case 'semana':
        navegarSemana(direccion)
        break
      case 'dia':
        navegarDia(direccion)
        break
    }
  }

  // ✅ MEMOIZACIÓN: Solo renderizar celda si cambian sus eventos
  const renderizarDia = useMemo(() => (dia: DiaCalendario, index: number) => {
    return (
      <div
        key={index}
        className={`
          min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-all duration-200
          ${dia.esMesActual ? 'bg-white' : 'bg-gray-50'}
          ${dia.esHoy ? 'ring-2 ring-blue-500' : ''}
          ${dia.esPasado ? 'opacity-60' : ''}
          hover:bg-blue-50
        `}
        onClick={() => {
          onCambiarConfiguracion({ fechaInicial: dia.fecha })
          if (configuracion.vista !== 'dia') {
            cambiarVista('dia')
          }
        }}
      >
        {/* Número del día */}
        <div className={`
          text-sm font-medium mb-1
          ${dia.esHoy ? 'text-blue-600' : dia.esMesActual ? 'text-gray-900' : 'text-gray-400'}
        `}>
          {dia.fecha.getDate()}
        </div>
        
        {/* Eventos del día */}
        <div className="space-y-1">
          {dia.eventos.slice(0, 3).map((evento, eventoIndex) => (
            <div
              key={eventoIndex}
              className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
              style={{ 
                backgroundColor: `${configComunidad.tema.colorPrimario}15`,
                color: configComunidad.tema.colorPrimario
              }}
              onClick={(e) => {
                e.stopPropagation()
                onSeleccionarEvento(evento)
              }}
              title={evento.titulo}
            >
              {evento.titulo}
            </div>
          ))}
          
          {/* Indicador de más eventos */}
          {dia.eventos.length > 3 && (
            <div className="text-xs text-gray-500 font-medium">
              +{dia.eventos.length - 3} més
            </div>
          )}
        </div>
      </div>
    )
  }, [configComunidad.tema.colorPrimario, configuracion.vista, onCambiarConfiguracion, onSeleccionarEvento])

  // ✅ VISTA DE MES
  const renderizarVistaMs = () => (
    <div className="bg-white rounded-lg border">
      {/* Header con días de la semana */}
      <div className="grid grid-cols-7 border-b">
        {['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'].map((dia, index) => (
          <div key={index} className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {dia}
          </div>
        ))}
      </div>
      
      {/* Días del mes */}
      <div className="grid grid-cols-7">
        {calendarioMes.semanas.flatMap(semana => 
          semana.dias.map((dia, index) => renderizarDia(dia, index))
        )}
      </div>
    </div>
  )

  // ✅ VISTA DE SEMANA
  const renderizarVistaSemana = () => (
    <div className="bg-white rounded-lg border">
      {/* Header con días de la semana */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50">
          Hora
        </div>
        {calendarioSemana.dias.map((dia, index) => (
          <div key={index} className="p-4 text-center bg-gray-50">
            <div className="text-sm font-medium text-gray-900">
              {dia.fecha.toLocaleDateString('es', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-bold ${dia.esHoy ? 'text-blue-600' : 'text-gray-700'}`}>
              {dia.fecha.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      {/* Horas y eventos */}
      <div className="grid grid-cols-8 divide-x">
        {/* Columna de horas */}
        <div className="divide-y">
          {Array.from({ length: configuracion.horaFin - configuracion.horaInicio }, (_, i) => {
            const hora = configuracion.horaInicio + i
            return (
              <div key={hora} className="h-16 flex items-center justify-center text-sm text-gray-500 bg-gray-50">
                {hora.toString().padStart(2, '0')}:00
              </div>
            )
          })}
        </div>
        
        {/* Columnas de días */}
        {calendarioSemana.dias.map((dia, diaIndex) => (
          <div key={diaIndex} className="divide-y">
            {Array.from({ length: configuracion.horaFin - configuracion.horaInicio }, (_, i) => {
              const hora = configuracion.horaInicio + i
              const eventosEnHora = dia.eventos.filter(evento => {
                const horaEvento = new Date(evento.fechaInicio).getHours()
                return horaEvento === hora
              })
              
              return (
                <div key={hora} className="h-16 p-1 relative">
                  {eventosEnHora.map((evento, eventoIndex) => (
                    <div
                      key={eventoIndex}
                      className="absolute inset-1 text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate"
                      style={{ 
                        backgroundColor: `${configComunidad.tema.colorPrimario}20`,
                        color: configComunidad.tema.colorPrimario,
                        top: `${eventoIndex * 20}px`,
                        height: '18px'
                      }}
                      onClick={() => onSeleccionarEvento(evento)}
                      title={evento.titulo}
                    >
                      {evento.titulo}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  // ✅ VISTA DE DÍA
  const renderizarVistaDia = () => (
    <div className="bg-white rounded-lg border">
      {/* Header del día */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">
          {formatearFecha(calendarioDia.fecha, 'completo')}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {calendarioDia.totalEventos} esdeveniments
        </p>
      </div>
      
      {/* Timeline de eventos */}
      <div className="p-6">
        {calendarioDia.totalEventos === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hi ha esdeveniments aquest dia</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(calendarioDia.eventosPorHora)
              .sort(([horaA], [horaB]) => horaA.localeCompare(horaB))
              .map(([hora, eventosHora]) => (
                <div key={hora} className="flex">
                  <div className="w-20 flex-shrink-0">
                    <div className="text-sm font-medium text-gray-500">{hora}</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {eventosHora.map((evento, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ borderLeftColor: configComunidad.tema.colorPrimario }}
                        onClick={() => onSeleccionarEvento(evento)}
                      >
                        <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                        <p className="text-sm text-gray-600 mt-1">{evento.descripcion}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(evento.fechaInicio).toLocaleTimeString('es', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {evento.ubicacion && (
                            <span className="flex items-center">
                              📍 {evento.ubicacion}
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-full" style={{
                            backgroundColor: `${configComunidad.tema.colorPrimario}15`,
                            color: configComunidad.tema.colorPrimario
                          }}>
                            {evento.categoria}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )

  if (cargando) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(21)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header de navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Navegación */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navegarCalendario('anterior')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={cargando}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={irAHoy}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={cargando}
            >
              Avui
            </button>
            
            <button
              onClick={() => navegarCalendario('siguiente')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={cargando}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Título */}
          <h2 className="text-xl font-semibold text-gray-900">
            {configuracion.vista === 'mes' && calendarioMes.nombre}
            {configuracion.vista === 'semana' && `${formatearFecha(calendarioSemana.inicio, 'corto')} - ${formatearFecha(calendarioSemana.fin, 'corto')}`}
            {configuracion.vista === 'dia' && formatearFecha(calendarioDia.fecha, 'completo')}
          </h2>
        </div>
        
        {/* Selector de vista */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {(['mes', 'semana', 'dia'] as const).map((vista) => (
            <button
              key={vista}
              onClick={() => cambiarVista(vista)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                configuracion.vista === vista
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: configuracion.vista === vista ? configComunidad.tema.colorPrimario : 'transparent'
              }}
              disabled={cargando}
            >
              {vista.charAt(0).toUpperCase() + vista.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Vista del calendario */}
      {configuracion.vista === 'mes' && renderizarVistaMs()}
      {configuracion.vista === 'semana' && renderizarVistaSemana()}
      {configuracion.vista === 'dia' && renderizarVistaDia()}
    </div>
  )
}