'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Share, 
  Bookmark, 
  BookMarked as BookmarkCheck, 
  Eye, 
  EyeOff, 
  Globe, 
  Lock, 
  Video, 
  Coffee, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  MessageCircle, 
  Send, 
  Download, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check, 
  AlertCircle, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Building, 
  Phone, 
  Mail, 
  ExternalLink, 
  QrCode, 
  Ticket, 
  Camera,
  Mic,
  MicOff
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  EventoPost, 
  Usuario
} from '../../../../tipos/redSocial';

// Tipos para eventos
interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  tipo: 'presencial' | 'online' | 'hibrido';
  modalidad: 'publico' | 'privado';
  fechaInicio: Date;
  fechaFin?: Date;
  ubicacion?: string;
  capacidadMaxima?: number;
  asistentes: number;
  fechaCreacion: Date;
  creadorId: string;
  comunidadId: string;
  estado: 'programado' | 'en-progreso' | 'finalizado' | 'cancelado';
  esGratuito: boolean;
  requiereAprobacion: boolean;
  organizador: string;
  activo: boolean;
  etiquetas: string[];
}

interface ComentarioEvento {
  id: string;
  autorId: string;
  eventoId: string;
  contenido: string;
  fechaCreacion: Date;
}

type CategoriaEvento = 'formacion' | 'networking' | 'conferencia' | 'taller' | 'reunion' | 'otros';
type TipoEvento = 'presencial' | 'online' | 'hibrido';
type ModalidadEvento = 'publico' | 'privado';
type EstadoEvento = 'programado' | 'en-progreso' | 'finalizado' | 'cancelado';

interface PropiedadesSistemaEventos {
  usuario: Usuario;
  eventos: Evento[];
  eventosAsistiendo: string[];
  onCrearEvento: (evento: Partial<Evento>) => Promise<void>;
  onActualizarEvento: (id: string, datos: Partial<Evento>) => Promise<void>;
  onEliminarEvento: (id: string) => Promise<void>;
  onGestionarAsistencia: (eventoId: string, accion: 'asistir' | 'no-asistir' | 'quizas') => Promise<void>;
  onComentarEvento: (eventoId: string, comentario: string) => Promise<void>;
}

interface PropiedadesFormularioEvento {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (evento: Partial<Evento>) => Promise<void>;
  evento?: Evento;
  esEdicion?: boolean;
}

interface PropiedadesCalendarioEventos {
  eventos: Evento[];
  fechaSeleccionada: Date;
  onCambiarFecha: (fecha: Date) => void;
  onSeleccionarEvento: (evento: Evento) => void;
  vistaCalendario: 'mes' | 'semana' | 'dia';
  onCambiarVista: (vista: 'mes' | 'semana' | 'dia') => void;
}

interface PropiedadesDetalleEvento {
  evento: Evento;
  abierto: boolean;
  onCerrar: () => void;
  usuario: Usuario;
  estaAsistiendo: boolean;
  onGestionarAsistencia: (accion: 'asistir' | 'no-asistir' | 'quizas') => Promise<void>;
  onComentarEvento: (comentario: string) => Promise<void>;
  comentarios: ComentarioEvento[];
}

// Componente de formulario para eventos
const FormularioEvento: React.FC<PropiedadesFormularioEvento> = ({
  abierto,
  onCerrar,
  onGuardar,
  evento,
  esEdicion = false
}) => {
  const { configuracion } = useComunidad();
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'formacion' as CategoriaEvento,
    tipo: 'presencial' as TipoEvento,
    modalidad: 'publico' as ModalidadEvento,
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    ubicacion: '',
    ubicacionVirtual: '',
    capacidadMaxima: 50,
    requiereAprobacion: false,
    esGratuito: true,
    precio: 0,
    organizador: '',
    contactoEmail: '',
    contactoTelefono: '',
    etiquetas: [''],
    materialesIncluidos: [''],
    requisitosPrevios: '',
    certificacion: false,
    puntuacionFormacion: 0
  });

  useEffect(() => {
    if (evento && esEdicion) {
      setFormulario({
        titulo: evento.titulo,
        descripcion: evento.descripcion || '',
        categoria: evento.categoria as any,
        tipo: evento.tipo,
        modalidad: evento.modalidad,
        fechaInicio: evento.fechaInicio.toISOString().split('T')[0],
        horaInicio: evento.fechaInicio.toTimeString().split(' ')[0].substring(0, 5),
        fechaFin: evento.fechaFin?.toISOString().split('T')[0] || '',
        horaFin: evento.fechaFin?.toTimeString().split(' ')[0].substring(0, 5) || '',
        ubicacion: evento.ubicacion || '',
        ubicacionVirtual: (evento as any).ubicacionVirtual || '',
        capacidadMaxima: (evento as any).capacidadMaxima || 50,
        requiereAprobacion: (evento as any).requiereAprobacion || false,
        esGratuito: (evento as any).esGratuito || true,
        precio: (evento as any).precio || 0,
        organizador: (evento as any).organizador || '',
        contactoEmail: (evento as any).contactoEmail || '',
        contactoTelefono: (evento as any).contactoTelefono || '',
        etiquetas: evento.etiquetas?.length ? evento.etiquetas : [''],
        materialesIncluidos: (evento as any).materialesIncluidos?.length ? (evento as any).materialesIncluidos : [''],
        requisitosPrevios: (evento as any).requisitosPrevios || '',
        certificacion: (evento as any).certificacion || false,
        puntuacionFormacion: (evento as any).puntuacionFormacion || 0
      });
    }
  }, [evento, esEdicion]);

  const actualizarFormulario = (campo: string, valor: any) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
  };

  const agregarEtiqueta = () => {
    setFormulario(prev => ({
      ...prev,
      etiquetas: [...prev.etiquetas, '']
    }));
  };

  const actualizarEtiqueta = (indice: number, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.map((etiqueta, i) => i === indice ? valor : etiqueta)
    }));
  };

  const eliminarEtiqueta = (indice: number) => {
    setFormulario(prev => ({
      ...prev,
      etiquetas: prev.etiquetas.filter((_, i) => i !== indice)
    }));
  };

  const manejarGuardar = async () => {
    if (!formulario.titulo.trim() || !formulario.fechaInicio || !formulario.horaInicio) {
      alert('El título, fecha y hora de inicio son obligatorios');
      return;
    }

    setCargando(true);
    try {
      const fechaInicio = new Date(`${formulario.fechaInicio}T${formulario.horaInicio}`);
      const fechaFin = formulario.fechaFin && formulario.horaFin 
        ? new Date(`${formulario.fechaFin}T${formulario.horaFin}`)
        : new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); // +2 horas por defecto

      const datosEvento = {
        ...formulario,
        fechaInicio,
        fechaFin,
        etiquetas: formulario.etiquetas.filter(tag => tag.trim()),
        materialesIncluidos: formulario.materialesIncluidos.filter(material => material.trim()),
        fechaCreacion: evento?.fechaCreacion || new Date(),
        comunidadId: configuracion.codigo,
        estado: 'programado' as EstadoEvento,
        asistentes: evento?.asistentes || 0,
        activo: true
      };

      await onGuardar(datosEvento);
      onCerrar();
    } catch (error) {
      console.error('Error guardando evento:', error);
      alert('Error al guardar el evento');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {esEdicion ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h2>
            <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del evento *
              </label>
              <input
                type="text"
                value={formulario.titulo}
                onChange={(e) => actualizarFormulario('titulo', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Jornada de Formación en Administración Electrónica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formulario.categoria}
                onChange={(e) => actualizarFormulario('categoria', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="formacion">Formación</option>
                <option value="networking">Networking</option>
                <option value="conferencia">Conferencia</option>
                <option value="taller">Taller</option>
                <option value="seminario">Seminario</option>
                <option value="reunion">Reunión</option>
                <option value="social">Social</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de evento
              </label>
              <select
                value={formulario.tipo}
                onChange={(e) => actualizarFormulario('tipo', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad
              </label>
              <select
                value={formulario.modalidad}
                onChange={(e) => actualizarFormulario('modalidad', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
                <option value="solo-invitados">Solo invitados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad máxima
              </label>
              <input
                type="number"
                value={formulario.capacidadMaxima}
                onChange={(e) => actualizarFormulario('capacidadMaxima', parseInt(e.target.value))}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del evento
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => actualizarFormulario('descripcion', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el evento, objetivos, programa, ponentes..."
            />
          </div>

          {/* Fechas y horas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fechas y horarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio *
                </label>
                <input
                  type="date"
                  value={formulario.fechaInicio}
                  onChange={(e) => actualizarFormulario('fechaInicio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora inicio *
                </label>
                <input
                  type="time"
                  value={formulario.horaInicio}
                  onChange={(e) => actualizarFormulario('horaInicio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={formulario.fechaFin}
                  onChange={(e) => actualizarFormulario('fechaFin', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora fin
                </label>
                <input
                  type="time"
                  value={formulario.horaFin}
                  onChange={(e) => actualizarFormulario('horaFin', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formulario.tipo === 'presencial' || formulario.tipo === 'hibrido') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación física
                  </label>
                  <input
                    type="text"
                    value={formulario.ubicacion}
                    onChange={(e) => actualizarFormulario('ubicacion', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Dirección completa del evento"
                  />
                </div>
              )}
              {((formulario.tipo as any) === 'virtual' || (formulario.tipo as any) === 'hibrido') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace virtual
                  </label>
                  <input
                    type="url"
                    value={formulario.ubicacionVirtual}
                    onChange={(e) => actualizarFormulario('ubicacionVirtual', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Organizador y contacto */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizador
                </label>
                <input
                  type="text"
                  value={formulario.organizador}
                  onChange={(e) => actualizarFormulario('organizador', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del organizador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contacto
                </label>
                <input
                  type="email"
                  value={formulario.contactoEmail}
                  onChange={(e) => actualizarFormulario('contactoEmail', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="contacto@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  value={formulario.contactoTelefono}
                  onChange={(e) => actualizarFormulario('contactoTelefono', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>
          </div>

          {/* Configuración adicional */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración adicional</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Requiere aprobación</div>
                  <div className="text-sm text-gray-600">Los asistentes deben ser aprobados</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formulario.requiereAprobacion}
                    onChange={(e) => actualizarFormulario('requiereAprobacion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Evento gratuito</div>
                  <div className="text-sm text-gray-600">Sin coste para los asistentes</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formulario.esGratuito}
                    onChange={(e) => actualizarFormulario('esGratuito', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {!formulario.esGratuito && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (€)
                  </label>
                  <input
                    type="number"
                    value={formulario.precio}
                    onChange={(e) => actualizarFormulario('precio', parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Ofrece certificación</div>
                  <div className="text-sm text-gray-600">Certificado de participación/aprovechamiento</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formulario.certificacion}
                    onChange={(e) => actualizarFormulario('certificacion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formulario.certificacion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntuación formación (horas)
                  </label>
                  <input
                    type="number"
                    value={formulario.puntuacionFormacion}
                    onChange={(e) => actualizarFormulario('puntuacionFormacion', parseInt(e.target.value))}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Etiquetas
              </label>
              <button
                type="button"
                onClick={agregarEtiqueta}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Agregar etiqueta</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {formulario.etiquetas.map((etiqueta, indice) => (
                <div key={indice} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={etiqueta}
                    onChange={(e) => actualizarEtiqueta(indice, e.target.value)}
                    placeholder={`Etiqueta ${indice + 1}`}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formulario.etiquetas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarEtiqueta(indice)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Boton variante="secundario" onClick={onCerrar}>
              Cancelar
            </Boton>
            <Boton
              variante="primario"
              onClick={manejarGuardar}
              disabled={cargando}
              cargando={cargando}
            >
              {esEdicion ? 'Actualizar' : 'Crear'} Evento
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de calendario
const CalendarioEventos: React.FC<PropiedadesCalendarioEventos> = ({
  eventos,
  fechaSeleccionada,
  onCambiarFecha,
  onSeleccionarEvento,
  vistaCalendario,
  onCambiarVista
}) => {
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const obtenerDiasDelMes = (fecha: Date) => {
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    const diasAntes = primerDia.getDay() || 7; // Lunes = 1
    
    const dias = [];
    
    // Días del mes anterior
    for (let i = diasAntes - 1; i >= 1; i--) {
      const dia = new Date(primerDia.getTime() - i * 24 * 60 * 60 * 1000);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= ultimoDia.getDate(); i++) {
      const dia = new Date(fecha.getFullYear(), fecha.getMonth(), i);
      dias.push({ fecha: dia, esMesActual: true });
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - dias.length; // 6 semanas × 7 días
    for (let i = 1; i <= diasRestantes; i++) {
      const dia = new Date(ultimoDia.getTime() + i * 24 * 60 * 60 * 1000);
      dias.push({ fecha: dia, esMesActual: false });
    }
    
    return dias;
  };

  const obtenerEventosDelDia = (fecha: Date) => {
    return eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      return fechaEvento.toDateString() === fecha.toDateString();
    });
  };

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaSeleccionada);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    onCambiarFecha(nuevaFecha);
  };

  if (vistaCalendario === 'mes') {
    const dias = obtenerDiasDelMes(fechaSeleccionada);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navegarMes('anterior')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {meses[fechaSeleccionada.getMonth()]} {fechaSeleccionada.getFullYear()}
            </h3>
            <button
              onClick={() => navegarMes('siguiente')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex space-x-2">
            {['mes', 'semana', 'dia'].map(vista => (
              <button
                key={vista}
                onClick={() => onCambiarVista(vista as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  vistaCalendario === vista
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {vista.charAt(0).toUpperCase() + vista.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {diasSemana.map(dia => (
            <div key={dia} className="p-2 text-center text-sm font-medium text-gray-500">
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {dias.map((dia, indice) => {
            const eventosDelDia = obtenerEventosDelDia(dia.fecha);
            const esHoy = dia.fecha.toDateString() === new Date().toDateString();
            const estaSeleccionado = dia.fecha.toDateString() === fechaSeleccionada.toDateString();

            return (
              <button
                key={indice}
                onClick={() => onCambiarFecha(dia.fecha)}
                className={`relative p-2 min-h-[80px] text-left border border-gray-100 hover:bg-gray-50 transition-colors ${
                  !dia.esMesActual ? 'text-gray-300 bg-gray-50' : ''
                } ${esHoy ? 'bg-blue-50 border-blue-200' : ''} ${
                  estaSeleccionado ? 'bg-blue-100 border-blue-300' : ''
                }`}
              >
                <span className={`text-sm font-medium ${
                  esHoy ? 'text-blue-600' : dia.esMesActual ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {dia.fecha.getDate()}
                </span>
                
                {eventosDelDia.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {eventosDelDia.slice(0, 2).map(evento => (
                      <button
                        key={evento.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeleccionarEvento(evento);
                        }}
                        className="w-full text-left px-1 py-0.5 bg-blue-100 text-blue-700 text-xs rounded truncate hover:bg-blue-200"
                      >
                        {evento.titulo}
                      </button>
                    ))}
                    {eventosDelDia.length > 2 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{eventosDelDia.length - 2} más
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Vistas de semana y día (simplificadas)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center py-12">
        <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Vista {vistaCalendario}
        </h3>
        <p className="text-gray-600">
          Próximamente disponible
        </p>
      </div>
    </div>
  );
};

// Componente de detalle del evento
const DetalleEvento: React.FC<PropiedadesDetalleEvento> = ({
  evento,
  abierto,
  onCerrar,
  usuario,
  estaAsistiendo,
  onGestionarAsistencia,
  onComentarEvento,
  comentarios
}) => {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargandoComentario, setCargandoComentario] = useState(false);

  const manejarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    setCargandoComentario(true);
    try {
      await onComentarEvento(nuevoComentario);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error añadiendo comentario:', error);
    } finally {
      setCargandoComentario(false);
    }
  };

  const obtenerIconoCategoria = (categoria: any) => {
    switch (categoria) {
      case 'formacion': return <GraduationCap size={20} className="text-blue-500" />;
      case 'networking': return <Users size={20} className="text-green-500" />;
      case 'conferencia': return <Mic size={20} className="text-purple-500" />;
      case 'taller': return <Target size={20} className="text-orange-500" />;
      case 'seminario': return <BookmarkCheck size={20} className="text-indigo-500" />;
      case 'reunion': return <Coffee size={20} className="text-brown-500" />;
      case 'social': return <Heart size={20} className="text-pink-500" />;
      default: return <Calendar size={20} className="text-gray-500" />;
    }
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {(evento as any).banner && (
            <img
              src={(evento as any).banner}
              alt={evento.titulo}
              className="w-full h-48 object-cover rounded-t-xl"
            />
          )}
          <div className="absolute top-4 right-4">
            <button
              onClick={onCerrar}
              className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          {!(evento as any).banner && (
            <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl relative">
              <button
                onClick={onCerrar}
                className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Información principal */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {obtenerIconoCategoria(evento.categoria)}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {evento.categoria}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {evento.tipo}
                </span>
                {evento.modalidad === 'privado' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Lock size={12} className="mr-1" />
                    Privado
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{evento.titulo}</h1>
              <p className="text-gray-600 mb-4">{evento.descripcion}</p>
            </div>
            
            <div className="flex items-center space-x-3 ml-6">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Share size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                {estaAsistiendo ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
              </button>
            </div>
          </div>

          {/* Información del evento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{formatearFecha(evento.fechaInicio)}</p>
                  <p className="text-sm text-gray-600">
                    {formatearHora(evento.fechaInicio)} - {evento.fechaFin ? formatearHora(evento.fechaFin) : 'Sin hora de fin'}
                  </p>
                </div>
              </div>

              {evento.ubicacion && (
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Ubicación</p>
                    <p className="text-sm text-gray-600">{evento.ubicacion}</p>
                  </div>
                </div>
              )}

              {(evento as any).ubicacionVirtual && (
                <div className="flex items-start space-x-3">
                  <Video size={20} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Enlace virtual</p>
                    <a
                      href={(evento as any).ubicacionVirtual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      Unirse al evento
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Users size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Asistentes</p>
                  <p className="text-sm text-gray-600">
                    {evento.asistentes} / {evento.capacidadMaxima || '∞'} personas
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {evento.organizador && (
                <div className="flex items-center space-x-3">
                  <Building size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Organizador</p>
                    <p className="text-sm text-gray-600">{evento.organizador}</p>
                  </div>
                </div>
              )}

              {(evento as any).contactoEmail && (
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Contacto</p>
                    <a
                      href={`mailto:${(evento as any).contactoEmail}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {(evento as any).contactoEmail}
                    </a>
                  </div>
                </div>
              )}

              {(evento as any).precio !== undefined && (
                <div className="flex items-center space-x-3">
                  <Ticket size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Precio</p>
                    <p className="text-sm text-gray-600">
                      {(evento as any).esGratuito ? 'Gratuito' : `${(evento as any).precio}€`}
                    </p>
                  </div>
                </div>
              )}

              {(evento as any).certificacion && (
                <div className="flex items-center space-x-3">
                  <Award size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Certificación</p>
                    <p className="text-sm text-gray-600">
                      {(evento as any).puntuacionFormacion}h de formación
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Etiquetas */}
          {evento.etiquetas && evento.etiquetas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {evento.etiquetas.map((etiqueta, indice) => (
                  <span
                    key={indice}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{etiqueta}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botón de asistencia */}
          <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {estaAsistiendo ? '¡Ya estás registrado!' : '¿Vas a asistir?'}
              </p>
              <p className="text-sm text-gray-600">
                {evento.requiereAprobacion && !estaAsistiendo
                  ? 'Tu solicitud será revisada por el organizador'
                  : estaAsistiendo
                  ? 'Recibirás recordatorios del evento'
                  : 'Confirma tu asistencia'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {estaAsistiendo ? (
                <Boton
                  variante="secundario"
                  onClick={() => onGestionarAsistencia('no-asistir')}
                  icono={<X size={16} />}
                >
                  No asistiré
                </Boton>
              ) : (
                <>
                  <Boton
                    variante="primario"
                    onClick={() => onGestionarAsistencia('asistir')}
                    icono={<Check size={16} />}
                  >
                    Asistiré
                  </Boton>
                  <Boton
                    variante="ghost"
                    onClick={() => onGestionarAsistencia('quizas')}
                    icono={<AlertCircle size={16} />}
                  >
                    Quizás
                  </Boton>
                </>
              )}
            </div>
          </div>

          {/* Comentarios */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comentarios ({comentarios.length})
            </h3>
            
            {/* Añadir comentario */}
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <img
                  src={usuario.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre + ' ' + usuario.apellidos)}&background=random`}
                  alt={`${usuario.nombre} ${usuario.apellidos}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Añade un comentario..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Boton
                      variante="primario"
                      tamaño="sm"
                      onClick={manejarComentario}
                      disabled={!nuevoComentario.trim() || cargandoComentario}
                      cargando={cargandoComentario}
                      icono={<Send size={14} />}
                    >
                      Comentar
                    </Boton>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de comentarios */}
            <div className="space-y-4">
              {comentarios.map(comentario => (
                <div key={comentario.id} className="flex items-start space-x-3">
                  <img
                    src={(comentario as any).autor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((comentario as any).autor?.nombre + ' ' + (comentario as any).autor?.apellidos)}&background=random`}
                    alt={`${(comentario as any).autor?.nombre} ${(comentario as any).autor?.apellidos}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {(comentario as any).autor?.nombre} {(comentario as any).autor?.apellidos}
                      </span>
                      <span className="text-xs text-gray-500">
                        {comentario.fechaCreacion.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comentario.contenido}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del sistema de eventos
export const SistemaEventos: React.FC<PropiedadesSistemaEventos> = ({
  usuario,
  eventos,
  eventosAsistiendo,
  onCrearEvento,
  onActualizarEvento,
  onEliminarEvento,
  onGestionarAsistencia,
  onComentarEvento
}) => {
  const { configuracion } = useComunidad();
  const [vista, setVista] = useState<'lista' | 'calendario'>('lista');
  const [vistaCalendario, setVistaCalendario] = useState<'mes' | 'semana' | 'dia'>('mes');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [eventoDetalle, setEventoDetalle] = useState<Evento | null>(null);
  const [eventoEditando, setEventoEditando] = useState<Evento | undefined>();
  const [filtros, setFiltros] = useState({
    categoria: 'todas' as CategoriaEvento | 'todas',
    tipo: 'todos' as TipoEvento | 'todos',
    fecha: 'todos' as 'todos' | 'hoy' | 'semana' | 'mes',
    busqueda: ''
  });

  // Filtrar eventos
  const eventosFiltrados = eventos.filter(evento => {
    const coincideBusqueda = evento.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                            evento.descripcion?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const coincideCategoria = filtros.categoria === 'todas' || evento.categoria === filtros.categoria;
    const coincideTipo = filtros.tipo === 'todos' || evento.tipo === filtros.tipo;
    
    let coincideFecha = true;
    if (filtros.fecha !== 'todos') {
      const ahora = new Date();
      const fechaEvento = new Date(evento.fechaInicio);
      
      switch (filtros.fecha) {
        case 'hoy':
          coincideFecha = fechaEvento.toDateString() === ahora.toDateString();
          break;
        case 'semana':
          const inicioSemana = new Date(ahora);
          inicioSemana.setDate(ahora.getDate() - ahora.getDay());
          const finSemana = new Date(inicioSemana);
          finSemana.setDate(inicioSemana.getDate() + 7);
          coincideFecha = fechaEvento >= inicioSemana && fechaEvento < finSemana;
          break;
        case 'mes':
          coincideFecha = fechaEvento.getMonth() === ahora.getMonth() && 
                         fechaEvento.getFullYear() === ahora.getFullYear();
          break;
      }
    }
    
    return coincideBusqueda && coincideCategoria && coincideTipo && coincideFecha;
  });

  const manejarCrearEvento = async (datosEvento: Partial<Evento>) => {
    try {
      await onCrearEvento(datosEvento);
      setFormularioAbierto(false);
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  const manejarEditarEvento = async (datosEvento: Partial<Evento>) => {
    if (!eventoEditando) return;
    
    try {
      await onActualizarEvento(eventoEditando.id, datosEvento);
      setFormularioAbierto(false);
      setEventoEditando(undefined);
    } catch (error) {
      console.error('Error actualizando evento:', error);
    }
  };

  // Comentarios de ejemplo
  const comentarios: any[] = eventoDetalle ? [
    {
      id: '1',
      eventoId: eventoDetalle.id,
      autor: {
        id: 'user1',
        nombre: 'María',
        apellidos: 'García',
        avatar: ''
      },
      contenido: '¡Excelente evento! Muy útil para mi formación profesional.',
      fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-600">Descubre y participa en eventos de tu comunidad</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVista('lista')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vista === 'lista'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVista('calendario')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vista === 'calendario'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendario
            </button>
          </div>
          
          <Boton
            variante="primario"
            onClick={() => setFormularioAbierto(true)}
            icono={<Plus size={16} />}
          >
            Crear Evento
          </Boton>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas las categorías</option>
            <option value="formacion">Formación</option>
            <option value="networking">Networking</option>
            <option value="conferencia">Conferencia</option>
            <option value="taller">Taller</option>
            <option value="seminario">Seminario</option>
            <option value="reunion">Reunión</option>
            <option value="social">Social</option>
          </select>
          
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los tipos</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="hibrido">Híbrido</option>
          </select>
          
          <select
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value as any })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todas las fechas</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      {vista === 'lista' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventosFiltrados.map(evento => {
            const estaAsistiendo = eventosAsistiendo.includes(evento.id);
            
            return (
              <div key={evento.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {(evento as any).banner && (
                  <img
                    src={(evento as any).banner}
                    alt={evento.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {evento.categoria}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {evento.tipo}
                    </span>
                    {estaAsistiendo && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        Asistiendo
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {evento.titulo}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {evento.descripcion}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-2" />
                      {evento.fechaInicio.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} a las {evento.fechaInicio.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    
                    {evento.ubicacion && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-2" />
                        {evento.ubicacion}
                      </div>
                    )}
                    
                    {(evento as any).ubicacionVirtual && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Video size={14} className="mr-2" />
                        Virtual
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Users size={14} className="mr-2" />
                      {evento.asistentes} asistentes
                      {evento.capacidadMaxima && ` / ${evento.capacidadMaxima}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Boton
                      variante="primario"
                      tamaño="sm"
                      onClick={() => setEventoDetalle(evento)}
                      className="flex-1"
                    >
                      Ver detalles
                    </Boton>
                    
                    {usuario.id === evento.creadorId && (
                      <>
                        <button
                          onClick={() => {
                            setEventoEditando(evento);
                            setFormularioAbierto(true);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onEliminarEvento(evento.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <CalendarioEventos
          eventos={eventosFiltrados}
          fechaSeleccionada={fechaSeleccionada}
          onCambiarFecha={setFechaSeleccionada}
          onSeleccionarEvento={setEventoDetalle}
          vistaCalendario={vistaCalendario}
          onCambiarVista={setVistaCalendario}
        />
      )}

      {/* Estado vacío */}
      {eventosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay eventos
          </h3>
          <p className="text-gray-600 mb-6">
            {filtros.busqueda || filtros.categoria !== 'todas' || filtros.tipo !== 'todos' || filtros.fecha !== 'todos'
              ? 'No se encontraron eventos con esos criterios'
              : 'Aún no hay eventos programados'
            }
          </p>
          {(!filtros.busqueda && filtros.categoria === 'todas' && filtros.tipo === 'todos' && filtros.fecha === 'todos') && (
            <Boton
              variante="primario"
              onClick={() => setFormularioAbierto(true)}
              icono={<Plus size={16} />}
            >
              Crear Primer Evento
            </Boton>
          )}
        </div>
      )}

      {/* Modales */}
      <FormularioEvento
        abierto={formularioAbierto}
        onCerrar={() => {
          setFormularioAbierto(false);
          setEventoEditando(undefined);
        }}
        onGuardar={eventoEditando ? manejarEditarEvento : manejarCrearEvento}
        evento={eventoEditando}
        esEdicion={!!eventoEditando}
      />

      {eventoDetalle && (
        <DetalleEvento
          evento={eventoDetalle}
          abierto={!!eventoDetalle}
          onCerrar={() => setEventoDetalle(null)}
          usuario={usuario}
          estaAsistiendo={eventosAsistiendo.includes(eventoDetalle.id)}
          onGestionarAsistencia={(accion) => onGestionarAsistencia(eventoDetalle.id, accion)}
          onComentarEvento={(comentario) => onComentarEvento(eventoDetalle.id, comentario)}
          comentarios={comentarios}
        />
      )}
    </div>
  );
};

export default SistemaEventos;