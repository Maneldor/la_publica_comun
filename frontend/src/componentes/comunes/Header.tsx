// src/componentes/comunes/Header.tsx (Versión simplificada)

import {
  Bell,
  Bookmark,
  ChevronDown,
  Globe,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useComunidad, useIdioma } from '../../../hooks/useComunidad';
import { Boton } from './especificos-comunidad/ui/Boton';

export interface PropiedadesHeader {
  usuario?: {
    nombre: string;
    apellidos: string;
    email: string;
    tipo:
      | 'admin-web'
      | 'gestor-empresas'
      | 'gestor-administraciones'
      | 'administrador-grupo'
      | 'empresa'
      | 'administracion'
      | 'sindicato'
      | 'miembro';
    avatar?: string;
    verificado?: boolean;
  };
  mostrarBusqueda?: boolean;
  mostrarNotificaciones?: boolean;
  notificacionesPendientes?: number;
  onBuscar?: (termino: string) => void;
  onCerrarSesion?: () => void;
  onCrearPost?: () => void;
}

export const Header: React.FC<PropiedadesHeader> = ({
  usuario,
  mostrarBusqueda = true,
  mostrarNotificaciones = true,
  notificacionesPendientes = 0,
  onBuscar,
  onCerrarSesion,
  onCrearPost,
}) => {
  const { configuracion } = useComunidad();
  const { idioma, idiomasDisponibles, alternarIdioma } = useIdioma();

  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const cerrarMenus = () => setMenuUsuarioAbierto(false);
    document.addEventListener('click', cerrarMenus);
    return () => document.removeEventListener('click', cerrarMenus);
  }, []);

  const enlacesUsuario = [
    { nombre: 'Mi Perfil', href: '/perfil', icono: <User size={16} /> },
    { nombre: 'Mis Grupos', href: '/mis-grupos', icono: <Users size={16} /> },
    { nombre: 'Guardados', href: '/guardados', icono: <Bookmark size={16} /> },
    { nombre: 'Mensajes', href: '/mensajes', icono: <MessageCircle size={16} /> },
    { nombre: 'Configuración', href: '/configuracion', icono: <Settings size={16} /> },
  ];

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBuscar && terminoBusqueda.trim()) {
      onBuscar(terminoBusqueda.trim());
    }
  };

  const obtenerNombreCompleto = () => {
    if (!usuario) return '';
    return `${usuario.nombre} ${usuario.apellidos}`.trim();
  };

  const obtenerTipoUsuarioTexto = () => {
    // Tu función switch para el tipo de usuario se mantiene igual
    return 'Miembro';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal ahora alinea todo a la derecha */}
        <div className="flex justify-end items-center h-16">
          {/* SECCIÓN DERECHA: Búsqueda, Acciones y Perfil */}
          <div className="flex items-center space-x-3">
            {mostrarBusqueda && (
              <form onSubmit={manejarBusqueda} className="hidden lg:block">
                <div className="relative">
                  <input
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    placeholder="Buscar..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-transparent outline-none transition-all duration-200"
                    style={
                      {
                        '--focus-ring-color': configuracion.tema.colorPrimario + '40',
                      } as React.CSSProperties
                    }
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            )}

            {usuario && onCrearPost && (
              <Boton
                variante="primario"
                tamaño="sm"
                icono={<Plus size={16} />}
                onClick={onCrearPost}
                className="hidden sm:flex"
              >
                Crear
              </Boton>
            )}

            {idiomasDisponibles.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alternarIdioma();
                }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                title="Cambiar idioma"
              >
                <Globe size={18} className="mr-1" />
                <span className="uppercase">{idioma}</span>
              </button>
            )}

            {mostrarNotificaciones && usuario && (
              <button
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                title="Notificaciones"
              >
                <Bell size={20} />
                {notificacionesPendientes > 0 && (
                  <span
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full"
                    style={{ backgroundColor: configuracion.tema.colorPrimario }}
                  >
                    {notificacionesPendientes > 99 ? '99+' : notificacionesPendientes}
                  </span>
                )}
              </button>
            )}

            {usuario ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuUsuarioAbierto(!menuUsuarioAbierto);
                  }}
                  className="flex items-center max-w-xs text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={
                    {
                      '--focus-ring-color': configuracion.tema.colorPrimario,
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-md">
                    <div className="relative">
                      {usuario.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={usuario.avatar}
                          alt={obtenerNombreCompleto()}
                        />
                      ) : (
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: configuracion.tema.colorPrimario }}
                        >
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {usuario.verificado && (
                        <div
                          className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ backgroundColor: configuracion.tema.colorPrimario }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{obtenerNombreCompleto()}</p>
                      <p className="text-xs text-gray-500">{obtenerTipoUsuarioTexto()}</p>
                    </div>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </button>

                {menuUsuarioAbierto && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    {/* El contenido del menú desplegable se mantiene igual */}
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {obtenerNombreCompleto()}
                        </p>
                        <p className="text-sm text-gray-500">{usuario.email}</p>
                      </div>
                      {enlacesUsuario.map((enlace) => (
                        <a
                          key={enlace.nombre}
                          href={enlace.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="mr-3">{enlace.icono}</span>
                          {enlace.nombre}
                        </a>
                      ))}
                      <hr className="my-1" />
                      <button
                        onClick={onCerrarSesion}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Boton variante="ghost" tamaño="sm">
                  Iniciar Sesión
                </Boton>
                <Boton variante="primario" tamaño="sm">
                  Registrarse
                </Boton>
              </div>
            )}

            {/* El botón de menú móvil sigue siendo útil para mostrar la búsqueda en pantallas pequeñas */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuMovilAbierto(!menuMovilAbierto);
              }}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-50"
            >
              {menuMovilAbierto ? <X size={24} /> : <Search size={24} />}
            </button>
          </div>
        </div>

        {/* Búsqueda móvil */}
        {menuMovilAbierto && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {mostrarBusqueda && (
              <div className="px-4">
                <form onSubmit={manejarBusqueda}>
                  {/* ... tu formulario de búsqueda móvil ... */}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
