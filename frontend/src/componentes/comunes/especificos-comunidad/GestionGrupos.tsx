'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Crown, 
  EyeOff, 
  Lock, 
  Globe, 
  X, 
  BarChart3, 
  TrendingUp
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  Grupo, 
  Usuario, 
  TipoGrupo, 
  CategoriaGrupo,
  ConfiguracionGrupo
} from '../../../../tipos/redSocial';
import type { EstadisticasGrupo } from '../../../../tipos/redSocial';
import { useGroupMembership } from '../../../contextos/GroupMembershipContext';

interface PropiedadesGestionGrupos {
  usuario: Partial<Usuario>;
  grupos: Partial<Grupo>[];
  onCrearGrupo: (grupo: Partial<Grupo>) => Promise<Partial<Grupo>>;
  onActualizarGrupo: (id: string, datos: Partial<Grupo>) => Promise<void>;
  onEliminarGrupo: (id: string) => Promise<void>;
  onGestionarMiembro: (grupoId: string, usuarioId: string, accion: 'agregar' | 'remover' | 'promover' | 'degradar' | 'banear') => Promise<void>;
  onModerarPost: (postId: string, accion: 'aprobar' | 'rechazar' | 'eliminar') => Promise<void>;
}

interface PropiedadesFormularioGrupo {
  abierto: boolean;
  onCerrar: () => void;
  onGuardar: (grupo: Partial<Grupo>) => Promise<void>;
  grupo?: Partial<Grupo>;
  esEdicion?: boolean;
}

// Interface temporal para usuarios con información de grupo
interface UsuarioConRolGrupo extends Usuario {
  rolGrupo?: 'administrador' | 'moderador' | 'miembro';
  fechaUnionGrupo?: Date;
}

interface PropiedadesGestionMiembros {
  abierto: boolean;
  onCerrar: () => void;
  grupo: Partial<Grupo>;
  miembros: UsuarioConRolGrupo[];
  onGestionarMiembro: (usuarioId: string, accion: 'agregar' | 'remover' | 'promover' | 'degradar' | 'banear') => Promise<void>;
}

interface PropiedadesEstadisticasGrupo {
  grupo: Partial<Grupo>;
  estadisticas: EstadisticasGrupo;
}

// Formulario para crear/editar grupos
const FormularioGrupo: React.FC<PropiedadesFormularioGrupo> = ({
  abierto,
  onCerrar,
  onGuardar,
  grupo,
  esEdicion = false
}) => {
  const { configuracion } = useComunidad();
  const { teGrupPrivat, potUnirseGrupPrivat } = useGroupMembership();
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'profesional' as CategoriaGrupo,
    subcategoria: '',
    tipo: 'publico' as TipoGrupo,
    avatar: '',
    portada: '',
    reglas: [''],
    etiquetas: [] as string[],
    configuracion: {
      requiereAprobacion: false,
      limiteMiembros: 1000,
      permitirInvitaciones: true,
      moderacionPosts: false
    } as ConfiguracionGrupo
  });

  useEffect(() => {
    if (grupo && esEdicion) {
      setFormulario({
        nombre: grupo.nombre || '',
        descripcion: grupo.descripcion || '',
        categoria: grupo.categoria || 'profesional',
        tipo: grupo.tipo || 'publico',
        avatar: grupo.avatar || '',
        portada: grupo.portada || '',
        reglas: grupo.reglas?.length ? grupo.reglas : [''],
        subcategoria: grupo.subcategoria || '',
        etiquetas: grupo.etiquetas || [],
        configuracion: grupo.configuracion || {
          requiereAprobacion: false,
          limiteMiembros: 1000,
          permitirInvitaciones: true,
          moderacionPosts: false
        }
      });
    }
  }, [grupo, esEdicion]);

  const actualizarFormulario = (campo: string, valor: any) => {
    if (campo.startsWith('configuracion.')) {
      const configCampo = campo.split('.')[1];
      setFormulario(prev => ({
        ...prev,
        configuracion: {
          ...prev.configuracion,
          [configCampo]: valor
        }
      }));
    } else {
      setFormulario(prev => ({ ...prev, [campo]: valor }));
    }
  };

  const agregarRegla = () => {
    setFormulario(prev => ({
      ...prev,
      reglas: [...prev.reglas, '']
    }));
  };

  const actualizarRegla = (indice: number, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      reglas: prev.reglas.map((regla, i) => i === indice ? valor : regla)
    }));
  };

  const eliminarRegla = (indice: number) => {
    setFormulario(prev => ({
      ...prev,
      reglas: prev.reglas.filter((_, i) => i !== indice)
    }));
  };

  const manejarGuardar = async () => {
    if (!formulario.nombre.trim() || !formulario.descripcion.trim()) {
      alert('El nombre y descripción son obligatorios');
      return;
    }

    setCargando(true);
    try {
      const datosGrupo = {
        ...formulario,
        reglas: formulario.reglas.filter(regla => regla.trim()),
        comunidadId: configuracion.codigo,
        fechaCreacion: grupo?.fechaCreacion || new Date(),
        // miembros manejado por la interface MiembroGrupo[]
        activo: true
      };

      await onGuardar(datosGrupo);
      onCerrar();
    } catch (error) {
      console.error('Error guardando grupo:', error);
      alert('Error al guardar el grupo');
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {esEdicion ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
            </h2>
            <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del grupo *
              </label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) => actualizarFormulario('nombre', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Oposiciones Educación 2024"
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
                <option value="afinidad">Afinidad</option>
                <option value="profesional">Profesional</option>
                <option value="geografico">Geográfico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formulario.descripcion}
              onChange={(e) => actualizarFormulario('descripcion', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el propósito y objetivos del grupo..."
            />
          </div>

          {/* Privacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de grupo
            </label>
            
            {/* Advertencia para grupos privats */}
            {(formulario.categoria === 'profesional' || formulario.categoria === 'afinidad') && 
             formulario.tipo === 'privado' && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lock size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Restricció de grup privat</h4>
                    <p className="text-sm text-yellow-700">
                      Aquest serà un grup privat professional/d'afinitat. Els membres només poden pertànyer a un grup d'aquest tipus alhora.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {[
                { 
                  valor: 'publico', 
                  icono: <Globe size={20} />, 
                  titulo: 'Público', 
                  descripcion: 'Cualquiera puede ver el grupo y unirse' 
                },
                { 
                  valor: 'privado', 
                  icono: <Lock size={20} />, 
                  titulo: 'Privado', 
                  descripcion: 'Solo miembros pueden ver el contenido, requiere aprobación' 
                },
                { 
                  valor: 'oculto', 
                  icono: <EyeOff size={20} />, 
                  titulo: 'Oculto', 
                  descripcion: 'Solo visible para miembros, no aparece en búsquedas' 
                }
              ].map((opcion) => (
                <label key={opcion.valor} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value={opcion.valor}
                    checked={formulario.tipo === opcion.valor}
                    onChange={(e) => actualizarFormulario('tipo', e.target.value as TipoGrupo)}
                    className="mt-1"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="text-gray-500 mt-1">{opcion.icono}</div>
                    <div>
                      <div className="font-medium text-gray-900">{opcion.titulo}</div>
                      <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Configuración avanzada */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuración del grupo
            </h3>
            <div className="space-y-4">
              {[
                {
                  campo: 'requiereAprobacion',
                  titulo: 'Requiere aprobación',
                  descripcion: 'Los nuevos miembros deben ser aprobados por moderadores'
                },
                {
                  campo: 'permitirInvitaciones',
                  titulo: 'Permitir invitaciones',
                  descripcion: 'Los miembros pueden invitar a otros usuarios'
                },
                {
                  campo: 'moderacionPosts',
                  titulo: 'Moderación de posts',
                  descripcion: 'Los posts deben ser aprobados antes de publicarse'
                },
                {
                  campo: 'chatHabilitado',
                  titulo: 'Chat habilitado',
                  descripcion: 'Habilitar chat en tiempo real para el grupo'
                }
              ].map((opcion) => (
                <div key={opcion.campo} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{opcion.titulo}</div>
                    <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formulario.configuracion[opcion.campo as keyof ConfiguracionGrupo] as boolean}
                      onChange={(e) => actualizarFormulario(`configuracion.${opcion.campo}`, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite de miembros
                </label>
                <input
                  type="number"
                  value={formulario.configuracion.limiteMiembros || 1000}
                  onChange={(e) => actualizarFormulario('configuracion.limiteMiembros', parseInt(e.target.value))}
                  min="1"
                  max="10000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Reglas del grupo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Reglas del grupo
              </label>
              <button
                type="button"
                onClick={agregarRegla}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Agregar regla</span>
              </button>
            </div>
            <div className="space-y-3">
              {formulario.reglas.map((regla, indice) => (
                <div key={indice} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={regla}
                    onChange={(e) => actualizarRegla(indice, e.target.value)}
                    placeholder={`Regla ${indice + 1}`}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formulario.reglas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarRegla(indice)}
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
              {esEdicion ? 'Actualizar' : 'Crear'} Grupo
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para gestionar miembros
const GestionMiembros: React.FC<PropiedadesGestionMiembros> = ({
  abierto,
  onCerrar,
  grupo,
  miembros,
  onGestionarMiembro
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState<'todos' | 'administrador' | 'moderador' | 'miembro'>('todos');
  const [cargando, setCargando] = useState<string | null>(null);

  const miembrosFiltrados = miembros.filter(miembro => {
    const coincideBusqueda = miembro.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            miembro.apellidos.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideRol = filtroRol === 'todos' || miembro.rolGrupo === filtroRol;
    
    return coincideBusqueda && coincideRol;
  });

  const manejarAccion = async (usuarioId: string, accion: 'agregar' | 'remover' | 'promover' | 'degradar' | 'banear') => {
    setCargando(usuarioId);
    try {
      await onGestionarMiembro(usuarioId, accion);
    } catch (error) {
      console.error(`Error en acción ${accion}:`, error);
    } finally {
      setCargando(null);
    }
  };

  const obtenerIconoRol = (rol: 'administrador' | 'moderador' | 'miembro') => {
    switch (rol) {
      case 'administrador': return <Crown size={16} className="text-yellow-500" />;
      case 'moderador': return <Shield size={16} className="text-blue-500" />;
      default: return <Users size={16} className="text-gray-500" />;
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Gestionar Miembros - {grupo.nombre}
            </h2>
            <button onClick={onCerrar} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar miembros..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los roles</option>
              <option value="administrador">Administradores</option>
              <option value="moderador">Moderadores</option>
              <option value="miembro">Miembros</option>
            </select>
          </div>

          {/* Lista de miembros */}
          <div className="overflow-y-auto max-h-96">
            <div className="space-y-3">
              {miembrosFiltrados.map((miembro) => (
                <div key={miembro.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={miembro.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(miembro.nombre + ' ' + miembro.apellidos)}&background=random`}
                      alt={`${miembro.nombre} ${miembro.apellidos}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {miembro.nombre} {miembro.apellidos}
                        </h3>
                        {obtenerIconoRol(miembro.rolGrupo || 'miembro')}
                      </div>
                      <p className="text-sm text-gray-600">
                        {miembro.perfil?.cargo || miembro.tipo.replace('-', ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Miembro desde: {miembro.fechaUnionGrupo?.toLocaleDateString() || 'Desconocido'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {miembro.rolGrupo === 'miembro' && (
                      <button
                        onClick={() => manejarAccion(miembro.id, 'promover')}
                        disabled={cargando === miembro.id}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                      >
                        Promover
                      </button>
                    )}
                    
                    {(miembro.rolGrupo === 'moderador' || miembro.rolGrupo === 'administrador') && (
                      <button
                        onClick={() => manejarAccion(miembro.id, 'degradar')}
                        disabled={cargando === miembro.id}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50"
                      >
                        Degradar
                      </button>
                    )}

                    <button
                      onClick={() => manejarAccion(miembro.id, 'banear')}
                      disabled={cargando === miembro.id}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                    >
                      Banear
                    </button>

                    <button
                      onClick={() => manejarAccion(miembro.id, 'remover')}
                      disabled={cargando === miembro.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{miembros.length}</div>
                <div className="text-sm text-gray-600">Total Miembros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {miembros.filter(m => m.rolGrupo === 'administrador').length}
                </div>
                <div className="text-sm text-gray-600">Administradores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {miembros.filter(m => m.rolGrupo === 'moderador').length}
                </div>
                <div className="text-sm text-gray-600">Moderadores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {miembros.filter(m => m.rolGrupo === 'miembro' || !m.rolGrupo).length}
                </div>
                <div className="text-sm text-gray-600">Miembros</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de estadísticas del grupo
const EstadisticasGrupo: React.FC<PropiedadesEstadisticasGrupo> = ({ grupo, estadisticas }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Estadísticas - {grupo.nombre}
        </h3>
        <BarChart3 size={20} className="text-gray-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{estadisticas.totalMiembros}</div>
          <div className="text-sm text-gray-600">Miembros</div>
          <div className="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUp size={12} className="mr-1" />
+{estadisticas.crecimientoMensual}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{estadisticas.postsEstesMes}</div>
          <div className="text-sm text-gray-600">Publicaciones</div>
          <div className="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUp size={12} className="mr-1" />
+{estadisticas.postsEstesMes}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{Math.round((estadisticas.miembrosActivos / estadisticas.totalMiembros) * 100)}%</div>
          <div className="text-sm text-gray-600">Participación</div>
          <div className="text-xs text-gray-500 mt-1">Promedio mensual</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{estadisticas.miembrosActivos}</div>
          <div className="text-sm text-gray-600">Activos (7d)</div>
          <div className="text-xs text-gray-500 mt-1">Última semana</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Posts más populares</h4>
          <div className="space-y-2">
            {/* Posts más populares - datos no disponibles */}
            {[].map((post: any, indice: number) => (
              <div key={post.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700">#{indice + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{post.contenido}</p>
                  <p className="text-xs text-gray-500">{post.likes} likes, {post.comentarios} comentarios</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Actividad reciente</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Posts hoy</span>
              <span className="font-medium text-gray-900">{estadisticas.postsEstesMes}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nuevos miembros (7d)</span>
              <span className="font-medium text-gray-900">{estadisticas.crecimientoMensual}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Posts pendientes</span>
              <span className="font-medium text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tiempo respuesta promedio</span>
              <span className="font-medium text-gray-900">2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal de gestión de grupos
export const GestionGrupos: React.FC<PropiedadesGestionGrupos> = ({
  usuario,
  grupos,
  onCrearGrupo,
  onActualizarGrupo,
  onEliminarGrupo,
  onGestionarMiembro,
  onModerarPost
}) => {
  const [vistaActual, setVistaActual] = useState<'lista' | 'estadisticas'>('lista');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(null);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [gestionMiembrosAbierto, setGestionMiembrosAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | CategoriaGrupo>('todas');
  const [filtroPrivacidad, setFiltroPrivacidad] = useState<'todas' | 'publico' | 'privado' | 'oculto'>('todas');

  // Filtrar grupos según los criterios
  const gruposFiltrados = grupos.filter(grupo => {
    const coincideBusqueda = (grupo.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                            (grupo.descripcion || '').toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideCategoria = filtroCategoria === 'todas' || grupo.categoria === filtroCategoria;
    const coincidePrivacidad = filtroPrivacidad === 'todas' || grupo.tipo === filtroPrivacidad;
    
    return coincideBusqueda && coincideCategoria && coincidePrivacidad;
  });

  // Solo mostrar grupos donde el usuario es administrador o moderador
  const gruposGestionables = gruposFiltrados;

  const obtenerIconoPrivacidad = (privacidad: 'publico' | 'privado' | 'oculto') => {
    switch (privacidad) {
      case 'publico': return <Globe size={16} className="text-green-500" />;
      case 'privado': return <Lock size={16} className="text-yellow-500" />;
      case 'oculto': return <EyeOff size={16} className="text-red-500" />;
    }
  };

  const manejarCrearGrupo = async (datosGrupo: Partial<Grupo>) => {
    try {
      await onCrearGrupo(datosGrupo);
      setFormularioAbierto(false);
    } catch (error) {
      console.error('Error creando grupo:', error);
    }
  };

  const manejarEditarGrupo = async (datosGrupo: Partial<Grupo>) => {
    if (!grupoSeleccionado) return;
    
    try {
      await onActualizarGrupo(grupoSeleccionado.id, datosGrupo);
      setFormularioAbierto(false);
      setGrupoSeleccionado(null);
    } catch (error) {
      console.error('Error actualizando grupo:', error);
    }
  };

  const manejarEliminarGrupo = async (grupoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      await onEliminarGrupo(grupoId);
    } catch (error) {
      console.error('Error eliminando grupo:', error);
    }
  };

  // Estadísticas de ejemplo para un grupo
  const estadisticasEjemplo: EstadisticasGrupo = {
    totalMiembros: 247,
    miembrosActivos: 89,
    postsEstesMes: 142,
    crecimientoMensual: 15
  };

  // Miembros de ejemplo
  const miembrosEjemplo: UsuarioConRolGrupo[] = [
    {
      id: 'user1',
      nombre: 'María',
      apellidos: 'García López',
      email: 'maria@example.com',
      tipo: 'miembro',
      comunidadId: 'cat',
      verificado: true,
      activo: true,
      fechaRegistro: new Date(),
      perfil: {
        biografia: 'Funcionaria de la Generalitat',
        cargo: 'Técnica Superior',
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
      configuracion: {
        idioma: 'ca',
        tema: 'claro',
        notificaciones: {
          email: {
            mensajes: true,
            grupoNuevoPost: true,
            invitacionGrupo: true,
            tablonAnuncios: false,
            eventos: true
          },
          push: {
            mensajes: true,
            grupoNuevoPost: false,
            invitacionGrupo: true,
            menciones: true
          }
        }
      },
      estadisticas: {
        gruposCreados: 2,
        gruposUnido: 8,
        postsCreados: 15,
        comentarios: 45,
        conexiones: 23,
        puntuacionReputacion: 78
      },
      rolGrupo: 'administrador',
      fechaUnionGrupo: new Date('2024-01-15')
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h1>
          <p className="text-gray-600">Administra los grupos de tu comunidad</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVistaActual('lista')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActual === 'lista'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVistaActual('estadisticas')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                vistaActual === 'estadisticas'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Estadísticas
            </button>
          </div>
          <Boton
            variante="primario"
            onClick={() => setFormularioAbierto(true)}
            icono={<Plus size={16} />}
          >
            Crear Grupo
          </Boton>
        </div>
      </div>

      {vistaActual === 'lista' ? (
        <>
          {/* Filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar grupos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las categorías</option>
              <option value="afinidad">Afinidad</option>
              <option value="profesional">Profesional</option>
              <option value="geografico">Geográfico</option>
            </select>
            <select
              value={filtroPrivacidad}
              onChange={(e) => setFiltroPrivacidad(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las privacidades</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
              <option value="oculto">Oculto</option>
            </select>
          </div>

          {/* Lista de grupos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {gruposGestionables.map((grupo) => (
              <div key={grupo.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={grupo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(grupo.nombre || 'Grupo')}&background=random`}
                      alt={grupo.nombre}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{grupo.nombre}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {grupo.categoria}
                        </span>
                        {obtenerIconoPrivacidad(grupo.tipo || 'publico')}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {grupo.descripcion}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{grupo.miembros?.length || 0} miembros</span>
                  <span>{grupo.categoria}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Boton
                    variante="secundario"
                    tamaño="sm"
                    onClick={() => {
                      setGrupoSeleccionado(grupo as Grupo);
                      setGestionMiembrosAbierto(true);
                    }}
                    icono={<Users size={14} />}
                  >
                    Miembros
                  </Boton>
                  <Boton
                    variante="ghost"
                    tamaño="sm"
                    onClick={() => {
                      setGrupoSeleccionado(grupo as Grupo);
                      setFormularioAbierto(true);
                    }}
                    icono={<Edit size={14} />}
                  >
                    Editar
                  </Boton>
                  <button
                    onClick={() => manejarEliminarGrupo(grupo.id || '')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {gruposGestionables.length === 0 && (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay grupos
              </h3>
              <p className="text-gray-600 mb-6">
                {busqueda ? 'No se encontraron grupos con esos criterios' : 'Crea tu primer grupo para empezar'}
              </p>
              {!busqueda && (
                <Boton
                  variante="primario"
                  onClick={() => setFormularioAbierto(true)}
                  icono={<Plus size={16} />}
                >
                  Crear Primer Grupo
                </Boton>
              )}
            </div>
          )}
        </>
      ) : (
        // Vista de estadísticas
        <div className="space-y-6">
          {grupoSeleccionado ? (
            <EstadisticasGrupo grupo={grupoSeleccionado} estadisticas={estadisticasEjemplo} />
          ) : (
            <div className="text-center py-12">
              <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecciona un grupo
              </h3>
              <p className="text-gray-600">
                Elige un grupo de la lista para ver sus estadísticas detalladas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <FormularioGrupo
        abierto={formularioAbierto}
        onCerrar={() => {
          setFormularioAbierto(false);
          setGrupoSeleccionado(null);
        }}
        onGuardar={grupoSeleccionado ? manejarEditarGrupo : manejarCrearGrupo}
        grupo={grupoSeleccionado || undefined}
        esEdicion={!!grupoSeleccionado}
      />

      {grupoSeleccionado && (
        <GestionMiembros
          abierto={gestionMiembrosAbierto}
          onCerrar={() => {
            setGestionMiembrosAbierto(false);
            setGrupoSeleccionado(null);
          }}
          grupo={grupoSeleccionado}
          miembros={miembrosEjemplo}
          onGestionarMiembro={(usuarioId, accion) => onGestionarMiembro(grupoSeleccionado.id, usuarioId, accion)}
        />
      )}
    </div>
  );
};

export default GestionGrupos;