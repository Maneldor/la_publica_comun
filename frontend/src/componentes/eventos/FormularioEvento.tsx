'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { X, Calendar, MapPin, Users, Clock, Globe, Lock, DollarSign } from 'lucide-react'
import { 
  PropiedadesFormularioEvento, 
  FormularioEventoData, 
  CATEGORIAS_EVENTO, 
  TIPOS_EVENTO,
  CategoriaEvento,
  TipoEvento,
  ModalidadEvento 
} from '../../../tipos/eventos'
import { useComunidad } from '../../../hooks/useComunidad'

// ✅ TÉCNICA AVANZADA: Validación tipada con errores específicos
interface ErroresValidacion {
  titulo?: string
  fechaInicio?: string
  horaInicio?: string
  ubicacion?: string
  capacidadMaxima?: string
  precio?: string
}

function validarFormulario(datos: FormularioEventoData): { valido: boolean; errores: ErroresValidacion } {
  const errores: ErroresValidacion = {}
  
  if (!datos.titulo.trim()) {
    errores.titulo = 'El títol és obligatori'
  } else if (datos.titulo.length < 5) {
    errores.titulo = 'El títol ha de tenir almenys 5 caràcters'
  } else if (datos.titulo.length > 100) {
    errores.titulo = 'El títol no pot superar els 100 caràcters'
  }
  
  if (!datos.fechaInicio) {
    errores.fechaInicio = 'La data d\'inici és obligatòria'
  } else {
    const fechaEvento = new Date(datos.fechaInicio)
    const ahora = new Date()
    if (fechaEvento < ahora) {
      errores.fechaInicio = 'La data ha de ser futura'
    }
  }
  
  if (!datos.horaInicio) {
    errores.horaInicio = 'L\'hora d\'inici és obligatòria'
  }
  
  if (datos.tipo === 'presencial' && !datos.ubicacion?.trim()) {
    errores.ubicacion = 'La ubicació és obligatòria per a esdeveniments presencials'
  }
  
  if (datos.capacidadMaxima && datos.capacidadMaxima < 1) {
    errores.capacidadMaxima = 'La capacitat ha de ser almenys 1'
  }
  
  if (!datos.esGratuito && (!datos.precio || datos.precio <= 0)) {
    errores.precio = 'El preu ha de ser major que 0 per a esdeveniments de pagament'
  }
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  }
}

export function FormularioEvento({ 
  abierto, 
  onCerrar, 
  onGuardar, 
  evento, 
  esEdicion = false,
  cargando = false
}: PropiedadesFormularioEvento) {
  const { configuracion } = useComunidad()
  
  // ✅ TÉCNICA: Formulario controlado con estado local
  const [formulario, setFormulario] = useState<FormularioEventoData>({
    titulo: '',
    descripcion: '',
    categoria: 'formacion',
    tipo: 'presencial',
    modalidad: 'publico',
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    ubicacion: '',
    capacidadMaxima: undefined,
    esGratuito: true,
    precio: undefined,
    requiereAprobacion: false,
    etiquetas: [],
    urlReunion: '',
    imagenPortada: ''
  })
  
  const [errores, setErrores] = useState<ErroresValidacion>({})
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  
  // ✅ TÉCNICA: Poblar formulario cuando se edita
  useEffect(() => {
    if (evento && esEdicion) {
      setFormulario({
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        categoria: evento.categoria,
        tipo: evento.tipo,
        modalidad: evento.modalidad,
        fechaInicio: evento.fechaInicio.toISOString().split('T')[0],
        horaInicio: evento.fechaInicio.toISOString().split('T')[1].substring(0, 5),
        fechaFin: evento.fechaFin?.toISOString().split('T')[0] || '',
        horaFin: evento.fechaFin?.toISOString().split('T')[1].substring(0, 5) || '',
        ubicacion: evento.ubicacion || '',
        capacidadMaxima: evento.capacidadMaxima,
        esGratuito: evento.esGratuito,
        precio: evento.precio,
        requiereAprobacion: evento.requiereAprobacion,
        etiquetas: evento.etiquetas,
        urlReunion: evento.urlReunion || '',
        imagenPortada: evento.imagenPortada || ''
      })
    }
  }, [evento, esEdicion])
  
  // ✅ TÉCNICA: Reset formulario al cerrar
  useEffect(() => {
    if (!abierto && !esEdicion) {
      setFormulario({
        titulo: '',
        descripcion: '',
        categoria: 'formacion',
        tipo: 'presencial',
        modalidad: 'publico',
        fechaInicio: '',
        horaInicio: '',
        fechaFin: '',
        horaFin: '',
        ubicacion: '',
        capacidadMaxima: undefined,
        esGratuito: true,
        precio: undefined,
        requiereAprobacion: false,
        etiquetas: [],
        urlReunion: '',
        imagenPortada: ''
      })
      setErrores({})
      setNuevaEtiqueta('')
    }
  }, [abierto, esEdicion])
  
  const actualizarCampo = useCallback(<K extends keyof FormularioEventoData>(
    campo: K, 
    valor: FormularioEventoData[K]
  ) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }))
    
    // ✅ TÉCNICA: Limpiar error específico cuando se corrige
    if (errores[campo as keyof ErroresValidacion]) {
      setErrores(prev => {
        const nuevosErrores = { ...prev }
        delete nuevosErrores[campo as keyof ErroresValidacion]
        return nuevosErrores
      })
    }
  }, [errores])
  
  const agregarEtiqueta = useCallback(() => {
    if (nuevaEtiqueta.trim() && !formulario.etiquetas.includes(nuevaEtiqueta.trim())) {
      actualizarCampo('etiquetas', [...formulario.etiquetas, nuevaEtiqueta.trim()])
      setNuevaEtiqueta('')
    }
  }, [nuevaEtiqueta, formulario.etiquetas, actualizarCampo])
  
  const eliminarEtiqueta = useCallback((etiqueta: string) => {
    actualizarCampo('etiquetas', formulario.etiquetas.filter(e => e !== etiqueta))
  }, [formulario.etiquetas, actualizarCampo])
  
  const manejarSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validacion = validarFormulario(formulario)
    
    if (!validacion.valido) {
      setErrores(validacion.errores)
      return
    }
    
    try {
      await onGuardar(formulario)
      onCerrar()
    } catch (error) {
      console.error('Error al guardar evento:', error)
    }
  }, [formulario, onGuardar, onCerrar])
  
  const manejarTeclaEtiqueta = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      agregarEtiqueta()
    }
  }, [agregarEtiqueta])
  
  if (!abierto) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold" style={{ color: configuracion.tema.colorPrimario }}>
            {esEdicion ? 'Editar Esdeveniment' : 'Crear Nou Esdeveniment'}
          </h2>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={cargando}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={manejarSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Títol *
            </label>
            <input
              type="text"
              value={formulario.titulo}
              onChange={(e) => actualizarCampo('titulo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                errores.titulo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Títol de l'esdeveniment"
              disabled={cargando}
            />
            {errores.titulo && (
              <p className="text-red-600 text-sm mt-1">{errores.titulo}</p>
            )}
          </div>
          
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripció
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripció de l'esdeveniment"
              disabled={cargando}
            />
          </div>
          
          {/* Categoría y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formulario.categoria}
                onChange={(e) => actualizarCampo('categoria', e.target.value as CategoriaEvento)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={cargando}
              >
                {CATEGORIAS_EVENTO.map(categoria => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.icono} {categoria.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipus *
              </label>
              <select
                value={formulario.tipo}
                onChange={(e) => actualizarCampo('tipo', e.target.value as TipoEvento)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={cargando}
              >
                {TIPOS_EVENTO.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.icono} {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Data d'inici *
              </label>
              <input
                type="date"
                value={formulario.fechaInicio}
                onChange={(e) => actualizarCampo('fechaInicio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  errores.fechaInicio ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={cargando}
              />
              {errores.fechaInicio && (
                <p className="text-red-600 text-sm mt-1">{errores.fechaInicio}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Hora d'inici *
              </label>
              <input
                type="time"
                value={formulario.horaInicio}
                onChange={(e) => actualizarCampo('horaInicio', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  errores.horaInicio ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={cargando}
              />
              {errores.horaInicio && (
                <p className="text-red-600 text-sm mt-1">{errores.horaInicio}</p>
              )}
            </div>
          </div>
          
          {/* Ubicación (solo si es presencial) */}
          {formulario.tipo !== 'online' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Ubicació {formulario.tipo === 'presencial' && '*'}
              </label>
              <input
                type="text"
                value={formulario.ubicacion}
                onChange={(e) => actualizarCampo('ubicacion', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  errores.ubicacion ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Adreça de l'esdeveniment"
                disabled={cargando}
              />
              {errores.ubicacion && (
                <p className="text-red-600 text-sm mt-1">{errores.ubicacion}</p>
              )}
            </div>
          )}
          
          {/* URL de reunión (solo si es online o híbrido) */}
          {formulario.tipo !== 'presencial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="inline mr-1" />
                URL de la reunió
              </label>
              <input
                type="url"
                value={formulario.urlReunion}
                onChange={(e) => actualizarCampo('urlReunion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://meet.google.com/..."
                disabled={cargando}
              />
            </div>
          )}
          
          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-1" />
              Capacitat màxima
            </label>
            <input
              type="number"
              value={formulario.capacidadMaxima || ''}
              onChange={(e) => actualizarCampo('capacidadMaxima', e.target.value ? parseInt(e.target.value) : undefined)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                errores.capacidadMaxima ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Deixar buit per capacitat il·limitada"
              min="1"
              disabled={cargando}
            />
            {errores.capacidadMaxima && (
              <p className="text-red-600 text-sm mt-1">{errores.capacidadMaxima}</p>
            )}
          </div>
          
          {/* Precio */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="esGratuito"
                checked={formulario.esGratuito}
                onChange={(e) => {
                  actualizarCampo('esGratuito', e.target.checked)
                  if (e.target.checked) {
                    actualizarCampo('precio', undefined)
                  }
                }}
                className="mr-2"
                disabled={cargando}
              />
              <label htmlFor="esGratuito" className="text-sm font-medium text-gray-700">
                Esdeveniment gratuït
              </label>
            </div>
            
            {!formulario.esGratuito && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Preu (€) *
                </label>
                <input
                  type="number"
                  value={formulario.precio || ''}
                  onChange={(e) => actualizarCampo('precio', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                    errores.precio ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  disabled={cargando}
                />
                {errores.precio && (
                  <p className="text-red-600 text-sm mt-1">{errores.precio}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Modalidad y Aprobación */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalitat
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="modalidad"
                    value="publico"
                    checked={formulario.modalidad === 'publico'}
                    onChange={(e) => actualizarCampo('modalidad', e.target.value as ModalidadEvento)}
                    className="mr-2"
                    disabled={cargando}
                  />
                  <Globe size={16} className="mr-1" />
                  Públic
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="modalidad"
                    value="privado"
                    checked={formulario.modalidad === 'privado'}
                    onChange={(e) => actualizarCampo('modalidad', e.target.value as ModalidadEvento)}
                    className="mr-2"
                    disabled={cargando}
                  />
                  <Lock size={16} className="mr-1" />
                  Privat
                </label>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiereAprobacion"
                checked={formulario.requiereAprobacion}
                onChange={(e) => actualizarCampo('requiereAprobacion', e.target.checked)}
                className="mr-2"
                disabled={cargando}
              />
              <label htmlFor="requiereAprobacion" className="text-sm font-medium text-gray-700">
                Requereix aprovació per participar
              </label>
            </div>
          </div>
          
          {/* Etiquetas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formulario.etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${configuracion.tema.colorPrimario}15`,
                    color: configuracion.tema.colorPrimario 
                  }}
                >
                  {etiqueta}
                  <button
                    type="button"
                    onClick={() => eliminarEtiqueta(etiqueta)}
                    className="ml-1 p-1 hover:bg-red-100 rounded-full"
                    disabled={cargando}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={nuevaEtiqueta}
                onChange={(e) => setNuevaEtiqueta(e.target.value)}
                onKeyDown={manejarTeclaEtiqueta}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nova etiqueta"
                disabled={cargando}
              />
              <button
                type="button"
                onClick={agregarEtiqueta}
                className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50"
                disabled={cargando}
              >
                Afegir
              </button>
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={cargando}
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: configuracion.tema.colorPrimario }}
            >
              {cargando ? 'Guardant...' : (esEdicion ? 'Actualitzar' : 'Crear Esdeveniment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}