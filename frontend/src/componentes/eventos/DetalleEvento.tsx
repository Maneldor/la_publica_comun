'use client'

import React, { useState, useCallback } from 'react'
import { 
  X, Calendar, Clock, MapPin, Users, Globe, Lock, 
  MessageCircle, Send, Share, Bookmark, BookMarked, 
  Edit, Trash2, ExternalLink, QrCode, DollarSign 
} from 'lucide-react'
import { PropiedadesDetalleEvento, AccionAsistencia, ESTADOS_EVENTO } from '../../../tipos/eventos'
import { useComunidad } from '../../../hooks/useComunidad'

// ✅ COMPONENTE SEPARADO PARA MODAL DE DETALLES
export function DetalleEvento({
  evento,
  abierto,
  onCerrar,
  estaAsistiendo,
  onGestionarAsistencia,
  onComentarEvento,
  comentarios,
  cargando = false
}: PropiedadesDetalleEvento) {
  const { configuracion } = useComunidad()
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviandoComentario, setEnviandoComentario] = useState(false)
  const [accionAsistencia, setAccionAsistencia] = useState<AccionAsistencia | null>(
    estaAsistiendo ? 'asistir' : null
  )

  // ✅ TÉCNICA: Gestión de estados de asistencia
  const manejarAsistencia = useCallback(async (accion: AccionAsistencia) => {
    try {
      setAccionAsistencia(accion)
      await onGestionarAsistencia(accion)
    } catch (error) {
      setAccionAsistencia(estaAsistiendo ? 'asistir' : null)
      console.error('Error al gestionar asistencia:', error)
    }
  }, [onGestionarAsistencia, estaAsistiendo])

  const manejarComentario = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoComentario.trim() || enviandoComentario) return

    try {
      setEnviandoComentario(true)
      await onComentarEvento(nuevoComentario.trim())
      setNuevoComentario('')
    } catch (error) {
      console.error('Error al comentar:', error)
    } finally {
      setEnviandoComentario(false)
    }
  }, [nuevoComentario, onComentarEvento, enviandoComentario])

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const obtenerColorEstado = () => {
    const estado = ESTADOS_EVENTO.find(e => e.value === evento.estado)
    return estado?.color || '#6B7280'
  }

  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Panel principal */}
        <div className="flex-1 overflow-y-auto">
          {/* Header con imagen */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
            {evento.imagenPortada && (
              <img
                src={evento.imagenPortada}
                alt={evento.titulo}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
            
            {/* Botón cerrar */}
            <button
              onClick={onCerrar}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
              disabled={cargando}
            >
              <X size={20} className="text-white" />
            </button>
            
            {/* Estado del evento */}
            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 rounded-full text-white text-sm font-medium backdrop-blur-sm"
                style={{ backgroundColor: obtenerColorEstado() }}
              >
                {evento.estado}
              </span>
            </div>
            
            {/* Título sobre imagen */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {evento.titulo}
              </h1>
              <p className="text-white/90 text-lg">
                {evento.organizador}
              </p>
            </div>
          </div>
          
          {/* Contenido */}
          <div className="p-6">
            {/* Info básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {/* Fecha y hora */}
                <div className="flex items-start space-x-3">
                  <Calendar size={20} style={{ color: configuracion.tema.colorPrimario }} className="mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatearFecha(evento.fechaInicio)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock size={14} className="mr-1" />
                      {formatearHora(evento.fechaInicio)}
                      {evento.fechaFin && ` - ${formatearHora(evento.fechaFin)}`}
                    </div>
                  </div>
                </div>
                
                {/* Ubicación */}
                <div className="flex items-start space-x-3">
                  <MapPin size={20} style={{ color: configuracion.tema.colorPrimario }} className="mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {evento.tipo === 'online' ? 'Esdeveniment online' : 
                       evento.tipo === 'hibrido' ? 'Esdeveniment híbrid' : 
                       evento.ubicacion || 'Ubicació per confirmar'}
                    </div>
                    {evento.urlReunion && (
                      <a
                        href={evento.urlReunion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center mt-1"
                      >
                        <ExternalLink size={12} className="mr-1" />
                        Enllaç de la reunió
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Capacidad */}
                <div className="flex items-center space-x-3">
                  <Users size={20} style={{ color: configuracion.tema.colorPrimario }} />
                  <div className="font-medium text-gray-900">
                    {evento.asistentes} assistents
                    {evento.capacidadMaxima && ` / ${evento.capacidadMaxima} màx`}
                  </div>
                </div>
                
                {/* Precio */}
                {!evento.esGratuito && evento.precio && (
                  <div className="flex items-center space-x-3">
                    <DollarSign size={20} style={{ color: configuracion.tema.colorPrimario }} />
                    <div className="font-medium text-gray-900">
                      {evento.precio}€
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Modalidad */}
                <div className="flex items-center space-x-3">
                  {evento.modalidad === 'publico' ? (
                    <Globe size={20} style={{ color: configuracion.tema.colorPrimario }} />
                  ) : (
                    <Lock size={20} style={{ color: configuracion.tema.colorPrimario }} />
                  )}
                  <div className="font-medium text-gray-900">
                    Esdeveniment {evento.modalidad}
                  </div>
                </div>
                
                {/* Categoría */}
                <div className="flex flex-wrap gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${configuracion.tema.colorPrimario}15`,
                      color: configuracion.tema.colorPrimario
                    }}
                  >
                    {evento.categoria}
                  </span>
                  {evento.etiquetas.map((etiqueta, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {etiqueta}
                    </span>
                  ))}
                </div>
                
                {/* Botones de acción */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => manejarAsistencia('asistir')}
                      disabled={cargando || accionAsistencia === 'asistir'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        accionAsistencia === 'asistir'
                          ? 'text-white'
                          : 'border text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: accionAsistencia === 'asistir' ? configuracion.tema.colorPrimario : 'transparent',
                        borderColor: configuracion.tema.colorPrimario
                      }}
                    >
                      {accionAsistencia === 'asistir' ? 'Assistint' : 'Assistiré'}
                    </button>
                    
                    <button
                      onClick={() => manejarAsistencia('quizas')}
                      disabled={cargando}
                      className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                        accionAsistencia === 'quizas'
                          ? 'bg-yellow-500 text-white border-yellow-500'
                          : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      {accionAsistencia === 'quizas' ? 'Potser' : 'Potser'}
                    </button>
                    
                    {accionAsistencia && (
                      <button
                        onClick={() => manejarAsistencia('no-asistir')}
                        disabled={cargando}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel·lar
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share size={16} />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Bookmark size={16} />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripció</h3>
              <div className="prose max-w-none text-gray-700">
                {evento.descripcion.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel lateral de comentarios */}
        <div className="w-96 border-l bg-gray-50 flex flex-col">
          {/* Header comentarios */}
          <div className="p-6 border-b bg-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle size={20} className="mr-2" />
              Comentaris ({comentarios.length})
            </h3>
          </div>
          
          {/* Lista de comentarios */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {comentarios.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Sigues el primer en comentar</p>
              </div>
            ) : (
              comentarios.map((comentario) => (
                <div key={comentario.id} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start space-x-3">
                    <img
                      src={comentario.autor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comentario.autor?.nombre || 'Usuario')}`}
                      alt={comentario.autor?.nombre}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {comentario.autor?.nombre || 'Usuario'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {comentario.fechaCreacion.toLocaleDateString('es')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comentario.contenido}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Formulario comentario */}
          <div className="p-6 border-t bg-white">
            <form onSubmit={manejarComentario} className="space-y-3">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escriu un comentari..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={enviandoComentario}
              />
              <button
                type="submit"
                disabled={!nuevoComentario.trim() || enviandoComentario}
                className="w-full flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: configuracion.tema.colorPrimario }}
              >
                {enviandoComentario ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviant...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Comentar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}