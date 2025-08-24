'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  UserPlus, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Filter, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  Heart, 
  Share, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Send,
  Search,
  MoreHorizontal,
  Bookmark,
  Award,
  Shield,
  Zap,
  X
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  Usuario, 
  OfertaPost, 
  Post, 
  CandidatoEmpresa, 
  TipoUsuario,
  Conversacion,
  Mensaje
} from '../../../../tipos/redSocial';

// Tipo para ofertas de trabajo
interface OfertaTrabajo {
  id: string;
  titulo: string;
  descripcion: string;
  organizacion: string;
  ubicacion: string;
  categoria: string;
  tipo: string;
  plazas: number;
  fechaLimite: Date;
  fechaPublicacion: Date;
  requisitos: string[];
  salario?: {
    minimo: number;
    maximo: number;
    complementos: string[];
  };
  activa: boolean;
  comunidadId: string;
}

interface PropiedadesDashboardEmpresa {
  empresa: Usuario;
  ofertas: any[];
  candidatos: any[];
  conversaciones: Conversacion[];
  estadisticas: EstadisticasEmpresa;
  onCrearOferta: (oferta: Partial<any>) => Promise<void>;
  onActualizarOferta: (id: string, datos: Partial<any>) => Promise<void>;
  onEliminarOferta: (id: string) => Promise<void>;
  onGestionarCandidato: (candidatoId: string, accion: 'aprobar' | 'rechazar' | 'contactar' | 'archivar') => Promise<void>;
  onActualizarPerfil: (datos: Partial<Usuario>) => Promise<void>;
}

interface EstadisticasEmpresa {
  visitasPerfilMes: number;
  seguidoresMes: number;
  candidatosMes: number;
  ofertasActivas: number;
  tasaRespuesta: number;
  tiempoMedioRespuesta: string;
  interaccionesMes: number;
  alcancePosts: number;
  topOfertas: {
    id: string;
    titulo: string;
    candidatos: number;
    vistas: number;
  }[];
  trendsData: {
    fecha: string;
    visitas: number;
    candidatos: number;
    interacciones: number;
  }[];
}

interface PropiedadesFormularioOferta {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (oferta: Partial<any>) => Promise<void>;
  oferta?: any;
  esEdicion?: boolean;
}

interface PropiedadesGestionCandidatos {
  candidatos: any[];
  ofertas: any[];
  onGestionarCandidato: (candidatoId: string, accion: 'aprobar' | 'rechazar' | 'contactar' | 'archivar') => Promise<void>;
}

interface PropiedadesAnalytics {
  estadisticas: EstadisticasEmpresa;
  empresa: Usuario;
}

// Componente de formulario para ofertas
const FormularioOferta: React.FC<PropiedadesFormularioOferta> = ({
  abierto,
  onCerrar,
  onGuardar,
  oferta,
  esEdicion = false
}) => {
  const { configuracion } = useComunidad();
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    organizacion: '',
    ubicacion: '',
    categoria: 'administracion-general' as const,
    tipo: 'oposicion' as const,
    plazas: 1,
    fechaLimite: '',
    requisitos: [''],
    salario: {
      minimo: 0,
      maximo: 0,
      complementos: ['']
    },
    modalidad: 'presencial' as 'presencial' | 'remoto' | 'hibrido',
    experienciaMinima: '',
    nivelEstudios: 'universitario' as 'basico' | 'medio' | 'universitario' | 'postgrado'
  });

  useEffect(() => {
    if (oferta && esEdicion) {
      setFormulario({
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        organizacion: oferta.organizacion,
        ubicacion: oferta.ubicacion,
        categoria: oferta.categoria,
        tipo: oferta.tipo,
        plazas: oferta.plazas,
        fechaLimite: oferta.fechaLimite?.toISOString?.()?.split('T')[0] || '',
        requisitos: oferta.requisitos.length ? oferta.requisitos : [''],
        salario: oferta.salario || { minimo: 0, maximo: 0, complementos: [''] },
        modalidad: 'presencial',
        experienciaMinima: '',
        nivelEstudios: 'universitario'
      });
    }
  }, [oferta, esEdicion]);

  const actualizarFormulario = (campo: string, valor: any) => {
    if (campo.startsWith('salario.')) {
      const salarioCampo = campo.split('.')[1];
      setFormulario(prev => ({
        ...prev,
        salario: {
          ...prev.salario,
          [salarioCampo]: valor
        }
      }));
    } else {
      setFormulario(prev => ({ ...prev, [campo]: valor }));
    }
  };

  const agregarRequisito = () => {
    setFormulario(prev => ({
      ...prev,
      requisitos: [...prev.requisitos, '']
    }));
  };

  const actualizarRequisito = (indice: number, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      requisitos: prev.requisitos.map((req, i) => i === indice ? valor : req)
    }));
  };

  const eliminarRequisito = (indice: number) => {
    setFormulario(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== indice)
    }));
  };

  const manejarGuardar = async () => {
    if (!formulario.titulo.trim() || !formulario.descripcion.trim()) {
      alert('El título y descripción son obligatorios');
      return;
    }

    setCargando(true);
    try {
      const datosOferta = {
        ...formulario,
        requisitos: formulario.requisitos.filter(req => req.trim()),
        fechaLimite: new Date(formulario.fechaLimite),
        fechaPublicacion: oferta?.fechaPublicacion || new Date(),
        comunidadId: configuracion.codigo,
        activa: true
      };

      await onGuardar(datosOferta);
      onCerrar();
    } catch (error) {
      console.error('Error guardando oferta:', error);
      alert('Error al guardar la oferta');
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
              {esEdicion ? 'Editar Oferta' : 'Crear Nueva Oferta'}
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
                Título del puesto *
              </label>
              <input
                type="text"
                value={formulario.titulo}
                onChange={(e) => actualizarFormulario('titulo', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Técnico/a de Administración General"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organización
              </label>
              <input
                type="text"
                value={formulario.organizacion}
                onChange={(e) => actualizarFormulario('organizacion', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Ayuntamiento de Barcelona"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <select
                value={formulario.ubicacion}
                onChange={(e) => actualizarFormulario('ubicacion', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona ubicación</option>
                {configuracion.provincias?.map(provincia => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
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
                <option value="administracion-general">Administración General</option>
                <option value="sanidad">Sanidad</option>
                <option value="educacion">Educación</option>
                <option value="seguridad">Seguridad</option>
                <option value="justicia">Justicia</option>
                <option value="tecnica">Técnica</option>
                <option value="otras">Otras</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de oferta
              </label>
              <select
                value={formulario.tipo}
                onChange={(e) => actualizarFormulario('tipo', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="oposicion">Oposición</option>
                <option value="bolsa-trabajo">Bolsa de trabajo</option>
                <option value="interinidad">Interinidad</option>
                <option value="concurso-traslados">Concurso de traslados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de plazas
              </label>
              <input
                type="number"
                value={formulario.plazas}
                onChange={(e) => actualizarFormulario('plazas', parseInt(e.target.value))}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha límite
              </label>
              <input
                type="date"
                value={formulario.fechaLimite}
                onChange={(e) => actualizarFormulario('fechaLimite', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
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
                <option value="presencial">Presencial</option>
                <option value="remoto">Remoto</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del puesto *
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => actualizarFormulario('descripcion', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe las funciones, responsabilidades y detalles del puesto..."
            />
          </div>

          {/* Salario */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información salarial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salario mínimo (€/año)
                </label>
                <input
                  type="number"
                  value={formulario.salario.minimo}
                  onChange={(e) => actualizarFormulario('salario.minimo', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salario máximo (€/año)
                </label>
                <input
                  type="number"
                  value={formulario.salario.maximo}
                  onChange={(e) => actualizarFormulario('salario.maximo', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Requisitos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Requisitos del puesto
              </label>
              <button
                type="button"
                onClick={agregarRequisito}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Agregar requisito</span>
              </button>
            </div>
            <div className="space-y-3">
              {formulario.requisitos.map((requisito, indice) => (
                <div key={indice} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={requisito}
                    onChange={(e) => actualizarRequisito(indice, e.target.value)}
                    placeholder={`Requisito ${indice + 1}`}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formulario.requisitos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarRequisito(indice)}
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
              {esEdicion ? 'Actualizar' : 'Publicar'} Oferta
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de gestión de candidatos
const GestionCandidatos: React.FC<PropiedadesGestionCandidatos> = ({
  candidatos,
  ofertas,
  onGestionarCandidato
}) => {
  const [filtroOferta, setFiltroOferta] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<'pendiente' | 'revisando' | 'aprobado' | 'rechazado' | 'contactado' | 'archivado' | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');

  const candidatosFiltrados = candidatos.filter(candidato => {
    const coincideBusqueda = candidato.usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            candidato.usuario.apellidos.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideOferta = filtroOferta === 'todas' || candidato.ofertaId === filtroOferta;
    const coincideEstado = filtroEstado === 'todos' || candidato.estado === filtroEstado;
    
    return coincideBusqueda && coincideOferta && coincideEstado;
  });

  const obtenerColorEstado = (estado: 'pendiente' | 'revisando' | 'aprobado' | 'rechazado' | 'contactado' | 'archivado') => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'revisando': return 'bg-blue-100 text-blue-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'contactado': return 'bg-purple-100 text-purple-800';
      case 'archivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar candidatos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <select
          value={filtroOferta}
          onChange={(e) => setFiltroOferta(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todas">Todas las ofertas</option>
          {ofertas.map(oferta => (
            <option key={oferta.id} value={oferta.id}>{oferta.titulo}</option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="revisando">En revisión</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
          <option value="contactado">Contactados</option>
          <option value="archivado">Archivados</option>
        </select>
      </div>

      {/* Lista de candidatos */}
      <div className="space-y-4">
        {candidatosFiltrados.map(candidato => {
          const oferta = ofertas.find(o => o.id === candidato.ofertaId);
          
          return (
            <div key={candidato.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={candidato.usuario.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidato.usuario.nombre + ' ' + candidato.usuario.apellidos)}&background=random`}
                    alt={`${candidato.usuario.nombre} ${candidato.usuario.apellidos}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {candidato.usuario.nombre} {candidato.usuario.apellidos}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obtenerColorEstado(candidato.estado)}`}>
                        {candidato.estado}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {candidato.usuario.perfil?.cargo || candidato.usuario.tipo.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Aplicó para: <strong>{oferta?.titulo}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      <Clock size={14} className="inline mr-1" />
                      {candidato.fechaAplicacion.toLocaleDateString()} a las {candidato.fechaAplicacion.toLocaleTimeString()}
                    </p>
                    
                    {candidato.mensaje && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Mensaje del candidato:</strong> {candidato.mensaje}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {candidato.estado === 'pendiente' && (
                    <>
                      <Boton
                        variante="primario"
                        tamaño="sm"
                        onClick={() => onGestionarCandidato(candidato.id, 'aprobar')}
                        icono={<CheckCircle size={14} />}
                      >
                        Aprobar
                      </Boton>
                      <Boton
                        variante="secundario"
                        tamaño="sm"
                        onClick={() => onGestionarCandidato(candidato.id, 'rechazar')}
                        icono={<XCircle size={14} />}
                      >
                        Rechazar
                      </Boton>
                    </>
                  )}
                  
                  {(candidato.estado === 'aprobado' || candidato.estado === 'revisando') && (
                    <Boton
                      variante="primario"
                      tamaño="sm"
                      onClick={() => onGestionarCandidato(candidato.id, 'contactar')}
                      icono={<Send size={14} />}
                    >
                      Contactar
                    </Boton>
                  )}

                  <button
                    onClick={() => onGestionarCandidato(candidato.id, 'archivar')}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Archivar"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {candidatosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay candidatos
          </h3>
          <p className="text-gray-600">
            {busqueda ? 'No se encontraron candidatos con esos criterios' : 'Aún no tienes candidatos para tus ofertas'}
          </p>
        </div>
      )}
    </div>
  );
};

// Componente de analytics
const Analytics: React.FC<PropiedadesAnalytics> = ({ estadisticas, empresa }) => {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const metricas = [
    {
      titulo: 'Visitas al perfil',
      valor: estadisticas.visitasPerfilMes,
      cambio: '+12%',
      tendencia: 'positiva',
      icono: <Eye size={24} />,
      color: 'blue'
    },
    {
      titulo: 'Nuevos seguidores',
      valor: estadisticas.seguidoresMes,
      cambio: '+8%',
      tendencia: 'positiva',
      icono: <UserPlus size={24} />,
      color: 'green'
    },
    {
      titulo: 'Candidatos recibidos',
      valor: estadisticas.candidatosMes,
      cambio: '+15%',
      tendencia: 'positiva',
      icono: <Users size={24} />,
      color: 'purple'
    },
    {
      titulo: 'Tasa de respuesta',
      valor: `${estadisticas.tasaRespuesta}%`,
      cambio: '+5%',
      tendencia: 'positiva',
      icono: <MessageCircle size={24} />,
      color: 'orange'
    }
  ];

  const obtenerColorMetrica = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de período */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Analytics del perfil</h3>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="1y">Último año</option>
        </select>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, indice) => (
          <div key={indice} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${obtenerColorMetrica(metrica.color)} text-white`}>
                {metrica.icono}
              </div>
              <div className={`text-sm font-medium ${
                metrica.tendencia === 'positiva' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metrica.cambio}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600">{metrica.titulo}</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrica.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ofertas más populares */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Ofertas más populares</h4>
        <div className="space-y-4">
          {estadisticas.topOfertas.map((oferta, indice) => (
            <div key={oferta.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                  {indice + 1}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{oferta.titulo}</h5>
                  <p className="text-sm text-gray-600">{oferta.candidatos} candidatos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{oferta.vistas} vistas</p>
                <p className="text-xs text-gray-500">Último mes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de tendencias (simulado) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tendencias de actividad</h4>
        <div className="h-64 flex items-end justify-center space-x-2">
          {estadisticas.trendsData.map((data, indice) => (
            <div key={indice} className="flex flex-col items-center space-y-2">
              <div 
                className="bg-blue-500 rounded-t"
                style={{ 
                  width: '20px', 
                  height: `${(data.visitas / Math.max(...estadisticas.trendsData.map(d => d.visitas))) * 200}px` 
                }}
              />
              <span className="text-xs text-gray-500 transform -rotate-45">{data.fecha}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Visitas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Candidatos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del dashboard
export const DashboardEmpresa: React.FC<PropiedadesDashboardEmpresa> = ({
  empresa,
  ofertas,
  candidatos,
  conversaciones,
  estadisticas,
  onCrearOferta,
  onActualizarOferta,
  onEliminarOferta,
  onGestionarCandidato,
  onActualizarPerfil
}) => {
  const { configuracion } = useComunidad();
  const [pestaña, setPestaña] = useState<'resumen' | 'ofertas' | 'candidatos' | 'analytics' | 'mensajes' | 'configuracion'>('resumen');
  const [formularioOfertaAbierto, setFormularioOfertaAbierto] = useState(false);
  const [ofertaEditando, setOfertaEditando] = useState<OfertaTrabajo | undefined>();

  const pestañas = [
    { id: 'resumen', nombre: 'Resumen', icono: <BarChart3 size={16} /> },
    { id: 'ofertas', nombre: 'Ofertas', icono: <Briefcase size={16} /> },
    { id: 'candidatos', nombre: 'Candidatos', icono: <Users size={16} /> },
    { id: 'analytics', nombre: 'Analytics', icono: <TrendingUp size={16} /> },
    { id: 'mensajes', nombre: 'Mensajes', icono: <MessageCircle size={16} /> },
    { id: 'configuracion', nombre: 'Configuración', icono: <Settings size={16} /> }
  ];

  const manejarCrearOferta = async (datosOferta: Partial<OfertaTrabajo>) => {
    try {
      await onCrearOferta(datosOferta);
      setFormularioOfertaAbierto(false);
    } catch (error) {
      console.error('Error creando oferta:', error);
    }
  };

  const manejarEditarOferta = async (datosOferta: Partial<OfertaTrabajo>) => {
    if (!ofertaEditando) return;
    
    try {
      await onActualizarOferta(ofertaEditando.id, datosOferta);
      setFormularioOfertaAbierto(false);
      setOfertaEditando(undefined);
    } catch (error) {
      console.error('Error actualizando oferta:', error);
    }
  };

  const renderizarContenido = () => {
    switch (pestaña) {
      case 'resumen':
        return (
          <div className="space-y-6">
            {/* Header de bienvenida */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-4">
                <img
                  src={empresa.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(empresa.nombre)}&background=random`}
                  alt={empresa.nombre}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white"
                />
                <div>
                  <h1 className="text-2xl font-bold">{empresa.nombre}</h1>
                  <p className="text-blue-100">{empresa.perfil?.cargo || 'Organización Pública'}</p>
                  <p className="text-blue-200 text-sm">
                    <MapPin size={14} className="inline mr-1" />
                    {empresa.perfil?.ubicacion || configuracion.nombre}
                  </p>
                </div>
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ofertas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.ofertasActivas}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Briefcase size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Candidatos (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.candidatosMes}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tasa Respuesta</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.tasaRespuesta}%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageCircle size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.tiempoMedioRespuesta}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Boton
                  variante="primario"
                  onClick={() => setFormularioOfertaAbierto(true)}
                  icono={<Plus size={16} />}
                  className="justify-center"
                >
                  Nueva Oferta
                </Boton>
                <Boton
                  variante="secundario"
                  onClick={() => setPestaña('candidatos')}
                  icono={<Users size={16} />}
                  className="justify-center"
                >
                  Ver Candidatos
                </Boton>
                <Boton
                  variante="ghost"
                  onClick={() => setPestaña('analytics')}
                  icono={<TrendingUp size={16} />}
                  className="justify-center"
                >
                  Ver Analytics
                </Boton>
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad reciente</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nuevo candidato</p>
                    <p className="text-xs text-gray-500">María García aplicó para Técnico Administrativo</p>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2h</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Perfil visitado</p>
                    <p className="text-xs text-gray-500">15 nuevas visitas a tu perfil</p>
                  </div>
                  <span className="text-xs text-gray-500">Hoy</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ofertas':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Ofertas</h2>
              <Boton
                variante="primario"
                onClick={() => setFormularioOfertaAbierto(true)}
                icono={<Plus size={16} />}
              >
                Nueva Oferta
              </Boton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ofertas.map(oferta => (
                <div key={oferta.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{oferta.titulo}</h3>
                      <p className="text-gray-600 mb-2">{oferta.organizacion}</p>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{oferta.descripcion}</p>
                    </div>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Candidatos</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {candidatos.filter(c => c.ofertaId === oferta.id).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha límite</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {oferta.fechaLimite?.toLocaleDateString?.() || 'No definida'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Boton
                      variante="secundario"
                      tamaño="sm"
                      onClick={() => {
                        setOfertaEditando(oferta);
                        setFormularioOfertaAbierto(true);
                      }}
                      icono={<Edit size={14} />}
                    >
                      Editar
                    </Boton>
                    <button
                      onClick={() => onEliminarOferta(oferta.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'candidatos':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Candidatos</h2>
            <GestionCandidatos
              candidatos={candidatos}
              ofertas={ofertas}
              onGestionarCandidato={onGestionarCandidato}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            <Analytics estadisticas={estadisticas} empresa={empresa} />
          </div>
        );

      case 'mensajes':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Centro de Mensajes</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sistema de mensajería integrado
              </h3>
              <p className="text-gray-600 mb-6">
                Gestiona todas tus conversaciones con candidatos y administradores desde aquí
              </p>
              <Boton variante="primario" icono={<MessageCircle size={16} />}>
                Abrir Mensajes
              </Boton>
            </div>
          </div>
        );

      case 'configuracion':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Configuración del Perfil</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la organización
                  </label>
                  <input
                    type="text"
                    value={empresa.nombre}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sector
                  </label>
                  <input
                    type="text"
                    value={empresa.perfil?.cargo || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={empresa.perfil?.biografia || ''}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Boton variante="primario">
                  Guardar Cambios
                </Boton>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 overflow-x-auto">
            {pestañas.map(tab => (
              <button
                key={tab.id}
                onClick={() => setPestaña(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  pestaña === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icono}
                <span>{tab.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderizarContenido()}
      </div>

      {/* Modal de formulario de oferta */}
      <FormularioOferta
        abierto={formularioOfertaAbierto}
        onCerrar={() => {
          setFormularioOfertaAbierto(false);
          setOfertaEditando(undefined);
        }}
        onGuardar={ofertaEditando ? manejarEditarOferta : manejarCrearOferta}
        oferta={ofertaEditando}
        esEdicion={!!ofertaEditando}
      />
    </div>
  );
};

export default DashboardEmpresa;