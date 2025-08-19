'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, MessageCircle, Users, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { useComunidad, useTema } from '../../../../hooks/useComunidad';
import { Post, Usuario, Grupo, EventoPost } from '../../../../tipos/redSocial';
import TarjetaPost from './TarjetaPost';
import CrearPost from './CrearPost';
import Feed from './Feed';

// Interfaz para las propiedades del componente
export interface PropiedadesDashboardPrincipal {
  usuario: Usuario;
  posts: Post[];
  grupos: Grupo[];
  eventos: EventoPost[];
  usuarios: Usuario[];
  onCrearPost: (post: Partial<Post>) => Promise<void>;
  onLikePost: (id: string) => Promise<void>;
  onComentarPost: (id: string, comentario: string) => Promise<void>;
  onCompartirPost: (id: string) => Promise<void>;
  onSeguirUsuario: (id: string) => Promise<void>;
  onUnirseGrupo: (id: string) => Promise<void>;
}

// Widget de perfil rápido
const WidgetPerfilRapido: React.FC<{ usuario: Usuario }> = ({ usuario }) => {
  const { configuracion } = useComunidad();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4">
        <img
          src={usuario.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre + ' ' + usuario.apellidos)}&background=random`}
          alt={`${usuario.nombre} ${usuario.apellidos}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {usuario.nombre} {usuario.apellidos}
          </h3>
          <p className="text-sm text-gray-600">{usuario.perfil?.cargo || usuario.tipo}</p>
          <p className="text-xs text-gray-500">{usuario.perfil?.ubicacion || configuracion.nombre}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">{usuario.estadisticas?.conexiones || 0}</p>
            <p className="text-xs text-gray-500">Conexiones</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{usuario.estadisticas?.postsCreados || 0}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Widget de acceso rápido
const WidgetAccesoRapido: React.FC<{ notificacionesPendientes: number }> = ({ notificacionesPendientes }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
      <div className="space-y-3">
        <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
          <MessageCircle size={20} className="text-blue-600" />
          <span className="text-sm text-gray-700">Mensajes</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
          <Bell size={20} className="text-orange-600" />
          <span className="text-sm text-gray-700">Notificaciones</span>
          {notificacionesPendientes > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notificacionesPendientes}
            </span>
          )}
        </button>
        <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
          <Users size={20} className="text-green-600" />
          <span className="text-sm text-gray-700">Mis Grupos</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg">
          <Calendar size={20} className="text-purple-600" />
          <span className="text-sm text-gray-700">Eventos</span>
        </button>
      </div>
    </div>
  );
};

export const DashboardPrincipal: React.FC<PropiedadesDashboardPrincipal> = ({
  usuario,
  posts,
  grupos,
  eventos,
  usuarios,
  onCrearPost,
  onLikePost,
  onComentarPost,
  onCompartirPost,
  onSeguirUsuario,
  onUnirseGrupo
}) => {
  const { configuracion } = useComunidad();
  const { colores } = useTema();

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* === COLUMNA IZQUIERDA === */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <WidgetPerfilRapido usuario={usuario} />
          <WidgetAccesoRapido notificacionesPendientes={5} />
        </div>
      </div>

      {/* === Feed principal === */}
      <div className="lg:col-span-2">
        <Feed 
          titulo={`Feed de ${configuracion.nombre}`}
          mostrarCrearPost={true}
          filtroTipo="todos"
        />
      </div>

      {/* === Sidebar derecho === */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          {/* Grupos sugeridos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Grupos Sugeridos</h3>
            <div className="space-y-3">
              {grupos.slice(0, 3).map(grupo => (
                <div key={grupo.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{grupo.nombre}</p>
                      <p className="text-xs text-gray-500">{grupo.estadisticas?.totalMiembros || 0} miembros</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onUnirseGrupo(grupo.id)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700"
                  >
                    Unirse
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos eventos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
            <div className="space-y-3">
              {eventos.slice(0, 2).map((evento, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">{evento.titulo}</h4>
                  <p className="text-xs text-gray-500">{evento.fechaInicio?.toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{evento.ubicacion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default DashboardPrincipal;
