'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Image, 
  Calendar, 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Euro, 
  Users, 
  Globe, 
  Lock, 
  Eye,
  Send,
  Plus,
  Paperclip,
  Smile
} from 'lucide-react';
import { useComunidad, useCaracteristicas } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  TipoPost, 
  Post, 
  Grupo, 
  TipoGrupo,
  Usuario,
  OfertaPost,
  EventoPost
} from '../../../../tipos/redSocial';

interface PropiedadesCrearPost {
  abierto: boolean;
  onCerrar: () => void;
  onCrearPost: (post: Partial<Post>) => Promise<void>;
  usuario: Usuario;
  grupoActual?: Grupo;
  grupos?: Grupo[];
  tipoInicial?: TipoPost;
}

interface FormularioPost {
  tipo: TipoPost;
  contenido: string;
  imagenes: File[];
  grupoId?: string;
  privacidad: 'publico' | 'amigos' | 'solo-yo';
  // Específicos para ofertas
  tituloOferta?: string;
  empresaOferta?: string;
  ubicacionOferta?: string;
  salarioOferta?: string;
  fechaLimiteOferta?: string;
  // Específicos para eventos
  tituloEvento?: string;
  fechaEvento?: string;
  horaEvento?: string;
  ubicacionEvento?: string;
  // Específicos para demandas
  tituloDemanda?: string;
  categoriaDemanda?: string;
  ubicacionDemanda?: string;
}

const tiposPost = [
  { tipo: 'texto' as TipoPost, icono: <div className="w-5 h-5 bg-blue-500 rounded"></div>, nombre: 'Publicación', descripcion: 'Comparte tus pensamientos' },
  { tipo: 'imagen' as TipoPost, icono: <Image size={20} />, nombre: 'Foto', descripcion: 'Comparte una imagen' },
  { tipo: 'evento' as TipoPost, icono: <Calendar size={20} />, nombre: 'Evento', descripcion: 'Organiza un evento' },
  { tipo: 'oferta' as TipoPost, icono: <Briefcase size={20} />, nombre: 'Oferta de Trabajo', descripcion: 'Publica una oferta' },
  { tipo: 'demanda' as TipoPost, icono: <Search size={20} />, nombre: 'Demanda', descripcion: 'Busca algo específico' }
];

const opcionesPrivacidad = [
  { valor: 'publico', icono: <Globe size={16} />, nombre: 'Público', descripcion: 'Visible para todos' },
  { valor: 'amigos', icono: <Users size={16} />, nombre: 'Contactos', descripcion: 'Solo tus contactos' },
  { valor: 'solo-yo', icono: <Lock size={16} />, nombre: 'Solo yo', descripcion: 'Solo tú puedes verlo' }
];

export const CrearPost: React.FC<PropiedadesCrearPost> = ({
  abierto,
  onCerrar,
  onCrearPost,
  usuario,
  grupoActual,
  grupos = [],
  tipoInicial = 'texto'
}) => {
  const { configuracion } = useComunidad();
  const { terminologia } = useCaracteristicas();
  const [cargando, setCargando] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formulario, setFormulario] = useState<FormularioPost>({
    tipo: tipoInicial,
    contenido: '',
    imagenes: [],
    grupoId: grupoActual?.id,
    privacidad: 'publico'
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [formulario.contenido]);

  // Reset form cuando se abre
  useEffect(() => {
    if (abierto) {
      setFormulario({
        tipo: tipoInicial,
        contenido: '',
        imagenes: [],
        grupoId: grupoActual?.id,
        privacidad: 'publico'
      });
    }
  }, [abierto, tipoInicial, grupoActual]);

  const actualizarFormulario = (campo: keyof FormularioPost, valor: any) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
  };

  const manejarSeleccionArchivos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(event.target.files || []);
    const imagenesValidas = archivos.filter(archivo => 
      archivo.type.startsWith('image/') && archivo.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (imagenesValidas.length !== archivos.length) {
      alert('Solo se permiten imágenes de hasta 5MB');
    }
    
    setFormulario(prev => ({ 
      ...prev, 
      imagenes: [...prev.imagenes, ...imagenesValidas].slice(0, 4) // Max 4 imágenes
    }));
  };

  const eliminarImagen = (indice: number) => {
    setFormulario(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== indice)
    }));
  };

  const validarFormulario = (): boolean => {
    if (!formulario.contenido.trim() && formulario.imagenes.length === 0) {
      alert('Debes escribir algo o subir una imagen');
      return false;
    }

    if (formulario.tipo === 'oferta' && !formulario.tituloOferta?.trim()) {
      alert('El título de la oferta es obligatorio');
      return false;
    }

    if (formulario.tipo === 'evento' && (!formulario.tituloEvento?.trim() || !formulario.fechaEvento)) {
      alert('El título y fecha del evento son obligatorios');
      return false;
    }

    if (formulario.tipo === 'demanda' && !formulario.tituloDemanda?.trim()) {
      alert('El título de la demanda es obligatorio');
      return false;
    }

    return true;
  };

  const manejarEnvio = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      const nuevoPost: Partial<Post> = {
        tipo: formulario.tipo,
        contenido: formulario.contenido,
        autorId: usuario.id,
        grupoId: formulario.grupoId || undefined,
        multimedia: formulario.imagenes.map(img => ({
          tipo: 'imagen' as const,
          url: URL.createObjectURL(img)
        })), // En producción sería la URL real
        fechaCreacion: new Date(),
        comentarios: [],
        reacciones: [],
        estadisticas: {
          visualizaciones: 0,
          comentarios: 0,
          reacciones: {},
          compartidos: 0
        },
        etiquetas: [],
        visibilidad: 'publico' as const,
        moderado: false,
        fijado: false
      };

      // Datos específicos según tipo
      if (formulario.tipo === 'oferta') {
        nuevoPost.oferta = {
          titulo: formulario.tituloOferta || '',
          organizacion: formulario.empresaOferta || '',
          descripcion: formulario.contenido,
          categoria: 'general',
          ubicacion: formulario.ubicacionOferta || '',
          salario: formulario.salarioOferta ? {
            minimo: parseFloat(formulario.salarioOferta) || 0
          } : undefined,
          fechaLimite: formulario.fechaLimiteOferta ? new Date(formulario.fechaLimiteOferta) : undefined,
          requisitos: []
        };
      }

      if (formulario.tipo === 'evento') {
        nuevoPost.evento = {
          titulo: formulario.tituloEvento || '',
          descripcion: formulario.contenido,
          fechaInicio: formulario.fechaEvento ? new Date(formulario.fechaEvento) : new Date(),
          ubicacion: formulario.ubicacionEvento || '',
          modalidad: 'presencial' as const
        };
      }

      if (formulario.tipo === 'demanda') {
        nuevoPost.demanda = {
          titulo: formulario.tituloDemanda || '',
          descripcion: formulario.contenido,
          categoria: formulario.categoriaDemanda || '',
          ubicacion: formulario.ubicacionDemanda || '',
          contacto: 'usuario@ejemplo.com'
        };
      }

      await onCrearPost(nuevoPost);
      onCerrar();
    } catch (error) {
      console.error('Error creando post:', error);
      alert('Error al crear la publicación. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Crear publicación
            </h2>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Selector de tipo de post */}
          <div className="mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {tiposPost.map((tipo) => (
                <button
                  key={tipo.tipo}
                  onClick={() => actualizarFormulario('tipo', tipo.tipo)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    formulario.tipo === tipo.tipo
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`${formulario.tipo === tipo.tipo ? 'text-blue-500' : 'text-gray-500'}`}>
                      {tipo.icono}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        formulario.tipo === tipo.tipo ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {tipo.nombre}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tipo.descripcion}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={usuario.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre + ' ' + usuario.apellidos)}&background=random`}
              alt={`${usuario.nombre} ${usuario.apellidos}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">
                {usuario.nombre} {usuario.apellidos}
              </div>
              <div className="text-sm text-gray-500">
                {usuario.perfil?.cargo || usuario.tipo.replace('-', ' ')}
              </div>
            </div>
          </div>

          {/* Selector de grupo (si aplica) */}
          {grupos.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publicar en:
              </label>
              <select
                value={formulario.grupoId || ''}
                onChange={(e) => actualizarFormulario('grupoId', e.target.value || undefined)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Mi perfil</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.nombre} ({grupo.miembros.length} miembros)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campos específicos según tipo */}
          {formulario.tipo === 'oferta' && (
            <div className="space-y-4 mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 flex items-center">
                <Briefcase size={16} className="mr-2" />
                Detalles de la {terminologia.bolsasTrabajo}
              </h3>
              <input
                type="text"
                placeholder="Título de la oferta *"
                value={formulario.tituloOferta || ''}
                onChange={(e) => actualizarFormulario('tituloOferta', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Empresa/Organismo"
                  value={formulario.empresaOferta || ''}
                  onChange={(e) => actualizarFormulario('empresaOferta', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Ubicación"
                  value={formulario.ubicacionOferta || ''}
                  onChange={(e) => actualizarFormulario('ubicacionOferta', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Salario (ej: 30.000-40.000€)"
                  value={formulario.salarioOferta || ''}
                  onChange={(e) => actualizarFormulario('salarioOferta', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={formulario.fechaLimiteOferta || ''}
                  onChange={(e) => actualizarFormulario('fechaLimiteOferta', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {formulario.tipo === 'evento' && (
            <div className="space-y-4 mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-800 flex items-center">
                <Calendar size={16} className="mr-2" />
                Detalles del evento
              </h3>
              <input
                type="text"
                placeholder="Título del evento *"
                value={formulario.tituloEvento || ''}
                onChange={(e) => actualizarFormulario('tituloEvento', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="date"
                  value={formulario.fechaEvento || ''}
                  onChange={(e) => actualizarFormulario('fechaEvento', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="time"
                  value={formulario.horaEvento || ''}
                  onChange={(e) => actualizarFormulario('horaEvento', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Ubicación"
                  value={formulario.ubicacionEvento || ''}
                  onChange={(e) => actualizarFormulario('ubicacionEvento', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {formulario.tipo === 'demanda' && (
            <div className="space-y-4 mb-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-medium text-orange-800 flex items-center">
                <Search size={16} className="mr-2" />
                Detalles de la demanda
              </h3>
              <input
                type="text"
                placeholder="¿Qué estás buscando? *"
                value={formulario.tituloDemanda || ''}
                onChange={(e) => actualizarFormulario('tituloDemanda', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formulario.categoriaDemanda || ''}
                  onChange={(e) => actualizarFormulario('categoriaDemanda', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecciona categoría</option>
                  <option value="empleo">Empleo</option>
                  <option value="formacion">Formación</option>
                  <option value="recursos">Recursos</option>
                  <option value="colaboracion">Colaboración</option>
                  <option value="otros">Otros</option>
                </select>
                <input
                  type="text"
                  placeholder="Ubicación"
                  value={formulario.ubicacionDemanda || ''}
                  onChange={(e) => actualizarFormulario('ubicacionDemanda', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Textarea principal */}
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              placeholder={`¿Qué quieres compartir con la comunidad de ${configuracion.nombre}?`}
              value={formulario.contenido}
              onChange={(e) => actualizarFormulario('contenido', e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
              rows={4}
            />
          </div>

          {/* Imágenes subidas */}
          {formulario.imagenes.length > 0 && (
            <div className="mb-4">
              <div className={`grid gap-3 ${formulario.imagenes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {formulario.imagenes.map((imagen, indice) => (
                  <div key={indice} className="relative group">
                    <img
                      src={URL.createObjectURL(imagen)}
                      alt={`Imagen ${indice + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => eliminarImagen(indice)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opciones adicionales */}
          <div className="flex items-center justify-between py-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Subir imagen */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={formulario.imagenes.length >= 4}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Image size={20} />
                <span className="hidden sm:inline">Imagen</span>
              </button>

              {/* Input oculto para archivos */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={manejarSeleccionArchivos}
                className="hidden"
              />

              {/* Privacidad */}
              <select
                value={formulario.privacidad}
                onChange={(e) => actualizarFormulario('privacidad', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {opcionesPrivacidad.map((opcion) => (
                  <option key={opcion.valor} value={opcion.valor}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón publicar */}
            <Boton
              variante="primario"
              onClick={manejarEnvio}
              disabled={cargando || (!formulario.contenido.trim() && formulario.imagenes.length === 0)}
              cargando={cargando}
              icono={<Send size={16} />}
            >
              {cargando ? 'Publicando...' : 'Publicar'}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPost;