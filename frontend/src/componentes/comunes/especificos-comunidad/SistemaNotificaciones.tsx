'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Heart, 
  MessageCircle, 
  Share, 
  UserPlus, 
  Calendar, 
  Briefcase, 
  Users, 
  Settings, 
  Trash2,
  Filter,
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { useComunidad } from '../../../../hooks/useComunidad';
import { Boton } from './ui/Boton';
import { 
  Notificacion, 
  TipoNotificacion, 
  Usuario 
} from '../../../../tipos/redSocial';

interface PropiedadesSistemaNotificaciones {
  usuario: Usuario;
  notificaciones: Notificacion[];
  onMarcarLeida: (notificacionId: string) => Promise<void>;
  onMarcarTodasLeidas: () => Promise<void>;
  onEliminarNotificacion: (notificacionId: string) => Promise<void>;
  onActualizarConfiguracion: (config: ConfiguracionNotificaciones) => Promise<void>;
  configuracion: ConfiguracionNotificaciones;
}

interface ConfiguracionNotificaciones {
  likes: boolean;
  comentarios: boolean;
  compartidos: boolean;
  nuevosSeguidores: boolean;
  mensajes: boolean;
  eventos: boolean;
  ofertas: boolean;
  gruposActividad: boolean;
  gruposInvitaciones: boolean;
  email: boolean;
  push: boolean;
  sonido: boolean;
}

interface PropiedadesNotificationToast {
  notificacion: Notificacion;
  onCerrar: () => void;
  duracion?: number;
}

// Toast de notificación
const NotificationToast: React.FC<PropiedadesNotificationToast> = ({
  notificacion,
  onCerrar,
  duracion = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(onCerrar, duracion);
    return () => clearTimeout(timer);
  }, [onCerrar, duracion]);

  const obtenerIcono = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'reaccion-post': return <Heart size={16} className="text-red-500" />;
      case 'comentario-post': return <MessageCircle size={16} className="text-blue-500" />;
      case 'mensaje-nuevo': return <MessageCircle size={16} className="text-green-500" />;
      case 'invitacion-grupo': return <UserPlus size={16} className="text-purple-500" />;
      case 'evento-recordatorio': return <Calendar size={16} className="text-orange-500" />;
      case 'oferta-nueva': return <Briefcase size={16} className="text-indigo-500" />;
      case 'post-grupo': return <Users size={16} className="text-teal-500" />;
      case 'mencion': return <Bell size={16} className="text-yellow-500" />;
      case 'empresa-mensaje': return <Briefcase size={16} className="text-gray-500" />;
      case 'admin-comunicado': return <Bell size={16} className="text-red-600" />;
      case 'sistema': return <Bell size={16} className="text-blue-600" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in-right z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {obtenerIcono(notificacion.tipo)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {notificacion.titulo}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {notificacion.mensaje}
          </p>
        </div>
        <button
          onClick={onCerrar}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Componente principal del centro de notificaciones
export const CentroNotificaciones: React.FC<{
  abierto: boolean;
  onCerrar: () => void;
  usuario: Usuario;
  notificaciones: Notificacion[];
  onMarcarLeida: (id: string) => Promise<void>;
  onMarcarTodasLeidas: () => Promise<void>;
  onEliminarNotificacion: (id: string) => Promise<void>;
}> = ({
  abierto,
  onCerrar,
  usuario,
  notificaciones,
  onMarcarLeida,
  onMarcarTodasLeidas,
  onEliminarNotificacion
}) => {
  const { configuracion } = useComunidad();
  const [filtro, setFiltro] = useState<'todas' | 'no-leidas' | TipoNotificacion>('todas');
  const [cargando, setCargando] = useState(false);

  const notificacionesFiltradas = notificaciones.filter(notif => {
    if (filtro === 'todas') return true;
    if (filtro === 'no-leidas') return !notif.leida;
    return notif.tipo === filtro;
  });

  const noLeidasCount = notificaciones.filter(n => !n.leida).length;

  const obtenerIcono = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'reaccion-post': return <Heart size={20} className="text-red-500" />;
      case 'comentario-post': return <MessageCircle size={20} className="text-blue-500" />;
      case 'mensaje-nuevo': return <MessageCircle size={20} className="text-green-500" />;
      case 'invitacion-grupo': return <UserPlus size={20} className="text-purple-500" />;
      case 'evento-recordatorio': return <Calendar size={20} className="text-orange-500" />;
      case 'oferta-nueva': return <Briefcase size={20} className="text-indigo-500" />;
      case 'post-grupo': return <Users size={20} className="text-teal-500" />;
      case 'mencion': return <Bell size={20} className="text-yellow-500" />;
      case 'empresa-mensaje': return <Briefcase size={20} className="text-gray-500" />;
      case 'admin-comunicado': return <Bell size={20} className="text-red-600" />;
      case 'sistema': return <Bell size={20} className="text-blue-600" />;
      default: return <Bell size={20} className="text-gray-500" />;
    }
  };

  const formatearTiempo = (fecha: Date) => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    if (dias < 7) return `${dias}d`;
    return fecha.toLocaleDateString();
  };

  const manejarMarcarLeida = async (notificacionId: string) => {
    setCargando(true);
    try {
      await onMarcarLeida(notificacionId);
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    } finally {
      setCargando(false);
    }
  };

  const manejarMarcarTodasLeidas = async () => {
    setCargando(true);
    try {
      await onMarcarTodasLeidas();
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notificaciones
              </h2>
              {noLeidasCount > 0 && (
                <p className="text-sm text-gray-600">
                  {noLeidasCount} sin leer
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {noLeidasCount > 0 && (
                <Boton
                  variante="ghost"
                  tamaño="sm"
                  onClick={manejarMarcarTodasLeidas}
                  disabled={cargando}
                  icono={<CheckCheck size={16} />}
                >
                  Marcar todas
                </Boton>
              )}
              <button
                onClick={onCerrar}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filtro === 'todas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('no-leidas')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filtro === 'no-leidas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sin leer
            </button>
            <button
              onClick={() => setFiltro('reaccion-post')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filtro === 'reaccion-post'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reacciones
            </button>
            <button
              onClick={() => setFiltro('comentario-post')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filtro === 'comentario-post'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Comentarios
            </button>
            <button
              onClick={() => setFiltro('invitacion-grupo')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filtro === 'invitacion-grupo'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Grupos
            </button>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="overflow-y-auto max-h-[50vh]">
          {notificacionesFiltradas.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {filtro === 'todas' 
                  ? 'No tienes notificaciones'
                  : `No tienes notificaciones ${filtro === 'no-leidas' ? 'sin leer' : `de tipo "${filtro}"`}`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notificacionesFiltradas.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notificacion.leida ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {obtenerIcono(notificacion.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notificacion.titulo}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notificacion.mensaje}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatearTiempo(notificacion.fechaCreacion)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notificacion.leida && (
                        <button
                          onClick={() => manejarMarcarLeida(notificacion.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Marcar como leída"
                        >
                          <Check size={16} className="text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => onEliminarNotificacion(notificacion.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Eliminar notificación"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de configuración de notificaciones
export const ConfiguracionNotificaciones: React.FC<{
  abierto: boolean;
  onCerrar: () => void;
  configuracion: ConfiguracionNotificaciones;
  onActualizar: (config: ConfiguracionNotificaciones) => Promise<void>;
}> = ({
  abierto,
  onCerrar,
  configuracion,
  onActualizar
}) => {
  const [config, setConfig] = useState<ConfiguracionNotificaciones>(configuracion);
  const [cargando, setCargando] = useState(false);

  const actualizarConfig = (campo: keyof ConfiguracionNotificaciones, valor: boolean) => {
    setConfig(prev => ({ ...prev, [campo]: valor }));
  };

  const manejarGuardar = async () => {
    setCargando(true);
    try {
      await onActualizar(config);
      onCerrar();
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Configuración de Notificaciones
            </h2>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Tipos de notificación */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tipos de notificación
            </h3>
            <div className="space-y-4">
              {[
                { key: 'likes', label: 'Likes en mis publicaciones', icon: Heart },
                { key: 'comentarios', label: 'Comentarios en mis publicaciones', icon: MessageCircle },
                { key: 'compartidos', label: 'Cuando comparten mis publicaciones', icon: Share },
                { key: 'nuevosSeguidores', label: 'Nuevos seguidores', icon: UserPlus },
                { key: 'mensajes', label: 'Mensajes directos', icon: MessageCircle },
                { key: 'eventos', label: 'Eventos de mis grupos', icon: Calendar },
                { key: 'ofertas', label: 'Nuevas ofertas de trabajo', icon: Briefcase },
                { key: 'gruposActividad', label: 'Actividad en mis grupos', icon: Users },
                { key: 'gruposInvitaciones', label: 'Invitaciones a grupos', icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config[key as keyof ConfiguracionNotificaciones] as boolean}
                      onChange={(e) => actualizarConfig(key as keyof ConfiguracionNotificaciones, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Canales de notificación */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Canales de notificación
            </h3>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Notificaciones por email' },
                { key: 'push', label: 'Notificaciones push del navegador' },
                { key: 'sonido', label: 'Sonido de notificaciones' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config[key as keyof ConfiguracionNotificaciones] as boolean}
                      onChange={(e) => actualizarConfig(key as keyof ConfiguracionNotificaciones, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Boton
              variante="secundario"
              onClick={onCerrar}
            >
              Cancelar
            </Boton>
            <Boton
              variante="primario"
              onClick={manejarGuardar}
              disabled={cargando}
              cargando={cargando}
            >
              Guardar
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para gestionar notificaciones
export const useNotificaciones = (usuario: Usuario) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificaciones>({
    likes: true,
    comentarios: true,
    compartidos: true,
    nuevosSeguidores: true,
    mensajes: true,
    eventos: true,
    ofertas: true,
    gruposActividad: true,
    gruposInvitaciones: true,
    email: false,
    push: true,
    sonido: true
  });
  const [toasts, setToasts] = useState<Notificacion[]>([]);

  // Simular carga de notificaciones
  useEffect(() => {
    // Aquí cargarías las notificaciones desde la API
    const notificacionesEjemplo: Notificacion[] = [
      {
        id: '1',
        usuarioId: usuario.id,
        tipo: 'reaccion-post',
        titulo: 'Nueva reacción',
        mensaje: 'A Maria García le gusta tu publicación sobre oposiciones.',
        leida: false,
        fechaCreacion: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        datos: { postId: 'post1', autorId: 'user2' }
      },
      {
        id: '2',
        usuarioId: usuario.id,
        tipo: 'comentario-post',
        titulo: 'Nuevo comentario',
        mensaje: 'Juan Pérez comentó en tu publicación.',
        leida: false,
        fechaCreacion: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        datos: { postId: 'post1', comentarioId: 'comment1' }
      },
      {
        id: '3',
        usuarioId: usuario.id,
        tipo: 'post-grupo',
        titulo: 'Nueva actividad en grupo',
        mensaje: 'Hay 3 nuevas publicaciones en "Oposiciones Educación".',
        leida: true,
        fechaCreacion: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        datos: { grupoId: 'grupo1', nuevasPublicaciones: 3 }
      }
    ];
    setNotificaciones(notificacionesEjemplo);
  }, [usuario.id]);

  const marcarLeida = async (notificacionId: string) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
    );
  };

  const marcarTodasLeidas = async () => {
    setNotificaciones(prev => 
      prev.map(n => ({ ...n, leida: true }))
    );
  };

  const eliminarNotificacion = async (notificacionId: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
  };

  const actualizarConfiguracion = async (nuevaConfig: ConfiguracionNotificaciones) => {
    setConfiguracion(nuevaConfig);
  };

  const mostrarToast = (notificacion: Notificacion) => {
    setToasts(prev => [...prev, notificacion]);
  };

  const cerrarToast = (notificacionId: string) => {
    setToasts(prev => prev.filter(n => n.id !== notificacionId));
  };

  const noLeidasCount = notificaciones.filter(n => !n.leida).length;

  return {
    notificaciones,
    configuracion,
    toasts,
    noLeidasCount,
    marcarLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
    actualizarConfiguracion,
    mostrarToast,
    cerrarToast
  };
};

// Componente principal que engloba todo
export const SistemaNotificaciones: React.FC<PropiedadesSistemaNotificaciones> = ({
  usuario,
  notificaciones,
  onMarcarLeida,
  onMarcarTodasLeidas,
  onEliminarNotificacion,
  onActualizarConfiguracion,
  configuracion
}) => {
  const [centroAbierto, setCentroAbierto] = useState(false);
  const [configuracionAbierta, setConfiguracionAbierta] = useState(false);
  const [toasts, setToasts] = useState<Notificacion[]>([]);

  const noLeidasCount = notificaciones.filter(n => !n.leida).length;

  const cerrarToast = (notificacionId: string) => {
    setToasts(prev => prev.filter(n => n.id !== notificacionId));
  };

  return (
    <>
      {/* Botón de notificaciones en el header */}
      <button
        onClick={() => setCentroAbierto(true)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {noLeidasCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {noLeidasCount > 99 ? '99+' : noLeidasCount}
          </span>
        )}
      </button>

      {/* Centro de notificaciones */}
      <CentroNotificaciones
        abierto={centroAbierto}
        onCerrar={() => setCentroAbierto(false)}
        usuario={usuario}
        notificaciones={notificaciones}
        onMarcarLeida={onMarcarLeida}
        onMarcarTodasLeidas={onMarcarTodasLeidas}
        onEliminarNotificacion={onEliminarNotificacion}
      />

      {/* Configuración de notificaciones */}
      <ConfiguracionNotificaciones
        abierto={configuracionAbierta}
        onCerrar={() => setConfiguracionAbierta(false)}
        configuracion={configuracion}
        onActualizar={onActualizarConfiguracion}
      />

      {/* Toasts de notificaciones */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notificacion={toast}
            onCerrar={() => cerrarToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};

export default SistemaNotificaciones;